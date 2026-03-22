import { useEffect, useState } from 'react';
import { useFilterStore } from '../../store/filterStore';
import type { TopicsIndex } from '../../lib/types';

function toTitleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
}

export function TopicSelect() {
  const { topic, setTopic } = useFilterStore();
  const [topics, setTopics] = useState<string[]>([]);

  useEffect(() => {
    fetch('/data/aggregates/topics.json')
      .then(r => r.json())
      .then((data: TopicsIndex) => setTopics(Object.keys(data).sort()));
  }, []);

  return (
    <select
      value={topic ?? ''}
      onChange={e => setTopic(e.target.value || null)}
      className="rounded border border-[#30363d] bg-[#0d1117] px-2 py-1 text-xs text-[#e6edf3] focus:border-[#388bfd] focus:outline-none"
    >
      <option value="">— select topic —</option>
      {topics.map(t => (
        <option key={t} value={t}>
          {toTitleCase(t)}
        </option>
      ))}
    </select>
  );
}
