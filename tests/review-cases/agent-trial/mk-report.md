# Methodenkritische Reviewspur `mk`

## Persona und Vorgehen

Die Review wurde aus der Perspektive einer methodenkritischen systematischen Reviewerin durchgeführt. Maßgeblich waren ausschließlich die in PRISM sichtbaren Kategorien, die dreistufige Codierung `0/1/2`, die Ableitungslogik für Entscheidungen, die kontrollierten Ausschlussgründe und die verpflichtenden Analysefelder. Inhaltliche Relevanz allein genügte nicht für ein Include. Publikationstyp, Belegnähe und die Trennschärfe zwischen expliziter Behandlung und randständiger Erwähnung wurden streng bewertet.

Für jeden Fall wurden zuerst sichtbarer Paper-Titel und Volltexttitel abgeglichen. Anschließend wurde der Volltext im PRISM-Frontend gelesen und durchsucht. Jeder Wert größer als null erhielt einen angehefteten Treffer aus der menschlichen Volltextebene. Danach wurden Kategorien, Entscheidung und gegebenenfalls Ausschlussgrund gesetzt. Includes erhielten die vollständige Analyse-Codierung. Gespeichert wurde jeweils über das sichtbare Diskettensymbol. Die Vergleichssektion mit früheren Urteilen blieb geschlossen.

## Entscheidungen

Kategorienfolge in der Tabelle: `AI_Literacies / Generative_KI / Prompting / KI_Sonstige / Soziale_Arbeit / Bias_Ungleichheit / Gender / Diversitaet / Feministisch / Fairness`.

| Paper-ID | Kurztitel | Kategorien 0/1/2 | Entscheidung | Begründung oder Ausschlussgrund |
|---|---|---|---|---|
| `Z4YXX9PZ` | Prompting techniques for reducing social bias in LLMs | `0/2/2/0/0/2/2/2/0/2` | Include | Experimenteller Promptvergleich mit mehreren sozialen Biasachsen und gemessener Mitigation |
| `AIGLDZ4C` | How to Create Inclusive AI Images | `2/2/2/0/0/2/2/2/1/1` | Exclude | `Wrong_publication_type`: praxisorientierter Blogbeitrag |
| `JC7X3MM7` | Improving human-AI partnerships in child welfare | `2/0/0/2/2/2/0/2/0/2` | Include | Empirische Untersuchung realer algorithmischer Entscheidungsunterstützung im Kinderschutz |
| `UFE85SCV` | AI literacy in K-12 | `2/0/0/2/0/1/1/0/0/0` | Unclear | Starker AI-Literacy-Gegenstand; soziale Perspektive bleibt auf randständige Ungleichheits- und Genderpassagen begrenzt |
| `ZITLBM8A` | ChatGPT for social work science | `2/2/1/0/2/2/1/2/1/1` | Include | Professionsbezogene Konzeptarbeit zu LLM-Nutzung, Bias und antirassistischer Promptpraxis |
| `QI5AYE4V` | Algorithmic decision-making in social work practice and pedagogy | `2/0/0/2/2/2/1/2/1/2` | Include | Theoretische und fallgestützte Analyse von ADM, Menschenrechten und algorithmischer Bildung in der Sozialen Arbeit |
| `Y6M97SWQ` | Algorithmic-assisted decision-making tools in child welfare | `1/0/0/2/2/2/1/2/0/2` | Include | Systematischer Review zu Implementierung, Fairness und Ethik im Kinderschutz |
| `VICS443I` | AI Creates the Message | `2/2/2/1/2/2/0/2/0/2` | Exclude | `Wrong_publication_type`: ausdrücklich als invited editorial ausgewiesen |
| `EB7PZUZZ` | Prompten nach Plan | `2/2/2/0/0/1/1/1/0/2` | Include | Empirisch illustrierter Prompting-Rahmen mit explizitem Fairness-Prüfschritt |
| `NBYNRKBL` | What is Feminist AI? | `1/0/0/2/0/2/2/2/2/2` | Exclude | `Wrong_publication_type`: institutionelle Publikation beziehungsweise Policy-Paper |

Verteilung: **6 Include, 1 Unclear, 3 Exclude**. Die beiden gemeinsamen Kalibrierungsfälle der Stichprobe waren `Z4YXX9PZ` und `AIGLDZ4C`. Ihre mk-Entscheidungen lauten Include beziehungsweise Exclude. Es wurde kein Urteil einer anderen Reviewspur zur Einordnung herangezogen.

## Begründungen und zentrale Belege

### `Z4YXX9PZ` — Include

Der Beitrag vergleicht Zero-shot-, Chain-of-Thought-, Dual-Process- und Persona-Prompts auf zwei Biasdatensätzen. Der Volltext nennt neun Biasarten und berichtet modell- und kategoriespezifische Reduktionen stereotypischer Urteile. Zentrale Belege sind „We compare zero-shot, CoT, and a variety of dual process theory-based prompting strategies“ sowie „mitigating social biases in LLMs … ensuring fairness and inclusivity“. Die Analyse codiert ein Experiment, Promptpraxis als Mitigationsstufe und den Status `Evaluated`.

### `AIGLDZ4C` — Exclude

Der Text erfüllt den thematischen Gegenstands- und Perspektivbezug deutlich. Er beschreibt, wie inklusive Prompts stereotype Bildausgaben verändern sollen. Belegt sind unter anderem „Inclusive prompt engineering can interrupt biased AI defaults“ und „They erase people, reinforce biases, and exclude audiences“. Die sichtbare Kennzeichnung als Blog und die ratgeberhafte Form ohne wissenschaftliche Methodik begründen den Override zu `Wrong_publication_type`.

### `JC7X3MM7` — Include

Die Studie untersucht mit kontextuellen Befragungen und Interviews, wie Fachkräfte ein Machine-Learning-basiertes Entscheidungssystem im Kinderschutz verwenden. Der Text berichtet höhere Risikowerte für Familien aus benachteiligten rassifizierten und sozioökonomischen Gruppen. Belege sind „investigate how social workers … make AI-assisted child maltreatment screening decisions“ und „higher risk scores to families from underprivileged racial identities and socioeconomic backgrounds“. Die Mitigation wird als demonstrierte Kombination aus Overrides, Transparenz, Training, Feedback und Beteiligung codiert.

### `UFE85SCV` — Unclear

Der systematische Review behandelt AI Literacy im schulischen Bereich substanziell. Die soziale Perspektive erscheint nur punktuell: „the increase in socio-economic inequality“ und „the issue of gender diversity“. Eine eigenständige Bias-, Fairness- oder Diversitätsanalyse fehlt. Nach der PRISM-Logik sind Gegenstand und Perspektive mindestens teilweise belegt; die Evidenz reicht methodenkritisch nicht für ein Include.

### `ZITLBM8A` — Include

Der Beitrag diskutiert ChatGPT ausdrücklich für Sozialarbeitswissenschaft und entwickelt professionsbezogene Empfehlungen. Er benennt Repräsentationslücken für BIPOC, Menschen mit Behinderungen und LGBTQIA+-Personen sowie die mögliche Verstärkung bestehender Biases. Als Promptpraxis wird empfohlen, „prompts that explicitly ask to identify the work of BIPOC scholars“ zu verwenden. Da Wirksamkeitsdaten fehlen, ist der Mitigationsstatus `Proposed`.

### `QI5AYE4V` — Include

Der Text untersucht algorithmische Entscheidungssysteme in Praxis und Lehre der Sozialen Arbeit. Er hält fest, dass ADM neue Biases verstärken kann und mangelnde Transparenz die Anfechtbarkeit sowie „the original fairness of the automated decision“ gefährdet. Die vorgeschlagene Mitigation besteht in kritisch-technischer Ausbildung, professioneller Interpretation und begrenztem Systemeinsatz. Die Fallbeispiele stützen die Argumentation; eine Evaluation des Curriculums liegt nicht vor.

### `Y6M97SWQ` — Include

Der systematische Review untersucht neun Implementierungsstudien algorithmischer Werkzeuge im Kinderschutz. Er behandelt Fairness, Equity und Ethik als zentrale Reviewdimension und dokumentiert Analysen nach Race und Gender, externe Ethikreviews, Training sowie organisatorische Schutzmaßnahmen. Wichtige Belege sind „potential to worsen racial disparities“ und „fairness, equity, and ethics“. Der Mitigationsstatus `Evaluated` bezieht sich auf die im Review zusammengeführten Implementierungsbewertungen.

### `VICS443I` — Exclude

Der Text ist fachlich hochrelevant und behandelt ChatGPT in Ausbildung und Praxis der Sozialen Arbeit. Er nennt Bias- und Diskriminierungsrisiken sowie den Zugang für technologisch ausgeschlossene Gruppen. Belege sind „ChatGPT could perpetuate bias and discrimination“ und die Forderung nach „technological justice“. Die sichtbare Publikationsform `INVITED EDITORIAL` erfüllt das Publikationstyp-Kriterium nicht und führt zum Override `Wrong_publication_type`.

### `EB7PZUZZ` — Include

Das PCRR-Framework strukturiert Prompting in Plan, Create, Review und Reflect. Der Review-Schritt fragt ausdrücklich nach Diskriminierung, Barrierefreiheit und Fairness. Belege sind „verzerrte Trainingsdaten“, „weibliche Schüler:innen“, „sehbehinderte Menschen“ und „Profitieren alle Schüler:innen“. Die Praxisberichte tragen die Codierung `Empirisch`; die Fairness-Mitigation selbst wird vorgeschlagen und nicht kausal evaluiert.

### `NBYNRKBL` — Exclude

Der Text entwickelt einen klar intersektional-feministischen KI-Ansatz. Er beschreibt strukturelle Diskriminierung, binäre Genderkategorien, diverse Teams und Maßnahmen für „more equitable AI systems“. Die Imprint- und Publisher-Angaben weisen ihn als institutionelle Publikation aus. Wegen des Publikationstyps wurde trotz starker thematischer Passung `Wrong_publication_type` gesetzt.

## Methodische Grenzfälle und Unsicherheiten

- Die drei Ausschlüsse sind inhaltlich einschlägig. Das Publikationstyp-Kriterium entscheidet hier gegen ein Include. Besonders `NBYNRKBL` ist ein echter Grenzfall, weil der Text ein kohärentes Konzept mit Referenzen und Praxisbeispielen bietet, formal jedoch als institutionelles Policy-Paper erscheint.
- Bei `UFE85SCV` sind Gender und sozioökonomische Ungleichheit vorhanden, bleiben aber Nebenbefunde eines K-12-Literaturreviews. Die Stufe `1` bewahrt diese Evidenz, ohne daraus eine tragende soziale Perspektive abzuleiten.
- `QI5AYE4V` erhält für `Feministisch` nur Stufe `1`: Intersektionalität, Misogynie und strukturelle Kritik sind sichtbar; eine explizit feministische Methodik wird nicht entwickelt.
- `ZITLBM8A` erhält für Prompting, Gender, Feministisch und Fairness Stufe `1`, weil diese Aspekte als Empfehlungen oder Teilargumente vorkommen. Der zentrale Gegenstand ist die breitere ethische Nutzung von ChatGPT in der Sozialarbeitswissenschaft.
- `EB7PZUZZ` verbindet Praxisberichte mit einem konzeptionellen Framework. `Empirisch` beschreibt die vorhandenen Anwendungsdaten; die Bias- und Fairnessprüfung bleibt als Mitigation vorgeschlagen.

## Datenintegritätsbefund

Für `AXEIVEW3` zeigte die Korpuskarte den Titel „Artificial Intelligence Competence Needs for Youth Workers“, während der zunächst zugeordnete Volltext „Artificial Intelligence in Social Work: An EPIC Model for Practice“ behandelte. Damit lag eine titelwidrige Volltextzuordnung vor. Es wurde kein fachlicher Record für `AXEIVEW3` gespeichert und kein EPIC-Inhalt auf diese ID übertragen. Nach dem Publisher-Neubau verweigert PRISM solche Zuordnungen. Der freigegebene Ersatzfall `JC7X3MM7` wurde nach erneutem Titelabgleich vollständig bearbeitet.

Reproduktion des ursprünglichen Befunds:

1. Trial-Seite mit `?trial=1&paper=AXEIVEW3` öffnen.
2. Sichtbaren Paper-Titel mit dem ersten Volltexttitel vergleichen.
3. Die Abweichung zwischen Youth-Worker-Titel und EPIC-Volltext feststellen.
4. In der neu gebauten Fassung prüfen, dass der titelwidrige Volltext nicht mehr ausgeliefert wird.

## UI- und Workflow-Befunde

- Der freigegebene Parameter `trial=1` ermöglicht eine isolierte sichtbare Review ohne nativen Ordnerdialog. Das Kürzel `mk` wurde im sichtbaren Reviewer:innen-Feld gesetzt. Jede fachliche Codierung und jeder Speichervorgang erfolgte anschließend im Frontend.
- Die Muss-Kriterien werden wirksam erzwungen. Für jede Kategorie oberhalb von null ist ein menschlicher Beleg erforderlich. Excludes verlangen einen kontrollierten Ausschlussgrund. Includes werden erst nach vollständiger Analyse-Codierung als „Vollständig erfasst“ geführt.
- Das Anheften eines Volltexttreffers setzt die zugeordnete Kategorie automatisch auf Stufe `2`. Für einen bewusst partiellen Wert muss die Kategorie danach wieder auf Stufe `1` gestellt werden. Reproduktion: Treffer suchen, an Kategorie anheften, automatische Stufe `2` beobachten, anschließend `teilweise` wählen. Diese Reihenfolge erhöht das Risiko unbeabsichtigter Ja-Codierungen.
- PDF-Extraktionsartefakte wie `/uniFB01`, getrennte Wörter und uneinheitliche Bindestriche erschweren die Suche. Kurze charakteristische Suchphrasen lieferten dennoch belastbare Treffer.
- Der Trial-Modus zeigt die Speicherung im Browser-Zwischenstand, bietet jedoch keinen sichtbaren JSON-Export. Der freigegebene Test-Hook war aus dem isolierten Browser-Auswertungskontext nicht erreichbar; ein `javascript:`-Aufruf wurde durch die Browser-Sicherheitsrichtlinie abgewiesen. Diese Grenze wurde nicht umgangen. `mk.json` wurde deshalb aus dem vollständig protokollierten sichtbaren UI-Track rekonstruiert und anschließend mit der PRISM-Logik validiert.

## Selbstprüfung und Validierung

- Erwartete ID-Menge: 10 von 10 vorhanden; `AXEIVEW3` fehlt absichtlich, `JC7X3MM7` ist enthalten.
- Record-Vollständigkeit: alle 10 Records besitzen Kategorien, Entscheidung, Reviewer, Zeitstempel, Textquelle und menschliche Belege für jeden Wert größer als null.
- Includes: 6 von 6 besitzen vollständige Analysefelder, `AN_Coding_Basis = Fulltext` und einen zulässigen `AN_Harm_Types`-Wert.
- Excludes: 3 von 3 besitzen `Wrong_publication_type`; keiner trägt Analysefelder.
- PRISM-eigene Prüfung: `validateReviewerPayload` meldet `ok: true`; `recordRequirements` meldet für alle zehn Records keine fehlenden Muss-Angaben.
- Erweiterte Prüfung: exakte ID-Menge, Entscheidungsableitung einschließlich Overrides, Kategorienbereich `0..2`, kontrollierte Vokabulare, `None`-Exklusivität, Belegherkunft und Volltext-Provenienz ohne Fehler.
- Evidenzprüfung: 70 von 70 Suchtermen kommen im jeweils zugeordneten Volltext vor; maximale Termlänge 61 und maximale Snippetlänge 254 liegen unter den UI-Grenzen von 80 und 260 Zeichen.
- Regressionsprüfung des Repositories: `npm test` besteht mit `109/109` PRISM-Tests und `15/15` Companion-Smoke-Tests.
- Sichtbare Nutzung: zehn fachliche Records wurden im realen PRISM-Frontend unter `http://127.0.0.1:8771/prisma.html?trial=1&paper=<ID>` mit dem Kürzel `mk` gespeichert. Die Vergleichssektion wurde nicht geöffnet.
