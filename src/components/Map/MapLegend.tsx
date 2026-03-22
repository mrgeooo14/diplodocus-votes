import { useFilterStore } from '../../store/filterStore';
import { VOTE_COLORS } from '../../lib/colors';
import type { VoteValue } from '../../lib/types';

const VOTE_LABELS: Record<VoteValue, string> = {
  Y: 'Yes',
  N: 'No',
  A: 'Abstain',
  X: 'Non-voting',
};

export function MapLegend() {
  const { mode } = useFilterStore();

  if (mode === 'resolution') {
    return (
      <div className="absolute bottom-6 left-4 rounded border border-[#30363d] bg-[#161b22]/90 px-3 py-2 text-xs">
        {(Object.entries(VOTE_COLORS) as [VoteValue, string][]).map(([vote, color]) => (
          <div key={vote} className="flex items-center gap-2 py-0.5">
            <span className="h-3 w-3 flex-shrink-0 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-[#8b949e]">{VOTE_LABELS[vote]}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 py-0.5">
          <span className="h-3 w-3 flex-shrink-0 rounded-sm bg-[#1f2937]" />
          <span className="text-[#8b949e]">No data</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-6 left-4 rounded border border-[#30363d] bg-[#161b22]/90 px-3 py-2 text-xs">
      <p className="mb-1.5 text-[#8b949e]">Yes-vote rate</p>
      <div
        className="h-3 w-32 rounded-sm"
        style={{ background: 'linear-gradient(to right, #ef4444, #6b7280, #22c55e)' }}
      />
      <div className="mt-1 flex justify-between w-32 text-[#6b7280]">
        <span>0%</span>
        <span>100%</span>
      </div>
      <div className="mt-1.5 flex items-center gap-2 py-0.5">
        <span className="h-3 w-3 flex-shrink-0 rounded-sm bg-[#1f2937]" />
        <span className="text-[#8b949e]">No data</span>
      </div>
    </div>
  );
}
