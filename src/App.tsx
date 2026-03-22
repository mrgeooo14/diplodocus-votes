import { FilterBar } from './components/filters/FilterBar';
import { VoteMap } from './components/map/VoteMap';
import { VoteSummary } from './components/dashboard/VoteSummary';

function App() {
  return (
    <div className="flex h-full w-full flex-col">
      <FilterBar />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <VoteMap />
        </div>
        <aside className="flex w-72 flex-col overflow-y-auto border-l border-[#30363d] bg-[#161b22]">
          <VoteSummary />
        </aside>
      </div>
    </div>
  );
}

export default App;
