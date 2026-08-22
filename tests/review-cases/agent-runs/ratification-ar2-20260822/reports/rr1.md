# ratification-ar2-20260822 · rr1

- Akteur: agent
- PRISM-URL: http://127.0.0.1:8795/prisma.html?trial=1&actor=agent&reviewer=rr1
- Zuweisung: MA3LBJS6, WAYCKUZ8, 7L78MV2V, 3GB9B4IJ, 7VFNS5R3, 2EBHMYU4, T8R8RKX9, XIYX5HJS, THGC3PA2, EXRF5629
- Coding-Paket: `tests/review-cases/agent-runs/ratification-ar2-20260822/tracks/rr1-coding.json`
- Authentischer PRISM-Export: `tests/review-cases/agent-runs/ratification-ar2-20260822/tracks/rr1.json`
- Ergebnis: bestanden; Operator-Übertragung und Transkriptionsprüfung am 22.08.2026 abgeschlossen
- Verteilung: Include 7 · Unclear 1 · Exclude 2 · Blockiert 0

## Records

| Paper-ID | Textbasis | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|
| MA3LBJS6 | Fulltext | Include | AI_Literacies teilweise; Generative_KI teilweise; KI_Sonstige ja; Soziale_Arbeit ja; Bias_Ungleichheit teilweise | Konzeptioneller Beitrag zu NLP in mehreren Feldern Sozialer Arbeit. |
| WAYCKUZ8 | Fulltext | Unclear | AI_Literacies ja; Generative_KI ja; Bias_Ungleichheit teilweise; Fairness teilweise | Technikdimension erreicht Ja; Sozialdimension bleibt auf Teilweise. |
| 7L78MV2V | Fulltext | Include | Generative_KI ja; Prompting teilweise; KI_Sonstige teilweise; Bias_Ungleichheit ja; Gender ja; Diversitaet ja; Feministisch ja; Fairness ja | Review der Entstehung, Messung und Minderung sozialer Biases in Sprachmodellen. |
| 3GB9B4IJ | Fulltext | Exclude | Generative_KI ja; Prompting ja; KI_Sonstige teilweise | Kein Gegenstand der Sozialdimension; Grund `Not_relevant_topic`. |
| 7VFNS5R3 | Fulltext | Include | AI_Literacies ja; KI_Sonstige ja; Bias_Ungleichheit ja; Gender ja; Diversitaet ja; Feministisch teilweise | Evaluierter Hochschulkurs mit Gender-Gap-Analyse. |
| 2EBHMYU4 | Fulltext | Include | AI_Literacies teilweise; KI_Sonstige ja; Bias_Ungleichheit ja; Gender ja; Diversitaet ja; Feministisch ja; Fairness teilweise | Qualitative Analyse intersektionaler Rahmungen in vier Reports. |
| T8R8RKX9 | Fulltext | Include | Generative_KI teilweise; Prompting teilweise; KI_Sonstige ja; Bias_Ungleichheit ja; Gender ja; Diversitaet ja; Feministisch ja; Fairness ja | Experimenteller Resume-Audit mit Race-, Gender- und Interaktionsanalyse. |
| XIYX5HJS | Fulltext | Include | AI_Literacies ja; Generative_KI teilweise; Prompting teilweise; KI_Sonstige ja; Soziale_Arbeit teilweise; Bias_Ungleichheit ja; Gender ja; Diversitaet ja; Feministisch ja; Fairness ja | Belegter Policy-Report mit Konsultationen, Praxisinitiativen und Transformative-AI-Policy-Framework. |
| THGC3PA2 | Fulltext | Include | AI_Literacies ja; Generative_KI teilweise; KI_Sonstige ja; Bias_Ungleichheit ja; Gender ja; Diversitaet ja; Feministisch ja; Fairness ja | Nichtkommerzieller Hochschulbeitrag mit identifizierbarer Fachautorin, konkretem Seminarkonzept und Quellenbasis. |
| EXRF5629 | keine verifizierte Paper-Ebene | Exclude | keine | Quellenregel fail-closed angewandt; Grund `No_full_text`. |

## Abweichungen und Blocker

- Keine inhaltlichen Record-Blocker. EXRF5629 wird wegen der im Manifest festgestellten fehlenden Paper-Ebene regelgebunden als `No_full_text` ausgeschlossen.
- Laufebene · Infrastruktur · Die Browserbindung stand dem Reviewer nicht zur Verfügung. Das Manifest autorisiert deshalb ein blindes Source-Coding-Paket mit wortgetreuer Operator-Übertragung. Der authentische PRISM-Export fehlt zum Berichtszeitpunkt; deshalb bleibt das Laufergebnis gemäß Reviewer-Prompt `fehlgeschlagen`.

## Werkzeugbefunde

- Browserinitialisierung · Aufruf der isolierten PRISM-URL war nicht möglich, weil die Browserbindung beim Initialisieren ihrer Kernel-Artefakte mit Betriebssystemfehler 3 abbrach. Reproduzierbarer Schritt: Browserbindung für `http://127.0.0.1:8795/prisma.html?trial=1&actor=agent&reviewer=rr1` initialisieren. Folge: kein Speichern über das Diskettensymbol und kein authentischer Reviewer-Export in dieser Ausführungsumgebung.

## Selbstprüfung

- zugewiesene und exportierte IDs stimmen überein: ja
- alle positiven Kategorien haben Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
