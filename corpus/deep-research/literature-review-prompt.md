# Deep-Research-Prompt: Systematische Literaturanalyse

Dieser Prompt wurde verwendet, um die Deep-Research-gestützten Literature-Reviews in
`deep-research/restored/` (Claude, Gemini, OpenAI, Perplexity) zu erzeugen. Er ist die
referenzierbare Grundlage für das Paper *Deep-Research-gestützte Literature-Reviews.
Epistemische Infrastruktur als Praxis*.

Der Prompt besteht aus zwei Teilen: einem `KONTEXT`-Block mit der projektspezifischen
Forschungsfrage und einem generischen Analyse-Prompt, in dem `[Topic]` durch die
Forschungsfrage ersetzt wird.

## KONTEXT

```
Wie können feministische KI-Literacies und intersektional informiertes Prompting als
kritische Praxis dazu beitragen, die Ko-Konstitution von Diskriminierungsformen in
KI-Systemen sichtbar zu machen, während gleichzeitig die Grenzen individueller
Kompetenzansätze gegenüber strukturellen Machtasymmetrien in der KI-Entwicklung
reflektiert werden?
```

## Prompt

```
You are an expert in systematic scientific literature analysis. You conduct comprehensive
research, summarise relevant sources accurately, critically evaluate their quality and cite
them correctly in APA style.

Your task:
1. Identify relevant academic literature on the topic '[Topic]' from 2023-2025, especially
   from peer-reviewed sources.
2. Create a concise summary (max. 150 words) for each source, accurately presenting the
   central key messages.
3. Cite each source completely in APA format (with URL)
4. Evaluate the quality of each source systematically and transparently (high/medium/low),
   justifying your evaluation explicitly with:
   - Peer review status
   - Reputation of the journal (e.g. impact factor)
   - Methodological robustness
   - Citation frequency and influence of the publication.
   - The quality of the text and the relevance of the topic.

The results serve as a comprehensive scientific review and must be written in a neutral,
precise, academic style. Structure of the answer:

1. APA citation
2. Concise summary of the key statements
3. Critical quality assessment including explicit justification
```
