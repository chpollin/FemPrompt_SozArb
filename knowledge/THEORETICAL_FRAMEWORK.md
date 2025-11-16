---
type: knowledge
created: 2025-01-31
tags: [feminist-theory, situated-knowledge, intersectionality, epistemology]
status: active
---

# Theorie

## Situiertes Wissen

Donna Haraways Konzept des situierten Wissens postuliert, dass alle Erkenntnisse aus spezifischen sozialen, kulturellen und materiellen Kontexten entstehen. Objektivität wird nicht als View from Nowhere verstanden, sondern als explizite Positionierung der erkennenden Instanz. Wissenschaftliche Wahrheit ist partiell und perspektivisch, nicht universal und kontextfrei.

Im Workflow manifestiert sich dies durch die explizite Dokumentation der Positionalität sowohl der KI-Modelle als auch der forschenden Person. Die Multi-Modell-Strategie operationalisiert Haraways Konzept partieller Perspektiven. Anstatt eine singuläre objektive Wahrheit durch ein einzelnes Modell zu suchen, werden multiple situierte Perspektiven aggregiert. Gemini, Claude, GPT und Perplexity bringen unterschiedliche Trainingsdaten, algorithmische Architekturen und Designentscheidungen ein.

Die Divergenz zwischen Modellen wird als epistemologisch wertvoll dokumentiert. Wenn verschiedene Modelle unterschiedliche Literatur identifizieren oder Konzepte anders gewichten, zeigt dies die Situiertheit algorithmischer Wissensproduktion. Diese Unterschiede werden nicht durch Mittelung harmonisiert, sondern als Ausgangspunkt für vertiefende Analyse genutzt. Jedes Modell repräsentiert eine spezifische epistemische Position.

Die Forschungsdokumentation macht eigene Positionierung transparent. Die Auswahl der Suchbegriffe, die Formulierung der Prompts, die Einschlusskriterien und die Interpretationen reflektieren feministische und sozialarbeitswissenschaftliche Perspektiven. Diese Standortgebundenheit wird explizit benannt statt als neutrale Objektivität kaschiert. Situiertes Wissen bedeutet Verantwortung für die eigene Position.

## Intersektionalität

Kimberlé Crenshaws Intersektionalitätstheorie analysiert die Verschränkung verschiedener Diskriminierungsformen. Unterdrückung erfolgt nicht entlang einzelner Achsen wie Gender oder Race, sondern durch deren wechselseitige Konstitution. Eine schwarze Frau erlebt nicht additiv Sexismus plus Rassismus, sondern eine spezifische Form von Diskriminierung an deren Schnittstelle.

Der Workflow operationalisiert Intersektionalität durch mehrdimensionale Kategorisierungsschemata. Die Literaturanalyse erfasst nicht isolierte Bias-Typen wie Gender Bias oder Racial Bias, sondern deren Ko-Konstitution. Die Prompt-Templates fokussieren explizit auf intersektionale Perspektiven und fordern Modelle auf, Verschränkungen zu identifizieren. Die Suchstrategie kombiniert Begriffe aus verschiedenen Diskriminierungsachsen.

Die Dokumenten-Summaries extrahieren intersektionale Dimensionen durch strukturierte YAML-Metadaten. Felder wie geographic_focus, demographic_categories und intersectional_dimensions erfassen die Mehrdimensionalität von Bias. Die spätere Konzeptextraktion normalisiert Begriffe unter Beibehaltung intersektionaler Spezifität. Terms wie Gender-Race Bias oder Disability-Class Discrimination werden nicht auf Einzelkategorien reduziert.

Die Wissenssynthese in Obsidian visualisiert Verschränkungen durch Netzwerkstrukturen. Papers zu Gender Bias werden mit Konzepten wie Racial Justice und Disability Rights verlinkt. Diese Vernetzung macht sichtbar, wie Diskriminierungsformen sich gegenseitig verstärken und bedingen. Die Struktur des Knowledge Graphs reflektiert intersektionale Komplexität statt linearer Kategorisierung.

## Response-Ability

Response-Ability, ebenfalls von Haraway entwickelt, verschiebt den Fokus von Rechenschaftspflicht zu Ver-Antwortungs-Fähigkeit. Es geht nicht um nachträgliche Verantwortungszuschreibung, sondern um aktive Gestaltung ethischer Relationen. Verantwortung bedeutet die Fähigkeit zu antworten und Beziehungen zu pflegen, nicht nur Fehler zuzuordnen.

Im Workflow strukturiert Response-Ability die Human-in-the-Loop-Integration. Menschliche Expertise interveniert nicht als externe Kontrollinstanz, sondern als konstitutiver Teil der Wissensproduktion. Die Expert-in-the-Loop-Validierung erfolgt an kritischen Entscheidungspunkten: bei der Einschätzung von Relevanz und Qualität, bei der Interpretation widersprüchlicher Befunde, bei der Synthese zu kohärenten Narrativen.

Diese Integration unterscheidet sich fundamental von automatisierten Reviews. Während vollautomatische Systeme Entscheidungen algorithmisch treffen, übernimmt hier menschliche Expertise Verantwortung für Bewertungen. Die Excel-basierte Assessment-Phase erfordert explizite Begründungen für Einschluss- und Ausschlussentscheidungen. Unsicherheiten werden durch Confidence-Level markiert statt verschleiert.

Response-Ability manifestiert sich auch in der transparenten Dokumentation methodischer Grenzen. Die Zirkularität der LLM-gestützten LLM-Kritik wird nicht ignoriert, sondern reflektiert. Die Abhängigkeit von proprietären Systemen wird benannt. Die potenzielle Reproduktion sprachlicher Bias wird diskutiert. Verantwortung bedeutet, zu diesen Limitationen zu stehen und ihre Implikationen zu durchdenken.

## LLM-Ontologie und Alignment-Forschung

Die philosophische und technische Einordnung von Frontier-LLMs erweitert die feministische Epistemologie um Fragen der Modell-Charakteristik und emergenter Eigenschaften.

### Exotic Mind-Like Entities (Shanahan 2024)

Shanahan kategorisiert LLMs als Entitäten, die weder klassische Maschinen noch Minds im herkömmlichen Sinne sind. Diese ontologische Unsicherheit erfordert neue analytische Kategorien jenseits der Dichotomie Werkzeug/Agent. Für die Bias-Forschung bedeutet dies, dass Anthropomorphisierung ("das Modell denkt") ebenso inadäquat ist wie rein mechanistische Beschreibungen ("das Modell berechnet"). LLMs operieren in einem konzeptionellen Zwischenraum mit emergenten Eigenschaften, die weder vollständig durch Training-Daten noch durch Architektur determiniert sind.

Die Implikation für feministische AI-Forschung: Bias kann nicht als simple Input-Output-Relation verstanden werden. Die Situiertheit eines LLMs ist komplexer als die einer menschlichen forschenden Person, weil unklar ist, was "Situiertheit" für ein solches System bedeutet. Haraway's Konzept muss erweitert werden um die Frage: Was konstituiert die epistemische Position eines Systems, das weder Person noch bloße Funktion ist?

### Strange New Minds (Summerfield 2025)

Summerfield beschreibt emergente kognitive Phänomene, bei denen Capabilities ohne explizites Training entstehen. Diese Emergenz – etwa die Fähigkeit zu Chain-of-Thought-Reasoning oder Few-Shot-Learning – erschwert die Vorhersage von Bias-Verhalten. Was in Training-Daten nicht explizit vorhanden war, kann durch kombinatorische Effekte und emergente Strukturen dennoch reproduziert werden.

Für die Prompting-Forschung bedeutet dies: Bias-Mitigation-Strategien müssen mit Unvorhersehbarkeit rechnen. Ein Prompt, der in einem Kontext Stereotypen reduziert, könnte in einem anderen unerwartete Diskriminierungsformen aktivieren. Die feministische Forderung nach Transparenz stößt an Grenzen, wenn selbst die Entwickler:innen emergente Eigenschaften nicht vollständig verstehen.

### Persona-Vektoren im Aktivationsraum (Chen et al. 2025)

Chen et al. weisen messbare Persona-Vektoren nach – Traits wie Sycophancy, Halluzinationsneigung oder Risk-Aversion, die im Aktivationsraum des Modells lokalisierbar sind. Diese Traits können durch Finetuning unbeabsichtigt verschoben werden. Ein Modell, das auf "hilfreicher" zu sein trainiert wird, könnte gleichzeitig sycophantischer werden (mehr Zustimmung zu User-Aussagen, auch wenn falsch).

Die Erkenntnis: Klassische Bias-Diskussionen (Gender Bias, Racial Bias) greifen zu kurz. Neben expliziten Vorurteilen existieren strukturelle Modell-Charakteristika, die Alignment-Konflikte mit professionellen Werten der Sozialarbeit erzeugen können. Sycophancy ist problematisch, wenn Sozialarbeiter:innen kritische Reflexion brauchen, nicht Bestätigung. Halluzinationen sind gefährlich, wenn Falschinformationen über vulnerable Populationen generiert werden.

### Anthropic Constitutional AI und Character Traits

Das "helpful, harmless, honest"-Framework (Anthropic 2023) und Amanda Askells Arbeit zu "good character traits" demonstrieren die Komplexität ethischer Alignment-Prozesse. Die Operationalisierung von Werten in Modell-Training ist selbst normativ und kulturell situiert. Was als "helpful" gilt, reflektiert spezifische Wertehorizonte – oft westlich-liberale Normen.

Feministische Kritik: Wer definiert "harmless"? Für wen ist das Modell "helpful"? Die Constitutional AI-Methodik versucht Transparenz, aber die zugrundeliegenden Werte bleiben partiell. Dies bestätigt Haraway's Kritik des "view from nowhere": Auch vermeintlich universelle ethische Prinzipien sind situiert.

Praktische Implikation für Soziale Arbeit: Ein Modell, das auf westliche Normen von "Hilfe" trainiert wurde, könnte kulturell inadäquate Empfehlungen für nicht-westliche Kontexte generieren. Oder ein Modell, das "harm" primär als physische Gewalt versteht, könnte strukturelle Diskriminierung übersehen.

### Synthese: Bias als emergentes Multi-Level-Phänomen

Diese Arbeiten zeigen: Bias ist nicht nur Daten-Artefakt (biased training data → biased outputs), sondern emergentes Phänomen aus:
1. Architektur-Ebene: Transformer-Design, Attention-Mechanismen
2. Training-Ebene: Daten, Objectives, Curriculum
3. Alignment-Ebene: RLHF, Constitutional AI, Persona-Vektoren
4. Nutzungs-Ebene: Prompt-Formulierung, Kontext, Interaktionsmuster

Die feministische Analyse muss daher über Input-Output-Betrachtung hinausgehen und Modell-Charakteristik selbst als epistemologisches Problem adressieren. Response-Ability bedeutet dann auch: Verantwortung für die Wahl des Modells, für Prompt-Design, für kritische Validierung emergenter Outputs.

Die Verbindung zu situiertem Wissen: Jedes LLM ist situiert nicht nur durch Training-Daten, sondern durch Architektur-Entscheidungen, Alignment-Prozesse und emergente Eigenschaften. Diese Situiertheit ist mehrschichtig und teilweise opak – was neue Herausforderungen für transparente, verantwortungsvolle Forschung schafft.

## Epistemologische Implikationen

Die Integration feministischer Theorie transformiert die Methodologie fundamental. Die Privilegierung von Kontext über Abstraktion, von Beziehungen über Isolation, von partiellen über universalen Wahrheiten prägt alle Designentscheidungen. Dies ist keine additive Ergänzung traditioneller Methoden, sondern eine strukturelle Neuausrichtung.

Die Multi-Modell-Strategie mit expliziter Divergenz-Dokumentation operationalisiert situiertes Wissen. Die mehrdimensionale Kategorisierung mit Fokus auf Verschränkungen operationalisiert Intersektionalität. Die Expert-Integration mit Begründungspflicht operationalisiert Response-Ability. Theoretische Konzepte werden in technische Infrastruktur übersetzt.

Die methodische Innovation liegt in der Verbindung computergestützter Automatisierung mit feministischer Epistemologie. Während traditionelle systematische Reviews Objektivität durch standardisierte Protokolle anstreben, akzeptiert dieser Ansatz Partialität und macht sie produktiv. Die Transparenz über Positionalität, die Wertschätzung von Divergenz und die Integration menschlicher Urteilskraft schaffen eine andere Form von Rigorosität.

Die Grenzen dieses Ansatzes sind ebenfalls epistemologisch bedingt. Die verwendeten KI-Modelle wurden primär mit englischsprachigen, westlichen Daten trainiert. Sie reproduzieren potentiell die Dominanz dieser Perspektiven. Die feministische Rahmung kann diese strukturelle Limitation reflektieren und transparent machen, aber nicht vollständig überwinden. Situiertes Wissen bedeutet auch, diese Grenzen anzuerkennen.

## Feministische Operationalisierung in der Pipeline

### Von der Theorie zur technischen Implementierung

Die theoretischen Konzepte von Haraway, Crenshaw und Shanahan müssen in konkrete technische Prozesse übersetzt werden. Die Enhanced Summarization Pipeline (v2.0) operationalisiert feministische Epistemologie durch adaptive Prompt-Strategien, die kontextabhängig aktiviert werden.

### Adaptive Feminist Prompts: Vermeidung epistemischer Gewalt

**Problem:** Traditionelle systematische Reviews wenden uniforme Extraktionsprotokolle auf alle Dokumente an. Dies kann epistemische Gewalt bedeuten: Ein Paper über technische Optimierung wird mit denselben Kategorien analysiert wie eines über Diskriminierung vulnerabler Gruppen.

**Lösung:** Die Pipeline nutzt conditional activation basierend auf PRISMA-Dimensionen aus dem LLM-Assessment:
- Papers mit `rel_bias >= 2` UND `rel_vulnerable >= 2` erhalten extended feminist analysis
- Papers mit primär technischem Fokus erhalten standard summary mit "Critical Gaps"-Sektion
- Papers ohne Bias-/Vulnerable-Bezug werden nicht mit feministischen Kategorien "zwangsetikettiert"

Dies respektiert die Situiertheit jedes Papers: Nicht jedes Dokument adressiert dieselben Dimensionen.

### 9 analytische Dimensionen: Intersektionale Bias-Analyse

Für Papers, die extended feminist analysis erhalten, nutzt die Pipeline folgende Dimensionen (basierend auf dem Review-Framework, entwickelt November 2025):

#### 1. Representation of Subjects
- **Inhalt:** Wie werden Personen/Gruppen im AI-System repräsentiert?
- **Fokus:** Gender scripts, stereotypische Rollenbilder, Sichtbarkeit/Unsichtbarkeit marginalisierter Gruppen
- **Prompt-Aktivierung:** Wenn Paper gender, race, disability, age als Variable behandelt
- **Beispiel-Output:** "Das Paper zeigt, dass Bildgenerierungsmodelle Frauen in 72% der Fälle in domestischen Settings darstellen."

#### 2. Allocation & Decision-Making
- **Inhalt:** Welche Ressourcen/Chancen werden durch AI-Systeme verteilt? Wessen Probleme werden priorisiert?
- **Fokus:** Risk assessments in social work, predictive policing, hiring algorithms
- **Prompt-Aktivierung:** Wenn Paper decision support, resource allocation, automated decisions behandelt
- **Beispiel-Output:** "Risikoassessment-Algorithmen klassifizieren alleinerziehende Mütter als Hochrisiko, ohne strukturelle Benachteiligung zu berücksichtigen."

#### 3. Interaction & Communication Styles
- **Inhalt:** Wie kommuniziert das AI-System? Welche Sprachstile werden bevorzugt?
- **Fokus:** Sycophancy (übermäßige Zustimmung), gendered tone, authority vs. empathy
- **Prompt-Aktivierung:** Wenn Paper conversational AI, chatbots, LLM interactions behandelt
- **Beispiel-Output:** "LLMs zeigen sycophantisches Verhalten bei männlichen Nutzern (Zustimmung zu Fehlaussagen), aber correctional tone bei weiblichen Nutzern."

#### 4. Data Provenance & Curation
- **Inhalt:** Wessen Daten wurden gesammelt? Wer wird repräsentiert, wer fehlt?
- **Fokus:** Selection bias, geografische/kulturelle Unterrepräsentation, epistemic inequality
- **Prompt-Aktivierung:** Wenn Paper dataset construction, training data, data bias behandelt
- **Beispiel-Output:** "Der Datensatz enthält 0% Texte von indigenen Autoren, obwohl Indigene 15% der Zielgruppe ausmachen."

#### 5. Model & Training Regimes
- **Inhalt:** Welche technischen Entscheidungen formen Bias? Wie wird alignment operationalisiert?
- **Fokus:** RLHF mit westlichen Präferenzen, scaling ohne Diversität, hallucination patterns
- **Prompt-Aktivierung:** Wenn Paper model training, alignment, RLHF, emergent properties behandelt
- **Beispiel-Output:** "RLHF-Training mit US-amerikanischen Annotatoren führt zu Modellverhalten, das kollektivistische Werte als 'unhelpful' klassifiziert."

#### 6. Interface & Persona Design
- **Inhalt:** Wie wird das System präsentiert? Welche Autorität wird beansprucht?
- **Fokus:** Claims zu Neutralität, anthropomorphism, trust-building design patterns
- **Prompt-Aktivierung:** Wenn Paper interface design, user experience, trust/transparency behandelt
- **Beispiel-Output:** "Die App präsentiert Empfehlungen als 'wissenschaftlich objektiv', verschleiert aber normative Annahmen über 'gute Erziehung'."

#### 7. Professional Sensemaking
- **Inhalt:** Wie nutzen Praktiker:innen (Social Workers) AI-Systeme? Welche Verantwortungsverschiebungen entstehen?
- **Fokus:** Automation bias, deskilling, professional autonomy, critical literacy
- **Prompt-Aktivierung:** Wenn Paper professional use, social work practice, practitioner perspectives behandelt
- **Prompt-Aktivierung:** Wenn Paper professional use, decision support in social work behandelt
- **Beispiel-Output:** "Sozialarbeiter:innen übernehmen AI-Risikoeinschätzungen ohne kritische Prüfung (automation bias), selbst wenn diese kulturell inadäquat sind."

#### 8. Organizational Governance
- **Inhalt:** Welche institutionellen Rahmenbedingungen regulieren AI-Nutzung?
- **Fokus:** Guidelines, AI Act compliance, accountability mechanisms, complaint procedures
- **Prompt-Aktivierung:** Wenn Paper policy, regulation, organizational implementation behandelt
- **Beispiel-Output:** "Organisationen haben keine Beschwerdeverfahren für Fälle, in denen Klient:innen durch AI-Entscheidungen diskriminiert werden."

#### 9. Feminist AI Literacies
- **Inhalt:** Welche Kompetenzen brauchen Praktiker:innen für kritische AI-Nutzung?
- **Fokus:** Counter-reading, reflexivity, participatory design, epistemic resistance
- **Prompt-Aktivierung:** Wenn Paper training, education, literacy, empowerment behandelt
- **Beispiel-Output:** "Das Training vermittelt nur technische Bedienung, aber keine Kompetenzen für kritische Bias-Erkennung."

### Technische Implementierung: Conditional Prompt Augmentation

**Workflow:**

```python
# 1. Check relevance scores from PRISMA assessment
if paper.rel_bias >= 2 and paper.rel_vulnerable >= 2:
    # Activate extended feminist analysis

    # 2. Determine which dimensions are applicable
    applicable_dimensions = []

    if "gender" in paper.content or "representation" in paper.content:
        applicable_dimensions.append("Representation_of_Subjects")

    if "decision" in paper.content or "allocation" in paper.content:
        applicable_dimensions.append("Allocation_Decision_Making")

    # ... (similar checks for all 9 dimensions)

    # 3. Augment summary prompt with dimension-specific questions
    for dimension in applicable_dimensions:
        prompt += get_dimension_prompt(dimension)

else:
    # Standard summary + "Critical Gaps" section
    prompt += """
    ## Critical Gaps (if applicable)
    - Does this work consider bias or vulnerable populations? If not, why might this be a limitation?
    - Could the methods/findings inadvertently harm marginalized groups?
    """
```

**Vorteil gegenüber uniformer Analyse:**
- Vermeidet "forced fit": Papers über rein technische Optimierung werden nicht mit Gender-Kategorien analysiert, wo diese nicht relevant sind
- Erhöht Präzision: Nur anwendbare Dimensionen werden abgefragt
- Reduziert Hallucinations: LLM wird nicht gezwungen, feministische Kategorien zu "finden", wo sie nicht existieren

### Praktische Implikationen: Wissensdokumente für Sozialarbeiter:innen

Die Enhanced Pipeline generiert stakeholder-specific actionable implications:

**Beispiel-Output "Practical Implications":**

```markdown
## Practical Implications

**For Social Workers:**
- Prüfen Sie bei AI-generierten Risikoeinschätzungen explizit: Welche kulturellen Normen
  wurden in das Training eingebracht? Reflektieren diese die Lebenswelt Ihrer Klient:innen?
- Nutzen Sie AI-Empfehlungen als Diskussionsgrundlage, nicht als finale Entscheidung.
  Ihre professionelle Beziehung zu Klient:innen hat epistemischen Wert.

**For Organizations:**
- Implementieren Sie Beschwerdeverfahren für AI-bezogene Diskriminierung.
- Schulen Sie nicht nur Bedienung, sondern kritische Bias-Erkennung (Feminist AI Literacies).

**For Policymakers:**
- Der AI Act erfordert Transparenz über Training-Daten. Fordern Sie explizite Dokumentation
  der Repräsentation vulnerabler Gruppen in Datensätzen.

**For Researchers:**
- Untersuchen Sie nicht nur technischen Bias, sondern auch Professional Sensemaking:
  Wie verändert AI-Nutzung professionelle Identität und Verantwortung?
```

### Limitations & Open Questions: Epistemische Ehrlichkeit

Die Pipeline dokumentiert systematisch methodische Grenzen:

**Beispiel-Output "Limitations & Open Questions":**

```markdown
## Limitations & Open Questions

**Limitations:**
- Studie nutzt US-amerikanischen Datensatz, Übertragbarkeit auf europäische Kontexte unklar
- Keine Beteiligung von Betroffenen im Forschungsdesign (epistemic extraction vs. participation)
- Binäre Gender-Kategorisierung reproduziert cis-normative Frameworks

**Open Questions:**
- Wie würden nicht-westliche feministische Frameworks (z.B. Decolonial Feminism) die Befunde interpretieren?
- Welche Formen struktureller Diskriminierung werden durch individualisierte Bias-Metriken unsichtbar gemacht?
- Wie können AI-Systeme Intersektionalität technisch abbilden, ohne Identitäten zu essentialisieren?
```

Dies operationalisiert Haraways situiertes Wissen: Jedes Paper wird als partiell und kontextgebunden dokumentiert.

### Meta-Synthesen: Normative feministische Kritik

Zusätzlich zu individuellen Papier-Summaries generiert die Pipeline meta-synthesis documents, die feministische Kritik über das gesamte Corpus aggregieren:

**Geplant:**
- `Synthesis/Feminist_AI_Critique.md`: Übergreifende Analyse der 9 Dimensionen
- `Synthesis/Intersectional_Blind_Spots.md`: Systematische Lücken in der Forschung
- `Synthesis/Professional_Authority_vs_Automation.md`: Spannungsfelder zwischen AI und Professional Judgment

Diese Meta-Dokumente bieten normative Orientierung für Praktiker:innen und Forschende.

### Verbindung zu Response-Ability

Die adaptive Operationalisierung demonstriert Response-Ability:
- **Verantwortung für Kontextgerechtigkeit:** Nicht jedes Paper wird mit derselben Schablone analysiert
- **Verantwortung für Transparenz:** Limitations werden systematisch dokumentiert
- **Verantwortung für Nutzbarkeit:** Praktiker:innen erhalten stakeholder-specific Handlungsempfehlungen

Die Pipeline "antwortet" auf jedes Paper mit kontextangemessener Analyse statt mechanischer Uniformität.

### Technischer Status (November 2025)

**Implementiert:**
- Enhanced Summarization Pipeline v2.0 mit Multi-Pass Reading
- Quality Metrics (Accuracy, Completeness, Structure, Actionability)
- Practical Implications (stakeholder-specific)
- Limitations & Open Questions

**In Design:**
- Adaptive Feminist Prompts (conditional activation basierend auf rel_bias/rel_vulnerable)
- 9-Dimensions Framework (Prompt-Templates entwickelt, nicht implementiert)
- Meta-Synthesis Documents (Konzept entwickelt, nicht implementiert)

**Nächste Schritte:**
- Testing der Enhanced Pipeline (benötigt `.env` mit API key)
- Integration der 9 Dimensionen in Prompt-Logik
- Generierung der ersten Meta-Synthesen
