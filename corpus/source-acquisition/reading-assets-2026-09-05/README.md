# Quellen-QC: SwiftSage und ReGiFT

Prüfer: `/root/research_completion`. Modell: `GPT-6`; die Runtime nennt die Modellfamilie, keine genaue Deployment-Kennung. Beginn: `2026-09-05T18:34:44Z`; abgeschlossen: `2026-09-05T18:45:20.232477+00:00`.

**Ergebnis:** Beide Quellen sind bibliografisch eindeutig identifiziert. Die vorhandenen Markdown-Dateien enthalten exakt den vollständigen Artikeltext der angegebenen offiziellen arXiv-HTML-Version. Für eine vollständige verfügbare Lesegrundlage müssen die unten aufgeführten, visuell geprüften Originalseiten zusätzlich an dieselbe Version gebunden und den Reviewern zugänglich gemacht werden. Der Markdown-Text allein ist visuell unvollständig. Dies ist eine Quellenprüfung, keine Screeningentscheidung, Kriteriencodierung oder Qualitätsfreigabe der Studien.

Die acht Abbildungsseiten, alle neun Abbildungen und das gesonderte SwiftSage-Pseudocode-PNG wurden tatsächlich visuell betrachtet. Die vollständigen lokalen HTML-Texte einschließlich Anhängen wurden gelesen. Die frischen HTML-Antworten sind byteidentisch zu den dokumentierten Erwerbsantworten. Die Markdown-Bodies entsprechen exakt `BeautifulSoup(article).get_text("\n", strip=True)` nach Entfernung des Erwerbsvorspanns und eines abschließenden Zeilenumbruchs. Es wurden keine historischen Screeningtracks konsultiert und keine produktiven Dateien verändert.

## Identität und Textabdeckung

### RAY6G2R7 / 2305.17390v2

SwiftSage: A Generative Agent with Fast and Slow Thinking for Complex Interactive Tasks. Autoren: Lin, Bill Yuchen; Fu, Yicheng; Yang, Karina; Brahman, Faeze; Huang, Shiyu; Bhagavatula, Chandra; Ammanabrolu, Prithviraj; Choi, Yejin; Ren, Xiang.

Erstsubmission: `2023-05-27`; geprüfte Version: `2023-12-06`. [Offizielle Versionsmetadaten](https://arxiv.org/abs/2305.17390v2) und [Original-HTML](https://arxiv.org/html/2305.17390v2) stimmen überein. SwiftSage v2 ist als NeurIPS-2023-Beitrag ausgewiesen; ReGiFT v3 trägt im PDF „Preprint. Under review.“. Die arXiv-Version wird nicht als andere Verlagsversion ausgegeben.

Lokaler Text: [swiftsage-arxiv-v2-text.md](../residual-resolution-2026-09-05/swiftsage-arxiv-v2-text.md); SHA256 `sha256:fd64251d9eed80eca0689fe3bad5e8ea15465746be71af1e38d7f8c9bdb553d1` (64856 Bytes, 2899 Zeilen).

Abdeckung: Abstract, sections 1-5, acknowledgements, 41 references, appendices A-C through C.3 and final Table 4.

Four numbered tables; HTML row counts including headers/summaries are 35, 36, 35, 36. All cell text is retained, but grid, bolding and merged-header layout are flattened. Table 1 Overall SwiftSage 84.68, Table 3 Overall Swift-only 49.22/GPT-3.5 SwiftSage 62.22 and Table 4 Overall SwiftSage 757.07 tokens/action are readable and retain their correct table context. Exact numeric extraction must retain the original table header groups.

Original-PDF (18 Seiten): [swiftsage-2305.17390v2.pdf](https://arxiv.org/pdf/2305.17390v2); SHA256 `sha256:193dbdfb2bcf9a155dda81eeab11a951628754bb69d3a91e0ccf89a9c005456f`. Es bleibt lokal; nur die abgeleiteten Seitenbilder sind als zusätzliche Review-Assets vorgesehen.

### SQYLQFRU / 2504.05632v3

Reasoning Towards Fairness: Mitigating Bias in Language Models through Reasoning-Guided Fine-Tuning. Autoren: Kabra, Sanchit; Jha, Akshita; Reddy, Chandan K..

Erstsubmission: `2025-04-08`; geprüfte Version: `2025-06-05`. [Offizielle Versionsmetadaten](https://arxiv.org/abs/2504.05632v3) und [Original-HTML](https://arxiv.org/html/2504.05632v3) stimmen überein. Der geprüfte PDF-Kopf lautet „Preprint. Under review.“.

Lokaler Text: [kabra-arxiv-v3-text.md](../residual-resolution-2026-09-05/kabra-arxiv-v3-text.md); SHA256 `sha256:bac6454052cd33fa790fde5c12b2bfc10fd340fb20433725feecd6a804283620` (55758 Bytes, 1596 Zeilen).

Abdeckung: Abstract, sections 1-7, ethics/reproducibility/limitations, 33 references, Appendix A.1-A.5 through A.5.4.

Five numbered result tables, with 10, 10, 17, 5 and 7 HTML rows including header/model-group rows. A sixth HTML table is only an equation layout, not a sixth result table. All cells survive; grouped Age/Religion/Nationality and Ambig./Disambig./Overall headers require reconstruction from DOM/original view. Algorithm 1 is fully present as text. MathML visible strings and TeX annotations are duplicated, not separate equations. Appendix example tags rendered as inverted punctuation are already present in original HTML and must not be treated as clean executable prompt syntax.

Original-PDF (17 Seiten): [kabra-2504.05632v3.pdf](https://arxiv.org/pdf/2504.05632v3); SHA256 `sha256:38d8bdd5fee5c45b151d153a2d2d96865b5d4164804eb321fd489df21aaf2ea7`. Es bleibt lokal; nur die abgeleiteten Seitenbilder sind als zusätzliche Review-Assets vorgesehen.

## Visueller Befund je Abbildung

| Quelle / Abbildung | Originalseite | Bedeutung der fehlenden Textrepräsentation |
|---|---:|---|
| SwiftSage 1 | 2 | Methodenvergleich mit Aufrufhäufigkeit, Demonstrationen, Planung/Grounding und Buffer. Inhaltlich in Einleitung, §2.3 und §3.3–3.4 beschrieben; genaue Dialogbeispiele und Kanten benötigen das Bild. |
| SwiftSage 2 | 5 | Defekter Herd beim Schmelzen von Eiscreme; Wechsel zu Sage und Ofen-Aktionsfolge. Ausnahmebehandlung und Templates sind im Text vorhanden; der genaue Beispielzustand nicht. |
| SwiftSage 3 | 9 | 30 Aufgabenplots, blau SwiftSage, rot ReAct, grau Oracle. §4.3 und Tabellen liefern aggregierte Aussagen, aber keine Kurvenkoordinaten. Exakte Zeit-/Kurvenwerte wurden nicht digitalisiert. |
| SwiftSage 4 | 15 | Der 23-zeilige Pseudocode fehlt im Markdown. Separate quellentreue Transkription vorhanden; Originalfehler bleiben sichtbar. |
| SwiftSage 5 | 18 | Verlaufskurven nach kurzen, mittleren und langen Aufgaben. Die Gesamtdiskussion steht in C.2/C.3; Einzelverläufe und Verteilungen bleiben bildabhängig. |
| ReGiFT 1 | 2 | Konzeptionelles Religionsbias-Beispiel für Basismodell, Reasoning-Modell und transferiertes Reasoning. Methode im Text beschrieben; genaue Beispielantworten sind bildabhängig, keine separate quantitative Evaluation. |
| ReGiFT 2 | 2 | Literaturpositionierung in vier Quadranten. SVG-Beschriftungen sind im Text vorhanden, ihre räumliche Zuordnung nicht. ReGiFT steht bei Reasoning plus Instruction-Finetuning. |
| ReGiFT 3 | 7 | Zwei konkrete qualitative Religionsbias-Beispiele, einmal unterbestimmt und einmal durch Evidenz entscheidbar. §5.1 erläutert das Muster; die anderen Anhangbeispiele ersetzen diese Bildbeispiele nicht. |
| ReGiFT 4 | 9 | Mittelwerte 139,62 bzw. 243,81 Tokens stehen auch in §6. Die Fehlerbalken sind nicht als SD, SE oder Konfidenzintervall definiert; keine Streuungswerte oder Signifikanz daraus codieren. |

SwiftSage Figure 4: [swiftsage-figure4-transcription.md](swiftsage-figure4-transcription.md). Insbesondere wird `sum(S[-5:])` nicht still in eine Reward-Summe geändert; das Original summiert Scores, während §3.4 Rewards beschreibt. Außerdem füllt der Sage-Zweig einen Buffer, bevor ohne sichtbare neue Zuweisung `A_t` ausgeführt wird. Die Abbildung ist illustrative Pseudocode-Dokumentation, kein nachgewiesen ausführbares Programm. B.3 enthält zusätzliche Buffer-Fehlerregeln.

## Vollständige Liste der geprüften Bildbelege

Alle Seiten-PNGs wurden aus dem jeweils gehashten versionierten Original-PDF mit PyMuPDF, Faktor 1,7, ohne Alpha gerendert; vollständige Seiten ohne inhaltliche Bearbeitung. Das Figure-4-PNG wurde unverändert vom arXiv-HTML-Asset übernommen. Die folgenden SHA256-Werte wurden nach der Prüfung nochmals gegen die lokalen Dateien validiert.

| Datei | Originalquelle / Seite / Figuren | SHA256 |
|---|---|---|
| [swiftsage-2305.17390v2-page-2.png](assets/swiftsage-2305.17390v2-page-2.png) | [Quelle](https://arxiv.org/pdf/2305.17390v2), S. 2, Fig. 1 | `sha256:c353cb1a1745c8e455bccaf0f287e6fc4c1c5ccfddedcebf2352d170535cd6ba` |
| [swiftsage-2305.17390v2-page-5.png](assets/swiftsage-2305.17390v2-page-5.png) | [Quelle](https://arxiv.org/pdf/2305.17390v2), S. 5, Fig. 2 | `sha256:a52b0214660a4b6e9a657f4600e740cc4e5e2fad6075aa7e75d180567958e8ce` |
| [swiftsage-2305.17390v2-page-9.png](assets/swiftsage-2305.17390v2-page-9.png) | [Quelle](https://arxiv.org/pdf/2305.17390v2), S. 9, Fig. 3 | `sha256:d03bf00413fbd65c7ef60f3dabfff1cee966bfe02838536a1c1b22f961a3f98f` |
| [swiftsage-2305.17390v2-page-15.png](assets/swiftsage-2305.17390v2-page-15.png) | [Quelle](https://arxiv.org/pdf/2305.17390v2), S. 15, Fig. 4 | `sha256:beff42eb886a52f5c4ce0fd1ab3bb20b73811f0c4d400340c932829f737f2a1d` |
| [swiftsage-2305.17390v2-page-18.png](assets/swiftsage-2305.17390v2-page-18.png) | [Quelle](https://arxiv.org/pdf/2305.17390v2), S. 18, Fig. 5 | `sha256:314a51bdc0b3ee89d859c6e8d93348e0f87ce3b2a9c6256a78f950be5a6f8488` |
| [swiftsage-figure4.png](assets/swiftsage-figure4.png) | [Quelle](https://arxiv.org/html/2305.17390v2/image.png), S. 15, Fig. 4 | `sha256:0d5e30495ab0cd0d6531a618b18ab9540a0dfa09bb9ba1ae54ba4a95fce9faf8` |
| [kabra-2504.05632v3-page-2.png](assets/kabra-2504.05632v3-page-2.png) | [Quelle](https://arxiv.org/pdf/2504.05632v3), S. 2, Fig. 1,2 | `sha256:1fe0bb3d9726a6fec06b66dab08cc4d9eff3d8b9feda38da152acd66084e46a1` |
| [kabra-2504.05632v3-page-7.png](assets/kabra-2504.05632v3-page-7.png) | [Quelle](https://arxiv.org/pdf/2504.05632v3), S. 7, Fig. 3 | `sha256:97ee9803cd792f65839b3271e4fc8b714473ec209b24c6e5c159f73188f9d3e8` |
| [kabra-2504.05632v3-page-9.png](assets/kabra-2504.05632v3-page-9.png) | [Quelle](https://arxiv.org/pdf/2504.05632v3), S. 9, Fig. 4 | `sha256:7c4df10bb49855fd895e8d8110a801c7020a82fcd0c8f8dbff50aabb97016afc` |

Lizenz beider Paper und ihrer hier übernommenen Abbildungen: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Die Lizenzbelege stehen unter `license_links[0]` in [swiftsage-arxiv-metadata.json](../residual-resolution-2026-09-05/swiftsage-arxiv-metadata.json) und [kabra-arxiv-metadata.json](../residual-resolution-2026-09-05/kabra-arxiv-metadata.json); online in den Lizenzlinks der [SwiftSage-v2-Seite](https://arxiv.org/abs/2305.17390v2) und [ReGiFT-v3-Seite](https://arxiv.org/abs/2504.05632v3). [qc.json](qc.json) enthält zusätzlich Lizenzbeleg-Hashes, Ursprungs-PDF-Hashes, URLs, Seiten-/Figurenzuordnung und Reviewer-Attribution für jedes Asset.

## Präziser Freigabevertrag

Quellen-QC: **bereit für einen isolierten Source-Review mit den deklarierten Original-Assets**. Voraussetzungen: unveränderter Markdown-Text und die zugehörigen gehashten Seitenbilder werden gemeinsam an genau die geprüfte Version gebunden und vom jeweiligen Reviewer tatsächlich gelesen. SwiftSages Transkription bleibt eine gekennzeichnete Zusatzrepräsentation neben dem Originalbild. Ohne diese Assets bleibt visuelle Vollständigkeit gesperrt. Auch mit Assets bleiben nicht digitalisierte Kurvendaten, undefinierte Fehlerbalken und die dokumentierten Pseudocode-Unstimmigkeiten offen; sie dürfen weder ausgedacht noch still korrigiert werden.

Dieser Befund bestimmt ausschließlich die verfügbare Quellenbasis. Screeningvotum, Kriteriencodierung und Studienqualität sind nicht Gegenstand dieser Prüfung.

## Ablage nach der Prüfung

Die PNGs sind unverändert in `assets/` versioniert; `qc.json` bewahrt Originalhashes, Reviewzeit und frühere Ablagepfade. Die lokalen PDFs bleiben Erwerbsbelege außerhalb des Builds. Die separate Pseudocode-Transkription bewahrt ihren originalen Wortlaut und die damals verwendeten lokalen Pfade; das zugehörige Bild liegt jetzt unter `assets/swiftsage-figure4.png`. Die Quellenbindung und der Review-Lauf müssen Text und alle zugewiesenen Bilder gemeinsam adressieren.
