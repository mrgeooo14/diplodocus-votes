import { DiploLogo } from '../components/layout/DiploLogo';

export function AboutPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center">
          <DiploLogo size={96} />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-[#e6edf3]">About DiploDocus</h1>
        <p className="mt-2 text-[#8b949e]">Coming soon.</p>
      </div>
    </div>
  );
}
