import { useState } from 'react';
import { useResolutionContent } from '../../hooks/useResolutionContent';
import { useResolutionMeta } from '../../hooks/useResolutionMeta';
import { ResolutionFullTextModal } from './ResolutionFullTextModal';

export function ResolutionContentPanel() {
  const meta = useResolutionMeta();
  const { content, loading } = useResolutionContent();
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

      {/* Excerpt */}
      {loading ? (
        <p className="text-xs text-[#8b949e]">Loading text…</p>
      ) : content?.excerpt ? (
        <>
          <p className="mb-3 text-xs italic leading-relaxed text-[#8b949e] line-clamp-6">
            {content.excerpt}
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="text-xs text-[#58a6ff] transition-colors hover:text-[#79c0ff]"
          >
            View full resolution →
          </button>
        </>
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
