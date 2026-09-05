# SwiftSage Figure 4: quellentreue Transkription

Prüfer: `/root/research_completion`; Modell: `GPT-6` (Familie durch Runtime offengelegt; genaue Deployment-Kennung nicht verfügbar). Visuelle Prüfung: 2026-09-05T18:40:48Z.

Original: [arXiv 2305.17390v2, Figure 4, PDF-Seite 15, Appendix B](https://arxiv.org/pdf/2305.17390v2). Der PDF-Text und das [originale Figure-4-PNG](https://arxiv.org/html/2305.17390v2/image.png) wurden visuell gegengeprüft. Das Paper ist als CC BY 4.0 ausgewiesen.

- Figure-Datei: `tmp/source-binding-continuation/swiftsage-figure4.png`
- Figure-SHA256: `sha256:0d5e30495ab0cd0d6531a618b18ab9540a0dfa09bb9ba1ae54ba4a95fce9faf8`
- PDF-Datei: `tmp/source-binding-continuation/swiftsage-2305.17390v2.pdf`
- PDF-SHA256: `sha256:193dbdfb2bcf9a155dda81eeab11a951628754bb69d3a91e0ccf89a9c005456f`
- HTML-Locator: `A2.F4`; Bildunterschrift: “The SwiftSage framework explained with pseudocode.”

Die folgenden 23 Codezeilen entsprechen den nummerierten Zeilen der Abbildung. Farbgebung, Einrückungsführungen und grafischer Zeilenumbruch entfallen; rechts stehende Kommentare sind an ihre Codezeile angehängt. Schreibweisen und die unten benannten Unstimmigkeiten bleiben erhalten. Dies ist eine Transkription eines Methodenbildes, keine getestete ausführbare Implementierung.

```python
A_0 = "look around" # The initial action and its feedback from the environment.
O_0, I_0, E_0, S_0 = ScienceWorld.do(A_0)# ScienceWorld is the engine for simulating the environment.
O=[O_0]; I=[I_0]; E=[E_0]; S=[S_0]; A=[A_0]; B = [] # O, I, E, S, A are lists to save the history of Observations, Inventory, Environment, Scores, and Actions. B is action buffer.
t = 0; T = 100; mode = "swift"
while t<T and S[-1]<100:
    if len(B) > 0:
        A_t = B.pop(0) # if there are todo actions in the buffer, skip new inference.
        if len(B)==0:
            mode = "swift" # switch back to Swift
    else: # by default, we start with Swift module, which use the action history to compose a long input seq for T5-like model to infer the next action.
        if mode == "swift":
            A_t = Swift(A, O, I, E, S)
            if not ScienceWorld.isValid(A_t) or A_t.isCritical():
                mode = "sage" # if Swift’s predicted actions are invalid or involved with critical decisions, we will not do it and activate Sage for higher-level planning.
                continue
        elif mode == "sage":# The Sage mode
            plan = SagePlan([A, O, I, E, S], Demos) # plan & ground via prompting LLM
            B = SageGround([A, O, I, E, S], Demos, ActionTemplates, plan)
    O_t, I_t, E_t, S_t = ScienceWorld.do(A_t) # execute the action A_t, and update the lists for action history
    O.append(O_t);E.append(E_t);I.append(I_t);S.append(S_t);A.append(A_t)
    if sum(S[-5:]) == 0 or O_t.hasExceptions():
        mode = "sage"
    t += 1 # if there is no rewards in the past 5 steps or there is an exception in the observation, we will activate Sage mode.
```

Quellenbefunde, ausdrücklich keine stillen Korrekturen:

1. Zeile 21 verwendet `S`, das in §3.1 und Zeile 3 kumulative Scores bezeichnet. §3.4 nennt dagegen fünf aufeinanderfolgende Schritte ohne Reward und schreibt eine Summe der Rewards `R`. Diese Unstimmigkeit stammt aus dem Original; die Transkription ersetzt `S` nicht durch `R`.
2. Nach dem Befüllen von `B` in Zeile 18 folgt in der Abbildung unmittelbar `ScienceWorld.do(A_t)`. Im Sage-Zweig ist davor keine neue Zuweisung an `A_t` sichtbar. Bei wörtlicher Implementierung kann deshalb eine vorige Aktion erneut ausgeführt werden. §3.4 beschreibt konzeptionell die Ausführung des neuen Buffers; der Ablauf ist in diesem Pseudocode nicht durchgängig spezifiziert.
3. Appendix B.3 erläutert zusätzliche Behandlung ungültiger Buffer-Aktionen und den Abbruch nach zwei aufeinanderfolgenden Fehlern. Diese Details stehen im Fließtext, nicht in den 23 Bildzeilen. Für Methodenbeschreibung sind beide Stellen gemeinsam heranzuziehen.
