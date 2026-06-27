#!/usr/bin/env python3
import json
import os
import secrets
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

HOST = "0.0.0.0"
PORT = int(os.environ.get("PORT", "4173"))
HOST_TOKEN = os.environ.get("HOST_TOKEN") or secrets.token_urlsafe(8)

TIER_ORDER = ("silver", "gold", "diamond")
TIER_RATES = {
    "silver": {"silver": 100, "gold": 0, "diamond": 0},
    "gold": {"silver": 0, "gold": 100, "diamond": 0},
    "diamond": {"silver": 0, "gold": 0, "diamond": 100},
}
DEFAULT_TIERS = ("silver", "silver", "gold", "gold", "diamond")

def new_game_state():
    return {
        "gameId": secrets.token_urlsafe(6),
        "round": 0,
        "phase": "waiting",
        "currentTier": "silver",
        "nextTier": None,
        "currentRates": TIER_RATES["silver"],
        "nextRates": None,
        "blockedCardIds": [],
        "selectedThisRound": [],
        "offerSignatures": [],
    }


game_state = new_game_state()


def default_tier(round_number):
    index = min(max(round_number, 1), len(DEFAULT_TIERS)) - 1
    return DEFAULT_TIERS[index]


def is_host(handler, payload=None):
    query = parse_qs(urlparse(handler.path).query)
    token = query.get("host", query.get("token", [""]))[0]
    if payload and not token:
        token = payload.get("hostToken", "") or payload.get("token", "")
    return token == HOST_TOKEN


def read_json(handler):
    length = int(handler.headers.get("Content-Length", "0"))
    if length <= 0:
        return {}
    raw = handler.rfile.read(length).decode("utf-8")
    return json.loads(raw or "{}")


def clean_tier(value):
    tier = str(value or "")
    return tier if tier in TIER_ORDER else None


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_json(self, payload, status=200):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.startswith("/api/state"):
            self.send_json({
                **game_state,
                "isHost": is_host(self),
            })
            return
        super().do_GET()

    def do_POST(self):
        global game_state
        payload = read_json(self)

        if self.path.startswith("/api/host/new-game"):
            if not is_host(self, payload):
                self.send_json({"error": "forbidden"}, 403)
                return
            game_state = new_game_state()
            self.send_json({"ok": True, **game_state})
            return

        if self.path.startswith("/api/host/tier"):
            if not is_host(self, payload):
                self.send_json({"error": "forbidden"}, 403)
                return
            tier = clean_tier(payload.get("tier"))
            if not tier:
                self.send_json({"error": "invalid_tier"}, 400)
                return
            game_state["nextTier"] = tier
            game_state["nextRates"] = TIER_RATES[tier]
            self.send_json({"ok": True, **game_state})
            return

        if self.path.startswith("/api/host/open"):
            if not is_host(self, payload):
                self.send_json({"error": "forbidden"}, 403)
                return
            previous_selected = game_state["selectedThisRound"]
            game_state["round"] += 1
            game_state["phase"] = "open"
            tier = game_state["nextTier"] or default_tier(game_state["round"])
            game_state["currentTier"] = tier
            game_state["nextTier"] = None
            game_state["currentRates"] = TIER_RATES[tier]
            game_state["nextRates"] = None
            game_state["blockedCardIds"] = sorted({item["cardId"] for item in previous_selected if item.get("cardId")})
            game_state["selectedThisRound"] = []
            game_state["offerSignatures"] = []
            self.send_json({"ok": True, **game_state})
            return

        if self.path.startswith("/api/host/close"):
            if not is_host(self, payload):
                self.send_json({"error": "forbidden"}, 403)
                return
            game_state["phase"] = "closed"
            self.send_json({"ok": True, **game_state})
            return

        if self.path.startswith("/api/offer-signature"):
            signature = str(payload.get("signature", ""))
            round_number = int(payload.get("round", 0) or 0)
            if round_number != game_state["round"] or game_state["phase"] != "open":
                self.send_json({"accepted": False, "reason": "round_not_open", **game_state})
                return
            if signature in game_state["offerSignatures"]:
                self.send_json({"accepted": False, "reason": "duplicate", **game_state})
                return
            if signature:
                game_state["offerSignatures"].append(signature)
                game_state["offerSignatures"] = game_state["offerSignatures"][-200:]
            self.send_json({"accepted": True, **game_state})
            return

        if self.path.startswith("/api/select"):
            card_id = str(payload.get("cardId", ""))
            player_id = str(payload.get("playerId", ""))
            player_name = str(payload.get("playerName", ""))
            round_number = int(payload.get("round", 0) or 0)
            if round_number != game_state["round"] or game_state["phase"] != "open":
                self.send_json({"ok": False, "reason": "round_not_open", **game_state})
                return
            if card_id:
                game_state["selectedThisRound"].append({
                    "cardId": card_id,
                    "playerId": player_id,
                    "playerName": player_name,
                })
            self.send_json({"ok": True, **game_state})
            return

        self.send_json({"error": "not_found"}, 404)


def local_ip():
    import socket

    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
            sock.connect(("8.8.8.8", 80))
            return sock.getsockname()[0]
    except OSError:
        return "localhost"


if __name__ == "__main__":
    ip = local_ip()
    print(f"Player URL: http://{ip}:{PORT}/")
    print(f"Host URL:   http://{ip}:{PORT}/?host={HOST_TOKEN}")
    print("Keep this process running while playing.")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
