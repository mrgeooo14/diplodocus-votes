import { DiploLogo } from '../components/layout/DiploLogo';

export function AboutPage() {
  return (
    <div className="relative flex flex-1 items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center">
          <DiploLogo size={96} />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-[#e6edf3]">About DiploDocus</h1>
        <p className="mt-2 text-[#8b949e]">Making Diplomacy Accessible.</p>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2 px-4 text-center">
        <p className="max-w-xl text-[#8b949e]">
          DiploDocus is a project of{' '}
          <a href="https://sidlab.ch/" target="_blank" rel="noreferrer" className="text-[#58a6ff] underline underline-offset-2 hover:text-[#79c0ff]">
            Science in Diplomacy Lab (SiDLab)
          </a>
          , a joint research lab between the University of Geneva and ETH Zurich.
        </p>
        <p className="max-w-2xl text-[#8b949e]">
          The project is developed by PhD candidate{' '}
          <a href="https://www.linkedin.com/in/genis-skura-b09272212/" target="_blank" rel="noreferrer" className="text-[#58a6ff] underline underline-offset-2 hover:text-[#79c0ff]">
            Genis Skura
          </a>{' '}
          under supervision of Prof.{' '}
          <a href="https://scholar.google.com/citations?user=_1m5sXkAAAAJ&hl=en" target="_blank" rel="noreferrer" className="text-[#58a6ff] underline underline-offset-2 hover:text-[#79c0ff]">
            Didier Wernli
          </a>{' '}
          and Prof.{' '}
          <a href="https://scholar.google.com/citations?user=AeLcrOQAAAAJ&hl=en" target="_blank" rel="noreferrer" className="text-[#58a6ff] underline underline-offset-2 hover:text-[#79c0ff]">
            Roland Bouffanais
          </a>{' '}
          at the University of Geneva, Switzerland.
        </p>
      </div>
    </div>
  );
}
