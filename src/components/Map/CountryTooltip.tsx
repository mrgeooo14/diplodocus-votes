import type { CountryVoteInfo, VoteValue } from '../../lib/types';

const VOTE_LABELS: Record<VoteValue, string> = {
  Y: 'Yes',
  N: 'No',
  A: 'Abstain',
  X: 'Non-voting',
};

const VOTE_COLORS_CSS: Record<VoteValue, string> = {
  Y: '#22c55e',
  N: '#ef4444',
  A: '#eab308',
  X: '#4b5563',
};

interface Props {
  x: number;
  y: number;
  name: string;
  info: CountryVoteInfo;
}

export function CountryTooltip({ x, y, name, info }: Props) {
  const total = info.total ?? 0;

  return (
    <div
      className="pointer-events-none absolute z-50 rounded border border-[#30363d] bg-[#161b22] px-3 py-2 text-sm shadow-lg"
      style={{ left: x + 14, top: y - 10 }}
    >
      <p className="font-semibold text-[#e6edf3]">{name}</p>

      {info.vote !== undefined ? (
        <p className="mt-0.5 font-medium" style={{ color: VOTE_COLORS_CSS[info.vote] }}>
          {VOTE_LABELS[info.vote]}
        </p>
      ) : total > 0 ? (
        <div className="mt-1 space-y-0.5 text-xs text-[#8b949e]">
          <p>
            <span style={{ color: '#22c55e' }}>Yes:</span>{' '}
            {info.yes} ({Math.round(((info.yes ?? 0) / total) * 100)}%)
          </p>
          <p>
            <span style={{ color: '#ef4444' }}>No:</span> {info.no}
          </p>
          <p>
            <span style={{ color: '#eab308' }}>Abstain:</span> {info.abstain}
          </p>
        </div>
      ) : (
        <p className="mt-0.5 text-xs text-[#8b949e]">No data</p>
      )}
    </div>
  );
}
