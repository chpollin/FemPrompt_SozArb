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
check('model: pipeline coverage follows the data contract', piped.withheld === 3 && piped.not_coded === 1 && piped.absent === 1 &&
  withPipeline.codedSummary([], ['AN_Bias_Axes'], true).total === 12 &&
  withPipeline.codedSummary([], ['AN_Bias_Axes'], true).coded === 7);
const realCoverage = landscape.meta && landscape.meta.analysis_coverage;
check('model: the published coverage block is readable', !realCoverage ||
  EC.createModel({ schema, fields, landscape }).pipelineCoverage('AN_Bias_Axes') !== null);
check('model: pipeline coverage absent falls back', fixture.pipelineCoverage('AN_Bias_Axes') === null);
check('model: open pipeline coding makes a zero undeterminable', !withPipeline.codingComplete([], 'AN_Bias_Axes'));
const completeCoverage = EC.createModel({ schema, fields, landscape: { meta: { analysis_coverage: {
  scope: { work_total: 1 },
  fields: { AN_Bias_Axes: { value: 1, none: 0, undecidable: 0, absent: 0, not_coded: 0, withheld: 0 } } } }, records: [
  fixtureRecord('DONE', { fields: { AN_Bias_Axes: ['Gender'] }, undecidable: [] })] } });
check('model: complete coding allows a zero', completeCoverage.codingComplete(completeCoverage.includes, 'AN_Bias_Axes'));
check('model: a scope beyond the released works keeps category groups open', !EC.createModel({ schema, fields, landscape: { meta: {
  analysis_coverage: { scope: { work_total: 5 }, fields: {} } }, records: [fixtureRecord('ONE', { fields: {}, undecidable: [] })] } })
  .codingComplete([], 'perspective'));
const labelled = EC.createModel({ schema, landscape: { meta: {}, records: [] }, fields: { study_types: [], fields: [
  { name: 'AN_Bias_Axes', multi: true, values: ['Gender', 'None'], label: 'Bias-Achsen', definition: 'Achsen der Benachteiligung',
    value_labels: { Gender: 'Geschlecht' }, value_definitions: { Gender: 'Bias nach Geschlecht' } }] } });
check('model: pipeline labels and definitions take precedence', labelled.dim('AN_Bias_Axes').label === 'Bias-Achsen' &&
  labelled.dim('AN_Bias_Axes').definition === 'Achsen der Benachteiligung' &&
  labelled.dim('AN_Bias_Axes').valueLabel('Gender') === 'Geschlecht' &&
  labelled.dim('AN_Bias_Axes').valueDefinition('Gender') === 'Bias nach Geschlecht');
check('model: search covers codes', fixture.works.filter(w => w.search.includes(EC.fold('Evaluated'))).length === 1);
const duplicated = EC.createModel({ schema, fields, assertions: { assertions: [] }, release: { papers: [], meta: {} },
  landscape: { meta: {}, source: {}, records: [fixtureRecord('DUP', { fields: {}, undecidable: [] }, [{ key: 'Gender', level: 2, evidence: [
    { term: 'gap', snippet: 'a gender gap', source_record_id: 'A' }, { term: 'gap', snippet: 'a  gender gap', source_record_id: 'B' }] }])] } });
check('model: one passage from two records is shown once', duplicated.categoryEvidence(duplicated.workById('work:DUP'), 'Gender').length === 1);
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
  const verifiedWorks = landscape.records.filter(r => r.decision === 'Include' && (r.verification || r.publication_approval)).length;
  check('start page states the expert verification state', verifiedWorks > 0 ||
    (await page.locator('.sq-item .denominator--summary').first().innerText()).includes('noch keines fachlich verifiziert'));
  await page.keyboard.press('Tab');
  check('skip link is the first tab stop', await page.evaluate(() => document.activeElement.classList.contains('skip-link')));
  const hashBeforeSkip = await page.evaluate(() => location.hash);
  await page.keyboard.press('Enter');
  check('skip link keeps the view and focuses its heading', await page.evaluate(() => location.hash) === hashBeforeSkip &&
    await page.evaluate(() => document.activeElement.id === 'fragen-title'));
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
  check('answer page has Befunde, Matrix, Offen and Werke', await answer.locator('#frage-befunde, #frage-matrix, #frage-offen, #frage-werke').count() === 4);
  check('Offen opens with what is not yet determinable', await answer.locator('#frage-offen > h2 + p.open-limits').count() === 1);
  check('tab title equals the page heading', (await page.title()).startsWith((await answer.locator('h1').innerText()).trim()));
  check('every answer matrix carries a visible joint-coding caption', await answer.locator('.matrix-table').count() ===
    await answer.locator('p.matrix-caption:visible').count());
  check('answer work lists show no leading separator', (await answer.locator('.work-meta').allInnerTexts()).every(t => !/^\s*·/.test(t)));
  check('answer map cells link to the matrix', (await answer.locator('a.matrix-cell').first().getAttribute('href')).includes('view=matrix'));
  const statusLabel = fields.fields.find(field => field.name === 'AN_Mitigation_Status').label;
  check('work-level status is named as the work\'s status', (await answer.locator('.answer-map h3').allInnerTexts()).some(text => text.includes(statusLabel + ' des Werks')));
  check('answer page never claims an answered question', !/beantwortet/i.test(await answer.innerText()));
  if (json('data/assertion_index.json').assertions.length) {
    check('assertion evidence names the screening state of its work', await answer.locator('.evidence-item').count() ===
      await answer.locator('.evidence-item .screening-state').count());
  }
  await page.goto(base + '/index.html#view=frage&sq=1', { waitUntil: 'networkidle' });
  await visible('frage');
  // Labels come from the projected vocabulary, so the check follows any relabelling.
  const populationField = fields.fields.find(field => field.name === 'AN_Population');
  const populationLabel = populationField.label || 'Population';
  const notSpecific = (populationField.value_labels || {}).Not_SW_Specific || 'Not SW Specific';
  const populationOf = selector => page.locator(selector).evaluateAll((items, label) => items.map(item =>
    Array.from(item.querySelectorAll('.code-row')).find(row => row.querySelector('dt').textContent === label).querySelector('dd').textContent), populationLabel);
  const outsideRows = await populationOf('#frage-werke .outside-group .work-item');
  const mainRows = await populationOf('#frage-werke > .worklist .work-item');
  check('SQ1 lists works coded only as not specific to social work apart', outsideRows.every(t => t === notSpecific) &&
    mainRows.every(t => t !== notSpecific) && (outsideRows.length === 0 ||
    (await page.locator('#frage-outside-title').innerText()).includes('Nicht spezifisch für die Soziale Arbeit')));

  await page.goto(base + '/index.html#view=matrix&rows=perspective&cols=AN_Bias_Axes', { waitUntil: 'networkidle' });
  await visible('matrix');
  check('matrix denominator precedes the table', (await page.locator('#matrix-denominator .denominator--summary').innerText()).includes('von'));
  const pendingCoding = Object.values((landscape.meta.analysis_coverage || {}).fields || {}).some(f => f.not_coded + f.withheld > 0);
  check('empty cells read n. b. while included works are not coded', !pendingCoding ||
    (await page.locator('#matrix-table td.matrix-empty[data-state="zero"]').count() === 0 &&
     (await page.locator('#matrix-table td.matrix-empty > span[aria-hidden="true"]').first().innerText()).trim() === 'n. b.'));
  check('the not-coded row holds released works only', await page.locator('#matrix-table th[data-row="__absent"]').count() === 0 ||
    await page.locator('#matrix-table [data-row="__absent"][data-count]:not([data-count="0"])').count() > 0);
  check('no dash mark next to counts', !(await page.locator('#matrix-table').innerText()).includes('–'));
  check('matrix caption is visible', (await page.locator('#matrix-denominator p.matrix-caption').innerText()).includes('Gemeinsam codiert'));
  check('axis lines do not repeat the denominator', (await page.locator('#matrix-denominator .denominator[data-axis]').allInnerTexts())
    .every(t => !/Include|eingeschlossen/.test(t)));
  check('review-status filter is hidden while one status exists', new Set(landscape.records.map(r => Boolean(r.verification || r.publication_approval))).size > 1 ||
    await page.locator('#matrix-status').isHidden());
  const cell = page.locator('button.matrix-cell[data-state="value"]').first();
  const count = Number(await cell.getAttribute('data-count'));
  check('cells state joint coding', (await cell.getAttribute('aria-label')).includes('gemeinsam codiert'));
  await cell.click();
  await page.waitForSelector('#worklist:not([hidden]) .work-item');
  check('cell opens its work list', await page.locator('#worklist .work-item').count() === count);
  check('work list shows evidence quotes with their text basis', await page.locator('#worklist .evidence-quote').count() > 0 &&
    /Volltext|Abstract|Textgrundlage/.test(await page.locator('#worklist .evidence-locator').first().innerText()));
  check('work list shows the cell codes and no coding note', await page.locator('#worklist .work-item .code-list').count() === count &&
    await page.locator('#worklist .evidence-note').count() === 0);
  check('work list keeps record keys out of view', !/Eintrag/.test(await page.locator('#worklist').innerText()));
  check('cell selection is in the URL', (await hashParams()).cell?.includes('|'));
  const selectedUrl = page.url();
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('#worklist:not([hidden]) .work-item');
  check('deep link restores the selected cell', page.url() === selectedUrl);
  check('deep link into an open list focuses its heading', await page.evaluate(() => document.activeElement.id) === 'worklist-title');
  await page.selectOption('#matrix-cols', 'AN_Harm_Types');
  await page.waitForFunction(() => location.hash.includes('AN_Harm_Types'));
  await page.goBack();
  await page.waitForFunction(() => location.hash.includes('AN_Bias_Axes'));
  check('browser back restores the previous axes', await page.inputValue('#matrix-cols') === 'AN_Bias_Axes');
  await page.waitForSelector('#worklist:not([hidden])');
  check('back into an open list focuses its heading', await page.evaluate(() => document.activeElement.id) === 'worklist-title');

  await page.goto(base + '/index.html#view=matrix&rows=AN_Prompt_Techniques&cols=AN_Mitigation_Status', { waitUntil: 'networkidle' });
  await visible('matrix');
  check('technique by status cells avoid joint-coding wording', !(await page.locator('button.matrix-cell[data-state="value"]').first().getAttribute('aria-label')).includes('gemeinsam'));
  await page.locator('button.matrix-cell').first().focus();
  await page.keyboard.press('Enter');
  await page.waitForSelector('#worklist:not([hidden])');
  check('keyboard opens a cell and moves focus to its work list', await page.evaluate(() => document.activeElement.id) === 'worklist-title');
  const openCell = await page.evaluate(() => new URLSearchParams(location.hash.slice(1)).get('cell'));
  const [openRow, openCol] = openCell.split('|');
  await page.locator(`button.matrix-cell[data-row="${openRow}"][data-col="${openCol}"]`).click();
  await page.waitForSelector('#worklist[hidden]', { state: 'attached' });
  check('closing a cell returns focus to that cell', await page.evaluate(() =>
    document.activeElement.matches('button.matrix-cell') && document.activeElement.dataset.row + '|' + document.activeElement.dataset.col) === openCell);
  await page.locator(`button.matrix-cell[data-row="${openRow}"][data-col="${openCol}"]`).click();
  await page.waitForSelector('#worklist:not([hidden])');

  const workHref = await page.locator('#worklist .work-title a').first().getAttribute('href');
  await page.goto(base + '/index.html' + workHref, { waitUntil: 'networkidle' });
  await visible('werk');
  check('work detail shows its status prominently', (await page.locator('.werk-status').innerText()).includes('nicht fachlich verifiziert'));
  check('technical identity is collapsed at the end', await page.locator('.werk > details.werk-technical:last-child:not([open])').count() === 1);
  check('coding note is collapsed rationale, not a quotation', await page.locator('.werk .evidence-note').count() === 0 &&
    (await page.locator('.werk details.rationale-record').count() === 0 ||
     (await page.locator('.werk details.rationale-record:not([open]) summary').innerText()).includes('kein Beleg')));
  const quoteRows = await page.locator('.werk .code-row').evaluateAll(rows => rows.map(row =>
    Array.from(row.querySelectorAll('.evidence-quote')).map(q => q.textContent.replace(/\s+/g, ' ').trim())));
  check('no category quotation is shown twice', quoteRows.every(q => new Set(q).size === q.length));
  check('highlights end on word boundaries', (await page.locator('.werk .evidence-quote').evaluateAll(quotes => quotes.every(q => {
    const mark = q.querySelector('mark');
    if (!mark) return true;
    const next = mark.nextSibling ? mark.nextSibling.textContent[0] || '' : '';
    return !(/[\p{L}\p{N}]/u.test(next) && /[\p{L}\p{N}]/u.test(mark.textContent.slice(-1)));
  }))));
  check('work page shows dates and agents in plain words', !/\/root\//.test(await page.locator('.werk').evaluate(node => {
    const clone = node.cloneNode(true);
    clone.querySelectorAll('details').forEach(d => d.remove());
    return clone.textContent;
  })));

  await page.goto(base + '/index.html#view=korpus', { waitUntil: 'networkidle' });
  await visible('korpus');
  check('korpus shows no counter before a user action', (await page.locator('#korpus-count').innerText()).trim() === '');
  check('facet options carry no counts without a search or filter', (await page.locator('#korpus-root select option').allInnerTexts())
    .every(t => !/\(\d+\)$/.test(t.trim())));
  await page.fill('#korpus-search', 'Not_SW_Specific');
  await page.waitForFunction(() => document.getElementById('korpus-count').textContent.trim() !== '');
  check('korpus search covers codes', await page.locator('#korpus-list .korpus-item').count() > 0);
  check('facet options count while a search is active', (await page.locator('#korpus-decision option').allInnerTexts()).some(t => /\(\d+\)$/.test(t.trim())));
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
    check('review dates are German and agents named by role', /geprüft am \d{2}\.\d{2}\.\d{4}/.test(await page.locator('.review-line').first().innerText()) &&
      !/\/root\//.test(await page.locator('.review-line').first().innerText()));
  }

  await page.goto(base + '/index.html#view=netz', { waitUntil: 'networkidle' });
  await visible('netz');
  check('network view renders a graph and its list equivalent', await page.locator('#netz-graph').count() === 1 && await page.locator('#netz-list').count() === 1);
  check('network figure is a named, focusable scroll region', await page.locator('#netz-figure[role="region"][tabindex="0"][aria-label]').count() === 1);
  check('network neighbours exclude process fields', await page.locator('#netz-fields input[value="AN_Coding_Basis"], #netz-fields input[value="object"], #netz-fields input[value="perspective"]').count() === 0);
  check('network heading keeps term and field apart', /\S, \S/.test(await page.locator('#netz-heading').evaluate(node => node.textContent)));
  check('network states its denominator', (await page.locator('#netz-summary .denominator--summary').innerText()).includes('eingeschlossenen Werken codiert'));

  await page.goto(base + '/index.html#view=chat', { waitUntil: 'networkidle' });
  await visible('chat');
  check('chat heading names its function', (await page.locator('#chat-title').innerText()).trim() === 'Fragen an die veröffentlichten Aussagen');
  check('chat input has a label', await page.locator('label[for="chat-input"]').count() === 1);
  check('chat send button is named and its icon hidden', await page.getAttribute('#chat-send', 'aria-label') === 'Senden' &&
    await page.locator('#chat-send i[aria-hidden="true"]').count() === 1);
  check('chat messages form a log', await page.getAttribute('#chat-messages', 'role') === 'log');
  check('chat carries no standing explanatory paragraph', await page.locator('.chat-welcome > p').count() === 0);
  await page.fill('#chat-input', 'zzzz-no-evidence');
  await page.locator('#chat-send').click();
  await page.waitForTimeout(300);
  check('no provider request for missing evidence', remote.length === 0);
  check('local chat notices are set apart from model answers', await page.locator('.chat-msg-local').count() === 1);

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
  const chatBox = await page.evaluate(async () => {
    location.hash = '#view=chat';
    await new Promise(done => setTimeout(done, 200));
    const win = document.querySelector('.chat-window').getBoundingClientRect();
    return ['#chat-input', '#chat-send', '#gemini-key'].every(sel => {
      const box = document.querySelector(sel).getBoundingClientRect();
      return box.left >= win.left - 1 && box.right <= win.right + 1;
    });
  });
  check('chat input and buttons fit at 390 px', chatBox);
  await page.setViewportSize({ width: 320, height: 720 });
  for (const hash of ['#view=werk&id=' + encodeURIComponent(landscape.records.find(r => r.decision === 'Include').work_id), '#view=fragen',
    '#view=frage&sq=3', '#view=korpus', '#view=aussagen', '#view=methode', '#view=chat']) {
    await page.goto(base + '/index.html' + hash, { waitUntil: 'networkidle' });
    check('320 px reflow without horizontal scrolling: ' + hash.split('&')[0], await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  }
  check('no browser runtime errors', errors.length === 0);
  check('no external runtime requests', remote.length === 0);
  if (errors.length) console.log(errors.join('\n'));
} finally {
  if (browser) await browser.close();
  await new Promise(done => server.close(done));
}
if (failures.length) throw new Error(failures.join('; '));
console.log('PASS source-reviewed result site');
