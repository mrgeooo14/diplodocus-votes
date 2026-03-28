import { useEffect, useState } from 'react';
import { getAuthenticatedSupabase } from '../lib/supabase';
import { useFilterStore } from '../store/filterStore';

export interface ResolutionContent {
  fullText: string;
}

const cache = new Map<string, ResolutionContent | null>();

const MIN_INTERVAL_MS = 500;
let lastFetchAt = 0;

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

    (async () => {
      // Throttle: enforce a minimum interval between fetches to slow browser-based bots.
      const now = Date.now();
      const wait = Math.max(0, MIN_INTERVAL_MS - (now - lastFetchAt));
      lastFetchAt = now + wait;
      if (wait > 0) await new Promise<void>(r => setTimeout(r, wait));
      if (cancelled) { setLoading(false); return; }

      const sb = await getAuthenticatedSupabase();
      if (!sb || cancelled) { setLoading(false); return; }

      const { data, error } = await sb
        .from('resolution_content')
        .select('full_text')
        .eq('resolution_id', resolutionId)
        .single();

      if (cancelled) return;
      if (error || !data) {
        if (error) console.warn('[useResolutionContent]', resolutionId, error.message);
        // Don't cache misses — allow retry if Supabase wasn't ready yet
        setContent(null);
      } else {
        const result: ResolutionContent = { fullText: data.full_text ?? '' };
        cache.set(resolutionId, result);
        setContent(result);
      }
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [mode, resolutionId]);

  return { content, loading };
}
