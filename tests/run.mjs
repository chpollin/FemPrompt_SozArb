// Headless test runner for the PRISM pure-function suite (plan P1).
// Mirrors tests/run-tests.html: it loads docs/js/prisma-data.js, then
// docs/js/prisma.js (which appends the window.EC._test exposure hook), then
// tests/tests.js into one jsdom window, then reports window.__TEST_RESULTS__
// and sets the process exit code. The app stays framework-free; jsdom is a
// dev dependency of this harness only and is never shipped from docs/.
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const dom = new JSDOM(
  '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"></head>' +
  '<body><div id="results"></div><div id="prisma-root" hidden></div></body></html>',
  { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/' }
);
const { window } = dom;

// The pure-function suite needs no network. prisma-data.js attempts to fetch the
// research vault and is written to catch that failure; make fetch reject so it
// takes the caught path instead of hanging.
window.fetch = () => Promise.reject(new Error('headless: no network'));

function inject(rel) {
  const el = window.document.createElement('script');
  el.textContent = readFileSync(join(root, rel), 'utf8');
  window.document.body.appendChild(el);
}

try {
  inject('docs/js/prisma-data.js');
  inject('docs/js/prisma.js');
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
