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
  // Exact match OR SC-style "SYMBOL(YEAR)" suffix — prevents false positives from includes()
  return all.find(r => {
    const sym = r.symbol.toLowerCase();
    return sym === needle || sym.startsWith(needle + '(');
  }) ?? null;
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
      className="group flex w-full items-start gap-1.5 rounded-md border border-[#1f6feb]/50 bg-[#0d1117] px-3 py-2 text-left transition-all hover:border-[#58a6ff] hover:bg-[#1f6feb]/10"
    >
      <span className="mt-0.5 shrink-0 font-mono text-[10px] font-semibold text-[#58a6ff]">
        {res.symbol}
      </span>
      <span className="flex-1 text-[10px] leading-snug text-[#8b949e] group-hover:text-[#c9d1d9]">
        — {res.label}
      </span>
      <span className="mt-0.5 shrink-0 text-[10px] text-[#58a6ff] opacity-60 group-hover:opacity-100">
        →
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
        <div className="mt-3 space-y-1.5">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-[#8b949e]">
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
