import { useEffect } from 'react';
import type { ResolutionContent } from '../../hooks/useResolutionContent';
import type { ResolutionMeta } from '../../hooks/useResolutionMeta';

interface Props {
  meta: ResolutionMeta;
  content: ResolutionContent;
  onClose: () => void;
}

export function ResolutionFullTextModal({ meta, content, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative mx-4 flex max-h-[80vh] w-full max-w-2xl flex-col rounded-lg border border-[#30363d] bg-[#0d1117]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#30363d] px-5 py-4">
          <div>
            <p className="text-xs font-semibold text-[#58a6ff]">{meta.symbol}</p>
            <p className="mt-0.5 text-sm font-medium leading-snug text-[#e6edf3]">{meta.title}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 mt-0.5 shrink-0 text-[#8b949e] transition-colors hover:text-[#e6edf3]"
          >
            ✕
          </button>
        </div>

        {/* Full text */}
        <div className="overflow-y-auto px-5 py-4">
          <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-[#c9d1d9]">
            {content.fullText || 'Full text not available.'}
          </pre>
        </div>
      </div>
    </div>
  );
}
