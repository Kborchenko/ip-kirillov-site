"""Loopback-only synthetic candidate receiver. Run from the project root."""
import argparse
import json
import re
import sqlite3
import threading
import time
import uuid
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STATIC = ROOT / "demo/site"
SETTINGS = json.loads((ROOT / "demo/settings.json").read_text(encoding="utf-8"))
DIRECTIONS = {
    "Клиентская поддержка и контактные центры", "Продажи и работа с клиентами",
    "Розничная торговля", "Интернет-магазины и работа с заказами", "Офис и документооборот",
    "Склад и логистика", "Пока выбираю",
}


def checked(data):
    if not isinstance(data, dict):
        raise ValueError()
    cleaned = {}
    for key, limit in (("name", 80), ("kind", 5), ("contact", 254), ("direction", 100),
                       ("comment", 500), ("consentVersion", 120), ("requestId", 36)):
        value = data.get(key, "" if key == "comment" else None)
        if not isinstance(value, str) or len(value) > limit:
            raise ValueError()
        cleaned[key] = value.strip()
    if not cleaned["name"] or cleaned["direction"] not in DIRECTIONS or data.get("consent") is not True:
        raise ValueError()
    if cleaned["consentVersion"] != SETTINGS["consentVersion"]:
        raise ValueError()
    key = uuid.UUID(cleaned.pop("requestId"))
    if key.version != 4:
        raise ValueError()
    kind, contact = cleaned["kind"], cleaned["contact"]
    if kind == "phone":
        if not re.fullmatch(r"\+?[0-9 ()-]+", contact) or not 7 <= len(re.sub(r"\D", "", contact)) <= 15:
            raise ValueError()
    elif kind != "email" or not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", contact):
        raise ValueError()
    cleaned["consent"] = True
    return str(key), json.dumps(cleaned, ensure_ascii=False, sort_keys=True)


class Receiver(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC), **kwargs)

    def log_message(self, *args):
        pass

    def list_directory(self, path):
        self.send_error(404)
        return None

    def reply(self, code, accepted=False):
        body = json.dumps({"accepted": accepted}).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        if self.path != "/api/candidates":
            return self.reply(404)
        if self.headers.get_content_type() != "application/json":
            return self.reply(415)
        origin = self.headers.get("Origin")
        if origin and origin not in self.server.origins:
            return self.reply(403)
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if not 0 < length <= 8192:
                return self.reply(413)
            key, payload = checked(json.loads(self.rfile.read(length)))
        except (ValueError, TypeError, RecursionError):
            return self.reply(422)
        with self.server.lock:
            fail = self.server.fail_once
            self.server.fail_once = False
        if self.server.delay:
            time.sleep(self.server.delay)
        if fail:
            return self.reply(503)
        try:
            with sqlite3.connect(self.server.database) as db:
                db.execute("INSERT OR IGNORE INTO candidates(request_id, payload) VALUES (?,?)", (key, payload))
                existing = db.execute("SELECT payload FROM candidates WHERE request_id=?", (key,)).fetchone()[0]
            if existing != payload:
                return self.reply(409)
        except sqlite3.Error:
            return self.reply(503)
        self.reply(200, True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=4327)
    parser.add_argument("--db", type=Path, default=ROOT / ".astro/demo-data/candidates.sqlite3")
    parser.add_argument("--fail-once", action="store_true")
    parser.add_argument("--delay-ms", type=int, default=0)
    options = parser.parse_args()
    if not (STATIC / "index.html").is_file():
        parser.error("Build the demo first: node demo/build.mjs")
    database = options.db.resolve()
    if database.is_relative_to(STATIC.resolve()) or database.is_relative_to((ROOT / "dist").resolve()):
        parser.error("The database must be outside both web roots")
    database.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(database) as db:
        db.execute("CREATE TABLE IF NOT EXISTS candidates (request_id TEXT PRIMARY KEY, payload TEXT NOT NULL)")
    with ThreadingHTTPServer(("127.0.0.1", options.port), Receiver) as server:
        server.origins = {f"http://127.0.0.1:{options.port}", f"http://localhost:{options.port}"}
        server.database = database
        server.fail_once = options.fail_once
        server.delay = max(0, options.delay_ms) / 1000
        server.lock = threading.Lock()
        print(f"Local synthetic demo: http://127.0.0.1:{options.port}/", flush=True)
        server.serve_forever()


if __name__ == "__main__":
    main()
