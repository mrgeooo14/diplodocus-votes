import { forwardRef } from 'react';
import type { CountryVoteInfo, VoteValue } from '../../lib/types';
import type { ComparisonStat } from '../../hooks/useVoteData';
import { iso3ToName } from '../../lib/countryIso';

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

function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}

interface Props {
  x: number;
  y: number;
  name: string;
  info: CountryVoteInfo;
  comparisonStat?: ComparisonStat | null;
  compareCountry?: string | null;
  isReferenceCountry?: boolean;
  pinned?: boolean;
}

export const CountryTooltip = forwardRef<HTMLDivElement, Props>(function CountryTooltip(
  { x, y, name, info, comparisonStat, compareCountry, isReferenceCountry, pinned }: Props,
  ref,
) {
  const total = info.total ?? 0;

  return (
    <div
      ref={ref}
      role="tooltip"
      aria-live="polite"
      className="pointer-events-none absolute z-50 rounded border border-[#30363d] bg-[#161b22] px-3 py-2 text-sm shadow-lg"
      style={
        pinned
          ? { bottom: 16, left: '50%', transform: 'translateX(-50%)', top: 'auto', maxWidth: '80vw' }
          : { left: x + 14, top: y - 10 }
      }
    >
      <p className="font-semibold text-[#e6edf3]">{name}</p>

      {/* Comparison stats — shown instead of raw vote info when in a comparison mode */}
      {comparisonStat?.kind === 'us-china' ? (
        <div className="mt-1 space-y-0.5 text-xs">
          <p>
            <span style={{ color: '#38bdf8' }}>🇺🇸 US alignment:</span>{' '}
            <span className="text-[#e6edf3]">{pct(comparisonStat.usAlign)}</span>
          </p>
          <p>
            <span style={{ color: '#ef4444' }}>🇨🇳 China alignment:</span>{' '}
            <span className="text-[#e6edf3]">{pct(comparisonStat.cnAlign)}</span>
          </p>
          <p className="text-[#8b949e]">
            Neutral: {pct(comparisonStat.neutral)} &middot; {comparisonStat.total} votes
          </p>
        </div>
      ) : comparisonStat?.kind === 'country' && compareCountry ? (
        <div className="mt-1 space-y-0.5 text-xs">
          <p>
            <span style={{ color: '#06b6d4' }}>
              Alignment with {iso3ToName(compareCountry)}:
            </span>{' '}
            <span className="text-[#e6edf3]">{pct(comparisonStat.align)}</span>
          </p>
          <p className="text-[#8b949e]">{comparisonStat.total} contested votes</p>
        </div>
      ) : isReferenceCountry ? (
        // This is the reference country itself
        <p className="mt-0.5 text-xs" style={{ color: '#06b6d4' }}>Reference country</p>
      ) : info.vote !== undefined ? (
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
});
