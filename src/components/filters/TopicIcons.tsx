const D = '#0d1117';
const L = '#e6edf3';

interface IconProps { size?: number }

function Ring({ n = 16 }: { n?: number }) {
  return (
    <>
      <circle cx="120" cy="120" r="118" fill={L} />
      {Array.from({ length: n }, (_, i) => (
        <rect
          key={i}
          x="118" y="2" width="4" height="11"
          fill={D}
          transform={`rotate(${i * (360 / n)}, 120, 120)`}
        />
      ))}
      <circle cx="120" cy="120" r="103" fill={D} />
      <circle cx="120" cy="120" r="103" fill="none" stroke={L} strokeWidth="2" />
    </>
  );
}

export function IconCounterTerrorism({ size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Ring />
      {/* Shield */}
      <path d="M 120,55 L 168,75 L 168,130 Q 168,170 120,190 Q 72,170 72,130 L 72,75 Z" stroke={L} strokeWidth="6" fill="none" strokeLinejoin="round" />
      {/* Eye inside shield */}
      <path d="M 88,118 Q 120,95 152,118 Q 120,141 88,118 Z" stroke={L} strokeWidth="4" fill="none" />
      <circle cx="120" cy="118" r="12" fill={L} />
      <circle cx="120" cy="118" r="6" fill={D} />
      <circle cx="120" cy="118" r="2.5" fill={L} />
      {/* Alert lines top of shield */}
      <path d="M 120,62 L 120,72" stroke={L} strokeWidth="5" strokeLinecap="round" />
      <path d="M 100,67 L 104,76" stroke={L} strokeWidth="4" strokeLinecap="round" />
      <path d="M 140,67 L 136,76" stroke={L} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function IconDecolonization({ size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Ring />
      {/* Left chain link */}
      <rect x="58" y="100" width="52" height="40" rx="20" stroke={L} strokeWidth="7" fill="none" />
      <rect x="58" y="112" width="52" height="16" rx="0" fill={D} />
      {/* Right chain link */}
      <rect x="130" y="100" width="52" height="40" rx="20" stroke={L} strokeWidth="7" fill="none" />
      <rect x="130" y="112" width="52" height="16" rx="0" fill={D} />
      {/* Break gap + lightning lines */}
      <path d="M 110,112 L 102,120 L 112,120 L 104,128" stroke={L} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 130,112 L 138,120 L 128,120 L 136,128" stroke={L} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Map pin / territory circle above */}
      <circle cx="120" cy="68" r="16" stroke={L} strokeWidth="5" fill="none" />
      <circle cx="120" cy="68" r="6" fill={L} />
      <path d="M 120,84 L 120,100" stroke={L} strokeWidth="4" strokeLinecap="round" strokeDasharray="4 4" />
    </svg>
  );
}

export function IconDevelopment({ size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Ring />
      {/* Bar chart base line */}
      <line x1="68" y1="175" x2="185" y2="175" stroke={L} strokeWidth="5" strokeLinecap="round" />
      {/* Bar 1 */}
      <rect x="76" y="145" width="28" height="30" fill={L} rx="3" />
      {/* Bar 2 */}
      <rect x="116" y="118" width="28" height="57" fill={L} rx="3" />
      {/* Bar 3 */}
      <rect x="156" y="88" width="28" height="87" fill={L} rx="3" />
      {/* Upward arrow on top of bar 3 */}
      <path d="M 170,85 L 170,58" stroke={L} strokeWidth="5" strokeLinecap="round" />
      <path d="M 158,72 L 170,58 L 182,72" stroke={L} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Exchange arrow below bars (trade) */}
      <path d="M 68,60 Q 68,55 76,55 L 112,55" stroke={L} strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M 104,48 L 113,55 L 104,62" stroke={L} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function IconDisarmament({ size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Ring />
      {/* Missile/rocket silhouette */}
      <path d="M 120,58 Q 112,68 110,90 L 108,160 L 120,172 L 132,160 L 130,90 Q 128,68 120,58 Z" fill={L} />
      {/* Fins */}
      <path d="M 108,148 L 90,168 L 108,162 Z" fill={L} />
      <path d="M 132,148 L 150,168 L 132,162 Z" fill={L} />
      {/* Big X cross over rocket — "banned" */}
      <line x1="72" y1="72" x2="168" y2="168" stroke={L} strokeWidth="9" strokeLinecap="round" />
      <line x1="168" y1="72" x2="72" y2="168" stroke={L} strokeWidth="9" strokeLinecap="round" />
      {/* Circle around X (no symbol) */}
      <circle cx="120" cy="120" r="58" stroke={L} strokeWidth="7" fill="none" />
    </svg>
  );
}

export function IconEnvironment({ size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Ring />
      {/* Leaf shape */}
      <path d="M 120,58 Q 180,75 172,155 Q 120,168 78,130 Q 58,80 120,58 Z" fill={L} />
      {/* Stem */}
      <path d="M 120,168 L 120,192" stroke={L} strokeWidth="6" strokeLinecap="round" />
      {/* Central vein */}
      <path d="M 120,65 Q 135,110 120,162" stroke={D} strokeWidth="3.5" strokeLinecap="round" />
      {/* Branch veins left */}
      <path d="M 125,88 Q 105,96 88,92" stroke={D} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 128,108 Q 106,116 90,112" stroke={D} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 130,128 Q 109,136 96,133" stroke={D} strokeWidth="2.5" strokeLinecap="round" />
      {/* Branch veins right */}
      <path d="M 123,98 Q 148,100 158,92" stroke={D} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 125,118 Q 149,118 158,110" stroke={D} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 124,138 Q 146,136 152,128" stroke={D} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconHumanRights({ size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Ring />
      {/* Balance beam horizontal */}
      <line x1="68" y1="120" x2="172" y2="120" stroke={L} strokeWidth="6" strokeLinecap="round" />
      {/* Fulcrum triangle */}
      <path d="M 108,120 L 120,148 L 132,120 Z" fill={L} />
      {/* Vertical post */}
      <line x1="120" y1="72" x2="120" y2="120" stroke={L} strokeWidth="6" strokeLinecap="round" />
      {/* Top ring on post */}
      <circle cx="120" cy="68" r="7" fill={L} />
      {/* Left hanging strings */}
      <line x1="76" y1="120" x2="68" y2="145" stroke={L} strokeWidth="4" strokeLinecap="round" />
      <line x1="76" y1="120" x2="84" y2="145" stroke={L} strokeWidth="4" strokeLinecap="round" />
      {/* Left pan */}
      <path d="M 60,148 Q 76,156 92,148" stroke={L} strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Right hanging strings */}
      <line x1="164" y1="120" x2="156" y2="145" stroke={L} strokeWidth="4" strokeLinecap="round" />
      <line x1="164" y1="120" x2="172" y2="145" stroke={L} strokeWidth="4" strokeLinecap="round" />
      {/* Right pan */}
      <path d="M 148,148 Q 164,156 180,148" stroke={L} strokeWidth="5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function IconInternationalLaw({ size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Ring />
      {/* Scroll body */}
      <rect x="72" y="75" width="96" height="110" rx="8" fill={L} />
      {/* Scroll top curl */}
      <ellipse cx="120" cy="75" rx="48" ry="10" fill={L} />
      <ellipse cx="120" cy="75" rx="35" ry="7" fill={D} />
      {/* Scroll bottom curl */}
      <ellipse cx="120" cy="185" rx="48" ry="10" fill={L} />
      <ellipse cx="120" cy="185" rx="35" ry="7" fill={D} />
      {/* Text lines on scroll */}
      <line x1="88" y1="102" x2="152" y2="102" stroke={D} strokeWidth="4" strokeLinecap="round" />
      <line x1="88" y1="116" x2="152" y2="116" stroke={D} strokeWidth="4" strokeLinecap="round" />
      <line x1="88" y1="130" x2="152" y2="130" stroke={D} strokeWidth="4" strokeLinecap="round" />
      <line x1="88" y1="144" x2="130" y2="144" stroke={D} strokeWidth="4" strokeLinecap="round" />
      {/* Wax seal circle */}
      <circle cx="150" cy="158" r="16" fill={D} stroke={L} strokeWidth="4" />
      <circle cx="150" cy="158" r="8" stroke={L} strokeWidth="2.5" fill="none" />
      <line x1="143" y1="151" x2="157" y2="165" stroke={L} strokeWidth="2" />
      <line x1="157" y1="151" x2="143" y2="165" stroke={L} strokeWidth="2" />
    </svg>
  );
}

export function IconPeaceSecurity({ size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Ring />
      {/* Dove body */}
      <ellipse cx="118" cy="118" rx="38" ry="22" fill={L} transform="rotate(-20 118 118)" />
      {/* Dove head */}
      <circle cx="150" cy="98" r="16" fill={L} />
      {/* Eye */}
      <circle cx="155" cy="94" r="4" fill={D} />
      <circle cx="155" cy="94" r="1.8" fill={L} />
      {/* Beak */}
      <path d="M 162,100 L 174,103 L 162,107 Z" fill={L} />
      {/* Wing */}
      <path d="M 100,110 Q 80,85 68,72 Q 90,75 112,95 Z" fill={L} />
      <path d="M 110,116 Q 78,100 62,90 Q 86,96 116,112 Z" fill={L} />
      {/* Tail */}
      <path d="M 82,126 Q 68,140 60,148 Q 74,138 82,126 Z" fill={L} />
      <path d="M 88,130 Q 76,148 70,158 Q 82,144 90,130 Z" fill={L} />
      {/* Olive branch in beak */}
      <path d="M 172,102 Q 186,95 192,82" stroke={L} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="182" cy="90" rx="8" ry="3" fill={L} transform="rotate(-40 182 90)" />
      <ellipse cx="190" cy="83" rx="7" ry="3" fill={L} transform="rotate(-25 190 83)" />
    </svg>
  );
}

export function IconSocialAffairs({ size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Ring />
      {/* Medical cross — large plus symbol */}
      {/* Vertical bar */}
      <rect x="104" y="62" width="32" height="116" rx="8" fill={L} />
      {/* Horizontal bar */}
      <rect x="62" y="104" width="116" height="32" rx="8" fill={L} />
      {/* Corner accent dots */}
      <circle cx="78" cy="78" r="8" fill={L} />
      <circle cx="162" cy="78" r="8" fill={L} />
      <circle cx="78" cy="162" r="8" fill={L} />
      <circle cx="162" cy="162" r="8" fill={L} />
    </svg>
  );
}

export function IconUNSystem({ size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Ring />
      {/* Gear/cog — 8 teeth */}
      {Array.from({ length: 8 }, (_, i) => (
        <rect
          key={i}
          x="111" y="56" width="18" height="26"
          rx="4" fill={L}
          transform={`rotate(${i * 45}, 120, 120)`}
        />
      ))}
      {/* Gear outer ring */}
      <circle cx="120" cy="120" r="56" fill={L} />
      {/* Gear inner cutout */}
      <circle cx="120" cy="120" r="30" fill={D} />
      {/* Hub */}
      <circle cx="120" cy="120" r="16" fill={L} />
      <circle cx="120" cy="120" r="8" fill={D} />
    </svg>
  );
}

export function IconWomenChildren({ size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Ring />
      {/* Adult figure (left) */}
      {/* Head */}
      <circle cx="98" cy="82" r="18" fill={L} />
      {/* Body */}
      <path d="M 80,100 Q 72,130 74,168 L 88,168 L 98,138 L 108,168 L 122,168 Q 124,130 116,100 Q 107,95 98,96 Q 89,95 80,100 Z" fill={L} />
      {/* Arms */}
      <path d="M 80,106 Q 62,118 58,138" stroke={L} strokeWidth="10" strokeLinecap="round" />
      <path d="M 116,106 Q 134,120 138,140" stroke={L} strokeWidth="10" strokeLinecap="round" />
      {/* Venus symbol above adult head */}
      <circle cx="98" cy="57" r="9" stroke={L} strokeWidth="4" fill="none" />
      <line x1="98" y1="66" x2="98" y2="73" stroke={L} strokeWidth="4" strokeLinecap="round" />
      <line x1="92" y1="70" x2="104" y2="70" stroke={L} strokeWidth="4" strokeLinecap="round" />

      {/* Child figure (right) — scaled ~65% */}
      {/* Head */}
      <circle cx="162" cy="98" r="13" fill={L} />
      {/* Body */}
      <path d="M 150,111 Q 144,134 146,162 L 156,162 L 162,142 L 168,162 L 178,162 Q 180,134 174,111 Q 168,107 162,108 Q 156,107 150,111 Z" fill={L} />
      {/* Arms */}
      <path d="M 150,115 Q 138,125 136,140" stroke={L} strokeWidth="7" strokeLinecap="round" />
      <path d="M 174,115 Q 185,126 186,142" stroke={L} strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

export const TOPIC_ICONS: Record<string, React.ComponentType<IconProps>> = {
  'Counter-terrorism & Transnational Security': IconCounterTerrorism,
  'Decolonization & Self-Determination': IconDecolonization,
  'Development & Trade': IconDevelopment,
  'Disarmament & Arms Control': IconDisarmament,
  'Environment & Natural Resources': IconEnvironment,
  'Human Rights': IconHumanRights,
  'International Law & Justice': IconInternationalLaw,
  'Peace & Security': IconPeaceSecurity,
  'Social Affairs & Health': IconSocialAffairs,
  'UN System & Administration': IconUNSystem,
  'Women, Children & Youth': IconWomenChildren,
};
