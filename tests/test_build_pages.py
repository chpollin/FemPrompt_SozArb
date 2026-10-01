"""Tests for the generated static page frame."""

from src.publish import build_pages


def test_rendered_pages_match_committed_outputs() -> None:
    rendered = build_pages.render_pages()

    assert set(rendered) == {
        "index.html",
        "about.html",
        "help.html",
        "methoden.html",
        "prisma.html",
    }
    for filename, html in rendered.items():
        actual = (build_pages.DOCS / filename).read_text(encoding="utf-8")
        assert html == actual


def test_public_pages_use_local_runtime_assets() -> None:
    rendered = build_pages.render_pages()
    external_runtime_markers = (
        "fonts.googleapis.com",
        "fonts.gstatic.com",
        "cdn.jsdelivr.net",
        "cdnjs.cloudflare.com",
        "unpkg.com",
    )

    for filename, html in rendered.items():
        assert 'href="css/tokens.css"' in html, filename
        assert 'href="vendor/fontawesome/css/all.min.css"' in html, filename
        assert all(marker not in html for marker in external_runtime_markers), filename

    assert 'src="vendor/d3/d3.min.js"' not in rendered["index.html"]
    assert 'href="css/release.css"' in rendered["index.html"]
    assert 'href="css/release-netz.css"' in rendered["index.html"]


def test_every_nav_item_carries_a_tooltip() -> None:
    """Each page loads the nav tooltips, and every item of its header navigation names
    a key that docs/js/nav-tips.js defines."""
    import re

    script = (build_pages.DOCS / "js" / "nav-tips.js").read_text(encoding="utf-8")
    defined = set(re.findall(r"^\s{8}(\w+): '", script, re.M))
    for filename, html in build_pages.render_pages().items():
        assert '<script defer src="js/nav-tips.js"></script>' in html, filename
        nav = re.search(r'<nav class="header-nav".*?</nav>', html, re.S)
        assert nav, filename
        items = re.findall(r"<(?:a|button)\b[^>]*>", nav.group(0))
        assert not any('href="onboarding.html"' in item for item in items), filename
        assert len(items) == 11, filename
        for item in items:
            key = re.search(r'data-tip-key="([^"]+)"', item)
            assert key and key.group(1) in defined, (filename, item)
