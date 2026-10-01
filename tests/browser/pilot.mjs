// Supported-browser pilot for PRISM (tests/pilot/README.md). Drives one isolated reviewer
// session end to end in Chromium through Playwright against the fixture corpus, never
// against production data: docs/ is served as is and only the corpus, the full-text
// manifest and the full texts are overlaid by request interception. Writes screenshots,
// the reviewer file produced by the fake directory handle and a JSON trace of every check.
//
//   node tests/browser/pilot.mjs --reviewer cp --out tests/browser/out/cp [--port 8765] [--headed]
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
const opt = { reviewer: 'cp', out: null, port: 0, headed: false };
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
opt.port = server.address().port;
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

// Fixture overlay for every context of this run: the corpus, the full-text manifest and
// the full texts come from tests/pilot/fixtures, external hosts answer empty so the page
// has no network dependence, and production data under docs/data/ is never read.
// delayPaperA holds back paper A's full text, which is how the out-of-order and the
// pending-commit scenarios get a response that is genuinely still in flight.
const fixture = (rel) => readFileSync(join(pilotDir, 'fixtures', rel));
const installFixtureRoutes = (ctx, delayPaperA = 0) => ctx.route('**/*', async (route) => {
  const url = new URL(route.request().url());
  if (url.host !== `127.0.0.1:${opt.port}`) return route.fulfill({ status: 200, contentType: 'text/css', body: '' });
  const p = url.pathname;
  if (p.endsWith('/data/research_vault_v2.json')) return route.fulfill({ contentType: 'application/json', body: fixture('vault.json') });
  if (p.endsWith('/data/fulltext_manifest.json')) return route.fulfill({ contentType: 'application/json', body: fixture('fulltext_manifest.json') });
  if (p.endsWith('/data/fulltext_index.json')) return route.fulfill({ contentType: 'application/json', body: fixture('fulltext_index.json') });
  if (p.endsWith('/data/review-cases/acceptance-2.json')) return route.fulfill({ contentType: 'application/json', body: fixture('acceptance-2.json') });
  if (p.endsWith('/data/pilot/PILOT-A.md')) return route.fulfill({ contentType: 'text/markdown', body: fixture('knowledge/PILOT-A.md') });
  if (/\/data\/screening\//.test(p)) return route.fulfill({ contentType: 'application/json', body: '{}' });
  const m = p.match(/\/data\/fulltext\/([^/]+)\.md$/);
  if (m) {
    const id = decodeURIComponent(m[1]);
    if (delayPaperA && id === 'PILOT-A') await new Promise((r) => setTimeout(r, delayPaperA));
    const f = join(pilotDir, 'fixtures', 'fulltext', id + '.md');
    return existsSync(f) ? route.fulfill({ contentType: 'text/markdown', body: readFileSync(f) }) : route.fulfill({ status: 404, body: '' });
  }
  return route.continue();
});
await installFixtureRoutes(context);
const page = await context.newPage();
page.on('dialog', (d) => d.accept());
const consoleErrors = [];
page.on('pageerror', (e) => consoleErrors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });

async function waitInit() {
  await page.waitForFunction(() => window.__PRISMA_TEST__ && document.querySelector('#pt-doc'), null, { timeout: 15000 });
  await page.waitForFunction(() => window.__PRISMA_TEST__.anFieldNames().length > 0, null, { timeout: 15000 });
}
async function currentPaperId() { return hook(page, '(() => { const T = window.__PRISMA_TEST__; const s = T.getState(); return window.EC.getAllPapers()[s.index].id; })()'); }
async function enterEditing(targetPage) {
  if (!(await targetPage.evaluate(() => window.__PRISMA_TEST__.canEdit()))) {
    await targetPage.getByRole('button', { name: 'Bearbeiten', exact: true }).click();
    await targetPage.waitForFunction(() => window.__PRISMA_TEST__.canEdit());
  }
}
async function setReviewerKey(targetPage, key) {
  await enterEditing(targetPage);
  await targetPage.fill('#pt-reviewer-key', key);
  await targetPage.click('.pt-reviewer-set');
  await targetPage.waitForFunction((expected) => window.__PRISMA_TEST__.getState().reviewer === expected, key);
}
async function connectFixtureStorage(targetPage, key) {
  await enterEditing(targetPage);
  await targetPage.evaluate(async (reviewerKey) => {
    const writes = {};
    const screening = {
      name: 'screening',
      async *values() {},
      async getFileHandle(name) {
        return { async createWritable() { let body = ''; return {
          async write(value) { body = String(value); }, async close() { writes[name] = body; }
        }; } };
      }
    };
    const data = { async getDirectoryHandle(name) { if (name === 'screening') return screening; throw new Error(name); } };
    const docs = { async getDirectoryHandle(name) { if (name === 'data') return data; throw new Error(name); } };
    const root = { name: 'fixture-repo', async getDirectoryHandle(name) { if (name === 'docs') return docs; throw new Error(name); } };
    const T = window.__PRISMA_TEST__;
    await T.resolveScopes(root);
    T.selectReviewer(reviewerKey);
    T.renderData(document.getElementById('pt-data-inline'));
    T.showSurface('screening');
    window.__PILOT_WRITES = writes;
  }, key);
}
// Layout invariants (ADR-039/ADR-040): the workspace is one non-scrolling screen, the
// reading column carries the vertical scrolling itself and never a horizontal one.
async function checkLayoutInvariants(targetPage, label) {
  for (const size of [{ width: 1440, height: 900 }, { width: 1280, height: 800 }]) {
    await targetPage.setViewportSize(size);
    await targetPage.waitForTimeout(150);
    const m = await targetPage.evaluate(() => {
      const read = document.querySelector('.pt-read');
      return {
        documentScroll: document.documentElement.scrollHeight,
        viewport: window.innerHeight,
        readOverflowX: read ? read.scrollWidth - read.clientWidth : null,
        readHeight: read ? read.getBoundingClientRect().height : null
      };
    });
    check(`layout ${label} ${size.width}x${size.height}: the workspace fits one screen without document scrolling`,
      m.documentScroll <= m.viewport + 1, m);
    check(`layout ${label} ${size.width}x${size.height}: the reading column has no horizontal overflow`,
      m.readOverflowX !== null && m.readOverflowX <= 1, m);
    check(`layout ${label} ${size.width}x${size.height}: the reading column keeps at least 60 percent of the viewport height`,
      m.readHeight !== null && m.readHeight >= m.viewport * 0.6, m);
  }
  await targetPage.setViewportSize({ width: 1440, height: 900 });
  await targetPage.waitForTimeout(150);
}
const LEVEL_NAMES = ['nein', 'teilweise', 'ja'];
async function setChipLevel(cat, level) {
  // a toggle switches off and on (ja); teilweise comes from a Paper pin and is raised by a
  // click. The rail re-renders on each click, so the toggle is queried again.
  for (let guard = 0; guard < 3; guard++) {
    const cur = await page.getAttribute(`#pt-assess-col .pt-dim .category-chip[data-cat="${cat}"]`, 'data-level');
    if (cur === LEVEL_NAMES[level]) return;
    await page.click(`#pt-assess-col .pt-dim .category-chip[data-cat="${cat}"]`);
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
  const mark = await page.evaluate(() => document.querySelector('.pt-paper-metadata .pt-source-mark dd')?.textContent || null);
  check(`${id}: source mark only where the Paper layer is not a full text`, paperSpec.expected_text_source === 'raw' ? mark === null : mark === 'Metadaten-Abstract', mark);
  if (!paperSpec.has_ai_layer) check(`${id}: layer toggle hidden without an AI layer`, await page.evaluate(() => { const t = document.getElementById('pt-layer-toggle'); return !t || getComputedStyle(t).display === 'none'; }));
  else check(`${id}: LLM distillate is unavailable before the independent save`, await page.evaluate(() => {
    const t = document.getElementById('pt-layer-toggle');
    return !!t && t.hidden && window.__PRISMA_TEST__.getState().readMode === 'full';
  }));
  check(`${id}: text_source after load`, (await hook(page, 'window.__PRISMA_TEST__.textSource()')) === paperSpec.expected_text_source, await hook(page, 'window.__PRISMA_TEST__.textSource()'));
  check(`${id}: reading body does not repeat the structured title`, !(await page.textContent('#pt-doc')).includes(paperSpec.title || id), await page.textContent('#pt-doc'));
  if (paperSpec.expected_doi) {
    const doiLink = await page.evaluate(() => {
      const a = document.querySelector('.pt-paper-metadata .pt-doi-link');
      return a && { text: a.textContent, href: a.href, target: a.target, rel: a.rel };
    });
    check(`${id}: DOI remains visible as a safe resolver link`, doiLink && doiLink.text === paperSpec.expected_doi &&
      doiLink.href === `https://doi.org/${paperSpec.expected_doi}` && doiLink.target === '_blank' && /noopener/.test(doiLink.rel), doiLink);
  }
  if (paperSpec.expected_source_url) {
    const sourceMeta = await page.evaluate(() => {
      const a = document.querySelector('.pt-paper-metadata .pt-source-link');
      const authors = Array.from(document.querySelectorAll('.pt-paper-metadata div')).find((x) => x.querySelector('dt')?.textContent === 'Autor:innen');
      return { href: a?.href, text: a?.textContent, rel: a?.rel, author: authors?.querySelector('dd')?.textContent,
        body: document.getElementById('pt-doc')?.textContent };
    });
    check(`${id}: URL-only source is removed from the body and lifted to compact metadata`,
      sourceMeta.href === paperSpec.expected_source_url && sourceMeta.text === 'Webseite öffnen' && /noopener/.test(sourceMeta.rel) &&
      sourceMeta.author === paperSpec.expected_author && !sourceMeta.body.includes(paperSpec.expected_source_url), sourceMeta);
  }
  check(`${id}: no LLM proposal, colours or takeover before the own save (ADR-044)`, await page.evaluate(() => {
    const rail = document.getElementById('pt-assess-col');
    return !/LLM-Vorschlag|Vorschlag übernehmen|Runde/.test(rail.textContent) &&
      !rail.querySelector('#pt-adopt-proposal, .pt-ref-llm, .pt-llm-mark, .pt-ref-reason');
  }));
  check(`${id}: binding copy removed from daily assessment`, !/bindend|verbindlich/.test(await page.textContent('#pt-assess-col')));
  if (paperSpec.search_term) {
    await page.fill('#pt-intext', paperSpec.search_term);
    await page.waitForFunction(() => /^\d+ von \d+$/.test(document.querySelector('#pt-intext-count').textContent), null, { timeout: 5000 });
    const cnt = await page.textContent('#pt-intext-count');
    check(`${id}: in-text search hits`, /^\d+ von \d+$/.test(cnt), cnt);
    check(`${id}: the hit count is announced through the live region`, /Treffer \d+ von \d+/.test(await page.evaluate(() => new Promise((r) => setTimeout(() => r(document.getElementById('pt-live')?.textContent || ''), 80)))));
    await page.click('#pt-pin-hit');
    await page.waitForSelector(`#pt-pinmenu .category-chip[data-cat="${paperSpec.pin_category}"]`, { timeout: 5000 });
    const menuBox = await page.evaluate(() => { const b = document.getElementById('pt-pinmenu').getBoundingClientRect(); const m = document.querySelector('mark.pt-hit.active').getBoundingClientRect(); return { overlaps: !(b.bottom <= m.top || b.top >= m.bottom || b.right <= m.left || b.left >= m.right) }; });
    check(`${id}: the pin menu opens beside the hit without covering it`, !menuBox.overlaps, menuBox);
    await page.click(`#pt-pinmenu .category-chip[data-cat="${paperSpec.pin_category}"]`);
    const evCount = await hook(page, `(() => { const w = window.__PRISMA_TEST__.getWork(); return (w.evidence[${JSON.stringify(paperSpec.pin_category)}] || []).length; })()`);
    check(`${id}: Beleg pinned on ${paperSpec.pin_category}`, evCount === 1, evCount);
    const lvl = await page.getAttribute(`#pt-assess-col .pt-dim .category-chip[data-cat="${paperSpec.pin_category}"]`, 'data-level');
    check(`${id}: pinned category starts at teilweise`, lvl === 'teilweise', lvl);
    if (id === 'PILOT-A') {
      await page.click(`#pt-assess-col .pt-evid-x[data-cat="${paperSpec.pin_category}"]`);
      check(`${id}: a pinned passage can be removed through the assessment UI`, await page.evaluate((cat) =>
        !(window.__PRISMA_TEST__.getWork().evidence[cat] || []).length, paperSpec.pin_category));
      await page.click('#pt-pin-hit');
      await page.click(`#pt-pinmenu .category-chip[data-cat="${paperSpec.pin_category}"]`);
      check(`${id}: the same search passage can be attached again after correction`, await page.evaluate((cat) =>
        (window.__PRISMA_TEST__.getWork().evidence[cat] || []).length === 1, paperSpec.pin_category));
    }
  }
  for (const [cat, level] of Object.entries(decisionSpec.categories)) {
    if (!level) continue;
    await page.evaluate(({ cat }) => {
      const T = window.__PRISMA_TEST__, w = T.getWork();
      if (!(w.evidence[cat] || []).some((ev) => (ev.origin || 'human') !== 'ai'))
        T.pinEvidence(cat, cat, `Synthetic human evidence for ${cat}`, 'human');
    }, { cat });
  }
  for (const [cat, level] of Object.entries(decisionSpec.categories)) await setChipLevel(cat, level);
  if (decisionSpec.reason) {
    await page.waitForSelector(`#pt-assess-col .pt-reason-chip[data-reason="${decisionSpec.reason}"]`, { timeout: 5000 });
    await page.click(`#pt-assess-col .pt-reason-chip[data-reason="${decisionSpec.reason}"]`);
  }
  if (decisionSpec.expected_decision === 'Include') {
    check(`${id}: a human Include offers no analysis coding (ADR-045)`, await page.evaluate(() =>
      !document.getElementById('pt-open-analysis') && !/Analysekodierung|Studientyp/.test(document.getElementById('pt-assess-col').textContent) &&
      !/Analysekodierung/.test(document.getElementById('pt-save-hint')?.textContent || '')));
  }
  await page.waitForSelector('#pt-record:not([disabled])', { timeout: 5000 });
  const dock = await page.evaluate(() => {
    const x = document.querySelector('#pt-assess-col .pt-action-dock'), rail = document.getElementById('pt-assess-col');
    const a = x.getBoundingClientRect(), b = rail.getBoundingClientRect();
    return { visible: a.bottom <= Math.min(b.bottom, innerHeight) + 1 && a.top >= b.top };
  });
  check(`${id}: the action dock stays visible at the foot of the assessment rail`, dock.visible, dock);
  await shot(page, `${id}-before-commit`);
  // one paper is saved with the keyboard shortcut, the others with the disk action
  if (id === 'PILOT-B') await page.keyboard.press('Control+s');
  else await page.click('#pt-record');
  await page.waitForFunction((paperId) => !!window.__PRISMA_TEST__.curDec()[paperId], id, { timeout: 5000 }).catch(() => {});
  const rec = await hook(page, `window.__PRISMA_TEST__.curDec()[${JSON.stringify(id)}] || null`);
  check(`${id}: record exists`, !!rec);
  check(`${id}: decision`, rec && rec.decision === decisionSpec.expected_decision, rec && rec.decision);
  check(`${id}: reviewer key`, rec && rec.reviewer === opt.reviewer, rec && rec.reviewer);
  check(`${id}: text_source recorded`, rec && rec.text_source === paperSpec.expected_text_source, rec && rec.text_source);
  if (paperSpec.pin_category) check(`${id}: evidence persisted in record`, rec && rec.evidence && rec.evidence[paperSpec.pin_category] && rec.evidence[paperSpec.pin_category].length === 1);
  if (decisionSpec.reason) check(`${id}: exclusion reason`, rec && rec.reason === decisionSpec.reason, rec && rec.reason);
  if (decisionSpec.expected_decision === 'Include') {
    check(`${id}: the human Include is written without an analysis part`, await page.evaluate((paperId) =>
      !('analysis' in window.__PRISMA_TEST__.curDec()[paperId]), id));
    check(`${id}: the persisted Include satisfies every completion requirement`, await page.evaluate((paperId) => {
      const T = window.__PRISMA_TEST__;
      return T.recordRequirements(T.curDec()[paperId]).ok;
    }, id));
    check(`${id}: complete Include updates the corpus status and advances`, await page.evaluate((paperId) => {
      const T = window.__PRISMA_TEST__, papers = window.EC.getAllPapers();
      const paperIndex = papers.findIndex((paper) => paper.id === paperId);
      return T.getState().index !== paperIndex && !!document.querySelector(`#pt-corpus-list .pt-nav-item[data-i="${paperIndex}"] .pt-mark-erfasst`);
    }, id));
  }
  await gotoPaper(id);
  check(`${id}: the saved assessment names its provenance`, /^Deine Bewertung, gespeichert/.test(await page.textContent('#pt-provenance')));
  if (paperSpec.has_ai_layer) {
    const layerState = await page.evaluate(() => {
      const t = document.getElementById('pt-layer-toggle');
      const b = t?.querySelector('[data-mode="ai"]');
      return {
        available: !!t && !t.hidden && getComputedStyle(t).display !== 'none' && !!b && b.getBoundingClientRect().width > 0,
        hidden: t?.hidden,
        display: t ? getComputedStyle(t).display : null,
        width: b?.getBoundingClientRect().width || 0,
      };
    });
    check(`${id}: LLM distillate becomes available only after the saved decision`, layerState.available, layerState);
    await page.click('.pt-layer-btn[data-mode="ai"]');
    check(`${id}: explicit distillate view renders its labelled reference content`,
      (await page.textContent('#pt-doc')).includes('Synthetic distillate reference'));
    const otherId = manifest.papers.find((paper) => paper.id !== id).id;
    await gotoPaper(otherId);
    await gotoPaper(id);
    check(`${id}: paper navigation resets the active reading layer to the Paper text`, await page.evaluate(() =>
      window.__PRISMA_TEST__.getState().readMode === 'full' && document.querySelector('.pt-layer-btn[data-mode="full"]')?.getAttribute('aria-pressed') === 'true'));
  }
  check(`${id}: the saved record shows no LLM proposal either (ADR-044)`, await page.evaluate(() =>
    !/LLM-Vorschlag|Vorschlag übernehmen/.test(document.getElementById('pt-assess-col').textContent)));
  await shot(page, `${id}-committed`);
}

try {
  // 1 cold load
  await page.goto(base + '/prisma.html');
  await waitInit();
  const n = await hook(page, 'window.EC.getAllPapers().length');
  check('cold load: fixture corpus of three papers', n === 3, n);
  const readinessBoundary = await page.evaluate(() => {
    const T = window.__PRISMA_TEST__;
    const shortSource = T.sourcePillHtml({ id: 'SHORT', abstract: 'Founded in 1920, the NBER is a private, non-profit, non-partisan organization.' });
    T.setEditMode(true);
    const unboundRail = T.railHtml({ id: 'UNBOUND', title: 'Unbound source', identity_basis: 'pending' });
    T.setEditMode(false);
    return {
      shortSource,
      unboundRail,
      bound: T.paperIdentityReady({ work_id: 'work:pilot', version_id: 'version:pilot' }),
      missingVersion: T.paperIdentityReady({ work_id: 'work:pilot' })
    };
  });
  check('source readiness: fragments are absent and unbound records cannot open category controls',
    /kein Papertext/.test(readinessBoundary.shortSource) &&
      /noch nicht an ein Werk/.test(readinessBoundary.unboundRail) &&
      !/category-chip/.test(readinessBoundary.unboundRail) &&
      readinessBoundary.bound && !readinessBoundary.missingVersion,
    readinessBoundary);
  check('cold load: reading is available without reviewer setup or annotation controls', await page.evaluate(() =>
    !window.__PRISMA_TEST__.canEdit() && !document.querySelector('#pt-reviewer-key, .pt-folder-action, #pt-record, #pt-pin-hit, .pt-dim .category-chip:not([disabled])') &&
      document.querySelector('#pt-edit-mode')?.getAttribute('aria-pressed') === 'false' && !!document.querySelector('#pt-doc')));
  await page.waitForFunction(() => !window.__PRISMA_TEST__.readingPending());
  await page.fill('#pt-intext', 'social work');
  await page.press('#pt-intext', 'Enter');
  check('read mode: searching and navigating do not create a reviewer cache', await page.evaluate(() =>
    document.querySelectorAll('#pt-doc mark').length > 0 && localStorage.getItem('femprompt-prisma-state/0.2') === null));
  await page.click('#pt-corpus-list .pt-nav-item[data-i="1"]');
  check('read mode: another paper opens without enabling authoring', await currentPaperId() === 'PILOT-B' &&
    !(await page.evaluate(() => window.__PRISMA_TEST__.canEdit())));
  await page.click('#pt-corpus-list .pt-nav-item[data-i="0"]');
  await page.waitForFunction(() => !window.__PRISMA_TEST__.readingPending());
  await page.goBack();
  await page.waitForFunction(() => window.EC.getAllPapers()[window.__PRISMA_TEST__.getState().index].id === 'PILOT-B');
  check('history: the back button returns to the previously opened paper', /paper=PILOT-B/.test(page.url()));
  await page.goForward();
  await page.waitForFunction(() => window.EC.getAllPapers()[window.__PRISMA_TEST__.getState().index].id === 'PILOT-A');
  check('corpus list: one tab stop, the open paper', await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('#pt-corpus-list .pt-nav-item'));
    return items.filter((item) => item.tabIndex === 0).length === 1 && items.find((item) => item.tabIndex === 0).classList.contains('active');
  }));
  await page.focus('#pt-corpus-list .pt-nav-item.active');
  await page.keyboard.press('ArrowDown');
  check('corpus list: the arrow keys move focus within the list', await page.evaluate(() =>
    document.activeElement.dataset.i === '1' && document.activeElement.tabIndex === 0));
  await enterEditing(page);
  check('edit transition: reviewer setup appears with keyboard focus and without fixed-role radios', await page.evaluate(() =>
    !!document.getElementById('pt-reviewer-key') && document.activeElement === document.getElementById('pt-reviewer-key') &&
      !document.querySelector('.pt-reviewer-radio') && !window.__PRISMA_TEST__.getState().reviewer));
  await page.fill('#pt-reviewer-key', '../x');
  await page.click('.pt-reviewer-set');
  check('reviewer key: unsafe filename input is rejected and focus returns to the field', await page.evaluate(() =>
    !window.__PRISMA_TEST__.getState().reviewer && document.activeElement === document.getElementById('pt-reviewer-key') &&
      document.getElementById('pt-reviewer-key').getAttribute('aria-invalid') === 'true'));
  await setReviewerKey(page, opt.reviewer);
  check('reviewer key: trimmed safe key persists and fixes the exact target path', await page.evaluate((key) =>
    window.__PRISMA_TEST__.getState().reviewer === key && document.querySelector('.pt-sync-identity code')?.textContent === `docs/data/screening/${key}.json`, opt.reviewer));
  check('save gate: the disk action stays disabled until the working folder is connected and says why', await page.evaluate(() =>
    document.getElementById('pt-record')?.disabled && /Arbeitsordner verbinden/.test(document.getElementById('pt-save-hint')?.textContent || '') &&
      /Arbeitsordner verbinden/.test(document.getElementById('pt-record').getAttribute('aria-label'))));
  check('folder setup: exactly one folder action is offered before connection', (await page.$$('.pt-folder-action')).length === 1);
  await connectFixtureStorage(page, opt.reviewer);
  check('daily storage: compact status replaces setup, with only the secondary folder-change affordance', await page.evaluate(() =>
    !!document.querySelector('.pt-sync-ready') && !document.getElementById('pt-reviewer-key') && !document.querySelector('.pt-folder-action') &&
      !!document.querySelector('.pt-change-folder')));
  check('daily UI: backup, import, administration, report trigger and sidepanel are absent', await page.evaluate(() =>
    !document.querySelector('.pt-backup-details, .pt-admin-details, .pt-imp, .pt-exp-rev, .pt-exp-csv, .pt-ws-panel, #pt-overlay')));
  await page.click('.pt-reason-chip[data-reason="Not_relevant_topic"]');
  const draftBeforeReading = await page.evaluate(() => JSON.stringify(window.__PRISMA_TEST__.getWork()));
  await page.getByRole('button', { name: 'Lesen', exact: true }).click();
  check('edit toggle: returning to reading preserves the unsaved draft without committing it', await page.evaluate((draft) => {
    const T = window.__PRISMA_TEST__;
    T.commit(); T.save();
    return !T.canEdit() && JSON.stringify(T.getWork()) === draft && Object.keys(T.curDec()).length === 0 &&
      Object.keys(window.__PILOT_WRITES).length === 0 && !document.querySelector('#pt-record, #pt-revise, #pt-pin-hit, .pt-change-folder') &&
      document.activeElement === document.getElementById('pt-read-mode');
  }, draftBeforeReading));
  await enterEditing(page);
  check('edit toggle: opting back in resumes the same draft and connected working folder', await page.evaluate((draft) =>
    window.__PRISMA_TEST__.canEdit() && JSON.stringify(window.__PRISMA_TEST__.getWork()) === draft &&
      !!document.querySelector('.pt-sync-ready') && !!document.querySelector('#pt-record'), draftBeforeReading));
  check('save action: exactly one accessible disk button sits beside the paper position and none is in the rail', await page.evaluate(() => {
    const all = document.querySelectorAll('#pt-record'); const button = all[0];
    return all.length === 1 && button.closest('.pt-ws-bar') && !document.querySelector('#pt-assess-col #pt-record') &&
      /speichern/i.test(button.getAttribute('aria-label')) && button.title === button.getAttribute('aria-label') && !!button.querySelector('svg');
  }));
  const readingLayout = await page.evaluate(() => {
    const read = document.querySelector('.pt-read'), surface = document.querySelector('.pt-reading-surface');
    const metadata = document.querySelector('.pt-paper-metadata');
    const search = document.querySelector('.pt-intext-bar');
    const footer = document.querySelector('.site-footer');
    return {
      separateBackground: getComputedStyle(read).backgroundColor !== getComputedStyle(surface).backgroundColor,
      surfaceBorder: getComputedStyle(surface).borderTopStyle,
      metadataHeight: metadata.getBoundingClientRect().height,
      metadataLineHeight: parseFloat(getComputedStyle(metadata).lineHeight) || parseFloat(getComputedStyle(metadata).fontSize),
      paperHeadDecoration: getComputedStyle(document.querySelector('.pt-paper-head'), '::after').content,
      searchRule: getComputedStyle(search).borderBottomWidth,
      footerRule: footer ? getComputedStyle(footer).borderTopWidth : '0px',
      labels: document.querySelector('#pt-layer-toggle').textContent
    };
  });
  check('reading layout: quiet text surface and compact metadata without decorative separator rules',
    readingLayout.separateBackground && readingLayout.surfaceBorder === 'solid' &&
      readingLayout.metadataHeight <= readingLayout.metadataLineHeight * 2.5 &&
      readingLayout.paperHeadDecoration === 'none' &&
      readingLayout.searchRule === '0px' && readingLayout.footerRule === '0px', readingLayout);
  const workWidths = await page.evaluate(() => {
    const reading = document.querySelector('.pt-read').getBoundingClientRect();
    const assessment = document.querySelector('.pt-rail').getBoundingClientRect();
    const heading = document.querySelector('.pt-rail-head').getBoundingClientRect();
    const title = document.querySelector('.pt-rail-title').getBoundingClientRect();
    const rail = document.querySelector('.pt-rail');
    return { reading: reading.width, assessment: assessment.width, heading: heading.height, title: title.height,
      noHorizontalOverflow: rail.scrollWidth <= rail.clientWidth };
  });
  check('desktop work allocation: full text is at least twice as wide as the compact assessment rail',
    workWidths.reading >= workWidths.assessment * 2 && workWidths.heading <= workWidths.title * 2.2 && workWidths.noHorizontalOverflow,
    workWidths);
  await checkLayoutInvariants(page, 'screening');
  check('reading layers: knowledge-document layer is named LLM-Wissensdestillat consistently',
    await page.locator('#pt-layer-toggle [data-mode="ai"]').textContent() === 'LLM-Wissensdestillat', readingLayout.labels);
  await shot(page, '01-data-sync');
  await page.setViewportSize({ width: 760, height: 900 });
  check('responsive: compact storage status remains visible without legacy/admin buttons', await page.evaluate(() => {
    const inline = document.getElementById('pt-data-inline');
    const buttons = Array.from(document.querySelectorAll('button')).map((b) => b.textContent.trim());
    return getComputedStyle(inline).display !== 'none' && !buttons.includes('Daten & Sync') && !buttons.includes('PRISMA-Record') &&
      !document.querySelector('.pt-backup-details, .pt-admin-details');
  }));
  await shot(page, '01-responsive');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.fill('#pt-corpus-q', 'Pilot paper A: generative models in social work education');
  await page.waitForFunction(() => document.querySelectorAll('#pt-corpus-list .pt-nav-item').length === 1, null, { timeout: 5000 });
  const searchRow = await page.evaluate(() => ({
    title: document.querySelector('#pt-corpus-list .pt-nav-t')?.textContent,
    meta: document.querySelector('#pt-corpus-list .pt-nav-m')?.textContent,
    id: document.querySelector('#pt-corpus-list .pt-nav-id')?.textContent,
    match: document.querySelector('#pt-corpus-list .pt-hit-badge')?.textContent
  }));
  check('corpus search: exact title first with author, year and named match kind, without internal identifiers',
    searchRow.title === 'Pilot paper A: generative models in social work education' && /2026/.test(searchRow.meta) && !searchRow.id && searchRow.match === 'Exakter Titel', searchRow);
  await page.fill('#pt-corpus-q', 'PILOT-B');
  await page.waitForTimeout(350);
  const idSearchRow = await page.evaluate(() => ({
    id: document.querySelector('#pt-corpus-list .pt-nav-id')?.textContent,
    match: document.querySelector('#pt-corpus-list .pt-hit-badge')?.textContent
  }));
  check('corpus search: a Paper-ID match is named without showing the identifier',
    !idSearchRow.id && idSearchRow.match === 'Paper-ID', idSearchRow);
  await page.click('#pt-corpus-list .pt-nav-item');
  await page.waitForFunction(() => window.EC.getAllPapers()[window.__PRISMA_TEST__.getState().index].id === 'PILOT-B');
  check('URL state: list navigation updates the paper parameter', new URL(page.url()).searchParams.get('paper') === 'PILOT-B', page.url());
  check('corpus navigation: identity matches do not become meaningless in-text searches',
    (await page.inputValue('#pt-intext')) === '');
  await page.fill('#pt-corpus-q', '');
  await page.waitForFunction(() => document.querySelectorAll('#pt-corpus-list .pt-nav-item').length === 3, null, { timeout: 5000 });
  await gotoPaper('PILOT-A');
  const toggle = page.locator('#pt-assess-col .pt-dim .category-chip[data-cat="Prompting"]');
  check('category toggle: the inline codebook panel is the accessible description, no tooltip and no info button', await page.evaluate(() => {
    const chip = document.querySelector('#pt-assess-col .pt-dim .category-chip[data-cat="Prompting"]');
    const panel = document.getElementById('pt-cat-def');
    return chip && !chip.title && chip.getAttribute('aria-describedby') === 'pt-cat-def' && panel && panel.hidden &&
      !document.querySelector('#pt-assess-col .pt-info-btn');
  }));
  // point 4: the codebook definition and the negative example appear verbatim at the toggle
  // under focus or pointer, and leave again with it
  const codebook = await page.evaluate(async () => (await (await fetch('data/category_schema.json')).json()).categories);
  const defPanel = () => page.evaluate(() => {
    const panel = document.getElementById('pt-cat-def');
    return { hidden: !panel || panel.hidden, cat: panel && panel.getAttribute('data-cat'), text: panel ? panel.textContent : '' };
  });
  const codebookShown = (shown, key) => {
    const entry = codebook.find((c) => c.key === key);
    return !shown.hidden && shown.cat === key && shown.text.includes(entry.definition) &&
      entry.examples_negative.every((example) => shown.text.includes('Zählt nicht: ' + example) || shown.text.includes(example));
  };
  await toggle.focus();
  const onFocus = await defPanel();
  check('codebook panel: keyboard focus on a toggle shows its definition and what does not count', codebookShown(onFocus, 'Prompting') && /Zählt nicht:/.test(onFocus.text), onFocus);
  await page.hover('#pt-assess-col .pt-dim .category-chip[data-cat="Gender"]');
  const onHover = await defPanel();
  check('codebook panel: the pointer on Gender shows the Gender definition and negative example verbatim', codebookShown(onHover, 'Gender'), onHover);
  await page.mouse.move(5, 5);
  check('codebook panel: leaving the pointer returns to the focused toggle', codebookShown(await defPanel(), 'Prompting'));
  await page.focus('#pt-intext');
  check('codebook panel: without focus or pointer on a toggle the panel is gone', (await defPanel()).hidden);
  await toggle.focus();
  await page.keyboard.press('Space');
  const keyboardToggle = await page.evaluate(() => {
    const chip = document.querySelector('#pt-assess-col .pt-dim .category-chip[data-cat="Prompting"]');
    return { pressed: chip.getAttribute('aria-pressed'), focused: document.activeElement === chip,
      outline: getComputedStyle(chip).outlineStyle, check: getComputedStyle(chip, '::before').content };
  });
  check('category toggle: the keyboard switches it, focus stays on it and is visible, the state carries a check mark',
    keyboardToggle.pressed === 'true' && keyboardToggle.focused && keyboardToggle.outline !== 'none' && /✓/.test(keyboardToggle.check), keyboardToggle);
  await page.keyboard.press('Enter');
  check('category toggle: a second key press switches it off', await page.evaluate(() =>
    document.querySelector('#pt-assess-col .pt-dim .category-chip[data-cat="Prompting"]').getAttribute('aria-pressed') === 'false'));
  const contrast = await page.evaluate(() => {
    const toRgb = (color) => { const cv = document.createElement('canvas'); cv.width = cv.height = 1; const ctx = cv.getContext('2d'); ctx.fillStyle = '#000'; ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1); return Array.from(ctx.getImageData(0, 0, 1, 1).data).slice(0, 3); };
    const lum = (color) => { const c = toRgb(color).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
    const host = document.createElement('div'); host.className = 'category-chips'; document.body.appendChild(host);
    const T = window.__PRISMA_TEST__;
    host.innerHTML = T.ALL_CATS.map((c) => T.categoryChipHtml(c, 2)).join('');
    const out = Array.from(host.children).map((chip) => {
      const s = getComputedStyle(chip); const a = lum(s.backgroundColor), b = lum(s.color);
      return { cat: chip.dataset.cat, ratio: Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100 };
    });
    host.remove();
    return out;
  });
  check('category toggle: every filled colour keeps at least 4.5:1 with its text', contrast.every((c) => c.ratio >= 4.5), contrast);
  check('decision: the panel head shows the decision', /^(Include|Exclude|Unclear)$/.test(await page.textContent('#pt-decision')));
  // the first paint may precede the full-text manifest; the pill must correct itself without navigation
  check('cold load: a full text carries no source mark', await page.evaluate(() => !document.querySelector('.pt-paper-metadata .pt-source-mark')));
  await shot(page, '01-cold-load');

  // 2, 3 screen both papers
  for (const paperSpec of manifest.papers) await screenPaper(paperSpec, script[paperSpec.id]);

  const diskWrite = await page.evaluate((key) => {
    const text = window.__PILOT_WRITES?.[`${key}.json`];
    return text ? JSON.parse(text) : null;
  }, opt.reviewer);
  check('file write: the connected reviewer file contains every completed paper under the selected key',
    diskWrite?.schema === 'femprompt-prisma-reviewer/0.5' && diskWrite.reviewer === opt.reviewer &&
      manifest.papers.every((paperSpec) => !!diskWrite.decisions[paperSpec.id]),
    diskWrite && { reviewer: diskWrite.reviewer, papers: Object.keys(diskWrite.decisions) });
  const exportPath = join(outDir, `${opt.reviewer}.json`);
  writeFileSync(exportPath, JSON.stringify(diskWrite, null, 2));
  trace.files.reviewer_export = exportPath;

  // 4 reload
  await page.reload();
  await waitInit();
  const afterReload = await hook(page, 'Object.keys(window.__PRISMA_TEST__.curDec()).sort()');
  check('reload: all records and the reviewer key persisted', JSON.stringify(afterReload) === JSON.stringify(manifest.papers.map((p) => p.id).sort()) &&
    (await hook(page, 'window.__PRISMA_TEST__.getState().reviewer')) === opt.reviewer, afterReload);
  const tsAfter = await hook(page, 'Object.fromEntries(Object.entries(window.__PRISMA_TEST__.curDec()).map(([k, v]) => [k, v.text_source]))');
  check('reload: text_source survives', manifest.papers.every((p) => tsAfter[p.id] === p.expected_text_source), tsAfter);
  check('reload: saved reviewer profile still opens read-only without folder or revise controls', await page.evaluate(() =>
    !window.__PRISMA_TEST__.canEdit() && !document.querySelector('#pt-reviewer-key, .pt-folder-action, .pt-change-folder, #pt-revise, #pt-record')));
  await gotoPaper(manifest.papers[0].id);
  check('reload: the saved assessment of paper A is shown read-only with its provenance',
    /^Deine Bewertung/.test(await page.textContent('#pt-provenance')) && !!(await page.$('#pt-assess-col .pt-dim .category-chip[disabled]')));
  await page.waitForSelector('#pt-corpus-list .pt-nav-item.active .pt-mark-erfasst');
  check('reload: the captured paper keeps its mark in the corpus list', !!(await page.$('#pt-corpus-list .pt-nav-item.active .pt-mark-erfasst')));
  await enterEditing(page);
  await page.waitForFunction(() => !window.__PRISMA_TEST__.readingPending());
  check('edit: the own saved record opens editable in Bearbeiten, with nothing to save until it changes',
    !!(await page.$('#pt-assess-col .pt-dim .category-chip:not([disabled])')) && await page.isDisabled('#pt-record'));
  await page.reload();
  await page.waitForFunction(() => window.__PRISMA_TEST__ && !window.__PRISMA_TEST__.readingPending());
  await gotoPaper(manifest.papers[0].id);
  await shot(page, '04-after-reload');

  // ADR-042: Bearbeiten is the only authoring mode. The former verification entry opens it,
  // and an own record is never advanced through the lifecycle.
  await page.goto(base + '/prisma.html?verify=1&paper=PILOT-A');
  await waitInit();
  check('mode: a former ?verify=1 link opens Bearbeiten with the two-state switch', await page.evaluate(() =>
    window.__PRISMA_TEST__.canEdit() && document.querySelectorAll('.pt-mode-seg button').length === 2 &&
      document.querySelector('#pt-edit-mode').getAttribute('aria-pressed') === 'true' && !/Verifizieren/.test(document.body.textContent)));
  check('mode: an own record shows no lifecycle controls and no typed identifier fields', await page.evaluate(() =>
    !document.querySelector('#pt-verify-result, #pt-approve, [name="reviewer_id"], [name="actor_ids"], [name="activity_id"], textarea[name="corrected_annotation"]')));
  // 5b The productive agent track is loaded but never shown to a human (ADR-044): a paper
  // with only an agent record starts empty, its codes reach neither the rail nor the list,
  // the own save writes the reviewer file, and the agent file stays untouched.
  const agentFile = {
    schema: 'femprompt-prisma-reviewer/0.5', reviewer: 'ar2', actor: 'agent', status: 'ai-agent-reviewed',
    updated: '2026-09-01T10:00:00.000Z',
    decisions: {
      'PILOT-B': {
        decision: 'Exclude', categories: {}, evidence: {}, reason: 'Not_relevant_topic',
        reviewer: 'ar2', actor: 'agent', text_source: 'abstract', ts: '2026-09-01T09:00:00.000Z',
        provenance: {
          annotation_id: 'ar2:PILOT-B', annotation_type: 'screening_decision',
          actors: [
            { id: 'curator-1', type: 'person', roles: ['curation'] },
            { id: 'pilot-agent-1', type: 'ai_agent', roles: ['screening'] },
            { id: 'pilot-ai-reviewer-1', type: 'ai_agent', roles: ['ai_agent_reviewer'] }
          ],
          activities: [
            { id: 'PILOT-B:agent-annotation', type: 'screening', run_id: 'pilot-run-1', method: 'agent_screening',
              prompt: { status: 'recorded', reference: 'prompts/prism-agent-reviewer-v1.1.md', version: '1.1' },
              model: { status: 'recorded', reference: 'pilot-model-id' }, associated_actor_ids: ['pilot-agent-1'] },
            { id: 'PILOT-B:ai-agent-review', type: 'ai_agent_review', run_id: 'pilot-run-1', method: 'source_grounded_ai_agent_review',
              prompt: { status: 'recorded', reference: 'prompts/prism-agent-reviewer-v1.1.md', version: '1.1' },
              model: { status: 'recorded', reference: 'pilot-model-id' }, associated_actor_ids: ['pilot-ai-reviewer-1'] }
          ],
          used_sources: [{ id: 'paper:PILOT-B', type: 'paper', reference: 'docs/data/fulltext/PILOT-B.md', sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90' }],
          derived_from: [{ id: 'ai-agent-review', type: 'ai_agent_review', reference: 'runs/pilot-run-1/ai-agent-review.json' }]
        },
        annotations: [{ annotation_id: 'ar2:PILOT-B', annotation_type: 'screening_decision', at: '2026-09-01T09:00:00.000Z', actor_ids: ['pilot-agent-1'] }],
        active_annotation_id: 'ar2:PILOT-B',
        checks: [{ check_type: 'lifecycle_validation', status: 'passed', at: '2026-09-01T09:30:00.000Z', actor_id: 'pilot-validator',
          subject: { annotation_id: 'ar2:PILOT-B', sha256: 'f0e1d2c3b4a5968778695a4b3c2d1e0ff0e1d2c3b4a5968778695a4b3c2d1e0f' } }],
        lifecycle: {
          baseline: { state: 'curated', basis: 'controlled_intake', at: '2026-09-01T08:00:00.000Z', actor_ids: ['curator-1'] },
          state: 'ai-agent-reviewed',
          events: [
            { event_id: 'PILOT-B:agent-annotation', event_type: 'agent_annotation', from: 'curated', to: 'agent-annotated', result: 'completed', at: '2026-09-01T09:00:00.000Z', activity_id: 'PILOT-B:agent-annotation', actor_ids: ['pilot-agent-1'] },
            { event_id: 'PILOT-B:ai-agent-review', event_type: 'ai_agent_review', from: 'agent-annotated', to: 'ai-agent-reviewed', result: 'accepted', at: '2026-09-01T09:30:00.000Z', activity_id: 'PILOT-B:ai-agent-review', actor_ids: ['pilot-ai-reviewer-1'] }
          ]
        }
      }
    }
  };
  const agentFileText = JSON.stringify(agentFile);
  const expertContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-AT' });
  await installFixtureRoutes(expertContext);
  const expertPage = await expertContext.newPage();
  expertPage.on('dialog', (d) => d.accept());
  const expertErrors = [];
  expertPage.on('pageerror', (e) => expertErrors.push(String(e)));
  // PILOT-B has no full-text fixture and reads as abstract, so its 404 is the expected
  // path, not a defect; only script errors are collected here.
  expertPage.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) expertErrors.push(m.text()); });
  await expertPage.goto(base + '/prisma.html?paper=PILOT-B');
  await expertPage.waitForFunction(() => window.__PRISMA_TEST__ && document.querySelector('#pt-doc'), null, { timeout: 15000 });
  await expertPage.evaluate(async (file) => {
    const T = window.__PRISMA_TEST__;
    const writes = {};
    const entry = { kind: 'file', name: 'ar2.json', async getFile() { return { async text() { return file; } }; } };
    T.setScreeningHandle({
      async *values() { yield entry; },
      async getFileHandle(name) { return { async createWritable() { let body = ''; return {
        async write(value) { body = String(value); }, async close() { writes[name] = body; }
      }; } }; }
    });
    await T.setEditMode(true);
    T.selectReviewer('ev');
    await T.loadAllReviewers();
    T.showSurface('screening');
    window.__PILOT_WRITES = writes;
  }, agentFileText);
  await expertPage.waitForFunction(() => !!document.querySelector('#pt-assess-col .pt-dim') && !window.__PRISMA_TEST__.readingPending(), null, { timeout: 10000 });
  const subjectView = await expertPage.evaluate(() => {
    const rail = document.getElementById('pt-assess-col');
    const item = document.querySelector('#pt-corpus-list .pt-nav-item.active');
    return {
      provenance: document.getElementById('pt-provenance')?.textContent,
      pressed: rail.querySelectorAll('.pt-dim .category-chip[aria-pressed="true"], .pt-dim .category-chip[aria-pressed="mixed"]').length,
      reasonSelected: !!rail.querySelector('.pt-reason-chip.sel'),
      verifyControls: !!rail.querySelector('#pt-verify-result, #pt-verify-note, #pt-approve, .pt-history, .pt-provenance-details'),
      llm: /LLM-Vorschlag|Vorschlag übernehmen|Agentenkodierung/.test(rail.textContent),
      editable: !!rail.querySelector('.pt-dim .category-chip:not([disabled])'),
      listState: item?.dataset.state,
      listDots: !!item?.querySelector('.pt-nav-cats'),
      agentMark: !!document.querySelector('.pt-mark-agent'),
      track: window.__PRISMA_TEST__.agentTrack().reviewer,
      selectedReviewer: window.__PRISMA_TEST__.getState().reviewer
    };
  });
  check('agent-only paper: the agent track is loaded for comparison but the paper starts empty for the reviewer',
    subjectView.track === 'ar2' && subjectView.selectedReviewer === 'ev' && subjectView.provenance === 'Noch keine Bewertung' &&
      subjectView.pressed === 0 && !subjectView.reasonSelected && subjectView.editable, subjectView);
  check('agent-only paper: no verification controls, agent provenance or LLM proposal in the rail',
    !subjectView.verifyControls && !subjectView.llm, subjectView);
  check('agent-only paper: the list shows it as simply open, without agent mark or agent colours',
    subjectView.listState === 'none' && !subjectView.listDots && !subjectView.agentMark, subjectView);
  await checkLayoutInvariants(expertPage, 'agent-only paper');
  await expertPage.screenshot({ path: join(outDir, '05b-agent-only-paper.png') });
  trace.screenshots.push('05b-agent-only-paper.png');
  await expertPage.click('#pt-assess-col .pt-reason-chip[data-reason="Not_relevant_topic"]');
  await expertPage.waitForSelector('#pt-record:not([disabled])', { timeout: 5000 });
  await expertPage.click('#pt-record');
  const written = await expertPage.evaluate(async (original) => {
    const deadline = Date.now() + 3000;
    while (!window.__PILOT_WRITES['ev.json'] && Date.now() < deadline) await new Promise((r) => setTimeout(r, 10));
    const T = window.__PRISMA_TEST__;
    return {
      names: Object.keys(window.__PILOT_WRITES),
      expert: window.__PILOT_WRITES['ev.json'] ? JSON.parse(window.__PILOT_WRITES['ev.json']) : null,
      agentEnvelopeUnchanged: JSON.stringify(T.reviewerEnvelope('ar2')) === original,
      agentState: T.agentTrack().records['PILOT-B'].lifecycle.state
    };
  }, agentFileText);
  const own = written.expert?.decisions?.['PILOT-B'];
  check('agent-only paper: the save writes an own decision into the reviewer file, no verification entry',
    written.expert?.reviewer === 'ev' && own?.decision === 'Exclude' && own?.reason === 'Not_relevant_topic' && own?.actor === 'human' &&
      own?.provenance?.derived_from?.length === 0 && !written.expert.verifications, { names: written.names, own });
  check('agent-only paper: the agent file is never written and its loaded envelope stays byte-identical',
    !written.names.includes('ar2.json') && written.agentEnvelopeUnchanged && written.agentState === 'ai-agent-reviewed', written);
  check('agent-only paper: no script errors in the reviewer session', expertErrors.length === 0, expertErrors);
  await expertContext.close();

  await page.goto(base + '/prisma.html?paper=PILOT-A');
  await waitInit();
  check('read mode: no lifecycle or verification controls in reading',
    !(await page.$('#pt-verify-result, #pt-approve, #pt-record')));
  const readProtection = await page.evaluate(async () => {
    const T = window.__PRISMA_TEST__;
    const before = JSON.stringify(T.getState().reviewers);
    const storage = localStorage.getItem('femprompt-prisma-state/0.2');
    let writes = 0, resolutions = 0;
    T.setScreeningHandle({ async getFileHandle() { writes++; throw new Error('read mode attempted a write'); } });
    T.resetWork({ id: 'PILOT-A' }); T.getWork().reason = 'Not_relevant_topic';
    T.commit(); T.save();
    T.setAnalysis('PILOT-A', { fields: { Studientyp: 'Review' } });
    const imported = T.importReviewerPayload({ decisions: {} }, T.getState().reviewer, true);
    try { await T.resolveScopes({ async getDirectoryHandle() { resolutions++; } }); } catch {}
    await new Promise((resolve) => setTimeout(resolve, 30));
    return { unchanged: before === JSON.stringify(T.getState().reviewers), cacheUnchanged: storage === localStorage.getItem('femprompt-prisma-state/0.2'), writes, resolutions, imported: imported.reason };
  });
  check('read mode: cached records cannot be overwritten, imported or persisted even with a retained folder handle',
    readProtection.unchanged && readProtection.cacheUnchanged && readProtection.writes === 0 && readProtection.resolutions === 0 && readProtection.imported === 'read-only', readProtection);
  await enterEditing(page);

  // Repo-root connect: the picker hands over a folder and the tool resolves the reviewer
  // folder below it. The real picker cannot be automated, so a fake directory handle with the
  // same surface is passed straight to the resolver (ported mechanics, operator decision 2026-08-21).
  const scopes = await page.evaluate(async () => {
    const mk = (children) => ({
      _c: children || {},
      async getDirectoryHandle(name, opts) {
        if (this._c[name]) return this._c[name];
        if (opts && opts.create) { this._c[name] = mk({}); return this._c[name]; }
        throw new Error('NotFoundError: ' + name);
      }
    });
    const T = window.__PRISMA_TEST__;
    const screening = mk({});
    const root = mk({ docs: mk({ data: mk({ screening }) }) });
    await T.resolveScopes(root);
    const asRoot = { scope: T.connectScope(), isScreening: T.screeningHandle() === screening };
    const plain = mk({});
    await T.resolveScopes(plain);
    const asPlain = { scope: T.connectScope(), isPicked: T.screeningHandle() === plain };
    const bare = mk({ docs: mk({}) });
    let created = null;
    try { await T.resolveScopes(bare); created = { scope: T.connectScope(), made: !!T.screeningHandle() }; } catch (e) { created = { error: String(e.message || e) }; }
    // a resolution that fails below the docs level must not leave the previous connection
    // writing: reconnect a valid root first, then hit one whose data level is refused
    await T.resolveScopes(root);
    const before = T.screeningHandle() === screening;
    const failing = mk({ docs: { getDirectoryHandle() { throw new Error('permission denied'); } } });
    let threw = false;
    try { await T.resolveScopes(failing); } catch (e) { threw = true; }
    const stale = { before, threw, handle: T.screeningHandle() };
    return { asRoot, asPlain, created, stale };
  });
  check('connect: a picked repo root resolves docs/data/screening as the reviewer folder', scopes.asRoot.scope === 'root' && scopes.asRoot.isScreening, scopes.asRoot);
  check('connect: a folder without a docs child stays the reviewer folder itself', scopes.asPlain.scope === 'screening' && scopes.asPlain.isPicked, scopes.asPlain);
  check('connect: a clone without the data or screening folder gets them created, not an error', !scopes.created.error && scopes.created.made && scopes.created.scope === 'root', scopes.created);
  check('connect: a failed resolution drops the previous connection instead of writing on', scopes.stale.before && scopes.stale.threw && scopes.stale.handle === null, scopes.stale);

  const directPaperId = async (queryValue) => {
    const directContext = await browser.newContext({ viewport: { width: 1200, height: 800 } });
    await installFixtureRoutes(directContext);
    const directPage = await directContext.newPage();
    await directPage.goto(base + '/prisma.html?paper=' + encodeURIComponent(queryValue));
    await directPage.waitForFunction(() => window.__PRISMA_TEST__ && document.querySelector('#pt-doc'), null, { timeout: 15000 });
    const id = await directPage.evaluate(() => {
      const state = window.__PRISMA_TEST__.getState();
      return window.EC.getAllPapers()[state.index].id;
    });
    await directContext.close();
    return id;
  };
  check('direct paper link: a known paper id determines the initial paper', await directPaperId('PILOT-B') === 'PILOT-B');
  check('direct paper link: an unknown paper id uses the normal first-paper fallback', await directPaperId('UNKNOWN-PAPER') === 'PILOT-A');

  const acceptanceContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await installFixtureRoutes(acceptanceContext);
  const acceptancePage = await acceptanceContext.newPage();
  await acceptancePage.goto(base + '/prisma.html?review=acceptance-2&paper=PILOT-A');
  await acceptancePage.waitForSelector('.pt-acceptance-status');
  const acceptanceState = await acceptancePage.evaluate(() => ({
    reviewer: window.__PRISMA_TEST__.getState().reviewer,
    navItems: document.querySelectorAll('#pt-corpus-list .pt-nav-item').length,
    current: window.EC.getAllPapers()[window.__PRISMA_TEST__.getState().index].id,
    revise: !!document.getElementById('pt-revise'),
    saveAction: !!document.getElementById('pt-record'),
    reviewerSetup: !!document.getElementById('pt-reviewer-key'),
    mutableAnalysis: !!document.querySelector('.pt-anpanel button:not([disabled]), .pt-anpanel textarea:not([readonly]), .pt-anpanel input:not([disabled])'),
    notice: document.querySelector('.pt-acceptance-status')?.textContent
  }));
  check('acceptance view: two proposed records load read-only without editor setup or research-data writes',
    acceptanceState.reviewer === 'acceptance' && acceptanceState.navItems === 2 && acceptanceState.current === 'PILOT-A' &&
      !acceptanceState.revise && !acceptanceState.saveAction && !acceptanceState.reviewerSetup && !acceptanceState.mutableAnalysis &&
      /schreibt keine Forschungsdaten/.test(acceptanceState.notice || ''),
    acceptanceState);
  await acceptancePage.click('#pt-next');
  check('acceptance view: the navigation cycles only through proposed cases', await acceptancePage.evaluate(() =>
    window.EC.getAllPapers()[window.__PRISMA_TEST__.getState().index].id === 'PILOT-B'));
  await acceptanceContext.close();

  const trialContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await installFixtureRoutes(trialContext);
  const trialPage = await trialContext.newPage();
  await trialPage.goto(base + '/prisma.html?trial=1&actor=agent&reviewer=ta&paper=PILOT-B');
  await trialPage.waitForFunction(() => !window.__PRISMA_TEST__.readingPending());
  const trialSetup = await trialPage.evaluate(() => ({
    reviewer: window.__PRISMA_TEST__.getState().reviewer,
    target: document.querySelector('.pt-sync-identity code')?.textContent,
    isolated: document.querySelector('.pt-trial-ready')?.textContent,
    folderAction: !!document.querySelector('.pt-folder-action, .pt-change-folder'),
    saveAction: !!document.getElementById('pt-record')
  }));
  check('trial mode: configured reviewer key and visible save work without a repository folder',
    trialSetup.reviewer === 'ta' && trialSetup.target === 'isolierter Testlauf/ta.json' &&
      /Keine Forschungsdaten/.test(trialSetup.isolated || '') && !trialSetup.folderAction && trialSetup.saveAction,
    trialSetup);
  await trialPage.click('[data-reason="Wrong_publication_type"]');
  await trialPage.click('#pt-record');
  const trialSaved = await trialPage.evaluate(() => ({
    record: window.__PRISMA_TEST__.getState().reviewers.ta['PILOT-B'],
    status: window.__PRISMA_TEST__.saveStatus()
  }));
  check('trial mode: visible disk action stores a complete record only in the browser trial track',
    trialSaved.record?.decision === 'Exclude' && trialSaved.record?.reason === 'Wrong_publication_type' &&
      trialSaved.record?.actor === 'agent' &&
      trialSaved.status.kind === 'saved' && /Forschungsdaten bleiben unverändert/.test(trialSaved.status.message || ''),
    trialSaved);
  const trialReferences = await trialPage.evaluate(() => ({
    comparison: !!document.querySelector('.pt-reference-comparison'),
    seed: document.body.textContent.includes('Frühere Expert:innen-Referenz'),
    automatic: document.body.textContent.includes('Frühere automatische Klassifikation')
  }));
  check('trial mode: agent track never renders prior reference data',
    !trialReferences.comparison && !trialReferences.seed && !trialReferences.automatic,
    trialReferences);
  const downloadPromise = trialPage.waitForEvent('download');
  await trialPage.click('.pt-trial-export');
  const trialDownload = await downloadPromise;
  const trialExportPath = await trialDownload.path();
  const trialPayload = JSON.parse(readFileSync(trialExportPath, 'utf8'));
  check('trial mode: visible export produces an authentic agent reviewer file',
    trialDownload.suggestedFilename() === 'ta.json' && trialPayload.reviewer === 'ta' && trialPayload.actor === 'agent' &&
      trialPayload.decisions['PILOT-B']?.actor === 'agent' && trialPayload.decisions['PILOT-B']?.decision === 'Exclude',
    { filename: trialDownload.suggestedFilename(), reviewer: trialPayload.reviewer, actor: trialPayload.actor,
      recordActor: trialPayload.decisions['PILOT-B']?.actor });
  await trialPage.reload();
  await trialPage.waitForFunction(() => window.__PRISMA_TEST__?.getState().reviewer === 'ta' && document.querySelector('.pt-trial-ready'));
  const trialReloaded = await trialPage.evaluate(() => ({
    reviewer: window.__PRISMA_TEST__.getState().reviewer,
    status: window.__PRISMA_TEST__.saveStatus(),
    isolated: document.querySelector('.pt-trial-ready')?.textContent
  }));
  check('trial mode: reload restores the isolated track without suggesting a repository sync',
    trialReloaded.reviewer === 'ta' && trialReloaded.status.kind === 'ready' &&
      /isolierter Testlauf/i.test(trialReloaded.status.message || '') &&
      /Keine Forschungsdaten/.test(trialReloaded.isolated || ''),
    trialReloaded);
  await trialContext.close();

  const namespaceTrial = await context.newPage();
  await namespaceTrial.goto(base + '/prisma.html?trial=1&actor=agent&reviewer=ns&paper=PILOT-B');
  await namespaceTrial.waitForFunction(() => !window.__PRISMA_TEST__.readingPending());
  const namespaceTrialState = await namespaceTrial.evaluate((reviewer) => ({
    hasProductionReviewer: !!window.__PRISMA_TEST__.getState().reviewers[reviewer],
    reviewer: window.__PRISMA_TEST__.getState().reviewer
  }), opt.reviewer);
  check('trial namespace: a same-origin trial page cannot load the production reviewer cache',
    !namespaceTrialState.hasProductionReviewer && namespaceTrialState.reviewer === 'ns', namespaceTrialState);
  await namespaceTrial.click('[data-reason="Wrong_publication_type"]');
  await namespaceTrial.click('#pt-record');
  await namespaceTrial.close();
  const namespaceProduction = await context.newPage();
  await namespaceProduction.goto(base + '/prisma.html');
  await namespaceProduction.waitForFunction(() => window.__PRISMA_TEST__ && !window.__PRISMA_TEST__.readingPending());
  const namespaceProductionState = await namespaceProduction.evaluate((reviewer) => ({
    hasTrialReviewer: !!window.__PRISMA_TEST__.getState().reviewers.ns,
    hasProductionReviewer: !!window.__PRISMA_TEST__.getState().reviewers[reviewer]
  }), opt.reviewer);
  check('trial namespace: a same-origin production page cannot load the trial reviewer cache',
    !namespaceProductionState.hasTrialReviewer && namespaceProductionState.hasProductionReviewer, namespaceProductionState);
  await namespaceProduction.close();

  const queuedWrites = await page.evaluate(async () => {
    const T = window.__PRISMA_TEST__;
    const key = T.getState().reviewer;
    let active = 0, maxActive = 0;
    const completed = [];
    T.setScreeningHandle({
      async getFileHandle() {
        let body = '';
        return { async createWritable() { return {
          async write(value) {
            active += 1;
            maxActive = Math.max(maxActive, active);
            body = String(value);
            await new Promise((resolve) => setTimeout(resolve, 30));
            active -= 1;
          },
          async close() { completed.push(body); }
        }; } };
      }
    });
    T.getState().reviewers[key]['QUEUE-A'] = { decision: 'Exclude', reviewer: key };
    T.save();
    T.getState().reviewers[key]['QUEUE-B'] = { decision: 'Exclude', reviewer: key };
    T.save();
    const limit = Date.now() + 3000;
    while (completed.length < 2 && Date.now() < limit) await new Promise((resolve) => setTimeout(resolve, 10));
    const last = completed.length ? JSON.parse(completed[completed.length - 1]) : null;
    delete T.getState().reviewers[key]['QUEUE-A'];
    delete T.getState().reviewers[key]['QUEUE-B'];
    return { completed: completed.length, maxActive, finalHasBoth: !!(last?.decisions['QUEUE-A'] && last?.decisions['QUEUE-B']) };
  });
  check('write queue: overlapping saves run serially and the final file contains both snapshots',
    queuedWrites.completed === 2 && queuedWrites.maxActive === 1 && queuedWrites.finalHasBoth, queuedWrites);

  const capturedTarget = await page.evaluate(async () => {
    const T = window.__PRISMA_TEST__;
    let release;
    const gate = new Promise((resolve) => { release = resolve; });
    let firstStarted = false, firstClosed = false, secondWrites = 0;
    const first = {
      async getFileHandle() {
        return { async createWritable() { return {
          async write() { firstStarted = true; await gate; },
          async close() { firstClosed = true; }
        }; } };
      }
    };
    const second = {
      async getFileHandle() {
        secondWrites += 1;
        return { async createWritable() { return { async write() {}, async close() {} }; } };
      }
    };
    T.setScreeningHandle(first);
    T.save();
    const startLimit = Date.now() + 3000;
    while (!firstStarted && Date.now() < startLimit) await new Promise((resolve) => setTimeout(resolve, 10));
    T.setScreeningHandle(second);
    release();
    const closeLimit = Date.now() + 3000;
    while (!firstClosed && Date.now() < closeLimit) await new Promise((resolve) => setTimeout(resolve, 10));
    return { firstStarted, firstClosed, secondWrites };
  });
  check('write queue: an enqueued snapshot stays bound to its original folder handle',
    capturedTarget.firstStarted && capturedTarget.firstClosed && capturedTarget.secondWrites === 0, capturedTarget);

  const recoveredWrite = await page.evaluate(async () => {
    const T = window.__PRISMA_TEST__;
    let attempts = 0, successes = 0;
    T.setScreeningHandle({
      async getFileHandle() {
        return { async createWritable() { return {
          async write() {
            attempts += 1;
            if (attempts === 1) throw new Error('first queued write fails');
          },
          async close() { successes += 1; }
        }; } };
      }
    });
    T.save();
    T.save();
    const limit = Date.now() + 3000;
    while (successes < 1 && Date.now() < limit) await new Promise((resolve) => setTimeout(resolve, 10));
    return { attempts, successes, status: T.saveStatus().kind };
  });
  check('write queue: a failed write does not block the next save',
    recoveredWrite.attempts === 2 && recoveredWrite.successes === 1 && recoveredWrite.status === 'saved', recoveredWrite);

  await page.evaluate(() => {
    const T = window.__PRISMA_TEST__;
    T.setScreeningHandle({
      async getFileHandle() {
        return { async createWritable() { return {
          async write() { throw new Error('simulated write failure'); },
          async close() {}
        }; } };
      }
    });
    T.save();
  });
  await page.waitForFunction(() => window.__PRISMA_TEST__.saveStatus().kind === 'error');
  check('write failure: the browser copy survives and the interface reports that the reviewer file was not updated', await page.evaluate(() => {
    const T = window.__PRISMA_TEST__;
    return Object.keys(T.curDec()).length > 0 && /Speichern fehlgeschlagen/.test(T.saveStatus().message || '');
  }));

  const envelope05 = await page.evaluate(async () => {
    const T = window.__PRISMA_TEST__;
    const writes = {};
    const payload = {
      schema: 'femprompt-prisma-reviewer/0.5', reviewer: 'a04', actor: 'human', status: 'curated',
      ratification: { status: 'ratified', activity_id: 'ratify-1' }, run_manifest: 'runs/a04.json',
      updated: '2026-08-23T10:00:00.000Z', decisions: {
        'PILOT-A': {
          decision: 'Exclude', reason: 'Duplicate', categories: {}, evidence: {}, lifecycle: {
            baseline: { state: 'curated', basis: 'legacy_import', at: '2026-08-22T10:00:00.000Z', actor_ids: ['a04'] },
            state: 'curated', events: []
          }
        }
      }
    };
    const entry = { kind: 'file', name: 'a04.json', async getFile() { return { async text() { return JSON.stringify(payload); } }; } };
    T.setScreeningHandle({
      async *values() { yield entry; },
      async getFileHandle(name) { return { async createWritable() { let body = ''; return {
        async write(value) { body = String(value); }, async close() { writes[name] = body; }
      }; } }; }
    });
    await T.loadAllReviewers();
    T.selectReviewer('a04');
    T.save();
    const deadline = Date.now() + 3000;
    while (!writes['a04.json'] && Date.now() < deadline) await new Promise((resolve) => setTimeout(resolve, 10));
    return writes['a04.json'] ? JSON.parse(writes['a04.json']) : null;
  });
  check('0.5 envelope: a loaded governed file preserves schema, status, ratification, metadata, and lifecycle on write',
    envelope05?.schema === 'femprompt-prisma-reviewer/0.5' && envelope05?.actor === 'human' &&
      envelope05?.status === 'curated' && envelope05?.ratification?.activity_id === 'ratify-1' &&
      envelope05?.run_manifest === 'runs/a04.json' && envelope05?.decisions?.['PILOT-A']?.lifecycle?.baseline?.basis === 'legacy_import',
    envelope05);
  await page.evaluate((reviewer) => window.__PRISMA_TEST__.selectReviewer(reviewer), opt.reviewer);

  const malformed = await page.evaluate(async (reviewer) => {
    const T = window.__PRISMA_TEST__;
    const before = Object.keys(T.curDec()).length;
    let writeAttempts = 0;
    const entry = {
      kind: 'file',
      name: reviewer + '.json',
      async getFile() { return { async text() { return '{ malformed'; } }; }
    };
    T.setScreeningHandle({
      async *values() { yield entry; },
      async getFileHandle() { writeAttempts += 1; throw new Error('must not write'); }
    });
    await T.loadAllReviewers();
    T.save();
    return {
      before,
      after: Object.keys(T.curDec()).length,
      error: T.reviewerFileErrors()[reviewer],
      status: T.saveStatus(),
      writeAttempts
    };
  }, opt.reviewer);
  check('malformed reviewer file: browser records survive and every overwrite is blocked',
    malformed.before === malformed.after && !!malformed.error && malformed.status.kind === 'error' && malformed.writeAttempts === 0,
    malformed);

  check('no page errors during the session', consoleErrors.length === 0, consoleErrors);

  // Editing exists only in a local project copy: without the local full-text manifest the
  // page is read-only and offers no switch, no key field and no save; the status and
  // category filters stay.
  const publicContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await installFixtureRoutes(publicContext);
  await publicContext.route('**/data/fulltext_manifest.json', (route) => route.fulfill({ status: 404, body: '' }));
  const publicPage = await publicContext.newPage();
  await publicPage.goto(base + '/prisma.html?verify=1&paper=PILOT-B');
  await publicPage.waitForFunction(() => window.__PRISMA_TEST__ && document.querySelector('#pt-doc'), null, { timeout: 15000 });
  check('published copy: without the local manifest PRISM is read-only without a mode switch', await publicPage.evaluate(() =>
    !window.__PRISMA_TEST__.canEdit() && !document.querySelector('.pt-mode-seg, #pt-reviewer-key, #pt-record') &&
      !!document.querySelector('.pt-cat-filter') && !!document.querySelector('.pt-status-seg')));
  await publicContext.close();
  check('local copy: with the manifest and File System Access the switch is offered', await page.evaluate(() =>
    window.__PRISMA_TEST__.localEditingAvailable() && document.querySelectorAll('.pt-mode-seg button').length === 2));

  // List filters live in the URL and survive a reload; the counter ignores them.
  const filterPage = await context.newPage();
  await filterPage.goto(base + '/prisma.html?status=erfasst&cats=Gender');
  await filterPage.waitForFunction(() => window.__PRISMA_TEST__ && document.querySelector('#pt-doc'), null, { timeout: 15000 });
  const filtered = await filterPage.evaluate(() => ({
    status: document.querySelector('.pt-status-seg [aria-pressed="true"]')?.dataset.status,
    chip: document.querySelector('.pt-cat-filter .category-chip[data-cat="Gender"]')?.getAttribute('aria-pressed'),
    rows: document.querySelectorAll('#pt-corpus-list .pt-nav-item').length,
    url: location.search
  }));
  check('URL state: status and category filters are restored from the URL', filtered.status === 'erfasst' && filtered.chip === 'true' &&
    /status=erfasst/.test(filtered.url) && /cats=Gender/.test(filtered.url), filtered);
  await filterPage.click('.pt-cat-filter .category-chip[data-cat="Gender"]');
  check('URL state: removing a filter updates the URL', !/cats=/.test(new URL(filterPage.url()).search), filterPage.url());
  check('assignment: without an assignment file there is no Zuteilung filter',
    await filterPage.evaluate(() => !document.querySelector('.pt-assignee-seg')));
  await filterPage.close();

  // The Zuteilung segment narrows the list, combines with the status filter and keeps
  // its state in the URL. The assignment file is a fixture over the pilot corpus.
  const assignContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await installFixtureRoutes(assignContext);
  await assignContext.route('**/data/screening/assignment.json', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({
    schema: 'femprompt-prisma-assignment/1.0', reviewers: [{ key: 'sabine', label: 'Sabine' }, { key: 'susi', label: 'Susi' }],
    assigned_on: '2026-10-01', rule: 'pilot fixture', assignments: { 'PILOT-A': 'sabine', 'PILOT-B': 'susi', AIGLDZ4C: 'susi' } }) }));
  const assignPage = await assignContext.newPage();
  await assignPage.goto(base + '/prisma.html?status=offen');
  await assignPage.waitForFunction(() => window.__PRISMA_TEST__ && document.querySelector('.pt-assignee-seg'), null, { timeout: 15000 });
  const listIds = () => assignPage.evaluate(() => Array.from(document.querySelectorAll('#pt-corpus-list .pt-nav-item'))
    .map((el) => window.EC.getAllPapers()[parseInt(el.dataset.i, 10)].id));
  const allIds = await listIds();
  const labelled = await assignPage.evaluate(() => document.querySelectorAll('#pt-corpus-list .pt-nav-assignee').length);
  await assignPage.click('.pt-assignee-seg [data-assignee="susi"]');
  const susiIds = await listIds();
  const assignState = await assignPage.evaluate(() => ({
    pressed: document.querySelector('.pt-assignee-seg [aria-pressed="true"]')?.dataset.assignee,
    labels: document.querySelectorAll('#pt-corpus-list .pt-nav-assignee').length,
    url: location.search
  }));
  check('assignment: the Zuteilung segment narrows the open list to the assignee',
    allIds.length === 3 && labelled === 3 && susiIds.join('|') === 'PILOT-B|AIGLDZ4C' && assignState.pressed === 'susi' &&
      assignState.labels === 0 && /assignee=susi/.test(assignState.url) && /status=offen/.test(assignState.url),
    { allIds, labelled, susiIds, assignState });
  await assignPage.reload();
  await assignPage.waitForFunction(() => window.__PRISMA_TEST__ && document.querySelector('.pt-assignee-seg'), null, { timeout: 15000 });
  check('assignment: the selected assignee is restored from the URL', (await listIds()).join('|') === 'PILOT-B|AIGLDZ4C');
  await assignContext.close();

  // Operator screen review of 1 October 2026 (provisional, knowledge/plan.md): a paper with
  // a publisher cover page, a converter entity, a long DOI and an expert Exclude that the
  // category rule would include. The extra paper and its text are overlaid on the fixture
  // corpus for this context only.
  const reviewContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-AT' });
  await installFixtureRoutes(reviewContext);
  const longDoi = '10.1080/21670811.2022.2119152.supplementary-material-long-suffix';
  const reviewVault = JSON.parse(fixture('vault.json'));
  reviewVault.papers.push({ id: 'PILOT-C', title: 'Pilot paper C: a commentary behind a publisher cover page', author_year: 'Deuze and Beckett (2022)',
    authors: 'Deuze, Mark; Beckett, Charlie', year: 2022, doi: longDoi, url: '', abstract: '', item_type: 'journalArticle', journal: 'Pilot Journal',
    human: { decision: 'Exclude', categories: ['AI_Literacies', 'Bias_Ungleichheit'],
      all_categories: { AI_Literacies: 1, Generative_KI: 0, Prompting: 0, KI_Sonstige: 0, Soziale_Arbeit: 0, Bias_Ungleichheit: 1, Gender: 0, Diversitaet: 0, Feministisch: 0, Fairness: 0 } } });
  const reviewManifest = JSON.parse(fixture('fulltext_manifest.json'));
  reviewManifest['PILOT-C'] = { src: 'clean', chars: 900, source_file: 'pilot_c_fixture.md' };
  const coverText = ['## Pilot Journal', '', 'ISSN: 2167-0811 (Print) 2167-082X (Online)', '', '## Pilot paper C', '',
    '## Mark Deuze &amp; Charlie Beckett', '', 'To cite this article: Mark Deuze &amp; Charlie Beckett (2022) Pilot paper C', '',
    'To link to this article:', '', 'Published online: 28 Sep 2022.', '', 'Submit your article to this journal', '', 'Article views: 4190', '',
    'View related articles', '', 'View Crossmark data', '', 'Citing articles: 64 View citing articles', '', 'CrossMark', '',
    '## ARTICLE COMMENTARY', '', 'Mark Deuze a and Charlie Beckett b', '',
    'Mark Deuze &amp; Charlie Beckett frame the normative dimension of literacy.', '',
    // converter glyph codes as they stand in YDW5TX8M, 4ZL5Q48E and 9WIGR47Y
    '- /C15 the business of news and journalism as a profession', '- /C15 knowledge about artificial intelligence', '',
    'Franchises of mobile games like Pok /C19 emon and Letouz /C19 e E travel. /C211 The Author(s) 2024', '',
    'A second paragraph names literacy again, so the search has more than one hit.'].join('\n');
  await reviewContext.route('**/data/research_vault_v2.json', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify(reviewVault) }));
  await reviewContext.route('**/data/fulltext_manifest.json', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify(reviewManifest) }));
  await reviewContext.route('**/data/fulltext/PILOT-C.md', (route) => route.fulfill({ contentType: 'text/markdown', body: coverText }));
  await reviewContext.route('**/data/screening/assignment.json', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({
    schema: 'femprompt-prisma-assignment/1.0', reviewers: [{ key: 'sabine', label: 'Sabine' }, { key: 'susi', label: 'Susi' }],
    assigned_on: '2026-10-01', rule: 'pilot fixture', assignments: { 'PILOT-A': 'sabine', 'PILOT-B': 'susi', AIGLDZ4C: 'susi' } }) }));
  const reviewPage = await reviewContext.newPage();
  const reviewErrors = [];
  reviewPage.on('pageerror', (e) => reviewErrors.push(String(e)));
  await reviewPage.goto(base + '/prisma.html?paper=PILOT-C');
  await reviewPage.waitForFunction(() => window.__PRISMA_TEST__ && document.querySelector('#pt-doc .pt-doc-p'), null, { timeout: 15000 });
  const reading = await reviewPage.evaluate(() => {
    const doc = document.getElementById('pt-doc');
    return { first: doc.firstElementChild && doc.firstElementChild.textContent, text: doc.textContent };
  });
  check('cover page: the reading text opens at the first real heading after the publisher sheet',
    reading.first === 'Article commentary' && !/ISSN|To cite this article|Submit your article|Article views|CrossMark/.test(reading.text), reading);
  check('entities: the converter ampersand shows as "&", never as "&amp;"',
    reading.text.includes('Mark Deuze & Charlie Beckett frame') && !reading.text.includes('&amp;'), reading.text.slice(0, 120));
  // second UI round of 1 October 2026: glyph codes, front matter, heading case, no
  // counter, no highlighting, and a Lesen panel with the assigned categories only
  const round2 = await reviewPage.evaluate(() => {
    const doc = document.getElementById('pt-doc');
    const front = Array.from(doc.querySelectorAll('.pt-doc-front'));
    const body = Array.from(doc.querySelectorAll('p.pt-doc-p')).find((p) => p.textContent.startsWith('Mark Deuze & Charlie Beckett frame'));
    const chrome = document.body.innerText.replace(doc.innerText, '');
    const rail = document.getElementById('pt-assess-col');
    return {
      glyphCodes: (doc.textContent.match(/\/C\d+/g) || []).length,
      items: Array.from(doc.querySelectorAll('.pt-doc-ul li')).map((li) => li.textContent),
      glyphText: doc.textContent.includes('Pokémon') && doc.textContent.includes('Letouzé E') && doc.textContent.includes('© The Author(s) 2024'),
      front: front.map((el) => el.textContent),
      frontSmaller: front.length > 0 && body && parseFloat(getComputedStyle(front[0]).fontSize) < parseFloat(getComputedStyle(body).fontSize) &&
        getComputedStyle(front[0]).color !== getComputedStyle(body).color,
      bodyFront: body ? body.classList.contains('pt-doc-front') : null,
      marks: doc.querySelectorAll('mark').length,
      middots: (chrome.match(/·/g) || []).length + (document.title.match(/·/g) || []).length,
      counter: !!document.querySelector('.pt-ws-pos') || /\d+\s*\/\s*\d+/.test(document.querySelector('.pt-nav-tools').textContent),
      railCats: Array.from(rail.querySelectorAll('.pt-dim .category-chip')).map((c) => c.dataset.cat),
      railAi: /\b(LLM|KI-Vorbewertung|Agent|Modell|Prompt)\b/.test(rail.textContent)
    };
  });
  check('glyph codes: /C15 bullets, /C19 accents and /C211 render as characters, no code stays',
    round2.glyphCodes === 0 && round2.glyphText && round2.items[0] === 'the business of news and journalism as a profession', round2);
  check('front matter: the byline is kept but set smaller and muted, the sentence about the authors stays text',
    round2.front.includes('Mark Deuze a and Charlie Beckett b') && round2.frontSmaller && round2.bodyFront === false, round2.front);
  check('reading text: no highlighting without a search, no middle dot in the interface',
    round2.marks === 0 && round2.middots === 0, { marks: round2.marks, middots: round2.middots });
  check('position: no "n / N" counter above the list', !round2.counter);
  check('panel in Lesen: only the assigned categories, nothing from an AI track',
    round2.railCats.join('|') === 'AI_Literacies|Bias_Ungleichheit' && !round2.railAi, round2.railCats);
  const head = await reviewPage.evaluate((doi) => {
    const link = document.querySelector('.pt-paper-metadata .pt-doi-link');
    const dd = link && link.closest('dd');
    const box = document.querySelector('.pt-paper-head').getBoundingClientRect();
    const rects = link ? Array.from(link.getClientRects()) : [];
    return { text: link && link.textContent, full: link && link.textContent === doi, overflow: dd ? getComputedStyle(dd).textOverflow : null,
      clipped: dd ? dd.scrollWidth > dd.clientWidth + 1 : true, inside: rects.every((r) => r.right <= box.right + 1), lines: rects.length };
  }, longDoi);
  check('paper head: the DOI is shown in full and wraps instead of being cut', head.full && head.overflow !== 'ellipsis' && !head.clipped && head.inside, head);
  const verdictRead = await reviewPage.evaluate(() => {
    const rail = document.getElementById('pt-assess-col');
    return { line: document.getElementById('pt-verdict')?.textContent, badge: document.getElementById('pt-decision')?.textContent,
      derived: !!rail.querySelector('.pt-derived'), toggle: !!rail.querySelector('#pt-override'), reason: !!rail.querySelector('.pt-reason-chip') };
  });
  check('panel: an expert-adopted divergent exclusion reads as one line in Lesen',
    verdictRead.line === 'Ausgeschlossen durch Expert:innen, Kategorien ergäben Include' && verdictRead.badge === 'Exclude' &&
      !verdictRead.derived && !verdictRead.toggle && !verdictRead.reason, verdictRead);
  const arrows = () => reviewPage.evaluate(() => ['pt-intext-prev', 'pt-intext-next'].map((id) => {
    const b = document.getElementById(id); return !!(b && b.offsetParent !== null);
  }));
  const arrowsBefore = await arrows();
  await reviewPage.fill('#pt-intext', 'literacy');
  await reviewPage.waitForFunction(() => document.querySelectorAll('#pt-doc mark.pt-hit').length > 1);
  const arrowsHits = await arrows();
  await reviewPage.fill('#pt-intext', 'zzzqqq');
  await reviewPage.waitForFunction(() => document.querySelectorAll('#pt-doc mark.pt-hit').length === 0);
  const arrowsNone = await arrows();
  check('in-text search: the step arrows appear only while there are hits to step through',
    arrowsBefore.every((v) => !v) && arrowsHits.every(Boolean) && arrowsNone.every((v) => !v), { arrowsBefore, arrowsHits, arrowsNone });
  await reviewPage.fill('#pt-intext', '');
  await reviewPage.screenshot({ path: join(outDir, '10-review-fixes-lesen.png') });
  trace.screenshots.push('10-review-fixes-lesen.png');

  await reviewPage.getByRole('button', { name: 'Bearbeiten', exact: true }).click();
  await reviewPage.waitForFunction(() => window.__PRISMA_TEST__.canEdit() && document.getElementById('pt-verdict-edit'));
  const editRail = await reviewPage.evaluate(() => ({
    chips: document.querySelectorAll('#pt-assess-col .pt-dim .category-chip').length,
    basis: document.getElementById('pt-text-basis')?.textContent
  }));
  check('panel in Bearbeiten: all ten toggles and the text basis of the draft', editRail.chips === 10 && editRail.basis === 'Textbasis: Volltext', editRail);
  const counter =await reviewPage.evaluate(() => ({ bar: document.querySelector('.pt-nav-tools .pt-ws-bar')?.textContent || '', done: !!document.querySelector('.pt-ws-done') }));
  check('position bar: no "n von N erfasst" counter repeats the Erfasst facet', !counter.done && !/erfasst/.test(counter.bar), counter);
  const closed = await reviewPage.evaluate(() => ({ open: document.getElementById('pt-verdict-edit').open,
    visibleReason: !!Array.from(document.querySelectorAll('#pt-verdict-edit .pt-reason-chip')).find((b) => b.checkVisibility()) }));
  await reviewPage.focus('#pt-verdict-edit summary');
  await reviewPage.keyboard.press('Enter');
  const opened = await reviewPage.evaluate(() => ({ open: document.getElementById('pt-verdict-edit').open,
    toggle: !!document.querySelector('#pt-verdict-edit #pt-override:checked'),
    reason: document.querySelector('#pt-verdict-edit .pt-reason-chip.sel')?.dataset.reason }));
  check('panel: in Bearbeiten the override and the reason sit behind one keyboard-operable disclosure',
    !closed.open && !closed.visibleReason && opened.open && opened.toggle && opened.reason === 'Consolidated_expert_exclusion', { closed, opened });
  await reviewPage.screenshot({ path: join(outDir, '10-review-fixes-bearbeiten.png') });
  trace.screenshots.push('10-review-fixes-bearbeiten.png');
  await reviewPage.click('#pt-verdict-edit .pt-reason-chip[data-reason="Not_relevant_topic"]');
  const edited = await reviewPage.evaluate(() => ({ verdict: !!document.getElementById('pt-verdict'), reason: window.__PRISMA_TEST__.getWork().reason,
    dirty: window.__PRISMA_TEST__.workDirty(), derived: document.querySelector('#pt-assess-col .pt-derived')?.textContent }));
  check('panel: editing the reason works and returns the ordinary controls', !edited.verdict && edited.reason === 'Not_relevant_topic' && edited.dirty &&
    edited.derived === 'abgeleitet: Include', edited);

  await reviewPage.click('.pt-status-seg [data-status="erfasst"]');
  const underDone = await reviewPage.evaluate(() => ({ seg: !!document.querySelector('.pt-assignee-seg'), url: location.search,
    rows: document.querySelectorAll('#pt-corpus-list .pt-nav-item').length }));
  await reviewPage.click('.pt-status-seg [data-status="offen"]');
  const underOpen = await reviewPage.evaluate(() => !!document.querySelector('.pt-assignee-seg'));
  check('assignment: the Zuteilung filter is left out under Erfasst and returns under Offen',
    !underDone.seg && underDone.rows === 1 && !/assignee=/.test(underDone.url) && underOpen, { underDone, underOpen });
  check('review fixes: no script errors', reviewErrors.length === 0, reviewErrors);
  await reviewContext.close();

  // third UI round of 1 October 2026: a pre-proof text as the reading layer has it for
  // VP6SXQHY, with the record title repeated as a heading after the abstract, the keyword
  // list and the page header glued to the abstract, and an expert decision without Belege
  const preproofContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-AT' });
  await installFixtureRoutes(preproofContext);
  const preproofTitle = 'Pilot paper D: a canvas for assessing literacy';
  const preproofVault = JSON.parse(fixture('vault.json'));
  preproofVault.papers.push({ id: 'PILOT-D', title: preproofTitle, author_year: 'Pilot (2025)', authors: 'Pilot, Paula', year: 2025,
    doi: '', url: '', abstract: '', item_type: 'journalArticle', journal: 'Pilot Horizons',
    human: { decision: 'Include', categories: ['AI_Literacies', 'Soziale_Arbeit'],
      all_categories: { AI_Literacies: 1, Generative_KI: 0, Prompting: 0, KI_Sonstige: 0, Soziale_Arbeit: 1, Bias_Ungleichheit: 0, Gender: 0, Diversitaet: 0, Feministisch: 0, Fairness: 0 } } });
  const preproofManifest = JSON.parse(fixture('fulltext_manifest.json'));
  preproofManifest['PILOT-D'] = { src: 'clean', chars: 900, source_file: 'pilot_d_fixture.md' };
  const preproofText = ['## Journal Pre-proof', '', preproofTitle, '', '## ' + preproofTitle.toUpperCase().replace(':', ' :'), '',
    'Paula Pilot * Corresponding author Journal Pre-proof', '', '## ABSTRACT', '',
    'Organisations must build literacy across all levels. KEYWORDS : AI literacy; Upskilling; Digital transformation Journal Pre-proof', '',
    '## ' + preproofTitle, '', '## 1. The case for literacy', '',
    'Literacy is no longer optional. Journal Pre-proof', '', 'Journal Pre-proof', '', 'A second paragraph keeps its text.'].join('\n');
  await preproofContext.route('**/data/research_vault_v2.json', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify(preproofVault) }));
  await preproofContext.route('**/data/fulltext_manifest.json', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify(preproofManifest) }));
  await preproofContext.route('**/data/fulltext/PILOT-D.md', (route) => route.fulfill({ contentType: 'text/markdown', body: preproofText }));
  const preproofPage = await preproofContext.newPage();
  const preproofErrors = [];
  preproofPage.on('pageerror', (e) => preproofErrors.push(String(e)));
  await preproofPage.goto(base + '/prisma.html?paper=PILOT-D');
  await preproofPage.waitForFunction(() => window.__PRISMA_TEST__ && document.querySelector('#pt-doc .pt-doc-p'), null, { timeout: 15000 });
  const round3 = await preproofPage.evaluate(() => {
    const doc = document.getElementById('pt-doc');
    const keywords = Array.from(doc.querySelectorAll('.pt-doc-keywords'));
    const abstract = Array.from(doc.querySelectorAll('p.pt-doc-p')).find((p) => p.textContent.startsWith('Organisations must'));
    const evid = document.querySelector('#pt-assess-col .pt-evid');
    return {
      heads: Array.from(doc.querySelectorAll('h1, h2, h3, h4')).map((h) => h.textContent),
      abstract: abstract && abstract.textContent,
      keywords: keywords.map((k) => k.textContent),
      keywordsMuted: keywords.length > 0 && abstract && parseFloat(getComputedStyle(keywords[0]).fontSize) < parseFloat(getComputedStyle(abstract).fontSize) &&
        getComputedStyle(keywords[0]).color !== getComputedStyle(abstract).color,
      preproof: (doc.textContent.match(/Journal Pre-proof/g) || []).length,
      kept: doc.textContent.includes('Literacy is no longer optional.') && doc.textContent.includes('A second paragraph keeps its text.'),
      evidence: evid ? Array.from(evid.querySelectorAll('li')).map((li) => li.textContent) : null,
      evidenceChips: evid ? evid.querySelectorAll('.category-chip').length : -1
    };
  });
  check('title: a heading repeating the record title after the abstract is dropped, the first section stays',
    round3.heads.join('|') === 'Abstract|1. The case for literacy', round3.heads);
  check('keywords: the trailing keyword segment leaves the abstract as its own muted line',
    round3.abstract === 'Organisations must build literacy across all levels.' &&
      round3.keywords.join('|') === 'Schlüsselwörter: AI literacy; Upskilling; Digital transformation' && round3.keywordsMuted, round3);
  check('boilerplate: "Journal Pre-proof" is gone as heading, line and paragraph end, the text around it stays',
    round3.preproof === 0 && round3.kept, { preproof: round3.preproof, kept: round3.kept });
  check('Belege: an expert decision without any Beleg reads as one line',
    JSON.stringify(round3.evidence) === JSON.stringify(['Alle Kategorien ohne Textbeleg (Expert:innen-Urteil)']) && round3.evidenceChips === 0, round3.evidence);
  const mixed = await preproofPage.evaluate(() => {
    const box = document.createElement('div');
    box.innerHTML = window.__PRISMA_TEST__.evidenceRowsHtml({
      categories: { AI_Literacies: 2, Gender: 2, Fairness: 2 },
      evidence: { Gender: [{ snippet: 'gendered scripts of care', source_layer: 'paper', actor: 'human' }] },
      evidence_basis: { AI_Literacies: 'expert_assessment', Fairness: 'expert_assessment' }
    }, false);
    const row = box.querySelector('.pt-evid-summary.is-basis');
    return row ? { label: row.querySelector('.pt-evid-label')?.textContent,
      chips: Array.from(row.querySelectorAll('.pt-evid-chips .category-chip')).map((c) => c.textContent), bullets: /•/.test(row.textContent) } : null;
  });
  check('Belege: categories without a Beleg beside pinned ones stand as a label line with category chips beneath',
    mixed && mixed.label === 'Expert:innen-Urteil, ohne Textbeleg' && mixed.chips.join('|') === 'AI Literacies|Fairness' && !mixed.bullets, mixed);
  const listEntry = await preproofPage.evaluate((title) => {
    const t = document.querySelector('#pt-corpus-list .pt-nav-item.active .pt-nav-t');
    const groups = Array.from(document.querySelectorAll('.pt-cat-filter-group'));
    const chips = Array.from(document.querySelectorAll('.pt-cat-filter .category-chip'));
    return { tooltip: t && t.getAttribute('title') === title, name: t && t.closest('button').textContent.startsWith(title),
      groups: groups.map((g) => g.getAttribute('aria-label') + ':' + g.querySelectorAll('.category-chip').length),
      separator: !!document.querySelector('.pt-cat-filter .chip-group-sep'),
      heights: [...new Set(chips.map((c) => Math.round(c.getBoundingClientRect().height)))].length,
      clipped: chips.filter((c) => { const l = c.querySelector('.chip-label'); return l.scrollWidth > l.clientWidth; }).length };
  }, preproofTitle);
  check('list: the full title is the native tooltip and opens the accessible name', listEntry.tooltip && listEntry.name, listEntry);
  check('category filter: Gegenstand and Perspektive as two groups without a separator glyph, chips of one height, no label cut',
    listEntry.groups.join('|') === 'Gegenstand:4|Perspektive:6' && !listEntry.separator && listEntry.heights === 1 && listEntry.clipped === 0, listEntry);
  await preproofPage.screenshot({ path: join(outDir, '11-preproof-lesen.png') });
  trace.screenshots.push('11-preproof-lesen.png');
  check('third round: no script errors', preproofErrors.length === 0, preproofErrors);
  await preproofContext.close();

  // 9 the pending-reading gate and the out-of-order load, each in a fresh profile so the
  // full-text cache is empty and the delayed route is really in flight
  const delayedContext = async () => {
    const c = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await installFixtureRoutes(c, 1500);
    const pg = await c.newPage();
    await pg.goto(base + '/prisma.html');
    await pg.waitForFunction(() => window.__PRISMA_TEST__ && document.querySelector('#pt-doc'), null, { timeout: 15000 });
    await setReviewerKey(pg, 'cp');
    await connectFixtureStorage(pg, 'cp');
    return { c, pg };
  };

  // 9a the gate: categories that derive Include are set while the text is still loading, so
  // an unset gate would enable the button; then the landing reading must enable it by itself
  const a = await delayedContext();
  await a.pg.evaluate(() => {
    const T = window.__PRISMA_TEST__;
    const w = T.getWork();
    w.cats.Generative_KI = 2; w.cats.Soziale_Arbeit = 2;
    w.evidence.Generative_KI = [{ term: 'g', snippet: 'human evidence', origin: 'human' }];
    w.evidence.Soziale_Arbeit = [{ term: 's', snippet: 'human evidence', origin: 'human' }];
    w.analysis = {
      fields: {
        Studientyp: 'Empirisch',
        AN_Prompting_Role: ['None'],
        AN_Bias_Axes: ['None'],
        AN_Harm_Types: ['None'],
        AN_Mitigation_Stage: ['None'],
        AN_Mitigation_Status: 'None',
        AN_Population: ['Not_SW_Specific']
      },
      undecidable: { AN_Prompt_Techniques: true }
    };
    T.refreshAssess();
  });
  const gated = await a.pg.evaluate(() => ({
    pending: window.__PRISMA_TEST__.readingPending(),
    derived: window.__PRISMA_TEST__.finalDecisionOf(window.__PRISMA_TEST__.getWork().cats, false),
    disabled: document.getElementById('pt-record').disabled,
    hint: (document.getElementById('pt-save-hint') || {}).textContent
  }));
  check('gate: an Include-deriving state cannot be committed while the text is loading', gated.pending && gated.derived === 'Include' && gated.disabled && /lädt/.test(gated.hint || ''), gated);
  await a.pg.waitForFunction(() => !window.__PRISMA_TEST__.readingPending(), null, { timeout: 8000 });
  const released = await a.pg.evaluate(() => ({
    disabled: document.getElementById('pt-record').disabled,
    src: window.__PRISMA_TEST__.textSource()
  }));
  check('gate: the landed reading releases the button without touching a chip', released.disabled === false && released.src === 'raw', released);
  await a.pg.click('#pt-record');
  const gatedRec = await a.pg.evaluate(() => window.__PRISMA_TEST__.curDec()['PILOT-A'] || null);
  check('gate: the record written after release names the full text', gatedRec && gatedRec.text_source === 'raw', gatedRec && gatedRec.text_source);
  await a.c.close();

  // 9b out-of-order: the reviewer leaves paper A while its full text is in flight
  const b = await delayedContext();
  await b.pg.evaluate(() => { const T = window.__PRISMA_TEST__; T.getState().index = 1; T.showSurface('screening'); });
  await b.pg.waitForTimeout(2500); // longer than the delayed response
  const shown = await b.pg.evaluate(() => ({ id: window.EC.getAllPapers()[window.__PRISMA_TEST__.getState().index].id, src: window.__PRISMA_TEST__.textSource(), doc: document.getElementById('pt-doc').textContent.slice(0, 80), pending: window.__PRISMA_TEST__.readingPending() }));
  check('out-of-order: late full text of paper A does not paint over paper B', shown.id === 'PILOT-B' && shown.src === 'abstract' && /recommender/.test(shown.doc) && !/gendered/.test(shown.doc) && !shown.pending, shown);
  await b.pg.screenshot({ path: join(outDir, '09-out-of-order.png') });
  trace.screenshots.push('09-out-of-order.png');
  await b.c.close();
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
