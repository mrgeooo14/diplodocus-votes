import { DiploLogo } from './DiploLogo';

export function Footer() {
  return (
    <footer className="border-t border-[#30363d] bg-[#161b22] px-5 py-2 text-xs text-[#8b949e]">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <DiploLogo size={22} />
          <span className="font-semibold text-[#e6edf3]">DiploDocus</span>
        </span>
        <span>Data: UN Bibliographic Information System · 1992–2025</span>
      </div>
    </footer>
  );
}
