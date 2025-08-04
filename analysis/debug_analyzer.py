"""
Advanced Deterministic Debug Analyzer

Dieses Skript führt KEINE LLM-Aufrufe durch. Es analysiert alle .md-Dateien
in einem bestimmten Ordner anhand fester Kriterien und erstellt für jede
Datei einen eigenen, kompakten und informationsdichten Analyse-Log.
"""
import logging
from pathlib import Path
import re
from datetime import datetime

# --- Konfiguration ---
INPUT_DIR = Path("markdown_papers")
OUTPUT_LOG_DIR = Path("debug_logs")

# Schlüsselwörter für die Inhaltsanalyse
SENSITIVE_KEYWORDS = [
    'bias', 'discrimination', 'racism', 'sexism', 'ableism', 'colonialism',
    'inequality', 'inequalities', 'marginalised', 'marginalized', 'stereotype',
    'prejudice', 'oppression', 'fraud', 'scandal', 'xenophobic', 'fairness'
]

def setup_file_logger(log_path: Path):
    """
    Konfiguriert einen dedizierten Logger für eine einzelne Datei.
    Entfernt vorherige Handler, um saubere, getrennte Logs zu gewährleisten.
    """
    # Entfernt alle Handler vom Root-Logger, falls vorhanden
    for handler in logging.root.handlers[:]:
        logging.root.removeHandler(handler)
        
    logging.basicConfig(
        level=logging.INFO,
        format='%(message)s', # Sehr kompaktes Format, nur die Nachricht
        filename=log_path,
        filemode='w' # Überschreibt alte Logs für dieselbe Datei
    )

def analyze_file(file_path: Path) -> dict:
    """
    Führt die deterministische Analyse für eine Datei durch und gibt die Ergebnisse
    als strukturiertes Dictionary zurück.
    """
    report = {}
    content = file_path.read_text(encoding='utf-8')
    lines = content.splitlines()

    # 1. Statistische Analyse
    report['file_stats'] = {
        'characters': len(content),
        'words': len(content.split()),
        'lines': len(lines)
    }

    # 2. Strukturanalyse
    # Bugfix: .count() ist robuster als die vorherige Regex-Lösung
    image_placeholder_count = content.count('')
    report['structural_noise'] = {
        'has_yaml_frontmatter': content.strip().startswith('---'),
        'image_placeholders': image_placeholder_count,
        'table_lines': sum(1 for line in lines if '|' in line and '----' not in line)
    }

    # 3. Inhaltsanalyse
    keyword_findings = {}
    content_lower = content.lower()
    for keyword in SENSITIVE_KEYWORDS:
        count = len(re.findall(r'\b' + re.escape(keyword) + r'\b', content_lower))
        if count > 0:
            keyword_findings[keyword] = count
    
    report['content_sensitivity'] = {
        'total_triggers': sum(keyword_findings.values()),
        'trigger_details': keyword_findings if keyword_findings else "None"
    }

    # 4. Risikobewertung
    risk_score = 0
    risk_factors = []
    if report['file_stats']['characters'] > 40000:
        risk_score += 2
        risk_factors.append("hohe Zeichenanzahl (>40k)")
    if report['structural_noise']['image_placeholders'] > 10:
        risk_score += 1
        risk_factors.append("viele HTML-Kommentare")
    if report['content_sensitivity']['total_triggers'] > 50:
        risk_score += 3
        risk_factors.append("sehr hohe Dichte sensibler Schlüsselwörter (>50)")
    elif report['content_sensitivity']['total_triggers'] > 15:
        risk_score += 1
        risk_factors.append("erhöhte Dichte sensibler Schlüsselwörter (>15)")
        
    risk_level = "NIEDRIG"
    if risk_score >= 4:
        risk_level = "HOCH"
    elif risk_score >= 2:
        risk_level = "MITTEL"
        
    report['risk_assessment'] = {
        'risk_level': risk_level,
        'risk_score': risk_score,
        'risk_factors': risk_factors if risk_factors else "None"
    }

    return report


def main():
    """
    Hauptfunktion: Iteriert durch alle Markdown-Dateien und führt die Analyse durch.
    """
    OUTPUT_LOG_DIR.mkdir(exist_ok=True)
    markdown_files = list(INPUT_DIR.glob("*.md"))

    if not markdown_files:
        print(f"Keine .md-Dateien im Ordner '{INPUT_DIR}' gefunden.")
        return

    print(f"Starte deterministische Analyse für {len(markdown_files)} Datei(en)...")

    for file_path in markdown_files:
        # Erstelle einen eindeutigen Log-Dateinamen
        log_file_path = OUTPUT_LOG_DIR / f"{file_path.name}.log"
        
        # Richte den Logger für diese eine Datei ein
        setup_file_logger(log_file_path)
        
        # Führe die Analyse durch
        analysis_result = analyze_file(file_path)

        # Schreibe den kompakten Bericht in die Log-Datei
        logging.info(f"# Deterministischer Risiko-Bericht für: {file_path.name}")
        logging.info(f"# Analyse-Datum: {datetime.now().isoformat()}")
        logging.info("---")
        
        for section, data in analysis_result.items():
            logging.info(f"{section}:")
            for key, value in data.items():
                if isinstance(value, dict):
                    logging.info(f"  {key}:")
                    for sub_key, sub_value in value.items():
                        logging.info(f"    {sub_key}: {sub_value}")
                else:
                    logging.info(f"  {key}: {value}")
            logging.info("") # Leerzeile für Lesbarkeit

        print(f"Analyse für '{file_path.name}' abgeschlossen. Log gespeichert in '{log_file_path}'")

    print("\nAlle Analysen abgeschlossen.")


if __name__ == "__main__":
    main()