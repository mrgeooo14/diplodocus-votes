import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import type { MapMouseEvent, MapRef, FillLayerSpecification, LineLayerSpecification } from 'react-map-gl/maplibre';
import type { StyleSpecification } from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import 'maplibre-gl/dist/maplibre-gl.css';

import { useVoteData } from '../../hooks/useVoteData';
import { CountryTooltip } from './CountryTooltip';
import { MapLegend } from './MapLegend';
import { NO_DATA_COLOR } from '../../lib/colors';

const MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#0a1628' } }],
};

const FILL_LAYER: Omit<FillLayerSpecification, 'source'> = {
  id: 'country-fill',
  type: 'fill',
  paint: {
    'fill-color': ['coalesce', ['get', 'fillColor'], NO_DATA_COLOR] as FillLayerSpecification['paint']['fill-color'],
    'fill-opacity': 0.9,
  },
};

const OUTLINE_LAYER: Omit<LineLayerSpecification, 'source'> = {
  id: 'country-outline',
  type: 'line',
  paint: { 'line-color': '#1a2535', 'line-width': 0.6 },
};

interface HoverState {
  featureId: number | string | undefined;
  x: number;
  y: number;
  iso3: string;
  name: string;
}

export function VoteMap() {
  const mapRef = useRef<MapRef>(null);
  const { countryColors, countryVoteInfo, loading } = useVoteData();
  const [baseGeo, setBaseGeo] = useState<FeatureCollection | null>(null);
  const [hover, setHover] = useState<HoverState | null>(null);

  useEffect(() => {
    fetch('/data/geo/countries.geojson')
      .then(r => r.json())
      .then(data => setBaseGeo(data as FeatureCollection));
  }, []);

  const coloredGeo = useMemo<FeatureCollection | null>(() => {
    if (!baseGeo) return null;
    return {
      ...baseGeo,
      features: baseGeo.features.map(f => {
        const props = f.properties ?? {};
        const rawIso = props['ISO_A3'] as string | undefined;
        const iso3 =
          rawIso && rawIso !== '-99'
            ? rawIso
            : ((props['ISO_A3_EH'] as string | undefined) ?? (props['ADM0_A3'] as string | undefined) ?? '');
        return {
          ...f,
          properties: {
            ...props,
            iso3,
            fillColor: countryColors[iso3] ?? NO_DATA_COLOR,
          },
        };
      }),
    };
  }, [baseGeo, countryColors]);

  const onMouseMove = useCallback((e: MapMouseEvent & { features?: unknown[] }) => {
    const feature = (e.features as Array<{ id?: number | string; properties?: Record<string, unknown> }> | undefined)?.[0];
    if (feature) {
      mapRef.current?.getMap().getCanvas().style.setProperty('cursor', 'pointer');
      setHover({
        featureId: feature.id,
        x: e.point.x,
        y: e.point.y,
        iso3: String(feature.properties?.['iso3'] ?? ''),
        name: String(feature.properties?.['NAME'] ?? feature.properties?.['ADMIN'] ?? ''),
      });
    } else {
      mapRef.current?.getMap().getCanvas().style.setProperty('cursor', '');
      setHover(null);
    }
  }, []);

  const hoverFill: FillLayerSpecification = {
    id: 'country-hover',
    type: 'fill',
    source: 'countries',
    filter: hover?.featureId != null ? ['==', ['id'], hover.featureId as number] : ['==', ['id'], -1],
    paint: { 'fill-color': '#ffffff', 'fill-opacity': 0.12 },
  };

  return (
    <div className="relative h-full w-full">
      <Map
        ref={mapRef}
        mapStyle={MAP_STYLE}
        initialViewState={{ longitude: 15, latitude: 15, zoom: 1.4 }}
        interactiveLayerIds={['country-fill']}
        onMouseMove={onMouseMove}
        onMouseLeave={() => setHover(null)}
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        {coloredGeo && (
          <Source id="countries" type="geojson" data={coloredGeo} generateId>
            <Layer {...FILL_LAYER} source="countries" />
            <Layer {...hoverFill} />
            <Layer {...OUTLINE_LAYER} source="countries" />
          </Source>
        )}
      </Map>

      <MapLegend />

      {hover && hover.iso3 && countryVoteInfo[hover.iso3] && (
        <CountryTooltip
          x={hover.x}
          y={hover.y}
          name={hover.name}
          info={countryVoteInfo[hover.iso3]}
        />
      )}

      {loading && (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-4">
          <span className="rounded-full bg-[#161b22]/80 px-3 py-1 text-xs text-[#8b949e]">
            Loading vote data…
          </span>
        </div>
      )}
    </div>
  );
}
