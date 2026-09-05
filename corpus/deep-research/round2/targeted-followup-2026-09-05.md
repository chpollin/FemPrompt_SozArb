# Gezielte Ergänzungssuche vom 5. September 2026

**Ergebnis: drei neue Identifikationskandidaten für konkrete Evidenzlücken.** Alle bleiben `identified_not_screened`. Weder Zotero noch der kanonische Korpus wurden geändert. Die Auswahl besagt, dass die Arbeiten eine genaue Prüfung verdienen; sie erteilt keine Einschlussentscheidung oder fachliche Freigabe.

Die Suche ergänzt den bestehenden Korpus und die vorbereiteten 2026-Pakete gezielt um direkte Sozialarbeitsanwendungen und empirische Prompting-/Bias-Untersuchungen. Sie ist keine Wiederholung oder Aktualisierung der vollständigen systematischen Suche. Der bisherige Suchstichtag bleibt bestehen; diese zusätzliche Suche besitzt ihren eigenen Stichtag 2026-09-05. Auch ältere, bisher fehlende Arbeiten durften konkrete Lücken schließen. Deshalb sind die drei Treffer keine zusätzlichen „2026-Publikationen“.

## Durchführung und Abgleich

Agent: `/root/grounded_chat`; Laufzeitangabe des Modells: GPT-6, genaue Deployment-Kennung nicht verfügbar. Recherche und Zugriffe: 2026-09-05; Protokollabschluss: 12:49 UTC. Sechs Suchanfragen wurden tatsächlich ausgeführt:

1. `"social work" "large language models" bias empirical 2025 2026`
2. `"social workers" ChatGPT bias vignettes ethnicity prompting`
3. `LLM mental health intersectional bias prompting mitigation empirical 2025 2026`
4. `"617" "social care" "gender" "language models"`
5. `"Artificial Intelligence and Cultural Context" "735590" PDF`
6. `"Unveiling and Mitigating Bias in Mental Health Analysis" publication journal`

Suchtreffer dienten der Identifikation. Inhaltliche Auswahl und Metadaten beruhen auf den verlinkten Verlags-/Repositoryquellen. Es erfolgte keine Scopus-/Web-of-Science-Suche und keine Vollständigkeitsbehauptung. Alle Treffer wurden nach DOI/arXiv-Kennung und normalisiertem Titel gegen den Zotero-Export, die Work-Version-Registry und sämtliche JSON-/RIS-Dateien unter `corpus/` abgeglichen, insbesondere das vollständige **Codex Websearch**-Paket einschließlich Rohspuren, Audits und die kontextuelle Ergänzung vom 24. August. Die drei ausgewählten Titel besitzen dort keinen eigenen Datensatz. Dateihashes der verglichenen JSON-/RIS-Quellen stehen im benachbarten JSON-Protokoll.

Qi und Wang werden bereits in Literaturverzeichnissen lokal beschaffter anderer Arbeiten erwähnt. Solche Quellenverweise wurden ausdrücklich von selbstständigen Korpus-/Kandidateneinträgen unterschieden. Fundstellen: `generated/source-acquisition/codex-websearch-2026/markdown-raw/5fa4fb41e396f11b2c6e.md` (Qi); `html-markdown/166a9834b422f052b7c5.md` und `markdown-raw/136b6db72d8a7b8d390c.md` im selben Beschaffungsverzeichnis (Wang).

## Auswahl

### 1. Direkte soziale Versorgung und Geschlechterbias

**Sam Rickman (2025): Evaluating gender bias in large language models in long-term care.** BMC Medical Informatics and Decision Making 25, 274. Version of Record: 2025-08-11. [Verlagsvolltext](https://link.springer.com/article/10.1186/s12911-025-03118-0).

Die Studie untersucht Zusammenfassungen geschlechtsvertauschter Sozialversorgungsakten älterer Menschen. Damit schließt sie die Lücke zwischen allgemeinen Bias-Benchmarks und sozialarbeiterischer Dokumentation. Gelesen wurden Methoden, Ergebnisabschnitte, Diskussion und Limitationen. Der Befund betrifft modellabhängige Unterschiede in Zusammenfassungen; Auswirkungen auf tatsächlich bewilligte Hilfen wurden nicht gemessen. Begrenzungen: ein lokaler Versorgungskontext, kurze Texte und binärer Geschlechtertausch. Eine wirksame Prompt-Mitigation wird hier nicht nachgewiesen. Volltext frei zugänglich, CC BY 4.0; private Fallakten bleiben geschützt.

### 2. Sozialarbeitskompetenz außerhalb westlicher Kontexte

**Zia Qi et al. (2025): Artificial Intelligence and Cultural Context: An Empirical Investigation of Large Language Models’ Performance on Chinese Social Work Professional Standards.** Journal of the Society for Social Work and Research 16(4), 713–739. Onlinepublikation: 2025-12-16; Heftdatum: 2025-12-01. [Verlagsdatensatz und Abstract](https://www.journals.uchicago.edu/doi/abs/10.1086/735590).

Besonders direkte Passung durch chinesische Sozialarbeitsprüfungen, kulturelle Anwendungsszenarien und berichtete Probleme bei Geschlechtergleichstellung. **Nur der strukturierte Abstract und die Publikationshistorie waren zugänglich**; der Volltextaufruf führte zur Zugangsschranke, beide Supplement-Aufrufe scheiterten. Deshalb bleiben Prüfung der Promptbedingungen, Auswertung und konkreten Gender-Belege offen. Prüfungsleistung ist kein Nachweis professioneller Handlungskompetenz. Vorrangiger Kandidat zur Volltextbeschaffung, ohne vorweggenommene Methodenbewertung.

### 3. Prompt-Mitigation und intersektionale Mental-Health-Auswertung

**Yuqing Wang et al. (2024): Unveiling and Mitigating Bias in Mental Health Analysis with Large Language Models.** arXiv:2406.12033v2, 2024-06-19. [Versionierter Volltext](https://arxiv.org/html/2406.12033v2), [Versionshistorie](https://arxiv.org/abs/2406.12033).

Gelesen wurden Abschnitte 3, 4.5, 6 und die Promptvorlagen. Die Arbeit bietet konkrete Vergleichsbedingungen und Bias-Metriken für Mental-Health-Klassifikation samt kombinierten demografischen Merkmalen. Sie ergänzt die vorhandenen generischen Promptstudien. Grenzen: künstlich ergänzte Identitätsmerkmale, ausgewählte Aufgaben und Modelle, keine soziale Versorgung im Feld. Gelesene Fassung ist ein Preprint; eine begutachtete Endfassung wurde nicht verifiziert. Die zusätzlich gefundene OpenReview-Seite verlangte eine Browserprüfung. Relevanz rechtfertigt Methodenprüfung, nicht Übernahme berichteter Verbesserungen als gesicherte Praxiswirkung.

## Bewusst nicht erneut aufgenommen

| Treffer | Entscheidung und lokaler Nachweis |
|---|---|
| [Stigmatisierende kontextuelle Gesundheitsurteile](https://www.nature.com/articles/s44360-026-00164-4) | Bereits im Codex-Websearch-Hauptpaket und dessen Import-RIS: DOI `10.1038/s44360-026-00164-4`. |
| [Medizinische Prompt-Bias-Mitigation](https://pubmed.ncbi.nlm.nih.gov/42463224/) | Bereits im Hauptpaket und Kontextupdate: DOI `10.1098/rsta.2025.0125`. |
| [New model, old risks](https://pubmed.ncbi.nlm.nih.gov/41935214/) | Bereits im Hauptpaket und Kontextupdate; PMID `41935214`. |
| [Mental Health Equity in LLMs](https://arxiv.org/abs/2506.18116) | Bereits Kandidat in `contextual-update-2026-08-24/lane-c-prompt-bias.json`; arXiv `2506.18116`. |
| [Psychotherapy Safety](https://www.medrxiv.org/content/10.64898/2026.07.16.26358261v1.full) | Bereits in den Rohkandidaten von Codex Websearch und Kontextupdate erfasst. |
| [Nationalitätsvorurteile und Psychophobie](https://arxiv.org/abs/2505.17045) | Schon im Zotero-Export/Registry über arXiv `2505.17045`; widersprüchliche ältere Metadaten sind kein Grund für einen neuen Dubletteneintrag. |
| [Wikidata/lateinamerikanische Kulturbewertung](https://aclanthology.org/2026.mme-main.11/) | Primärdatensatz gelesen, grundsätzlich relevant; für diese begrenzte Ergänzung weniger direkte Passung als die drei ausgewählten Anwendungs-/Mitigationsstudien. Keine neue Aufnahme. |

Der LSE-Blog zur Versorgung war ein Suchhinweis, sein direkter Aufruf scheiterte mit HTTP 429. Die Auswahl von Rickman stützt sich auf den zugänglichen Originalartikel. Sekundäre Pressebeiträge und Suchmaschinen-Snippets wurden nicht als Studienbelege übernommen.

## Nächster fachlicher Schritt

Metadaten und Fassungen mit Zotero verbinden, Qi-Volltext beschaffen, anschließend sämtliche Kandidaten durch das reguläre Screening und die Quellenprüfung führen. Bis dahin gehen weder ihre Titel in den final eingeschlossenen Nenner noch ihre Befunde in den öffentlichen Assertion-Index ein. Das JSON und RIS sind eine nachvollziehbare Identifikationsliste, kein fertiger Ergebnisdatensatz.
