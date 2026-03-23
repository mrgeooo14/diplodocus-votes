/**
 * Cross-match UNGA_all.json / UNSC_all.json against resolutions in Supabase
 * and populate the resolution_content table.
 *
 * Usage:
 *   node scripts/migrate-resolution-content.mjs
 *
 * Requires scripts/.env with:
 *   SUPABASE_URL=https://xxx.supabase.co
 *   SUPABASE_SERVICE_KEY=eyJ...
 *
 * The large JSON files (304MB / 44MB) are read as a stream and parsed
 * record-by-record to avoid loading everything into memory at once.
 */

import { createReadStream, readFileSync } from 'fs';
import { createInterface } from 'readline';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

const envPath = join(__dir, '.env');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => l.split('=').map(s => s.trim()))
);

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

const BATCH = 200;

function normalize(s) {
  return s.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
}

/** Stream a JSON array file, yielding one parsed object per element. */
async function* streamJsonArray(filePath) {
  const rl = createInterface({ input: createReadStream(filePath, 'utf8'), crlfDelay: Infinity });
  let buffer = '';
  let depth = 0;
  let inString = false;
  let escape = false;
  let started = false;

  for await (const line of rl) {
    for (const ch of line + '\n') {
      if (escape) { escape = false; buffer += ch; continue; }
      if (ch === '\\' && inString) { escape = true; buffer += ch; continue; }
      if (ch === '"') { inString = !inString; }
      if (!inString) {
        if (ch === '{') {
          depth++;
          if (depth === 1) started = true;
        }
        if (ch === '}') depth--;
      }
      if (started) buffer += ch;
      if (started && depth === 0) {
        try { yield JSON.parse(buffer); } catch (_) { /* skip malformed */ }
        buffer = '';
        started = false;
      }
    }
  }
}

/** Extract SC resolution number from title formats like:
 *  "Resolution 738 (1992) / ..."  (UNSC_all corpus)
 *  "Security Council resolution 738 (1992) [on ...]"  (our DB)
 */
function extractScNumber(title) {
  const m = title.match(/resolution\s+(\d+)\s*\(\d{4}\)/i);
  return m ? m[1] : null;
}

async function buildResolutionMap(orgId) {
  console.log(`  Fetching ${orgId} resolution titles from Supabase...`);
  const titleMap = new Map(); // normalize(title)+year → id
  const numMap = new Map();   // SC: resolutionNumber|year → id
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('resolutions')
      .select('id, title, year')
      .eq('org_id', orgId)
      .range(from, from + pageSize - 1);
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) break;
    for (const r of data) {
      titleMap.set(normalize(r.title) + '|' + r.year, r.id);
      if (orgId === 'SC') {
        const num = extractScNumber(r.title);
        if (num) numMap.set(num + '|' + r.year, r.id);
      }
    }
    if (data.length < pageSize) break;
    from += pageSize;
  }
  console.log(`  ${titleMap.size} resolutions indexed`);
  return { titleMap, numMap };
}

function findResolutionId({ titleMap, numMap }, title, year) {
  // SC: try resolution number match first (most reliable)
  if (numMap.size > 0) {
    const num = extractScNumber(title);
    if (num) {
      const hit = numMap.get(num + '|' + year);
      if (hit) return hit;
    }
  }
  // Title-based match
  const norm = normalize(title);
  const exact = titleMap.get(norm + '|' + year);
  if (exact) return exact;
  // Substring containment fallback (GA only, avoid for SC)
  if (numMap.size === 0) {
    for (const [key, id] of titleMap) {
      const [kt, ky] = key.split('|');
      if (ky !== String(year)) continue;
      if (norm.includes(kt) || kt.includes(norm)) return id;
    }
  }
  return null;
}

async function processCorpus(filePath, orgId) {
  console.log(`\nProcessing ${filePath}`);
  const resMap = await buildResolutionMap(orgId);

  let matched = 0;
  let total = 0;
  const batch = [];
  const seenIds = new Set();

  async function flush() {
    if (batch.length === 0) return;
    const { error } = await supabase.from('resolution_content').upsert(batch, {
      onConflict: 'resolution_id',
    });
    if (error) throw new Error(`resolution_content upsert: ${error.message}`);
    batch.length = 0;
  }

  for await (const doc of streamJsonArray(filePath)) {
    total++;
    if (total % 1000 === 0) process.stdout.write(`\r  Processed ${total} docs, matched ${matched}...`);

    const title = doc.un_core?.title;
    const year = doc.un_core?.year;
    const fullText = doc.text?.normalized;
    if (!title || !year || !fullText) continue;

    const id = findResolutionId(resMap, title, year);
    if (!id || seenIds.has(id)) continue;

    seenIds.add(id);
    matched++;
    batch.push({
      resolution_id: id,
      full_text: fullText,
      doc_id: doc.doc_id ?? null,
    });

    if (batch.length >= BATCH) await flush();
  }

  await flush();
  console.log(`\n  Done. ${matched} / ${total} matched.`);
}

const dataDir = join(__dir, '..', 'public', 'data');

await processCorpus(join(dataDir, 'UNGA_all.json'), 'GA');
await processCorpus(join(dataDir, 'UNSC_all.json'), 'SC');

console.log('\nAll done.');
