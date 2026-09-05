// Acceptance checks against the actual allowlisted result artifact.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { resolve, relative, extname } from 'node:path';
const root = resolve('build/site');
const mime = {'.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.woff2': 'font/woff2'};
const server = createServer((request, response) => {
  const file = resolve(root, '.' + decodeURIComponent(new URL(request.url, 'http://localhost').pathname));
  const rel = relative(root, file);
  if (rel.startsWith('..') || !existsSync(file) || !statSync(file).isFile()) { response.writeHead(404); response.end(); return; }
  response.writeHead(200, {'Content-Type': (mime[extname(file)] || 'application/octet-stream') + '; charset=utf-8'});
  response.end(readFileSync(file));
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
const failures = [];
function check(name, ok) { console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}`); if (!ok) failures.push(name); }
try {
  browser = await chromium.launch({headless:true});
  const page = await browser.newPage({viewport:{width:1280,height:900}});
  const errors = [], remote = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('request', r => { if (!r.url().startsWith(base)) remote.push(r.url()); });
  await page.goto(base + '/index.html', {waitUntil:'networkidle'});
  const data = JSON.parse(readFileSync(resolve(root, 'data/public_release.json'), 'utf8'));
  check('release inventory rendered', (await page.locator('#release-counts').innerText()).includes(data.meta.assertion_count + ' belegte Aussagen'));
  check('actual source-reviewed statements rendered', await page.locator('.assertion-card').count() === data.meta.assertion_count);
  if (data.meta.assertion_count) {
    await page.locator('.assertion-card details').first().evaluate(node => node.open = true);
    check('agent model and time are visible', (await page.locator('.assertion-review').first().innerText()).includes('Modell:'));
    check('source quotations available', await page.locator('.assertion-card blockquote').count() > 0);
  }
  await page.fill('#evidence-search', 'zzzz-no-evidence');
  check('empty search explained', (await page.locator('#assertion-list').innerText()).includes('keine quellengeprüften Aussagen'));
  await page.locator('[data-view="literature"]').click();
  await page.waitForSelector('#literaturbild-root .lit-viz');
  check('shared literature view loads', await page.locator('.lit-error').count() === 0);
  await page.locator('.lit-view-button[data-lit-view="profile"]').click();
  await page.selectOption('#lit-profile-field', 'AN_Bias_Axes');
  const sharedUrl = page.url();
  await page.reload({waitUntil:'networkidle'});
  await page.waitForSelector('#lit-profile-field');
  check('result filter URL survives reload', page.url() === sharedUrl && await page.inputValue('#lit-profile-field') === 'AN_Bias_Axes');
  await page.evaluate(() => location.hash = 'view=evidence');
  await page.waitForSelector('#release-evidence', {state:'visible'});
  check('hash navigation restores visible result view', await page.locator('#release-literature').isHidden());
  mkdirSync('tests/browser/out/release', {recursive:true});
  await page.screenshot({path:'tests/browser/out/release/desktop.png',fullPage:true});
  await page.locator('[data-view="chat"]').click();
  await page.fill('#chat-input', 'zzzz-no-evidence');
  await page.locator('#chat-send').click();
  check('no provider request for missing evidence', remote.length === 0);
  for (const path of ['data/screening/ar2.json','data/fulltext_manifest.json','docs/data/screening/ar2.json','data/promptotyping_v2.json']) {
    const response = await page.request.get(base + '/' + path);
    check('working data unavailable: ' + path, response.status() === 404);
  }
  await page.setViewportSize({width:390,height:844});
  check('mobile has no horizontal document overflow', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await page.screenshot({path:'tests/browser/out/release/mobile.png',fullPage:true});
  check('no browser runtime errors', errors.length === 0);
  check('no external runtime requests', remote.length === 0);
} finally {
  if (browser) await browser.close();
  await new Promise(done => server.close(done));
}
if (failures.length) throw new Error(failures.join('; '));
console.log('PASS source-reviewed result site');
