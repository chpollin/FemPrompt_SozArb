import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const categories = [
  'AI_Literacies',
  'Generative_KI',
  'Prompting',
  'KI_Sonstige',
  'Soziale_Arbeit',
  'Bias_Ungleichheit',
  'Gender',
  'Diversitaet',
  'Feministisch',
  'Fairness',
];
const techniqueCategories = new Set(categories.slice(0, 4));
const socialCategories = new Set(categories.slice(4));
const levels = new Map([
  ['nein', 0],
  ['teilweise', 1],
  ['ja', 2],
]);
const decisions = new Set(['Include', 'Unclear', 'Exclude']);
const exclusionReasons = new Set(['Duplicate', 'Not_relevant_topic', 'Wrong_publication_type', 'No_full_text', 'Language']);

function json(path) {
  return JSON.parse(readFileSync(resolve(root, path), 'utf8'));
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');
}

function normalizedText(value) {
  return String(value || '')
    .normalize('NFKC')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function derivedDecision(codedCategories) {
  const technique = Math.max(...[...techniqueCategories].map((name) => levels.get(codedCategories[name])));
  const social = Math.max(...[...socialCategories].map((name) => levels.get(codedCategories[name])));
  if (technique === 2 && social === 2) return 'Include';
  if (technique >= 1 && social >= 1) return 'Unclear';
  return 'Exclude';
}

function validateAnalysis(analysis, vocabulary, label, errors) {
  if (!analysis || typeof analysis !== 'object' || Array.isArray(analysis)) {
    errors.push(`${label}.analysis is missing`);
    return;
  }
  const undecidable = analysis.undecidable || {};
  for (const field of vocabulary.fields) {
    const value = analysis[field.name];
    if (field.free_text) {
      if (value !== undefined && typeof value !== 'string') errors.push(`${label}.analysis.${field.name} must be text`);
      continue;
    }
    if (undecidable[field.name] === true) {
      if (value !== undefined && (!Array.isArray(value) || value.length))
        errors.push(`${label}.analysis.${field.name} must be empty when marked undecidable`);
      continue;
    }
    if (field.multi) {
      if (!Array.isArray(value) || !value.length || new Set(value).size !== value.length)
        errors.push(`${label}.analysis.${field.name} must contain unique controlled values`);
      else {
        if (value.some((entry) => !field.values.includes(entry))) errors.push(`${label}.analysis.${field.name} contains an unknown value`);
        if (value.includes('None') && value.length > 1) errors.push(`${label}.analysis.${field.name} combines None with substantive values`);
      }
    } else if (!field.values.includes(value)) {
      errors.push(`${label}.analysis.${field.name} contains an unknown value`);
    }
  }
  if (!vocabulary.study_types.includes(analysis.Studientyp)) errors.push(`${label}.analysis.Studientyp contains an unknown value`);
  if (analysis.AN_Coding_Basis !== 'Fulltext') errors.push(`${label}.analysis.AN_Coding_Basis must be Fulltext for this run`);
  for (const field of Object.keys(undecidable)) {
    if (!vocabulary.fields.some((candidate) => candidate.name === field) || undecidable[field] !== true)
      errors.push(`${label}.analysis.undecidable contains an invalid entry`);
  }
}

export function validateCodingPacket(packet, run, reviewerId) {
  const errors = [];
  if (packet?.schema !== 'femprompt-prisma-coding-packet/0.1') errors.push('schema must be femprompt-prisma-coding-packet/0.1');
  if (packet?.run_id !== run.run_id) errors.push('run_id differs from manifest');
  if (packet?.reviewer !== reviewerId) errors.push('reviewer differs from requested track');
  if (packet?.actor !== 'agent') errors.push('actor must be agent');
  if (packet?.source_mode !== run.execution?.mode) errors.push('source_mode differs from manifest execution mode');

  const track = run.tracks.find((candidate) => candidate.reviewer_id === reviewerId);
  if (!track) return { ok: false, errors: [`reviewer ${reviewerId} is absent from manifest`] };
  const expectedIds = [...track.paper_ids].sort();
  const actualIds = Object.keys(packet?.decisions || {}).sort();
  if (JSON.stringify(actualIds) !== JSON.stringify(expectedIds)) errors.push('decision IDs differ from the complete track assignment');

  const vocabulary = json('docs/data/analysis_fields.json');
  for (const id of expectedIds) {
    const record = packet?.decisions?.[id];
    const assignment = track.source_assignments.find((source) => source.paper_id === id);
    const label = `${reviewerId}/${id}`;
    if (!record || !assignment) {
      errors.push(`${label} is missing`);
      continue;
    }
    if (record.source_path !== assignment.source_path) errors.push(`${label}.source_path differs from manifest`);
    if (sha256(assignment.source_path) !== assignment.source_sha256.toLowerCase()) errors.push(`${label} source hash differs from manifest`);
    if (!['verified', 'provisional'].includes(record.identity_check?.status) || !String(record.identity_check?.basis || '').trim())
      errors.push(`${label}.identity_check must be verified or provisional and explained`);

    const codedCategoryNames = Object.keys(record.categories || {}).sort();
    if (JSON.stringify(codedCategoryNames) !== JSON.stringify([...categories].sort())) errors.push(`${label}.categories must contain exactly ten categories`);
    const evidenceNames = Object.keys(record.evidence || {}).sort();
    if (JSON.stringify(evidenceNames) !== JSON.stringify([...categories].sort())) errors.push(`${label}.evidence must contain exactly ten categories`);
    for (const category of categories) {
      const level = record.categories?.[category];
      const quotes = record.evidence?.[category];
      if (!levels.has(level)) errors.push(`${label}.${category} has an invalid level`);
      if (!Array.isArray(quotes)) {
        errors.push(`${label}.${category} evidence must be an array`);
        continue;
      }
      if (levels.get(level) > 0 && !quotes.length) errors.push(`${label}.${category} is positive without evidence`);
      if (levels.get(level) === 0 && quotes.length) errors.push(`${label}.${category} has evidence at level nein`);
    }

    if (!decisions.has(record.decision)) errors.push(`${label}.decision is invalid`);
    else if (Object.values(record.categories || {}).every((value) => levels.has(value)) && record.decision !== derivedDecision(record.categories))
      errors.push(`${label}.decision differs from the category threshold`);
    if (record.decision === 'Exclude') {
      if (!exclusionReasons.has(record.reason)) errors.push(`${label}.reason is required and controlled for Exclude`);
    } else if (record.reason !== null) {
      errors.push(`${label}.reason must be null outside Exclude`);
    }

    const paperText = normalizedText(readFileSync(resolve(root, assignment.source_path), 'utf8'));
    for (const [category, quotes] of Object.entries(record.evidence || {})) {
      for (const [index, quote] of quotes.entries()) {
        const normalizedQuote = normalizedText(quote);
        if (!normalizedQuote || !paperText.includes(normalizedQuote))
          errors.push(`${label}.${category} evidence[${index}] is absent from its assigned source: ${String(quote).slice(0, 80)}`);
      }
    }

    if (record.decision === 'Include') validateAnalysis(record.analysis, vocabulary, label, errors);
    else if ('analysis' in record) errors.push(`${label}.analysis must be absent outside Include`);
  }

  return { ok: errors.length === 0, errors: [...new Set(errors)] };
}

function main() {
  const [runPath, reviewerId] = process.argv.slice(2);
  if (!runPath || !reviewerId) throw new Error('usage: node tests/review-cases/validate-coding-packet.mjs <run.json> <reviewer-id>');
  const run = json(runPath);
  const track = run.tracks.find((candidate) => candidate.reviewer_id === reviewerId);
  if (!track?.coding_packet) throw new Error(`manifest has no coding packet for ${reviewerId}`);
  const result = validateCodingPacket(json(track.coding_packet), run, reviewerId);
  if (!result.ok) {
    console.error(`FAIL coding packet: ${reviewerId}`);
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`PASS coding packet: ${reviewerId}, ${track.paper_ids.length} records`);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) main();
