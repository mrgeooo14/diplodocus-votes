import { useEffect, useMemo, useRef, useState } from 'react';
import type { TopicsIndex } from '../../lib/types';

interface L2Node { key: string; label: string }
interface L1Node { key: string; label: string; children: L2Node[] }

function buildTree(index: TopicsIndex, body: 'GA' | 'SC'): L1Node[] {
  const prefix = body === 'GA' ? 'A_' : 'S_';
  const map = new Map<string, L2Node[]>();
  for (const [key, ids] of Object.entries(index)) {
    const sep = key.indexOf(' / ');
    if (sep === -1) continue;
    if (!ids.some(id => id.startsWith(prefix))) continue; // no resolutions for this body
    const l1 = key.slice(0, sep);
    const l2 = key.slice(sep + 3);
    if (!map.has(l1)) map.set(l1, []);
    map.get(l1)!.push({ key, label: l2 });
  }
  return [...map.entries()]
    .map(([l1, children]) => ({
      key: l1,
      label: l1,
      children: children.sort((a, b) => a.label.localeCompare(b.label)),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

interface Props {
  topicsIndex: TopicsIndex;
  body: 'GA' | 'SC';
  selected: string[];
  onToggle: (topicKey: string) => void;
  onClearAll: () => void;
}

export function TopicFilterPicker({ topicsIndex, body, selected, onToggle, onClearAll }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [expandedL1, setExpandedL1] = useState<Set<string>>(new Set());
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const tree = useMemo(() => buildTree(topicsIndex, body), [topicsIndex, body]);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (
        !panelRef.current?.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // focus search on open
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 30);
    else setQuery('');
  }, [open]);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const q = query.trim().toLowerCase();

  // flat search results across all L2 nodes
  const searchResults = useMemo(() => {
    if (!q) return [];
    return tree.flatMap(l1 =>
      l1.children
        .filter(l2 => l2.label.toLowerCase().includes(q) || l1.label.toLowerCase().includes(q))
        .map(l2 => ({ l1, l2 }))
    );
  }, [q, tree]);

  function toggleL1Expand(l1Key: string) {
    setExpandedL1(prev => {
      const next = new Set(prev);
      next.has(l1Key) ? next.delete(l1Key) : next.add(l1Key);
      return next;
    });
  }

  // how many L2s in an L1 are selected
  function l1SelectCount(l1: L1Node) {
    return l1.children.filter(c => selectedSet.has(c.key)).length;
  }

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1 rounded border px-2 py-1 text-xs transition-colors ${
          open
            ? 'border-[#388bfd] bg-[#1c2536] text-[#58a6ff]'
            : 'border-[#30363d] bg-[#21262d] text-[#8b949e] hover:border-[#8b949e] hover:text-[#e6edf3]'
        }`}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.5" />
          <line x1="5" y1="2.5" x2="5" y2="7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2.5" y1="5" x2="7.5" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Topics
        {selected.length > 0 && (
          <span className="ml-0.5 rounded-full bg-[#388bfd] px-1.5 py-0.5 text-[10px] font-semibold text-white leading-none">
            {selected.length}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          className="absolute left-0 top-full z-50 mt-1 flex flex-col rounded-lg border border-[#30363d] bg-[#161b22] shadow-2xl"
          style={{ width: 300, maxHeight: 380 }}
        >
          {/* Search */}
          <div className="flex items-center gap-2 border-b border-[#30363d] px-3 py-2">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="#8b949e" className="shrink-0">
              <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z" />
            </svg>
            <input
              ref={searchRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search topics…"
              className="flex-1 bg-transparent text-xs text-[#e6edf3] placeholder-[#484f58] outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-[#8b949e] hover:text-[#e6edf3]">×</button>
            )}
          </div>

          {/* List */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            {q ? (
              /* Search results */
              searchResults.length === 0 ? (
                <p className="px-3 py-4 text-center text-xs text-[#484f58]">No topics match "{query}"</p>
              ) : (
                <ul className="py-1">
                  {searchResults.map(({ l1, l2 }) => {
                    const checked = selectedSet.has(l2.key);
                    return (
                      <li key={l2.key}>
                        <button
                          onClick={() => onToggle(l2.key)}
                          className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left transition-colors hover:bg-[#21262d]"
                        >
                          <Checkbox checked={checked} />
                          <span className="flex flex-col">
                            <span className="text-[10px] text-[#8b949e]">{l1.label}</span>
                            <span className={`text-xs ${checked ? 'text-[#58a6ff]' : 'text-[#e6edf3]'}`}>{l2.label}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )
            ) : (
              /* Tree view */
              <ul className="py-1">
                {tree.map(l1 => {
                  const expanded = expandedL1.has(l1.key);
                  const selCount = l1SelectCount(l1);
                  const partial = selCount > 0 && selCount < l1.children.length;
                  const allSelected = selCount === l1.children.length && l1.children.length > 0;
                  return (
                    <li key={l1.key}>
                      {/* L1 section header */}
                      <button
                        onClick={() => toggleL1Expand(l1.key)}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-left transition-colors hover:bg-[#21262d]"
                      >
                        <svg
                          width="10" height="10" viewBox="0 0 10 10" fill="none"
                          className={`shrink-0 text-[#8b949e] transition-transform ${expanded ? 'rotate-90' : ''}`}
                        >
                          <path d="M3 2 L7 5 L3 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className={`flex-1 text-xs font-medium ${allSelected ? 'text-[#58a6ff]' : partial ? 'text-[#c9d1d9]' : 'text-[#8b949e]'}`}>
                          {l1.label}
                        </span>
                        {selCount > 0 && (
                          <span className="rounded-full bg-[#388bfd]/20 px-1.5 py-0.5 text-[10px] text-[#58a6ff]">
                            {selCount}
                          </span>
                        )}
                      </button>

                      {/* L2 items */}
                      {expanded && (
                        <ul>
                          {l1.children.map(l2 => {
                            const checked = selectedSet.has(l2.key);
                            return (
                              <li key={l2.key}>
                                <button
                                  onClick={() => onToggle(l2.key)}
                                  className="flex w-full items-center gap-2.5 py-1.5 pl-8 pr-3 text-left transition-colors hover:bg-[#21262d]"
                                >
                                  <Checkbox checked={checked} />
                                  <span className={`text-xs ${checked ? 'text-[#58a6ff]' : 'text-[#e6edf3]'}`}>{l2.label}</span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          {selected.length > 0 && (
            <div className="border-t border-[#30363d] px-3 py-2">
              <button
                onClick={() => { onClearAll(); setOpen(false); }}
                className="text-xs text-[#8b949e] transition-colors hover:text-[#ef4444]"
              >
                Clear all ({selected.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div
      className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition-colors ${
        checked ? 'border-[#388bfd] bg-[#388bfd]' : 'border-[#484f58] bg-transparent'
      }`}
    >
      {checked && (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}
