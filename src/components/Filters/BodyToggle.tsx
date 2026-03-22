import { useFilterStore } from '../../store/filterStore';
import type { Body } from '../../lib/types';

const OPTIONS: { value: Body; label: string; title: string }[] = [
  { value: 'GA', label: 'General Assembly', title: 'UNGA' },
  { value: 'SC', label: 'Security Council', title: 'UNSC' },
];

export function BodyToggle() {
  const { body, setBody } = useFilterStore();

  return (
    <div className="flex gap-0.5 rounded-md border border-[#30363d] p-0.5">
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => setBody(opt.value)}
          title={opt.label}
          className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
            body === opt.value
              ? 'bg-[#21262d] text-[#e6edf3]'
              : 'text-[#8b949e] hover:text-[#e6edf3]'
          }`}
        >
          {opt.title}
        </button>
      ))}
    </div>
  );
}
