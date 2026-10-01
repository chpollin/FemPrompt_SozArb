// Acceptance checks against the actual allowlisted result artifact: the client
// model's state derivation, then the public Companion views in Chromium.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { resolve, relative, extname } from 'node:path';
import vm from 'node:vm';

const root = resolve('build/site');
const failures = [];
function check(name, ok) { console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}`); if (!ok) failures.push(name); }
const json = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));

// Model: field states and cross-tabulation over a fixture derived from released data.
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(resolve(root, 'js/release-model.js'), 'utf8'), sandbox);
const EC = sandbox.window.EC;
const fields = json('data/analysis_fields.json');
const schema = json('data/category_schema.json');
const landscape = json('data/literature_landscape.json');
const fixtureRecord = (id, analysis, categories) => ({
  id, work_id: 'work:' + id, title: id, author_year: id, year: 2024, decision: 'Include',
  categories: categories || [], analysis, record_ids: [id],
});
const fixture = EC.createModel({
  schema, fields, assertions: { assertions: [] }, release: { papers: [], meta: {} },
  landscape: { meta: {}, source: {}, records: [
    fixtureRecord('VALUE', { fields: { AN_Bias_Axes: ['Gender', 'Age'], AN_Mitigation_Status: 'Evaluated' }, undecidable: [] },
      [{ key: 'Gender', level: 2, evidence: [{ term: 'gap', snippet: 'a gender gap', source_record_id: 'VALUE' }] }]),
    fixtureRecord('NONE', { fields: { AN_Bias_Axes: ['None'], AN_Mitigation_Status: 'None' }, undecidable: [] }),
    fixtureRecord('UNDECIDABLE', { fields: { AN_Bias_Axes: [] }, undecidable: ['AN_Bias_Axes'] }),
    fixtureRecord('UNDECIDABLE_OBJECT', { fields: {}, undecidable: { AN_Bias_Axes: true } }),
    fixtureRecord('ABSENT', null),
    fixtureRecord('EMPTY', { fields: { AN_Bias_Axes: [] }, undecidable: [] }),
  ] },
});
const work = id => fixture.workById('work:' + id);
check('model: coded values', JSON.stringify(fixture.stateOf(work('VALUE'), 'AN_Bias_Axes').values) === '["Gender","Age"]');
check('model: ["None"] is coded as not applicable', fixture.stateOf(work('NONE'), 'AN_Bias_Axes').state === 'none');
check('model: undecidable list and object forms', fixture.stateOf(work('UNDECIDABLE'), 'AN_Bias_Axes').state === 'undecidable' &&
  fixture.stateOf(work('UNDECIDABLE_OBJECT'), 'AN_Bias_Axes').state === 'undecidable');
check('model: missing analysis or empty list is not coded', fixture.stateOf(work('ABSENT'), 'AN_Bias_Axes').state === 'absent' &&
  fixture.stateOf(work('EMPTY'), 'AN_Bias_Axes').state === 'absent');
check('model: a category group without members is coded as not applicable', fixture.stateOf(work('NONE'), 'perspective').state === 'none');
check('model: single-valued fields are work-level', fixture.dim('AN_Mitigation_Status').workLevel && !fixture.dim('AN_Bias_Axes').workLevel);
const coverage = fixture.coverage(fixture.includes, 'AN_Bias_Axes');
check('model: coverage partitions the scope', coverage.coded === 1 && coverage.none === 1 && coverage.undecidable === 2 &&
  coverage.not_coded === 2 && coverage.in_scope === 6);
const cells = fixture.crossTab(fixture.includes, 'AN_Bias_Axes', 'AN_Mitigation_Status');
check('model: a multi-valued work counts once per jointly coded value', cells.Gender.Evaluated.length === 1 && cells.Age.Evaluated.length === 1);
check('model: status rows hold uncoded and undecidable works', cells[fixture.ABSENT][fixture.ABSENT].length === 2 &&
  cells[fixture.UNDECIDABLE][fixture.ABSENT].length === 2);
check('model: coded summary counts any recorded state', fixture.codedSummary(fixture.includes, ['AN_Bias_Axes'], false).coded === 4);
const withPipeline = EC.createModel({ schema, fields, landscape: { meta: { analysis_coverage: {
  scope: { work_total: 12 },
  fields: { AN_Bias_Axes: { value: 5, none: 1, undecidable: 1, absent: 1, not_coded: 1, withheld: 3 } } } }, records: [] } });
const piped = withPipeline.pipelineCoverage('AN_Bias_Axes');
check('model: pipeline coverage follows the data contract', piped.withheld === 3 && piped.not_coded === 2 &&
  withPipeline.codedSummary([], ['AN_Bias_Axes'], true).total === 12 &&
  withPipeline.codedSummary([], ['AN_Bias_Axes'], true).coded === 7);
const realCoverage = landscape.meta && landscape.meta.analysis_coverage;
check('model: the published coverage block is readable', !realCoverage ||
  EC.createModel({ schema, fields, landscape }).pipelineCoverage('AN_Bias_Axes') !== null);
check('model: pipeline coverage absent falls back', fixture.pipelineCoverage('AN_Bias_Axes') === null);
check('model: category evidence keeps quote and record', fixture.evidenceFor(work('VALUE'), 'perspective', 'Gender')[0].recordId === 'VALUE');
const neighbours = fixture.neighbours(fixture.includes, { dimId: 'AN_Bias_Axes', key: 'Gender' }, ['AN_Bias_Axes']);
check('model: neighbours are co-coded terms without the ego', neighbours.length === 1 && neighbours[0].key === 'Age');
check('model: search folds umlauts and diacritics', EC.fold('Diversität') === EC.fold('Diversitaet'));

// Browser acceptance against build/site.
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.woff2': 'font/woff2' };
const server = createServer((request, response) => {
  const file = resolve(root, '.' + decodeURIComponent(new URL(request.url, 'http://localhost').pathname));
  const rel = relative(root, file);
  if (rel.startsWith('..') || !existsSync(file) || !statSync(file).isFile()) { response.writeHead(404); response.end(); return; }
  response.writeHead(200, { 'Content-Type': (mime[extname(file)] || 'application/octet-stream') + '; charset=utf-8' });
  response.end(readFileSync(file));
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [], remote = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('request', r => { if (!r.url().startsWith(base)) remote.push(r.url()); });
  const visible = view => page.waitForSelector(`[data-view-root="${view}"]:not([hidden])`);
  const hashParams = () => page.evaluate(() => Object.fromEntries(new URLSearchParams(location.hash.slice(1))));

  await page.goto(base + '/index.html', { waitUntil: 'networkidle' });
  await visible('fragen');
  check('start page leads with the main question', (await page.locator('#fragen-title').innerText()).trim().endsWith('?'));
  check('start page shows the research sub-questions', await page.locator('.sq-link').count() >= 3);
  check('start page carries no standing inventory counter', await page.locator('#release-counts').count() === 0);
  check('start page never claims an answered question', !/beantwortet/i.test(await page.locator('#view-fragen').innerText()));
  for (const view of ['matrix', 'netz', 'korpus', 'aussagen', 'chat', 'methode']) {
    const label = (await page.locator(`[data-nav="${view}"]`).innerText()).trim();
    await page.locator(`[data-nav="${view}"]`).click();
    await visible(view);
    check(`navigation label equals view title: ${label}`, (await page.locator(`#view-${view} h1`).innerText()).trim() === label);
  }

  await page.goto(base + '/index.html#view=frage&sq=3', { waitUntil: 'networkidle' });
  await visible('frage');
  const answer = page.locator('#frage-root');
  check('answer page leads with the denominator', (await answer.locator('h1 + .denominator--summary').innerText()).includes('eingeschlossenen Werken codiert'));
  check('answer page has Befunde, Karte, Offen and Werke', await answer.locator('#frage-befunde, #frage-karte, #frage-offen, #frage-werke').count() === 4);
  check('answer map cells link to the matrix', (await answer.locator('a.matrix-cell').first().getAttribute('href')).includes('view=matrix'));
  check('work-level status is named as the work\'s status', (await answer.locator('.answer-map h3').allInnerTexts()).some(text => text.includes('Status des Werks')));
  check('answer page never claims an answered question', !/beantwortet/i.test(await answer.innerText()));

  await page.goto(base + '/index.html#view=matrix&rows=perspective&cols=AN_Bias_Axes', { waitUntil: 'networkidle' });
  await visible('matrix');
  check('matrix denominator precedes the table', (await page.locator('#matrix-denominator .denominator--summary').innerText()).includes('von'));
  check('matrix keeps the not-coded row visible', await page.locator(`#matrix-table th[data-row="__absent"]`).count() === 1);
  const cell = page.locator('button.matrix-cell[data-state="value"]').first();
  const count = Number(await cell.getAttribute('data-count'));
  check('cells state joint coding', (await cell.getAttribute('aria-label')).includes('gemeinsam codiert'));
  await cell.click();
  await page.waitForSelector('#worklist:not([hidden]) .work-item');
  check('cell opens its work list', await page.locator('#worklist .work-item').count() === count);
  check('work list shows evidence quotes with locator', await page.locator('#worklist .evidence-quote').count() > 0 &&
    (await page.locator('#worklist .evidence-locator').first().innerText()).includes('Eintrag'));
  check('cell selection is in the URL', (await hashParams()).cell?.includes('|'));
  const selectedUrl = page.url();
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('#worklist:not([hidden]) .work-item');
  check('deep link restores the selected cell', page.url() === selectedUrl);
  await page.selectOption('#matrix-cols', 'AN_Harm_Types');
  await page.waitForFunction(() => location.hash.includes('AN_Harm_Types'));
  await page.goBack();
  await page.waitForFunction(() => location.hash.includes('AN_Bias_Axes'));
  check('browser back restores the previous axes', await page.inputValue('#matrix-cols') === 'AN_Bias_Axes');

  await page.goto(base + '/index.html#view=matrix&rows=AN_Prompt_Techniques&cols=AN_Mitigation_Status', { waitUntil: 'networkidle' });
  await visible('matrix');
  check('technique by status cells avoid joint-coding wording', !(await page.locator('button.matrix-cell[data-state="value"]').first().getAttribute('aria-label')).includes('gemeinsam'));
  await page.locator('button.matrix-cell').first().focus();
  await page.keyboard.press('Enter');
  await page.waitForSelector('#worklist:not([hidden])');
  check('keyboard opens a cell and moves focus to its work list', await page.evaluate(() => document.activeElement.id) === 'worklist-title');

  const workHref = await page.locator('#worklist .work-title a').first().getAttribute('href');
  await page.goto(base + '/index.html' + workHref, { waitUntil: 'networkidle' });
  await visible('werk');
  check('work detail shows its status prominently', (await page.locator('.werk-status').innerText()).includes('nicht fachlich verifiziert'));
  check('technical identity is collapsed at the end', await page.locator('.werk > details.werk-technical:last-child:not([open])').count() === 1);

  await page.goto(base + '/index.html#view=korpus', { waitUntil: 'networkidle' });
  await visible('korpus');
  check('korpus shows no counter before a user action', (await page.locator('#korpus-count').innerText()).trim() === '');
  await page.fill('#korpus-search', 'zzzz-no-match');
  await page.waitForSelector('#korpus-empty:not([hidden])');
  check('korpus search reports an empty result', (await page.locator('#korpus-count').innerText()).startsWith('0'));

  await page.goto(base + '/index.html#view=aussagen', { waitUntil: 'networkidle' });
  await visible('aussagen');
  const assertionCount = json('data/assertion_index.json').assertions.length;
  check('released assertions rendered', await page.locator('#assertion-list .assertion').count() === assertionCount);
  if (assertionCount) {
    check('assertion evidence quotes are visible directly', await page.locator('#assertion-list .evidence-quote').first().isVisible());
    await page.locator('.assertion-review').first().evaluate(node => { node.open = true; });
    check('agent and model are recorded', (await page.locator('.review-line').first().innerText()).includes('Modell'));
  }

  await page.goto(base + '/index.html#view=netz', { waitUntil: 'networkidle' });
  await visible('netz');
  check('network view renders a graph and its list equivalent', await page.locator('#netz-graph').count() === 1 && await page.locator('#netz-list').count() === 1);

  await page.goto(base + '/index.html#view=chat', { waitUntil: 'networkidle' });
  await visible('chat');
  await page.fill('#chat-input', 'zzzz-no-evidence');
  await page.locator('#chat-send').click();
  await page.waitForTimeout(300);
  check('no provider request for missing evidence', remote.length === 0);

  for (const path of ['data/screening/ar2.json', 'data/fulltext_manifest.json', 'docs/data/screening/ar2.json', 'data/promptotyping_v2.json']) {
    const response = await page.request.get(base + '/' + path);
    check('working data unavailable: ' + path, response.status() === 404);
  }
  mkdirSync('tests/browser/out/release', { recursive: true });
  await page.goto(base + '/index.html#view=matrix&rows=AN_Bias_Axes&cols=AN_Harm_Types', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'tests/browser/out/release/desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  for (const hash of ['#view=fragen', '#view=matrix&rows=AN_Bias_Axes&cols=AN_Harm_Types', '#view=frage&sq=2', '#view=netz', '#view=korpus']) {
    await page.goto(base + '/index.html' + hash, { waitUntil: 'networkidle' });
    check('mobile has no horizontal document overflow: ' + hash, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  }
  await page.screenshot({ path: 'tests/browser/out/release/mobile.png', fullPage: true });
  check('no browser runtime errors', errors.length === 0);
  check('no external runtime requests', remote.length === 0);
  if (errors.length) console.log(errors.join('\n'));
} finally {
  if (browser) await browser.close();
  await new Promise(done => server.close(done));
}
if (failures.length) throw new Error(failures.join('; '));
console.log('PASS source-reviewed result site');
