import { useEffect, useMemo, useState } from 'react';
import type { ScVeto } from '../../lib/types';
import { DiploLogo } from '../layout/DiploLogo';

let vetoCache: ScVeto[] | null = null;
let cachePromise: Promise<ScVeto[]> | null = null;

function loadVetoes(): Promise<ScVeto[]> {
  if (vetoCache) return Promise.resolve(vetoCache);
  if (!cachePromise) cachePromise = fetch('/data/DPPA-SCVETOES.json').then(r => r.json()).then(d => { vetoCache = d; return d; });
  return cachePromise;
}

function formatTs(ts: number): string {
  const d = new Date(ts);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

const P5: { key: keyof ScVeto; label: string }[] = [
  { key: 'united_states', label: 'US' },
  { key: 'russian_federation_ussr', label: 'RU' },
  { key: 'china', label: 'CN' },
  { key: 'united_kingdom', label: 'UK' },
  { key: 'france', label: 'FR' },
];

// Extract meaningful keywords from a topic label for agenda matching
function topicKeywords(topic: string): string[] {
  const l2 = topic.includes(' / ') ? topic.split(' / ')[1] : topic;
  return l2
    .split(/[\s&,/()]+/)
    .map(w => w.toLowerCase())
    .filter(w => w.length >= 4 && !['with','from','their','this','that','into'].includes(w));
}

interface Props {
  query: string;
  yearFilter: number | null;
  sortDir?: 'asc' | 'desc';
  topicFilter?: string | null;
}

export function VetoList({ query, yearFilter, sortDir = 'desc', topicFilter = null }: Props) {
  const [vetoes, setVetoes] = useState<ScVeto[]>([]);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  useEffect(() => { loadVetoes().then(setVetoes).catch(console.error); }, []);

  const keywords = useMemo(() => topicFilter ? topicKeywords(topicFilter) : [], [topicFilter]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let base = vetoes.filter(v => v.year >= 1992);
    if (yearFilter !== null) base = base.filter(v => v.year === yearFilter);
    if (q) base = base.filter(v =>
      v['draft_res#'].toLowerCase().includes(q) ||
      v.short_agenda.toLowerCase().includes(q) ||
      v.agenda.toLowerCase().includes(q) ||
      String(v.year).includes(q),
    );
    if (keywords.length > 0) {
      base = base.filter(v => {
        const text = (v.agenda + ' ' + v.short_agenda).toLowerCase();
        return keywords.some(kw => text.includes(kw));
      });
    }
    return [...base].sort((a, b) => sortDir === 'desc' ? b.date - a.date : a.date - b.date);
  }, [vetoes, query, yearFilter, keywords, sortDir]);

  if (filtered.length === 0) {
    return (
      <p className="px-5 pt-8 text-center text-sm text-[#8b949e]">
        {vetoes.length === 0 ? 'Loading…' : 'No vetoed drafts match your filters.'}
      </p>
    );
  }

  return (
    <>
      {filtered.map(v => (
        <button
          key={v.id}
          onClick={() => setPendingUrl(v['url_for_res#'])}
          className="grid w-full grid-cols-[130px_1fr_80px_100px] gap-3 border-b border-[#21262d] px-5 py-2.5 text-left transition-colors hover:bg-[#21262d]"
        >
          <span className="font-mono text-xs text-[#58a6ff] truncate">{v['draft_res#']}</span>
          <span className="truncate text-xs text-[#e6edf3]" title={v.agenda}>{v.short_agenda}</span>
          <span className="text-xs text-[#8b949e]">{formatTs(v.date)}</span>
          <div className="flex items-center gap-1">
            {P5.map(({ key, label }) => (
              <span key={label} className={`text-[10px] font-semibold ${v[key] ? 'text-[#ef4444]' : 'text-[#30363d]'}`}>
                {label}
              </span>
            ))}
          </div>
        </button>
      ))}

      {pendingUrl && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-xl"
          onClick={() => setPendingUrl(null)}
        >
          <div
            className="flex flex-col gap-3 rounded-xl border border-[#30363d] bg-[#161b22] p-5 shadow-2xl w-72"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <DiploLogo size={32} />
              <div className="relative rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-2.5 flex-1">
                <div className="absolute -left-[5px] top-3 h-2.5 w-2.5 rotate-45 border-l border-b border-[#30363d] bg-[#21262d]" />
                <p className="text-xs text-[#8b949e] leading-relaxed">
                  <span className="font-semibold text-[#e6edf3]">Delphi:</span>{' '}
                  This redirects you to a UN document outside of DiploDocus. Proceed?
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPendingUrl(null)}
                className="flex-1 rounded border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-xs text-[#8b949e] hover:border-[#8b949e] hover:text-[#e6edf3] transition-colors"
              >
                Cancel
              </button>
              <a
                href={pendingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setPendingUrl(null)}
                className="flex-1 rounded bg-[#388bfd] px-3 py-1.5 text-xs text-white hover:bg-[#58a6ff] transition-colors text-center"
              >
                Open
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
