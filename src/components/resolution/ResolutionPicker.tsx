import { useEffect, useMemo, useRef, useState } from 'react';
import { useFilterStore } from '../../store/filterStore';
import type { Resolution } from '../../lib/types';

const cache = new Map<string, Resolution[]>();

async function loadResolutions(prefix: string): Promise<Resolution[]> {
  const key = prefix;
  if (cache.has(key)) return cache.get(key)!;
  const res = await fetch(`/data/${prefix}-resolutions.json`);
  const data: Resolution[] = await res.json();
  cache.set(key, data);
  return data;
}

function VoteBar({ yes, no, abs, nx }: { yes: number; no: number; abs: number; nx: number }) {
  const total = yes + no + abs + nx || 1;
  return (
    <div className="flex h-2 w-20 overflow-hidden rounded-sm">
      <div style={{ width: `${(yes / total) * 100}%`, background: '#22c55e' }} />
      <div style={{ width: `${(no / total) * 100}%`, background: '#ef4444' }} />
      <div style={{ width: `${(abs / total) * 100}%`, background: '#eab308' }} />
      <div style={{ width: `${(nx / total) * 100}%`, background: '#4b5563' }} />
    </div>
  );
}

export function ResolutionPicker() {
  const { body, year, resolutionPickerOpen, setResolutionPickerOpen, setResolutionId, setMode } =
    useFilterStore();

  const [allResolutions, setAllResolutions] = useState<Resolution[]>([]);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Load resolutions when picker opens
  useEffect(() => {
    if (!resolutionPickerOpen) return;
    const prefix = body === 'GA' ? 'ga' : 'sc';
    loadResolutions(prefix).then(setAllResolutions).catch(console.error);
  }, [resolutionPickerOpen, body]);

  // Focus search when opened
  useEffect(() => {
    if (resolutionPickerOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [resolutionPickerOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? allResolutions
      : allResolutions.filter(r => r.year === year);
    if (!q) return base;
    return base.filter(
      r =>
        r.title.toLowerCase().includes(q) ||
        r.symbol.toLowerCase().includes(q) ||
        String(r.year).includes(q),
    ).slice(0, 200);
  }, [allResolutions, query, year]);

  function select(r: Resolution) {
    setResolutionId(r.id);
    setMode('resolution');
    setResolutionPickerOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') setResolutionPickerOpen(false);
  }

  if (!resolutionPickerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) setResolutionPickerOpen(false); }}
    >
      <div
        className="flex h-[78vh] w-[min(900px,92vw)] flex-col rounded-xl border border-[#30363d] bg-[#161b22] shadow-2xl"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#30363d] px-5 py-3.5">
          <div>
            <span className="text-sm font-semibold text-[#e6edf3]">
              {body === 'GA' ? 'UN General Assembly' : 'UN Security Council'} Resolutions
            </span>
            {!query && (
              <span className="ml-2 text-xs text-[#8b949e]">— {year} · {filtered.length} resolutions</span>
            )}
            {query && (
              <span className="ml-2 text-xs text-[#8b949e]">— {filtered.length} results</span>
            )}
          </div>
          <button
            onClick={() => setResolutionPickerOpen(false)}
            className="rounded p-1 text-[#8b949e] hover:bg-[#21262d] hover:text-[#e6edf3] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06z"/>
            </svg>
          </button>
        </div>

        {/* Search bar */}
        <div className="border-b border-[#30363d] px-4 py-3">
          <div className="flex items-center gap-2 rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2 focus-within:border-[#388bfd]">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="#8b949e" className="flex-shrink-0">
              <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"/>
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by title, symbol or year…"
              className="flex-1 bg-transparent text-sm text-[#e6edf3] placeholder-[#8b949e] outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-[#8b949e] hover:text-[#e6edf3]">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06z"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[130px_1fr_60px_90px] gap-3 border-b border-[#30363d] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
          <span>Symbol</span>
          <span>Title</span>
          <span>Year</span>
          <span>Votes</span>
        </div>

        {/* Resolution list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="px-5 pt-8 text-center text-sm text-[#8b949e]">
              {allResolutions.length === 0 ? 'Loading…' : 'No resolutions found.'}
            </p>
          )}
          {filtered.map(r => (
            <button
              key={r.id}
              onClick={() => select(r)}
              className="grid w-full grid-cols-[130px_1fr_60px_90px] gap-3 border-b border-[#21262d] px-5 py-2.5 text-left transition-colors hover:bg-[#21262d]"
            >
              <span className="font-mono text-xs text-[#58a6ff] truncate">{r.symbol}</span>
              <span className="truncate text-xs text-[#e6edf3]" title={r.title}>{r.title}</span>
              <span className="text-xs text-[#8b949e]">{r.year}</span>
              <div className="flex flex-col gap-0.5">
                <VoteBar yes={r.totalYes} no={r.totalNo} abs={r.totalAbstentions} nx={r.totalNonVoting} />
                <span className="text-[10px] text-[#8b949e]">
                  {r.totalYes}Y {r.totalNo}N {r.totalAbstentions}A
                </span>
              </div>
            </button>
          ))}
          {query && filtered.length === 200 && (
            <p className="px-5 py-3 text-center text-xs text-[#8b949e]">
              Showing first 200 results — refine your search to narrow down.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
