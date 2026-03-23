import type { VoteValue } from './types';

export const P5_MEMBERS = ['USA', 'RUS', 'CHN', 'GBR', 'FRA'] as const;
export type P5Member = (typeof P5_MEMBERS)[number];

export interface P5VotePosition {
  iso3: P5Member;
  /** Position on [0, 1] axis: N=0, A=0.5, Y=1. null if non-voting / absent. */
  position: number | null;
  vote?: VoteValue;
}

/**
 * Maps a single vote to an x-axis position [0, 1].
 * Y → 1.0 (yes / right)
 * A → 0.5 (abstain / middle)
 * N → 0.0 (no / left)
 * X → null (non-voting, not shown on axis)
 */
export function voteToPosition(vote: VoteValue): number | null {
  if (vote === 'Y') return 1;
  if (vote === 'A') return 0.5;
  if (vote === 'N') return 0;
  return null; // X
}

/**
 * Compute P5 alignment for a single resolution.
 * alignment = count(modal vote among active P5 voters) / count(active P5 voters)
 * Returns [0, 1]. Returns null if no P5 member voted.
 */
export function computeP5AlignmentResolution(
  votes: Record<string, VoteValue>,
): { alignment: number; positions: P5VotePosition[] } | null {
  const positions: P5VotePosition[] = P5_MEMBERS.map(iso3 => {
    const vote = votes[iso3];
    if (!vote) return { iso3, position: null };
    return { iso3, vote, position: voteToPosition(vote) };
  });

  const active = positions.filter(p => p.vote && p.vote !== 'X');
  if (active.length === 0) return null;

  const counts: Record<string, number> = { Y: 0, N: 0, A: 0 };
  for (const p of active) {
    if (p.vote) counts[p.vote] = (counts[p.vote] ?? 0) + 1;
  }
  const maxCount = Math.max(...Object.values(counts));
  const alignment = maxCount / active.length;

  return { alignment, positions };
}

/**
 * Compute P5 alignment for year/topic aggregate mode.
 * Each member has a yes-rate [0, 1]. Alignment = 1 - (std_dev / 0.5), clamped to [0, 1].
 * A std_dev of 0 (all same rate) → alignment 1.
 * A std_dev of 0.5 (max spread) → alignment 0.
 */
export function computeP5AlignmentAggregate(
  countryInfo: Record<string, { yes: number; no: number; abstain: number; total?: number }>,
): { alignment: number; positions: P5VotePosition[] } | null {
  const positions: P5VotePosition[] = [];
  const rates: number[] = [];

  for (const iso3 of P5_MEMBERS) {
    const info = countryInfo[iso3];
    if (!info) {
      positions.push({ iso3, position: null });
      continue;
    }
    const cast = info.yes + info.no + info.abstain;
    if (cast === 0) {
      positions.push({ iso3, position: null });
      continue;
    }
    const rate = info.yes / cast;
    rates.push(rate);
    positions.push({ iso3, position: rate });
  }

  if (rates.length === 0) return null;

  const mean = rates.reduce((a, b) => a + b, 0) / rates.length;
  const variance = rates.reduce((a, r) => a + (r - mean) ** 2, 0) / rates.length;
  const std = Math.sqrt(variance);
  const alignment = Math.max(0, Math.min(1, 1 - std / 0.5));

  return { alignment, positions };
}
