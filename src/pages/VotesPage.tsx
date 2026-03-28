import { FilterBar } from '../components/filters/FilterBar';
import { VoteMap } from '../components/map/VoteMap';
import { VoteSummary } from '../components/dashboard/VoteSummary';
import { ResolutionPicker } from '../components/resolution/ResolutionPicker';

export function VotesPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <FilterBar />
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3 sm:flex-row sm:gap-4 sm:overflow-hidden sm:p-4">
        <div className="h-[50vh] overflow-hidden rounded-xl border border-[#30363d] sm:h-auto sm:flex-1">
          <VoteMap />
        </div>
        <aside className="flex w-full flex-col overflow-y-auto rounded-xl border border-[#30363d] bg-[#161b22] sm:w-72 sm:flex-shrink-0">
          <VoteSummary />
        </aside>
      </div>
      <ResolutionPicker />
    </div>
  );
}
