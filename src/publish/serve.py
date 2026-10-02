"""Serve the existing result site and PRISM locally without a separate review UI.

The server runs inside the clone, so it also writes the reviewer files of PRISM. A
reviewer then never picks a folder or grants the browser write access. The write
endpoint is the only way this process changes a file. It accepts nothing but a valid
human reviewer file of a key in the assignment, sent by a page of this server.
"""
from __future__ import annotations

import argparse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import mimetypes
import os
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[2]
SCREENING = Path("docs/data/screening")
API = "/__prism/"
KEY_PATTERN = re.compile(r"^[a-z][a-z0-9_-]{1,11}$")
REVIEWER_SCHEMA = re.compile(r"^femprompt-prisma-reviewer/0\.[1-5]$")
# Far above any human reviewer file; the agent track, the largest file in the folder,
# is never written through this endpoint.
MAX_BODY = 20 * 1024 * 1024


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


def assigned_reviewers(repo: Path) -> list[str]:
    try:
        data = json.loads((repo / SCREENING / "assignment.json").read_text(encoding="utf-8"))
        return [r["key"] for r in data.get("reviewers", []) if KEY_PATTERN.match(str(r.get("key", "")))]
    except (OSError, ValueError, TypeError, KeyError):
        return []


def clone_info(repo: Path) -> dict:
    return {"name": repo.name, "path": str(repo), "reviewers": assigned_reviewers(repo)}


def screening_files(repo: Path) -> list[str]:
    folder = repo / SCREENING
    return sorted(p.name for p in folder.glob("*.json") if p.is_file()) if folder.is_dir() else []


def reviewer_write_problem(repo: Path, name: str, body: bytes) -> str | None:
    """Return a German message for the reviewer when the write is refused, else None."""
    key = name.removesuffix(".json")
    if not name.endswith(".json") or not KEY_PATTERN.match(key):
        return "Ungültiger Dateiname."
    reviewers = assigned_reviewers(repo)
    if key not in reviewers:
        return f"Das Kürzel {key} ist nicht zugeteilt. Zugeteilt sind: {', '.join(reviewers) or 'niemand'}."
    if len(body) > MAX_BODY:
        return "Die Datei ist zu groß."
    try:
        payload = json.loads(body.decode("utf-8"))
    except (UnicodeDecodeError, ValueError):
        return "Die Datei ist kein gültiges JSON."
    if not isinstance(payload, dict) or not REVIEWER_SCHEMA.match(str(payload.get("schema", ""))):
        return "Unbekanntes Reviewer-Schema."
    if payload.get("reviewer") != key:
        return "Kürzel in der Datei und Dateiname stimmen nicht überein."
    if payload.get("actor") == "agent":
        return "Agentenspuren werden nicht über PRISM geschrieben."
    if not isinstance(payload.get("decisions"), dict):
        return "Feld decisions fehlt."
    return None


def write_reviewer_file(repo: Path, name: str, body: bytes) -> None:
    folder = repo / SCREENING
    folder.mkdir(parents=True, exist_ok=True)
    target = folder / name
    temp = folder / f".{name}.tmp"
    temp.write_bytes(body)
    os.replace(temp, target)


class ExclusiveServer(ThreadingHTTPServer):
    # HTTPServer sets SO_REUSEADDR, which on Windows lets a second server bind a port
    # that is already in use, so two clones would answer on one address at random.
    allow_reuse_address = False


class Handler(BaseHTTPRequestHandler):
    repo = ROOT

    def send_body(self, status: int, content: bytes, kind: str) -> None:
        self.send_response(status)
        self.send_header("Content-Type", kind)
        self.send_header("Content-Length", str(len(content)))
        self.send_header("Cache-Control", "no-cache")
        self.send_header("X-Content-Type-Options", "nosniff")
        # lets PRISM detect this server without probing an endpoint other servers lack
        self.send_header("X-Prism-Clone", "1")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(content)

    def send_json(self, status: int, value) -> None:
        self.send_body(status, json.dumps(value, ensure_ascii=False).encode("utf-8"), "application/json; charset=utf-8")

    def send_text(self, status: int, message: str) -> None:
        self.send_body(status, message.encode("utf-8"), "text/plain; charset=utf-8")

    def own_page_request(self) -> bool:
        # Any website open in the same browser can send requests to 127.0.0.1. Only a
        # page of this server may write: the Host must be the loopback address the server
        # listens on (no DNS rebinding) and the Origin must be that same address.
        host = self.headers.get("Host", "")
        port = self.server.server_address[1]
        if host not in (f"127.0.0.1:{port}", f"localhost:{port}"):
            return False
        return self.headers.get("Origin") == f"http://{host}"

    def do_GET(self):
        path = urlsplit(self.path).path
        if path.startswith("/review/"):
            self.send_response(302)
            self.send_header("Location", "/index.html")
            self.end_headers()
            return
        if path == API + "clone":
            self.send_json(200, clone_info(self.repo))
            return
        if path == API + "screening/":
            self.send_json(200, screening_files(self.repo))
            return
        if path.startswith(API + "screening/"):
            name = unquote(path.removeprefix(API + "screening/"))
            target = self.repo / SCREENING / name
            if "/" in name or "\\" in name or not name.endswith(".json") or not target.is_file():
                self.send_text(404, "Nicht vorhanden.")
                return
            self.send_body(200, target.read_bytes(), "application/json; charset=utf-8")
            return
        target = resolve_target(self.repo, self.path)
        if target is None:
            self.send_error(404)
            return
        content = target.read_bytes()
        kind = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
        self.send_body(200, content, kind + ("; charset=utf-8" if kind.startswith("text/") or kind == "application/json" else ""))

    def do_HEAD(self):
        self.do_GET()

    def do_PUT(self):
        path = urlsplit(self.path).path
        if not path.startswith(API + "screening/"):
            self.send_text(404, "Nicht vorhanden.")
            return
        if not self.own_page_request():
            self.send_text(403, "Nur PRISM auf diesem Server darf schreiben.")
            return
        if not self.headers.get("Content-Type", "").startswith("application/json"):
            self.send_text(415, "Erwartet JSON.")
            return
        try:
            length = int(self.headers.get("Content-Length", ""))
        except ValueError:
            self.send_text(411, "Länge fehlt.")
            return
        if length > MAX_BODY:
            self.send_text(413, "Die Datei ist zu groß.")
            return
        name = unquote(path.removeprefix(API + "screening/"))
        body = self.rfile.read(length)
        problem = reviewer_write_problem(self.repo, name, body)
        if problem:
            self.send_text(400, problem)
            return
        try:
            write_reviewer_file(self.repo, name, body)
        except OSError as error:
            self.send_text(500, f"Schreiben fehlgeschlagen: {error.strerror or error}.")
            return
        self.send_json(200, {"written": (SCREENING / name).as_posix()})


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8870)
    args = parser.parse_args(argv)
    if not (ROOT / "docs/index.html").is_file():
        parser.error("Missing project website: docs/index.html.")
    print(f"Project: http://127.0.0.1:{args.port}/index.html", flush=True)
    print(f"PRISM: http://127.0.0.1:{args.port}/prisma.html", flush=True)
    print(f"Optional generated export: http://127.0.0.1:{args.port}/results/index.html", flush=True)
    print(f"Reviewer files are written to {ROOT / SCREENING}", flush=True)
    try:
        server = ExclusiveServer(("127.0.0.1", args.port), Handler)
    except OSError:
        parser.error(f"Port {args.port} is in use. Stop the other server or pass --port.")
    server.serve_forever()


if __name__ == "__main__":
    main()
