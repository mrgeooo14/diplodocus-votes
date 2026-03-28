import { useEffect } from 'react';
import { CountryFlag } from '../CountryFlag';
import type { VoteValue } from '../../lib/types';

export interface AlignmentPosition {
  iso3: string;
  position: number | null;
  vote?: VoteValue;
}

interface AlignmentModalProps {
  groupName: string;
  alignment: number;
  positions: AlignmentPosition[];
  labels: Record<string, string>;
  onClose: () => void;
}

const ICON_SIZE = 22;
const ICON_RADIUS = ICON_SIZE / 2;
const OVERLAP_THRESHOLD = 0.03;

function AlignmentScore({ value }: { value: number }) {
  const hue = Math.round(value * 120);
  return (
    <span style={{ color: `hsl(${hue}, 80%, 55%)`, fontVariantNumeric: 'tabular-nums' }}>
      {value.toFixed(2)}
    </span>
  );
}

function LargeScatterAxis({ positions, labels }: { positions: AlignmentPosition[]; labels: Record<string, string> }) {
  const visible = positions.filter(p => p.position !== null);
  const sorted = [...visible].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  const rowAssigned: { p: AlignmentPosition; row: number }[] = [];
  for (const p of sorted) {
    let row = 0;
    while (
      rowAssigned.some(
        placed =>
          placed.row === row &&
          Math.abs((placed.p.position ?? 0) - (p.position ?? 0)) < OVERLAP_THRESHOLD,
      )
    ) {
      row++;
    }
    rowAssigned.push({ p, row });
  }

  const maxRow = Math.max(0, ...rowAssigned.map(r => r.row));
  const axisHeight = 10;
  const rowSpacing = ICON_SIZE + 5;
  const totalHeight = axisHeight + (maxRow + 1) * rowSpacing + 6;

  return (
    <div style={{ position: 'relative', height: totalHeight, marginTop: 8 }}>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: axisHeight,
          borderRadius: 5,
          background: 'linear-gradient(to right, #ef4444 0%, #6b7280 50%, #22c55e 100%)',
          opacity: 0.65,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: axisHeight + 3,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}
      >
        <span style={{ fontSize: 10, color: '#8b949e' }}>No</span>
        <span style={{ fontSize: 10, color: '#8b949e' }}>Abstain</span>
        <span style={{ fontSize: 10, color: '#8b949e' }}>Yes</span>
      </div>
      {rowAssigned.map(({ p, row }) => {
        const x = `calc(${(p.position ?? 0) * 100}% - ${ICON_RADIUS}px)`;
        const bottom = axisHeight + row * rowSpacing + 3;
        return (
          <div
            key={p.iso3}
            style={{
              position: 'absolute',
              left: x,
              bottom,
              width: ICON_SIZE,
              height: ICON_SIZE,
              borderRadius: '50%',
              boxShadow: '0 0 0 2px #161b22',
              transition: 'left 0.5s ease, bottom 0.3s ease',
            }}
          >
            <CountryFlag iso3={p.iso3} size={ICON_SIZE} title={labels[p.iso3] ?? p.iso3} />
          </div>
        );
      })}
    </div>
  );
}

function VoteBadge({ vote }: { vote: VoteValue }) {
  const map: Record<string, { label: string; color: string }> = {
    Y: { label: 'Yes', color: '#22c55e' },
    N: { label: 'No', color: '#ef4444' },
    A: { label: 'Abstain', color: '#eab308' },
    X: { label: 'N/V', color: '#4b5563' },
  };
  const { label, color } = map[vote] ?? { label: vote, color: '#8b949e' };
  return (
    <span style={{ fontSize: 10, color, fontWeight: 600, minWidth: 42, textAlign: 'right' }}>
      {label}
    </span>
  );
}

function CountryList({ positions, labels }: { positions: AlignmentPosition[]; labels: Record<string, string> }) {
  const isResolution = positions.some(p => p.vote !== undefined);

  const sorted = [...positions].sort((a, b) => {
    if (a.position === null && b.position === null) return 0;
    if (a.position === null) return 1;
    if (b.position === null) return -1;
    return b.position - a.position;
  });

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '2px 16px',
        maxHeight: 400,
        overflowY: 'auto',
        paddingRight: 4,
      }}
    >
      {sorted.map(p => {
        const name = labels[p.iso3] ?? p.iso3;
        const pct = p.position !== null ? p.position * 100 : null;
        const hue = p.position !== null ? Math.round(p.position * 120) : null;
        const color = hue !== null ? `hsl(${hue}, 70%, 55%)` : '#4b5563';
        return (
          <div
            key={p.iso3}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '3px 0',
            }}
          >
            <CountryFlag iso3={p.iso3} size={16} title={name} />
            <span style={{ flex: 1, fontSize: 11, color: '#c9d1d9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {name}
            </span>
            {isResolution && p.vote ? (
              <VoteBadge vote={p.vote} />
            ) : pct !== null ? (
              <span style={{ fontSize: 10, color, fontVariantNumeric: 'tabular-nums', minWidth: 32, textAlign: 'right' }}>
                {pct.toFixed(0)}%
              </span>
            ) : (
              <span style={{ fontSize: 10, color: '#4b5563', minWidth: 32, textAlign: 'right' }}>N/V</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function AlignmentModal({ groupName, alignment, positions, labels, onClose }: AlignmentModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

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
        style={{
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: 12,
          padding: '20px 24px',
          width: '100%',
          maxWidth: 1300,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8b949e' }}>
            {groupName}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#8b949e' }}>
              Alignment: <AlignmentScore value={alignment} />
            </span>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 2 }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Large axis */}
        <LargeScatterAxis positions={positions} labels={labels} />

        {/* Divider */}
        <div style={{ borderTop: '1px solid #30363d', margin: '16px 0' }} />

        {/* Country list */}
        <CountryList positions={positions} labels={labels} />
      </div>
    </div>
  );
}
