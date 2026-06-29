#!/usr/bin/env python3
"""Replay self-test for the FemPrompt benchmark core (plan R2).

Independently re-pairs the raw human and LLM assessment CSVs by Zotero_Key and
asserts the canonical benchmark numbers the paper, the AI disclosure, and the
Evidence Companion lean on: the 291-pair confusion matrix 100/34/108/49, Cohen
kappa 0.0561, the content-only sensitivity (n=199, matrix 100/34/36/29, kappa
0.1940), and the resolution of the 292-vs-291 pairing discrepancy (a stray
Has_HA flag on one key in papers_full.csv, not a missing human decision).

This is a regression guard, not the human-readable recomputation: verify_femprompt.py
prints the full adversarial recompute, this file fails loudly (exit 1) the moment
a raw-CSV edit moves a canonical number. Expectations trace to
knowledge/verification.md (Part 1, V1). Run: python replay_selftest.py
"""
import csv, os, sys

DATA = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data"))

# canonical expectations (knowledge/verification.md, Part 1, V1)
EXPECT = {
    'human_rows': 303, 'human_incl': 142, 'human_excl': 161,
    'llm_rows': 326, 'llm_incl': 232, 'llm_excl': 94,
    'paired': 291, 'human_only': 12, 'llm_only': 35,
    'matrix': (100, 34, 108, 49),       # II, IE, EI, EE  (human x llm)
    'kappa': 0.0561, 'po': 0.5120,
    'sens_n': 199, 'sens_matrix': (100, 34, 36, 29), 'sens_kappa': 0.1940,
    'papers_full_has_ha': 292, 'phantom_key': '2YS85B49',
}
# human exclusion reasons the LLM had no information basis to replicate
NONCONTENT = {'duplicate', 'no full text', 'no_full_text',
              'wrong publication type', 'wrong_publication_type'}


def norm_dec(v):
    v = (v or '').strip().lower()
    if v in ('include', 'included', 'yes', '1'): return 'Include'
    if v in ('exclude', 'excluded', 'no', '0'): return 'Exclude'
    return ''


def load(fname):
    with open(os.path.join(DATA, fname), encoding='utf-8-sig', newline='') as f:
        return list(csv.DictReader(f))


def keyed(rows):
    d = {}
    for r in rows:
        k = (r.get('Zotero_Key') or '').strip()
        if k: d[k] = r
    return d


def kappa(pairs):
    n = len(pairs)
    if not n: return 0.0
    po = sum(1 for a, b in pairs if a == b) / n
    labels = {x for p in pairs for x in p}
    pe = sum((sum(1 for a, _ in pairs if a == l) / n) *
             (sum(1 for _, b in pairs if b == l) / n) for l in labels)
    return 1.0 if pe == 1 else (po - pe) / (1 - pe)


def matrix(pairs):
    c = {'II': 0, 'IE': 0, 'EI': 0, 'EE': 0}
    for h, l in pairs:
        c[('I' if h == 'Include' else 'E') + ('I' if l == 'Include' else 'E')] += 1
    return (c['II'], c['IE'], c['EI'], c['EE'])


CHECKS = []
def check(name, got, want):
    CHECKS.append((got == want, name, got, want))
def check_close(name, got, want, tol=5e-5):
    CHECKS.append((abs(got - want) < tol, name, round(got, 4), want))


human = keyed(load('human_assessment.csv'))
llm = keyed(load('llm_assessment_10k.csv'))
hdec = [norm_dec(r.get('Decision')) for r in human.values()]
ldec = [norm_dec(r.get('Decision')) for r in llm.values()]
check('human rows', len(human), EXPECT['human_rows'])
check('human Include', hdec.count('Include'), EXPECT['human_incl'])
check('human Exclude', hdec.count('Exclude'), EXPECT['human_excl'])
check('llm rows', len(llm), EXPECT['llm_rows'])
check('llm Include', ldec.count('Include'), EXPECT['llm_incl'])
check('llm Exclude', ldec.count('Exclude'), EXPECT['llm_excl'])

both = sorted(set(human) & set(llm))
check('paired by Zotero_Key', len(both), EXPECT['paired'])
check('human-only', len(set(human) - set(llm)), EXPECT['human_only'])
check('llm-only', len(set(llm) - set(human)), EXPECT['llm_only'])

pairs = [(norm_dec(human[k].get('Decision')), norm_dec(llm[k].get('Decision'))) for k in both]
pairs = [(h, l) for h, l in pairs if h and l]
check('decision pairs', len(pairs), EXPECT['paired'])
check('confusion matrix II/IE/EI/EE', matrix(pairs), EXPECT['matrix'])
check_close('Cohen kappa', kappa(pairs), EXPECT['kappa'])
check_close('observed agreement po', sum(1 for a, b in pairs if a == b) / len(pairs), EXPECT['po'])

# content-only sensitivity: drop human Excludes with a corpus-management reason
sens = []
for k in both:
    h = norm_dec(human[k].get('Decision')); l = norm_dec(llm[k].get('Decision'))
    if not (h and l): continue
    reason = (human[k].get('Exclusion_Reason') or '').strip().lower()
    if h == 'Exclude' and reason in NONCONTENT: continue
    sens.append((h, l))
check('sensitivity n', len(sens), EXPECT['sens_n'])
check('sensitivity matrix II/IE/EI/EE', matrix(sens), EXPECT['sens_matrix'])
check_close('sensitivity kappa', kappa(sens), EXPECT['sens_kappa'])

# 292-vs-291: papers_full.csv flags 292 Has_HA=Yes; the surplus key is a stray
# flag absent from the human CSV, so 291 real pairings stand (no paper is missing).
pf = keyed(load('papers_full.csv'))
has_ha = {k for k, r in pf.items() if (r.get('Has_HA') or '').strip().lower() in ('yes', 'ja', 'true', '1')}
check('papers_full Has_HA=Yes', len(has_ha), EXPECT['papers_full_has_ha'])
check('Has_HA surplus over human CSV', sorted(has_ha - set(human)), [EXPECT['phantom_key']])

passed = sum(1 for ok, *_ in CHECKS if ok)
for ok, name, got, want in CHECKS:
    print(('ok    %-34s %r' % (name, got)) if ok
          else ('FAIL  %-34s got %r  want %r' % (name, got, want)))
print('\n%s %d/%d  replay self-test (benchmark core, plan R2)' %
      ('PASS' if passed == len(CHECKS) else 'FAIL', passed, len(CHECKS)))
sys.exit(0 if passed == len(CHECKS) else 1)
