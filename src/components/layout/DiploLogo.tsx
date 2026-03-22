interface Props {
  size?: number;
}

export function DiploLogo({ size = 28 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="DiploDocus"
    >
      <defs>
        <clipPath id="diplo-inner">
          <circle cx="32" cy="32" r="26.5" />
        </clipPath>
        {/* Subtle radial glow on the medallion background */}
        <radialGradient id="diplo-bg" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#1a3060" />
          <stop offset="100%" stopColor="#0b1628" />
        </radialGradient>
      </defs>

      {/* Outer rim — darkest gold shadow */}
      <circle cx="32" cy="32" r="32" fill="#6b4a0e" />
      {/* Main gold ring */}
      <circle cx="32" cy="32" r="30.5" fill="#c9963a" />
      {/* Inner gold ring — lighter highlight */}
      <circle cx="32" cy="32" r="29.5" fill="#e0b050" />
      {/* Greek key suggestion — repeated dark dashes on the ring */}
      <circle
        cx="32" cy="32" r="29"
        fill="none"
        stroke="#7a5510"
        strokeWidth="2.5"
        strokeDasharray="3 1.8"
      />
      {/* Thin bright inner border of the gold ring */}
      <circle cx="32" cy="32" r="27.5" fill="#c9963a" />

      {/* Dark medallion background with subtle blue tint */}
      <circle cx="32" cy="32" r="26.5" fill="url(#diplo-bg)" />

      {/* All owl art clipped to the medallion */}
      <g clipPath="url(#diplo-inner)">
        {/* Faint inner border ring */}
        <circle
          cx="32" cy="32" r="25.5"
          fill="none"
          stroke="#dde8f0"
          strokeWidth="0.5"
          opacity="0.18"
        />

        {/* ── Olive branch (top-left) ── */}
        <path
          d="M15.5 29 Q13.5 23 15.5 16"
          stroke="#dde8f0" strokeWidth="1.1" strokeLinecap="round"
        />
        {/* Lower leaf */}
        <ellipse
          cx="12.8" cy="22"
          rx="3" ry="1.3"
          fill="#dde8f0"
          transform="rotate(-50 12.8 22)"
        />
        {/* Upper leaf */}
        <ellipse
          cx="15.5" cy="16.5"
          rx="3" ry="1.3"
          fill="#dde8f0"
          transform="rotate(-22 15.5 16.5)"
        />
        {/* Berry at base */}
        <circle cx="15.5" cy="29" r="1" fill="#dde8f0" />

        {/* ── Owl body ── */}
        <path
          d="M22 52 Q18 42 20 31 Q32 27 44 31 Q46 42 42 52 Q32 57 22 52Z"
          fill="#dde8f0"
        />

        {/* Horizontal feather stripes */}
        <path d="M21 37.5 Q32 34.5 43 37.5" stroke="#0b1628" strokeWidth="1.3" />
        <path d="M20 43.5 Q32 40.5 44 43.5" stroke="#0b1628" strokeWidth="1.3" />
        <path d="M20.5 49.5 Q32 46.5 43.5 49.5" stroke="#0b1628" strokeWidth="1.3" />

        {/* Dot pattern on right wing (archaic Greek owl detail) */}
        <circle cx="40" cy="35" r="1" fill="#0b1628" opacity="0.6" />
        <circle cx="40" cy="38.5" r="1" fill="#0b1628" opacity="0.6" />
        <circle cx="41.5" cy="41.5" r="1" fill="#0b1628" opacity="0.6" />

        {/* ── Owl head ── */}
        <circle cx="32" cy="22" r="10.5" fill="#dde8f0" />

        {/* Left eye — three concentric rings (Athenian tetradrachm style) */}
        <circle cx="27" cy="20.5" r="5.2" fill="#0b1628" />
        <circle cx="27" cy="20.5" r="3.5" fill="#dde8f0" />
        <circle cx="27" cy="20.5" r="2"   fill="#0b1628" />
        <circle cx="27" cy="20.5" r="0.9" fill="#dde8f0" />

        {/* Right eye */}
        <circle cx="37" cy="20.5" r="5.2" fill="#0b1628" />
        <circle cx="37" cy="20.5" r="3.5" fill="#dde8f0" />
        <circle cx="37" cy="20.5" r="2"   fill="#0b1628" />
        <circle cx="37" cy="20.5" r="0.9" fill="#dde8f0" />

        {/* Beak */}
        <path d="M30 25.5 L32 29 L34 25.5Z" fill="#0b1628" />

        {/* Ear tufts */}
        <path d="M25 12.5 L27 17.5" stroke="#dde8f0" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M39 12.5 L37 17.5" stroke="#dde8f0" strokeWidth="2.5" strokeLinecap="round" />

        {/* ── Talons ── */}
        {/* Left foot */}
        <path d="M26 52 L22.5 58" stroke="#dde8f0" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M26 52 L26.5 58.5" stroke="#dde8f0" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M26 52 L30 57.5" stroke="#dde8f0" strokeWidth="1.5" strokeLinecap="round" />
        {/* Right foot */}
        <path d="M38 52 L34 58" stroke="#dde8f0" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M38 52 L37.5 58.5" stroke="#dde8f0" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M38 52 L41.5 57.5" stroke="#dde8f0" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}
