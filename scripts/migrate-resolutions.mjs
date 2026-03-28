/**
 * Migrate existing ga-resolutions.json + sc-resolutions.json into Supabase.
 *
 * Usage:
 *   node scripts/migrate-resolutions.mjs
 *
 * Requires scripts/.env with:
 *   SUPABASE_URL=https://xxx.supabase.co
 *   SUPABASE_SERVICE_KEY=eyJ...
 */

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

// Load env from scripts/.env
const envPath = join(__dir, '.env');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

const BATCH = 500;

async function upsertBatch(table, rows) {
  const { error } = await supabase.from(table).upsert(rows, { onConflict: 'id' });
  if (error) throw new Error(`${table}: ${error.message}`);
}

async function upsertBatchNoId(table, rows, conflict) {
  const { error } = await supabase.from(table).upsert(rows, { onConflict: conflict });
  if (error) throw new Error(`${table}: ${error.message}`);
}

async function migrate(filePath, orgId) {
  console.log(`\nLoading ${filePath}...`);
  const resolutions = JSON.parse(readFileSync(filePath, 'utf8'));
  console.log(`  ${resolutions.length} resolutions`);

  const resBatch = [];
  const voteBatch = [];
  const subjectMap = new Map(); // label → subject row (inserted later)
  const resSubjectBatch = [];

  for (const res of resolutions) {
    resBatch.push({
      id: res.id,
      symbol: res.symbol,
      org_id: orgId,
      year: res.year,
      date: res.date || null,
      session: res.session || null,
      title: res.title,
      total_yes: res.totalYes ?? 0,
      total_no: res.totalNo ?? 0,
      total_abstentions: res.totalAbstentions ?? 0,
      total_non_voting: res.totalNonVoting ?? 0,
    });

    for (const [iso, vote] of Object.entries(res.votes ?? {})) {
      voteBatch.push({ resolution_id: res.id, country_iso: iso, vote });
    }

    for (const label of res.subjects ?? []) {
      if (!subjectMap.has(label)) subjectMap.set(label, null);
      resSubjectBatch.push({ resolution_id: res.id, subject_label: label });
    }
  }

  // Upsert resolutions
  console.log(`  Upserting ${resBatch.length} resolutions...`);
  for (let i = 0; i < resBatch.length; i += BATCH) {
    await upsertBatch('resolutions', resBatch.slice(i, i + BATCH));
    process.stdout.write(`\r    ${Math.min(i + BATCH, resBatch.length)} / ${resBatch.length}`);
  }
  console.log();

  // Upsert subjects
  const subjectLabels = [...subjectMap.keys()];
  console.log(`  Upserting ${subjectLabels.length} subjects...`);
  for (let i = 0; i < subjectLabels.length; i += BATCH) {
    const batch = subjectLabels.slice(i, i + BATCH).map(label => ({ label }));
    await upsertBatchNoId('subjects', batch, 'label');
  }

  // Fetch subject id map
  const { data: subjectRows, error: subErr } = await supabase.from('subjects').select('id, label');
  if (subErr) throw new Error(`subjects fetch: ${subErr.message}`);
  const subjectIdMap = new Map(subjectRows.map(r => [r.label, r.id]));

  // Upsert resolution_subjects
  const rsRows = resSubjectBatch
    .map(({ resolution_id, subject_label }) => ({
      resolution_id,
      subject_id: subjectIdMap.get(subject_label),
    }))
    .filter(r => r.subject_id != null);

  console.log(`  Upserting ${rsRows.length} resolution_subjects...`);
  for (let i = 0; i < rsRows.length; i += BATCH) {
    const { error } = await supabase.from('resolution_subjects').upsert(rsRows.slice(i, i + BATCH), {
      onConflict: 'resolution_id,subject_id',
    });
    if (error) throw new Error(`resolution_subjects: ${error.message}`);
    process.stdout.write(`\r    ${Math.min(i + BATCH, rsRows.length)} / ${rsRows.length}`);
  }
  console.log();

  // Upsert votes (largest batch)
  console.log(`  Upserting ${voteBatch.length} votes...`);
  for (let i = 0; i < voteBatch.length; i += BATCH) {
    const { error } = await supabase.from('votes').upsert(voteBatch.slice(i, i + BATCH), {
      onConflict: 'resolution_id,country_iso',
    });
    if (error) throw new Error(`votes: ${error.message}`);
    process.stdout.write(`\r    ${Math.min(i + BATCH, voteBatch.length)} / ${voteBatch.length}`);
  }
  console.log();
}

const dataDir = join(__dir, '..', 'public', 'data');

await migrate(join(dataDir, 'ga-resolutions.json'), 'GA');
await migrate(join(dataDir, 'sc-resolutions.json'), 'SC');

console.log('\nDone.');
