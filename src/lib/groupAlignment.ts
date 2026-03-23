import type { VoteValue } from './types';

export interface GroupVotePosition {
  iso3: string;
  /** Position on [0, 1] axis: N=0, A=0.5, Y=1. null if non-voting / absent. */
  position: number | null;
  vote?: VoteValue;
}

export const G20_MEMBERS = [
  'ARG', 'AUS', 'BRA', 'CAN', 'CHN', 'FRA', 'DEU', 'IND', 'IDN', 'ITA',
  'JPN', 'MEX', 'RUS', 'SAU', 'ZAF', 'KOR', 'TUR', 'GBR', 'USA',
] as const;

export const G20_LABELS: Record<string, string> = {
  ARG: 'Argentina', AUS: 'Australia', BRA: 'Brazil', CAN: 'Canada',
  CHN: 'China', FRA: 'France', DEU: 'Germany', IND: 'India',
  IDN: 'Indonesia', ITA: 'Italy', JPN: 'Japan', MEX: 'Mexico',
  RUS: 'Russia', SAU: 'Saudi Arabia', ZAF: 'South Africa', KOR: 'South Korea',
  TUR: 'Turkey', GBR: 'United Kingdom', USA: 'United States',
};

export const EU_MEMBERS = [
  'AUT', 'BEL', 'BGR', 'HRV', 'CYP', 'CZE', 'DNK', 'EST', 'FIN', 'FRA',
  'DEU', 'GRC', 'HUN', 'IRL', 'ITA', 'LVA', 'LTU', 'LUX', 'MLT', 'NLD',
  'POL', 'PRT', 'ROU', 'SVK', 'SVN', 'ESP', 'SWE',
] as const;

export const EU_LABELS: Record<string, string> = {
  AUT: 'Austria', BEL: 'Belgium', BGR: 'Bulgaria', HRV: 'Croatia',
  CYP: 'Cyprus', CZE: 'Czech Republic', DNK: 'Denmark', EST: 'Estonia',
  FIN: 'Finland', FRA: 'France', DEU: 'Germany', GRC: 'Greece',
  HUN: 'Hungary', IRL: 'Ireland', ITA: 'Italy', LVA: 'Latvia',
  LTU: 'Lithuania', LUX: 'Luxembourg', MLT: 'Malta', NLD: 'Netherlands',
  POL: 'Poland', PRT: 'Portugal', ROU: 'Romania', SVK: 'Slovakia',
  SVN: 'Slovenia', ESP: 'Spain', SWE: 'Sweden',
};

function voteToPosition(vote: VoteValue): number | null {
  if (vote === 'Y') return 1;
  if (vote === 'A') return 0.5;
  if (vote === 'N') return 0;
  return null;
}

export function computeGroupAlignmentResolution(
  votes: Record<string, VoteValue>,
  members: readonly string[],
): { alignment: number; positions: GroupVotePosition[] } | null {
  const positions: GroupVotePosition[] = members.map(iso3 => {
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

export function computeGroupAlignmentAggregate(
  countryInfo: Record<string, { yes: number; no: number; abstain: number }>,
  members: readonly string[],
): { alignment: number; positions: GroupVotePosition[] } | null {
  const positions: GroupVotePosition[] = [];
  const rates: number[] = [];

  for (const iso3 of members) {
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
