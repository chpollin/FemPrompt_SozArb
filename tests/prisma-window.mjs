// The one place that builds the jsdom window the tool expects. Two rules make this
// order-sensitive and are the reason it is not written out twice: prisma-data.js must load
// before prisma.js, so window.EC exists when the test hook is attached at the end of the
// closure, and fetch must reject rather than hang, because nothing here has a network.
// Used by the headless suite (tests/run.mjs) and by the reconciliation CLI
// (tests/browser/reconcile.mjs), which drives the tool's own reconcileReviewers.
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const CORE_SCRIPTS = ['docs/js/prisma-data.js', 'docs/js/prisma.js'];

export function createPrismaWindow(root, scripts = CORE_SCRIPTS) {
  const dom = new JSDOM(
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"></head>' +
    '<body><div id="results"></div><div id="prisma-root" hidden></div></body></html>',
    { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/' }
  );
  const { window } = dom;
  window.__CATEGORY_SCHEMA__ = JSON.parse(
    readFileSync(join(root, 'docs/data/category_schema.json'), 'utf8')
  );
  window.__LIFECYCLE_CONTRACT__ = JSON.parse(
    readFileSync(join(root, 'docs/data/screening_lifecycle_contract.json'), 'utf8')
  );
  window.fetch = () => Promise.reject(new Error('headless: no network'));
  const inject = (rel) => {
    const el = window.document.createElement('script');
    el.textContent = readFileSync(join(root, rel), 'utf8');
    window.document.body.appendChild(el);
  };
  scripts.forEach(inject);
  return { window, inject };
}
