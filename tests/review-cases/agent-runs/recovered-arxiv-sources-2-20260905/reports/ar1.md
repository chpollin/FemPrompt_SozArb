# recovered-arxiv-sources-2-20260905 · ar1

- Akteur: agent; Actor-Typ `ai_agent`; Actor-ID `/root/source_reviewer_a`.
- Reviewer: `ar1`; Zuweisung in bearbeiteter Reihenfolge: `RAY6G2R7`, `SQYLQFRU`.
- Modell: OpenAI, tatsächliche offengelegte Modellfamilie **GPT-6**. Die genaue Deployment-/Versionskennung ist in dieser Laufzeit nicht offengelegt; keine unveränderliche Modellkennung wird behauptet.
- Tatsächlicher Beginn UTC: `2026-09-05T19:03:07Z`.
- Tatsächlicher Abschluss UTC: `2026-09-05T19:12:23Z`.
- Coding-Paket: `tracks/ar1-coding.json`; SHA-256 `5c1bf6bb4ee5044f8c0407316c6560bda3bbeec7ca34d67b3942d6098e7b71ff`.
- Quellenbasis: vollständige zugewiesene Original-HTML-Textauszüge plus sämtliche neun manifestierten Original-PNGs; `Fulltext`.
- Ergebnis: **bestanden**.
- Verteilung: Include 1 · Unclear 0 · Exclude 1 · Blockiert 0.

## Ausführung und Quellenprüfung

Vollständig gelesen wurden `skills/prism-agent-review/SKILL.md`, `prompts/prism-agent-reviewer-v1.2.md` und `assessment/categories.yaml` v1.3. Aus `knowledge/update-protocol.md` wurden Eligibility, Text preparation and source gate, Agent-assisted completion und Analysis coding einschließlich Source-review clarification vom 5. September 2026 gelesen. Der eigene manifestierte Auftrag sowie Validator und Analysevokabular bildeten den Ausgabevertrag. Es wurden keine früheren Urteile, anderen Tracks, produktiven Screeningdateien, Wissensdestillate, QC-Berichte oder Status-/Journaldateien geöffnet.

Der tatsächlich verwendete Prompt-Hash ist `3aea5ce1e84a3f2557aee507632552816792a27d698003517ae238e1ec96d8af` und stimmt mit dem Manifest überein. Die beiden Textdateien und alle neun PNG-Dateien wurden vor der Lektüre und nach dem Coding gegen die manifestierten SHA-256-Werte geprüft: **11/11 Übereinstimmungen**. Die ursprünglichen PDF-Hashes bleiben manifeste Quellenprovenienz; die PDF-Dateien selbst waren keine zugewiesenen Lesedateien und wurden hier nicht erneut gehasht.

Dieser eigene Kontext, die Reviewer-Identität und die eigenen Ausgabepfade dokumentieren operationale Trennung. Daraus folgt **kein Anspruch epistemischer Unabhängigkeit**.

## Vollständige Textabdeckung

| Paper-ID | Datei unter `corpus/source-acquisition/residual-resolution-2026-09-05/` | Tatsächlicher SHA-256 | Gelesener Umfang |
|---|---|---|---|
| RAY6G2R7 | `swiftsage-arxiv-v2-text.md` | `fd64251d9eed80eca0689fe3bad5e8ea15465746be71af1e38d7f8c9bdb553d1` | Alle 2.899 Zeilen / 64.856 Bytes: Titel, neun Autor:innen, Abstract, §§ 1–5, Limitationen, Danksagung, gesamte Bibliografie, Appendix A, B.1–B.3, C.1–C.3 einschließlich aller Tabellen bis zur letzten Zeile von Tabelle 4. |
| SQYLQFRU | `kabra-arxiv-v3-text.md` | `bac6454052cd33fa790fde5c12b2bfc10fd340fb20433725feecd6a804283620` | Alle 1.596 Zeilen / 55.758 Bytes: Titel, drei Autor:innen, Abstract, §§ 1–7, sämtliche Tabellen, Ethics/Reproducibility/Limitations, gesamte Bibliografie, A.1–A.5 einschließlich aller vier Reasoning-Trace-Beispiele und aller vier qualitativen BBQ-Beispiele. |

Die sequenzielle vollständige Lektüre wurde vor der Auswahl der Belege abgeschlossen. Navigations- und Belegnachlese ersetzten keine Abschnitte. Bibliografie und bloß referierte Fremdergebnisse wurden nicht als Kategorienbelege verwendet.

## Vollständige visuelle Abdeckung

Alle folgenden Dateien liegen unter `corpus/source-acquisition/reading-assets-2026-09-05/assets/`. Jede wurde tatsächlich mit `view_image` geöffnet und visuell geprüft; die Tabelle erfasst alle neun manifestierten Assets.

| Datei | Tatsächlicher SHA-256 | Inspektion |
|---|---|---|
| `swiftsage-2305.17390v2-page-2.png` | `c353cb1a1745c8e455bccaf0f287e6fc4c1c5ccfddedcebf2352d170535cd6ba` | Ganze Seite 2, Fig. 1: SayCan/ReAct/Reflexion/SwiftSage, unterschiedliche Inferenzschleifen, Planung/Grounding/Buffer; zugehöriger Text. |
| `swiftsage-2305.17390v2-page-5.png` | `a52b0214660a4b6e9a657f4600e740cc4e5e2fad6075aa7e75d180567958e8ce` | Ganze Seite 5, Fig. 2: defekter Herd, Wechsel zu Sage, Ofenplan und Action Buffer; Methoden- und Balance-Text. |
| `swiftsage-2305.17390v2-page-9.png` | `d03bf00413fbd65c7ef60f3dabfff1cee966bfe02838536a1c1b22f961a3f98f` | Ganze Seite 9, Fig. 3: alle 30 Trajektorienfelder mit SwiftSage/ReAct/Oracle, Aufgaben-IDs und Caption; Ergebnistext. |
| `swiftsage-2305.17390v2-page-15.png` | `beff42eb886a52f5c4ce0fd1ab3bb20b73811f0c4d400340c932829f737f2a1d` | Ganze Seite 15, Fig. 4: Pseudocode und Appendix-B-Implementierungsdetails. |
| `swiftsage-2305.17390v2-page-18.png` | `314a51bdc0b3ee89d859c6e8d93348e0f87ce3b2a9c6256a78f950be5a6f8488` | Ganze Seite 18, Fig. 5: Short/Medium/Long-Trajektorien, Score-/Zeitachsen, Legende und Caption; vollständige Tabelle 4. |
| `swiftsage-figure4.png` | `0d5e30495ab0cd0d6531a618b18ab9540a0dfa09bb9ba1ae54ba4a95fce9faf8` | Zusätzlich alle 23 Pseudocodezeilen der unveränderten Originalfigur inspiziert, einschließlich Buffer-, Modus- und Scorebedingungen. |
| `kabra-2504.05632v3-page-2.png` | `1fe0bb3d9726a6fec06b66dab08cc4d9eff3d8b9feda38da152acd66084e46a1` | Ganze Seite 2, Fig. 1: religionsbezogene stereotype Antwort versus Abstention; Fig. 2: Reasoning-/Methodenvergleich; zugehöriger Text. |
| `kabra-2504.05632v3-page-7.png` | `97ee9803cd792f65839b3271e4fc8b714473ec209b24c6e5c159f73188f9d3e8` | Ganze Seite 7, Fig. 3: beide ambigen/disambigen Kontextblöcke und alle vier Modellantworten; § 5.2 einschließlich CoT-Beschreibung. |
| `kabra-2504.05632v3-page-9.png` | `7c4df10bb49855fd895e8d8110a801c7020a82fcd0c8f8dbff50aabb97016afc` | Ganze Seite 9: Tabelle 5, Fig. 4 mit Mittelwertbeschriftungen, Achsen, Fehlerbalken und Caption; Begleittext und Schlussbeginn. |

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | Positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| RAY6G2R7 | Fulltext + 6 PNGs | provisional: nur konkretes Publikationsdatum nicht separat belegt | Exclude — Not_relevant_topic | Generative_KI ja; Prompting ja; KI_Sonstige ja | Technikdimension ja, soziale Dimension vollständig nein. |
| SQYLQFRU | Fulltext + 3 PNGs | provisional: nur konkretes Publikationsdatum nicht separat belegt | Include | Generative_KI ja; Prompting ja; Bias_Ungleichheit ja; Diversitaet teilweise; Fairness ja | Vollständige Analyse; eigenes Experiment zur Mitigation. |

**RAY6G2R7:** Generative Planung und zweistufiges Prompting sind Kernbeiträge. Imitation Learning/Behavior Cloning und die heuristische Agentensteuerung sind ebenfalls integrale Methodenbeiträge; deshalb KI_Sonstige ja. Menschliche KI-Kompetenzentwicklung wird nicht untersucht. ScienceWorld-Aufgaben sind technische Simulatoraufgaben ohne Sozialarbeitsbezug. Datenimbalance betrifft Aufgaben/Aktionen; sie belegt hier keine soziale Benachteiligung. Der Vergleich von Methoden als „fair/unfair“ betrifft ungleiche Versuchszahlen, keine algorithmische Fairness gegenüber Personengruppen. Gender, soziale Diversität und feministische Perspektiven werden nicht bearbeitet. Die deterministische Exclude-Entscheidung benötigt keine Analysefelder.

**SQYLQFRU:** Die zentrale Untersuchung betrifft generative LMs, stereotype Outputs und konkret operationalisierte algorithmische Fairness. Der selbst durchgeführte CoT-Vergleich und genaue Promptvorlagen tragen Prompting ja. Die Berücksichtigung verschiedener demografischer Gruppen ist explizit, bleibt als Diversitätsaspekt gegenüber der Reasoning-/Mitigationsfrage nachgeordnet: teilweise. Es gibt keinen eigenen Gender- oder feministischen Fokus und keine Interaktionsanalyse zweier Bias-Achsen. Modelllernen ist keine menschliche AI Literacy; allgemeines Reading Comprehension ist keine sozialarbeiterische oder professionelle Bildungspopulation. Weitere nichtgenerative KI-Systeme sind kein eigener Untersuchungsgegenstand.

Die Include-Analyse codiert Research_Instrument/Object_of_Critique; Thought_Generation/General_Guidance; Age/Religion/Nationality_Migration; Stereotyping; Pre_Processing/In_Training/Prompt_Practice; Evaluated; Not_SW_Specific; Fulltext; Experimentell. `AN_Notes` enthält die wortgetreue konkrete General_Guidance, Quellenstellen für jede Mitigationsstufe sowie Grenzen des Evaluated-Status. Answer-Extraktion und Unknown-Normalisierung sind Messverfahren und begründen keine zusätzliche Mitigationsstufe.

## Abweichungen und Blocker

- **Beide Papers · Metadatenlücke, nicht blockierend:** Titel, vollständige Autor:innenlisten und stabile arXiv-Versionen stimmen. Die Jahresangaben sind mit den Kennungen konsistent. Die konkreten Manifestdaten 2023-12-06 bzw. 2025-06-05 sind in den bereitgestellten Paper-Ebenen nicht als Publikationsdatum ausgewiesen; darum bewusst `provisional`, ohne erfundene externe Datumsverifikation. Kein Titel-/Identitätskonflikt. Beide sind wissenschaftliche Manuskripte; gemäß Manifest werden die bereits kanonischen Records nicht als neue Intake-Kandidaten gegen das aktuelle Suchfenster ausgeschlossen.
- **RAY6G2R7 · Methodeninkonsistenz, nicht blockierend für Screening:** § 3.4 definiert fünf Schritte ohne Reward-Zuwachs als Umschaltbedingung. Fig. 4, Zeile 21, prüft `sum(S[-5:]) == 0`, obwohl S im Paper Score-Historie bezeichnet. Kumulative Scores und Rewards sind nicht dieselbe Größe. Für eine Reproduktion müsste diese Quellendifferenz geklärt werden; kein eigener Ersatzalgorithmus wurde unterstellt.
- **SQYLQFRU · Zahlen-/Ergebnisinkonsistenzen, nicht blockierend für Screening:** Tabelle 1 und Tabelle 3 nennen teilweise unterschiedliche Werte, etwa Mistral-ReGiFT Age Ambig. 82.78/82.58 sowie Phi-4 Base Religion. § 5.2 bezeichnet CoT-Gewinne allgemein als modest, obwohl Tabelle 3 mehrere Rückgänge enthält. Die Zahlen wurden weder korrigiert noch zu einem einheitlichen Effektschätzer zusammengeführt. Quantitative Synthese benötigt eine Klärung an der Quelle.
- **SQYLQFRU · Visuelle Unsicherheit:** Original-Fig. 4 zeigt Mittelwerte 139.62/243.81 und nicht näher bezeichnete Fehlerbalken. Weder Fehlerbalkentyp, Konfidenzniveau noch Signifikanztest lassen sich daraus belegen. Die Formulierung „significant difference“ des Textes wird nicht als belegte statistische Signifikanz übernommen.
- **SQYLQFRU · Methodengrenze:** Finale Antwortkorrektheit ist ein ausdrücklich eingeschränkter Proxy für Trace-Qualität (§ 3.1, Fußnote). Evaluated bedeutet hier eine abgeschlossene Mitigationsevaluation mit Ergebnissen; keine vollständige Bias-Beseitigung und keine gesicherte Übertragbarkeit auf Sozialarbeitspraxis.
- **Blocker:** keine. Es wurden keine Felder künstlich als None ersetzt, obwohl sie nicht entscheidbar wären; alle Analysefelder sind aus der verfügbaren Paper-Ebene codierbar. Die benannten Unsicherheiten betreffen Metadatenpräzision, Reproduktion und quantitative Aussagen.

## Selbstprüfung

- Zugewiesene und codierte IDs stimmen einschließlich Reihenfolge überein: ja.
- Alle zehn Kategorien und vollständigen Evidence-Arrays je Paper vorhanden: ja.
- Alle positiven Kategorien haben zeichengetreue, zusammenhängende Paper-Belege: ja; zusätzlicher strikter, nicht normalisierender Substring-Test für **11/11 Zitate** bestanden.
- Alle Includes sind vollständig analysiert: ja, 1/1.
- Vollständige Text- und Bildabdeckung: ja, beide ganzen Texte und 9/9 Original-PNGs.
- Prompt- und Quellenhashes stimmen: ja; finale erneute Quellenprüfung 11/11.
- Coding-Paket-Validator bestanden: ja; `node tests/review-cases/validate-coding-packet.mjs tests/review-cases/agent-runs/recovered-arxiv-sources-2-20260905/run.json ar1` meldet `PASS coding packet: ar1, 2 records`.
- Geschrieben wurden ausschließlich das eigene Coding-Paket und dieser Bericht. Manifest, Quellen, Programmcode und andere Tracks blieben durch diesen Reviewer unverändert.
