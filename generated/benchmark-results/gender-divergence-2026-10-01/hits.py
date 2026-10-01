import json, re, os
R='C:/Users/Chrisi/Documents/GitHub/FemPrompt_SozArb/'
rows=json.load(open('selection.json',encoding='utf-8'))
pat=re.compile(r'\b(gender\w*|sex|sexes|sexism\w*|sexis\w*|women|woman|men|man\b|female\w*|male\w*|girl\w*|boy\w*|feminis\w*|feminin\w*|masculin\w*|misogyn\w*|patriarch\w*|intersection\w*|transgender|non-binary|nonbinary|LGBT\w*|queer\w*|Geschlecht\w*|geschlechts\w*|Frau\w*|Männer\w*|Mann\b|weiblich\w*|männlich\w*|Mädchen|Jungen|feministi\w*|Gleichstellung\w*)', re.I)
os.makedirs('hits',exist_ok=True)
for r in rows:
    if r['TA']=='T':
        lines=open(R+r['text_path'],encoding='utf-8',errors='replace').read().split('\n')
    else:
        lines=['TITLE: '+(r['title'] or ''),'ABSTRACT: '+r['abstract']]
    out=[]; n=0
    for i,L in enumerate(lines,1):
        if pat.search(L):
            n+=1; out.append(f'{i}: {L[:600]}')
    r['nlines']=len(lines); r['hit_lines']=n
    open(f"hits/{r['id']}.txt",'w',encoding='utf-8').write('\n'.join(out))
json.dump(rows,open('selection.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
for r in rows: print(r['group'][:3],r['id'],r['TA'],r['expert_decision'],r['hit_lines'],r['nlines'],(r['author_year'] or '')[:25],(r['title'] or '')[:60])
