# Konvertierungsprompt L3 Gemini, Runde 2

Verbatim-Instanz des Konvertierungsprompts aus `knowledge/update-protocol.md` (Abschnitt Round 2: binding procedure), instanziiert für Lane L3. Modell: Claude Fable 5 (claude-fable-5). Laufdatum: 2026-07-17. Input `raw/Gemini_deep-research.md`, Output `Gemini_deep-research.ris`.

```
Convert the following deep research output into RIS format. One record per
referenced publication. Map: authors to AU (one per line), year to PY, title
to TI, journal or venue to JO, DOI to DO, URL to UR. Put the deep research
system's summary or recommendation text for the entry into N1, prefixed with
the lane id. Use TY JOUR for journal articles, TY CHAP for book chapters,
TY BOOK for books, TY CONF for conference papers, TY GEN otherwise. Do not
invent values: omit any field not present in the source text. Output only
the RIS records, no commentary.
```

Lane id für N1: `L3`. Keine Abweichung vom Template.
