// Chromium acceptance run for the working Companion docs/index.html: start view, answer
// pages, Literaturbild matrix, Wissensnetz, work view, legacy hashes, nav tooltips and reflow.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const docs = resolve(here, '..', '..', 'docs');
const landscape = JSON.parse(readFileSync(resolve(docs, 'data', 'literature_landscape.json')));
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
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (/^https?:$/.test(url.protocol) && url.origin !== base) external.push(request.url());
  });

  const cov = landscape.meta.analysis_coverage;
  const coded = Math.min(...Object.entries(cov.fields).filter(([key]) => key.startsWith('AN_')).map(([, f]) => f.value + f.none + f.undecidable));
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
    };
  });
  check('title, status line and cards share one width', layout.title === layout.cards && layout.status === layout.cards, JSON.stringify(layout));
  check('the main question wraps on two or three lines', layout.titleLines >= 2 && layout.titleLines <= 3, JSON.stringify(layout));
  check('the status sentence stands on one line', layout.statusLines === 1, JSON.stringify(layout));
  check('the question cards form a two-by-two grid', layout.columns === 2 && await page.locator('.start-card').count() === 4);
  check('the start view carries no buttons duplicating the navigation', await page.locator('#view-start .start-btn, #view-start .start-actions').count() === 0);
  const cardLines = await page.locator('.start-card-status').allInnerTexts();
  check('every card names its finding status',
    cardLines.length === 4 && cardLines.every((line) => /^(\d+ KI-geprüfte?r? Befunde?|noch kein geprüfter Befund)/.test(line)), cardLines.join(' | '));

  await page.locator('.start-card[data-sq="2"]').focus();
  await page.keyboard.press('Enter');
  await page.waitForSelector('#frage-root .answer[data-sq="2"]');
  check('a card opens its answer page by keyboard and moves focus to its heading',
    hashParams().get('sq') === '2' && await page.evaluate(() => document.activeElement.matches('#frage-root h1')));
  await page.goBack({ waitUntil: 'networkidle' });
  check('Back returns from an answer page to the start view', await visibleView() === 'view-start');
  for (const sq of ['1', '2', '3', '4']) {
    await page.goto(`${base}/index.html#view=frage&sq=${sq}`, { waitUntil: 'networkidle' });
    await page.waitForSelector(`#frage-root .answer[data-sq="${sq}"]`);
    check(`answer page ${sq} leads with the denominator and has its four parts`,
      await page.locator('#frage-root h1 + .denominator--summary').count() === 1 &&
      await page.locator('#frage-befunde, #frage-matrix, #frage-offen, #frage-werke').count() === 4);
  }
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
  for (const hash of ['#view=start', '#view=frage&sq=1', '#view=frage&sq=3', '#view=literaturbild', '#view=wissensnetz', workHref,
    '#view=korpus', '#view=chat', '#view=vergleich']) {
    await page.goto(`${base}/about.html`, { waitUntil: 'networkidle' });
    await page.goto(`${base}/index.html${hash}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(150);
    check(`390 px without horizontal scrolling: ${hash.split('&')[0]}`, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  }
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
