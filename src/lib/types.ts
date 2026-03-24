export type VoteValue = 'Y' | 'N' | 'A' | 'X';

export type Body = 'GA' | 'SC';

export interface Resolution {
  id: string;
  symbol: string;
  body: Body;
  year: number;
  date: string;
  session: string;
  title: string;
  subjects: string[];
  totalYes: number;
  totalNo: number;
  totalAbstentions: number;
  totalNonVoting: number;
  votes: Record<string, VoteValue>;
}

export interface YearlyCountryStats {
  yes: number;
  no: number;
  abstain: number;
  total: number;
}

export interface YearlyAggregate {
  year: number;
  countries: Record<string, YearlyCountryStats>;
}

export interface TopicsIndex {
  [topic: string]: string[];
}

export type FilterMode = 'year' | 'resolution' | 'topic';

export type MapColorMode = 'default' | 'us-china' | 'country';

export interface CountryVoteInfo {
  vote?: VoteValue;
  yes?: number;
  no?: number;
  abstain?: number;
  total?: number;
}

export interface ScVeto {
  id: number;
  year: number;
  date: number;
  'draft_res#': string;
  agenda: string;
  short_agenda: string;
  url_for_record: string;
  'url_for_res#': string;
  china: number;
  russian_federation_ussr: number;
  france: number;
  united_states: number;
  united_kingdom: number;
}

export interface ResolutionMeta {
  symbol: string;
  title: string;
  subjects: string[];
}

export interface FilterState {
  body: Body;
  mode: FilterMode;
  year: number;
  resolutionId: string | null;
  topic: string | null;
}
