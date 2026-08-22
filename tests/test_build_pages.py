"""Tests for the generated static page frame."""

from src.publish import build_pages


def test_rendered_pages_match_committed_outputs() -> None:
    rendered = build_pages.render_pages()

    assert set(rendered) == {
        "index.html",
        "about.html",
        "help.html",
        "methoden.html",
        "onboarding.html",
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

    assert 'src="vendor/d3/d3.min.js"' in rendered["index.html"]
    assert 'href="css/literaturbild.css"' in rendered["index.html"]
