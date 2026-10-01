// Fragen start page, one answer page per research sub-question, and Methode.
(function () {
'use strict';

const EC = window.EC;

// The one place that defines the research questions shown on the site: the main
// question as start heading and, per sub-question, its wording, matrix presets, the
// analysis fields it draws on and the assertion topics assigned to it. Canonical
// wording and answer plan live in knowledge/project.md#research-questions and
// knowledge/analysis-methods.md#answering-the-research-questions.
// Assertions carry topics rather than a sub-question; upgrade path is an explicit
// sub-question field in the assertion schema, emitted by
// src/publish/build_assertion_index.py, which then replaces the `topics` lists.
const MAIN_QUESTION = 'Wie können Fachkräfte der Sozialen Arbeit verantwortlich mit LLMs arbeiten, und was zeigt die Literatur dazu?';
const QUESTIONS = [
    {
        id: '1', name: 'Nutzung',
        text: 'Für welche Aufgaben und Felder der Sozialen Arbeit beschreibt die Literatur den Einsatz von LLMs, und welchen Nutzen berichtet sie?',
        // A task field follows once the codebook amendment adds it.
        maps: [{ rows: 'AN_Population', cols: 'AN_Prompting_Role' }],
        fields: ['AN_Population', 'AN_Prompting_Role'],
        topics: [],
    },
    {
        id: '2', name: 'Risiken',
        text: 'Welche Bias-Achsen und Schadensarten benennt die Literatur, und für welche Gruppen?',
        maps: [{ rows: 'AN_Bias_Axes', cols: 'AN_Harm_Types' }, { rows: 'AN_Bias_Axes', cols: 'AN_Population' }],
        fields: ['AN_Bias_Axes', 'AN_Harm_Types', 'AN_Population'],
        topics: [],
    },
    {
        id: '3', name: 'Praktiken',
        text: 'Welche Prompting-Techniken und Schutzmaßnahmen werden vorgeschlagen, demonstriert oder evaluiert, zu welchem Zweck, auf welcher Stufe und mit welchen berichteten Wirkungen und Grenzen?',
        maps: [{ rows: 'AN_Prompt_Techniques', cols: 'AN_Prompting_Role' }, { rows: 'AN_Mitigation_Stage', cols: 'AN_Mitigation_Status' }],
        fields: ['AN_Prompt_Techniques', 'AN_Prompting_Role', 'AN_Mitigation_Stage', 'AN_Mitigation_Status'],
        topics: ['Prompting and Bias Mitigation'],
    },
    {
        id: '4', name: 'Kompetenzen',
        text: 'Welche Kompetenzen und organisationalen Voraussetzungen nennt die Literatur, und wo greifen allgemeine Prompting-Anleitungen für die Soziale Arbeit zu kurz?',
        maps: [{ rows: 'AN_Mitigation_Stage', cols: 'AN_Prompting_Role' }],
        fields: ['AN_Mitigation_Stage', 'AN_Prompting_Role'],
        topics: ['AI Literacy'],
    },
];

let model = null;

function question(id) { return QUESTIONS.find(function (item) { return item.id === id; }) || null; }

function mapLabel(map) { return model.dim(map.rows).label + ' × ' + model.dim(map.cols).label; }

function matrixHref(map, cell) {
    return EC.href(Object.assign({ view: 'matrix', rows: map.rows, cols: map.cols }, cell ? { cell: cell } : {}));
}

function validMaps(item) { return item.maps.filter(function (map) { return model.dim(map.rows) && model.dim(map.cols); }); }

function renderStart() {
    document.getElementById('fragen-title').textContent = MAIN_QUESTION;
    document.getElementById('sq-list').innerHTML = QUESTIONS.map(function (item) {
        const maps = validMaps(item).map(function (map) {
            return '<a class="sq-matrix-link" href="' + EC.esc(matrixHref(map)) + '">' + EC.esc(mapLabel(map)) + '</a>';
        }).join(' · ');
        return '<li class="sq-item" data-sq="' + item.id + '"><a class="sq-link" href="' + EC.esc(EC.href({ view: 'frage', sq: item.id })) + '">' +
            EC.esc(item.text) + '</a>' + EC.summaryLine(model.includes, item.fields, false) +
            (maps ? '<p class="sq-maps">Matrix ' + maps + '</p>' : '') + '</li>';
    }).join('');
}

function findingsFor(item) {
    return model.assertions.filter(function (assertion) {
        return (assertion.topics || []).some(function (topic) { return item.topics.indexOf(topic) >= 0; });
    });
}

function openSection(item) {
    return item.fields.filter(function (field) { return model.dim(field); }).map(function (field) {
        const dim = model.dim(field);
        const own = model.coverage(model.includes, field);
        const pipeline = model.pipelineCoverage(field);
        const notCoded = pipeline && pipeline.not_coded != null ? pipeline.not_coded : own.not_coded;
        const undecidable = pipeline && pipeline.undecidable != null ? pipeline.undecidable : own.undecidable;
        // One denominator per line: the pipeline scope when its figures are used, else the released works.
        const inScope = pipeline && pipeline.in_scope != null ? pipeline.in_scope : own.in_scope;
        const parts = ['<span aria-hidden="true">?</span> ' + notCoded + ' noch nicht codiert', undecidable + ' nicht entscheidbar'];
        if (pipeline && pipeline.absent) parts.push(pipeline.absent + ' ohne Angabe');
        if (pipeline && pipeline.withheld != null) parts.push(pipeline.withheld + ' zurückgehalten');
        const open = model.includes.filter(function (work) {
            const state = model.stateOf(work, field).state;
            return state === 'absent' || state === 'undecidable';
        });
        return '<div class="open-field" data-field="' + EC.esc(field) + '"><h3>' + EC.esc(dim.label) + '</h3>' +
            '<p class="denominator">' + inScope + ' Include-Werke · ' + parts.join(' · ') + '</p>' +
            (open.length ? '<ul class="open-works" role="list">' + open.map(function (work) {
                const state = model.stateOf(work, field).state === 'undecidable' ? 'nicht entscheidbar' : 'noch nicht codiert';
                return '<li><a href="' + EC.esc(EC.href({ view: 'werk', id: work.id })) + '">' + EC.esc(work.authorYear || work.title) +
                    '</a> · ' + state + '</li>';
            }).join('') + '</ul>' : '') + '</div>';
    }).join('');
}

function fieldValuesText(work, field) {
    const dim = model.dim(field);
    const state = model.stateOf(work, field);
    if (state.state === 'value') return state.values.map(function (value) { return EC.esc(dim.valueLabel(value)); }).join(', ');
    if (state.state === 'none') return '<span aria-hidden="true">–</span> trifft nicht zu';
    if (state.state === 'undecidable') return 'nicht entscheidbar';
    return '<span aria-hidden="true">?</span> noch nicht codiert';
}

function worksSection(item) {
    const fields = item.fields.filter(function (field) { return model.dim(field); });
    // A work-level value such as the work's status alone does not make a work
    // contribute; it needs a code of the question's own subject fields.
    const subject = fields.filter(function (field) { return !model.dim(field).workLevel; });
    const works = model.includes.filter(function (work) {
        return subject.some(function (field) { return model.stateOf(work, field).state === 'value'; });
    });
    if (!works.length) return '<p class="empty-state">Kein veröffentlichtes Werk trägt einen Code in diesen Feldern.</p>';
    return '<p class="worklist-count">' + EC.esc(EC.workCount(works.length)) + ' mit mindestens einem Code in diesen Feldern</p>' +
        '<ol class="worklist" role="list">' + works.map(function (work) {
            return '<li class="work-item" data-work-id="' + EC.esc(work.id) + '"><h3 class="work-title"><a href="' +
                EC.esc(EC.href({ view: 'werk', id: work.id })) + '">' + EC.esc(work.title) + '</a></h3>' +
                '<p class="work-meta">' + EC.esc(work.authorYear) + ' · ' + EC.statusMark(work.status) + '</p>' +
                '<dl class="code-list code-list--compact">' + fields.map(function (field) {
                    return '<div class="code-row"><dt>' + EC.esc(model.dim(field).label) + '</dt><dd>' + fieldValuesText(work, field) + '</dd></div>';
                }).join('') + '</dl></li>';
        }).join('') + '</ol>';
}

function renderAnswer(params) {
    const root = document.getElementById('frage-root');
    const item = question(params.sq);
    if (!item) {
        root.innerHTML = '<h1>Frage nicht gefunden</h1><p class="empty-state">Diese Teilfrage ist nicht definiert.</p>';
        return;
    }
    const findings = findingsFor(item);
    const maps = validMaps(item).map(function (map, index) {
        const id = 'frage-map-' + index;
        return '<div class="answer-map"><h3 id="' + id + '">' + EC.esc(mapLabel(map)) + '</h3>' +
            EC.coverageLine(model.includes, map.rows, 'rows', false) +
            (map.rows !== map.cols ? EC.coverageLine(model.includes, map.cols, 'cols', false) : '') +
            '<div class="matrix-wrap" role="region" tabindex="0" aria-labelledby="' + id + '">' +
            EC.matrixTable(model.includes, map.rows, map.cols, { cellHref: function (row, col) { return matrixHref(map, row + '|' + col); } }) +
            '</div><p class="answer-map-link"><a href="' + EC.esc(matrixHref(map)) + '">In der Matrix öffnen</a></p></div>';
    }).join('');
    root.innerHTML = '<article class="answer" data-sq="' + item.id + '">' +
        '<h1>' + EC.esc(item.text) + '</h1>' +
        EC.summaryLine(model.includes, item.fields, false, 'Was die bisher geprüfte Literatur zeigt') +
        '<section class="answer-part" id="frage-befunde" aria-labelledby="frage-befunde-title"><h2 id="frage-befunde-title">Befunde</h2>' +
        (findings.length ? findings.map(function (assertion) { return EC.renderAssertion(assertion, { level: 3 }); }).join('')
            : '<p class="empty-state">Zu dieser Frage liegt noch keine KI-quellengeprüfte oder fachlich verifizierte Aussage vor.</p>') +
        '</section>' +
        '<section class="answer-part" id="frage-karte" aria-labelledby="frage-karte-title"><h2 id="frage-karte-title">Karte</h2>' + maps +
        '<p class="mark-legend">' + EC.markLegendHtml() + '</p></section>' +
        '<section class="answer-part" id="frage-offen" aria-labelledby="frage-offen-title"><h2 id="frage-offen-title">Offen</h2>' + openSection(item) + '</section>' +
        '<section class="answer-part" id="frage-werke" aria-labelledby="frage-werke-title"><h2 id="frage-werke-title">Werke</h2>' + worksSection(item) + '</section>' +
        '</article>';
}

function germanDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
    return match ? match[3] + '.' + match[2] + '.' + match[1] : String(value || '');
}

function renderMethode() {
    const meta = model.release.meta || {};
    const groups = Object.keys(model.schema.groups || {});
    const categories = groups.map(function (group) {
        const dim = model.dim(group);
        return '<h3>' + EC.esc(dim ? dim.label : group) + '</h3><dl class="definition-list">' + model.schema.groups[group].map(function (key) {
            const category = model.schema.categories.find(function (item) { return item.key === key; }) || { label: key, definition: '' };
            return '<dt>' + EC.esc(category.label) + '</dt><dd>' + EC.esc(category.definition) + '</dd>';
        }).join('') + '</dl>';
    }).join('');
    const fields = model.dims.filter(function (dim) { return dim.kind === 'field'; }).map(function (dim) {
        return '<dt>' + EC.esc(dim.label) + '</dt><dd>' + dim.values.map(function (value) { return EC.esc(dim.valueLabel(value)); }).join(' · ') + '</dd>';
    }).join('');
    document.getElementById('methode-root').innerHTML =
        '<section aria-labelledby="methode-pruefstand"><h2 id="methode-pruefstand">Prüfstand</h2><dl class="definition-list mark-definitions">' +
        '<dt><span aria-hidden="true">◆</span> ' + EC.esc(model.publicLabel) + '</dt><dd>Ein KI-Agent hat Codierung und Belegstellen gegen die Quelle geprüft. ' +
        'Agent, Modell und Prüfzeitpunkt stehen bei jedem Werk. Eine fachliche Verifikation ist damit nicht verbunden.</dd>' +
        '<dt><span aria-hidden="true">●</span> fachlich verifiziert</dt><dd>Eine Fachexpertin oder ein Fachexperte hat die Codierung geprüft und angenommen.</dd>' +
        '<dt><span aria-hidden="true">–</span> trifft nicht zu</dt><dd>Das Feld ist codiert, und keiner seiner Werte trifft auf das Werk zu.</dd>' +
        '<dt>n. e. nicht entscheidbar</dt><dd>Das Feld ist codiert, aber die Quelle erlaubt keine Entscheidung.</dd>' +
        '<dt><span aria-hidden="true">?</span> noch nicht codiert</dt><dd>Für das Werk liegt in diesem Feld noch keine Codierung vor.</dd></dl></section>' +
        '<section aria-labelledby="methode-umfang"><h2 id="methode-umfang">Umfang</h2>' +
        '<p>Die Veröffentlichung zeigt den bereits quellengeprüften Teil des Literaturreviews, nicht den abgeschlossenen Review. ' +
        'Ein Werk, das hier fehlt, ist zurückgehalten oder noch in Bearbeitung. Sein Fehlen ist keine Ausschlussentscheidung.' +
        (meta.search_cutoff ? ' Der Suchstand ist der ' + EC.esc(germanDate(meta.search_cutoff)) + '.' : '') + '</p>' +
        '<p>Ein Werk wird eingeschlossen, wenn Technik- und Sozialdimension je mindestens eine Kategorie mit ja tragen. ' +
        'Tragen beide höchstens teilweise zutreffende Kategorien, bleibt es unklar, und fehlt einer Dimension jede Kategorie, wird es ausgeschlossen. ' +
        'Die Analysefelder werden nur für eingeschlossene Werke codiert. Ein Feld ist eine Liste von Codes je Werk, eine Zelle der Matrix ' +
        'und eine Kante im Netz zählen deshalb Werke, in denen zwei Codes gemeinsam vergeben sind. Sie behaupten keine Beziehung zwischen den Codes.</p>' +
        '<p>Der Status einer Maßnahme ist ein Wert je Werk und gilt nicht für eine einzelne Technik oder Stufe. ' +
        'Empfehlungen in Codes und Aussagen sind Empfehlungen der jeweiligen Quelle, nicht dieses Projekts.</p></section>' +
        '<section aria-labelledby="methode-kategorien"><h2 id="methode-kategorien">Kategorien</h2>' + categories + '</section>' +
        '<section aria-labelledby="methode-felder"><h2 id="methode-felder">Analysefelder</h2><dl class="definition-list">' + fields + '</dl></section>' +
        '<section aria-labelledby="methode-daten"><h2 id="methode-daten">Daten</h2><ul role="list" class="link-list">' +
        '<li><a href="downloads/research-data.zip">Datensatz</a></li><li><a href="downloads/data-dictionary.md">Datenbeschreibung</a></li>' +
        '<li><a href="data/release_manifest.json">Versionsnachweis</a></li></ul></section>';
}

EC.registerView('fragen', {
    title: function () { return 'Fragen'; },
    init: function (instance) { model = instance; },
    render: renderStart,
});

EC.registerView('frage', {
    title: function (params) { return question(params.sq) ? question(params.sq).name : 'Fragen'; },
    render: renderAnswer,
});

EC.registerView('methode', {
    title: function () { return 'Methode'; },
    render: renderMethode,
});

EC.questions = QUESTIONS;
})();
