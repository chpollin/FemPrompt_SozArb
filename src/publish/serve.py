"""Serve the existing result site and PRISM locally without a separate review UI."""
from __future__ import annotations

import argparse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import mimetypes
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[2]


def resolve_target(repo: Path, url: str) -> Path | None:
    path = unquote(urlsplit(url).path)
    if path.startswith("/results/"):
        root, relative = repo / "build/site", path.removeprefix("/results/")
    elif path.startswith("/prism/"):
        root, relative = repo / "docs", path.removeprefix("/prism/")
    else:
        root, relative = repo / "docs", path.removeprefix("/")
    target = (root / (relative or "index.html")).resolve()
    if not target.is_relative_to(root.resolve()) or not target.is_file():
        return None
    return target


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if urlsplit(self.path).path.startswith("/review/"):
            self.send_response(302)
            self.send_header("Location", "/index.html")
            self.end_headers()
            return
        target = resolve_target(ROOT, self.path)
        if target is None:
            self.send_error(404)
            return
        content = target.read_bytes()
        kind = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
        self.send_response(200)
        self.send_header("Content-Type", kind + ("; charset=utf-8" if kind.startswith("text/") or kind == "application/json" else ""))
        self.send_header("Content-Length", str(len(content)))
        self.send_header("Cache-Control", "no-cache")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(content)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8870)
    args = parser.parse_args(argv)
    if not (ROOT / "docs/index.html").is_file():
        parser.error("Missing project website: docs/index.html.")
    print(f"Project: http://127.0.0.1:{args.port}/index.html", flush=True)
    print(f"PRISM: http://127.0.0.1:{args.port}/prisma.html", flush=True)
    print(f"Optional generated export: http://127.0.0.1:{args.port}/results/index.html", flush=True)
    ThreadingHTTPServer(("127.0.0.1", args.port), Handler).serve_forever()


if __name__ == "__main__":
    main()
