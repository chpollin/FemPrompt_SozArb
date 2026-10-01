// Netz view: ego network around one controlled-vocabulary term. An edge counts the
// works that carry both codes, so it states joint coding and never a direction.
// Layouts are computed once per render, there is no force simulation.
(function () {
'use strict';

const EC = window.EC;
const DEFAULT_TERM_DIM = 'AN_Bias_Axes';
const DEFAULT_FIELDS = ['AN_Bias_Axes', 'AN_Harm_Types', 'AN_Mitigation_Stage'];
// Keep in step with the min-width query in release-netz.css that shows the toggle.
const WIDE_QUERY = '(min-width: 64rem)';
const COLOUR_CLASSES = 10;
const SHAPE_COUNT = 6;
const TAU = Math.PI * 2;
// Estimated glyph widths in SVG user units for the 13px label and 12px count text; they only size the viewBox.
const LABEL_CHAR = 7.2;
const COUNT_CHAR = 7.5;
const EDGE_MIN = 1.5;
const EDGE_SPAN = 8.5;

let model = null;
let root = null;
let wide = null;
let lastParams = null;
let pendingFocus = '';
let fallbackTerm = null;
let termTokens = {};
let dimIndex = {};

function round(value) { return Math.round(value * 10) / 10; }

function labelOf(term) { return model.termLabel(term); }

// Work-level values keep their field name, so no edge reads as a property of the other end.
function phrase(term) { return EC.matrixAxisPhrase(term.dimId, term.key); }

function isWorkLevel(term) { return Boolean(model.dim(term.dimId).workLevel); }

function dimClass(dimId) { return 'netz-dim-' + (dimIndex[dimId] % COLOUR_CLASSES); }

function shapeOf(dimId, size) {
    const r = size;
    const shape = dimIndex[dimId] % SHAPE_COUNT;
    if (shape === 0) return '<circle r="' + round(r) + '"/>';
    if (shape === 1) return '<rect x="' + round(-r * 0.9) + '" y="' + round(-r * 0.9) + '" width="' + round(r * 1.8) + '" height="' + round(r * 1.8) + '"/>';
    const polygons = [
        null, null,
        [[0, -1.25], [1.25, 0], [0, 1.25], [-1.25, 0]],
        [[0, -1.2], [1.1, 0.9], [-1.1, 0.9]],
        [[0, 1.2], [1.1, -0.9], [-1.1, -0.9]],
        [[1.15, 0], [0.575, 1], [-0.575, 1], [-1.15, 0], [-0.575, -1], [0.575, -1]],
    ];
    return '<polygon points="' + polygons[shape].map(function (point) {
        return round(point[0] * r) + ',' + round(point[1] * r);
    }).join(' ') + '"/>';
}

// Neighbours come from subject fields. The coding basis and the screening category
// groups describe the review process, not what a work addresses.
function neighbourDims() {
    return model.dims.filter(function (dim) { return dim.kind === 'field' && !dim.process; });
}

function defaultFields() {
    return neighbourDims().map(function (dim) { return dim.id; }).filter(function (id) { return DEFAULT_FIELDS.indexOf(id) >= 0; });
}

function readFields(raw) {
    if (raw === 'none') return [];
    const picked = raw ? String(raw).split(',') : [];
    const valid = neighbourDims().map(function (dim) { return dim.id; }).filter(function (id) { return picked.indexOf(id) >= 0; });
    return valid.length ? valid : defaultFields();
}

// The default selection leaves the hash; an empty selection is stored as "none" so it differs from it.
function fieldsParam(fields) {
    if (fields.join(',') === defaultFields().join(',')) return null;
    return fields.length ? fields.join(',') : 'none';
}

function readState(params) {
    const parsed = model.parseToken(params.term);
    const valid = parsed && termTokens[model.token(parsed.dimId, parsed.key)];
    return {
        term: valid ? parsed : fallbackTerm,
        fields: readFields(params.fields),
        works: params.works === '1',
        edge: params.edge || '',
    };
}

function toParams(state) {
    return {
        view: 'netz', term: state.term ? model.token(state.term.dimId, state.term.key) : null,
        fields: fieldsParam(state.fields), edge: state.edge || null, works: state.works ? '1' : null,
    };
}

function navigate(changes) {
    EC.go(toParams(Object.assign(readState(EC.parseHash()), changes)));
}

function termOptions(groups) {
    return groups.map(function (group) {
        return '<optgroup label="' + EC.esc(group.dim.label) + '">' + group.values.map(function (item) {
            return '<option value="' + EC.esc(model.token(item.dimId, item.key)) + '">' +
                EC.esc(group.dim.valueLabel(item.key)) + ' (' + item.count + ')</option>';
        }).join('') + '</optgroup>';
    }).join('');
}

function shellHtml(groups) {
    return '<div class="controls netz-controls">' +
        '<label>Begriff <select id="netz-term">' + termOptions(groups) + '</select></label>' +
        '<fieldset id="netz-fields" class="netz-fields"><legend>Nachbarn aus</legend>' + neighbourDims().map(function (dim) {
            return '<label class="netz-check"><input type="checkbox" value="' + EC.esc(dim.id) + '"> ' + EC.esc(dim.label) + '</label>';
        }).join('') + '</fieldset>' +
        '<label class="netz-works-toggle"><input type="checkbox" id="netz-works"> Werke zeigen</label>' +
        '</div>' +
        '<h2 id="netz-heading" class="netz-heading" tabindex="-1"></h2>' +
        '<div id="netz-summary"></div>' +
        '<div class="netz-body">' +
        '<div id="netz-figure" class="netz-figure" role="region" tabindex="0" aria-label="Netzgrafik, horizontal verschiebbar"></div>' +
        '<ul id="netz-legend" class="netz-legend" role="list"></ul>' +
        '<div id="netz-list-wrap" class="netz-list-wrap"></div>' +
        '</div>' +
        '<section id="worklist-netz" class="worklist-section" aria-labelledby="worklist-netz-title" hidden></section>';
}

function edgeName(ego, neighbour) {
    return phrase(ego) + ' und ' + phrase(neighbour) + ', ' + EC.countPhrase([ego, neighbour], neighbour.works.length);
}

function svgOpen(box, egoLabel) {
    return '<svg id="netz-graph" class="netz-graph" role="group" aria-labelledby="netz-graph-title" focusable="false" viewBox="' +
        box.map(round).join(' ') + '"><title id="netz-graph-title">Netz um ' + EC.esc(egoLabel) + '</title>';
}

function radialFigure(ego, neighbours, selected) {
    const egoLabel = labelOf(ego);
    const dimsShown = neighbours.filter(function (item, i) { return i === 0 || item.dimId !== neighbours[i - 1].dimId; }).length;
    const slots = neighbours.length + (dimsShown > 1 ? dimsShown : 0);
    const step = TAU / slots;
    const maximum = neighbours.reduce(function (max, item) { return Math.max(max, item.works.length); }, 1);
    const pillW = Math.max(60, egoLabel.length * 8.6 + 28);
    const pillH = 30;
    const radius = Math.max(170, slots * 20 / TAU, pillW / 2 + 90);
    const inner = Math.max(pillW / 2 + 26, radius * 0.5);
    const outer = radius - 28;
    const bounds = { minX: -pillW / 2, maxX: pillW / 2, minY: -pillH / 2, maxY: pillH / 2 };
    function grow(x, y, pad) {
        bounds.minX = Math.min(bounds.minX, x - pad); bounds.maxX = Math.max(bounds.maxX, x + pad);
        bounds.minY = Math.min(bounds.minY, y - pad); bounds.maxY = Math.max(bounds.maxY, y + pad);
    }
    let slot = 0;
    const groups = neighbours.map(function (item, i) {
        if (i > 0 && item.dimId !== neighbours[i - 1].dimId) slot += 1;
        const angle = -Math.PI / 2 + (slot + 0.5) * step;
        slot += 1;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = radius * cos;
        const y = radius * sin;
        const label = isWorkLevel(item) ? phrase(item) : labelOf(item);
        const end = radius + 16 + label.length * LABEL_CHAR;
        grow(x, y, 14);
        grow(end * cos, end * sin, 10);
        const flip = cos < -1e-9;
        const degrees = angle * 180 / Math.PI + (flip ? 180 : 0);
        const count = item.works.length;
        const width = EDGE_MIN + EDGE_SPAN * count / maximum;
        const at = neighbours.length > 16 ? (i % 2 ? outer : inner) : (inner + outer) / 2;
        const pillWidth = String(count).length * COUNT_CHAR + 14;
        const token = model.token(item.dimId, item.key);
        const chosen = token === selected;
        return '<g class="netz-nb ' + dimClass(item.dimId) + '">' +
            '<g class="netz-item netz-edge' + (chosen ? ' is-selected' : '') + '" role="button" tabindex="-1" aria-pressed="' + chosen +
                '" data-act="edge" data-token="' + EC.esc(token) + '" aria-label="' + EC.esc(edgeName(ego, item) + ', Werke anzeigen') + '">' +
            '<line class="netz-ring" x1="0" y1="0" x2="' + round(x) + '" y2="' + round(y) + '" stroke-width="' + round(width + 8) + '"/>' +
            '<line class="netz-line" x1="0" y1="0" x2="' + round(x) + '" y2="' + round(y) + '" stroke-width="' + round(width) + '"/>' +
            '<line class="netz-hit" x1="0" y1="0" x2="' + round(x) + '" y2="' + round(y) + '" stroke-width="' + round(Math.max(width, 18)) + '"/>' +
            '<g transform="translate(' + round(at * cos) + ' ' + round(at * sin) + ')">' +
            '<rect class="netz-count-box" x="' + round(-pillWidth / 2) + '" y="-9" width="' + round(pillWidth) + '" height="18" rx="9"/>' +
            '<text class="netz-count" text-anchor="middle" dy=".35em">' + count + '</text></g></g>' +
            '<g class="netz-item netz-node" role="button" tabindex="-1" data-act="center" data-token="' + EC.esc(token) +
                '" aria-label="' + EC.esc(phrase(item) + ' ins Zentrum') + '" transform="translate(' + round(x) + ' ' + round(y) + ')">' +
            '<circle class="netz-hit" r="14"/><g class="netz-marker">' + shapeOf(item.dimId, 7) + '</g>' +
            '<text class="netz-label" transform="rotate(' + round(degrees) + ')" x="' + (flip ? -16 : 16) +
                '" text-anchor="' + (flip ? 'end' : 'start') + '" dy=".35em">' + EC.esc(label) + '</text></g></g>';
    });
    const pad = 8;
    const box = [bounds.minX - pad, bounds.minY - pad, bounds.maxX - bounds.minX + 2 * pad, bounds.maxY - bounds.minY + 2 * pad];
    return svgOpen(box, egoLabel) + groups.join('') +
        '<g class="netz-ego" aria-hidden="true"><rect x="' + round(-pillW / 2) + '" y="' + round(-pillH / 2) + '" width="' + round(pillW) +
        '" height="' + pillH + '" rx="15"/><text text-anchor="middle" dy=".35em">' + EC.esc(egoLabel) + '</text></g></svg>';
}

function workGlyph(work) { return work.status === 'verified' ? '●' : '◆'; }

function bipartiteFigure(ego, neighbours, selected) {
    const egoLabel = labelOf(ego);
    const works = model.worksWith(model.includes, ego);
    const rows = Math.max(works.length, neighbours.length, 1);
    const rowHeight = 24;
    const pad = 20;
    const height = rows * rowHeight;
    const yWork = function (i) { return pad + (i + 0.5) * height / works.length; };
    const yTerm = function (i) { return pad + (i + 0.5) * height / neighbours.length; };
    const workWidth = works.reduce(function (max, work) { return Math.max(max, (work.authorYear || work.title).length + 2); }, 8) * LABEL_CHAR;
    const left = Math.max(140, workWidth + 40);
    const right = left + 380;
    const termWidth = neighbours.reduce(function (max, item) {
        return Math.max(max, (isWorkLevel(item) ? phrase(item) : labelOf(item)).length + 4);
    }, 8) * LABEL_CHAR;
    const total = right + 24 + termWidth + 16;
    const index = {};
    works.forEach(function (work, i) { index[work.id] = i; });
    const links = neighbours.map(function (item, j) {
        const token = model.token(item.dimId, item.key);
        return item.works.map(function (work) {
            return '<line class="netz-link ' + dimClass(item.dimId) + (token === selected ? ' is-selected' : '') + '" x1="' + left + '" y1="' + round(yWork(index[work.id])) +
                '" x2="' + right + '" y2="' + round(yTerm(j)) + '"/>';
        }).join('');
    }).join('');
    const workItems = works.map(function (work, i) {
        const y = round(yWork(i));
        const status = work.status === 'verified' ? 'fachlich verifiziert' : model.publicLabel;
        return '<a class="netz-item netz-work" tabindex="-1" href="' + EC.esc(EC.href({ view: 'werk', id: work.id })) +
            '" aria-label="' + EC.esc((work.authorYear || work.title) + ', ' + status + ', Werk öffnen') + '">' +
            '<rect class="netz-hit" x="4" y="' + round(y - rowHeight / 2) + '" width="' + round(left - 4) + '" height="' + rowHeight + '"/>' +
            '<text class="netz-label" x="' + (left - 16) + '" y="' + y + '" text-anchor="end" dy=".35em">' + EC.esc(work.authorYear || work.title) +
            ' <tspan class="netz-glyph" aria-hidden="true">' + workGlyph(work) + '</tspan></text>' +
            '<circle class="netz-dot" cx="' + left + '" cy="' + y + '" r="3.5"/></a>';
    }).join('');
    const termItems = neighbours.map(function (item, j) {
        const y = round(yTerm(j));
        const token = model.token(item.dimId, item.key);
        const chosen = token === selected;
        const label = isWorkLevel(item) ? phrase(item) : labelOf(item);
        return '<g class="netz-item netz-term ' + dimClass(item.dimId) + (chosen ? ' is-selected' : '') + '" role="button" tabindex="-1" aria-pressed="' + chosen +
            '" data-act="edge" data-token="' + EC.esc(token) + '" aria-label="' + EC.esc(edgeName(ego, item) + ', Werke anzeigen') + '">' +
            '<rect class="netz-hit" x="' + (right - 6) + '" y="' + round(y - rowHeight / 2) + '" width="' + round(total - right + 6) + '" height="' + rowHeight + '"/>' +
            '<g class="netz-marker" transform="translate(' + right + ' ' + y + ')">' + shapeOf(item.dimId, 6) + '</g>' +
            '<text class="netz-label" x="' + (right + 14) + '" y="' + y + '" dy=".35em">' + EC.esc(label) +
            ' <tspan class="netz-count-inline">' + item.works.length + '</tspan></text></g>';
    }).join('');
    return svgOpen([0, 0, total, height + 2 * pad], egoLabel) + '<g aria-hidden="true">' + links + '</g>' + workItems + termItems + '</svg>';
}

function legendHtml(neighbours) {
    const seen = [];
    neighbours.forEach(function (item) { if (seen.indexOf(item.dimId) < 0) seen.push(item.dimId); });
    return seen.map(function (dimId) {
        return '<li><svg class="netz-legend-marker ' + dimClass(dimId) + '" viewBox="-9 -9 18 18" width="16" height="16" aria-hidden="true">' +
            shapeOf(dimId, 7) + '</svg> ' + EC.esc(model.dim(dimId).label) + '</li>';
    }).join('');
}

function listHtml(ego, neighbours, selected) {
    const joint = !isWorkLevel(ego) && !neighbours.some(isWorkLevel);
    const caption = joint ? 'Gemeinsam codiert mit ' + labelOf(ego) : 'Begriffe in Werken mit ' + phrase(ego);
    return '<table id="netz-list" class="netz-list"><caption>' + EC.esc(caption) + '</caption>' +
        '<thead><tr><th scope="col">Begriff</th><th scope="col">Feld</th><th scope="col">Werke</th>' +
        '<th scope="col"><span class="sr-only">Aktion</span></th></tr></thead><tbody>' + neighbours.map(function (item) {
            const token = model.token(item.dimId, item.key);
            const chosen = token === selected;
            const label = labelOf(item);
            return '<tr' + (chosen ? ' class="is-selected"' : '') + '><th scope="row">' + EC.esc(label) + '</th><td>' + EC.esc(model.dim(item.dimId).label) + '</td>' +
                '<td><button type="button" class="netz-show-works" data-act="edge" data-token="' + EC.esc(token) + '" aria-pressed="' + chosen + '">' +
                EC.esc(EC.workCount(item.works.length)) + '<span class="sr-only"> mit ' + EC.esc(phrase(item)) + ', anzeigen</span></button></td>' +
                '<td><button type="button" class="netz-center" data-act="center" data-token="' + EC.esc(token) + '">Ins Zentrum' +
                '<span class="sr-only"> ' + EC.esc(phrase(item)) + '</span></button></td></tr>';
        }).join('') + '</tbody></table>';
}

function syncControls(state) {
    root.querySelector('#netz-term').value = model.token(state.term.dimId, state.term.key);
    root.querySelectorAll('#netz-fields input').forEach(function (box) { box.checked = state.fields.indexOf(box.value) >= 0; });
    root.querySelector('#netz-works').checked = state.works;
}

function resetRoving(figure, selected) {
    const items = Array.from(figure.querySelectorAll('.netz-item'));
    items.forEach(function (item) { item.setAttribute('tabindex', '-1'); });
    const chosen = items.find(function (item) { return item.dataset.act === 'edge' && item.dataset.token === selected; }) || items[0];
    if (chosen) chosen.setAttribute('tabindex', '0');
}

function render(params) {
    lastParams = params;
    const state = readState(params);
    const figure = root.querySelector('#netz-figure');
    const list = root.querySelector('#worklist-netz');
    const heading = root.querySelector('#netz-heading');
    if (!state.term) {
        heading.textContent = '';
        figure.innerHTML = '<p class="empty-state">Kein veröffentlichtes eingeschlossenes Werk trägt einen codierten Begriff.</p>';
        root.querySelector('#netz-summary').innerHTML = '';
        root.querySelector('#netz-legend').innerHTML = '';
        root.querySelector('#netz-list-wrap').innerHTML = '';
        list.hidden = true;
        return;
    }
    syncControls(state);
    const ego = state.term;
    const neighbours = model.neighbours(model.includes, ego, state.fields);
    const chosen = neighbours.find(function (item) { return model.token(item.dimId, item.key) === state.edge; });
    const selected = chosen ? state.edge : '';
    const bipartite = state.works && wide.matches;
    // The hidden comma keeps term and field apart in the heading's accessible name.
    heading.innerHTML = EC.esc(labelOf(ego)) + '<span class="sr-only">, </span><span class="netz-heading-dim">' +
        EC.esc(model.dim(ego.dimId).label) + '</span>';
    root.querySelector('#netz-summary').innerHTML = EC.summaryLine(model.includes, [ego.dimId].concat(state.fields), false);
    const key = model.token(ego.dimId, ego.key) + '|' + (bipartite ? 'works' : 'radial');
    const scroll = figure.dataset.key === key ? figure.scrollLeft : null;
    if (neighbours.length) {
        figure.innerHTML = bipartite ? bipartiteFigure(ego, neighbours, selected) : radialFigure(ego, neighbours, selected);
        resetRoving(figure, selected);
    } else {
        figure.innerHTML = '<p class="empty-state">Kein gemeinsam codierter Begriff in den gewählten Feldern.</p>';
    }
    figure.dataset.key = key;
    figure.scrollLeft = scroll == null ? Math.max(0, (figure.scrollWidth - figure.clientWidth) / 2) : scroll;
    root.querySelector('#netz-legend').innerHTML = legendHtml(neighbours);
    root.querySelector('#netz-list-wrap').innerHTML = neighbours.length ? listHtml(ego, neighbours, selected) : '';
    if (chosen) {
        list.innerHTML = EC.workListHtml(chosen.works, [{ dimId: ego.dimId, key: ego.key }, { dimId: chosen.dimId, key: chosen.key }], 'worklist-netz-title');
        list.hidden = false;
    } else {
        list.hidden = true;
        list.innerHTML = '';
    }
    if (pendingFocus) {
        const target = root.querySelector(pendingFocus);
        pendingFocus = '';
        if (target) target.focus();
    }
}

function itemSelector(act, token, inFigure) {
    return (inFigure ? '#netz-figure ' : '') + '[data-act="' + act + '"][data-token="' + CSS.escape(token) + '"]';
}

function activate(source) {
    const token = source.dataset.token;
    const current = readState(EC.parseHash());
    const inFigure = Boolean(source.closest('#netz-figure'));
    if (source.dataset.act === 'edge') {
        const closing = current.edge === token;
        pendingFocus = closing ? itemSelector('edge', token, inFigure) + (inFigure ? '' : '.netz-show-works') : '#worklist-netz-title';
        navigate({ edge: closing ? '' : token });
    } else {
        pendingFocus = '#netz-heading';
        navigate({ term: model.parseToken(token), edge: '' });
    }
}

function onChange(event) {
    const target = event.target;
    const current = readState(EC.parseHash());
    if (target.id === 'netz-term') {
        navigate({ term: model.parseToken(target.value), edge: '' });
    } else if (target.id === 'netz-works') {
        navigate({ works: target.checked });
    } else if (target.closest('#netz-fields')) {
        const checked = Array.from(root.querySelectorAll('#netz-fields input:checked')).map(function (box) { return box.value; });
        const fields = neighbourDims().map(function (dim) { return dim.id; }).filter(function (id) { return checked.indexOf(id) >= 0; });
        const edge = model.parseToken(current.edge);
        navigate({ fields: fields, edge: edge && fields.indexOf(edge.dimId) >= 0 ? current.edge : '' });
    }
}

function onClick(event) {
    const source = event.target.closest('[data-act]');
    if (source && root.contains(source)) activate(source);
}

// One tab stop for the figure: arrows move between its items, Tab leaves it.
function onKeydown(event) {
    const item = event.target.closest('.netz-item');
    if (!item || !item.closest('#netz-figure')) return;
    const items = Array.from(root.querySelectorAll('#netz-figure .netz-item'));
    const at = items.indexOf(item);
    let next = -1;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (at + 1) % items.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (at - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else if ((event.key === 'Enter' || event.key === ' ') && item.dataset.act) { event.preventDefault(); activate(item); return; }
    if (next < 0) return;
    event.preventDefault();
    items[next].focus();
}

function onFocusin(event) {
    const item = event.target.closest && event.target.closest('#netz-figure .netz-item');
    if (!item) return;
    root.querySelectorAll('#netz-figure .netz-item').forEach(function (other) { other.setAttribute('tabindex', other === item ? '0' : '-1'); });
}

EC.registerView('netz', {
    title: function () { return 'Netz'; },
    init: function (instance) {
        model = instance;
        root = document.getElementById('netz-root');
        const groups = model.terms(model.includes).filter(function (group) { return !group.dim.process; });
        groups.forEach(function (group) {
            group.values.forEach(function (item) { termTokens[model.token(item.dimId, item.key)] = true; });
        });
        model.dims.forEach(function (dim, i) { dimIndex[dim.id] = i; });
        const pool = (groups.find(function (group) { return group.dim.id === DEFAULT_TERM_DIM; }) || groups[0] || { values: [] }).values;
        const best = pool.reduce(function (top, item) { return !top || item.count > top.count ? item : top; }, null);
        fallbackTerm = best ? { dimId: best.dimId, key: best.key } : null;
        wide = window.matchMedia(WIDE_QUERY);
        root.innerHTML = shellHtml(groups);
        root.addEventListener('click', onClick);
        root.addEventListener('change', onChange);
        root.addEventListener('keydown', onKeydown);
        root.addEventListener('focusin', onFocusin);
        // The bipartite layout only exists at wide widths, so a resize across the query re-renders.
        wide.addEventListener('change', function () {
            if (lastParams && root.getClientRects().length) render(lastParams);
        });
    },
    render: render,
});
})();
