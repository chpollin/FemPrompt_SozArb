// Kategorien view: the Landkarte, Gegenstand rows against Perspektive columns as one
// heatmap under a switchable lens, linked to a detail panel for the chosen cell or
// category. A cell states joint coding in the same work, never a relation.

(function() {
'use strict';

const EC = window.EC;
let initialized = false;

// catLabel turns Bias_Ungleichheit into "Bias Ungleichheit"; only the ampersand
// form is a genuine override, the rest match the underscore-to-space default.
const LABEL_OVERRIDE = { Bias_Ungleichheit: 'Bias & Ungleichheit' };
function label(cat) { return LABEL_OVERRIDE[cat] || EC.catLabel(cat); }

const RECENT_YEAR = 2025;
const DECISIONS = {
    include: { label: 'Include', mark: '+' },
    exclude: { label: 'Exclude', mark: '−' },
    unclear: { label: 'Unclear', mark: '?' },
};
// Under Übereinstimmung a work of the selection is coded by the experts only, by the
// LLM only, or by both; the divergent ones lead each decision group of the list.
const SIDE_ORDER = { expert: 0, llm: 1, both: 2 };

function pct(value) { return Math.round(value * 100) + ' %'; }
function share(part, whole) { return whole ? part / whole : null; }
function inWorks(n) { return n + (n === 1 ? ' Werk' : ' Werken'); }

// Anteil: a cell as a share of its column category's works, a header as a share of all
// works with an expert decision. Both read only counts the Werke lens already shows.
function anteilBase(s) {
    return s.cats.length === 2
        ? { part: s.expert.length, whole: stats([s.cats[1]]).expert.length, text: ' der Kategorie ' + label(s.cats[1]) }
        : { part: s.expert.length, whole: map.assessed, text: ' mit Entscheidung der Expert:innen' };
}

// Each lens reads one value off the stats of a category set; null means no works.
const LENSES = {
    werke: {
        label: 'Werke',
        legend: 'Werke, von Expert:innen mit beiden Kategorien codiert',
        value: function(s) { return s.expert.length; },
        format: function(v) { return String(v); },
        tip: function(s) { return tallyText(s.expert); },
    },
    anteil: {
        label: 'Anteil',
        legend: 'Werke mit beiden Kategorien, Anteil an den Werken der Spaltenkategorie',
        value: function(s) { const b = anteilBase(s); return share(b.part, b.whole); },
        format: pct,
        tip: function(s) { const b = anteilBase(s); return b.part + ' von ' + inWorks(b.whole) + b.text; },
    },
    einschluss: {
        label: 'Einschluss',
        legend: 'Anteil Include an diesen Werken',
        value: function(s) { return share(s.include, s.expert.length); },
        format: pct,
        tip: function(s) { return s.include + ' von ' + EC.workCount(s.expert.length) + ' Include'; },
    },
    uebereinstimmung: {
        label: 'Übereinstimmung',
        legend: 'Von beiden codiert, Anteil an den von mindestens einer Seite codierten Werken',
        value: function(s) { return share(s.both.length, s.union.length); },
        format: pct,
        tip: function(s) {
            return 'Expert:innen ' + s.human.length + ', LLM ' + s.llm.length + ', beide ' + s.both.length +
                ', also ' + s.both.length + ' von ' + EC.workCount(s.union.length) + ' übereinstimmend' +
                ' (Werke mit beiden Codierungen)';
        },
    },
    aktualitaet: {
        label: 'Aktualität',
        legend: 'Anteil der Werke ab ' + RECENT_YEAR,
        value: function(s) { return share(s.recent, s.dated); },
        format: pct,
        tip: function(s) { return s.recent + ' von ' + EC.workCount(s.dated) + ' ab ' + RECENT_YEAR; },
    },
};
const LENS_KEYS = Object.keys(LENSES);

let map = null; // { rows, cols, works, assessed, paired, total }
const statsCache = {};
let lens = 'werke';
let selection = null; // [row, col] for a cell, [category] for a header
let openReason = null; // id of the one work whose LLM reasoning is shown
let tip = null;
let pendingParams = null;

function decisionKey(paper) {
    const d = paper.human.decision;
    return d === 'Include' ? 'include' : d === 'Exclude' ? 'exclude' : 'unclear';
}

function tallyText(papers) {
    const counts = { include: 0, exclude: 0, unclear: 0 };
    papers.forEach(function(paper) { counts[decisionKey(paper)]++; });
    return Object.keys(DECISIONS).filter(function(key) { return counts[key] || key !== 'unclear'; })
        .map(function(key) { return counts[key] + ' ' + DECISIONS[key].label; }).join(', ');
}

function coded(value) { return value === 0 || value === 1; }

function llmAssessed(paper) {
    return Boolean(paper.llm && paper.llm.assessment_status === 'assessed' && paper.llm.all_categories);
}

// The expert lenses read every work with a consolidated expert decision. Übereinstimmung
// compares only works in which both the experts and the LLM coded each category of the
// set (0 or 1); this is the basis of the canonical per-category rates in kappa_by_category.
function stats(cats) {
    const key = cats.join(',');
    if (statsCache[key]) return statsCache[key];
    const expert = map.works.filter(function(p) {
        const h = p.human.all_categories || {};
        return cats.every(function(c) { return h[c] === 1; });
    });
    const dated = expert.filter(function(p) { return typeof p.year === 'number'; });
    const paired = map.works.filter(function(p) {
        if (!llmAssessed(p)) return false;
        const h = p.human.all_categories || {};
        return cats.every(function(c) { return coded(h[c]) && coded(p.llm.all_categories[c]); });
    });
    const human = [], llm = [], both = [], union = [];
    paired.forEach(function(p) {
        const h = cats.every(function(c) { return p.human.all_categories[c] === 1; });
        const l = cats.every(function(c) { return p.llm.all_categories[c] === 1; });
        if (h) human.push(p);
        if (l) llm.push(p);
        if (h && l) both.push(p);
        if (h || l) union.push(p);
    });
    statsCache[key] = {
        cats: cats, expert: expert,
        include: expert.filter(function(p) { return decisionKey(p) === 'include'; }).length,
        dated: dated.length,
        recent: dated.filter(function(p) { return p.year >= RECENT_YEAR; }).length,
        paired: paired, human: human, llm: llm, both: both, union: union,
    };
    return statsCache[key];
}

function sideOf(paper, s) {
    const h = s.human.indexOf(paper) >= 0;
    const l = s.llm.indexOf(paper) >= 0;
    return h && l ? 'both' : h ? 'expert' : 'llm';
}

function buildMap() {
    const groups = EC.categoryGroups();
    const works = EC.getAllPapers().filter(function(p) { return p.human && p.human.decision; });
    return {
        rows: (groups.object || []).slice(),
        cols: (groups.perspective || []).slice(),
        works: works,
        assessed: works.length,
        paired: works.filter(llmAssessed).length,
        total: EC.getAllPapers().length,
    };
}

function selectionKey(sel) { return sel ? sel.join(',') : ''; }

function chipFor(cat, pressed) {
    const category = { key: cat, label: label(cat), color: EC.CAT_COLORS[cat] };
    return EC.categoryChip(category, typeof pressed === 'boolean' ? { small: true, pressed: pressed } : { small: true });
}

function setLabel(cats) { return cats.map(label).join(' und '); }

// The lens scale runs over the values the cells actually reach.
function cellRange() {
    const values = [];
    map.rows.forEach(function(row) {
        map.cols.forEach(function(col) {
            const v = LENSES[lens].value(stats([row, col]));
            if (v !== null) values.push(v);
        });
    });
    return { min: Math.min.apply(null, values), max: Math.max.apply(null, values) };
}

// Fill intensity in percent of the heat colour; an empty cell stays white.
function heat(value, range) {
    if (value === null) return 0;
    const t = range.max > range.min ? (value - range.min) / (range.max - range.min) : 1;
    return Math.round(8 + t * 84);
}

function headerScale(cats) {
    if (lens !== 'werke') return 1;
    return Math.max.apply(null, cats.map(function(c) { return stats([c]).expert.length; })) || 1;
}

function renderSkeleton() {
    const root = document.getElementById('landkarte');
    let html = '<p class="lk-caption" id="landkarte-caption"></p>';
    html += '<div class="lk-layout"><div class="lk-main">';
    html += '<div class="lk-lenses" role="group" aria-label="Maß der Landkarte">' + LENS_KEYS.map(function(key) {
        return '<button type="button" class="lk-lens" data-lens="' + key + '" aria-pressed="false">' + LENSES[key].label + '</button>';
    }).join('') + '</div>';
    html += '<div class="lk-wrap" role="region" tabindex="0" aria-label="Landkarte, horizontal verschiebbar">';
    html += '<table class="lk-table" aria-labelledby="landkarte-caption"><thead><tr>' +
        '<th scope="col" class="lk-corner"><span>Gegenstand</span> <span aria-hidden="true">×</span> <span>Perspektive</span></th>';
    map.cols.forEach(function(col, ci) {
        html += '<th scope="col" class="lk-col" data-cat="' + EC.escapeHtml(col) + '" data-ci="' + ci + '">' + chipFor(col, false) +
            '<span class="lk-marg" aria-hidden="true"><span class="lk-marg-bar"></span><span class="lk-marg-val"></span></span></th>';
    });
    html += '</tr></thead><tbody>';
    map.rows.forEach(function(row, ri) {
        html += '<tr><th scope="row" class="lk-row" data-cat="' + EC.escapeHtml(row) + '" data-ri="' + ri + '"><span class="lk-row-head">' + chipFor(row, false) +
            '<span class="lk-marg" aria-hidden="true"><span class="lk-marg-bar"></span><span class="lk-marg-val"></span></span></span></th>';
        map.cols.forEach(function(col, ci) {
            html += '<td><button type="button" class="lk-cell" data-row="' + EC.escapeHtml(row) + '" data-col="' + EC.escapeHtml(col) +
                '" data-ri="' + ri + '" data-ci="' + ci + '" aria-pressed="false" style="--delay:' + (ri + ci) * 35 + 'ms">' +
                '<span class="lk-val" aria-hidden="true"></span></button></td>';
        });
        html += '</tr>';
    });
    html += '</tbody></table></div>';
    html += '<p class="lk-legend" id="landkarte-legend"></p>';
    html += '</div><section class="lk-detail" id="landkarte-detail" aria-labelledby="landkarte-detail-title" hidden></section></div>';
    root.innerHTML = html;
}

// Re-encodes the same map under the active lens; the CSS transition on the fill is the
// one orchestrated moment of the view.
function paint() {
    const root = document.getElementById('landkarte');
    const L = LENSES[lens];
    const range = cellRange();
    document.getElementById('landkarte-caption').textContent = lens === 'uebereinstimmung'
        ? 'Gemeinsam codiert in denselben Werken, Expert:innen und LLM, ' + map.paired + ' von ' + map.total + ' Werken von beiden eingeschätzt'
        : 'Gemeinsam codiert in denselben Werken, Einschätzung der Expert:innen, ' + map.assessed + ' von ' + map.total + ' Werken eingeschätzt';
    root.querySelectorAll('.lk-lens').forEach(function(btn) { btn.setAttribute('aria-pressed', String(btn.dataset.lens === lens)); });
    const key = selectionKey(selection);
    root.querySelectorAll('button.lk-cell').forEach(function(cell) {
        const s = stats([cell.dataset.row, cell.dataset.col]);
        const v = L.value(s);
        const h = heat(v, range);
        cell.style.setProperty('--heat', h + '%');
        cell.style.setProperty('--ink', EC.color.inkOnHeat(h));
        cell.dataset.value = v === null ? '' : String(Math.round(v * 10000) / 10000);
        cell.querySelector('.lk-val').textContent = v === null ? '–' : L.format(v);
        cell.setAttribute('aria-label', setLabel(s.cats) + ', ' + L.label + ' ' + (v === null ? 'keine Werke' : L.format(v)) + ', ' + L.tip(s));
        cell.setAttribute('aria-pressed', String(cell.dataset.row + ',' + cell.dataset.col === key));
    });
    [['th.lk-row', map.rows], ['th.lk-col', map.cols]].forEach(function(pair) {
        const scale = headerScale(pair[1]);
        root.querySelectorAll(pair[0]).forEach(function(th) {
            const s = stats([th.dataset.cat]);
            const v = L.value(s);
            th.querySelector('.lk-marg-bar').style.setProperty('--w', (v === null ? 0 : v / scale * 100).toFixed(1) + '%');
            th.querySelector('.lk-marg-val').textContent = v === null ? '–' : L.format(v);
            th.dataset.value = v === null ? '' : String(Math.round(v * 10000) / 10000);
            const chip = th.querySelector('.category-chip');
            chip.setAttribute('aria-pressed', String(th.dataset.cat === key));
            chip.setAttribute('aria-label', label(th.dataset.cat) + ' allein, ' + L.label + ' ' + (v === null ? 'keine Werke' : L.format(v)) + ', ' + L.tip(s));
        });
    });
    document.getElementById('landkarte-legend').innerHTML =
        '<span class="lk-legend-label">' + EC.escapeHtml(L.legend) + '</span>' +
        '<span class="lk-scale"><span class="lk-scale-val">' + EC.escapeHtml(L.format(range.min)) + '</span>' +
        '<span class="lk-ramp" aria-hidden="true"></span>' +
        '<span class="lk-scale-val">' + EC.escapeHtml(L.format(range.max)) + '</span></span>';
    renderDetail();
}

function sortWorks(papers, s) {
    const order = { include: 0, exclude: 1, unclear: 2 };
    const byAuthor = function(a, b) { return String(a.author_year || '').localeCompare(String(b.author_year || ''), 'de'); };
    const byYear = function(a, b) { return (b.year || 0) - (a.year || 0); };
    const byDecision = function(a, b) { return order[decisionKey(a)] - order[decisionKey(b)]; };
    return papers.slice().sort(function(a, b) {
        if (lens === 'uebereinstimmung') return SIDE_ORDER[sideOf(a, s)] - SIDE_ORDER[sideOf(b, s)] || byYear(a, b) || byAuthor(a, b);
        if (lens === 'aktualitaet') return byYear(a, b) || byDecision(a, b) || byAuthor(a, b);
        return byDecision(a, b) || byYear(a, b) || byAuthor(a, b);
    });
}

// Concepts of the historical, frozen concept graph, counted over the listed works.
function conceptCounts(papers) {
    const data = EC.getConceptData();
    if (!data || !data.papers) return [];
    const labels = {};
    (data.nodes || []).forEach(function(n) { labels[n.id] = n.label; });
    const ids = new Set(papers.map(function(p) { return p.id; }));
    const counts = {};
    data.papers.forEach(function(p) {
        if (!ids.has(p.id)) return;
        (p.concepts || []).forEach(function(c) { counts[c] = (counts[c] || 0) + 1; });
    });
    return Object.keys(counts).map(function(c) { return { label: labels[c] || c, count: counts[c] }; })
        .sort(function(a, b) { return b.count - a.count || a.label.localeCompare(b.label, 'de'); });
}

function compareHtml(s) {
    const n = s.paired.length;
    if (!n) return '';
    const kappa = s.cats.length === 1 && EC.getKappas() ? EC.getKappas()[s.cats[0]] : null;
    const row = function(name, part, cls) {
        const v = part / n;
        return '<span class="lk-cmp-name">' + name + '</span>' +
            '<span class="lk-cmp-track" aria-hidden="true"><span class="lk-cmp-fill ' + cls + '" style="width:' + (v * 100).toFixed(1) + '%"></span></span>' +
            '<span class="lk-cmp-val">' + pct(v) + '</span>';
    };
    return '<div class="lk-cmp" role="group" aria-label="Expert:innen und LLM im Vergleich">' +
        row('Expert:innen', s.human.length, 'lk-cmp-fill--human') + row('LLM', s.llm.length, 'lk-cmp-fill--llm') +
        '<span class="lk-cmp-base">Anteil an ' + (n === 1 ? '1 Werk' : n + ' Werken') + ' mit beiden Codierungen' +
        (kappa ? ', κ ' + String(kappa.kappa.toFixed(2)).replace('.', ',') : '') + '</span></div>';
}

function reasonOf(paper) {
    return (paper.divergence && paper.divergence.llm_reasoning) || (paper.llm && paper.llm.reasoning) || '';
}

// The shared work item (EC.workItemHtml) with the round-one LLM reasoning on request.
function itemHtml(paper, s, key) {
    const reason = reasonOf(paper);
    const open = openReason === paper.id;
    const reasonId = 'lk-reason-' + EC.escapeHtml(paper.id);
    const pattern = paper.divergence && paper.divergence.pattern;
    return EC.workItemHtml(paper, {
        decision: key,
        side: lens === 'uebereinstimmung' ? sideOf(paper, s) : null,
        actions: reason ? ' <button type="button" class="lk-why" data-paper-id="' + EC.escapeHtml(paper.id) + '" aria-expanded="' + open +
            '" aria-controls="' + reasonId + '">LLM-Begründung</button>' : '',
        after: reason ? '<span class="lk-reason" id="' + reasonId + '"' + (open ? '' : ' hidden') + '>' +
            (pattern ? '<span class="lk-pattern">' + EC.escapeHtml(pattern) + '</span> ' : '') + EC.escapeHtml(reason) + '</span>' : '',
    });
}

function renderDetail() {
    const box = document.getElementById('landkarte-detail');
    if (!selection) { box.hidden = true; box.innerHTML = ''; return; }
    const s = stats(selection);
    const papers = sortWorks(lens === 'uebereinstimmung' ? s.union : s.expert, s);
    let count;
    if (lens === 'uebereinstimmung') {
        count = EC.workCount(papers.length) + ' von mindestens einer Seite codiert, ' + s.both.length + ' von beiden';
    } else {
        count = EC.workCount(papers.length) + (papers.length ? ', ' + tallyText(papers) : '');
    }
    const concepts = conceptCounts(papers).slice(0, 6);
    let html = '<h3 class="lk-detail-title" id="landkarte-detail-title" tabindex="-1">' +
        selection.map(function(c) { return chipFor(c); }).join(' <span class="lk-and">und</span> ') + '</h3>';
    html += '<p class="lk-detail-count">' + EC.escapeHtml(count) + '</p>';
    html += compareHtml(s);
    if (concepts.length) {
        html += '<ul class="lk-concepts" aria-label="Häufige Konzepte">' + concepts.map(function(c) {
            return '<li class="lk-concept">' + EC.escapeHtml(c.label) + ' <span class="lk-concept-count">' + c.count + '</span></li>';
        }).join('') + '</ul>';
    }
    html += EC.workGroupsHtml(papers, { decision: decisionKey, item: function(p, key) { return itemHtml(p, s, key); } });
    box.innerHTML = html;
    box.hidden = false;
}

function select(cats, focusDetail) {
    const key = selectionKey(cats);
    selection = key === selectionKey(selection) ? null : cats;
    openReason = null;
    paint();
    EC.viewParams.changed();
    if (selection && focusDetail) {
        const title = document.getElementById('landkarte-detail-title');
        // On narrow screens the panel stands below the map and would be out of view.
        if (title && title.getBoundingClientRect().top > window.innerHeight) title.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
}

function setLens(key) {
    if (key === lens || !LENSES[key]) return;
    lens = key;
    paint();
    EC.viewParams.changed();
}

function parseSelection(value) {
    const parts = String(value || '').split(',').filter(Boolean);
    if (parts.length === 2 && map.rows.indexOf(parts[0]) >= 0 && map.cols.indexOf(parts[1]) >= 0) return parts;
    if (parts.length === 1 && (map.rows.indexOf(parts[0]) >= 0 || map.cols.indexOf(parts[0]) >= 0)) return parts;
    return null;
}

function applyParams(vp) {
    if (!initialized || !map) { pendingParams = vp; return; }
    lens = LENSES[vp.lens] ? vp.lens : 'werke';
    const next = parseSelection(vp.sel);
    if (selectionKey(next) !== selectionKey(selection)) openReason = null;
    selection = next;
    paint();
}

EC.viewParams.register('vergleich', {
    keys: ['lens', 'sel'],
    get: function() { return { lens: lens === 'werke' ? '' : lens, sel: selectionKey(selection) }; },
    apply: applyParams,
});

// Reuses the look of the navigation tooltips (.rich-tooltip). The target's aria-label
// already carries the same text, so the tooltip is hidden from assistive technology.
function showTip(target) {
    if (!tip) {
        tip = document.createElement('div');
        tip.className = 'rich-tooltip lk-tip';
        tip.setAttribute('aria-hidden', 'true');
        tip.innerHTML = '<div class="tip-text"></div>';
        document.body.appendChild(tip);
    }
    const cats = target.dataset.row ? [target.dataset.row, target.dataset.col] : [target.closest('th').dataset.cat];
    const s = stats(cats);
    const L = LENSES[lens];
    const v = L.value(s);
    tip.firstChild.innerHTML = '<strong>' + EC.escapeHtml(setLabel(cats)) + '</strong><br>' +
        EC.escapeHtml(L.label + ' ' + (v === null ? 'keine Werke' : L.format(v))) + '<br>' + EC.escapeHtml(L.tip(s));
    tip.hidden = false;
    const rect = target.getBoundingClientRect();
    const box = tip.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - box.width / 2;
    let top = rect.bottom + 8;
    if (left < 8) left = 8;
    if (left + box.width > window.innerWidth - 8) left = window.innerWidth - box.width - 8;
    if (top + box.height > window.innerHeight - 8) top = rect.top - box.height - 8;
    tip.style.left = left + window.scrollX + 'px';
    tip.style.top = top + window.scrollY + 'px';
}

function hideTip() { if (tip) tip.hidden = true; }

// Crosshair: the row and column of the cell under the pointer or focus.
function cross(cell) {
    const root = document.getElementById('landkarte');
    const ri = cell ? cell.dataset.ri : null;
    const ci = cell ? cell.dataset.ci : null;
    root.querySelectorAll('.lk-table [data-ri], .lk-table [data-ci]').forEach(function(el) {
        el.classList.toggle('is-cross', cell !== null && (el.dataset.ri === ri || el.dataset.ci === ci) && el !== cell);
    });
}

function tipTarget(e) { return e.target.closest('button.lk-cell, th .category-chip'); }

function moveFocus(cell, key) {
    const step = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }[key];
    if (!step) return false;
    const ri = Number(cell.dataset.ri) + step[0];
    const ci = Number(cell.dataset.ci) + step[1];
    const next = document.querySelector('#landkarte button.lk-cell[data-ri="' + ri + '"][data-ci="' + ci + '"]');
    if (next) next.focus();
    return true;
}

window.initializeKategorien = function() {
    if (initialized) return;
    initialized = true;
    const root = document.getElementById('landkarte');
    if (!root) return;
    map = buildMap();
    renderSkeleton();
    if (pendingParams) { applyParams(pendingParams); pendingParams = null; } else paint();

    root.addEventListener('click', function(e) {
        const lensBtn = e.target.closest('.lk-lens');
        if (lensBtn) { setLens(lensBtn.dataset.lens); return; }
        const cell = e.target.closest('button.lk-cell');
        if (cell) { hideTip(); select([cell.dataset.row, cell.dataset.col], true); return; }
        const head = e.target.closest('.lk-table th .category-chip');
        if (head) { hideTip(); select([head.dataset.cat], true); return; }
        const why = e.target.closest('.lk-why');
        if (why) {
            openReason = openReason === why.dataset.paperId ? null : why.dataset.paperId;
            document.querySelectorAll('#landkarte-detail .lk-why').forEach(function(btn) {
                const open = btn.dataset.paperId === openReason;
                btn.setAttribute('aria-expanded', String(open));
                document.getElementById(btn.getAttribute('aria-controls')).hidden = !open;
            });
        }
    });
    root.addEventListener('keydown', function(e) {
        const cell = e.target.closest('button.lk-cell');
        if (cell && moveFocus(cell, e.key)) e.preventDefault();
    });
    root.addEventListener('mouseover', function(e) {
        const target = tipTarget(e);
        if (target) showTip(target);
        cross(e.target.closest('button.lk-cell'));
    });
    root.addEventListener('mouseout', function(e) {
        const target = tipTarget(e);
        if (target && !target.contains(e.relatedTarget) && document.activeElement !== target) hideTip();
        if (!root.contains(e.relatedTarget)) cross(null);
    });
    root.addEventListener('focusin', function(e) {
        const target = tipTarget(e);
        if (target && target.matches(':focus-visible')) showTip(target); else hideTip();
        cross(e.target.closest('button.lk-cell'));
    });
    root.addEventListener('focusout', function() { hideTip(); cross(null); });
    root.addEventListener('scroll', hideTip, true);
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') hideTip(); });
};

})();
