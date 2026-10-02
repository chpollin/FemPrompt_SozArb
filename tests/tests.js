// PRISM pure-function tests (plan P1 test fundament).
// Zero-dependency browser suite, loaded by tests/run-tests.html after
// docs/js/prisma-data.js (provides the real window.EC.escapeHtml) and
// docs/js/prisma.js (whose appended exposure block provides window.EC._test).
// All fixtures are inline; nothing here fetches anything.
//
// The served seed (docs/data/research_vault_v2.json) carries a human track on the paired
// subset and an AI track on all identified records; Section G asserts the flow aggregation
// reproduces those marginals from the real seed. ADR-017 removed the in-tool kappa/matrix,
// so no JS test recomputes them.

(function() {
'use strict';

// ============================================================
// Tiny runner: assert helpers, result list, title + page output
// ============================================================

var results = [];

function test(name, fn) {
    try { fn(); results.push({ name: name, ok: true }); }
    catch (e) { results.push({ name: name, ok: false, err: (e && e.message) ? e.message : String(e) }); }
}
function assert(cond, msg) {
    if (!cond) throw new Error(msg || 'assertion failed');
}
function assertEqual(actual, expected, msg) {
    if (actual !== expected) throw new Error((msg ? msg + ': ' : '') +
        'expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual));
}
function assertClose(actual, expected, eps, msg) {
    if (typeof actual !== 'number' || !(Math.abs(actual - expected) <= eps))
        throw new Error((msg ? msg + ': ' : '') + 'expected ' + expected + ' within ' + eps + ', got ' + actual);
}
function assertContains(hay, needle, msg) {
    if (String(hay).indexOf(needle) === -1)
        throw new Error((msg ? msg + ': ' : '') + 'expected output to contain ' + JSON.stringify(needle));
}
function assertNotContains(hay, needle, msg) {
    if (String(hay).indexOf(needle) !== -1)
        throw new Error((msg ? msg + ': ' : '') + 'expected output NOT to contain ' + JSON.stringify(needle));
}

function finish() {
    var total = results.length;
    var fail = results.filter(function(r) { return !r.ok; }).length;
    var pass = total - fail;
    document.title = (fail ? 'FAIL ' + fail + '/' + total : 'PASS ' + total + '/' + total) + ' PRISM tests';
    window.__TEST_RESULTS__ = { pass: pass, fail: fail, total: total, results: results };
    var root = document.getElementById('results');
    if (root) {
        var h = document.createElement('p');
        h.className = 'summary ' + (fail ? 'fail' : 'pass');
        h.textContent = fail ? 'FAIL: ' + fail + ' of ' + total + ' tests failed.' : 'PASS: all ' + total + ' tests passed.';
        root.appendChild(h);
        results.forEach(function(r) {
            var d = document.createElement('div');
            d.className = 'case ' + (r.ok ? 'ok' : 'bad');
            d.textContent = (r.ok ? 'ok    ' : 'FAIL  ') + r.name + (r.ok ? '' : '   >>  ' + r.err);
            root.appendChild(d);
        });
    }
    if (window.console && console.log) console.log('[tests] ' + document.title);
}

// ============================================================
// Guard: the exposure hook must exist
// ============================================================

var T = window.EC && window.EC._test;
if (!T) {
    document.title = 'FAIL PRISM tests: window.EC._test missing';
    var root0 = document.getElementById('results');
    if (root0) root0.textContent = 'window.EC._test is missing. The runner must load docs/js/prisma-data.js ' +
        'before docs/js/prisma.js, and the test exposure block at the end of prisma.js must be present.';
    window.__TEST_RESULTS__ = { pass: 0, fail: 1, total: 1,
        results: [{ name: 'window.EC._test present', ok: false, err: 'hook missing' }] };
    return;
}

var TEST_SCREENING_HANDLE = {
    getFileHandle: function() { return Promise.resolve({
        createWritable: function() { return Promise.resolve({ write: function() {}, close: function() {} }); }
    }); }
};
T.setScreeningHandle(TEST_SCREENING_HANDLE);
if (window.__ANALYSIS_FIELDS__ && T.setAnalysisFields) T.setAnalysisFields(window.__ANALYSIS_FIELDS__);

// localStorage hygiene: commit() persists app state under this key. Snapshot
// before the suite and restore after, so a same-origin PRISM session is not
// polluted when the tests run from a served checkout.
var LS_KEY = 'femprompt-prisma-state/0.2';
var lsBackup = null, lsReadable = false;
try { lsBackup = localStorage.getItem(LS_KEY); lsReadable = true; } catch (e) {}

test('PRISM defaults to reading without reviewer or folder setup', function() {
    assertEqual(T.canEdit(), false);
    var el = document.createElement('section');
    T.renderData(el);
    assertEqual(el.textContent.trim(), '', 'read mode renders no standing setup prose; the hint lives on the edit button');
    assert(!el.querySelector('input, form, .pt-folder-action, .pt-change-folder'), 'no author setup in read mode');
    assertEqual(T.selectReviewer('cp'), false, 'reviewer selection requires explicit editing');
});

test('read mode blocks annotation, analysis, reviewer imports and persistence even with a saved profile', function() {
    var S = T.getState();
    S.reviewer = 'reader'; S.index = 0;
    S.reviewers.reader = { readPaper: { decision: 'Include', categories: { Gender: 2 }, evidence: {}, text_source: 'raw' } };
    T.setPapers([{ id: 'readPaper' }]);
    T.resetWork({ id: 'readPaper' });
    T.getWork().reason = 'Not_relevant_topic';
    var before = JSON.stringify(S.reviewers);
    var draft = JSON.stringify(T.getWork());
    var stored = localStorage.getItem(LS_KEY);
    T.pinEvidence('Gender', 'gender', 'gender evidence', 'human');
    T.unpinEvidence('Gender', 0);
    T.saveCurrent();
    T.setAnalysis('readPaper', { fields: { Studientyp: 'Empirisch' } });
    T.commit(); T.save();
    assertEqual(T.importReviewerPayload({ decisions: { imported: { decision: 'Exclude' } } }, 'reader', true).reason, 'read-only');
    assertEqual(JSON.stringify(S.reviewers), before, 'stored annotations untouched');
    assertEqual(JSON.stringify(T.getWork()), draft, 'draft untouched by mutation entry points');
    assertEqual(localStorage.getItem(LS_KEY), stored, 'read mode writes no browser cache');
    S.reviewer = null; S.reviewers = {}; T.setPapers([]);
});

test('explicit editing reveals reviewer setup and returning to reading hides it', function() {
    var el = document.createElement('section');
    assertEqual(T.setEditMode(true), true);
    T.renderData(el);
    assert(!!el.querySelector('#pt-reviewer-key'), 'setup becomes available after opt-in');
    T.setEditMode(false); T.renderData(el);
    assert(!el.querySelector('#pt-reviewer-key'), 'returning to reading hides setup');
});

// The remaining fixtures exercise explicit authoring workflows and pure helpers.
T.setEditMode(true);

// ============================================================
// Section A: decision derivation truth table
// ============================================================

test('deriveDecision covers the category-level truth table', function() {
    var all = {};
    T.ALL_CATS.forEach(function(c) { all[c] = true; });
    [
        ['empty', {}, 'Exclude'],
        ['technical only', { Prompting: 2 }, 'Exclude'],
        ['perspective only', { Gender: 2 }, 'Exclude'],
        ['false values ignored', { Prompting: false, Gender: 2 }, 'Exclude'],
        ['both dimensions at ja', { Prompting: 2, Gender: 2 }, 'Include'],
        ['all categories', all, 'Include'],
        ['both dimensions partial', { Prompting: 1, Gender: 1 }, 'Unclear'],
        ['mixed ja and partial', { Prompting: 2, Gender: 1 }, 'Unclear'],
        ['partial in one dimension', { Prompting: 1 }, 'Exclude'],
        ['legacy boolean true', { Prompting: true, Gender: 2 }, 'Include']
    ].forEach(function(row) {
        assertEqual(T.deriveDecision(row[1]), row[2], row[0]);
    });
});
test('finalDecisionOf applies the symmetric human override to every derived outcome', function() {
    [
        ['Include remains Include', { Prompting: 2, Gender: 2 }, false, 'Include'],
        ['Include flips to Exclude', { Prompting: 2, Gender: 2 }, true, 'Exclude'],
        ['Exclude remains Exclude', { Prompting: 2 }, false, 'Exclude'],
        ['Exclude flips to Include', { Prompting: 2 }, true, 'Include'],
        ['empty Exclude flips to Include', {}, true, 'Include']
    ].forEach(function(row) {
        assertEqual(T.finalDecisionOf(row[1], row[2]), row[3], row[0]);
    });
});
test('divergent: differing decisions are divergent, equal or missing tracks are not', function() {
    assert(T.divergent({ decision: 'Include' }, { decision: 'Exclude' }) === true, 'Include vs Exclude');
    assert(!T.divergent({ decision: 'Include' }, { decision: 'Include' }), 'same decision');
    assert(!T.divergent(null, { decision: 'Include' }), 'missing human track');
    assert(!T.divergent({ decision: 'Include' }, null), 'missing AI track');
});

// ============================================================
// Section B removed with ADR-017: the human-AI agreement metrics
// (computeMatrix, cohenKappa, kappaLabel) and their tests left the tool.
// Agreement is no longer computed in-tool; it belongs to the data, not this suite.
// ============================================================

// ============================================================
// Section C: flow aggregation
// ============================================================

var flowFix = [
    { id: 'f1', human: { decision: 'Include' }, llm: { decision: 'Include' } },
    { id: 'f2', human: { decision: 'Exclude' }, llm: { decision: 'Include' } },
    { id: 'f3', human: { decision: 'Include' } },                  // no AI track
    { id: 'f4', llm: { decision: 'Exclude' } },                    // no human track
    { id: 'f5', title: 'neither track' },
    { id: 'f6', human: { decision: 'Unclear' }, llm: { decision: 'Unclear' } }
];

test('computeFlow (seed perspective): totals, lanes, no reasons on seed', function() {
    T.setPapers(flowFix);
    var f = T.computeFlow(T.SEED);
    assertEqual(f.total, 6, 'total');
    assertEqual(f.aiScreened, 4, 'aiScreened');
    assertEqual(f.aiIncl, 2, 'aiIncl');
    assertEqual(f.aiExcl, 1, 'aiExcl');
    assertEqual(f.aiUnclear, 1, 'aiUnclear');
    assertEqual(f.humanScreened, 4, 'humanScreened');
    assertEqual(f.humanIncl, 2, 'humanIncl');
    assertEqual(f.humanExcl, 1, 'humanExcl');
    assertEqual(f.humanUnclear, 1, 'humanUnclear');
    // the seed track carries no exclusion reasons, so none may be aggregated
    assertEqual(Object.keys(f.humanReasons).length, 0, 'humanReasons empty');
});
test('computeFlow (reviewer perspective): exclusion reasons are aggregated', function() {
    T.setPapers(flowFix);
    T.getState().reviewers.r1 = {
        f1: { decision: 'Exclude', reason: 'Duplicate', categories: {} },
        f2: { decision: 'Exclude', reason: 'Duplicate', categories: {} },
        f3: { decision: 'Exclude', reason: 'Language', categories: {} },
        f4: { decision: 'Include', categories: { Prompting: true, Gender: true } }
    };
    var f = T.computeFlow('r1');
    assertEqual(f.humanScreened, 3, 'only methodically complete reviewer records are counted');
    assertEqual(f.humanIncl, 0, 'an Include without evidence is not counted as complete');
    assertEqual(f.humanExcl, 3, 'humanExcl');
    assertEqual(f.humanUnclear, 0, 'humanUnclear');
    assertEqual(f.humanReasons.Duplicate, 2, 'Duplicate count');
    assertEqual(f.humanReasons.Language, 1, 'Language count');
    assertEqual(f.aiScreened, 4, 'AI lane unchanged by perspective');
    delete T.getState().reviewers.r1;
});
test('computeFlow on an empty corpus returns zeroed lanes', function() {
    T.setPapers([]);
    var f = T.computeFlow(T.SEED);
    assertEqual(f.total, 0); assertEqual(f.aiScreened, 0); assertEqual(f.humanScreened, 0);
    assertEqual(Object.keys(f.humanReasons).length, 0);
});
test('humanDecision / aiProposal / expertAssessment return null for missing tracks', function() {
    assertEqual(T.humanDecision({ id: 'x' }, T.SEED), null);
    assertEqual(T.humanDecision({ id: 'x' }, 'unknownReviewer'), null);
    assertEqual(T.aiProposal({ id: 'x' }), null);
    assertEqual(T.expertAssessment({ id: 'x' }), null);
});
test('humanDecision (reviewer perspective) carries reason and source', function() {
    T.getState().reviewers.r2 = { px: { decision: 'Exclude', reason: 'Duplicate', categories: { Gender: true } } };
    var d = T.humanDecision({ id: 'px' }, 'r2');
    assertEqual(d.decision, 'Exclude');
    assertEqual(d.reason, 'Duplicate');
    assertEqual(d.source, 'r2');
    assertEqual(d.categories.Gender, true);
    delete T.getState().reviewers.r2;
});

// ============================================================
// Section D: markdown escaping and parsing helpers
// ============================================================

test('EC.escapeHtml escapes script-tag input completely', function() {
    assertEqual(window.EC.escapeHtml('<script>alert("x")<\/script>'),
        '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
});
test('EC.escapeHtml handles null, undefined, ampersand, quotes', function() {
    assertEqual(window.EC.escapeHtml(null), '');
    assertEqual(window.EC.escapeHtml(undefined), '');
    assertEqual(window.EC.escapeHtml('a & b\'s "c"'), 'a &amp; b&#39;s &quot;c&quot;');
});
test('inlineMd escapes script-tag input before any formatting', function() {
    var out = T.inlineMd('<script>alert(1)<\/script>');
    assertEqual(out, '&lt;script&gt;alert(1)&lt;/script&gt;');
    assertNotContains(out, '<script');
});
test('inlineMd: bold, emphasis, inline code', function() {
    assertEqual(T.inlineMd('**bold** and *em* and `code`'),
        '<strong>bold</strong> and <em>em</em> and <code>code</code>');
});
test('inlineMd: wikilinks and markdown links reduce to their labels', function() {
    assertEqual(T.inlineMd('see [[Target|label]] and [[Plain]] plus [text](http://example.org)'),
        'see label and Plain plus text');
});
test('renderMarkdown neutralizes script tags in body text', function() {
    var out = T.renderMarkdown('# Head\n\n<script>alert(1)<\/script>');
    assertNotContains(out, '<script');
    assertContains(out, '&lt;script&gt;alert(1)&lt;/script&gt;');
    assertContains(out, '<h1 class="pt-doc-h1">Head</h1>');
});
test('renderMarkdown neutralizes attribute-injection input', function() {
    var out = T.renderMarkdown('<img src=x onerror=alert(1)>');
    assertNotContains(out, '<img');
    assertContains(out, '&lt;img src=x onerror=alert(1)&gt;');
});
test('renderMarkdown strips a leading frontmatter block', function() {
    var out = T.renderMarkdown('---\ntitle: X\n---\nBody text');
    assertNotContains(out, 'title: X');
    assertContains(out, '<p class="pt-doc-p">Body text</p>');
});
test('renderMarkdown skips an embedded yaml-like block in the body', function() {
    var out = T.renderMarkdown('Intro\n\n---\nkey: value\nother: thing\n---\n\nAfter');
    assertNotContains(out, 'key: value');
    assertContains(out, '<p class="pt-doc-p">Intro</p>');
    assertContains(out, '<p class="pt-doc-p">After</p>');
});
test('renderMarkdown renders a lone --- as a horizontal rule', function() {
    var out = T.renderMarkdown('above\n\n---');
    assertContains(out, '<hr class="pt-doc-hr">');
});
test('renderMarkdown: lists, blockquote, paragraph joining, heading cap at h4', function() {
    var out = T.renderMarkdown('- a\n- b\n\n> quoted\n\nline one\nline two\n\n###### deep');
    assertContains(out, '<ul class="pt-doc-ul"><li>a</li><li>b</li></ul>');
    assertContains(out, '<blockquote class="pt-doc-q">quoted</blockquote>');
    assertContains(out, '<p class="pt-doc-p">line one line two</p>');
    assertContains(out, '<h4 class="pt-doc-h4">deep</h4>');
    assertNotContains(out, '<h6');
});
test('stripFrontmatter removes only a leading frontmatter block', function() {
    assertEqual(T.stripFrontmatter('---\na: 1\n---\nrest'), 'rest');
    assertEqual(T.stripFrontmatter('no frontmatter here'), 'no frontmatter here');
});
test('countOcc: counts, empty needle, empty haystack, non-overlapping matches', function() {
    assertEqual(T.countOcc('banana', 'an'), 2);
    assertEqual(T.countOcc('banana', ''), 0);
    assertEqual(T.countOcc('', 'an'), 0);
    assertEqual(T.countOcc('aaa', 'aa'), 1, 'matches do not overlap');
});
test('paperBodyMarkdown starts at an explicit Abstract and removes duplicate title metadata', function() {
    var p = { title: 'A Study', authors: 'Ada Example; Ben Probe', author_year: 'Example et al. (2026)' };
    var md = '# A Study\n\nAda Example; Ben Probe\n\n## Abstract\nThe abstract body.\n\n## Method\nDetails.';
    var body = T.paperBodyMarkdown(md, p);
    assert(body.indexOf('## Abstract') === 0, 'body begins at the explicit Abstract heading');
    assertNotContains(body, '# A Study');
    assertNotContains(body, 'Ada Example; Ben Probe');
});
test('paperBodyMarkdown removes only known leading metadata when no Abstract exists', function() {
    var p = { title: 'A Study', author_year: 'Example (2026)' };
    var body = T.paperBodyMarkdown('# A Study\n\nExample (2026)\n\n## Introduction\nSubstantive opening.', p);
    assert(body.indexOf('## Introduction') === 0, 'known title and author-year removed');
    var unknown = T.paperBodyMarkdown('Publisher note that is real prose.\n\n## Introduction\nBody.', p);
    assertContains(unknown, 'Publisher note that is real prose.', 'unknown prose is never removed heuristically');
});
test('DOI metadata normalizes resolver forms and renders a safe compact link', function() {
    assertEqual(T.normalizedDoi('https://doi.org/10.1234/example.test'), '10.1234/example.test');
    assertEqual(T.normalizedDoi('doi: 10.1234/example test'), '10.1234/example test');
    assertEqual(T.doiHref('doi: 10.1234/example test'), 'https://doi.org/10.1234/example%20test');
    var html = T.readingShellHtml({
        id: 'doi-paper', title: 'DOI paper', authors: 'Ada Example', year: 2026,
        doi: 'https://doi.org/10.1234/example.test', abstract: new Array(140).join('a')
    }, null);
    assertContains(html, 'class="pt-doi-link"');
    assertContains(html, 'href="https://doi.org/10.1234/example.test"');
    assertContains(html, 'target="_blank" rel="noopener noreferrer"');
    assertContains(html, '>10.1234/example.test</a>');
    assertNotContains(html, 'doi-paper', 'internal identifiers stay out of the interface');
    assertNotContains(html, '<details', 'the reading header has no disclosure element');
});
test('reading shell labels the generated reference as LLM-Wissensdestillat', function() {
    var html = T.readingShellHtml({ id: 'layer-paper', title: 'Layer paper', abstract: new Array(140).join('a') }, null);
    assertContains(html, '>LLM-Wissensdestillat</button>');
    assertContains(html, '>Papertext</button>');
    assertContains(html, 'LLM-Wissensdestillat, nicht der Papertext. Belege von hier zählen nicht als Paper-Beleg.');
    assertNotContains(html, 'KI-Extraktion');
    assertContains(html, 'class="pt-reading-surface" id="pt-reading-surface" aria-label="Papertext"');
});
test('reading shell identifies preparation knowledge as unreviewed LLM work', function() {
    var html = T.readingShellHtml({
        id: 'prepared-paper',
        title: 'Prepared paper',
        abstract: new Array(140).join('a'),
        knowledge_authority: { status: 'preparation' }
    }, null);
    assertContains(html, 'LLM-Ausarbeitung, noch nicht geprüft');
    assertNotContains(html, 'LLM-Wissensdestillat, nicht der Papertext');
});
test('web source URLs move to metadata and repeated URL-only lines leave the paper body', function() {
    var canonical = 'https://www.articulate.com/blog/how-to-create-inclusive-ai-images-a-guide-to-bias-free-prompting/';
    var converted = 'https://www.articulate.com/blog/how-to-create-inclusive-ai-images-a-guide-to-bias-freeprompting/';
    var p = { id: 'web', title: 'Guide', author_year: 'Articulate (2025)', year: 2025, url: canonical };
    var body = T.paperBodyMarkdown(converted + '\n\nSubstantive opening.\n\n' + converted + '\n\nClosing.', p);
    assertNotContains(body, 'https://www.articulate.com', 'source artefact removed throughout the body');
    assertContains(body, 'Substantive opening.');
    assertContains(body, 'Closing.');
    assert(T.sameSourceUrl(converted, canonical), 'hyphenation variation resolves to the canonical source');
    var html = T.readingShellHtml(p, null);
    assertContains(html, 'class="pt-source-link"');
    assertContains(html, 'href="' + canonical + '"');
    assertContains(html, '>Articulate</dd>', 'fallback author omits the separately shown year');
});
test('corpus search ranks an exact title first and labels unambiguous match kinds', function() {
    T.setPapers([
        { id: 'S1', title: 'Exact Paper', author_year: 'A (2024)', doi: '10.1/exact' },
        { id: 'S2', title: 'A discussion of Exact Paper', author_year: 'B (2025)' },
        { id: 'S3', title: 'Unrelated', author_year: 'Exact Paper (2023)' }
    ]);
    T.setCorpusIndex({ S1: { x: 'exact paper body' }, S2: { x: 'body' }, S3: { x: 'body' } });
    var results = T.corpusSearchResults('Exact Paper');
    assertEqual(results.map(function(x) { return x.paper.id; }).join('|'), 'S1|S2|S3');
    assertEqual(results.map(function(x) { return x.kind; }).join('|'), 'Exakter Titel|Titel|Autor:in/Jahr');
});
test('corpus search names a Paper-ID match without showing internal identifiers', function() {
    T.setPapers([{ id: 'S-DOI', title: 'Identified paper', author_year: 'A (2024)', doi: '10.1/identified' }]);
    T.setCorpusIndex({ 'S-DOI': { x: 'body' } });
    T.setCorpusQuery('S-DOI');
    var html = T.corpusListHtml();
    assertContains(html, '>Paper-ID</span>', 'the match kind is named');
    assertNotContains(html, 'ID S-DOI', 'the identifier itself is not displayed');
    assertNotContains(html, 'DOI 10.1/identified', 'the DOI appears only for a DOI match');
    T.setCorpusQuery('');
});

// ============================================================
// Section E: evidence and quality helpers
// ============================================================

test('evidenceCount: null, missing map, mixed categories, unknown keys ignored', function() {
    assertEqual(T.evidenceCount(null), 0);
    assertEqual(T.evidenceCount({}), 0);
    assertEqual(T.evidenceCount({ evidence: {} }), 0);
    assertEqual(T.evidenceCount({ evidence: { Gender: [{}, {}], Prompting: [{}] } }), 3);
    assertEqual(T.evidenceCount({ evidence: { NotACategory: [{}, {}] } }), 0);
});
test('abstractQuality: empty, boilerplate, too short, acceptable', function() {
    assertEqual(T.abstractQuality({}).ok, false, 'missing abstract');
    assertContains(T.abstractQuality({}).note, 'Kein Abstract');
    var nber = T.abstractQuality({ abstract: 'Founded in 1920, the NBER is a private organization.' });
    assertEqual(nber.ok, false, 'NBER boilerplate');
    assertContains(nber.note, 'Boilerplate');
    var short_ = T.abstractQuality({ abstract: 'Too short to be a real abstract.' });
    assertEqual(short_.ok, false, 'short abstract');
    assertContains(short_.note, 'Sehr kurzes');
    var long_ = 'This study examines prompting practice in social work education and reports survey results. ';
    assertEqual(T.abstractQuality({ abstract: long_ + long_ }).ok, true, 'long abstract');
});
test('pinEvidence starts an empty paper category at level 1 and records provenance', function() {
    T.resetWork({ id: 'evPaper' });
    var longTerm = new Array(101 + 1).join('t');     // 101 chars
    var longSnip = new Array(300 + 1).join('s');     // 300 chars
    T.pinEvidence('Gender', longTerm, longSnip);
    var w = T.getWork();
    assertEqual(w.cats.Gender, 1, 'paper evidence starts at teilweise; ja requires an explicit judgement');
    assertEqual(w.evidence.Gender.length, 1);
    assertEqual(w.evidence.Gender[0].term.length, 80, 'term truncated');
    assertEqual(w.evidence.Gender[0].snippet.length, 260, 'snippet truncated');
    assertEqual(w.evidence.Gender[0].source_layer, 'paper');
    assertEqual(w.evidence.Gender[0].actor, 'human');
});
test('pinEvidence with empty term is a no-op', function() {
    T.resetWork({ id: 'evPaper2' });
    T.pinEvidence('Gender', '   ', 'snippet');
    var w = T.getWork();
    assertEqual(w.evidence.Gender, undefined);
    assert(!w.cats.Gender, 'category not set');
});
test('pinEvidence defaults the snippet to the term', function() {
    T.resetWork({ id: 'evPaper3' });
    T.pinEvidence('Fairness', 'fair treatment');
    var w = T.getWork();
    assertEqual(w.evidence.Fairness[0].snippet, 'fair treatment');
});
test('unpinEvidence removes one entry and deletes an emptied category list', function() {
    T.resetWork({ id: 'evPaper4' });
    T.pinEvidence('Gender', 'first');
    T.pinEvidence('Gender', 'second');
    T.unpinEvidence('Gender', 0);
    var w = T.getWork();
    assertEqual(w.evidence.Gender.length, 1);
    assertEqual(w.evidence.Gender[0].term, 'second');
    T.unpinEvidence('Gender', 0);
    assertEqual(T.getWork().evidence.Gender, undefined, 'emptied list deleted');
});

// ============================================================
// Section F: persistence payload, commit flow, generated disclosure
// ============================================================

test('reviewerPayload carries the current schema, reviewer key, decisions', function() {
    T.getState().reviewers.r2 = { x1: { decision: 'Include', categories: {} } };
    var pl = T.reviewerPayload('r2');
    assertEqual(pl.schema, 'femprompt-prisma-reviewer/0.4');
    assertEqual(pl.schema, T.REVIEWER_SCHEMA);
    assertEqual(pl.reviewer, 'r2');
    assertEqual(pl.actor, 'human');
    assertEqual(pl.decisions.x1.decision, 'Include');
    assert(typeof pl.updated === 'string' && pl.updated.length > 0, 'updated timestamp');
    delete T.getState().reviewers.r2;
});
test('reviewerPayload for an unknown reviewer has empty decisions', function() {
    var pl = T.reviewerPayload('nobody');
    assertEqual(Object.keys(pl.decisions).length, 0);
});
test('a loaded 0.5 agent envelope round-trips status, ratification, metadata, and decision lifecycle', function() {
    var source = {
        schema: 'femprompt-prisma-reviewer/0.5', reviewer: 'a04', actor: 'agent', status: 'ai-agent-reviewed',
        ratification: { status: 'ratified', activity_id: 'ratify-1' }, run_manifest: 'runs/a04.json',
        updated: '2026-08-23T10:00:00.000Z', decisions: {
            p04: {
                decision: 'Exclude', lifecycle: {
                    baseline: { state: 'agent-annotated', basis: 'agent_capture', at: '2026-08-22T10:00:00.000Z', actor_ids: ['agent-1'] },
                    state: 'ai-agent-reviewed', events: []
                }
            }
        }
    };
    var imported = T.importReviewerPayload(source, 'a04', true);
    assert(imported.ok, '0.5 import accepted');
    var envelope = T.reviewerEnvelope('a04');
    assertEqual(envelope.schema, 'femprompt-prisma-reviewer/0.5');
    assertEqual(envelope.actor, 'agent');
    assertEqual(envelope.status, 'ai-agent-reviewed');
    assertEqual(envelope.ratification.activity_id, 'ratify-1');
    var written = JSON.parse(T.reviewerFileText('a04'));
    assertEqual(written.schema, 'femprompt-prisma-reviewer/0.5');
    assertEqual(written.actor, 'agent');
    assertEqual(written.status, 'ai-agent-reviewed');
    assertEqual(written.ratification.status, 'ratified');
    assertEqual(written.run_manifest, 'runs/a04.json');
    assertEqual(written.decisions.p04.lifecycle.baseline.state, 'agent-annotated');
    assert(written.updated !== source.updated, 'only the updated field is refreshed');
    delete T.getState().reviewers.a04;
    T.setReviewerEnvelope('a04', null);
    T.setServedAgentEnvelope(null);
});
test('file/browser recovery merge keeps the newer record and every local-only record', function() {
    var merged = T.mergeReviewerDecisions(
        {
            diskNewer: { decision: 'Exclude', ts: '2026-08-22T12:00:00Z' },
            localNewer: { decision: 'Exclude', ts: '2026-08-22T10:00:00Z' },
            diskOnly: { decision: 'Exclude', ts: '2026-08-22T09:00:00Z' }
        },
        {
            diskNewer: { decision: 'Include', ts: '2026-08-22T11:00:00Z' },
            localNewer: { decision: 'Include', ts: '2026-08-22T13:00:00Z' },
            localOnly: { decision: 'Unclear', ts: '2026-08-22T08:00:00Z' }
        }
    );
    assertEqual(merged.decisions.diskNewer.decision, 'Exclude', 'newer disk record wins');
    assertEqual(merged.decisions.localNewer.decision, 'Include', 'newer browser record survives');
    assertEqual(merged.decisions.diskOnly.decision, 'Exclude', 'disk-only record survives');
    assertEqual(merged.decisions.localOnly.decision, 'Unclear', 'browser-only record survives');
    assert(merged.recovered, 'merge reports that a browser recovery must be written');
    assertEqual(merged.conflict, null);
});
test('file/browser recovery merge blocks an ambiguous same-paper conflict', function() {
    var merged = T.mergeReviewerDecisions(
        { p: { decision: 'Exclude' } },
        { p: { decision: 'Include' } }
    );
    assertContains(merged.conflict, 'Paper p');
    assertEqual(merged.decisions.p.decision, 'Include', 'browser recovery remains available while the file stays untouched');
});

test('file/browser recovery merge blocks different records with the same timestamp', function() {
    var ts = '2026-08-22T12:00:00.000Z';
    var merged = T.mergeReviewerDecisions(
        { p: { decision: 'Exclude', ts: ts } },
        { p: { decision: 'Include', ts: ts } }
    );
    assertContains(merged.conflict, 'identischem Zeitstempel');
    assertEqual(merged.decisions.p.decision, 'Include', 'equal-time browser recovery is retained');
});

var commitFix = [
    { id: 'c1', title: 'commit one' },
    { id: 'c2', title: 'commit two' },
    { id: 'c3', title: 'commit three' }
];

function addHumanEvidence(work, cats) {
    cats.forEach(function(cat) {
        work.evidence[cat] = [{ term: cat, snippet: 'human evidence for ' + cat, origin: 'human' }];
    });
}

test('commit: a human Include is written without analysis coding (ADR-045)', function() {
    T.setPapers(commitFix);
    T.getState().reviewers = {};            // clean slate for the commit tests
    T.getState().reviewer = 'r1';
    T.getState().index = 0;
    T.resetWork(commitFix[0]);
    T.getWork().cats.Prompting = true;
    T.getWork().cats.Gender = true;
    addHumanEvidence(T.getWork(), ['Prompting', 'Gender']);
    T.setTextSource('abstract');
    assertEqual(T.saveGate(commitFix[0]).reasons.join('|'), '', 'the save gate names no analysis coding');
    T.commit();
    var rec = T.curDec().c1;
    assert(rec, 'record exists');
    assert(!('analysis' in rec), 'a human Include carries no analysis part');
    assertEqual(rec.decision, 'Include');
    assertEqual(rec.reason, null, 'no reason on Include');
    assertEqual(rec.override, false);
    assertEqual(rec.reviewer, 'r1');
    assert(typeof rec.ts === 'string' && rec.ts.length > 0, 'timestamp');
});
test('commit: Exclude without a reason is refused, with a reason it is recorded', function() {
    T.setPapers(commitFix);
    T.getState().reviewer = 'r1';
    T.getState().index = 1;
    T.resetWork(commitFix[1]);
    T.getWork().cats.Prompting = true;      // tech only, derived Exclude
    addHumanEvidence(T.getWork(), ['Prompting']);
    T.commit();
    assertEqual(T.curDec().c2, undefined, 'refused without reason');
    T.getWork().reason = 'Not_relevant_topic';
    T.getState().index = 1;
    T.commit();
    var rec = T.curDec().c2;
    assert(rec, 'record exists after reason set');
    assertEqual(rec.decision, 'Exclude');
    assertEqual(rec.reason, 'Not_relevant_topic');
});
test('commit: override on a derived Include yields Exclude and requires a reason', function() {
    T.setPapers(commitFix);
    T.getState().reviewer = 'r1';
    T.getState().index = 2;
    T.resetWork(commitFix[2]);
    T.getWork().cats.Prompting = true;
    T.getWork().cats.Gender = true;
    addHumanEvidence(T.getWork(), ['Prompting', 'Gender']);
    T.getWork().override = true;
    T.commit();
    assertEqual(T.curDec().c3, undefined, 'override-Exclude refused without reason');
    T.getWork().reason = 'Duplicate';
    T.getState().index = 2;
    T.commit();
    var rec = T.curDec().c3;
    assert(rec, 'record exists');
    assertEqual(rec.decision, 'Exclude');
    assertEqual(rec.override, true);
    assertEqual(rec.reason, 'Duplicate');
});
test('commit: every selected category requires a paper-layer Beleg', function() {
    T.setPapers([{ id: 'c-evidence', title: 'evidence gate' }]);
    T.getState().reviewer = 'r1'; T.getState().reviewers.r1 = {}; T.getState().index = 0;
    T.resetWork({ id: 'c-evidence' });
    T.getWork().cats.Prompting = 2; T.getWork().cats.Gender = 2;
    T.getWork().evidence.Prompting = [{ term: 'p', snippet: 'p', origin: 'ai' }];
    T.getWork().evidence.Gender = [{ term: 'g', snippet: 'g', origin: 'human' }];
    assertEqual(T.paperEvidenceMissing(T.getWork().cats, T.getWork().evidence).join('|'), 'Prompting');
    T.commit();
    assertEqual(T.curDec()['c-evidence'], undefined, 'LLM-distillate evidence cannot satisfy the paper evidence gate');
    T.getWork().evidence.Prompting.push({ term: 'p2', snippet: 'p2', origin: 'human' });
    T.setTextSource('abstract');
    T.getWork().analysis = completeAnalysis('abstract');
    T.commit();
    assert(T.curDec()['c-evidence'], 'record is stored after every selected category has paper evidence');
});
test('exclusion reason vocabulary is the controlled set with the expert confirmation reason (ADR-042)', function() {
    assertEqual(T.EXCLUSION_REASONS.join('|'),
        'Duplicate|Not_relevant_topic|Wrong_publication_type|No_full_text|Language|Consolidated_expert_exclusion');
    assertEqual(T.EXPERT_EXCLUSION_REASON, 'Consolidated_expert_exclusion');
});
test('disclosureMarkdown covers the screening count and references external M9/R2 evaluation (ADR-017)', function() {
    T.setPapers([
        { id: 'd1', llm: { decision: 'Include' } },
        { id: 'd2', llm: { decision: 'Exclude' } },
        { id: 'd3', human: { decision: 'Include' } }
    ]);
    var md = T.disclosureMarkdown();
    assertContains(md, 'Screening of 2 records'); // only the two AI-proposal records
    assertContains(md, 'M9/R2');
    assert(md.indexOf('Cohen kappa') === -1, 'no in-tool kappa remains in the disclosure');
    assert(md.indexOf('100/34/108/49') === -1, 'no in-tool confusion matrix remains in the disclosure');
});

// ============================================================
// KI2: per-Beleg provenance (origin), neutral, no valuation
// ============================================================

test('pinEvidence separates paper source from the acting reviewer', function() {
    T.resetWork({ id: 'provPaper' });
    T.pinEvidence('Gender', 'gendered language', 'a snippet about gendered language');
    assertEqual(T.getWork().evidence.Gender[0].origin, 'human');
    assertEqual(T.getWork().evidence.Gender[0].source_layer, 'paper');
    assertEqual(T.getWork().evidence.Gender[0].actor, 'human');
});
test('evidenceListHtml marks only deviating evidence sources (LLM layer, agent actor)', function() {
    var ev = {
        Gender: [{ term: 'h', snippet: 'human snippet', origin: 'human' }],
        Prompting: [{ term: 'a', snippet: 'ai snippet', origin: 'ai' }],
        Fairness: [{ term: 'g', snippet: 'agent snippet', source_layer: 'paper', actor: 'agent' }]
    };
    var html = T.evidenceListHtml(ev, true);
    assertContains(html, '<span class="pt-evid-origin">LLM</span>');
    assertContains(html, '<span class="pt-evid-origin">Agent</span>');
    assertEqual((html.match(/pt-evid-origin/g) || []).length, 2, 'an ordinary Paper pin carries no origin mark');
    assertContains(html, 'human snippet');
    assertContains(html, 'ai snippet');
});
test('evidenceListHtml defaults a legacy Beleg without provenance to the paper layer', function() {
    var html = T.evidenceListHtml({ Fairness: [{ term: 'x', snippet: 'legacy snippet' }] }, true);
    assertContains(html, 'legacy snippet');
    assertNotContains(html, '>LLM<');
});
// ============================================================
// M3: reading-column layer split and binding separation (ADR-016)
// ============================================================

var M3_DOC = [
    '---', 'title: Sample', 'type: literature', '---',
    '# Sample Paper Title',
    '## Abstract', 'This is the verbatim abstract of the paper.',
    '## Key Concepts', 'concept one, concept two.',
    '## Full Text', 'The real paper body discusses prompting and gender in detail.',
    '# Sample Paper Title',
    '## Kernbefund', 'Machine summary of the central finding.',
    '## Forschungsfrage', 'The reconstructed research question.',
    '## Kategorie-Evidenz', '### Evidenz 1', '> An AI-extracted quote mapped to a category.'
].join('\n');

test('splitDocLayers keeps the paper layer (Full Text) and drops the AI block', function() {
    var L = T.splitDocLayers(M3_DOC);
    assertContains(L.paper, 'Full Text');
    assertContains(L.paper, 'verbatim abstract');
    assertNotContains(L.paper, 'Kernbefund');
    assertNotContains(L.paper, 'Kategorie-Evidenz');
});
test('splitDocLayers isolates the AI layer (Kernbefund and Kategorie-Evidenz)', function() {
    var L = T.splitDocLayers(M3_DOC);
    assertContains(L.ai, 'Kernbefund');
    assertContains(L.ai, 'Kategorie-Evidenz');
    assertNotContains(L.ai, '## Abstract');
});
test('splitDocLayers returns no AI layer when the doc has no Kernbefund (abstract-only)', function() {
    var L = T.splitDocLayers('# Title\n## Abstract\nonly an abstract, no knowledge extraction.');
    assertEqual(L.ai, '');
    assertContains(L.paper, 'only an abstract');
});
test('splitDocLayers treats a source-bound preparation note including frontmatter as AI-only', function() {
    var note = [
        '---',
        'type: distillate',
        'reference: RH8MC67Z',
        'status: preparation',
        'prepared-by:',
        '  artifact-review-status: unreviewed',
        '---',
        '# Distillate: GPT-5 sociodemographic bias and adversarial hallucinations',
        '## Core statements',
        'A snapshot experiment tested identical clinical vignettes.',
        '## Method and scope',
        'The source supports this bounded finding for its reported design.',
        '## Review boundary',
        'This preparation is source-bound and unreviewed.'
    ].join('\n');
    var L = T.splitDocLayers(note);
    assertEqual(L.paper, '', 'preparation metadata is never presented as original paper text');
    assertContains(L.ai, 'status: preparation');
    assertContains(L.ai, 'Core statements');
    assertContains(L.ai, 'Method and scope');
    assertContains(L.ai, 'source-bound and unreviewed');
});
test('a paper Beleg starts at teilweise, an LLM-distillate Beleg leaves the category unset', function() {
    var tc = T.TECH_CATS[0], sc = T.SOCIAL_CATS[0];
    T.resetWork({ id: 'm3Paper' });
    T.pinEvidence(tc, 'tech term', 'tech snippet', 'human');
    assertEqual(T.getWork().cats[tc], 1, 'paper evidence starts the category at teilweise');
    T.pinEvidence(sc, 'soc term', 'soc snippet', 'ai');
    assert(!T.getWork().cats[sc], 'AI-sourced Beleg leaves the binding category unset');
});
test('LLM-distillate evidence never upgrades the binding decision', function() {
    var tc = T.TECH_CATS[0], sc = T.SOCIAL_CATS[0];
    T.resetWork({ id: 'm3Paper2' });
    T.pinEvidence(tc, 'tech term', 'tech snippet', 'human');
    T.pinEvidence(sc, 'soc term', 'soc snippet', 'ai');
    assertEqual(T.finalDecisionOf(T.getWork().cats, false), 'Exclude', 'paper tech + LLM social stays Exclude');
    T.pinEvidence(sc, 'soc term 2', 'soc snippet 2', 'human');
    assertEqual(T.finalDecisionOf(T.getWork().cats, false), 'Unclear', 'two paper pins remain partly coded');
    T.getWork().cats[tc] = 2;
    T.getWork().cats[sc] = 2;
    assertEqual(T.finalDecisionOf(T.getWork().cats, false), 'Include', 'Include requires explicit centrality in both dimensions');
});
test('an LLM-distillate Beleg is stored, labelled, and stays advisory', function() {
    var sc = T.SOCIAL_CATS[0];
    T.resetWork({ id: 'm3Paper3' });
    T.pinEvidence(sc, 'ai soc', 'ai social snippet', 'ai');
    var w = T.getWork();
    assertEqual(w.evidence[sc][0].origin, 'ai');
    assert(!w.cats[sc], 'AI Beleg does not set the category');
    assertContains(T.evidenceListHtml(w.evidence, false), '<span class="pt-evid-origin">LLM</span>');
});

// ============================================================
// P3 import bridge: the data-hygiene validation report (R1 lesson)
// ============================================================

var IMP = window.__PRISMA_IMPORT_TEST__;
var IMP_HEADER = 'Zotero_Key,AI_Literacies,Generative_KI,Prompting,KI_Sonstige,' +
    'Soziale_Arbeit,Bias_Ungleichheit,Gender,Diversitaet,Feministisch,Fairness,Decision,Exclusion_Reason';

function runImport(body, existing, overwrite) {
    var rows = IMP.parseCsv(IMP_HEADER + '\n' + body);
    var header = IMP.mapHeader(rows[0]);
    assertEqual(header.missing.length, 0, 'fixture header maps all required columns');
    return IMP.convert(rows.slice(1), header, 'R1', existing || {}, !!overwrite, 'fixture.csv');
}
function reportKinds(res) { return res.report.map(function(it) { return it.kind; }).join('|'); }

test('import: a clean Include row is added with no error-level findings', function() {
    var res = runImport('P1,Nein,Ja,Nein,Nein,Ja,Nein,Nein,Nein,Nein,Nein,Include,');
    assertEqual(res.stats.added, 1);
    assert(res.payload.decisions.P1, 'P1 recorded');
    assertEqual(res.payload.decisions.P1.decision, 'Include');
    assertEqual(res.report.filter(function(it) { return it.level === 'error'; }).length, 0, 'no error-level findings');
});
test('import: an out-of-vocabulary exclusion reason fails closed', function() {
    var res = runImport('P2,Nein,Ja,Nein,Nein,Nein,Nein,Nein,Nein,Nein,Nein,Exclude,Other');
    assertContains(reportKinds(res), 'Ausschlussgrund ausserhalb des Vokabulars');
    assertEqual(res.payload.decisions.P2, undefined, 'invalid row is not imported');
    assertEqual(res.stats.skipped, 1);
});
test('import: an empty exclusion reason on Exclude is flagged', function() {
    var res = runImport('P3,Nein,Ja,Nein,Nein,Nein,Nein,Nein,Nein,Nein,Nein,Exclude,');
    assertContains(reportKinds(res), 'leerer Ausschlussgrund');
});
test('import: a duplicate Zotero key is reported and the second row skipped', function() {
    var res = runImport(
        'P4,Nein,Ja,Nein,Nein,Ja,Nein,Nein,Nein,Nein,Nein,Include,\n' +
        'P4,Nein,Ja,Nein,Nein,Ja,Nein,Nein,Nein,Nein,Nein,Include,');
    assertContains(reportKinds(res), 'doppelte Paper-ID');
    assertEqual(res.stats.added, 1, 'only the first P4 added');
    assert(res.stats.skipped >= 1, 'the duplicate row is skipped');
});
test('import: an Unclear decision is preserved in the historical offline schema', function() {
    var res = runImport('P5,Nein,Teilweise,Nein,Nein,Teilweise,Nein,Nein,Nein,Nein,Nein,Unclear,');
    assertEqual(res.payload.schema, 'femprompt-prisma-reviewer/0.3');
    assertEqual(res.payload.decisions.P5.decision, 'Unclear');
    assertEqual(res.stats.added, 1, 'Unclear row recorded');
});
test('import: a loaded corpus binds historical rows to the exact Work and Version', function() {
    var getAllPapers = window.EC.getAllPapers;
    window.EC.getAllPapers = function() {
        return [{
            id: 'PV1', work_id: 'work:pv1', version_id: 'version:pv1',
            version_type: 'accepted_manuscript', preferred_version_id: 'version:pv1',
            is_preferred_version: true
        }];
    };
    try {
        var res = runImport('PV1,Nein,Ja,Nein,Nein,Ja,Nein,Nein,Nein,Nein,Nein,Include,');
        assertEqual(res.payload.schema, 'femprompt-prisma-reviewer/0.4');
        assertEqual(res.payload.decisions.PV1.work_id, 'work:pv1');
        assertEqual(res.payload.decisions.PV1.version_id, 'version:pv1');
        assertEqual(res.payload.decisions.PV1.version_type, 'accepted_manuscript');
        assertEqual(res.payload.decisions.PV1.selected_version_is_preferred, true);
    } finally {
        window.EC.getAllPapers = getAllPapers;
    }
});
test('import: the conversion never changes the caller records and binds all or none', function() {
    var existing = { KEEP1: { decision: 'Exclude', reason: 'Duplicate', categories: {} } };
    var snapshot = JSON.stringify(existing);
    var res = runImport('P1,Nein,Ja,Nein,Nein,Ja,Nein,Nein,Nein,Nein,Nein,Include,', existing, false);
    assertEqual(JSON.stringify(existing), snapshot, 'the existing records are untouched');
    assert(res.payload.decisions.KEEP1 !== existing.KEEP1, 'the payload holds copies');
    var bound = Object.keys(res.payload.decisions).filter(function(id) { return !!res.payload.decisions[id].work_id; });
    assert(bound.length === 0 || bound.length === Object.keys(res.payload.decisions).length, 'no partly bound payload');
});
test('import: re-importing the same row is idempotent (unchanged, not re-added)', function() {
    var first = runImport('P6,Nein,Ja,Nein,Nein,Ja,Nein,Nein,Nein,Nein,Nein,Include,');
    var second = runImport('P6,Nein,Ja,Nein,Nein,Ja,Nein,Nein,Nein,Nein,Nein,Include,', first.payload.decisions);
    assertEqual(second.stats.added, 0, 'no new record on re-import');
    assertEqual(second.stats.unchanged, 1, 'the existing record is kept unchanged');
});

// ============================================================
// Section G: P1 acceptance checks (round-trip, schema migration, seed benchmark)
// ============================================================

test('FR-08: a reviewer export survives a JSON round-trip and reloads losslessly', function() {
    T.setPapers([{ id: 'rt1' }, { id: 'rt2' }]);
    var S = T.getState();
    S.reviewers.rtSrc = {
        rt1: { decision: 'Include', reason: null, override: false,
               categories: { Prompting: true, Gender: true },
               evidence: { Prompting: [{ term: 'prompt', snippet: 'a prompt snippet', origin: 'human' }],
                           Gender: [{ term: 'gender', snippet: 'machine note', origin: 'ai' }] },
               reviewer: 'rtSrc', ts: '2026-06-29T00:00:00.000Z' },
        rt2: { decision: 'Exclude', reason: 'Duplicate', override: false,
               categories: {}, evidence: {}, reviewer: 'rtSrc', ts: '2026-06-29T00:00:00.000Z' }
    };
    var flowSrc = T.computeFlow('rtSrc');
    var payload = T.reviewerPayload('rtSrc');
    assertEqual(payload.schema, T.REVIEWER_SCHEMA, 'export carries the current schema');
    // the on-disk export/import form: serialize to JSON and parse back
    var file = JSON.parse(JSON.stringify(payload));
    // reload into a fresh slot via the documented load path (assign decisions)
    S.reviewers.rtDst = file.decisions;
    assertEqual(JSON.stringify(T.computeFlow('rtDst')), JSON.stringify(flowSrc),
        'flow aggregation identical after the round-trip');
    var ev = S.reviewers.rtDst.rt1.evidence;
    assertEqual(ev.Prompting[0].origin, 'human', 'human origin preserved');
    assertEqual(ev.Gender[0].origin, 'ai', 'ai origin preserved');
    assertEqual(ev.Prompting[0].snippet, 'a prompt snippet', 'snippet text preserved');
    assertEqual(S.reviewers.rtDst.rt2.reason, 'Duplicate', 'exclusion reason preserved');
    assertEqual(JSON.stringify(file.decisions), JSON.stringify(S.reviewers.rtSrc),
        'decisions are byte-for-byte identical after the round-trip');
    delete S.reviewers.rtSrc; delete S.reviewers.rtDst;
});

test('reviewer schema 0.1 to current: a pre-evidence file loads and is written back as 0.4', function() {
    T.setPapers([{ id: 'mg1' }, { id: 'mg2' }]);
    var S = T.getState();
    // a 0.1 reviewer file: decisions without an evidence map; a legacy Beleg without origin
    var v01 = {
        schema: 'femprompt-prisma-reviewer/0.1', reviewer: 'old',
        decisions: {
            mg1: { decision: 'Include', categories: { Prompting: true, Gender: true } },
            mg2: { decision: 'Exclude', reason: 'Duplicate', categories: {},
                   evidence: { Gender: [{ term: 'g', snippet: 'legacy beleg, no origin' }] } }
        }
    };
    var file = JSON.parse(JSON.stringify(v01));
    S.reviewers.old = file.decisions;                              // load path
    assertEqual(T.humanDecision({ id: 'mg1' }, 'old').decision, 'Include', '0.1 decision loads');
    assertEqual(T.computeFlow('old').humanScreened, 1, 'legacy Include remains loaded but incomplete until evidence is added');
    assertEqual(T.evidenceCount(file.decisions.mg1), 0, 'missing evidence map reads as zero, no throw');
    // a legacy Beleg without origin renders as a human pin (ADR-015 backward compatibility)
    var html = T.evidenceListHtml(file.decisions.mg2.evidence, true);
    assertContains(html, 'legacy beleg, no origin');
    assertNotContains(html, '>LLM<');
    // re-exporting stamps the current schema, completing the upgrade to 0.3
    assertEqual(T.reviewerPayload('old').schema, 'femprompt-prisma-reviewer/0.4');
    delete S.reviewers.old;
});

// FR-05: the real served seed reproduces the benchmark marginals. The headless runner
// injects docs/data/research_vault_v2.json as window.__SEED_PAPERS__ (the app fetches it
// at runtime; headless has no network). kappa and the matrix are not asserted here.
if (window.__SEED_PAPERS__ && window.__SEED_PAPERS__.length) {
    test('FR-05: the real seed reproduces the canonical benchmark marginals', function() {
        T.setPapers(window.__SEED_PAPERS__);
        var f = T.computeFlow(T.SEED);
        assertEqual(f.total, window.__SEED_PAPERS__.length, 'current corpus size');
        assertEqual(f.aiScreened, 326, 'AI track covers all identified records');
        assertEqual(f.aiIncl, 232, 'AI Include');
        assertEqual(f.aiExcl, 94, 'AI Exclude');
        var benchmarkPapers = window.__SEED_PAPERS__.filter(function(p) {
            return p.llm && p.llm.assessment_status !== 'unassessed';
        });
        T.setPapers(benchmarkPapers);
        f = T.computeFlow(T.SEED);
        assertEqual(f.total, 326, 'benchmark corpus size');
        assertEqual(f.humanScreened, 291, 'human track on the paired subset');
        assertEqual(f.humanIncl, 134, 'human Include within the paired subset');
        assertEqual(f.humanExcl, 157, 'human Exclude within the paired subset');
        T.setPapers([]);
    });
}

// ============================================================
// Section H: deterministic reviewer files and explicit reviewer separation
// ============================================================

test('sortedDecisions orders decision keys for a stable diff', function() {
    const d = { c: { decision: 'Include' }, a: { decision: 'Exclude' }, b: { decision: 'Include' } };
    assertEqual(Object.keys(T.sortedDecisions(d)).join(','), 'a,b,c');
    assertEqual(Object.keys(T.sortedDecisions(null)).length, 0, 'null is safe');
});
test('reviewerFileText sorts decisions by paper id and is body-stable', function() {
    T.getState().reviewers.rDet = { z9: { decision: 'Include', categories: {} }, a1: { decision: 'Exclude', categories: {} } };
    const txt = T.reviewerFileText('rDet');
    assert(txt.indexOf('"a1"') < txt.indexOf('"z9"'), 'a1 block precedes z9 block');
    assertContains(txt, '"schema": "' + T.REVIEWER_SCHEMA + '"');
    const strip = function(s) { return s.replace(/"updated": "[^"]*",/, ''); };
    assertEqual(strip(txt), strip(T.reviewerFileText('rDet')), 'same state serializes identically (modulo timestamp)');
    delete T.getState().reviewers.rDet;
});
test('reviewer key accepts a safe short code and fixes the target path', function() {
    var S = T.getState();
    S.reviewer = null;
    assertEqual(T.selectReviewer('../alice'), false, 'unsafe path-like key refused');
    assertEqual(S.reviewer, null);
    assert(T.selectReviewer('cp'), 'short code accepted');
    assertEqual(S.reviewer, 'cp');
    assertEqual(T.reviewerPath(S.reviewer), 'docs/data/screening/cp.json');
});
test('reviewer keys are case-folded so Windows cannot address one file as two tracks', function() {
    var S = T.getState();
    S.reviewers = {};
    assert(T.selectReviewer('CP'), 'uppercase input accepted');
    assertEqual(S.reviewer, 'cp', 'stored key is canonical lowercase');
    assertEqual(T.reviewerPath(S.reviewer), 'docs/data/screening/cp.json');
    assert(T.selectReviewer('cp'), 'lowercase input accepted');
    assertEqual(Object.keys(S.reviewers).join(','), 'cp', 'only one reviewer track exists');
});

test('commit is refused until a reviewer role has been explicitly selected', function() {
    T.setPapers([{ id: 'needs-reviewer', title: 'X' }]);
    var S = T.getState();
    S.reviewer = null; S.index = 0;
    T.resetWork({ id: 'needs-reviewer' });
    T.getWork().cats = { Prompting: 2, Gender: 2 };
    T.commit();
    assertEqual(S.reviewers.null, undefined, 'no accidental null reviewer track');
    assertEqual(T.saveStatus().kind, 'needs-reviewer');
});

test('commit is refused until the local screening folder is connected', function() {
    T.setPapers([{ id: 'needs-folder', title: 'X' }]);
    var S = T.getState();
    S.reviewer = 'cp'; S.index = 0; S.reviewers.cp = {};
    T.resetWork({ id: 'needs-folder' });
    T.setScreeningHandle(null);
    T.commit();
    assertEqual(S.reviewers.cp['needs-folder'], undefined, 'no browser-only decision is created');
    assertEqual(T.saveStatus().kind, 'local');
    T.setScreeningHandle(TEST_SCREENING_HANDLE);
});

test('payload import targets the selected key and cannot overwrite another reviewer', function() {
    var S = T.getState();
    S.reviewers = {
        cp: { own: { decision: 'Include', reviewer: 'cp' } },
        ms: { old: { decision: 'Exclude', reviewer: 'ms' } }
    };
    T.selectReviewer('ms');
    var mislabeled = { schema: 'femprompt-prisma-reviewer/0.3', reviewer: 'cp', decisions: {
        imported: { decision: 'Unclear', categories: {}, reviewer: 'cp' }
    } };
    var blocked = T.importReviewerPayload(mislabeled, 'ms', false);
    assertEqual(blocked.reason, 'occupied', 'replacement needs an explicit confirmation');
    var done = T.importReviewerPayload(mislabeled, 'ms', true);
    assert(done.ok, 'confirmed import succeeds');
    assert(S.reviewers.cp.own, 'cp remains untouched');
    assertEqual(S.reviewers.ms.imported.reviewer, 'ms', 'record normalized to selected key');
    assertEqual(S.reviewers.ms.imported.decision, 'Unclear', 'Unclear survives payload import');
});

test('backup validation requires schema 0.1-0.3, known paper ids and valid decisions', function() {
    T.setPapers([{ id: 'known' }]);
    assert(!T.validateReviewerPayload({ decisions: {} }).ok, 'missing schema refused');
    assert(!T.validateReviewerPayload({ schema: 'other/1', decisions: {} }).ok, 'foreign schema refused');
    assert(!T.validateReviewerPayload({ schema: 'femprompt-prisma-reviewer/0.3', decisions: { unknown: { decision: 'Include' } } }).ok,
        'unknown paper id refused');
    assert(!T.validateReviewerPayload({ schema: 'femprompt-prisma-reviewer/0.3', decisions: { known: { decision: 'Maybe' } } }).ok,
        'unknown decision refused');
    assert(T.validateReviewerPayload({ schema: 'femprompt-prisma-reviewer/0.2', decisions: { known: { decision: 'Unclear' } } }).ok,
        'backward-compatible schema and Unclear accepted');
});

// ============================================================
// Section I: accessibility (Cut 3) and screenable entry (O4)
// ============================================================

test('the category toggle is the shared chip with a pressed state, a colour and its definition (ADR-042)', function() {
    var ja = T.chipHtml('AI_Literacies', true, false);
    assertContains(ja, 'class="category-chip"');
    assertContains(ja, 'aria-pressed="true"');
    assertContains(ja, 'data-level="ja"');
    assertContains(ja, '--chip-color:#5b8c5a');
    var nein = T.chipHtml('AI_Literacies', false, false);
    assertContains(nein, 'aria-pressed="false"');
    assertContains(nein, 'data-level="nein"');
    var teil = T.chipHtml('AI_Literacies', 1, false);
    assertContains(teil, 'aria-pressed="mixed"');
    assertContains(teil, 'data-level="teilweise"');
    assertContains(teil, '<span class="pt-sr-only">, teilweise</span>', 'teilweise is spoken, not only coloured');
    assertContains(nein, 'title="', 'the definition is the accessible description');
    assertContains(nein, '>AI Literacies</span>', 'the label stays visible text');
    assertNotContains(nein, 'pt-info-btn', 'no separate definition button');
    assertContains(T.chipHtml('AI_Literacies', 2, true), ' disabled', 'read-only chips are disabled');
    var basis = T.categoryChipHtml('Gender', 2, { expertBasis: true });
    assertContains(basis, 'Expert:innen-Urteil, ohne Textbeleg.');
});

test('statusLabel maps the list state to a text equivalent', function() {
    assertEqual(T.statusLabel('erfasst'), 'erfasst');
    assertEqual(T.statusLabel('expert'), 'erfasst, Expert:innen-Entscheidung');
    assertEqual(T.statusLabel('agent'), 'offen', 'an agent record is no list state of its own (ADR-044)');
    assertEqual(T.statusLabel('none'), 'offen');
});

test('corpusListHtml hides the state mark from AT and gives the state a text equivalent', function() {
    T.setPapers([{ id: 'pCL', title: 'X', author_year: 'A 2020' }]);
    var prevRev = T.getState().reviewer;
    T.getState().reviewer = 'rCL'; T.getState().reviewers.rCL = {};
    var html = T.corpusListHtml();
    assertContains(html, 'pt-nav-mark pt-mark-none" aria-hidden="true"');
    assertContains(html, '<span class="pt-sr-only">, offen</span>');
    assertNotContains(html, '>offen<', 'open is not printed visibly on each entry');
    delete T.getState().reviewers.rCL;
    T.getState().reviewer = prevRev;
});

test('firstEntryIndex ignores the LLM reference layer and opens on a usable Paper layer (O4)', function() {
    T.setPapers([
        { id: 'b1', abstract: 'Founded in 1920, the NBER is a private, non-profit, non-partisan organization.' },
        { id: 'g1', knowledge_doc: 'data/x.md', abstract: 'This original metadata abstract provides enough substantive paper text for an evidence-grounded screening decision and an independent methodological assessment.' }
    ]);
    assert(!T.isScreenable({ id: 'b1', abstract: 'Founded in 1920, the NBER is a private, non-profit, non-partisan organization.' }), 'NBER boilerplate is not screenable');
    assert(!T.isScreenable({ id: 'ai-only', knowledge_doc: 'data/x.md', abstract: '' }), 'an LLM distillate alone is not a Paper layer');
    assert(T.isScreenable({ id: 'g1', abstract: 'This original metadata abstract provides enough substantive paper text for an evidence-grounded screening decision and an independent methodological assessment.' }), 'a substantive abstract is screenable');
    var prevRev = T.getState().reviewer;
    T.getState().reviewer = 'rFE'; T.getState().reviewers.rFE = {};
    assertEqual(T.firstEntryIndex(), 1, 'lands on the screenable paper, not the boilerplate');
    T.getState().reviewers.rFE = { g1: { decision: 'Include' } };
    assertEqual(T.firstEntryIndex(), 1, 'falls back to the only screenable paper when it is already decided');
    delete T.getState().reviewers.rFE;
    T.getState().reviewer = prevRev;
});

test('paper query selects a known paper and falls back normally for an unknown id', function() {
    T.setPapers([
        { id: 'boilerplate', abstract: 'Founded in 1920, the NBER is a private, non-profit, non-partisan organization.' },
        { id: 'direct-paper', knowledge_doc: 'data/direct.md', abstract: '' }
    ]);
    var prevRev = T.getState().reviewer;
    T.getState().reviewer = 'rDirect'; T.getState().reviewers.rDirect = {};
    assertEqual(T.startIndexForPaper('direct-paper'), 1, 'known paper id selects its exact index');
    assertEqual(T.startIndexForPaper('missing-paper'), T.firstEntryIndex(), 'unknown paper id uses the normal fallback');
    assertEqual(T.startIndexForPaper(null), T.firstEntryIndex(), 'missing paper query uses the normal fallback');
    delete T.getState().reviewers.rDirect;
    T.getState().reviewer = prevRev;
});

test('an own saved record seeds the draft and survives until a changed draft is saved', function() {
    T.setPapers([{ id: 'pED', title: 'X', knowledge_doc: 'd.md' }]);
    var prevRev = T.getState().reviewer;
    T.getState().reviewer = 'rED'; T.getState().reviewers.rED = {}; T.getState().index = 0;
    T.curDec().pED = {
        categories: { AI_Literacies: true, Soziale_Arbeit: true }, decision: 'Include',
        override: false, reason: null, evidence: { AI_Literacies: [{ term: 't', snippet: 's', origin: 'human' }] }
    };
    var w = T.draftFor({ id: 'pED' });
    assertEqual(w.pid, 'pED', 'draft is bound to the paper');
    assertEqual(w.seed, 'own');
    assert(w.cats.AI_Literacies === 2 && w.cats.Soziale_Arbeit === 2, 'categories are rehydrated as levels');
    assertEqual((w.evidence.AI_Literacies || []).length, 1, 'evidence is rehydrated');
    assertEqual(w.dirty, false, 'an untouched draft is not a change');
    assert(!!T.curDec().pED, 'the saved record stays until a save');
    delete T.getState().reviewers.rED;
    T.getState().reviewer = prevRev;
});

test('commit records the trimmed override justification on an override to Include (O2)', function() {
    T.setPapers([{ id: 'pO2', title: 'X', knowledge_doc: 'd.md' }]);
    var prevRev = T.getState().reviewer;
    T.getState().reviewer = 'rO2'; T.getState().reviewers.rO2 = {}; T.getState().index = 0;
    T.resetWork({ id: 'pO2' });
    var w = T.getWork();
    w.cats = { AI_Literacies: true }; w.override = true; w.overrideReason = '  relevant trotz duennem Text  ';
    addHumanEvidence(w, ['AI_Literacies']);
    T.setTextSource('abstract');
    w.analysis = completeAnalysis('abstract');
    T.commit();
    var rec = T.getState().reviewers.rO2.pO2;
    assert(!!rec, 'a decision was committed');
    assertEqual(rec.decision, 'Include', 'override produced Include');
    assertEqual(rec.override, true);
    assertEqual(rec.override_reason, 'relevant trotz duennem Text', 'justification stored, trimmed');
    delete T.getState().reviewers.rO2;
    T.getState().reviewer = prevRev;
});

test('commit is blocked on an override to Include without a justification (O2 gate)', function() {
    T.setPapers([{ id: 'pO2b', title: 'X' }]);
    var prevRev = T.getState().reviewer;
    T.getState().reviewer = 'rO2b'; T.getState().reviewers.rO2b = {}; T.getState().index = 0;
    T.resetWork({ id: 'pO2b' });
    var w = T.getWork();
    w.cats = { AI_Literacies: true }; w.override = true; w.overrideReason = '';
    addHumanEvidence(w, ['AI_Literacies']);
    T.commit();
    assert(!T.getState().reviewers.rO2b.pO2b, 'no decision committed without a justification');
    delete T.getState().reviewers.rO2b;
    T.getState().reviewer = prevRev;
});

// ============================================================
// Section J: reading-pane click chain (DOM integration, ADR-024)
// The truth-table tests above prove the derivation in isolation; these prove the
// wiring the render templates alone cannot: a real click on a chip cycles
// work.cats, re-derives, voids a now-stale override, and re-renders the decision
// pill. jsdom hosts the assess column the reading surface renders into.
// ============================================================

function mountAssessCol() {
    var host = document.getElementById('pt-assess-col');
    if (!host) { host = document.createElement('aside'); host.id = 'pt-assess-col'; document.body.appendChild(host); }
    host.innerHTML = '';
    return host;
}

// ADR-044: human reviewers work without any AI pre-assessment. The LLM proposal, its
// colours, its reasoning and its takeover appear nowhere in a human session.
function assertNoLlmMarkup(html, where) {
    ['LLM-Vorschlag', 'pt-ref-llm', 'pt-llm-mark', 'pt-adopt-proposal', 'Vorschlag übernehmen', 'pt-ref-reason', 'Model rationale'].forEach(function(needle) {
        assertNotContains(html, needle, where + ': no ' + needle);
    });
}

test('an open assessment in Bearbeiten shows no LLM proposal, reasoning or takeover (ADR-044)', function() {
    mountAssessCol();
    var p = { id: 'pBlind', title: 'X',
        llm: { decision: 'Include', all_categories: { Feministisch: 1, Prompting: 1 }, reasoning: 'Model rationale. Second sentence.' } };
    T.setPapers([p]);
    T.getState().reviewer = 'rBlind'; T.getState().reviewers.rBlind = {}; T.getState().index = 0;
    T.resetWork(p); T.refreshAssess();
    var html = document.getElementById('pt-assess-col').innerHTML;
    assertNoLlmMarkup(html, 'open assessment');
    assert(!document.querySelector('#pt-assess-col #pt-references'), 'no reference block without an expert decision');
    assert(!document.querySelector('#pt-assess-col .pt-dim .category-chip[aria-pressed="true"], #pt-assess-col .pt-dim .category-chip[aria-pressed="mixed"]'),
        'no category is pre-set from the LLM proposal');
    assertEqual(document.getElementById('pt-provenance').textContent, 'Noch keine Bewertung');
    assertContains(html, 'pt-action-dock');
});

test('Lesen and a saved record show the expert reference but no LLM proposal (ADR-044)', function() {
    mountAssessCol();
    var p = { id: 'pCompare', title: 'X', human: { decision: 'Include', all_categories: { Prompting: 1, Gender: 1 } },
        llm: { decision: 'Exclude', all_categories: { Fairness: 1 }, reasoning: 'Model rationale.' } };
    T.setPapers([p]); T.getState().reviewer = 'rCompare'; T.getState().reviewers.rCompare = {}; T.getState().index = 0;
    T.setEditMode(false);
    T.refreshAssess();
    assertNoLlmMarkup(document.getElementById('pt-assess-col').innerHTML, 'Lesen over an expert prefill');
    assertContains(document.getElementById('pt-provenance').textContent, 'Expert:innen-Entscheidung');
    T.getState().reviewers.rCompare.pCompare = { decision: 'Exclude', categories: {}, evidence: {}, reason: 'Duplicate' };
    T.refreshAssess();
    var refs = document.querySelector('#pt-assess-col #pt-references');
    assert(refs, 'the expert decision stays a reference beside an own record');
    assertContains(refs.innerHTML, 'Expert:innen-Entscheidung');
    assertNoLlmMarkup(document.getElementById('pt-assess-col').innerHTML, 'saved record');
    assertContains(document.getElementById('pt-provenance').textContent, 'Deine Bewertung');
    T.setEditMode(true);
    T.refreshAssess();
    assertNoLlmMarkup(document.getElementById('pt-assess-col').innerHTML, 'saved record in Bearbeiten');
    assertEqual(T.referenceProposalsHtml({ id: 'pLlmOnly', llm: { decision: 'Include', all_categories: { Gender: 1 } } }, { kind: 'empty', record: null }), '',
        'a paper with only an LLM assessment has no reference at all');
    delete T.getState().reviewers.rCompare;
});

test('a toggle click switches a category on and off and re-renders the decision (ADR-042)', function() {
    mountAssessCol();
    var tech = T.TECH_CATS[0], soc = T.SOCIAL_CATS[0];
    T.setPapers([{ id: 'pJ1', title: 'X' }]);
    var prevRev = T.getState().reviewer;
    T.getState().reviewer = 'rJ'; T.getState().reviewers.rJ = {}; T.getState().index = 0;
    T.resetWork({ id: 'pJ1' });
    T.refreshAssess();

    function chip(cat) { return document.querySelector('#pt-assess-col .pt-dim .category-chip[data-cat="' + cat + '"]'); }
    function decision() { return document.getElementById('pt-decision').textContent; }

    assert(chip(tech), 'a technical toggle is rendered and clickable');
    assert(!document.getElementById('pt-decision'), 'an untouched empty draft shows no decision');
    chip(tech).click();
    assertEqual(T.getWork().cats[tech], 2, 'a click switches the category on (ja)');
    assertEqual(chip(tech).getAttribute('aria-pressed'), 'true');
    assertEqual(decision(), 'Exclude', 'one dimension is still Exclude');
    chip(soc).click();
    assertEqual(decision(), 'Include', 'both dimensions ja derives Include');
    chip(tech).click();
    assert(!T.getWork().cats[tech], 'a second click switches it off');
    assertEqual(decision(), 'Exclude');
    T.getWork().cats[tech] = 1; T.refreshAssess();
    assertEqual(chip(tech).getAttribute('aria-pressed'), 'mixed', 'teilweise is a distinct state');
    assertEqual(decision(), 'Unclear');
    chip(tech).click();
    assertEqual(T.getWork().cats[tech], 2, 'teilweise is raised to ja');
    assert(T.workDirty(), 'every click marks the draft as changed');
    delete T.getState().reviewers.rJ;
    T.getState().reviewer = prevRev;
});

test('a chip click that flips the derived decision clears a now-stale override (ADR-023 wiring)', function() {
    mountAssessCol();
    var tech = T.TECH_CATS[0], soc = T.SOCIAL_CATS[0];
    T.setPapers([{ id: 'pJ2', title: 'X' }]);
    var prevRev = T.getState().reviewer;
    T.getState().reviewer = 'rJ2'; T.getState().reviewers.rJ2 = {}; T.getState().index = 0;
    T.resetWork({ id: 'pJ2' });
    var w = T.getWork();
    w.cats[tech] = 2; w.cats[soc] = 2; w.override = true; w.overrideReason = 'trotzdem raus';
    T.refreshAssess(); // derived Include, override to Exclude armed
    assert(T.getWork().override, 'override is set before the flipping click');

    // dropping tech to nein flips the derivation Include -> Exclude, so the override is void
    document.querySelector('#pt-assess-col .pt-dim .category-chip[data-cat="' + tech + '"]').click();
    assertEqual(T.getWork().override, false, 'the flip clears the stale override');
    assert(!T.getWork().overrideReason, 'and its justification');

    delete T.getState().reviewers.rJ2;
    T.getState().reviewer = prevRev;
});

// ============================================================
// Section K: analysis coding panel (FR-14, ADR-026)
// The panel captures the AN_ analysis fields for Include-decided papers only,
// inline in the assessment column, from the frozen categories.yaml v1.3
// vocabulary (served as docs/data/analysis_fields.json, injected here). It never
// touches the binding screening record: these tests assert visibility gating,
// closed vocabulary, the nicht-entscheidbar export line, reviewer-file
// determinism and backward compatibility, and the export column order.
// ============================================================

// The headless runner injects the built vocabulary; hand it to prisma.js so the
// panel functions have their one source (mirrors __SEED_PAPERS__).
if (window.__ANALYSIS_FIELDS__ && T.setAnalysisFields) {
    T.setAnalysisFields(window.__ANALYSIS_FIELDS__);
}

function completeAnalysis(source) {
    var fields = {
        Studientyp: 'Empirisch',
        AN_Prompting_Role: ['None'],
        AN_Prompt_Techniques: ['None'],
        AN_Bias_Axes: ['None'],
        AN_Mitigation_Stage: ['None'],
        AN_Mitigation_Status: 'None',
        AN_Population: ['Not_SW_Specific'],
        AN_Coding_Basis: T.expectedCodingBasis(source)
    };
    if (source === 'raw') fields.AN_Harm_Types = ['None'];
    return { fields: fields, undecidable: {} };
}

test('analysis vocabulary loaded from the built categories.yaml source (v1.4.1)', function() {
    assert(window.__ANALYSIS_FIELDS__, 'the runner injected docs/data/analysis_fields.json');
    assertEqual(T.anVersion(), '1.4.1', 'the analysis_fields version');
    // fields introduced in v1.4 are optional in PRISM and carry their version
    ['AN_Task', 'AN_Gender_Definition', 'AN_Bias_Definition', 'AN_Gender_Understanding', 'AN_Theory_Reference'].forEach(function(name) {
        assert(T.anField(name).optional === true, name + ' is optional');
        assertEqual(T.anField(name).introduced_in, '1.4', name + ' records its codebook version');
    });
    // AN_Prompting_Role is captured first (coding-concept sec. 3)
    assertEqual(T.anFieldNames()[0], 'AN_Prompting_Role', 'AN_Prompting_Role is the first field');
    // spot-check a closed vocabulary against categories.yaml v1.3
    assertEqual(T.anVocab('AN_Mitigation_Status').join('|'), 'Evaluated|Demonstrated|Proposed|None');
    assertEqual(T.anVocab('AN_Coding_Basis').join('|'), 'Fulltext|Knowledge_Doc|Abstract');
    assert(T.anField('AN_Harm_Types').optional === true, 'AN_Harm_Types is optional');
    assert(T.anField('AN_Notes').free_text === true, 'AN_Notes is free text');
});

test('analysisPanelHtml renders only for an Include decision, hidden otherwise (FR-14)', function() {
    assertEqual(T.analysisPanelHtml({ decision: 'Exclude' }), '', 'no panel on Exclude');
    assertEqual(T.analysisPanelHtml({ decision: 'Unclear' }), '', 'no panel on Unclear');
    var incl = T.analysisPanelHtml({ decision: 'Include' });
    assertContains(incl, 'AN_Prompting_Role', 'the panel renders the AN fields on Include');
    assertContains(incl, 'AN_Coding_Basis');
    assertContains(incl, 'AN_Notes');
    // an override-to-Include is still Include, so the panel shows
    var ovr = T.analysisPanelHtml({ decision: 'Include', override: true, override_reason: 'x' });
    assertContains(ovr, 'AN_Prompting_Role', 'the panel shows for an override-to-Include too');
});

test('analysisPanelHtml is fed only from the closed vocabulary (no free option values)', function() {
    var html = T.analysisPanelHtml({ decision: 'Include' });
    // every rendered option carries a data-an-value from the vocabulary; assert a
    // representative set is present and that there is no text-input for coded fields
    T.anVocab('AN_Bias_Axes').forEach(function(v) {
        assertContains(html, 'data-an-value="' + v + '"', 'Bias axis option ' + v + ' present');
    });
    // only AN_Notes is a free field; there is exactly one free-text control
    assertEqual(html.split('data-an-free="AN_Notes"').length - 1, 1, 'exactly one free-text control (AN_Notes)');
});

test('sanitizeAnalysis keeps a recorded codebook version and adds none to a legacy record', function() {
    var kept = T.sanitizeAnalysis({ fields: { AN_Mitigation_Status: 'None' }, undecidable: {}, codebook_version: '1.4' }, 'raw');
    assertEqual(kept.codebook_version, '1.4', 'the recorded version survives');
    var patch = T.sanitizeAnalysis({ fields: { AN_Mitigation_Status: 'None' }, undecidable: {}, codebook_version: '1.4.1' }, 'raw');
    assertEqual(patch.codebook_version, '1.4.1', 'a patch version survives');
    var legacy = T.sanitizeAnalysis({ fields: { AN_Mitigation_Status: 'None' }, undecidable: {} }, 'raw');
    assert(!('codebook_version' in legacy), 'a record without a version stays without one, which reads as v1.3');
    var junk = T.sanitizeAnalysis({ fields: {}, undecidable: {}, codebook_version: 'latest' }, 'raw');
    assert(!('codebook_version' in junk), 'a malformed version is dropped');
});

test('sanitizeAnalysis drops any value outside the frozen vocabulary', function() {
    var clean = T.sanitizeAnalysis({
        fields: {
            AN_Prompting_Role: ['Recommended_Practice', 'NOT_A_CODE', 'Learning_Content'],
            AN_Mitigation_Status: 'Evaluated',
            AN_Coding_Basis: 'Nonsense_Basis',      // invalid single value dropped
            AN_Notes: 'free text stays verbatim',
            AN_Unknown_Field: ['x']                 // unknown field dropped whole
        },
        undecidable: { AN_Bias_Axes: true, AN_Not_A_Field: true }
    });
    assertEqual(clean.fields.AN_Prompting_Role.join('|'), 'Learning_Content|Recommended_Practice',
        'invalid multi value removed, remainder sorted');
    assertEqual(clean.fields.AN_Mitigation_Status, 'Evaluated', 'valid single value kept');
    assert(!('AN_Coding_Basis' in clean.fields), 'invalid single value dropped');
    assertEqual(clean.fields.AN_Notes, 'free text stays verbatim', 'free text kept verbatim');
    assert(!('AN_Unknown_Field' in clean.fields), 'unknown field dropped');
    assert(clean.undecidable.AN_Bias_Axes === true, 'undecidable toggle on a known field kept');
    assert(!('AN_Not_A_Field' in clean.undecidable), 'undecidable toggle on an unknown field dropped');
});
test('sanitizeAnalysis prevents None/code coexistence and lets nicht entscheidbar replace codes', function() {
    var clean = T.sanitizeAnalysis({
        fields: { AN_Bias_Axes: ['None', 'Gender'], AN_Mitigation_Status: 'Evaluated' },
        undecidable: { AN_Mitigation_Status: true }
    });
    assertEqual(clean.fields.AN_Bias_Axes.join('|'), 'Gender', 'substantive code excludes None');
    assert(!('AN_Mitigation_Status' in clean.fields), 'undecidable removes the prior substantive code');
    assert(clean.undecidable.AN_Mitigation_Status, 'undecidable marker remains');
});
test('text_source fixes AN_Coding_Basis and Fulltext makes AN_Harm_Types a completion gate', function() {
    var a = completeAnalysis('raw');
    a.fields.AN_Coding_Basis = 'Abstract';
    delete a.fields.AN_Harm_Types;
    var rec = { decision: 'Include', text_source: 'raw', analysis: a, categories: {}, evidence: {} };
    var clean = T.sanitizeAnalysis(a, 'raw');
    assertEqual(clean.fields.AN_Coding_Basis, 'Fulltext', 'stored basis follows the actual text source');
    var req = T.analysisRequirements(rec);
    assert(!req.ok && req.missing.indexOf('AN_Harm_Types') !== -1, 'Fulltext needs Harm_Types');
    rec.analysis = clean;
    rec.analysis.undecidable.AN_Harm_Types = true;
    assert(T.analysisRequirements(rec).ok, 'explicitly undecidable satisfies the field gate');
});

test('setAnalysis on a paper stores only sanitized values (no code path writes outside the vocabulary)', function() {
    T.setPapers([{ id: 'anP1', title: 'X' }]);
    var prevRev = T.getState().reviewer;
    T.getState().reviewer = 'rAN'; T.getState().reviewers.rAN = {};
    T.curDec().anP1 = { decision: 'Include', categories: { Prompting: true, Gender: true } };
    T.setAnalysis('anP1', {
        fields: { AN_Bias_Axes: ['Gender', 'BOGUS'], AN_Coding_Basis: 'Fulltext' },
        undecidable: {}
    });
    var stored = T.curDec().anP1.analysis;
    assertEqual(stored.fields.AN_Bias_Axes.join('|'), 'Gender', 'bogus value never reaches the record');
    assertEqual(stored.fields.AN_Coding_Basis, 'Fulltext');
    delete T.getState().reviewers.rAN;
    T.getState().reviewer = prevRev;
});

test('nicht-entscheidbar exports as an AN_Notes line "Feld: nicht entscheidbar aus <Basis>" (update-protocol C)', function() {
    var notes = T.analysisNotes({
        fields: { AN_Coding_Basis: 'Abstract', AN_Notes: 'base note.' },
        undecidable: { AN_Prompt_Techniques: true, AN_Harm_Types: true }
    });
    assertContains(notes, 'base note.');
    assertContains(notes, 'AN_Prompt_Techniques: nicht entscheidbar aus Abstract');
    assertContains(notes, 'AN_Harm_Types: nicht entscheidbar aus Abstract');
    // no vocabulary code was invented for the undecidable case
    assertEqual(T.anVocab('AN_Prompt_Techniques').indexOf('nicht_entscheidbar'), -1, 'no new vocabulary code');
    // with no basis recorded the line still exports, naming the basis as unbekannt
    var noBasis = T.analysisNotes({ fields: {}, undecidable: { AN_Bias_Axes: true } });
    assertContains(noBasis, 'AN_Bias_Axes: nicht entscheidbar aus unbekannt');
});

test('harmTypesHint fires only while the Fulltext Harm_Types gate is unresolved', function() {
    assert(T.harmTypesHint({ fields: { AN_Coding_Basis: 'Fulltext', AN_Harm_Types: [] } }),
        'Fulltext basis with empty Harm_Types shows a hint');
    assert(!T.harmTypesHint({ fields: { AN_Coding_Basis: 'Fulltext', AN_Harm_Types: ['Stereotyping'] } }),
        'a filled Harm_Types clears the hint');
    assert(!T.harmTypesHint({ fields: { AN_Coding_Basis: 'Abstract', AN_Harm_Types: [] } }),
        'no hint when the basis is not Fulltext (the field stays optional there)');
    assert(!T.harmTypesHint({ fields: { AN_Coding_Basis: 'Fulltext' }, undecidable: { AN_Harm_Types: true } }),
        'explicitly undecidable resolves the gate');
    assert(!T.harmTypesHint({ fields: {} }), 'no hint without a coding basis');
});

test('the analysis panel never alters the binding screening record (HARD boundary)', function() {
    T.setPapers([{ id: 'anB1', title: 'X' }]);
    var prevRev = T.getState().reviewer;
    T.getState().reviewer = 'rANB'; T.getState().reviewers.rANB = {};
    var rec = { decision: 'Include', categories: { Prompting: true, Gender: true },
                override: false, reason: null, evidence: {}, ts: '2026-07-18T00:00:00.000Z', reviewer: 'rANB' };
    T.curDec().anB1 = rec;
    var before = JSON.stringify({ decision: rec.decision, categories: rec.categories, override: rec.override,
                                  reason: rec.reason, evidence: rec.evidence, ts: rec.ts, reviewer: rec.reviewer });
    T.setAnalysis('anB1', { fields: { AN_Population: ['Mental_Health'] }, undecidable: {} });
    var after = T.curDec().anB1;
    var afterCore = JSON.stringify({ decision: after.decision, categories: after.categories, override: after.override,
                                     reason: after.reason, evidence: after.evidence, ts: after.ts, reviewer: after.reviewer });
    assertEqual(afterCore, before, 'the screening fields are byte-identical after analysis capture');
    assert(after.analysis, 'the analysis lives in its own sub-object, beside the record');
    delete T.getState().reviewers.rANB;
    T.getState().reviewer = prevRev;
});

test('reviewerFileText: a session that touches no analysis field is byte-identical to before (HARD boundary)', function() {
    T.getState().reviewers.rDetAN = {
        z9: { decision: 'Include', categories: { Prompting: true, Gender: true } },
        a1: { decision: 'Exclude', reason: 'Duplicate', categories: {} }
    };
    // a record without an `analysis` key must serialize exactly as it did pre-FR-14:
    // no analysis key is introduced, so the JSON body is unchanged
    var txt = T.reviewerFileText('rDetAN');
    assertNotContains(txt, '"analysis"', 'no analysis key appears when none was captured');
    assert(txt.indexOf('"a1"') < txt.indexOf('"z9"'), 'deterministic paper-id order preserved');
    delete T.getState().reviewers.rDetAN;
});

test('reviewerFileText: analysis fields serialize deterministically (stable diff, ADR-021)', function() {
    T.getState().reviewers.rDetAN2 = {
        p1: { decision: 'Include', categories: { Prompting: true, Gender: true },
              analysis: T.sanitizeAnalysis({
                  fields: { AN_Bias_Axes: ['Race_Ethnicity', 'Gender'], AN_Coding_Basis: 'Fulltext' },
                  undecidable: { AN_Harm_Types: true }
              }) }
    };
    var strip = function(s) { return s.replace(/"updated": "[^"]*",/, ''); };
    var a = strip(T.reviewerFileText('rDetAN2'));
    var b = strip(T.reviewerFileText('rDetAN2'));
    assertEqual(a, b, 'same state serializes identically (modulo timestamp)');
    // the multi list is sorted, so the on-disk order does not depend on click order
    assertContains(a, '"Gender"');
    assert(a.indexOf('"Gender"') < a.indexOf('"Race_Ethnicity"'), 'multi values sorted on disk');
    delete T.getState().reviewers.rDetAN2;
});

test('backward compatibility: a reviewer file without an analysis part loads unchanged', function() {
    T.setPapers([{ id: 'anC1' }, { id: 'anC2' }]);
    var S = T.getState();
    var legacy = {
        schema: 'femprompt-prisma-reviewer/0.2', reviewer: 'legacyAN',
        decisions: {
            anC1: { decision: 'Include', categories: { Prompting: true, Gender: true } }, // no analysis key
            anC2: { decision: 'Exclude', reason: 'Duplicate', categories: {} }
        }
    };
    var file = JSON.parse(JSON.stringify(legacy));
    S.reviewers.legacyAN = file.decisions;
    assertEqual(T.humanDecision({ id: 'anC1' }, 'legacyAN').decision, 'Include', 'legacy Include loads');
    // the panel reads a missing analysis part as empty, no throw
    var html = T.analysisPanelHtml(file.decisions.anC1);
    assertContains(html, 'AN_Prompting_Role', 'panel renders for a legacy Include with no analysis');
    assertEqual(T.readAnalysis(file.decisions.anC1).fields.AN_Notes || '', '', 'missing analysis reads as empty');
    delete S.reviewers.legacyAN;
});

test('analysis coding is required only of agent records, never of a human record (ADR-045)', function() {
    var cats = { Prompting: 2, Gender: 2 };
    var evidence = { Prompting: [{ term: 'p', snippet: 'p', source_layer: 'paper' }], Gender: [{ term: 'g', snippet: 'g', source_layer: 'paper' }] };
    var human = { decision: 'Include', categories: cats, evidence: evidence, text_source: 'abstract', actor: 'human' };
    assert(T.recordRequirements(human).ok, 'a human Include without analysis is complete');
    var legacy = { decision: 'Include', categories: cats, evidence: evidence, text_source: 'abstract' };
    assert(T.recordRequirements(legacy).ok, 'a record without actor counts as human');
    var agent = { decision: 'Include', categories: cats, evidence: evidence, text_source: 'abstract', actor: 'agent' };
    var req = T.recordRequirements(agent);
    assert(!req.ok && req.missing.indexOf('Studientyp') !== -1, 'an agent Include still needs complete analysis coding');
    agent.analysis = completeAnalysis('abstract');
    assert(T.recordRequirements(agent).ok, 'an agent Include with complete analysis is complete');
});
test('a formal exclusion needs no Paper Beleg and marks its categories, a substantive one still does (ADR-048)', function() {
    var cats = { Gender: 2 };
    var formal = { decision: 'Exclude', reason: 'Duplicate', categories: cats, evidence: {}, evidence_basis: { Gender: 'formal_exclusion' } };
    assert(T.recordRequirements(formal).ok, 'a duplicate exclusion with an unbelegt category is complete');
    var topical = { decision: 'Exclude', reason: 'Not_relevant_topic', categories: cats, evidence: {}, evidence_basis: { Gender: 'formal_exclusion' } };
    assert(!T.recordRequirements(topical).ok, 'the formal basis does not carry over to a substantive reason');
    T.resetWork({ id: 'formalW' });
    var w = T.getWork();
    w.cats = { Gender: 2 }; w.evidence = {}; w.override = false;
    w.reason = 'Duplicate';
    assertEqual((T.workingDecisionRecord().evidence_basis || {}).Gender, 'formal_exclusion', 'a duplicate draft marks its unbelegt category');
    w.reason = 'Not_relevant_topic';
    assertEqual((T.workingDecisionRecord().evidence_basis || {}).Gender, undefined, 'a topical exclusion keeps the Beleg duty');
    assertEqual(T.paperEvidenceMissing(w.cats, w.evidence, T.workingDecisionRecord().evidence_basis).join(), 'Gender', 'and names the category as missing');
});
test('a human session offers no analysis step and keeps an existing analysis part unchanged (ADR-045)', function() {
    var paper = { id: 'anKeep', title: 'keep analysis' };
    T.setPapers([paper]);
    var S = T.getState(), prevRev = S.reviewer, wasEditing = T.canEdit();
    var stored = { fields: { Studientyp: 'Review', AN_Bias_Axes: ['Gender'], AN_Coding_Basis: 'Fulltext', AN_Notes: 'legacy' }, undecidable: {} };
    S.reviewer = 'rKeep'; S.index = 0;
    S.reviewers.rKeep = { anKeep: { decision: 'Include', categories: { Prompting: 2, Gender: 2 },
        evidence: { Prompting: [{ term: 'p', snippet: 'p', origin: 'human' }], Gender: [{ term: 'g', snippet: 'g', origin: 'human' }] },
        analysis: JSON.parse(JSON.stringify(stored)), text_source: 'abstract', reviewer: 'rKeep', actor: 'human', ts: '2026-09-01T00:00:00Z' } };
    T.setEditMode(true);
    var rail = T.railHtml(paper);
    assertNotContains(rail, 'pt-open-analysis', 'no analysis entry in a human session');
    assertNotContains(rail, 'Analysekodierung', 'no analysis wording in a human session');
    var w = T.draftFor(paper);
    T.getState().index = 0;
    T.setWork(w);
    w.reason = null; w.evidence.Prompting.push({ term: 'p2', snippet: 'second passage', origin: 'human' });
    T.markDirty();
    T.setTextSource('abstract');
    T.commit();
    var rec = S.reviewers.rKeep.anKeep;
    assertEqual(JSON.stringify(rec.analysis), JSON.stringify(stored), 'the stored analysis part is written back as it stands');
    T.setEditMode(wasEditing);
    delete S.reviewers.rKeep; S.reviewer = prevRev;
});
test('analysis export uses the human_assessment.csv column schema with AN columns after Notes (update-protocol D, B.1 point 7)', function() {
    var header = T.analysisCsvHeader();
    var cols = header.split(',');
    // the established prefix is unchanged and Notes precedes the AN block
    var iNotes = cols.indexOf('Notes');
    assert(iNotes !== -1, 'Notes column present');
    assertEqual(cols[0], 'ID');
    assertEqual(cols.indexOf('Studientyp') !== -1, true, 'Studientyp column present');
    // AN order after Notes: techniques, bias, harms, mitigation stage, mitigation status,
    // population, THEN prompting role (B.1 point 7), then the v1.4 fields in vocabulary
    // order, coding basis, notes
    var anOrder = cols.slice(iNotes + 1).join(',');
    assertEqual(anOrder,
        'AN_Prompt_Techniques,AN_Bias_Axes,AN_Harm_Types,AN_Mitigation_Stage,AN_Mitigation_Status,' +
        'AN_Population,AN_Prompting_Role,AN_Task,AN_Gender_Definition,AN_Bias_Definition,' +
        'AN_Gender_Understanding,AN_Theory_Reference,AN_Coding_Basis,AN_Notes',
        'AN columns in the update-protocol D order (Prompting_Role after Population)');
});

test('analysis export: multi-select values are semicolon-separated, undecidable folds into AN_Notes', function() {
    T.setPapers([{ id: 'exP1', title: 'Paper, with comma', zotero_key: 'ZK1', author_year: 'A 2025' }]);
    var prevRev = T.getState().reviewer;
    T.getState().reviewer = 'rEX'; T.getState().reviewers.rEX = {};
    var exAnalysis = completeAnalysis('abstract');
    exAnalysis.fields.AN_Prompting_Role = ['Recommended_Practice', 'Learning_Content'];
    exAnalysis.fields.AN_Notes = 'a note';
    exAnalysis.undecidable.AN_Harm_Types = true;
    T.curDec().exP1 = {
        decision: 'Include', categories: { Prompting: true, Gender: true },
        evidence: { Prompting: [{ term: 'p', snippet: 'p', origin: 'human' }], Gender: [{ term: 'g', snippet: 'g', origin: 'human' }] },
        text_source: 'abstract', analysis: T.sanitizeAnalysis(exAnalysis, 'abstract')
    };
    var csv = T.analysisCsv('rEX');
    // the AN_Notes cell may carry newlines (base note + undecidable lines), a valid
    // quoted CSV field, so assert against the whole export, not a naive line split
    assert(csv.indexOf(T.analysisCsvHeader() + '\n') === 0, 'first line is the schema header');
    assertContains(csv, 'Learning_Content;Recommended_Practice', 'multi values semicolon-joined (sorted)');
    assertContains(csv, 'AN_Harm_Types: nicht entscheidbar aus Abstract', 'undecidable folded into AN_Notes');
    assertContains(csv, '"Paper, with comma"', 'a title with a comma is CSV-quoted');
    // only Include papers are exported for analysis (excluded papers get no AN codes)
    T.curDec().exExcl = { decision: 'Exclude', reason: 'Duplicate', categories: {} };
    T.setPapers([{ id: 'exP1', title: 't', zotero_key: 'ZK1' }, { id: 'exExcl', title: 'e', zotero_key: 'ZK2' }]);
    var csv2 = T.analysisCsv('rEX');
    // one Include data row after the header; the Exclude paper is not exported. Count
    // ID cells at line starts (a data row begins with its running ID integer).
    var dataRows = csv2.split('\n').filter(function(l) { return /^\d+,/.test(l); });
    assertEqual(dataRows.length, 1, 'one Include row exported; the Exclude paper is not');
    delete T.getState().reviewers.rEX;
    T.getState().reviewer = prevRev;
});

test('edit and re-commit preserves the analysis codes of an Include record; a change away from Include drops them deliberately', function() {
    T.setPapers([{ id: 'cyc1', title: 'X' }]);
    var prevRev = T.getState().reviewer;
    T.getState().reviewer = 'rCYC'; T.getState().reviewers.rCYC = {}; T.getState().index = 0;
    T.resetWork({ id: 'cyc1' });
    T.getWork().cats = { Prompting: true, Gender: true };
    addHumanEvidence(T.getWork(), ['Prompting', 'Gender']);
    var cycAnalysis = completeAnalysis('abstract');
    cycAnalysis.fields.AN_Population = ['Mental_Health']; cycAnalysis.undecidable.AN_Harm_Types = true;
    T.setTextSource('abstract');
    T.getWork().analysis = cycAnalysis;
    T.commit();
    assert(T.curDec().cyc1.analysis, 'analysis captured on the committed Include');
    // Ueberarbeiten + erneut erfassen, unchanged decision: the codes must survive the cycle
    T.getState().index = 0;
    T.setWork(T.draftFor({ id: 'cyc1' }));
    T.commit();
    var rec = T.curDec().cyc1;
    assertEqual(rec.decision, 'Include');
    assert(rec.analysis, 'analysis survives edit -> re-commit');
    assertEqual(rec.analysis.fields.AN_Population.join('|'), 'Mental_Health', 'field values intact');
    assert(rec.analysis.undecidable.AN_Harm_Types === true, 'undecidable toggles intact');
    // revising to Exclude drops the codes, deliberately: excluded papers carry no AN codes (coding rule 1)
    T.getState().index = 0;
    T.setWork(T.draftFor({ id: 'cyc1' }));
    T.getWork().cats = { Prompting: 2 }; // tech only -> derived Exclude
    T.getWork().reason = 'Not_relevant_topic';
    T.commit();
    var rec2 = T.curDec().cyc1;
    assertEqual(rec2.decision, 'Exclude');
    assert(!rec2.analysis, 'a re-commit that leaves Include drops the analysis codes');
    delete T.getState().reviewers.rCYC;
    T.getState().reviewer = prevRev;
});

test('Studientyp: closed single select from study_types, persisted, exported (required for Include, update-protocol D)', function() {
    assertEqual(T.anStudyTypes().join('|'), 'Empirisch|Experimentell|Theoretisch|Konzept|Literaturreview|Unclear',
        'the study_types vocabulary travels with the built JSON');
    // sanitize enforces the closed list with the same strictness as the AN_ fields
    var clean = T.sanitizeAnalysis({ fields: { Studientyp: 'Empirisch' }, undecidable: {} });
    assertEqual(clean.fields.Studientyp, 'Empirisch', 'valid Studientyp kept');
    var dirty = T.sanitizeAnalysis({ fields: { Studientyp: 'Blogpost' }, undecidable: {} });
    assert(!('Studientyp' in dirty.fields), 'a value outside study_types is dropped');
    // the panel renders a Studientyp control; no nicht-entscheidbar toggle (Unclear is in-vocabulary)
    var html = T.analysisPanelHtml({ decision: 'Include' });
    assertContains(html, 'data-an-field="Studientyp"', 'Studientyp control rendered');
    assertContains(html, 'data-an-value="Literaturreview"', 'options from study_types');
    assertNotContains(html, 'data-an-undec="Studientyp"', 'no undecidable toggle on Studientyp');
    // persistence and export: the required-for-Include column is filled from the capture
    T.setPapers([{ id: 'stP1', title: 'T', zotero_key: 'ZKST' }]);
    var prevRev = T.getState().reviewer;
    T.getState().reviewer = 'rST'; T.getState().reviewers.rST = {};
    T.curDec().stP1 = { decision: 'Include', categories: { Prompting: true, Gender: true },
        evidence: { Prompting: [{ term: 'p', snippet: 'p', origin: 'human' }], Gender: [{ term: 'g', snippet: 'g', origin: 'human' }] }, text_source: 'abstract' };
    var stAnalysis = completeAnalysis('abstract'); stAnalysis.fields.Studientyp = 'Konzept';
    T.setAnalysis('stP1', stAnalysis);
    assertEqual(T.curDec().stP1.analysis.fields.Studientyp, 'Konzept', 'Studientyp survives persistence');
    assertContains(T.analysisCsv('rST'), ',Konzept,Include,', 'Studientyp cell filled in the export row');
    delete T.getState().reviewers.rST;
    T.getState().reviewer = prevRev;
});

test('the export field set derives from the loaded vocabulary, no second list to drift (order D + B.1 point 7)', function() {
    var order = T.anExportOrder();
    // exactly the vocabulary fields: a field added to categories.yaml appears in
    // panel AND export, or this comparison goes red
    assertEqual(order.slice().sort().join('|'), T.anFieldNames().slice().sort().join('|'),
        'export field set equals the vocabulary field set');
    // the one reordering rule: AN_Prompting_Role sits directly after AN_Population
    assertEqual(order[order.indexOf('AN_Population') + 1], 'AN_Prompting_Role', 'B.1 point 7 position rule');
    // the header carries exactly the derived order after Notes
    var cols = T.analysisCsvHeader().split(',');
    assertEqual(cols.slice(cols.indexOf('Notes') + 1).join(','), order.join(','), 'header uses the derived order');
});

// ============================================================
// Section L: text-source provenance, load-token guard, decision log,
// deterministic reconciliation (ADR-027, browser pilot)
// ============================================================

var tsFix = [
    { id: 'ts1', title: 'full text paper', abstract: 'has an abstract too' },
    { id: 'ts2', title: 'abstract only paper', abstract: 'only this abstract' },
    { id: 'ts3', title: 'textless paper', abstract: '' }
];

test('applyReading sets text_source raw / abstract / none from what is actually shown', function() {
    T.setPapers(tsFix);
    T.loadReadingInto(tsFix[0]);
    assert(T.applyReading(T.readToken(), tsFix[0], 'Some full text body.', null), 'current token applies');
    assertEqual(T.textSource(), 'raw');
    T.loadReadingInto(tsFix[1]);
    T.applyReading(T.readToken(), tsFix[1], null, null);
    assertEqual(T.textSource(), 'abstract');
    T.loadReadingInto(tsFix[2]);
    T.applyReading(T.readToken(), tsFix[2], null, null);
    assertEqual(T.textSource(), 'none');
});

test('a stale reading response is dropped: it neither paints nor changes text_source (out-of-order load)', function() {
    T.setPapers(tsFix);
    T.loadReadingInto(tsFix[0]);          // slow response, token t1
    var t1 = T.readToken();
    T.loadReadingInto(tsFix[1]);          // reviewer moved on, token t2
    var t2 = T.readToken();
    assert(t2 > t1, 'token advances per load');
    assert(T.applyReading(t2, tsFix[1], null, null), 'current paper applies');
    assertEqual(T.textSource(), 'abstract');
    assertEqual(T.applyReading(t1, tsFix[0], 'late full text of the paper left behind', null), false, 'stale response dropped');
    assertEqual(T.textSource(), 'abstract', 'text_source still belongs to the paper shown');
});

test('commit records text_source of the shown text; the file form and current schema carry it', function() {
    T.setPapers(tsFix);
    T.getState().reviewers = {};
    T.getState().reviewer = 'r1';
    T.getState().index = 0;
    T.resetWork(tsFix[0]);
    T.loadReadingInto(tsFix[0]);
    T.applyReading(T.readToken(), tsFix[0], 'Full text with gendered scripts of care.', null);
    T.getWork().cats.Generative_KI = 2;
    T.getWork().cats.Gender = 2;
    addHumanEvidence(T.getWork(), ['Generative_KI', 'Gender']);
    T.getWork().analysis = completeAnalysis('raw');
    T.commit();
    var rec = T.curDec().ts1;
    assert(rec, 'record exists');
    assertEqual(rec.text_source, 'raw');
    var txt = T.reviewerFileText('r1');
    assertContains(txt, '"text_source": "raw"');
    assertContains(txt, '"schema": "femprompt-prisma-reviewer/0.5"', 'a file of governed human records is written as 0.5');
    T.getState().index = 1;
    T.resetWork(tsFix[1]);
    T.loadReadingInto(tsFix[1]);
    T.applyReading(T.readToken(), tsFix[1], null, null);
    T.getWork().cats.KI_Sonstige = 2;
    addHumanEvidence(T.getWork(), ['KI_Sonstige']);
    T.getWork().reason = 'Not_relevant_topic';
    T.commit();
    assertEqual(T.curDec().ts2.text_source, 'abstract');
    assertEqual(T.curDec().ts2.decision, 'Exclude');
});

test('commit waits for the reading: refused while the load is pending, recorded once applied', function() {
    T.setPapers(tsFix);
    T.getState().reviewers = {};
    T.getState().reviewer = 'r1';
    T.getState().index = 0;
    T.resetWork(tsFix[0]);
    T.loadReadingInto(tsFix[0]);
    assert(T.readingPending(), 'pending after load start');
    T.getWork().cats.Generative_KI = 2;
    T.getWork().cats.Gender = 2;
    addHumanEvidence(T.getWork(), ['Generative_KI', 'Gender']);
    T.getWork().analysis = completeAnalysis('raw');
    T.commit();
    assertEqual(T.curDec().ts1, undefined, 'no record while the text is pending');
    T.applyReading(T.readToken(), tsFix[0], 'Full text.', null);
    assert(!T.readingPending(), 'applied');
    T.commit();
    assertEqual(T.curDec().ts1.text_source, 'raw');
});

test('a 0.2 record without text_source counts as unrecorded; counts are per source', function() {
    var counts = T.textSourceCounts({
        a: { decision: 'Include', text_source: 'raw' },
        b: { decision: 'Exclude', text_source: 'abstract' },
        c: { decision: 'Exclude', text_source: 'none' },
        d: { decision: 'Include' }
    });
    assertEqual(counts.raw, 1); assertEqual(counts.abstract, 1); assertEqual(counts.none, 1); assertEqual(counts.unrecorded, 1);
    assertEqual(counts.knowledge_doc, 0, 'the historical value is a counter, zero when absent');
});

test('a migrated record from the superseded build keeps its knowledge_doc source instead of becoming unrecorded', function() {
    var counts = T.textSourceCounts({
        a: { decision: 'Include', text_source: 'knowledge_doc' },
        b: { decision: 'Include', text_source: 'raw' },
        c: { decision: 'Include' }
    });
    assertEqual(counts.knowledge_doc, 1);
    assertEqual(counts.unrecorded, 1, 'only a record without any value is unrecorded');
    T.setPapers([{ id: 'a' }, { id: 'b' }, { id: 'c' }]);
    T.getState().reviewers = { r1: { a: { decision: 'Include', text_source: 'knowledge_doc' } } };
    T.getState().reviewer = 'r1';
    assertContains(T.disclosureMarkdown(), 'knowledge document 1', 'the disclosure names the historical source');
});

test('decision-log CSV carries a text_source column filled from the record', function() {
    T.setPapers(tsFix);
    T.getState().reviewers = { r1: { ts1: { decision: 'Include', categories: { Generative_KI: 2, Gender: 2 }, evidence: {}, reviewer: 'r1', text_source: 'raw' } } };
    T.getState().reviewer = 'r1';
    var csv = T.decisionLogCsv();
    var lines = csv.split('\n');
    assertEqual(lines[0].split(',').pop(), 'text_source', 'header ends with text_source');
    var row1 = lines[1].split(',');
    assertEqual(row1[0], 'ts1');
    assertEqual(row1[2], 'Include', 'human_decision is the current reviewer record');
    assertEqual(row1[3], 'r1', 'human_source is the reviewer key');
    assertEqual(row1[row1.length - 1], 'raw');
    var row2 = lines[2].split(',');
    assertEqual(row2[row2.length - 1], '', 'unscreened paper has an empty text_source cell');
});

test('disclosure reports the per-source counts of the current reviewer (trAIce M4)', function() {
    T.setPapers(tsFix);
    T.getState().reviewers = { r1: { ts1: { decision: 'Include', text_source: 'raw' }, ts2: { decision: 'Exclude', text_source: 'abstract' } } };
    T.getState().reviewer = 'r1';
    var md = T.disclosureMarkdown();
    assertContains(md, 'raw full text 1, abstract 1, no text 0, unrecorded 0');
});

var reconA = { schema: 'femprompt-prisma-reviewer/0.3', reviewer: 'r1', updated: '2026-08-21T10:00:00.000Z', decisions: {
    'PILOT-B': { decision: 'Exclude', reason: 'Not_relevant_topic', categories: { KI_Sonstige: 2 }, evidence: {}, text_source: 'abstract', reviewer: 'r1' },
    'PILOT-A': { decision: 'Include', reason: null, categories: { Generative_KI: 2, Soziale_Arbeit: 2 }, evidence: { Gender: [{ term: 'gendered scripts', snippet: 'x', origin: 'human' }] }, text_source: 'raw', reviewer: 'r1' },
    'ONLY-R1': { decision: 'Include', categories: {}, evidence: {}, text_source: 'raw', reviewer: 'r1' }
} };
var reconB = { schema: 'femprompt-prisma-reviewer/0.3', reviewer: 'r2', updated: '2026-08-21T11:00:00.000Z', decisions: {
    'PILOT-A': { decision: 'Include', reason: null, categories: { Generative_KI: 2, Soziale_Arbeit: 2, Gender: 2 }, evidence: {}, text_source: 'raw', reviewer: 'r2' },
    'PILOT-B': { decision: 'Include', reason: null, categories: { KI_Sonstige: 2, Soziale_Arbeit: 2 }, evidence: {}, text_source: 'abstract', reviewer: 'r2' }
} };

test('reconcileReviewers: agree / divergent / single per paper, sorted, consensus slot empty', function() {
    var r = T.reconcileReviewers([reconA, reconB]);
    assertEqual(r.schema, 'femprompt-prisma-reconciliation/0.1');
    assertEqual(r.reviewers.join(','), 'r1,r2');
    assertEqual(Object.keys(r.papers).join(','), 'ONLY-R1,PILOT-A,PILOT-B', 'paper ids sorted');
    assertEqual(r.papers['PILOT-A'].status, 'agree');
    assertEqual(r.papers['PILOT-B'].status, 'divergent');
    assertEqual(r.papers['ONLY-R1'].status, 'single');
    assertEqual(r.papers['PILOT-B'].consensus, null);
    assertEqual(r.papers['PILOT-B'].records.r1.reason, 'Not_relevant_topic', 'source record carried verbatim');
    assertEqual(r.papers['PILOT-B'].records.r2.decision, 'Include');
    assertEqual(r.summary.agree, 1); assertEqual(r.summary.divergent, 1); assertEqual(r.summary.single, 1);
});

test('reconcileReviewers is order-independent and never mutates its inputs', function() {
    var snapA = JSON.stringify(reconA), snapB = JSON.stringify(reconB);
    var ab = T.reconciliationText([reconA, reconB]);
    var ba = T.reconciliationText([reconB, reconA]);
    assertEqual(ab, ba, 'byte-identical for reversed input order');
    assertEqual(JSON.stringify(reconA), snapA, 'input A untouched');
    assertEqual(JSON.stringify(reconB), snapB, 'input B untouched');
    var r = T.reconcileReviewers([reconA, reconB]);
    r.papers['PILOT-A'].records.r1.decision = 'Exclude';
    assertEqual(reconA.decisions['PILOT-A'].decision, 'Include', 'copy, not reference');
});

test('reconcileReviewers refuses two payloads claiming the same reviewer key', function() {
    var threw = false;
    try { T.reconcileReviewers([reconA, { reviewer: 'r1', decisions: {} }]); } catch (e) { threw = /duplicate reviewer key/.test(e.message); }
    assert(threw, 'duplicate key throws');
});

test('reconcileReviewers ignores the seed track and payloads without decisions', function() {
    var r = T.reconcileReviewers([reconA, { reviewer: 'seed', decisions: { 'PILOT-A': { decision: 'Exclude' } } }, null, { reviewer: 'r9' }]);
    assertEqual(r.reviewers.join(','), 'r1');
    assertEqual(r.papers['PILOT-A'].status, 'single');
});

// ============================================================
// Section M: PRISM lifecycle verification
// ============================================================

test('legacy decision records retain their achieved capture state with an explicit provenance gap', function() {
    var legacy = { decision: 'Exclude', reviewer: 'ar2', actor: 'agent', text_source: 'abstract', evidence: { Gender: [{ snippet: 'gender' }] } };
    var snapshot = JSON.stringify(legacy);
    var view = T.verificationView(legacy);
    assertEqual(view.lifecycle.baseline.state, 'agent-annotated');
    assertEqual(view.lifecycle.baseline.basis, 'legacy_capture');
    assertEqual(view.lifecycle.state, 'agent-annotated');
    assertEqual(view.lifecycle.events.length, 0);
    assertEqual(view.provenance.annotation_type, 'legacy-migrated');
    assertContains(view.provenance.legacy_gap, 'nicht vollständig überliefert');
    assertEqual(JSON.stringify(legacy), snapshot, 'opening the verification view does not mutate legacy screening data');
});

test('verification appends complete events and permits only AI-agent review to expert verification to publication approval', function() {
    var record = {
        decision: 'Include', reviewer: 'agent-a', actor: 'agent', text_source: 'raw', evidence: {},
        provenance: {
            annotation_id: 'ann-pilot', annotation_type: 'screening_decision',
            actors: [
                { id: 'curator-1', type: 'person', roles: ['curation'] },
                { id: 'agent-a', type: 'ai_agent', roles: ['screening'] },
                { id: 'ai-agent-reviewer-1', type: 'ai_agent', roles: ['ai_agent_reviewer'] }
            ],
            activities: [
                { id: 'screen-1', type: 'agent_screening', run_id: 'run-1', method: 'agent_screening', prompt: { status: 'recorded', reference: 'prompt.md' }, model: { status: 'recorded', reference: 'model-id' }, associated_actor_ids: ['agent-a'] },
                { id: 'ai-review-1', type: 'ai_agent_review', run_id: 'run-1', method: 'source_grounded_ai_agent_review', prompt: { status: 'recorded', reference: 'prompt.md' }, model: { status: 'recorded', reference: 'model-id' }, associated_actor_ids: ['ai-agent-reviewer-1'] }
            ],
            used_sources: [{ id: 'paper-1', type: 'paper', reference: 'paper.md' }],
            derived_from: [{ id: 'track-1', type: 'agent_track', reference: 'track.json' }]
        },
        lifecycle: {
            baseline: { state: 'curated', basis: 'controlled_intake', at: '2026-08-23T09:00:00.000Z', actor_ids: ['curator-1'] },
            state: 'ai-agent-reviewed',
            events: [
                { event_id: 'event-screen-1', event_type: 'agent_annotation', from: 'curated', to: 'agent-annotated', result: 'completed', at: '2026-08-23T10:00:00.000Z', activity_id: 'screen-1', actor_ids: ['agent-a'] },
                { event_id: 'event-ai-review-1', event_type: 'ai_agent_review', from: 'agent-annotated', to: 'ai-agent-reviewed', result: 'accepted', at: '2026-08-23T11:00:00.000Z', activity_id: 'ai-review-1', actor_ids: ['ai-agent-reviewer-1'] }
            ]
        }
    };
    var beforeSkippedTransition = JSON.stringify(record);
    var skipped = T.advanceVerification(record, 'publication-approved', {
        reviewer_id: 'expert-1', actor_ids: 'expert-1', activity_id: 'pub-1', note: 'Freigabeversuch.'
    });
    assert(!skipped.ok, 'publication approval cannot skip domain-expert verification');
    assertEqual(JSON.stringify(record), beforeSkippedTransition, 'a rejected transition leaves the source record unchanged');

    var expert = T.advanceVerification(record, 'verified', {
        reviewer_id: 'expert-1', actor_ids: 'expert-1 expert-witness', activity_id: 'expert-review-1',
        result: 'accepted', note: 'Belege und fachliche Bedeutung geprüft.'
    });
    assert(expert.ok, expert.message);
    assertEqual(record.lifecycle.baseline.state, 'curated');
    assertEqual(record.lifecycle.baseline.basis, 'controlled_intake');
    assertEqual(record.lifecycle.state, 'verified');
    assertEqual(record.lifecycle.events.length, 3);
    var event = record.lifecycle.events[2];
    ['event_id', 'event_type', 'from', 'to', 'at', 'activity_id', 'actor_ids'].forEach(function(key) {
        assert(Object.prototype.hasOwnProperty.call(event, key), 'event contains ' + key);
    });
    assertEqual(event.from, 'ai-agent-reviewed');
    assertEqual(event.to, 'verified');
    assertEqual(event.event_type, 'domain_expert_verification');
    assertEqual(event.result, 'accepted');
    assertEqual(event.activity_id, 'expert-review-1');
    assertEqual(event.actor_ids.join(','), 'expert-1,expert-witness');
    var expertActor = record.provenance.actors.find(function(actor) { return actor.id === 'expert-1'; });
    assert(expertActor && expertActor.type === 'person' && expertActor.roles.indexOf('domain_expert') !== -1,
        'explicit reviewer is retained as a domain-expert person actor');
    assert(record.provenance.activities.some(function(activity) {
        return activity.id === 'expert-review-1' && activity.associated_actor_ids.indexOf('expert-1') !== -1 &&
            activity.run_id === 'expert-review-1' && activity.method === 'prism_domain_expert_verification' &&
            activity.prompt.status === 'recorded' && activity.model.status === 'not_applicable';
    }), 'the event activity references the explicit actor');

    var publication = T.advanceVerification(record, 'publication-approved', {
        reviewer_id: 'publisher-1', actor_ids: 'publisher-1', activity_id: 'release-1',
        note: 'Für die öffentliche Projektion freigegeben.'
    });
    assert(publication.ok, publication.message);
    assertEqual(record.lifecycle.state, 'publication-approved');
    assertEqual(record.lifecycle.events.length, 4, 'events are appended rather than replaced');
    assertEqual(record.lifecycle.events[2].event_id, event.event_id, 'the expert event remains intact');
});

test('expert review can request changes or append a correction without overwriting the agent annotation', function() {
    var record = {
        categories: {}, decision: 'Exclude', override: false, reason: 'Not_relevant_topic', override_reason: null,
        evidence: {}, text_source: 'abstract', ts: '2026-08-23T10:00:00.000Z', reviewer: 'agent-a', actor: 'agent',
        provenance: {
            annotation_id: 'ann-pilot', annotation_type: 'screening_decision',
            actors: [{ id: 'agent-a', type: 'ai_agent', roles: ['screening'] }], activities: [],
            used_sources: [{ id: 'paper-1', type: 'paper', reference: 'paper.md' }], derived_from: []
        },
        annotations: [{
            annotation_id: 'ann-pilot', annotation_type: 'screening_decision', at: '2026-08-23T10:00:00.000Z',
            actor_ids: ['agent-a'], body: {
                categories: {}, decision: 'Exclude', override: false, reason: 'Not_relevant_topic', override_reason: null,
                evidence: {}, text_source: 'abstract', ts: '2026-08-23T10:00:00.000Z', reviewer: 'agent-a', actor: 'agent'
            }
        }],
        active_annotation_id: 'ann-pilot', checks: [],
        lifecycle: { baseline: { state: 'ai-agent-reviewed', basis: 'test', at: '2026-08-23T10:00:00.000Z', actor_ids: ['agent-a'] }, state: 'ai-agent-reviewed', events: [] }
    };
    var requested = T.advanceVerification(record, 'verified', {
        reviewer_id: 'expert-1', actor_ids: 'expert-1', activity_id: 'expert-review-1',
        result: 'changes_requested', note: 'Der Ausschlussgrund muss korrigiert werden.'
    });
    assert(requested.ok, requested.message);
    assertEqual(record.lifecycle.state, 'ai-agent-reviewed');
    assertEqual(record.lifecycle.events[0].to, 'ai-agent-reviewed');
    assertEqual(record.lifecycle.events[0].result, 'changes_requested');
    assertEqual(record.annotations.length, 1);

    var corrected = T.annotationBody(record);
    corrected.reason = 'Wrong_population';
    var accepted = T.advanceVerification(record, 'verified', {
        reviewer_id: 'expert-1', actor_ids: 'expert-1', activity_id: 'expert-review-2',
        result: 'corrected_and_accepted', note: 'Der präzisere Ausschlussgrund ist inhaltlich belegt.',
        corrected_annotation: JSON.stringify(corrected)
    });
    assert(accepted.ok, accepted.message);
    assertEqual(record.lifecycle.state, 'verified');
    assertEqual(record.reason, 'Wrong_population');
    assertEqual(record.annotations.length, 2);
    assertEqual(record.annotations[0].body.reason, 'Not_relevant_topic');
    assertEqual(record.annotations[1].supersedes, 'ann-pilot');
    assert(record.annotations[1].changes.some(function(change) { return change.path === '/reason'; }), 'correction carries a field-level diff');
    assertEqual(record.active_annotation_id, record.annotations[1].annotation_id);
});

test('verification requires identifiers, and a note only for outcomes that do not accept', function() {
    var base = { lifecycle: { baseline: { state: 'ai-agent-reviewed', basis: 'test', at: null, actor_ids: [] }, state: 'ai-agent-reviewed', events: [] }, provenance: T.verificationView({}).provenance };
    [
        [{ reviewer_id: '', actor_ids: 'expert-1', activity_id: 'a-1', note: 'x' }, 'Reviewer-ID'],
        [{ reviewer_id: 'expert-1', actor_ids: '', activity_id: 'a-1', note: 'x' }, 'Actor-ID'],
        [{ reviewer_id: 'expert-1', actor_ids: 'expert-1', activity_id: '', note: 'x' }, 'Activity-ID'],
        [{ reviewer_id: 'expert-1', actor_ids: 'expert-1', activity_id: 'a-1', note: '', result: 'changes_requested' }, 'Notiz'],
        [{ reviewer_id: 'expert-1', actor_ids: 'expert-1', activity_id: 'a-1', note: ' ', result: 'rejected' }, 'Notiz']
    ].forEach(function(row) {
        var record = JSON.parse(JSON.stringify(base));
        var result = T.advanceVerification(record, 'verified', row[0]);
        assert(!result.ok, row[1] + ' blocks the action');
        assertContains(result.message, row[1]);
        assertEqual(record.lifecycle.state, 'ai-agent-reviewed', 'rejected action keeps state');
        assertEqual(record.lifecycle.events.length, 0, 'rejected action adds no event');
    });
});

test('provenance and history render as text in the rail (ADR-040, ADR-042)', function() {
    var legacyHtml = T.provenanceHtml({ decision: 'Exclude', reviewer: 'ar2', actor: 'agent' });
    assertContains(legacyHtml, '<summary>Provenienz</summary>');
    assertContains(legacyHtml, 'nicht vollständig überliefert');
    assertNotContains(legacyHtml, '[object Object]');
    var record = {
        lifecycle: { baseline: { state: 'curated', basis: 'agent_capture', at: '2026-08-23T10:00:00.000Z', actor_ids: ['agent-1'] }, state: 'verified', events: [
            { event_id: 'e1', event_type: 'ai_agent_review', from: 'agent-annotated', to: 'ai-agent-reviewed', result: 'accepted', at: '2026-08-23T10:00:00.000Z' },
            { event_id: 'e2', event_type: 'domain_expert_verification', from: 'ai-agent-reviewed', to: 'verified', result: 'accepted', at: '2026-10-01T10:00:00.000Z' }
        ] },
        provenance: { annotation_id: 'ann-1', annotation_type: 'decision', activities: [], actors: [], used_sources: [], derived_from: [] }
    };
    var history = T.historyHtml(record);
    assertContains(history, 'KI-geprüft 23.08.2026');
    assertContains(history, 'fachlich verifiziert 01.10.2026');
    assertNotContains(history, 'ai-agent-reviewed', 'stored state values are shown with German names');
});

test('a verification event is bound to the agent subject and written into the expert file (ADR-040)', function() {
    var subjectRecord = {
        decision: 'Exclude', reviewer: 'ar2', actor: 'agent', reason: 'Not_relevant_topic',
        active_annotation_id: 'ar2:pVerify',
        checks: [{ check_type: 'lifecycle_validation', status: 'passed', actor_id: 'validator-1',
            subject: { annotation_id: 'ar2:pVerify', sha256: 'abc123' } }],
        lifecycle: { baseline: { state: 'curated', basis: 'controlled_intake', at: null, actor_ids: [] },
            state: 'ai-agent-reviewed', events: [] }
    };
    var event = { event_id: 'ev-1', event_type: 'domain_expert_verification', from: 'ai-agent-reviewed',
        to: 'verified', result: 'accepted', note: 'Belege geprüft.', at: '2026-09-22T10:00:00.000Z',
        activity_id: 'expert-verification-1', actor_ids: ['ev'] };
    var entry = T.verificationEntry('pVerify', { record: subjectRecord, reviewer: 'ar2', agent: true },
        'ar2:pVerify', event, 'ev', null);
    assertEqual(entry.paper_id, 'pVerify');
    assertEqual(entry.reviewer_id, 'ev');
    assertEqual(entry.result, 'accepted');
    assertEqual(entry.subject.reviewer, 'ar2', 'the entry names the agent track it judges');
    assertEqual(entry.subject.annotation_id, 'ar2:pVerify');
    assertEqual(entry.subject.record_sha256, 'abc123');
    assertEqual(entry.subject.hash_status, 'deterministic_check_receipt');
    assertEqual(entry.event.event_type, 'domain_expert_verification');
    assert(!!entry.verification_id, 'the entry carries its own identifier');

    // Without a deterministic check receipt the entry says so instead of inventing a hash.
    var unbound = T.verificationEntry('pVerify', { record: { lifecycle: subjectRecord.lifecycle }, reviewer: 'ar2', agent: true },
        'ar2:pVerify', event, 'ev', null);
    assertEqual(unbound.subject.record_sha256, null);
    assertEqual(unbound.subject.hash_status, 'not_recorded');

    var before = JSON.parse(JSON.stringify(T.getState().reviewers));
    T.getState().reviewers.ev = T.getState().reviewers.ev || {};
    T.setVerifications('ev', [entry]);
    T.setVerifications('ar2', []);
    var expertFile = JSON.parse(T.reviewerFileText('ev'));
    assertEqual(expertFile.reviewer, 'ev');
    assertEqual(expertFile.verification_schema, T.VERIFICATION_SCHEMA);
    assertEqual(expertFile.verification_schema, 'femprompt-prisma-verification/0.1');
    assertEqual(expertFile.verifications.length, 1);
    assertEqual(expertFile.verifications[0].event.event_id, 'ev-1');
    assert(!expertFile.decisions.pVerify, 'verifying writes no screening decision of the expert');
    assert(T.validateReviewerPayload(expertFile).ok, 'the written expert file validates');
    var agentFile = JSON.parse(T.reviewerFileText('ar2'));
    assert(!Object.prototype.hasOwnProperty.call(agentFile, 'verifications'),
        'the agent file receives no verification block');
    assert(!Object.prototype.hasOwnProperty.call(agentFile, 'verification_schema'));

    var damaged = JSON.parse(JSON.stringify(expertFile));
    damaged.verifications = [{ paper_id: 'pVerify', result: 'accepted' }];
    var rejected = T.validateReviewerPayload(damaged);
    assert(!rejected.ok, 'an incomplete verification entry is rejected on load');
    assertContains(rejected.message, 'Verifikationseintrag');

    T.setVerifications('ev', []);
    T.setVerifications('ar2', []);
    T.getState().reviewers = before;
});

// ============================================================
// Section N: one assessment surface over the current annotation (ADR-042)
// ============================================================

var W1 = 'work:11111111-1111-5111-8111-111111111111', V1 = 'version:11111111-1111-5111-8111-111111111111';

function agentRecordFixture(pid, overrides) {
    var body = {
        categories: { Generative_KI: 2, Gender: 2 }, decision: 'Include', override: false, reason: null, override_reason: null,
        evidence: {
            Generative_KI: [{ term: 'g', snippet: 'generative evidence', source_layer: 'paper', actor: 'agent' }],
            Gender: [{ term: 'gender', snippet: 'gender evidence', source_layer: 'paper', actor: 'agent' }]
        },
        analysis: T.sanitizeAnalysis(completeAnalysis('abstract'), 'abstract'),
        text_source: 'abstract', ts: '2026-08-23T10:00:00.000Z', reviewer: 'ar2', actor: 'agent'
    };
    var record = JSON.parse(JSON.stringify(body));
    record.provenance = {
        annotation_id: 'ar2:' + pid, annotation_type: 'screening_decision',
        actors: [{ id: 'agent-1', type: 'ai_agent', roles: ['screening'] }, { id: 'review-1', type: 'ai_agent', roles: ['ai_agent_reviewer'] }],
        activities: [{ id: pid + ':ai-agent-review', type: 'ai_agent_review', run_id: 'run-1', method: 'source_grounded_ai_agent_review', associated_actor_ids: ['review-1'] }],
        used_sources: [{ id: 'paper:' + pid, type: 'paper', reference: pid }], derived_from: []
    };
    record.annotations = [{ annotation_id: 'ar2:' + pid, annotation_type: 'screening_decision', at: body.ts, actor_ids: ['agent-1'], body: body }];
    record.active_annotation_id = 'ar2:' + pid;
    record.checks = [{ check_id: 'c1', check_type: 'lifecycle_contract', status: 'passed', at: body.ts, actor_id: 'validator-1',
        tool: { name: 'x', version: '1' }, subject: { annotation_id: 'ar2:' + pid, sha256: 'a'.repeat(64) } }];
    record.lifecycle = { baseline: { state: 'curated', basis: 'controlled_intake', at: body.ts, actor_ids: ['agent-1'] }, state: 'ai-agent-reviewed',
        events: [{ event_id: pid + ':ai-agent-review', event_type: 'ai_agent_review', from: 'agent-annotated', to: 'ai-agent-reviewed', result: 'accepted', at: body.ts, activity_id: pid + ':ai-agent-review', actor_ids: ['review-1'] }] };
    return Object.assign(record, overrides || {});
}

function agentEnvelope(records) {
    return { schema: 'femprompt-prisma-reviewer/0.5', reviewer: 'ar2', actor: 'agent', updated: '2026-09-05T00:00:00.000Z', decisions: records };
}

test('the expert decision maps 1 to ja and 0 or null to nein, and never seeds from the LLM (ADR-042)', function() {
    var p = { id: 'map1', human: { decision: 'Include', all_categories: { AI_Literacies: 1, Gender: 1, Prompting: 0, Fairness: null } },
        llm: { decision: 'Include', all_categories: { Feministisch: 1 } } };
    var e = T.expertAssessment(p);
    assertEqual(JSON.stringify(e.categories), JSON.stringify({ AI_Literacies: 2, Gender: 2 }));
    assertEqual(e.decision, 'Include');
    assertEqual(e.override, false);
    T.setPapers([p]);
    T.getState().reviewer = 'rMap'; T.getState().reviewers.rMap = {};
    var subject = T.paperSubject(p);
    assertEqual(subject.kind, 'expert');
    assert(!subject.record.categories.Feministisch, 'the LLM proposal never seeds the subject');
    var llmOnly = { id: 'map2', llm: { decision: 'Include', all_categories: { Gender: 1 } } };
    T.setPapers([llmOnly]);
    assertEqual(T.paperSubject(llmOnly).kind, 'empty', 'a paper with only an LLM assessment starts empty');
    delete T.getState().reviewers.rMap;
});

test('an expert Exclude with both groups set keeps Exclude through a recorded deviation (ADR-042)', function() {
    var p = { id: 'ovr1', human: { decision: 'Exclude', all_categories: { Prompting: 1, Gender: 1 } } };
    var e = T.expertAssessment(p);
    assertEqual(T.deriveDecision(e.categories), 'Include', 'the rule alone would include');
    assertEqual(e.decision, 'Exclude');
    assertEqual(e.override, true, 'the deviation is an explicit override');
    assertEqual(e.reason, 'Consolidated_expert_exclusion');
    assertEqual(T.finalDecisionOf(e.categories, e.override), 'Exclude');
    if (window.__SEED_PAPERS__ && window.__SEED_PAPERS__.length) {
        var cases = window.__SEED_PAPERS__.map(T.expertAssessment).filter(function(x) { return x && x.decision === 'Exclude' && x.override; });
        assertEqual(cases.length, 73, 'the corpus holds the known expert Excludes with both groups set');
        assert(cases.every(function(x) { return x.reason === 'Consolidated_expert_exclusion'; }), 'each carries the confirmation reason');
        var unmapped = window.__SEED_PAPERS__.filter(function(x) { return x.human && x.human.decision && !T.expertAssessment(x); });
        assertEqual(unmapped.length, 0, 'every expert decision can be prefilled as it stands');
    }
});

test('saving an expert prefill writes an own record with provenance and no verification event (ADR-042)', function() {
    var p = { id: 'EXP1', title: 'X', work_id: W1, version_id: V1, version_type: 'version_of_record', preferred_version_id: V1,
        is_preferred_version: true, human: { decision: 'Exclude', all_categories: { AI_Literacies: 1, Gender: 1 } } };
    T.setPapers([p]);
    var S = T.getState();
    S.reviewer = 'cp'; S.reviewers.cp = {}; S.index = 0;
    T.setTextSource('abstract');
    T.setWork(T.draftFor(p));
    T.getWork().cats.Prompting = 2; // a raised category needs its own Paper Beleg
    T.markDirty();
    assertEqual(T.commit(), false, 'an added category without a Paper Beleg blocks the save');
    T.setWork(T.draftFor(p));
    assertEqual(T.getWork().dirty, true, 'the changed draft is kept per paper');
    delete T.getWork().cats.Prompting;
    assert(T.commit(), 'the unchanged expert levels save without Paper Belege');
    var rec = S.reviewers.cp.EXP1;
    assertEqual(rec.decision, 'Exclude');
    assertEqual(rec.override, true);
    assertEqual(rec.reason, 'Consolidated_expert_exclusion');
    assertEqual(JSON.stringify(rec.evidence_basis), JSON.stringify({ AI_Literacies: 'expert_assessment', Gender: 'expert_assessment' }));
    var derived = rec.provenance.derived_from[0];
    assertEqual(derived.type, 'consolidated_expert_assessment');
    assertEqual(derived.reference, 'docs/data/research_vault_v2.json#EXP1.human');
    assertEqual(derived.mapping, '1=ja');
    assertEqual(rec.lifecycle.baseline.basis, 'legacy_import');
    assertEqual(rec.lifecycle.state, 'curated');
    assertEqual(rec.lifecycle.events.length, 0, 'a confirmed expert prefill is never a verified event');
    assertEqual(rec.provenance.actors[0].type, 'person');
    assertEqual(rec.annotations[0].body.evidence_basis.Gender, 'expert_assessment');
    assert(T.recordRequirements(rec).ok, 'the saved record is complete');
    var file = JSON.parse(T.reviewerFileText('cp'));
    assertEqual(file.schema, 'femprompt-prisma-reviewer/0.5');
    assertEqual(file.reviewer, 'cp');
    assertEqual(T.listState(p), 'erfasst');
    delete S.reviewers.cp;
});

test('a lowered expert level is no longer the expert judgement and needs a Paper Beleg', function() {
    var p = { id: 'EXP2', title: 'X', human: { decision: 'Exclude', all_categories: { AI_Literacies: 1 } } };
    T.setPapers([p]);
    var S = T.getState();
    S.reviewer = 'cp'; S.reviewers.cp = {}; S.index = 0;
    T.setTextSource('abstract');
    T.setWork(T.draftFor(p));
    T.getWork().cats.AI_Literacies = 1;
    var rec = T.workingDecisionRecord();
    assert(!rec.evidence_basis, 'the changed level carries no expert basis');
    assertEqual(T.paperEvidenceMissing(rec.categories, rec.evidence, rec.evidence_basis).join('|'), 'AI_Literacies');
    delete S.reviewers.cp;
});

test('a paper with only an agent record starts empty for a human and saves as an own record (ADR-044)', function() {
    var p = { id: 'AG1', title: 'X', llm: { decision: 'Include', all_categories: { Feministisch: 1 } } };
    T.setPapers([p]);
    var S = T.getState();
    S.reviewer = 'ev'; S.reviewers.ev = {}; S.index = 0;
    T.setVerifications('ev', []);
    var envelope = agentEnvelope({ AG1: agentRecordFixture('AG1') });
    var snapshot = JSON.stringify(envelope);
    T.setServedAgentEnvelope(envelope);
    assert(T.agentTrack().records.AG1, 'the agent track stays loaded for comparison');
    assertEqual(T.paperSubject(p).kind, 'empty', 'the agent record is no subject of a human edit');
    assertEqual(T.listState(p), 'none', 'the paper is simply open');
    assert(!T.isDone(p), 'and counts as open');
    var w = T.draftFor(p);
    assertEqual(Object.keys(w.cats).length, 0, 'no agent or LLM category seeds the draft');
    assertEqual(Object.keys(w.evidence).length, 0, 'no agent evidence seeds the draft');
    assertEqual(w.seed, 'empty');
    T.setTextSource('abstract');
    T.setWork(w);
    assertEqual(T.saveMode(p, T.paperSubject(p)), 'record');
    T.getWork().reason = 'Not_relevant_topic';
    T.markDirty();
    assert(T.commit(), 'the own decision saves');
    assertEqual(S.reviewers.ev.AG1.decision, 'Exclude');
    assertEqual(S.reviewers.ev.AG1.actor, 'human');
    assertEqual(T.verifications('ev').length, 0, 'no verification entry is written');
    assertEqual(JSON.stringify(envelope), snapshot, 'the served agent envelope is untouched');
    assertEqual(T.agentTrack().records.AG1.lifecycle.state, 'ai-agent-reviewed', 'the agent record keeps its state');
    T.setServedAgentEnvelope(null);
    delete S.reviewers.ev;
});

test('list dots and the category filter never show agent or LLM codes (ADR-044)', function() {
    var papersFix = [
        { id: 'D1', title: 'agent only', llm: { decision: 'Include', all_categories: { Gender: 1, Prompting: 1 } } },
        { id: 'D2', title: 'expert', human: { decision: 'Include', all_categories: { Fairness: 1, Prompting: 1 } },
            llm: { decision: 'Include', all_categories: { Gender: 1 } } }
    ];
    T.setPapers(papersFix);
    var S = T.getState();
    S.reviewer = 'ev'; S.reviewers.ev = {}; S.index = 0;
    S.statusFilter = 'alle'; S.catFilter = []; S.assigneeFilter = 'alle';
    T.setCorpusQuery('');
    T.setServedAgentEnvelope(agentEnvelope({ D1: agentRecordFixture('D1'), D2: agentRecordFixture('D2') }));
    var html = T.corpusListHtml();
    var entries = html.split('<button').slice(1);
    assertNotContains(entries[0], 'pt-nav-cats', 'an agent-only paper carries no dots');
    assertContains(entries[0], 'data-state="none"');
    assertNotContains(html, 'pt-mark-agent');
    assertNotContains(html, 'Agentenkodierung');
    var colour = function(cat) { return T.categoryChipHtml(cat, 2).match(/--chip-color:([^"]+)/)[1]; };
    assertContains(entries[1], '--chip-color:' + colour('Fairness'), 'the expert codes colour their paper');
    assertNotContains(entries[1], '--chip-color:' + colour('Gender'), 'the LLM code of the expert paper never shows');
    S.catFilter = ['Gender'];
    assertEqual(T.visibleRows().length, 0, 'neither the agent nor the LLM Gender code counts for the filter');
    S.catFilter = ['Fairness'];
    assertEqual(T.visibleRows().map(function(r) { return r.paper.id; }).join('|'), 'D2');
    S.catFilter = [];
    S.statusFilter = 'offen';
    assertEqual(T.visibleRows().map(function(r) { return r.paper.id; }).join('|'), 'D1', 'the agent-only paper is open');
    S.statusFilter = 'alle';
    T.setServedAgentEnvelope(null);
    delete S.reviewers.ev;
});

test('Nächstes offen continues after a paper that a save removed from the Offen list', function() {
    T.setPapers([{ id: 'N1', title: 'one' }, { id: 'N2', title: 'two' }, { id: 'N3', title: 'three' }, { id: 'N4', title: 'four' }]);
    var S = T.getState(), prevRev = S.reviewer;
    S.reviewer = 'nx'; S.reviewers.nx = {}; S.catFilter = []; S.assigneeFilter = 'alle';
    T.setCorpusQuery('');
    S.statusFilter = 'offen'; S.index = 1;
    S.reviewers.nx.N2 = { decision: 'Exclude', reason: 'Duplicate', categories: {}, ts: '2026-10-01T00:00:00Z' };
    T.gotoNextOpen();
    assertEqual(T.getState().index, 2, 'the next open paper follows the saved one');
    S.reviewers.nx.N3 = { decision: 'Exclude', reason: 'Duplicate', categories: {}, ts: '2026-10-01T00:00:00Z' };
    S.reviewers.nx.N4 = { decision: 'Exclude', reason: 'Duplicate', categories: {}, ts: '2026-10-01T00:00:00Z' };
    T.gotoNextOpen();
    assertEqual(T.getState().index, 0, 'past the end of the list it wraps to the first open paper');
    S.statusFilter = 'alle'; delete S.reviewers.nx; S.reviewer = prevRev;
});
test('the Offen list puts full texts first, then abstracts, then papers without text, and names the weaker basis', function() {
    var abstract = 'An abstract long enough to be read as the paper layer of this record, well over the short-abstract limit of the reader.';
    T.setPapers([{ id: 'X1', title: 'none' }, { id: 'X2', title: 'abstract', abstract: abstract }, { id: 'X3', title: 'full' }, { id: 'X4', title: 'none too' }]);
    T.setFulltextManifest({ X3: { src: 'clean' } });
    var S = T.getState(), prevRev = S.reviewer;
    S.reviewer = 'tx'; S.reviewers.tx = {}; S.catFilter = []; S.assigneeFilter = 'alle';
    T.setCorpusQuery('');
    var order = function() { return T.visibleRows().map(function(r) { return r.paper.id; }).join('|'); };
    S.statusFilter = 'offen';
    assertEqual(order(), 'X3|X2|X1|X4', 'full text, abstract, then no text, corpus order within a tier');
    var html = T.corpusListHtml();
    assertContains(html, 'nur Abstract'); assertContains(html, 'kein Papertext');
    S.statusFilter = 'alle';
    assertEqual(order(), 'X1|X2|X3|X4', 'other lists keep the corpus order');
    S.statusFilter = 'offen'; S.index = 2;
    S.reviewers.tx.X3 = { decision: 'Exclude', reason: 'Duplicate', categories: {}, ts: '2026-10-02T00:00:00Z' };
    T.gotoNextOpen();
    assertEqual(T.getState().index, 1, 'after saving the full-text paper the next open one follows in list order');
    S.statusFilter = 'alle'; delete S.reviewers.tx; S.reviewer = prevRev; T.setFulltextManifest({});
});
test('removing the last Paper pin clears the teilweise it had set, a ja stays', function() {
    var paper = { id: 'UP1', title: 'unpin' };
    T.setPapers([paper]);
    var S = T.getState(), prevRev = S.reviewer;
    S.reviewer = 'up'; S.reviewers.up = {}; S.index = 0;
    T.resetWork(paper);
    T.pinEvidence('Gender', 'gender', 'a gender passage', 'human');
    assertEqual(T.getWork().cats.Gender, 1, 'a pin on an empty category sets teilweise');
    T.unpinEvidence('Gender', 0);
    assert(!T.getWork().cats.Gender, 'without its pin the category is off again');
    T.getWork().cats.Prompting = 2;
    T.pinEvidence('Prompting', 'prompt', 'a prompt passage', 'human');
    T.unpinEvidence('Prompting', 0);
    assertEqual(T.getWork().cats.Prompting, 2, 'a ja set by the reviewer stays');
    delete S.reviewers.up; S.reviewer = prevRev;
});
test('under Offen the category filter is neither offered nor applied, and a changed draft is marked in the list', function() {
    var paper = { id: 'OF1', title: 'open one' };
    T.setPapers([paper, { id: 'OF2', title: 'open two' }]);
    var S = T.getState(), prevRev = S.reviewer;
    S.reviewer = 'of'; S.reviewers.of = {}; S.index = 0; S.assigneeFilter = 'alle';
    T.setCorpusQuery('');
    S.statusFilter = 'offen'; S.catFilter = ['Gender'];
    assertNotContains(T.filtersHtml(), 'pt-cat-filter', 'no category chips under Offen');
    assertEqual(T.visibleRows().length, 2, 'a stale category selection does not empty the open list');
    var w = T.draftFor(paper); w.cats.Gender = 2; T.setWork(w); T.markDirty();
    assertContains(T.corpusListHtml(), 'nicht gespeichert', 'the changed draft is marked');
    S.statusFilter = 'alle'; S.catFilter = [];
    T.discardDraft && T.discardDraft(paper);
    delete S.reviewers.of; S.reviewer = prevRev;
});
test('a conflict message names the paper by title, not by its identifier', function() {
    T.setPapers([{ id: 'CF1', title: 'A readable paper title' }]);
    var ts = '2026-08-22T12:00:00.000Z';
    var merged = T.mergeReviewerDecisions({ CF1: { decision: 'Exclude', ts: ts } }, { CF1: { decision: 'Include', ts: ts } });
    assertContains(merged.conflict, '„A readable paper title“');
    assertNotContains(merged.conflict, 'CF1');
});

test('a verification entry of an earlier build still loads and serializes, without making the paper captured (ADR-044)', function() {
    var p = { id: 'AG3', title: 'X' };
    T.setPapers([p]);
    var S = T.getState();
    S.reviewer = 'ev'; S.reviewers.ev = {}; S.index = 0;
    var envelope = agentEnvelope({ AG3: agentRecordFixture('AG3') });
    var working = JSON.parse(JSON.stringify(envelope.decisions.AG3));
    var outcome = T.advanceVerification(working, 'verified', { reviewer_id: 'ev', actor_ids: ['ev'], activity_id: 'prism-session-x', result: 'accepted' });
    assert(outcome.ok, 'the verification data model still advances a copy');
    var entry = T.verificationEntry('AG3', { reviewer: 'ar2', record: envelope.decisions.AG3 }, 'ar2:AG3', outcome.event, 'ev', null);
    T.setVerifications('ev', [entry]);
    T.setServedAgentEnvelope(envelope);
    assertEqual(T.agentTrack().records.AG3.lifecycle.state, 'verified', 'the entry still projects onto the agent track');
    assertEqual(T.paperSubject(p).kind, 'empty');
    assert(!T.isCaptured(p), 'an old verification is no own screening');
    var file = JSON.parse(T.reviewerFileText('ev'));
    assertEqual(file.verifications.length, 1, 'the entry is written back unchanged');
    assert(T.validateReviewerPayload(file).ok, 'the file with the entry validates');
    T.setVerifications('ev', []);
    T.setServedAgentEnvelope(null);
    delete S.reviewers.ev;
});

test('a stored draft that an older build seeded from an agent record is dropped on load (ADR-044)', function() {
    var S = T.getState();
    var prevReviewer = S.reviewer;
    T.setPapers([{ id: 'DR1' }, { id: 'DR2' }]);
    var snap = T.serializeAll();
    snap.drafts = {
        DR1: { pid: 'DR1', cats: { Gender: 2 }, seed: 'agent', dirty: true },
        DR2: { pid: 'DR2', cats: { Prompting: 2 }, seed: 'empty', dirty: true }
    };
    var before = window.localStorage.getItem(snap.schema);
    window.localStorage.setItem(snap.schema, JSON.stringify(snap));
    T.loadLocal();
    var drafts = T.drafts();
    assert(!drafts.DR1, 'the agent-seeded draft is gone');
    assert(drafts.DR2 && drafts.DR2.cats.Prompting === 2, 'an own draft survives');
    if (before === null) window.localStorage.removeItem(snap.schema); else window.localStorage.setItem(snap.schema, before);
    T.resetWork({ id: 'DR2' });
    S.reviewer = prevReviewer;
});

test('the mode switch has exactly two states and exists only with local editing (ADR-042)', function() {
    T.setManifestReachable(true); T.setFsSupported(true);
    var html = T.workspaceBarHtml();
    var host = document.createElement('div'); host.innerHTML = html;
    var buttons = host.querySelectorAll('.pt-mode-seg button');
    assertEqual(buttons.length, 2);
    assertEqual(buttons[0].textContent, 'Lesen');
    assertEqual(buttons[1].textContent, 'Bearbeiten');
    assertNotContains(html, 'Verifizieren');
    assertNotContains(html, 'verify=1');
    T.setManifestReachable(false);
    assertNotContains(T.workspaceBarHtml(), 'pt-mode-seg', 'without the local manifest there is no switch');
    T.setManifestReachable(true); T.setFsSupported(false);
    assertNotContains(T.workspaceBarHtml(), 'pt-mode-seg', 'without File System Access there is no switch');
    T.setFsSupported(undefined); T.setManifestReachable(false);
});

test('list filters: status counts, category AND filter on the current annotation, no duplicate captured counter', function() {
    var papersFix = [
        { id: 'F1', title: 'a', human: { decision: 'Include', all_categories: { Prompting: 1, Gender: 1 } } },
        { id: 'F2', title: 'b', human: { decision: 'Exclude', all_categories: { Prompting: 1 } } },
        { id: 'F3', title: 'c', llm: { decision: 'Include', all_categories: { Gender: 1 } } }
    ];
    T.setPapers(papersFix);
    var S = T.getState();
    S.reviewer = 'cp'; S.reviewers.cp = { F2: { decision: 'Exclude', reason: 'Duplicate', categories: {}, evidence: {} } };
    T.setManifestReachable(true); T.setFsSupported(true);
    S.statusFilter = 'alle'; S.catFilter = [];
    assertEqual(T.visibleRows().length, 3);
    S.catFilter = ['Gender'];
    assertEqual(T.visibleRows().map(function(r) { return r.paper.id; }).join('|'), 'F1', 'the LLM proposal never counts for the filter');
    S.catFilter = ['Gender', 'Prompting'];
    assertEqual(T.visibleRows().length, 1, 'several chips combine with AND');
    S.catFilter = [];
    S.statusFilter = 'erfasst';
    assertEqual(T.visibleRows().map(function(r) { return r.paper.id; }).join('|'), 'F1|F2', 'expert decisions of the Excel workflow count as done');
    S.statusFilter = 'offen';
    assertEqual(T.visibleRows().map(function(r) { return r.paper.id; }).join('|'), 'F3');
    // the Erfasst facet carries the count, the position bar repeats no "n von N erfasst"
    assertNotContains(T.positionBarHtml(), 'erfasst', 'no captured counter beside the facets');
    var filters = T.filtersHtml();
    assertContains(filters, 'data-status="offen" aria-pressed="true">Offen <span class="pt-seg-count">1</span>');
    S.statusFilter = 'alle';
    T.setManifestReachable(false); T.setFsSupported(undefined);
    delete S.reviewers.cp;
});

test('assignee filter: segment counts, combination with status, list label and URL round trip', function() {
    var papersFix = [
        { id: 'A1', title: 'a', human: { decision: 'Include', all_categories: { Gender: 1 } } },
        { id: 'A2', title: 'b', author_year: 'X 2020' },
        { id: 'A3', title: 'c', author_year: 'Y 2021' },
        { id: 'A4', title: 'd' }
    ];
    T.setPapers(papersFix);
    var S = T.getState();
    S.statusFilter = 'alle'; S.catFilter = []; S.assigneeFilter = 'alle';
    T.setAssignment(null);
    assertEqual(T.assigneeFilterAvailable(), false, 'without a file there is no filter');
    assertNotContains(T.filtersHtml(), 'pt-assignee-seg');
    S.assigneeFilter = 'susi';
    assertEqual(T.visibleRows().length, 4, 'a requested assignee without a file narrows nothing');
    assertEqual(T.normalizeAssignment({ schema: 'other', reviewers: [], assignments: {} }), null);
    T.setAssignment({ schema: 'femprompt-prisma-assignment/1.0',
        reviewers: [{ key: 'sabine', label: 'Sabine' }, { key: 'susi', label: 'Susi' }],
        assignments: { A1: 'sabine', A2: 'sabine', A3: 'susi', A4: 'nobody' } });
    assertEqual(T.visibleRows().map(function(r) { return r.paper.id; }).join('|'), 'A3');
    S.assigneeFilter = 'sabine';
    assertEqual(T.visibleRows().map(function(r) { return r.paper.id; }).join('|'), 'A1|A2');
    S.statusFilter = 'offen';
    assertEqual(T.visibleRows().map(function(r) { return r.paper.id; }).join('|'), 'A2', 'status and assignee combine');
    var html = T.filtersHtml();
    assertContains(html, 'data-assignee="sabine" aria-pressed="true">Sabine <span class="pt-seg-count">1</span>', 'assignee counts follow the status filter');
    assertContains(html, 'data-assignee="susi" aria-pressed="false">Susi <span class="pt-seg-count">1</span>');
    assertContains(html, 'data-status="offen" aria-pressed="true">Offen <span class="pt-seg-count">1</span>', 'status counts follow the assignee filter');
    assertContains(html, 'data-status="alle" aria-pressed="false">Alle <span class="pt-seg-count">2</span>');
    assertNotContains(T.corpusListHtml(), 'pt-nav-assignee', 'no label while one assignee is selected');
    S.assigneeFilter = 'alle'; S.statusFilter = 'alle';
    var list = T.corpusListHtml();
    assertContains(list, 'X 2020<span class="pt-nav-assignee">, Sabine</span>');
    assertContains(list, 'Y 2021<span class="pt-nav-assignee">, Susi</span>');
    assertEqual((list.match(/pt-nav-assignee/g) || []).length, 3, 'an entry naming an undeclared reviewer shows no label');
    var abstract = 'A substantive abstract that is long enough to support category screening and records the source basis without pretending that a full text was read. This sentence keeps the fixture above the quality threshold.';
    papersFix[1].abstract = abstract; papersFix[2].abstract = abstract;
    assertEqual(T.firstEntryIndex(), 1, 'without an assignee the first open paper of the corpus');
    S.assigneeFilter = 'susi';
    assertEqual(T.firstEntryIndex(), 2, 'an assignee link opens on the first open paper of that list');
    S.assigneeFilter = 'nobody';
    assertEqual(T.activeAssignee(), 'alle', 'an undeclared key falls back to all papers');

    T.readFilterQuery(new URLSearchParams('assignee=Susi&status=offen'));
    assertEqual(S.assigneeFilter, 'susi', 'the URL key is normalised');
    window.history.replaceState(null, '', '/prisma.html');
    T.syncUrl();
    assertContains(window.location.search, 'assignee=susi');
    assertContains(window.location.search, 'status=offen');
    S.assigneeFilter = 'alle';
    T.syncUrl();
    assertNotContains(window.location.search, 'assignee=');
    T.readFilterQuery(new URLSearchParams(''));
    assertEqual(S.assigneeFilter, 'alle');
    // the assignment splits open papers: under Erfasst the control is left out and
    // narrows nothing, also when a link requests an assignee there
    S.statusFilter = 'erfasst'; S.assigneeFilter = 'sabine';
    assertEqual(T.assigneeFilterAvailable(), false, 'no assignee filter under Erfasst');
    assertNotContains(T.filtersHtml(), 'pt-assignee-seg', 'the Zuteilung control is not rendered under Erfasst');
    assertEqual(T.visibleRows().map(function(r) { return r.paper.id; }).join('|'), 'A1', 'a stored assignee does not narrow the Erfasst list');
    T.readFilterQuery(new URLSearchParams('assignee=susi&status=erfasst'));
    assertEqual(S.assigneeFilter, 'alle', 'an assignee in an Erfasst link is dropped');
    S.statusFilter = 'offen';
    assertContains(T.filtersHtml(), 'pt-assignee-seg', 'the control returns under Offen');
    S.statusFilter = 'alle';
    T.setAssignment(null);
    window.history.replaceState(null, '', '/');
});

test('reserved and agent keys cannot become a reviewer key', function() {
    var S = T.getState();
    var before = S.reviewer;
    assertEqual(T.selectReviewer('seed'), false, 'the built-in expert reference key is reserved');
    assertEqual(T.selectReviewer('acceptance'), false);
    assertEqual(T.selectReviewer('ar2'), false, 'the productive agent track key is refused');
    assertEqual(T.selectReviewer('assignment'), false, 'the assignment file name is reserved');
    assertEqual(S.reviewer, before);
    ['sabine', 'susi'].forEach(function(key) {
        assertEqual(T.normalizedReviewerKey(key), key, key + ' is a valid reviewer key');
        assertEqual(T.reservedKey(key), false, key + ' is not reserved');
    });
});

test('the browser snapshot holds own work and changed drafts, never a loaded agent track', function() {
    var S = T.getState();
    S.reviewer = 'cp'; S.reviewers = { cp: { a: { decision: 'Exclude', reason: 'Duplicate', categories: {} } }, ar2: { b: { decision: 'Include' } } };
    T.setReviewerEnvelope('ar2', agentEnvelope({ b: agentRecordFixture('b') }));
    var snap = T.serializeAll();
    assert(snap.reviewers.cp && !snap.reviewers.ar2, 'the agent track stays out of the snapshot');
    T.setPapers([{ id: 'dr1' }]);
    S.index = 0;
    T.setWork(T.draftFor({ id: 'dr1' }));
    T.getWork().cats.Gender = 2;
    T.markDirty();
    assert(T.serializeAll().drafts.dr1, 'a changed draft is persisted');
    T.resetWork({ id: 'dr1' });
    assert(!T.serializeAll().drafts.dr1);
    T.setReviewerEnvelope('ar2', null);
    S.reviewers = {};
});

test('the written file names the key it belongs to and keeps an existing Work-Version binding', function() {
    var S = T.getState();
    T.setPapers([{ id: 'B1', work_id: W1, version_id: V1, version_type: 'version_of_record' }]);
    T.setReviewerEnvelope('kx', { schema: 'femprompt-prisma-reviewer/0.4', reviewer: 'someone-else', actor: 'human', decisions: {} });
    S.reviewers.kx = { B1: { decision: 'Exclude', reason: 'Duplicate', categories: {}, evidence: {},
        work_id: 'work:22222222-2222-5222-8222-222222222222', version_id: 'version:22222222-2222-5222-8222-222222222222', version_type: 'preprint' } };
    var file = JSON.parse(T.reviewerFileText('kx'));
    assertEqual(file.reviewer, 'kx', 'a stale embedded reviewer is corrected');
    assertEqual(file.decisions.B1.version_id, 'version:22222222-2222-5222-8222-222222222222', 'an existing binding is never rebound');
    assertEqual(T.recordProblem('B1', S.reviewers.kx.B1, 'femprompt-prisma-reviewer/0.5'), 'Werk- oder Fassungsbindung weicht vom Korpus ab');
    delete S.reviewers.kx;
    T.setReviewerEnvelope('kx', null);
});

test('verification events from browser and file are united by event id', function() {
    T.setVerifications('vx', [{ paper_id: 'p', result: 'accepted', event: { event_id: 'local-1' } }]);
    var localOnly = T.adoptVerifications('vx', { verifications: [{ paper_id: 'p', result: 'accepted', event: { event_id: 'disk-1' } }] });
    assert(localOnly, 'a browser-only event marks the track for recovery');
    assertEqual(T.verifications('vx').map(function(e) { return e.event.event_id; }).join('|'), 'disk-1|local-1');
    T.setVerifications('vx', []);
});

test('a same-paper divergence can be resolved by keeping the file or the browser version', function() {
    var merged = T.mergeReviewerDecisions({ p: { decision: 'Include', ts: 'x' } }, { p: { decision: 'Exclude', ts: 'x' } });
    assert(merged.conflict && merged.conflictDetail.pid === 'p');
    assertEqual(T.resolveReviewerConflict('nobody', 'disk'), false, 'without a recorded conflict nothing changes');
});

test('recordRequirements also checks the exclusion reason and the derivation of a loaded record', function() {
    var req = T.recordRequirements({ decision: 'Exclude', categories: {}, evidence: {} });
    assert(!req.ok && req.missing.indexOf('Ausschlussgrund') !== -1);
    var inconsistent = T.recordRequirements({ decision: 'Include', categories: {}, evidence: {}, reason: null });
    assert(inconsistent.missing.some(function(m) { return /passt nicht/.test(m); }), 'a decision that contradicts its categories is incomplete');
});

test('the reader renders pipe tables and glossaries and resolves glyph names', function() {
    var table = T.renderMarkdown('## Document History\n\n| Version | Date | Author(s) |\n|-----------|------------|------|\n| V0.1 | 03/05/2024 | A <b> |\n| V1.0 | 07/06/2024 | B |\n\nAfter.');
    assertContains(table, '<div class="pt-doc-table" role="region" aria-label="Tabelle"><table><thead><tr><th>Version</th><th>Date</th><th>Author(s)</th></tr></thead>');
    assertContains(table, '<td>V1.0</td>');
    assertContains(table, '&lt;b&gt;', 'cell text is escaped');
    assertContains(table, '<p class="pt-doc-p">After.</p>');
    assertNotContains(table, '|-----', 'the separator row is not shown');
    var glossary = T.renderMarkdown('## ACRONYMS AND ABBREVIATIONS\n\nADT\n\nAccessible Digital Textbooks\n\nAI\n\nArtificial Intelligence\n\nAI HLEG\n\nHigh-Level Expert Group on AI\n\n## 1. Introduction\n\nText.');
    assertContains(glossary, '<dl class="pt-doc-dl"><div><dt>ADT</dt><dd>Accessible Digital Textbooks</dd></div>');
    assertContains(glossary, '<dt>AI HLEG</dt><dd>High-Level Expert Group on AI</dd>');
    assertContains(glossary, '<h2 class="pt-doc-h2">1. Introduction</h2>');
    var prose = T.renderMarkdown('## Abbreviations\n\nThis paragraph explains the abbreviations used in the report.\n\nIt is prose.');
    assertNotContains(prose, '<dl', 'prose under such a heading stays paragraphs');
    assertEqual(T.replaceGlyphNames('/uni25CF and de/uniFB01ned /uniFB01eld'), '● and defined field');
    assertContains(T.renderMarkdown('| A | B |\n|---|---|\n| /uni25CF | x |'), '<td>●</td>');
    assertEqual(T.normalizeSearchText('de/uniFB01ned'), 'defined', 'search sees the resolved letters');
});

test('a pinned search hit takes its snippet at the active hit, not at the first occurrence', function() {
    var p = document.createElement('p');
    p.innerHTML = 'alpha term one ' + new Array(30).join('filler ') + 'beta <mark>term</mark> two';
    document.body.appendChild(p);
    var snippet = T.snippetAround(p.querySelector('mark'), 'term');
    assertContains(snippet, 'beta term two');
    assertNotContains(snippet, 'alpha', 'the earlier occurrence is not used');
    document.body.removeChild(p);
});

test('reading metadata shows version and review only where they change the reading, and no identifiers', function() {
    var html = T.versionMetaHtml({ version_type: 'preprint', preferred_version_id: 'v2', is_preferred_version: false, peer_review_status: 'not_peer_reviewed' });
    assertContains(html, 'nicht die bevorzugte Fassung');
    assertContains(html, 'pt-meta-warn');
    assertNotContains(T.versionMetaHtml({ version_type: 'unknown', peer_review_status: 'not_established' }), '<div', 'unknown values are left out');
});

// ============================================================
// Operator screen review of 1 October 2026 (provisional, knowledge/plan.md)
// ============================================================

test('reader: converter entities are decoded once, so "&amp;" never shows literally', function() {
    assertEqual(T.decodeConverterEntities('Deuze &amp; Beckett, a &lt; b &gt; c'), 'Deuze & Beckett, a < b > c');
    assertEqual(T.decodeConverterEntities('&amp;lt;'), '&lt;', 'one pass: an escaped entity of the PDF stays literal');
    var body = T.paperBodyMarkdown('## Mark Deuze &amp; Charlie Beckett\n\nText &lt;x&gt; here.', { title: 'Other' });
    var html = T.renderMarkdown(body);
    assertContains(html, 'Mark Deuze &amp; Charlie Beckett</h2>', 'the ampersand is escaped exactly once');
    assertNotContains(html, '&amp;amp;');
    assertContains(html, 'Text &lt;x&gt; here.', 'markup characters of the PDF stay inert text');
});

test('reader: a publisher cover page at the start is skipped at render time only', function() {
    var tandf = ['## Digital Journalism', '', 'ISSN: 2167-0811 (Print) 2167-082X (Online)', '',
        '## Imagination, Algorithms and News', '', '## Mark Deuze &amp; Charlie Beckett', '',
        'To cite this article: Mark Deuze &amp; Charlie Beckett (2022) Imagination ...', '', 'To link to this article:', '',
        'Published online: 28 Sep 2022.', '', 'Submit your article to this journal', '', 'Article views: 4190', '',
        'View related articles', '', 'View Crossmark data', '', 'Citing articles: 64 View citing articles', '', '曲', '',
        'CrossMark', '', '## ARTICLE COMMENTARY', '', 'In this contribution, we frame the normative dimension.'].join('\n');
    var body = T.paperBodyMarkdown(tandf, { title: 'Imagination, Algorithms and News' });
    assert(body.indexOf('## ARTICLE COMMENTARY') === 0, 'the text opens at the first real heading');
    ['ISSN', 'To cite this article', 'Article views', 'View Crossmark data', 'CrossMark\n'].forEach(function(marker) {
        assertNotContains(body, marker, 'skipped: ' + marker);
    });
    var acm = ['Latest updates: hps://dl.acm.org/doi/10.1145/1', '', 'RESEARCH-ARTICLE', '', '## A Title', '',
        'Open Access Support provided by: A University', '', 'Published: 20 October 2024', '', 'Citation in BibTeX format', '',
        'Conference Sponsors:', '', 'SIGDOC', '', '## 1 Introduction', '', 'Body.'].join('\n');
    assert(T.paperBodyMarkdown(acm, { title: 'Unrelated' }).indexOf('## 1 Introduction') === 0, 'the ACM sheet and its sponsor residue are skipped');
    // conservative: markers deep in the text, too few markers, or prose after the last marker
    var late = ['## Intro', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'ISSN: 1', 'Published online: x', 'Article views: 3', 'Body'];
    assertEqual(T.publisherCoverEnd(late), 0, 'a first marker below the leading lines is no cover page');
    assertEqual(T.publisherCoverEnd(['ISSN: 1', 'Published online: x', 'Real first paragraph.']), 0, 'two markers are not enough');
    var prose = ['ISSN: 1', 'Published online: x', 'Article views: 3', 'Short line', 'A long first paragraph of the article that is clearly prose and not residue.'];
    assertEqual(T.publisherCoverEnd(prose), 3, 'short lines followed by prose are kept, only the marker block goes');
    var withAbstract = '## Journal\n\nISSN: 1\n\nArticle views: 3\n\nView related articles\n\n## Abstract\nThe abstract.';
    assert(T.paperBodyMarkdown(withAbstract, {}).indexOf('## Abstract') === 0, 'the abstract rule still wins');
});

test('panel: an expert-adopted divergent exclusion is one line, and stays editable in Bearbeiten', function() {
    mountAssessCol();
    var p = { id: 'VERD1', title: 'X', human: { decision: 'Exclude', all_categories: { AI_Literacies: 1, Bias_Ungleichheit: 1 } } };
    T.setPapers([p]);
    var S = T.getState();
    var prevRev = S.reviewer;
    S.reviewer = 'rV'; S.reviewers.rV = {}; S.index = 0;
    T.setEditMode(false);
    T.refreshAssess();
    var col = document.getElementById('pt-assess-col');
    assertEqual(document.getElementById('pt-verdict').textContent, 'Ausgeschlossen durch Expert:innen, Kategorien ergäben Include');
    assertEqual(document.getElementById('pt-decision').textContent, 'Exclude', 'the decision badge stays');
    assert(!col.querySelector('.pt-derived'), 'no separate derived value');
    assert(!col.querySelector('#pt-override'), 'no override switch in Lesen');
    assert(!col.querySelector('.pt-reason-chip'), 'no reason chip in Lesen');

    T.setManifestReachable(true); T.setFsSupported(true);
    T.setEditMode(true);
    T.setWork(T.draftFor(p));
    T.refreshAssess();
    var edit = document.getElementById('pt-verdict-edit');
    assert(edit && edit.tagName === 'DETAILS' && !edit.open, 'override and reason sit behind one closed disclosure');
    assert(edit.querySelector('#pt-override') && edit.querySelector('.pt-reason-chip[data-reason="Consolidated_expert_exclusion"]'), 'both stay editable');
    edit.querySelector('.pt-reason-chip[data-reason="Not_relevant_topic"]').click();
    assertEqual(T.getWork().reason, 'Not_relevant_topic', 'a reason change applies');
    assert(!document.getElementById('pt-verdict'), 'a different reason is no longer the expert statement');
    assert(document.querySelector('#pt-assess-col .pt-derived'), 'the ordinary controls return');
    T.setWork(T.draftFor(p)); T.getWork().reason = 'Consolidated_expert_exclusion';
    T.refreshAssess();
    var ov = document.querySelector('#pt-verdict-edit #pt-override');
    ov.checked = false; ov.dispatchEvent(new window.Event('change'));
    assertEqual(T.workingDecisionRecord().decision, 'Include', 'switching the override off follows the rule');
    T.setEditMode(false);
    T.setManifestReachable(false); T.setFsSupported(undefined);
    delete S.reviewers.rV; S.reviewer = prevRev;
});

test('paper head: the DOI is shown in full and in-text arrows wait for hits', function() {
    var html = T.readingShellHtml({ id: 'doiw', title: 'T', authors: 'A', year: 2022, doi: '10.1080/21670811.2022.2119152' }, null);
    assertContains(html, '<div class="pt-meta-doi"><dt>DOI</dt>', 'the DOI cell is marked for wrapping');
    assertContains(html, '>10.1080/21670811.2022.2119152</a>');
    assert(/id="pt-intext-prev"[^>]*hidden/.test(html) && /id="pt-intext-next"[^>]*hidden/.test(html), 'arrows start hidden');
});

// ============================================================
// Restore localStorage and report
// ============================================================

try {
    if (lsReadable) {
        if (lsBackup === null) localStorage.removeItem(LS_KEY);
        else localStorage.setItem(LS_KEY, lsBackup);
    }
} catch (e) {}

finish();

})();
