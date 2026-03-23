import { useEffect, useState } from 'react';
import { useFilterStore } from '../store/filterStore';
import type { ScVeto } from '../lib/types';

const fetchCache = new Map<string, unknown>();

async function fetchJSON<T>(url: string): Promise<T> {
  if (fetchCache.has(url)) return fetchCache.get(url) as T;
  const res = await fetch(url);
  const data: T = await res.json();
  fetchCache.set(url, data);
  return data;
}

export type VetoMemberKey =
  | 'russian_federation_ussr'
  | 'united_states'
  | 'united_kingdom'
  | 'china'
  | 'france';

export interface VetoCounts {
  russian_federation_ussr: number;
  united_states: number;
  united_kingdom: number;
  china: number;
  france: number;
  total: number;
}

const MEMBERS: VetoMemberKey[] = [
  'russian_federation_ussr',
  'united_states',
  'united_kingdom',
  'china',
  'france',
];

export interface VetoDataResult {
  counts: VetoCounts | null;
  records: ScVeto[];
  loading: boolean;
}

export function useVetoData(): VetoDataResult {
  const { body, mode, year } = useFilterStore();
  const [state, setState] = useState<VetoDataResult>({
    counts: null,
    records: [],
    loading: false,
  });

  useEffect(() => {
    // Only show in SC year mode (1992+)
    if (body !== 'SC' || mode !== 'year') {
      setState({ counts: null, records: [], loading: false });
      return;
    }

    setState(prev => ({ ...prev, loading: true }));
    let cancelled = false;

    async function load() {
      const all = await fetchJSON<ScVeto[]>('/data/DPPA-SCVETOES.json');
      const records = all.filter(v => v.year >= 1992 && v.year === year);

      const counts: VetoCounts = {
        russian_federation_ussr: 0,
        united_states: 0,
        united_kingdom: 0,
        china: 0,
        france: 0,
        total: 0,
      };

      for (const v of records) {
        for (const m of MEMBERS) {
          counts[m] += v[m];
        }
      }
      counts.total = MEMBERS.reduce((s, m) => s + counts[m], 0);

      if (!cancelled) setState({ counts, records, loading: false });
    }

    load().catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [body, mode, year]);

  return state;
}
