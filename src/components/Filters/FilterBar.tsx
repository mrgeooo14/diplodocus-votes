import { useFilterStore } from '../../store/filterStore';
import type { FilterMode } from '../../lib/types';
import { BodyToggle } from './BodyToggle';
import { YearSlider } from './YearSlider';
import { TopicPickerModal } from './TopicPickerModal';


const MODES: { value: FilterMode; label: string }[] = [
  { value: 'year', label: 'Year' },
  { value: 'topic', label: 'Topic' },
  { value: 'resolution', label: 'Resolution' },
];

export function FilterBar() {
  const { mode, setMode, resolutionId, setResolutionPickerOpen, topic, setTopic, setTopicPickerOpen, setTopicResIds } = useFilterStore();

  return (
    <>
    <header className="flex items-center gap-4 border-b border-[#30363d] bg-[#161b22] px-4 py-2">
      <span className="text-sm font-bold tracking-wide text-[#e6edf3]">DiploDocus</span>

      <div className="h-4 w-px bg-[#30363d]" />

      <BodyToggle />

      <div className="h-4 w-px bg-[#30363d]" />

      <div className="flex gap-0.5 rounded-md border border-[#30363d] p-0.5">
        {MODES.map(m => (
          <button
            key={m.value}
            onClick={() => {
              setMode(m.value);
              if (m.value === 'resolution') {
                setTopicResIds(null); // resolution tab always shows full unfiltered list
                setResolutionPickerOpen(true);
              }
            }}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              mode === m.value
                ? 'bg-[#21262d] text-[#e6edf3]'
                : 'text-[#8b949e] hover:text-[#e6edf3]'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-[#30363d]" />

      {mode === 'year' && <YearSlider />}
      {mode === 'topic' && (
        <>
          {topic ? (
            <>
              <span className="text-xs text-[#8b949e]">Selected Topic:</span>
              <button
                onClick={() => setTopicPickerOpen(true)}
                className="text-xs text-[#58a6ff] transition-colors hover:text-[#e6edf3]"
              >
                {topic.includes(' / ') ? topic.split(' / ')[1] : topic}
              </button>
              <button
                onClick={() => setResolutionPickerOpen(true)}
                className="rounded border border-[#30363d] bg-[#21262d] px-2 py-0.5 text-xs text-[#8b949e] transition-colors hover:border-[#8b949e] hover:text-[#e6edf3]"
                title="Browse resolutions for this topic"
              >
                Browse resolutions
              </button>
              <button
                onClick={() => { setTopic(null); setTopicResIds(null); }}
                className="text-xs text-[#8b949e] transition-colors hover:text-[#ef4444]"
                aria-label="Clear topic"
              >
                ×
              </button>
            </>
          ) : (
            <button
              onClick={() => setTopicPickerOpen(true)}
              className="text-xs text-[#58a6ff] transition-colors hover:text-[#e6edf3]"
            >
              Select topic…
            </button>
          )}
        </>
      )}
      {mode === 'resolution' && (
        <button
          onClick={() => setResolutionPickerOpen(true)}
          className="text-xs text-[#58a6ff] hover:text-[#e6edf3] transition-colors"
        >
          {resolutionId ? `${resolutionId.replace(/_/g, '/')} ↗` : 'Browse resolutions…'}
        </button>
      )}
    </header>
    <TopicPickerModal />
    </>
  );
}
