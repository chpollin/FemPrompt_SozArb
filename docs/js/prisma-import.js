// PRISM Excel-to-PRISM import bridge (plan.md Stage A, P3).
//
// The established capture workflow stays in the colleagues' Excel; PRISM is the
// downstream PRISMA layer. This module ingests a CSV exported from that Excel
// (column shape of benchmark/data/human_assessment.csv), converts it into a
// per-reviewer JSON file (schema femprompt-prisma-reviewer/0.2) and produces a
// validation report: out-of-vocabulary category and decision values, empty or
// out-of-vocabulary exclusion reasons on Exclude (the data-hygiene lesson from
// the conformance audit, knowledge/conformance-audit.md), duplicate paper ids,
// ids not present in the loaded corpus, and collisions with already recorded
// decisions. An import never overwrites an existing decision silently:
// collisions are listed, and overwriting is an explicit per-import choice.
//
// Standalone IIFE, no frameworks, no build step. It does not touch prisma.js;
// it talks to the page only through the public window.EC surface, the shared
// localStorage cache and the persisted File System Access handle in IndexedDB
// (both written by prisma.js), and it mounts its UI into the "Daten & Repo"
// surface via a MutationObserver on #prisma-root.
//
// ------------------------------------------------------------------
// Hand trace (adversarial static review, 2026-06-09): one real CSV row,
// end to end. Source row: benchmark/data/human_assessment.csv, file line 2
// (first data row), Zotero_Key EJEFPZGA. The line ends in CRLF and carries
// quoted commas in Title and Abstract.
//
// 1. parseCsv: the line is split on commas outside quotes; the quoted Title
//    ("Navigating the Nexus of Trust: Prompt Engineering, Professional
//    Judgment, ...") and the quoted Abstract stay single fields; the
//    trailing \r\n closes the row. Result: 25 fields matching the 25
//    header columns.
// 2. mapHeader (on file line 1): key=1 (Zotero_Key), decision=22, reason=23;
//    the ten category columns 11..20 map by exact name, except column 18,
//    "Diversitaet / Intersektionalität", which /^Diversit/ maps onto the
//    canonical Diversitaet. missing=[] so the import proceeds.
// 3. convert, rowNo=2, id="EJEFPZGA": the category cells
//    Nein,Ja,Ja,Nein,Ja,Ja,Nein,Nein,Nein,Nein (columns 11..20) become
//    { AI_Literacies:false, Generative_KI:true, Prompting:true,
//      KI_Sonstige:false, Soziale_Arbeit:true, Bias_Ungleichheit:true,
//      Gender:false, Diversitaet:false, Feministisch:false, Fairness:false }.
// 4. Decision "Exclude" passes normalizeDecision; Exclusion_Reason
//    "No full text" normalizes to the canonical code No_full_text.
// 5. deriveDecision: tech true (Generative_KI) and social true
//    (Soziale_Arbeit) yield Include; with Decision Exclude this sets
//    override=true plus an info flag "Override abgeleitet" (the reason is
//    not Duplicate). prisma.js finalDecisionOf(categories, override) then
//    reproduces Exclude from the stored record, so the record is
//    self-consistent under the tool's own decision logic.
// 6. Produced record under payload.decisions["EJEFPZGA"] (reviewer R1):
//    { categories: {as in step 3}, decision: "Exclude", override: true,
//      reason: "No_full_text", evidence: {}, ts: <import time ISO>,
//      reviewer: "R1",
//      imported: { source: "human_assessment.csv", row: 2,
//                  raw_reason: "No full text" } }
//    wrapped as { schema: "femprompt-prisma-reviewer/0.2", reviewer: "R1",
//    updated: <ISO>, decisions: {...} } and written as R1.json. prisma.js
//    loadAllReviewers keys it by obj.reviewer and reads exactly the fields
//    written here (categories, decision, override, reason, evidence, ts);
//    the extra imported subobject is provenance only and ignored by prisma.js.
// ------------------------------------------------------------------

(function() {
'use strict';

// Vocabularies. docs/data/ carries no categories JSON, so these are derived
// from benchmark/config/categories.yaml (v1.2), the same source prisma.js
// mirrors in its own constants.

const TECH_CATS = ['AI_Literacies', 'Generative_KI', 'Prompting', 'KI_Sonstige'];
const SOCIAL_CATS = ['Soziale_Arbeit', 'Bias_Ungleichheit', 'Gender', 'Diversitaet', 'Feministisch', 'Fairness'];
const ALL_CATS = TECH_CATS.concat(SOCIAL_CATS);

// decision.options in categories.yaml; only Include/Exclude are representable
// in the reviewer schema, Unclear rows are reported and skipped.
const DECISION_VOCAB = ['Include', 'Exclude', 'Unclear'];

// exclusion_reasons codes in categories.yaml; the Excel writes them with
// spaces ("No full text"), the canonical codes use underscores.
const REASON_VOCAB = ['Duplicate', 'Not_relevant_topic', 'Wrong_publication_type', 'No_full_text', 'Language'];

// accepted binary category cell values in the Excel export (case-insensitive);
// an empty cell means "not assessed" and maps to false without a flag.
let CAT_TRUE = 'ja', CAT_FALSE = 'nein';

const REVIEWER_SCHEMA = 'femprompt-prisma-reviewer/0.2';
const LS_KEY = 'femprompt-prisma-state/0.2'; // read-only here: collision base
const DEFAULT_REVIEWER = 'R1';

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

// Header mapping (column shape of benchmark/data/human_assessment.csv)

function mapHeader(headerRow) {
    let idx = {};
    headerRow.forEach(function(h, i) {
        const n = (h || '').trim();
        if (n === 'ID') idx.rowId = i;
        else if (n === 'Zotero_Key') idx.key = i;
        else if (n === 'Title') idx.title = i;
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

function esc(s) {
    if (window.EC && window.EC.escapeHtml) return window.EC.escapeHtml(s);
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}

function deriveDecision(cats) {
    const tech = TECH_CATS.some(function(c) { return cats[c]; });
    const soc = SOCIAL_CATS.some(function(c) { return cats[c]; });
    return (tech && soc) ? 'Include' : 'Exclude';
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
        if (!!(a.categories && a.categories[c]) !== !!(b.categories && b.categories[c])) return false;
    }
    return true;
}

// existing decisions for the reviewer id: localStorage cache plus, when the
// repo folder is already connected (permission previously granted), the
// committed reviewer file; the file wins, mirroring prisma.js semantics.
function loadExistingLocal(rid) {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return null;
        let o = JSON.parse(raw);
        return (o.reviewers && o.reviewers[rid]) ? o.reviewers[rid] : null;
    } catch (e) { return null; }
}

function convert(rows, header, rid, existing, overwrite, fileName) {
    let idx = header.idx;
    const nowIso = new Date().toISOString();
    const corpus = {};
    const papers = (window.EC && window.EC.getAllPapers) ? (window.EC.getAllPapers() || []) : [];
    papers.forEach(function(p) { corpus[p.id] = true; });
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
            flag(rowNo, id, 'nicht im Korpus', 'warn',
                 'ID nicht im geladenen Korpus; die Entscheidung wird in die Datei uebernommen, im Tool aber nicht angezeigt.');
        }

        // categories
        let cats = {}, unknownVals = [];
        ALL_CATS.forEach(function(c) {
            let v = (r[idx['cat_' + c]] || '').trim().toLowerCase();
            if (v === CAT_TRUE) cats[c] = true;
            else if (v === CAT_FALSE || v === '') cats[c] = false;
            else { cats[c] = false; unknownVals.push(c + '="' + (r[idx['cat_' + c]] || '').trim() + '"'); }
        });
        if (unknownVals.length) {
            flag(rowNo, id, 'unbekannter Kategorienwert', 'warn',
                 unknownVals.join(', ') + ' (erlaubt: Ja, Nein, leer; als Nein uebernommen).');
        }

        // decision
        const dec = normalizeDecision(r[idx.decision]);
        if (dec === null) { flag(rowNo, id, 'fehlende Decision', 'error', 'Keine Decision, Zeile uebersprungen.'); stats.skipped++; return; }
        if (dec === undefined) {
            flag(rowNo, id, 'unbekannte Decision', 'error',
                 '"' + (r[idx.decision] || '').trim() + '" (erlaubt: ' + DECISION_VOCAB.join(', ') + '), Zeile uebersprungen.');
            stats.skipped++; return;
        }
        if (dec === 'Unclear') {
            flag(rowNo, id, 'Decision Unclear', 'error',
                 'Unclear ist im Reviewer-Schema nicht abbildbar, Zeile uebersprungen; bitte in der Excel aufloesen.');
            stats.skipped++; return;
        }

        // exclusion reason
        let reason = null;
        if (dec === 'Exclude') {
            const nr = normalizeReason(idx.reason != null ? r[idx.reason] : '');
            if (nr.empty) {
                flag(rowNo, id, 'leerer Ausschlussgrund', 'warn',
                     'Exclude ohne Ausschlussgrund (Vokabular: ' + REASON_VOCAB.join(', ') + ').');
            } else if (!nr.known) {
                flag(rowNo, id, 'Ausschlussgrund ausserhalb des Vokabulars', 'warn',
                     '"' + nr.code + '" ist nicht im kontrollierten Vokabular; Wert wird unveraendert uebernommen und hier sichtbar gemacht.');
                reason = nr.code;
            } else {
                reason = nr.code;
            }
        }

        // consistency between categories and decision (Include rule of categories.yaml)
        const derived = deriveDecision(cats);
        let override = dec === 'Exclude' && derived === 'Include';
        if (override && reason !== 'Duplicate') {
            // Duplicate excludes regularly carry the full category set of the
            // original record; flagging them all would flood the report.
            flag(rowNo, id, 'Override abgeleitet', 'info',
                 'Kategorien ergeben Include, Decision ist Exclude; als Override erfasst.');
        }
        if (dec === 'Include' && derived === 'Exclude') {
            flag(rowNo, id, 'inkonsistente Kategorien', 'warn',
                 'Decision Include, aber die Kategorien ergeben Exclude (Technik UND Sozial noetig); Decision bleibt bindend.');
        }

        const rec = {
            categories: cats, decision: dec, override: override,
            reason: dec === 'Exclude' ? reason : null,
            evidence: {},
            ts: nowIso, reviewer: rid,
            imported: { source: fileName || 'csv', row: rowNo, raw_reason: idx.reason != null ? (r[idx.reason] || '').trim() : '' }
        };

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

    const payload = { schema: REVIEWER_SCHEMA, reviewer: rid, updated: nowIso, decisions: decisions };
    return { payload: payload, report: report, stats: stats };
}

// File System Access: reuse the handle prisma.js persisted in IndexedDB
// ('femprompt-prisma' / 'handles' / 'dir'). prisma.js does not expose the
// handle on window.EC; if a future version does (EC.getScreeningDirHandle),
// that takes precedence.

function idbGetDir() {
    return new Promise(function(res) {
        try {
            const r = indexedDB.open('femprompt-prisma', 1);
            r.onupgradeneeded = function() { try { r.result.createObjectStore('handles'); } catch (e) {} };
            r.onsuccess = function() {
                try {
                    let t = r.result.transaction('handles', 'readonly');
                    const rq = t.objectStore('handles').get('dir');
                    rq.onsuccess = function() { res(rq.result || null); };
                    rq.onerror = function() { res(null); };
                } catch (e) { res(null); }
            };
            r.onerror = function() { res(null); };
        } catch (e) { res(null); }
    });
}

function getDirHandle(interactive) {
    if (window.EC && typeof window.EC.getScreeningDirHandle === 'function') {
        return Promise.resolve(window.EC.getScreeningDirHandle());
    }
    return idbGetDir().then(function(h) {
        if (!h || typeof h.queryPermission !== 'function') return null;
        return h.queryPermission({ mode: 'readwrite' }).then(function(p) {
            if (p === 'granted') return h;
            if (!interactive || typeof h.requestPermission !== 'function') return null;
            return h.requestPermission({ mode: 'readwrite' }).then(function(p2) {
                return p2 === 'granted' ? h : null;
            });
        }).catch(function() { return null; });
    }).catch(function() { return null; });
}

function readReviewerFile(handle, rid) {
    return handle.getFileHandle(rid + '.json').then(function(fh) {
        return fh.getFile();
    }).then(function(f) { return f.text(); }).then(function(t) {
        let o = JSON.parse(t);
        return o && o.decisions ? o.decisions : null;
    }).catch(function() { return null; });
}

function writeReviewerFile(handle, rid, payload) {
    return handle.getFileHandle(rid + '.json', { create: true }).then(function(fh) {
        return fh.createWritable();
    }).then(function(w) {
        return w.write(JSON.stringify(payload, null, 2)).then(function() { return w.close(); });
    });
}

// UI: one block, mounted into the "Daten & Repo" surface

let block = null;
let lastResult = null;   // { payload, report, stats, rid, sources }
const FS_SUPPORTED = typeof window.showDirectoryPicker === 'function';

function buildBlock() {
    block = document.createElement('div');
    block.className = 'pt-data-block';
    block.id = 'pt-import-block';
    block.innerHTML =
        '<h4>Excel-Import (CSV-Bruecke)</h4>' +
        '<p class="pt-muted">Die Erfassung bleibt in der bekannten Excel der Kolleg:innen. Hier wird der CSV-Export ' +
        '(Spaltenform von benchmark/data/human_assessment.csv) geprueft und in eine Reviewer-Datei (Schema 0.2) umgewandelt. ' +
        'Der Pruefbericht zeigt Vokabular-Verstoesse, doppelte IDs, fehlende Ausschlussgruende und Kollisionen mit schon ' +
        'erfassten Entscheidungen. Bestehende Entscheidungen werden nie stillschweigend ueberschrieben.</p>' +
        '<div class="pt-data-actions">' +
        '<label class="pt-field"><span>Reviewer-Kuerzel (Dateiname &lt;kuerzel&gt;.json)</span>' +
        '<input id="pt-imp-rev" value="' + DEFAULT_REVIEWER + '"></label>' +
        '<label class="pt-field"><span>CSV-Export der Excel</span>' +
        '<input type="file" id="pt-imp-file" accept=".csv,text/csv"></label>' +
        '</div>' +
        '<label class="pt-field"><span><input type="checkbox" id="pt-imp-overwrite"> ' +
        'Kollisionen mit dem CSV-Wert ueberschreiben (Standard: bestehende Entscheidung behalten)</span></label>' +
        '<div class="pt-data-actions">' +
        '<button class="pt-btn" id="pt-imp-run">Pruefen und konvertieren</button>' +
        '<button class="pt-btn" id="pt-imp-dl" disabled>Reviewer-JSON herunterladen</button>' +
        (FS_SUPPORTED ? '<button class="pt-btn" id="pt-imp-write" disabled>In verbundenen Repo-Ordner schreiben</button>' : '') +
        '</div>' +
        '<div id="pt-imp-status" class="pt-muted"></div>' +
        '<div id="pt-imp-report"></div>';

    block.querySelector('#pt-imp-run').addEventListener('click', runImport);
    block.querySelector('#pt-imp-dl').addEventListener('click', function() {
        if (!lastResult) return;
        downloadJson(lastResult.rid + '.json', lastResult.payload);
    });
    let wbtn = block.querySelector('#pt-imp-write');
    if (wbtn) wbtn.addEventListener('click', writeToRepo);
}

function setStatus(msg) {
    const el = block && block.querySelector('#pt-imp-status');
    if (el) el.innerHTML = msg;
}

function readerRid() {
    const inp = block.querySelector('#pt-imp-rev');
    let v = (inp.value || '').trim().replace(/[^a-zA-Z0-9_-]/g, '') || DEFAULT_REVIEWER;
    inp.value = v;
    return v;
}

function runImport() {
    const fileInp = block.querySelector('#pt-imp-file');
    const file = fileInp.files && fileInp.files[0];
    if (!file) { setStatus('Bitte zuerst eine CSV-Datei waehlen.'); return; }
    const rid = readerRid();
    const overwrite = block.querySelector('#pt-imp-overwrite').checked;

    // invalidate the previous result first: a failed run must not leave the
    // download/write buttons pointing at a stale payload from an earlier file
    lastResult = null;
    block.querySelector('#pt-imp-dl').disabled = true;
    const wprev = block.querySelector('#pt-imp-write');
    if (wprev) wprev.disabled = true;
    block.querySelector('#pt-imp-report').innerHTML = '';

    const reader = new FileReader();
    reader.onload = function() {
        let rows = parseCsv(String(reader.result || ''));
        if (!rows.length) { setStatus('Datei ist leer oder nicht lesbar.'); return; }
        const header = mapHeader(rows[0]);
        if (header.missing.length) {
            setStatus('Fehlende Spalten: ' + esc(header.missing.join(', ')) +
                      '. Erwartet wird die Spaltenform von benchmark/data/human_assessment.csv.');
            return;
        }
        // collision base: localStorage cache, then the committed reviewer file
        // from an already connected repo folder (no permission prompt here).
        const local = loadExistingLocal(rid);
        getDirHandle(false).then(function(h) {
            return h ? readReviewerFile(h, rid).then(function(fileDec) {
                return { existing: fileDec || local, src: fileDec ? (rid + '.json im verbundenen Ordner') : (local ? 'lokaler Zwischenstand (Browser)' : null) };
            }) : { existing: local, src: local ? 'lokaler Zwischenstand (Browser)' : null };
        }).then(function(base) {
            const res = convert(rows.slice(1), header, rid, base.existing || {}, overwrite, file.name);
            lastResult = { payload: res.payload, report: res.report, stats: res.stats, rid: rid, base: base.src };
            block.querySelector('#pt-imp-dl').disabled = false;
            let wbtn = block.querySelector('#pt-imp-write');
            if (wbtn) wbtn.disabled = false;
            renderReport(res, base.src, file.name);
        }).catch(function(e) {
            setStatus('Import fehlgeschlagen: ' + esc(e && e.message ? e.message : String(e)));
        });
    };
    reader.onerror = function() { setStatus('Datei konnte nicht gelesen werden.'); };
    reader.readAsText(file);
}

function renderReport(res, baseSrc, fileName) {
    const s = res.stats;
    const parts = [];
    parts.push(s.rows + ' Datenzeilen aus ' + esc(fileName));
    parts.push(s.added + ' neu uebernommen');
    parts.push(s.unchanged + ' unveraendert (idempotent)');
    if (s.collisionsKept) parts.push(s.collisionsKept + ' Kollisionen, Bestand behalten');
    if (s.collisionsOverwritten) parts.push(s.collisionsOverwritten + ' Kollisionen ueberschrieben');
    if (s.skipped) parts.push(s.skipped + ' uebersprungen');
    if (s.keptExistingOnly) parts.push(s.keptExistingOnly + ' bestehende Entscheidungen ohne CSV-Zeile bleiben erhalten');
    setStatus('<strong>' + parts.join(' &middot; ') + '</strong>' +
        (baseSrc ? '<br>Kollisions-Basis: ' + esc(baseSrc) + '.' : '<br>Keine bestehenden Entscheidungen fuer dieses Kuerzel gefunden.') +
        '<br>Danach: JSON herunterladen und ueber &bdquo;Reviewer-Datei importieren&ldquo; laden, oder direkt in den Ordner schreiben und &bdquo;Reviewer-Dateien neu laden&ldquo; ausfuehren.');

    const rep = block.querySelector('#pt-imp-report');
    if (!res.report.length) { rep.innerHTML = '<p class="pt-muted">Keine Befunde: alle Werte im kontrollierten Vokabular.</p>'; return; }
    const MAX = 400;
    let h = '<table class="pt-matrix"><thead><tr><th>Zeile</th><th>ID</th><th>Befund</th><th>Detail</th></tr></thead><tbody>';
    res.report.slice(0, MAX).forEach(function(it) {
        h += '<tr><td>' + it.row + '</td><td class="mono">' + esc(it.id) + '</td><td>' + esc(it.kind) + '</td><td>' + esc(it.detail) + '</td></tr>';
    });
    h += '</tbody></table>';
    if (res.report.length > MAX) h += '<p class="pt-muted">' + (res.report.length - MAX) + ' weitere Befunde nicht angezeigt.</p>';
    rep.innerHTML = h;
}

function writeToRepo() {
    if (!lastResult) return;
    getDirHandle(true).then(function(h) {
        if (!h) {
            setStatus('Kein verbundener Repo-Ordner gefunden. Erst oben &bdquo;Mit Repo-Ordner verbinden&ldquo; ausfuehren, dann erneut schreiben; oder das JSON herunterladen.');
            return;
        }
        writeReviewerFile(h, lastResult.rid, lastResult.payload).then(function() {
            setStatus('Geschrieben: ' + esc(lastResult.rid) + '.json im verbundenen Ordner. ' +
                      'In PRISM &bdquo;Reviewer-Dateien neu laden&ldquo; ausfuehren, damit der Track in Fluss und Abgleich erscheint.');
        }).catch(function(e) {
            setStatus('Schreiben fehlgeschlagen: ' + esc(e && e.message ? e.message : String(e)) + '. Alternativ das JSON herunterladen.');
        });
    }).catch(function(e) {
        setStatus('Zugriff auf den Ordner fehlgeschlagen: ' + esc(e && e.message ? e.message : String(e)));
    });
}

function downloadJson(filename, obj) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
}

// Mounting: prisma.js re-renders the surface via innerHTML, so the block is
// re-appended whenever the "Daten & Repo" surface appears. The hook element
// in prisma.html (#pt-import-root) is the parking position.

function ensureMounted() {
    if (!block) return;
    const host = document.querySelector('#pt-surface .pt-data');
    if (host) {
        if (!host.contains(block)) host.appendChild(block);
        block.hidden = false;
    } else {
        const park = document.getElementById('pt-import-root');
        if (park && !park.contains(block)) { park.appendChild(block); block.hidden = true; }
    }
}

function init() {
    const root = document.getElementById('prisma-root');
    if (!root) return;
    buildBlock();
    ensureMounted();
    new MutationObserver(ensureMounted).observe(root, { childList: true, subtree: true });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

// test hook (headless harness)
window.__PRISMA_IMPORT_TEST__ = {
    parseCsv: parseCsv, mapHeader: mapHeader, convert: convert,
    normalizeReason: normalizeReason, normalizeDecision: normalizeDecision,
    deriveDecision: deriveDecision, sameDecision: sameDecision,
    REASON_VOCAB: REASON_VOCAB, DECISION_VOCAB: DECISION_VOCAB, ALL_CATS: ALL_CATS
};

})();
