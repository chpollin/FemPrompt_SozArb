// Fragen start page, one answer page per research sub-question, and Methode.
(function () {
'use strict';

const EC = window.EC;

// The one place that defines the research questions shown on the site: the main
// question as start heading and, per sub-question, its wording, matrix presets, the
// analysis fields it draws on, what is not yet determinable for it (`limits`) and the
// assertion topics assigned to it. Canonical wording and limits live in
// knowledge/project.md#research-questions and
// knowledge/analysis-methods.md#answering-the-research-questions.
// An assertion's `research_questions` decides its assignment; the `topics` lists
// are the fallback while the assertion index carries no such field.
const MAIN_QUESTION = 'Wie können Fachkräfte der Sozialen Arbeit verantwortlich mit LLMs arbeiten, und welche Bias-Formen und welchen Umgang damit zeigt die Literatur?';
// The ids follow the numbering of 1 October 2026 (SQ1 to SQ5 in the knowledge base).
// A question whose fields carry no code for any released work says that it is not
// yet coded instead of showing counts, and shows its matrices only once codes exist.
const QUESTIONS = [
    {
        id: '1', name: 'Nutzung',
        text: 'Für welche Aufgaben und Felder der Sozialen Arbeit beschreibt die Literatur den Einsatz von LLMs, und welchen Nutzen berichtet sie?',
        maps: [{ rows: 'AN_Population', cols: 'AN_Prompting_Role' }, { rows: 'AN_Task', cols: 'AN_Population' }],
        fields: ['AN_Task', 'AN_Population', 'AN_Prompting_Role'],
        // A work coded only as not specific to social work describes no use in it.
        outside: { field: 'AN_Population', value: 'Not_SW_Specific', label: 'Nicht spezifisch für die Soziale Arbeit' },
        limits: 'Die Werte des Aufgabenfelds werden pilotiert, und für Werke, die vor Codebuchversion 1.4 codiert wurden, ist es nicht erhoben. ' +
            'Literatur zu Aufgaben ohne Bezug zu Bias ist möglicherweise unterrepräsentiert, weil die Suche auf Bias und Gender ausgerichtet war.',
        topics: [],
    },
    {
        id: '2', name: 'Bias-Formen',
        text: 'Welche Bias-Formen thematisiert die ausgewählte Literatur, mit welchen Schadensarten, für welche Gruppen, und welche Formen fehlen?',
        maps: [{ rows: 'AN_Bias_Axes', cols: 'AN_Harm_Types' }, { rows: 'AN_Bias_Axes', cols: 'AN_Population' }],
        fields: ['AN_Bias_Axes', 'AN_Harm_Types', 'AN_Population'],
        limits: 'Die Codes der Bias-Achsen und Schadensarten stammen bis zur Neucodierung aus Codebuchversion 1.3, deren Definitionen Version 1.4 geschärft hat. ' +
            'Zwei getrennte Codierungen durch KI-Agenten weichen in beiden Feldern oft voneinander ab. ' +
            'Welche Formen fehlen, lässt sich erst nach vollständiger Codierung bestimmen.',
        topics: [],
    },
    {
        id: '3', name: 'Umgang mit Bias',
        text: 'Wie geht die Literatur mit den benannten Bias-Formen um, auf welcher Stufe, mit welchen Techniken und mit welchem Evidenzstatus?',
        maps: [{ rows: 'AN_Prompt_Techniques', cols: 'AN_Prompting_Role' }, { rows: 'AN_Mitigation_Stage', cols: 'AN_Mitigation_Status' }],
        fields: ['AN_Prompt_Techniques', 'AN_Prompting_Role', 'AN_Mitigation_Stage', 'AN_Mitigation_Status'],
        limits: 'Der Status einer Maßnahme ist ein Wert je Werk. Welche Technik oder Stufe evaluiert, demonstriert oder nur vorgeschlagen ist, lässt sich daraus nicht bestimmen.',
        topics: ['Prompting and Bias Mitigation'],
    },
    {
        id: '4', name: 'Begriffliche Fundierung',
        text: 'Definiert die Literatur Gender und Bias, welches Verständnis von Gender liegt ihr zugrunde, und auf welche Theorien stützt sie sich?',
        maps: [{ rows: 'AN_Gender_Understanding', cols: 'AN_Theory_Reference' }],
        fields: ['AN_Gender_Definition', 'AN_Bias_Definition', 'AN_Gender_Understanding', 'AN_Theory_Reference'],
        limits: 'Die Frage ist nur aus Volltexten beantwortbar. Die Theorien selbst stehen als belegte Bezüge bei den Werken, nicht als Codes.',
        topics: [],
    },
    {
        id: '5', name: 'Kompetenzen',
        text: 'Welche Kompetenzen und organisationalen Voraussetzungen nennt die Literatur für einen verantwortlichen Einsatz, und wo greifen allgemeine Prompting-Anleitungen für die Soziale Arbeit zu kurz?',
        maps: [{ rows: 'AN_Mitigation_Stage', cols: 'AN_Prompting_Role' }],
        fields: ['AN_Mitigation_Stage', 'AN_Prompting_Role'],
        limits: 'Das externe Rahmenwerk allgemeiner Prompting-Anleitungen ist noch nicht benannt. ' +
            'Wo solche Anleitungen für die Soziale Arbeit zu kurz greifen, ist deshalb noch nicht bestimmbar.',
        topics: ['AI Literacy'],
    },
];

let model = null;

function question(id) { return QUESTIONS.find(function (item) { return item.id === id; }) || null; }

function mapLabel(map) { return model.dim(map.rows).label + ' × ' + model.dim(map.cols).label; }

function matrixHref(map, cell) {
    return EC.href(Object.assign({ view: 'matrix', rows: map.rows, cols: map.cols }, cell ? { cell: cell } : {}));
}

// A field counts as coded once any released Include carries a state other than absent.
function fieldCoded(field) {
    return Boolean(model.dim(field)) && model.includes.some(function (work) { return model.stateOf(work, field).state !== 'absent'; });
}

function questionCoded(item) { return item.fields.some(fieldCoded); }

function validMaps(item) { return item.maps.filter(function (map) { return fieldCoded(map.rows) && fieldCoded(map.cols); }); }

// The coded-share line of a question. A question without any coded field states that
// instead of a share, so no figure suggests coding that does not exist.
function summaryHtml(item, prefix) {
    if (!questionCoded(item)) {
        return '<p class="denominator denominator--summary" data-coded="0">' + (prefix ? EC.esc(prefix) + ' · ' : '') + 'Noch nicht codiert</p>';
    }
    // A field nobody has coded yet, such as a pilot field, would make every work count as uncoded.
    return EC.summaryLine(model.includes, item.fields.filter(fieldCoded), false, prefix, { status: true });
}

function renderStart() {
    document.getElementById('fragen-title').textContent = MAIN_QUESTION;
    document.getElementById('sq-list').innerHTML = QUESTIONS.map(function (item) {
        const maps = validMaps(item).map(function (map) {
            return '<a class="sq-matrix-link" href="' + EC.esc(matrixHref(map)) + '">' + EC.esc(mapLabel(map)) + '</a>';
        }).join(' · ');
        return '<li class="sq-item" data-sq="' + item.id + '"><a class="sq-link" href="' + EC.esc(EC.href({ view: 'frage', sq: item.id })) + '">' +
            EC.esc(item.text) + '</a>' + summaryHtml(item, '') +
            (maps ? '<p class="sq-maps">Matrix ' + maps + '</p>' : '') + '</li>';
    }).join('');
}

// "SQ3", "sq3", 3 and "3" all name the third sub-question.
function questionIds(value) {
    return (Array.isArray(value) ? value : [value]).map(function (entry) {
        const match = /(\d+)/.exec(String(entry == null ? '' : entry));
        return match ? match[1] : '';
    }).filter(Boolean);
}

function findingsFor(item) {
    const assigned = model.assertions.some(function (assertion) { return assertion.research_questions != null; });
    return model.assertions.filter(function (assertion) {
        if (assigned) return questionIds(assertion.research_questions).indexOf(item.id) >= 0;
        return (assertion.topics || []).some(function (topic) { return item.topics.indexOf(topic) >= 0; });
    });
}

function openSection(item) {
    const limits = item.limits ? '<p class="open-limits">' + EC.esc(item.limits) + '</p>' : '';
    return limits + item.fields.filter(function (field) { return model.dim(field); }).map(function (field) {
        const dim = model.dim(field);
        const own = model.coverage(model.includes, field);
        const pipeline = model.pipelineCoverage(field);
        const notCoded = pipeline && pipeline.not_coded != null ? pipeline.not_coded : own.not_coded;
        const undecidable = pipeline && pipeline.undecidable != null ? pipeline.undecidable : own.undecidable;
        // The denominator stands once in the summary line at the top of the page.
        const parts = [notCoded + ' noch nicht codiert', undecidable + ' nicht entscheidbar'];
        if (pipeline && pipeline.absent) parts.push(pipeline.absent + ' ohne Angabe');
        if (pipeline && pipeline.withheld != null) parts.push(pipeline.withheld + ' zurückgehalten');
        const open = model.includes.filter(function (work) {
            const state = model.stateOf(work, field).state;
            return state === 'absent' || state === 'undecidable';
        });
        return '<div class="open-field" data-field="' + EC.esc(field) + '"><h3>' + EC.esc(dim.label) + '</h3>' +
            '<p class="denominator">' + parts.join(' · ') + '</p>' +
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
    if (state.state === 'none') return 'nicht zutreffend';
    if (state.state === 'undecidable') return 'nicht entscheidbar';
    return 'noch nicht codiert';
}

function worksSection(item) {
    const fields = item.fields.filter(function (field) { return model.dim(field); });
    // A work-level value such as the work's status alone does not make a work
    // contribute; it needs a code of the question's own subject fields.
    const subject = fields.filter(function (field) { return !model.dim(field).workLevel; });
    const coded = model.includes.filter(function (work) {
        return subject.some(function (field) { return model.stateOf(work, field).state === 'value'; });
    });
    const outside = item.outside && model.dim(item.outside.field) ? item.outside : null;
    const isOutside = function (work) {
        const values = model.stateOf(work, outside.field).values;
        return values.length === 1 && values[0] === outside.value;
    };
    const works = outside ? coded.filter(function (work) { return !isOutside(work); }) : coded;
    const rest = outside ? coded.filter(isOutside) : [];
    const list = function (selection, level) {
        return '<ol class="worklist" role="list">' + selection.map(function (work) {
            return '<li class="work-item" data-work-id="' + EC.esc(work.id) + '"><h' + level + ' class="work-title"><a href="' +
                EC.esc(EC.href({ view: 'werk', id: work.id })) + '">' + EC.esc(work.title) + '</a></h' + level + '>' +
                '<p class="work-meta">' + [work.authorYear].filter(Boolean).map(EC.esc).concat([EC.statusMark(work.status)]).join(' · ') + '</p>' +
                '<dl class="code-list code-list--compact">' + fields.map(function (field) {
                    return '<div class="code-row"><dt>' + EC.esc(model.dim(field).label) + '</dt><dd>' + fieldValuesText(work, field) + '</dd></div>';
                }).join('') + '</dl></li>';
        }).join('') + '</ol>';
    };
    if (!fields.length || !questionCoded(item)) return '<p class="empty-state">Für diese Frage ist noch kein Werk codiert.</p>';
    const main = works.length
        ? '<p class="worklist-count">' + EC.esc(EC.workCount(works.length)) + ' mit mindestens einem Code in diesen Feldern</p>' + list(works, 3)
        : '<p class="empty-state">Kein veröffentlichtes eingeschlossenes Werk trägt einen Code in diesen Feldern.</p>';
    if (!rest.length) return main;
    return main + '<section class="outside-group" data-group="outside" aria-labelledby="frage-outside-title">' +
        '<h3 id="frage-outside-title">' + EC.esc(outside.label) + '</h3>' +
        '<p class="worklist-count">' + EC.esc(EC.workCount(rest.length)) + ', in ' + EC.esc(model.dim(outside.field).label) +
        ' nur als ' + EC.esc(model.dim(outside.field).valueLabel(outside.value)) + ' codiert</p>' + list(rest, 4) + '</section>';
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
            EC.matrixCaptionHtml(map.rows, map.cols) +
            '<div class="matrix-wrap" role="region" tabindex="0" aria-labelledby="' + id + '">' +
            EC.matrixTable(model.includes, map.rows, map.cols, { cellHref: function (row, col) { return matrixHref(map, row + '|' + col); } }) +
            '</div><p class="answer-map-link"><a href="' + EC.esc(matrixHref(map)) + '">In der Matrix öffnen</a></p></div>';
    }).join('');
    root.innerHTML = '<article class="answer" data-sq="' + item.id + '">' +
        '<h1>' + EC.esc(item.text) + '</h1>' +
        summaryHtml(item, 'Was die bisher geprüfte Literatur zeigt') +
        '<section class="answer-part" id="frage-befunde" aria-labelledby="frage-befunde-title"><h2 id="frage-befunde-title">Befunde</h2>' +
        (findings.length ? findings.map(function (assertion) { return EC.renderAssertion(assertion, { level: 3 }); }).join('')
            : '<p class="empty-state">Zu dieser Frage liegt noch keine KI-quellengeprüfte oder fachlich verifizierte Aussage vor.</p>') +
        '</section>' +
        '<section class="answer-part" id="frage-matrix" aria-labelledby="frage-matrix-title"><h2 id="frage-matrix-title">Matrix</h2>' +
        (maps ? maps + '<p class="mark-legend">' + EC.markLegendHtml() + '</p>'
            : '<p class="empty-state">Ohne codierte Felder gibt es zu dieser Frage noch keine Matrix.</p>') + '</section>' +
        '<section class="answer-part" id="frage-offen" aria-labelledby="frage-offen-title"><h2 id="frage-offen-title">Offen</h2>' + openSection(item) + '</section>' +
        '<section class="answer-part" id="frage-werke" aria-labelledby="frage-werke-title"><h2 id="frage-werke-title">Werke</h2>' + worksSection(item) + '</section>' +
        '</article>';
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
    // Value definitions appear once the pipeline emits them; until then the values are listed.
    const fields = model.dims.filter(function (dim) { return dim.kind === 'field'; }).map(function (dim) {
        const defined = dim.values.some(function (value) { return dim.valueDefinition(value); });
        const values = defined
            ? '<dl class="value-definitions">' + dim.values.map(function (value) {
                return '<dt>' + EC.esc(dim.valueLabel(value)) + '</dt><dd>' + EC.esc(dim.valueDefinition(value)) + '</dd>';
            }).join('') + '</dl>'
            : '<p>' + dim.values.map(function (value) { return EC.esc(dim.valueLabel(value)); }).join(' · ') + '</p>';
        return '<dt>' + EC.esc(dim.label) + '</dt><dd>' + (dim.definition ? '<p>' + EC.esc(dim.definition) + '</p>' : '') + values + '</dd>';
    }).join('');
    document.getElementById('methode-root').innerHTML =
        '<section aria-labelledby="methode-pruefstand"><h2 id="methode-pruefstand">Prüfstand</h2><dl class="definition-list mark-definitions">' +
        '<dt><span aria-hidden="true">◆</span> ' + EC.esc(model.publicLabel) + '</dt><dd>Ein KI-Agent hat Codierung und Belegstellen gegen die Quelle geprüft. ' +
        'Agent, Modell und Prüfzeitpunkt stehen bei jedem Werk. Eine fachliche Verifikation ist damit nicht verbunden.</dd>' +
        '<dt><span aria-hidden="true">●</span> fachlich verifiziert</dt><dd>Eine Fachexpertin oder ein Fachexperte hat die Codierung geprüft und angenommen.</dd>' +
        '<dt>n. z. nicht zutreffend</dt><dd>Das Feld ist codiert, und keiner seiner Werte trifft auf das Werk zu.</dd>' +
        '<dt>n. e. nicht entscheidbar</dt><dd>Das Feld ist codiert, aber die Quelle erlaubt keine Entscheidung.</dd>' +
        '<dt>noch nicht codiert</dt><dd>Für das Werk liegt in diesem Feld noch keine Codierung vor.</dd>' +
        '<dt>n. b. nicht bestimmbar</dt><dd>Eine leere Zelle, solange eingeschlossene Werke noch nicht codiert sind. Eine 0 steht erst, wenn die Codierung der Auswahl vollständig ist.</dd></dl></section>' +
        '<section aria-labelledby="methode-umfang"><h2 id="methode-umfang">Umfang</h2>' +
        '<p>Die Veröffentlichung zeigt den bereits quellengeprüften Teil des Literaturreviews, nicht den abgeschlossenen Review. ' +
        'Ein Werk, das hier fehlt, ist zurückgehalten oder noch in Bearbeitung. Sein Fehlen ist keine Ausschlussentscheidung.' +
        (meta.search_cutoff ? ' Der Suchstand ist der ' + EC.esc(EC.germanDate(meta.search_cutoff)) + '.' : '') + '</p>' +
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
    // A host can initialise the answer pages without the Fragen start page.
    init: function (instance) { model = instance; },
    render: renderAnswer,
});

EC.registerView('methode', {
    title: function () { return 'Methode'; },
    render: renderMethode,
});

EC.questions = QUESTIONS;
// The start view of docs/index.html labels each question card with its findings.
EC.findingsFor = function (id) { return model && question(String(id)) ? findingsFor(question(String(id))) : []; };
EC.questionCoded = function (id) { return Boolean(model && question(String(id)) && questionCoded(question(String(id)))); };
})();
