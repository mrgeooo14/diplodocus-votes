import { useEffect, useState } from 'react';
import { useFilterStore } from '../store/filterStore';
import type { YearlyAggregate } from '../lib/types';
import { computeAllTrends } from '../lib/delphiInsights';
import { fetchJSON } from '../lib/fetchCache';

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
