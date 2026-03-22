import { FilterBar } from '../components/filters/FilterBar';
import { VoteMap } from '../components/map/VoteMap';
import { VoteSummary } from '../components/dashboard/VoteSummary';

export function VotesPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <FilterBar />
      <div className="flex flex-1 gap-4 overflow-hidden p-4">
        <div className="flex-1 overflow-hidden rounded-xl border border-[#30363d]">
          <VoteMap />
        </div>
        <aside className="flex w-72 flex-shrink-0 flex-col overflow-y-auto rounded-xl border border-[#30363d] bg-[#161b22]">
          <VoteSummary />
        </aside>
      </div>
    </div>
  );
}
