import { useState } from 'react';
import { useVetoData, type VetoMemberKey } from '../../hooks/useVetoData';
import { useFilterStore } from '../../store/filterStore';
import { VETO_SUMMARIES } from '../../lib/vetoSummaries';
import type { ScVeto } from '../../lib/types';

const P5_MEMBERS: { key: VetoMemberKey; label: string; color: string }[] = [
  { key: 'russian_federation_ussr', label: 'Russia',         color: '#eab308' },
  { key: 'united_states',           label: 'United States',  color: '#60a5fa' },
  { key: 'united_kingdom',          label: 'United Kingdom', color: '#9ca3af' },
  { key: 'china',                   label: 'China',          color: '#f87171' },
  { key: 'france',                  label: 'France',         color: '#2dd4bf' },
];

const R = 38;
const SW = 15;
const SIZE = 110;
const CX = SIZE / 2;
const CY = SIZE / 2;
const C = 2 * Math.PI * R;

interface Segment {
  key: VetoMemberKey;
  label: string;
  color: string;
  count: number;
  frac: number;
  startAngle: number;
}

function DonutChart({
  total,
  segments,
  selected,
  onSelect,
}: {
  total: number;
  segments: Segment[];
  selected: VetoMemberKey | null;
  onSelect: (key: VetoMemberKey | null) => void;
}) {
  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{ cursor: 'pointer' }}
    >
      {total === 0 ? (
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#30363d" strokeWidth={SW} />
      ) : (
        segments.map(s => {
          if (s.frac === 0) return null;
          const isSelected = selected === s.key;
          return (
            <circle
              key={s.key}
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={isSelected ? SW + 4 : SW}
              strokeDasharray={`${s.frac * C} ${C}`}
              transform={`rotate(${s.startAngle - 90} ${CX} ${CY})`}
              opacity={selected && !isSelected ? 0.35 : 1}
              onClick={() => onSelect(isSelected ? null : s.key)}
              style={{ transition: 'opacity 0.2s, stroke-width 0.15s' }}
            />
          );
        })
      )}
      {/* Count labels on segments (skip if < 18°) */}
      {segments.map(s => {
        if (s.count === 0 || s.frac * 360 < 18) return null;
        const midRad = ((s.startAngle + s.frac * 180) - 90) * (Math.PI / 180);
        const lx = CX + R * Math.cos(midRad);
        const ly = CY + R * Math.sin(midRad);
        return (
          <text
            key={s.key}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize={9}
            fontWeight="bold"
            style={{ pointerEvents: 'none' }}
          >
            {s.count}
          </text>
        );
      })}
      {/* Total in center */}
      <text
        x={CX}
        y={CY}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize={18}
        fontWeight="bold"
        style={{ pointerEvents: 'none' }}
      >
        {total}
      </text>
    </svg>
  );
}

function VetoList({
  member,
  records,
  onClose,
}: {
  member: { key: VetoMemberKey; label: string; color: string };
  records: ScVeto[];
  onClose: () => void;
}) {
  const relevant = records.filter(r => r[member.key] === 1);

  return (
    <div
      className="mt-3 rounded-lg border border-[#30363d] bg-[#161b22] p-3"
      style={{ borderLeft: `3px solid ${member.color}` }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: member.color }}>
          {member.label} — {relevant.length} veto{relevant.length !== 1 ? 's' : ''}
        </span>
        <button
          onClick={onClose}
          className="text-[10px] text-[#8b949e] hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {relevant.map(r => {
          const draft = r['draft_res#'];
          const agenda = r.agenda;
          const recordUrl = r.url_for_record;
          const summary = VETO_SUMMARIES[r.id];
          return (
            <div key={r.id} className="border-b border-[#21262d] pb-3 last:border-0 last:pb-0">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono text-[#8b949e]">{draft}</span>
                {recordUrl && (
                  <a
                    href={recordUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-[9px] text-[#8b949e] underline hover:text-white"
                  >
                    Record ↗
                  </a>
                )}
              </div>
              <p className="mt-0.5 text-[10px] font-medium text-[#c9d1d9]">{agenda}</p>
              {summary && (
                <p className="mt-1 text-[10px] leading-relaxed text-[#8b949e]">{summary}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function VetoDonutPanel() {
  const { counts, records, loading } = useVetoData();
  const { year } = useFilterStore();
  const [selected, setSelected] = useState<VetoMemberKey | null>(null);

  if (loading) return null;

  if (year < 1992) {
    return (
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#8b949e] mb-1">
          SC Vetoes
        </p>
        <p className="text-xs text-[#8b949e]">Veto data available from 1992 onwards.</p>
      </div>
    );
  }

  if (counts === null) return null;

  let cumAngle = 0;
  const segments: Segment[] = P5_MEMBERS.map(m => {
    const count = counts[m.key];
    const frac = counts.total > 0 ? count / counts.total : 0;
    const startAngle = cumAngle;
    cumAngle += frac * 360;
    return { ...m, count, frac, startAngle };
  });

  const selectedMember = selected ? P5_MEMBERS.find(m => m.key === selected) ?? null : null;

  return (
    <div className="px-4 pt-4 pb-3">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
        SC Vetoes — {year}
      </p>
      <div className="flex items-center gap-3">
        {/* Legend */}
        <div className="flex flex-col gap-1.5 min-w-0">
          {P5_MEMBERS.map(m => (
            <button
              key={m.key}
              onClick={() => setSelected(prev => prev === m.key ? null : m.key)}
              className="flex items-center gap-1.5 text-left hover:opacity-80 transition-opacity"
              disabled={counts[m.key] === 0}
            >
              <span
                className="inline-block shrink-0 rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: m.color,
                  opacity: counts[m.key] === 0 ? 0.3 : 1,
                }}
              />
              <span
                className="truncate text-[10px]"
                style={{
                  color: selected === m.key ? m.color : counts[m.key] === 0 ? '#4b5563' : '#8b949e',
                }}
              >
                {m.label}
              </span>
            </button>
          ))}
        </div>
        {/* Donut */}
        <div className="shrink-0">
          <DonutChart
            total={counts.total}
            segments={segments}
            selected={selected}
            onSelect={setSelected}
          />
        </div>
      </div>

      {counts.total === 0 && (
        <p className="mt-2 text-[11px] text-[#8b949e]">No vetoes recorded in {year}.</p>
      )}

      {selectedMember && (
        <VetoList
          member={selectedMember}
          records={records}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
