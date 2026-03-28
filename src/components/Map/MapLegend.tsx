import { useFilterStore } from '../../store/filterStore';
import { VOTE_COLORS } from '../../lib/colors';
import { iso3ToName } from '../../lib/countryIso';
import type { VoteValue } from '../../lib/types';

const VOTE_LABELS: Record<VoteValue, string> = {
  Y: 'Yes',
  N: 'No',
  A: 'Abstain',
  X: 'Non-voting',
};

export function MapLegend() {
  const { mode, mapColorMode, compareCountry } = useFilterStore();

  if (mapColorMode === 'us-china') {
    return (
      <div role="region" aria-label="Map legend" className="absolute bottom-6 left-4 rounded border border-[#30363d] bg-[#161b22]/90 px-3 py-2 text-xs">
        <p className="mb-1.5 text-[#9eaab6]">US ↔ China alignment</p>
        <div
          role="img"
          aria-label="Gradient from China-aligned (red) through neutral (gray) to US-aligned (blue)"
          className="h-3 w-32 rounded-sm"
          style={{ background: 'linear-gradient(to right, #ef4444, #6b7280, #38bdf8)' }}
        />
        <div className="mt-1 flex justify-between w-32 text-[#9eaab6]">
          <span aria-label="China">🇨🇳</span>
          <span aria-label="United States">🇺🇸</span>
        </div>
        <div className="mt-1.5 flex items-center gap-2 py-0.5">
          <span className="h-3 w-3 flex-shrink-0 rounded-sm bg-[#1f2937]" />
          <span className="text-[#9eaab6]">No data</span>
        </div>
      </div>
    );
  }

  if (mapColorMode === 'country' && compareCountry) {
    const name = iso3ToName(compareCountry);
    return (
      <div role="region" aria-label="Map legend" className="absolute bottom-6 left-4 rounded border border-[#30363d] bg-[#161b22]/90 px-3 py-2 text-xs">
        <p className="mb-1.5 text-[#9eaab6]">Agreement with {name}</p>
        <div
          role="img"
          aria-label={`Gradient from 0% (red) to 100% agreement with ${name} (green)`}
          className="h-3 w-32 rounded-sm"
          style={{ background: 'linear-gradient(to right, #ef4444, #6b7280, #22c55e)' }}
        />
        <div className="mt-1 flex justify-between w-32 text-[#9eaab6]">
          <span>0%</span>
          <span>100%</span>
        </div>
        <div className="mt-1.5 flex items-center gap-2 py-0.5">
          <span className="h-3 w-3 flex-shrink-0 rounded-sm" style={{ backgroundColor: '#06b6d4' }} />
          <span className="text-[#9eaab6]">{name}</span>
        </div>
        <div className="mt-0.5 flex items-center gap-2 py-0.5">
          <span className="h-3 w-3 flex-shrink-0 rounded-sm bg-[#1f2937]" />
          <span className="text-[#9eaab6]">No data</span>
        </div>
      </div>
    );
  }

  if (mode === 'resolution') {
    return (
      <div role="region" aria-label="Map legend" className="absolute bottom-6 left-4 rounded border border-[#30363d] bg-[#161b22]/90 px-3 py-2 text-xs">
        {(Object.entries(VOTE_COLORS) as [VoteValue, string][]).map(([vote, color]) => (
          <div key={vote} className="flex items-center gap-2 py-0.5">
            <span className="h-3 w-3 flex-shrink-0 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-[#9eaab6]">{VOTE_LABELS[vote]}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 py-0.5">
          <span className="h-3 w-3 flex-shrink-0 rounded-sm bg-[#1f2937]" />
          <span className="text-[#9eaab6]">No data</span>
        </div>
      </div>
    );
  }

  return (
    <div role="region" aria-label="Map legend" className="absolute bottom-6 left-4 rounded border border-[#30363d] bg-[#161b22]/90 px-3 py-2 text-xs">
      <p className="mb-1.5 text-[#9eaab6]">Yes-vote rate</p>
      <div
        role="img"
        aria-label="Gradient from 0% yes-vote rate (red) through 50% (gray) to 100% (green)"
        className="h-3 w-32 rounded-sm"
        style={{ background: 'linear-gradient(to right, #ef4444, #6b7280, #22c55e)' }}
      />
      <div className="mt-1 flex justify-between w-32 text-[#9eaab6]">
        <span>0%</span>
        <span>100%</span>
      </div>
      <div className="mt-1.5 flex items-center gap-2 py-0.5">
        <span className="h-3 w-3 flex-shrink-0 rounded-sm bg-[#1f2937]" />
        <span className="text-[#9eaab6]">No data</span>
      </div>
    </div>
  );
}
