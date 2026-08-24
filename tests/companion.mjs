// Headless smoke tests for the Evidence Companion modules (research-app,
// kategorien, wissenschat). It loads the real docs/index.html into jsdom so every
// element id exists, mocks fetch with the on-disk data JSONs, and
// drives the render paths the refactor touched: data load, corpus table,
// delegated row click, category explorer, chat UI, and the EC helpers. The D3
// concept graph is out of scope here (no D3 in node); it stays a browser check.
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
};
const literatureLandscape = JSON.parse(
  readFileSync(join(root, dataFiles['data/literature_landscape.json']), 'utf8'),
);

const dom = new JSDOM(readFileSync(join(docs, 'index.html'), 'utf8'), {
  runScripts: 'dangerously',
  url: 'http://localhost/',
});
const { window } = dom;

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
['docs/js/research-app.js', 'docs/js/kategorien.js', 'docs/js/wissensnetz.js', 'docs/js/literaturbild.js', 'docs/js/wissenschat.js'].forEach(inject);

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

await check('literature landscape withholds records pending publication approval', async () => {
  window.switchView('literaturbild');
  await waitFor(() => doc.querySelector('#literaturbild-root .lit-empty-state') !== null, 'publication gate state');
  const progress = doc.querySelector('#literaturbild-root .lit-progress');
  if (!progress || !progress.textContent.includes('0 publikationsfreigegeben')) throw new Error('wrong public total');
  if (!progress.textContent.includes(`${literatureLandscape.meta.source_annotated_total} bearbeitet`)) throw new Error('wrong source total');
  if (!progress.textContent.includes(`${literatureLandscape.meta.withheld_total} zurückgehalten`)) throw new Error('wrong withheld total');
  if (!doc.querySelector('#literaturbild-root .lit-status--provisional')) throw new Error('pending status missing');
  if (!doc.querySelector('#literaturbild-root .lit-workspace > .lit-sidebar')) throw new Error('left control rail missing');
  if (doc.querySelectorAll('#literaturbild-root .lit-viz').length !== 1) throw new Error('multiple visualizations visible');
  if (doc.querySelector('#literaturbild-root .lit-stats')) throw new Error('legacy dashboard cards remain');
  if (doc.querySelector('.header-stats .stat-sep')) throw new Error('inventory separators remain');
  const visibleCopy = doc.querySelector('#literaturbild-root').textContent;
  if (visibleCopy.includes('Die Ansicht verdichtet') || visibleCopy.includes('Mehrfachcodierungen sind zulässig')) {
    throw new Error('removed explanatory copy remains visible');
  }
});

await check('literature landscape exposes no unapproved paper drill-down', async () => {
  window.switchView('literaturbild');
  if (doc.querySelector('.lit-matrix-button:not([disabled])')) throw new Error('unapproved matrix value exposed');
  if (doc.querySelector('.lit-results .lit-paper')) throw new Error('unapproved paper exposed');
  if (!doc.querySelector('.lit-empty-state')) throw new Error('publication gate explanation missing');
});

await check('literature landscape keeps controls operable while gated', async () => {
  const profile = doc.querySelector('.lit-view-button[data-lit-view="profile"]');
  profile.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  if (profile.getAttribute('aria-pressed') !== 'true') throw new Error('profile view not announced');
  if (doc.querySelector('.lit-matrix')) throw new Error('matrix remains visible in profile view');
  if (doc.querySelectorAll('#literaturbild-root .lit-viz').length !== 1) throw new Error('multiple profile views visible');
  if (doc.querySelector('.lit-profile-field').hidden) throw new Error('analysis field selector hidden');
  if (!doc.querySelector('.lit-empty-state')) throw new Error('publication gate state lost');
});

await check('literature landscape writes and restores its URL state', async () => {
  const profileField = doc.getElementById('lit-profile-field');
  profileField.value = 'AN_Bias_Axes';
  profileField.dispatchEvent(new window.Event('change', { bubbles: true }));
  await waitFor(() => window.location.hash.includes('litProfile=AN_Bias_Axes'), 'literature profile in hash');
  setHash('#view=literaturbild&litView=profile&litProfile=AN_Harm_Types');
  await waitFor(() => EC.store.get().litProfile === 'AN_Harm_Types', 'literature state restored');
  if (!doc.querySelector('.lit-view-button[data-lit-view="profile"]').classList.contains('active')) {
    throw new Error('profile view not restored');
  }
  if (doc.getElementById('lit-filter-year').value !== 'all') throw new Error('empty year filter changed');
  if (profileField.value !== 'AN_Harm_Types') throw new Error('profile field not restored');
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
  doc.getElementById('chat-input').value = 'Testfrage';
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
