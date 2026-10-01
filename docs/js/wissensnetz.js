// Wissensnetz view of the working application: the ten screening categories as a network
// of joint coding. A node is a category, sized by the works coded with it; an edge counts
// the works coded with both categories, so it states joint coding and never a relation.
// The layout is a fixed circle in schema order, so the figure is the same on every load.
// The public result site keeps its own Netz (release-netz.js); this module is internal.
(function () {
'use strict';

const EC = window.EC;
const TAU = Math.PI * 2;
// Below this width the node labels grow and wrap so the scaled figure stays legible.
const NARROW_QUERY = '(max-width: 40rem)';
const MIN_STEPS = [1, 10, 25, 50, 100];
const LABEL_OVERRIDE = { Bias_Ungleichheit: 'Bias & Ungleichheit' };
const DECISIONS = {
    include: { label: 'Include', mark: '+' },
    exclude: { label: 'Exclude', mark: '−' },
    unclear: { label: 'Unclear', mark: '?' },
    none: { label: 'ohne Entscheidung', mark: '' },
};
const DECISION_ORDER = ['include', 'exclude', 'unclear', 'none'];
const SIDES = {
    expert: { mark: 'H', label: 'nur Expert:innen' },
    llm: { mark: 'L', label: 'nur LLM' },
    both: { mark: 'H+L', label: 'Expert:innen und LLM' },
};
const SIDE_ORDER = { expert: 0, llm: 1, both: 2 };
const BASES = {
    expert: { label: 'Expert:innen', caption: 'Einschätzung der Expert:innen' },
    llm: { label: 'LLM', caption: 'Codierung durch das LLM' },
    agree: { label: 'Übereinstimmung', caption: 'Expert:innen und LLM' },
};

let root = null;
let initialized = false;
let narrow = null;
let cats = [];
let groups = {};
let available = [];
let state = { basis: 'expert', sel: null, min: 1, scope: 'all' };
let net = null; // { works, nodes: {cat: stats}, edges: [stats] } for the current basis and scope
const cache = {};

function label(cat) { return LABEL_OVERRIDE[cat] || EC.catLabel(cat); }
function esc(text) { return EC.escapeHtml(text); }
function round(value) { return Math.round(value * 10) / 10; }
function workCount(n) { return n + (n === 1 ? ' Werk' : ' Werke'); }
function inWorks(n) { return n + (n === 1 ? ' Werk' : ' Werken'); }
function pct(value) { return Math.round(value * 100) + ' %'; }

// The current human decision of the Korpus stage table: the newest saved reviewer
// record, else the consolidated expert decision.
function decisionKey(paper) {
    const d = EC.korpusStages.decision(paper);
    return d === 'open' ? 'none' : d;
}

function coded(value) { return value === 0 || value === 1; }
function humanCats(p) { return (p.human && p.human.all_categories) || {}; }
function llmAssessed(p) { return Boolean(p.llm && p.llm.assessment_status === 'assessed' && p.llm.all_categories); }

// The works a basis reads: Expert:innen every work with a consolidated expert decision (as
// in Kategorien), LLM and Übereinstimmung only works with a human decision, since the
// reviewers may open this view and an open work shows no AI assessment (ADR-044).
function basisWorks(basis) {
    return EC.getAllPapers().filter(function (p) {
        const expert = Boolean(p.human && p.human.decision);
        if (basis === 'expert') return expert;
        if (!llmAssessed(p) || decisionKey(p) === 'none') return false;
        return basis === 'llm' || expert;
    });
}

// Under Übereinstimmung a set of categories is compared over the works in which both
// sides coded each category of the set (0 or 1), the basis of kappa_by_category.
function setStats(works, basis, set) {
    const all = function (source) { return set.every(function (c) { return source[c] === 1; }); };
    if (basis !== 'agree') {
        const list = works.filter(function (p) { return all(basis === 'expert' ? humanCats(p) : p.llm.all_categories); });
        return { set: set, value: list.length, works: list };
    }
    const human = [], llm = [], both = [], union = [];
    works.forEach(function (p) {
        const h = humanCats(p);
        if (!set.every(function (c) { return coded(h[c]) && coded(p.llm.all_categories[c]); })) return;
        const onH = all(h);
        const onL = all(p.llm.all_categories);
        if (onH) human.push(p);
        if (onL) llm.push(p);
        if (onH && onL) both.push(p);
        if (onH || onL) union.push(p);
    });
    return { set: set, value: union.length, works: union, union: union, human: human, llm: llm, both: both };
}

function buildNet(basis, scope) {
    const key = basis + '|' + scope;
    if (cache[key]) return cache[key];
    const base = basisWorks(basis);
    const works = scope === 'all' ? base : base.filter(function (p) { return decisionKey(p) === scope; });
    const nodes = {};
    cats.forEach(function (c) { nodes[c] = setStats(works, basis, [c]); });
    const edges = [];
    cats.forEach(function (a, i) {
        cats.slice(i + 1).forEach(function (b) { edges.push(setStats(works, basis, [a, b])); });
    });
    cache[key] = { base: base, works: works, nodes: nodes, edges: edges };
    return cache[key];
}

function scopesOf(basis) {
    const present = {};
    basisWorks(basis).forEach(function (p) { present[decisionKey(p)] = true; });
    return DECISION_ORDER.filter(function (key) { return present[key]; });
}

function selKey(sel) { return sel ? sel.join(',') : ''; }

function parseSel(value) {
    const parts = String(value || '').split(',').filter(function (c) { return cats.indexOf(c) >= 0; });
    if (parts.length === 1) return parts;
    if (parts.length === 2 && parts[0] !== parts[1]) {
        return parts.sort(function (a, b) { return cats.indexOf(a) - cats.indexOf(b); });
    }
    return null;
}

function sideOf(paper, s) {
    const h = s.human.indexOf(paper) >= 0;
    const l = s.llm.indexOf(paper) >= 0;
    return h && l ? 'both' : h ? 'expert' : 'llm';
}

function tallyText(papers) {
    const counts = {};
    papers.forEach(function (p) { const k = decisionKey(p); counts[k] = (counts[k] || 0) + 1; });
    return DECISION_ORDER.filter(function (k) { return counts[k]; }).map(function (k) { return counts[k] + ' ' + DECISIONS[k].label; }).join(', ');
}

function edgePhrase(s) {
    return label(s.set[0]) + ' und ' + label(s.set[1]) + ', gemeinsam codiert in ' + inWorks(s.value);
}

function itemName(s) {
    if (state.basis === 'agree') {
        const base = s.set.length === 2 ? label(s.set[0]) + ' und ' + label(s.set[1]) : label(s.set[0]);
        return base + ', von beiden codiert in ' + inWorks(s.both.length) + ', von mindestens einer Seite in ' + inWorks(s.union.length);
    }
    return s.set.length === 2 ? edgePhrase(s) : label(s.set[0]) + ', ' + workCount(s.value);
}

function chip(cat, pressed) {
    const category = { key: cat, label: label(cat), color: EC.CAT_COLORS[cat] };
    return EC.categoryChip(category, typeof pressed === 'boolean' ? { small: true, pressed: pressed } : { small: true });
}

// Shell

function shellHtml() {
    const basisSwitch = available.length > 1
        ? '<div class="lk-lenses wn-bases" role="group" aria-label="Datenbasis">' + available.map(function (key) {
            return '<button type="button" class="lk-lens" data-basis="' + key + '" aria-pressed="false">' + BASES[key].label + '</button>';
        }).join('') + '</div>'
        : '';
    return '<div class="controls wn-controls">' + basisSwitch +
        '<label>Entscheidung <select id="wn-scope"></select></label>' +
        '<label>Verbindungen ab <select id="wn-min"></select></label>' +
        '<a class="wn-terms-link" href="#view=begriffsnetz">Begriffsnetz der Analysefelder</a></div>' +
        '<p class="lk-caption" id="wn-caption"></p>' +
        '<div class="wn-layout">' +
        '<div class="wn-main"><div id="wn-figure" class="wn-figure"></div><ul id="wn-legend" class="wn-legend" role="list"></ul></div>' +
        '<div class="wn-side">' +
        '<section id="wn-detail" class="wn-detail" aria-labelledby="wn-detail-title" hidden></section>' +
        '<div class="wn-table-wrap" role="region" tabindex="0" aria-labelledby="wn-table-caption"><table id="wn-table" class="wn-table"></table></div>' +
        '</div></div>';
}

// Figure

function lines(text) {
    if (!narrow.matches || text.length <= 12) return [text];
    const words = text.split(' ');
    const out = [''];
    words.forEach(function (word) {
        const last = out[out.length - 1];
        if (last && (last + ' ' + word).length > 12) out.push(word);
        else out[out.length - 1] = last ? last + ' ' + word : word;
    });
    return out;
}

// Gegenstand on the left, Perspektive on the right, one free slot at top and bottom
// between them; the positions depend on the schema order only.
function positions() {
    const object = groups.object || [];
    const perspective = groups.perspective || cats.filter(function (c) { return object.indexOf(c) < 0; });
    const half = Math.max(object.length, perspective.length) + 1;
    const step = TAU / (2 * half);
    const pos = {};
    perspective.forEach(function (c, i) {
        pos[c] = -Math.PI / 2 + (i + 1 + (half - 1 - perspective.length) / 2) * step;
    });
    object.slice().reverse().forEach(function (c, i) {
        pos[c] = Math.PI / 2 + (i + 1 + (half - 1 - object.length) / 2) * step;
    });
    return pos;
}

function figureHtml() {
    const font = narrow.matches ? 22 : 13;
    const charW = font * 0.56;
    const R = 200;
    const angles = positions();
    const point = {};
    const bounds = { minX: -R, maxX: R, minY: -R, maxY: R };
    const grow = function (x, y) {
        bounds.minX = Math.min(bounds.minX, x); bounds.maxX = Math.max(bounds.maxX, x);
        bounds.minY = Math.min(bounds.minY, y); bounds.maxY = Math.max(bounds.maxY, y);
    };
    const nodeMax = Math.max.apply(null, cats.map(function (c) { return net.nodes[c].value; }).concat([1]));
    const radius = function (v) { return 5 + 19 * Math.sqrt(v / nodeMax); };
    cats.forEach(function (c) { point[c] = [R * Math.cos(angles[c]), R * Math.sin(angles[c])]; });

    const visible = net.edges.filter(function (s) { return s.value >= state.min && s.value > 0; });
    const edgeMax = Math.max.apply(null, visible.map(function (s) { return s.value; }).concat([1]));
    const width = function (v) { return 0.75 + 9 * v / edgeMax; };
    const sel = state.sel;
    const key = selKey(sel);
    const near = function (s) { return sel && (sel.length === 1 ? s.set.indexOf(sel[0]) >= 0 : selKey(s.set) === key); };

    const ordered = visible.slice().sort(function (a, b) {
        return (near(a) ? 1 : 0) - (near(b) ? 1 : 0) || a.value - b.value;
    });
    const pills = [];
    const edges = ordered.map(function (s) {
        const a = point[s.set[0]], b = point[s.set[1]];
        const c = [(a[0] + b[0]) * 0.18, (a[1] + b[1]) * 0.18];
        const d = 'M' + round(a[0]) + ' ' + round(a[1]) + 'Q' + round(c[0]) + ' ' + round(c[1]) + ' ' + round(b[0]) + ' ' + round(b[1]);
        const on = near(s);
        const chosen = selKey(s.set) === key;
        const opacity = round(0.15 + 0.6 * s.value / edgeMax);
        let strokes = '<path class="wn-hit" d="' + d + '" stroke-width="' + round(Math.max(width(s.value), 12)) + '"/>';
        if (state.basis === 'agree') {
            strokes += '<path class="wn-line wn-line--union" d="' + d + '" stroke-width="' + round(width(s.value)) + '"/>' +
                (s.both.length ? '<path class="wn-line wn-line--both" d="' + d + '" stroke-width="' + round(width(s.both.length)) + '"/>' : '');
        } else {
            strokes += '<path class="wn-line" d="' + d + '" stroke-width="' + round(width(s.value)) + '" style="--o:' + opacity + '"/>';
        }
        if (on) {
            const mid = [0.25 * a[0] + 0.5 * c[0] + 0.25 * b[0], 0.25 * a[1] + 0.5 * c[1] + 0.25 * b[1]];
            const text = state.basis === 'agree' ? s.both.length + '/' + s.union.length : String(s.value);
            const w = text.length * font * 0.62 + font;
            pills.push('<g class="wn-pill" transform="translate(' + round(mid[0]) + ' ' + round(mid[1]) + ')" aria-hidden="true">' +
                '<rect x="' + round(-w / 2) + '" y="' + round(-font * 0.75) + '" width="' + round(w) + '" height="' + round(font * 1.5) + '" rx="' + round(font * 0.75) + '"/>' +
                '<text text-anchor="middle" dy=".35em" font-size="' + font + '">' + text + '</text></g>');
        }
        return '<g class="wn-item wn-edge' + (on ? ' is-near' : '') + (chosen ? ' is-selected' : '') + '" role="button" tabindex="-1" aria-pressed="' + chosen +
            '" data-sel="' + esc(selKey(s.set)) + '" aria-label="' + esc(itemName(s)) + '"><title>' + esc(itemName(s)) + '</title>' + strokes + '</g>';
    });

    const nodes = cats.map(function (cat) {
        const s = net.nodes[cat];
        const p = point[cat];
        const r = radius(s.value);
        const cos = Math.cos(angles[cat]);
        const sin = Math.sin(angles[cat]);
        const right = cos >= 0;
        const gap = r + 8;
        const lx = p[0] + gap * cos + (right ? 2 : -2);
        const textLines = lines(label(cat));
        const countText = state.basis === 'agree' ? s.both.length + ' von ' + s.union.length : String(s.value);
        const total = textLines.length + 1;
        const ly = p[1] + gap * sin - (total - 1) * font * 0.6 + (sin > 0.3 ? font * 0.6 : sin < -0.3 ? -font * 0.6 : 0);
        const longest = Math.max.apply(null, textLines.map(function (t) { return t.length; }).concat([countText.length]));
        grow(lx + (right ? longest * charW : -longest * charW), ly - font);
        grow(lx, ly + total * font * 1.2);
        grow(p[0] - r - 4, p[1] - r - 4); grow(p[0] + r + 4, p[1] + r + 4);
        const chosen = selKey(sel) === cat;
        const on = sel && sel.indexOf(cat) >= 0;
        const inner = state.basis === 'agree' && s.union.length ? '<circle class="wn-dot-both" r="' + round(radius(s.both.length) * (s.both.length ? 1 : 0)) + '"/>' : '';
        return '<g class="wn-item wn-node' + (on ? ' is-near' : '') + (chosen ? ' is-selected' : '') + '" role="button" tabindex="-1" aria-pressed="' + chosen +
            '" data-sel="' + esc(cat) + '" aria-label="' + esc(itemName(s)) + '" style="--node:' + esc(EC.CAT_COLORS[cat] || 'var(--gray-500)') + '">' +
            '<title>' + esc(itemName(s)) + '</title>' +
            '<circle class="wn-hit" cx="' + round(p[0]) + '" cy="' + round(p[1]) + '" r="' + round(Math.max(r, 14)) + '"/>' +
            '<g transform="translate(' + round(p[0]) + ' ' + round(p[1]) + ')"><circle class="wn-dot' + (state.basis === 'agree' ? ' wn-dot--union' : '') + '" r="' + round(r) + '"/>' + inner + '</g>' +
            '<text class="wn-label" x="' + round(lx) + '" y="' + round(ly) + '" font-size="' + font + '" text-anchor="' + (right ? 'start' : 'end') + '">' +
            textLines.map(function (t, i) { return '<tspan x="' + round(lx) + '" dy="' + (i ? '1.2em' : '0') + '">' + esc(t) + '</tspan>'; }).join('') +
            '<tspan class="wn-count" x="' + round(lx) + '" dy="1.2em">' + esc(countText) + '</tspan></text></g>';
    });
    const pad = 6;
    const box = [bounds.minX - pad, bounds.minY - pad, bounds.maxX - bounds.minX + 2 * pad, bounds.maxY - bounds.minY + 2 * pad].map(round);
    return '<svg id="wn-graph" class="wn-graph' + (sel ? ' has-selection' : '') + '" role="group" aria-labelledby="wn-graph-title" viewBox="' + box.join(' ') + '">' +
        '<title id="wn-graph-title">Netz der gemeinsam codierten Kategorien</title>' +
        '<rect class="wn-bg" x="' + box[0] + '" y="' + box[1] + '" width="' + box[2] + '" height="' + box[3] + '"/>' +
        '<g class="wn-edges">' + edges.join('') + '</g><g class="wn-nodes">' + nodes.join('') + '</g>' + pills.join('') + '</svg>';
}

function legendHtml() {
    const swatch = function (cls, w) {
        return '<svg class="wn-legend-line" viewBox="0 0 28 14" width="28" height="14" aria-hidden="true"><path class="' + cls + '" d="M2 7H26" stroke-width="' + w + '"/></svg>';
    };
    const dot = '<svg viewBox="0 0 30 16" width="30" height="16" aria-hidden="true"><circle class="wn-legend-dot" cx="6" cy="8" r="3"/><circle class="wn-legend-dot" cx="20" cy="8" r="7"/></svg>';
    if (state.basis === 'agree') {
        return '<li>' + dot + ' Werke mit der Kategorie, innen von beiden codiert</li>' +
            '<li>' + swatch('wn-line wn-line--both', 4) + ' von beiden codiert</li>' +
            '<li>' + swatch('wn-line wn-line--union', 8) + ' von einer Seite codiert</li>';
    }
    return '<li>' + dot + ' Werke mit der Kategorie</li><li>' + swatch('wn-line', 6) + ' gemeinsam codiert in denselben Werken</li>';
}

// Table and detail

function tableHtml() {
    const sel = state.sel;
    const key = selKey(sel);
    let rows = net.edges.filter(function (s) { return s.value >= state.min && s.value > 0; });
    if (sel && sel.length === 1) rows = rows.filter(function (s) { return s.set.indexOf(sel[0]) >= 0; });
    // The first count column orders the rows: works in total, or under Übereinstimmung those both sides coded.
    const first = function (s) { return state.basis === 'agree' ? s.both.length : s.value; };
    rows.sort(function (a, b) { return first(b) - first(a) || b.value - a.value || cats.indexOf(a.set[0]) - cats.indexOf(b.set[0]); });
    const agree = state.basis === 'agree';
    const caption = sel && sel.length === 1 ? 'Verbindungen von ' + label(sel[0]) : 'Verbindungen';
    const head = agree
        ? '<th scope="col">Kategorien</th><th scope="col">Beide</th><th scope="col">Eine Seite</th><th scope="col">Anteil</th>'
        : '<th scope="col">Kategorien</th><th scope="col">Werke</th>';
    const body = rows.map(function (s) {
        const chosen = selKey(s.set) === key;
        const name = label(s.set[0]) + ' und ' + label(s.set[1]);
        const button = '<button type="button" class="wn-pick" data-sel="' + esc(selKey(s.set)) + '" aria-pressed="' + chosen + '">' +
            (agree ? s.both.length : s.value) + '<span class="sr-only"> ' + esc(agree ? 'von beiden codiert, ' + name : 'Werke, ' + name) + '</span></button>';
        const cells = agree
            ? '<td>' + button + '</td><td class="wn-num">' + (s.union.length - s.both.length) + '</td><td class="wn-num">' + (s.union.length ? pct(s.both.length / s.union.length) : '–') + '</td>'
            : '<td>' + button + '</td>';
        return '<tr' + (chosen ? ' class="is-selected"' : '') + '><th scope="row" class="wn-pair">' + chip(s.set[0], key === s.set[0]) +
            '<span class="lk-and" aria-hidden="true">+</span>' + chip(s.set[1], key === s.set[1]) + '</th>' + cells + '</tr>';
    }).join('');
    return '<caption id="wn-table-caption">' + esc(caption) + '</caption><thead><tr>' + head + '</tr></thead><tbody>' +
        (body || '<tr><td colspan="' + (agree ? 4 : 2) + '" class="empty-state">Keine Verbindung ab dieser Schwelle.</td></tr>') + '</tbody>';
}

function sortWorks(papers, s) {
    const byAuthor = function (a, b) { return String(a.author_year || a.title || '').localeCompare(String(b.author_year || b.title || ''), 'de'); };
    const byYear = function (a, b) { return (b.year || 0) - (a.year || 0); };
    const byDecision = function (a, b) { return DECISION_ORDER.indexOf(decisionKey(a)) - DECISION_ORDER.indexOf(decisionKey(b)); };
    return papers.slice().sort(function (a, b) {
        if (state.basis === 'agree') return SIDE_ORDER[sideOf(a, s)] - SIDE_ORDER[sideOf(b, s)] || byDecision(a, b) || byYear(a, b) || byAuthor(a, b);
        return byDecision(a, b) || byYear(a, b) || byAuthor(a, b);
    });
}

function itemHtml(paper, s) {
    const k = decisionKey(paper);
    const dec = DECISIONS[k];
    const side = state.basis === 'agree' ? sideOf(paper, s) : null;
    const id = encodeURIComponent(paper.id);
    const who = paper.author_year || (paper.year ? String(paper.year) : '');
    return '<li class="lk-item" data-decision="' + k + '"' + (side ? ' data-side="' + side + '"' : '') + '>' +
        '<span class="lk-mark lk-mark--' + k + '" aria-hidden="true">' + dec.mark + '</span>' +
        '<span class="lk-item-body"><a class="lk-item-title" href="#view=korpus&amp;paper=' + id + '">' + esc(paper.title) + '</a>' +
        '<span class="lk-item-meta">' +
        (side ? '<span class="lk-side lk-side--' + side + '" title="' + SIDES[side].label + '"><span aria-hidden="true">' + SIDES[side].mark +
            '</span><span class="sr-only">' + SIDES[side].label + '</span></span> ' : '') +
        '<span class="lk-dec">' + esc(dec.label) + '</span>' + (who ? ', ' + esc(who) : '') +
        ' <a class="wn-prism" href="prisma.html?paper=' + id + '">PRISM<span class="sr-only">, ' + esc(paper.title) + '</span></a></span></span></li>';
}

function detailHtml() {
    const sel = state.sel;
    const s = sel.length === 1 ? net.nodes[sel[0]] : net.edges.find(function (e) { return selKey(e.set) === selKey(sel); });
    const papers = sortWorks(s.works, s);
    let count;
    if (state.basis === 'agree') {
        count = workCount(s.union.length) + ' von mindestens einer Seite codiert, ' + s.both.length + ' von beiden';
    } else {
        count = (sel.length === 2 ? 'Gemeinsam codiert in ' + inWorks(s.value) : workCount(s.value)) + (papers.length ? ', ' + tallyText(papers) : '');
    }
    let html = '<div class="wn-detail-head"><h3 class="lk-detail-title" id="wn-detail-title" tabindex="-1">' +
        sel.map(function (c) { return chip(c); }).join(' <span class="lk-and">und</span> ') + '</h3>' +
        '<button type="button" class="wn-clear" data-clear="1" aria-label="Auswahl aufheben">&times;</button></div>' +
        '<p class="lk-detail-count">' + esc(count) + '</p>';
    if (state.basis === 'agree' && s.union.length) {
        const n = s.union.length;
        const row = function (name, part, cls) {
            return '<span class="lk-cmp-name">' + name + '</span><span class="lk-cmp-track" aria-hidden="true"><span class="lk-cmp-fill ' + cls +
                '" style="width:' + (part / n * 100).toFixed(1) + '%"></span></span><span class="lk-cmp-val">' + part + '</span>';
        };
        html += '<div class="lk-cmp" role="group" aria-label="Expert:innen und LLM im Vergleich">' +
            row('Expert:innen', s.human.length, 'lk-cmp-fill--human') + row('LLM', s.llm.length, 'lk-cmp-fill--llm') + '</div>';
    }
    html += papers.length
        ? '<ol class="lk-list wn-list" role="list">' + papers.map(function (p) { return itemHtml(p, s); }).join('') + '</ol>'
        : '<p class="empty-state">Kein Werk mit dieser Auswahl.</p>';
    return html;
}

function captionText() {
    const total = EC.getAllPapers().length;
    const n = net.base.length;
    let text = 'Gemeinsam codiert in denselben Werken, ' + BASES[state.basis].caption + ', ' + n + ' von ' + total + ' Werken ' +
        (state.basis === 'agree' ? 'von beiden eingeschätzt' : 'eingeschätzt');
    // The decision filter reads the human decision, a saved reviewer record before the expert decision.
    if (state.scope === 'none') text += ', davon ' + workCount(net.works.length) + ' ohne Entscheidung';
    else if (state.scope !== 'all') text += ', davon ' + workCount(net.works.length) + ' mit Entscheidung ' + DECISIONS[state.scope].label;
    return text;
}

function syncControls() {
    root.querySelectorAll('.wn-bases .lk-lens').forEach(function (btn) { btn.setAttribute('aria-pressed', String(btn.dataset.basis === state.basis)); });
    const scope = root.querySelector('#wn-scope');
    scope.innerHTML = '<option value="all">Alle</option>' + scopesOf(state.basis).map(function (k) {
        return '<option value="' + k + '">' + esc(DECISIONS[k].label) + '</option>';
    }).join('');
    scope.value = state.scope;
    const top = Math.max.apply(null, buildNet(state.basis, 'all').edges.map(function (s) { return s.value; }).concat([1]));
    const min = root.querySelector('#wn-min');
    min.innerHTML = MIN_STEPS.filter(function (v) { return v === 1 || v <= top; }).map(function (v) {
        return '<option value="' + v + '">' + (v === 1 ? 'allen' : workCount(v)) + '</option>';
    }).join('');
    min.value = String(state.min);
}

function paint() {
    if (state.scope !== 'all' && scopesOf(state.basis).indexOf(state.scope) < 0) state.scope = 'all';
    net = buildNet(state.basis, state.scope);
    const active = document.activeElement;
    const refocus = active && root.contains(active) && active.closest('#wn-figure') && active.dataset.sel !== undefined ? active.dataset.sel : null;
    syncControls();
    root.querySelector('#wn-caption').textContent = captionText();
    const figure = root.querySelector('#wn-figure');
    figure.innerHTML = figureHtml();
    root.querySelector('#wn-legend').innerHTML = legendHtml();
    root.querySelector('#wn-table').innerHTML = tableHtml();
    const detail = root.querySelector('#wn-detail');
    if (state.sel) { detail.innerHTML = detailHtml(); detail.hidden = false; } else { detail.hidden = true; detail.innerHTML = ''; }
    const items = Array.from(figure.querySelectorAll('.wn-item'));
    const home = items.find(function (item) { return item.dataset.sel === selKey(state.sel); }) || items[0];
    if (home) home.setAttribute('tabindex', '0');
    if (refocus !== null) {
        const target = items.find(function (item) { return item.dataset.sel === refocus; });
        if (target) { items.forEach(function (item) { item.setAttribute('tabindex', item === target ? '0' : '-1'); }); target.focus(); }
    }
}

function select(sel, fromTable) {
    const next = parseSel(selKey(sel));
    state.sel = next && selKey(next) === selKey(state.sel) ? null : next;
    paint();
    EC.viewParams.changed();
    if (state.sel && fromTable) {
        const title = root.querySelector('#wn-detail-title');
        if (title) {
            title.focus({ preventScroll: true });
            if (title.getBoundingClientRect().top < 0 || title.getBoundingClientRect().top > window.innerHeight) title.scrollIntoView({ block: 'start' });
        }
    }
}

function update(changes) {
    Object.assign(state, changes);
    paint();
    EC.viewParams.changed();
}

function onClick(event) {
    const basis = event.target.closest('.wn-bases .lk-lens');
    if (basis) { if (basis.dataset.basis !== state.basis) update({ basis: basis.dataset.basis }); return; }
    if (event.target.closest('[data-clear]')) { select(null); root.querySelector('#wn-figure .wn-item[tabindex="0"]').focus(); return; }
    const pick = event.target.closest('#wn-figure .wn-item, .wn-pick');
    if (pick) { select(pick.dataset.sel.split(','), !pick.closest('#wn-figure')); return; }
    const chipBtn = event.target.closest('.wn-table button.category-chip');
    if (chipBtn) { select([chipBtn.dataset.cat], true); return; }
    if (event.target.closest('.wn-bg') && state.sel) select(null);
}

function onChange(event) {
    if (event.target.id === 'wn-scope') update({ scope: event.target.value });
    else if (event.target.id === 'wn-min') update({ min: Number(event.target.value) || 1 });
}

// One tab stop for the figure: arrows move between its items, Enter or Space selects,
// Escape clears the selection.
function onKeydown(event) {
    if (event.key === 'Escape' && state.sel) { event.preventDefault(); select(null); return; }
    const item = event.target.closest && event.target.closest('#wn-figure .wn-item');
    if (!item) return;
    const items = Array.from(root.querySelectorAll('#wn-figure .wn-nodes .wn-item, #wn-figure .wn-edges .wn-item'));
    const at = items.indexOf(item);
    let next = -1;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (at + 1) % items.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (at - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(item.dataset.sel.split(','), false); return; }
    if (next < 0) return;
    event.preventDefault();
    items.forEach(function (other) { other.setAttribute('tabindex', other === items[next] ? '0' : '-1'); });
    items[next].focus();
}

// Hovering a node previews its connections without changing the selection.
function onHover(event) {
    const svg = root.querySelector('#wn-graph');
    if (!svg) return;
    const node = event.type === 'mouseover' && event.target.closest('#wn-figure .wn-node');
    svg.classList.toggle('is-preview', Boolean(node));
    svg.querySelectorAll('.wn-edge').forEach(function (edge) {
        edge.classList.toggle('is-preview-near', Boolean(node) && edge.dataset.sel.split(',').indexOf(node.dataset.sel) >= 0);
    });
}

function readParams(vp) {
    const basis = available.indexOf(vp.basis) >= 0 ? vp.basis : available[0];
    const min = Number(vp.min);
    return {
        basis: basis,
        sel: parseSel(vp.sel),
        min: MIN_STEPS.indexOf(min) >= 0 ? min : 1,
        scope: DECISIONS[vp.scope] ? vp.scope : 'all',
    };
}

let pending = null;
function apply(vp) {
    if (!initialized) { pending = vp; return; }
    state = readParams(vp || {});
    paint();
}

EC.viewParams.register('wissensnetz', {
    keys: ['basis', 'scope', 'min', 'sel'],
    get: function () {
        return {
            basis: state.basis === available[0] ? '' : state.basis,
            scope: state.scope === 'all' ? '' : state.scope,
            min: state.min === 1 ? '' : String(state.min),
            sel: selKey(state.sel),
        };
    },
    apply: apply,
});

window.initializeWissensnetz = function () {
    if (initialized) return;
    root = document.getElementById('wn-root');
    if (!root) return;
    initialized = true;
    cats = (EC.CATEGORIES || []).slice();
    groups = EC.categoryGroups() || {};
    const papers = EC.getAllPapers();
    // A basis without data offers no switch position.
    available = Object.keys(BASES).filter(function (key) {
        if (key === 'expert') return papers.some(function (p) { return p.human && p.human.decision && p.human.all_categories; });
        return basisWorks(key).length > 0;
    });
    if (!available.length || !cats.length) {
        root.innerHTML = '<p class="empty-state">Keine codierten Werke vorhanden.</p>';
        return;
    }
    state = readParams({});
    narrow = window.matchMedia(NARROW_QUERY);
    root.innerHTML = shellHtml();
    root.addEventListener('click', onClick);
    root.addEventListener('change', onChange);
    root.addEventListener('keydown', onKeydown);
    root.addEventListener('mouseover', onHover);
    root.addEventListener('mouseleave', onHover);
    // Label size and wrapping differ on narrow screens, so crossing the query redraws.
    narrow.addEventListener('change', function () { if (root.getClientRects().length) paint(); });
    if (pending) { apply(pending); pending = null; } else paint();
};
})();
