interface Props {
  size?: number;
}

const D = '#0d1117'; // dark (background / fill-dark)
const L = '#e6edf3'; // light (owl, ring)
const CX = 120;
const CY = 120;

export function DiploLogo({ size = 28 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="DiploDocus"
    >
      {/* ── BORDER RING ─────────────────────────────────────── */}
      {/* Outer white ring fill */}
      <circle cx={CX} cy={CY} r="118" fill={L} />
      {/* 24 dark notches cut into the ring → Greek key suggestion */}
      {Array.from({ length: 24 }, (_, i) => (
        <rect
          key={i}
          x={CX - 2}
          y={CY - 118}
          width={4}
          height={13}
          fill={D}
          transform={`rotate(${i * 15}, ${CX}, ${CY})`}
        />
      ))}
      {/* Thin dark inner separator */}
      <circle cx={CX} cy={CY} r="103" fill={D} />
      {/* Thin white inner border line */}
      <circle cx={CX} cy={CY} r="103" fill="none" stroke={L} strokeWidth="2" />

      {/* ── OLIVE BRANCH (upper left) ───────────────────────── */}
      <path d="M 56,116 Q 48,97 52,70" stroke={L} strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="44"  cy="100" rx="11" ry="4" fill={L} transform="rotate(-62 44 100)" />
      <ellipse cx="51"  cy="83"  rx="11" ry="4" fill={L} transform="rotate(-42 51 83)"  />
      <ellipse cx="55"  cy="68"  rx="10" ry="4" fill={L} transform="rotate(-22 55 68)"  />
      <circle  cx="56"  cy="116" r="3.5"         fill={L} />

      {/* ── OWL HEAD ────────────────────────────────────────── */}
      <circle cx={CX} cy="84" r="38" fill={L} />

      {/* Left eye — 5 concentric rings (tetradrachm style) */}
      <circle cx="104" cy="78" r="16"  fill={D} />
      <circle cx="104" cy="78" r="12"  fill={L} />
      <circle cx="104" cy="78" r="8"   fill={D} />
      <circle cx="104" cy="78" r="4.5" fill={L} />
      <circle cx="104" cy="78" r="2"   fill={D} />

      {/* Right eye */}
      <circle cx="136" cy="78" r="16"  fill={D} />
      <circle cx="136" cy="78" r="12"  fill={L} />
      <circle cx="136" cy="78" r="8"   fill={D} />
      <circle cx="136" cy="78" r="4.5" fill={L} />
      <circle cx="136" cy="78" r="2"   fill={D} />

      {/* Beak */}
      <path d="M 114,93 L 120,103 L 126,93 Z" fill={D} />

      {/* Ear tufts */}
      <path d="M 93,48 L 100,63"  stroke={L} strokeWidth="5" strokeLinecap="round" />
      <path d="M 147,48 L 140,63" stroke={L} strokeWidth="5" strokeLinecap="round" />

      {/* ── OWL BODY ────────────────────────────────────────── */}
      <path
        d="M 82,114 Q 74,148 76,188 Q 120,199 164,188 Q 166,148 158,114 Q 120,106 82,114 Z"
        fill={L}
      />

      {/* Centre dividing line (left wing / right chest) */}
      <path d={`M ${CX},114 L ${CX},189`} stroke={D} strokeWidth="1.8" />

      {/* Left-wing horizontal feather stripes */}
      <path d="M 78,122 Q 100,119 120,120" stroke={D} strokeWidth="1.8" />
      <path d="M 77,132 Q 99,129  120,130" stroke={D} strokeWidth="1.8" />
      <path d="M 76,142 Q 99,139  120,140" stroke={D} strokeWidth="1.8" />
      <path d="M 76,152 Q 99,149  120,150" stroke={D} strokeWidth="1.8" />
      <path d="M 77,162 Q 100,159 120,160" stroke={D} strokeWidth="1.8" />
      <path d="M 78,172 Q 101,169 120,170" stroke={D} strokeWidth="1.8" />

      {/* Right-chest dot / spot pattern */}
      <circle cx="132" cy="121" r="3"   fill={D} />
      <circle cx="140" cy="126" r="3"   fill={D} />
      <circle cx="130" cy="130" r="3"   fill={D} />
      <circle cx="138" cy="136" r="3"   fill={D} />
      <circle cx="147" cy="132" r="3"   fill={D} />
      <circle cx="134" cy="141" r="3"   fill={D} />
      <circle cx="143" cy="145" r="2.8" fill={D} />
      <circle cx="150" cy="140" r="2.8" fill={D} />
      <circle cx="137" cy="149" r="2.8" fill={D} />
      <circle cx="145" cy="154" r="2.5" fill={D} />
      <circle cx="152" cy="149" r="2.5" fill={D} />

      {/* Tail feather base stripes */}
      <path d="M 80,179 Q 120,175 160,179" stroke={D} strokeWidth="2"   />
      <path d="M 80,185 Q 120,181 160,185" stroke={D} strokeWidth="1.5" />

      {/* ── FEET ────────────────────────────────────────────── */}
      {/* Left */}
      <path d="M 92,188 L 79,201"  stroke={L} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 92,188 L 91,204"  stroke={L} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 92,188 L 105,199" stroke={L} strokeWidth="3.5" strokeLinecap="round" />
      {/* Right */}
      <path d="M 148,188 L 135,201" stroke={L} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 148,188 L 149,204" stroke={L} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 148,188 L 161,199" stroke={L} strokeWidth="3.5" strokeLinecap="round" />

      {/* Ground mound */}
      <path
        d="M 76,199 Q 120,193 164,199 Q 157,208 120,210 Q 83,208 76,199 Z"
        fill={L}
      />
    </svg>
  );
}
