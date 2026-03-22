import { useFilterStore } from '../../store/filterStore';

const MIN_YEAR = 1992;
const MAX_YEAR = 2025;

export function YearSlider() {
  const { year, setYear } = useFilterStore();

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#8b949e]">{MIN_YEAR}</span>
      <input
        type="range"
        min={MIN_YEAR}
        max={MAX_YEAR}
        value={year}
        onChange={e => setYear(Number(e.target.value))}
        className="h-1 w-40 cursor-pointer appearance-none rounded-full bg-[#30363d] accent-[#22c55e]"
      />
      <span className="min-w-[3rem] text-center text-sm font-semibold text-[#e6edf3]">
        {year}
      </span>
      <span className="text-xs text-[#8b949e]">{MAX_YEAR}</span>
    </div>
  );
}
