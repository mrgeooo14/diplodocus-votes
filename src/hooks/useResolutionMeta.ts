import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabase';
import { useFilterStore } from '../store/filterStore';
import type { ResolutionMeta } from '../lib/types';

export type { ResolutionMeta };

const cache = new Map<string, ResolutionMeta | null>();

export function useResolutionMeta(): ResolutionMeta | null {
  const { mode, resolutionId, resolutionMeta, setResolutionMeta } = useFilterStore();
  const [fetchedMeta, setFetchedMeta] = useState<ResolutionMeta | null>(null);

  useEffect(() => {
    if (mode !== 'resolution' || !resolutionId) {
      setFetchedMeta(null);
      return;
    }

    // Already populated and belongs to this resolution — no fetch needed
    if (resolutionMeta?.symbol === resolutionId.replace(/_/g, '/')) return;

    if (cache.has(resolutionId)) {
      const cached = cache.get(resolutionId) ?? null;
      setResolutionMeta(cached);
      return;
    }

    let cancelled = false;
    const sb = getSupabase();
    if (!sb) return;

    sb.from('resolutions')
      .select('symbol, title, resolution_subjects(subjects(label))')
      .eq('id', resolutionId)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) { cache.set(resolutionId, null); return; }

        type SubjectJoin = { subjects: { label: string } | null };
        const subjects = ((data.resolution_subjects as unknown as SubjectJoin[]) ?? [])
          .map(rs => rs.subjects?.label)
          .filter((l): l is string => Boolean(l));

        const result: ResolutionMeta = { symbol: data.symbol, title: data.title, subjects };
        cache.set(resolutionId, result);
        setResolutionMeta(result);
      });

    return () => { cancelled = true; };
  }, [mode, resolutionId, resolutionMeta, setResolutionMeta]);

  if (mode !== 'resolution' || !resolutionId) return null;
  return resolutionMeta ?? fetchedMeta;
}
