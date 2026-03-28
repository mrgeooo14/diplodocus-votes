import { useState } from 'react';
import { useFilterStore } from '../../store/filterStore';
import { CountryPickerModal } from './CountryPickerModal';
import { iso3ToName } from '../../lib/countryIso';

const glassBase: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 9,
  padding: '8px 16px',
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  transition: 'background 0.15s, border-color 0.15s, color 0.15s',
  whiteSpace: 'nowrap' as const,
  letterSpacing: '0.01em',
};

export function MapModeBar() {
  const { mapColorMode, compareCountry, setMapColorMode, setCompareCountry } = useFilterStore();
  const [pickerOpen, setPickerOpen] = useState(false);

  function handleUsChina() {
    if (mapColorMode === 'us-china') {
      setMapColorMode('default');
    } else {
      setCompareCountry(null);
      setMapColorMode('us-china');
    }
  }

  function handleCountry() {
    if (mapColorMode === 'country') {
      setMapColorMode('default');
      setCompareCountry(null);
    } else {
      setPickerOpen(true);
    }
  }

  const usChinaActive = mapColorMode === 'us-china';
  const countryActive = mapColorMode === 'country';
  const countryLabel = countryActive && compareCountry
    ? `vs ${iso3ToName(compareCountry)}`
    : 'vs Country ▾';

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 10,
          display: 'flex',
          gap: 8,
        }}
      >
        <button
          onClick={handleUsChina}
          aria-pressed={usChinaActive}
          style={{
            ...glassBase,
            background: usChinaActive ? 'rgba(56,189,248,0.18)' : 'rgba(0,0,0,0.42)',
            borderColor: usChinaActive ? '#38bdf8' : 'rgba(255,255,255,0.12)',
            color: usChinaActive ? '#38bdf8' : '#c9d1d9',
          }}
        >
          USA vs China
        </button>

        <button
          onClick={handleCountry}
          aria-pressed={countryActive}
          style={{
            ...glassBase,
            background: countryActive ? 'rgba(6,182,212,0.18)' : 'rgba(0,0,0,0.42)',
            borderColor: countryActive ? '#06b6d4' : 'rgba(255,255,255,0.12)',
            color: countryActive ? '#06b6d4' : '#c9d1d9',
          }}
        >
          {countryLabel}
        </button>
      </div>

      {pickerOpen && (
        <CountryPickerModal
          onSelect={iso3 => {
            setCompareCountry(iso3);
            setMapColorMode('country');
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </>
  );
}
