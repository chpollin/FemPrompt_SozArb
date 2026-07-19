---
title: Research Vault
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: draft
language: de
version: "0.2"
created: 2026-07-18
updated: 2026-07-18
authors: [Christopher Pollin]
generated-with: Claude Code
topics: ["[[Grounded Vault]]", "[[Systematic Review]]"]
related: [methods, data, specification, plan, standards]
---

Dieses Dokument ist der Bauplan und das Modell des `research-vault/`-Ordners im Repo `FemPrompt_SozArb`, der das Gegenstandswissen des Reviews nach dem Vorbild von `github.com/DigitalHumanitiesCraft/grounded-vault` trägt. Es hält das Ebenenmodell (Abschnitt 1) und den Distillat-Prüfplan als Vorbedingung der Migration in den Vault (Abschnitt 2). Das gebaute Skelett beschreibt seine eigene `research-vault/README.md`, die wartenden Distillate registriert `research-vault/waitlist.md`; dieses Dokument ist das Plan- und Modelldokument, nicht die Beschreibung des gebauten Ordners.

---

# 1. Das Ebenenmodell (Grounded Vault)

Vorbild ist das fünfstufige Grounded-Vault-Modell mit Statusleiter und strenger Abwärts-Referenz. Jede Ebene referenziert nur die unmittelbar darunterliegende, ein Status wird nur von einer tatsächlich gelaufenen Prüfung gesetzt.

## 1.1 Zweck und Abgrenzung zu knowledge/

Das Repo trägt schon einen `knowledge/`-Ordner. Der neue `research-vault/` verdrängt ihn nicht, sondern steht daneben mit einer anderen Aufgabe.

| Ordner | Wissensart | Frage, die er beantwortet |
|---|---|---|
| `knowledge/` | Steuerungswissen über die Arbeit | Wie wird der Review geführt, welche Entscheidungen fielen, welches Werkzeug, welche Standards |
| `research-vault/` | Gegenstandswissen | Was sagt die Literatur zur Forschungsfrage, mit welcher Beleglage, in welchem Prüfstatus |

Grenzregeln:

1. **Referenzrichtung nur abwärts, und nur innerhalb von `research-vault/`.** Eine Vault-Ebene referenziert ausschließlich die unmittelbar darunterliegende. Kein Deliverable zitiert direkt eine Quelle, es zitiert einen Claim, der Claim einen Distillat-Anker, das Distillat einen Repräsentations-Anker, die Repräsentation ihre Quelle.
2. **`knowledge/` referenziert `research-vault/` nicht und umgekehrt nicht.** Steuerungswissen und Gegenstandswissen bleiben getrennt. Ein Verweis von `knowledge/` auf ein Vault-Deliverable ist zulässig als Fundstellenzeiger (das Ergebnis liegt dort), nie als inhaltliche Übernahme, die die Redundanzregel der `CLAUDE.md` verletzt.
3. **Interne Dokumente werden nur per förmlicher Ingestion zu Quellen.** Ein Dokument aus `knowledge/`, ein ADR, ein Journaleintrag darf nicht ad hoc in einem Claim verlinkt werden. Soll internes Material Gegenstandswissen tragen, durchläuft es die Ingestion (Abschnitt 1.6), bekommt einen Eintrag in `references/`, eine Repräsentation mit Ankern und wird ab da wie jede Drittquelle behandelt. Das verhindert, dass die Selbstbeschreibung des Projekts unbemerkt zur Evidenz über den Gegenstand wird.

## 1.2 Ordnerstruktur

```
research-vault/
  _sources/          # Volltexte Dritter, PDF/Markdown, GITIGNORED
  references/        # bibliografische Records (CSL JSON / RIS), committed
  00_representation/ # stabile Anker-Schicht auf den Volltexten, GITIGNORED
  10_distillates/    # ein Distillat je Quelle, committed
  20_claims/         # atomare Claims mit Topic Maps, committed
  30_deliverable/    # synthetisierte Ausgaben, committed
  README.md          # Zweck, Ebenenregeln, Statusleiter, Glossar, Lizenz-Warnung
```

Ebenen im Einzelnen:

- **`_sources/`** hält die Volltexte der referenzierten Literatur (PDF oder konvertiertes Markdown). Lizenzpflichtiges Material Dritter. **Gitignored, wird nie gepusht** (Abschnitt 1.3).
- **`references/`** hält je Quelle einen bibliografischen Record (CSL JSON bevorzugt, RIS als Austauschformat aus den Deep-Research-Läufen). Enthält keinen urheberrechtlich geschützten Volltext, nur Metadaten, daher committed. Dies ist die einzige committed Repräsentation einer Quelle.
- **`00_representation/`** ist die stabile Ankerschicht. Je Quelle ein Repräsentationsdokument, das den Volltext in adressierbare Blöcke zerlegt und jedem Block einen stabilen Anker gibt, sodass ein Zitat zeichengenau auf seine Fundstelle im Volltext zeigt. Weil diese Schicht den Volltext einbettet oder eng spiegelt, trägt sie geschütztes Material. **Gitignored, wird nie gepusht.**
- **`10_distillates/`** hält je Quelle genau ein Distillat, eine strukturierte Zusammenfassung mit Kernaussagen, deren jede auf einen Anker in `00_representation/` zeigt. Das Distillat referenziert nur die Repräsentationsebene. Enthält eigene Prosa plus verankerte Kurzzitate, committed.
- **`20_claims/`** hält atomare Claims, jeder eine einzelne quer über Quellen belegbare Aussage, organisiert in Topic Maps (thematische MOCs). Ein Claim referenziert nur Distillate. Trägt den `contested`-Status, wenn Quellen einander widersprechen. Committed.
- **`30_deliverable/`** hält die synthetisierten Ausgaben (Paper-Abschnitte, Review-Text, Blog). Jeder tragende Satz ist an einen Claim verankert. Referenziert nur Claims. Committed.

## 1.3 Lizenz und Push-Sperre (kritisch)

`_sources/` und `00_representation/` enthalten lizenzpflichtige Volltexte Dritter. Sie bleiben gitignored und dürfen **nie** in das öffentliche Repo `chpollin/FemPrompt_SozArb` gepusht werden. Das Repo ist öffentlich, ein Push dieser Schichten wäre eine Urheberrechtsverletzung.

Umsetzung in `.gitignore` (Ergänzung, beim Umsetzen des Plans):

```
research-vault/_sources/
research-vault/00_representation/
```

Diese Sperre folgt exakt dem Muster, das im Repo für `docs/data/fulltext/` schon etabliert ist (lokale Leseschicht aus geschützten Volltexten, nie publiziert). Die Push-Sperre ist eine rechtsgebundene Entscheidung, keine technische Bequemlichkeit; ein späteres Freigeben einzelner Open-Access-Volltexte wäre eine eigene, je Quelle geprüfte Entscheidung.

`references/`, `10_distillates/`, `20_claims/`, `30_deliverable/` werden committed und dürfen gepusht werden, weil sie nur Metadaten, eigene Prosa und rechtlich zulässige Kurzzitate tragen.

## 1.4 Statusleiter

Jedes Dokument in den prüfbaren Ebenen trägt im Frontmatter einen Status aus der Leiter. Ein Status wird nur gesetzt, wenn die zugehörige Prüfung tatsächlich lief, mit festgehaltenem Ergebnis und Datum.

| Status | Bedeutung | Wer setzt ihn |
|---|---|---|
| `grounded` | Jede tragende Aussage zeigt auf einen Anker der Ebene darunter; die Verankerung ist formal vorhanden | deterministische Prüfung (Schema, Ankerauflösung) |
| `validated` | Eine adversariale Maschinenprüfung hat die Verankerung inhaltlich gegengelesen und keinen Paraphrase-statt-Zitat-Fehler gefunden | Maschinen-Review (LLM, adversarial) |
| `verified` | Eine autorisierte menschliche Fachperson hat die Aussage und ihre Belegkette bestätigt | Mensch, allein |
| `contested` | Quellen widersprechen einander; der Claim hält den Widerspruch fest, statt ihn zu glätten | wird auf Claim-Ebene gesetzt, wenn Distillate divergieren |

`contested` ist orthogonal zur Reifeleiter, es ist kein höherer Reifegrad, sondern eine Eigenschaft der Beleglage. Ein `contested` Claim kann `verified` sein, der Widerspruch ist dann bestätigt und benannt.

Bindung an das Projekt: `verified` entspricht der im Projekt schon geltenden Verantwortungsasymmetrie, nur die menschliche Fachperson bindet. Die Maschinenprüfung (`validated`) ist advisory, exakt wie der LLM-Track im Review advisory ist.

## 1.5 Anker, tote Anker, Sprachregelung

### Anker bedarfsgetrieben von oben

Anker werden an ihrer Heimatebene geprägt (`00_representation/` prägt Repräsentations-Anker, `10_distillates/` prägt Distillat-Anker, `20_claims/` prägt Claim-Anker). Geprägt wird bedarfsgetrieben von oben nach unten: ein Anker in `00_representation/` entsteht, wenn ein Distillat auf genau diese Stelle zeigen muss, nicht prophylaktisch für den ganzen Volltext. Ein Claim treibt, welche Distillat-Anker gebraucht werden, ein Distillat treibt, welche Repräsentations-Anker gebraucht werden. So bleibt die Ankermenge an die tatsächlich benutzte Belegkette gebunden und wächst nicht ins Leere.

### Tote-Anker-Regel für die nicht publizierbaren Ebenen

`_sources/` und `00_representation/` werden nicht gepusht. Ein committed Dokument in `10_distillates/` zeigt also auf Anker, die im öffentlichen Repo nicht existieren. Diese Anker sind aus Sicht des Klons ohne die lokalen Schichten **tote Anker**, sie zeigen auf eine Fundstelle, die der öffentliche Betrachter nicht auflösen kann. Regel:

1. Ein toter Anker in einem committed Dokument ist zulässig und erwartet, solange er auf die gitignorten Ebenen `_sources/` oder `00_representation/` zeigt. Er ist kein Integritätsfehler, sondern die Folge der rechtsgebundenen Push-Sperre.
2. Der tote Anker bleibt vollständig aufgelöst und geprüft im lokalen Klon mit den Volltexten. Die Statusleiter läuft lokal, wo die Anker leben.
3. Ein toter Anker, der auf eine der committed Ebenen zeigt (`10_distillates/`, `20_claims/`, `30_deliverable/`) und dort ins Leere zeigt, ist dagegen ein echter Integritätsfehler und wird wie ein toter Wikilink behandelt.
4. Jedes committed Distillat trägt genug bibliografischen Kontext aus `references/`, dass ein öffentlicher Leser die Aussage der Quelle zuordnen kann, auch ohne den Anker auflösen zu können. Der Anker ist die zeichengenaue Fundstelle, der Referenz-Record die publizierbare Zuordnung.

### Sprachregelung je Ebene

Das Repo führt Dokumentation auf Englisch (`knowledge/`), die Distillate liegen auf Deutsch vor (siehe die bestehenden `generated/distilled/`). Regel je Ebene:

| Ebene | Sprache | Begründung |
|---|---|---|
| `references/` | Sprache der Quelle in den Metadaten, Feldnamen englisch (CSL/RIS) | Austauschformat |
| `00_representation/` | Sprache des Volltexts, unverändert | die Repräsentation spiegelt die Quelle, sie übersetzt nicht |
| `10_distillates/` | Deutsch mit englischen Fachbegriffen | Anschluss an die bestehenden `generated/distilled/`, Zitate im Original |
| `20_claims/` | Deutsch mit englischen Fachbegriffen | Gegenstandsprosa des Projekts |
| `30_deliverable/` | Zielsprache des jeweiligen Deliverables | ein englisches Paper trägt englische Deliverables, ein deutscher Text deutsche |

Zitate werden in der Originalsprache der Quelle verankert und nie in der Übersetzung, damit der Anker zeichengenau bleibt. Eine Übersetzung im Distillat ist zulässig als eigene Prosa neben dem verankerten Originalzitat, nie an dessen Stelle.

## 1.6 Ingestion (interne Dokumente zu Quellen)

Ein internes Dokument (aus `knowledge/`, ein ADR, ein Journaleintrag) wird nur über eine förmliche Ingestion zur Quelle, nie durch einen ad-hoc-Link:

1. Der bibliografische Record entsteht in `references/` (das interne Dokument mit Commit-SHA als stabiler Fundstelle).
2. Der Volltext (das interne Dokument in der zitierten Fassung) wird in `_sources/` abgelegt.
3. Eine Repräsentation in `00_representation/` prägt die Anker.
4. Ab da wird das interne Dokument wie jede Drittquelle behandelt, ein Distillat referenziert seine Anker, ein Claim das Distillat.

Damit ist jede Aussage im Vault, auch eine über das Projekt selbst, an eine geprägte, geprüfte Fundstelle gebunden, und die Trennung von Steuerungs- und Gegenstandswissen bleibt intakt.

## 1.7 Glossar der Vault-Terminologie

Definiert für Leser ohne Vorkontext.

**Anker.** Eine stabile, adressierbare Marke auf einer Textstelle, die ein Zitat zeichengenau auf seine Fundstelle zeigen lässt. Ein Anker wird an seiner Heimatebene geprägt und von der Ebene darüber referenziert.

**Toter Anker.** Ein Anker, dessen Ziel im vorliegenden Klon nicht auflösbar ist. Im Repo erwartet und zulässig, wenn er auf die gitignorten Ebenen `_sources/` oder `00_representation/` zeigt (die Push-Sperre kappt das Ziel im öffentlichen Repo); ein echter Fehler, wenn er auf eine committed Ebene ins Leere zeigt.

**Distillat.** Ein Dokument in `10_distillates/`, genau eines je Quelle, das die Quelle strukturiert zusammenfasst; jede Kernaussage zeigt auf einen Anker der Repräsentationsebene.

**Claim.** Eine atomare, quer über Quellen belegbare Einzelaussage in `20_claims/`, organisiert in Topic Maps; referenziert nur Distillate und trägt den `contested`-Status, wenn Quellen widersprechen.

**Ingestion.** Der förmliche Vorgang, durch den ein Dokument (auch ein internes) zur zitierbaren Quelle wird: Referenz-Record, Ablage in `_sources/`, Repräsentation mit Ankern. Kein Ad-hoc-Link ersetzt die Ingestion.

**Statusleiter.** Die Reifegrade `grounded`, `validated`, `verified`, gesetzt nur von einer tatsächlich gelaufenen Prüfung mit Datum und Ergebnis; dazu der querstehende `contested`-Status für widersprüchliche Beleglage.

## 1.8 Verhältnis zu bestehenden Artefakten

Der bestehende `generated/distilled/`-Bestand ist der natürliche Rohstoff für `10_distillates/`. Ein Distillat der `generated/`-Form trägt schon einen `## Kategorie-Evidenz`-Block mit `### Evidenz N`-Schnipseln; genau dieser Block ist die Fehlerstelle aus ADR-018 (Modell-Paraphrase statt verankertem Zitat). Die Migration in `10_distillates/` ist daher kein Kopieren, sie ist die Gelegenheit, jede Evidenz gegen ihren Anker in `00_representation/` zu prüfen und den Paraphrase-Fall auszusortieren. Der Prüfplan dafür ist Abschnitt 2.

Die vier RIS-Dateien in `corpus/deep-research/` und die zweite Deep-Research-Runde speisen `references/`. Der Ingestion-Pfad aus Abschnitt 1.6 gilt für die Round-2-Ausbeute genauso.

---

# 2. Der Distillat-Prüfplan als Migrations-Vorbedingung

Der Prüfplan beschreibt, wie der vorhandene Distillat-Bestand (`generated/distilled/`) auf die in ADR-018/ADR-022 benannte Fehlerklasse geprüft wird. Prüfung, nicht Umbau; der Bestand wird durch diesen Plan nicht verändert. Die Prüfung ist die Vorbedingung der Migration in `10_distillates/` (Abschnitt 2.6), und sie ist der Grund, warum Abschnitt 1.8 die Migration als Prüfgelegenheit und nicht als Kopieren beschreibt.

## 2.1 Die Fehlerklasse

ADR-018 lud die maschinelle Kategorie-Einschätzung als vorgeladene KI-Belege ins PRISM-Werkzeug. Ein adversariales Review (2026-06-30) fand drei Defekte, ADR-022 entfernte die Vorladung:

1. Die geladenen Schnipsel sind die Ganzpaper-Screening-Begründung des Modells, **kein Zitat aus dem Paper**.
2. Derselbe Schnipsel steht in den meisten Papers verbatim unter jeder LLM-geflaggten Kategorie, die Pro-Kategorie-Struktur ist also **fabriziert**.
3. Schnipsel, die für einen Ausschluss argumentieren, stehen unter einer Kategorie als scheinbare Stützung.

Der Kern der Fehlerklasse: **Modell-Paraphrase steht an der Stelle, an der ein verankertes Wörtlichzitat als Kategorien-Evidenz stehen müsste.** Der Prüfplan sucht diese Fehlerklasse im `## Kategorie-Evidenz`-Block der Distillate selbst, dort, wo sie entsteht.

Die Distillate der `generated/`-Form tragen je Paper einen `## Kategorie-Evidenz`-Block aus `### Evidenz N`-Einträgen. Diese Einträge mischen zwei Sorten Text: verankerte Wörtlichzitate aus dem Paper (in Anführungszeichen, oft englisch im deutschen Fließtext) und Modell-Paraphrase (deutsche Prosa, die den Inhalt referiert, ohne zu zitieren). Nur die erste Sorte ist prüfbare, text-gebundene Evidenz.

## 2.2 Prüfgegenstand und Zuordnung

- **Prüfgegenstand:** jeder `### Evidenz N`-Eintrag im `## Kategorie-Evidenz`-Block jedes Distillats in `generated/distilled/`.
- **Autoritative Kategoriezuordnung:** die Booleans in `generated/distilled/_stage1_json/`, nicht der Markdown (die `CLAUDE.md` hält fest, dass die Kategorien als Booleans im Stage-1-JSON leben, nicht im Frontmatter). Ein Evidenz-Eintrag ohne zugeordnete geflaggte Kategorie ist bereits ein Befund.
- **Verifikationsquelle für Zitate:** der konvertierte Volltext (`generated/markdown_clean/`, die Grundlage der lokalen Leseschicht). Ein als Wörtlichzitat ausgewiesener Schnipsel muss dort zeichengenau auffindbar sein.

## 2.3 Prüfschritte je Evidenz-Eintrag

Für jeden `### Evidenz N`-Eintrag, in dieser Reihenfolge:

1. **Zitat-Klassifikation.** Enthält der Eintrag mindestens einen in Anführungszeichen gesetzten Wörtlichteil? Wenn nein, ist der Eintrag reine Paraphrase, Befundklasse P (Paraphrase-only). Wenn ja, weiter.
2. **Anker-Auflösung.** Ist der Wörtlichteil zeichengenau im Volltext (`generated/markdown_clean/`) des Papers auffindbar? Match ist exakter Teilstring nach Normalisierung (Whitespace, typografische Anführungszeichen, Zeilenumbrüche). Wenn nein, Befundklasse F (fabriziertes oder verändertes Zitat).
3. **Kategorie-Bindung.** Ist der Eintrag genau einer geflaggten Kategorie zugeordnet, oder steht derselbe Text unter mehreren Kategorien? Steht identischer Text unter mehreren, Befundklasse D (Duplikat über Kategorien, die Pro-Kategorie-Struktur ist fabriziert, exakt Defekt 2 aus ADR-022).
4. **Polaritäts-Prüfung.** Argumentiert der Eintrag inhaltlich für die zugeordnete Kategorie, oder gegen sie (etwa ein Ausschlussgrund als scheinbare Stützung)? Argumentiert er dagegen, Befundklasse G (Gegenevidenz unter Stützung, Defekt 3 aus ADR-022).
5. **Sauber.** Wörtlichzitat, im Volltext aufgelöst, genau einer Kategorie zugeordnet, richtige Polarität: Klasse OK.

Ein Eintrag kann mehreren Befundklassen zugleich zugeschlagen werden (ein fabriziertes Zitat, das auch über Kategorien dupliziert, ist F und D).

## 2.4 Befundklassen

| Klasse | Bedeutung | Verhältnis zu ADR |
|---|---|---|
| OK | Verankertes Wörtlichzitat, aufgelöst, eine Kategorie, richtige Polarität | erwünschter Zustand |
| P | Paraphrase-only, kein Wörtlichzitat | die Kern-Fehlerklasse, Paraphrase statt Zitat |
| F | Als Zitat ausgewiesen, aber im Volltext nicht auflösbar | Confabulation, schärfster Fall |
| D | Identischer Text unter mehreren Kategorien | ADR-022 Defekt 2, fabrizierte Pro-Kategorie-Struktur |
| G | Inhalt argumentiert gegen die zugeordnete Kategorie | ADR-022 Defekt 3, Polaritätsfehler |

Klasse P ist der Regelfall der Fehlerklasse und nicht per se ein Datenfehler, sie ist eine Warnung: ein Paraphrase-Eintrag darf im Distillat als Zusammenfassung stehen, aber nie als text-gebundene Kategorien-Evidenz ins PRISM-Werkzeug oder in einen Vault-Claim wandern. F und D und G sind harte Befunde.

## 2.5 Durchführung, Stufe 1 bis 3

1. **Stufe 1, deterministische Vorprüfung, scriptbar.** Ein Prüfscript liest je Distillat den `## Kategorie-Evidenz`-Block, extrahiert je `### Evidenz N` die in Anführungszeichen gesetzten Teile, und versucht den zeichengenauen Match gegen `generated/markdown_clean/` des Papers. Ausgabe je Eintrag: Zitat vorhanden ja/nein (trennt P ab), Match ja/nein (trennt F ab), plus ein Hash des Zitattexts zur Duplikaterkennung über Kategorien und Papers (trennt D ab). Das Script setzt keine Befunde endgültig, es liefert die Kandidatenliste. Es schreibt nur einen Report, es verändert kein Distillat.
2. **Stufe 1b, deterministische artefakt-tolerante Nachprüfung.** Die F- und D-Kandidaten aus Stufe 1 werden mit einem kontiguierlich-wörtlichen Matcher gegen die committeten Volltexte nachgeprüft, der die bekannten Artefaktklassen toleriert (Zitationsklammern, docling-Ligaturen, geschachtelte Anführungszeichen, Apostroph-Paarung, Satzzeichen-Differenzen) und zwei Zitierpraxis-Ausnahmen kennt, editorische Einschübe in eckigen Klammern und markierte Ellipsen mit geordneten, nah beieinanderliegenden Segmenten. Was dieser Matcher auflöst, ist zeichenfolgengenau belegt und migriert mit dokumentierter Belegkette; was er nicht auflöst, bleibt offen. Stufe 1b ist aus den committeten Inputs per `src/assess/waitlist_resolution.py` deterministisch regenerierbar.
3. **Stufe 2, adversariale Maschinenprüfung, Stichprobe.** Auf einer Stichprobe und auf allen F- und G-Kandidaten liest ein LLM den Evidenz-Eintrag gegen die Volltextstelle und die Kategoriedefinition (`assessment/categories.yaml`) und urteilt über Polarität (G) und über die inhaltliche Deckung eines P-Eintrags. Advisory, bindet nichts, nicht regenerierbar.
4. **Stufe 3, menschliche Verifikation.** Die harten Befunde (F, D, G) und eine Stichprobe der P-Fälle gehen an die menschliche Prüfung. Nur sie bindet, konsistent mit der Verantwortungsasymmetrie des Projekts. Stufe 3 entspricht dem Status `verified` der Statusleiter (Abschnitt 1.4).

Der Report wird als Prüfartefakt abgelegt (`generated/distilled/_evidence_audit/`, gitignoriert wie andere generierte Artefakte, nur lokal). Kein bestehendes Distillat wird durch die Prüfung umgeschrieben; die Konsequenz aus den Befunden (Aussortieren der P/F/D/G-Einträge aus der Kategorien-Evidenz) ist ein eigener, freigabepflichtiger Schritt.

## 2.6 Migrationskonsequenz nach Befundklasse

Die Prüfung ist die Vorbedingung der Distillat-Migration in `research-vault/10_distillates/`. Die Kopplung ist bindend: nur audit-unauffällige Distillate migrieren, und die bindende Stufe 3 bleibt menschlich. Ein Evidenz-Eintrag darf nur dann als verankertes Distillat-Zitat in die Vault wandern, wenn er Klasse OK trägt.

| Befundklasse | Migrationskonsequenz |
|---|---|
| OK | Wandert als verankertes Distillat-Zitat mit Ankeranspruch in `10_distillates/` |
| P | Wandert als eigene Prosa ohne Ankeranspruch mit, vermerkt als `audit: P-pending`, wartet auf die menschliche Deckungsprüfung |
| F | Wandert nicht, bleibt in `waitlist.md` als offener Zitatanspruch |
| D | Wandert nicht als Pro-Kategorie-Struktur; maschinell belegte Quellendubletten sind gesondert ausgewiesen und brauchen keine Stufe 3 |
| G | Wandert nicht, bleibt in `waitlist.md` als Polaritätsbefund für die Stufe-3-Verifikation |

So trägt die Vault-Ebene `10_distillates/` von Anfang an nur text-gebundene, aufgelöste Anker, und die Statusleiter ist erfüllbar (`grounded` verlangt aufgelöste Anker). Ein vollständig zitat-verankertes Distillat trägt `audit: clean`, ein Distillat mit ausstehenden P-Fällen `audit: P-pending`. Was offen bleibt (nicht auflösbare Zitat-Ansprüche, Polaritätsfehler, fehlender oder fehlzugeordneter Volltext), ist in `research-vault/waitlist.md` mit Befundklasse und Grund registriert und wartet auf die bindende menschliche Stufe-3-Verifikation.

---

# 3. Das gebaute Skelett

Das nach diesem Modell gebaute Skelett beschreibt seine eigene `research-vault/README.md` (Ebenen, Push-Sperre, Statusleiter, Präregistrierungs-Vorbedingung der Migration, Glossar). Die nach Stufe 1b nicht migrierten Distillate registriert `research-vault/waitlist.md` mit Befundklasse, Grund und Momentaufnahme der Verteilung. Beide sind Beschreibungen des gebauten Ordners; dieses Dokument bleibt das Plan- und Modelldokument.
