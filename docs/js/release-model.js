// Client-side model of the released dataset for the public Evidence Companion.
// It cross-tabulates released records only. Coverage figures the pipeline owns
// (meta.analysis_coverage) are read, never recomputed beyond these records.
(function (root) {
'use strict';

const EC = root.EC = root.EC || {};

const NONE = '__none';
const UNDECIDABLE = '__undecidable';
const ABSENT = '__absent';
const STUDY_FIELD = 'Studientyp';

// The analysis vocabulary carries no display labels yet. A label or value_labels
// entry in analysis_fields.json takes precedence as soon as the pipeline emits it;
// until then the controlled identifier is shown without the AN_ prefix.
function humanise(identifier) {
    return String(identifier == null ? '' : identifier).replace(/^AN_/, '').replace(/_/g, ' ');
}

function fold(text) {
    return String(text == null ? '' : text).toLowerCase().normalize('NFD')
        .replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss')
        .replace(/ae/g, 'a').replace(/oe/g, 'o').replace(/ue/g, 'u');
}

function isUndecidable(analysis, field) {
    const undecidable = analysis.undecidable;
    if (Array.isArray(undecidable)) return undecidable.indexOf(field) >= 0;
    return Boolean(undecidable && typeof undecidable === 'object' && undecidable[field]);
}

function fieldDimension(field) {
    const values = (field.values || []).map(function (value) {
        return value && typeof value === 'object' ? value.value : value;
    });
    const labels = Object.assign({}, field.value_labels || {});
    (field.values || []).forEach(function (value) {
        if (value && typeof value === 'object' && value.label) labels[value.value] = value.label;
    });
    // A single-valued field describes the whole work. Naming it "des Werks" keeps a
    // cross-tab from reading as if, say, one technique had been evaluated.
    const workLevel = field.multi === false;
    return {
        id: field.name, kind: 'field', workLevel: workLevel,
        label: (field.label || humanise(field.name)) + (workLevel ? ' des Werks' : ''),
        values: values.filter(function (value) { return value !== 'None'; }),
        statusKeys: [NONE, UNDECIDABLE, ABSENT],
        valueLabel: function (value) { return labels[value] || humanise(value); },
    };
}

function createModel(input) {
    const landscape = input.landscape || { records: [], meta: {}, source: {} };
    const schema = input.schema || { categories: [], groups: {} };
    const fields = input.fields || { fields: [], study_types: [] };
    const assertions = (input.assertions && input.assertions.assertions) || [];
    const release = input.release || { papers: [], meta: {} };
    const categoryByKey = {};
    schema.categories.forEach(function (category) { categoryByKey[category.key] = category; });

    const dims = [];
    fields.fields.filter(function (field) { return !field.free_text && Array.isArray(field.values); })
        .forEach(function (field) { dims.push(fieldDimension(field)); });
    if (Array.isArray(fields.study_types) && fields.study_types.length) {
        dims.push(fieldDimension({ name: STUDY_FIELD, label: STUDY_FIELD, multi: false, values: fields.study_types }));
    }
    Object.keys(schema.groups || {}).forEach(function (group) {
        const members = schema.groups[group];
        const first = categoryByKey[members[0]] || {};
        const groupName = String(first.group || group);
        dims.push({
            id: group, kind: 'group', workLevel: false, values: members.slice(),
            label: 'Kategoriegruppe ' + groupName.charAt(0).toUpperCase() + groupName.slice(1),
            statusKeys: [NONE, ABSENT],
            valueLabel: function (key) { return (categoryByKey[key] && categoryByKey[key].label) || humanise(key); },
        });
    });
    const dimById = {};
    dims.forEach(function (dim) { dimById[dim.id] = dim; });

    function statusOfRecord(record) {
        if (!record) return 'ki';
        return record.verification || record.publication_approval ? 'verified' : 'ki';
    }

    const works = new Map();
    function workFor(workId, seed) {
        if (!works.has(workId)) {
            works.set(workId, {
                id: workId, record: null, papers: [], assertions: [], title: seed.title || '',
                authorYear: seed.author_year || '', authors: seed.authors || '', year: seed.year || '',
                doi: seed.doi || '', url: seed.url || '', journal: seed.journal || '',
                versionType: seed.version_type || '', recordIds: [], status: 'ki',
            });
        }
        return works.get(workId);
    }
    landscape.records.forEach(function (record) {
        const work = workFor(record.work_id, record);
        work.record = record;
        work.status = statusOfRecord(record);
        work.recordIds = (record.record_ids || [record.id]).slice();
    });
    release.papers.forEach(function (paper) {
        const work = workFor(paper.work_id, paper);
        work.papers.push(paper);
        if (work.recordIds.indexOf(paper.id) < 0) work.recordIds.push(paper.id);
    });
    assertions.forEach(function (assertion) {
        const seen = new Set();
        assertion.evidence.forEach(function (evidence) {
            const work = workFor(evidence.work_id, evidence);
            if (!work.record && evidence.status === 'verified') work.status = 'verified';
            if (!seen.has(work.id)) { work.assertions.push(assertion); seen.add(work.id); }
            if (work.recordIds.indexOf(evidence.record_id) < 0) work.recordIds.push(evidence.record_id);
        });
    });
    works.forEach(function (work) {
        work.search = fold([work.title, work.authors, work.authorYear, work.year, work.doi, work.journal].join(' '));
    });

    const allWorks = Array.from(works.values()).sort(function (a, b) {
        return a.authorYear.localeCompare(b.authorYear, 'de') || a.title.localeCompare(b.title, 'de');
    });
    const includes = allWorks.filter(function (work) { return work.record && work.record.decision === 'Include'; });

    function stateOf(work, dimId) {
        const dim = dimById[dimId];
        const record = work.record;
        if (!dim || !record) return { state: 'absent', values: [] };
        if (dim.kind === 'group') {
            if (!Array.isArray(record.categories)) return { state: 'absent', values: [] };
            const present = record.categories.map(function (category) { return category.key; })
                .filter(function (key) { return dim.values.indexOf(key) >= 0; });
            return present.length ? { state: 'value', values: dim.values.filter(function (key) { return present.indexOf(key) >= 0; }) }
                : { state: 'none', values: [] };
        }
        const analysis = record.analysis;
        if (!analysis || !analysis.fields) return { state: 'absent', values: [] };
        if (isUndecidable(analysis, dimId)) return { state: 'undecidable', values: [] };
        const raw = analysis.fields[dimId];
        const list = (Array.isArray(raw) ? raw : [raw]).filter(function (value) { return value != null && value !== ''; });
        if (!list.length) return { state: 'absent', values: [] };
        const coded = list.filter(function (value) { return value !== 'None'; });
        if (!coded.length) return { state: 'none', values: [] };
        return { state: 'value', values: coded };
    }

    function keysOf(work, dimId) {
        const state = stateOf(work, dimId);
        if (state.state === 'value') return state.values;
        return [state.state === 'none' ? NONE : state.state === 'undecidable' ? UNDECIDABLE : ABSENT];
    }

    function rowKeys(dimId) {
        const dim = dimById[dimId];
        return dim ? dim.values.concat(dim.statusKeys) : [];
    }

    function crossTab(selection, rowDimId, colDimId) {
        const cells = {};
        rowKeys(rowDimId).forEach(function (row) {
            cells[row] = {};
            rowKeys(colDimId).forEach(function (col) { cells[row][col] = []; });
        });
        selection.forEach(function (work) {
            const rows = keysOf(work, rowDimId);
            const cols = keysOf(work, colDimId);
            rows.forEach(function (row) {
                cols.forEach(function (col) { if (cells[row] && cells[row][col]) cells[row][col].push(work); });
            });
        });
        return cells;
    }

    function coverage(selection, dimId) {
        const counts = { in_scope: selection.length, coded: 0, none: 0, undecidable: 0, not_coded: 0 };
        selection.forEach(function (work) {
            const state = stateOf(work, dimId).state;
            if (state === 'value') counts.coded += 1;
            else if (state === 'none') counts.none += 1;
            else if (state === 'undecidable') counts.undecidable += 1;
            else counts.not_coded += 1;
        });
        return counts;
    }

    // Tolerant reader for the pipeline's coverage contract; its exact key names are
    // still being settled, so known aliases map onto one shape and absence is null.
    function pipelineCoverage(dimId) {
        const meta = landscape.meta || {};
        const block = meta.analysis_coverage;
        if (!block || typeof block !== 'object') return null;
        const entry = (block.fields && block.fields[dimId]) || block[dimId];
        if (!entry || typeof entry !== 'object') return null;
        function pick(names) {
            for (let i = 0; i < names.length; i += 1) {
                if (typeof entry[names[i]] === 'number') return entry[names[i]];
            }
            return null;
        }
        return {
            in_scope: pick(['in_scope', 'include_in_scope', 'include_works_in_scope', 'include_works', 'scope']),
            coded: pick(['coded']), none: pick(['none', 'not_applicable']),
            undecidable: pick(['undecidable']), not_coded: pick(['not_coded', 'uncoded', 'absent']),
            withheld: pick(['withheld']),
        };
    }

    // "n von N eingeschlossenen Werken codiert": coded means any recorded state
    // (value, none, undecidable) in every named field. Per-field pipeline figures
    // cannot express "every field", so their smallest coded total is the bound.
    function codedSummary(selection, dimIds, usePipeline) {
        const ids = dimIds.filter(function (id, index) { return dimById[id] && dimIds.indexOf(id) === index; });
        if (usePipeline) {
            const figures = ids.map(pipelineCoverage);
            const complete = figures.length && figures.every(function (item) {
                return item && item.in_scope != null && item.coded != null && item.none != null && item.undecidable != null;
            });
            if (complete) {
                return {
                    coded: Math.min.apply(null, figures.map(function (item) { return item.coded + item.none + item.undecidable; })),
                    total: Math.max.apply(null, figures.map(function (item) { return item.in_scope; })), source: 'pipeline',
                };
            }
        }
        const coded = selection.filter(function (work) {
            return ids.every(function (id) { return stateOf(work, id).state !== 'absent'; });
        }).length;
        return { coded: coded, total: selection.length, source: 'records' };
    }

    function filterWorks(selection, filters) {
        return selection.filter(function (work) {
            if (filters.year && String(work.year) !== String(filters.year)) return false;
            if (filters.status && work.status !== filters.status) return false;
            if (filters.study && stateOf(work, STUDY_FIELD).values.indexOf(filters.study) < 0) return false;
            return true;
        });
    }

    function categoryEvidence(work, key) {
        const record = work.record;
        const category = record && (record.categories || []).find(function (item) { return item.key === key; });
        if (!category) return [];
        return (category.evidence || []).map(function (passage) {
            return {
                kind: 'quote', text: passage.snippet || passage.term || '', term: passage.term || '',
                recordId: passage.source_record_id || record.id, versionId: passage.version_id || record.version_id,
                textSource: record.text_source, level: category.level,
            };
        });
    }

    function fieldCorrections(work, dimId) {
        const correction = work.record && work.record.ai_correction;
        if (!correction) return [];
        return (correction.changes || []).filter(function (change) {
            return change.path === '/analysis/fields/' + dimId;
        }).map(function (change) {
            return { kind: 'correction', text: change.reason || '', before: change.before, after: change.after };
        });
    }

    function evidenceFor(work, dimId, key) {
        const dim = dimById[dimId];
        if (!dim || key === NONE || key === UNDECIDABLE || key === ABSENT) return [];
        if (dim.kind === 'group') return categoryEvidence(work, key);
        return fieldCorrections(work, dimId);
    }

    function token(dimId, key) { return dimId + ':' + key; }
    function parseToken(value) {
        const text = String(value || '');
        const at = text.indexOf(':');
        if (at < 1) return null;
        const dimId = text.slice(0, at);
        const key = text.slice(at + 1);
        const dim = dimById[dimId];
        if (!dim || dim.values.indexOf(key) < 0) return null;
        return { dimId: dimId, key: key };
    }
    function termLabel(term) {
        const dim = dimById[term.dimId];
        return dim ? dim.valueLabel(term.key) : term.key;
    }

    function worksWith(selection, term) {
        return selection.filter(function (work) { return stateOf(work, term.dimId).values.indexOf(term.key) >= 0; });
    }

    // Terms counted together when the same work carries both codes; no direction.
    function neighbours(selection, ego, dimIds) {
        const egoWorks = worksWith(selection, ego);
        const found = {};
        egoWorks.forEach(function (work) {
            dimIds.forEach(function (dimId) {
                stateOf(work, dimId).values.forEach(function (key) {
                    if (dimId === ego.dimId && key === ego.key) return;
                    const id = token(dimId, key);
                    if (!found[id]) found[id] = { dimId: dimId, key: key, works: [] };
                    found[id].works.push(work);
                });
            });
        });
        return Object.keys(found).map(function (id) { return found[id]; }).sort(function (a, b) {
            return dimIds.indexOf(a.dimId) - dimIds.indexOf(b.dimId) || b.works.length - a.works.length ||
                termLabel(a).localeCompare(termLabel(b), 'de');
        });
    }

    function terms(selection) {
        return dims.map(function (dim) {
            return {
                dim: dim,
                values: dim.values.map(function (key) {
                    return { dimId: dim.id, key: key, count: worksWith(selection, { dimId: dim.id, key: key }).length };
                }).filter(function (item) { return item.count > 0; }),
            };
        }).filter(function (group) { return group.values.length; });
    }

    function workById(id) {
        if (works.has(id)) return works.get(id);
        return allWorks.find(function (work) { return work.recordIds.indexOf(id) >= 0; }) || null;
    }

    return {
        NONE: NONE, UNDECIDABLE: UNDECIDABLE, ABSENT: ABSENT, STUDY_FIELD: STUDY_FIELD,
        landscape: landscape, schema: schema, fields: fields, release: release, assertions: assertions,
        publicLabel: (landscape.source && landscape.source.public_label) ||
            (input.assertions && input.assertions.meta && input.assertions.meta.public_label) || 'KI-quellengeprüft',
        dims: dims, dim: function (id) { return dimById[id] || null; },
        works: allWorks, includes: includes, workById: workById,
        stateOf: stateOf, keysOf: keysOf, rowKeys: rowKeys, crossTab: crossTab,
        coverage: coverage, pipelineCoverage: pipelineCoverage, codedSummary: codedSummary, filterWorks: filterWorks,
        evidenceFor: evidenceFor, categoryEvidence: categoryEvidence,
        token: token, parseToken: parseToken, termLabel: termLabel, worksWith: worksWith,
        neighbours: neighbours, terms: terms, fold: fold, humanise: humanise,
    };
}

EC.createModel = createModel;
EC.fold = fold;
})(typeof window !== 'undefined' ? window : globalThis);
