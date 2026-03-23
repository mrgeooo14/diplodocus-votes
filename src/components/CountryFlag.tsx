import { iso3ToIso2 } from '../lib/countryIso';

interface CountryFlagProps {
  /** ISO 3166-1 alpha-3 country code (e.g. "USA", "FRA") */
  iso3: string;
  size?: number;
  className?: string;
  title?: string;
}

/**
 * Circular country flag using circle-flags SVG assets (HatScripts/circle-flags).
 * Falls back to a grey placeholder if the code is unknown.
 */
export function CountryFlag({ iso3, size = 24, className = '', title }: CountryFlagProps) {
  const iso2 = iso3ToIso2(iso3);

  if (!iso2) {
    return (
      <span
        title={title ?? iso3}
        className={className}
        style={{
          display: 'inline-block',
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: '#30363d',
        }}
      />
    );
  }

  return (
    <img
      src={`https://hatscripts.github.io/circle-flags/flags/${iso2}.svg`}
      width={size}
      height={size}
      title={title ?? iso3}
      alt={iso3}
      className={className}
      style={{ borderRadius: '50%', display: 'inline-block' }}
      loading="lazy"
    />
  );
}
