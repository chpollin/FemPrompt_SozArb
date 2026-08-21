// Deterministic reconciliation of reviewer files through the tool's own function.
// Loads docs/js/prisma.js in jsdom (the same way tests/run.mjs does) and calls
// reconcileReviewers on the given files, so the CLI and the in-tool export share one
// implementation. Inputs are read only; the script prints their SHA-256 before and
// after the run so a caller can prove they were not touched.
//
//   node tests/browser/reconcile.mjs r1.json r2.json [--out reconciliation.json] [--check]
//
// --check runs the reconciliation twice with reversed input order and exits non-zero
// unless both outputs are byte-identical.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createPrismaWindow } from '../prisma-window.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');

const args = process.argv.slice(2);
const files = [];
let out = null, check = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--out') out = args[++i];
  else if (args[i] === '--check') check = true;
  else files.push(args[i]);
}
if (files.length < 1) { console.error('usage: reconcile.mjs <reviewer.json>... [--out file] [--check]'); process.exit(2); }

const sha = (p) => createHash('sha256').update(readFileSync(p)).digest('hex');
const before = files.map(sha);

const { window } = createPrismaWindow(root);
const T = window.EC && window.EC._test;
if (!T || !T.reconciliationText) { console.error('reconcileReviewers not exposed by prisma.js'); process.exit(1); }

const payloads = files.map((f) => JSON.parse(readFileSync(f, 'utf8')));
let forward, ok = true;
try {
  forward = T.reconciliationText(payloads);
} catch (e) {
  console.error('reconciliation refused:', e && e.message ? e.message : e);
  process.exit(2);
}
if (check) {
  const reversed = T.reconciliationText(payloads.slice().reverse());
  ok = forward === reversed;
  console.log('order check:', ok ? 'identical for reversed input order' : 'DIFFERS for reversed input order');
}
const after = files.map(sha);
files.forEach((f, i) => {
  const same = before[i] === after[i];
  console.log(`${same ? 'unchanged' : 'CHANGED  '} ${f} sha256=${before[i]}`);
  if (!same) ok = false;
});
if (out) { writeFileSync(out, forward + '\n'); console.log('wrote', out, 'sha256=' + createHash('sha256').update(forward + '\n').digest('hex')); }
else process.stdout.write(forward + '\n');
const r = JSON.parse(forward);
console.log('summary:', JSON.stringify(r.summary), 'reviewers:', r.reviewers.join(','));
process.exit(ok ? 0 : 1);
