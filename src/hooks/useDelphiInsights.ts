import { useEffect, useState } from 'react';
import { useFilterStore } from '../store/filterStore';
import type { Resolution, YearlyAggregate, TopicsIndex, Insight } from '../lib/types';
import {
  getYearInsights,
  getResolutionInsights,
  getTopicInsights,
} from '../lib/delphiInsights';

const cache = new Map<string, unknown>();

async function fetchJSON<T>(url: string): Promise<T> {
  if (cache.has(url)) return cache.get(url) as T;
  const res = await fetch(url);
  const data: T = await res.json();
  cache.set(url, data);
  return data;
}

export function useDelphiInsights(): Insight[] {
  const { body, mode, year, resolutionId, topic } = useFilterStore();
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    let cancelled = false;
    const prefix = body === 'GA' ? 'ga' : 'sc';

    async function compute() {
      let result: Insight[] = [];

      if (mode === 'year') {
        const [yearly, allRes] = await Promise.all([
          fetchJSON<YearlyAggregate[]>(`/data/aggregates/yearly-${prefix}.json`),
          fetchJSON<Resolution[]>(`/data/${prefix}-resolutions.json`),
        ]);
        result = getYearInsights(year, body, yearly, allRes);
      } else if (mode === 'resolution' && resolutionId) {
        const allRes = await fetchJSON<Resolution[]>(`/data/${prefix}-resolutions.json`);
        const resolution = allRes.find(r => r.id === resolutionId);
        if (resolution) result = getResolutionInsights(resolution, allRes);
      } else if (mode === 'topic' && topic) {
        const [topicsIndex, allRes] = await Promise.all([
          fetchJSON<TopicsIndex>('/data/aggregates/topics.json'),
          fetchJSON<Resolution[]>(`/data/${prefix}-resolutions.json`),
        ]);
        const ids = topicsIndex[topic] ?? [];
        const matched = allRes.filter(r => ids.includes(r.id));
        result = getTopicInsights(matched);
      }

      if (!cancelled) setInsights(result);
    }

    compute().catch(console.error);
    return () => { cancelled = true; };
  }, [body, mode, year, resolutionId, topic]);

  return insights;
}
