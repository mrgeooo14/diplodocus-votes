import { useEffect, useState } from 'react';
import { useFilterStore } from '../store/filterStore';
import type { Resolution, TopicsIndex } from '../lib/types';
import { computeSignificanceScore } from '../lib/delphiInsights';
import { fetchJSON } from '../lib/fetchCache';

export function useResolutionSignificance(): number | null {
  const { body, mode, resolutionId, resolutionMeta } = useFilterStore();
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    if (mode !== 'resolution' || !resolutionId) {
      setScore(null);
      return;
    }
    let cancelled = false;
    const prefix = body === 'GA' ? 'ga' : 'sc';

    async function compute() {
      const allRes = await fetchJSON<Resolution[]>(`/data/${prefix}-resolutions.json`);
      const resolution = allRes.find(r => r.id === resolutionId);
      if (!resolution) { if (!cancelled) setScore(null); return; }

      // Compute topic baseline if we have subjects
      let topicAvgYesRate: number | null = null;
      const subjects = resolutionMeta?.subjects ?? resolution.subjects ?? [];
      if (subjects.length > 0) {
        const topicsIndex = await fetchJSON<TopicsIndex>('/data/aggregates/topics.json');
        const topicKey = subjects[0];
        const ids = topicsIndex[topicKey] ?? [];
        if (ids.length > 3) {
          const topicResolutions = allRes.filter(r => ids.includes(r.id));
          const rates = topicResolutions.map(r => {
            const t = r.totalYes + r.totalNo + r.totalAbstentions;
            return t > 0 ? r.totalYes / t : null;
          }).filter((r): r is number => r !== null);
          if (rates.length > 0) {
            topicAvgYesRate = rates.reduce((a, b) => a + b, 0) / rates.length;
          }
        }
      }

      if (!cancelled) setScore(computeSignificanceScore(resolution, topicAvgYesRate));
    }

    compute().catch(console.error);
    return () => { cancelled = true; };
  }, [body, mode, resolutionId, resolutionMeta]);

  return score;
}
