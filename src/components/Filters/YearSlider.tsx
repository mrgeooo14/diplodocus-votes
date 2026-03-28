import { useEffect, useRef, useState } from 'react';
import { useFilterStore } from '../../store/filterStore';

const MIN_YEAR = 1992;
const MAX_YEAR = 2025;
const INTERVAL_MS = 800;

export function YearSlider() {
  const { year, setYear } = useFilterStore();
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const yearRef = useRef(year);
  yearRef.current = year;

  useEffect(() => {
    if (!playing) return;

    intervalRef.current = setInterval(() => {
      const next = yearRef.current + 1;
      if (next > MAX_YEAR) {
        setPlaying(false);
        return;
      }
      setYear(next);
    }, INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, setYear]);

  // Stop playback if user drags to the end
  useEffect(() => {
    if (year >= MAX_YEAR && playing) setPlaying(false);
  }, [year, playing]);

  function togglePlay() {
    if (year >= MAX_YEAR) setYear(MIN_YEAR);
    setPlaying(p => !p);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={togglePlay}
        aria-label={playing ? 'Pause' : 'Play timeline'}
        title={playing ? 'Pause' : 'Play timeline'}
        className="flex h-6 w-6 items-center justify-center rounded-full bg-[#21262d] text-[#e6edf3] transition-colors hover:bg-[#30363d]"
      >
        {playing ? (
          <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <rect x="1" y="1" width="3" height="8" rx="0.5" />
            <rect x="6" y="1" width="3" height="8" rx="0.5" />
          </svg>
        ) : (
          <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <path d="M2 1.5l7 3.5-7 3.5V1.5z" />
          </svg>
        )}
      </button>

      <span className="text-xs text-[#9eaab6]">{MIN_YEAR}</span>
      <input
        type="range"
        min={MIN_YEAR}
        max={MAX_YEAR}
        value={year}
        aria-label="Year"
        aria-valuetext={`Year ${year}`}
        onChange={e => setYear(Number(e.target.value))}
        className="h-1 w-40 cursor-pointer appearance-none rounded-full bg-[#30363d] accent-[#22c55e]"
      />
      <span className="min-w-[3rem] text-center text-sm font-semibold text-[#e6edf3]">
        {year}
      </span>
    </div>
  );
}
