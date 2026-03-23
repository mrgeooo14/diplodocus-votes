import { useEffect, useState } from 'react';
import { useFilterStore } from '../store/filterStore';
import type { Resolution, YearlyAggregate, TopicsIndex, VoteValue, CountryVoteInfo } from '../lib/types';
import { VOTE_COLORS, NO_DATA_COLOR } from '../lib/colors';

const fetchCache = new Map<string, unknown>();

async function fetchJSON<T>(url: string): Promise<T> {
  if (fetchCache.has(url)) return fetchCache.get(url) as T;
  const res = await fetch(url);
  const data: T = await res.json();
  fetchCache.set(url, data);
  return data;
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
  loading: boolean;
}

export function useVoteData(): VoteDataResult {
  const { body, mode, year, resolutionId, topic } = useFilterStore();
  const [result, setResult] = useState<VoteDataResult>({
    countryColors: {},
    countryVoteInfo: {},
    p5ResolutionVotes: null,
    loading: true,
  });

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
          const rate = stats.total > 0 ? stats.yes / stats.total : 0;
          colors[iso] = yesRateToColor(rate);
          info[iso] = stats;
        }
      }

      if (!cancelled) setResult({ countryColors: colors, countryVoteInfo: info, p5ResolutionVotes, loading: false });
    }

    compute().catch(console.error);
    return () => { cancelled = true; };
  }, [body, mode, year, resolutionId, topic]);

  return result;
}
