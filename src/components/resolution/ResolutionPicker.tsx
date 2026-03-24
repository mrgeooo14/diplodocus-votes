import { useEffect, useMemo, useRef, useState } from 'react';
import { useFilterStore } from '../../store/filterStore';
import type { Resolution } from '../../lib/types';

const cache = new Map<string, Resolution[]>();

async function loadResolutions(prefix: string): Promise<Resolution[]> {
  if (cache.has(prefix)) return cache.get(prefix)!;
  const res = await fetch(`/data/${prefix}-resolutions.json`);
  const data: Resolution[] = await res.json();
  cache.set(prefix, data);
  return data;
}

function formatDate(date: string): string {
  const [y, m, d] = date.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
}


function VoteBar({ yes, no, abs, nx }: { yes: number; no: number; abs: number; nx: number }) {
  const total = yes + no + abs + nx || 1;
  return (
    <div
      className="flex h-2 w-20 overflow-hidden rounded-sm"
      title={`Yes: ${yes} · No: ${no} · Abs: ${abs} · NV: ${nx}`}
    >
      <div style={{ width: `${(yes / total) * 100}%`, background: '#22c55e' }} />
      <div style={{ width: `${(no / total) * 100}%`, background: '#ef4444' }} />
      <div style={{ width: `${(abs / total) * 100}%`, background: '#eab308' }} />
      <div style={{ width: `${(nx / total) * 100}%`, background: '#4b5563' }} />
    </div>
  );
}

type SortKey = 'symbol' | 'date' | 'controversy';

export function ResolutionPicker() {
  const { body, year, resolutionId, resolutionPickerOpen, setResolutionPickerOpen, setResolutionId, setMode } =
    useFilterStore();

  const [allResolutions, setAllResolutions] = useState<Resolution[]>([]);
  const [query, setQuery] = useState('');
  const [yearFilter, setYearFilter] = useState<number | null>(year);
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!resolutionPickerOpen) return;
    const prefix = body === 'GA' ? 'ga' : 'sc';
    loadResolutions(prefix).then(setAllResolutions).catch(console.error);
  }, [resolutionPickerOpen, body]);

  useEffect(() => {
    if (resolutionPickerOpen) {
      setQuery('');
      setYearFilter(year);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [resolutionPickerOpen]);

  const availableYears = useMemo(
    () => [...new Set(allResolutions.map(r => r.year))].sort((a, b) => b - a),
    [allResolutions],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let base = allResolutions;
    if (yearFilter !== null) base = base.filter(r => r.year === yearFilter);
    if (q) base = base.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.symbol.toLowerCase().includes(q) ||
      String(r.year).includes(q) ||
      r.subjects.some(s => s.toLowerCase().includes(q)),
    );
    return [...base].sort((a, b) => {
      const cmp = sortKey === 'symbol'
        ? a.symbol.localeCompare(b.symbol)
        : sortKey === 'date'
          ? a.date.localeCompare(b.date)
          : (a.totalNo + a.totalAbstentions) - (b.totalNo + b.totalAbstentions);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [allResolutions, query, yearFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir(key === 'date' ? 'desc' : 'asc'); }
  }

  const arrow = (key: SortKey) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  function select(r: Resolution) {
    setResolutionId(r.id);
    setMode('resolution');
    setResolutionPickerOpen(false);
  }

  if (!resolutionPickerOpen) return null;

  const closeBtn = (
    <button
      onClick={() => setResolutionPickerOpen(false)}
      className="rounded p-1 text-[#8b949e] hover:bg-[#21262d] hover:text-[#e6edf3] transition-colors"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06z"/>
      </svg>
    </button>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) setResolutionPickerOpen(false); }}
    >
      <div
        className="flex h-[78vh] w-[min(900px,92vw)] flex-col rounded-xl border border-[#30363d] bg-[#161b22] shadow-2xl"
        onKeyDown={e => { if (e.key === 'Escape') setResolutionPickerOpen(false); }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#30363d] px-5 py-3.5">
          <span className="text-sm font-semibold text-[#e6edf3]">
            {body === 'GA' ? 'UN General Assembly' : 'UN Security Council'} Resolutions
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#8b949e]">{filtered.length} resolutions</span>
            {closeBtn}
          </div>
        </div>

        {/* Search + filters */}
        <div className="border-b border-[#30363d] px-4 py-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2 focus-within:border-[#388bfd]">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="#8b949e" className="flex-shrink-0">
              <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"/>
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by title, symbol, year or topic…"
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
          <div className="flex items-center gap-2">
            <select
              value={yearFilter ?? ''}
              onChange={e => setYearFilter(e.target.value ? Number(e.target.value) : null)}
              className="rounded border border-[#30363d] bg-[#21262d] px-2 py-1 text-xs text-[#e6edf3] outline-none hover:border-[#8b949e] cursor-pointer"
            >
              <option value="">All years</option>
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            {([
              { label: 'Most Recent', key: 'date' as const, dir: 'desc' as const },
              { label: 'Most Divisive', key: 'controversy' as const, dir: 'desc' as const },
              { label: 'Most Unanimous', key: 'controversy' as const, dir: 'asc' as const },
            ]).map(({ label, key, dir }) => {
              const active = sortKey === key && sortDir === dir;
              return (
                <button
                  key={label}
                  onClick={() => { setSortKey(key); setSortDir(dir); }}
                  className={`rounded px-2 py-1 text-xs transition-colors ${
                    active
                      ? 'bg-[#388bfd] text-white'
                      : 'border border-[#30363d] bg-[#21262d] text-[#8b949e] hover:border-[#8b949e] hover:text-[#e6edf3]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[130px_1fr_80px_100px] gap-3 border-b border-[#30363d] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
          <button onClick={() => toggleSort('symbol')} className="flex items-center gap-0.5 hover:text-[#e6edf3] text-left">
            Symbol{arrow('symbol')}
          </button>
          <span>Title</span>
          <button onClick={() => toggleSort('date')} className="flex items-center gap-0.5 hover:text-[#e6edf3] text-left">
            Date{arrow('date')}
          </button>
          <button onClick={() => toggleSort('controversy')} className="flex items-center gap-0.5 hover:text-[#e6edf3] text-left">
            Votes{arrow('controversy')}
          </button>
        </div>

        {/* Resolution list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center pt-12 text-sm text-[#8b949e]">
              <p>{allResolutions.length === 0 ? 'Loading…' : 'No resolutions match your filters.'}</p>
              {allResolutions.length > 0 && (
                <button
                  onClick={() => { setQuery(''); setYearFilter(null); setSortKey('date'); setSortDir('desc'); }}
                  className="mt-2 text-xs text-[#388bfd] hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
          {filtered.map(r => (
            <button
              key={r.id}
              onClick={() => select(r)}
              className={`grid w-full grid-cols-[130px_1fr_80px_100px] gap-3 border-b border-[#21262d] px-5 py-2.5 text-left transition-colors hover:bg-[#21262d] ${r.id === resolutionId ? 'bg-[#1c2128] ring-1 ring-inset ring-[#388bfd]/40' : ''}`}
            >
              <span className="font-mono text-xs text-[#58a6ff] truncate">{r.symbol}</span>
              <span className="truncate text-xs text-[#e6edf3]" title={r.title}>{r.title}</span>
              <span className="text-xs text-[#8b949e] truncate">{r.date ? formatDate(r.date) : r.year}</span>
              <div className="flex flex-col gap-0.5">
                <VoteBar yes={r.totalYes} no={r.totalNo} abs={r.totalAbstentions} nx={r.totalNonVoting} />
                <span className="text-[10px] text-[#8b949e]">{r.totalYes}Y {r.totalNo}N {r.totalAbstentions}A</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
