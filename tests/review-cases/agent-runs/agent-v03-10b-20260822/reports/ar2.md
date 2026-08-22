# agent-v03-10b-20260822 · ar2

- Akteur: agent
- PRISM-URL: `http://127.0.0.1:8792/prisma.html?trial=1&actor=agent&reviewer=ar2`
- Zuweisung: `MA3LBJS6`, `WAYCKUZ8`, `7L78MV2V`, `3GB9B4IJ`, `7VFNS5R3`, `2EBHMYU4`, `T8R8RKX9`, `XIYX5HJS`, `THGC3PA2`, `EXRF5629`
- Export: `tests/review-cases/agent-runs/agent-v03-10b-20260822/tracks/ar2.json`
- Ergebnis: bestanden
- Verteilung: Include 6 · Unclear 1 · Exclude 2 · Blockiert 1

## Records

| Paper-ID | Textbasis | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|
| `MA3LBJS6` | Volltext | Include | `AI_Literacies` 1; `Generative_KI` 1; `KI_Sonstige` 2; `Soziale_Arbeit` 2; `Bias_Ungleichheit` 1 | Vollständig analysiert. |
| `WAYCKUZ8` | Volltext | Unclear | `AI_Literacies` 2; `Generative_KI` 2; `Bias_Ungleichheit` 1; `Fairness` 1 | Gespeichert; die Statusmeldung fordert nach dem Wiederöffnen fälschlich einen Ausschlussgrund. |
| `7L78MV2V` | Volltext | Include | `Generative_KI` 2; `Prompting` 1; `Bias_Ungleichheit` 2; `Gender` 2; `Diversitaet` 2; `Feministisch` 1; `Fairness` 2 | Vollständig analysiert. |
| `3GB9B4IJ` | Volltext, vorläufig | Exclude | `Generative_KI` 2; `Prompting` 2 | Grund `Not_relevant_topic`; Metadatenchronologie weicht ab. |
| `7VFNS5R3` | Volltext | Include | `AI_Literacies` 2; `KI_Sonstige` 2; `Bias_Ungleichheit` 2; `Gender` 2; `Diversitaet` 2; `Feministisch` 1 | Vollständig analysiert. |
| `2EBHMYU4` | gesperrte Textquelle | Blockiert | keine | Titelkonflikt zwischen Zielrecord und sichtbarem Text; kein Record gespeichert. |
| `T8R8RKX9` | Volltext | Include | `Generative_KI` 2; `Prompting` 1; `KI_Sonstige` 2; `Bias_Ungleichheit` 2; `Gender` 2; `Diversitaet` 2; `Feministisch` 2; `Fairness` 2 | Vollständig analysiert. |
| `XIYX5HJS` | Volltext | Include | `AI_Literacies` 1; `Generative_KI` 1; `Prompting` 1; `KI_Sonstige` 2; `Soziale_Arbeit` 1; `Bias_Ungleichheit` 2; `Gender` 2; `Diversitaet` 2; `Feministisch` 2; `Fairness` 2 | Belegter Forschungs- und Policy-Report; vollständig analysiert. |
| `THGC3PA2` | Volltext | Include | `AI_Literacies` 2; `Generative_KI` 1; `KI_Sonstige` 2; `Bias_Ungleichheit` 2; `Gender` 2; `Diversitaet` 2; `Feministisch` 2; `Fairness` 1 | Fachwissenschaftlicher Kommentar mit identifizierbarer Autorenschaft und Quellenbasis; vollständig analysiert. |
| `EXRF5629` | keine verifizierte Paper-Ebene | Exclude | keine | Grund `No_full_text`; das sichtbare, abgeschnittene `Metadaten-Abstract` ist keine zulässige Paper-Ebene. |

## Abweichungen und Blocker

- `2EBHMYU4` · Quellenidentität · Der Header nennt „Intersectionality in Artificial Intelligence: Framing Concerns and Recommendations for Action“ und DOI `10.17645/si.7543`. Der sichtbare Text trägt den Titel „Artificial Intelligence and Intersectionality by Inga Ulnicane“, bezeichnet das Zielpaper als eigenen früheren Artikel und führt es in den Referenzen. Benötigt wird der korrekte Zielvolltext.
- `3GB9B4IJ` · Metadatenchronologie · Korpus und Header nennen 2024. Die stabile Quelle verweist auf `arxiv.org/html/2507.21075v1`, und der Text enthält Literaturdaten aus 2025. Titel, Paper-ID und Autor:innen stimmen überein; die Codierung bleibt vorläufig.
- `EXRF5629` · Textebene · PRISM zeigt ausschließlich ein unvollständiges `Metadaten-Abstract`. Der Record wurde deshalb mit `No_full_text` ausgeschlossen.

## Werkzeugbefunde

- Korpusnavigation · Bei einer Breite von etwa 1280 Pixeln ist die Korpus-Seitenleiste nicht sichtbar. Eine Breite von 1800 Pixeln blendet Suche und Trefferliste ein.
- DOI-basierte Records · Eine Suche nach der exakten Paper-ID liefert jeweils einen Treffer, dessen Badge nur „Paper-ID“ zeigt. Auch der Header lässt den ID-Wert aus. Records ohne DOI zeigen den Wert als `ID ...` und im Header als `Paper-ID`.
- `WAYCKUZ8` · Nach Speichern und Wiederöffnen zeigt die Navigation korrekt `unklar`; Kategorien und Belege sind vorhanden. Der Status fordert dennoch „Bitte einen Ausschlussgrund wählen.“, obwohl ein Ausschlussgrund nur für Exclude vorgesehen ist.
- `EXRF5629` · Nach dem Speichern wechselte die Hauptansicht automatisch zu `NSI6S5QE`, während Suche und Trefferstatus bei `EXRF5629` blieben. Das erneute Anklicken des sichtbaren Treffers stellte den gespeicherten Record mit `No full text` korrekt dar.

## Selbstprüfung

- zugewiesene und exportierte IDs stimmen überein: nein; neun IDs wurden exportiert, `2EBHMYU4` blieb als dokumentierter Quellenblocker offen
- alle positiven Kategorien haben Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- authentischer UI-Export: ja; 38.989 Byte; SHA-256 `4AA6FA9B98185A7B727041C605506A932A2248EAA1F9E29D0BDBDE607C152FF6`
