#!/usr/bin/env python3
"""Independent adversarial recomputation for FemPrompt_SozArb benchmark claims.
Reads ONLY raw assessment CSVs, pairs by Zotero_Key itself, recomputes everything."""
import csv, json, sys, os
from collections import Counter

# repo-relative: this script lives in benchmark/scripts/, the CSVs in benchmark/data/
DATA = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data"))

CATEGORIES = ['AI_Literacies', 'Generative_KI', 'Prompting', 'KI_Sonstige',
              'Soziale_Arbeit', 'Bias_Ungleichheit', 'Gender', 'Diversitaet',
              'Feministisch', 'Fairness']

def norm_val(v):
    if v is None: return ''
    v = str(v).strip().lower()
    if v in ('ja','yes','1','true','x'): return 'Ja'
    if v in ('nein','no','0','false',''): return 'Nein'
    return 'OTHER:' + v

def norm_dec(v):
    if v is None: return ''
    v = str(v).strip().lower()
    if v in ('include','included','yes','1'): return 'Include'
    if v in ('exclude','excluded','no','0'): return 'Exclude'
    if v in ('unclear','maybe','?'): return 'Unclear'
    if v == '': return ''
    return 'OTHER:' + v

def load(fname):
    path = os.path.join(DATA, fname)
    rows = []
    with open(path, encoding='utf-8-sig', newline='') as f:
        r = csv.DictReader(f)
        fields = r.fieldnames
        for row in r:
            rows.append(row)
    return fields, rows

def keyed(rows):
    d = {}
    dups = []
    empty = 0
    for row in rows:
        k = (row.get('Zotero_Key') or '').strip()
        if not k:
            empty += 1
            continue
        if k in d:
            dups.append(k)
        d[k] = row
    return d, dups, empty

def kappa(a, b):
    n = len(a)
    if n == 0: return None
    po = sum(1 for x, y in zip(a, b) if x == y) / n
    labels = set(a) | set(b)
    pe = sum((sum(1 for x in a if x == l)/n) * (sum(1 for y in b if y == l)/n) for l in labels)
    if pe == 1.0: return 1.0 if po == 1.0 else 0.0
    return (po - pe) / (1 - pe)

def pabak(a, b):
    n = len(a)
    if n == 0: return None
    po = sum(1 for x, y in zip(a, b) if x == y) / n
    return 2*po - 1

def get_cat(row, cat):
    v = row.get(cat)
    if v is None and cat == 'Diversitaet':
        v = row.get('Diversitaet / Intersektionalität')
        if v is None:
            v = row.get('Diversitaet / Intersektionalitaet')
    return norm_val(v)

hf, hrows = load('human_assessment.csv')
print("HUMAN cols:", hf)
print("HUMAN data rows:", len(hrows))
hk, hdups, hempty = keyed(hrows)
print("HUMAN unique keys:", len(hk), "| duplicate keys:", hdups, "| empty-key rows:", hempty)
hdec_raw = Counter((r.get('Decision') or '').strip() for r in hk.values())
print("HUMAN raw Decision values:", dict(hdec_raw))
# reviewer-related columns?
print("HUMAN columns possibly reviewer-related:", [c for c in hf if 'review' in c.lower() or 'rater' in c.lower() or 'person' in c.lower()])
print()

def analyze(llm_file, label):
    lf, lrows = load(llm_file)
    lk, ldups, lempty = keyed(lrows)
    print("=== %s (%s) ===" % (label, llm_file))
    print("rows:", len(lrows), "unique keys:", len(lk), "dup keys:", ldups, "empty-key rows:", lempty)
    ldec_raw = Counter((r.get('Decision') or '').strip() for r in lk.values())
    print("raw Decision values:", dict(ldec_raw))
    both = sorted(set(hk) & set(lk))
    only_h = set(hk) - set(lk)
    only_l = set(lk) - set(hk)
    print("paired by Zotero_Key:", len(both), "| human-only:", len(only_h), "| llm-only:", len(only_l))
    # decision pairs (both non-empty after normalization)
    pairs = []
    dropped = 0
    for k in both:
        hd = norm_dec(hk[k].get('Decision'))
        ld = norm_dec(lk[k].get('Decision'))
        if hd and ld:
            pairs.append((k, hd, ld))
        else:
            dropped += 1
    print("decision pairs (both decisions present):", len(pairs), "| dropped (missing decision):", dropped)
    h = [p[1] for p in pairs]; l = [p[2] for p in pairs]
    cm = Counter(zip(h, l))
    print("confusion: II=%d IE=%d EI=%d EE=%d others=%s" % (
        cm.get(('Include','Include'),0), cm.get(('Include','Exclude'),0),
        cm.get(('Exclude','Include'),0), cm.get(('Exclude','Exclude'),0),
        {k_: v for k_, v in cm.items() if set(k_) - {'Include','Exclude'}}))
    n = len(pairs)
    hi = sum(1 for x in h if x == 'Include'); li = sum(1 for x in l if x == 'Include')
    print("human include: %d/%d = %.4f | llm include: %d/%d = %.4f" % (hi, n, hi/n, li, n, li/n))
    po = sum(1 for x, y in zip(h, l) if x == y)/n
    print("observed agreement po = %.4f" % po)
    print("Cohen kappa = %.4f | PABAK = %.4f" % (kappa(h, l), pabak(h, l)))
    # human exclusion reasons within the Exclude/Include disagreement cell
    ei_reasons = Counter()
    for k, hd, ld in pairs:
        if hd == 'Exclude' and ld == 'Include':
            ei_reasons[(hk[k].get('Exclusion_Reason') or '').strip() or '(empty)'] += 1
    print("human Exclusion_Reason in Human-Exclude/LLM-Include cell:", dict(ei_reasons.most_common()))
    all_excl_reasons = Counter((hk[k].get('Exclusion_Reason') or '').strip() or '(empty)'
                               for k, hd, ld in pairs if hd == 'Exclude')
    print("human Exclusion_Reason among all paired human Excludes:", dict(all_excl_reasons.most_common()))
    # Input_Source distribution (KD conditions)
    src = Counter((lk[k].get('Input_Source') or '(none)') for k in both)
    print("LLM Input_Source distribution among paired papers:", dict(src))
    # prevalence/bias indices and kappa_max
    a = cm.get(('Include','Include'),0); b_ = cm.get(('Include','Exclude'),0)
    c_ = cm.get(('Exclude','Include'),0); d_ = cm.get(('Exclude','Exclude'),0)
    if n:
        pi_ = abs(a - d_)/n; bi = (b_ - c_)/n
        print("prevalence index = %.4f | bias index = %.4f" % (pi_, bi))
        # kappa_max given marginals
        h_inc = a + b_; l_inc = a + c_
        po_max = (min(h_inc, l_inc) + min(n - h_inc, n - l_inc))/n
        pe = (h_inc/n)*(l_inc/n) + ((n-h_inc)/n)*((n-l_inc)/n)
        print("kappa_max given marginals = %.4f (po_max=%.4f, pe=%.4f)" % ((po_max-pe)/(1-pe), po_max, pe))
    # sensitivity: drop human excludes with non-content reasons (Duplicate, No full text, Wrong publication type)
    NONCONTENT = {'duplicate', 'no full text', 'no_full_text', 'wrong publication type', 'wrong_publication_type'}
    sens = [(k, hd, ld) for k, hd, ld in pairs
            if not (hd == 'Exclude' and (hk[k].get('Exclusion_Reason') or '').strip().lower() in NONCONTENT)]
    hs = [p[1] for p in sens]; ls = [p[2] for p in sens]
    cms = Counter(zip(hs, ls))
    ns = len(sens)
    if ns:
        print("SENSITIVITY (non-content human excludes removed): n=%d" % ns)
        print("  confusion: II=%d IE=%d EI=%d EE=%d" % (
            cms.get(('Include','Include'),0), cms.get(('Include','Exclude'),0),
            cms.get(('Exclude','Include'),0), cms.get(('Exclude','Exclude'),0)))
        print("  human include rate=%.4f llm include rate=%.4f" % (
            sum(1 for x in hs if x=='Include')/ns, sum(1 for x in ls if x=='Include')/ns))
        print("  kappa=%.4f PABAK=%.4f po=%.4f" % (kappa(hs, ls), pabak(hs, ls),
            sum(1 for x,y in zip(hs,ls) if x==y)/ns))
    # category kappas
    print("category kappas (n, kappa, agreement, human-yes-rate, llm-yes-rate):")
    for cat in CATEGORIES:
        cp = []
        weird = Counter()
        for k in both:
            hv = get_cat(hk[k], cat)
            lv = get_cat(lk[k], cat)
            if hv.startswith('OTHER') or lv.startswith('OTHER'):
                weird[(hv, lv)] += 1
                continue
            # mimic script: drop pairs where either empty? norm maps '' to Nein. Check raw emptiness.
            hraw = hk[k].get(cat)
            if hraw is None and cat == 'Diversitaet':
                hraw = hk[k].get('Diversitaet / Intersektionalität') or hk[k].get('Diversitaet / Intersektionalitaet')
            lraw = lk[k].get(cat)
            hraw = (hraw or '').strip(); lraw = (lraw or '').strip()
            if not hraw or not lraw:
                continue  # script drops empty-raw values (normalize maps ''->'' before merge? check below)
            cp.append((hv, lv))
        if not cp:
            print("  %-18s n=0" % cat); continue
        hh = [x[0] for x in cp]; ll = [x[1] for x in cp]
        agr = sum(1 for x, y in cp if x == y)/len(cp)
        hy = sum(1 for x in hh if x == 'Ja')/len(cp); ly = sum(1 for x in ll if x == 'Ja')/len(cp)
        print("  %-18s n=%d kappa=%.4f agree=%.4f hYes=%.4f lYes=%.4f %s" % (
            cat, len(cp), kappa(hh, ll), agr, hy, ly, ("WEIRD:"+str(dict(weird)) if weird else "")))
    print()
    return both, pairs

analyze('llm_assessment_10k.csv', 'Haiku + Abstract (10k)')
analyze('llm_assessment_haiku_kd.csv', 'Haiku + KD')
analyze('llm_assessment_sonnet.csv', 'Sonnet + Abstract')
analyze('llm_assessment_sonnet_kd.csv', 'Sonnet + KD')

# pairing discrepancy: list human-only keys and cross-check papers_full.csv Has_HA
_, l10rows = load('llm_assessment_10k.csv')
l10k_, _, _ = keyed(l10rows)
only_h_keys = sorted(set(hk) - set(l10k_))
print("human-only keys (in human CSV, not in 10k LLM CSV):", only_h_keys)
pf_f, pf_rows = load('papers_full.csv')
pfk, pfdups, pfempty = keyed(pf_rows)
print("papers_full rows:", len(pf_rows), "unique keys:", len(pfk), "dups:", pfdups)
has_ha = {k for k, r in pfk.items() if (r.get('Has_HA') or '').strip().lower() in ('yes','ja','true','1')}
print("papers_full Has_HA=Yes:", len(has_ha))
print("Has_HA=Yes but key not in human CSV:", sorted(has_ha - set(hk)))
print("human CSV key not in papers_full at all:", sorted(set(hk) - set(pfk)))
print("LLM 10k keys not in papers_full:", sorted(set(l10k_) - set(pfk)))
print()

# also check llm_assessment_haiku.csv to see what it is
try:
    lf, lrows = load('llm_assessment_haiku.csv')
    lk, ldups, lempty = keyed(lrows)
    print("llm_assessment_haiku.csv rows:", len(lrows), "unique keys:", len(lk))
    # compare decisions with 10k file
    _, l10 = load('llm_assessment_10k.csv')
    l10k, _, _ = keyed(l10)
    common = set(lk) & set(l10k)
    diff = sum(1 for k in common if norm_dec(lk[k].get('Decision')) != norm_dec(l10k[k].get('Decision')))
    print("haiku.csv vs 10k.csv: common keys:", len(common), "decision diffs:", diff)
except FileNotFoundError:
    print("no llm_assessment_haiku.csv")
