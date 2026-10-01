// Chromium acceptance run for the working Companion docs/index.html: start view, answer
// pages, Argumentkarte, Literaturbild matrix, Wissensnetz, work view, Landkarte lenses, legacy hashes, nav
// tooltips, the Korpus workbench (sidebar, year histogram, review stages, work lists,
// exports, stage track) and reflow.
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
  id: a.assertion_ref.split('/').pop(), research_questions: a.research_questions || [], contested_with: [], released: true,
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
  check('the conceptual-grounding page states that it is not yet coded and shows no count',
    (await page.locator('#frage-root h1 + .denominator--summary').innerText()).endsWith('Noch nicht codiert') &&
    await page.locator('#frage-root .matrix-wrap').count() === 0);
  check('no navigation tab is pressed on an answer page', await page.locator('.nav-view-btn[aria-pressed="true"]').count() === 0);

  await page.goto(`${base}/index.html#view=literaturbild`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#view-literaturbild #matrix-table');
  check('Literaturbild shows the evidence-and-gap matrix',
    await visibleView() === 'view-literaturbild' && await page.locator('#tab-literaturbild[aria-pressed="true"]').count() === 1);
  check('the matrix shows n. b. while coding is open', await page.locator('#matrix-table td[data-state="undetermined"]').count() > 0);
  await page.locator('#matrix-table button.matrix-cell[data-state="value"]').first().click();
  await page.waitForSelector('#worklist:not([hidden])');
  const cellUrl = page.url();
  check('a cell writes its state into the hash', hashParams().has('cell'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('#worklist:not([hidden])');
  check('a matrix deep link survives reload', page.url() === cellUrl);
  await page.goBack({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.getElementById('worklist').hidden);
  check('Back closes the work list', !hashParams().has('cell'));
  await page.goForward({ waitUntil: 'networkidle' });
  await page.waitForSelector('#worklist:not([hidden])');
  check('Forward reopens it', page.url() === cellUrl);

  const workHref = await page.locator('#worklist .work-title a').first().getAttribute('href');
  await page.locator('#worklist .work-title a').first().click();
  await page.waitForSelector('#werk-root .werk');
  check('the work view opens inside the page', workHref.startsWith('#view=werk&id=') && await visibleView() === 'view-werk');
  check('work categories use the shared chip markup', await page.locator('#werk-root .werk-categories .category-chip[data-cat]').count() > 0);

  await page.goto(`${base}/index.html#view=wissensnetz`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#view-wissensnetz #netz-list');
  check('Wissensnetz shows the network of review knowledge',
    await page.locator('#netz-graph').count() === 1 && await page.locator('#tab-wissensnetz[aria-pressed="true"]').count() === 1);

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
  await page.locator('#filter-decision').selectOption('Include');
  const included2024 = corpus.filter((paper) => paper.llm.decision === 'Include' && yearOf(paper) === '2024').length;
  check('the histogram counts the selection of the other filters', await col2024.getAttribute('aria-label') === `2024, ${werke(included2024)}`);
  await col2024.click();
  check('the year filter combines with the other filters',
    await resultCount() === included2024 && hashParams().get('dec') === 'Include' && hashParams().get('year') === '2024');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('#year-hist .year-col');
  check('a year selection survives reload', await col2024.getAttribute('aria-pressed') === 'true' && await resultCount() === included2024);
  await col2024.click();
  await page.locator('#filter-decision').selectOption('all');
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
  const readOptional = (rel) => (existsSync(resolve(docs, 'data', rel)) ? JSON.parse(readFileSync(resolve(docs, 'data', rel))) : null);
  const manifest = readOptional('fulltext_manifest.json');
  const assignment = readOptional('screening/assignment.json');
  const workOfRecord = Object.fromEntries(corpus.map((p) => [p.id, p.work_id]));
  const corpusById = Object.fromEntries(corpus.map((p) => [p.id, p]));
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
        out[pid] = { decision: rec.decision, ts, reviewer: key };
      }
    }
    return out;
  };
  const diskRecords = reviewerRecords(Object.fromEntries(assignment.reviewers.map((r) => [r.key, readOptional(`screening/${r.key}.json`)])));
  const textOf = (p) => (manifest ? Boolean(manifest[p.id] && manifest[p.id].src !== 'none') : null);
  const claimsOf = (p) => (claimWorks[p.work_id] ? claimWorks[p.work_id].size : 0);
  const SCREENING_KEYS = ['all', ...(manifest ? ['text'] : []), 'bewertet', 'eingeschlossen'];
  const AUSWERTUNG_KEYS = ['kodiert', 'aussagen'];
  const SUB_KEYS = ['kodiert-eingeschlossen', 'aussagen-eingeschlossen'];
  const rulesFor = (records) => {
    const decisionOf = (p) => (records[p.id] ? records[p.id].decision
      : p.benchmark.has_human && p.human && ['Include', 'Exclude'].includes(p.human.decision) ? p.human.decision : null);
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
    return { rules, decisionOf };
  };
  const { rules: stageRules, decisionOf } = rulesFor(diskRecords);
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
  const llmIncluded = corpus.filter((p) => p.llm.decision === 'Include');
  check('the stage counts follow the other filters', sameCounts(await shownCounts(), expectedCounts(llmIncluded)));
  await page.locator('#filter-decision').selectOption('all');

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
  const docsOf = new Set(corpus.filter(stageRules[exportKey]).filter((p) => p.knowledge_doc).map((p) => p.knowledge_doc));
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
  const forms = await page.evaluate(() => Object.fromEntries(['is-include', 'is-exclude', 'is-open'].map((cls) => {
    const node = document.querySelector('.st-mark--dec.' + cls);
    return [cls, node ? getComputedStyle(node, '::before').content + ' ' + getComputedStyle(node).borderTopStyle : null];
  })));
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
      [codedOpen.id]: { ...bind(codedOpen), decision: 'Include', ts: '2026-10-02T10:00:00.000Z', actor: 'human' },
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
  check('an invalid stage parameter is no filter', await resultCount() === corpus.length &&
    await page.locator('#stage-bar button[data-stage="all"]').getAttribute('aria-pressed') === 'true');

  await page.locator('#stage-bar button[data-stage="eingeschlossen"]').focus();
  await page.keyboard.press('Enter');
  check('a stage is selectable by keyboard with a visible focus', await resultCount() === expectedCounts(corpus).eingeschlossen &&
    await page.evaluate(() => document.activeElement.dataset.stage === 'eingeschlossen' && getComputedStyle(document.activeElement).outlineStyle !== 'none'));
  await page.locator('#papers-grid .row-open').first().focus();
  await page.keyboard.press('Enter');
  await page.waitForSelector('#paper-modal.active');
  check('a row opens its detail by keyboard and keeps the paper link in the hash', hashParams().get('paper') !== null);
  await page.keyboard.press('Escape');

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
    '#view=korpus', '#view=korpus&stage=offen', '#view=chat', '#view=vergleich']) {
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

  await page.goto(`${base}/index.html#view=wissensnetz`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#netz-graph');
  check('at 390 px the network figure and its table fit their column', await page.evaluate(() => {
    const figure = document.getElementById('netz-figure');
    const list = document.querySelector('.netz-list-wrap');
    return figure.scrollWidth <= figure.clientWidth + 1 && list.scrollWidth <= list.clientWidth + 1;
  }));
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
