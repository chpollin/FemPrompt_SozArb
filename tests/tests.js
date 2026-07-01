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

// localStorage hygiene: commit() persists app state under this key. Snapshot
// before the suite and restore after, so a same-origin PRISM session is not
// polluted when the tests run from a served checkout.
var LS_KEY = 'femprompt-prisma-state/0.2';
var lsBackup = null, lsReadable = false;
try { lsBackup = localStorage.getItem(LS_KEY); lsReadable = true; } catch (e) {}

// ============================================================
// Section A: decision derivation truth table
// ============================================================

test('deriveDecision: empty category set is Exclude', function() {
    assertEqual(T.deriveDecision({}), 'Exclude');
});
test('deriveDecision: technical category alone is Exclude', function() {
    assertEqual(T.deriveDecision({ Prompting: true }), 'Exclude');
});
test('deriveDecision: social category alone is Exclude', function() {
    assertEqual(T.deriveDecision({ Gender: true }), 'Exclude');
});
test('deriveDecision: one technical AND one social category is Include', function() {
    assertEqual(T.deriveDecision({ Prompting: true, Gender: true }), 'Include');
});
test('deriveDecision: falsy category values do not count', function() {
    assertEqual(T.deriveDecision({ Prompting: false, Gender: true }), 'Exclude');
});
test('deriveDecision: all ten categories set is Include', function() {
    var cats = {};
    T.ALL_CATS.forEach(function(c) { cats[c] = true; });
    assertEqual(T.deriveDecision(cats), 'Include');
});
test('deriveDecision: both dimensions at teilweise (level 1) is Unclear', function() {
    assertEqual(T.deriveDecision({ Prompting: 1, Gender: 1 }), 'Unclear');
});
test('deriveDecision: one dimension ja and the other teilweise is Unclear', function() {
    assertEqual(T.deriveDecision({ Prompting: 2, Gender: 1 }), 'Unclear');
});
test('deriveDecision: teilweise in one dimension, nein in the other is Exclude', function() {
    assertEqual(T.deriveDecision({ Prompting: 1 }), 'Exclude');
});
test('deriveDecision: legacy boolean true coerces to ja (level 2)', function() {
    assertEqual(T.deriveDecision({ Prompting: true, Gender: 2 }), 'Include');
});
test('finalDecisionOf: derived Include without override stays Include', function() {
    assertEqual(T.finalDecisionOf({ Prompting: true, Gender: true }, false), 'Include');
});
test('finalDecisionOf: derived Include with override becomes Exclude', function() {
    assertEqual(T.finalDecisionOf({ Prompting: true, Gender: true }, true), 'Exclude');
});
test('finalDecisionOf: from a derived Exclude, override flips to Include (O2, ADR-023)', function() {
    assertEqual(T.finalDecisionOf({ Prompting: true }, false), 'Exclude');
    assertEqual(T.finalDecisionOf({ Prompting: true }, true), 'Include');
    assertEqual(T.finalDecisionOf({}, true), 'Include');
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
    { id: 'f5', title: 'neither track' }
];

test('computeFlow (seed perspective): totals, lanes, no reasons on seed', function() {
    T.setPapers(flowFix);
    var f = T.computeFlow(T.SEED);
    assertEqual(f.total, 5, 'total');
    assertEqual(f.aiScreened, 3, 'aiScreened');
    assertEqual(f.aiIncl, 2, 'aiIncl');
    assertEqual(f.aiExcl, 1, 'aiExcl');
    assertEqual(f.humanScreened, 3, 'humanScreened');
    assertEqual(f.humanIncl, 2, 'humanIncl');
    assertEqual(f.humanExcl, 1, 'humanExcl');
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
    assertEqual(f.humanScreened, 4, 'humanScreened');
    assertEqual(f.humanIncl, 1, 'humanIncl');
    assertEqual(f.humanExcl, 3, 'humanExcl');
    assertEqual(f.humanReasons.Duplicate, 2, 'Duplicate count');
    assertEqual(f.humanReasons.Language, 1, 'Language count');
    assertEqual(f.aiScreened, 3, 'AI lane unchanged by perspective');
    delete T.getState().reviewers.r1;
});
test('computeFlow on an empty corpus returns zeroed lanes', function() {
    T.setPapers([]);
    var f = T.computeFlow(T.SEED);
    assertEqual(f.total, 0); assertEqual(f.aiScreened, 0); assertEqual(f.humanScreened, 0);
    assertEqual(Object.keys(f.humanReasons).length, 0);
});
test('humanDecision / aiProposal / seedDecision return null for missing tracks', function() {
    assertEqual(T.humanDecision({ id: 'x' }, T.SEED), null);
    assertEqual(T.humanDecision({ id: 'x' }, 'unknownReviewer'), null);
    assertEqual(T.aiProposal({ id: 'x' }), null);
    assertEqual(T.seedDecision({ id: 'x' }), null);
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
test('pinEvidence sets the category and truncates term (80) and snippet (260)', function() {
    T.resetWork({ id: 'evPaper' });
    var longTerm = new Array(101 + 1).join('t');     // 101 chars
    var longSnip = new Array(300 + 1).join('s');     // 300 chars
    T.pinEvidence('Gender', longTerm, longSnip);
    var w = T.getWork();
    assertEqual(w.cats.Gender, true, 'category set by pinning');
    assertEqual(w.evidence.Gender.length, 1);
    assertEqual(w.evidence.Gender[0].term.length, 80, 'term truncated');
    assertEqual(w.evidence.Gender[0].snippet.length, 260, 'snippet truncated');
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

test('reviewerPayload carries schema 0.2, reviewer key, decisions', function() {
    T.getState().reviewers.r2 = { x1: { decision: 'Include', categories: {} } };
    var pl = T.reviewerPayload('r2');
    assertEqual(pl.schema, 'femprompt-prisma-reviewer/0.2');
    assertEqual(pl.schema, T.REVIEWER_SCHEMA);
    assertEqual(pl.reviewer, 'r2');
    assertEqual(pl.decisions.x1.decision, 'Include');
    assert(typeof pl.updated === 'string' && pl.updated.length > 0, 'updated timestamp');
    delete T.getState().reviewers.r2;
});
test('reviewerPayload for an unknown reviewer has empty decisions', function() {
    var pl = T.reviewerPayload('nobody');
    assertEqual(Object.keys(pl.decisions).length, 0);
});

var commitFix = [
    { id: 'c1', title: 'commit one' },
    { id: 'c2', title: 'commit two' },
    { id: 'c3', title: 'commit three' }
];

test('commit: derived Include is recorded with no reason', function() {
    T.setPapers(commitFix);
    T.getState().reviewers = {};            // clean slate for the commit tests
    T.getState().reviewer = 'r1';
    T.getState().index = 0;
    T.resetWork(commitFix[0]);
    T.getWork().cats.Prompting = true;
    T.getWork().cats.Gender = true;
    T.commit();
    var rec = T.curDec().c1;
    assert(rec, 'record exists');
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
test('exclusion reason vocabulary is the controlled five-value set', function() {
    assertEqual(T.EXCLUSION_REASONS.join('|'),
        'Duplicate|Not_relevant_topic|Wrong_publication_type|No_full_text|Language');
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

test('pinEvidence stamps human provenance on a reviewer Beleg', function() {
    T.resetWork({ id: 'provPaper' });
    T.pinEvidence('Gender', 'gendered language', 'a snippet about gendered language');
    assertEqual(T.getWork().evidence.Gender[0].origin, 'human');
});
test('evidenceListHtml marks a human Beleg as Mensch and an AI Beleg as KI', function() {
    var ev = {
        Gender: [{ term: 'h', snippet: 'human snippet', origin: 'human' }],
        Prompting: [{ term: 'a', snippet: 'ai snippet', origin: 'ai' }]
    };
    var html = T.evidenceListHtml(ev, true);
    assertContains(html, 'pt-evid-origin-human">Mensch');
    assertContains(html, 'pt-evid-origin-ai">KI');
    assertContains(html, 'human snippet');
    assertContains(html, 'ai snippet');
});
test('evidenceListHtml defaults a Beleg without origin to human (legacy records)', function() {
    var html = T.evidenceListHtml({ Fairness: [{ term: 'x', snippet: 'legacy snippet' }] }, true);
    assertContains(html, 'pt-evid-origin-human">Mensch');
    assertNotContains(html, 'pt-evid-origin-ai');
});
test('evidenceListHtml renders both origins through the same neutral marker class', function() {
    var ev = {
        Gender: [{ term: 'h', snippet: 's1', origin: 'human' }],
        Prompting: [{ term: 'a', snippet: 's2', origin: 'ai' }]
    };
    var html = T.evidenceListHtml(ev, true);
    // both Belege carry the shared base class; only the identity modifier differs (no better/worse)
    assertEqual(html.split('class="pt-evid-origin ').length - 1, 2, 'both Belege share the pt-evid-origin marker');
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
test('a human-origin Beleg sets the binding category, an AI-origin Beleg does not', function() {
    var tc = T.TECH_CATS[0], sc = T.SOCIAL_CATS[0];
    T.resetWork({ id: 'm3Paper' });
    T.pinEvidence(tc, 'tech term', 'tech snippet', 'human');
    assertEqual(T.getWork().cats[tc], true, 'paper-sourced Beleg sets the binding category');
    T.pinEvidence(sc, 'soc term', 'soc snippet', 'ai');
    assert(!T.getWork().cats[sc], 'AI-sourced Beleg leaves the binding category unset');
});
test('AI-sourced evidence alone never flips the binding decision to Include', function() {
    var tc = T.TECH_CATS[0], sc = T.SOCIAL_CATS[0];
    T.resetWork({ id: 'm3Paper2' });
    T.pinEvidence(tc, 'tech term', 'tech snippet', 'human'); // one technical dimension, human
    T.pinEvidence(sc, 'soc term', 'soc snippet', 'ai');      // social dimension AI-sourced only
    assertEqual(T.finalDecisionOf(T.getWork().cats, false), 'Exclude', 'tech human + social AI stays Exclude');
    T.pinEvidence(sc, 'soc term 2', 'soc snippet 2', 'human'); // now a human social Beleg
    assertEqual(T.finalDecisionOf(T.getWork().cats, false), 'Include', 'tech + social both human derive Include');
});
test('an AI-origin Beleg is stored, rendered as KI, and stays advisory', function() {
    var sc = T.SOCIAL_CATS[0];
    T.resetWork({ id: 'm3Paper3' });
    T.pinEvidence(sc, 'ai soc', 'ai social snippet', 'ai');
    var w = T.getWork();
    assertEqual(w.evidence[sc][0].origin, 'ai');
    assert(!w.cats[sc], 'AI Beleg does not set the category');
    assertContains(T.evidenceListHtml(w.evidence, false), 'pt-evid-origin-ai">KI');
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

test('import bridge test hook is exposed (harness loads prisma-import.js)', function() {
    assert(IMP && IMP.convert && IMP.parseCsv && IMP.mapHeader, 'window.__PRISMA_IMPORT_TEST__ present');
});
test('import: a clean Include row is added with no error-level findings', function() {
    var res = runImport('P1,Nein,Ja,Nein,Nein,Ja,Nein,Nein,Nein,Nein,Nein,Include,');
    assertEqual(res.stats.added, 1);
    assert(res.payload.decisions.P1, 'P1 recorded');
    assertEqual(res.payload.decisions.P1.decision, 'Include');
    assertEqual(res.report.filter(function(it) { return it.level === 'error'; }).length, 0, 'no error-level findings');
});
test('import: an out-of-vocabulary exclusion reason is flagged and preserved verbatim', function() {
    var res = runImport('P2,Nein,Ja,Nein,Nein,Nein,Nein,Nein,Nein,Nein,Nein,Exclude,Other');
    assertContains(reportKinds(res), 'Ausschlussgrund ausserhalb des Vokabulars');
    assertEqual(res.payload.decisions.P2.reason, 'Other', 'unknown reason preserved verbatim');
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
test('import: an Unclear decision is not representable and is skipped', function() {
    var res = runImport('P5,Nein,Ja,Nein,Nein,Ja,Nein,Nein,Nein,Nein,Nein,Unclear,');
    assertContains(reportKinds(res), 'Decision Unclear');
    assertEqual(res.payload.decisions.P5, undefined, 'Unclear row not recorded');
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

test('reviewer schema 0.1 to 0.2: a pre-evidence file loads and behaves as 0.2', function() {
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
    assertEqual(T.computeFlow('old').humanScreened, 2, 'both 0.1 decisions counted');
    assertEqual(T.evidenceCount(file.decisions.mg1), 0, 'missing evidence map reads as zero, no throw');
    // a legacy Beleg without origin renders as a human pin (ADR-015 backward compatibility)
    var html = T.evidenceListHtml(file.decisions.mg2.evidence, true);
    assertContains(html, 'pt-evid-origin-human">Mensch');
    assertNotContains(html, 'pt-evid-origin-ai');
    // re-exporting stamps the current schema, completing the upgrade to 0.2
    assertEqual(T.reviewerPayload('old').schema, 'femprompt-prisma-reviewer/0.2');
    delete S.reviewers.old;
});

// FR-05: the real served seed reproduces the benchmark marginals. The headless runner
// injects docs/data/research_vault_v2.json as window.__SEED_PAPERS__ (the app fetches it
// at runtime; headless has no network). kappa and the matrix are not asserted here.
if (window.__SEED_PAPERS__ && window.__SEED_PAPERS__.length) {
    test('FR-05: the real seed reproduces the canonical benchmark marginals', function() {
        T.setPapers(window.__SEED_PAPERS__);
        var f = T.computeFlow(T.SEED);
        assertEqual(f.total, 326, 'corpus size');
        assertEqual(f.aiScreened, 326, 'AI track covers all identified records');
        assertEqual(f.aiIncl, 232, 'AI Include');
        assertEqual(f.aiExcl, 94, 'AI Exclude');
        assertEqual(f.humanScreened, 291, 'human track on the paired subset');
        assertEqual(f.humanIncl, 134, 'human Include within the paired subset');
        assertEqual(f.humanExcl, 157, 'human Exclude within the paired subset');
        T.setPapers([]);
    });
}

// ============================================================
// Section H: Git provenance (ADR-021): deterministic file, commit message
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
test('commitMessage summarizes the session counts and exclusion reasons', function() {
    T.getState().reviewers.rCM = {
        p1: { decision: 'Include' }, p2: { decision: 'Include' },
        p3: { decision: 'Exclude', reason: 'Duplicate' }, p4: { decision: 'Exclude', reason: 'Duplicate' }
    };
    const prevReviewer = T.getState().reviewer;
    T.getState().reviewer = 'rCM';
    const msg = T.commitMessage();
    assertContains(msg, '4 Paper bewertet (2 Include, 2 Exclude)');
    assertContains(msg, 'Reviewer-Datei: rCM.json');
    assertContains(msg, 'Duplicate 2');
    delete T.getState().reviewers.rCM;
    T.getState().reviewer = prevReviewer;
});

// ============================================================
// Section I: accessibility (Cut 3) and screenable entry (O4)
// ============================================================

test('chipHtml exposes the three-level state as the accessible name and keeps slug/definition decorative', function() {
    var ja = T.chipHtml('AI_Literacies', true, false);
    assertContains(ja, ', ja"');
    assertContains(ja, 'data-level="2"');
    var nein = T.chipHtml('AI_Literacies', false, false);
    assertContains(nein, ', nein"');
    assertContains(nein, 'data-level="0"');
    var teil = T.chipHtml('AI_Literacies', 1, false);
    assertContains(teil, ', teilweise"');
    assertContains(teil, 'data-level="1"');
    // the checkbox stays decorative; the definition reaches AT via the described-by tip,
    // not a native title (which had doubled the styled tip)
    assertContains(nein, 'class="pt-chip-box" aria-hidden="true"');
    assertContains(nein, 'aria-describedby="pt-chip-tip-AI_Literacies"');
    assert(nein.indexOf('title="') === -1, 'no native title on the chip');
});

test('statusLabel maps the colour-coded decision state to a text equivalent', function() {
    assertEqual(T.statusLabel('include'), 'eingeschlossen');
    assertEqual(T.statusLabel('exclude'), 'ausgeschlossen');
    assertEqual(T.statusLabel('none'), 'offen');
});

test('corpusListHtml hides the colour dot from AT and gives the status a text equivalent', function() {
    T.setPapers([{ id: 'pCL', title: 'X', author_year: 'A 2020' }]);
    var prevRev = T.getState().reviewer;
    T.getState().reviewer = 'rCL'; T.getState().reviewers.rCL = {};
    var html = T.corpusListHtml();
    assertContains(html, 'pt-nav-dot pt-dot-none" aria-hidden="true"');
    assertContains(html, '<span class="pt-sr-only">offen</span>');
    delete T.getState().reviewers.rCL;
    T.getState().reviewer = prevRev;
});

test('firstEntryIndex skips a boilerplate first paper and opens on a screenable one (O4)', function() {
    T.setPapers([
        { id: 'b1', abstract: 'Founded in 1920, the NBER is a private, non-profit, non-partisan organization.' },
        { id: 'g1', knowledge_doc: 'data/x.md', abstract: '' }
    ]);
    assert(!T.isScreenable({ id: 'b1', abstract: 'Founded in 1920, the NBER is a private, non-profit, non-partisan organization.' }), 'NBER boilerplate is not screenable');
    assert(T.isScreenable({ id: 'g1', knowledge_doc: 'data/x.md' }), 'a paper with a knowledge document is screenable');
    var prevRev = T.getState().reviewer;
    T.getState().reviewer = 'rFE'; T.getState().reviewers.rFE = {};
    assertEqual(T.firstEntryIndex(), 1, 'lands on the screenable paper, not the boilerplate');
    T.getState().reviewers.rFE = { g1: { decision: 'Include' } };
    assertEqual(T.firstEntryIndex(), 1, 'falls back to the only screenable paper when it is already decided');
    delete T.getState().reviewers.rFE;
    T.getState().reviewer = prevRev;
});

test('editRecord rehydrates work and keeps the committed decision until re-commit (no data loss on revise)', function() {
    T.setPapers([{ id: 'pED', title: 'X', knowledge_doc: 'd.md' }]);
    var prevRev = T.getState().reviewer;
    T.getState().reviewer = 'rED'; T.getState().reviewers.rED = {}; T.getState().index = 0;
    T.curDec().pED = {
        categories: { AI_Literacies: true, Soziale_Arbeit: true }, decision: 'Include',
        override: false, reason: null, evidence: { AI_Literacies: [{ term: 't', snippet: 's', origin: 'human' }] }
    };
    T.editRecord({ id: 'pED' });
    var w = T.getWork();
    assertEqual(w.pid, 'pED', 'work is bound to the edited paper');
    assert(w.cats.AI_Literacies && w.cats.Soziale_Arbeit, 'categories are rehydrated into work, not blanked');
    assertEqual((w.evidence.AI_Literacies || []).length, 1, 'evidence is rehydrated into work');
    assert(!!T.curDec().pED, 'the committed decision survives the edit (no eager delete)');
    delete T.getState().reviewers.rED;
    T.getState().reviewer = prevRev;
});

test('finalDecisionOf: override flips the derived decision in both directions (O2, ADR-023)', function() {
    var inc = { AI_Literacies: true, Soziale_Arbeit: true }; // >=1 Gegenstand AND >=1 Perspektive
    assertEqual(T.finalDecisionOf(inc, false), 'Include');
    assertEqual(T.finalDecisionOf(inc, true), 'Exclude', 'override flips Include to Exclude');
    var exc = { AI_Literacies: true }; // only one group -> derived Exclude
    assertEqual(T.finalDecisionOf(exc, false), 'Exclude');
    assertEqual(T.finalDecisionOf(exc, true), 'Include', 'override flips Exclude to Include');
});

test('commit records the trimmed override justification on an override to Include (O2)', function() {
    T.setPapers([{ id: 'pO2', title: 'X', knowledge_doc: 'd.md' }]);
    var prevRev = T.getState().reviewer;
    T.getState().reviewer = 'rO2'; T.getState().reviewers.rO2 = {}; T.getState().index = 0;
    T.resetWork({ id: 'pO2' });
    var w = T.getWork();
    w.cats = { AI_Literacies: true }; w.override = true; w.overrideReason = '  relevant trotz duennem Text  ';
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

test('a chip click cycles nein/teilweise/ja and re-renders the derived decision (ADR-024)', function() {
    mountAssessCol();
    var tech = T.TECH_CATS[0], soc = T.SOCIAL_CATS[0];
    T.setPapers([{ id: 'pJ1', title: 'X' }]);
    var prevRev = T.getState().reviewer;
    T.getState().reviewer = 'rJ'; T.getState().reviewers.rJ = {}; T.getState().index = 0;
    T.resetWork({ id: 'pJ1' });
    T.refreshAssess(); // renders chips + the derived pill and binds the click handlers

    function chip(cat) { return document.querySelector('#pt-assess-col .pt-chip[data-cat="' + cat + '"]'); }
    function derived() { return document.querySelector('#pt-assess-col .pt-logic-row .pt-pill').textContent; }

    assert(chip(tech), 'a technical chip is rendered and clickable');
    assertEqual(derived(), 'Exclude', 'empty set derives Exclude');

    chip(tech).click();                                  // tech -> teilweise (1)
    assertEqual(T.getWork().cats[tech], 1, 'first click sets teilweise');
    assertEqual(chip(tech).dataset.level, '1', 're-rendered chip shows level 1');
    assertEqual(derived(), 'Exclude', 'one dimension teilweise is still Exclude');

    chip(soc).click();                                   // soc -> teilweise (1)
    assertEqual(derived(), 'Unclear', 'both dimensions teilweise derives Unclear');

    chip(tech).click();                                  // tech -> ja (2)
    assertEqual(T.getWork().cats[tech], 2, 'second click sets ja');
    assertEqual(derived(), 'Unclear', 'ja plus teilweise is still Unclear');

    chip(soc).click();                                   // soc -> ja (2)
    assertEqual(derived(), 'Include', 'both dimensions ja derives Include');

    chip(tech).click();                                  // tech -> nein (0), wraps
    assertEqual(T.getWork().cats[tech], 0, 'third click wraps to nein');
    assertEqual(derived(), 'Exclude', 'dropping a dimension to nein derives Exclude');

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
    document.querySelector('#pt-assess-col .pt-chip[data-cat="' + tech + '"]').click();
    assertEqual(T.getWork().override, false, 'the flip clears the stale override');
    assert(!T.getWork().overrideReason, 'and its justification');

    delete T.getState().reviewers.rJ2;
    T.getState().reviewer = prevRev;
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
