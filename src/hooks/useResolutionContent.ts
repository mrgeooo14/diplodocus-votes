import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabase';
import { useFilterStore } from '../store/filterStore';

export interface ResolutionContent {
  fullText: string;
}

const cache = new Map<string, ResolutionContent | null>();

export function useResolutionContent(): { content: ResolutionContent | null; loading: boolean } {
  const { mode, resolutionId } = useFilterStore();
  const [content, setContent] = useState<ResolutionContent | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode !== 'resolution' || !resolutionId) {
      setContent(null);
      return;
    }

    if (cache.has(resolutionId)) {
      setContent(cache.get(resolutionId) ?? null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const sb = getSupabase();
    if (!sb) { setLoading(false); return; }

    sb.from('resolution_content')
      .select('full_text')
      .eq('resolution_id', resolutionId)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          if (error) console.warn('[useResolutionContent]', resolutionId, error.message);
          // Don't cache misses — allow retry if Supabase wasn't ready yet
          setContent(null);
        } else {
          const result: ResolutionContent = {
            fullText: data.full_text ?? '',
          };
          cache.set(resolutionId, result);
          setContent(result);
        }
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [mode, resolutionId]);

  return { content, loading };
}
