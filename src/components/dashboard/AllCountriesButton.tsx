import { useMemo, useState } from 'react';
import { useVoteData } from '../../hooks/useVoteData';
import { useFilterStore } from '../../store/filterStore';
import { AlignmentModal, type AlignmentPosition } from './AlignmentModal';
import { iso3ToName } from '../../lib/countryIso';
import type { VoteValue } from '../../lib/types';

function voteToPosition(vote: VoteValue): number | null {
  if (vote === 'Y') return 1;
  if (vote === 'A') return 0.5;
  if (vote === 'N') return 0;
  return null;
}

export function AllCountriesButton() {
  const { countryVoteInfo, p5ResolutionVotes, loading } = useVoteData();
  const { mode } = useFilterStore();
  const [modalOpen, setModalOpen] = useState(false);

  const result = useMemo(() => {
    if (loading) return null;

    const positions: AlignmentPosition[] = [];

    if (mode === 'resolution' && p5ResolutionVotes) {
      for (const [iso3, vote] of Object.entries(p5ResolutionVotes)) {
        positions.push({ iso3, vote: vote as VoteValue, position: voteToPosition(vote as VoteValue) });
      }
      // alignment = fraction voting the modal vote
      const active = positions.filter(p => p.vote && p.vote !== 'X');
      if (active.length === 0) return null;
      const counts: Record<string, number> = { Y: 0, N: 0, A: 0 };
      for (const p of active) if (p.vote) counts[p.vote] = (counts[p.vote] ?? 0) + 1;
      const alignment = Math.max(...Object.values(counts)) / active.length;
      const labels: Record<string, string> = {};
      for (const p of positions) labels[p.iso3] = iso3ToName(p.iso3);
      return { positions, alignment, labels };
    }

    // year / topic: yes-rate per country
    const rates: number[] = [];
    for (const [iso3, info] of Object.entries(countryVoteInfo)) {
      const cast = (info.yes ?? 0) + (info.no ?? 0) + (info.abstain ?? 0);
      if (cast === 0) continue;
      const rate = (info.yes ?? 0) / cast;
      rates.push(rate);
      positions.push({ iso3, position: rate });
    }
    if (rates.length === 0) return null;
    const mean = rates.reduce((a, b) => a + b, 0) / rates.length;
    const variance = rates.reduce((a, r) => a + (r - mean) ** 2, 0) / rates.length;
    const alignment = Math.max(0, Math.min(1, 1 - Math.sqrt(variance) / 0.5));
    const labels: Record<string, string> = {};
    for (const p of positions) labels[p.iso3] = iso3ToName(p.iso3);
    return { positions, alignment, labels };
  }, [mode, p5ResolutionVotes, countryVoteInfo, loading]);

  if (!result) return null;

  const { labels } = result;

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="mx-4 mt-3 mb-4 w-[calc(100%-2rem)] rounded-md border border-[#30363d] py-1.5 text-xs text-[#8b949e] transition-colors hover:border-[#8b949e] hover:text-[#e6edf3]"
      >
        All countries →
      </button>
      {modalOpen && (
        <AlignmentModal
          groupName="All Countries"
          alignment={result.alignment}
          positions={result.positions}
          labels={labels}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
