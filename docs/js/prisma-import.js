// PRISM Excel-to-PRISM import bridge (plan.md Stage A, P3).
//
// This operator-only migration utility ingests a CSV exported from the historical
// assessment sheet
// (column shape of assessment/human_assessment.csv), converts it into a
// per-reviewer JSON file (version-aware schema 0.4 when the corpus mapping is
// loaded; historical schema 0.3 in an offline migration) and produces a
// validation report: out-of-vocabulary category and decision values, empty or
// out-of-vocabulary exclusion reasons on Exclude (the data-hygiene lesson from
// the conformance audit, knowledge/conformance-audit.md), duplicate paper ids,
// ids not present in the loaded corpus, and collisions with already recorded
// decisions. Its output is staging data: positive categories still require Paper
// evidence and Include records require analysis in PRISM before they are complete.
// An import never overwrites an existing decision silently:
// collisions are listed, and overwriting is an explicit per-import choice.
//
// Standalone IIFE, no frameworks, no build step. The module exposes conversion
// and validation functions for tests and operator scripts. It renders no editor
// controls and never reads or writes reviewer files by itself.
//
// The converter preserves row provenance and refuses category/decision combinations
// that cannot be represented by PRISM's three-way derivation and override contract.

(function() {
'use strict';

// Vocabularies are generated from assessment/categories.yaml and injected by
// PRISM or the operator harness before this module is evaluated.
const CATEGORY_SCHEMA = window.__CATEGORY_SCHEMA__ ||
    (window.EC && window.EC.getCategorySchema ? window.EC.getCategorySchema() : null);
if (!CATEGORY_SCHEMA || !Array.isArray(CATEGORY_SCHEMA.categories) ||
        !Array.isArray(CATEGORY_SCHEMA.decision_options) ||
        !Array.isArray(CATEGORY_SCHEMA.exclusion_reasons)) {
    throw new Error('Kategorieschema nicht geladen (docs/data/category_schema.json).');
}
const TECH_CATS = CATEGORY_SCHEMA.groups.object.slice();
const SOCIAL_CATS = CATEGORY_SCHEMA.groups.perspective.slice();
const ALL_CATS = TECH_CATS.concat(SOCIAL_CATS);

// decision.options in categories.yaml; all three values are representable in
// reviewer schema 0.3.
const DECISION_VOCAB = CATEGORY_SCHEMA.decision_options.slice();

// exclusion_reasons codes in categories.yaml; the Excel writes them with
// spaces ("No full text"), the canonical codes use underscores.
const REASON_VOCAB = CATEGORY_SCHEMA.exclusion_reasons.slice();

// Accepted three-level category cells. Historical Ja/Nein exports remain valid.
const CAT_VALUES = { nein: 0, '0': 0, teilweise: 1, '1': 1, ja: 2, '2': 2 };

const REVIEWER_SCHEMA = 'femprompt-prisma-reviewer/0.4';
const HISTORICAL_REVIEWER_SCHEMA = 'femprompt-prisma-reviewer/0.3';

// CSV parser (RFC-4180-ish): quoted fields, "" escapes, commas and line
// breaks inside quotes, CRLF and LF and lone CR, BOM. No library.

function parseCsv(text) {
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    let rows = [], field = '', row = [], inQ = false, i = 0, c;
    while (i < text.length) {
        c = text[i];
        if (inQ) {
            if (c === '"') {
                if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
                inQ = false; i++; continue;
            }
            field += c; i++; continue;
        }
        if (c === '"') { inQ = true; i++; continue; }
        if (c === ',') { row.push(field); field = ''; i++; continue; }
        if (c === '\r') { if (text[i + 1] === '\n') i++; row.push(field); field = ''; rows.push(row); row = []; i++; continue; }
        if (c === '\n') { row.push(field); field = ''; rows.push(row); row = []; i++; continue; }
        field += c; i++;
    }
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    // strip only trailing empty rows (final-newline artifacts); interior blank
    // rows are kept so report row numbers and imported.row keep matching the
    // source file line numbers (convert skips them without counting).
    while (rows.length && !rows[rows.length - 1].some(function(f) { return (f || '').trim() !== ''; })) rows.pop();
    return rows;
}

// Header mapping (column shape of assessment/human_assessment.csv)

function mapHeader(headerRow) {
    let idx = {};
    headerRow.forEach(function(h, i) {
        const n = (h || '').trim();
        if (n === 'Zotero_Key') idx.key = i;
        else if (n === 'Decision') idx.decision = i;
        else if (n === 'Exclusion_Reason') idx.reason = i;
        else if (/^Diversit/.test(n)) idx['cat_Diversitaet'] = i; // "Diversitaet / Intersektionalität"
        else if (ALL_CATS.indexOf(n) !== -1) idx['cat_' + n] = i;
    });
    let missing = [];
    if (idx.key == null) missing.push('Zotero_Key');
    if (idx.decision == null) missing.push('Decision');
    ALL_CATS.forEach(function(c) { if (idx['cat_' + c] == null) missing.push(c); });
    return { idx: idx, missing: missing };
}

// Conversion + validation

function deriveDecision(cats) {
    const tech = TECH_CATS.reduce(function(m, c) { return Math.max(m, categoryLevel(cats[c])); }, 0);
    const soc = SOCIAL_CATS.reduce(function(m, c) { return Math.max(m, categoryLevel(cats[c])); }, 0);
    if (Math.min(tech, soc) === 0) return 'Exclude';
    return tech === 2 && soc === 2 ? 'Include' : 'Unclear';
}

function categoryLevel(value) {
    if (value === true || value === 2 || value === '2') return 2;
    if (value === 1 || value === '1') return 1;
    return 0;
}

function normalizeReason(raw) {
    let t = (raw || '').trim();
    if (!t) return { code: null, known: true, empty: true };
    const norm = t.replace(/[\s/]+/g, '_').toLowerCase();
    for (let i = 0; i < REASON_VOCAB.length; i++) {
        if (REASON_VOCAB[i].toLowerCase() === norm) return { code: REASON_VOCAB[i], known: true, empty: false };
    }
    return { code: t, known: false, empty: false }; // preserved verbatim, flagged
}

function normalizeDecision(raw) {
    let t = (raw || '').trim();
    for (let i = 0; i < DECISION_VOCAB.length; i++) {
        if (DECISION_VOCAB[i].toLowerCase() === t.toLowerCase()) return DECISION_VOCAB[i];
    }
    return t === '' ? null : undefined; // null = missing, undefined = unknown value
}

function sameDecision(a, b) {
    if (!a || !b) return false;
    if (a.decision !== b.decision) return false;
    if ((a.reason || null) !== (b.reason || null)) return false;
    for (let i = 0; i < ALL_CATS.length; i++) {
        let c = ALL_CATS[i];
        if (categoryLevel(a.categories && a.categories[c]) !== categoryLevel(b.categories && b.categories[c])) return false;
    }
    return true;
}

function convert(rows, header, rid, existing, overwrite, fileName) {
    let idx = header.idx;
    const nowIso = new Date().toISOString();
    const corpus = {};
    const papers = (window.EC && window.EC.getAllPapers) ? (window.EC.getAllPapers() || []) : [];
    papers.forEach(function(p) { corpus[p.id] = p; });
    const corpusLoaded = papers.length > 0;

    const report = [];          // { row, id, kind, level, detail }
    const decisions = {};       // the generated payload's decision map
    Object.keys(existing || {}).forEach(function(k) { decisions[k] = existing[k]; });

    const seen = {};
    const stats = { rows: 0, added: 0, unchanged: 0, collisionsKept: 0, collisionsOverwritten: 0,
                  skipped: 0, keptExistingOnly: 0, flags: 0 };

    function flag(row, id, kind, level, detail) {
        report.push({ row: row, id: id, kind: kind, level: level, detail: detail });
        if (level !== 'info') stats.flags++;
    }

    rows.forEach(function(r, n) {
        let rowNo = n + 2; // 1-based, after header row
        // interior blank line: ignore without counting, numbering stays aligned
        if (!r.some(function(f) { return (f || '').trim() !== ''; })) return;
        stats.rows++;
        let id = (r[idx.key] || '').trim();

        if (!id) {
            flag(rowNo, '(leer)', 'fehlende Paper-ID', 'error', 'Zotero_Key ist leer, Zeile uebersprungen.');
            stats.skipped++; return;
        }
        if (seen[id]) {
            flag(rowNo, id, 'doppelte Paper-ID', 'error',
                 'Bereits in Zeile ' + seen[id] + ' dieser Datei, Zeile uebersprungen (erste Zeile gilt).');
            stats.skipped++; return;
        }
        seen[id] = rowNo;

        if (corpusLoaded && !corpus[id]) {
            flag(rowNo, id, 'nicht im Korpus', 'error',
                 'ID nicht im geladenen Korpus; Zeile uebersprungen.');
            stats.skipped++; return;
        }

        // categories
        let cats = {}, unknownVals = [];
        ALL_CATS.forEach(function(c) {
            let v = (r[idx['cat_' + c]] || '').trim().toLowerCase();
            if (v === '') cats[c] = 0;
            else if (Object.prototype.hasOwnProperty.call(CAT_VALUES, v)) cats[c] = CAT_VALUES[v];
            else { cats[c] = 0; unknownVals.push(c + '="' + (r[idx['cat_' + c]] || '').trim() + '"'); }
        });
        if (unknownVals.length) {
            flag(rowNo, id, 'unbekannter Kategorienwert', 'error',
                 unknownVals.join(', ') + ' (erlaubt: Nein/0, Teilweise/1, Ja/2, leer), Zeile uebersprungen.');
            stats.skipped++; return;
        }

        // decision
        const dec = normalizeDecision(r[idx.decision]);
        if (dec === null) { flag(rowNo, id, 'fehlende Decision', 'error', 'Keine Decision, Zeile uebersprungen.'); stats.skipped++; return; }
        if (dec === undefined) {
            flag(rowNo, id, 'unbekannte Decision', 'error',
                 '"' + (r[idx.decision] || '').trim() + '" (erlaubt: ' + DECISION_VOCAB.join(', ') + '), Zeile uebersprungen.');
            stats.skipped++; return;
        }
        // exclusion reason
        let reason = null;
        if (dec === 'Exclude') {
            const nr = normalizeReason(idx.reason != null ? r[idx.reason] : '');
            if (nr.empty) {
                flag(rowNo, id, 'leerer Ausschlussgrund', 'error',
                     'Exclude ohne Ausschlussgrund, Zeile uebersprungen.');
                stats.skipped++; return;
            } else if (!nr.known) {
                flag(rowNo, id, 'Ausschlussgrund ausserhalb des Vokabulars', 'error',
                     '"' + nr.code + '" ist nicht im kontrollierten Vokabular, Zeile uebersprungen.');
                stats.skipped++; return;
            } else {
                reason = nr.code;
            }
        }

        // consistency between categories and decision (Include rule of categories.yaml)
        const derived = deriveDecision(cats);
        let override = dec === 'Exclude' && derived === 'Include';
        if (dec !== derived && !override) {
            flag(rowNo, id, 'inkonsistente Decision', 'error',
                 'Kategorien ergeben ' + derived + ', Decision ist ' + dec + '; diese Abweichung ist im CSV nicht begruendet, Zeile uebersprungen.');
            stats.skipped++; return;
        }
        if (override && reason !== 'Duplicate') {
            // Duplicate excludes regularly carry the full category set of the
            // original record; flagging them all would flood the report.
            flag(rowNo, id, 'Override abgeleitet', 'info',
                 'Kategorien ergeben Include, Decision ist Exclude; als Override erfasst.');
        }
        const rec = {
            categories: cats, decision: dec, override: override,
            reason: dec === 'Exclude' ? reason : null,
            evidence: {},
            ts: nowIso, reviewer: rid, actor: 'human',
            imported: { source: fileName || 'csv', row: rowNo, raw_reason: idx.reason != null ? (r[idx.reason] || '').trim() : '' }
        };
        const paper = corpus[id];
        if (paper && paper.work_id && paper.version_id) Object.assign(rec, {
            work_id: paper.work_id,
            version_id: paper.version_id,
            version_type: paper.version_type || 'unknown',
            preferred_version_id: paper.preferred_version_id || paper.version_id,
            selected_version_is_preferred: !!paper.is_preferred_version
        });

        const ex = existing && existing[id];
        if (!ex) {
            decisions[id] = rec; stats.added++;
        } else if (sameDecision(ex, rec)) {
            stats.unchanged++; // idempotent re-import: keep the existing record (and its evidence)
        } else {
            const exDesc = ex.decision + (ex.reason ? ' (' + ex.reason + ')' : '');
            const newDesc = dec + (reason ? ' (' + reason + ')' : '');
            if (overwrite) {
                decisions[id] = rec; stats.collisionsOverwritten++;
                const hadEvidence = ex.evidence && Object.keys(ex.evidence).some(function(c) { return (ex.evidence[c] || []).length; });
                flag(rowNo, id, 'Kollision (ueberschrieben)', 'warn',
                     'Bestehend: ' + exDesc + '; CSV: ' + newDesc + '. Auf ausdrueckliche Wahl ueberschrieben.' +
                     (hadEvidence ? ' Die angehefteten Belege der bestehenden Entscheidung sind damit verworfen.' : ''));
            } else {
                stats.collisionsKept++;
                flag(rowNo, id, 'Kollision (bestehende Entscheidung behalten)', 'warn',
                     'Bestehend: ' + exDesc + '; CSV: ' + newDesc + '. Nicht ueberschrieben; zum Uebernehmen die Ueberschreiben-Option setzen und erneut pruefen.');
            }
        }
    });

    Object.keys(existing || {}).forEach(function(k) { if (!seen[k]) stats.keptExistingOnly++; });

    if (!corpusLoaded) {
        flag(1, '(global)', 'Korpus nicht geladen', 'info',
             'Korpus-Pruefung uebersprungen, da keine Paper geladen sind.');
    }

    const versionAware = corpusLoaded && Object.keys(decisions).every(function(id) {
        const paper = corpus[id];
        if (!paper || !paper.work_id || !paper.version_id) return false;
        Object.assign(decisions[id], {
            work_id: paper.work_id,
            version_id: paper.version_id,
            version_type: paper.version_type || 'unknown',
            preferred_version_id: paper.preferred_version_id || paper.version_id,
            selected_version_is_preferred: !!paper.is_preferred_version
        });
        return true;
    });
    const payload = { schema: versionAware ? REVIEWER_SCHEMA : HISTORICAL_REVIEWER_SCHEMA,
        reviewer: rid, actor: 'human', updated: nowIso, decisions: decisions };
    return { payload: payload, report: report, stats: stats };
}

// test hook (headless harness)
window.__PRISMA_IMPORT_TEST__ = {
    parseCsv: parseCsv, mapHeader: mapHeader, convert: convert,
    normalizeReason: normalizeReason, normalizeDecision: normalizeDecision,
    deriveDecision: deriveDecision, sameDecision: sameDecision,
    REASON_VOCAB: REASON_VOCAB, DECISION_VOCAB: DECISION_VOCAB, ALL_CATS: ALL_CATS
};

})();
