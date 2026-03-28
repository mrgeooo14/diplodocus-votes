import { useEffect, useRef, useState } from 'react';
import { useFilterStore } from '../../store/filterStore';
import type { TopicsIndex, Body } from '../../lib/types';
import { TOPIC_ICONS } from './TopicIcons';
import { fetchJSON } from '../../lib/fetchCache';

interface L2Item {
  label: string;
  count: number;
}

interface L1Group {
  label: string;
  l2: L2Item[];
  totalCount: number;
}

interface SearchResult {
  label: string;
  count: number;
  parentLabel: string | null; // null = L1 result
}

function buildGroups(data: TopicsIndex, body: Body): L1Group[] {
  const prefix = body === 'GA' ? 'A_' : 'S_';
  const map = new Map<string, L2Item[]>();
  const l1Counts = new Map<string, number>();

  for (const [key, ids] of Object.entries(data)) {
    const bodyCount = ids.filter(id => id.startsWith(prefix)).length;
    const sepIdx = key.indexOf(' / ');
    if (sepIdx !== -1) {
      const l1 = key.slice(0, sepIdx);
      const l2 = key.slice(sepIdx + 3);
      if (!map.has(l1)) map.set(l1, []);
      map.get(l1)!.push({ label: l2, count: bodyCount });
    } else {
      l1Counts.set(key, bodyCount);
    }
  }

  return Array.from(map.entries())
    .map(([label, l2]) => ({
      label,
      l2: l2.sort((a, b) => a.label.localeCompare(b.label)),
      totalCount: l1Counts.get(label) ?? l2.reduce((s, x) => s + x.count, 0),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function TopicPickerModal() {
  const { topicPickerOpen, setTopicPickerOpen, topic, setTopic, setTopicResIds, body } = useFilterStore();

  const [topicsData, setTopicsData] = useState<TopicsIndex>({});
  const [groups, setGroups] = useState<L1Group[]>([]);
  const [view, setView] = useState<'l1' | 'l2'>('l1');
  const [activeL1, setActiveL1] = useState<L1Group | null>(null);
  const [animClass, setAnimClass] = useState('animate-fade-in');
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchJSON<TopicsIndex>('/data/aggregates/topics.json').then((data) => {
      setTopicsData(data);
      setGroups(buildGroups(data, body));
    });
  }, []);

  // Rebuild counts when body changes
  useEffect(() => {
    if (Object.keys(topicsData).length > 0) {
      setGroups(buildGroups(topicsData, body));
    }
  }, [body, topicsData]);

  useEffect(() => {
    if (topicPickerOpen) {
      setView('l1');
      setActiveL1(null);
      setQuery('');
      setAnimClass('animate-fade-in');
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [topicPickerOpen]);

  useEffect(() => {
    if (!topicPickerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTopicPickerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [topicPickerOpen, setTopicPickerOpen]);

  if (!topicPickerOpen) return null;

  function drillInto(group: L1Group) {
    setAnimClass('animate-slide-in-right');
    setActiveL1(group);
    setView('l2');
  }

  function goBack() {
    setAnimClass('animate-slide-in-left');
    setView('l1');
    setActiveL1(null);
  }

  function select(fullLabel: string) {
    setTopic(fullLabel);
    setTopicResIds(topicsData[fullLabel] ?? []);
    setTopicPickerOpen(false);
  }

  // Derive search results (counts already body-specific via groups)
  const q = query.trim().toLowerCase();
  const searchResults: SearchResult[] = q
    ? groups.flatMap(g => {
        const results: SearchResult[] = [];
        if (g.label.toLowerCase().includes(q)) {
          results.push({ label: g.label, count: g.totalCount, parentLabel: null });
        }
        for (const l2 of g.l2) {
          if (l2.label.toLowerCase().includes(q) || g.label.toLowerCase().includes(q)) {
            results.push({ label: l2.label, count: l2.count, parentLabel: g.label });
          }
        }
        return results;
      })
    : [];

  const isSearching = q.length > 0;
  const bodyLabel = body === 'GA' ? 'UNGA' : 'UNSC';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.65)' }}
      onMouseDown={() => setTopicPickerOpen(false)}
    >
      <div
        className="flex flex-col rounded-xl border border-[#30363d] bg-[#161b22] shadow-2xl"
        style={{ width: 500, maxHeight: '82vh', boxShadow: '0 24px 56px rgba(0,0,0,0.7)' }}
        onMouseDown={e => e.stopPropagation()}
      >
        {/* ── Header / Search ─────────────────────────────── */}
        <div className="flex items-center gap-3 border-b border-[#30363d] px-4 py-3">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <circle cx="6.5" cy="6.5" r="5.5" stroke="#8b949e" strokeWidth="1.5" />
            <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" stroke="#8b949e" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={searchRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search topics…"
            className="flex-1 bg-transparent text-sm text-[#e6edf3] placeholder-[#484f58] outline-none"
          />
          <span className="shrink-0 rounded border border-[#30363d] px-1.5 py-0.5 text-xs text-[#8b949e]">
            {bodyLabel}
          </span>
          <button
            onClick={() => setTopicPickerOpen(false)}
            className="text-[#8b949e] transition-colors hover:text-[#e6edf3]"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ── Content ──────────────────────────────────────── */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {isSearching ? (
            /* ── Search results (flat list) ── */
            <div key={`search-${q}`} className="animate-fade-in p-3">
              {searchResults.length === 0 ? (
                <p className="px-2 py-8 text-center text-sm text-[#484f58]">No topics match "{query}"</p>
              ) : (
                <ul>
                  {searchResults.map((r, i) => {
                    const fullLabel = r.parentLabel ? `${r.parentLabel} / ${r.label}` : r.label;
                    const isActive = topic === fullLabel;
                    const empty = r.count === 0;
                    return (
                      <li key={i}>
                        <button
                          onClick={() => select(fullLabel)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[#21262d] ${isActive ? 'border border-[#388bfd] bg-[#1c2536]' : ''} ${empty ? 'opacity-40' : ''}`}
                        >
                          <span className="flex flex-col gap-0.5">
                            {r.parentLabel && (
                              <span className="text-xs text-[#8b949e]">{r.parentLabel}</span>
                            )}
                            <span className="text-sm text-[#e6edf3]">{r.label}</span>
                          </span>
                          <span className="ml-3 shrink-0 rounded-full bg-[#21262d] px-2 py-0.5 text-xs text-[#8b949e]">
                            {r.count} res.
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : view === 'l1' ? (
            /* ── L1 topic grid ── */
            <div key="l1" className={`${animClass} grid grid-cols-2 gap-2 p-3`}>
              {groups.map(g => {
                const IconComp = TOPIC_ICONS[g.label];
                const isActive = topic === g.label || (topic?.startsWith(g.label + ' / ') ?? false);
                const empty = g.totalCount === 0;
                return (
                  <button
                    key={g.label}
                    onClick={() => drillInto(g)}
                    className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center transition-all hover:border-[#388bfd] hover:bg-[#1c2536] ${
                      isActive
                        ? 'border-[#388bfd] bg-[#1c2536]'
                        : 'border-[#30363d] bg-[#0d1117]'
                    } ${empty ? 'opacity-40' : ''}`}
                  >
                    {IconComp ? (
                      <IconComp size={44} />
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-[#21262d]" />
                    )}
                    <span className="text-xs font-medium leading-tight text-[#e6edf3]">
                      {g.label}
                    </span>
                    <span className="rounded-full bg-[#21262d] px-2 py-0.5 text-xs text-[#8b949e]">
                      {g.totalCount} res.
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            /* ── L2 subtopic list ── */
            <div key={`l2-${activeL1?.label}`} className={animClass}>
              {/* L2 sub-header */}
              <div className="flex items-center gap-3 border-b border-[#30363d] px-4 py-3">
                <button
                  onClick={goBack}
                  className="flex items-center gap-1.5 text-xs text-[#8b949e] transition-colors hover:text-[#e6edf3]"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M 8,2 L 4,6 L 8,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  All topics
                </button>
                <span className="text-[#30363d]">/</span>
                {activeL1 && TOPIC_ICONS[activeL1.label] && (
                  <span className="shrink-0">{
                    (() => { const I = TOPIC_ICONS[activeL1.label]; return <I size={20} />; })()
                  }</span>
                )}
                <span className="text-sm font-medium text-[#e6edf3]">
                  {activeL1?.label ?? ''}
                </span>
              </div>

              {/* L2 items */}
              <ul className="p-3">
                {activeL1?.l2.map(l2 => {
                  const fullLabel = `${activeL1.label} / ${l2.label}`;
                  const isActive = topic === fullLabel;
                  const empty = l2.count === 0;
                  return (
                    <li key={l2.label}>
                      <button
                        onClick={() => select(fullLabel)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left transition-colors hover:bg-[#21262d] ${
                          isActive ? 'border border-[#388bfd] bg-[#1c2536]' : ''
                        } ${empty ? 'opacity-40' : ''}`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-sm text-[#e6edf3]">{l2.label}</span>
                          {empty && (
                            <span className="rounded border border-[#30363d] px-1.5 py-0.5 text-xs text-[#8b949e]">
                              {body === 'GA' ? 'SC only' : 'GA only'}
                            </span>
                          )}
                        </span>
                        <span className="ml-3 shrink-0 rounded-full bg-[#21262d] px-2 py-0.5 text-xs text-[#8b949e]">
                          {l2.count} res.
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* ── Footer: current selection ─────────────────────── */}
        {topic && !isSearching && (
          <div className="flex items-center justify-between border-t border-[#30363d] px-4 py-2">
            <span className="text-xs text-[#8b949e]">
              Selected:{' '}
              <span className="text-[#58a6ff]">
                {topic.includes(' / ') ? topic.split(' / ')[1] : topic}
              </span>
            </span>
            <button
              onClick={() => { setTopic(null); setTopicResIds(null); setTopicPickerOpen(false); }}
              className="text-xs text-[#8b949e] transition-colors hover:text-[#ef4444]"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
