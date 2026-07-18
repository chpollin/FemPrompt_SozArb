---
layer: claim-index
title: "Register der Claims und Topic Maps"
updated: 2026-07-18
---

# Register der Claims und Topic Maps

Ein Claim ist eine atomare, quer über Quellen belegbare Aussage; er referenziert ausschließlich Distillat-Anker der Ebene `10_distillates/`. Anker sind die Überschriften der Distillate, referenziert als `[[Distillat#Überschrift]]`, bedarfsgetrieben geprägt von der Claim-Ebene aus; die vorrangig genutzte Ankerklasse ist `#Kernbefund`. Die deterministische Ankerprüfung läuft mit `src/publish/check_claims.py`; nur solange sie grün ist, ist der `grounded`-Status der Ebene legitim. `contested: true` hält eine widersprüchliche Beleglage fest, mit getrennten Abschnitten für und gegen; der Widerspruch ist Eigenschaft der Beleglage, kein Reifegrad.

Die Claims tragen `status: grounded`, nicht `validated` und nicht `verified`. Eine adversariale Maschinenprüfung der inhaltlichen Deckung zwischen Claim-Satz und Anker-Inhalt ist noch nicht gelaufen, die bindende menschliche Prüfung ebenfalls nicht.

## Topic Maps

- [[Topic Map Bias-Evidenz in Sprachmodellen]]
- [[Topic Map Prompting als Bias-Mitigation]] (enthält den contested Claim zur Chain-of-Thought-Wirksamkeit)
- [[Topic Map KI in der Sozialen Arbeit]]
- [[Topic Map AI Literacy]]
- [[Topic Map Feministische und intersektionale KI-Kritik]]

## Abgrenzung

Die Claims sind kuratiertes Gegenstandswissen über die Literatur, keine Screening-Entscheidungen; Include- und Exclude-Urteile über Papers fallen ausschließlich im menschlichen PRISM-Track.
