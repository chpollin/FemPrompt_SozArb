// Matrix view plus the shared joint-coding table and work list. A cell counts
// works that carry both codes; it states joint coding, never a direction.
(function () {
'use strict';

const EC = window.EC;
const DEFAULT_AXES = { rows: 'AN_Bias_Axes', cols: 'AN_Harm_Types' };
const LEVEL_LABELS = { 1: 'teilweise', 2: 'ja' };
const TEXT_SOURCE_LABELS = { raw: 'Volltext', abstract: 'Abstract', none: 'kein Papertext' };
let model = null;
let focusWorkList = false;
let focusCell = null;

function statusKeyText(key) {
    if (key === model.NONE) return 'nicht zutreffend';
    if (key === model.UNDECIDABLE) return 'nicht entscheidbar';
    return 'noch nicht codiert';
}

// Letter marks rather than a dash, which next to a count reads as a minus sign.
function statusKeyGlyph(key) {
    if (key === model.NONE) return 'n. z.';
    if (key === model.UNDECIDABLE) return 'n. e.';
    return '';
}

function isStatusKey(key) { return key === model.NONE || key === model.UNDECIDABLE || key === model.ABSENT; }

function keyLabel(dimId, key) {
    const dim = model.dim(dimId);
    return isStatusKey(key) ? statusKeyText(key) : dim.valueLabel(key);
}

// Reads as a description of the work set, e.g. "Bias Axes noch nicht codiert".
// A work-level value keeps its field name so it is never read as a property of
// the code on the other axis.
function axisPhrase(dimId, key) {
    const dim = model.dim(dimId);
    if (isStatusKey(key)) return dim.label + ' ' + statusKeyText(key);
    return dim.workLevel ? dim.label + ' ' + dim.valueLabel(key) : dim.valueLabel(key);
}

function isJoint(axes) {
    return axes.every(function (axis) { return !isStatusKey(axis.key) && !model.dim(axis.dimId).workLevel; });
}

function headerHtml(dimId, key) {
    if (!isStatusKey(key) || !statusKeyGlyph(key)) return EC.esc(keyLabel(dimId, key));
    return EC.esc(statusKeyText(key)) + ' <span class="mark-glyph" aria-hidden="true">' + EC.esc(statusKeyGlyph(key)) + '</span>';
}

function cellKind(rowKey, colKey) {
    if (rowKey === model.ABSENT || colKey === model.ABSENT) return 'absent';
    if (rowKey === model.UNDECIDABLE || colKey === model.UNDECIDABLE) return 'undecidable';
    if (rowKey === model.NONE || colKey === model.NONE) return 'none';
    return 'value';
}

function cellGlyph(kind, works) {
    if (kind === 'absent') return '';
    if (kind === 'undecidable') return 'n. e.';
    if (kind === 'none') return 'n. z.';
    return works.every(function (work) { return work.status === 'verified'; }) ? '●' : '◆';
}

function countPhrase(axes, count) {
    const same = axes.length === 2 && axes[0].dimId === axes[1].dimId && axes[0].key === axes[1].key;
    return isJoint(axes) && !same ? 'gemeinsam codiert in ' + count + (count === 1 ? ' Werk' : ' Werken') : EC.workCount(count);
}

function cellDescription(rowDimId, rowKey, colDimId, colKey, works, kind) {
    const axes = [{ dimId: rowDimId, key: rowKey }, { dimId: colDimId, key: colKey }];
    const pair = axisPhrase(rowDimId, rowKey) + ' und ' + axisPhrase(colDimId, colKey);
    const verified = works.filter(function (work) { return work.status === 'verified'; }).length;
    return pair + ', ' + countPhrase(axes, works.length) + (kind === 'value' ? (verified === works.length ? ', fachlich verifiziert'
        : ', ' + model.publicLabel + (verified ? ', davon ' + verified + ' fachlich verifiziert' : '')) : '');
}

// Empty cells stay readable: a zero is only a zero when coding of the selection is
// complete on both axes, including included works that are not released yet;
// otherwise the cell is not determinable.
function emptyCell(row, col, undetermined) {
    const open = undetermined;
    return '<td class="matrix-empty' + (open ? ' matrix-empty--open' : '') + '" data-row="' + EC.esc(row) + '" data-col="' + EC.esc(col) +
        '" data-count="0" data-state="' + (open ? 'undetermined' : 'zero') + '"><span aria-hidden="true">' + (open ? 'n. b.' : '0') + '</span>' +
        '<span class="sr-only">' + (open ? '0 Werke, nicht bestimmbar, solange Werke noch nicht codiert sind' : '0 Werke') + '</span></td>';
}

function captionText(rowDimId, colDimId) {
    const rowDim = model.dim(rowDimId);
    const colDim = model.dim(colDimId);
    const joint = !rowDim.workLevel && !colDim.workLevel;
    return (joint ? 'Gemeinsam codiert in denselben Werken' : 'Werke je Code') + ', Zeilen ' + rowDim.label + ', Spalten ' + colDim.label;
}

// The table caption scrolls with a wide table, so the visible caption stands above
// the scroll region and the table keeps its own for screen readers.
function captionHtml(rowDimId, colDimId) {
    return '<p class="matrix-caption" aria-hidden="true">' + EC.esc(captionText(rowDimId, colDimId)) + '</p>';
}

// options.cellHref(rowKey, colKey) renders cells as links; otherwise they are
// buttons carrying data-row and data-col for the view's delegated handler.
function matrixTable(selection, rowDimId, colDimId, options) {
    const opts = options || {};
    // The not-coded row holds released works only. Works that are not yet coded are
    // not released, so the row appears only when a released work lacks the field.
    const hasAbsent = function (dimId) {
        return selection.some(function (work) { return model.stateOf(work, dimId).state === 'absent'; });
    };
    const rowKeys = model.rowKeys(rowDimId).filter(function (key) { return key !== model.ABSENT || hasAbsent(rowDimId); });
    const colKeys = model.rowKeys(colDimId).filter(function (key) { return key !== model.ABSENT || hasAbsent(colDimId); });
    const cells = model.crossTab(selection, rowDimId, colDimId);
    let maximum = 0;
    rowKeys.forEach(function (row) {
        colKeys.forEach(function (col) {
            if (cellKind(row, col) === 'value') maximum = Math.max(maximum, cells[row][col].length);
        });
    });
    const rowDim = model.dim(rowDimId);
    const colDim = model.dim(colDimId);
    const undetermined = !model.codingComplete(selection, rowDimId) || !model.codingComplete(selection, colDimId);
    let html = '<table class="matrix-table"' + (opts.id ? ' id="' + EC.esc(opts.id) + '"' : '') + '>' +
        '<caption class="sr-only">' + EC.esc(captionText(rowDimId, colDimId)) + '</caption>' +
        '<thead><tr><th scope="col" class="matrix-corner">' + EC.esc(rowDim.label) + ' <span aria-hidden="true">×</span> ' +
        EC.esc(colDim.label) + '</th>';
    colKeys.forEach(function (col) {
        html += '<th scope="col" class="matrix-col' + (isStatusKey(col) ? ' matrix-status' : '') + '" data-col="' + EC.esc(col) + '">' +
            headerHtml(colDimId, col) + '</th>';
    });
    html += '</tr></thead><tbody>';
    rowKeys.forEach(function (row) {
        html += '<tr><th scope="row" class="matrix-row' + (isStatusKey(row) ? ' matrix-status' : '') + '" data-row="' + EC.esc(row) + '">' +
            headerHtml(rowDimId, row) + '</th>';
        colKeys.forEach(function (col) {
            const works = cells[row][col];
            const kind = cellKind(row, col);
            if (!works.length) { html += emptyCell(row, col, undetermined); return; }
            const selected = opts.selected === row + '|' + col;
            const share = kind === 'value' && maximum ? (works.length / maximum).toFixed(2) : '0';
            const attrs = ' class="matrix-cell matrix-cell--' + kind + '" data-row="' + EC.esc(row) + '" data-col="' + EC.esc(col) +
                '" data-count="' + works.length + '" data-state="' + kind + '" aria-label="' +
                EC.esc(cellDescription(rowDimId, row, colDimId, col, works, kind)) + '" style="--share:' + share + '"';
            const glyph = cellGlyph(kind, works);
            const body = '<span class="cell-count" aria-hidden="true">' + works.length + '</span>' +
                (glyph ? '<span class="mark-glyph" aria-hidden="true">' + EC.esc(glyph) + '</span>' : '');
            html += '<td>' + (opts.cellHref
                ? '<a href="' + EC.esc(opts.cellHref(row, col)) + '"' + attrs + '>' + body + '</a>'
                : '<button type="button"' + attrs + ' aria-pressed="' + selected + '">' + body + '</button>') + '</td>';
        });
        html += '</tr>';
    });
    return html + '</tbody></table>';
}

function coverageLine(selection, dimId, axis, filtered) {
    const dim = model.dim(dimId);
    const own = model.coverage(selection, dimId);
    const pipeline = model.pipelineCoverage(dimId);
    // Unfiltered, the pipeline's figures are authoritative; filtered views can only
    // be counted over the released records that remain.
    const figures = pipeline && !filtered ? Object.assign({}, own, Object.keys(pipeline).reduce(function (acc, key) {
        if (pipeline[key] != null) acc[key] = pipeline[key];
        return acc;
    }, {})) : own;
    // The denominator stands once in the summary line above; axis lines only partition it.
    const parts = [figures.coded + ' mit Code', figures.none + ' nicht zutreffend'];
    if (dim.kind === 'field') parts.push(figures.undecidable + ' nicht entscheidbar');
    parts.push(figures.not_coded + ' noch nicht codiert');
    if (pipeline && !filtered && pipeline.absent) parts.push(pipeline.absent + ' ohne Angabe');
    if (pipeline && !filtered && pipeline.withheld != null) parts.push(pipeline.withheld + ' zurückgehalten');
    return '<p class="denominator" data-axis="' + axis + '" data-dim="' + EC.esc(dimId) + '"><span class="denominator-label">' +
        EC.esc(dim.label) + '</span> ' + parts.join(' · ') + '</p>';
}

// Pipeline figures cover the whole Include scope. Without them for every named
// dimension, the count runs over the released works and says so.
function summaryLine(selection, dimIds, filtered, prefix, options) {
    const summary = model.codedSummary(selection, dimIds, !filtered);
    const scope = summary.source === 'pipeline' ? ' eingeschlossenen Werken codiert'
        : (filtered ? ' eingeschlossenen Werken der Auswahl codiert' : ' veröffentlichten eingeschlossenen Werken codiert');
    let status = '';
    if (options && options.status) {
        const verified = selection.filter(function (work) { return work.status === 'verified'; }).length;
        status = verified ? ', davon ' + verified + ' fachlich verifiziert' : ', noch keines fachlich verifiziert';
    }
    return '<p class="denominator denominator--summary" data-coded="' + summary.coded + '" data-total="' + summary.total +
        '" data-source="' + summary.source + '">' + (prefix ? EC.esc(prefix) + ' · ' : '') +
        summary.coded + ' von ' + summary.total + scope + status + '</p>';
}

function evidenceBlocks(work, dimId, key) {
    const dim = model.dim(dimId);
    if (isStatusKey(key) || !dim) return '';
    // Only quotations are evidence. Correction reasons are agent rationale and stay on
    // the Werk page; record keys stay in its collapsed review record.
    return model.evidenceFor(work, dimId, key).filter(function (item) { return item.kind === 'quote'; }).map(function (item) {
        return '<figure class="evidence"><figcaption class="evidence-code">' + EC.esc(dim.valueLabel(key)) +
            (LEVEL_LABELS[item.level] ? ' · ' + LEVEL_LABELS[item.level] : '') + '</figcaption>' +
            '<blockquote class="evidence-quote">' + EC.highlight(item.text, item.term) + '</blockquote>' +
            '<p class="evidence-locator">' + EC.esc(TEXT_SOURCE_LABELS[item.textSource] || 'Textgrundlage offen') + '</p></figure>';
    }).join('');
}

// The codes a work carries on the axes of the list, so the reader sees why it is listed.
function cellCodes(work, axes) {
    return '<dl class="code-list code-list--compact">' + axes.map(function (axis) {
        const dim = model.dim(axis.dimId);
        const state = model.stateOf(work, axis.dimId);
        const text = state.state === 'value' ? state.values.map(dim.valueLabel).join(', ')
            : statusKeyText(model.keysOf(work, axis.dimId)[0]);
        return '<div class="code-row"><dt>' + EC.esc(dim.label) + '</dt><dd>' + EC.esc(text) + '</dd></div>';
    }).join('') + '</dl>';
}

function studyType(work) {
    const state = model.stateOf(work, model.STUDY_FIELD);
    return state.values.length ? state.values.join(', ') : '';
}

function workItem(work, axes) {
    const evidence = axes.map(function (axis) { return evidenceBlocks(work, axis.dimId, axis.key); }).join('');
    const meta = [work.authorYear, studyType(work)].filter(Boolean).map(EC.esc).concat([EC.statusMark(work.status)]).join(' · ');
    return '<li class="work-item" data-work-id="' + EC.esc(work.id) + '">' +
        '<h3 class="work-title"><a href="' + EC.esc(EC.href({ view: 'werk', id: work.id })) + '">' + EC.esc(work.title) + '</a></h3>' +
        '<p class="work-meta">' + meta + '</p>' + cellCodes(work, axes) +
        (evidence ? '<div class="work-evidence">' + evidence + '</div>' : '') + '</li>';
}

// Shared by the Matrix cell and the Netz edge: both name two codes on one work set.
function workListHtml(works, axes, headingId) {
    const a = axes[0];
    const b = axes[1];
    const same = a.dimId === b.dimId && a.key === b.key;
    const title = same ? axisPhrase(a.dimId, a.key) : axisPhrase(a.dimId, a.key) + ' und ' + axisPhrase(b.dimId, b.key);
    const count = countPhrase(axes, works.length);
    const uniqueAxes = same ? [a] : axes;
    return '<h2 id="' + headingId + '" tabindex="-1">' + EC.esc(title) + '</h2>' +
        '<p class="worklist-count">' + EC.esc(count) + '</p>' +
        (works.length ? '<ol class="worklist" role="list">' + works.map(function (work) { return workItem(work, uniqueAxes); }).join('') + '</ol>'
            : '<p class="empty-state">Kein Werk der aktuellen Auswahl trägt beide Codes.</p>');
}

function validDim(id, fallback) { return model.dim(id) ? id : fallback; }

function matrixParams(params) {
    return {
        rows: validDim(params.rows, DEFAULT_AXES.rows), cols: validDim(params.cols, DEFAULT_AXES.cols),
        year: params.year || '', study: params.study || '', status: params.status || '',
    };
}

function dimOptions(selected) {
    const groups = [['field', 'Analysefelder'], ['group', 'Kategorien']];
    return groups.map(function (group) {
        return '<optgroup label="' + group[1] + '">' + model.dims.filter(function (dim) { return dim.kind === group[0]; }).map(function (dim) {
            return '<option value="' + EC.esc(dim.id) + '"' + (dim.id === selected ? ' selected' : '') + '>' + EC.esc(dim.label) + '</option>';
        }).join('') + '</optgroup>';
    }).join('');
}

function plainOptions(values, selected, allLabel, labelOf) {
    return '<option value="">' + EC.esc(allLabel) + '</option>' + values.map(function (value) {
        return '<option value="' + EC.esc(value) + '"' + (String(value) === String(selected) ? ' selected' : '') + '>' +
            EC.esc(labelOf ? labelOf(value) : value) + '</option>';
    }).join('');
}

function statusOptionLabel(status) {
    return status === 'verified' ? '● fachlich verifiziert' : '◆ ' + model.publicLabel;
}

function filterValues() {
    const years = Array.from(new Set(model.includes.map(function (work) { return work.year; }).filter(Boolean)))
        .sort(function (a, b) { return b - a; });
    const studies = (model.fields.study_types || []).filter(function (study) {
        return model.includes.some(function (work) { return model.stateOf(work, model.STUDY_FIELD).values.indexOf(study) >= 0; });
    });
    const statuses = ['ki', 'verified'].filter(function (status) {
        return model.includes.some(function (work) { return work.status === status; });
    });
    return { years: years, studies: studies, statuses: statuses };
}

function renderMatrixView(params) {
    const state = matrixParams(params);
    const values = filterValues();
    document.getElementById('matrix-rows').innerHTML = dimOptions(state.rows);
    document.getElementById('matrix-cols').innerHTML = dimOptions(state.cols);
    document.getElementById('matrix-year').innerHTML = plainOptions(values.years, state.year, 'Alle Jahre');
    document.getElementById('matrix-study').innerHTML = plainOptions(values.studies, state.study, 'Alle Studientypen');
    document.getElementById('matrix-status').innerHTML = plainOptions(values.statuses, state.status, 'Alle Prüfstände', statusOptionLabel);
    // A filter over a single review status changes nothing, so it is not offered.
    document.getElementById('matrix-status').closest('label').hidden = values.statuses.length < 2 && !state.status;
    const filtered = Boolean(state.year || state.study || state.status);
    const selection = model.filterWorks(model.includes, state);
    const axes = state.rows === state.cols ? [['rows', state.rows]] : [['rows', state.rows], ['cols', state.cols]];
    document.getElementById('matrix-denominator').innerHTML = summaryLine(selection, [state.rows, state.cols], filtered) +
        axes.map(function (axis) { return coverageLine(selection, axis[1], axis[0], filtered); }).join('') +
        captionHtml(state.rows, state.cols);
    const parts = String(params.cell || '').split('|');
    const rowKeys = model.rowKeys(state.rows);
    const colKeys = model.rowKeys(state.cols);
    const cell = parts.length === 2 && rowKeys.indexOf(parts[0]) >= 0 && colKeys.indexOf(parts[1]) >= 0 ? parts : null;
    const wrap = document.getElementById('matrix-wrap');
    wrap.setAttribute('aria-label', 'Matrix ' + model.dim(state.rows).label + ' × ' + model.dim(state.cols).label + ', horizontal verschiebbar');
    wrap.innerHTML = matrixTable(selection, state.rows, state.cols, { id: 'matrix-table', selected: cell ? cell.join('|') : '' });
    document.getElementById('matrix-legend').innerHTML = EC.markLegendHtml();
    const list = document.getElementById('worklist');
    if (focusCell) {
        const target = wrap.querySelector('button.matrix-cell[data-row="' + CSS.escape(focusCell[0]) + '"][data-col="' + CSS.escape(focusCell[1]) + '"]');
        focusCell = null;
        if (target) target.focus();
    }
    if (!cell) { list.hidden = true; list.innerHTML = ''; return; }
    const works = model.crossTab(selection, state.rows, state.cols)[cell[0]][cell[1]];
    list.innerHTML = workListHtml(works, [{ dimId: state.rows, key: cell[0] }, { dimId: state.cols, key: cell[1] }], 'worklist-title');
    list.hidden = false;
    if (focusWorkList) { focusWorkList = false; document.getElementById('worklist-title').focus(); }
}

EC.registerView('matrix', {
    title: function () { return 'Matrix'; },
    init: function (instance) {
        model = instance;
        // The view container holding the matrix controls: #view-matrix in release.html,
        // the Literaturbild section in index.html.
        const root = document.getElementById('matrix-controls').closest('section');
        root.addEventListener('change', function (event) {
            const target = event.target;
            const params = Object.assign({ view: 'matrix' }, matrixParams(EC.parseHash()), { cell: EC.parseHash().cell });
            const key = { 'matrix-rows': 'rows', 'matrix-cols': 'cols', 'matrix-year': 'year', 'matrix-study': 'study', 'matrix-status': 'status' }[target.id];
            if (!key) return;
            params[key] = target.value;
            if (key === 'rows' || key === 'cols') delete params.cell;
            EC.go(params);
        });
        root.addEventListener('click', function (event) {
            const button = event.target.closest('button.matrix-cell');
            if (!button) return;
            const current = EC.parseHash();
            const params = Object.assign({ view: 'matrix' }, matrixParams(current));
            const cell = button.dataset.row + '|' + button.dataset.col;
            if (current.cell !== cell) { params.cell = cell; focusWorkList = true; } else { focusCell = [button.dataset.row, button.dataset.col]; }
            EC.go(params);
        });
    },
    render: renderMatrixView,
});

EC.matrixTable = matrixTable;
EC.matrixCaptionHtml = captionHtml;
EC.workListHtml = workListHtml;
EC.matrixAxisPhrase = axisPhrase;
EC.coverageLine = coverageLine;
EC.summaryLine = summaryLine;
EC.countPhrase = countPhrase;
EC.markLegendHtml = function () {
    return '<span aria-hidden="true">◆</span> ' + EC.esc(model.publicLabel) + ' · <span aria-hidden="true">●</span> fachlich verifiziert · ' +
        'n. z. codiert, nicht zutreffend · n. e. nicht entscheidbar · ' +
        'n. b. nicht bestimmbar, solange eingeschlossene Werke noch nicht codiert sind';
};
EC.statusKeyText = function (key) { return statusKeyText(key); };
EC.matrixDefaults = DEFAULT_AXES;
})();
