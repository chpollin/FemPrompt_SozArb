# Runde-2-Screening, beratender LLM-Track

Advisory-Durchgang 2026-07-17, Modell Claude Opus, vier Screening-Agenten plus ein adversarialer Prüfagent. Kodierung gegen die eingefrorenen Einschlusskriterien (categories.yaml v1.3, Technik-Dimension und Sozial-Dimension je mindestens eine Kategorie ja). Dies ist der beratende Track des präregistrierten Dual-Assessment, die verbindliche Entscheidung trifft der menschliche Track über PRISM bzw. die Excel. Gemini-Kandidaten (idx 19 bis 24) wurden aus dem Empfehlungstext kodiert, da im konvertierten RIS kein Abstract steht, ihre Einstufung ist beim menschlichen Durchgang mit Volltext zu schärfen.

Deterministischer Konsistenz-Check, alle 24 Ableitungen stimmen mit den Dimensionswerten. Adversariale Verifikation der 15 Includes und des Excludes, keine Konfabulation, eine Korrektur (idx 23 von Include auf Unclear, Sozial-Dimension zu dünn auf reiner Empfehlungsbasis).

| idx | Lane | Titel | Basis | Vorschlag | Verifikation |
|---|---|---|---|---|---|
| 1 | ChatGPT+Claude | Ethical AI through a Feminist Lens: Challenging Power and Re | Abstract | Unclear | - |
| 2 | ChatGPT | Power Imbalances in Society and AI: On the Need to Expand th | Abstract | Unclear | - |
| 3 | ChatGPT | Beyond inclusion: feminist AI for transformative justice in  | Abstract | Include | bestätigt |
| 4 | ChatGPT | Fairness Beyond the Algorithmic Frame: Actionable Recommenda | Abstract | Unclear | - |
| 5 | ChatGPT | Verbesserung der KI-Literacy von Lehrenden im Hochschulberei | Abstract | Exclude | bestätigt |
| 6 | ClaudeCode+Claude+Gemini | Intersectional biases in narratives produced by open-ended p | Abstract | Include | bestätigt |
| 7 | ClaudeCode+Claude | A Critique of Human-Centred AI: A Plea for a Feminist AI Fra | Abstract | Unclear | - |
| 8 | ClaudeCode | The Politics of Prompt Engineering | Abstract | Unclear | - |
| 9 | ClaudeCode | Gender bias in text-to-image generative artificial intellige | Abstract | Include | bestätigt |
| 10 | ClaudeCode | AI For Whom? Participation, Power and Educational Pathways i | Abstract | Include | bestätigt |
| 11 | ClaudeCode | From salad bar feminism to denotative portraiture: How neoli | Abstract | Include | bestätigt |
| 12 | ClaudeCode+Claude | "Grillz on a hijabi": Intersectional Identities in Fostering | Abstract | Include | bestätigt |
| 13 | ClaudeCode | Algorithm beyond Neutrality: Feminist Approaches to Redefini | Abstract | Include | bestätigt |
| 14 | Claude | Black feminism and Artificial Intelligence: the possibilitie | Abstract | Include | bestätigt |
| 15 | Claude | AI Literacy and Gender Bias: Comparative Perspectives from t | Abstract | Include | bestätigt |
| 16 | Claude | AI Ethics for the Global Majority: Lessons from Decolonial F | Abstract | Include | bestätigt |
| 17 | Claude | Feminist knowledges in the age of AI | Abstract | Include | bestätigt |
| 18 | Gemini | Intersectional Fairness in Large Language Models | Recommendation | Include | bestätigt |
| 19 | Gemini | Unveiling gender bias in AI: A classroom reflection on media | Recommendation | Include | bestätigt |
| 20 | Gemini | Metacognitive AI literacy: going beyond the AI skills gap ag | Recommendation | Unclear | - |
| 21 | Gemini | Does being literate in AI make workplaces more equal? The me | Recommendation | Include | bestätigt |
| 22 | Gemini | Critical Literacy in an AI World | Recommendation | Unclear | - |
| 23 | Gemini | Safety guardrails in large language models and selective ref | Recommendation | Unclear | korrigiert auf Unclear |
| 24 | Gemini | Feminist AI: Confronting Bias, Power, and the Promise of Jus | Recommendation | Unclear | - |

Verteilung, 14 Include, 9 Unclear, 1 Exclude.

Der einzige Exclude (idx 5, KI-Literacy von Hochschullehrenden) trägt die Technik-Dimension, aber keine Kategorie der Sozial-Dimension, Ausschlussgrund Not_relevant_topic.

Nächster Schritt, menschlicher Screening-Durchgang über die 24 Kandidaten in PRISM bzw. der Excel, die fünf L5-Kandidaten bekommen ihre Zotero-Keys nach dem Import der ClaudeCode_deep-research.ris.
