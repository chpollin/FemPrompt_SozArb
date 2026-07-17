# Prüfplan: Distillate auf die Fehlerklasse Modell-Paraphrase statt Zitat (ADR-018)

**Status:** Prüfplan, Operator-Gate. Beschreibt, wie der vorhandene Distillat-Bestand (`generated/distilled/`) auf die in ADR-018/ADR-022 benannte Fehlerklasse geprüft wird. Prüfung, nicht Umbau; der Bestand wird durch diesen Plan nicht verändert.

---

## 1. Die Fehlerklasse

ADR-018 lud die maschinelle Kategorie-Einschätzung als vorgeladene KI-Belege ins PRISM-Werkzeug. Ein adversariales Review (2026-06-30) fand drei Defekte, ADR-022 entfernte die Vorladung:

1. Die geladenen Schnipsel sind die Ganzpaper-Screening-Begründung des Modells, **kein Zitat aus dem Paper**.
2. Derselbe Schnipsel steht in den meisten Papers verbatim unter jeder LLM-geflaggten Kategorie, die Pro-Kategorie-Struktur ist also **fabriziert**.
3. Schnipsel, die für einen Ausschluss argumentieren, stehen unter einer Kategorie als scheinbare Stützung.

Der Kern der Fehlerklasse: **Modell-Paraphrase steht an der Stelle, an der ein verankertes Wörtlichzitat als Kategorien-Evidenz stehen müsste.** Der Prüfplan sucht diese Fehlerklasse im `## Kategorie-Evidenz`-Block der Distillate selbst, dort, wo sie entsteht.

Die Distillate der `generated/`-Form tragen je Paper einen `## Kategorie-Evidenz`-Block aus `### Evidenz N`-Einträgen. Diese Einträge mischen zwei Sorten Text: verankerte Wörtlichzitate aus dem Paper (in Anführungszeichen, oft englisch im deutschen Fließtext) und Modell-Paraphrase (deutsche Prosa, die den Inhalt referiert, ohne zu zitieren). Nur die erste Sorte ist prüfbare, text-gebundene Evidenz.

---

## 2. Prüfgegenstand und Zuordnung

- **Prüfgegenstand:** jeder `### Evidenz N`-Eintrag im `## Kategorie-Evidenz`-Block jedes Distillats in `generated/distilled/`.
- **Autoritative Kategoriezuordnung:** die Booleans in `generated/distilled/_stage1_json/`, nicht der Markdown (die `CLAUDE.md` hält fest, dass die Kategorien als Booleans im Stage-1-JSON leben, nicht im Frontmatter). Ein Evidenz-Eintrag ohne zugeordnete geflaggte Kategorie ist bereits ein Befund.
- **Verifikationsquelle für Zitate:** der konvertierte Volltext (`generated/markdown_clean/`, die Grundlage der lokalen Leseschicht). Ein als Wörtlichzitat ausgewiesener Schnipsel muss dort zeichengenau auffindbar sein.

---

## 3. Prüfschritte je Evidenz-Eintrag

Für jeden `### Evidenz N`-Eintrag, in dieser Reihenfolge:

1. **Zitat-Klassifikation.** Enthält der Eintrag mindestens einen in Anführungszeichen gesetzten Wörtlichteil? Wenn nein, ist der Eintrag reine Paraphrase, Befundklasse P (Paraphrase-only). Wenn ja, weiter.
2. **Anker-Auflösung.** Ist der Wörtlichteil zeichengenau im Volltext (`generated/markdown_clean/`) des Papers auffindbar? Match ist exakter Teilstring nach Normalisierung (Whitespace, typografische Anführungszeichen, Zeilenumbrüche). Wenn nein, Befundklasse F (fabriziertes oder verändertes Zitat).
3. **Kategorie-Bindung.** Ist der Eintrag genau einer geflaggten Kategorie zugeordnet, oder steht derselbe Text unter mehreren Kategorien? Steht identischer Text unter mehreren, Befundklasse D (Duplikat über Kategorien, die Pro-Kategorie-Struktur ist fabriziert, exakt Defekt 2 aus ADR-022).
4. **Polaritäts-Prüfung.** Argumentiert der Eintrag inhaltlich für die zugeordnete Kategorie, oder gegen sie (etwa ein Ausschlussgrund als scheinbare Stützung)? Argumentiert er dagegen, Befundklasse G (Gegenevidenz unter Stützung, Defekt 3 aus ADR-022).
5. **Sauber.** Wörtlichzitat, im Volltext aufgelöst, genau einer Kategorie zugeordnet, richtige Polarität: Klasse OK.

Ein Eintrag kann mehreren Befundklassen zugleich zugeschlagen werden (ein fabriziertes Zitat, das auch über Kategorien dupliziert, ist F und D).

---

## 4. Befundklassen

| Klasse | Bedeutung | Verhältnis zu ADR |
|---|---|---|
| OK | Verankertes Wörtlichzitat, aufgelöst, eine Kategorie, richtige Polarität | erwünschter Zustand |
| P | Paraphrase-only, kein Wörtlichzitat | die Kern-Fehlerklasse, Paraphrase statt Zitat |
| F | Als Zitat ausgewiesen, aber im Volltext nicht auflösbar | Confabulation, schärfster Fall |
| D | Identischer Text unter mehreren Kategorien | ADR-022 Defekt 2, fabrizierte Pro-Kategorie-Struktur |
| G | Inhalt argumentiert gegen die zugeordnete Kategorie | ADR-022 Defekt 3, Polaritätsfehler |

Klasse P ist der Regelfall der Fehlerklasse und nicht per se ein Datenfehler, sie ist eine Warnung: ein Paraphrase-Eintrag darf im Distillat als Zusammenfassung stehen, aber nie als text-gebundene Kategorien-Evidenz ins PRISM-Werkzeug oder in einen Vault-Claim wandern. F und D und G sind harte Befunde.

---

## 5. Durchführung

1. **Deterministische Vorprüfung, scriptbar.** Ein Prüfscript liest je Distillat den `## Kategorie-Evidenz`-Block, extrahiert je `### Evidenz N` die in Anführungszeichen gesetzten Teile, und versucht den zeichengenauen Match gegen `generated/markdown_clean/` des Papers. Ausgabe je Eintrag: Zitat vorhanden ja/nein (trennt P ab), Match ja/nein (trennt F ab), plus ein Hash des Zitattexts zur Duplikaterkennung über Kategorien und Papers (trennt D ab). Das Script setzt keine Befunde endgültig, es liefert die Kandidatenliste. Es schreibt nur einen Report, es verändert kein Distillat.
2. **Adversariale Maschinenprüfung, Stichprobe.** Auf einer Stichprobe und auf allen F- und G-Kandidaten liest ein LLM den Evidenz-Eintrag gegen die Volltextstelle und die Kategoriedefinition (`assessment/categories.yaml`) und urteilt über Polarität (G) und über die inhaltliche Deckung eines P-Eintrags. Advisory, bindet nichts.
3. **Menschliche Verifikation.** Die harten Befunde (F, D, G) und eine Stichprobe der P-Fälle gehen an die menschliche Prüfung. Nur sie bindet, konsistent mit der Verantwortungsasymmetrie des Projekts.

Der Report wird als Prüfartefakt abgelegt (Vorschlag: `generated/distilled/_evidence_audit/`), das den gitignore-Regeln für generierte Artefakte folgt. Kein bestehendes Distillat wird durch die Prüfung umgeschrieben; die Konsequenz aus den Befunden (Aussortieren der P/F/D/G-Einträge aus der Kategorien-Evidenz) ist ein eigener, freigabepflichtiger Schritt.

---

## 6. Bindung an die research-vault-Migration

Die Prüfung ist die Vorbedingung der Distillat-Migration in `research-vault/10_distillates/` (siehe `research-vault-plan.md`, Abschnitt 8). Ein Evidenz-Eintrag darf nur dann als verankertes Distillat-Zitat in die Vault wandern, wenn er Klasse OK trägt. P-Einträge wandern als eigene Prosa ohne Ankeranspruch mit, F/D/G-Einträge wandern nicht. So trägt die Vault-Ebene `10_distillates/` von Anfang an nur text-gebundene, aufgelöste Anker, und die Statusleiter (`grounded` verlangt aufgelöste Anker) ist erfüllbar.
