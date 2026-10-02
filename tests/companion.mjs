// Headless smoke tests for the Evidence Companion modules (research-app,
// kategorien, wissenschat, and the release modules hosted by research-app). It loads
// the real docs/index.html into jsdom so every element id exists, mocks fetch with the
// on-disk data JSONs, and drives the render paths: data load, corpus table, delegated
// row click, Landkarte lenses, the integrated Literaturbild matrix, Wissensnetz, Begriffsnetz,
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
[...readFileSync(join(docs, 'index.html'), 'utf8').matchAll(/<script (?:defer )?src="(js\/[^"]+)"><\/script>/g)]
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
  const chip = doc.querySelector('#category-chips .category-chip[data-cat]');
  if (!chip) throw new Error('no category chip');
  chip.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await waitFor(() => doc.querySelector('#category-chips .category-chip[aria-pressed="true"]') !== null, 'chip active');
});

await check('category chips share one grouped markup', async () => {
  const labels = [...doc.querySelectorAll('#category-chips .chip-group-label')].map((n) => n.textContent);
  if (labels.join('|') !== 'Gegenstand|Perspektive') throw new Error(labels.join('|'));
  const chips = [...doc.querySelectorAll('#category-chips .category-chip')];
  if (chips.some((c) => !c.style.getPropertyValue('--chip-color') || !c.hasAttribute('aria-pressed') || c.querySelector('.chip-dot[style]'))) {
    throw new Error('chip markup deviates from the shared contract');
  }
});

await check('the Landkarte initializes on view switch and replaces the old category explorer', async () => {
  window.switchView('vergleich');
  await waitFor(() => doc.querySelectorAll('#landkarte button.lk-cell').length === 24, 'landkarte cells');
  if (doc.getElementById('kategorie-spektrum') || doc.getElementById('kategorie-detail')) throw new Error('old explorer remains');
});

await check('a Landkarte cell lists its works and a lens re-encodes the map, both kept in the store', async () => {
  const button = doc.querySelector('#landkarte button.lk-cell');
  button.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  const items = doc.querySelectorAll('#landkarte-detail .lk-item');
  if (button.getAttribute('aria-pressed') !== 'true' || items.length !== Number(button.dataset.value)) {
    throw new Error('list ' + items.length + ' for value ' + button.dataset.value);
  }
  doc.querySelector('#landkarte .lk-lens[data-lens="einschluss"]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  if (!button.querySelector('.lk-val').textContent.endsWith('%')) throw new Error('lens did not re-encode the cell');
  const vp = EC.store.get().vp;
  if (vp.lens !== 'einschluss' || vp.sel !== button.dataset.row + ',' + button.dataset.col) throw new Error(JSON.stringify(vp));
});

await check('one router: only research-app listens to hashchange', async () => {
  if (hashchangeListeners !== 1) throw new Error('hashchange listeners: ' + hashchangeListeners);
  if (typeof EC.host.go !== 'function' || typeof EC.release.render !== 'function') throw new Error('host seam missing');
  if (doc.getElementById('literaturbild-root') || doc.getElementById('graph-container')) throw new Error('old view containers remain');
});

await check('start cards open the answer pages', async () => {
  const hrefs = [...doc.querySelectorAll('#view-start .start-card')].map((a) => a.getAttribute('href'));
  if (hrefs.join(' ') !== [1, 2, 3, 4, 5].map((n) => '#view=frage&sq=' + n).join(' ')) throw new Error(hrefs.join(' '));
});

await check('start view states coverage and each question card its findings', async () => {
  await waitFor(() => doc.getElementById('start-status').textContent !== '', 'status sentence');
  const cov = literatureLandscape.meta.analysis_coverage;
  // Fields added by a later codebook version are not collected for earlier annotations
  // and stay out of the coded count; the baseline fields decide it.
  const later = new Set(JSON.parse(readFileSync(join(root, dataFiles['data/analysis_fields.json']), 'utf8')).fields
    .filter((field) => field.introduced_in).map((field) => field.name));
  const coded = Math.min(...Object.entries(cov.fields).filter(([k]) => k.startsWith('AN_') && !later.has(k)).map(([, f]) => f.value + f.none + f.undecidable));
  const expected = `Vorläufig: ${coded} von ${cov.scope.work_total} eingeschlossenen Werken codiert, `;
  if (!doc.getElementById('start-status').textContent.startsWith(expected)) throw new Error(doc.getElementById('start-status').textContent);
  if (doc.querySelector('#view-start .start-btn, #view-start .start-actions')) throw new Error('duplicate nav buttons remain');
  const lines = [...doc.querySelectorAll('#view-start .start-card-status')].map((n) => n.textContent);
  // SQ4 Conceptual grounding says it is not coded until a work carries a coded SQ4 field.
  if (lines.length !== 5 || lines.some((t) => !/^(\d+ KI-geprüfte?r? Befunde?|noch kein geprüfter Befund|noch nicht codiert$)/.test(t))) throw new Error(lines.join(' | '));
  const assertions = JSON.parse(readFileSync(join(root, dataFiles['data/assertion_index.json']), 'utf8')).assertions;
  const forSq4 = assertions.filter((a) => (a.research_questions || []).includes('SQ4')).length;
  const sq4 = cov.fields.AN_Gender_Definition || {};
  const sq4Coded = (sq4.value || 0) + (sq4.none || 0) + (sq4.undecidable || 0) > 0;
  if (!forSq4 && lines[3] !== (sq4Coded ? 'noch kein geprüfter Befund' : 'noch nicht codiert')) throw new Error('SQ4 line ' + lines[3]);
  const forSq1 = assertions.filter((a) => (a.research_questions || []).includes('SQ1')).length;
  if (forSq1 && !lines[0].startsWith(forSq1 + ' ')) throw new Error('SQ1 count ' + lines[0]);
});

await check('nav tooltips show on focus, describe the item and hide on Escape', async () => {
  const items = [...doc.querySelectorAll('.header-nav a, .header-nav button')];
  if (!items.length || items.some((item) => !item.dataset.tipKey)) throw new Error('nav item without tip key');
  const button = doc.getElementById('tab-korpus');
  const tip = doc.getElementById(button.getAttribute('aria-describedby'));
  if (!tip || tip.getAttribute('role') !== 'tooltip' || !tip.textContent) throw new Error('no described tooltip');
  if (/\d/.test(tip.textContent)) throw new Error('tooltip carries a count');
  button.dispatchEvent(new window.FocusEvent('focus'));
  if (tip.hidden) throw new Error('tooltip hidden on focus');
  doc.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
  if (!tip.hidden) throw new Error('Escape did not hide');
  const repo = doc.querySelector('.header-nav a[data-tip-key="repo"]');
  if (!repo.getAttribute('aria-label')) throw new Error('repo icon has no accessible name');
});

await check('Literaturbild shows the evidence-and-gap map under its denominator', async () => {
  window.switchView('literaturbild');
  await waitFor(() => doc.querySelector('#view-literaturbild #lb-table') !== null, 'map');
  const denom = doc.querySelector('#lb-denom .lb-denom-main');
  if (!denom || !/^\d+ von \d+ identifizierten Werken auf beiden Achsen codiert$/.test(denom.textContent)) throw new Error('denominator ' + (denom && denom.textContent));
  if (doc.getElementById('lb-denom').compareDocumentPosition(doc.getElementById('lb-table')) !== window.Node.DOCUMENT_POSITION_FOLLOWING) {
    throw new Error('denominator does not precede the table');
  }
  if (doc.querySelector('#view-literaturbild #matrix-table')) throw new Error('the release matrix renders in the working application');
  if (!doc.querySelector('#lb-table button.lb-cell[data-state="gap"]')) throw new Error('no gap cell');
  if (!doc.querySelector('#lb-table button.lb-cell[data-state="open"]')) throw new Error('no n. b. cell');
  if (doc.querySelectorAll('#lb-table button.lb-cell[tabindex="0"]').length !== 1) throw new Error('roving tabindex');
  if (doc.querySelector('#tab-literaturbild').getAttribute('aria-pressed') !== 'true') throw new Error('tab not pressed');
});

await check('a map cell opens its works with Korpus and PRISM links and writes the hash', async () => {
  const cell = doc.querySelector('#lb-table button.lb-cell[data-state="value"]');
  cell.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await waitFor(() => !doc.getElementById('lb-detail').hidden, 'work list');
  const hash = new URLSearchParams(window.location.hash.slice(1));
  if (hash.get('view') !== 'literaturbild' || hash.get('cell') !== cell.dataset.row + '|' + cell.dataset.col) throw new Error('hash ' + window.location.hash);
  const items = doc.querySelectorAll('#lb-detail .lb-item');
  if (items.length !== Number(cell.dataset.count)) throw new Error('work count ' + items.length);
  const item = items[0];
  if (!item.querySelector('.lb-item-title').getAttribute('href').startsWith('#view=korpus&paper=')) throw new Error('korpus link');
  if (!item.querySelector('.lb-prism').getAttribute('href').startsWith('prisma.html?paper=')) throw new Error('prism link');
});

await check('corpus filters stay out of release view hashes and survive them', async () => {
  window.switchView('korpus');
  const sel = doc.getElementById('filter-decision');
  sel.value = 'Exclude';
  sel.dispatchEvent(new window.Event('change', { bubbles: true }));
  await waitFor(() => window.location.hash.includes('dec=Exclude'), 'korpus filter in hash');
  window.switchView('literaturbild');
  if (window.location.hash.includes('dec=')) throw new Error('corpus filter leaked: ' + window.location.hash);
  if (!window.location.hash.includes('cell=')) throw new Error('tab did not restore the last map state');
  window.switchView('korpus');
  if (!window.location.hash.includes('dec=Exclude')) throw new Error('corpus filter lost: ' + window.location.hash);
  sel.value = 'all';
  sel.dispatchEvent(new window.Event('change', { bubbles: true }));
});

await check('a map deep link restores axes, basis and cell', async () => {
  setHash('#view=literaturbild&rows=jahr&cols=kategorie&basis=include');
  await waitFor(() => doc.getElementById('lb-rows').value === 'jahr', 'axes restored');
  if (doc.getElementById('lb-cols').value !== 'kategorie') throw new Error('cols not restored');
  if (doc.querySelector('#lb-root [data-basis="include"]').getAttribute('aria-pressed') !== 'true') throw new Error('basis not restored');
  if (!doc.getElementById('lb-detail').hidden) throw new Error('a work list is open without a cell');
  setHash('#view=literaturbild&rows=perspective&cols=nonsense');
  await waitFor(() => doc.getElementById('lb-rows').value === 'kategorie', 'legacy group falls back to the category dimension');
  if (doc.getElementById('lb-cols').value !== 'jahr') throw new Error('unknown dimension did not fall back');
});

await check('Wissensnetz shows the category network and selects an edge into the hash', async () => {
  setHash('#view=wissensnetz');
  await waitFor(() => doc.querySelector('#wn-graph .wn-node') !== null, 'category network');
  const pick = doc.querySelector('#wn-table .wn-pick');
  pick.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await waitFor(() => !doc.getElementById('wn-detail').hidden, 'connection work list');
  if (new URLSearchParams(window.location.hash.slice(1)).get('sel') !== pick.dataset.sel) throw new Error('selection not in hash');
});

// Box of an SVG count label from its translate and rect attributes (jsdom has no layout).
const pillBox = (g) => {
  const [x, y] = g.getAttribute('transform').match(/-?[\d.]+/g).map(Number);
  const r = g.querySelector('rect');
  return { x: x + Number(r.getAttribute('x')), y: y + Number(r.getAttribute('y')), w: Number(r.getAttribute('width')), h: Number(r.getAttribute('height')) };
};
const overlaps = (p, q) => Math.min(p.x + p.w, q.x + q.w) > Math.max(p.x, q.x) && Math.min(p.y + p.h, q.y + q.h) > Math.max(p.y, q.y);
const expertWorks = () => EC.getAllPapers().filter((p) => p.human && p.human.decision);
const expertCount = (cats) => expertWorks().filter((p) => cats.every((c) => (p.human.all_categories || {})[c] === 1)).length;

await check('label placement keeps two labels on the same curve apart', async () => {
  const item = { from: [0, 0], via: [50, 0], to: [100, 0], w: 30, h: 16 };
  const [a, b] = EC.wissensnetz.placeLabels([item, item], []);
  if (overlaps(a.box, b.box)) throw new Error(JSON.stringify([a.box, b.box]));
  const [c] = EC.wissensnetz.placeLabels([{ ...item, steps: [0.75, 0.5] }], [{ x: 60, y: -20, w: 40, h: 40 }]);
  if (c.x !== 50) throw new Error('obstacle not avoided ' + c.x);
});

await check('the tooltip position flips at the viewport edge and avoids a protected box', async () => {
  const size = { w: 200, h: 60 };
  const view = { w: 1000, h: 800 };
  const corner = EC.wissensnetz.tipPosition({ x: 950, y: 780 }, size, view, []);
  const tipBox = { x: corner.left, y: corner.top, w: size.w, h: size.h };
  if (corner.left + size.w > view.w || corner.top + size.h > view.h || EC.wissensnetz.overlapArea(tipBox, { x: 944, y: 774, w: 12, h: 12 })) {
    throw new Error('no flip ' + JSON.stringify(corner));
  }
  const avoid = EC.wissensnetz.tipPosition({ x: 400, y: 400 }, size, view, [{ x: 410, y: 410, w: 300, h: 100, weight: 1000 }]);
  if (EC.wissensnetz.overlapArea({ x: avoid.left, y: avoid.top, w: size.w, h: size.h }, { x: 410, y: 410, w: 300, h: 100 })) throw new Error('covers ' + JSON.stringify(avoid));
});

await check('cell text reaches 4.5:1 on every fill of the heat scale', async () => {
  const C = EC.color;
  const bad = [];
  for (let h = 0; h <= 100; h += 1) {
    const fill = C.mixWithWhite('#2d6364', h / 100);
    const ink = C.readableInk(fill, '#1c1917');
    const ratio = C.contrastRatio(fill, C.hexRgb(ink === '#fff' ? '#ffffff' : ink === '#000' ? '#000000' : ink));
    if (ratio < 4.5) bad.push(h + ':' + ratio.toFixed(2));
  }
  if (bad.length) throw new Error(bad.join(' '));
});

await check('with a node selected no two count labels overlap and none covers a node, for every category', async () => {
  const problems = [];
  for (const cat of EC.CATEGORIES) {
    setHash('#view=wissensnetz&sel=' + cat);
    await waitFor(() => doc.querySelector(`#wn-graph .wn-node.is-selected[data-sel="${cat}"]`) !== null, 'node ' + cat);
    const pills = [...doc.querySelectorAll('#wn-graph .wn-pill')].map(pillBox);
    const dots = [...doc.querySelectorAll('#wn-graph .wn-node')].map((g) => {
      const c = g.querySelector('.wn-hit');
      const r = Number(g.querySelector('.wn-dot').getAttribute('r'));
      return { x: Number(c.getAttribute('cx')) - r, y: Number(c.getAttribute('cy')) - r, w: 2 * r, h: 2 * r };
    });
    pills.forEach((p, i) => {
      pills.forEach((q, j) => { if (i < j && overlaps(p, q)) problems.push(cat + ' labels ' + i + ',' + j); });
      dots.forEach((d, j) => { if (overlaps(p, d)) problems.push(cat + ' label ' + i + ' on node ' + j); });
    });
    if (pills.length !== doc.querySelectorAll('#wn-table .wn-pick').length) problems.push(cat + ' label count');
  }
  if (problems.length) throw new Error(problems.slice(0, 5).join('; '));
});

await check('a selected node lists only partner categories with the share of the partner works', async () => {
  setHash('#view=wissensnetz&sel=Bias_Ungleichheit');
  await waitFor(() => doc.getElementById('wn-table-caption').textContent.includes('Bias'), 'connections table');
  const rows = [...doc.querySelectorAll('#wn-table tbody tr')];
  const wrong = rows.filter((tr) => {
    const chips = tr.querySelectorAll('th .category-chip');
    const partner = chips[0].dataset.cat;
    const count = Number(tr.querySelector('.wn-pick').firstChild.textContent);
    const share = tr.querySelector('td:last-child').textContent;
    return chips.length !== 1 || partner === 'Bias_Ungleichheit' || count !== expertCount(['Bias_Ungleichheit', partner]) ||
      share !== Math.round(count / expertCount([partner]) * 100) + ' %';
  });
  if (!rows.length || wrong.length) throw new Error(wrong.map((tr) => tr.textContent).join(' | '));
  const fem = doc.querySelector('#wn-graph .wn-edge[data-sel="Bias_Ungleichheit,Feministisch"]').getAttribute('aria-label');
  const n = expertCount(['Bias_Ungleichheit', 'Feministisch']);
  if (fem !== `Feministisch und Bias & Ungleichheit, gemeinsam codiert in ${n} Werken, ${n} von ${expertCount(['Feministisch'])} Werken der Kategorie Feministisch`) throw new Error(fem);
});

await check('the work list of a selection is grouped by decision, Include first, each group with its count', async () => {
  const titles = [...doc.querySelectorAll('#wn-detail .lk-group-title')];
  const keys = titles.map((t) => t.dataset.decision);
  if (keys[0] !== 'include' || keys.join() !== ['include', 'exclude', 'unclear', 'none'].filter((k) => keys.includes(k)).join()) throw new Error(keys.join());
  titles.forEach((t) => {
    const list = t.nextElementSibling;
    const items = list.querySelectorAll('.lk-item');
    if (![...items].every((li) => li.dataset.decision === t.dataset.decision)) throw new Error('mixed group ' + t.textContent);
    if (!t.textContent.includes(items.length + (items.length === 1 ? ' Werk' : ' Werke'))) throw new Error('group count ' + t.textContent);
  });
});

await check('the residual category is drawn quieter in the network', async () => {
  const residual = [...doc.querySelectorAll('#wn-graph .wn-node--residual')].map((g) => g.dataset.sel);
  if (residual.join() !== 'KI_Sonstige') throw new Error(residual.join());
  if (!/Sammelkategorie KI Sonstige/.test(doc.getElementById('wn-legend').textContent)) throw new Error('legend');
});

await check('the Landkarte Anteil lens states the share of the column category and a cell lists its works grouped with PRISM links', async () => {
  setHash('#view=vergleich&lens=anteil');
  await waitFor(() => doc.querySelector('#landkarte .lk-lens[data-lens="anteil"][aria-pressed="true"]') !== null, 'anteil lens');
  const wrong = [...doc.querySelectorAll('#landkarte button.lk-cell')].filter((b) => {
    const v = expertCount([b.dataset.row, b.dataset.col]) / expertCount([b.dataset.col]);
    return Math.abs(Number(b.dataset.value) - v) > 1e-3 || !b.getAttribute('aria-label').includes(`von ${expertCount([b.dataset.col])} Werken der Kategorie`) ||
      !/^#(fff|000)$|^#1c1917$/.test(b.style.getPropertyValue('--ink'));
  });
  if (wrong.length) throw new Error(wrong.map((b) => b.getAttribute('aria-label')).join(' | '));
  const cell = doc.querySelector('#landkarte button.lk-cell[data-row="Generative_KI"][data-col="Bias_Ungleichheit"]');
  cell.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await waitFor(() => !doc.getElementById('landkarte-detail').hidden, 'detail');
  const items = [...doc.querySelectorAll('#landkarte-detail .lk-item')];
  if (items.length !== expertCount(['Generative_KI', 'Bias_Ungleichheit'])) throw new Error('items ' + items.length);
  if (doc.querySelector('#landkarte-detail .lk-group-title').dataset.decision !== 'include') throw new Error('Include not first');
  if (!items.every((li) => li.querySelector('.lk-prism').getAttribute('href').startsWith('prisma.html?paper='))) throw new Error('PRISM link missing');
});

await check('Begriffsnetz shows the ego network with its table and denominator', async () => {
  setHash('#view=begriffsnetz');
  await waitFor(() => doc.querySelector('#view-begriffsnetz #netz-list') !== null, 'network table');
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
  const genderChip = doc.querySelector('#category-chips .category-chip[data-cat="Gender"]');
  if (!genderChip || genderChip.getAttribute('aria-pressed') !== 'true') throw new Error('Gender chip not active');
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
  if (doc.querySelector('#category-chips .category-chip[aria-pressed="true"]')) throw new Error('a chip is active for a bogus cat');
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
