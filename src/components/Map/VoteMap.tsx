import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMap, { Source, Layer } from 'react-map-gl/maplibre';
import type { MapMouseEvent, MapRef, FillLayerSpecification, LineLayerSpecification } from 'react-map-gl/maplibre';
import type { StyleSpecification } from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import 'maplibre-gl/dist/maplibre-gl.css';

import { useVoteData } from '../../hooks/useVoteData';
import { useFilterStore } from '../../store/filterStore';
import { CountryTooltip } from './CountryTooltip';
import { MapLegend } from './MapLegend';
import { MapModeBar } from './MapModeBar';
import { NO_DATA_COLOR } from '../../lib/colors';

const MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#0a1628' } }],
};

// Paint uses feature-state so the GeoJSON source never needs to be rebuilt on color change.
const FILL_LAYER: Omit<FillLayerSpecification, 'source'> = {
  id: 'country-fill',
  type: 'fill',
  paint: {
    'fill-color': ['coalesce', ['feature-state', 'fillColor'], NO_DATA_COLOR] as unknown as NonNullable<FillLayerSpecification['paint']>['fill-color'],
    'fill-opacity': 0.9,
  },
};

const OUTLINE_LAYER: Omit<LineLayerSpecification, 'source'> = {
  id: 'country-outline',
  type: 'line',
  paint: { 'line-color': '#1a2535', 'line-width': 0.6 },
};

function extractIso3(props: Record<string, unknown>): string {
  const rawIso = props['ISO_A3'] as string | undefined;
  if (rawIso && rawIso !== '-99') return rawIso;
  return (
    (props['ISO_A3_EH'] as string | undefined) ??
    (props['ADM0_A3'] as string | undefined) ??
    ''
  );
}

interface HoverState {
  featureId: number | string | undefined;
  iso3: string;
  name: string;
}

export function VoteMap() {
  const mapRef = useRef<MapRef>(null);
  const { countryColors, countryVoteInfo, comparisonStats, loading } = useVoteData();
  const { body, mapColorMode, compareCountry } = useFilterStore();
  const [baseGeo, setBaseGeo] = useState<FeatureCollection | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [hover, setHover] = useState<HoverState | null>(null);

  // iso3 → feature index map (generateId assigns IDs as array indices)
  const iso3ToIdRef = useRef<Map<string, number>>(new Map());
  // Tooltip DOM ref for direct position updates (avoids setState on every pixel)
  const tooltipRef = useRef<HTMLDivElement>(null);
  // Track last hovered iso3 to avoid setState on same-country moves
  const prevIso3Ref = useRef<string | null>(null);
  // Latest mouse position — read on render so initial tooltip placement is correct
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    fetch('/data/geo/countries.geojson')
      .then(r => r.json())
      .then((data: FeatureCollection) => {
        const idMap = new Map<string, number>();
        data.features.forEach((f, idx) => {
          const iso3 = extractIso3((f.properties ?? {}) as Record<string, unknown>);
          if (iso3) idMap.set(iso3, idx);
        });
        iso3ToIdRef.current = idMap;
        setBaseGeo(data);
      });
  }, []);

  // Apply colors via feature state — no GeoJSON rebuild on filter change
  useEffect(() => {
    if (!mapReady || !baseGeo) return;
    const map = mapRef.current?.getMap();
    if (!map) return;

    const iso3ToId = iso3ToIdRef.current;

    // Clear all feature state, then re-apply current colors
    map.removeFeatureState({ source: 'countries' });
    for (const [iso3, color] of Object.entries(countryColors)) {
      const id = iso3ToId.get(iso3);
      if (id !== undefined) {
        map.setFeatureState({ source: 'countries', id }, { fillColor: color });
      }
    }
  }, [countryColors, mapReady, baseGeo]);

  const onMouseMove = useCallback((e: MapMouseEvent & { features?: unknown[] }) => {
    const feature = (e.features as Array<{ id?: number | string; properties?: Record<string, unknown> }> | undefined)?.[0];

    if (feature) {
      // Always track position in ref (used for initial render on country entry)
      posRef.current = { x: e.point.x, y: e.point.y };
      // Update tooltip position directly in the DOM — no React re-render for position
      if (tooltipRef.current) {
        tooltipRef.current.style.left = `${e.point.x + 14}px`;
        tooltipRef.current.style.top = `${e.point.y - 10}px`;
      }

      const iso3 = String(feature.properties?.['iso3'] ?? extractIso3(feature.properties ?? {}));

      if (iso3 !== prevIso3Ref.current) {
        prevIso3Ref.current = iso3;
        mapRef.current?.getMap().getCanvas().style.setProperty('cursor', 'pointer');
        setHover({
          featureId: feature.id,
          iso3,
          name: String(feature.properties?.['NAME'] ?? feature.properties?.['ADMIN'] ?? ''),
        });
      }
    } else {
      if (prevIso3Ref.current !== null) {
        prevIso3Ref.current = null;
        mapRef.current?.getMap().getCanvas().style.setProperty('cursor', '');
        setHover(null);
      }
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    prevIso3Ref.current = null;
    setHover(null);
  }, []);

  const hoverFill = useMemo<FillLayerSpecification>(() => ({
    id: 'country-hover',
    type: 'fill',
    source: 'countries',
    filter: hover?.featureId != null ? ['==', ['id'], hover.featureId as number] : ['==', ['id'], -1],
    paint: { 'fill-color': '#ffffff', 'fill-opacity': 0.12 },
  }), [hover?.featureId]);

  return (
    <div
      className="relative h-full w-full"
      role="application"
      aria-label="Interactive world map showing UN vote data by country. Use the dashboard panel on the right for an accessible data view."
      aria-roledescription="map"
    >
      <ReactMap
        ref={mapRef}
        mapStyle={MAP_STYLE}
        initialViewState={{ longitude: 15, latitude: 15, zoom: 1.4 }}
        interactiveLayerIds={['country-fill']}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onLoad={() => setMapReady(true)}
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        {baseGeo && (
          <Source id="countries" type="geojson" data={baseGeo} generateId>
            <Layer {...FILL_LAYER} source="countries" />
            <Layer {...hoverFill} />
            <Layer {...OUTLINE_LAYER} source="countries" />
          </Source>
        )}
      </ReactMap>

      {body === 'GA' && <MapModeBar />}
      <MapLegend />

      {hover && hover.iso3 && (countryVoteInfo[hover.iso3] || comparisonStats?.[hover.iso3] || hover.iso3 === compareCountry) && (
        <CountryTooltip
          ref={tooltipRef}
          x={posRef.current.x}
          y={posRef.current.y}
          name={hover.name}
          info={countryVoteInfo[hover.iso3] ?? {}}
          comparisonStat={comparisonStats?.[hover.iso3] ?? null}
          compareCountry={mapColorMode === 'country' ? compareCountry : null}
          isReferenceCountry={mapColorMode === 'country' && hover.iso3 === compareCountry}
        />
      )}

      {loading && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute inset-0 flex items-end justify-center pb-4"
        >
          <span className="rounded-full bg-[#161b22]/80 px-3 py-1 text-xs text-[#9eaab6]">
            Loading vote data…
          </span>
        </div>
      )}
    </div>
  );
}
