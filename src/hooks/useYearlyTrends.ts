import { useEffect, useState } from 'react';
import { useFilterStore } from '../store/filterStore';
import type { YearlyAggregate } from '../lib/types';
import { computeAllTrends } from '../lib/delphiInsights';

const cache = new Map<string, unknown>();

async function fetchJSON<T>(url: string): Promise<T> {
  if (cache.has(url)) return cache.get(url) as T;
  const res = await fetch(url);
  const data: T = await res.json();
  cache.set(url, data);
  return data;
}

export type TrendDirection = 'up' | 'down' | 'stable';

export function useYearlyTrends(): Record<string, TrendDirection> {
  const { body, mode, year } = useFilterStore();
  const [trends, setTrends] = useState<Record<string, TrendDirection>>({});

  useEffect(() => {
    if (mode !== 'year') {
      setTrends({});
      return;
    }
    let cancelled = false;
    const prefix = body === 'GA' ? 'ga' : 'sc';

    fetchJSON<YearlyAggregate[]>(`/data/aggregates/yearly-${prefix}.json`)
      .then(yearly => {
        if (!cancelled) setTrends(computeAllTrends(year, yearly));
      })
      .catch(console.error);

    return () => { cancelled = true; };
  }, [body, mode, year]);

  return trends;
}
