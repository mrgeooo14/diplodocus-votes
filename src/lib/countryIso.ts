/** ISO 3166-1 alpha-3 → alpha-2 lookup for all UN member/observer states */
const _regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

export function iso3ToName(iso3: string): string {
  const iso2 = ISO3_TO_ISO2[iso3];
  if (!iso2) return iso3;
  try {
    return _regionNames.of(iso2.toUpperCase()) ?? iso3;
  } catch {
    return iso3;
  }
}

export const ISO3_TO_ISO2: Record<string, string> = {
  AFG: 'af', ALB: 'al', DZA: 'dz', AND: 'ad', AGO: 'ao',
  ATG: 'ag', ARG: 'ar', ARM: 'am', AUS: 'au', AUT: 'at',
  AZE: 'az', BHS: 'bs', BHR: 'bh', BGD: 'bd', BRB: 'bb',
  BLR: 'by', BEL: 'be', BLZ: 'bz', BEN: 'bj', BTN: 'bt',
  BOL: 'bo', BIH: 'ba', BWA: 'bw', BRA: 'br', BRN: 'bn',
  BGR: 'bg', BFA: 'bf', BDI: 'bi', CPV: 'cv', KHM: 'kh',
  CMR: 'cm', CAN: 'ca', CAF: 'cf', TCD: 'td', CHL: 'cl',
  CHN: 'cn', COL: 'co', COM: 'km', COD: 'cd', COG: 'cg',
  CRI: 'cr', CIV: 'ci', HRV: 'hr', CUB: 'cu', CYP: 'cy',
  CZE: 'cz', DNK: 'dk', DJI: 'dj', DMA: 'dm', DOM: 'do',
  ECU: 'ec', EGY: 'eg', SLV: 'sv', GNQ: 'gq', ERI: 'er',
  EST: 'ee', SWZ: 'sz', ETH: 'et', FJI: 'fj', FIN: 'fi',
  FRA: 'fr', GAB: 'ga', GMB: 'gm', GEO: 'ge', DEU: 'de',
  GHA: 'gh', GRC: 'gr', GRD: 'gd', GTM: 'gt', GIN: 'gn',
  GNB: 'gw', GUY: 'gy', HTI: 'ht', HND: 'hn', HUN: 'hu',
  ISL: 'is', IND: 'in', IDN: 'id', IRN: 'ir', IRQ: 'iq',
  IRL: 'ie', ISR: 'il', ITA: 'it', JAM: 'jm', JPN: 'jp',
  JOR: 'jo', KAZ: 'kz', KEN: 'ke', KIR: 'ki', PRK: 'kp',
  KOR: 'kr', KWT: 'kw', KGZ: 'kg', LAO: 'la', LVA: 'lv',
  LBN: 'lb', LSO: 'ls', LBR: 'lr', LBY: 'ly', LIE: 'li',
  LTU: 'lt', LUX: 'lu', MDG: 'mg', MWI: 'mw', MYS: 'my',
  MDV: 'mv', MLI: 'ml', MLT: 'mt', MHL: 'mh', MRT: 'mr',
  MUS: 'mu', MEX: 'mx', FSM: 'fm', MDA: 'md', MCO: 'mc',
  MNG: 'mn', MNE: 'me', MAR: 'ma', MOZ: 'mz', MMR: 'mm',
  NAM: 'na', NRU: 'nr', NPL: 'np', NLD: 'nl', NZL: 'nz',
  NIC: 'ni', NER: 'ne', NGA: 'ng', MKD: 'mk', NOR: 'no',
  OMN: 'om', PAK: 'pk', PLW: 'pw', PAN: 'pa', PNG: 'pg',
  PRY: 'py', PER: 'pe', PHL: 'ph', POL: 'pl', PRT: 'pt',
  QAT: 'qa', ROU: 'ro', RUS: 'ru', RWA: 'rw', KNA: 'kn',
  LCA: 'lc', VCT: 'vc', WSM: 'ws', SMR: 'sm', STP: 'st',
  SAU: 'sa', SEN: 'sn', SRB: 'rs', SYC: 'sc', SLE: 'sl',
  SGP: 'sg', SVK: 'sk', SVN: 'si', SLB: 'sb', SOM: 'so',
  ZAF: 'za', SSD: 'ss', ESP: 'es', LKA: 'lk', SDN: 'sd',
  SUR: 'sr', SWE: 'se', CHE: 'ch', SYR: 'sy', TJK: 'tj',
  TZA: 'tz', THA: 'th', TLS: 'tl', TGO: 'tg', TON: 'to',
  TTO: 'tt', TUN: 'tn', TUR: 'tr', TKM: 'tm', TUV: 'tv',
  UGA: 'ug', UKR: 'ua', ARE: 'ae', GBR: 'gb', USA: 'us',
  URY: 'uy', UZB: 'uz', VUT: 'vu', VEN: 've', VNM: 'vn',
  YEM: 'ye', ZMB: 'zm', ZWE: 'zw',
  // Observer / commonly referenced
  PSE: 'ps', VAT: 'va', TWN: 'tw', XKX: 'xk',
};

/** Returns ISO2 lowercase code, or undefined if not found. */
export function iso3ToIso2(iso3: string): string | undefined {
  return ISO3_TO_ISO2[iso3.toUpperCase()];
}
