// Chromium acceptance run for the working Companion docs/index.html: start view, answer
// pages, Argumentkarte, Literaturbild matrix, Wissensnetz, work view, legacy hashes, nav tooltips and reflow.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const docs = resolve(here, '..', '..', 'docs');
const landscape = JSON.parse(readFileSync(resolve(docs, 'data', 'literature_landscape.json')));
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
    // A missing working file is the expected public state, not an error of the page.
    if (message.type() === 'error' && !String(message.location().url).endsWith('/data/assertions_working.json')) errors.push(message.text());
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
    '#view=korpus', '#view=chat', '#view=vergleich']) {
    await page.goto(`${base}/about.html`, { waitUntil: 'networkidle' });
    await page.goto(`${base}/index.html${hash}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(150);
    check(`390 px without horizontal scrolling: ${hash.split('&')[0]}`, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
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

  await page.goto(`${base}/index.html#view=wissensnetz`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#netz-graph');
  check('at 390 px the network figure and its table fit their column', await page.evaluate(() => {
    const figure = document.getElementById('netz-figure');
    const list = document.querySelector('.netz-list-wrap');
    return figure.scrollWidth <= figure.clientWidth + 1 && list.scrollWidth <= list.clientWidth + 1;
  }));
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
