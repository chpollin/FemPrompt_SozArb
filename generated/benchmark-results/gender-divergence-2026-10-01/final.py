import json, csv
from collections import Counter, defaultdict
rows=json.load(open('selection.json',encoding='utf-8'))
sub=json.load(open('sub_results.json',encoding='utf-8'))
path2id={}
for r in rows:
  if r['TA']=='T' and r['id'] in sub: path2id[r['text_path']]=r['id']
corr={
 'UFE85SCV':dict(cls='G3',quote='AI  education,  as  a  broad  branch  of  computer  science, also needs to address the issue of gender diversity.',location='line 270 (## Gender diversity in AI literacy)',note='Corrected G1->G3: one three-sentence paragraph naming gender diversity as one of six literature strands of the review, no analysis.'),
 'K6JQ7SVA':dict(cls='G3',quote='Assuming we have only one protected attribute (gender) with subgroups male/female.',location='line 50 (Figure 1 caption)',note='Corrected G1->G3: attribute-generic intersectional-fairness formalism; gender only the running example; cites Crenshaw.'),
 'PI5H2LZ2':dict(cls='G2',quote='the child itself (age, gender, past h',location='line 150',note='Corrected G3->G2: gender is an input feature of the audited decision-support system; the audit analyses age, not gender.'),
}
# fix PI5H2LZ2 quote verbatim from text
import re
R='C:/Users/Chrisi/Documents/GitHub/FemPrompt_SozArb/'
L=open(R+[r for r in rows if r['id']=='PI5H2LZ2'][0]['text_path'],encoding='utf-8').read().split('\n')[149]
i=L.find('the child itself'); corr['PI5H2LZ2']['quote']=' '.join(L[i:].split()[:22])
A={
 'XQM6WRU2':('G4','','','no','Abstract describes ML placement model, no gender term.'),
 '7QQV7R9S':('G3','Warns that AI tools are prone to replicating racist/sexist assumptions from training datasets','abstract','no','Single remark on sexist assumptions.'),
 'CLKAD87H':('G4','','','no','Abstract without gender term.'),
 'XY2WVKBY':('G4','','','no','Abstract on discriminatory content without gender term.'),
 '99QJDBSV':('G4','','','no','Abstract without gender term.'),
 'QIQR449A':('G4','','','no','Title only, no abstract.'),
 'ZLM537Z4':('G1','examining how feminist scholarship can hold the AI sector accountable for designing systems that further social justice through diverse feminist approaches','abstract','yes','Feminist edited volume.'),
 'FDR5APIU':('G1','diversity crises in AI development where founders and employees mainly come from homogeneous groups of white men','abstract','yes','Intersectionality analysis of AI reports.'),
 '4LY3SA4E':('G1','Zeigt massive Dominanz weißer Männer in Internettexten und Ableitung entsprechender LLM-Biases.','abstract','no','Measures intersectional (gender x race) representation bias.'),
 '8U23BX2J':('G1','intersectionality – the overlapping of gender, race, class and other social inequalities – is being addressed in debates about AI bias','abstract','yes','Defines intersectionality incl. gender.'),
}
for k in ['UB9NK8KI','JGZDWMN3','NVZA58ML','6MJYP7ZX','YUVR5YNQ','64DQYVVB']: A[k]=('G4','','','no','Title only, no abstract.')
checked={'UFE85SCV','7VFNS5R3','LXDG4KQK','R3VJVFCE','ACDF4FL9','38E5FZDV','22XEFRWP','MJDTRLAI','JZN2I6J5','K6JQ7SVA','QXDK8Z6I','HJ7BHX8J','YPYQ2TCL','DJEVSR8D','L6PH7GDL','BBLJ4RG3','KG8JRLRQ','9832ZJB7','PI5H2LZ2','X2QQ4JH6','4PK8UN82','MS3CNU3S'}
out=[]
for r in rows:
  o=dict(group=r['group'],id=r['id'],author_year=r['author_year'] or '',title=r['title'],expert_decision=r['expert_decision'],llm_decision=r['llm_decision'],TA=r['TA'],text_path=r['text_path'] or '')
  if r['TA']=='A':
    c,q,l,t,n=A[r['id']]; o.update(gender_class=c,quote=q,location=l,defines_or_theory=t,theory_note='',note=n+(' Abstract empty.' if not r['abstract'] else ''),classified_by='main agent (abstract)',same_text_as='',checked_by_main='yes')
  else:
    src=path2id[r['text_path']]; s=sub[src]
    o.update(gender_class=s['class'],quote=s['quote'],location=s['location'],defines_or_theory=s['defines_or_theory'],theory_note=s.get('theory_note',''),note=s.get('note',''),classified_by='subagent',same_text_as=src if src!=r['id'] else '',checked_by_main='yes' if src in checked else 'no')
    if src in corr:
      c=corr[src]; o.update(gender_class=c['cls'],quote=c['quote'],location=c['location'],note=c['note'],classified_by='subagent, corrected by main')
  if o.get('same_text_as','')=='R3VJVFCE' or o['id']=='R3VJVFCE':
    o.update(quote='Gender. We also observe a gender bias improvement of up to 9 percent across various models.',location='line 149 (results)')
  if o['id']=='BBLJ4RG3':
    o.update(quote='| Gender | ... | Female | 43 (32.6%) | ... | Male | 85 (64.4%) |',location='lines 114-117 (participant table)')
  out.append(o)
json.dump(out,open('gender_classification.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
with open('gender_classification.csv','w',encoding='utf-8-sig',newline='') as f:
  w=csv.DictWriter(f,fieldnames=list(out[0].keys())); w.writeheader(); w.writerows(out)
# checks
for o in out:
  assert o['gender_class']=='G4' or (o['quote'] and o['location']), o['id']
  assert len(o['quote'].split())<=31, (o['id'],len(o['quote'].split()))
for g in ('divergent','control'):
  S=[o for o in out if o['group']==g]
  print('\n##',g,len(S),Counter(o['gender_class'] for o in S))
  for key in ('TA','expert_decision'):
    t=defaultdict(Counter)
    for o in S: t[o[key]][o['gender_class']]+=1
    for k,v in sorted(t.items()): print(' ',key,k,sum(v.values()),dict(sorted(v.items())))
  print('  theory yes:',sum(o['defines_or_theory']=='yes' for o in S))
  print('  unique texts:',len({o['text_path'] or o['id'] for o in S}))
