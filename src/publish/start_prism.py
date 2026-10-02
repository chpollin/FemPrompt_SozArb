"""Start PRISM for a reviewer: build the reading layer, serve the clone, open the browser.

The full `npm run build` is the operator's integration step. It regenerates tracked
outputs from every reviewer file, so a reviewer who ran it after a save would see a dozen
changed files in GitHub Desktop. This entry builds only the git-ignored reading layer,
which changes nothing tracked, and needs Python alone.

Run: python -X utf8 -m src.publish.start_prism   (or double-click start-prism.cmd)
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys
from urllib.request import urlopen
import webbrowser

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from src.publish.build_project import _run  # noqa: E402
from src.publish.serve import ExclusiveServer, Handler  # noqa: E402

READING_LAYER = (
    ("src.publish.generate_docs_data", "--prepare-fulltext"),
    ("src.publish.build_fulltext",),
    ("src.publish.generate_docs_data",),
)


class QuietHandler(Handler):
    # the reviewer's window shows the address and errors, not a line per request
    def log_message(self, format, *args):
        pass


def build_reading_layer() -> None:
    for module, *args in READING_LAYER:
        _run(module, *args)


def running_clone(port: int) -> dict | None:
    """The clone a PRISM server on this port serves, or None if the port holds no PRISM."""
    try:
        with urlopen(f"http://127.0.0.1:{port}/__prism/clone", timeout=2) as response:
            return json.loads(response.read().decode("utf-8"))
    except (OSError, ValueError):
        return None


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8870)
    parser.add_argument("--no-browser", action="store_true")
    args = parser.parse_args(argv)
    url = f"http://127.0.0.1:{args.port}/prisma.html?verify=1"
    # a second double-click opens the running PRISM instead of rebuilding under it
    already = running_clone(args.port)
    if already and already.get("path") == str(ROOT):
        print(f"PRISM läuft bereits: {url}", flush=True)
        if not args.no_browser:
            webbrowser.open(url)
        return 0
    print("Lesefassung wird gebaut ...", flush=True)
    try:
        build_reading_layer()
    except RuntimeError as error:
        missing = "ModuleNotFoundError" in str(error)
        hint = "\nFehlt ein Modul, einmal ausführen: python -m pip install -r requirements-build.txt" if missing else ""
        print(f"\nDie Lesefassung konnte nicht gebaut werden.\n{error}{hint}", file=sys.stderr)
        return 1
    try:
        server = ExclusiveServer(("127.0.0.1", args.port), QuietHandler)
    except OSError:
        other = running_clone(args.port)
        if other and other.get("path") == str(ROOT):
            print(f"PRISM läuft bereits: {url}", flush=True)
            if not args.no_browser:
                webbrowser.open(url)
            return 0
        where = f" für {other['path']}" if other else ""
        print(f"\nPort {args.port} ist belegt{where}. Das andere Fenster schließen und erneut starten.", file=sys.stderr)
        return 1
    print(f"\nPRISM läuft: {url}\nBewertungen werden in {ROOT / 'docs/data/screening'} gespeichert.", flush=True)
    print("Dieses Fenster offen lassen, solange du arbeitest. Beenden mit Strg+C.", flush=True)
    if not args.no_browser:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
