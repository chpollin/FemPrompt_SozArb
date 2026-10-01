// Literaturbild of the working application: an evidence-and-gap map over two
// selectable dimensions of the whole corpus, at Work level. A cell counts the Works
// that carry both codes; it states joint coding, never a relation. An empty cell is a
// gap only when no Work that is still uncoded or undecided could fall into it, and is
// otherwise not determinable. The public result site keeps its own matrix
// (release-matrix.js); this module is loaded by docs/index.html only.
(function () {
'use strict';

const EC = window.EC;
const NONE = '__none';
const NO_YEAR = 'oj';
const DEFAULTS = { rows: 'kategorie', cols: 'jahr', basis: 'alle' };
const BASES = {
    alle: { label: 'Alle identifizierten', short: 'identifizierten' },
    include: { label: 'Eingeschlossen', short: 'eingeschlossenen' },
};
// Fields added by codebook 1.4 are not collected yet; they stay out until a Work
// carries them, as does the coding basis, which records how a Work was coded.
const SKIP_FIELDS = ['AN_Coding_Basis', 'AN_Notes'];
// The evidence-and-gap maps of knowledge/analysis-methods.md per sub-question, plus
// the bibliographic overview.
const PRESETS = [
    { key: 'ueberblick', label: 'Überblick', rows: 'kategorie', cols: 'jahr' },
    { key: 'sq1', label: 'Nutzung', rows: 'AN_Population', cols: 'AN_Prompting_Role' },
    { key: 'sq2', label: 'Bias-Formen', rows: 'AN_Bias_Axes', cols: 'AN_Harm_Types' },
    { key: 'sq3', label: 'Umgang mit Bias', rows: 'AN_Bias_Axes', cols: 'AN_Mitigation_Stage' },
    { key: 'sq5', label: 'Kompetenzen', rows: 'kategorie', cols: 'AN_Prompting_Role' },
];
const ITEM_TYPES = {
    journalArticle: 'Zeitschriftenartikel', report: 'Bericht', conferencePaper: 'Konferenzbeitrag',
    bookSection: 'Buchkapitel', preprint: 'Preprint', book: 'Buch', webpage: 'Webseite', document: 'Dokument',
    blogPost: 'Blogbeitrag', thesis: 'Abschlussarbeit', manuscript: 'Manuskript',
};
const DECISIONS = {
    include: { label: 'Include', mark: '+' }, unclear: { label: 'Unclear', mark: '?' },
    exclude: { label: 'Exclude', mark: '−' }, open: { label: 'offen', mark: '○' },
};
// A Work with several records takes the strongest decision of its versions.
const DECISION_RANK = { include: 0, unclear: 1, exclude: 2, open: 3 };
const TEXT_LABELS = { raw: 'Volltext', abstract: 'Abstract', none: 'kein Papertext' };

let works = null; // Work-level rows built once from the corpus, the agent track and the field schema
let dims = null; // { id: dim } of the dimensions with coverage, in display order
let state = Object.assign({ cell: '' }, DEFAULTS);
let pending = null;
let loading = null;
let focusKey = null; // row|col of the cell that keeps keyboard focus across a re-render

function esc(value) { return EC.esc(value); }
function workCount(n) { return n === 1 ? '1 Werk' : n + ' Werke'; }

function fetchJson(path) {
    return fetch(path).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
}

function categoryLabel(model, key) {
    const category = model.category(key);
    return (category && category.label) || EC.catLabel(key);
}

// Every dimension maps a Work to { state: 'value'|'none'|'open', keys }.
function buildDims(model, years) {
    const list = [];
    const schemaGroups = model.schema.groups || {};
    const categoryKeys = (schemaGroups.object || []).concat(schemaGroups.perspective || []);
    list.push({
        id: 'kategorie', label: 'Kategorie', producer: 'Expert:innen', group: 'Screening', values: categoryKeys, noneLabel: 'keine Kategorie',
        valueLabel: function (key) { return categoryLabel(model, key); }, chip: true,
        of: function (work) { return work.categories; },
    });
    list.push({
        id: 'jahr', label: 'Erscheinungsjahr', producer: '', group: 'Bibliografie', values: years,
        valueLabel: function (key) { return key === NO_YEAR ? 'o. J.' : key; },
        of: function (work) { return { state: 'value', keys: [work.year ? String(work.year) : NO_YEAR] }; },
    });
    const types = Object.keys(ITEM_TYPES).filter(function (type) { return works.some(function (w) { return w.itemType === type; }); })
        .concat(Array.from(new Set(works.map(function (w) { return w.itemType; }))).filter(function (t) { return t && !ITEM_TYPES[t]; }).sort());
    list.push({
        id: 'typ', label: 'Publikationstyp', producer: '', group: 'Bibliografie', values: types,
        valueLabel: function (key) { return ITEM_TYPES[key] || model.humanise(key); },
        of: function (work) { return work.itemType ? { state: 'value', keys: [work.itemType] } : { state: 'open', keys: [] }; },
    });
    model.dims.filter(function (dim) {
        return dim.kind === 'field' && SKIP_FIELDS.indexOf(dim.id) < 0;
    }).forEach(function (dim) {
        list.push({
            id: dim.id, label: dim.label.replace(/ des Werks$/, ''), producer: 'KI', group: 'KI-codiert', values: dim.values,
            workLevel: dim.workLevel, valueLabel: dim.valueLabel,
            of: function (work) { return work.fields ? fieldState(work.fields, dim.id) : { state: 'open', keys: [] }; },
        });
    });
    // Only a dimension that at least one Work carries is offered.
    const byId = {};
    list.filter(function (dim) {
        return works.some(function (work) { return dim.of(work).state !== 'open'; });
    }).forEach(function (dim) { byId[dim.id] = dim; });
    return byId;
}

function fieldState(fields, id) {
    const raw = fields[id];
    const listed = (Array.isArray(raw) ? raw : [raw]).filter(function (v) { return v != null && v !== ''; });
    if (!listed.length) return { state: 'open', keys: [] };
    const coded = listed.filter(function (v) { return v !== 'None'; });
    return coded.length ? { state: 'value', keys: coded } : { state: 'none', keys: [NONE] };
}

// Agent fields of several records of one Work are merged; a value in any record counts.
function mergeFields(target, fields) {
    Object.keys(fields).forEach(function (key) {
        const add = Array.isArray(fields[key]) ? fields[key] : [fields[key]];
        const have = target[key] == null ? [] : (Array.isArray(target[key]) ? target[key] : [target[key]]);
        target[key] = have.concat(add.filter(function (v) { return have.indexOf(v) < 0; }));
    });
}

function buildWorks(agentTrack) {
    const stages = EC.korpusStages;
    const byWork = new Map();
    EC.getAllPapers().forEach(function (paper) {
        const id = paper.work_id || paper.id;
        if (!byWork.has(id)) byWork.set(id, []);
        byWork.get(id).push(paper);
    });
    const agentByRecord = {};
    const decisions = (agentTrack && agentTrack.decisions) || {};
    Object.keys(decisions).forEach(function (pid) {
        const record = decisions[pid];
        const fields = record && record.analysis && record.analysis.fields;
        if (fields && typeof fields === 'object' && Object.keys(fields).length) agentByRecord[pid] = record;
    });
    const list = [];
    byWork.forEach(function (records, id) {
        const rep = records.find(function (p) { return p.is_preferred_version; }) || records[0];
        let decision = 'open';
        let source = '';
        let expert = null;
        let fields = null;
        let textSource = '';
        records.forEach(function (p) {
            const d = stages.decision(p);
            if (DECISION_RANK[d] < DECISION_RANK[decision]) { decision = d; source = stages.decisionSource(p); }
            const human = p.benchmark && p.benchmark.has_human && p.human && p.human.all_categories;
            if (human) {
                expert = expert || [];
                Object.keys(human).forEach(function (key) { if (human[key] === 1 && expert.indexOf(key) < 0) expert.push(key); });
            }
            const agent = agentByRecord[p.id];
            if (agent) {
                fields = fields || {};
                mergeFields(fields, agent.analysis.fields);
                textSource = textSource || agent.text_source || '';
            }
        });
        const text = textSource ? TEXT_LABELS[textSource] || '' : (function () {
            const known = records.map(stages.hasText);
            if (known.some(function (v) { return v === true; })) return 'Volltext';
            return known.some(function (v) { return v === false; }) ? 'kein Volltext' : '';
        })();
        list.push({
            id: id, recordId: rep.id, title: rep.title || '', authorYear: rep.author_year || '', year: rep.year || null,
            itemType: rep.item_type || '', decision: decision, source: source, fields: fields, text: text,
            categories: expert === null ? { state: 'open', keys: [] } : expert.length ? { state: 'value', keys: expert } : { state: 'none', keys: [NONE] },
        });
    });
    return list;
}

function yearKeys() {
    const years = works.map(function (w) { return w.year; }).filter(function (y) { return typeof y === 'number'; });
    const keys = [];
    if (years.length) {
        for (let y = Math.min.apply(null, years); y <= Math.max.apply(null, years); y += 1) keys.push(String(y));
    }
    if (works.some(function (w) { return !w.year; })) keys.push(NO_YEAR);
    return keys;
}

function load() {
    if (loading) return loading;
    loading = Promise.all([
        fetchJson('data/screening/ar2.json'), fetchJson('data/analysis_fields.json'), fetchJson('data/category_schema.json'),
    ]).then(function (payload) {
        const model = EC.createModel({ fields: payload[1] || undefined, schema: payload[2] || undefined });
        works = buildWorks(payload[0]);
        dims = buildDims(model, yearKeys());
        renderSkeleton();
        apply(pending || {});
        pending = null;
    });
    return loading;
}

// Hash values are a trust boundary: unknown dimensions, bases and cells fall back.
function normalise(vp) {
    const legacy = function (id) { return id === 'object' || id === 'perspective' ? 'kategorie' : id; };
    const next = {
        rows: dims[legacy(vp.rows)] ? legacy(vp.rows) : DEFAULTS.rows,
        cols: dims[legacy(vp.cols)] ? legacy(vp.cols) : DEFAULTS.cols,
        basis: BASES[vp.basis] ? vp.basis : DEFAULTS.basis,
        cell: '',
    };
    if (next.rows === next.cols) next.cols = next.rows === DEFAULTS.cols ? DEFAULTS.rows : DEFAULTS.cols;
    if (next.rows === next.cols) next.cols = Object.keys(dims).find(function (id) { return id !== next.rows; });
    const parts = String(vp.cell || '').split('|');
    if (parts.length === 2 && axisKeys(next.rows).indexOf(parts[0]) >= 0 && axisKeys(next.cols).indexOf(parts[1]) >= 0) next.cell = vp.cell;
    return next;
}

function apply(vp) {
    if (!dims) { pending = vp; return; }
    state = normalise(vp || {});
    render();
}

// The not-applicable key joins an axis only where a Work is coded as such.
function axisKeys(dimId) {
    const dim = dims[dimId];
    if (!dim) return [];
    const none = works.some(function (w) { return inBasis(w) && dim.of(w).state === 'none'; });
    return dim.values.concat(none ? [NONE] : []);
}

function keyLabel(dim, key) { return key === NONE ? dim.noneLabel || 'nicht zutreffend' : dim.valueLabel(key); }

function inBasis(work) { return state.basis === 'alle' || work.decision === 'include'; }

// Works that could still enter a cell: in the basis but uncoded on an axis, or, under
// the Include basis, not yet finally decided.
function isPending(work, rowDim, colDim) {
    if (state.basis === 'include' && (work.decision === 'open' || work.decision === 'unclear')) return true;
    return inBasis(work) && (rowDim.of(work).state === 'open' || colDim.of(work).state === 'open');
}

function couldFill(work, dim, key) {
    const s = dim.of(work);
    return s.state === 'open' || s.keys.indexOf(key) >= 0;
}

function compute() {
    const rowDim = dims[state.rows];
    const colDim = dims[state.cols];
    const basis = works.filter(inBasis);
    const coded = basis.filter(function (w) { return rowDim.of(w).state !== 'open' && colDim.of(w).state !== 'open'; });
    const pendingWorks = works.filter(function (w) { return isPending(w, rowDim, colDim); });
    const rows = axisKeys(state.rows);
    const cols = axisKeys(state.cols);
    const cells = {};
    rows.forEach(function (r) { cells[r] = {}; cols.forEach(function (c) { cells[r][c] = []; }); });
    coded.forEach(function (w) {
        rowDim.of(w).keys.forEach(function (r) {
            colDim.of(w).keys.forEach(function (c) { if (cells[r] && cells[r][c]) cells[r][c].push(w); });
        });
    });
    const rowTotals = {};
    const colTotals = {};
    rows.forEach(function (r) { rowTotals[r] = coded.filter(function (w) { return rowDim.of(w).keys.indexOf(r) >= 0; }).length; });
    cols.forEach(function (c) { colTotals[c] = coded.filter(function (w) { return colDim.of(w).keys.indexOf(c) >= 0; }).length; });
    let max = 0;
    rows.forEach(function (r) { cols.forEach(function (c) { if (r !== NONE && c !== NONE) max = Math.max(max, cells[r][c].length); }); });
    return {
        rowDim: rowDim, colDim: colDim, basis: basis, coded: coded, pending: pendingWorks, rows: rows, cols: cols, cells: cells,
        rowTotals: rowTotals, colTotals: colTotals, max: max,
        rowCoverage: basis.filter(function (w) { return rowDim.of(w).state !== 'open'; }).length,
        colCoverage: basis.filter(function (w) { return colDim.of(w).state !== 'open'; }).length,
    };
}

function candidates(data, row, col) {
    return data.pending.filter(function (w) { return couldFill(w, data.rowDim, row) && couldFill(w, data.colDim, col); });
}

function cellState(data, row, col) {
    if (data.cells[row][col].length) return row === NONE || col === NONE ? 'none' : 'value';
    return candidates(data, row, col).length ? 'open' : 'gap';
}

function dimOptions(selected, other) {
    const groups = ['Screening', 'Bibliografie', 'KI-codiert'];
    return groups.map(function (group) {
        const items = Object.keys(dims).filter(function (id) { return dims[id].group === group; });
        if (!items.length) return '';
        return '<optgroup label="' + esc(group) + '">' + items.map(function (id) {
            const dim = dims[id];
            return '<option value="' + esc(id) + '"' + (id === selected ? ' selected' : '') + (id === other ? ' disabled' : '') + '>' +
                esc(dim.label + (dim.producer ? ' (' + dim.producer + ')' : '')) + '</option>';
        }).join('') + '</optgroup>';
    }).join('');
}

function renderSkeleton() {
    const root = document.getElementById('lb-root');
    const presets = PRESETS.filter(function (p) { return dims[p.rows] && dims[p.cols]; });
    root.innerHTML =
        '<div class="lb-controls">' +
            '<div class="lb-seg" role="group" aria-label="Karte">' + presets.map(function (p) {
                return '<button type="button" class="lb-seg-btn" data-preset="' + p.key + '" aria-pressed="false">' + esc(p.label) + '</button>';
            }).join('') + '</div>' +
            '<label class="lb-field">Zeilen <select id="lb-rows"></select></label>' +
            '<button type="button" class="lb-swap" id="lb-swap" aria-label="Zeilen und Spalten tauschen"><span aria-hidden="true">⇄</span></button>' +
            '<label class="lb-field">Spalten <select id="lb-cols"></select></label>' +
            '<div class="lb-seg" role="group" aria-label="Entscheidungsbasis">' + Object.keys(BASES).map(function (key) {
                return '<button type="button" class="lb-seg-btn" data-basis="' + key + '" aria-pressed="false">' + esc(BASES[key].label) + '</button>';
            }).join('') + '</div>' +
        '</div>' +
        '<p class="lb-denom" id="lb-denom"></p>' +
        '<div class="lb-layout"><div class="lb-main">' +
            '<div class="lb-wrap" id="lb-wrap" role="region" tabindex="-1"></div>' +
            '<p class="lb-legend" id="lb-legend"></p>' +
        '</div><section class="lb-detail" id="lb-detail" aria-labelledby="lb-detail-title" hidden></section></div>';
}

function headerHtml(dim, key) {
    if (dim.chip && key !== NONE) {
        return EC.categoryChip({ key: key, label: dim.valueLabel(key), color: EC.CAT_COLORS[key] }, { small: true });
    }
    return '<span class="lb-head-label' + (key === NONE ? ' lb-head-label--status' : '') + '">' + esc(keyLabel(dim, key)) + '</span>';
}

function heat(count, max) {
    return max ? Math.round(10 + (count / max) * 82) : 0;
}

function cellAria(data, row, col, kind, count) {
    const pair = keyLabel(data.rowDim, row) + ' und ' + keyLabel(data.colDim, col);
    if (kind === 'gap') return pair + ', Lücke, kein Werk';
    if (kind === 'open') return pair + ', kein Werk, nicht bestimmbar';
    return pair + ', ' + workCount(count);
}

function tableHtml(data) {
    const selected = state.cell;
    // One cell is in the tab order (roving tabindex); the arrow keys move within the grid.
    const active = focusKey || selected || data.rows[0] + '|' + data.cols[0];
    let html = '<table class="lb-table" id="lb-table"><caption class="sr-only">' +
        esc(data.rowDim.label + ' in Zeilen gegen ' + data.colDim.label + ' in Spalten, Werke je Zellenpaar') + '</caption>' +
        '<thead><tr><th scope="col" class="lb-corner">' + esc(data.rowDim.label) + ' <span aria-hidden="true">×</span> ' + esc(data.colDim.label) + '</th>';
    const colMax = Math.max.apply(null, data.cols.map(function (c) { return data.colTotals[c]; }).concat([1]));
    const rowMax = Math.max.apply(null, data.rows.map(function (r) { return data.rowTotals[r]; }).concat([1]));
    data.cols.forEach(function (col, ci) {
        html += '<th scope="col" class="lb-col" data-ci="' + ci + '">' + headerHtml(data.colDim, col) +
            '<span class="lb-marg" aria-hidden="true"><span class="lb-marg-bar" style="--w:' + (data.colTotals[col] / colMax * 100).toFixed(1) + '%"></span>' +
            '<span class="lb-marg-val">' + data.colTotals[col] + '</span></span></th>';
    });
    html += '</tr></thead><tbody>';
    data.rows.forEach(function (row, ri) {
        html += '<tr><th scope="row" class="lb-row" data-ri="' + ri + '"><span class="lb-row-head">' + headerHtml(data.rowDim, row) +
            '<span class="lb-marg" aria-hidden="true"><span class="lb-marg-bar" style="--w:' + (data.rowTotals[row] / rowMax * 100).toFixed(1) + '%"></span>' +
            '<span class="lb-marg-val">' + data.rowTotals[row] + '</span></span></span></th>';
        data.cols.forEach(function (col, ci) {
            const key = row + '|' + col;
            const count = data.cells[row][col].length;
            const kind = cellState(data, row, col);
            const h = kind === 'value' ? heat(count, data.max) : 0;
            const focusable = key === active;
            const body = kind === 'gap' ? '0' : kind === 'open' ? 'n. b.' : String(count);
            html += '<td><button type="button" class="lb-cell lb-cell--' + kind + (h >= 60 ? ' is-dark' : '') + '" data-row="' + esc(row) +
                '" data-col="' + esc(col) + '" data-ri="' + ri + '" data-ci="' + ci + '" data-state="' + kind + '" data-count="' + count +
                '" style="--heat:' + h + '%" tabindex="' + (focusable ? '0' : '-1') + '" aria-pressed="' + (key === selected) +
                '" aria-label="' + esc(cellAria(data, row, col, kind, count)) + '"><span class="lb-val" aria-hidden="true">' + body + '</span></button></td>';
        });
        html += '</tr>';
    });
    return html + '</tbody></table>';
}

function denomHtml(data) {
    const n = data.basis.length;
    const axis = function (dim, coverage) {
        return '<span class="lb-denom-axis"><span class="lb-denom-name">' + esc(dim.label) + '</span>' +
            (dim.producer === 'KI' ? ' <span class="lb-tag">KI-codiert</span>' : dim.producer ? ' <span class="lb-tag lb-tag--human">' + esc(dim.producer) + '</span>' : '') +
            ' ' + coverage + ' von ' + n + '</span>';
    };
    return '<span class="lb-denom-main">' + data.coded.length + ' von ' + n + ' ' + BASES[state.basis].short +
        ' Werken auf beiden Achsen codiert</span>' + axis(data.rowDim, data.rowCoverage) + axis(data.colDim, data.colCoverage);
}

function legendHtml(data) {
    return '<span class="lb-scale"><span>1</span><span class="lb-ramp" aria-hidden="true"></span><span>' + Math.max(data.max, 1) + ' Werke</span></span>' +
        '<span class="lb-key"><span class="lb-swatch lb-swatch--gap" aria-hidden="true"></span>Lücke, kein Werk bei vollständiger Codierung</span>' +
        '<span class="lb-key"><span class="lb-swatch lb-swatch--open" aria-hidden="true"></span>n. b., nicht bestimmbar, solange Werke offen sind</span>';
}

function decisionText(work) {
    const d = DECISIONS[work.decision];
    if (work.decision === 'open') return d.label;
    return d.label + (work.source === 'expert' ? ' (Expert:innen)' : work.source ? ' (' + work.source + ')' : '');
}

function itemHtml(work) {
    const d = DECISIONS[work.decision];
    const meta = [work.authorYear || (work.year ? String(work.year) : ''), decisionText(work), work.text].filter(Boolean);
    return '<li class="lb-item" data-work-id="' + esc(work.id) + '" data-decision="' + work.decision + '">' +
        '<span class="lk-mark lk-mark--' + work.decision + '" aria-hidden="true">' + d.mark + '</span>' +
        '<span class="lb-item-body"><a class="lb-item-title" href="#view=korpus&amp;paper=' + encodeURIComponent(work.recordId) + '">' + esc(work.title || work.recordId) + '</a>' +
        '<span class="lb-item-meta">' + meta.map(function (part) { return '<span>' + esc(part) + '</span>'; }).join('') +
        '<a class="lb-prism" href="prisma.html?paper=' + encodeURIComponent(work.recordId) + '">PRISM</a></span></span></li>';
}

function sortWorks(list) {
    return list.slice().sort(function (a, b) {
        return DECISION_RANK[a.decision] - DECISION_RANK[b.decision] || (b.year || 0) - (a.year || 0) ||
            a.authorYear.localeCompare(b.authorYear, 'de');
    });
}

function tally(list) {
    return ['include', 'unclear', 'exclude', 'open'].map(function (key) {
        const n = list.filter(function (w) { return w.decision === key; }).length;
        return n ? n + ' ' + DECISIONS[key].label : '';
    }).filter(Boolean).join(', ');
}

function detailHtml(data) {
    const parts = state.cell.split('|');
    const row = parts[0];
    const col = parts[1];
    const list = sortWorks(data.cells[row][col]);
    const kind = cellState(data, row, col);
    const title = '<h3 class="lb-detail-title" id="lb-detail-title" tabindex="-1">' + headerHtml(data.rowDim, row) +
        ' <span class="lk-and">und</span> ' + headerHtml(data.colDim, col) + '</h3>';
    if (list.length) {
        return title + '<p class="lb-detail-count">' + esc(workCount(list.length) + ', ' + tally(list)) + '</p>' +
            '<ol class="lb-list" role="list">' + list.map(itemHtml).join('') + '</ol>';
    }
    if (kind === 'gap') return title + '<p class="lb-detail-count">Lücke, kein Werk der Basis trägt beide Codes</p>';
    const open = sortWorks(candidates(data, row, col));
    return title + '<p class="lb-detail-count">Kein Werk, ' + esc(workCount(open.length)) + ' noch offen</p>' +
        '<ol class="lb-list lb-list--open" role="list">' + open.map(itemHtml).join('') + '</ol>';
}

function render() {
    const root = document.getElementById('lb-root');
    if (!root || !dims) return;
    const data = compute();
    document.getElementById('lb-rows').innerHTML = dimOptions(state.rows, state.cols);
    document.getElementById('lb-cols').innerHTML = dimOptions(state.cols, state.rows);
    root.querySelectorAll('[data-basis]').forEach(function (btn) { btn.setAttribute('aria-pressed', String(btn.dataset.basis === state.basis)); });
    root.querySelectorAll('[data-preset]').forEach(function (btn) {
        const p = PRESETS.find(function (item) { return item.key === btn.dataset.preset; });
        btn.setAttribute('aria-pressed', String((p.rows === state.rows && p.cols === state.cols) || (p.rows === state.cols && p.cols === state.rows)));
    });
    document.getElementById('lb-denom').innerHTML = denomHtml(data);
    const wrap = document.getElementById('lb-wrap');
    wrap.setAttribute('aria-label', 'Karte ' + data.rowDim.label + ' × ' + data.colDim.label + ', horizontal verschiebbar');
    const hadFocus = wrap.contains(document.activeElement) && document.activeElement.matches('button.lb-cell');
    wrap.innerHTML = tableHtml(data);
    document.getElementById('lb-legend').innerHTML = legendHtml(data);
    const detail = document.getElementById('lb-detail');
    if (state.cell) { detail.innerHTML = detailHtml(data); detail.hidden = false; } else { detail.hidden = true; detail.innerHTML = ''; }
    if (hadFocus || focusKey) {
        const target = cellButton(focusKey || state.cell);
        if (target) target.focus({ preventScroll: true });
    }
    focusKey = null;
}

function cellButton(key) {
    if (!key) return null;
    const parts = key.split('|');
    return Array.prototype.find.call(document.querySelectorAll('#lb-table button.lb-cell'), function (b) {
        return b.dataset.row === parts[0] && b.dataset.col === parts[1];
    }) || null;
}

function navigate(patch, keepFocus) {
    state = normalise(Object.assign({}, state, patch));
    if (keepFocus) focusKey = keepFocus;
    render();
    EC.viewParams.changed();
}

function select(button) {
    const key = button.dataset.row + '|' + button.dataset.col;
    navigate({ cell: state.cell === key ? '' : key }, key);
    // On narrow screens the list stands below the map and would be out of view.
    const title = document.getElementById('lb-detail-title');
    if (state.cell && title && title.getBoundingClientRect().top > window.innerHeight) title.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

function moveFocus(cell, key) {
    const table = document.getElementById('lb-table');
    const lastRow = table.tBodies[0].rows.length - 1;
    const lastCol = table.tHead.rows[0].cells.length - 2;
    let ri = Number(cell.dataset.ri);
    let ci = Number(cell.dataset.ci);
    if (key === 'ArrowLeft') ci -= 1;
    else if (key === 'ArrowRight') ci += 1;
    else if (key === 'ArrowUp') ri -= 1;
    else if (key === 'ArrowDown') ri += 1;
    else if (key === 'Home') ci = 0;
    else if (key === 'End') ci = lastCol;
    else return false;
    ri = Math.max(0, Math.min(lastRow, ri));
    ci = Math.max(0, Math.min(lastCol, ci));
    const next = table.querySelector('button.lb-cell[data-ri="' + ri + '"][data-ci="' + ci + '"]');
    if (next) {
        table.querySelectorAll('button.lb-cell[tabindex="0"]').forEach(function (b) { b.tabIndex = -1; });
        next.tabIndex = 0;
        next.focus();
    }
    return true;
}

function cross(cell) {
    document.querySelectorAll('#lb-table .is-cross').forEach(function (el) { el.classList.remove('is-cross'); });
    if (!cell) return;
    document.querySelectorAll('#lb-table th[data-ri="' + cell.dataset.ri + '"], #lb-table th[data-ci="' + cell.dataset.ci + '"]')
        .forEach(function (el) { el.classList.add('is-cross'); });
}

function bind() {
    const root = document.getElementById('lb-root');
    root.addEventListener('change', function (event) {
        if (event.target.id === 'lb-rows') navigate({ rows: event.target.value, cell: '' });
        if (event.target.id === 'lb-cols') navigate({ cols: event.target.value, cell: '' });
    });
    root.addEventListener('click', function (event) {
        const cell = event.target.closest('button.lb-cell');
        if (cell) { select(cell); return; }
        const preset = event.target.closest('[data-preset]');
        if (preset) {
            const p = PRESETS.find(function (item) { return item.key === preset.dataset.preset; });
            navigate({ rows: p.rows, cols: p.cols, cell: '' });
            return;
        }
        const basis = event.target.closest('[data-basis]');
        if (basis && basis.dataset.basis !== state.basis) { navigate({ basis: basis.dataset.basis }); return; }
        if (event.target.closest('#lb-swap')) {
            const parts = state.cell ? state.cell.split('|') : null;
            navigate({ rows: state.cols, cols: state.rows, cell: parts ? parts[1] + '|' + parts[0] : '' });
        }
    });
    root.addEventListener('keydown', function (event) {
        const cell = event.target.closest('button.lb-cell');
        if (cell && moveFocus(cell, event.key)) { event.preventDefault(); return; }
        if (event.key === 'Escape' && state.cell) navigate({ cell: '' }, cell ? cell.dataset.row + '|' + cell.dataset.col : state.cell);
    });
    root.addEventListener('mouseover', function (event) { cross(event.target.closest('button.lb-cell')); });
    root.addEventListener('mouseleave', function () { cross(null); });
    root.addEventListener('focusin', function (event) { cross(event.target.closest('button.lb-cell')); });
}

let bound = false;
EC.literaturbild = {
    // Called by the router whenever the view is shown; loads its data once.
    show: function () {
        if (!document.getElementById('lb-root')) return;
        load().then(function () { if (!bound) { bound = true; bind(); } });
    },
};

EC.viewParams.register('literaturbild', {
    keys: ['rows', 'cols', 'basis', 'cell'],
    own: true,
    get: function () {
        // Until the data are loaded, a deep link's parameters stand as given, so the
        // router does not overwrite them with the defaults.
        if (!dims && pending) {
            return { rows: pending.rows || '', cols: pending.cols || '', basis: pending.basis || '', cell: pending.cell || '' };
        }
        return {
            rows: state.rows === DEFAULTS.rows ? '' : state.rows, cols: state.cols === DEFAULTS.cols ? '' : state.cols,
            basis: state.basis === DEFAULTS.basis ? '' : state.basis, cell: state.cell,
        };
    },
    apply: apply,
});
})();
