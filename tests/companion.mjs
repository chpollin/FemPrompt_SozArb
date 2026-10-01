// Headless smoke tests for the Evidence Companion modules (research-app,
// kategorien, wissenschat, and the release modules hosted by research-app). It loads
// the real docs/index.html into jsdom so every element id exists, mocks fetch with the
// on-disk data JSONs, and drives the render paths: data load, corpus table, delegated
// row click, category explorer, the integrated Literaturbild matrix, Wissensnetz,
// answer and work views under the one router, chat UI, and the EC helpers.
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const docs = join(root, 'docs');

const dataFiles = {
  'data/research_vault_v2.json': 'docs/data/research_vault_v2.json',
  'data/category_schema.json': 'docs/data/category_schema.json',
  'data/concept_graph.json': 'docs/data/concept_graph.json',
  'data/promptotyping_v2.json': 'docs/data/promptotyping_v2.json',
  'data/literature_landscape.json': 'docs/data/literature_landscape.json',
  'data/assertion_index.json': 'docs/data/assertion_index.json',
  'data/analysis_fields.json': 'docs/data/analysis_fields.json',
};
const literatureLandscape = JSON.parse(
  readFileSync(join(root, dataFiles['data/literature_landscape.json']), 'utf8'),
);

const dom = new JSDOM(readFileSync(join(docs, 'index.html'), 'utf8'), {
  runScripts: 'dangerously',
  url: 'http://localhost/',
});
const { window } = dom;

// jsdom lacks layout and media queries; the network and the focus handling call them.
window.matchMedia = () => ({ matches: false, addEventListener() {} });
window.Element.prototype.scrollIntoView = function () {};
// Counts hashchange listeners, so the test sees that research-app is the only router.
let hashchangeListeners = 0;
const addListener = window.addEventListener.bind(window);
window.addEventListener = (type, ...rest) => {
  if (type === 'hashchange') hashchangeListeners += 1;
  return addListener(type, ...rest);
};

// fetch mock: serve the data JSONs from disk, 404 anything else (knowledge docs
// are only fetched on a download click, which the smoke run does not exercise).
window.fetch = (url) => {
  const rel = dataFiles[url];
  if (!rel) return Promise.resolve({ ok: false, status: 404, json: () => Promise.reject(new Error('404')), text: () => Promise.resolve('') });
  const body = readFileSync(join(root, rel), 'utf8');
  return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(JSON.parse(body)), text: () => Promise.resolve(body) });
};

function inject(rel) {
  const el = window.document.createElement('script');
  el.textContent = readFileSync(join(root, rel), 'utf8');
  window.document.body.appendChild(el);
}
[...readFileSync(join(docs, 'index.html'), 'utf8').matchAll(/<script src="(js\/[^"]+)"><\/script>/g)]
  .map((match) => 'docs/' + match[1]).forEach(inject);

// research-app initializes on DOMContentLoaded. jsdom fires that event once after
// these scripts are appended, so the listener runs exactly once; dispatching it
// here as well would double-init and attach the delegated listeners twice.

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Drive a URL restore the way a browser delivers one: set the hash without firing
// events (replaceState), then dispatch a real hashchange. jsdom's location.hash setter
// also fires a spurious popstate, which double-triggers the app's two restore listeners;
// this avoids that artifact and exercises exactly the hashchange path.
function setHash(h) {
  window.history.replaceState(null, '', window.location.pathname + h);
  window.dispatchEvent(new window.Event('hashchange'));
}

async function waitFor(predicate, label, timeoutMs = 2000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await sleep(10);
  }
  throw new Error(`timeout waiting for ${label}`);
}

const results = [];
async function check(name, fn) {
  try { await fn(); results.push({ name, ok: true }); }
  catch (e) { results.push({ name, ok: false, err: e.message }); }
}

const doc = window.document;
const EC = window.EC;

await check('data loaded into EC', async () => {
  await waitFor(() => EC && EC.getAllPapers().length > 0, 'papers');
});

await check('corpus table renders rows', async () => {
  EC.applyFilters();
  await waitFor(() => doc.querySelectorAll('#papers-grid tr[data-idx]').length > 0, 'rows');
});

await check('delegated row click opens the detail panel', async () => {
  const row = doc.querySelector('#papers-grid tr[data-idx]');
  row.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await waitFor(() => doc.getElementById('paper-modal').classList.contains('active'), 'modal active');
  if (!doc.getElementById('modal-body').innerHTML.trim()) throw new Error('modal body empty');
  EC.closePaperModal();
});

await check('EC.navigateToPaper opens a paper by id', async () => {
  const id = EC.getAllPapers()[0].id;
  const ok = EC.navigateToPaper(id);
  if (!ok) throw new Error('navigateToPaper returned false');
  if (!doc.getElementById('paper-modal').classList.contains('active')) throw new Error('modal not active');
  EC.closePaperModal();
});

await check('EC helpers behave', async () => {
  if (EC.catLabel('Bias_Ungleichheit') !== 'Bias & Ungleichheit') throw new Error('catLabel');
  const s = EC.paperStatus({ benchmark: { has_human: true, agreement: false }, human: { decision: 'Exclude' } });
  if (s.cls !== 'diverge') throw new Error('paperStatus cls ' + s.cls);
});

await check('category chip toggles active (delegation)', async () => {
  const chip = doc.querySelector('.category-chip[data-cat]');
  if (!chip) throw new Error('no category chip');
  chip.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await waitFor(() => doc.querySelector('.category-chip.active') !== null, 'chip active');
});

await check('category explorer initializes on view switch', async () => {
  window.switchView('vergleich');
  await waitFor(() => doc.querySelectorAll('#kategorie-spektrum .kategorie-card').length > 0, 'spektrum cards');
  const card = doc.querySelector('.kategorie-card[data-cat]');
  card.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await waitFor(() => doc.querySelector('#kategorie-detail .kdetail-header') !== null, 'detail rendered');
});

await check('one router: only research-app listens to hashchange', async () => {
  if (hashchangeListeners !== 1) throw new Error('hashchange listeners: ' + hashchangeListeners);
  if (typeof EC.host.go !== 'function' || typeof EC.release.render !== 'function') throw new Error('host seam missing');
  if (doc.getElementById('literaturbild-root') || doc.getElementById('graph-container')) throw new Error('old view containers remain');
});

await check('start cards open the answer pages', async () => {
  const hrefs = [...doc.querySelectorAll('#view-start .start-card')].map((a) => a.getAttribute('href'));
  if (hrefs.join(' ') !== '#view=frage&sq=1 #view=frage&sq=2 #view=frage&sq=3 #view=frage&sq=4') throw new Error(hrefs.join(' '));
});

await check('Literaturbild shows the joint-coding matrix under its denominators', async () => {
  window.switchView('literaturbild');
  await waitFor(() => doc.querySelector('#view-literaturbild #matrix-table') !== null, 'matrix');
  const summary = doc.querySelector('#matrix-denominator > .denominator--summary');
  if (!summary || !/\d+ von \d+ eingeschlossenen Werken/.test(summary.textContent)) throw new Error('summary line missing');
  if (doc.querySelector('#matrix-denominator').compareDocumentPosition(doc.getElementById('matrix-table')) !== window.Node.DOCUMENT_POSITION_FOLLOWING) {
    throw new Error('denominator does not precede the table');
  }
  if (!/Gemeinsam codiert|Werke je Code/.test(doc.querySelector('#matrix-denominator .matrix-caption').textContent)) throw new Error('caption missing');
  const pending = Object.values((literatureLandscape.meta.analysis_coverage || {}).fields || {}).some((f) => f.not_coded + f.withheld > 0);
  if (pending && doc.querySelector('#matrix-table td.matrix-empty[data-state="zero"]')) throw new Error('a zero stands while coding is open');
  if (pending && !doc.querySelector('#matrix-table td.matrix-empty[data-state="undetermined"]')) throw new Error('no n. b. cell');
  if (doc.querySelector('#tab-literaturbild').getAttribute('aria-pressed') !== 'true') throw new Error('tab not pressed');
});

await check('a matrix cell opens its work list and writes the hash', async () => {
  const cell = doc.querySelector('#matrix-table button.matrix-cell[data-state="value"]');
  cell.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await waitFor(() => !doc.getElementById('worklist').hidden, 'work list');
  const hash = new URLSearchParams(window.location.hash.slice(1));
  if (hash.get('view') !== 'literaturbild' || hash.get('cell') !== cell.dataset.row + '|' + cell.dataset.col) throw new Error('hash ' + window.location.hash);
  if (doc.querySelectorAll('#worklist .work-item').length !== Number(cell.dataset.count)) throw new Error('work count');
  if (doc.activeElement.id !== 'worklist-title') throw new Error('focus not on the work list');
  if (/Eintrag|\/root\//.test(doc.getElementById('worklist').textContent)) throw new Error('internal keys in the work list');
  if (doc.querySelector('#worklist .evidence-note')) throw new Error('coding note in the work list');
});

await check('corpus filters stay out of release view hashes and survive them', async () => {
  window.switchView('korpus');
  const sel = doc.getElementById('filter-decision');
  sel.value = 'Exclude';
  sel.dispatchEvent(new window.Event('change', { bubbles: true }));
  await waitFor(() => window.location.hash.includes('dec=Exclude'), 'korpus filter in hash');
  window.switchView('literaturbild');
  if (window.location.hash.includes('dec=')) throw new Error('corpus filter leaked: ' + window.location.hash);
  if (!window.location.hash.includes('cell=')) throw new Error('tab did not restore the last matrix state');
  window.switchView('korpus');
  if (!window.location.hash.includes('dec=Exclude')) throw new Error('corpus filter lost: ' + window.location.hash);
  sel.value = 'all';
  sel.dispatchEvent(new window.Event('change', { bubbles: true }));
});

await check('a matrix deep link restores axes and cell', async () => {
  setHash('#view=literaturbild&cols=AN_Bias_Axes&rows=perspective');
  await waitFor(() => doc.getElementById('matrix-cols').value === 'AN_Bias_Axes', 'axes restored');
  if (doc.getElementById('matrix-rows').value !== 'perspective') throw new Error('rows not restored');
  if (!doc.getElementById('worklist').hidden) throw new Error('a work list is open without a cell');
});

await check('Wissensnetz shows the ego network with its table and denominator', async () => {
  setHash('#view=wissensnetz');
  await waitFor(() => doc.querySelector('#view-wissensnetz #netz-list') !== null, 'network table');
  if (!doc.querySelector('#netz-graph')) throw new Error('no network figure');
  if (!/eingeschlossenen Werken codiert/.test(doc.querySelector('#netz-summary .denominator--summary').textContent)) throw new Error('no denominator');
  const edge = doc.querySelector('#netz-list button.netz-show-works');
  edge.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await waitFor(() => !doc.getElementById('worklist-netz').hidden, 'edge work list');
  if (!new URLSearchParams(window.location.hash.slice(1)).get('edge')) throw new Error('edge not in hash');
});

await check('answer page per sub-question leads with the denominator', async () => {
  setHash('#view=frage&sq=3');
  await waitFor(() => doc.querySelector('#frage-root .answer[data-sq="3"]') !== null, 'answer page');
  if (!doc.querySelector('#frage-root h1 + .denominator--summary')) throw new Error('summary not under the heading');
  if (doc.querySelectorAll('#frage-befunde, #frage-matrix, #frage-offen, #frage-werke').length !== 4) throw new Error('answer parts');
  const cellLink = doc.querySelector('#frage-root a.matrix-cell');
  if (cellLink && !cellLink.getAttribute('href').startsWith('#view=literaturbild&')) throw new Error('cell link ' + cellLink.getAttribute('href'));
  if (/beantwortet/i.test(doc.getElementById('frage-root').textContent)) throw new Error('claims an answered question');
});

await check('work view opens from a work list with a collapsed review record', async () => {
  const link = doc.querySelector('#frage-werke .work-title a');
  if (!link.getAttribute('href').startsWith('#view=werk&id=')) throw new Error('work link ' + link.getAttribute('href'));
  setHash(link.getAttribute('href'));
  await waitFor(() => doc.querySelector('#werk-root .werk') !== null, 'work view');
  if (!doc.querySelector('#werk-root .werk > details.werk-technical:last-child:not([open])')) throw new Error('review record not collapsed');
  if (doc.querySelector('.nav-view-btn[aria-pressed="true"]')) throw new Error('a tab is pressed on the work view');
});

await check('chat UI builds without network', async () => {
  window.switchView('chat');
  if (!doc.getElementById('chat-input')) throw new Error('no chat input');
  if (!doc.getElementById('chat-send')) throw new Error('no chat send');
});

// Regression guard: a failed request must leave a visible .chat-error banner.
// The Gemini URL is unknown to the fetch mock, so it takes the !ok error path.
await check('chat error banner survives a failed request', async () => {
  window.switchView('chat');
  doc.getElementById('gemini-key').value = 'AIzaTEST';
  doc.getElementById('chat-input').value = 'AI literacy social work';
  doc.getElementById('chat-send').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await waitFor(() => doc.querySelector('#chat-messages .chat-error') !== null, 'error banner');
  // It must persist, not be wiped by a re-render in the same path.
  await sleep(30);
  if (!doc.querySelector('#chat-messages .chat-error')) throw new Error('error banner was wiped');
});

// URL state: a pasted link restores view, filter, category and the open paper.
await check('URL hash restores view, filter, category and paper', async () => {
  const p0 = EC.getAllPapers()[0];
  setHash('#view=korpus&dec=Include&cat=Gender&paper=' + encodeURIComponent(p0.id));
  await waitFor(() => EC.store.get().view === 'korpus' && EC.store.get().paper === p0.id, 'store restored');
  if (doc.getElementById('filter-decision').value !== 'Include') throw new Error('decision filter not applied');
  const genderChip = doc.querySelector('.category-chip[data-cat="Gender"]');
  if (!genderChip || !genderChip.classList.contains('active')) throw new Error('Gender chip not active');
  if (!doc.getElementById('view-korpus').classList.contains('active')) throw new Error('korpus view not active');
  if (!doc.getElementById('paper-modal').classList.contains('active')) throw new Error('paper modal not open');
  if (doc.getElementById('modal-title').textContent !== p0.title) throw new Error('wrong paper restored');
});

// URL state: a UI filter change is mirrored back into the hash.
await check('UI filter change writes the hash', async () => {
  const sel = doc.getElementById('filter-decision');
  sel.value = 'Exclude';
  sel.dispatchEvent(new window.Event('change', { bubbles: true }));
  await waitFor(() => EC.store.get().dec === 'Exclude', 'store updated');
  if (window.location.hash.indexOf('dec=Exclude') < 0) throw new Error('hash missing dec=Exclude: ' + window.location.hash);
});

// URL state: closing the paper drops it from the hash (currentDetailPaper reset).
await check('closing the paper clears it from the hash', async () => {
  EC.closePaperModal();
  await waitFor(() => EC.store.get().paper === null, 'paper cleared');
  if (window.location.hash.indexOf('paper=') >= 0) throw new Error('paper still in hash: ' + window.location.hash);
});

// URL state: a restored paper highlights its own rendered row (the list passed to
// showPaperDetail must share the table's index space, not allPapers).
await check('restored paper highlights the correct rendered row', async () => {
  setHash('#view=korpus');
  await waitFor(() => doc.querySelectorAll('#papers-grid tr[data-idx]').length > 0 && EC.store.get().paper === null, 'clean korpus');
  const firstTitle = doc.querySelector('#papers-grid tr[data-idx] .col-title').getAttribute('title');
  const target = EC.getAllPapers().find((p) => p.title === firstTitle);
  if (!target) throw new Error('could not resolve first rendered paper');
  setHash('#view=korpus&paper=' + encodeURIComponent(target.id));
  await waitFor(() => EC.store.get().paper === target.id, 'paper restored');
  const active = doc.querySelector('.papers-table tr.row--active .col-title');
  if (!active) throw new Error('no row highlighted for restored paper');
  if (active.getAttribute('title') !== firstTitle) throw new Error('highlighted the wrong row: ' + active.getAttribute('title'));
});

// URL state: an unknown category key is dropped, not applied (a bad cat= would
// otherwise filter every paper out and leave an unexplained empty corpus).
await check('unknown cat= is ignored, corpus stays populated', async () => {
  setHash('#view=korpus&cat=Bogus');
  await waitFor(() => EC.store.get().view === 'korpus' && EC.store.get().cat.length === 0, 'restored');
  if (EC.store.get().cat.length !== 0) throw new Error('bogus cat kept in store: ' + EC.store.get().cat);
  if (doc.querySelectorAll('#papers-grid tr[data-idx]').length === 0) throw new Error('corpus emptied by a bogus cat');
  if (doc.querySelector('.category-chip.active')) throw new Error('a chip is active for a bogus cat');
});

// URL state: a stale/unknown paper id is cleaned out of both store and hash, not left
// claiming a selection that is not open.
await check('unknown paper= id does not linger in store or hash', async () => {
  setHash('#view=korpus&paper=THIS_ID_DOES_NOT_EXIST');
  await waitFor(() => EC.store.get().view === 'korpus' && EC.store.get().paper === null, 'restored');
  if (EC.store.get().paper !== null) throw new Error('dead paper kept in store: ' + EC.store.get().paper);
  if (doc.getElementById('paper-modal').classList.contains('active')) throw new Error('modal open for a nonexistent paper');
  if (window.location.hash.indexOf('paper=') >= 0) throw new Error('dead paper kept in hash: ' + window.location.hash);
});

const pass = results.filter((r) => r.ok).length;
for (const r of results) if (!r.ok) console.log('FAIL  ' + r.name + '  >>  ' + r.err);
console.log(`\n${pass === results.length ? 'PASS' : 'FAIL'} ${pass}/${results.length} Companion smoke tests`);
process.exit(pass === results.length ? 0 : 1);
