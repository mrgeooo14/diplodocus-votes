import { useCallback, useRef } from 'react';
import { useFilterStore } from '../../store/filterStore';
import { YEAR_SUMMARIES, type KeyResolution } from '../../lib/yearSummaries';
import type { Resolution } from '../../lib/types';

const resCache = new Map<string, Resolution[]>();

async function findResolution(symbol: string): Promise<Resolution | null> {
  // Infer body from symbol prefix
  const prefix = symbol.startsWith('S/') ? 'sc' : 'ga';
  if (!resCache.has(prefix)) {
    const res = await fetch(`/data/${prefix}-resolutions.json`);
    const data: Resolution[] = await res.json();
    resCache.set(prefix, data);
  }
  const all = resCache.get(prefix)!;
  const needle = symbol.trim().toLowerCase();
  return all.find(r => r.symbol.toLowerCase().includes(needle)) ?? null;
}

function ResolutionLink({ res }: { res: KeyResolution }) {
  const { setResolutionId, setMode } = useFilterStore();
  const loading = useRef(false);

  const handleClick = useCallback(async () => {
    if (loading.current) return;
    loading.current = true;
    try {
      const found = await findResolution(res.symbol);
      if (found) {
        setResolutionId(found.id);
        setMode('resolution');
      }
    } finally {
      loading.current = false;
    }
  }, [res.symbol, setResolutionId, setMode]);

  return (
    <button
      onClick={handleClick}
      className="group flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-[#21262d]"
    >
      <span className="mt-px shrink-0 font-mono text-[10px] text-[#58a6ff] group-hover:text-white">
        {res.symbol}
      </span>
      <span className="text-[10px] leading-snug text-[#8b949e] group-hover:text-[#c9d1d9]">
        {res.label} →
      </span>
    </button>
  );
}

export function YearContext() {
  const { year, body } = useFilterStore();
  const bodySummaries = YEAR_SUMMARIES[body];
  const summary = bodySummaries?.[year];
  if (!summary) return null;

  return (
    <div className="border-b border-[#30363d] pb-4 pt-4 px-4">
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
        {year} in context
      </p>
      <p className="mb-1 text-xs font-semibold text-[#e6edf3]">{summary.headline}</p>
      <p className="mb-2 text-xs leading-relaxed text-[#8b949e]">{summary.body}</p>
      {summary.keyResolutions && summary.keyResolutions.length > 0 && (
        <div className="-mx-2">
          <p className="mb-0.5 px-2 text-[9px] font-semibold uppercase tracking-wider text-[#8b949e]">
            Key resolutions
          </p>
          {summary.keyResolutions.map(r => (
            <ResolutionLink key={r.symbol} res={r} />
          ))}
        </div>
      )}
    </div>
  );
}
