import { useState } from 'react';
import { useResolutionContent } from '../../hooks/useResolutionContent';
import { useResolutionMeta } from '../../hooks/useResolutionMeta';
import { useResolutionSignificance } from '../../hooks/useResolutionSignificance';
import { DiploLogo } from '../layout/DiploLogo';
import { ResolutionFullTextModal } from './ResolutionFullTextModal';

function SignificanceBadge({ score }: { score: number }) {
  const label = score >= 70 ? 'High' : score >= 40 ? 'Notable' : 'Routine';
  const color = score >= 70 ? '#ef4444' : score >= 40 ? '#eab308' : '#8b949e';
  return (
    <div className="mb-2 flex items-center gap-1.5">
      <DiploLogo size={14} />
      <span className="text-[10px] text-[#8b949e]">Significance</span>
      <div className="flex-1 h-1.5 rounded-full bg-[#21262d] overflow-hidden">
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] font-semibold" style={{ color }}>{label}</span>
    </div>
  );
}

export function ResolutionContentPanel() {
  const meta = useResolutionMeta();
  const { content, loading } = useResolutionContent();
  const significance = useResolutionSignificance();
  const [modalOpen, setModalOpen] = useState(false);

  if (!meta) {
    return (
      <div className="px-4 pb-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
          Resolution
        </p>
        {loading ? (
          <p className="text-xs text-[#8b949e]">Loading…</p>
        ) : (
          <p className="text-xs text-[#8b949e] italic">Details unavailable.</p>
        )}
      </div>
    );
  }

  return (
    <div className="px-4 pb-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
        Resolution
      </p>

      {/* Symbol + title */}
      <p className="mb-0.5 text-xs font-semibold text-[#58a6ff]">{meta.symbol}</p>
      <p className="mb-2 text-xs leading-snug text-[#e6edf3]">{meta.title}</p>

      {/* Significance badge */}
      {significance !== null && <SignificanceBadge score={significance} />}

      {/* Subject tags */}
      {meta.subjects.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {meta.subjects.map(s => (
            <span
              key={s}
              className="rounded-full bg-[#21262d] px-2 py-0.5 text-[10px] text-[#8b949e]"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-xs text-[#8b949e]">Loading text…</p>
      ) : content?.fullText ? (
        <button
          onClick={() => setModalOpen(true)}
          className="text-xs text-[#58a6ff] transition-colors hover:text-[#79c0ff]"
        >
          View full resolution →
        </button>
      ) : (
        <p className="text-xs italic text-[#8b949e]">Text not available.</p>
      )}

      {/* Modal */}
      {modalOpen && content && (
        <ResolutionFullTextModal
          meta={meta}
          content={content}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
