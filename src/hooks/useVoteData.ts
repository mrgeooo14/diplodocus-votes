import { useEffect, useRef, useState } from 'react';
import { useFilterStore } from '../store/filterStore';
import type { Resolution, YearlyAggregate, TopicsIndex, VoteValue, CountryVoteInfo } from '../lib/types';
import { VOTE_COLORS, NO_DATA_COLOR } from '../lib/colors';
import { fetchJSON } from '../lib/fetchCache';

function usVsChinaColor(t: number): string {
  // t=0: China (red), t=0.5: neutral (gray), t=1: US (light blue)
  if (t < 0.5) return lerpHex('#ef4444', '#6b7280', t * 2);
  return lerpHex('#6b7280', '#38bdf8', (t - 0.5) * 2);
}

export interface UsVsChinaStat {
  kind: 'us-china';
  usAlign: number;   // [0,1]
  cnAlign: number;   // [0,1]
  neutral: number;   // [0,1]
  total: number;
}

export interface CountryAlignStat {
  kind: 'country';
  align: number;     // [0,1]
  total: number;
}

export type ComparisonStat = UsVsChinaStat | CountryAlignStat;

function computeUsVsChinaColors(resolutions: Resolution[]): {
  colors: Record<string, string>;
  stats: Record<string, ComparisonStat>;
} {
  const raw: Record<string, { us: number; cn: number; total: number }> = {};
  for (const res of resolutions) {
    const usVote = res.votes['USA'];
    const cnVote = res.votes['CHN'];
    if (!usVote || !cnVote || usVote === 'X' || cnVote === 'X') continue;
    if (usVote === cnVote) continue;
    for (const [iso, vote] of Object.entries(res.votes)) {
      if (iso === 'USA' || iso === 'CHN' || vote === 'X') continue;
      if (!raw[iso]) raw[iso] = { us: 0, cn: 0, total: 0 };
      raw[iso].total++;
      if (vote === usVote) raw[iso].us++;
      else if (vote === cnVote) raw[iso].cn++;
    }
  }
  const colors: Record<string, string> = {};
  const stats: Record<string, ComparisonStat> = {};
  for (const [iso, s] of Object.entries(raw)) {
    if (s.total === 0) continue;
    const t = (s.us + (s.total - s.us - s.cn) * 0.5) / s.total;
    colors[iso] = usVsChinaColor(t);
    stats[iso] = {
      kind: 'us-china',
      usAlign: s.us / s.total,
      cnAlign: s.cn / s.total,
      neutral: (s.total - s.us - s.cn) / s.total,
      total: s.total,
    };
  }
  colors['USA'] = '#38bdf8';
  colors['CHN'] = '#ef4444';
  return { colors, stats };
}

function computeCountryComparisonColors(resolutions: Resolution[], compareIso: string): {
  colors: Record<string, string>;
  stats: Record<string, ComparisonStat>;
} {
  const raw: Record<string, { agree: number; total: number }> = {};
  for (const res of resolutions) {
    const refVote = res.votes[compareIso];
    if (!refVote || refVote === 'X') continue;
    for (const [iso, vote] of Object.entries(res.votes)) {
      if (iso === compareIso || vote === 'X') continue;
      if (!raw[iso]) raw[iso] = { agree: 0, total: 0 };
      raw[iso].total++;
      if (vote === refVote) raw[iso].agree++;
    }
  }
  const colors: Record<string, string> = {};
  const stats: Record<string, ComparisonStat> = {};
  for (const [iso, s] of Object.entries(raw)) {
    if (s.total === 0) continue;
    colors[iso] = yesRateToColor(s.agree / s.total);
    stats[iso] = { kind: 'country', align: s.agree / s.total, total: s.total };
  }
  colors[compareIso] = '#06b6d4';
  return { colors, stats };
}

function lerpHex(hex1: string, hex2: string, t: number): string {
  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);
  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);
  const r = Math.round(r1 + (r2 - r1) * t).toString(16).padStart(2, '0');
  const g = Math.round(g1 + (g2 - g1) * t).toString(16).padStart(2, '0');
  const b = Math.round(b1 + (b2 - b1) * t).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

function yesRateToColor(rate: number): string {
  if (rate < 0.5) return lerpHex('#ef4444', '#6b7280', rate * 2);
  return lerpHex('#6b7280', '#22c55e', (rate - 0.5) * 2);
}

export interface VoteDataResult {
  countryColors: Record<string, string>;
  countryVoteInfo: Record<string, CountryVoteInfo>;
  /** Raw votes for the current resolution (only populated in resolution mode). */
  p5ResolutionVotes: Record<string, VoteValue> | null;
  /** Per-country comparison stats when mapColorMode !== 'default'. */
  comparisonStats: Record<string, ComparisonStat> | null;
  loading: boolean;
}

function shallowEqualRecords(a: Record<string, string>, b: Record<string, string>): boolean {
  const aKeys = Object.keys(a);
  if (aKeys.length !== Object.keys(b).length) return false;
  for (const k of aKeys) {
    if (a[k] !== b[k]) return false;
  }
  return true;
}

export function useVoteData(): VoteDataResult {
  const { body, mode, year, resolutionId, topic, mapColorMode, compareCountry } = useFilterStore();
  const [result, setResult] = useState<VoteDataResult>({
    countryColors: {},
    countryVoteInfo: {},
    p5ResolutionVotes: null,
    comparisonStats: null,
    loading: true,
  });
  const prevColorsRef = useRef<Record<string, string>>({});

  useEffect(() => {
    setResult(prev => ({ ...prev, loading: true }));
    let cancelled = false;

    async function compute() {
      const prefix = body === 'GA' ? 'ga' : 'sc';
      const colors: Record<string, string> = {};
      const info: Record<string, CountryVoteInfo> = {};
      let p5ResolutionVotes: Record<string, VoteValue> | null = null;

      if (mode === 'year') {
        const yearly = await fetchJSON<YearlyAggregate[]>(`/data/aggregates/yearly-${prefix}.json`);
        const entry = yearly.find(e => e.year === year);
        if (entry) {
          for (const [iso, stats] of Object.entries(entry.countries)) {
            const cast = stats.yes + stats.no + stats.abstain;
            if (cast === 0) continue;
            colors[iso] = yesRateToColor(stats.yes / cast);
            info[iso] = { ...stats };
          }
        }
      } else if (mode === 'resolution' && resolutionId) {
        const resolutions = await fetchJSON<Resolution[]>(`/data/${prefix}-resolutions.json`);
        const res = resolutions.find(r => r.id === resolutionId);
        if (res) {
          for (const [iso, vote] of Object.entries(res.votes)) {
            colors[iso] = VOTE_COLORS[vote as VoteValue] ?? NO_DATA_COLOR;
            info[iso] = { vote: vote as VoteValue };
          }
          p5ResolutionVotes = res.votes as Record<string, VoteValue>;
        }
      } else if (mode === 'topic' && topic) {
        const topicsIndex = await fetchJSON<TopicsIndex>('/data/aggregates/topics.json');
        const resIds = topicsIndex[topic] ?? [];
        const resolutions = await fetchJSON<Resolution[]>(`/data/${prefix}-resolutions.json`);
        const matched = resolutions.filter(r => resIds.includes(r.id));
        const accum: Record<string, { yes: number; no: number; abstain: number; total: number }> = {};
        for (const res of matched) {
          for (const [iso, vote] of Object.entries(res.votes)) {
            if (!accum[iso]) accum[iso] = { yes: 0, no: 0, abstain: 0, total: 0 };
            if (vote === 'Y') { accum[iso].yes++; accum[iso].total++; }
            else if (vote === 'N') { accum[iso].no++; accum[iso].total++; }
            else if (vote === 'A') { accum[iso].abstain++; accum[iso].total++; }
          }
        }
        for (const [iso, stats] of Object.entries(accum)) {
          if (stats.total === 0) continue; // only X-votes → treat as no data
          colors[iso] = yesRateToColor(stats.yes / stats.total);
          info[iso] = stats;
        }
      }

      // Override colors for comparison map modes (GA only)
      let comparisonStats: Record<string, ComparisonStat> | null = null;
      if (body === 'GA' && mapColorMode !== 'default') {
        const allResolutions = await fetchJSON<Resolution[]>('/data/ga-resolutions.json');
        let relevant: Resolution[];
        if (mode === 'year') {
          relevant = allResolutions.filter(r => r.year === year);
        } else if (mode === 'resolution' && resolutionId) {
          const r = allResolutions.find(r => r.id === resolutionId);
          relevant = r ? [r] : [];
        } else if (mode === 'topic' && topic) {
          const topicsIdx = await fetchJSON<TopicsIndex>('/data/aggregates/topics.json');
          const ids = topicsIdx[topic] ?? [];
          relevant = allResolutions.filter(r => ids.includes(r.id));
        } else {
          relevant = [];
        }
        if (relevant.length > 0) {
          if (mapColorMode === 'us-china') {
            const { colors: overrides, stats } = computeUsVsChinaColors(relevant);
            // Wipe default vote/yesRate colors — comparison mode owns the full palette.
            // Without this, countries where USA+China agreed keep their green/yellow colors.
            for (const k of Object.keys(colors)) delete colors[k];
            Object.assign(colors, overrides);
            comparisonStats = stats;
          } else if (compareCountry) {
            const { colors: overrides, stats } = computeCountryComparisonColors(relevant, compareCountry);
            for (const k of Object.keys(colors)) delete colors[k];
            Object.assign(colors, overrides);
            comparisonStats = stats;
          }
        }
      }

      if (!cancelled) {
        // Only issue a new object reference for countryColors if values actually changed,
        // so downstream memos (coloredGeo in VoteMap) don't invalidate unnecessarily.
        const stableColors = shallowEqualRecords(colors, prevColorsRef.current)
          ? prevColorsRef.current
          : colors;
        prevColorsRef.current = stableColors;
        setResult({ countryColors: stableColors, countryVoteInfo: info, p5ResolutionVotes, comparisonStats, loading: false });
      }
    }

    compute().catch(console.error);
    return () => { cancelled = true; };
  }, [body, mode, year, resolutionId, topic, mapColorMode, compareCountry]);

  return result;
}
