// Headless test runner for the PRISM pure-function suite (plan P1).
// Mirrors tests/run-tests.html: it loads docs/js/prisma-data.js, then
// docs/js/prisma.js (which appends the window.EC._test exposure hook), then
// docs/js/prisma-import.js (window.__PRISMA_IMPORT_TEST__, the bridge suite),
// then tests/tests.js into one jsdom window, then reports window.__TEST_RESULTS__
// and sets the process exit code. The app stays framework-free; jsdom is a
// dev dependency of this harness only and is never shipped from docs/.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createPrismaWindow } from './prisma-window.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

// createPrismaWindow loads prisma-data.js then prisma.js in the browser's order and
// stubs fetch; the import bridge and the suite itself are injected on top of that.
const { window, inject } = createPrismaWindow(root);

try {
  inject('docs/js/prisma-import.js'); // exposes window.__PRISMA_IMPORT_TEST__ for the bridge suite
  // FR-05 seed reproduction (plan P1): the app fetches the served seed at runtime, but
  // headless has no network, so the runner reads it from disk and hands the papers to
  // the suite as window.__SEED_PAPERS__. The flow test asserts the benchmark marginals.
  try {
    const seed = JSON.parse(readFileSync(join(root, 'docs/data/research_vault_v2.json'), 'utf8'));
    window.__SEED_PAPERS__ = Array.isArray(seed) ? seed : (seed.papers || []);
  } catch (e) {
    console.warn('seed not injected (FR-05 flow test skipped):', e && e.message ? e.message : e);
  }
  // FR-14 analysis panel: the app fetches docs/data/analysis_fields.json at runtime
  // (built from assessment/categories.yaml by src/publish/build_analysis_fields.py);
  // headless has no network, so hand the built vocabulary to prisma.js and the suite.
  try {
    window.__ANALYSIS_FIELDS__ = JSON.parse(readFileSync(join(root, 'docs/data/analysis_fields.json'), 'utf8'));
  } catch (e) {
    console.warn('analysis_fields not injected (FR-14 tests skipped):', e && e.message ? e.message : e);
  }
  inject('tests/tests.js');
} catch (e) {
  console.error('inject failed:', e && e.message ? e.message : e);
  process.exit(1);
}

const r = window.__TEST_RESULTS__;
console.log('title:', window.document.title);
if (!r) { console.error('no __TEST_RESULTS__ produced (exposure hook missing?)'); process.exit(1); }
for (const c of r.results) if (!c.ok) console.log('FAIL  ' + c.name + '  >>  ' + c.err);
console.log('\n' + (r.fail ? 'FAIL' : 'PASS') + ' ' + r.pass + '/' + r.total);
process.exit(r.fail ? 1 : 0);
