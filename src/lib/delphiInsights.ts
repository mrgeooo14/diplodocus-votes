import type { Resolution, YearlyAggregate, Insight, Body } from './types';

const P5 = ['USA', 'RUS', 'CHN', 'GBR', 'FRA'] as const;

// ─── helpers ──────────────────────────────────────────────────────────────────

function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

function ordinal(n: number): string {
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return `${n}th`;
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + '…' : s;
}

// ─── year mode ────────────────────────────────────────────────────────────────

export function getYearInsights(
  year: number,
  body: Body,
  yearlyAggregates: YearlyAggregate[],
  allResolutions: Resolution[],
): Insight[] {
  const insights: Insight[] = [];
  const yearResolutions = allResolutions.filter(r => r.year === year);

  if (yearResolutions.length > 0) {
    insights.push({
      id: 'year-count',
      text: `${yearResolutions.length} ${body} resolutions voted on in ${year}.`,
      kind: 'stat',
    });
  }

  const entry = yearlyAggregates.find(e => e.year === year);
  if (entry) {
    const rates: number[] = [];
    let lowest = 1, highest = 0;
    let lowestIso = '', highestIso = '';

    for (const [iso, stats] of Object.entries(entry.countries)) {
      const cast = stats.yes + stats.no + stats.abstain;
      if (cast < 5) continue;
      const rate = stats.yes / cast;
      rates.push(rate);
      if (rate < lowest) { lowest = rate; lowestIso = iso; }
      if (rate > highest) { highest = rate; highestIso = iso; }
    }

    if (rates.length > 0) {
      const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
      insights.push({
        id: 'year-avg',
        text: `Global yes-rate averaged ${pct(avg)} across ${rates.length} countries.`,
        kind: 'stat',
      });
    }

    if (lowestIso && lowestIso !== highestIso) {
      insights.push({
        id: 'year-outliers',
        text: `Most isolated: ${lowestIso} (${pct(lowest)} yes). Most aligned: ${highestIso} (${pct(highest)} yes).`,
        kind: 'trend',
      });
    }
  }

  // On this day
  const today = new Date();
  const todayMD = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  // Pick a random match for variety (not just the first)
  const todayMatches = allResolutions.filter(
    r => r.date.slice(5) === todayMD && r.year !== year,
  );
  if (todayMatches.length > 0) {
    const pick = todayMatches[Math.floor(todayMatches.length / 2)];
    insights.push({
      id: 'on-this-day',
      text: `On this day in ${pick.year}: ${pick.symbol} — ${truncate(pick.title, 60)} (${pick.totalYes}–${pick.totalNo}–${pick.totalAbstentions}).`,
      kind: 'today',
    });
  }

  return insights;
}

// ─── resolution mode ──────────────────────────────────────────────────────────

export function getResolutionInsights(
  resolution: Resolution,
  allResolutions: Resolution[],
): Insight[] {
  const insights: Insight[] = [];
  const total = resolution.totalYes + resolution.totalNo + resolution.totalAbstentions;
  if (total === 0) return insights;

  const yesRate = resolution.totalYes / total;

  if (yesRate >= 0.95) {
    insights.push({
      id: 'margin',
      text: `Adopted by near-consensus: ${resolution.totalYes}–${resolution.totalNo}–${resolution.totalAbstentions}.`,
      kind: 'stat',
    });
  } else if (yesRate < 0.55) {
    insights.push({
      id: 'margin',
      text: `Contentious: only ${pct(yesRate)} voted yes (${resolution.totalYes}–${resolution.totalNo}–${resolution.totalAbstentions}).`,
      kind: 'stat',
    });
  } else {
    insights.push({
      id: 'margin',
      text: `Adopted ${resolution.totalYes}–${resolution.totalNo}–${resolution.totalAbstentions} (${pct(yesRate)} yes).`,
      kind: 'stat',
    });
  }

  // Rank by controversy in the same year
  const sameYear = allResolutions.filter(r => r.year === resolution.year);
  const controversyOf = (r: Resolution): number => {
    const t = r.totalYes + r.totalNo + r.totalAbstentions;
    return t > 0 ? r.totalNo / t : 0;
  };
  const sorted = [...sameYear].sort((a, b) => controversyOf(b) - controversyOf(a));
  const rank = sorted.findIndex(r => r.id === resolution.id) + 1;
  if (rank > 0 && rank <= 10) {
    insights.push({
      id: 'rank',
      text: `${ordinal(rank)} most contested ${resolution.body} resolution of ${resolution.year}.`,
      kind: 'record',
    });
  }

  // P5 splits
  const p5Votes = P5.map(iso => ({ iso, vote: resolution.votes[iso] }))
    .filter(v => v.vote && v.vote !== 'X');
  if (p5Votes.length >= 3 && new Set(p5Votes.map(v => v.vote)).size > 1) {
    const yesP5 = p5Votes.filter(v => v.vote === 'Y').map(v => v.iso);
    const noP5 = p5Votes.filter(v => v.vote === 'N').map(v => v.iso);
    if (noP5.length > 0 && yesP5.length > 0) {
      insights.push({
        id: 'p5-split',
        text: `P5 split: ${yesP5.join(', ')} voted yes; ${noP5.join(', ')} voted no.`,
        kind: 'trend',
      });
    }
  }

  return insights;
}

// ─── topic mode ───────────────────────────────────────────────────────────────

export function getTopicInsights(resolutions: Resolution[]): Insight[] {
  const insights: Insight[] = [];
  if (resolutions.length === 0) return insights;

  const firstYear = Math.min(...resolutions.map(r => r.year));
  insights.push({
    id: 'topic-count',
    text: `${resolutions.length} resolutions on this topic since ${firstYear}.`,
    kind: 'stat',
  });

  // P5 unanimity rate
  let p5AgreeCount = 0;
  for (const res of resolutions) {
    const p5Votes = P5.map(iso => res.votes[iso]).filter(v => v && v !== 'X');
    if (p5Votes.length >= 4 && new Set(p5Votes).size === 1) p5AgreeCount++;
  }
  insights.push({
    id: 'p5-unanimity',
    text: `P5 agreed unanimously on ${p5AgreeCount} of ${resolutions.length} (${pct(p5AgreeCount / resolutions.length)}).`,
    kind: 'stat',
  });

  // Most contested
  const mostContested = resolutions.reduce((best, r) => {
    const t = r.totalYes + r.totalNo + r.totalAbstentions;
    const bestT = best.totalYes + best.totalNo + best.totalAbstentions;
    const score = t > 0 ? r.totalNo / t : 0;
    const bestScore = bestT > 0 ? best.totalNo / bestT : 0;
    return score > bestScore ? r : best;
  });
  const contestedTotal = mostContested.totalYes + mostContested.totalNo + mostContested.totalAbstentions;
  if (contestedTotal > 0 && mostContested.totalNo / contestedTotal > 0.1) {
    insights.push({
      id: 'most-contested',
      text: `Most contested: ${mostContested.symbol} (${mostContested.totalYes}–${mostContested.totalNo}–${mostContested.totalAbstentions}, ${mostContested.year}).`,
      kind: 'record',
    });
  }

  return insights;
}

// ─── significance score (0–100) ────────────────────────────────────────────────

export function computeSignificanceScore(
  resolution: Resolution,
  topicAvgYesRate: number | null,
): number {
  const total = resolution.totalYes + resolution.totalNo + resolution.totalAbstentions;
  if (total === 0) return 0;

  const yesRate = resolution.totalYes / total;

  // Participation: up to 30 pts (150 participating countries = full score)
  const participationScore = Math.min(1, total / 150) * 30;

  // Controversy: up to 40 pts (50% yes = max controversy)
  const controversyScore = (1 - Math.abs(yesRate - 0.5) * 2) * 40;

  // Topic unusualness: up to 30 pts
  let unusualnessScore = 15;
  if (topicAvgYesRate !== null) {
    const deviation = Math.abs(yesRate - topicAvgYesRate);
    unusualnessScore = Math.min(1, deviation / 0.3) * 30;
  }

  return Math.round(participationScore + controversyScore + unusualnessScore);
}

// ─── trend direction ──────────────────────────────────────────────────────────

export function computeTrendDirection(
  iso3: string,
  year: number,
  yearlyAggregates: YearlyAggregate[],
): 'up' | 'down' | 'stable' | null {
  const currentEntry = yearlyAggregates.find(e => e.year === year);
  const currentStats = currentEntry?.countries[iso3];
  if (!currentStats) return null;

  const currentCast = currentStats.yes + currentStats.no + currentStats.abstain;
  if (currentCast === 0) return null;
  const currentRate = currentStats.yes / currentCast;

  const priorRates: number[] = [];
  for (let y = year - 3; y < year; y++) {
    const entry = yearlyAggregates.find(e => e.year === y);
    if (!entry?.countries[iso3]) continue;
    const stats = entry.countries[iso3];
    const cast = stats.yes + stats.no + stats.abstain;
    if (cast === 0) continue;
    priorRates.push(stats.yes / cast);
  }
  if (priorRates.length === 0) return null;

  const priorAvg = priorRates.reduce((a, b) => a + b, 0) / priorRates.length;
  const delta = currentRate - priorAvg;
  if (delta > 0.05) return 'up';
  if (delta < -0.05) return 'down';
  return 'stable';
}

// ─── all-country trend map ─────────────────────────────────────────────────────

export function computeAllTrends(
  year: number,
  yearlyAggregates: YearlyAggregate[],
): Record<string, 'up' | 'down' | 'stable'> {
  const currentEntry = yearlyAggregates.find(e => e.year === year);
  if (!currentEntry) return {};

  const result: Record<string, 'up' | 'down' | 'stable'> = {};
  for (const iso3 of Object.keys(currentEntry.countries)) {
    const dir = computeTrendDirection(iso3, year, yearlyAggregates);
    if (dir) result[iso3] = dir;
  }
  return result;
}
