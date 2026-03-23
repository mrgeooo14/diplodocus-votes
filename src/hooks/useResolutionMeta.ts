import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabase';
import { useFilterStore } from '../store/filterStore';

export interface ResolutionMeta {
  symbol: string;
  title: string;
  subjects: string[];
}

const cache = new Map<string, ResolutionMeta | null>();

export function useResolutionMeta(): ResolutionMeta | null {
  const { mode, resolutionId } = useFilterStore();
  const [meta, setMeta] = useState<ResolutionMeta | null>(null);

  useEffect(() => {
    if (mode !== 'resolution' || !resolutionId) {
      setMeta(null);
      return;
    }

    if (cache.has(resolutionId)) {
      setMeta(cache.get(resolutionId) ?? null);
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
        if (error || !data) {
          cache.set(resolutionId, null);
          setMeta(null);
          return;
        }

        type SubjectJoin = { subjects: { label: string } | null };
        const subjects = ((data.resolution_subjects as SubjectJoin[]) ?? [])
          .map(rs => rs.subjects?.label)
          .filter((l): l is string => Boolean(l));

        const result: ResolutionMeta = { symbol: data.symbol, title: data.title, subjects };
        cache.set(resolutionId, result);
        setMeta(result);
      });

    return () => { cancelled = true; };
  }, [mode, resolutionId]);

  return meta;
}
