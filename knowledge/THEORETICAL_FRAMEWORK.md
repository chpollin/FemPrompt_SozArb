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
1. **Architektur-Ebene:** Transformer-Design, Attention-Mechanismen
2. **Training-Ebene:** Daten, Objectives, Curriculum
3. **Alignment-Ebene:** RLHF, Constitutional AI, Persona-Vektoren
4. **Nutzungs-Ebene:** Prompt-Formulierung, Kontext, Interaktionsmuster

Die feministische Analyse muss daher über Input-Output-Betrachtung hinausgehen und Modell-Charakteristik selbst als epistemologisches Problem adressieren. Response-Ability bedeutet dann auch: Verantwortung für die Wahl des Modells, für Prompt-Design, für kritische Validierung emergenter Outputs.

Die Verbindung zu situiertem Wissen: Jedes LLM ist situiert nicht nur durch Training-Daten, sondern durch Architektur-Entscheidungen, Alignment-Prozesse und emergente Eigenschaften. Diese Situiertheit ist mehrschichtig und teilweise opak – was neue Herausforderungen für transparente, verantwortungsvolle Forschung schafft.

## Epistemologische Implikationen

Die Integration feministischer Theorie transformiert die Methodologie fundamental. Die Privilegierung von Kontext über Abstraktion, von Beziehungen über Isolation, von partiellen über universalen Wahrheiten prägt alle Designentscheidungen. Dies ist keine additive Ergänzung traditioneller Methoden, sondern eine strukturelle Neuausrichtung.

Die Multi-Modell-Strategie mit expliziter Divergenz-Dokumentation operationalisiert situiertes Wissen. Die mehrdimensionale Kategorisierung mit Fokus auf Verschränkungen operationalisiert Intersektionalität. Die Expert-Integration mit Begründungspflicht operationalisiert Response-Ability. Theoretische Konzepte werden in technische Infrastruktur übersetzt.

Die methodische Innovation liegt in der Verbindung computergestützter Automatisierung mit feministischer Epistemologie. Während traditionelle systematische Reviews Objektivität durch standardisierte Protokolle anstreben, akzeptiert dieser Ansatz Partialität und macht sie produktiv. Die Transparenz über Positionalität, die Wertschätzung von Divergenz und die Integration menschlicher Urteilskraft schaffen eine andere Form von Rigorosität.

Die Grenzen dieses Ansatzes sind ebenfalls epistemologisch bedingt. Die verwendeten KI-Modelle wurden primär mit englischsprachigen, westlichen Daten trainiert. Sie reproduzieren potentiell die Dominanz dieser Perspektiven. Die feministische Rahmung kann diese strukturelle Limitation reflektieren und transparent machen, aber nicht vollständig überwinden. Situiertes Wissen bedeutet auch, diese Grenzen anzuerkennen.
