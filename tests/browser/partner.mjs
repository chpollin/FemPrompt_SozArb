// Partner acceptance run for the reviewer workflow (knowledge/testing.md, "Partner
// acceptance run"). It drives a fresh local clone that already ran `npm run build` and
// serves it with `python -X utf8 -m src.publish.serve`:
//
//   node tests/browser/partner.mjs --clone C:\tmp\fp-partner-<date> --base http://127.0.0.1:<port> --reviewer sabine
//
// Everything a reviewer does runs in Chromium against the real build and the real server,
// which writes the reviewer file into the clone itself, so no folder picker or browser
// permission is involved. Writes are read from `git status` of the clone. The script never
// commits, pushes or deletes anything.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const opt = { clone: null, base: null, reviewer: 'sabine', out: null };
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--clone') opt.clone = args[++i];
  else if (args[i] === '--base') opt.base = args[++i];
  else if (args[i] === '--reviewer') opt.reviewer = args[++i];
  else if (args[i] === '--out') opt.out = args[++i];
}
if (!opt.clone || !opt.base) { console.error('usage: --clone <path> --base <url> [--reviewer key] [--out dir]'); process.exit(2); }
const root = resolve(opt.clone);
const outDir = resolve(opt.out || join(dirname(fileURLToPath(import.meta.url)), 'out', 'partner'));
mkdirSync(outDir, { recursive: true });

// untracked or changed paths of the clone, so the run can name exactly what it wrote
const changed = () => execFileSync('git', ['-C', root, 'status', '--porcelain', '--untracked-files=all'], { encoding: 'utf8' })
  .split('\n').filter(Boolean).map((line) => line.slice(3));
const before = new Set(changed());
const checks = [];
let failed = 0;
function check(name, ok, detail) {
  checks.push({ name, ok: !!ok, detail });
  if (!ok) failed++;
  console.log((ok ? 'ok   ' : 'FAIL ') + name + (!ok && detail !== undefined ? '  >> ' + JSON.stringify(detail).slice(0, 600) : ''));
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-AT' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
const key = opt.reviewer;
let paperId = null;
try {
  await page.goto(opt.base + '/prisma.html');
  await page.waitForFunction(() => window.__PRISMA_TEST__ && document.querySelector('#pt-doc'), null, { timeout: 30000 });
  check('1 open: prisma.html loads from the clone server and offers Lesen and Bearbeiten',
    await page.evaluate(() => window.__PRISMA_TEST__.localEditingAvailable() && document.querySelectorAll('.pt-mode-seg button').length === 2));

  await page.getByRole('button', { name: 'Bearbeiten', exact: true }).click();
  await page.waitForFunction(() => window.__PRISMA_TEST__.canEdit());
  await page.click(`.pt-reviewer-choice [data-reviewer="${key}"]`);
  await page.waitForFunction((k) => window.__PRISMA_TEST__.getState().reviewer === k, key);
  check('2 Bearbeiten: the reviewer is chosen by name from the assignment, without typing a key',
    (await page.evaluate(() => window.__PRISMA_TEST__.getState().reviewer)) === key);

  await page.waitForFunction(() => !!window.__PRISMA_TEST__.screeningHandle(), null, { timeout: 15000 });
  check('3 folder: the clone server is the working folder, with no folder action or picker offered',
    await page.evaluate(() => window.__PRISMA_TEST__.screeningHandle().server === true &&
      !document.querySelector('.pt-folder-action, .pt-change-folder')));

  await page.click('.pt-status-seg [data-status="offen"]');
  await page.click(`.pt-assignee-seg [data-assignee="${key}"]`);
  await page.click('#pt-corpus-list .pt-nav-item');
  await page.waitForFunction(() => !window.__PRISMA_TEST__.readingPending() && document.querySelector('#pt-assess-col .pt-dim'), null, { timeout: 15000 });
  paperId = await page.evaluate(() => window.EC.getAllPapers()[window.__PRISMA_TEST__.getState().index].id);
  const assigned = JSON.parse(readFileSync(join(root, 'docs/data/screening/assignment.json'), 'utf8')).assignments[paperId];
  check('4 list: Offen plus Zuteilung opens a paper assigned to the reviewer', assigned === key, { paperId, assigned });
  // the codebook text of the real schema at the toggle under focus, and no position counter
  await page.focus('#pt-assess-col .pt-dim .category-chip[data-cat="Gender"]');
  const codebookPanel = await page.evaluate(async () => {
    const gender = (await (await fetch('data/category_schema.json')).json()).categories.find((c) => c.key === 'Gender');
    const panel = document.getElementById('pt-cat-def');
    return { shown: !!panel && !panel.hidden && panel.textContent.includes(gender.definition) &&
        gender.examples_negative.every((example) => panel.textContent.includes(example)),
      counter: /\d+\s*\/\s*\d+/.test(document.querySelector('.pt-nav-tools').textContent) };
  });
  check('4b codebook: focus on Gender shows its definition and negative example, no "n / N" counter', codebookPanel.shown && !codebookPanel.counter, codebookPanel);

  // one Paper Beleg from the in-text search, then an exclusion reason, then the disk action
  const term = await page.evaluate(() => {
    const words = (document.getElementById('pt-doc').textContent.match(/[A-Za-z]{7,}/g) || []);
    return words[Math.min(5, words.length - 1)] || null;
  });
  await page.fill('#pt-intext', term);
  await page.waitForFunction(() => document.querySelectorAll('#pt-doc mark.pt-hit').length > 0);
  await page.click('#pt-pin-hit');
  await page.click('#pt-pinmenu .category-chip[data-cat="Soziale_Arbeit"]');
  await page.click('#pt-assess-col .pt-reason-chip[data-reason="Not_relevant_topic"]');
  await page.waitForSelector('#pt-record:not([aria-disabled])', { timeout: 10000 });
  await page.screenshot({ path: join(outDir, 'partner-before-save.png') });
  await page.keyboard.press('Control+S');
  await page.waitForFunction(() => /Gespeichert in/.test(document.getElementById('pt-save-status')?.textContent || ''), null, { timeout: 15000 });
  await page.screenshot({ path: join(outDir, 'partner-after-save.png') });
  check('5 assess: one pinned Paper Beleg and a reason, saved with Ctrl+S', /Gespeichert in .+\/docs\/data\/screening\//.test(await page.textContent('#pt-save-status')), { paperId, term, status: await page.textContent('#pt-save-status') });

  const file = join(root, 'docs/data/screening', key + '.json');
  const written = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
  const rec = written && written.decisions && written.decisions[paperId];
  check('6 file: docs/data/screening/<key>.json in the clone holds the record',
    written && written.schema === 'femprompt-prisma-reviewer/0.5' && written.reviewer === key && rec && rec.decision === 'Exclude' &&
      rec.reason === 'Not_relevant_topic' && (rec.evidence.Soziale_Arbeit || []).length === 1 && rec.actor === 'human',
    { schema: written && written.schema, reviewer: written && written.reviewer, rec });
  const writtenPaths = changed().filter((path) => !before.has(path));
  check('7 writes: the run changed only the reviewer file', writtenPaths.length === 1 && writtenPaths[0] === `docs/data/screening/${key}.json`, writtenPaths);
  // the saved paper leaves Offen; under Erfasst it is listed with the PRISM capture mark
  await page.click('.pt-status-seg [data-status="erfasst"]');
  check('8 list: the saved paper moves from Offen to Erfasst with its capture mark', await page.evaluate((id) => {
    const item = Array.from(document.querySelectorAll('#pt-corpus-list .pt-nav-item'))
      .find((el) => window.EC.getAllPapers()[parseInt(el.dataset.i, 10)].id === id);
    return !!item && item.dataset.state === 'erfasst' && !!item.querySelector('.pt-mark-erfasst');
  }, paperId));
  check('9 no script errors', errors.length === 0, errors);
} catch (e) {
  failed++;
  checks.push({ name: 'driver exception', ok: false, detail: String(e && e.stack || e) });
  console.error('driver exception:', e);
  try { await page.screenshot({ path: join(outDir, 'partner-error.png') }); } catch (_) {}
} finally {
  writeFileSync(join(outDir, 'partner-trace.json'), JSON.stringify({ clone: root, base: opt.base, reviewer: key, paperId, checks }, null, 2) + '\n');
  await browser.close();
}
console.log(`\n${failed ? 'FAIL' : 'PASS'} partner run: ${checks.filter((c) => c.ok).length}/${checks.length} checks, paper ${paperId}, out: ${outDir}`);
process.exit(failed ? 1 : 0);
