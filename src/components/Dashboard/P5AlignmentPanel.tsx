import { useMemo } from 'react';
import { useVoteData } from '../../hooks/useVoteData';
import { useFilterStore } from '../../store/filterStore';
import {
  computeP5AlignmentResolution,
  computeP5AlignmentAggregate,
  type P5VotePosition,
} from '../../lib/p5alignment';
import { CountryFlag } from '../CountryFlag';

const P5_LABELS: Record<string, string> = {
  USA: 'United States',
  RUS: 'Russia',
  CHN: 'China',
  GBR: 'United Kingdom',
  FRA: 'France',
};

function AlignmentScore({ value }: { value: number }) {
  // Color: red at 0, yellow at 0.5, green at 1
  const hue = Math.round(value * 120); // 0=red, 120=green
  const color = `hsl(${hue}, 80%, 55%)`;
  return (
    <span style={{ color, fontVariantNumeric: 'tabular-nums' }}>
      {value.toFixed(2)}
    </span>
  );
}

interface ScatterAxisProps {
  positions: P5VotePosition[];
}

const ICON_SIZE = 16;
const ICON_RADIUS = ICON_SIZE / 2;

function ScatterAxis({ positions }: ScatterAxisProps) {
  const visible = positions.filter(p => p.position !== null);

  // Build rows to avoid excessive horizontal overlap:
  // Sort by position, then stack icons that are within 6% of each other
  // into separate vertical rows.
  const OVERLAP_THRESHOLD = 0.06;
  const sorted = [...visible].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  // Assign row (0 = baseline, 1 = lifted, 2 = more lifted...)
  const rowAssigned: { p: P5VotePosition; row: number }[] = [];
  for (const p of sorted) {
    let row = 0;
    // Check conflicts with already-placed icons
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
  const axisHeight = 8; // gradient bar height px
  const rowSpacing = ICON_SIZE + 4;
  const totalHeight = axisHeight + (maxRow + 1) * rowSpacing + 4;

  return (
    <div style={{ position: 'relative', height: totalHeight, marginTop: 8 }}>
      {/* Gradient bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: axisHeight,
          borderRadius: 4,
          background:
            'linear-gradient(to right, #ef4444 0%, #6b7280 50%, #22c55e 100%)',
          opacity: 0.6,
        }}
      />

      {/* Tick labels */}
      <div
        style={{
          position: 'absolute',
          bottom: axisHeight + 2,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}
      >
        <span style={{ fontSize: 9, color: '#8b949e' }}>N</span>
        <span style={{ fontSize: 9, color: '#8b949e' }}>A</span>
        <span style={{ fontSize: 9, color: '#8b949e' }}>Y</span>
      </div>

      {/* Icons */}
      {rowAssigned.map(({ p, row }) => {
        const x = `calc(${(p.position ?? 0) * 100}% - ${ICON_RADIUS}px)`;
        const bottom = axisHeight + row * rowSpacing + 2;
        return (
          <div
            key={p.iso3}
            title={P5_LABELS[p.iso3] ?? p.iso3}
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
            <CountryFlag iso3={p.iso3} size={ICON_SIZE} />
          </div>
        );
      })}

      {/* Non-voting indicators */}
      {positions
        .filter(p => p.position === null)
        .map(p => (
          <div
            key={p.iso3}
            title={`${P5_LABELS[p.iso3] ?? p.iso3} — non-voting`}
            style={{
              position: 'absolute',
              right: -ICON_SIZE - 4,
              bottom: 0,
              width: ICON_SIZE,
              height: ICON_SIZE,
              opacity: 0.35,
            }}
          >
            <CountryFlag iso3={p.iso3} size={ICON_SIZE} />
          </div>
        ))}
    </div>
  );
}

export function P5AlignmentPanel() {
  const { countryVoteInfo, p5ResolutionVotes, loading } = useVoteData();
  const { mode } = useFilterStore();

  const result = useMemo(() => {
    if (mode === 'resolution') {
      if (!p5ResolutionVotes) return null;
      return computeP5AlignmentResolution(p5ResolutionVotes);
    }
    return computeP5AlignmentAggregate(
      countryVoteInfo as Record<string, { yes: number; no: number; abstain: number }>,
    );
  }, [mode, p5ResolutionVotes, countryVoteInfo]);

  if (loading || !result) return null;

  return (
    <div className="px-4 pt-4 pb-2">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
          P5 Alignment
        </p>
        <AlignmentScore value={result.alignment} />
      </div>
      <ScatterAxis positions={result.positions} />
    </div>
  );
}
