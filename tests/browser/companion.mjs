// Chromium acceptance run for the working Companion docs/index.html: start view, answer
// pages, Argumentkarte, Literaturbild matrix, Wissensnetz and Begriffsnetz, work view, Landkarte lenses, legacy hashes, nav
// tooltips, the Korpus workbench (sidebar, year histogram, review stages, work lists,
// exports, stage track with next step, filter chips, detail panel actions) and reflow.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const docs = resolve(here, '..', '..', 'docs');
const landscape = JSON.parse(readFileSync(resolve(docs, 'data', 'literature_landscape.json')));
const vault = JSON.parse(readFileSync(resolve(docs, 'data', 'research_vault_v2.json')));
const schema = JSON.parse(readFileSync(resolve(docs, 'data', 'category_schema.json')));
// The ignored working file exists after npm run build; without it the map shows the
// released index alone, so the expectations follow whichever file the page will read.
const workingPath = resolve(docs, 'data', 'assertions_working.json');
const hasWorking = existsSync(workingPath);
const released = JSON.parse(readFileSync(resolve(docs, 'data', 'assertion_index.json'))).assertions;
const mapItems = hasWorking ? JSON.parse(readFileSync(workingPath)).assertions : released.map((a) => ({
  id: a.assertion_ref.split('/').pop(), label: a.label || '', research_questions: a.research_questions || [], contested_with: [], released: true,
  works: [...new Set(a.evidence.map((e) => e.record_id))].map((id) => ({ record_id: id })),
}));
const mime = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.ttf': 'font/ttf', '.woff2': 'font/woff2',
};

const server = createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const file = resolve(docs, '.' + pathname);
  if (!file.startsWith(docs) || !existsSync(file) || statSync(file).isDirectory()) {
    response.writeHead(404); response.end('not found'); return;
  }
  response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
  response.end(readFileSync(file));
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const address = server.address();
const base = `http://127.0.0.1:${address.port}`;

const checks = [];
function check(name, condition, detail = '') {
  checks.push({ name, ok: Boolean(condition), detail });
}

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'de-AT' });
  const errors = [];
  const external = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (message) => {
    // A missing working file, and a reviewer file nobody has saved yet, are expected
    // states, not errors of the page.
    const url = String(message.location().url);
    const expectedAbsent = url.endsWith('/data/assertions_working.json') ||
      (/\/data\/screening\/[a-z0-9_-]+\.json$/.test(url) && message.text().includes('404'));
    if (message.type() === 'error' && !expectedAbsent) errors.push(message.text());
  });
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (/^https?:$/.test(url.protocol) && url.origin !== base) external.push(request.url());
  });

  const cov = landscape.meta.analysis_coverage;
  // Fields added by a later codebook version are not collected for earlier annotations;
  // the baseline fields decide the coded count.
  const later = new Set(JSON.parse(readFileSync(resolve(docs, 'data', 'analysis_fields.json'))).fields
    .filter((field) => field.introduced_in).map((field) => field.name));
  const coded = Math.min(...Object.entries(cov.fields).filter(([key]) => key.startsWith('AN_') && !later.has(key)).map(([, f]) => f.value + f.none + f.undecidable));
  const visibleView = () => page.evaluate(() => [...document.querySelectorAll('.view-content')].filter((node) => node.offsetParent !== null).map((node) => node.id).join());
  const hashParams = () => new URLSearchParams(new URL(page.url()).hash.slice(1));

  await page.goto(`${base}/index.html`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.getElementById('start-status').textContent !== '');
  check('the start view is the default view', await visibleView() === 'view-start');
  check('the status sentence reads the coverage contract',
    (await page.locator('#start-status').innerText()).startsWith(`Vorläufig: ${coded} von ${cov.scope.work_total} eingeschlossenen Werken codiert, `));
  const layout = await page.evaluate(() => {
    const width = (sel) => Math.round(document.querySelector(sel).getBoundingClientRect().width);
    const lines = (sel) => {
      const node = document.querySelector(sel);
      return Math.round(node.getBoundingClientRect().height / parseFloat(getComputedStyle(node).lineHeight));
    };
    return {
      title: width('#start-title'), status: width('#start-status'), cards: width('.start-cards'),
      titleLines: lines('#start-title'), statusLines: lines('#start-status'),
      columns: getComputedStyle(document.querySelector('.start-cards')).gridTemplateColumns.split(' ').length,
      lastSpans: Math.round(document.querySelector('.start-cards > li:last-child').getBoundingClientRect().width) === width('.start-cards'),
    };
  });
  check('title, status line and cards share one width', layout.title === layout.cards && layout.status === layout.cards, JSON.stringify(layout));
  // The main question of 1 October 2026 names bias forms and their handling, so it runs longer than before.
  check('the main question wraps on two to four lines', layout.titleLines >= 2 && layout.titleLines <= 4, JSON.stringify(layout));
  check('the status sentence stands on one line', layout.statusLines === 1, JSON.stringify(layout));
  check('the five question cards form a two-column grid whose last card spans it',
    layout.columns === 2 && layout.lastSpans && await page.locator('.start-card').count() === 5, JSON.stringify(layout));
  check('the start view carries no buttons duplicating the navigation', await page.locator('#view-start .start-btn, #view-start .start-actions').count() === 0);
  const cardLines = await page.locator('.start-card-status').allInnerTexts();
  check('every card names its finding status',
    cardLines.length === 5 && cardLines.every((line) => /^(\d+ KI-geprüfte?r? Befunde?|noch kein geprüfter Befund|noch nicht codiert$)/.test(line)), cardLines.join(' | '));

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForSelector('#argument-map .amap-columns');
  const questionOf = (item) => item.research_questions.map((value) => (/(\d+)/.exec(value) || [])[1]).filter(Boolean);
  const sharesWork = (a, b) => a.id !== b.id && a.works.some((work) => b.works.some((own) => own.record_id === work.record_id));
  const columnCounts = await page.locator('#argument-map .amap-columns > .amap-col').evaluateAll((cols) =>
    cols.map((col) => [col.dataset.sq, col.querySelectorAll('.amap-tile[data-id]').length,
      Number(col.querySelector('.amap-count').textContent), Boolean(col.querySelector('.amap-empty'))]));
  check('the Argumentkarte renders five question columns with the counts of the data',
    columnCounts.length === 5 && columnCounts.every(([sq, tiles, count, empty]) => {
      const expected = mapItems.filter((item) => questionOf(item).includes(sq)).length;
      return tiles === expected && count === expected && empty === (expected === 0);
    }), JSON.stringify(columnCounts));
  check('the map reads the working file where it exists and the released index otherwise',
    await page.locator('#argument-map').getAttribute('data-source') === (hasWorking ? 'working' : 'released'));
  check('every tile shows its release state in form and its Works as unit marks', await page.evaluate((items) => {
    const byId = Object.fromEntries(items.map((item) => [item.id, item]));
    return [...document.querySelectorAll('#argument-map .amap-tile[data-id]')].every((tile) => {
      const item = byId[tile.dataset.id];
      return item && tile.classList.contains(item.released ? 'amap-tile--released' : 'amap-tile--draft') &&
        tile.querySelectorAll('.amap-units i').length === Math.min(item.works.length, 6);
    });
  }, mapItems));
  check('a tile shows the short label of its Assertion where one exists', await page.evaluate((items) => {
    const byId = Object.fromEntries(items.map((item) => [item.id, item]));
    return [...document.querySelectorAll('#argument-map .amap-tile[data-id]')].every((tile) => {
      const label = byId[tile.dataset.id].label || '';
      const shown = tile.querySelector('.amap-label');
      return label ? Boolean(shown) && shown.textContent === label && tile.getAttribute('aria-label').startsWith(label) : !shown;
    });
  }, mapItems));
  const placed = mapItems.filter((item) => questionOf(item).length);
  const target = placed.find((item) => item.contested_with.length && mapItems.some((other) => sharesWork(item, other))) ||
    placed.find((item) => mapItems.some((other) => sharesWork(item, other))) || placed[0];
  const sharing = new Set(mapItems.filter((other) => sharesWork(other, target)).map((other) => other.id));
  await page.locator(`#argument-map .amap-columns .amap-tile[data-id="${target.id}"]`).first().click();
  await page.waitForTimeout(250); // the dimming fades in over 0.15 s
  const marked = await page.evaluate(() => {
    const ids = (selector) => [...new Set([...document.querySelectorAll(selector)].map((tile) => tile.dataset.id))];
    return {
      shared: ids('#argument-map .amap-tile.is-shared[data-id]'),
      contested: ids('#argument-map .amap-tile.is-contested[data-id]'),
      contestedForm: [...document.querySelectorAll('#argument-map .amap-tile.is-contested[data-id]')].every((tile) =>
        getComputedStyle(tile).borderTopStyle === 'dashed' && getComputedStyle(tile, '::after').content.includes('≠')),
      dimmed: [...document.querySelectorAll('#argument-map.amap--active .amap-tile[data-id]:not(.is-selected):not(.is-shared):not(.is-contested)')]
        .every((tile) => Number(getComputedStyle(tile).opacity) < 0.5),
      detail: !document.getElementById('amap-detail').hidden && document.querySelector('#amap-detail .amap-statement').textContent.length > 0,
      works: document.querySelectorAll('#amap-detail .amap-work').length,
      links: [...document.querySelectorAll('#amap-detail .amap-work a')].map((link) => link.getAttribute('href')),
    };
  });
  check('selecting a tile shows its statement and source Works with work and PRISM links',
    marked.detail && marked.works === target.works.length &&
    target.works.every((work) => marked.links.includes('prisma.html?paper=' + encodeURIComponent(work.record_id))), JSON.stringify(marked));
  check('selecting a tile marks the tiles sharing a Work and dims the rest',
    marked.shared.length === sharing.size && marked.shared.every((id) => sharing.has(id)) && marked.dimmed, JSON.stringify(marked));
  check('selecting a tile marks contested tiles by dashed border and glyph',
    marked.contested.length === target.contested_with.length && target.contested_with.every((id) => marked.contested.includes(id)) && marked.contestedForm,
    JSON.stringify({ marked, expected: target.contested_with }));
  if (target.contested_with.length) {
    await page.locator('#amap-detail .amap-jump').first().click();
    check('a contested Assertion in the detail jumps to its tile',
      await page.evaluate((id) => document.activeElement.dataset.id === id &&
        document.activeElement.getAttribute('aria-pressed') === 'true', target.contested_with[0]));
  }
  check('the map leaves no horizontal overflow at 1280 px', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await page.keyboard.press('Escape');
  check('Escape clears the selection', await page.locator('#amap-detail').isHidden() &&
    await page.locator('#argument-map .amap-tile[aria-pressed="true"]').count() === 0);
  const keyTile = page.locator('#argument-map .amap-columns .amap-tile[data-id]').first();
  await keyTile.focus();
  check('a focused tile shows its tooltip', await page.locator('#amap-tip').isVisible());
  await page.keyboard.press('Enter');
  check('a tile is selectable by keyboard', await keyTile.getAttribute('aria-pressed') === 'true' && await page.locator('#amap-detail').isVisible());
  await page.keyboard.press('Space');
  check('a second activation deselects the tile', await keyTile.getAttribute('aria-pressed') === 'false' && await page.locator('#amap-detail').isHidden());
  await page.setViewportSize({ width: 390, height: 844 });
  await keyTile.click();
  check('at 390 px the map with an open detail has no horizontal overflow',
    await page.locator('#amap-detail').isVisible() && await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await keyTile.click();
  await page.setViewportSize({ width: 1440, height: 900 });

  const fallback = await browser.newPage({ viewport: { width: 1280, height: 800 }, locale: 'de-AT' });
  await fallback.route('**/data/assertions_working.json', (route) => route.fulfill({ status: 404, body: 'not found' }));
  await fallback.goto(`${base}/index.html`, { waitUntil: 'networkidle' });
  await fallback.waitForSelector('#argument-map .amap-columns');
  check('without the working file the map shows only released Assertions',
    await fallback.locator('#argument-map').getAttribute('data-source') === 'released' &&
    await fallback.locator('#argument-map .amap-tile--draft[data-id]').count() === 0 &&
    new Set(await fallback.locator('#argument-map .amap-tile[data-id]').evaluateAll((tiles) => tiles.map((tile) => tile.dataset.id))).size === released.length);
  await fallback.close();
  await page.goto(`${base}/index.html`, { waitUntil: 'networkidle' });

  await page.locator('.start-card[data-sq="2"]').focus();
  await page.keyboard.press('Enter');
  await page.waitForSelector('#frage-root .answer[data-sq="2"]');
  check('a card opens its answer page by keyboard and moves focus to its heading',
    hashParams().get('sq') === '2' && await page.evaluate(() => document.activeElement.matches('#frage-root h1')));
  await page.goBack({ waitUntil: 'networkidle' });
  check('Back returns from an answer page to the start view', await visibleView() === 'view-start');
  for (const sq of ['1', '2', '3', '4', '5']) {
    await page.goto(`${base}/index.html#view=frage&sq=${sq}`, { waitUntil: 'networkidle' });
    await page.waitForSelector(`#frage-root .answer[data-sq="${sq}"]`);
    check(`answer page ${sq} leads with the denominator and has its four parts`,
      await page.locator('#frage-root h1 + .denominator--summary').count() === 1 &&
      await page.locator('#frage-befunde, #frage-matrix, #frage-offen, #frage-werke').count() === 4);
  }
  await page.goto(`${base}/index.html#view=frage&sq=4`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#frage-root .answer[data-sq="4"]');
  // the page states "Noch nicht codiert" exactly while no released Include carries a
  // conceptual-grounding field, which the coding runs decide, not this test
  const sq4Coded = ['AN_Gender_Definition', 'AN_Bias_Definition', 'AN_Gender_Understanding', 'AN_Theory_Reference']
    .some((key) => cov.fields[key] && cov.fields[key].value + cov.fields[key].none + cov.fields[key].undecidable > 0);
  const sq4Summary = await page.locator('#frage-root h1 + .denominator--summary').innerText();
  check('the conceptual-grounding page says "Noch nicht codiert" exactly while none of its fields is coded',
    sq4Summary.endsWith('Noch nicht codiert') === !sq4Coded &&
    (sq4Coded || await page.locator('#frage-root .matrix-wrap').count() === 0), { sq4Coded, sq4Summary });
  check('no navigation tab is pressed on an answer page', await page.locator('.nav-view-btn[aria-pressed="true"]').count() === 0);

  // Literaturbild, the evidence-and-gap map of literaturbild.js. The expected counts of
  // the overview (expert categories against publication year, every identified Work)
  // are recomputed here from the corpus file, independently of the module.
  const recordsByWork = new Map();
  vault.papers.forEach((p) => {
    const id = p.work_id || p.id;
    if (!recordsByWork.has(id)) recordsByWork.set(id, []);
    recordsByWork.get(id).push(p);
  });
  const expectedCell = {};
  recordsByWork.forEach((records) => {
    const rep = records.find((p) => p.is_preferred_version) || records[0];
    const year = rep.year ? String(rep.year) : 'oj';
    const cats = new Set();
    let coded = false;
    records.forEach((p) => {
      const h = p.benchmark && p.benchmark.has_human && p.human && p.human.all_categories;
      if (!h) return;
      coded = true;
      Object.keys(h).forEach((key) => { if (h[key] === 1) cats.add(key); });
    });
    if (!coded) return;
    (cats.size ? [...cats] : ['__none']).forEach((cat) => { expectedCell[cat + '|' + year] = (expectedCell[cat + '|' + year] || 0) + 1; });
  });
  const lbCells = () => page.locator('#lb-table button.lb-cell').evaluateAll((cells) =>
    cells.map((cell) => ({ key: cell.dataset.row + '|' + cell.dataset.col, state: cell.dataset.state, count: Number(cell.dataset.count) })));
  await page.goto(`${base}/index.html#view=literaturbild`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#view-literaturbild #lb-table');
  check('Literaturbild shows the evidence-and-gap map',
    await visibleView() === 'view-literaturbild' && await page.locator('#tab-literaturbild[aria-pressed="true"]').count() === 1);
  const overview = await lbCells();
  const wrongCounts = overview.filter((cell) => cell.count !== (expectedCell[cell.key] || 0));
  check('the overview counts Works per expert category and year as the corpus has them',
    overview.length > 0 && wrongCounts.length === 0, JSON.stringify(wrongCounts.slice(0, 3)));
  check('an empty cell is either a marked gap or not determinable, never blank',
    overview.filter((cell) => !cell.count).every((cell) => cell.state === 'gap' || cell.state === 'open') &&
    overview.some((cell) => cell.state === 'gap') && overview.some((cell) => cell.state === 'open'));
  check('gap and n. b. cells differ in form and accessible name', await page.evaluate(() => {
    const gap = document.querySelector('#lb-table button.lb-cell[data-state="gap"]');
    const open = document.querySelector('#lb-table button.lb-cell[data-state="open"]');
    return gap.getAttribute('aria-label').includes('Lücke') && open.getAttribute('aria-label').includes('nicht bestimmbar') &&
      getComputedStyle(gap).backgroundImage.includes('gradient') && getComputedStyle(open).borderTopStyle === 'dotted';
  }));
  check('the active basis shows in its control', await page.locator('#lb-root [data-basis="alle"][aria-pressed="true"]').count() === 1 &&
    (await page.locator('#lb-denom .lb-denom-main').innerText()).includes('identifizierten Werken'));
  const offered = await page.locator('#lb-rows option').evaluateAll((options) => options.map((o) => o.value));
  // an analysis field is offered only where some agent record codes it, and the coding
  // basis and notes never, since they describe the coding rather than the work
  const agentFields = new Set(Object.values(JSON.parse(readFileSync(resolve(docs, 'data', 'screening', 'ar2.json'))).decisions)
    .flatMap((d) => Object.keys((d.analysis && d.analysis.fields) || {})));
  check('only dimensions with coverage are offered, never the coding basis or notes',
    offered.includes('kategorie') && offered.includes('AN_Bias_Axes') && !offered.includes('AN_Coding_Basis') && !offered.includes('AN_Notes') &&
      offered.filter((key) => key.startsWith('AN_')).every((key) => agentFields.has(key)), offered.join());

  await page.locator('#lb-rows').selectOption('AN_Bias_Axes');
  await page.waitForFunction(() => new URLSearchParams(location.hash.slice(1)).get('rows') === 'AN_Bias_Axes');
  check('a dimension switch re-renders the map and writes the hash',
    (await page.locator('#lb-table .lb-corner').innerText()).startsWith('Bias-Achsen') && !hashParams().has('cell'));
  check('AI-coded dimensions are labelled as such in the select and the denominator',
    (await page.locator('#lb-rows option[value="AN_Bias_Axes"]').innerText()).includes('(KI)') &&
    await page.locator('#lb-denom .lb-tag', { hasText: 'KI-codiert' }).count() === 1);
  await page.locator('#lb-root [data-preset="sq2"]').click();
  await page.waitForFunction(() => new URLSearchParams(location.hash.slice(1)).get('cols') === 'AN_Harm_Types');
  check('a sub-question map sets both axes and shows as pressed',
    await page.locator('#lb-root [data-preset="sq2"][aria-pressed="true"]').count() === 1 && hashParams().get('rows') === 'AN_Bias_Axes');

  const valueCell = page.locator('#lb-table button.lb-cell[data-state="value"]').first();
  const lbCount = Number(await valueCell.getAttribute('data-count'));
  await valueCell.click();
  await page.waitForSelector('#lb-detail:not([hidden])');
  const cellUrl = page.url();
  check('a cell lists its contributing Works', hashParams().has('cell') && await page.locator("#lb-detail .lb-item").count() === lbCount);
  check('each listed Work names author and year, decision and text basis and links to Korpus and PRISM', await page.evaluate(() =>
    [...document.querySelectorAll('#lb-detail .lb-item')].every((item) =>
      item.querySelector('.lb-item-title').getAttribute('href').startsWith('#view=korpus&paper=') &&
      item.querySelector('.lb-prism').getAttribute('href').startsWith('prisma.html?paper=') &&
      /(Include|Exclude|Unclear|offen)/.test(item.querySelector('.lb-item-meta').textContent) &&
      /(Volltext|Abstract|kein)/.test(item.querySelector('.lb-item-meta').textContent))));
  check('the selected cell keeps keyboard focus', await page.evaluate(() => document.activeElement.matches('button.lb-cell[aria-pressed="true"]')));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('#lb-detail:not([hidden])');
  check('dimensions and cell survive reload', page.url() === cellUrl && await page.locator('#lb-table button.lb-cell[aria-pressed="true"]').count() === 1);
  await page.goBack({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.getElementById('lb-detail').hidden);
  check('Back closes the work list', !hashParams().has('cell') && hashParams().get('cols') === 'AN_Harm_Types');
  await page.goForward({ waitUntil: 'networkidle' });
  await page.waitForSelector('#lb-detail:not([hidden])');
  check('Forward reopens it', page.url() === cellUrl);

  await page.locator('#lb-root [data-preset="ueberblick"]').click();
  await page.locator('#lb-root [data-basis="include"]').click();
  await page.waitForFunction(() => new URLSearchParams(location.hash.slice(1)).get('basis') === 'include');
  check('the Include basis shows in its control and in the denominator',
    await page.locator('#lb-root [data-basis="include"][aria-pressed="true"]').count() === 1 &&
    (await page.locator('#lb-denom .lb-denom-main').innerText()).includes('eingeschlossenen Werken'));
  const included = await lbCells();
  check('under the Include basis no cell counts more than under all identified Works',
    included.every((cell) => cell.count <= (expectedCell[cell.key] || 0)));
  await page.locator('#lb-table button.lb-cell[data-state="gap"]').first().click();
  await page.waitForSelector('#lb-detail:not([hidden])');
  check('a gap cell opens and states the gap', (await page.locator('#lb-detail .lb-detail-count').innerText()).startsWith('Lücke'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('#lb-detail:not([hidden])');
  check('basis and gap cell survive reload', hashParams().get('basis') === 'include' &&
    await page.locator('#lb-table button.lb-cell[data-state="gap"][aria-pressed="true"]').count() === 1);

  await page.locator('#lb-table button.lb-cell[data-ri="0"][data-ci="0"]').focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowDown');
  check('arrow keys move through the grid', await page.evaluate(() => document.activeElement.dataset.ri === '1' && document.activeElement.dataset.ci === '1'));
  check('one cell is in the tab order', await page.locator('#lb-table button.lb-cell[tabindex="0"]').count() === 1);
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.querySelector('#lb-table button.lb-cell[data-ri="1"][data-ci="1"]').getAttribute('aria-pressed') === 'true');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.getElementById('lb-detail').hidden);
  check('Enter selects a cell and Escape clears it with focus kept in the grid',
    !hashParams().has('cell') && await page.evaluate(() => document.activeElement.matches('button.lb-cell')));

  await page.goto(`${base}/index.html#view=literaturbild&rows=AN_Bias_Axes&cols=AN_Harm_Types`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#lb-table');
  await page.locator('#lb-table button.lb-cell[data-state="value"]').first().click();
  await page.waitForSelector('#lb-detail:not([hidden])');
  const korpusTitle = (await page.locator('#lb-detail .lb-item-title').first().innerText()).trim();
  await page.locator('#lb-detail .lb-item-title').first().click();
  await page.waitForSelector('#paper-modal.active');
  check('a listed Work opens its Korpus detail', await visibleView() === 'view-korpus' &&
    (await page.locator('#modal-title').innerText()).trim() === korpusTitle);
  for (const width of [1440, 1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${base}/index.html#view=literaturbild&cell=Gender%7C2024`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#lb-detail:not([hidden])');
    check(`at ${width} px the map scrolls only inside its own container and the controls fit`, await page.evaluate(() =>
      document.documentElement.scrollWidth <= window.innerWidth + 1 &&
      [...document.querySelectorAll('#lb-root .lb-controls > *')].every((node) => node.getBoundingClientRect().right <= window.innerWidth + 1)));
  }
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto(`${base}/index.html#view=frage&sq=2`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#frage-root .answer[data-sq="2"]');
  const frageCell = page.locator('#frage-root a.matrix-cell').first();
  if (await frageCell.count()) {
    const target = new URLSearchParams((await frageCell.getAttribute('href')).slice(1));
    await frageCell.click();
    await page.waitForSelector('#lb-detail:not([hidden])');
    check('a matrix cell of an answer page opens the same cell in Literaturbild',
      await visibleView() === 'view-literaturbild' && hashParams().get('cell') === target.get('cell'));
    await page.goto(`${base}/index.html#view=frage&sq=2`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#frage-root .answer[data-sq="2"]');
  }
  const workHref = await page.locator('#frage-werke .work-title a').first().getAttribute('href');
  await page.locator('#frage-werke .work-title a').first().click();
  await page.waitForSelector('#werk-root .werk');
  check('the work view opens inside the page', workHref.startsWith('#view=werk&id=') && await visibleView() === 'view-werk');
  check('work categories use the shared chip markup', await page.locator('#werk-root .werk-categories .category-chip[data-cat]').count() > 0);

  // Wissensnetz: the screening categories as a network of joint coding, recomputed here
  // from the working data independently of wissensnetz.js.
  const readOptional = (rel) => (existsSync(resolve(docs, 'data', rel)) ? JSON.parse(readFileSync(resolve(docs, 'data', rel))) : null);
  const assignment = readOptional('screening/assignment.json');
  const corpusById = Object.fromEntries(vault.papers.map((p) => [p.id, p]));
  // Saved human reviewer records of the assigned reviewers: the newest valid record of a
  // known paper replaces the round-one expert decision, as PRISM's paperSubject orders it.
  const reviewerRecords = (files) => {
    const out = {};
    for (const [key, file] of Object.entries(files)) {
      if (!file || !/^femprompt-prisma-reviewer\/0\.[1-5]$/.test(file.schema || '') || file.actor === 'agent') continue;
      for (const [pid, rec] of Object.entries(file.decisions || {})) {
        const paper = corpusById[pid];
        if (!paper || !rec || !['Include', 'Exclude', 'Unclear'].includes(rec.decision)) continue;
        if (rec.work_id && rec.version_id && paper.work_id && paper.version_id &&
          (rec.work_id !== paper.work_id || rec.version_id !== paper.version_id)) continue;
        const ts = String(rec.ts || file.updated || '');
        if (out[pid] && out[pid].ts >= ts) continue;
        const cats = rec.categories && typeof rec.categories === 'object' ? rec.categories : {};
        const categories = Object.keys(cats).filter((c) => [true, 1, 2, '1', '2'].includes(cats[c]));
        out[pid] = { decision: rec.decision, categories, ts, reviewer: key };
      }
    }
    return out;
  };
  const diskRecords = reviewerRecords(Object.fromEntries(assignment.reviewers.map((r) => [r.key, readOptional(`screening/${r.key}.json`)])));
  // The human decision of the Korpus stage table, recomputed independently of korpus-stages.js.
  const humanDecisionOf = (records, p) => (records[p.id] ? records[p.id].decision
    : p.benchmark.has_human && p.human && ['Include', 'Exclude'].includes(p.human.decision) ? p.human.decision : null);

  const catKeys = schema.categories.map((c) => c.key);
  const withDecision = vault.papers.filter((p) => p.human && p.human.decision);
  // The LLM and Übereinstimmung bases read only works with a human decision (ADR-044).
  const llmDone = vault.papers.filter((p) => p.llm && p.llm.assessment_status === 'assessed' && p.llm.all_categories &&
    humanDecisionOf(diskRecords, p) !== null);
  const netCount = (works, side, set) => works.filter((p) => set.every((c) => (side === 'h' ? (p.human.all_categories || {}) : p.llm.all_categories)[c] === 1)).length;
  const pairs = catKeys.flatMap((a, i) => catKeys.slice(i + 1).map((b) => [a, b]));
  const expertPairs = pairs.map((set) => ({ set, n: netCount(withDecision, 'h', set) })).filter((e) => e.n > 0).sort((x, y) => y.n - x.n);
  const nodeText = (cat) => page.locator(`#wn-graph .wn-node[data-sel="${cat}"] .wn-count`).textContent();
  await page.goto(`${base}/index.html#view=wissensnetz`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#wn-graph');
  check('Wissensnetz shows the category network on its tab',
    await page.locator('#tab-wissensnetz[aria-pressed="true"]').count() === 1 && await page.locator('#wn-graph .wn-node').count() === catKeys.length);
  check('every expert node shows the works coded with its category',
    (await Promise.all(catKeys.map(nodeText))).every((text, i) => Number(text) === netCount(withDecision, 'h', [catKeys[i]])));
  check('every co-coded pair of categories is an edge of the figure and a row of the linked table',
    await page.locator('#wn-graph .wn-edge').count() === expertPairs.length && await page.locator('#wn-table .wn-pick').count() === expertPairs.length);
  const widths = await page.locator('#wn-graph .wn-edge').evaluateAll((edges) => edges.map((e) => [e.dataset.sel, Number(e.querySelector('.wn-line').getAttribute('stroke-width'))]));
  const widthOf = Object.fromEntries(widths);
  check('edge thickness grows with the number of works', expertPairs.every((e, i) => i === 0 || widthOf[e.set.join(',')] <= widthOf[expertPairs[i - 1].set.join(',')] + 1e-9) &&
    widthOf[expertPairs[0].set.join(',')] > widthOf[expertPairs[expertPairs.length - 1].set.join(',')], JSON.stringify(widths.slice(0, 5)));
  const layoutOf = () => page.locator('#wn-graph .wn-node circle.wn-hit').evaluateAll((c) => c.map((n) => n.getAttribute('cx') + ',' + n.getAttribute('cy')).join(' '));
  const layoutBefore = await layoutOf();
  const radii = await page.locator('#wn-graph .wn-node .wn-dot').evaluateAll((c) => c.map((n) => Number(n.getAttribute('r'))));
  const nodeCounts = catKeys.map((c) => netCount(withDecision, 'h', [c]));
  check('node size follows the number of works', catKeys.every((_, i) => catKeys.every((__, j) => (nodeCounts[i] <= nodeCounts[j] ? radii[i] <= radii[j] + 1e-9 : true))));
  check('the network carries no standing prose and no middle dot', await page.evaluate(() => {
    const root = document.getElementById('wn-root');
    return !/·/.test(root.textContent) && root.querySelectorAll('p:not(.lk-caption):not(.lk-detail-count):not(.empty-state)').length === 0;
  }));

  const top = expertPairs[0];
  const topSel = top.set.join(',');
  // A curved edge's box centre need not lie on the stroke, and other edges cross it, so the
  // pointer clicks a point of the curve where this edge is the topmost element.
  const edgePoint = await page.evaluate((sel) => {
    const edge = [...document.querySelectorAll('#wn-graph .wn-edge')].find((e) => e.dataset.sel === sel);
    const path = edge.querySelector('.wn-hit');
    for (let t = 0.5; t > 0.05; t -= 0.02) {
      for (const at of [t, 1 - t]) {
        const point = path.getPointAtLength(path.getTotalLength() * at).matrixTransform(path.getScreenCTM());
        const hit = document.elementFromPoint(point.x, point.y);
        if (hit && hit.closest('.wn-edge') === edge) return [point.x, point.y];
      }
    }
    return null;
  }, topSel);
  check('the strongest edge can be reached with the pointer', Boolean(edgePoint));
  await page.mouse.click(edgePoint[0], edgePoint[1]);
  await page.waitForSelector('#wn-detail:not([hidden]) .lk-item');
  const edgeItems = page.locator('#wn-detail .lk-item');
  check('clicking an edge lists the works coded with both categories', await edgeItems.count() === top.n, `${await edgeItems.count()} vs ${top.n}`);
  check('the selected edge states its exact count in the figure', (await page.locator('#wn-graph .wn-pill text').allTextContents()).includes(String(top.n)));
  const itemLinks = await edgeItems.evaluateAll((items) => items.map((item) => [
    item.querySelector('.lk-item-title').getAttribute('href'), item.querySelector('.wn-prism').getAttribute('href'),
    item.querySelector('.lk-dec').textContent]));
  const expectedIds = new Set(withDecision.filter((p) => top.set.every((c) => (p.human.all_categories || {})[c] === 1)).map((p) => p.id));
  check('each listed work links to its Korpus detail and to PRISM and names its decision', itemLinks.every(([korpus, prism, dec]) => {
    const id = decodeURIComponent(korpus.replace('#view=korpus&paper=', ''));
    return expectedIds.has(id) && prism === 'prisma.html?paper=' + encodeURIComponent(id) && /^(Include|Exclude|Unclear)$/.test(dec);
  }), JSON.stringify(itemLinks[0]));
  check('the edge selection stands in the hash', hashParams().get('sel') === topSel && hashParams().get('view') === 'wissensnetz');

  const nodeCat = 'Feministisch';
  await page.locator(`#wn-graph .wn-node[data-sel="${nodeCat}"] .wn-hit`).click();
  await page.waitForFunction((cat) => new URLSearchParams(location.hash.slice(1)).get('sel') === cat, nodeCat);
  check('clicking a node lists the works coded with its category',
    await page.locator('#wn-detail .lk-item').count() === netCount(withDecision, 'h', [nodeCat]));
  check('a selected node restricts the linked table to its connections', await page.locator('#wn-table .wn-pick').count() ===
    expertPairs.filter((e) => e.set.includes(nodeCat)).length);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('#wn-detail:not([hidden])');
  check('the selection survives a reload', await page.locator(`#wn-graph .wn-node[data-sel="${nodeCat}"]`).getAttribute('aria-pressed') === 'true');
  check('the layout is the same after a reload', await layoutOf() === layoutBefore);
  await page.goBack({ waitUntil: 'networkidle' });
  await page.waitForFunction((sel) => new URLSearchParams(location.hash.slice(1)).get('sel') === sel, topSel);
  check('Back restores the previous edge selection', await page.locator(`#wn-graph .wn-edge[data-sel="${topSel}"]`).getAttribute('aria-pressed') === 'true');
  await page.goForward({ waitUntil: 'networkidle' });
  await page.waitForFunction((cat) => new URLSearchParams(location.hash.slice(1)).get('sel') === cat, nodeCat);
  check('Forward restores the node selection', await page.locator(`#wn-graph .wn-node[data-sel="${nodeCat}"]`).getAttribute('aria-pressed') === 'true');

  const bases = await page.locator('#wn-root .wn-bases .lk-lens').evaluateAll((b) => b.map((n) => n.dataset.basis));
  check('the basis switch offers exactly the bases with data',
    bases.join() === ['expert', llmDone.length ? 'llm' : null, llmDone.some((p) => p.human && p.human.decision) ? 'agree' : null].filter(Boolean).join(), bases.join());
  await page.locator('#wn-root .lk-lens[data-basis="llm"]').click();
  await page.waitForFunction(() => new URLSearchParams(location.hash.slice(1)).get('basis') === 'llm');
  check('the LLM basis is labelled and counts the LLM coding', (await page.locator('#wn-caption').innerText()).includes('LLM') &&
    (await Promise.all(catKeys.map(nodeText))).every((text, i) => Number(text) === netCount(llmDone, 'l', [catKeys[i]])));
  check('the selection is kept across the basis switch', hashParams().get('sel') === nodeCat &&
    await page.locator('#wn-detail .lk-item').count() === netCount(llmDone, 'l', [nodeCat]));
  await page.locator('#wn-root .lk-lens[data-basis="agree"]').click();
  await page.waitForFunction(() => new URLSearchParams(location.hash.slice(1)).get('basis') === 'agree');
  const netSides = await page.locator('#wn-detail .lk-item').evaluateAll((items) => items.map((i) => i.dataset.side));
  check('under Übereinstimmung the works name the side that coded them, divergent ones first',
    netSides.length > 0 && netSides.every((s, i) => i === 0 || ['expert', 'llm', 'both'].indexOf(s) >= ['expert', 'llm', 'both'].indexOf(netSides[i - 1])), netSides.join());
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('#wn-graph');
  check('the basis survives a reload', await page.locator('#wn-root .lk-lens[data-basis="agree"]').getAttribute('aria-pressed') === 'true');
  await page.locator('#wn-root .lk-lens[data-basis="expert"]').click();
  await page.waitForFunction(() => !new URLSearchParams(location.hash.slice(1)).get('basis'));

  await page.locator('#wn-scope').selectOption('include');
  await page.waitForFunction(() => new URLSearchParams(location.hash.slice(1)).get('scope') === 'include');
  check('the decision filter narrows the network to included works',
    await page.locator('#wn-detail .lk-item').count() === withDecision.filter((p) => humanDecisionOf(diskRecords, p) === 'Include' && (p.human.all_categories || {})[nodeCat] === 1).length &&
    await page.locator('#wn-detail .lk-dec').evaluateAll((d) => d.every((n) => n.textContent === 'Include')));
  await page.locator('#wn-scope').selectOption('all');
  await page.locator('#wn-min').selectOption('50');
  check('the threshold hides weaker connections', await page.locator('#wn-graph .wn-edge').count() === expertPairs.filter((e) => e.n >= 50).length);
  await page.locator('#wn-min').selectOption('1');

  await page.keyboard.press('Escape');
  check('Escape clears the selection', await page.locator('#wn-detail').isHidden() && !hashParams().get('sel'));
  await page.locator('#wn-graph .wn-item[tabindex="0"]').focus();
  await page.keyboard.press('ArrowRight');
  const focusedSel = await page.evaluate(() => document.activeElement.dataset.sel);
  await page.keyboard.press('Enter');
  check('arrow keys and Enter select an item of the figure', Boolean(focusedSel) && hashParams().get('sel') === focusedSel);
  await page.keyboard.press('Escape');
  const secondSel = expertPairs[1].set.join(',');
  await page.locator(`#wn-table .wn-pick[data-sel="${secondSel}"]`).click();
  check('the linked table selects the same edge as the figure', await page.locator(`#wn-graph .wn-edge[data-sel="${secondSel}"]`).getAttribute('aria-pressed') === 'true' &&
    await page.evaluate(() => document.activeElement.id === 'wn-detail-title'));
  const netWork = page.locator('#wn-detail .lk-item-title').first();
  const netTitle = (await netWork.innerText()).trim();
  await netWork.click();
  await page.waitForSelector('#paper-modal.active');
  check('a work of a connection opens its Korpus detail', await visibleView() === 'view-korpus' && (await page.locator('#modal-title').innerText()).trim() === netTitle);

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${base}/index.html#view=wissensnetz&sel=${encodeURIComponent(secondSel)}`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#wn-detail:not([hidden])');
  check('at 1280 px the selection stands beside the figure without horizontal scrolling', await page.evaluate(() => {
    const fig = document.getElementById('wn-figure').getBoundingClientRect();
    const side = document.querySelector('.wn-side').getBoundingClientRect();
    return side.left >= fig.right - 1 && document.documentElement.scrollWidth <= window.innerWidth + 1;
  }));
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.locator('#wn-root .wn-terms-link').click();
  await page.waitForSelector('#view-begriffsnetz #netz-list');
  check('the Begriffsnetz of the analysis fields opens from the Wissensnetz',
    await visibleView() === 'view-begriffsnetz' && await page.locator('#netz-graph').count() === 1);

  // Open works under the LLM and Übereinstimmung bases (ADR-044): a real open work with a
  // round-one LLM assessment counts in no node and is listed under no selection, until a
  // saved reviewer record decides it. The Entscheidung filter reads that record first.
  {
    const openLlmCats = (p) => (p.llm && p.llm.assessment_status === 'assessed' && p.llm.all_categories && humanDecisionOf(diskRecords, p) === null
      ? catKeys.filter((c) => p.llm.all_categories[c] === 1) : []);
    const openNet = openLlmCats(corpusById.BHXDU7VM || {}).length ? corpusById.BHXDU7VM : vault.papers.find((p) => openLlmCats(p).length);
    check('the corpus holds an open work with LLM categories for the Wissensnetz check', Boolean(openNet));
    console.log('open work checked in the Wissensnetz', openNet.id, openLlmCats(openNet).join(';'));
    const netCat = openLlmCats(openNet)[0];
    const listedIn = async (pg, hash) => {
      await pg.goto('about:blank');
      await pg.goto(`${base}/index.html${hash}`, { waitUntil: 'networkidle' });
      await pg.waitForSelector('#wn-detail:not([hidden])');
      return {
        works: await pg.locator('#wn-detail .lk-item').evaluateAll((items) => items.map((item) => [
          decodeURIComponent(item.querySelector('.lk-item-title').getAttribute('href').split('paper=')[1]), item.querySelector('.lk-dec').textContent])),
        scopes: await pg.locator('#wn-scope option').evaluateAll((o) => o.map((n) => n.value)),
        node: Number(await pg.locator(`#wn-graph .wn-node[data-sel="${netCat}"] .wn-count`).textContent()),
      };
    };
    const own = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'de-AT' });
    const llmView = await listedIn(own, `#view=wissensnetz&basis=llm&sel=${netCat}`);
    check('under the LLM basis an open work is neither counted nor listed and no decision is missing',
      !llmView.works.some(([id]) => id === openNet.id) && llmView.works.length === netCount(llmDone, 'l', [netCat]) &&
      llmView.node === netCount(llmDone, 'l', [netCat]) && !llmView.scopes.includes('none'), JSON.stringify(llmView.scopes));
    const agreeView = await listedIn(own, `#view=wissensnetz&basis=agree&sel=${netCat}`);
    check('under Übereinstimmung an open work is not listed', !agreeView.works.some(([id]) => id === openNet.id) &&
      agreeView.works.length > 0 && !agreeView.scopes.includes('none'));
    await own.close();

    // A reviewer record decides the open work and reverses an expert Include of a work
    // coded with the same category; the decision filter and the lists follow the record.
    const flip = withDecision.find((p) => p.id !== openNet.id && humanDecisionOf(diskRecords, p) === 'Include' && (p.human.all_categories || {})[netCat] === 1);
    const reviewerKey = assignment.reviewers[0].key;
    const bind = (p) => ({ work_id: p.work_id, version_id: p.version_id });
    const fixture = { schema: 'femprompt-prisma-reviewer/0.5', reviewer: reviewerKey, actor: 'human', updated: '2026-10-02T12:00:00.000Z', decisions: {
      [openNet.id]: { ...bind(openNet), decision: 'Include', categories: { [netCat]: 2 }, ts: '2026-10-02T10:00:00.000Z', actor: 'human' },
      [flip.id]: { ...bind(flip), decision: 'Exclude', ts: '2026-10-02T10:01:00.000Z', actor: 'human' },
    } };
    const decidedPage = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'de-AT' });
    await decidedPage.route(/\/data\/screening\/[a-z0-9_-]+\.json$/, (route) => (route.request().url().endsWith(`/${reviewerKey}.json`)
      ? route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fixture) }) : route.fallback()));
    const decidedView = await listedIn(decidedPage, `#view=wissensnetz&basis=llm&sel=${netCat}`);
    check('a reviewer record brings the open work into the LLM basis with its decision',
      decidedView.works.some(([id, dec]) => id === openNet.id && dec === 'Include'), JSON.stringify(decidedView.works.find(([id]) => id === openNet.id)));
    const excluded = await listedIn(decidedPage, `#view=wissensnetz&scope=exclude&sel=${netCat}`);
    const included = await listedIn(decidedPage, `#view=wissensnetz&scope=include&sel=${netCat}`);
    check('the Entscheidung filter reads the reviewer record before the expert decision',
      excluded.works.some(([id, dec]) => id === flip.id && dec === 'Exclude') && !included.works.some(([id]) => id === flip.id) &&
      excluded.works.every(([, dec]) => dec === 'Exclude'), flip.id);
    await decidedPage.close();
  }

  // Landkarte of the Kategorien view: every lens value of every cell and header is
  // recomputed here from the working data, independently of kategorien.js.
  const assessedWorks = vault.papers.filter((p) => p.human && p.human.decision);
  const isCoded = (v) => v === 0 || v === 1;
  const ratio = (part, whole) => (whole ? part / whole : null);
  const lensValue = (lensKey, cats) => {
    const expertSet = assessedWorks.filter((p) => cats.every((c) => (p.human.all_categories || {})[c] === 1));
    if (lensKey === 'werke') return expertSet.length;
    if (lensKey === 'einschluss') return ratio(expertSet.filter((p) => p.human.decision === 'Include').length, expertSet.length);
    if (lensKey === 'aktualitaet') {
      const dated = expertSet.filter((p) => typeof p.year === 'number');
      return ratio(dated.filter((p) => p.year >= 2025).length, dated.length);
    }
    const paired = assessedWorks.filter((p) => p.llm && p.llm.assessment_status === 'assessed' && p.llm.all_categories &&
      cats.every((c) => isCoded((p.human.all_categories || {})[c]) && isCoded(p.llm.all_categories[c])));
    const h = paired.filter((p) => cats.every((c) => p.human.all_categories[c] === 1));
    const l = paired.filter((p) => cats.every((c) => p.llm.all_categories[c] === 1));
    const both = h.filter((p) => l.includes(p)).length;
    return ratio(both, h.length + l.length - both);
  };
  const lensKeys = ['werke', 'einschluss', 'uebereinstimmung', 'aktualitaet'];
  const fmt = (lensKey, v) => (lensKey === 'werke' ? String(v) : `${Math.round(v * 100)} %`);
  const near = (shown, v) => (v === null ? shown === '' : Math.abs(Number(shown) - v) < 1e-3);

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${base}/index.html#view=vergleich`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#landkarte .lk-table');
  const grid = await page.evaluate(() => ({
    rows: [...document.querySelectorAll('#landkarte tbody th.lk-row')].map((n) => n.dataset.cat),
    cols: [...document.querySelectorAll('#landkarte thead th.lk-col')].map((n) => n.dataset.cat),
    cells: document.querySelectorAll('#landkarte tbody td button.lk-cell').length,
  }));
  check('the Landkarte crosses the four Gegenstand rows with the six Perspektive columns',
    grid.rows.join() === schema.groups.object.join() && grid.cols.join() === schema.groups.perspective.join() && grid.cells === 24,
    JSON.stringify(grid));
  check('the Werke lens is active and the detail panel closed before a choice',
    await page.locator('#landkarte .lk-lens[aria-pressed="true"]').getAttribute('data-lens') === 'werke' &&
    await page.locator('#landkarte-detail').isHidden() && !hashParams().has('lens') && !hashParams().has('sel'));
  for (const lensKey of lensKeys) {
    await page.locator(`#landkarte .lk-lens[data-lens="${lensKey}"]`).click();
    const shown = await page.evaluate(() => ({
      cells: [...document.querySelectorAll('#landkarte button.lk-cell')].map((b) => [b.dataset.row, b.dataset.col, b.dataset.value, b.textContent.trim()]),
      heads: [...document.querySelectorAll('#landkarte th[data-cat]')].map((th) => [th.dataset.cat, th.dataset.value]),
      legend: [...document.querySelectorAll('#landkarte-legend .lk-scale-val')].map((n) => n.textContent),
    }));
    const wrongCells = shown.cells.filter(([row, col, value, text]) => {
      const v = lensValue(lensKey, [row, col]);
      return !near(value, v) || text !== (v === null ? '–' : fmt(lensKey, v));
    });
    const wrongHeads = shown.heads.filter(([cat, value]) => !near(value, lensValue(lensKey, [cat])));
    check(`every cell and header value of the lens ${lensKey} recomputes from the working data`,
      wrongCells.length === 0 && wrongHeads.length === 0 && shown.cells.length === 24 && shown.heads.length === 10,
      JSON.stringify(wrongCells.concat(wrongHeads).slice(0, 3)));
    const values = shown.cells.map(([row, col]) => lensValue(lensKey, [row, col])).filter((v) => v !== null);
    check(`the legend of the lens ${lensKey} spans the values the cells reach`,
      shown.legend.join() === [fmt(lensKey, Math.min(...values)), fmt(lensKey, Math.max(...values))].join(), shown.legend.join());
    check(`the lens ${lensKey} is pressed and reaches the hash`,
      await page.locator(`#landkarte .lk-lens[data-lens="${lensKey}"]`).getAttribute('aria-pressed') === 'true' &&
      (lensKey === 'werke' ? !hashParams().has('lens') : hashParams().get('lens') === lensKey));
  }
  await page.locator('#landkarte .lk-lens[data-lens="werke"]').click();

  const firstCell = page.locator('#landkarte button.lk-cell').first();
  await firstCell.click();
  await page.waitForSelector('#landkarte-detail:not([hidden])');
  const cellCount = Number(await firstCell.getAttribute('data-value'));
  const items = await page.evaluate(() => [...document.querySelectorAll('#landkarte-detail .lk-item')].map((li) => ({
    decision: li.dataset.decision, label: li.querySelector('.lk-dec').textContent, href: li.querySelector('a').getAttribute('href'),
    mark: li.querySelector('.lk-mark').textContent,
  })));
  check('a cell click selects it, lists its works and writes the selection into the hash',
    await firstCell.getAttribute('aria-pressed') === 'true' && items.length === cellCount && cellCount > 0 &&
    hashParams().get('sel') === `${schema.groups.object[0]},${schema.groups.perspective[0]}`, `${items.length} / ${cellCount} ${page.url()}`);
  check('listed works link to the Korpus detail and name their decision in text and sign',
    items.every((item) => item.href.startsWith('#view=korpus&paper=') &&
      ({ include: 'Include', exclude: 'Exclude', unclear: 'Unclear' })[item.decision] === item.label &&
      ({ include: '+', exclude: '−', unclear: '?' })[item.decision] === item.mark), JSON.stringify(items.slice(0, 2)));
  check('at 1280 x 800 the map and the detail panel with its first works stand in the first viewport', await page.evaluate(() => {
    const inView = (el) => { const r = el.getBoundingClientRect(); return r.top >= 0 && r.bottom <= window.innerHeight && r.width > 0; };
    return window.scrollY === 0 && inView(document.querySelector('#landkarte .lk-table')) && inView(document.querySelector('#landkarte .lk-lenses')) &&
      inView(document.getElementById('landkarte-legend')) && inView(document.getElementById('landkarte-detail-title')) &&
      inView(document.querySelector('#landkarte-detail .lk-item'));
  }));
  check('no LLM reasoning stands in the panel before it is asked for',
    await page.locator('#landkarte-detail .lk-reason:visible').count() === 0 && await page.locator('#landkarte-detail .lk-why').count() > 0);
  await page.locator('#landkarte-detail .lk-why').nth(0).click();
  await page.locator('#landkarte-detail .lk-why').nth(1).click();
  check('the LLM reasoning opens for one work at a time',
    await page.locator('#landkarte-detail .lk-reason:visible').count() === 1 &&
    await page.locator('#landkarte-detail .lk-why').nth(1).getAttribute('aria-expanded') === 'true' &&
    await page.locator('#landkarte-detail .lk-why').nth(0).getAttribute('aria-expanded') === 'false');
  await firstCell.click();
  check('a second click on the chosen cell clears the selection',
    await firstCell.getAttribute('aria-pressed') === 'false' && await page.locator('#landkarte-detail').isHidden() && !hashParams().has('sel'));

  // A header selects its category alone; its expert and LLM rates are the canonical
  // per-category rates of the round-one comparison.
  const genderHead = page.locator('#landkarte th.lk-col[data-cat="Gender"] .category-chip');
  await genderHead.click();
  await page.waitForSelector('#landkarte-detail:not([hidden])');
  const kappa = vault.kappa_by_category.Gender;
  const rates = await page.locator('#landkarte-detail .lk-cmp-val').allInnerTexts();
  check('a column header selects its category alone with the canonical expert and LLM rates',
    await genderHead.getAttribute('aria-pressed') === 'true' && hashParams().get('sel') === 'Gender' &&
    await page.locator('#landkarte-detail-title .category-chip').count() === 1 &&
    await page.locator('#landkarte-detail .lk-item').count() === lensValue('werke', ['Gender']) &&
    rates.join() === [`${Math.round(kappa.human_yes_rate)} %`, `${Math.round(kappa.agent_yes_rate)} %`].join(), rates.join());
  await page.locator('#landkarte th.lk-row[data-cat="Prompting"] .category-chip').click();
  check('a row header selects its category alone', hashParams().get('sel') === 'Prompting' &&
    await page.locator('#landkarte th.lk-row[data-cat="Prompting"] .category-chip').getAttribute('aria-pressed') === 'true' &&
    await genderHead.getAttribute('aria-pressed') === 'false');

  await page.locator('#landkarte .lk-lens[data-lens="uebereinstimmung"]').click();
  await page.locator('#landkarte button.lk-cell[data-row="Generative_KI"][data-col="Gender"]').click();
  const sides = await page.evaluate(() => [...document.querySelectorAll('#landkarte-detail .lk-item')].map((li) => [li.dataset.side, li.querySelector('.lk-side [aria-hidden]').textContent]));
  const order = { expert: 0, llm: 1, both: 2 };
  check('under Übereinstimmung the panel lists divergent works first, each marked H, L or H+L',
    sides.length > 0 && sides.every(([side, mark], i) => mark === ({ expert: 'H', llm: 'L', both: 'H+L' })[side] &&
      (i === 0 || order[sides[i - 1][0]] <= order[side])) && sides.some(([side]) => side !== 'both'), JSON.stringify(sides.slice(0, 3)));
  await page.locator('#landkarte button.lk-cell[data-row="Generative_KI"][data-col="Gender"]').hover();
  check('hovering a cell crosses its row and column headers', await page.evaluate(() =>
    document.querySelector('#landkarte th.lk-row[data-cat="Generative_KI"]').classList.contains('is-cross') &&
    document.querySelector('#landkarte th.lk-col[data-cat="Gender"]').classList.contains('is-cross') &&
    !document.querySelector('#landkarte th.lk-col[data-cat="Fairness"]').classList.contains('is-cross')));
  check('the cell tooltip names the counts behind the agreement',
    /Expert:innen \d+, LLM \d+, beide \d+/.test(await page.locator('.lk-tip').innerText()));

  await page.goto(`${base}/about.html`, { waitUntil: 'networkidle' });
  await page.goto(`${base}/index.html#view=vergleich&lens=aktualitaet&sel=Prompting%2CGender`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#landkarte-detail:not([hidden])');
  check('a link with lens and selection restores both',
    await page.locator('#landkarte .lk-lens[data-lens="aktualitaet"]').getAttribute('aria-pressed') === 'true' &&
    await page.locator('#landkarte button.lk-cell[data-row="Prompting"][data-col="Gender"]').getAttribute('aria-pressed') === 'true');
  await page.locator('#landkarte button.lk-cell[data-row="KI_Sonstige"][data-col="Fairness"]').click();
  await page.goBack();
  await page.waitForTimeout(150);
  check('Back restores the previous selection',
    hashParams().get('sel') === 'Prompting,Gender' &&
    await page.locator('#landkarte button.lk-cell[data-row="Prompting"][data-col="Gender"]').getAttribute('aria-pressed') === 'true' &&
    await page.locator('#landkarte button.lk-cell[aria-pressed="true"]').count() === 1, page.url());
  await page.goto(`${base}/index.html#view=vergleich&lens=bogus&sel=Gender%2CPrompting`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(150);
  check('an unknown lens or selection in the hash falls back and is dropped from it',
    await page.locator('#landkarte .lk-lens[aria-pressed="true"]').getAttribute('data-lens') === 'werke' &&
    await page.locator('#landkarte-detail').isHidden() && !hashParams().has('lens') && !hashParams().has('sel'), page.url());

  const keyCell = page.locator('#landkarte button.lk-cell').nth(7);
  await page.keyboard.press('Tab');
  await keyCell.focus();
  check('the tooltip of a cell shows on keyboard focus', await page.locator('.lk-tip').isVisible());
  await page.keyboard.press('Escape');
  check('Escape hides the cell tooltip', await page.locator('.lk-tip').isHidden());
  await page.keyboard.press('ArrowRight');
  const nextCell = page.locator('#landkarte button.lk-cell').nth(8);
  check('arrow keys move the focus across the cells', await nextCell.evaluate((el) => el === document.activeElement));
  await page.keyboard.press('Enter');
  await page.waitForSelector('#landkarte-detail:not([hidden])');
  check('a cell is selected by keyboard', await nextCell.getAttribute('aria-pressed') === 'true' &&
    await page.locator('#landkarte .lk-cell[aria-pressed="true"]').count() === 1);
  await page.locator('#landkarte .lk-lens[data-lens="einschluss"]').focus();
  await page.keyboard.press('Space');
  check('a lens is switched by keyboard', await page.locator('#landkarte .lk-lens[data-lens="einschluss"]').getAttribute('aria-pressed') === 'true' &&
    hashParams().get('lens') === 'einschluss');
  check('the lens transition runs on the cell fill', await nextCell.evaluate((el) => parseFloat(getComputedStyle(el).transitionDuration) > 0));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  check('reduced motion switches the lens transition off', await nextCell.evaluate((el) =>
    getComputedStyle(el).transitionDuration.split(',').every((d) => parseFloat(d) === 0)));
  await page.emulateMedia({ reducedMotion: null });
  const workLink = page.locator('#landkarte-detail .lk-item a').first();
  const workTitle = (await workLink.innerText()).trim();
  await workLink.click();
  await page.waitForSelector('#paper-modal.active');
  check('a listed work opens its Korpus detail', await visibleView() === 'view-korpus' &&
    (await page.locator('#modal-title').innerText()).trim() === workTitle);
  await page.setViewportSize({ width: 1440, height: 900 });

  for (const [hash, view] of [['#chat', 'view-chat'], ['#wissensnetz', 'view-wissensnetz'], ['#literaturbild', 'view-literaturbild'],
    ['#korpus', 'view-korpus'], ['#vergleich', 'view-vergleich']]) {
    await page.goto(`${base}/about.html`, { waitUntil: 'networkidle' });
    await page.goto(`${base}/index.html${hash}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(150);
    check(`legacy hash ${hash} opens its view`, await visibleView() === view);
  }

  await page.goto(`${base}/index.html#view=korpus`, { waitUntil: 'networkidle' });
  const chip = page.locator('#category-chips .category-chip').first();
  await chip.click();
  check('a corpus category chip toggles through aria-pressed', await chip.getAttribute('aria-pressed') === 'true');
  await chip.click();

  // The year histogram is the year filter of the corpus; expectations come from the data the view loads.
  const corpus = JSON.parse(readFileSync(resolve(docs, 'data', 'research_vault_v2.json'))).papers;
  const yearOf = (paper) => (Number.isFinite(parseInt(paper.year, 10)) ? String(parseInt(paper.year, 10)) : 'oj');
  const years = corpus.map(yearOf).filter((key) => key !== 'oj').map(Number);
  const expectedColumns = Math.max(...years) - Math.min(...years) + 1 + (corpus.some((paper) => yearOf(paper) === 'oj') ? 1 : 0);
  const werke = (n) => (n === 1 ? '1 Werk' : `${n} Werke`);
  const tableYears = () => page.$$eval('#papers-grid td.col-year', (cells) => [...new Set(cells.map((cell) => cell.textContent))]);
  const resultCount = async () => Number(await page.locator('#results-count').innerText());
  const n2024 = corpus.filter((paper) => yearOf(paper) === '2024').length;
  const col2024 = page.locator('#year-hist .year-col[data-year="2024"]');
  check('the year histogram renders one column per year of the corpus and one for works without a year',
    await page.locator('#year-hist .year-col').count() === expectedColumns &&
    await page.locator('#year-hist .year-col[data-year="oj"] .year-label').innerText() === 'o. J.');
  check('a year column is named by year and count', await col2024.getAttribute('aria-label') === `2024, ${werke(n2024)}`);
  await col2024.click();
  check('clicking a year filters the table to that year',
    await col2024.getAttribute('aria-pressed') === 'true' && await resultCount() === n2024 &&
    JSON.stringify(await tableYears()) === '["2024"]' && hashParams().get('year') === '2024');
  check('the year tooltip lists the counts per status', /^2024, \d+ Werke/.test(await page.locator('#year-tip').innerText()) &&
    await page.locator('#year-tip li').count() === 3);
  await col2024.click();
  check('clicking the year again clears the filter',
    await col2024.getAttribute('aria-pressed') === 'false' && await resultCount() === corpus.length && !hashParams().has('year'));
  await page.locator('#year-hist .year-col[data-year="2023"]').click();
  await col2024.click({ modifiers: ['Shift'] });
  const n2023to2024 = corpus.filter((paper) => ['2023', '2024'].includes(yearOf(paper))).length;
  check('shift+click extends the selection to a year range',
    hashParams().get('year') === '2023-2024' && await resultCount() === n2023to2024 &&
    (await tableYears()).every((year) => year === '2023' || year === '2024'),
    `${hashParams().get('year')} ${await resultCount()}/${n2023to2024}`);
  await page.locator('#year-hist .year-col[data-year="2023"]').click();
  await page.locator('#year-hist .year-col[data-year="2023"]').click();
  // The Expert:innen filter reads the data alone; the LLM filter depends on the human
  // decision of the stage table and is checked with it below.
  await page.locator('#filter-human').selectOption('has_human');
  const included2024 = corpus.filter((paper) => paper.benchmark.has_human && yearOf(paper) === '2024').length;
  check('the histogram counts the selection of the other filters', await col2024.getAttribute('aria-label') === `2024, ${werke(included2024)}`);
  await col2024.click();
  check('the year filter combines with the other filters',
    await resultCount() === included2024 && hashParams().get('hum') === 'has_human' && hashParams().get('year') === '2024');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('#year-hist .year-col');
  check('a year selection survives reload', await col2024.getAttribute('aria-pressed') === 'true' && await resultCount() === included2024);
  await col2024.click();
  await page.locator('#filter-human').selectOption('all');
  const n2025 = corpus.filter((paper) => yearOf(paper) === '2025').length;
  await page.locator('#year-hist .year-col[data-year="2025"]').focus();
  check('keyboard focus shows the year tooltip', await page.locator('#year-tip').isVisible());
  await page.keyboard.press('Enter');
  check('Enter on a focused year filters and keeps the focus',
    await resultCount() === n2025 && await page.evaluate(() => document.activeElement.dataset.year === '2025'));
  await page.keyboard.press('Space');
  check('Space on the selected year clears the filter', await resultCount() === corpus.length);
  await page.goto(`${base}/index.html#view=korpus&year=bogus`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#year-hist .year-col');
  check('an invalid year parameter is no filter',
    await page.locator('#year-hist .year-col[aria-pressed="true"]').count() === 0 && await resultCount() === corpus.length);

  // Review stages, recomputed here from the files the view reads: the reading-layer
  // manifest, the agent track's analysis blocks, the Assertions and the assignment.
  const manifest = readOptional('fulltext_manifest.json');
  const workOfRecord = Object.fromEntries(corpus.map((p) => [p.id, p.work_id]));
  const codedWorks = new Set(Object.entries(readOptional('screening/ar2.json').decisions)
    .filter(([, d]) => d.analysis && d.analysis.fields && Object.keys(d.analysis.fields).length)
    .map(([id, d]) => workOfRecord[id] || d.work_id));
  const claimWorks = {};
  const claimItems = hasWorking
    ? JSON.parse(readFileSync(workingPath)).assertions.map((a) => [a.id, a.works])
    : released.map((a) => [a.id, a.evidence]);
  for (const [id, refs] of claimItems) for (const ref of refs) {
    const work = workOfRecord[ref.record_id] || ref.work_id;
    (claimWorks[work] = claimWorks[work] || new Set()).add(id);
  }
  const textOf = (p) => (manifest ? Boolean(manifest[p.id] && manifest[p.id].src !== 'none') : null);
  const claimsOf = (p) => (claimWorks[p.work_id] ? claimWorks[p.work_id].size : 0);
  const SCREENING_KEYS = ['all', ...(manifest ? ['text'] : []), 'bewertet', 'eingeschlossen'];
  const AUSWERTUNG_KEYS = ['kodiert', 'aussagen'];
  const SUB_KEYS = ['kodiert-eingeschlossen', 'aussagen-eingeschlossen'];
  const rulesFor = (records) => {
    const decisionOf = (p) => humanDecisionOf(records, p);
    const rules = {
      all: () => true,
      text: (p) => textOf(p) === true,
      bewertet: (p) => decisionOf(p) !== null,
      eingeschlossen: (p) => decisionOf(p) === 'Include',
      kodiert: (p) => codedWorks.has(p.work_id),
      aussagen: (p) => claimsOf(p) > 0,
      'kodiert-eingeschlossen': (p) => codedWorks.has(p.work_id) && decisionOf(p) === 'Include',
      'aussagen-eingeschlossen': (p) => claimsOf(p) > 0 && decisionOf(p) === 'Include',
      'ohne-text': (p) => textOf(p) === false,
      offen: (p) => decisionOf(p) === null,
      'nicht-kodiert': (p) => decisionOf(p) === 'Include' && !codedWorks.has(p.work_id),
      'ohne-aussage': (p) => decisionOf(p) === 'Include' && claimsOf(p) === 0,
    };
    if (!manifest) { delete rules.text; delete rules['ohne-text']; }
    for (const r of assignment.reviewers) {
      rules['offen-' + r.key] = (p) => decisionOf(p) === null && assignment.assignments[p.id] === r.key;
    }
    // The categories of that human decision; an open work has none (ADR-044).
    const catsOf = (p) => (records[p.id] ? records[p.id].categories
      : decisionOf(p) ? Object.keys(p.human.all_categories || {}).filter((c) => p.human.all_categories[c] === 1) : []);
    return { rules, decisionOf, catsOf };
  };
  const { rules: stageRules, decisionOf, catsOf } = rulesFor(diskRecords);
  const countsBy = (rules, papers) => Object.fromEntries(Object.entries(rules).map(([key, rule]) => [key, papers.filter(rule).length]));
  const expectedCounts = (papers) => countsBy(stageRules, papers);
  // The figures of this run, for the report.
  console.log('stage counts', JSON.stringify(expectedCounts(corpus)));
  const shownCounts = () => page.$$eval('#view-korpus button[data-stage]', (buttons) =>
    Object.fromEntries(buttons.map((b) => [b.dataset.stage, Number(b.querySelector('.stage-n').textContent)])));
  const sameCounts = (a, b) => JSON.stringify(Object.keys(a).sort().map((k) => [k, a[k]])) === JSON.stringify(Object.keys(b).sort().map((k) => [k, b[k]]));

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${base}/index.html#view=korpus`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#papers-grid tr[data-idx]');
  const workbench = await page.evaluate(() => {
    const rect = (sel) => document.querySelector(sel).getBoundingClientRect();
    return {
      side: rect('.korpus-side'), main: rect('.korpus-main'), head: rect('.papers-table thead'),
      row: rect('#papers-grid tr[data-idx]'), sticky: getComputedStyle(document.querySelector('.korpus-side')).position,
      sideHolds: ['#search-box', '#gap-list', '#year-hist', '#category-chips', '#filter-decision', '#filter-human', '#sort-by']
        .every((sel) => document.querySelector('.korpus-side').contains(document.querySelector(sel))),
      bar: document.querySelector('.korpus-main').firstElementChild.id,
      labels: [...document.querySelectorAll('.korpus-side .filter-label, .korpus-side-h')].map((n) => getComputedStyle(n).textTransform),
    };
  });
  check('at 1280x800 the filters stand in a sticky sidebar beside the table',
    workbench.sideHolds && workbench.sticky === 'sticky' && workbench.side.right <= workbench.main.left && workbench.bar === 'stage-bar', JSON.stringify(workbench));
  check('at 1280x800 the table header and first row lie within the first viewport',
    workbench.head.top < 800 && workbench.row.bottom <= 800, JSON.stringify({ head: workbench.head.top, row: workbench.row.bottom }));
  mkdirSync(resolve(here, 'out', 'companion'), { recursive: true });
  // The hash navigation keeps the document, so focus and year tooltip of the earlier steps remain.
  await page.mouse.move(1270, 790);
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  await page.keyboard.press('Escape');
  await page.screenshot({ path: resolve(here, 'out', 'companion', 'korpus-1280x800.png') });
  check('sidebar labels are set in normal case', workbench.labels.length >= 5 && workbench.labels.every((t) => t === 'none'), workbench.labels.join());
  check('the stage bar and work lists count the stages recomputed from the data',
    sameCounts(await shownCounts(), expectedCounts(corpus)), JSON.stringify({ shown: await shownCounts(), expected: expectedCounts(corpus) }));
  const bars = await page.$$eval('#stage-bar .stage-group', (groups) => groups.map((g) => ({
    label: document.getElementById(g.getAttribute('aria-labelledby')).textContent,
    main: [...g.querySelectorAll('.stage-btn')].map((b) => b.dataset.stage),
    sub: [...g.querySelectorAll('.stage-sub')].map((b) => b.dataset.stage),
    arrows: [...g.querySelectorAll('li')].some((li) => getComputedStyle(li, '::before').content !== 'none'),
  })));
  check('two stage bars, Screening and Auswertung, without funnel arrows',
    bars.length === 2 && bars[0].label === 'Screening' && bars[0].main.join() === SCREENING_KEYS.join() && bars[0].sub.length === 0 &&
    bars[1].label === 'Auswertung' && bars[1].main.join() === AUSWERTUNG_KEYS.join() && bars[1].sub.join() === SUB_KEYS.join() &&
    bars.every((b) => !b.arrows), JSON.stringify(bars));
  const subForm = await page.evaluate(() => {
    const main = document.querySelector('#stage-bar .stage-btn[data-stage="kodiert"]');
    const sub = document.querySelector('#stage-bar .stage-sub[data-stage="kodiert-eingeschlossen"]');
    return { text: sub.textContent.trim(), label: sub.getAttribute('aria-label'),
      mainSize: parseFloat(getComputedStyle(main).fontSize), subSize: parseFloat(getComputedStyle(sub).fontSize),
      subBorder: getComputedStyle(sub).borderTopColor, mainBorder: getComputedStyle(main).borderTopColor,
      sameItem: main.parentElement === sub.parentElement };
  });
  const kodEin = expectedCounts(corpus)['kodiert-eingeschlossen'];
  check('the included subset of an Auswertung stage is subordinate in size and wording',
    subForm.sameItem && subForm.text === `davon ${kodEin} eingeschlossen` && subForm.subSize < subForm.mainSize &&
    subForm.label === `kodiert, davon eingeschlossen, ${werke(kodEin)}`, JSON.stringify(subForm));

  // Default sort "nach Stand": the furthest work first, then the newer year.
  const depthOf = (p) => (textOf(p) ? 1 : 0) + (decisionOf(p) ? 1 : 0) + (decisionOf(p) === 'Include' ? 1 : 0) +
    (codedWorks.has(p.work_id) ? 1 : 0) + (claimsOf(p) ? 1 : 0);
  const shownOrder = await page.$$eval('#papers-grid tr[data-id]', (rows) => rows.map((row) => row.dataset.id));
  const keyOf = (p) => [depthOf(p), parseInt(p.year, 10) || 0];
  const ordered = shownOrder.every((id, i) => {
    if (!i) return true;
    const [d0, y0] = keyOf(corpusById[shownOrder[i - 1]]);
    const [d1, y1] = keyOf(corpusById[id]);
    return d0 > d1 || (d0 === d1 && y0 >= y1);
  });
  const maxDepth = Math.max(...corpus.map(depthOf));
  check('the table opens sorted nach Stand, the furthest works first',
    await page.locator('#sort-by').inputValue() === 'stage' && !hashParams().has('sort') && ordered &&
    depthOf(corpusById[shownOrder[0]]) === maxDepth &&
    (await page.locator('#sort-by option').first().textContent()) === 'nach Stand', shownOrder.slice(0, 5).join());
  await page.locator('#sort-by').selectOption('relevance');
  check('another sort is written to the hash', hashParams().get('sort') === 'relevance');
  await page.locator('#sort-by').selectOption('stage');
  check('the default sort leaves the hash clean', !hashParams().has('sort'));

  await page.locator('#filter-decision').selectOption('Include');
  const llmIncluded = corpus.filter((p) => decisionOf(p) !== null && p.llm.decision === 'Include');
  check('the stage counts follow the other filters', sameCounts(await shownCounts(), expectedCounts(llmIncluded)));
  await page.locator('#filter-decision').selectOption('all');

  // No AI pre-assessment for open works (ADR-044): the reviewers may open the Korpus, so a
  // real open work with a round-one LLM assessment shows none of it in its row, panel,
  // filters, sort or exports, while decided works keep the LLM side for the comparison.
  {
    const parseCsv = (text) => {
      const rows = []; let row = []; let field = ''; let quoted = false;
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (quoted) {
          if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; } else if (ch === '"') quoted = false; else field += ch;
        } else if (ch === '"') quoted = true;
        else if (ch === ',') { row.push(field); field = ''; } else if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; } else field += ch;
      }
      if (field || row.length) { row.push(field); rows.push(row); }
      const [head, ...body] = rows;
      return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
    };
    const exportCsv = async () => {
      const [download] = await Promise.all([page.waitForEvent('download'), page.locator('.export-button', { hasText: 'CSV' }).click()]);
      return parseCsv(readFileSync(await download.path(), 'utf8'));
    };
    const openLlm = corpus.find((p) => decisionOf(p) === null && p.llm.decision && p.llm.categories.length);
    check('the corpus holds an open work with a round-one LLM assessment for the check', Boolean(openLlm));
    console.log('open work checked for LLM output', openLlm.id, openLlm.llm.decision, openLlm.llm.categories.join(';'));

    await page.goto(`${base}/index.html#view=korpus&paper=${encodeURIComponent(openLlm.id)}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#paper-modal.active');
    const panel = await page.evaluate(() => ({
      headers: [...document.querySelectorAll('#modal-body .panel-header')].map((n) => n.textContent),
      chips: [...document.querySelectorAll('#modal-body .assessment-categories .category-chip')].map((n) => n.dataset.cat),
      text: document.getElementById('modal-body').textContent,
    }));
    check('the panel of an open work shows no LLM decision, category or reasoning',
      !panel.headers.some((h) => h.startsWith('LLM')) && panel.chips.length === 0 &&
      !(openLlm.llm.reasoning && panel.text.includes(openLlm.llm.reasoning.slice(0, 60))), JSON.stringify(panel.headers));

    await page.locator('#search-box').fill(openLlm.title);
    const row = page.locator(`#papers-grid tr[data-id="${openLlm.id}"]`);
    await row.waitFor();
    check('the row of an open work shows no category dots', await row.locator('.cat-dot-color').count() === 0);
    const csvOpen = (await exportCsv()).find((r) => r.ID === openLlm.id);
    check('the CSV export leaves the LLM columns of an open work empty',
      Boolean(csvOpen) && csvOpen.LLM_Decision === '' && csvOpen.LLM_Categories === '' && csvOpen.Agreement === '' && csvOpen.Screening_Decision === '',
      JSON.stringify(csvOpen));
    for (const value of ['Include', 'Exclude']) {
      await page.locator('#filter-decision').selectOption(value);
      const listed = await page.$$eval('#papers-grid tr[data-id]', (rows) => rows.map((tr) => tr.dataset.id));
      check(`the LLM filter ${value} never lists the open work`, !listed.includes(openLlm.id), listed.join());
    }
    await page.locator('#filter-decision').selectOption('all');
    await page.locator('#search-box').fill('');

    for (const value of ['Include', 'Exclude']) {
      await page.locator('#filter-decision').selectOption(value);
      const ids = (await exportCsv()).map((r) => r.ID);
      const want = corpus.filter((p) => decisionOf(p) !== null && p.llm.decision === value);
      check(`the LLM filter ${value} lists exactly the decided works with that LLM decision`,
        ids.length === want.length && ids.every((id) => decisionOf(corpusById[id]) !== null && corpusById[id].llm.decision === value),
        `${ids.length}/${want.length}`);
    }
    await page.locator('#filter-decision').selectOption('all');
    await page.locator('#sort-by').selectOption('relevance');
    const sorted = (await exportCsv()).map((r) => corpusById[r.ID]);
    const rank = (p) => (decisionOf(p) !== null && p.llm.decision === 'Include' ? 0 : 1);
    check('LLM-Include zuerst ranks only decided works by their LLM decision, an open work as without one',
      sorted.length === corpus.length && sorted.every((p, i) => !i || rank(sorted[i - 1]) <= rank(p)) &&
      sorted.findIndex((p) => p.id === openLlm.id) >= sorted.filter((p) => rank(p) === 0).length);
    await page.locator('#sort-by').selectOption('stage');

    const dots = await page.$$eval('#papers-grid tr[data-id]', (rows) => rows.map((tr) => [tr.dataset.id,
      tr.querySelectorAll('.cat-dot-color').length, [...tr.querySelectorAll('.cat-dot-color')].filter((d) => d.title.endsWith(': Ja')).length]));
    const badDots = dots.filter(([id, all, on]) => (decisionOf(corpusById[id]) === null ? all !== 0
      : all !== schema.categories.length || on !== catsOf(corpusById[id]).length));
    check('the category dots show the human categories and none for an open work', dots.length > 0 && badDots.length === 0, JSON.stringify(badDots.slice(0, 3)));
    await page.locator('#gap-list button[data-stage="offen"]').click();
    check('the open work list offers no category chips', await page.locator('#category-chips .category-chip').count() === 0);
    await page.locator('#gap-list button[data-stage="offen"]').click();
  }

  // A knowledge document carries the round-one LLM decision and categories in its
  // frontmatter and assessment sections, so the Korpus offers none for an open work: no
  // panel download, and the Markdown and Vault exports leave its document out, also where
  // a decided record of the same Work shares it.
  const openDocs = new Set(corpus.filter((p) => p.knowledge_doc && decisionOf(p) === null).map((p) => p.knowledge_doc));
  const docShown = (p) => Boolean(p.knowledge_doc) && !openDocs.has(p.knowledge_doc);
  {
    const openDoc = ['UKKQKL7I', '8MRNK6FX', 'SSF5Q33W'].map((id) => corpusById[id]).find((p) => p && p.knowledge_doc && decisionOf(p) === null) ||
      corpus.find((p) => p.knowledge_doc && decisionOf(p) === null);
    const decidedDoc = corpus.find(docShown);
    check('the corpus holds an open and a decided work with a knowledge document for the check', Boolean(openDoc && decidedDoc));
    console.log('open work checked for its knowledge document', openDoc.id, openDoc.knowledge_doc);
    const docLinks = async (p) => {
      await page.goto(`${base}/index.html#view=korpus&paper=${encodeURIComponent(p.id)}`, { waitUntil: 'networkidle' });
      await page.waitForSelector('#paper-modal.active');
      return page.locator('#modal-body [data-action="download-doc"]').count();
    };
    check('the panel of an open work offers no knowledge-document download', await docLinks(openDoc) === 0);
    check('the panel of an open work has no Wissen tab and no distillate summary',
      await page.locator('#modal-body [data-detail-tab="wissen"]').count() === 0 &&
      await page.locator('#modal-body .kd-section').count() === 0);
    check('the panel of a decided work offers its knowledge document', await docLinks(decidedDoc) > 0);
    await page.goto(`${base}/index.html#view=korpus`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#papers-grid tr[data-id]');
    const shown = corpus.filter(docShown);
    const shownIds = shown.map((p) => p.id).sort().join();
    const [mdDownload] = await Promise.all([page.waitForEvent('download'), page.locator('.export-button', { hasText: 'Markdown' }).click()]);
    const mdRecords = [...readFileSync(await mdDownload.path(), 'utf8').matchAll(/\*\*Record:\*\* (\S+)/g)].map((m) => m[1]);
    check('the Markdown export of the corpus leaves out the knowledge documents of open works',
      mdRecords.slice().sort().join() === shownIds && !mdRecords.includes(openDoc.id), `${mdRecords.length}/${shown.length}`);
    // The archive is written without compression, so its entries are read in sequence.
    const unzipStored = (buf) => {
      const out = {};
      for (let o = 0; buf.readUInt32LE(o) === 0x04034b50;) {
        const size = buf.readUInt32LE(o + 18); const n = buf.readUInt16LE(o + 26); const extra = buf.readUInt16LE(o + 28);
        out[buf.toString('utf8', o + 30, o + 30 + n)] = buf.subarray(o + 30 + n + extra, o + 30 + n + extra + size);
        o += 30 + n + extra + size;
      }
      return out;
    };
    const [zipDownload] = await Promise.all([page.waitForEvent('download'), page.locator('.export-button', { hasText: 'Vault' }).click()]);
    const zip = unzipStored(readFileSync(await zipDownload.path()));
    const zipIndex = JSON.parse(zip['record-index.json'] || '[]');
    const notes = Object.keys(zip).filter((name) => name.startsWith('Papers/'));
    check('the Vault export of the corpus leaves out the knowledge documents of open works',
      zipIndex.map((e) => e.record_id).sort().join() === shownIds && notes.length === new Set(shown.map((p) => p.knowledge_doc)).size &&
      !notes.includes('Papers/' + openDoc.knowledge_doc.split('/').pop()), `${zipIndex.length}/${shown.length}, ${notes.length} notes`);
    await page.goto(`${base}/index.html#view=korpus`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#papers-grid tr[data-id]');
  }

  const gapKeys = Object.keys(stageRules).filter((key) => ![...SCREENING_KEYS, 'text', ...AUSWERTUNG_KEYS, ...SUB_KEYS].includes(key));
  check('the work lists offer every gap and the open split by reviewer',
    (await page.$$eval('#gap-list button', (b) => b.map((x) => x.dataset.stage))).sort().join() === gapKeys.sort().join());
  for (const key of [...gapKeys, ...AUSWERTUNG_KEYS, ...SUB_KEYS]) {
    await page.locator(`#view-korpus button[data-stage="${key}"]`).click();
    const ids = await page.$$eval('#papers-grid tr[data-id]', (rows) => rows.map((row) => row.dataset.id));
    const expectedIds = corpus.filter(stageRules[key]);
    check(`the filter ${key} lists exactly its works`,
      await resultCount() === expectedIds.length && hashParams().get('stage') === key &&
      await page.locator(`#view-korpus button[data-stage="${key}"]`).getAttribute('aria-pressed') === 'true' &&
      ids.every((id) => stageRules[key](corpus.find((p) => p.id === id))),
      `${await resultCount()}/${expectedIds.length}`);
    await page.locator(`#view-korpus button[data-stage="${key}"]`).click();
  }
  check('pressing the active stage again clears it', await resultCount() === corpus.length && !hashParams().has('stage'));

  const exportKey = 'ohne-aussage';
  await page.locator(`#gap-list button[data-stage="${exportKey}"]`).click();
  const exportN = corpus.filter(stageRules[exportKey]).length;
  const [csvDownload] = await Promise.all([page.waitForEvent('download'), page.locator('.export-button', { hasText: 'CSV' }).click()]);
  const csvText = readFileSync(await csvDownload.path(), 'utf8');
  const csvRows = csvText.split('\n').filter(Boolean);
  check('the CSV export writes the filtered work list with its stage columns',
    csvDownload.suggestedFilename() === `fem_prompt_korpus_${exportKey}.csv` && csvRows.length === exportN + 1 &&
    csvRows[0].includes('"Coded"') && csvRows[0].includes('"Assertions"') && csvRows[0].includes('"Screening_Source"'), `${csvRows.length - 1}/${exportN}`);
  const docsOf = new Set(corpus.filter(stageRules[exportKey]).filter(docShown).map((p) => p.knowledge_doc));
  const [zipDownload] = await Promise.all([page.waitForEvent('download'), page.locator('.export-button', { hasText: 'Vault' }).click()]);
  const zip = readFileSync(await zipDownload.path());
  let entries = 0;
  for (let i = 0; i + 4 <= zip.length; i++) if (zip.readUInt32LE(i) === 0x02014b50) entries++;
  check('the Vault export packs the knowledge documents of the filtered set',
    zip.readUInt32LE(0) === 0x04034b50 && entries === docsOf.size + 1, `${entries}/${docsOf.size + 1}`);

  const firstId = await page.locator('#papers-grid tr[data-id]').first().getAttribute('data-id');
  const firstPaper = corpus.find((p) => p.id === firstId);
  const marks = await page.locator('#papers-grid tr[data-id]').first().locator('.st-mark').evaluateAll((nodes) =>
    nodes.map((n) => [n.getAttribute('role'), n.getAttribute('aria-label')]));
  const n = claimsOf(firstPaper);
  const expectedMarks = [
    textOf(firstPaper) === null ? 'Volltext unbekannt' : textOf(firstPaper) ? 'Volltext vorhanden' : 'kein Volltext',
    'Screening: ' + ({ Include: 'eingeschlossen', Exclude: 'ausgeschlossen' }[decisionOf(firstPaper)] || 'nicht bewertet'),
    codedWorks.has(firstPaper.work_id) ? 'kodiert' : 'nicht kodiert',
    n ? `in ${n === 1 ? '1 Aussage' : n + ' Aussagen'}` : 'in keiner Aussage',
  ];
  check('each row carries four stage marks with accessible names',
    marks.length === 4 && marks.every(([role], i) => role === 'img' && marks[i][1] === expectedMarks[i]), JSON.stringify(marks));
  await page.locator(`#gap-list button[data-stage="${exportKey}"]`).click();
  // each decision state is rendered from a corpus work in that state, so the check does
  // not depend on which states the filtered list happens to hold
  const forms = await page.evaluate(() => {
    const stages = window.EC.korpusStages;
    const wanted = { 'is-include': 'include', 'is-exclude': 'exclude', 'is-open': 'open' };
    return Object.fromEntries(Object.entries(wanted).map(([cls, state]) => {
      const paper = window.EC.getAllPapers().find((p) => stages.decision(p) === state);
      if (!paper) return [cls, null];
      const box = document.createElement('div');
      box.innerHTML = stages.trackHtml(paper);
      document.body.appendChild(box);
      const node = box.querySelector('.st-mark--dec.' + cls);
      const form = node ? getComputedStyle(node, '::before').content + ' ' + getComputedStyle(node).borderTopStyle : null;
      box.remove();
      return [cls, form];
    }));
  });
  check('the decision mark differs in form, not only in colour',
    forms['is-include'] === '"+" solid' && forms['is-exclude'] === '"−" solid' && forms['is-open'] === 'none dashed', JSON.stringify(forms));

  // Saved reviewer records count as bewertet and replace the round-one decision, the
  // newest record winning. The fixture files are served by route interception, so
  // docs/data stays untouched; invalid records must be skipped.
  {
    const [revA, revB] = assignment.reviewers.map((r) => r.key);
    const used = new Set();
    const pick = (rule) => { const p = corpus.find((x) => !used.has(x.id) && rule(x)); if (p) used.add(p.id); return p; };
    const codedOpen = pick((p) => codedWorks.has(p.work_id) && decisionOf(p) === null);
    const openA = pick((p) => decisionOf(p) === null && assignment.assignments[p.id] === revA);
    const unclearA = pick((p) => decisionOf(p) === null && assignment.assignments[p.id] === revA);
    const badDecision = pick((p) => decisionOf(p) === null && assignment.assignments[p.id] === revA);
    const badVersion = pick((p) => decisionOf(p) === null && assignment.assignments[p.id] === revA && p.version_id);
    const expertExclude = pick((p) => decisionOf(p) === 'Exclude' && !codedWorks.has(p.work_id));
    const contested = pick((p) => decisionOf(p) === 'Include');
    const bind = (p) => ({ work_id: p.work_id, version_id: p.version_id });
    const fileA = { schema: 'femprompt-prisma-reviewer/0.5', reviewer: revA, actor: 'human', updated: '2026-10-02T12:00:00.000Z', decisions: {
      [codedOpen.id]: { ...bind(codedOpen), decision: 'Include', categories: { Gender: 2, Soziale_Arbeit: 1, Prompting: 0, Fairness: 2 }, evidence_basis: { Fairness: 'formal_exclusion' }, ts: '2026-10-02T10:00:00.000Z', actor: 'human' },
      [openA.id]: { ...bind(openA), decision: 'Include', ts: '2026-10-02T10:01:00.000Z', actor: 'human' },
      [unclearA.id]: { ...bind(unclearA), decision: 'Unclear', ts: '2026-10-02T10:02:00.000Z', actor: 'human' },
      [badDecision.id]: { ...bind(badDecision), decision: 'Maybe', ts: '2026-10-02T10:03:00.000Z', actor: 'human' },
      [badVersion.id]: { work_id: badVersion.work_id, version_id: 'version:not-this-one', decision: 'Include', ts: '2026-10-02T10:04:00.000Z', actor: 'human' },
      [expertExclude.id]: { ...bind(expertExclude), decision: 'Include', ts: '2026-10-02T10:05:00.000Z', actor: 'human' },
      [contested.id]: { ...bind(contested), decision: 'Exclude', ts: '2026-10-02T10:06:00.000Z', actor: 'human' },
      'no-such-paper': { decision: 'Include', ts: '2026-10-02T10:07:00.000Z', actor: 'human' },
    } };
    const fileB = { schema: 'femprompt-prisma-reviewer/0.5', reviewer: revB, actor: 'human', updated: '2026-10-03T12:00:00.000Z', decisions: {
      [contested.id]: { ...bind(contested), decision: 'Include', ts: '2026-10-03T09:00:00.000Z', actor: 'human' },
      [openA.id]: { ...bind(openA), decision: 'Exclude', ts: '2026-10-01T09:00:00.000Z', actor: 'human' },
    } };
    const fixture = { [revA]: fileA, [revB]: fileB };
    const fixtureRecords = reviewerRecords(fixture);
    const { rules: fixtureRules } = rulesFor(fixtureRecords);
    const fixtureCounts = countsBy(fixtureRules, corpus);
    console.log('stage counts with reviewer fixture', JSON.stringify(fixtureCounts));
    const reviewed = await browser.newPage({ viewport: { width: 1280, height: 800 }, locale: 'de-AT' });
    await reviewed.route(/\/data\/screening\/[a-z0-9_-]+\.json$/, (route) => {
      const key = new URL(route.request().url()).pathname.split('/').pop().replace(/\.json$/, '');
      return fixture[key] ? route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fixture[key]) }) : route.fallback();
    });
    await reviewed.goto(`${base}/index.html#view=korpus`, { waitUntil: 'networkidle' });
    await reviewed.waitForSelector('#stage-bar button');
    const shown = await reviewed.$$eval('#view-korpus button[data-stage]', (buttons) =>
      Object.fromEntries(buttons.map((b) => [b.dataset.stage, Number(b.querySelector('.stage-n').textContent)])));
    check('saved reviewer records count as bewertet, recomputed with the fixture',
      sameCounts(shown, fixtureCounts) && fixtureCounts.bewertet === expectedCounts(corpus).bewertet + 3 &&
      fixtureCounts['kodiert-eingeschlossen'] === expectedCounts(corpus)['kodiert-eingeschlossen'] + 1,
      JSON.stringify({ shown, fixtureCounts }));
    const decided = await reviewed.evaluate((ids) => ids.map((id) => window.EC.korpusStages.decision({ id, benchmark: {} })),
      [codedOpen.id, openA.id, unclearA.id, badDecision.id, badVersion.id, expertExclude.id, contested.id]);
    check('a reviewer record overrides the expert decision, the newer record wins, invalid records are skipped',
      decided.join() === 'include,include,unclear,open,open,include,include', decided.join());
    const recordCats = await reviewed.evaluate((id) => window.EC.korpusStages.humanCategories({ id, benchmark: {} }), codedOpen.id);
    check('a reviewer record supplies the categories of its work at teilweise and ja, without those of a formal exclusion (ADR-048)',
      JSON.stringify((recordCats || []).sort()) === JSON.stringify(['Gender', 'Soziale_Arbeit']), JSON.stringify(recordCats));
    const unclearForm = await reviewed.evaluate((paper) => {
      const box = document.createElement('div');
      box.innerHTML = window.EC.korpusStages.trackHtml(paper);
      document.body.appendChild(box);
      const node = box.querySelector('.st-mark--dec');
      const out = [node.className, node.getAttribute('aria-label'), getComputedStyle(node, '::before').content];
      box.remove();
      return out;
    }, unclearA);
    check('an Unclear record shows as ? with its accessible name',
      unclearForm[0].includes('is-unclear') && unclearForm[1] === 'Screening: unklar' && unclearForm[2] === '"?"', JSON.stringify(unclearForm));
    await reviewed.locator('#year-hist .year-col:not([disabled])').first().hover();
    check('with an Unclear record the year tooltip lists unklar as a status',
      (await reviewed.locator('#year-tip li').allTextContents()).some((t) => t.startsWith('unklar')));
    await reviewed.close();
  }

  const reviewer = assignment.reviewers[0].key;
  const stageHash = `#view=korpus&stage=offen-${reviewer}&year=2025`;
  await page.goto(`${base}/index.html${stageHash}`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#gap-list button');
  const roundTrip = corpus.filter((p) => stageRules['offen-' + reviewer](p) && yearOf(p) === '2025').length;
  check('a stage in the hash restores the work list',
    await page.locator(`#gap-list button[data-stage="offen-${reviewer}"]`).getAttribute('aria-pressed') === 'true' &&
    await resultCount() === roundTrip && hashParams().get('stage') === `offen-${reviewer}`);
  await page.locator('#view-korpus button[data-stage="eingeschlossen"]').click();
  const included2025 = corpus.filter((p) => stageRules.eingeschlossen(p) && yearOf(p) === '2025').length;
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('#stage-bar button');
  check('a chosen stage writes the hash and survives reload', hashParams().get('stage') === 'eingeschlossen' &&
    hashParams().get('year') === '2025' && await resultCount() === included2025);
  await page.goto(`${base}/index.html#view=korpus&stage=bogus`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#stage-bar button');
  check('an invalid stage parameter is no filter and presses no stage', await resultCount() === corpus.length &&
    await page.locator('#view-korpus button[data-stage][aria-pressed="true"]').count() === 0);

  await page.locator('#stage-bar button[data-stage="eingeschlossen"]').focus();
  await page.keyboard.press('Enter');
  check('a stage is selectable by keyboard with a visible focus', await resultCount() === expectedCounts(corpus).eingeschlossen &&
    await page.evaluate(() => document.activeElement.dataset.stage === 'eingeschlossen' && getComputedStyle(document.activeElement).outlineStyle !== 'none'));
  const keyedId = await page.locator('#papers-grid tr[data-id]').first().getAttribute('data-id');
  await page.locator('#papers-grid .row-open').first().focus();
  await page.keyboard.press('Enter');
  await page.waitForSelector('#paper-modal.active');
  check('a row opens its detail by keyboard, focus moves to the panel title and the hash keeps the paper',
    hashParams().get('paper') === keyedId && await page.evaluate(() => document.activeElement.id === 'modal-title'));
  await page.keyboard.press('Escape');
  check('Escape closes the panel and returns focus to its row', !(await page.locator('#paper-modal').isVisible()) &&
    !hashParams().has('paper') && await page.evaluate((id) => document.activeElement.closest('tr') &&
      document.activeElement.closest('tr').dataset.id === id, keyedId));

  // Second UI round: next step per row, no pressed stage by default, visible subsets,
  // active-filter chips, categories of the selection, author cell and detail actions.
  {
    const nextOf = (p) => {
      const dec = decisionOf(p);
      if (dec === 'Exclude') return '';
      if (textOf(p) === false) return 'Volltext beschaffen';
      if (dec === null) return 'bewerten';
      if (dec === 'Unclear') return 'entscheiden';
      if (!codedWorks.has(p.work_id)) return 'kodieren';
      if (!claimsOf(p)) return 'Aussage bilden';
      return '';
    };
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${base}/index.html#view=korpus`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#papers-grid tr[data-idx]');
    check('on load no stage is pressed, the list shows all works sorted nach Stand and no filter chip stands',
      await page.locator('#view-korpus button[data-stage][aria-pressed="true"]').count() === 0 &&
      await resultCount() === corpus.length && await page.locator('#sort-by').inputValue() === 'stage' &&
      await page.locator('#active-filters').isHidden() && await page.locator('#active-filters button').count() === 0);
    const subs = await page.$$eval('#stage-bar .stage-sub', (nodes) => nodes.map((n) => ({
      visible: n.offsetParent !== null && n.getBoundingClientRect().width > 0,
      border: getComputedStyle(n).borderTopColor, tag: n.tagName, disabled: n.disabled })));
    check('the davon subsets stand as visible, framed buttons',
      subs.length === SUB_KEYS.length && subs.every((s) => s.visible && s.tag === 'BUTTON' && s.border !== 'rgba(0, 0, 0, 0)'), JSON.stringify(subs));
    const rows = await page.$$eval('#papers-grid tr[data-id]', (trs) => trs.map((tr) => ({
      id: tr.dataset.id, title: tr.querySelector('.row-open').textContent,
      next: tr.querySelector('.col-next').textContent, reached: tr.querySelector('.st-reached').textContent,
      author: tr.querySelector('.col-author').innerText.trim(),
    })));
    const reachedOf = (p) => claimsOf(p) ? 'in Aussagen' : codedWorks.has(p.work_id) ? 'kodiert'
      : decisionOf(p) ? { Include: 'eingeschlossen', Exclude: 'ausgeschlossen', Unclear: 'unklar' }[decisionOf(p)]
        : textOf(p) ? 'mit Text' : 'identifiziert';
    const badNext = rows.filter((r) => r.next !== nextOf(corpusById[r.id]) || r.reached !== reachedOf(corpusById[r.id]));
    check('each row names the reached stage and the next step derived from the stage data', rows.length > 0 && badNext.length === 0,
      JSON.stringify(badNext.slice(0, 3)));
    check('titles stand in full, authors without the year that has its own column',
      rows.every((r) => r.title === corpusById[r.id].title) &&
      rows.every((r) => !/\(\d{4}\)$/.test(r.author)), JSON.stringify(rows.slice(0, 2)));

    // Filter chips: stage, year and category; each removable, then all at once.
    // Open works carry no human categories, so the chips are tested on the included ones.
    const inSel = (p) => stageRules.eingeschlossen(p) && yearOf(p) === '2025';
    const chipCat = schema.categories.map((c) => c.key).find((key) => corpus.some((p) => inSel(p) && catsOf(p).includes(key)));
    await page.locator('#stage-bar button[data-stage="eingeschlossen"]').click();
    await page.locator('#year-hist .year-col[data-year="2025"]').click();
    await page.locator(`#category-chips .category-chip[data-cat="${chipCat}"]`).click();
    const chipLabels = await page.locator('#active-filters .filter-chip').allInnerTexts();
    const wantN = corpus.filter((p) => inSel(p) && catsOf(p).includes(chipCat)).length;
    check('active filters appear as removable chips with one alle aufheben control',
      chipLabels.length === 3 && chipLabels[0].startsWith('eingeschlossen') && chipLabels[1].startsWith('Jahr 2025') &&
      await page.locator('#active-filters .filter-clear-all').count() === 1 &&
      (await page.locator('#active-filters .filter-clear-all').innerText()).trim() === 'alle aufheben' && await resultCount() === wantN,
      JSON.stringify(chipLabels));
    const resultIds = await page.$$eval('#papers-grid tr[data-id]', (trs) => trs.map((tr) => tr.dataset.id));
    const presentCats = schema.categories.map((c) => c.key).filter((key) => key === chipCat ||
      corpus.filter((p) => inSel(p) && catsOf(p).includes(chipCat)).some((p) => catsOf(p).includes(key)));
    const shownCats = await page.$$eval('#category-chips .category-chip', (chips) => chips.map((c) => c.dataset.cat));
    check('the sidebar offers only the categories that occur in the selection',
      resultIds.length === wantN && shownCats.sort().join() === presentCats.sort().join(), `${shownCats.join()} / ${presentCats.join()}`);
    await page.locator('#active-filters .filter-chip[data-clear="year"]').click();
    check('removing one chip clears only its filter and keeps the focus among the chips',
      !hashParams().has('year') && hashParams().get('stage') === 'eingeschlossen' && hashParams().get('cat') === chipCat &&
      await page.locator('#active-filters .filter-chip').count() === 2 &&
      await page.evaluate(() => document.activeElement.closest('#active-filters') !== null));
    await page.locator('#active-filters .filter-clear-all').click();
    check('alle aufheben clears every filter and hides the chip row',
      await resultCount() === corpus.length && !hashParams().has('stage') && !hashParams().has('cat') &&
      await page.locator('#active-filters').isHidden());

    // Detail panel actions on a work with text and on one without; both need the
    // reading-layer manifest that npm run build writes.
    if (manifest) {
      const withText = corpus.find((p) => textOf(p) === true && decisionOf(p) === null);
      const noText = corpus.find((p) => textOf(p) === false && decisionOf(p) === null);
      await page.goto(`${base}/index.html#view=korpus&paper=${encodeURIComponent(withText.id)}`, { waitUntil: 'networkidle' });
      await page.waitForSelector('#paper-modal.active');
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForSelector('#paper-modal.active');
      const panel = await page.evaluate(() => {
        const r = (sel) => document.querySelector(sel).getBoundingClientRect();
        return { main: r('.korpus-main'), detail: r('#paper-modal'), table: r('.papers-table'),
          actions: [...document.querySelectorAll('#modal-body .detail-actions a, #modal-body .detail-actions button')]
            .map((a) => [a.textContent, a.getAttribute('href') || a.dataset.action]),
          llm: [...document.querySelectorAll('#modal-body .panel-header')].some((n) => n.textContent.startsWith('LLM')),
          title: document.getElementById('modal-title').textContent };
      });
      const actionOf = (list, label) => (list.find(([text]) => text === label) || [])[1];
      check('a selected work survives reload and its panel stands right of the list at 1280 px',
        panel.title === withText.title && panel.detail.left >= panel.main.right && panel.table.right <= panel.main.right + 1 &&
      hashParams().get('paper') === withText.id, JSON.stringify(panel));
      check('the panel links the work into PRISM and to its full text, without a Beschaffung action',
        actionOf(panel.actions, 'In PRISM öffnen') === `prisma.html?paper=${encodeURIComponent(withText.id)}` &&
        actionOf(panel.actions, 'Volltext lesen') === 'read-fulltext' &&
        !actionOf(panel.actions, 'Beschaffung'), JSON.stringify(panel.actions));
      check('an open work shows no AI pre-assessment in its panel', !panel.llm);
      // The reading layer is Markdown, which a browser downloads, so the panel shows it itself.
      const diskText = readFileSync(resolve(docs, 'data', 'fulltext', `${withText.id}.md`), 'utf8');
      await page.locator('#modal-body .detail-action', { hasText: 'Volltext lesen' }).click();
      await page.waitForFunction(() => !document.getElementById('dtab-volltext').textContent.startsWith('Volltext lädt'));
      check('Volltext lesen shows the reading-layer text in the panel and moves focus to it',
        await page.locator('#dtab-volltext').isVisible() && await page.locator('#dtab-volltext').textContent() === diskText &&
        await page.evaluate(() => document.activeElement.id === 'dtab-volltext'));
      await page.goto(`${base}/index.html#view=korpus&paper=${encodeURIComponent(noText.id)}`, { waitUntil: 'networkidle' });
      await page.waitForSelector('#paper-modal.active');
      const noTextActions = await page.$$eval('#modal-body .detail-actions a, #modal-body .detail-actions button',
        (as) => as.map((a) => [a.textContent, a.getAttribute('href') || a.dataset.action]));
      check('a work without full text offers Beschaffung instead of Volltext lesen',
        !actionOf(noTextActions, 'Volltext lesen') && /stage=ohne-text/.test(actionOf(noTextActions, 'Beschaffung') || ''), JSON.stringify(noTextActions));
      await page.locator('#modal-body .detail-action', { hasText: 'Beschaffung' }).click();
      await page.waitForFunction(() => new URLSearchParams(location.hash.slice(1)).get('stage') === 'ohne-text');
      await page.waitForTimeout(100);
      check('Beschaffung opens the acquisition work list and keeps the work selected',
        await page.locator('#gap-list button[data-stage="ohne-text"]').getAttribute('aria-pressed') === 'true' &&
        hashParams().get('paper') === noText.id && await page.locator('#paper-modal').isVisible());
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(150);
      check('at 390 px the panel stacks below the list', await page.evaluate(() =>
        document.getElementById('paper-modal').getBoundingClientRect().top >= document.querySelector('.korpus-main').getBoundingClientRect().bottom &&
        document.documentElement.scrollWidth <= window.innerWidth + 1));
      await page.setViewportSize({ width: 1440, height: 900 });
    }
  }

  await page.locator('#tab-korpus').focus();
  const tipId = await page.locator('#tab-korpus').getAttribute('aria-describedby');
  check('a nav tooltip shows on keyboard focus', Boolean(tipId) && await page.locator('#' + tipId).isVisible());
  await page.keyboard.press('Escape');
  check('Escape hides the nav tooltip', !(await page.locator('#' + tipId).isVisible()));
  await page.goto(`${base}/about.html`, { waitUntil: 'networkidle' });
  await page.locator('.header-nav a[data-tip-key="prisma"]').hover();
  check('subpage nav items carry tooltips on hover', await page.locator('#nav-tip-prisma').isVisible());

  check('desktop document has no horizontal overflow', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await page.setViewportSize({ width: 390, height: 844 });
  for (const hash of ['#view=start', '#view=frage&sq=1', '#view=frage&sq=3', '#view=frage&sq=4', '#view=frage&sq=5', '#view=literaturbild', '#view=wissensnetz', workHref,
    '#view=korpus', '#view=korpus&stage=offen', '#view=chat', '#view=vergleich', '#view=begriffsnetz', '#view=wissensnetz&basis=agree&sel=Gender']) {
    await page.goto(`${base}/about.html`, { waitUntil: 'networkidle' });
    await page.goto(`${base}/index.html${hash}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(150);
    check(`390 px without horizontal scrolling: ${hash.split('&').slice(0, hash.includes('stage') ? 2 : 1).join('&')}`, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  }
  // CI renders with wider Linux fonts than Windows; a wide font with extra tracking stands in for them locally.
  const wideFont = '*{font-family:Verdana,"DejaVu Sans",sans-serif !important; letter-spacing:.02em}';
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    const paths = ['about.html', 'methoden.html', 'help.html', ...(width === 320 ? ['index.html#view=korpus'] : [])];
    for (const path of paths) {
      await page.goto(`${base}/about.html`, { waitUntil: 'networkidle' });
      await page.goto(`${base}/${path}`, { waitUntil: 'networkidle' });
      await page.addStyleTag({ content: wideFont });
      await page.waitForTimeout(150);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      check(`${width} px with a wide font without horizontal scrolling: ${path}`, overflow <= 1, `overflow ${overflow}px`);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto(`${base}/index.html#view=vergleich&lens=uebereinstimmung`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#landkarte button.lk-cell');
  await page.locator('#landkarte button.lk-cell').last().click();
  await page.waitForSelector('#landkarte-detail:not([hidden])');
  check('at 390 px the Landkarte with an open panel scrolls only inside its own container', await page.evaluate(() => {
    const wrap = document.querySelector('#landkarte .lk-wrap');
    return document.documentElement.scrollWidth <= window.innerWidth + 1 && wrap.clientWidth <= window.innerWidth &&
      document.querySelector('#landkarte .lk-lenses').getBoundingClientRect().right <= window.innerWidth;
  }));
  check('at 390 px the detail panel stands below the map', await page.evaluate(() =>
    document.getElementById('landkarte-detail').getBoundingClientRect().top >= document.getElementById('landkarte-legend').getBoundingClientRect().bottom));

  await page.goto(`${base}/index.html#view=begriffsnetz`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#netz-graph');
  check('at 390 px the term network figure and its table fit their column', await page.evaluate(() => {
    const figure = document.getElementById('netz-figure');
    const list = document.querySelector('.netz-list-wrap');
    return figure.scrollWidth <= figure.clientWidth + 1 && list.scrollWidth <= list.clientWidth + 1;
  }));
  await page.goto(`${base}/index.html#view=wissensnetz`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#wn-graph');
  check('at 390 px the linked table comes before the network figure and both fit', await page.evaluate(() => {
    const table = document.querySelector('.wn-table-wrap').getBoundingClientRect();
    const figure = document.getElementById('wn-figure').getBoundingClientRect();
    return table.bottom <= figure.top && figure.right <= window.innerWidth && document.documentElement.scrollWidth <= window.innerWidth + 1;
  }));
  await page.locator('#wn-table .wn-pick').first().click();
  check('at 390 px a table selection shows its works above the table', await page.evaluate(() =>
    document.getElementById('wn-detail').getBoundingClientRect().bottom <= document.querySelector('.wn-table-wrap').getBoundingClientRect().top + 1));
  await page.goto(`${base}/index.html#view=korpus&year=2024`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#year-hist .year-col');
  check('at 390 px the year histogram fits its column without scrolling the page', await page.evaluate(() => {
    const scroll = document.querySelector('.year-hist-scroll');
    return scroll.scrollWidth <= scroll.clientWidth + 1 && document.documentElement.scrollWidth <= window.innerWidth + 1;
  }));
  check('at 390 px axis labels are thinned out', await page.locator('#year-hist .year-label.is-thinned').count() > 0);
  await page.goto(`${base}/index.html`, { waitUntil: 'networkidle' });
  check('at 390 px the cards stack in one column', await page.evaluate(() =>
    getComputedStyle(document.querySelector('.start-cards')).gridTemplateColumns.split(' ').length === 1));
  check('no runtime errors', errors.length === 0, errors.join(' | '));
  check('no external runtime requests', external.length === 0, external.join(' | '));
} finally {
  await browser.close();
  await new Promise((done) => server.close(done));
}

const failed = checks.filter((item) => !item.ok);
checks.forEach((item) => console.log(`${item.ok ? 'ok  ' : 'FAIL'} ${item.name}${item.detail && !item.ok ? ` >> ${item.detail}` : ''}`));
console.log(`\n${failed.length ? 'FAIL' : 'PASS'} ${checks.length - failed.length}/${checks.length} Companion browser checks`);
process.exit(failed.length ? 1 : 0);
