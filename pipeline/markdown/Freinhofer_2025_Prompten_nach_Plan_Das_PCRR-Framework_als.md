---
source_file: Freinhofer_2025_Prompten_nach_Plan_Das_PCRR-Framework_als.pdf
conversion_date: 2026-02-03T08:56:36.931423
converter: docling
quality_score: 95
---

<!-- image -->

Medienimpulse

ISSN 2307-3187 Jg. 63, Nr. 1, 2025 doi: 10.21243/mi-01-25-26 Lizenz: CC-BY-NC-ND-3.0-AT

## Prompten nach Plan. Das PCRR-Framework als pädagogisches Werkzeug für den Einsatz von Künstlicher Intelligenz

Dominik Freinhofer Gerlinde Schwabl Susanne Aichinger Sandra Breitenberger Tanja Hechenberger Sandra Steindl

Die rasante Entwicklung generativer Künstlicher Intelligenz (KI) macht Prompt Engineering zu einer Schlüsselkompetenz für den kompetenten   Umgang   mit   KI-Modellen.   Während   zahlreiche Prompting-Techniken und -Frameworks existieren, fehlt bislang eine systematische Integration in den schulischen Kontext. Diese

Publikation stellt das PCRR-Framework (Plan - Create - Review Reflect) vor, das als ganzheitlicher Ansatz für den Einsatz von Prompt Engineering im Unterricht dient. Basierend auf Erfahrungen aus dem Hochschullehrgang 'Künstliche Intelligenz im IT-Unterricht der Berufsbildung' (PH Tirol und Hochschule für Agrar- und Umweltpädagogik) wurde das Framework iterativ weiterentwickelt und in drei Praxisbeispielen erprobt. Die Ergebnisse zeigen, dass das PCRR-Framework die Effizienz und Qualität der Prompterstellung steigern kann und die Schüler:innen beim Umgang mit Sprachmodellen (Large Language Models, LLMs) unterstützt. Gleichzeitig wurden Herausforderungen deutlich, insbesondere hinsichtlich der methodischen Vergleichbarkeit der Ergebnisse sowie der Akzeptanz bestimmter PromptingTechniken. Das Paper diskutiert diese Erkenntnisse, methodischen Limitationen und Verbesserungspotenziale und bietet einen Ausblick auf zukünftige Forschungsarbeiten. Neben der Weiterentwicklung des PCRR-Frameworks wird die Notwendigkeit betont, AI Literacy systematisch in Lehrpläne und Lehramtsausbildungen zu integrieren, um eine nachhaltige und verantwortungsbewusste Nutzung von KI im Bildungsbereich zu ermöglichen. [Dieses Abstract wurde mit ChatGPT-4o generiert und von den Autor:innen leicht adaptiert. 1 ]

The rapid development of generative artificial intelligence (AI) makes prompt engineering a key competence for the competent handling of AI models. While numerous prompting techniques and frameworks exist, systematic integration into the school context has been lacking to date. This publication presents the PCRR framework (Plan - Create - Review - Reflect), which serves as a holistic approach for the use of prompt engineering in the classroom. Based on experiences from the university course 'Artificial Intelligence in IT Teaching in Vocational Education and Training' (PH Tirol and University of Applied Sciences for Agricultural and Environmental Pedagogy), the framework was itera-

tively developed and tested in three practical examples. The results show that the PCRR framework can increase the efficiency and quality of prompting and supports students in dealing with language models (Large Language Models, LLMs). At the same time, challenges became apparent, particularly with regard to the methodological comparability of the results and the acceptance of certain prompting techniques. The paper discusses these findings, methodological limitations and potential for improvement and offers an outlook for future research. In addition to the further development of the PCRR framework, the need to systematically integrate AI literacy into curricula and teacher training is emphasised in order to enable the sustainable and responsible use of AI in education. [This abstract was generated with ChatGPT-4o and slightly adapted by the authors.]

## 1. Einleitung

Prompt Engineering (auch 'Prompting' oder 'Prompten') ist ein rasant wachsendes Feld, das sich in den letzten drei Jahren durch die Fortschritte in der Generativen KI als zentrale Technik etabliert hat. Es bezeichnet die gezielte Optimierung von Texteingaben   (Prompts)   für   sprachgesteuerte   KI-Modelle   wie   ChatGPT (Texterstellung), Midjourney (Bilderstellung), Veo (Videoerstellung) oder Suno (Musikerstellung), um präzise, akkurate und kontextgerechte Ausgaben zu erhalten. Dies ist deshalb so relevant, weil es aus Kosten- und Zeitgründen oft nicht möglich ist, Sprachmodelle für alle möglichen Use Cases zu trainieren bzw. nachzujustieren (Finetuning).   Das   Bereitstellen   spezifischer   Prompts   bietet   für Endnutzer:innen die Möglichkeit, ein sprachgesteuertes KI-Modell

für spezifische Situationen erfolgreich einzusetzen (Dang et al. 2022).

Prompt Engineering ist jedoch keine intuitive Technik, sondern kann und muss erlernt werden (Oppenlaender et al. 2024). Knoth et al. (2024) fanden heraus, dass Studienteilnehmer:innen Prompt Engineering subjektiv als einfach wahrnehmen. Diese Einschätzung konnte bei eingehender Analyse der Prompt-Qualität von den Forscher:innen aus objektiver Sicht aber nicht bestätigt werden. Weiters konnte gezeigt werden, dass bereits minimale Veränderungen - wie das Zuweisen einer Rolle, das Bereitstellen von Beispielen oder die Veränderung der Prompt-Struktur - zu großen Unterschieden in den Ergebnissen führen können (Arora et al. 2022; Kaddour et al. 2023). In Zukunft wird die Kompetenz, effektive Prompts zu verfassen, sowohl für Lehrende als auch Lernende  von   wesentlicher   Bedeutung   sein   (Eager   und   Brunton 2023).

Aktuell gibt es nur sehr wenige systematische Herangehensweisen an das Prompt Engineering. Oft wird betont, dass Versuch und Irrtum essenziell sind, um sich effektive Prompting-Strategien anzueignen (Knoth et al. 2024; Dang et al. 2022). Aber während Versuch und Irrtum im Sinne des forschenden und entdeckenden Lernens als Methode für das Erwerben von konkreten PromptingFähigkeiten sehr sinnvoll sein kann, benötigen Lehrpersonen, die sich an einen Rahmenlehrplan halten und den Schüler:innen berufsrelevante   Schlüsselkompetenzen   vermitteln   müssen,   eine konkrete Herangehensweise (Helmke 2003; Huber 2009).

Es existiert bereits eine Vielzahl an Prompting-Frameworks, die unterschiedliche Aspekte des Prompt Engineerings adressieren. Von   populären   Influencer:innen-Frameworks   wie   dem   RISENFramework 2 von Kyle Balmer (2024) und dem CIDI-Framework 3 von Gianluca Mauro (2024) über professionelle Guidelines wie der DAIR-Academy (2024) bis hin zu offiziellen Prompting-Guides von KI-Entwicklern wie Google 4 (2024) und OpenAI (2025) gibt es dutzende unterschiedliche Ansichten.

Solche Frameworks fokussieren sich meist nur auf einzelne technische Aspekte von Prompts und vernachlässigen deren didaktische Einbettung. Dadurch fehlt eine systematische Anleitung für Lehrpersonen,   die   KI-gestützten   Unterricht   planen   und/oder Prompting-Kompetenzen vermitteln wollen. Wenn Lehrpersonen ihren Schüler:innen den Umgang mit Sprachmodellen (Large Language Models, LLMs) wie ChatGPT beibringen wollen, reicht es nicht, auf die drei wichtigsten Aspekte wie Rolle, Zielgruppe und Chain-of-Thought-Prompting einzugehen. Für den Bildungskontext ist es wichtig, nicht nur den effektiven, sondern auch den kritischen und ethischen Umgang mit KI zu trainieren (Grizzle et al. 2021). Und es bedarf einer Einbettung in Unterrichtsfächer und aktivitäten sowie Möglichkeiten zur Leistungsbeurteilung. Obwohl es bereits erste Ansätze gibt (Eager und Brunton 2023), sind diese nicht systematisch genug angelegt. So konzentrieren sich bestehende Modelle, die explizit für den Bildungskontext entwickelt wurden - wie das 'AI PROMPT'-Framework (Korzynski et al. 2023), das CLEAR-Framework (Lo 2023) und das 'Five S'-Modell (AI for

Education 2024) -, zu stark auf einzelne Prompting-Techniken und gehen nur wenig über das traditionelle Prompten hinaus; so beschränken sie sich auf das Bereitstellen von Feedback und/oder das Reflektieren des Ergebnisses, um aus Nutzer:innensicht bessere Ergebnisse zu erhalten. Sie vernachlässigen jedoch die pädagogische Dimension des Prompt Engineerings und geben beispielsweise keine Auskunft darüber, wie das Modell in den Unterricht integriert werden soll und die Prompts durch Lehrpersonen beurteilt werden können.

Um diese Lücke zu schließen, stellt dieses Paper das von den Autor:innen entwickelte PCRR-Framework vor und versucht, die Unterrichtstauglichkeit desselben zu zeigen. Im Gegensatz zu bisherigen Modellen betrachtet dieses Prompting als integralen Bestandteil eines didaktischen Gesamtkonzepts. Es erweitert den Fokus über den eigentlichen Prompt hinaus und integriert Prompting in den gesamten Lernprozess. Es besteht aus den vier Phasen Plan, Create, Review und Reflect . Während klassisches Prompting   lediglich   den   Create-Schritt   umfasst,   erweitert   das   PCRRFramework diesen um analytische Vorarbeit (Plan), eine kritische Überprüfung des Ergebnisses (Review) und eine reflektierende Nachbetrachtung des Prozesses (Reflect).

## 2. Das PCRR-Framework

Das PCRR-Framework wurde 2024 von Freinhofer für den Hochschullehrgang (HLG) 'Künstliche Intelligenz im IT-Unterricht der Berufsbildung' 5 (PH Tirol und Hochschule für Agrar- und Umwelt-

pädagogik) entwickelt, um die Lehrpersonen praxisnah in das Prompting einzuführen. Die Entwicklung eines neuen Modells war nötig, da es bisher kein ganzheitliches Konzept gab, um Prompting-Skills zu vermitteln und Prompt Engineering nahtlos in die Unterrichtspraxis zu integrieren. Der Prototyp des Frameworks wurde (unter dem Namen PCR-Framework) im Lehrgang vorgestellt und eingesetzt. In weiterer Folge wurde das Framework vom Seminarleiter, von der Lehrgangsleitung und von einzelnen Teilnehmer:innen weiterentwickelt und ausgetestet, um die Praxistauglichkeit zu überprüfen (diese Praxisbeispiele sind in Abschnitt 3 zu finden). Durch Rückmeldungen seitens der Lehrpersonen und Schüler:innen wurde das Modell weiter überarbeitet. Diese Publikation stellt die aktuelle Version des PCRR-Frameworks vor und beleuchtet dessen Einsatz in der Praxis. In der nächsten Phase (Post-Publikation) soll das Framework in verschiedenen Bildungskontexten getestet und evaluiert werden, um es weiter zu verbessern und seinen praktischen Nutzen systematisch zu validieren.

## 2.1 PCRR: Die vier Phasen

Das PCRR-Framework gliedert den Prompting-Prozess in vier Phasen: Plan, Create, Review und Reflect (Abb. 1). Während viele bestehende Frameworks sich nur auf die Formulierung des Prompts konzentrieren, berücksichtigt PCRR auch die vorgelagerte Planung sowie die nachgelagerte Überprüfung und Reflexion. Gerade im schulischen Kontext spielt die vierte Phase - Reflexion - eine zentrale Rolle. Schüler:innen bewerten nicht nur das Endergebnis,

sondern hinterfragen auch den gesamten Prompting-Prozess sowie die Interaktion mit der KI.

Bei der Auswahl der Prompting-Phase stützt sich die Create-Phase auf die noch recht junge Prompt-Engineering-Literatur und versucht,   diese   zu   destillieren.   Denn   bereits   der   umfassende 'Prompt Report' von Schulhoff et al. (2024) mit seinen 58 Prompting-Techniken zeigt, dass es hier bereits eine Vielzahl an Ansätzen gibt. Die Auswahl wurde so getroffen, dass Techniken im Vordergrund stehen, die leicht erklärbar und vermittelbar sind - vor allem für Schüler:innen und Lehrer:innen, die bisher noch weniger Prompting-Erfahrung gesammelt haben. Die Create-Phase ist jedoch nicht statisch, sondern unterliegt aufgrund technischer Entwicklungen einem ständigen Wandel und bietet gleichzeitig das Potenzial, für unterschiedliche Kompetenzlevel, Schultypen und Unterrichtsfächer angepasst zu werden.

Die drei Phasen Plan, Review und Reflect stützen sich auf Erkenntnisse des Computational Thinking, Forderungen der kritischen und ethischen Beurteilung von Prompts und KI-generierten Ergebnissen sowie Erfahrungen aus der Praxis (Asunda et al. 2023; Markauskeite et al. 2022; Perkins et al. 2024).

PCRR wurde primär für den Einsatz mit großen Sprachmodellen (LLMs) wie ChatGPT, Gemini oder Claude entwickelt. Während die Phasen Plan, Review und Reflect auch für Bildgeneratoren wie Adobe Firefly, Stable Diffusion oder Midjourney relevant sind, unterscheidet sich die Create-Phase erheblich, da sich die Struktur von Bild-Prompts grundlegend von Text-Prompts unterscheidet. 6

<!-- image -->

Im nächsten Abschnitt werden die vier Phasen des PCRR-Frameworks in ihrer grundlegenden Struktur vorgestellt.

## 2.2 Plan

Die Planungsphase dient dazu, zu klären, ob und wie der Einsatz eines KI-Modells sinnvoll und zulässig ist, um ein optimales Ergebnis zu erzielen. Sie umfasst die Zielsetzung, die Auswahl geeigneter KI-Tools und die Gestaltung des Arbeitsprozesses.

Die Rahmenbedingungen der KI-Nutzung sind hier - zumindest in Österreich und Deutschland - noch nicht geklärt. Es mangelt an entsprechender   KI-Qualifizierung   von   Lehrkräften,   Digitalisie-

rungsmaßnahmen, Bereitstellung von finanziellen Ressourcen für Schulen sowie ethischen und gesetzlichen Regelungen zur KI-Nutzung (Helm et al. 2024). Obwohl das Österreichische Bildungsministerium bereits Ansätze einer KI-Strategie für die Schule entwickelt hat, 7 ist diese nicht ausreichend. Damit variiert der Einsatz von   KI-Technologie   an   österreichischen   Schulen   erheblich,   je nachdem, ob eine Schule Teil des KI-Pilotprojekts 8 ist oder nicht (Helm et al. 2024; Höfler et al. 2024). Pilotschulen erhalten Zugang zu   kostenpflichtigen   KI-Tools,   die   technisch   fortgeschrittenere Versionen der gängigen Sprachmodelle umfassen. Diese Modelle sind in der Lage, Prompts differenzierter zu verarbeiten und liefern oft präzisere Ergebnisse als frei verfügbare Alternativen. Dadurch entsteht jedoch ein Ungleichgewicht: Schüler:innen ohne Zugang zu kostenpflichtigen Modellen könnten bei identischer Prompt-Formulierung qualitativ schlechtere Ergebnisse erhalten als jene, die sich ein kostenpflichtiges Abonnement leisten können. Dies wirft nicht nur Fragen der digitalen Chancengleichheit auf, sondern beeinflusst auch die Bewertung der tatsächlichen Prompting-Fähigkeiten von Lernenden.

Eine erste Orientierung für Lehrpersonen aus der Literatur bietet hier die AI Assessment Scale von Perkins et al. (2024), die den KIEinsatz in fünf Stufen einteilt: Von keinem KI-Einsatz über KI-Assistenz bis hin zur freien Fahrt durch die KI.

Schüler:innen sollten zunächst überlegen, welches Ergebnis sie mit der KI erzielen möchten und welche Schritte dafür notwendig sind. Wenn das geklärt ist, folgt die Tool-Auswahl.

Abhängig von der Zielgruppe und dem Wissensstand der Lernenden erfolgt die Tool-Auswahl entweder von der Lehrperson oder den Schüler:innen selbst: Welche KI-Tools kommen für eine Aufgabe grundsätzlich in Frage (bezogen auf die Fähigkeiten des Tools) und welche machen dann tatsächlich Sinn (bezogen auf den Verwendungszweck und die Herausforderungen des Tools). Ein passendes Beispiel ist der Hammer: Er ist ideal, um Nägel in die Wand zu schlagen. Aber obwohl eine Schraube aus demselben Material besteht, auch einen Kopf aufweist und ebenso in einer Wand endet, um etwas festzumachen, bedeutet das nicht, dass ein Hammer gut geeignet ist, die Schraube in die Wand zu schlagen. Dafür benötigt man Bohrmaschine, Dübel und Schraubenzieher.

Ähnlich verhält es sich mit Sprachmodellen: ChatGPT eignet sich hervorragend als Konversationspartner, um Feedback einzuholen oder kreative Texte zu generieren. Für faktenbasierte Informationen mit korrekten Quellen ist es jedoch weniger zuverlässig. Für die Literatursuche gibt es entsprechende Tools wie Elicit 9 und für das   Verfassen   eines   wissenschaftlichen   Kapitels   mit   richtiger Quellenangabe gibt es Tools wie Hesse 10 . Doch auch diese Aussagen können nicht pauschal getroffen werden. Denn die 'korrekte' Auswahl eines KI-Tools unterliegt ständigen Veränderungen. So kann ChatGPT mit der 'Deep Research'-Funktion mittlerweile eine beeindruckende Literaturrecherche mit korrekten Quellen und Verweisen   durchführen.   Eine   allgemeingültige   Kategorisierung von KI-Tools erweist sich daher als äußerst schwierig.

Ist die Wahl des KI-Tools getroffen, stellt sich die Frage nach der optimalen Interaktion: Während es oft hilfreich ist, möglichst viele Informationen bereitzustellen, gibt es Fälle, in denen eine minimalistische Herangehensweise effektiver sein kann. Je langwieriger und/oder komplexer das Problem ist, desto mehr Gedanken sollte man sich im Vorhinein machen.

Diese Teilschritte verlaufen nicht unbedingt linear. In komplexeren Aufgaben kann jeder Teilprozess unterschiedliche Anforderungen an den KI-Einsatz stellen. So beginnt hier bereits ein iterativer Prozess, bevor noch mit dem eigentlichen Prompten begonnen wird.

Im Schulkontext sollte die Planungsphase systematisch dokumentiert werden. Dies stellt sicher, dass Schüler:innen die einzelnen Schritte bewusst durchlaufen, und ermöglicht Lehrpersonen eine zusätzliche Grundlage zur Bewertung der KI-Kompetenz. Wie eine solche Dokumentation aussehen soll, hängt vom jeweiligen Schulkontext ab. Die Autor:innen haben in einer Ressourcensammlung, die am Ende der Publikation zu finden ist, eine mögliche Vorgabe erarbeitet. 11

Die Planungsphase kann zunächst aufwendig erscheinen, doch sie verbessert langfristig die Ergebnisse. Eine effektive Umsetzung setzt jedoch Vorerfahrungen mit KI voraus - daher sollte sie erst eingeführt werden, wenn Schüler:innen grundlegende PromptingTechniken beherrschen.

## 2.3 Create

Die Create-Phase konzentriert sich auf die Formulierung des eigentlichen Prompts. Sie umfasst die zentralen Prinzipien und Methoden des klassischen Prompting: von der Zuweisung einer Rolle und der Bereitstellung von Beispielen (N-Shot-Prompting) bis hin zur Nutzung von Delimitern. 12 Die konkrete Wahl der Methoden hängt stark vom jeweiligen Use Case ab. Je komplexer eine Aufgabe, desto mehr Aspekte machen tendenziell Sinn. Es müssen jedoch nicht alle Aspekte in einem einzelnen Prompt abgedeckt sein.   Dank   der   Planungsphase   sollte   nun   klar   sein,   wie   der Prompt strukturiert werden kann.

Das   PCRR-Framework   unterscheidet   zwischen   verschiedenen Prompting-Niveaus, die schrittweise erarbeitet werden. Zu Beginn sollten Schüler:innen Techniken erlernen, die mit minimalem Aufwand gute Ergebnisse liefern:

- Rolle : Dem Sprachmodell wird eine fachspezifische Rolle zugewiesen, um die Antworten gezielter zu steuern (Kaddour et al. 2023: 19). Beispiel: 'Du bist eine erfahrene Lehrperson in heterogenen Klassenräumen'.
- Kontext : Alle relevanten Informationen werden bereitgestellt, damit so wenig Interpretationsspielraum wie möglich herrscht. Ein guter Startpunkt ist das Beantworten aller W-Fragen.
- Sprache : Eine präzise und eindeutige Sprache in ganzen und grammatikalisch korrekten Sätzen ist nötig, um Missverständnisse zu vermeiden. Auch eine freundliche Sprache führt zu besseren Ergebnissen (Yin et al. 2024).
- Rückfrage : Eine der effektivsten Strategien für präzisere Ergebnisse ist die Rückfrage-Technik. Dabei wird das Modell direkt gefragt: 'Hast du noch Fragen, die ich beantworten kann, damit du die Aufgabe optimal lösen kannst?' Dies veranlasst das Modell zu einer Ist-Soll-Analyse

und bringt oft wichtige Aspekte zur Sprache, die Nutzer:innen selbst übersehen hätten.

In weiterer Folge können die Schüler:innen mit fortgeschrittenen Techniken   wie   N-Shot-Prompting,   Chain-of-Thought-Prompting und Ähnlichem vertraut gemacht werden. Das PCRR-Framework umfasst insgesamt 12 Techniken, die im Glossar näher erläutert werden.

Nachdem der Prompt formuliert wurde, ist der nächste Schritt die Überprüfung des Ergebnisses - ein zentraler Aspekt der ReviewPhase.

## 2.4 Review

Die Review-Phase dient der kritischen Überprüfung und Optimierung des KI-generierten Outputs. Dazu gehören vier zentrale Aspekte:

- Inhaltliche Überprüfung (Fact-Checking) : Ist der Output faktisch korrekt?
- Rechtliche Prüfung : Darf der Output verwendet werden? Falls ja, unter welchen Bedingungen?
- Ethische Reflexion : Soll der Output verwendet werden? Welche moralischen Implikationen gibt es?
- Feedback &amp; Iteration :   Wie kann das Ergebnis weiter verbessert werden?

Diese Schritte sind im Bildungsbereich von besonderer Relevanz, da die Schüler:innen faktisch korrektes Wissen erlernen und sich den kritischen Umgang mit KI aneignen sollen.

Bei der inhaltlichen Überprüfung geht es darum, dass der KI-generierte Output durchgelesen und überprüft werden muss. Hier

sollte   nach   dem   Vier-Augen-Prinzip   (KI   und   mindestens   ein Mensch) und Zwei-Quellen-Prinzip (KI und mindestens eine unabhängige und vertrauenswürdige Quelle) vorgegangen werden (Berens und Bolk 2024: 91).

Ziel der rechtlichen Überprüfung ist der gesetzeskonforme Einsatz von KI. Diese Überprüfung beschäftigt sich mit Fragen der Privatsphäre, des Datenschutzes, des geistigen Eigentums und ähnlichen Aspekten. Hier herrscht aktuell aber noch sehr viel Unklarheit, da diese Fragen noch nicht geklärt sind. Es gibt bereits Rahmenregulatorien   wie   die   Datenschutz-Grundverordnung (DSGVO) und den AI Act (AIA) der Europäischen Union. Diese beantworten jedoch nicht alle offenen Fragen und berücksichtigen weder die Feinheiten des Bildungssystems noch die spezifischen Bedürfnisse von KI-Endnutzer:innen. Bisherige Initiativen des österreichischen Ministeriums für Bildung, Wissenschaft und Forschung (BMBWF) sind nicht umfassend, klar und aktuell genug. Außerdem fehlen eine  klare   Kommunikation   an   Schulen   und Lehrkräfte, angemessene Schulungsmaßnahmen (Einbettung in Lehramts-Curricula und Fortbildungen für bestehende Lehrkräfte) und Praxisbezug.

Doch die Frage der Legalität allein reicht nicht aus: 'legislation cannot function as a substitute for morality' (Brey 2007: 21). Mit dieser Frage beschäftigt sich daher ethische Überprüfung. Beispielhaft werden an dieser Stelle vier verschiedene ethische Fragen aufgeworfen (es gibt jedoch sehr viele weitere ethische Aspekte, die berücksichtigt werden müssen):

- Diskriminierung :   Werden gewisse Personengruppen durch verzerrte Trainingsdaten weiter diskriminiert? Beispiel: Erhalten weibliche Schüler:innen schlechtere Noten oder schlechteres Feedback durch ein KISystem?
- Accessibility :   Wird   dem   Prinzip   des   'Universal   Design'   nachgekommen? Beispiel: Können auch sehbehinderte Menschen das von der Schule bereitgestellte KI-Tool einsetzen?
- Fairness : Profitieren alle Schüler:innen gleichmäßig bzw. gemäß ihren Bedürfnissen vom KI-Einsatz? Beispiel: Wird KI in der Unterrichtsplanung so eingesetzt, dass alle Schüler:innen einen personalisierten und inklusiven Unterricht genießen können, oder so, dass nur die besten 20 % der Klasse noch gezieltere Fördermaßnahmen erhalten?
- Transparenz : Ist der KI-Entwickler transparent, wenn es um das Training des Modells oder das Speichern der Daten geht?

Welche Aspekte wie berücksichtigt und sichergestellt werden können, ist jedoch noch nicht geklärt. So ist es aktuell unklar, ob, wie und   mit   welchen   Tools   Lehrkräfte   die   Hausübungen   ihrer Schüler:innen korrigieren oder sogar beurteilen dürfen. Eine Korrektur/Bewertung mit einer Gratislizenz von ChatGPT ist abzulehnen. Aber ist die Verwendung von Microsoft Office 365 Copilot, welches eine DSGVO-konforme Nutzung des GPT-Sprachmodells erlaubt, ausreichend? Oder braucht es ein lokal laufendes Opensource-Sprachmodell? Hier fehlen gesetzliche Vorgaben und ethische Richtlinien (Helm et al. 2024). Es braucht ein Zusammenkommen von Theorie, Praxis und Technik, um Strategien zu erarbeiten, die einen ethisch verantwortungsvollen Einsatz von KI in der Schule zu ermöglichen.

Auch wenn ein KI-generierter Inhalt korrekt sowie rechtlich und ethisch sauber ist, bedeutet das nicht automatisch, dass er effektiv ist und sein Ziel erfüllt. Daher ist es wichtig, den Output auf

seine Effektivität hin zu überprüfen und dem Modell Feedback zu geben, falls Anpassungs- oder Optimierungsbedarf besteht. Hier könnte das Sprachmodell darauf hingewiesen werden, dass das Modell etwas missverstanden hat, der Inhalt zu lang oder zu langweilig ist.

Generative KI-Modelle erstellen zwar bereits beim ersten Output gute Ergebnisse, aber um sehr gute oder ausgezeichnete Ergebnisse zu erhalten, bedarf es oft eines längeren und iterativen Prozesses. Zu den möglichen Strategien zählen:

- Konstruktives Feedback an die KI geben (z. B. Fehlinterpretationen korrigieren).
- Den Prompt anpassen (z. B. präzisere Formulierungen, mehr Kontext).
- Einen neuen Chat starten, wenn das Kontextfenster erschöpft ist.
- Ein anderes Modell testen, falls das aktuelle keine zufriedenstellenden Ergebnisse liefert.
- Zur Planungsphase zurückkehren, falls grundlegende Änderungen nötig sind.

Manche Strategien liegen auf der Hand, z. B. das Beginnen eines neuen Chats, wenn das Kontextfenster des bisherigen Chats ausgereizt ist oder ein Themenwechsel stattfindet. Andere Strategien sind nicht offensichtlich und bedürfen der Erfahrung im Umgang mit KI, weshalb vor allem hier das forschende Lernen ins Spiel kommt.

Erst wenn all diese Schritte durchlaufen und damit sichergestellt wurde, dass der KI-generierte Output faktisch korrekt, rechtlich

und ethisch einsatzfähig und zufriedenstellend ist, kann dieser auch eingesetzt werden.

Wie bereits in der Planungsphase gilt auch hier: Nicht alle Teilschritte sollten sofort unterrichtet werden, um Überforderung zu vermeiden. Ein gestufter Ansatz könnte so aussehen:

- Feedback &amp; Iteration
- Inhaltliche Überprüfung
- Ethische Überprüfung
- Rechtliche Überprüfung

Nach dieser kritischen Überprüfung folgt der letzte Schritt des PCRR-Frameworks: die Reflexion. Hier geht es darum, aus dem Prozess zu lernen und zukünftige KI-Nutzung bewusster zu gestalten.

## 2.5 Reflect

Die Reflect-Phase wurde in der Prototyp-Version des PCR-Frameworks noch nicht berücksichtigt. Erst durch praktische Erprobung und den Austausch zwischen den Autor:innen wurde deutlich, dass sie eine zentrale Ergänzung für den schulischen Bereich darstellt. Die Reflect-Phase besteht aus zwei zentralen Komponenten: Transparenz und Reflexion. Sie stellt sicher, dass Schüler:innen ihre Eigenleistung kenntlich machen (wodurch eine Beurteilung möglich wird) und ihren Umgang mit KI kritisch hinterfragen. Ziel ist es, sie zu kompetenten und verantwortungsvollen KI-Nutzer:innen zu befähigen.

Transparenz bedeutet, dass Schüler:innen offenlegen, wo und wie sie KI-Tools genutzt haben. Andernfalls besteht die Gefahr, dass Lehrkräfte nicht die Schüler:innen, sondern die KI-Modelle bewerten. Eine Möglichkeit, diese Transparenz zu gewährleisten, zeigt diese   Publikation   vor:   Indem   die   Zusammenarbeit   mit   dem Sprachmodell geteilt wird, um sie nachlesen zu können. Doch eine solche Umsetzung hängt von den technischen Rahmenbedingungen ab, die derzeit noch nicht flächendeckend gegeben sind. Denn aktuell erlauben es nur wenige Sprachmodelle, wie z. B. ChatGPT, Chats mit anderen Personen zu teilen. Ein verpflichtender Einsatz  von  ChatGPT  durch  Schüler:innen  ist   aktuell   aber nicht möglich. Hier braucht es Übergangslösungen wie das Kopieren von Prompts und Antworten und das Teilen von Screenshots der Gespräche, um diese beispielsweise in einem Portfolio unterzubringen, wie das auch in den Praxisbeispielen dieser Publikation gemacht wurde. Langfristig braucht es hier aber einfachere Lösungen.

Eine Möglichkeit besteht darin, hier auf die Eigenverantwortung der Schüler:innen zu setzen. Eine andere Möglichkeit besteht darin, dass die Schüler:innen ihre Chats, in denen sie mit KI zusammengearbeitet haben, teilen müssen. Dies ist bei Sprachmodellen wie ChatGPT möglich. Ein Problem hierbei ist, dass Schüler:innen für die Nutzung von ChatGPT eine private E-Mail-Adresse benötigen. Dadurch kann die Nutzung nicht verpflichtend vorgeschrieben werden. Es braucht hier also eine Lösung, die den Schüler:in-

nen einen kostenlosen und sicheren Zugang zu solchen KI-Tools verschafft und das Teilen der Chats ermöglicht.

Zusätzlich zum finalen Lernprodukt müssen die Schüler:innen eine Reflexion abgeben. Folgende Aspekte sollten in der Reflexion thematisiert werden: 13

- Einsatz des PCRR-Frameworks : Wie wurde das Framework genutzt?
- Zusammenarbeit mit der KI - Fokus auf die KI : Wie hat die KI zur Lösung beigetragen?
- Zusammenarbeit mit der KI - Fokus auf den Menschen : Wie ist es dem:r Schüler:in bei der Zusammenarbeit mit der KI ergangen? Hat sie gewisse Emotionen hervorgerufen?
- Lernprodukt : Wie zufriedenstellend ist das Endergebnis?
- Eigenleistung : Welche Teile der Arbeit wurden ohne KI-Unterstützung erstellt?

In dieser Reflexion dürfen die Schüler:innen keine KI einsetzen. Um dies sicherzustellen, könnte die Reflexion im Unterricht ohne technische Hilfsmittel verfasst werden. Dies hat zwei Vorteile: Erstens kann dies die Entwicklung von metakognitiven Kompetenzen im Zusammenhang mit KI und Prompt Engineering fördern (Gregory 2024). Zweitens bietet diese Reflexion für Lehrer:innen den zusätzlichen Vorteil, dass es ein eigenständiges Lernprodukt gibt, das beurteilt werden kann.

Es besteht in Zukunft jedoch die Möglichkeit, einen zweiten Reflexionsprozess - gemeinsam mit der KI - zu starten. Eine mögliche Weiterentwicklung könnte darin bestehen, dass eine zweite KI den gesamten Prozess überprüft - einschließlich KI-Output, Lern-

produkt, Chatverlauf und Reflexion. Schüler:innen könnten diese KI-generierte Reflexion anschließend erneut kritisch hinterfragen.

Die Stärke des PCRR-Frameworks liegt darin, dass es über reines Prompting hinausgeht: Es vermittelt umfassende KI-Kompetenzen, die Schüler:innen auf den verantwortungsvollen und kritischen Umgang mit KI vorbereitet.

## 3. Einsatz des PCRR-Frameworks im Unterricht

Im Rahmen des Hochschullehrgangs 'Künstliche Intelligenz im ITUnterricht der Berufsbildung' erwarben drei der Autor:innen, die als Lehrpersonen tätig sind, umfassende Prompting-Kompetenzen und lernten das damals noch als 'PCR-Framework' bezeichnete Modell kennen. Bereits während des Lehrgangs setzten sie es in ihrem Unterricht ein.

Nach Abschluss des Lehrgangs erklärten sie sich bereit, an dieser Publikation mitzuwirken und das weiterentwickelte PCR-Framework an ihren Schulen zu erproben.

Die Ergebnisse dieser Anwendung bilden die Grundlage für die folgenden Praxisberichte, die den Einsatz des PCRR-Frameworks in verschiedenen Unterrichtsszenarien dokumentieren. Der Fokus liegt hier auf dem fachpraktischen Unterricht in der Sekundarstufe Berufsbildung mit Informatikbezug.

Praxisbeispiel 1: Urheberrecht, Creative Commons und Lizenztypen Die HLW Kufstein setzte das Beispiel im III. bis V. Jahrgang um. Zwei Unterrichtseinheiten im Fach 'Angewandtes Informations-

management'   vermittelten   Inhalte   zu   Urheberrecht,   Creative Commons und Lizenztypen. Lehrpersonen: Sandra Steindl und Tanja Hechenberger

Praxisbeispiel 2: Rechtskonforme Webseiten in Österreich

An der HTL Perg der 3. Klasse - Fachschule - realisierte der Medientechnikunterricht dieses Beispiel. In vier bis sechs Unterrichtseinheiten erarbeiteten die Schüler:innen, wie sie rechtskonforme Webseiten in Österreich erstellen können. Lehrperson: Sandra Breitenberger

Praxisbeispiel 3: Theoretische Grundlagen der Bildbearbeitung

Die HTL Perg im II. Jahrgang führte dieses Beispiel im Medientechnikunterricht durch. Über zwei bis vier Unterrichtseinheiten wurden   theoretische   Grundlagen   der   Bildbearbeitung   vermittelt. Lehrperson: Sandra Breitenberger

Alle   Praxisbeispiele   beinhalten   detaillierte   Unterrichtsverläufe und ergänzende Materialien, die eine gezielte Anwendung des PCRR-Frameworks im Unterricht ermöglichen.

## 3.1 Exemplarischer Einblick in ein Praxisbeispiel

Zu Beginn setzen sich die Schüler:innen mit den theoretischen Grundlagen der Bildbearbeitung auseinander. Anschließend nutzen sie die Plattform Fobizz 14 , um gezielt Prompts zu formulieren und Informationen zu sammeln. Die Unterrichtseinheit beginnt mit einem theoretischen Input durch die Lehrperson über die wichtigsten   theoretischen   Punkte   der   Bildbearbeitung:   Gegenüberstellung von Pixel- und Vektorgrafiken, zentrale Begriffe wie

Auflösung,   Farbtiefe   und   Bildformate.   Im   Anschluss   wird   das Prompt Engineering nach dem PCRR-Framework eingeführt, um die Schüler:innen auf den praktischen Teil vorzubereiten.

Im praktischen Teil arbeiten die Schüler:innen in Partnerarbeit mit dem PCRR-Framework. Dabei durchlaufen sie folgende Schritte:

1. Entwicklung der Prompts basierend auf den theoretischen Grundlagen.
2. Dokumentation der Ergebnisse (gesammelte Prompts &amp; generierte Inhalte).
3. Erweiterung einer vorgegebenen PowerPoint-Präsentation mit den wichtigsten Erkenntnissen.
4. Präsentation der Ergebnisse vor der Klasse.
5. Reflexion des Arbeitsprozesses .

Die Schüler:innen erhalten eine schriftliche Aufgabenstellung mit detaillierten Arbeitsanweisungen entlang des PCRR-Frameworks (siehe Abb. 2).

<!-- image -->

Nach Abschluss der Unterrichtseinheit füllen sie einen kurzen Fragebogen aus, in dem sie ihre Erfahrungen mit dem PCR-Framework reflektieren.

## 3.2 Erfahrungsberichte

Im folgenden Abschnitt berichten die Lehrpersonen über ihre Erfahrungen mit der Umsetzung des PCRR-Frameworks im Unterricht. Dabei werden die Ergebnisse der drei Praxisbeispiele und die Schüler:innen-Antworten vorgestellt und kritisch reflektiert.

## 3.2.1 Praxisbeispiel 1

Dieses Beispiel wurde von zwei Lehrpersonen an der HLW Kufstein zum Thema 'Urheberrecht, Creative Commons und Lizenztypen' durchgeführt. Wie der Erfahrungsbericht zeigt, erwies sich der PCR-Ansatz als sehr nützlich:

Wir haben eine Unterrichtseinheit mit Schüler:innen aus den 3., 4. und 5. Jahrgängen der HLW durchgeführt, um ihre Fähigkeiten im Umgang mit Chatbots und der Erstellung von Prompts zu verbessern. Dabei zeigte sich, dass einige Schüler:innen bereits umfangreiche Erfahrungen gesammelt hatten und künftig Elemente der PCR-Methode in ihre bewährten Techniken integrieren werden. Diese Gruppe schätzt die neuen Ansätze und sieht darin eine Möglichkeit, ihre bisherigen Methoden zu verfeinern und zu optimieren. Auf der anderen Seite standen Schüler:innen mit wenig Erfahrung   im   Umgang   mit   Chatbots.   Diese   Gruppe   erkannte schnell, dass sie mit der strukturierten PCR-Methode effizient und zügig zu sehr guten Ergebnissen gelangen können. Für sie stellte

die neue Methode eine wertvolle Unterstützung dar, um ihre Interaktionen mit Chatbots zu verbessern. Unsere Umfrage unter 107 Schüler:innen aus den 3. bis 5. Jahrgängen ergab, dass die Selbsteinschätzung der Schüler:innen in Bezug auf KI-Prompting im Durchschnitt bei 3,3 auf einer Skala von 1 bis 5 lag. Die Ergebnisse der Befragung bestätigten diese Selbsteinschätzung, da ein Großteil der Befragten KI bereits häufig nutzt und sich eigene Methoden für Prompts angeeignet hat, um gute Ergebnisse zu erzielen. Wir sind der Meinung, dass unsere Schüler:innen zukünftig eine Kombination aus ihren bisher selbst angeeigneten Kenntnissen und wertvollen Inputs aus der PCR-Methode verwenden werden. Die PCR-Methode erweist sich als nützlich, um effizienter zum Ergebnis zu kommen und bestimmte Punkte zu automatisieren, wie z. B. die Vergabe einer Rolle an die KI, das Bedenken des relevanten Kontextes und die Angabe des Formats des Endergebnisses.

Im Anschluss wurden die Schüler:innen (n = 107) kurz zur Anwendung der PCR-Methode befragt. In den folgenden Tabellen (Tab. 1-4) sind die wichtigsten Ergebnisse dargestellt:

Tabelle 1: Anzahl der Prompts, die notwendig sind, um mit und ohne PCR-Framework ein passendes Ergebnis zu erhalten.

| Anzahl an Prompts   | Anzahl der Schüler:innen, die entsprechend viele Prompts benötigten, um mit Hilfe des PCR-Frameworks ein passendes Ergebnis zu erhalten.   | Anzahl der Schüler:innen, die entsprechend viele Prompts benötigten, um mit Hilfe des PCR-Frameworks ein passendes Ergebnis zu erhalten.   | Anzahl der Schüler:innen, die entsprechend viele Prompts benötigten, um ohne das PCR-Framework ein passendes Ergebnis zu erhalten.   | Anzahl der Schüler:innen, die entsprechend viele Prompts benötigten, um ohne das PCR-Framework ein passendes Ergebnis zu erhalten.   |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
|                     | Anzahl                                                                                                                                     | Prozent                                                                                                                                    | Anzahl                                                                                                                               | Prozent                                                                                                                              |
| 1                   | 69                                                                                                                                         | 64,49%                                                                                                                                     | 33                                                                                                                                   | 30,84%                                                                                                                               |
| 2                   | 29                                                                                                                                         | 27,10%                                                                                                                                     | 51                                                                                                                                   | 47,66%                                                                                                                               |
| 3                   | 7                                                                                                                                          | 6,54%                                                                                                                                      | 13                                                                                                                                   | 12,15%                                                                                                                               |
| 4                   | 2                                                                                                                                          | 1,87%                                                                                                                                      | 3                                                                                                                                    | 2,80%                                                                                                                                |
| 5                   |                                                                                                                                            |                                                                                                                                            | 5                                                                                                                                    | 4,67%                                                                                                                                |
| Mehr als 5          |                                                                                                                                            |                                                                                                                                            | 2                                                                                                                                    | 1,87%                                                                                                                                |
| Gesamt              | 107                                                                                                                                        | 100%                                                                                                                                       | 107                                                                                                                                  | 100%                                                                                                                                 |

Tabelle 2: Statistische Auswertung von Tab. 1

| Promp- ting   |   Median | Mittelwert   | Standard- abwei- chung   |   Min | Max   |
|---------------|----------|--------------|--------------------------|-------|-------|
| Ohne PCR      |        2 | 2,08         | 1,12                     |     1 | 5+    |
| Mit PCR       |        1 | 1,46         | 0,70                     |     1 | 4     |

Die Auswertung der Umfrage (Tab. 1 und 2) zeigt, dass das PCRFramework die Effizienz im Prompting-Prozess signifikant verbessert: Ohne das Framework empfanden nur 33 % der Schüler:innen das erste generierte Ergebnis passend. Mit dem Framework stieg dieser Wert auf 66 %. Schüler:innen ohne PCR-Framework benötigten mitunter fünf oder mehr Versuche, um ein passendes Ergebnis zu erzielen. Mit dem PCR-Framework waren maximal vier Versuche nötig.

Eine interessante Beobachtung aus Tabelle 3 ist die Diskrepanz zwischen der Einschätzung eines 'passenden' und eines 'zufriedenstellenden'   Ergebnisses.   Während   viele   Schüler:innen   mit dem ersten generierten Output zufrieden waren, stuften sie ihn nicht zwangsläufig als passend für die Aufgabenstellung ein.

Tabelle 3: Zufriedenheit der Schüler:innen mit dem ersten KI-generierten Ergebnis.

|        | Warst du mit deinem ers- ten Ergebnis (mit PCR) zufrieden?   | Warst du mit deinem ers- ten Ergebnis (mit PCR) zufrieden?   | Warst du mit deinem ers- ten Ergebnis (ohne PCR) zufrieden?   | Warst du mit deinem ers- ten Ergebnis (ohne PCR) zufrieden?   |
|--------|--------------------------------------------------------------|--------------------------------------------------------------|---------------------------------------------------------------|---------------------------------------------------------------|
|        | Anzahl                                                       | Prozent                                                      | Anzahl                                                        | Prozent                                                       |
| Ja     | 85                                                           | 79,44%                                                       | 56                                                            | 52,34%                                                        |
| Nein   | 22                                                           | 20,56%                                                       | 51                                                            | 47,66%                                                        |
| Gesamt | 107                                                          | 100%                                                         | 107                                                           | 100%                                                          |

Die Schüler:innen waren also bereits in höherem Ausmaß mit dem ersten Ergebnis zufrieden, empfanden es aber nicht unbedingt   als   passend.   Dies   könnte   auf   eine   Diskrepanz   zwischen dem, was Schüler:innen als gut empfinden, und dem, was aus ih-

rer Sicht von der Lehrperson als gut empfunden wird, hindeuten. Eine alternative Erklärung könnte eine methodische Verzerrung sein: Schüler:innen, die mit dem zweiten Ergebnis zufrieden waren, könnten sich unwohl gefühlt haben, eine negative Bewertung für ihr erstes Ergebnis abzugeben.

Darüber hinaus empfanden 93 Schüler:innen (86,9 %) die PCRMethode als hilfreich. Diese Erkenntnis gibt zwar keine aussagekräftige  Auskunft über die tatsächliche Qualität der erzeugten Prompts und Ergebnisse, zeigt jedoch, dass die Methode an sich wertvoll sein kann. Denn ein solches Modell kann in der Praxis nur dann Erfolg zeigen, wenn es auch von den Nutzer:innen angenommen wird (Watanabe et al. 2023).

## 3.2.2 Praxisbeispiel 2

Dieses Beispiel wurde von einer Lehrperson an der HTL Perg zum Thema 'Rechtskonforme Webseiten in Österreich' durchgeführt. Der Erfahrungsbericht der Lehrperson zeigt, dass sich das PCRFramework als hilfreich erwies und in Zukunft von den Schüler:innen eingesetzt werden wird.

Im Medientechnik-Unterricht wurde Effektives Prompten mit dem Thema 'Rechtskonforme Webseiten in Österreich' verbunden. 20 Schüler:innen aus der 3. Klasse Fachschule haben das PCR-Framework angewendet und am Ende einen Fragebogen ausgefüllt (19 abgegebene Fragebögen). Bei den Ergebnissen zeigte sich deutlich,   dass   fast   drei   Viertel   der   Schüler:innen   vor   dieser   Unterrichtseinheit schon Erfahrung mit Prompting hatten, sie aber ihre Prompting-Kenntnisse recht unterschiedlich beurteilt hatten. Der

Großteil der Schüler:innen fühlte sich beim Anwenden des PCRFrameworks 'sehr sicher' (16 %) oder 'sicher' (42 %). In Zukunft möchten 89 % der Befragten 'auf jeden Fall' oder eher schon' darauf achten, beim Prompten die Schritte des PCR-Frameworks einzuhalten. Im Zuge der Erhebung wurden die Schüler:innen ebenso gebeten, ihre Fähigkeiten in Teilbereichen einzuschätzen, nachdem der Unterrichtsblock abgeschlossen war (siehe Abbildung). Die Schüler:innen fanden am PCR-Framework als hilfreich 'Die ganzen Punkte die angegeben worden sind um einen sehr guten Prompt zu schreiben', 'die Instruktion zur Formulierung der Prompts' und haben es 'sehr interessant gefunden, außerdem erleichtert   es   das   Suchen   nach   richtigen   Lösungen   von Prompts'. Das Zuweisen einer Rolle, die Beschreibung des Kontexts und die Angabe des Endformats führten die Schüler:innen viel schneller zu einem besseren Endergebnis. Keiner der Befragten würde am PCR-Framework etwas ändern.

Bevor die Schüler:innen das PCR-Framework kennenlernten und einsetzten, wurden sie gefragt, wie gut sie selbst ihre PromptingKenntnisse einschätzen. Kein:e Schüler:in schätzte die eigenen Prompting-Fähigkeiten als 'sehr gut' ein. Jeweils 31,6 % schätzen sie als 'gut' und 'mittelmäßig' ein, 26,3 % schätzen sie als 'nicht so gut' ein und 10,5 % hatten noch überhaupt keine PromptingKenntnisse (Abb. 3).

<!-- image -->

Das PCR-Framework wurde von den Schüler:innen als äußerst hilfreich empfunden. Die Umfrage zur zukünftigen Nutzung ergab: 42 % der Schüler:innen werden es 'auf jeden Fall' wieder einsetzen, 47 % 'eher schon' und 11 % 'möglicherweise'. Kein:e einzige:r Schüler:in gab an, das Framework 'eher nicht' oder 'auf keinen Fall' mehr einzusetzen. Diese Ergebnisse, die in Abbildung 4 veranschaulicht sind, zeigen eine hohe Akzeptanz und Relevanz des PCR-Frameworks für den Unterricht.

<!-- image -->

## 3.2.3 Praxisbeispiel 3

Dieses Beispiel wurde von einer Lehrperson an der HTL Perg zum Thema 'Theoretische Grundlagen der Bildbearbeitung' durchgeführt. Das Ergebnis in dieser Klasse fiel ambivalent aus. Die Schüler:innen waren weniger zufrieden mit dem PCR-Framework und übten auch Kritik daran:

Im Medientechnik-Unterricht einer 2. Klasse HTL wurde das Thema 'theoretische  Grundlagen   der   Bildbearbeitung'   verbunden mit   dem   Erlernen   von   Effektivem   Prompten   nach   dem   PCRFramework. Von 26 Schüler:innen haben 19 den Fragebogen ausgefüllt. Knapp die Hälfte hatte vor der Unterrichtseinheit bereits Erfahrung mit Prompting, wobei der Großteil der Schüler:innen ihre Kenntnisse als gut oder mittelmäßig einstufte. Mehr als drei

Viertel der Schüler:innen fühlte sich beim Anwenden des PCRFrameworks 'sehr sicher' (11 %), 'sicher' (32 %) bzw. 'halbwegs sicher' (37 %). Nur 6 Schüler:innen möchten in Zukunft 'auf jeden Fall' oder 'bestimmt' darauf achten, beim Prompten die Schritte des PCR-Frameworks einzuhalten. Die Hälfte der Befragten gab an, dass sie 'möglicherweise' darauf achten werden, das PCRFramework anzuwenden. Als besonders hilfreich empfanden die Schüler:innen am PCR-Framework 'Die Strukturierung für das jeweilige Thema', 'Die Strukturierung in Teilaufgaben und das Spezifizieren der erwarteten Form der Antwort, in meinem Fall oft eine Auflistung, da diese mMn. oft sehr verständlich sind', den 'Kontext, ich war mir gar nicht wirklich bewusst, dass etwas Kontext zur Situation die Ausgabe der KI stark verbessern würde' oder dass 'man der KI eine Rolle geben soll, das habe ich zuvor nie gemacht, aber es ändert vieles von der genaueren Ausgabe'. Einige Schüler:innen übten auch Kritik am Framework, unter anderem finden Sie es unnötig, eine Quelle anzugeben oder 'die KI auffordern, Fragen zu stellen', da die KI häufig ohnehin halluziniert und dies auch beim Rückfragen so sein könnte, lautet die Meinung von einer befragten Person. Eine andere Person erachtet das Chain-of-Thought nicht als nützlich, da sich 'die Ausgabe nicht wirklich verändert'. Es gab aber von Schüler:innenseite keine Vorschläge, ob bzw. was man am PCR-Framework ändern könnte. Das Prompten in Verbindung mit dem PCR-Framework hat in dieser Klasse ebenso Anklang gefunden. Für mich habe ich mitgenommen, dass ich wahrscheinlich noch öfter eine 'Promp-

ting-Einheit'   machen   muss,   damit   die   Schüler*innen   sicherer beim Formulieren werden.

Wie bereits in Praxisbeispiel 2 wurden die Schüler:innen vor der Einführung des PCR-Frameworks nach ihrer Selbsteinschätzung im Prompting gefragt. Die Ergebnisse zeigen eine ähnliche, aber leicht   abgewandelte   Verteilung:   Auch   hier   schätzte   kein:e Schüler:in die eigenen Prompting-Fähigkeiten als 'sehr gut' ein. 31,6 % schätzen sie als 'gut' ein (gleiches Ergebnis wie in Beispiel 2). 52,6 % schätzten ihre Fähigkeiten als 'mittelmäßig' und 15,8 % als 'nicht so gut' ein. Kein:e einzige:r Schüler:in hatte noch überhaupt keine Prompting-Kenntnisse (Abb. 5).

<!-- image -->

Im Gegensatz zu den vorherigen Beispielen zeigte sich in dieser Klasse eine geringere Akzeptanz des PCR-Frameworks. Nur 11 % der Schüler:innen werden es 'auf jeden Fall' wieder einsetzen. 32 % werden es 'eher schon' und 37 % 'möglicherweise' einsetzen. Dafür gaben 21 % an, das Framework 'eher nicht' einzusetzen. Kein:e einzige:r Schüler:in gab an, es 'auf keinen Fall' mehr einzusetzen. Diese Ergebnisse, die in Abbildung 6 veranschaulicht sind, zeigen eine moderate Akzeptanz und Relevanz des PCRFrameworks für den Unterricht.

<!-- image -->

## 3.3 Limitationen

Obwohl die Praxisberichte wertvolle Einblicke in die didaktische Anwendung des PCRR-Frameworks lieferten, weist die Untersu-

## chung methodische Limitationen auf, die die Generalisierbarkeit der Ergebnisse einschränken.

1. Keine Kontrollgruppe &amp; gleiche Teilnehmer:innen: In allen drei Praxisbeispielen wurde das PCRR-Framework mit denselben Schüler:innen getestet. Dies erschwert die Unterscheidung zwischen echten Lerneffekten durch das Framework und der zusätzlichen Prompting-Erfahrung, die die Schüler:innen während des Unterrichts sammelten. Eine Kontrollgruppe hätte eine präzisere Bewertung der Methode ermöglicht. Andererseits hatten einige Schüler:innen bereits Vorerfahrungen im Prompten, weshalb der starke Fortschritt vermutlich nicht allein an der zusätzlichen Prompting-Erfahrung lag. Nähere Untersuchungen zu diesem Problem sind in Zukunft nötig.
2. Uneinheitliche Erhebungsmethoden :   Die   Befragung der Schüler:innen erfolgte an den einzelnen Schulen mit unterschiedlichen Fragebögen. Dadurch sind die Ergebnisse nicht direkt vergleichbar, was die methodische Aussagekraft der Untersuchung einschränkt.
3. Unklare Ursachen für Ablehnung des PCRR-Frameworks :   Die   Rückmeldungen der Schüler:innen zeigten sowohl Stärken als auch Schwächen des Frameworks. Jedoch konnte nicht erfasst werden, warum 14 Schüler:innen (13,1 %) im ersten Praxisbeispiel das PCRR-Framework als   nicht   hilfreich   empfanden.   Besonders   im   dritten   Praxisbeispiel wurde vermehrt Kritik geäußert, insbesondere zu Aspekten wie der Quellenangabe, der Aufforderung an die KI, Fragen zu stellen, und der Chain-of-Thought-Technik.   Diese   Techniken   sind   aus   Expert:innenSicht zwar essenziell, wurden von den Schüler:innen jedoch als unnötig   empfunden.   Möglicherweise   fehlt   hier   ein   grundlegendes   Verständnis für die Schwächen von Sprachmodellen. Zukünftige Untersuchungen sollten gezielt nach den Gründen für diese Wahrnehmung fragen und gegebenenfalls zusätzlichen didaktischen Input zur Relevanz dieser Methoden bereitstellen.
4. Geringe Stichprobengröße : Die Anzahl der befragten Schüler:innen war begrenzt. In den Praxisbeispielen 2 und 3 nahmen jeweils nur 19 Schüler:innen an der Umfrage teil. Diese Stichprobengröße reicht nicht aus, um belastbare statistische Aussagen zu treffen. Für zukünftige Untersuchungen sind größere Teilnehmer:innenzahlen notwendig, um aussagekräftigere Ergebnisse zu erzielen.

Diese Limitationen spiegeln den frühen Forschungsstand der KIDidaktik wider. Bisher existieren kaum standardisierte Methoden zur   Vermittlung   und   Evaluation   von   Prompting-Kompetenzen, weshalb die Lehrpersonen in dieser Studie explorativ vorgingen. Die hier gewonnenen Erkenntnisse liefern jedoch wertvolle Impulse für die Entwicklung systematischer didaktischer Ansätze. Das PCRR-Framework liefert hier einen vielversprechenden ersten Ansatz, der jedoch nicht abgeschlossen ist. Das Modell muss sich ständig weiterentwickeln, da sich die Relevanz einzelner Prompting-Techniken und von Prompt Engineering im Allgemeinen in Zukunft noch weiter verändern wird. Die Stärke des Frameworks liegt in seiner Adaptierbarkeit - damit kann es für unterschiedliche Schultypen, Schulstufen und Unterrichtsfächer adaptiert, gekürzt oder erweitert werden.

Hinzu kommt, dass die Datenerhebung in die Schularbeitenzeit fiel, wodurch Lehrpersonen und Schüler:innen nur begrenzte Ressourcen   für   eine   systematische   Durchführung   zur   Verfügung standen.

## 3.4 Zusammenfassung

Die Ergebnisse der Praxisstudien zeigen, dass das PCR-Framework die Effizienz und Qualität der Prompt-Erstellung signifikant verbessert. Die methodische Struktur unterstützt Lernende - unabhängig von ihrem Vorwissen - dabei, systematisch vorzugehen und schneller zu nutzbaren Ergebnissen zu gelangen, die als Ausgangspunkt für weiterführende Verbesserungen dienen können. Die quantitativen Daten aus Praxisbeispiel 1 zeigen eine deutliche

Reduktion der benötigten Prompts, was auf eine gesteigerte Effizienz der Methode hinweist. Die qualitativen Rückmeldungen aus Praxisbeispielen 2 und 3 bestätigen zudem, dass der strukturierte Ansatz den Lernprozess unterstützt und von den Schüler:innen als hilfreich wahrgenommen wird.

Gleichzeitig weisen die Ergebnisse auf methodische Herausforderungen   hin.   Die   fehlende   Kontrollgruppe   sowie   die   parallele Sammlung zusätzlicher Prompting-Erfahrungen erschweren eine eindeutige Kausalzuordnung der beobachteten Fortschritte zur Anwendung des Frameworks. Die Rückmeldungen aus Praxisbeispiel 3 zeigen, dass bestimmte Komponenten des Frameworks insbesondere die explizite Angabe von Quellen, die Aufforderung zur Fragestellung durch die KI und das Chain-of-Thought-Prompting - nicht von allen Schüler:innen als hilfreich empfunden wurden. Dies verdeutlicht den Bedarf an gezielterer Vermittlung und einer möglichen Anpassung der Methodik.

Insgesamt bestätigt die Studie, dass das PCRR-Framework ein vielversprechender Ansatz zur Förderung von KI-Prompting-Kompetenzen ist. Um die langfristige Wirksamkeit zu evaluieren, sind jedoch weiterführende empirische Studien erforderlich, die sowohl die Nachhaltigkeit der Methode als auch ihre Anpassung an unterschiedliche Unterrichtskontexte untersuchen.

Des Weiteren muss beobachtet werden, wie sich Prompt Engineering,   seine   Notwendigkeit   und   Effektivität   weiterentwickelt. Prompting-Techniken für frühere Sprachmodelle erweisen sich mittlerweile   als   weniger   effektiv   für   neuere   State-of-the-art-

Sprachmodelle (Wang et al. 2024). Manche Kritiker:innen gehen sogar so weit, zu behaupten, dass 'AI itself is on the verge of rendering prompt engineering obsolete' (Acar 2023). Als alternativen und nachhaltigen Skill schlägt Acar (2023) 'problem formulation' vor und nennt in diesem Zusammenhang vier Schlüsselkompetenzen: 'problem diagnosis, decomposition, reframing, and constraint design'. Aus Sicht der Autor:innen ist dies jedoch kein alternativer Ansatz per se, sondern weist auf Aspekte hin, die noch in das PCRR-Framework integriert werden müssen.

Daher sind die Autor:innen überzeugt, dass Prompt Engineering nicht obsolet werden wird, da es mehr ist als die reine Verwendung   von   Prompting-Techniken.   Ganzheitlich   gedacht   kann Prompting dazu beitragen, ein Verständnis für KI-Modelle zu entwickeln, eine präzise Kommunikation mit und abseits von Sprachmodellen zu üben, Computional Thinking zu stärken, Transferfähigkeiten für zukünftige Berufe zu erwerben und KI-Ergebnisse kritisch zu reflektieren.

## 4. Fazit und Ausblick

Prompt Engineering entwickelt sich mit rasanter Geschwindigkeit weiter und erfordert kontinuierliche Anpassung.  Wie Eager und Brunton (2023: 16) treffend formulieren: 'we continue to ,build the aeroplane as we are flying it''. Diese Dynamik zeigt sich besonders im Bildungsbereich, wo die Integration von PromptingKompetenzen noch in den Anfängen steckt. Es zeichnet sich bereits ab, dass Prompting - neben Lesen, Schreiben und Rechnen -

zu einer neuen Schlüsselkompetenz, vielleicht sogar Kulturtechnik wird (Aichinger und Miglbauer 2023).

Trotz dieser Entwicklung bleibt die Einbindung von Prompting in den schulischen Kontext bislang unzureichend systematisiert. Der Fokus der aktuellen Ansätze liegt überwiegend auf den technischen Aspekten und der Funktionsweise von KI-Modellen, während eine didaktische Verankerung noch weitgehend fehlt. Hier steht der Bildungssektor vor der Herausforderung, AI Literacy als festen Bestandteil von Lehrplänen und der Lehrer:innenausbildung zu etablieren. Eine fundierte KI-Grundbildung ist essenziell, damit alle Mitglieder der Gesellschaft diese Technologie nicht nur verstehen,   sondern   auch   kritisch   reflektieren   und   verantwortungsvoll nutzen können (Miao et al. 2021: 36).

Das PCRR-Framework gehört zu den ersten systematischen Ansätzen, die Prompting-Kompetenzen explizit für den schulischen Kontext   aufbereiten.   Es   unterscheidet   sich   von   bestehenden Prompting-Frameworks, indem es nicht nur die Strukturierung effektiver Prompts betrachtet, sondern auch deren didaktische Einbettung in den Unterricht. Die Erfahrungen aus dem Hochschullehrgang 'Künstliche Intelligenz im IT-Unterricht der Berufsbildung' sowie die Erkenntnisse aus den Praxisbeispielen zeigen, dass   das   PCRR-Framework   ein   vielversprechender   Ansatz   ist. Gleichzeitig wurden jedoch auch Schwächen sichtbar, die weiterentwickelt werden müssen.

Ein zentraler Schritt besteht darin, das PCRR-Framework noch praxistauglicher zu gestalten und empirisch weiter zu erforschen.

Mit dieser Publikation wird das Framework einer breiteren wissenschaftlichen und pädagogischen Community vorgestellt, um weiterführende Untersuchungen zu initiieren. 15 Erst durch umfassendere Forschung kann das Framework systematisch in den Unterricht integriert werden.

Neben der praktischen Erprobung muss auch die Bewertungssystematik für Prompt Engineering im Unterricht weiterentwickelt werden, da bislang keine standardisierten Beurteilungskriterien existieren (Knoth et al. 2024). Das PCRR-Framework könnte hier eine Lösung bieten, indem es gezielt auf konkrete Unterrichtssituationen   angewendet   und   in   ein   objektives   Beurteilungsraster überführt wird. Darüber hinaus ist die Berücksichtigung ethischer und rechtlicher Aspekte von hoher Relevanz, um eine verantwortungsbewusste Nutzung von KI sicherzustellen. Es muss eruiert werden, wie Lehrpersonen das PCRR-Framework einsetzen können, ohne an die Grenzen des Erlaubten und Gesollten zu stoßen.

Eines ist jedoch klar: Einzelne Frameworks und Workshops allein werden nicht ausreichen. Um eine nachhaltige Implementierung von AI Literacy zu gewährleisten, bedarf es einer umfassenden bildungspolitischen   Strategie.   Diese   muss   Lehramts-Curricula, Schulbücher, Unterrichtsmaterialien und technische Infrastruktur gleichermaßen berücksichtigen (Eager und Brunton 2023). Nur durch eine ganzheitliche Herangehensweise kann die nächste Generation die notwendigen Kompetenzen für den reflektierten und verantwortungsvollen Umgang mit KI erwerben.

## Hinweise

CRediT Autor:innenschaft Beitragserklärung 16

Dominik Freinhofer , Universität Graz: Conceptualization, Writing Original Draft, Writing - Review &amp; Editing, Visualization, Supervision, Project administration.

Gerlinde Schwabl , Pädagogische Hochschule Tirol, Institut für Berufspädagogik, Fachstelle Medienbildung &amp; Digitalisierung, Lehrgangsleitung 'KI im IT-Unterricht der Berufsbildung': Methodology, Resources, Writing - Review &amp; Editing, Supervision.

Susanne Aichinger ,   Hochschule für Agrar- und Umweltpädagogik Wien,   Institut   für   Beratung,   Entwicklungsmanagement   und   ELearning/E-Didaktik, Lehrgangsleitung: Methodology, Resources, Writing - Review &amp; Editing, Supervision.

Sandra Breitenberger ,   PH   Oberösterreich,   Lehrerin   an   der   HTL Perg, am HLG teilnehmende Lehrperson: Methodology, Investigation, Resources, Writing - Review &amp; Editing, Visualization.

Tanja Hechenberger , Lehrerin an der HLW Kufstein, am HLG teilnehmende Lehrperson: Investigation, Resources, Visualization.

Sandra Steindl ,   Lehrerin  an der HLW Kufstein, am HLG teilnehmende Lehrperson: Investigation, Resources, Visualization.

Erklärung von generativer KI und KI-gestützten Technologien im Schreibprozess

Alle Ideen stammen von den menschlichen Autor:innen dieses Papers.  Die   Autor:innen   haben   das   Geschriebene   selbst   verfasst und überarbeitet.

Das Sprachmodell ChatGPT wurde verwendet, um das Manuskript zu analysieren, Feedback bereitzustellen und Vorschläge zur verbesserten Lesbarkeit zu machen. Diese Mensch-Maschine-Kollaboration kann unter folgendem Link eingesehen werden: https:// chatgpt.com/share/67af0c81-6398-8000-b36d-38f3c7b31ea6. 17

Dort   kann   nachverfolgt   werden,   was   der   Ausgangstext   der Autor:innen war, wie die Autor:innen geprompted haben und wie sie mit dem KI-Output umgegangen sind. Um den Chat teilbar zu machen und den Prozess für Gratisnutzer:innen von ChatGPT replizierbar zu machen, wurde die Modellvariante ChatGPT-4o verwendet. Es wurden keine Spezialfunktionen wie GPTs, Projekte, Datei-Upload oder Canvas benutzt, obwohl diese vermutlich zu noch besseren Ergebnissen geführt hätten. Nach der Zusammenarbeit mit ChatGPT wurden noch zusätzliche, eigenständige Veränderungen vorgenommen, die daher nicht im Chatverlauf aufscheinen.

Dieser Zugang wurde gewählt, um mit gutem Beispiel voranzugehen und eine effektive, verantwortungsvolle, sinnvolle und transparente KI-Nutzung vorzuzeigen. Eine solche Vorgehensweise und Einforderung erleichtert die Beurteilung und erhöht die akademische Integrität im Bildungs- und Forschungsbereich.

## Erklärung über Interessenkonflikte

Die Autor:innen erklären, dass keine Interessenskonflikte im Zusammenhang mit dieser Veröffentlichung bestehen.

## Anmerkungen

- 1 Für die Ausweisung der KI-Nutzung in dieser Publikation, siehe die 'Erklärung von generativer KI und KI-gestützten Technologien im Schreibprozess' im Abschnitt 'Hinweise' am Ende der Publikation. Das PCRR-Framework fordert von den Schüler:innen Transparenz ein, was die KI-Nutzung betrifft, und geht daher mit gutem Beispiel voran, indem es den gesamten Überarbeitungsprozess mit ChatGPT zugänglich macht.
- 2 Role, Instructions, Steps, End Goal, Narrowing.
- 3 Context, Instructions, Details, Input.
- 4 Persona, Task, Context, Format.
- 5 Vgl. online unter: https://ph-tirol.ac.at/node/3416 (letzter Zugriff: 10.03.2025).
- 6 Wie die Create-Phase für solche Bildgeneratoren aussehen kann, ist noch unklar. Vorerst muss an dieser Stelle auf spezielle Literatur und PromptingLeitfäden (vgl. Oppenlaender 2023; Smith 2022) verwiesen werden.
- 7 Vgl. online unter: https://www.bmbwf.gv.at/Themen/schule/zrp/ki.html (letzter Zugriff: 10.03.2025).
- 8 Ebda.
- 9 Vgl. online unter: https://elicit.com/ (letzter Zugriff: 10.03.2025).
- 10 Vgl. online unter: https://hesse.ai/ (letzter Zugriff: 10.03.2025).
- 11 Siehe Padlet-Link im Abschnitt 'Materialsammlung' im Anhang.
- 12 Für eine Erklärung dieser Techniken, siehe das Glossar im Anhang.

- 13 Eine Zusammenstellung konkreter Reflexionsfragen finden Sie in der begleitenden   Materialsammlung   auf  https://padlet.com/gerlinde\_schwabl/PCRR (letzter Zugriff: 10.03.2025).
- 14 Fobizz ist ein deutsches Unternehmen, das eine Plattform für digitale Weiterbildungen von Lehrkräften und KI-Tools für Schulen bietet. Fobizz-Lizenzen ermöglichen es Lehrer:innen und Schüler:innen, Sprachmodelle wie ChatGPT datenschutzkonform im Unterricht zu nutzen. Vgl. online unter: https://fobizz.com/ (letzter Zugriff: 10.03.2025).
- 15 Wenn Sie, liebe:r Leser:in, Interesse haben, das PCRR-Framework im Zuge einer Studie umzusetzen, kontaktieren Sie bitte PCRR@freinhofer.com (letzter Zugriff: 10.03.2025).
- 16 Vgl. online unter: https://www.elsevier.com/researcher/author/policies-andguidelines/credit-author-statement (letzter Zugriff: 10.03.2025).
- 17 Sollte der Link aus unvorhersehbaren Gründen zu einem späteren Zeitpunkt nicht mehr aufrufbar sein, wurde das Gespräch sicherheitshalber abgespeichert   und   als   open-access   im   Internet   Archive   bereitgestellt: https://archive.org/details/chatverlauf-prompten-nach-plan  (letzter   Zugriff: 10.03.2025).

## Literatur

Acar, Oguz A. (2023): AI Prompt Engineering Isn't the Future, in: Harvard Business Review, online unter:  https://hbr.org/2023/06/ ai-prompt-engineering-isnt-the-future (letzter Zugriff: 10.03.2025).

Aichinger,   Susanne/Miglbauer,  Marlene  (2023):   Vom   gemeinsamen Entdecken mit den Studierenden zu einer neuen Kulturtechnik, in: Forum Neue Medien in der Lehre Austria (3), 15-17.

AI for Education (2024): Prompt Framework for Educators: The Five 'S' Model, online unter: https://www.aiforeducation.io/ai-resources/the-five-s-model (letzter Zugriff: 10.03.2025).

Arora,   Simran/Narayan,   Avanika/Chen,   Mayee   F./Orr,   Laurel/ Guha, Neel/Bhatia, Kush et al. (2022): Ask Me Anything: A simple strategy   for   prompting   language   models. https://doi.org/ 10.48550/ARXIV.2210.02441.

Asuna, Paul/Faezipour, Miad/Tolemy, Joshua/Do Engel, Milo Timothy (2023): Embracing Computational Thinking as an Impetus for Artificial Intelligence in Integrated STEM Disciplines through Engineering and Technology Education, in: Journal of Technology Education 34 (2), 43-63, online unter: https://jte-journal.org/articles/ 10.21061/jte.v34i2.a.3 (letzter Zugriff: 10.03.2025).

Balmer,   Kyle   (2024):   You're   Using   ChatGPT   Wrong   -   Upgrade Prompts with This Framework. YouTube, online unter: https://www.youtube.com/watch?v=RlmSQiMW3nk (letzter Zugriff: 10.03.2025).

Berens, Andreas/Bolk, Carsten (2024): Content Creation mit KI. 2., aktualisierte und erweiterte Ausgabe.  Bonn: Rheinwerk (Rheinwerk Computing).

Brey, Philip (2007): Ethical Aspects of Information Security and Privacy, in: Petković, Milan/Jonker, Willem (Hg.): Security, Privacy, and Trust in Modern Data Management, Berlin/Heidelberg: Springer, 21-36.

DAIR.AI (2024): Leitfaden zum Prompt Engineering, online unter https://www.promptingguide.ai/de (letzter Zugriff: 10.03.2025).

Dang, Hai/Mecke, Lukas/Lehmann, Florian/Goller, Sven/Buschek, Daniel (2022): How to Prompt? Opportunities and Challenges of Zero- and Few-Shot Learning for Human-AI Interaction in Creative Applications   of   Generative   Models,   in:   CHI'22   Workshops. https://doi.org/10.48550/arXiv.2209.01390.

Eager, Bronwyn/Brunton, Ryan (2023): Prompting Higher Education Towards AI-Augmented Teaching and Learning Practice, in: Journal   of   University   Teaching   and   Learning   Practice   20   (5). https://doi.org/10.53761/1.20.5.02.

Google (2024): Gemini for Google Workspace. Prompting Guide 101. A quick-start handbook for effective prompts. October 2024 edition.   Google,   online   unter https://services.google.com/fh/ files/misc/gemini-for-google-workspace-prompting-guide-101.pdf (letzter Zugriff: 10.03.2025).

Gregory, Scott F. (2024): Empowering Teaching With Prompt Engineering: How to Integrate Curriculum, Standards, and Assessment for a New Age, in: C. Sharma, Ramesh/Bozkurt, Aras (Hg.): Transforming Education With Generative AI: Prompt Engineering and Synthetic Content Creation, Hershey, PA: IGI Global, 239-260. https://doi.org/10.4018/979-8-3693-1351-0.ch012.

Grizzle, Alton/Wilson, Carolyn/Tuazon, Ramon/Cheung, Chi Kim/ Lau, Jesus/Fischer, Rachel et al. (2021): Media and Information Literate Citizens. Think Critically, Click Wisely!, online unter: https:// unesdoc.unesco.org/ark:/48223/pf0000377068 (letzter Zugriff: 10.03.2025).

Helm, Christoph/Große, Cornelia S./öbv (2024): Einsatz künstlicher Intelligenz im Schulalltag - eine empirische Bestandsaufnahme, in: Erziehung und Unterricht (3-4), 370-381, online unter: https://www.oebv.at/images/product-images/ Einsatz\_kuenstlicher\_Intelligenz\_im\_Schulalltag\_Helm\_Grosse\_E-

U.pdf (letzter Zugriff: 10.03.2025).

Helmke, Andreas (2003): Unterrichtsqualität erfassen, bewerten, verbessern. Unter Mitarbeit von Franz E. Weinert. 1. Auflage. Seelze: Kallmeyer (Schulisches Qualitätsmanagement).

Höfler, Elke/Kandlhofer, Martin/Ninaus, Manuel/Strasser, Thomas (2024): Künstliche Intelligenz im Bildungsbereich. Eine Verortung, in: Bundesministerium für Bildung, Wissenschaft und Forschung (Hg.): Nationaler Bildungsbericht. Teil 3 - Ausgewählte Entwicklungsfelder, Wien, 425-464.

Huber,  Ludwig   (2009):   Warum   Forschendes   Lernen   nötig   und möglich ist, in: Huber, Ludwig/Hellmer, Julia/Schneider, Friederike (Hg.): Forschendes Lernen im Studium. Aktuelle Konzepte und Erfahrungen. Bielefeld: UVW (Motivierendes Lehren und Lernen in Hochschulen, 10, 9-35.

Kaddour, Jean/Harris, Joshua/Mozes, Maximilian/Bradley, Herbie/Raileanu,   Roberta/McHardy,   Robert   (2023):   Challenges and   Applications   of   Large   Language   Models. https://doi.org/ 10.48550/ARXIV.2307.10169.

Knoth, Nils/Tolzin, Antonia/Janson, Andreas/Leimeister, Jan Marco (2024):  AI   literacy   and   its   implications   for   prompt   engineering strategies, in: Computers and Education: Artificial Intelligence 6. https://doi.org/10.1016/j.caeai.2024.100225.

Korzynski, Pawel/Mazurek, Grzegorz/Krzypkowska,   Pamela/ Kurasinski, Artur (2023): Artificial intelligence prompt engineering as a new digital competence: Analysis of generative AI technologies such as ChatGPT, in: Entrepreneurial Business and Economics Review 11 (3), 25-38. https://doi.org/10.15678/ EBER.2023.110302.

Lo, Leo S. (2023): The CLEAR path: A framework for enhancing information literacy through prompt engineering, in: The Journal of Academic Librarianship 49. https://doi.org/10.1016/ j.acalib.2023.102720.

Markauskeite, Lina/Marrone, Rebecca/Poquet, Oleksandra/ Knight, Simon et al. (2022): Rethinking the entwinement between artificial   intelligence   and   human  learning: What capabilities do learners need for a world with AI?, in: Computers and Education Artificial Intelligence 3 (1). https://doi.org/10.1016/ j.caeai.2022.100056.

Mauro, Gianluca/AI Academy (2024): How to prompt ChatGPT. AI Academy's   Free   ChatGPT   Course   -   Lesson   1,   online   unter: https://youtu.be/HVQFTk4JLKw (letzter Zugriff: 10.03.2025).

Miao,   Fengchun/Holmes,   Wayne/Ronghuai,   Huang/Zhang,   Hui (2021): AI and Education. Guidance for Policy-Makers: UNESCO, online unter: https://unesdoc.unesco.org/ark:/48223/ pf0000376709 (letzter Zugriff: 10.03.2025).

OpenAI (2025): Prompt Engineering, online unter: https://platform.openai.com/docs/guides/prompt-engineering (letzter   Zugriff: 10.03.2025).

Oppenlaender, Jonas (2023): A Taxonomy of Prompt Modifiers for Text-To-Image Generation. https://doi.org/10.48550/ arXiv.2204.13988.

Oppenlaender, Jonas/Linder, Rhema/Silvennoinen, Johanna (2024): Prompting AI Art. An Investigation into the Creative Skill of Prompt Engineering. https://doi.org/10.48550/arXiv.2303.13534.

Perkins,   Mike/Furze,   Leon/Roe,   Jasper/MacVaugh,   Jason   (2024): The Artificial Intelligence Assessment Scale (AIAS): A Framework for Ethical Integration of Generative AI in Educational Assessment, in: Journal of University Teaching and Learning Practice 21 (6). https://doi.org/10.53761/q3azde36.

Schulhoff,   Sander/Ilie,   Michael/Balepur,   Nishant/Kahadze,   Konstantine et al. (2024): The Prompt Report: A Systematic Survey of Prompting Techniques. https://doi.org/10.48550/ arXiv.2406.06608.

Smith, Ethan (2022): A Traveler's Guide to the Latent Space, online unter: https://sweet-hall-e72.notion.site/A-Traveler-s-Guide-tothe-Latent-Space-85efba7e5e6a40e5bd3cae980f30235f (letzter Zugriff: 10.03.2025).

Wang,   Guoqing/Sun,   Zeyu/Gong,   Zhihao/Ye,   Sixiang/Chen, Yizhou/Liang, Qingyuan/Hao, Dan (2024). Do Advanced Language Models Eliminate the Need for Prompt Engineering in Software Engineering? https://doi.org/10.48550/arXiv.2411.02093.

Watanabe, Alice/Schmohl, Tobias/Schelling, Kathrin (2023): Akzeptanzforschung zum Einsatz Künstlicher Intelligenz in der Hochschulbildung. Eine kritische Bestandsaufnahme, in: de Witt, Claudia/Gloerfeld, Christina/Wrede, Silke Elisabeth (Hg.): Künstliche Intelligenz   in   der   Bildung.  Wiesbaden:   Springer.  https://doi.org/ 10.25656/01:27820.

Yin,   Ziqi/Wang,   Hao/Horio,   Kaito/Kawahara,   Daisuke/Sekine, Satoshi (2024): Should We Respect LLMs? A Cross-Lingual Study on the Influence of Prompt Politeness on LLM Performance 2024. https://doi.org/10.48550/arXiv.2402.14531.

## Anhang

## Materialsammlung

Auf folgendem Padlet finden Lehrpersonen eine umfangreiche Materialsammlung zum PCRR-Framework und zu den in den Praxisbeispielen eingesetzten Arbeitsaufträgen:  https://padlet.com/ gerlinde\_schwabl/PCRR.

## Glossar: Erweiterte Prompting-Techniken

Dieses Glossar gibt einen Überblick über die erweiterten Prompting-Techniken, die im PCRR-Framework enthalten sind. Eine ausführlichere Analyse sowie mögliche Anpassungen folgen in einer weiterführenden Publikation.

Format :  Beim Format kann zwischen dem Format des Prozesses und dem Format des Produkts unterschieden werden. Das Format des Prozesses gibt vor, wie das Modell eine Aufgabe erledigen soll.   Beispiel:   Sprachmodelle   können   die   Häufigkeit   eines Buchstabens schwer zählen. Eine Lösung wäre, das Modell ein Python-Skript schreiben zu lassen, das diese Aufgabe übernimmt. Das Format des Produkts: Bestimmt das Ausgabeformat. Moderne Modelle können neben Fließtext auch Listen, Tabellen, Code, Bilder oder Dateien (z. B. Excel, Word) generieren.

N-Shot-Prompting : Bei dieser Technik geht es um das Bereitstellen von Beispielen. Sprachmodelle sind breit trainiert und können viele Aufgaben auf einem grundlegenden Niveau bewältigen. Sie können zum Beispiel Schularbeiten erstellen, ohne explizit dafür trainiert worden zu sein. Aber sie wurden nicht nur mit Schular-

beiten der Österreichischen Handelsakademie trainiert, sondern mit sehr vielen unterschiedlichen. Um die Ergebnisse von Sprachmodellen genauer und/oder personalisierter zu gestalten, brauchen sie zusätzliche Beispiele (sogenannte 'Shots'). So könnte eine Lehrperson drei vergangene Schularbeiten mit dem Sprachmodell teilen (3-shot-Prompting), damit das Modell die Inhalte, Formatierung, Übungsarten, Komplexität usw. versteht und darauf aufbauend weitere Schularbeiten erstellen kann.

Chain-of-Thought-Prompting (CoT) : Sprachmodelle generieren Texte schrittweise, ohne jeden Aspekt vollständig durchdacht zu haben. CoT-Prompting zwingt das Modell dazu, komplexe Probleme in Teilprobleme zu zerlegen und diese nacheinander zu bearbeiten. Dieser 'Denkprozess' kann entweder durch ein einfaches 'denke schrittweise' oder durch eine spezifische Anleitung mit Teilschritten   gemacht   werden.   State-of-the-art   'reasoning   models' (wie OpenAIs o3) performen unter anderem deshalb besser, weil sie immer einen solchen CoT-Prozess auslösen. Daher kann es sein, dass es für solche Modelle abträglich wäre, einen CoTProzess mechanisch auszulösen.

Prompt-Verkettung :  Sprachmodelle haben für jeden Output nur begrenzte Rechenkapazitäten. Sie können aktuell nicht mit einem einzigen Prompt ein ganzes Buch schreiben. Umfangreiche Probleme verlieren daher an Qualität, da sich das Modell auf viele Dinge auf einmal konzentrieren muss. Daher ist es besser, umfangreiche und komplexe Probleme in Teilschritte zu zerlegen und diese separat bearbeiten zu lassen.

Wenn eine Lehrperson beispielsweise eine Hausübung korrigieren und bewerten lassen möchte, macht es Sinn, dies in mehrere Teilschritte   aufzuteilen   (z. B.   Korrektur,   Feedback,   Bewertung, Übungsvorschläge) und jeden Teilschritt zu überprüfen und bei Bedarf anzupassen, bevor der nächste Schritt angestoßen wird.

Retrieval-Augmented-Generation   (RAG) :   Sprachmodelle   erzeugen häufig Fehler ('Halluzinationen'), da sie keine Datenbanken sind und ihre Trainingsdaten nicht kontinuierlich aktualisiert werden. RAG löst dieses Problem, indem es externe Informationsquellen einbindet. Dies kann durch Datei-Uploads, Weblinks oder den Zugriff auf spezialisierte Datenbanken geschehen.

Generated-Knowledge-Prompting (GKP) : Beim GKP wird dem Modell vor der Erledigung der eigentlichen Aufgabe ein anderer, vorbereitender Auftrag gegeben. Dies hat den Zweck, ein Fundament zu bauen und die Aufmerksamkeit auf gewisse Aspekte zu legen, um so den späteren Output zu verbessern. Es ähnelt damit dem psychologischen Konzept des Priming bzw. dem pädagogischen Konzept des Scaffolding. So könnte eine Lehrperson die KI fragen, was eine effektive Unterrichtseinheit ausmacht, bevor dann die eigentliche Unterrichtsplanung erstellt wird.

Delimiter : Wenn viele dieser Techniken in einem einzigen Prompt zum Einsatz kommen, kann es sein, dass für das Sprachmodell unklar   ist,   welche   Informationen   wie   zu   behandeln   sind.   Um Prompts klar zu strukturieren, können spezielle Markierungen ('Delimiter')   verwendet   werden.   Eine   gängige   Methode   ist   die

## Freinhofer et al.

Nutzung von XML-Tags, die den Prompt in verschiedene Abschnitte unterteilen:

&lt;instruktion&gt;Fasse den nachfolgenden Text zusammen.&lt;/instruktion&gt;

&lt;beispieltext&gt;Lorem ipsum&lt;/beispieltext&gt;

&lt;text&gt;Lorem ipsum&lt;/text&gt;