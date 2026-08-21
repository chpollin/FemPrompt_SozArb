// Supported-browser pilot for PRISM (tests/pilot/README.md). Drives one isolated reviewer
// session end to end in Chromium through Playwright against the fixture corpus, never
// against production data: docs/ is served as is and only the corpus, the full-text
// manifest and the full texts are overlaid by request interception. Writes screenshots,
// the exported reviewer file, the decision-log CSV and a JSON trace of every check.
//
//   node tests/browser/pilot.mjs --reviewer r1 --out tests/browser/out/r1 [--port 8765] [--headed]
//
// Exit code is non-zero when any check fails. The File System Access write path needs a
// native picker and stays on tests/manual-checklist.md.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const docs = join(root, 'docs');
const pilotDir = join(root, 'tests', 'pilot');
const manifest = JSON.parse(readFileSync(join(pilotDir, 'manifest.json'), 'utf8'));

const args = process.argv.slice(2);
const opt = { reviewer: 'r1', out: null, port: 8765, headed: false };
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--reviewer') opt.reviewer = args[++i];
  else if (args[i] === '--out') opt.out = args[++i];
  else if (args[i] === '--port') opt.port = parseInt(args[++i], 10);
  else if (args[i] === '--headed') opt.headed = true;
}
if (!manifest.reviewers[opt.reviewer]) { console.error('unknown reviewer ' + opt.reviewer + '; manifest has ' + Object.keys(manifest.reviewers).join(',')); process.exit(2); }
const outDir = resolve(opt.out || join(here, 'out', opt.reviewer));
mkdirSync(outDir, { recursive: true });
const script = manifest.reviewers[opt.reviewer];
const LS_KEY = 'femprompt-prisma-state/0.2';

// --- minimal static server over docs/ (no directory listing, no path escape) ---
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
const server = createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = resolve(docs, '.' + urlPath);
  if (!file.startsWith(docs) || !existsSync(file) || statSync(file).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(opt.port, '127.0.0.1', r));
const base = `http://127.0.0.1:${opt.port}`;

// --- trace ---
const trace = { reviewer: opt.reviewer, started: new Date().toISOString(), base, checks: [], screenshots: [], files: {} };
let failed = 0;
function check(name, cond, detail) {
  const ok = !!cond;
  if (!ok) failed++;
  trace.checks.push({ name, ok, detail: detail === undefined ? null : detail });
  console.log((ok ? 'ok   ' : 'FAIL ') + name + (detail !== undefined && !ok ? '  >> ' + JSON.stringify(detail) : ''));
}
async function shot(page, name) {
  const p = join(outDir, name + '.png');
  await page.screenshot({ path: p, fullPage: false });
  trace.screenshots.push(name + '.png');
}
const hook = (page, expr) => page.evaluate(expr);

const browser = await chromium.launch({ headless: !opt.headed });
const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 900 }, locale: 'de-AT' });
trace.browser = browser.version();

// fixture overlay: corpus, full-text manifest, full texts, empty corpus index; no external hosts
const fixture = (rel) => readFileSync(join(pilotDir, 'fixtures', rel));
await context.route('**/*', async (route) => {
  const url = new URL(route.request().url());
  // external hosts (web fonts, icon CSS) answer empty so the page has no network dependence
  if (url.host !== `127.0.0.1:${opt.port}`) return route.fulfill({ status: 200, contentType: 'text/css', body: '' });
  const p = url.pathname;
  if (p.endsWith('/data/research_vault_v2.json')) return route.fulfill({ contentType: 'application/json', body: fixture('vault.json') });
  if (p.endsWith('/data/fulltext_manifest.json')) return route.fulfill({ contentType: 'application/json', body: fixture('fulltext_manifest.json') });
  if (p.endsWith('/data/fulltext_index.json')) return route.fulfill({ contentType: 'application/json', body: '{"meta":{},"papers":{}}' });
  const m = p.match(/\/data\/fulltext\/([^/]+)\.md$/);
  if (m) {
    const f = join(pilotDir, 'fixtures', 'fulltext', decodeURIComponent(m[1]) + '.md');
    return existsSync(f) ? route.fulfill({ contentType: 'text/markdown', body: readFileSync(f) }) : route.fulfill({ status: 404, body: '' });
  }
  return route.continue();
});
// reviewer key: the documented manual step, seeded once into the persisted config
await context.addInitScript(({ key, reviewer }) => {
  if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify({ schema: key, config: { reviewer }, reviewers: {}, checklist: {} }));
}, { key: LS_KEY, reviewer: opt.reviewer });

const page = await context.newPage();
page.on('dialog', (d) => d.accept());
const consoleErrors = [];
page.on('pageerror', (e) => consoleErrors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });

async function waitInit() {
  await page.waitForFunction(() => window.__PRISMA_TEST__ && document.querySelector('#pt-doc'), null, { timeout: 15000 });
}
async function currentPaperId() { return hook(page, '(() => { const T = window.__PRISMA_TEST__; const s = T.getState(); return window.EC.getAllPapers()[s.index].id; })()'); }
async function setChipLevel(cat, level) {
  // chips cycle nein -> teilweise -> ja; the rail re-renders on each click, so re-query
  for (let guard = 0; guard < 3; guard++) {
    const cur = await page.getAttribute(`#pt-assess-col .pt-chip[data-cat="${cat}"]`, 'data-level');
    if (parseInt(cur, 10) === level) return;
    await page.click(`#pt-assess-col .pt-chip[data-cat="${cat}"]`);
  }
}
async function gotoPaper(id) {
  await hook(page, `(() => { const T = window.__PRISMA_TEST__; const ps = window.EC.getAllPapers(); T.getState().index = ps.findIndex(p => p.id === ${JSON.stringify(id)}); T.showSurface('screening'); })()`);
  await page.waitForFunction((id) => document.querySelector('#pt-doc') && !/lädt/.test(document.querySelector('#pt-doc').textContent) && document.querySelector('#pt-paper-title') && document.title !== null && window.__PRISMA_TEST__.getState && window.EC.getAllPapers()[window.__PRISMA_TEST__.getState().index].id === id, id);
}
async function screenPaper(paperSpec, decisionSpec) {
  const id = paperSpec.id;
  await gotoPaper(id);
  await page.waitForFunction(() => document.querySelector('#pt-doc') && !/Volltext lädt/.test(document.querySelector('#pt-doc').textContent), null, { timeout: 10000 });
  const pill = await page.textContent('.pt-read-meta .pt-pill');
  check(`${id}: source pill`, paperSpec.expected_text_source === 'raw' ? pill === 'Volltext' : pill === 'nur Abstract', pill);
  if (!paperSpec.has_ai_layer) check(`${id}: layer toggle hidden without an AI layer`, await page.evaluate(() => { const t = document.getElementById('pt-layer-toggle'); return !t || getComputedStyle(t).display === 'none'; }));
  check(`${id}: text_source after load`, (await hook(page, 'window.__PRISMA_TEST__.textSource()')) === paperSpec.expected_text_source, await hook(page, 'window.__PRISMA_TEST__.textSource()'));
  if (paperSpec.search_term) {
    await page.fill('#pt-intext', paperSpec.search_term);
    await page.waitForFunction(() => /^\d+\/\d+$/.test(document.querySelector('#pt-intext-count').textContent), null, { timeout: 5000 });
    const cnt = await page.textContent('#pt-intext-count');
    check(`${id}: in-text search hits`, /^\d+\/\d+$/.test(cnt) && !cnt.startsWith('0/'), cnt);
    await page.click('#pt-pin-hit');
    await page.waitForSelector(`#pt-pinmenu .pt-pinmenu-cat[data-cat="${paperSpec.pin_category}"]`, { timeout: 5000 });
    await page.click(`#pt-pinmenu .pt-pinmenu-cat[data-cat="${paperSpec.pin_category}"]`);
    const evCount = await hook(page, `(() => { const w = window.__PRISMA_TEST__.getWork(); return (w.evidence[${JSON.stringify(paperSpec.pin_category)}] || []).length; })()`);
    check(`${id}: Beleg pinned on ${paperSpec.pin_category}`, evCount === 1, evCount);
    const lvl = await page.getAttribute(`#pt-assess-col .pt-chip[data-cat="${paperSpec.pin_category}"]`, 'data-level');
    check(`${id}: pinned category set to ja`, lvl === '2', lvl);
  }
  for (const [cat, level] of Object.entries(decisionSpec.categories)) await setChipLevel(cat, level);
  if (decisionSpec.reason) {
    await page.waitForSelector(`#pt-assess-col .pt-reason-chip[data-reason="${decisionSpec.reason}"]`, { timeout: 5000 });
    await page.click(`#pt-assess-col .pt-reason-chip[data-reason="${decisionSpec.reason}"]`);
  }
  await page.waitForSelector('#pt-record:not([disabled])', { timeout: 5000 });
  await shot(page, `${id}-before-commit`);
  await page.click('#pt-record');
  const rec = await hook(page, `window.__PRISMA_TEST__.curDec()[${JSON.stringify(id)}] || null`);
  check(`${id}: record exists`, !!rec);
  check(`${id}: decision`, rec && rec.decision === decisionSpec.expected_decision, rec && rec.decision);
  check(`${id}: reviewer key`, rec && rec.reviewer === opt.reviewer, rec && rec.reviewer);
  check(`${id}: text_source recorded`, rec && rec.text_source === paperSpec.expected_text_source, rec && rec.text_source);
  if (paperSpec.pin_category) check(`${id}: evidence persisted in record`, rec && rec.evidence && rec.evidence[paperSpec.pin_category] && rec.evidence[paperSpec.pin_category].length === 1);
  if (decisionSpec.reason) check(`${id}: exclusion reason`, rec && rec.reason === decisionSpec.reason, rec && rec.reason);
  await gotoPaper(id);
  const locked = await page.$('#pt-assess-col .pt-pill-lg');
  check(`${id}: locked view after commit`, !!locked);
  await shot(page, `${id}-committed`);
}

try {
  // 1 cold load
  await page.goto(base + '/prisma.html');
  await waitInit();
  const n = await hook(page, 'window.EC.getAllPapers().length');
  check('cold load: fixture corpus of two papers', n === 2, n);
  check('cold load: reviewer key seeded', (await hook(page, 'window.__PRISMA_TEST__.getState().reviewer')) === opt.reviewer);
  check('toolbar: PRISMA-Record and Daten & Sync affordances present', (await page.$$('.pt-ws-panel')).length === 2);
  // the first paint may precede the full-text manifest; the pill must correct itself without navigation
  let pillOk = true;
  try { await page.waitForFunction(() => (document.querySelector('.pt-read-meta .pt-source-pill') || {}).textContent === 'Volltext', null, { timeout: 3000 }); } catch (_) { pillOk = false; }
  check('cold load: source pill corrects to Volltext once the manifest resolves', pillOk, await page.textContent('.pt-read-meta .pt-pill'));
  await shot(page, '01-cold-load');

  // 2, 3 screen both papers
  for (const paperSpec of manifest.papers) await screenPaper(paperSpec, script[paperSpec.id]);

  // 4 reload
  await page.reload();
  await waitInit();
  const afterReload = await hook(page, 'Object.keys(window.__PRISMA_TEST__.curDec()).sort()');
  check('reload: both records persisted', JSON.stringify(afterReload) === JSON.stringify(manifest.papers.map((p) => p.id).sort()), afterReload);
  const tsAfter = await hook(page, 'Object.fromEntries(Object.entries(window.__PRISMA_TEST__.curDec()).map(([k, v]) => [k, v.text_source]))');
  check('reload: text_source survives', manifest.papers.every((p) => tsAfter[p.id] === p.expected_text_source), tsAfter);
  await gotoPaper(manifest.papers[0].id);
  check('reload: locked view for paper A', !!(await page.$('#pt-assess-col .pt-pill-lg')));
  await shot(page, '04-after-reload');

  // 5 export reviewer file via the data panel
  await page.click('.pt-ws-panel[data-panel="data"]');
  await page.waitForSelector('#pt-overlay:not([hidden]) .pt-exp-rev', { timeout: 5000 });
  let dl = page.waitForEvent('download');
  await page.click('.pt-exp-rev');
  let d = await dl;
  const exportPath = join(outDir, `${opt.reviewer}.json`);
  await d.saveAs(exportPath);
  trace.files.reviewer_export = exportPath;
  const exported = JSON.parse(readFileSync(exportPath, 'utf8'));
  check('export: schema 0.3', exported.schema === 'femprompt-prisma-reviewer/0.3', exported.schema);
  check('export: reviewer key', exported.reviewer === opt.reviewer);
  check('export: both decisions with text_source', manifest.papers.every((p) => exported.decisions[p.id] && exported.decisions[p.id].text_source === p.expected_text_source));
  check('export: decisions sorted by paper id (deterministic file)', JSON.stringify(Object.keys(exported.decisions)) === JSON.stringify(Object.keys(exported.decisions).slice().sort()));
  const exportedDecisions = JSON.stringify(exported.decisions);

  // 6 clear own session, then import the export
  await page.click('.pt-clear'); // confirm dialog auto-accepted
  await page.waitForFunction(() => Object.keys(window.__PRISMA_TEST__.curDec()).length === 0, null, { timeout: 5000 });
  check('clear: own session empty', true);
  await page.click('.pt-ws-panel[data-panel="data"]');
  await page.waitForSelector('#pt-overlay:not([hidden]) .pt-imp', { state: 'attached', timeout: 5000 }); // the file input is hidden behind its label
  await page.setInputFiles('.pt-imp', exportPath);
  await page.waitForFunction(() => Object.keys(window.__PRISMA_TEST__.curDec()).length === 2, null, { timeout: 5000 });
  const imported = await hook(page, 'window.__PRISMA_TEST__.curDec()');
  check('import: records restored byte-equal to the export', JSON.stringify(imported) === exportedDecisions);
  check('import: text_source restored', manifest.papers.every((p) => imported[p.id].text_source === p.expected_text_source));
  await page.keyboard.press('Escape');
  await gotoPaper(manifest.papers[0].id);
  await shot(page, '06-after-import');

  // 7 decision-log CSV with text_source column
  await page.click('.pt-ws-panel[data-panel="data"]');
  await page.waitForSelector('#pt-overlay:not([hidden]) .pt-exp-csv', { timeout: 5000 });
  dl = page.waitForEvent('download');
  await page.click('.pt-exp-csv');
  d = await dl;
  const csvPath = join(outDir, `decision-log-${opt.reviewer}.csv`);
  await d.saveAs(csvPath);
  trace.files.decision_log = csvPath;
  const csv = readFileSync(csvPath, 'utf8').split('\n');
  check('csv: header ends with text_source', csv[0].trim().split(',').pop() === 'text_source', csv[0]);
  check('csv: rows carry the expected text_source', manifest.papers.every((p) => csv.some((l) => l.startsWith(p.id + ',') && l.trim().endsWith(',' + p.expected_text_source))));
  check('csv: human_decision is the reviewer decision, human_source the reviewer key', manifest.papers.every((p) => {
    const l = csv.find((x) => x.startsWith(p.id + ','));
    return l && l.indexOf(',' + script[p.id].expected_decision + ',' + opt.reviewer + ',') !== -1;
  }), csv.slice(1));

  // 8 reconciliation export from the tool (single reviewer -> single status)
  dl = page.waitForEvent('download');
  await page.click('.pt-exp-recon');
  d = await dl;
  const reconPath = join(outDir, `reconciliation-${opt.reviewer}-only.json`);
  await d.saveAs(reconPath);
  const recon = JSON.parse(readFileSync(reconPath, 'utf8'));
  check('in-tool reconciliation export: schema and single statuses', recon.schema === 'femprompt-prisma-reconciliation/0.1' && Object.values(recon.papers).every((x) => x.status === 'single'));
  await page.keyboard.press('Escape');

  check('no page errors during the session', consoleErrors.length === 0, consoleErrors);
} catch (e) {
  failed++;
  trace.checks.push({ name: 'driver exception', ok: false, detail: String(e && e.stack || e) });
  console.error('driver exception:', e);
  try { await shot(page, 'error'); } catch (_) {}
} finally {
  trace.finished = new Date().toISOString();
  trace.failed = failed;
  trace.console_errors = consoleErrors;
  writeFileSync(join(outDir, 'trace.json'), JSON.stringify(trace, null, 2) + '\n');
  await browser.close();
  server.close();
}
console.log(`\n${failed ? 'FAIL' : 'PASS'} pilot ${opt.reviewer}: ${trace.checks.filter((c) => c.ok).length}/${trace.checks.length} checks, out: ${outDir}`);
process.exit(failed ? 1 : 0);
