import type { VoteValue } from './types';

export const VOTE_COLORS: Record<VoteValue, string> = {
  Y: '#22c55e',
  N: '#ef4444',
  A: '#eab308',
  X: '#4b5563',
};

export const NO_DATA_COLOR = '#1f2937';

export function voteToColor(vote: VoteValue | undefined): string {
  if (!vote) return NO_DATA_COLOR;
  return VOTE_COLORS[vote] ?? NO_DATA_COLOR;
}
