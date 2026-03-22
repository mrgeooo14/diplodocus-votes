import { NavLink } from 'react-router-dom';
import { DiploLogo } from './DiploLogo';

export function Header() {
  return (
    <header className="flex items-center gap-6 border-b border-[#30363d] bg-[#161b22] px-5 py-2.5">
      <NavLink to="/" className="flex items-center gap-2.5 no-underline">
        <DiploLogo size={36} />
        <span className="text-base font-bold tracking-tight text-[#e6edf3]">DiploDocus</span>
      </NavLink>

      <nav className="flex items-center gap-1 ml-auto">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-[#21262d] text-[#e6edf3]'
                : 'text-[#8b949e] hover:text-[#e6edf3]'
            }`
          }
        >
          UN Votes
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-[#21262d] text-[#e6edf3]'
                : 'text-[#8b949e] hover:text-[#e6edf3]'
            }`
          }
        >
          About
        </NavLink>
      </nav>
    </header>
  );
}
