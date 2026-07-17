# Plan: research-vault/ nach dem Grounded-Vault-Modell

**Status:** Planungsvorschlag, Operator-Gate. Dieser Plan wird NICHT umgesetzt, bevor der Operator ihn freigibt. Er beschreibt, wie ein neuer Top-Level-Ordner `research-vault/` im Repo `FemPrompt_SozArb` das Gegenstandswissen des Reviews nach dem Vorbild von `github.com/DigitalHumanitiesCraft/grounded-vault` trägt.

Vorbild: das fünfstufige Grounded-Vault-Modell mit Statusleiter und strenger Abwärts-Referenz. Jede Ebene referenziert nur die unmittelbar darunterliegende, ein Status wird nur von einer tatsächlich gelaufenen Prüfung gesetzt.

---

## 1. Zweck und Abgrenzung zu knowledge/

Das Repo trägt schon einen `knowledge/`-Ordner. Der neue `research-vault/` verdrängt ihn nicht, sondern steht daneben mit einer anderen Aufgabe.

| Ordner | Wissensart | Frage, die er beantwortet |
|---|---|---|
| `knowledge/` | Steuerungswissen über die Arbeit | Wie wird der Review geführt, welche Entscheidungen fielen, welches Werkzeug, welche Standards |
| `research-vault/` | Gegenstandswissen | Was sagt die Literatur zur Forschungsfrage, mit welcher Beleglage, in welchem Prüfstatus |

Grenzregeln:

1. **Referenzrichtung nur abwärts, und nur innerhalb von `research-vault/`.** Eine Vault-Ebene referenziert ausschließlich die unmittelbar darunterliegende. Kein Deliverable zitiert direkt eine Quelle, es zitiert einen Claim, der Claim einen Distillat-Anker, das Distillat einen Repräsentations-Anker, die Repräsentation ihre Quelle.
2. **`knowledge/` referenziert `research-vault/` nicht und umgekehrt nicht.** Steuerungswissen und Gegenstandswissen bleiben getrennt. Ein Verweis von `knowledge/` auf ein Vault-Deliverable ist zulässig als Fundstellenzeiger (das Ergebnis liegt dort), nie als inhaltliche Übernahme, die die Redundanzregel der `CLAUDE.md` verletzt.
3. **Interne Dokumente werden nur per förmlicher Ingestion zu Quellen.** Ein Dokument aus `knowledge/`, ein ADR, ein Journaleintrag darf nicht ad hoc in einem Claim verlinkt werden. Soll internes Material Gegenstandswissen tragen, durchläuft es die Ingestion (Abschnitt 6), bekommt einen Eintrag in `references/`, eine Repräsentation mit Ankern und wird ab da wie jede Drittquelle behandelt. Das verhindert, dass die Selbstbeschreibung des Projekts unbemerkt zur Evidenz über den Gegenstand wird.

---

## 2. Ordnerstruktur

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

- **`_sources/`** hält die Volltexte der referenzierten Literatur (PDF oder konvertiertes Markdown). Lizenzpflichtiges Material Dritter. **Gitignored, wird nie gepusht** (Abschnitt 3).
- **`references/`** hält je Quelle einen bibliografischen Record (CSL JSON bevorzugt, RIS als Austauschformat aus den Deep-Research-Läufen). Enthält keinen urheberrechtlich geschützten Volltext, nur Metadaten, daher committed. Dies ist die einzige committed Repräsentation einer Quelle.
- **`00_representation/`** ist die stabile Ankerschicht. Je Quelle ein Repräsentationsdokument, das den Volltext in adressierbare Blöcke zerlegt und jedem Block einen stabilen Anker gibt, sodass ein Zitat zeichengenau auf seine Fundstelle im Volltext zeigt. Weil diese Schicht den Volltext einbettet oder eng spiegelt, trägt sie geschütztes Material. **Gitignored, wird nie gepusht.**
- **`10_distillates/`** hält je Quelle genau ein Distillat, eine strukturierte Zusammenfassung mit Kernaussagen, deren jede auf einen Anker in `00_representation/` zeigt. Das Distillat referenziert nur die Repräsentationsebene. Enthält eigene Prosa plus verankerte Kurzzitate, committed.
- **`20_claims/`** hält atomare Claims, jeder eine einzelne quer über Quellen belegbare Aussage, organisiert in Topic Maps (thematische MOCs). Ein Claim referenziert nur Distillate. Trägt den `contested`-Status, wenn Quellen einander widersprechen. Committed.
- **`30_deliverable/`** hält die synthetisierten Ausgaben (Paper-Abschnitte, Review-Text, Blog). Jeder tragende Satz ist an einen Claim verankert. Referenziert nur Claims. Committed.

---

## 3. Lizenz und Push-Sperre (kritisch)

`_sources/` und `00_representation/` enthalten lizenzpflichtige Volltexte Dritter. Sie bleiben gitignored und dürfen **nie** in das öffentliche Repo `chpollin/FemPrompt_SozArb` gepusht werden. Das Repo ist öffentlich, ein Push dieser Schichten wäre eine Urheberrechtsverletzung.

Umsetzung in `.gitignore` (Ergänzung, beim Umsetzen des Plans):

```
research-vault/_sources/
research-vault/00_representation/
```

Diese Sperre folgt exakt dem Muster, das im Repo für `docs/data/fulltext/` schon etabliert ist (lokale Leseschicht aus geschützten Volltexten, nie publiziert). Die Push-Sperre ist eine rechtsgebundene Entscheidung, keine technische Bequemlichkeit; ein späteres Freigeben einzelner Open-Access-Volltexte wäre eine eigene, je Quelle geprüfte Entscheidung.

`references/`, `10_distillates/`, `20_claims/`, `30_deliverable/` werden committed und dürfen gepusht werden, weil sie nur Metadaten, eigene Prosa und rechtlich zulässige Kurzzitate tragen.

---

## 4. Statusleiter

Jedes Dokument in den prüfbaren Ebenen trägt im Frontmatter einen Status aus der Leiter. Ein Status wird nur gesetzt, wenn die zugehörige Prüfung tatsächlich lief, mit festgehaltenem Ergebnis und Datum.

| Status | Bedeutung | Wer setzt ihn |
|---|---|---|
| `grounded` | Jede tragende Aussage zeigt auf einen Anker der Ebene darunter; die Verankerung ist formal vorhanden | deterministische Prüfung (Schema, Ankerauflösung) |
| `validated` | Eine adversariale Maschinenprüfung hat die Verankerung inhaltlich gegengelesen und keinen Paraphrase-statt-Zitat-Fehler gefunden | Maschinen-Review (LLM, adversarial) |
| `verified` | Eine autorisierte menschliche Fachperson hat die Aussage und ihre Belegkette bestätigt | Mensch, allein |
| `contested` | Quellen widersprechen einander; der Claim hält den Widerspruch fest, statt ihn zu glätten | wird auf Claim-Ebene gesetzt, wenn Distillate divergieren |

`contested` ist orthogonal zur Reifeleiter, es ist kein höherer Reifegrad, sondern eine Eigenschaft der Beleglage. Ein `contested` Claim kann `verified` sein, der Widerspruch ist dann bestätigt und benannt.

Bindung an das Projekt: `verified` entspricht der im Projekt schon geltenden Verantwortungsasymmetrie, nur die menschliche Fachperson bindet. Die Maschinenprüfung (`validated`) ist advisory, exakt wie der LLM-Track im Review advisory ist.

---

## 5. Anker, tote Anker, Sprachregelung

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

---

## 6. Ingestion (interne Dokumente zu Quellen)

Ein internes Dokument (aus `knowledge/`, ein ADR, ein Journaleintrag) wird nur über eine förmliche Ingestion zur Quelle, nie durch einen ad-hoc-Link:

1. Der bibliografische Record entsteht in `references/` (das interne Dokument mit Commit-SHA als stabiler Fundstelle).
2. Der Volltext (das interne Dokument in der zitierten Fassung) wird in `_sources/` abgelegt.
3. Eine Repräsentation in `00_representation/` prägt die Anker.
4. Ab da wird das interne Dokument wie jede Drittquelle behandelt, ein Distillat referenziert seine Anker, ein Claim das Distillat.

Damit ist jede Aussage im Vault, auch eine über das Projekt selbst, an eine geprägte, geprüfte Fundstelle gebunden, und die Trennung von Steuerungs- und Gegenstandswissen bleibt intakt.

---

## 7. Glossar der Vault-Terminologie

Definiert für Leser ohne Vorkontext.

**Anker.** Eine stabile, adressierbare Marke auf einer Textstelle, die ein Zitat zeichengenau auf seine Fundstelle zeigen lässt. Ein Anker wird an seiner Heimatebene geprägt und von der Ebene darüber referenziert.

**Toter Anker.** Ein Anker, dessen Ziel im vorliegenden Klon nicht auflösbar ist. Im Repo erwartet und zulässig, wenn er auf die gitignorten Ebenen `_sources/` oder `00_representation/` zeigt (die Push-Sperre kappt das Ziel im öffentlichen Repo); ein echter Fehler, wenn er auf eine committed Ebene ins Leere zeigt.

**Distillat.** Ein Dokument in `10_distillates/`, genau eines je Quelle, das die Quelle strukturiert zusammenfasst; jede Kernaussage zeigt auf einen Anker der Repräsentationsebene.

**Claim.** Eine atomare, quer über Quellen belegbare Einzelaussage in `20_claims/`, organisiert in Topic Maps; referenziert nur Distillate und trägt den `contested`-Status, wenn Quellen widersprechen.

**Ingestion.** Der förmliche Vorgang, durch den ein Dokument (auch ein internes) zur zitierbaren Quelle wird: Referenz-Record, Ablage in `_sources/`, Repräsentation mit Ankern. Kein Ad-hoc-Link ersetzt die Ingestion.

**Statusleiter.** Die Reifegrade `grounded`, `validated`, `verified`, gesetzt nur von einer tatsächlich gelaufenen Prüfung mit Datum und Ergebnis; dazu der querstehende `contested`-Status für widersprüchliche Beleglage.

---

## 8. Verhältnis zu bestehenden Artefakten

Der bestehende `generated/distilled/`-Bestand ist der natürliche Rohstoff für `10_distillates/`. Ein Distillat der `generated/`-Form trägt schon einen `## Kategorie-Evidenz`-Block mit `### Evidenz N`-Schnipseln; genau dieser Block ist die Fehlerstelle aus ADR-018 (Modell-Paraphrase statt verankertem Zitat). Die Migration in `10_distillates/` ist daher kein Kopieren, sie ist die Gelegenheit, jede Evidenz gegen ihren Anker in `00_representation/` zu prüfen und den Paraphrase-Fall auszusortieren. Der Prüfplan dafür liegt in `distillate-check-plan.md`.

Die vier RIS-Dateien in `corpus/deep-research/` und die zweite Deep-Research-Runde speisen `references/`. Der Ingestion-Pfad aus Abschnitt 6 gilt für die Round-2-Ausbeute genauso.
