// Annotation-native literature landscape for the Evidence Companion.

(function() {
'use strict';

const EC = window.EC;
const LABELS = {
    AI_Literacies: 'AI Literacies', Generative_KI: 'Generative KI', Prompting: 'Prompting',
    KI_Sonstige: 'KI Sonstige', Soziale_Arbeit: 'Soziale Arbeit',
    Bias_Ungleichheit: 'Bias & Ungleichheit', Gender: 'Gender', Diversitaet: 'Diversität',
    Feministisch: 'Feministisch', Fairness: 'Fairness',
    AN_Prompting_Role: 'Rolle des Promptings', AN_Prompt_Techniques: 'Prompt-Techniken',
    AN_Bias_Axes: 'Bias-Achsen', AN_Harm_Types: 'Schadensformen',
    AN_Mitigation_Stage: 'Interventionsstufe', AN_Mitigation_Status: 'Prüfstatus der Maßnahme',
    AN_Population: 'Anwendungsfeld', AN_Coding_Basis: 'Codierungsgrundlage', Studientyp: 'Studientyp',
    Recommended_Practice: 'Empfohlene Praxis', Research_Instrument: 'Forschungsinstrument',
    Object_of_Critique: 'Gegenstand der Kritik', Learning_Content: 'Lerninhalt',
    ICL: 'In-Context Learning', Thought_Generation: 'Gedankengenerierung',
    Decomposition: 'Zerlegung', Ensembling: 'Ensembling', Self_Criticism: 'Selbstkritik',
    Role_Persona: 'Rolle / Persona', General_Guidance: 'Allgemeine Anleitung',
    Race_Ethnicity: 'Race / Ethnizität', Intersectional: 'Intersektional',
    Disability: 'Behinderung', Age: 'Alter', Socioeconomic: 'Sozioökonomisch',
    Language_Culture: 'Sprache / Kultur', Sexual_Orientation_Identity: 'Sexuelle Orientierung / Identität',
    Religion: 'Religion', Physical_Appearance: 'Erscheinungsbild',
    Nationality_Migration: 'Nationalität / Migration', Other_Axis: 'Andere Achse',
    Derogatory_Language: 'Abwertende Sprache', Disparate_Performance: 'Ungleiche Leistung',
    Erasure: 'Auslöschung', Exclusionary_Norms: 'Ausschließende Normen',
    Misrepresentation: 'Fehldarstellung', Stereotyping: 'Stereotypisierung', Toxicity: 'Toxizität',
    Direct_Discrimination: 'Direkte Diskriminierung', Indirect_Discrimination: 'Indirekte Diskriminierung',
    Pre_Processing: 'Vorverarbeitung', In_Training: 'Training', Intra_Processing: 'Intra-Processing',
    Post_Processing: 'Nachverarbeitung', Prompt_Practice: 'Prompt-Praxis',
    Organisational_Process: 'Organisatorischer Prozess', Evaluated: 'Evaluiert',
    Demonstrated: 'Demonstriert', Proposed: 'Vorgeschlagen', Child_Family_Welfare: 'Kinder- und Familienhilfe',
    Mental_Health: 'Psychische Gesundheit', Health_Care: 'Gesundheitswesen',
    Homelessness_Youth: 'Wohnungslosigkeit / Jugend', Social_Assistance_Admin: 'Sozialleistungsverwaltung',
    Education_Professional: 'Aus- und Weiterbildung', General_Social_Work: 'Allgemeine Soziale Arbeit',
    Not_SW_Specific: 'Nicht spezifisch für Soziale Arbeit', Fulltext: 'Volltext',
    Knowledge_Doc: 'Wissensdokument', Abstract: 'Abstract', None: 'Keine',
    raw: 'Volltext', abstract: 'Abstract', knowledge_doc: 'Wissensdokument',
    Empirisch: 'Empirisch', Experimentell: 'Experimentell', Theoretisch: 'Theoretisch',
    Konzept: 'Konzept', Literaturreview: 'Literaturreview', Unclear: 'Unklar',
};

const PROFILE_FIELDS = [
    'AN_Prompting_Role', 'AN_Prompt_Techniques', 'AN_Bias_Axes', 'AN_Harm_Types',
    'AN_Mitigation_Stage', 'AN_Mitigation_Status', 'AN_Population', 'Studientyp',
];

let data = null;
let root = null;
let activeSelection = null;
let activeView = 'matrix';
let activeProfile = PROFILE_FIELDS[0];
let applyingStoreState = false;
let lastStoreKey = '';

function label(value) {
    return LABELS[value] || String(value || '').replace(/_/g, ' ');
}

function paperCount(value) {
    return value + (value === 1 ? ' Paper' : ' Papers');
}

function attr(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function(char) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
}

function fieldValues(record, field) {
    if (!record.analysis || !record.analysis.fields) return [];
    const value = record.analysis.fields[field];
    if (Array.isArray(value)) return value.filter(function(item) { return item && item !== 'None'; });
    return value && value !== 'None' ? [value] : [];
}

function categoryKeys(record) {
    return new Set((record.categories || []).map(function(category) { return category.key; }));
}

function selectedFilters() {
    return {
        year: root.querySelector('#lit-filter-year').value,
        source: root.querySelector('#lit-filter-source').value,
        study: root.querySelector('#lit-filter-study').value,
    };
}

function selectionToken(selection) {
    if (!selection) return null;
    if (selection.kind === 'matrix') return ['matrix', selection.object, selection.perspective].join('|');
    if (selection.kind === 'field') return ['field', selection.field, selection.value].join('|');
    return null;
}

function selectionFromToken(token) {
    const parts = String(token || '').split('|');
    if (parts[0] === 'matrix' && parts.length === 3 &&
            data.category_groups.object.indexOf(parts[1]) >= 0 &&
            data.category_groups.perspective.indexOf(parts[2]) >= 0) {
        return {
            kind: 'matrix', object: parts[1], perspective: parts[2],
            label: label(parts[1]) + ' × ' + label(parts[2]),
        };
    }
    if (parts[0] === 'field' && parts.length === 3 && PROFILE_FIELDS.indexOf(parts[1]) >= 0) {
        return { kind: 'field', field: parts[1], value: parts[2], label: label(parts[1]) + ': ' + label(parts[2]) };
    }
    return null;
}

function literatureStateKey(state) {
    return [state.litView, state.litYear, state.litSource, state.litStudy,
        state.litProfile, state.litSelection].join('\u001f');
}

function syncStore() {
    if (applyingStoreState || !EC.store) return;
    const filters = selectedFilters();
    const patch = {
        litView: activeView,
        litYear: filters.year,
        litSource: filters.source,
        litStudy: filters.study,
        litProfile: activeProfile,
        litSelection: selectionToken(activeSelection),
    };
    lastStoreKey = literatureStateKey(patch);
    EC.store.set(patch);
}

function setSelectValue(id, value) {
    const select = root.querySelector(id);
    if (!select) return 'all';
    const allowed = Array.from(select.options || []).some(function(option) { return option.value === value; });
    select.value = allowed ? value : 'all';
    return select.value;
}

function applyStoreState(state) {
    if (!root || !data) return;
    const key = literatureStateKey(state);
    if (key === lastStoreKey) return;
    applyingStoreState = true;
    try {
        activeView = state.litView === 'profile' ? 'profile' : 'matrix';
        activeProfile = PROFILE_FIELDS.indexOf(state.litProfile) >= 0 ? state.litProfile : PROFILE_FIELDS[0];
        setSelectValue('#lit-filter-year', state.litYear || 'all');
        setSelectValue('#lit-filter-source', state.litSource || 'all');
        setSelectValue('#lit-filter-study', state.litStudy || 'all');
        root.querySelector('#lit-profile-field').value = activeProfile;
        activeSelection = selectionFromToken(state.litSelection);
        root.querySelectorAll('.lit-view-button').forEach(function(button) {
            const selected = button.dataset.litView === activeView;
            button.classList.toggle('active', selected);
            button.setAttribute('aria-pressed', String(selected));
        });
        root.querySelector('.lit-profile-field').hidden = activeView !== 'profile';
        renderDynamic();
        lastStoreKey = literatureStateKey({
            litView: activeView,
            litYear: selectedFilters().year,
            litSource: selectedFilters().source,
            litStudy: selectedFilters().study,
            litProfile: activeProfile,
            litSelection: selectionToken(activeSelection),
        });
    } finally {
        applyingStoreState = false;
    }
}

function filteredIncludes() {
    const filters = selectedFilters();
    return data.records.filter(function(record) {
        if (record.decision !== 'Include') return false;
        if (filters.year !== 'all' && String(record.year) !== filters.year) return false;
        if (filters.source !== 'all' && record.text_source !== filters.source) return false;
        if (filters.study !== 'all' && fieldValues(record, 'Studientyp').indexOf(filters.study) < 0) return false;
        return true;
    });
}

function selectionMatches(record) {
    if (!activeSelection) return true;
    if (activeSelection.kind === 'matrix') {
        const categories = categoryKeys(record);
        return categories.has(activeSelection.object) && categories.has(activeSelection.perspective);
    }
    return fieldValues(record, activeSelection.field).indexOf(activeSelection.value) >= 0;
}

function countBy(records, field) {
    const counts = {};
    records.forEach(function(record) {
        fieldValues(record, field).forEach(function(value) {
            counts[value] = (counts[value] || 0) + 1;
        });
    });
    return counts;
}

function options(values, emptyLabel) {
    return '<option value="all">' + EC.escapeHtml(emptyLabel) + '</option>' + values.map(function(value) {
        return '<option value="' + attr(value) + '">' + EC.escapeHtml(label(value)) + '</option>';
    }).join('');
}

function renderShell() {
    const years = Array.from(new Set(data.records.filter(function(record) {
        return record.decision === 'Include' && record.year;
    }).map(function(record) { return record.year; }))).sort(function(a, b) { return b - a; });
    const studies = Array.from(new Set(data.records.flatMap(function(record) {
        return fieldValues(record, 'Studientyp');
    }))).sort(function(a, b) { return label(a).localeCompare(label(b), 'de'); });
    const sources = Array.from(new Set(data.records.filter(function(record) {
        return record.decision === 'Include' && record.text_source;
    }).map(function(record) { return record.text_source; })));
    const source = data.source || {};
    const provisional = source.provisional
        ? '<span class="lit-status lit-status--provisional">Vorläufig</span>'
        : '<span class="lit-status lit-status--accepted">Bestätigt</span>';

    root.innerHTML =
        '<div class="lit-workspace">' +
            '<aside class="lit-sidebar" aria-label="Literaturbild steuern">' +
                '<div class="lit-sidebar-heading"><p class="lit-eyebrow">PRISM-Annotationen</p>' +
                '<h2>Literaturbild</h2></div>' +
                '<div class="lit-source-state">' + provisional +
                '<span>' + EC.escapeHtml(String(source.reviewer || '')) + '</span></div>' +
                '<p class="lit-progress" aria-label="Bearbeitungsstand">' +
                    '<span><strong>' + data.meta.annotated_total + '</strong> / ' + data.meta.corpus_total + ' annotiert</span>' +
                    '<span><strong>' + data.meta.included_total + '</strong> Include</span>' +
                    '<span><strong>' + data.meta.unclear_total + '</strong> Unklar</span>' +
                    '<span><strong>' + data.meta.excluded_total + '</strong> Exclude</span>' +
                '</p>' +
                '<fieldset class="lit-view-switch"><legend>Ansicht</legend>' +
                    viewButton('matrix', 'Zusammenhänge', true) +
                    viewButton('profile', 'Analyseprofil', false) +
                '</fieldset>' +
                '<div class="lit-controls" aria-label="Literaturbild filtern">' +
                    '<label>Jahr<select id="lit-filter-year">' + options(years, 'Alle Jahre') + '</select></label>' +
                    (sources.length > 1 ? '<label>Textgrundlage<select id="lit-filter-source">' +
                        options(sources, 'Alle Textgrundlagen') + '</select></label>' :
                        '<input type="hidden" id="lit-filter-source" value="all">') +
                    '<label>Studientyp<select id="lit-filter-study">' + options(studies, 'Alle Studientypen') + '</select></label>' +
                    '<label class="lit-profile-field" hidden>Analysedimension<select id="lit-profile-field">' +
                        PROFILE_FIELDS.map(function(field) {
                            return '<option value="' + attr(field) + '">' + EC.escapeHtml(label(field)) + '</option>';
                        }).join('') + '</select></label>' +
                    '<button type="button" class="lit-reset" id="lit-reset">Zurücksetzen</button>' +
                '</div>' +
            '</aside>' +
            '<div class="lit-stage" id="lit-dynamic"></div>' +
        '</div>';

    root.querySelector('#lit-profile-field').value = activeProfile;
}

function viewButton(view, title, active) {
    return '<button type="button" class="lit-view-button' + (active ? ' active' : '') + '" ' +
        'data-lit-view="' + view + '" aria-pressed="' + active + '">' + EC.escapeHtml(title) + '</button>';
}

function renderMatrix(records) {
    const objects = data.category_groups.object;
    const perspectives = data.category_groups.perspective;
    const cells = {};
    let maximum = 0;
    objects.forEach(function(object) {
        cells[object] = {};
        perspectives.forEach(function(perspective) {
            const count = records.filter(function(record) {
                const categories = categoryKeys(record);
                return categories.has(object) && categories.has(perspective);
            }).length;
            cells[object][perspective] = count;
            maximum = Math.max(maximum, count);
        });
    });

    let html = '<section class="lit-viz lit-matrix-panel"><div class="lit-viz-heading">' +
        '<h3>Gegenstand × Perspektive</h3>' +
        '<p>' + paperCount(records.length) + '</p></div>' +
        '<div class="lit-table-wrap" role="region" tabindex="0" aria-label="Kategorienmatrix, horizontal verschiebbar">' +
        '<table class="lit-matrix"><caption class="sr-only">' +
        'Gemeinsames Auftreten von Gegenständen und Perspektiven</caption><thead><tr><th scope="col">Gegenstand</th>';
    perspectives.forEach(function(perspective) {
        html += '<th scope="col">' + EC.escapeHtml(label(perspective)) + '</th>';
    });
    html += '</tr></thead><tbody>';
    objects.forEach(function(object) {
        html += '<tr><th scope="row">' + EC.escapeHtml(label(object)) + '</th>';
        perspectives.forEach(function(perspective) {
            const count = cells[object][perspective];
            const width = maximum ? Math.round(count / maximum * 100) : 0;
            const selected = activeSelection && activeSelection.kind === 'matrix' &&
                activeSelection.object === object && activeSelection.perspective === perspective;
            html += '<td><button type="button" class="lit-matrix-button' + (selected ? ' active' : '') + '" ' +
                'data-object="' + attr(object) + '" data-perspective="' + attr(perspective) + '"' +
                (count ? '' : ' disabled') + ' aria-pressed="' + selected + '" aria-label="' +
                attr(label(object) + ' und ' + label(perspective) + ': ' + paperCount(count)) + '">' +
                '<span class="lit-cell-fill" style="width:' + width + '%"></span><strong>' + (count || '–') + '</strong></button></td>';
        });
        html += '</tr>';
    });
    return html + '</tbody></table></div></section>';
}

function renderProfile(records) {
    const counts = countBy(records, activeProfile);
    const entries = Object.entries(counts).sort(function(a, b) {
        return b[1] - a[1] || label(a[0]).localeCompare(label(b[0]), 'de');
    });
    const maximum = entries.length ? entries[0][1] : 0;
    let html = '<section class="lit-viz lit-profile"><div class="lit-viz-heading"><h3>' +
        EC.escapeHtml(label(activeProfile)) + '</h3><p>' + paperCount(records.length) + '</p></div>';
    if (!entries.length) return html + '<p class="lit-empty">Keine Codierung in der Auswahl.</p></section>';
    entries.forEach(function(entry) {
        const value = entry[0], count = entry[1];
        const width = Math.round(count / maximum * 100);
        const selected = activeSelection && activeSelection.kind === 'field' &&
            activeSelection.field === activeProfile && activeSelection.value === value;
        html += '<button type="button" class="lit-bar-row' + (selected ? ' active' : '') + '" ' +
            'data-field="' + attr(activeProfile) + '" data-value="' + attr(value) +
            '" aria-pressed="' + selected + '">' +
            '<span class="lit-bar-label">' + EC.escapeHtml(label(value)) + '</span>' +
            '<span class="lit-bar-track"><span style="width:' + width + '%"></span></span>' +
            '<strong>' + count + '</strong></button>';
    });
    return html + '</section>';
}

function paperLink(record) {
    const doi = String(record.doi || '').trim();
    const url = doi ? 'https://doi.org/' + encodeURI(doi) : String(record.url || '').trim();
    if (!/^https?:\/\//i.test(url)) return '';
    return '<a href="' + attr(url) + '" target="_blank" rel="noopener">Quelle öffnen</a>';
}

function renderEvidence(record) {
    return (record.categories || []).map(function(category) {
        const evidence = category.evidence.map(function(passage) {
            return '<blockquote><strong>' + EC.escapeHtml(passage.term) + '</strong><p>' +
                EC.escapeHtml(passage.snippet) + '</p></blockquote>';
        }).join('');
        return '<section class="lit-evidence-group"><h5>' + EC.escapeHtml(label(category.key)) +
            ' <span>Stufe ' + category.level + '</span></h5>' + evidence + '</section>';
    }).join('');
}

function renderAnalysis(record) {
    if (!record.analysis) return '';
    let rows = '';
    Object.entries(record.analysis.fields).forEach(function(entry) {
        const values = Array.isArray(entry[1]) ? entry[1] : [entry[1]];
        rows += '<dt>' + EC.escapeHtml(label(entry[0])) + '</dt><dd>' +
            values.map(function(value) { return EC.escapeHtml(label(value)); }).join(', ') + '</dd>';
    });
    if (record.analysis.undecidable.length) {
        rows += '<dt>Nicht entscheidbar</dt><dd>' + record.analysis.undecidable.map(function(value) {
            return EC.escapeHtml(label(value));
        }).join(', ') + '</dd>';
    }
    if (record.analysis.notes) {
        rows += '<dt>Notiz</dt><dd>' + EC.escapeHtml(record.analysis.notes) + '</dd>';
    }
    return '<div class="lit-paper-analysis"><h5>Analyse</h5><dl>' + rows + '</dl></div>';
}

function renderPapers(records) {
    const selected = records.filter(selectionMatches);
    if (!activeSelection) return '';
    let html = '<section class="lit-results"><div class="lit-viz-heading"><h3>' +
        EC.escapeHtml(activeSelection.label) + '</h3><div class="lit-result-state">' +
        '<p id="lit-result-count" aria-live="polite">' + paperCount(selected.length) + '</p>' +
        '<button type="button" id="lit-clear-selection">Auswahl lösen</button></div></div>';
    if (!selected.length) return html + '<p class="lit-empty">Keine Papers entsprechen dieser Auswahl.</p></section>';
    selected.forEach(function(record) {
        const cats = record.categories.map(function(category) {
            return '<span class="lit-chip">' + EC.escapeHtml(label(category.key)) +
                '<small>Stufe ' + category.level + '</small></span>';
        }).join('');
        html += '<details class="lit-paper"><summary><span><strong>' + EC.escapeHtml(record.title) +
            '</strong><small>' + EC.escapeHtml(record.author_year) + '</small></span>' +
            '<span class="lit-paper-basis">' + EC.escapeHtml(label(record.text_source)) + '</span></summary>' +
            '<div class="lit-paper-body"><div class="lit-paper-meta"><span>Paper-ID ' +
            EC.escapeHtml(record.id) + '</span>' + paperLink(record) + '</div><div class="lit-chip-row">' + cats +
            '</div>' + renderAnalysis(record) + '<div class="lit-paper-evidence"><h5>Paper-Belege</h5>' +
            renderEvidence(record) + '</div></div></details>';
    });
    return html + '</section>';
}

function renderDynamic() {
    const records = filteredIncludes();
    const visualization = activeView === 'profile' ? renderProfile(records) : renderMatrix(records);
    root.querySelector('#lit-dynamic').innerHTML = visualization + renderPapers(records);
}

function handleClick(event) {
    const view = event.target.closest('.lit-view-button');
    if (view) {
        activeView = view.dataset.litView;
        activeSelection = null;
        root.querySelectorAll('.lit-view-button').forEach(function(button) {
            const selected = button === view;
            button.classList.toggle('active', selected);
            button.setAttribute('aria-pressed', String(selected));
        });
        root.querySelector('.lit-profile-field').hidden = activeView !== 'profile';
        renderDynamic();
        syncStore();
        return;
    }
    const matrix = event.target.closest('.lit-matrix-button');
    if (matrix) {
        const selected = activeSelection && activeSelection.kind === 'matrix' &&
            activeSelection.object === matrix.dataset.object &&
            activeSelection.perspective === matrix.dataset.perspective;
        activeSelection = selected ? null : {
            kind: 'matrix', object: matrix.dataset.object, perspective: matrix.dataset.perspective,
            label: label(matrix.dataset.object) + ' × ' + label(matrix.dataset.perspective),
        };
        renderDynamic();
        const restored = Array.from(root.querySelectorAll('.lit-matrix-button')).find(function(button) {
            return button.dataset.object === matrix.dataset.object &&
                button.dataset.perspective === matrix.dataset.perspective;
        });
        if (restored) restored.focus();
        syncStore();
        return;
    }
    const bar = event.target.closest('.lit-bar-row');
    if (bar) {
        const selected = activeSelection && activeSelection.kind === 'field' &&
            activeSelection.field === bar.dataset.field && activeSelection.value === bar.dataset.value;
        activeSelection = selected ? null : {
            kind: 'field', field: bar.dataset.field, value: bar.dataset.value,
            label: label(bar.dataset.field) + ': ' + label(bar.dataset.value),
        };
        renderDynamic();
        const restored = Array.from(root.querySelectorAll('.lit-bar-row')).find(function(button) {
            return button.dataset.field === bar.dataset.field && button.dataset.value === bar.dataset.value;
        });
        if (restored) restored.focus();
        syncStore();
        return;
    }
    if (event.target.closest('#lit-reset')) {
        root.querySelector('#lit-filter-year').value = 'all';
        root.querySelector('#lit-filter-source').value = 'all';
        root.querySelector('#lit-filter-study').value = 'all';
        activeSelection = null;
        renderDynamic();
        syncStore();
        return;
    }
    if (event.target.closest('#lit-clear-selection')) {
        activeSelection = null;
        renderDynamic();
        syncStore();
    }
}

window.initLiteraturbild = function() {
    root = document.getElementById('literaturbild-root');
    if (!root || root.dataset.initialized === 'true') return;
    root.dataset.initialized = 'true';
    root.innerHTML = '<p class="lit-loading">Literaturbild wird geladen …</p>';
    fetch('data/literature_landscape.json').then(function(response) {
        if (!response.ok) throw new Error('Annotationsdaten konnten nicht geladen werden');
        return response.json();
    }).then(function(payload) {
        data = payload;
        renderShell();
        applyStoreState(EC.store ? EC.store.get() : {});
        root.addEventListener('change', function(event) {
            if (event.target.id === 'lit-profile-field') activeProfile = event.target.value;
            activeSelection = null;
            renderDynamic();
            syncStore();
        });
        root.addEventListener('click', handleClick);
        if (EC.store) EC.store.subscribe(applyStoreState);
    }).catch(function(error) {
        root.innerHTML = '<p class="lit-error" role="alert">' + EC.escapeHtml(error.message) + '</p>';
    });
};

})();
