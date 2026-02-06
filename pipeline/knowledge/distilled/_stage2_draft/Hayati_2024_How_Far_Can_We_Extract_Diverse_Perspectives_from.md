---
title: "How Far Can We Extract Diverse Perspectives from Large Language Models?"
authors: ["Shirley Anugrah Hayati", "Minhwa Lee", "Dongyeop Kang", "Rajesh Dilip"]
year: 2024
type: conferencePaper
language: en
categories:
  - AI_Literacies
  - Generative_KI
  - Prompting
  - KI_Sonstige
  - Bias_Ungleichheit
  - Diversitaet
  - Fairness
processed: 2026-02-05
source_file: Hayati_2024_How_Far_Can_We_Extract_Diverse_Perspectives_from.md
---

# How Far Can We Extract Diverse Perspectives from Large Language Models?

## Kernbefund

LLMs können diverse Meinungen gemäß dem Grad der Aufgabensubjektivität generieren und erreichen dabei eine ähnliche Diversitätsleistung wie einzelne Menschen, aber weniger als mehrere Menschen zusammen. Kriterienbasiertes Prompting ermöglicht bessere Grundierung diverse Perspektiven.

## Forschungsfrage

Inwieweit können Large Language Models diverse Perspektiven und Rationales zu subjektiven Themen generieren, und wie viel Diversität kann maximal aus ihnen extrahiert werden?

## Methodik

Empirisch - experimentell mit quantitativen und qualitativen Methoden. Vergleichende Evaluation von Prompting-Techniken (kriterienbasiertes Prompting vs. freie Form), Step-by-Step Recall Prompting, semantische Diversitätsmessung mit SentenceBERT, menschliche Evaluationen und AMT-Studien.
**Datenbasis:** Empirisch auf mehreren Datensätzen: SOCIAL-CHEM-101 (500 für Hauptexperiment, 200 für Recall-Prompting), Change My View (67 Claims), Hate Speech Dataset (200 Instanzen), Moral Stories (200 Instanzen). Human Evaluation mit 60 Teilnehmern (AMT) aus englischsprachigen Ländern mit hoher HIT-Approval-Rate.

## Hauptargumente

- LLMs können als 'komprimiertes parametrisches Wissen' des Trainingsdatensatzes verstanden werden und ermöglichen potenziell das 'Reverse Modeling' von menschlichen Perspektiven aus trainingsdaten, wobei die Frage zentral ist, wie viel dieser Pluralität in den Parametern erhalten bleibt.
- Kriterienbasiertes Prompting, inspiriert von menschlichem Reasoning wo persönliche Werte Meinungen leiten, ermöglicht bessere Extraktion von diversen Perspektiven als freie Form, da Kriterien als Framing-Keywords (z.B. 'Teamwork', 'Kreativität') fungieren, die verschiedene Standpunkte strukturiert begründen.
- Es existiert ein Sättigungspunkt in der Diversität, die LLMs generieren können, der je nach Aufgabensubjektivität variiert - Step-by-Step Recall Prompting offenbart diesen Punkt und zeigt, dass LLM-Leistung bei maximaler Diversitätsextraktion vergleichbar mit einzelnen Menschen ist, aber mehrere Menschen übertrumpfen.

## Kategorie-Evidenz

### AI_Literacies

Das Paper untersucht die Fähigkeit von Menschen/Systemen, LLM-Kapazitäten zu verstehen und zu nutzen: 'Collecting diverse human opinions is costly and challenging. This leads to a recent trend in exploiting large language models (LLMs) for generating diverse data' - es geht um Kompetenzen im Umgang mit LLMs für spezifische Anwendungen.

### Generative_KI

Expliziter Fokus auf generative LLM-Varianten: 'We experiment primarily with four GPT variants: GPT-4o, GPT-4, GPT-3.5 (OpenAI, 2023), and GPT-3 (text-davinci-002), along with Llama3-70b-chat and Mixtral 8x7B' sowie deren Fähigkeit zur Generierung von Text und Perspektiven.

### Prompting

Zentrales Thema sind Prompting-Strategien: 'We introduce criteria-based diversity prompting to extract and ground diverse perspectives from LLMs. Finally, we suggest a step-by-step recall approach to measure the extent of diversity coverage of LLMs' sowie 'in-context prompting' und 'few-shot learning'.

### KI_Sonstige

Natural Language Processing und semantische Diversitätsmessung: 'To examine the semantic diversity of the model's reasons... we convert the LLM-generated reasons into sentence embeddings using SentenceBERT'.

### Bias_Ungleichheit

Das Paper adressiert Bias durch fehlende Perspektivenvielfalt: 'Instead of providing a single viewpoint, an ideal NLP model should accommodate various perspectives to avoid any bias towards a dominant one' und untersucht systematisch, wie Dominanzperspektiven entstehen und wie Verzerrungen durch fehlende Diversität auftreten.

### Diversitaet

Diversität ist der zentrale Forschungsfokus: 'We introduce the problem of extracting maximum diversity from LLMs' und 'Our methods... show that LLMs can indeed produce diverse opinions according to the degree of task subjectivity. We also find that LLMs performance of extracting maximum diversity is on par with human.'

### Fairness

Algorithmische Fairness durch Diversität: Das Paper verbindet Fairness mit der Fähigkeit von NLP-Systemen, multiple Perspektiven zu berücksichtigen. 'Prior works emphasize the importance of modeling multiple viewpoints (Plank, 2022; Abercrombie et al., 2022)' - faire Systeme erfordern Perspektivenvielfalt, nicht einzelne Dominanzperspektiven.

## Assessment-Relevanz

**Domain Fit:** Das Paper hat mittlere Relevanz für die Schnittstelle KI/Soziale Arbeit. Während es nicht explizit auf Soziale Arbeit fokussiert, sind die untersuchten Themen (soziale Normen, Hate Speech, Argumentation, moralische Urteile) direkt relevant für sozialarbeiterische Praxis, die mit vielfältigen menschlichen Perspektiven, Werten und Konflikten umgeht. Die Untersuchung, wie KI-Systeme diverse Perspektiven darstellen können, ist relevant für Fairness in automatisierten Entscheidungssystemen, die in der Sozialen Arbeit zunehmend eingesetzt werden.

**Unique Contribution:** Das Paper leistet einen innovativen Beitrag durch die explizite Operationalisierung von 'Perspektivendiversität' (distinct von lexikalischer, syntaktischer und semantischer Diversität), durch die Entwicklung kriterienbasierter Diversity-Prompting-Techniken sowie durch die systematische Messung von Diversitäts-Sättigungspunkten mittels Step-by-Step-Recall-Prompting, was neue Erkenntnisse über LLM-Kapazitäten generiert.

**Limitations:** Das Paper konzentriert sich primär auf englischsprachige Kontexte (5 englischsprachige Länder für AMT), evaluiert hauptsächlich binäre Stance-Klassifikation, und die menschliche Evaluation ist begrenzt auf hochqualifizierte AMT-Worker mit hohen Approval-Raten (hauptsächlich weiß, 25-44 Jahre), was die Generalisierbarkeit auf diverse Bevölkerungen einschränkt.

**Target Group:** KI-Entwickler und NLP-Forscher (primär), Policy-Maker im Bereich AI Governance, Entwickler von automatisierten Entscheidungssystemen, potentiell auch Sozialarbeiter und Ethiker, die mit KI-Systemen in Kontexten arbeiten, die menschliche Wertkonflikte und diverse Perspektiven berücksichtigen müssen.

## Schlüsselreferenzen

- [[Sap_Rashkin_Gabriel_Qin_Jurafsky_Dada_2019]] - Social Bias Frames - Reasoning about Social and Power Implications of Language through Event Inference
- [[Rottger_Vidgen_Nguyen_Waseem_Margetts_Pierrehumbert_2022]] - HateCheck - Functional Tests for Hate Speech Detection Models
- [[Plank_2022]] - The 'Problem' of Human Label Variation - On Ground Truth in Data, Modeling, and Evaluation
- [[Abercrombie_Cercas_Curry_De_Freitas_Rieser_2022]] - Acquiring and Modelling Perspectives with Heterogeneous Data
- [[Vidgen_Harris_Nguyen_Wood_Waseem_2021]] - Hate Speech Dataset from a White Supremacy Forum
- [[Forbes_Holtzman_Rashkin_Choi_2020]] - Social Chemistry 101 - Learning to Reason about Social Interactions
- [[Rokeach_1973]] - The Nature of Human Values
- [[Wei_Wang_Schuurmans_Bosma_Chi_Le_Zhou_2023]] - Emergent Abilities of Large Language Models
- [[Chiang_2023]] - LLMs as Compressed Parametric Knowledge of Training Corpus
