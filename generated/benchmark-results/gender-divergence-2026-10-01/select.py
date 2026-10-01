import json, os, random, re
from collections import Counter
R='C:/Users/Chrisi/Documents/GitHub/FemPrompt_SozArb/'
OUT='C:/Users/Chrisi/AppData/Local/Temp/claude/c--Users-Chrisi-Documents-obsidian/4b1f09d5-0270-40da-a14d-971e16b7bf3e/scratchpad/gender/'
d=json.load(open(R+'docs/data/promptotyping_v2.json',encoding='utf-8'))
m=json.load(open(R+'docs/data/fulltext_manifest.json',encoding='utf-8'))
for c in d['categories']:
    if 'Gender' in json.dumps(c,ensure_ascii=False)[:200]: print(json.dumps(c,ensure_ascii=False)[:600])
tab=Counter(); div=[]; both=[]
for p in d['papers']:
    a=(p.get('stages') or {}).get('assessment') or {}
    h=a.get('human'); l=a.get('llm')
    if not h or not l or l.get('assessment_status')!='assessed': continue
    hg=(h.get('all_categories') or {}).get('Gender'); lg=(l.get('all_categories') or {}).get('Gender')
    if hg not in (0,1) or lg not in (0,1): continue
    tab[(hg,lg)]+=1
    if hg==1 and lg==0: div.append(p)
    if hg==1 and lg==1: both.append(p)
print(tab, sum(tab.values()))
both=sorted(both,key=lambda p:p['id'])
random.seed(20261001); ctrl=random.sample(both,15)
def path(pid):
    e=m.get(pid)
    if not e or e.get('src')=='none': return None
    for cand in [e.get('source_path'), ('generated/markdown_clean/' if e['src']=='clean' else 'generated/markdown/')+e.get('source_file','')]:
        if cand and os.path.exists(R+cand): return cand
    return 'MISSING:'+json.dumps({k:e.get(k) for k in ('src','source_file','source_path')})
rows=[]
for grp,ps in (('divergent',div),('control',ctrl)):
    for p in ps:
        a=p['stages']['assessment']
        pt=path(p['id'])
        rows.append(dict(group=grp,id=p['id'],author_year=p.get('author_year'),title=p.get('title'),
          expert_decision=a['human'].get('decision'),llm_decision=a['llm'].get('decision'),
          text_path=pt,TA='T' if pt and not pt.startswith('MISSING') else 'A',
          abstract=p.get('abstract') or '',llm_reasoning=a['llm'].get('reasoning') or ''))
json.dump(rows,open(OUT+'selection.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print(Counter((r['group'],r['TA'],r['expert_decision']) for r in rows))
print([r['text_path'] for r in rows if r['text_path'] and r['text_path'].startswith('MISSING')])
