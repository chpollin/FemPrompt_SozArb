// PRISM pure-function tests (plan P1 test fundament).
// Zero-dependency browser suite, loaded by tests/run-tests.html after
// docs/js/prisma-data.js (provides the real window.EC.escapeHtml) and
// docs/js/prisma.js (whose appended exposure block provides window.EC._test).
// All fixtures are inline; nothing here fetches anything.
//
// Expected agreement values are taken from knowledge/verification-empirical-core.md:
//   "Benchmark core (Haiku 4.5, abstract input)" table:
//     confusion matrix 100/34/108/49 (II/IE/EI/EE), n 291,
//     human include 134/291 = 0.4605, LLM include 208/291 = 0.7148,
//     po 149/291 = 0.5120, Cohen kappa 0.0561, PABAK 0.0241,
//     kappa-max 0.5081, prevalence index 0.175, bias index 0.254.
//   "Sensitivity: content-only benchmark" table, Haiku + Abstract row:
//     n 199, cells 100/34/36/29, kappa 0.194, PABAK 0.296.

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
// Fixtures
// ============================================================

// Synthetic corpus realizing a given human-by-LLM confusion matrix when read
// from the seed perspective (paper.human binding, paper.llm advisory).
function matrixFixture(II, IE, EI, EE) {
    var ps = [], n = 0, i;
    function mk(h, a) {
        n++;
        return { id: 'fx' + n, title: 'Fixture paper ' + n,
                 human: { decision: h, all_categories: {} },
                 llm: { decision: a, all_categories: {} } };
    }
    for (i = 0; i < II; i++) ps.push(mk('Include', 'Include'));
    for (i = 0; i < IE; i++) ps.push(mk('Include', 'Exclude'));
    for (i = 0; i < EI; i++) ps.push(mk('Exclude', 'Include'));
    for (i = 0; i < EE; i++) ps.push(mk('Exclude', 'Exclude'));
    return ps;
}

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
test('finalDecisionOf: derived Include without override stays Include', function() {
    assertEqual(T.finalDecisionOf({ Prompting: true, Gender: true }, false), 'Include');
});
test('finalDecisionOf: derived Include with override becomes Exclude', function() {
    assertEqual(T.finalDecisionOf({ Prompting: true, Gender: true }, true), 'Exclude');
});
test('finalDecisionOf: derived Exclude stays Exclude regardless of override', function() {
    assertEqual(T.finalDecisionOf({ Prompting: true }, false), 'Exclude');
    assertEqual(T.finalDecisionOf({ Prompting: true }, true), 'Exclude');
    assertEqual(T.finalDecisionOf({}, true), 'Exclude');
});
test('divergent: differing decisions are divergent, equal or missing tracks are not', function() {
    assert(T.divergent({ decision: 'Include' }, { decision: 'Exclude' }) === true, 'Include vs Exclude');
    assert(!T.divergent({ decision: 'Include' }, { decision: 'Include' }), 'same decision');
    assert(!T.divergent(null, { decision: 'Include' }), 'missing human track');
    assert(!T.divergent({ decision: 'Include' }, null), 'missing AI track');
});

// ============================================================
// Section B: agreement metrics on the canonical benchmark matrix
// Expected values: knowledge/verification-empirical-core.md, Benchmark core table.
// ============================================================

var bench = matrixFixture(100, 34, 108, 49);

test('benchmark fixture has 291 papers (100+34+108+49)', function() {
    assertEqual(bench.length, 291);
});
test('computeMatrix reproduces the canonical matrix 100/34/108/49, n 291', function() {
    T.setPapers(bench);
    var m = T.computeMatrix(T.SEED);
    assertEqual(m.II, 100, 'II'); assertEqual(m.IE, 34, 'IE');
    assertEqual(m.EI, 108, 'EI'); assertEqual(m.EE, 49, 'EE');
    assertEqual(m.n, 291, 'n');
});
test('marginals: human include 134, LLM include 208 (rates 46.0 / 71.5 percent)', function() {
    T.setPapers(bench);
    var m = T.computeMatrix(T.SEED);
    assertEqual(m.II + m.IE, 134, 'human includes');
    assertEqual(m.II + m.EI, 208, 'LLM includes');
    assertEqual((Math.round((m.II + m.IE) / m.n * 1000) / 10), 46, 'human include rate');
    assertEqual((Math.round((m.II + m.EI) / m.n * 1000) / 10), 71.5, 'LLM include rate');
});
test('observed agreement po = 149/291 = 0.5120', function() {
    T.setPapers(bench);
    var m = T.computeMatrix(T.SEED);
    assertEqual((((m.II + m.EE) / m.n)).toFixed(4), '0.5120');
});
test('Cohen kappa on the benchmark matrix is 0.0561', function() {
    T.setPapers(bench);
    var k = T.cohenKappa(T.computeMatrix(T.SEED));
    assertEqual(k.toFixed(4), '0.0561');
    assertEqual(k.toFixed(3), '0.056');
});
test('PABAK (2po - 1, derived in-test) on the benchmark matrix is 0.0241', function() {
    // PABAK is not implemented in prisma.js; recomputed here from the verified
    // matrix with the formula documented in verification-empirical-core.md.
    T.setPapers(bench);
    var m = T.computeMatrix(T.SEED);
    var po = (m.II + m.EE) / m.n;
    assertEqual((2 * po - 1).toFixed(4), '0.0241');
});
test('kappa-max given the marginals (derived in-test) is 0.5081', function() {
    T.setPapers(bench);
    var m = T.computeMatrix(T.SEED);
    var ph = (m.II + m.IE) / m.n, pa = (m.II + m.EI) / m.n;
    var pe = ph * pa + (1 - ph) * (1 - pa);
    var poMax = 1 - Math.abs(ph - pa);
    assertEqual(((poMax - pe) / (1 - pe)).toFixed(4), '0.5081');
});
test('prevalence index 0.175 and bias index 0.254 (derived in-test)', function() {
    T.setPapers(bench);
    var m = T.computeMatrix(T.SEED);
    assertEqual((Math.abs(m.II - m.EE) / m.n).toFixed(3), '0.175', 'prevalence index');
    assertEqual((Math.abs(m.IE - m.EI) / m.n).toFixed(3), '0.254', 'bias index');
});
test('content-only sensitivity matrix 100/34/36/29 (n 199): kappa 0.194, PABAK 0.296', function() {
    var contentOnly = matrixFixture(100, 34, 36, 29);
    T.setPapers(contentOnly);
    var m = T.computeMatrix(T.SEED);
    assertEqual(m.n, 199, 'n');
    assertEqual(T.cohenKappa(m).toFixed(3), '0.194', 'kappa');
    var po = (m.II + m.EE) / m.n;
    assertEqual((2 * po - 1).toFixed(3), '0.296', 'PABAK');
});
test('computeMatrix skips papers missing either track', function() {
    var ps = matrixFixture(1, 0, 0, 0);
    ps.push({ id: 'onlyAI', llm: { decision: 'Include' } });
    ps.push({ id: 'onlyHuman', human: { decision: 'Include' } });
    ps.push({ id: 'neither', title: 'no tracks' });
    T.setPapers(ps);
    var m = T.computeMatrix(T.SEED);
    assertEqual(m.n, 1);
    assertEqual(m.II, 1);
});
test('computeMatrix with a reviewer-track perspective', function() {
    var ps = [
        { id: 'rv1', llm: { decision: 'Include' } },
        { id: 'rv2', llm: { decision: 'Exclude' } }
    ];
    T.setPapers(ps);
    T.getState().reviewers.r1 = {
        rv1: { decision: 'Exclude', reason: 'Duplicate', categories: {} },
        rv2: { decision: 'Exclude', reason: 'Not_relevant_topic', categories: {} }
    };
    var m = T.computeMatrix('r1');
    assertEqual(m.n, 2); assertEqual(m.EI, 1); assertEqual(m.EE, 1);
    delete T.getState().reviewers.r1;
});

// kappa edge cases (division-by-zero and degenerate-marginal guards)
test('cohenKappa: empty matrix (n = 0) returns 0', function() {
    assertEqual(T.cohenKappa({ II: 0, IE: 0, EI: 0, EE: 0, n: 0 }), 0);
});
test('cohenKappa: all both-include (pe = 1 guard) returns 1', function() {
    assertEqual(T.cohenKappa({ II: 5, IE: 0, EI: 0, EE: 0, n: 5 }), 1);
});
test('cohenKappa: all both-exclude (pe = 1 guard) returns 1', function() {
    assertEqual(T.cohenKappa({ II: 0, IE: 0, EI: 0, EE: 5, n: 5 }), 1);
});
test('kappaLabel boundaries (Landis-Koch bands as implemented)', function() {
    assertEqual(T.kappaLabel(-0.01), 'poor');
    assertEqual(T.kappaLabel(0), 'slight');
    assertEqual(T.kappaLabel(0.20), 'slight');
    assertEqual(T.kappaLabel(0.21), 'fair');
    assertEqual(T.kappaLabel(0.40), 'fair');
    assertEqual(T.kappaLabel(0.41), 'moderate');
    assertEqual(T.kappaLabel(0.60), 'moderate');
    assertEqual(T.kappaLabel(0.61), 'substantial');
    assertEqual(T.kappaLabel(0.80), 'substantial');
    assertEqual(T.kappaLabel(0.81), 'almost perfect');
});

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
test('disclosureMarkdown reports the canonical kappa and matrix on the benchmark fixture', function() {
    T.setPapers(bench);
    T.getState().perspective = T.SEED;
    var md = T.disclosureMarkdown();
    assertContains(md, 'Screening of 291 records');
    assertContains(md, 'Cohen kappa 0.056');
    assertContains(md, '100/34/108/49');
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
