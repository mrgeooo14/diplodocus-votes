import { useState, useEffect, useRef } from 'react';
import { DiploLogo } from '../layout/DiploLogo';
import { useDelphiInsights } from '../../hooks/useDelphiInsights';
import type { Insight } from '../../lib/types';

const KIND_ICON: Record<Insight['kind'], string> = {
  stat: '·',
  trend: '↗',
  record: '★',
  today: '◷',
};

const KIND_COLOR: Record<Insight['kind'], string> = {
  stat: '#8b949e',
  trend: '#58a6ff',
  record: '#eab308',
  today: '#a78bfa',
};

function InsightLine({ insight }: { insight: Insight }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="flex items-start gap-2 transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <DiploLogo size={16} />
      <p className="flex-1 text-xs leading-relaxed text-[#c9d1d9]">
        <span
          className="mr-1 font-semibold"
          style={{ color: KIND_COLOR[insight.kind] }}
        >
          {KIND_ICON[insight.kind]}
        </span>
        {insight.text}
      </p>
    </div>
  );
}

export function DelphiPanel() {
  const insights = useDelphiInsights();
  const [open, setOpen] = useState(true);
  const prevInsightsRef = useRef<string>('');
  const [key, setKey] = useState(0);

  // Re-animate when insights change
  const insightsSig = insights.map(i => i.id + i.text).join('|');
  useEffect(() => {
    if (insightsSig !== prevInsightsRef.current) {
      prevInsightsRef.current = insightsSig;
      setKey(k => k + 1);
    }
  }, [insightsSig]);

  if (insights.length === 0) return null;

  return (
    <div className="border-t border-[#30363d] pt-4 pb-4 px-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="mb-3 flex w-full items-center gap-2 text-left"
      >
        <DiploLogo size={20} />
        <span className="flex-1 text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
          Delphi
        </span>
        <span className="text-xs text-[#8b949e]">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div key={key} className="space-y-2.5">
          {insights.map(insight => (
            <InsightLine key={insight.id} insight={insight} />
          ))}
        </div>
      )}
    </div>
  );
}
