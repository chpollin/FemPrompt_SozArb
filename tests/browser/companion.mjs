// Chromium acceptance run for the public Evidence Companion and Literature Landscape.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const docs = resolve(here, '..', '..', 'docs');
const inventory = JSON.parse(readFileSync(resolve(docs, 'data', 'research_vault_v2.json'))).meta;
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

  await page.goto(`${base}/index.html#view=literaturbild`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#literaturbild-root .lit-viz');
  check('Literaturbild is the restored active view', await page.locator('#view-literaturbild').evaluate((node) => node.classList.contains('active')));
  const intro = await page.locator('#intro-section').innerText();
  check('inventory distinguishes links and unique knowledge documents',
    intro.includes(`${inventory.knowledge_linked_records} Verknüpfungen`) &&
    intro.includes(`${inventory.distinct_knowledge_docs} Wissensdokumente`));
  check('the page uses one visualization and no legacy dashboard cards',
    await page.locator('#literaturbild-root .lit-viz').count() === 1 &&
    await page.locator('#literaturbild-root .lit-stats').count() === 0);
  check('desktop document has no horizontal overflow', await page.evaluate(() =>
    document.documentElement.scrollWidth <= window.innerWidth + 1));

  check('reviewed Work denominator is displayed',
    (await page.locator('.lit-progress').innerText()).includes(landscape.meta.annotated_total + ' ' + landscape.source.public_label.toLocaleLowerCase('de')));
  if (!landscape.records.length) {
    check('withheld papers are absent and explained',
      await page.locator('.lit-matrix-button:not([disabled])').count() === 0 &&
      (await page.locator('.lit-empty-state').innerText()).includes('Prüf- und Veröffentlichungsregel'));
  } else {
    await page.locator('.lit-matrix-button:not([disabled])').first().click();
    const titles = await page.locator('.lit-results .lit-paper summary strong').allTextContents();
    check('drill-down contains eligible works', titles.length > 0 && titles.every(title => landscape.records.some(record => record.title === title)));
    await page.locator('#lit-clear-selection').click();
  }

  await page.locator('.lit-view-button[data-lit-view="profile"]').click();
  await page.selectOption('#lit-profile-field', 'AN_Bias_Axes');
  await page.waitForFunction(() => location.hash.includes('litView=profile') && location.hash.includes('litProfile=AN_Bias_Axes'));
  const sharedUrl = page.url();
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('#literaturbild-root .lit-viz');
  check('profile URL survives reload', page.url() === sharedUrl &&
    await page.locator('.lit-view-button[data-lit-view="profile"]').getAttribute('aria-pressed') === 'true' &&
    await page.inputValue('#lit-profile-field') === 'AN_Bias_Axes');

  await page.setViewportSize({ width: 768, height: 900 });
  check('compact viewport has no document-level horizontal overflow', await page.evaluate(() =>
    document.documentElement.scrollWidth <= window.innerWidth + 1));
  check('compact viewport stacks the literature workspace', await page.locator('.lit-workspace').evaluate((node) =>
    getComputedStyle(node).gridTemplateColumns.split(' ').length === 1));
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
