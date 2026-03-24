import { useMemo } from 'react';
import { useVoteData } from '../../hooks/useVoteData';
import { useFilterStore } from '../../store/filterStore';
import type { CountryVoteInfo } from '../../lib/types';
import { P5AlignmentPanel } from './P5AlignmentPanel';
import { VetoDonutPanel } from './VetoDonutPanel';
import { YearContext } from './YearContext';
import { ResolutionContentPanel } from './ResolutionContentPanel';
import { GroupAlignmentPanel } from './GroupAlignmentPanel';
import { G20_MEMBERS, G20_LABELS, EU_MEMBERS, EU_LABELS } from '../../lib/groupAlignment';
import { AllCountriesButton } from './AllCountriesButton';
import { DelphiPanel } from '../Delphi/DelphiPanel';

interface Bar {
  label: string;
  count: number;
  color: string;
}

function buildBars(info: Record<string, CountryVoteInfo>, mode: string): Bar[] {
  if (mode === 'resolution') {
    const counts = { Y: 0, N: 0, A: 0, X: 0 };
    for (const v of Object.values(info)) {
      if (v.vote) counts[v.vote]++;
    }
    return [
      { label: 'Yes', count: counts.Y, color: '#22c55e' },
      { label: 'No', count: counts.N, color: '#ef4444' },
      { label: 'Abstain', count: counts.A, color: '#eab308' },
      { label: 'Non-voting', count: counts.X, color: '#4b5563' },
    ];
  }
  // year / topic: bucket yes-rate into quartiles
  let low = 0, midLow = 0, midHigh = 0, high = 0;
  for (const v of Object.values(info)) {
    const total = (v.yes ?? 0) + (v.no ?? 0) + (v.abstain ?? 0);
    if (total === 0) continue;
    const rate = (v.yes ?? 0) / total;
    if (rate < 0.25) low++;
    else if (rate < 0.5) midLow++;
    else if (rate < 0.75) midHigh++;
    else high++;
  }
  return [
    { label: '0–25%', count: low, color: '#ef4444' },
    { label: '25–50%', count: midLow, color: '#f97316' },
    { label: '50–75%', count: midHigh, color: '#84cc16' },
    { label: '75–100%', count: high, color: '#22c55e' },
  ];
}

export function VoteSummary() {
  const { countryVoteInfo, loading } = useVoteData();
  const { mode, body, year, setMode } = useFilterStore();

  const bars = useMemo(() => buildBars(countryVoteInfo, mode), [countryVoteInfo, mode]);
  const maxCount = Math.max(...bars.map(b => b.count), 1);

  if (loading) {
    return <p className="px-4 pt-4 text-xs text-[#8b949e]">Loading…</p>;
  }

  return (
    <div className="pt-4">
      {mode === 'year' && <YearContext />}
      {mode === 'resolution' && (
        <>
          <div className="px-4 pt-4">
            <button
              onClick={() => setMode('year')}
              className="mb-3 flex items-center gap-1.5 text-xs text-[#8b949e] transition-colors hover:text-[#e6edf3]"
            >
              ← {year} yearly averages
            </button>
          </div>
          <ResolutionContentPanel />
          <div className="mx-4 border-t border-[#30363d]" />
        </>
      )}
      <div className="px-4 pt-4">
        {mode === 'topic' && (
          <button
            onClick={() => setMode('year')}
            className="mb-3 flex items-center gap-1.5 text-xs text-[#8b949e] transition-colors hover:text-[#e6edf3]"
          >
            ← {year} yearly averages
          </button>
        )}
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
          {mode === 'resolution' ? 'Vote breakdown' : 'Yes-rate distribution'}
        </p>
        <div className="space-y-2">
          {bars.map(bar => (
            <div key={bar.label}>
              <div className="mb-0.5 flex justify-between text-xs text-[#8b949e]">
                <span>{bar.label}</span>
                <span>{bar.count}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#21262d]">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(bar.count / maxCount) * 100}%`,
                    backgroundColor: bar.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {body === 'SC' && (
        <>
          <div className="mx-4 mt-4 border-t border-[#30363d]" />
          <P5AlignmentPanel />
          <div className="mx-4 mt-2 border-t border-[#30363d]" />
          <AllCountriesButton />
          <div className="mx-4 border-t border-[#30363d]" />
          <VetoDonutPanel />
        </>
      )}
      {body === 'GA' && (
        <>
          <div className="mx-4 mt-4 border-t border-[#30363d]" />
          <GroupAlignmentPanel groupName="G20 Alignment" members={G20_MEMBERS} labels={G20_LABELS} />
          <div className="mx-4 mt-2 border-t border-[#30363d]" />
          <GroupAlignmentPanel groupName="EU Alignment" members={EU_MEMBERS} labels={EU_LABELS} />
          <div className="mx-4 mt-2 border-t border-[#30363d]" />
          <AllCountriesButton />
        </>
      )}
      <DelphiPanel />
    </div>
  );
}
