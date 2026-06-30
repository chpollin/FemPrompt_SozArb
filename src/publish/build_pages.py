"""Propagate the shared site chrome (the document head, the footer on every page,
and the header on the content subpages) from one canonical source into the static
docs/ HTML files.

The Evidence Companion ships as plain static HTML with no build step. This script
is a code generator in the same spirit as the other scripts/ generators: it holds
the single source of truth for the duplicated head, header, and footer markup and
writes it into each page, so a change is made once here and propagated by
re-running `python scripts/build_pages.py`. index.html keeps its bespoke in-body
header (the view-tab buttons and the stats bar); its head and footer are shared.
"""

import re
from pathlib import Path

DOCS = Path(__file__).resolve().parents[2] / "docs"

# Fonts. The Companion pages need Inter (body) and IBM Plex Serif (display); the
# PRISM page additionally needs IBM Plex Sans and Mono for its own design system.
# Loading them here as a <link> (rather than an @import inside research.css) keeps
# the request off the CSS critical path and avoids the double load PRISM had.
FONTS_COMPANION = """<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">"""

FONTS_PRISMA = """<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Serif:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">"""

FONT_AWESOME = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">'


def favicon(letter, size):
    return (
        "<link rel=\"icon\" type=\"image/svg+xml\" href=\"data:image/svg+xml,"
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>"
        "<rect width='100' height='100' rx='12' fill='%231e3a5f'/>"
        f"<text x='50' y='68' font-size='{size}' font-family='serif' font-weight='bold' "
        f"fill='white' text-anchor='middle'>{letter}</text></svg>\">"
    )


INDEX_META = """<meta name="keywords" content="AI literacy, social work, systematic review, feminist AI, LLM assessment, epistemische Infrastruktur">
    <meta name="author" content="Christopher Pollin, Susanne Sackl-Sharif, Sabine Klinger, Christian Steiner">
    <meta name="robots" content="index, follow">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://chpollin.github.io/FemPrompt_SozArb/">
    <meta property="og:title" content="Feministische AI Literacies -- Systematischer Review">
    <meta property="og:description" content="Interaktive Evidenz zum systematischen Literature Review zu feministischen AI Literacies im Feld der Sozialen Arbeit.">"""

INDEX_SCRIPTS = """<script defer src="https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>"""


def head(title, description, *, fav, fonts, meta="", scripts="", extra_css=""):
    """Assemble a <head>. The fixed parts (charset, viewport, favicon, fonts,
    FontAwesome, research.css) are shared; title, description, and the page
    extras (SEO/OG metas, deferred libraries, prisma.css) vary."""
    parts = [
        '<meta charset="UTF-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
        f"<title>{title}</title>",
        f'<meta name="description" content="{description}">',
    ]
    if meta:
        parts.append(meta)
    parts.append(fav)
    parts.append(fonts)
    if scripts:
        parts.append(scripts)
    parts.append(FONT_AWESOME)
    parts.append('<link rel="stylesheet" href="css/research.css">')
    if extra_css:
        parts.append(extra_css)
    body = "\n    ".join(parts)
    return f"<head>\n    {body}\n</head>"


FOOTER = """<footer class="site-footer">
        <p>Teil der epistemischen Infrastruktur zu: Pollin, Sackl-Sharif, Klinger &amp; Steiner (2026).
        Deep-Research-gestuetzte Literature-Reviews. Forum Wissenschaft 2/2026.</p>
        <p class="footer-links">
            <a href="https://github.com/chpollin/FemPrompt_SozArb">Repository</a> &middot;
            <a href="downloads/vault.zip">Obsidian Vault (.zip)</a>
        </p>
    </footer>"""

NAV_LINKS = [
    ("prisma.html", "PRISM", "prisma"),
    ("about.html", "About", "about"),
    ("methoden.html", "Methoden", "methoden"),
    ("help.html", "Hilfe", "help"),
]

# Page-specific markup inside header-content below the nav row.
HEADER_EXTRA = {
    "prisma": '<div class="pt-conn-bar"><span class="pt-app-conn" id="pt-conn-status">nicht mit Repo verbunden</span></div>',
}


def subpage_header(active, extra=""):
    """The header used by the content subpages: the four views as links into the
    SPA, then the shared nav links with the current page marked active."""
    links = ""
    for href, label, key in NAV_LINKS:
        cls = "nav-link nav-link-active" if key == active else "nav-link"
        links += f'\n                    <a href="{href}" class="{cls}">{label}</a>'
    extra_block = f"\n            {extra}" if extra else ""
    return f"""<header>
        <div class="header-content">
            <div class="header-top">
                <div class="header-brand">
                    <a href="index.html" class="brand-link">
                        <h1>Feministische AI Literacies</h1>
                        <p class="subtitle">Systematischer Review -- Interaktive Evidenz</p>
                    </a>
                    <p class="header-authors">Pollin, Sackl-Sharif, Klinger &amp; Steiner (2026)</p>
                </div>
                <nav class="header-nav" aria-label="Hauptnavigation">
                    <a href="index.html#chat" class="nav-link">Wissens-Chat</a>
                    <a href="index.html#wissensnetz" class="nav-link">Wissensnetz</a>
                    <a href="index.html#vergleich" class="nav-link">Kategorien</a>
                    <a href="index.html#korpus" class="nav-link">Korpus</a>
                    <span class="nav-sep"></span>{links}
                    <span class="nav-sep"></span>
                    <a href="https://github.com/chpollin/FemPrompt_SozArb" class="nav-link nav-link-ext" target="_blank" rel="noopener"><i class="fas fa-code-branch"></i></a>
                    <a href="downloads/vault.zip" class="nav-link nav-link-ext" title="Obsidian Vault (.zip)"><i class="fas fa-download"></i></a>
                </nav>
            </div>{extra_block}
        </div>
    </header>"""


# Per page: the generated head, and the active key for the subpage header (None
# leaves the in-body header untouched, as on index.html).
PAGES = {
    "index.html": {
        "head": head(
            "Feministische AI Literacies -- Systematischer Review",
            "Interaktive Evidenz zum systematischen Literature Review zu feministischen AI Literacies im Feld der Sozialen Arbeit. Duale Bewertung durch Expert:innen und LLM.",
            fav=favicon("F", 60), fonts=FONTS_COMPANION, meta=INDEX_META, scripts=INDEX_SCRIPTS,
        ),
        "header": None,
    },
    "about.html": {
        "head": head(
            "About -- Feministische AI Literacies",
            "Ueber das Projekt: Systematischer Review zu feministischen AI Literacies im Feld der Sozialen Arbeit.",
            fav=favicon("F", 60), fonts=FONTS_COMPANION,
        ),
        "header": "about",
    },
    "help.html": {
        "head": head(
            "Hilfe -- Feministische AI Literacies",
            "Hilfe zur Benutzung der interaktiven Evidenz-Plattform.",
            fav=favicon("F", 60), fonts=FONTS_COMPANION,
        ),
        "header": "help",
    },
    "methoden.html": {
        "head": head(
            "Methoden -- Feministische AI Literacies",
            "Methodik des systematischen Reviews: Pipeline, Kategorie-System, duale Bewertung, Divergenz-Analyse.",
            fav=favicon("F", 60), fonts=FONTS_COMPANION,
        ),
        "header": "methoden",
    },
    "prisma.html": {
        "head": head(
            "PRISMA Screening Tool -- Feministische AI Literacies",
            "PRISMA-Screening-Werkzeug fuer den systematischen Review zu feministischen AI Literacies. PRISMA 2020 / PRISMA-trAIce, duale Mensch-KI-Bewertung.",
            fav=favicon("P", 52), fonts=FONTS_PRISMA,
            meta='<meta name="robots" content="noindex">',
            extra_css='<link rel="stylesheet" href="css/prisma.css">',
        ),
        "header": "prisma",
    },
}

HEAD_RE = re.compile(r"<head>.*?</head>", re.S)
HEADER_RE = re.compile(r"<header>.*?</header>", re.S)
FOOTER_RE = re.compile(r'<footer class="site-footer">.*?</footer>', re.S)


def main():
    for fname, cfg in PAGES.items():
        path = DOCS / fname
        html = path.read_text(encoding="utf-8")
        for label, pattern, replacement in (
            ("head", HEAD_RE, cfg["head"]),
            ("footer", FOOTER_RE, FOOTER),
        ):
            if not pattern.search(html):
                raise SystemExit(f"{fname}: no <{label}> region found")
            html = pattern.sub(lambda m, r=replacement: r, html, count=1)
        if cfg["header"] is not None:
            if not HEADER_RE.search(html):
                raise SystemExit(f"{fname}: no <header> found")
            block = subpage_header(cfg["header"], HEADER_EXTRA.get(cfg["header"], ""))
            html = HEADER_RE.sub(lambda m: block, html, count=1)
        path.write_text(html, encoding="utf-8")
        print(f"wrote {fname}")


if __name__ == "__main__":
    main()
