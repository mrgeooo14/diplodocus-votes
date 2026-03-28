import { useEffect, useMemo, useRef, useState } from 'react';
import { ISO3_TO_ISO2, iso3ToName } from '../../lib/countryIso';
import { G20_MEMBERS } from '../../lib/groupAlignment';
import { CountryFlag } from '../CountryFlag';
import { useFilterStore } from '../../store/filterStore';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface CountryPickerModalProps {
  onSelect: (iso3: string) => void;
  onClose: () => void;
}

interface CountryItem {
  iso3: string;
  name: string;
}

function CountryRow({
  iso3,
  name,
  selected,
  onSelect,
}: {
  iso3: string;
  name: string;
  selected: boolean;
  onSelect: (iso3: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(iso3)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '6px 20px',
        background: selected ? 'rgba(6,182,212,0.12)' : 'none',
        border: 'none',
        borderLeft: selected ? '3px solid #06b6d4' : '3px solid transparent',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <CountryFlag iso3={iso3} size={18} title={name} />
      <span style={{ fontSize: 13, color: selected ? '#06b6d4' : '#c9d1d9' }}>{name}</span>
    </button>
  );
}

export function CountryPickerModal({ onSelect, onClose }: CountryPickerModalProps) {
  const { compareCountry } = useFilterStore();
  const [query, setQuery] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const { g20, rest } = useMemo(() => {
    const g20Set = new Set<string>(G20_MEMBERS);
    const g20: CountryItem[] = Array.from(G20_MEMBERS).map(iso3 => ({
      iso3,
      name: iso3ToName(iso3),
    }));
    const rest: CountryItem[] = Object.keys(ISO3_TO_ISO2)
      .filter(iso3 => !g20Set.has(iso3))
      .map(iso3 => ({ iso3, name: iso3ToName(iso3) }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return { g20, rest };
  }, []);

  const q = query.toLowerCase();
  const filteredG20 = q ? g20.filter(c => c.name.toLowerCase().includes(q) || c.iso3.toLowerCase().includes(q)) : g20;
  const filteredRest = q ? rest.filter(c => c.name.toLowerCase().includes(q) || c.iso3.toLowerCase().includes(q)) : rest;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.65)',
      }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="country-picker-title"
        style={{
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: 12,
          width: 400,
          maxHeight: '82vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 20px 12px',
            borderBottom: '1px solid #30363d',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <p
            id="country-picker-title"
            style={{
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#9eaab6',
            }}
          >
            Compare to Country
          </p>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              color: '#9eaab6',
              cursor: 'pointer',
              fontSize: 18,
              lineHeight: 1,
              padding: 2,
            }}
          >
            ×
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '10px 20px 8px', flexShrink: 0 }}>
          <input
            autoFocus
            aria-label="Search countries"
            placeholder="Search countries…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: '100%',
              background: '#0d1117',
              border: '1px solid #30363d',
              borderRadius: 6,
              padding: '6px 10px',
              fontSize: 12,
              color: '#e6edf3',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* List */}
        <div style={{ overflowY: 'auto', flex: 1, paddingBottom: 8 }}>
          {filteredG20.length > 0 && (
            <>
              <p
                style={{
                  padding: '6px 20px 4px',
                  fontSize: 10,
                  color: '#8b949e',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                G20
              </p>
              {filteredG20.map(c => (
                <CountryRow
                  key={c.iso3}
                  iso3={c.iso3}
                  name={c.name}
                  selected={compareCountry === c.iso3}
                  onSelect={onSelect}
                />
              ))}
            </>
          )}
          {filteredRest.length > 0 && (
            <>
              <p
                style={{
                  padding: '10px 20px 4px',
                  fontSize: 10,
                  color: '#8b949e',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  borderTop: filteredG20.length > 0 ? '1px solid #30363d' : 'none',
                  marginTop: filteredG20.length > 0 ? 6 : 0,
                }}
              >
                All Countries
              </p>
              {filteredRest.map(c => (
                <CountryRow
                  key={c.iso3}
                  iso3={c.iso3}
                  name={c.name}
                  selected={compareCountry === c.iso3}
                  onSelect={onSelect}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
