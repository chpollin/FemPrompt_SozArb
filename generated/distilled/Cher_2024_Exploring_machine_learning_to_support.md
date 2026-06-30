---
title: "Exploring Machine Learning to Support Decision-Making for Placement Stabilization and Preservation in Child Welfare"
authors: ["Ka Ho Brian Chor", "Zhidi Luo", "Kit T. Rodolfa", "Rayid Ghani"]
year: 2024
type: journalArticle
language: en
processed: 2026-02-05
source_file: Cher_2024_Exploring_machine_learning_to_support.md
confidence: 75
---

# Exploring Machine Learning to Support Decision-Making for Placement Stabilization and Preservation in Child Welfare

## Kernbefund

Random-Forest-Modelle erreichten eine 10-fach höhere Präzision als Baseline und identifizierten zuverlässig Jugendliche mit hohem Risiko für Platzierungszerfall, während alle Modelle auf Fairness und Equity überprüft wurden.

## Forschungsfrage

Können Machine-Learning-Modelle Caseworkern bei der Früherkennung von Jugendlichen mit Risiko für Platzierungszerfall helfen, um proaktive Stabilisierungs- und Erhaltungsdienste in der Jugendhilfe bereitzustellen?

## Methodik

Empirisch - vergleichende Validierungsstudie von Machine-Learning-Modellen (Random Forest, regularisierte und unregularisierte logistische Regression, Decision Trees) gegen konventionelle Regressionsmodelle mit Zeitreihenvalidierung und Fairness-Audits
**Datenbasis:** Administrativ-klinische Daten von 12.621 Jugendlichen in einem großen Midwestern-Bundesstaat zwischen Januar 2017 und Januar 2020, mit 8 Validierungszeitpunkten über 21 Monate

## Hauptargumente

- Machine Learning kann empirische Entscheidungsunterstützung für Caseworker bieten, um Jugendliche mit Risiko für Platzierungszerfall frühzeitig zu identifizieren und proaktive Stabilisierungsdienste bereitstellen zu können, anstatt reaktiv zu handeln.
- Random-Forest-Modelle mit erweiterten Prädiktorsets übertreffen konventionelle logistische Regressionsmodelle bei der Vorhersage von Platzierungsbedarf und können begrenzte Ressourcen effizienter auf Jugendliche mit höchstem Bedarf konzentrieren.
- Fairness und Equity müssen zentral in die Modellentwicklung und -evaluierung integriert werden, um sicherzustellen, dass predictive analytics in der Jugendhilfe nicht zu disparaten Auswirkungen auf Jugendliche verschiedener Rassen/Ethnien führen.

## Kategorie-Evidenz

### Evidenz 1

Caseworkers benötigen Verständnis und Fähigkeiten für datengestützte Entscheidungsfindung: 'caseworkers can benefit from upstream, empirical decision support' und 'administrative burdens to care for in-care youth are substantial because understaffed and underfunded caseworkers have large caseloads but limited time to make objective and quality decisions'

### Evidenz 2

Umfassende Anwendung von Predictive Analytics und Machine Learning: 'we developed and validated a wide grid of ML models -random forest, regularized logistic regression, decision tree, dummy classifier -and a conventional unregularized logistic regression model' und 'Machine Learning (ML) consists of a family of methods that 'learn' from complex data over time and detect underlying or unobserved patterns'

### Evidenz 3

Direkter Fokus auf Jugendhilfe-Praxis und Casework: 'placement stabilization and preservation program', 'caseworker decision-making', 'multidisciplinary team planning', 'caseworkers could refer youth to a placement stabilization and preservation program'

### Evidenz 4

Explizite Thematisierung von Bias und diskriminierenden Effekten: 'concerns about interpretability (e.g., ML 'black box'), errors (e.g., How often a predictive model identifies true positives of severe harm?), and bias (e.g., against protected classes) that ultimately could impact youth in the child welfare system' und Untersuchung von 'caseworkers' differential program referral behavior depending on youth's race'

### Evidenz 5

Fairness-Audit nach Rasse und Geschlecht sowie Berücksichtigung marginalisierter Gruppen: 'We examined TPR by youth's attribute (e.g., race, gender) to quantify potential disparities between subgroups (e.g., Black youth vs. White youth) within and across the predictive models' und Fokus auf 'equitably serve diverse youth'

### Evidenz 6

Zentrale Evaluierung von algorithmischer Fairness und Equity: 'Understanding the appropriate ways to measure model fairness in context reflects stakeholder and societal values', 'we evaluated and audited fairness among the predictive models', 'TPR meant among all youth with a given attribute who were referred to the program' und Fokus auf 'equality of opportunity'

## Assessment-Relevanz

**Domain Fit:** Sehr relevant für die Schnittstelle KI und Soziale Arbeit: Das Paper adressiert konkret den Einsatz von Machine Learning in der Jugendhilfe-Praxis und thematisiert dabei zentrale ethische Fragen wie Fairness, Bias und Equity gegenüber marginalisierten Gruppen.

**Unique Contribution:** Das Paper leistet einen methodischen Beitrag durch systematische Modellvergleiche und Fairness-Audits nach Rasse und Geschlecht sowie durch konzeptuelle Integration von ML zur Unterstützung von Präventionsentscheidungen in der Jugendhilfe statt nur Risiko-Screening.

**Limitations:** Das Paper konzentriert sich auf einen einzigen Bundesstaat, nicht alle Fairness-Dimensionen werden tiefgreifend untersucht, und die Auswirkungen von Modellempfehlungen auf tatsächliche Caseworker-Entscheidungen werden nicht empirisch gemessen.

**Target Group:** Jugendhilfe-Fachkräfte, Policymaker in child welfare agencies, KI-Entwickler:innen im Public-Interest-Bereich, Forscher:innen im Bereich Soziale Arbeit und Algorithmen-Ethik, Family-First-Prevention-Services-Act-Implementierer

## Schlüsselreferenzen

- [[Chor_K_H_B_McClelland_G_M_Weiner_D_A_Jordan_N_Lyons_J_S_2015]] - Out-of-home placement decision-making and outcomes in child welfare
- [[Chouldechova_A_PutnamHornstein_E_BenavidesPrado_D_Fialko_O_Vaithianathan_R_2018]] - A case study of algorithm-assisted decision making in child maltreatment hotline screening decisions
- [[Drake_B_JonsonReid_M_Ocampo_M_G_Morrison_M_Dvalishvili_D_2020]] - A practical framework for considering the use of predictive risk modeling in child welfare
- [[Hall_S_F_Sage_M_Scott_C_F_Joseph_K_2023]] - A systematic review of sophisticated predictive and prescriptive analytics in child welfare: Accuracy, equity, and bias
- [[Keddell_E_2019]] - Algorithmic justice in child protection: Statistical fairness, social justice and the implications for practice
- [[Rodolfa_K_T_Saleiros_P_Ghani_R_2020]] - Machine Learning
- [[Saxena_D_BadilloUrquiola_K_A_Wisniewski_P_Guha_S_2020]] - A human-centered review of algorithms used within the U.S. child welfare system
- [[Schwartz_I_M_York_P_NowakowskiSims_E_RamosHernandez_A_2017]] - Predictive and prescriptive analytics, machine learning and child welfare risk assessment
- [[Chor_K_H_B_Luo_Z_Dworsky_A_Raman_R_Courtney_M_E_Epstein_R_A_2022]] - Development and validation of a predictive risk model for runaway among youth in child welfare
- [[Hardt_M_Price_E_Srebro_N_2016]] - Equality of opportunity in supervised learning
