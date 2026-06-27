const TIER_ORDER = ["silver", "gold", "diamond"];
const TIER_RATES = {
  silver: { silver: 100, gold: 0, diamond: 0 },
  gold: { silver: 0, gold: 100, diamond: 0 },
  diamond: { silver: 0, gold: 0, diamond: 100 },
};
const DEFAULT_TIERS = ["silver", "silver", "gold", "gold", "diamond"];
const HOST_TOKEN = process.env.HOST_TOKEN || "3EqLZZi9Jnc";

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

function defaultTier(round) {
  return DEFAULT_TIERS[Math.min(Math.max(Number(round) || 1, 1), DEFAULT_TIERS.length) - 1];
}

function createGameState() {
  return {
    gameId: createId(),
    round: 0,
    phase: "waiting",
    currentTier: "silver",
    nextTier: null,
    currentRates: TIER_RATES.silver,
    nextRates: null,
    blockedCardIds: [],
    selectedThisRound: [],
    offerSignatures: [],
  };
}

function getStore() {
  if (!globalThis.__pokerTacticsGameState) {
    globalThis.__pokerTacticsGameState = createGameState();
  }
  return globalThis.__pokerTacticsGameState;
}

function setStore(nextState) {
  globalThis.__pokerTacticsGameState = nextState;
  return nextState;
}

function parseBody(req) {
  if (!req.body) return {};
  return typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body;
}

function isHost(req, payload = {}) {
  return req.query.host === HOST_TOKEN
    || req.query.token === HOST_TOKEN
    || payload.hostToken === HOST_TOKEN
    || payload.token === HOST_TOKEN;
}

function cleanTier(value) {
  return TIER_ORDER.includes(value) ? value : null;
}

function send(res, status, payload) {
  res.status(status).json(payload);
}

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const path = Array.isArray(req.query.path) ? `/${req.query.path.join("/")}` : "/";

  if (req.method === "GET" && path === "/state") {
    const state = getStore();
    send(res, 200, { ...state, isHost: isHost(req) });
    return;
  }

  if (req.method !== "POST") {
    send(res, 404, { error: "not_found" });
    return;
  }

  const payload = parseBody(req);
  let state = getStore();

  if (path === "/host/new-game") {
    if (!isHost(req, payload)) {
      send(res, 403, { error: "forbidden" });
      return;
    }
    state = setStore(createGameState());
    send(res, 200, { ok: true, ...state });
    return;
  }

  if (path === "/host/tier") {
    if (!isHost(req, payload)) {
      send(res, 403, { error: "forbidden" });
      return;
    }
    const tier = cleanTier(payload.tier);
    if (!tier) {
      send(res, 400, { error: "invalid_tier" });
      return;
    }
    state.nextTier = tier;
    state.nextRates = TIER_RATES[tier];
    send(res, 200, { ok: true, ...state });
    return;
  }

  if (path === "/host/open") {
    if (!isHost(req, payload)) {
      send(res, 403, { error: "forbidden" });
      return;
    }
    const previousSelected = state.selectedThisRound;
    state.round += 1;
    state.phase = "open";
    const tier = state.nextTier || defaultTier(state.round);
    state.currentTier = tier;
    state.nextTier = null;
    state.currentRates = TIER_RATES[tier];
    state.nextRates = null;
    state.blockedCardIds = [...new Set(previousSelected.map((item) => item.cardId).filter(Boolean))].sort();
    state.selectedThisRound = [];
    state.offerSignatures = [];
    send(res, 200, { ok: true, ...state });
    return;
  }

  if (path === "/host/close") {
    if (!isHost(req, payload)) {
      send(res, 403, { error: "forbidden" });
      return;
    }
    state.phase = "closed";
    send(res, 200, { ok: true, ...state });
    return;
  }

  if (path === "/offer-signature") {
    const signature = String(payload.signature || "");
    const round = Number(payload.round) || 0;
    if (round !== state.round || state.phase !== "open") {
      send(res, 200, { accepted: false, reason: "round_not_open", ...state });
      return;
    }
    if (state.offerSignatures.includes(signature)) {
      send(res, 200, { accepted: false, reason: "duplicate", ...state });
      return;
    }
    if (signature) {
      state.offerSignatures.push(signature);
      state.offerSignatures = state.offerSignatures.slice(-200);
    }
    send(res, 200, { accepted: true, ...state });
    return;
  }

  if (path === "/select") {
    const cardId = String(payload.cardId || "");
    const round = Number(payload.round) || 0;
    if (round !== state.round || state.phase !== "open") {
      send(res, 200, { ok: false, reason: "round_not_open", ...state });
      return;
    }
    if (cardId) {
      state.selectedThisRound.push({
        cardId,
        playerId: String(payload.playerId || ""),
        playerName: String(payload.playerName || ""),
      });
    }
    send(res, 200, { ok: true, ...state });
    return;
  }

  send(res, 404, { error: "not_found" });
}
