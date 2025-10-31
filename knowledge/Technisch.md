---
type: knowledge
created: 2025-01-31
tags: [python, github, api, automation, implementation]
status: active
---

# Technisch

## Repository-Architektur

Das GitHub-Repository FemPrompt_SozArb implementiert eine Python-basierte Verarbeitungspipeline mit modularer Struktur. Der Master-Controller run_pipeline.py koordiniert fünf Verarbeitungsstufen durch Event-Driven-Architecture. Die Konfiguration erfolgt über pipeline_config.yaml mit Parametern für API-Limits, Timeouts, Parallelisierung und Quality-Thresholds. Ein JSON-basiertes Status-Tracking in .pipeline_status.json protokolliert Fortschritt, Fehler und Metriken jeder Stage.

Die Verzeichnisstruktur trennt Input, Processing und Output. Der analysis-Ordner enthält alle Skripte und Zwischenergebnisse. Der deep-research-Ordner speichert modellspezifische Rechercheergebnisse von Gemini, Claude, GPT und Perplexity. Der to-Zotero-Ordner enthält RIS-Dateien für bibliographischen Import. Der knowledge-Ordner dokumentiert Theorie, Methodik und Prozesse. Die strikte Trennung ermöglicht unabhängige Entwicklung und Testing einzelner Komponenten.

Die Pipeline unterstützt vollautomatische Ausführung, selektive Stage-Aktivierung und Checkpoint-basierte Wiederaufnahme nach Unterbrechungen. Die Ausführung erfolgt über Kommandozeile mit Optionen für Custom Configuration, Resume from Checkpoint, Stage Selection und Verbose Logging. Die modulare Architektur mit klaren Interfaces erleichtert Komponenten-Updates und ermöglicht Erweiterungen ohne strukturelle Änderungen.

## PDF-Akquisition

Das Skript getPDF_intelligent.py implementiert hierarchische PDF-Akquisition mit acht Fallback-Strategien. Primär extrahiert das System Zotero-Attachments aus lokalem Storage. Die Zotero-Storage-Detection erfolgt automatisch über betriebssystem-spezifische Pfade für Windows, macOS und Linux. Bei vorhandenen Attachments werden PDFs direkt aus dem Zotero-Verzeichnis kopiert ohne API-Zugriff.

Bei fehlenden Dateien aktivieren sequenziell weitere Strategien. Die DOI-Resolution über CrossRef API identifiziert offizielle Publisher-Links. Die ArXiv-ID-Extraktion aus URLs oder Metadaten ermöglicht direkten ArXiv-Download. Die Semantic Scholar API liefert Open-Access-Versionen für Papers in deren Index. Die Unpaywall-Integration nutzt eine der größten Open-Access-Datenbanken. BASE Academic Search erweitert die Abdeckung für europäische und nicht-englischsprachige Quellen.

Zusätzliche Parser extrahieren PDFs aus verlagsspezifischen Seiten und HTML-Meta-Tags. Die URL-basierte Direktsuche versucht konstruierte PDF-URLs basierend auf DOI-Mustern. Die Fehlerbehandlung dokumentiert fehlgeschlagene Versuche mit Grund in acquisition_log.json. Eine missing_pdfs.csv listet nicht beschaffbare Dokumente für manuelle Nachbearbeitung.

Die optionale Zotero-API-Integration über pyzotero ermöglicht direkten Zugriff auf Cloud-Storage und Gruppen-Bibliotheken. Die Authentifizierung erfolgt über API-Key und Library-ID aus Umgebungsvariablen oder Kommandozeilenparametern. Diese Erweiterung ermöglicht kollaborative Workflows und Zugriff auf Institutionsbibliotheken ohne lokale Zotero-Installation.

## Dokumentenkonversion

Das Skript pdf-to-md-converter.py nutzt Docling für strukturerhaltende PDF-zu-Markdown-Transformation. Docling wurde als Nachfolger von PyPDF2 gewählt für verbesserte Konversionsqualität bei akademischen Texten. Die Konfiguration optimiert für Beibehaltung von Strukturelementen wie Überschriften, Listen, Tabellen und Zitationen. Die Extraktion von Bildern und Diagrammen erfolgt optional.

Die MD5-Hash-basierte Duplikaterkennung verhindert redundante Verarbeitung. Bei der ersten Konversion wird ein Hash des PDF-Inhalts berechnet und in conversion_metadata.json gespeichert. Spätere Pipeline-Läufe prüfen Hashes und überspringen bereits konvertierte Dateien. Dies ermöglicht effiziente Wiederaufnahme nach Unterbrechungen und inkrementelle Verarbeitung bei neuen Dokumenten.

Die Metadaten-JSON dokumentiert für jedes Dokument Originalfilename, MD5-Hash, Konversionszeitstempel, Docling-Version, Erfolgs- oder Fehlerstatus und Dateigröße von PDF und Markdown. Diese Informationen ermöglichen Reproduzierbarkeit und Debugging. Die Fehlerbehandlung isoliert problematische PDFs ohne Pipeline-Abbruch.

Die Ausgabe erfolgt als strukturierte Markdown-Dateien im analysis/markdown_papers Verzeichnis. Die Dateinamen werden normalisiert für konsistente Verarbeitung in nachfolgenden Stages. Die Markdown-Struktur folgt CommonMark-Standard für maximale Kompatibilität mit verschiedenen Tools. Die Beibehaltung akademischer Formatierung erhöht die Qualität der nachfolgenden KI-Analyse.

## KI-gestützte Zusammenfassung

Das Skript summarize-documents.py implementiert fünfstufige iterative Refinement mit Gemini 2.5 Flash. Stage 1 extrahiert akademische Kernelemente durch strukturierte Prompts mit Fokus auf Forschungsfrage, Methodik, Hauptergebnisse und theoretischen Rahmen. Stage 2 generiert fünfhundert-Wort-Synthesen durch Verdichtung der Rohextraktion mit Betonung von Kontext und Relevanz.

Stage 3 validiert Konsistenz und Vollständigkeit durch kritische Analyse der Stage-2-Ausgabe. Das Modell prüft interne Widersprüche, identifiziert Lücken und bewertet Generalisierbarkeit. Stage 4 produziert bereinigte einhundertfünfzig-Wort-Zusammenfassungen basierend auf der Validierung. Stage 5 extrahiert strukturierte Metadaten im YAML-Format mit Feldern für Keywords, Methods, Theories, Sample Size, Geographic Scope und Temporal Scope.

Die Gemini-API-Konfiguration balanciert Qualität und Kosten. Temperature 0.3 sorgt für Konsistenz bei minimaler Kreativität. MaxOutputTokens 2048 ermöglicht ausführliche Analysen. TopP 0.8 und TopK 40 steuern kontrollierte Variation. Die API-URL referenziert explizit v1beta/models/gemini-2.5-flash für Versionsreproduzierbarkeit.

Das Rate-Limiting verhindert API-Throttling durch konfigurierbare Delays zwischen Requests. Der Standard-Delay von zehn Sekunden kann bei Bedarf auf dreißig Sekunden erhöht werden. Die Batch-Metadaten in batch_metadata.json dokumentieren Verarbeitungszeiten, Erfolgsraten und Fehlertypen. Die Fehlerbehandlung mit Retry-Logik fängt transiente API-Probleme ab.

## Obsidian-Vault-Generierung

Das Skript generate_obsidian_vault_improved.py transformiert den Dokumentenkorpus in eine navigierbare Knowledge Base. Die Konzeptextraktion nutzt Pattern-basierte Erkennung mit regulären Ausdrücken für häufige Bias-Terminologie und Mitigation-Strategien. Die initiale Extraktion identifiziert mehrere hundert Kandidaten-Konzepte aus dem gesamten Korpus.

Die Normalisierung erfolgt durch ein Synonym-Mapping-Dictionary mit hundertachtzig Einträgen. Varianten wie AI Bias, Algorithmic Bias und ML Bias werden zu einer kanonischen Form konsolidiert. Die Großschreibung wird standardisiert. Plural- und Singularformen werden vereinheitlicht. Fragmentierte Begriffe werden zu vollständigen Konzepten zusammengeführt.

Die Deduplizierung nutzt Fuzzy-Matching mit Levenshtein-Distanz für Schreibvarianten. Frequenz-Thresholds filtern Konzepte mit weniger als zwei Vorkommen als Noise. Frequency-Caps limitieren überrepräsentierte generische Begriffe wie AI Systems oder Machine Learning. Die intersektionale Konsolidierung prüft, ob spezifische Konzepte wie Gender-Race Bias eigenständig bleiben oder unter übergeordnete Kategorien subsumiert werden.

Die finale Kategorisierung ordnet Konzepte in Bias Types mit vierzehn Einträgen und Mitigation Strategies mit einundzwanzig Einträgen. Jedes Konzept erhält eine eigene Markdown-Datei im Concepts-Verzeichnis mit Backlinks zu allen Papers, die das Konzept diskutieren. Die Papers werden im Papers-Verzeichnis mit Frontmatter-Metadaten und bidirektionaler Verlinkung zu relevanten Konzepten gespeichert.

Die Vault-Struktur umfasst ein MASTER_MOC.md als Navigationsindex mit kategorisierten Listen aller Papers und Concepts. Die Organisation vermeidet Dead Ends durch vollständige bidirektionale Verlinkung. Die Markdown-Syntax folgt Obsidian-Konventionen für optimale Darstellung in der Obsidian-Anwendung.

## Qualitätsvalidierung

Das Skript test_vault_quality.py implementiert systematische Vault-Validierung mit quantifizierbaren Metriken. Die Konzept-Uniqueness prüft auf Duplikate durch Vergleich aller Konzeptnamen mit Normalisierung für Groß-/Kleinschreibung und Whitespace. Duplikate indizieren unvollständige Deduplizierung und triggern Warnungen.

Die Metadata-Completeness verifiziert YAML-Frontmatter-Vollständigkeit für alle Paper- und Concept-Dateien. Erforderliche Felder wie type, created, tags und status werden geprüft. Fehlende oder inkonsistente Metadaten werden reportet. Die Validierung stellt sicher, dass programmatische Verarbeitung auf konsistente Datenstrukturen zugreifen kann.

Die Link-Integrity analysiert Obsidian-Links auf Existenz der Zieldateien. Broken Links zu nicht-existierenden Papers oder Concepts werden identifiziert. Die bidirektionale Verlinkung wird geprüft durch Verifikation, dass jeder Link von A nach B von einem Link von B nach A begleitet wird. Die Netzwerkanalyse identifiziert isolierte Komponenten ohne Verbindung zum Hauptgraph.

Das Scoring-System aggregiert Einzelmetriken zu einem Gesamtscore. Die Bewertungskriterien umfassen Uniqueness-Rate, Metadata-Completeness-Rate, Link-Integrity-Rate und Network-Connectivity. Der Output erfolgt als Konsolenreport mit farbcodierter Darstellung und optional als JSON-Datei vault_test_report.json für programmatische Auswertung.

## API-Integration

Die Multi-API-Architektur koordiniert Zugriffe auf heterogene Datenquellen. Semantic Scholar API mit hunderttausenden wissenschaftlichen Papers limitiert auf hundert Requests pro fünf Minuten ohne API-Key. Die Implementation nutzt Token-Bucket-Algorithmus für Rate-Limiting. CrossRef API für DOI-Metadaten operiert unbeschränkt mit empfohlenem Email-Header für höhere Limits.

ArXiv API für Preprints implementiert moderate Request-Raten mit drei Sekunden Minimum-Delay zwischen Requests. Unpaywall API für Open-Access-Links benötigt Email-Adresse im User-Agent. Die Error-Handling-Strategie unterscheidet transiente Fehler mit Retry-Logik von permanenten Fehlern mit Logging und Fortsetzung.

Die Zotero API über pyzotero ermöglicht bidirektionale Synchronisation bibliographischer Daten. Die Authentifizierung erfolgt über API-Key aus Umgebungsvariablen. Die Library-ID spezifiziert User-Library oder Group-Library. Die Read-Only-Operationen extrahieren Metadaten und Attachments. Die Write-Operationen ermöglichen Tag-Updates und Notizen.

Gemini API für KI-gestützte Analyse nutzt google-generativeai Python-Client. Die Environment-Variable GEMINI_API_KEY speichert Credentials. Die Model-Spezifikation wählt explizit gemini-2.5-flash. Die Generation-Config setzt Temperature, MaxOutputTokens, TopP und TopK. Die Safety-Settings können optional angepasst werden für unterschiedliche Content-Filter-Level.

## Abhängigkeiten und Installation

Das System erfordert Python 3.8 oder höher mit Unterstützung für Type Hints und Async/Await. Die Kernbibliotheken umfassen requests für HTTP-Kommunikation, PyYAML für Konfiguration, BeautifulSoup4 für HTML-Parsing, python-dotenv für Environment-Variables und google-generativeai für Gemini-Integration. Die optionalen Abhängigkeiten inkludieren pyzotero für erweiterte Zotero-Integration und docling für optimierte PDF-Konversion.

Die Installation erfolgt über requirements.txt mit gepinnten Versionen für Reproduzierbarkeit. Das File listet alle direkten Dependencies mit Minimum-Versionen. Docling erfordert zusätzliche System-Dependencies für PDF-Rendering-Engines. Die Installation auf Windows, macOS und Linux erfolgt identisch mit plattformspezifischer Handhabung von Systembibliotheken.

Die Konfiguration nutzt Environment-Variables für Credentials und Secrets. GEMINI_API_KEY für Gemini-Zugriff ist erforderlich. ZOTERO_API_KEY und ZOTERO_LIBRARY_ID sind optional für API-basierte Workflows. Die .env-Datei im Projektroot wird von python-dotenv automatisch geladen. Die .gitignore schließt .env von Versionskontrolle aus.

Die pipeline_config.yaml zentralisiert alle operationalen Parameter. Pfad-Definitionen spezifizieren Input- und Output-Verzeichnisse. API-Konfigurationen setzen Timeouts und Rate-Limits. Performance-Tuning-Parameter steuern Parallelisierung und Batch-Größen. Die YAML-Struktur ermöglicht Environment-spezifische Overrides ohne Code-Änderungen.

## Performance und Spezifikationen

Die Verarbeitungszeiten für typische Operationen orientieren sich an einem dreißig-Dokumente-Korpus. Die Dokumentenzusammenfassung benötigt hundert zwanzig Sekunden plus minus fünfzehn Sekunden pro Dokument. Die Vault-Generierung erfolgt in unter sechzig Sekunden für fünfunddreißig Dokumente. Die PDF-Konversion dauert etwa dreißig Sekunden pro Dokument als CPU-gebundene Operation. Die Qualitätstestung schließt in unter zehn Sekunden ab.

Das API-Rate-Limit für Gemini liegt bei sechzig Requests pro Minute. Die Speichernutzung beträgt etwa fünfhundert Megabyte für typische dreißig-Dokumente-Korpora. Die Input-Formate umfassen PDF und Markdown. Die Output-Formate sind Markdown, JSONL und HTML. Die Kodierung verwendet UTF-8 durchgängig. Die maximale Dokumentengröße liegt bei fünfzig Megabyte für PDF und vier Megabyte für Markdown. Das API-Token-Limit beträgt zweitausendachtundvierzig Tokens pro Response.

## Fehlerbehebung

### HTTP 429 Rate Limit Exceeded

Das API gibt Status Code 429 während Dokumentenverarbeitung zurück. Die Ursache liegt im Überschreiten der Gemini API Quota von sechzig Requests pro Minute. Die Lösung modifiziert analysis/summarize-documents.py in Zeile vierhundertfünfzehn. Die Delay-Erhöhung von time.sleep(10) auf time.sleep(30) reduziert Request-Rate. Die Alternative implementiert exponential backoff mit zwei hoch n Sekunden Wartezeit.

### MemoryError während PDF-Konversion

Der Prozess terminiert während PDF-Konversion. Die Ursache ist insuffizienter RAM für Dokumente über fünfzig Megabyte. Die Lösung limitiert Batch-Size auf maximal fünf PDFs concurrent. Die Heap-Allocation-Erhöhung durch python -Xmx4096m script.py allokiert mehr Speicher. Das Pre-Splitting großer PDFs durch pdftk input.pdf burst output page_%02d.pdf teilt Dokumente.

### Missing Metadata in Vault

Vault-Konzepte fehlen bibliographische Informationen. Die Ursache ist Filename-Mismatch zwischen zotero_vereinfacht.json und Markdown-Dateien. Die Lösung verifiziert File-Präsenz durch ls -la analysis/zotero_vereinfacht.json. Die Filename-Konsistenz-Prüfung stellt exakte Case-Sensitive-Übereinstimmung sicher. Der Fallback-Mechanismus aktiviert automatisch bei fehlenden Matches.

### Concept Over-Extraction

Die Extraktion produziert über hundert Konzepte aus limitiertem Korpus. Die Konfigurationspunkte liegen in analysis/generate_obsidian_vault_improved.py. Die Frequency-Caps in Zeilen hundertachtundneunzig bis zweihundertdrei limitieren überrepräsentierte Terme. Die Blacklist-Terms in Zeilen hundertfierundachtzig bis hundertfünfundneunzig filtern generische Begriffe. Die Minimum-Frequency in Zeile vierhundereinundvierzig erhöht Schwellenwert von zwei auf drei Vorkommen. Die empfohlenen Settings setzen Caps für AI Systems auf dreißig, Large Language Models auf fünfzig und Artificial Intelligence auf dreißig.
