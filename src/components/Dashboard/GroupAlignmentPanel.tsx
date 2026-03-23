import { useMemo, useState } from 'react';
import { useVoteData } from '../../hooks/useVoteData';
import { useFilterStore } from '../../store/filterStore';
import {
  computeGroupAlignmentResolution,
  computeGroupAlignmentAggregate,
  type GroupVotePosition,
} from '../../lib/groupAlignment';
import { CountryFlag } from '../CountryFlag';
import { AlignmentModal } from './AlignmentModal';

function AlignmentScore({ value }: { value: number }) {
  const hue = Math.round(value * 120);
  const color = `hsl(${hue}, 80%, 55%)`;
  return (
    <span style={{ color, fontVariantNumeric: 'tabular-nums' }}>
      {value.toFixed(2)}
    </span>
  );
}

const ICON_SIZE = 12;
const ICON_RADIUS = ICON_SIZE / 2;
const OVERLAP_THRESHOLD = 0.04;

function ScatterAxis({
  positions,
  labels,
}: {
  positions: GroupVotePosition[];
  labels: Record<string, string>;
}) {
  const visible = positions.filter(p => p.position !== null);

  const sorted = [...visible].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  const rowAssigned: { p: GroupVotePosition; row: number }[] = [];
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
  const axisHeight = 8;
  const rowSpacing = ICON_SIZE + 3;
  const totalHeight = axisHeight + (maxRow + 1) * rowSpacing + 4;

  return (
    <div style={{ position: 'relative', height: totalHeight, marginTop: 8 }}>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: axisHeight,
          borderRadius: 4,
          background: 'linear-gradient(to right, #ef4444 0%, #6b7280 50%, #22c55e 100%)',
          opacity: 0.6,
        }}
      />
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
      {rowAssigned.map(({ p, row }) => {
        const x = `calc(${(p.position ?? 0) * 100}% - ${ICON_RADIUS}px)`;
        const bottom = axisHeight + row * rowSpacing + 2;
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
              boxShadow: '0 0 0 1px #161b22',
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

interface GroupAlignmentPanelProps {
  groupName: string;
  members: readonly string[];
  labels: Record<string, string>;
}

export function GroupAlignmentPanel({ groupName, members, labels }: GroupAlignmentPanelProps) {
  const { countryVoteInfo, p5ResolutionVotes, loading } = useVoteData();
  const { mode } = useFilterStore();
  const [modalOpen, setModalOpen] = useState(false);

  const result = useMemo(() => {
    if (mode === 'resolution') {
      if (!p5ResolutionVotes) return null;
      return computeGroupAlignmentResolution(p5ResolutionVotes, members);
    }
    return computeGroupAlignmentAggregate(
      countryVoteInfo as Record<string, { yes: number; no: number; abstain: number }>,
      members,
    );
  }, [mode, p5ResolutionVotes, countryVoteInfo, members]);

  if (loading || !result) return null;

  return (
    <div className="px-4 pt-4 pb-2">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
          {groupName}
        </p>
        <AlignmentScore value={result.alignment} />
      </div>
      <ScatterAxis positions={result.positions} labels={labels} />
      <button
        onClick={() => setModalOpen(true)}
        className="mt-2 text-xs text-[#8b949e] transition-colors hover:text-[#e6edf3]"
      >
        View full →
      </button>
      {modalOpen && (
        <AlignmentModal
          groupName={groupName}
          alignment={result.alignment}
          positions={result.positions}
          labels={labels}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
