import { useEffect, useState } from 'react';
import { useFilterStore } from '../store/filterStore';
import type { TopicsIndex } from '../lib/types';
import { fetchJSON } from '../lib/fetchCache';

// Build reverse map: resolutionId → top-level topic names (no sub-topics)
let reverseMap: Map<string, string[]> | null = null;

async function getReverseMap(): Promise<Map<string, string[]>> {
  if (reverseMap) return reverseMap;
  const index = await fetchJSON<TopicsIndex>('/data/aggregates/topics.json');
  const map = new Map<string, string[]>();
  for (const [topic, ids] of Object.entries(index)) {
    if (topic.includes('/')) continue; // skip sub-topics
    for (const id of ids) {
      if (!map.has(id)) map.set(id, []);
      map.get(id)!.push(topic);
    }
  }
  reverseMap = map;
  return map;
}

export function useResolutionTopics(): string[] {
  const { mode, resolutionId } = useFilterStore();
  const [topics, setTopics] = useState<string[]>([]);

  useEffect(() => {
    if (mode !== 'resolution' || !resolutionId) {
      setTopics([]);
      return;
    }
    let cancelled = false;
    getReverseMap()
      .then(map => { if (!cancelled) setTopics(map.get(resolutionId) ?? []); })
      .catch(console.error);
    return () => { cancelled = true; };
  }, [mode, resolutionId]);

  return topics;
}
