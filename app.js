const STORAGE_KEY = "poker-tactics-player-v1";
const CARD_LIBRARY_VERSION = 2;

const tierOrder = ["silver", "gold", "diamond"];

const tierInfo = {
  silver: {
    label: "Bạc",
    className: "silver",
    bgClass: "silver-bg",
    suit: "♠",
    dot: "#b9c1c6",
  },
  gold: {
    label: "Vàng",
    className: "gold",
    bgClass: "gold-bg",
    suit: "♥",
    dot: "#d9a941",
  },
  diamond: {
    label: "Kim cương",
    className: "diamond",
    bgClass: "diamond-bg",
    suit: "♦",
    dot: "#59bfd2",
  },
};

const roundRates = [
  { silver: 100, gold: 0, diamond: 0 },
  { silver: 90, gold: 10, diamond: 0 },
  { silver: 75, gold: 25, diamond: 0 },
  { silver: 60, gold: 40, diamond: 0 },
  { silver: 45, gold: 55, diamond: 0 },
  { silver: 35, gold: 50, diamond: 15 },
  { silver: 25, gold: 50, diamond: 25 },
  { silver: 15, gold: 45, diamond: 40 },
];

function upgrade(id, tier, name, tag, text, copies) {
  const defaultCopies = tier === "diamond" ? 2 : tier === "gold" ? 4 : 6;
  return {
    id,
    tier,
    name,
    tag,
    copies: copies || defaultCopies,
    text,
  };
}

const defaultCards = [
  upgrade("silver-small-investor", "silver", "Nhà Đầu Tư Nhỏ", "Economy", "Nhận ngay +3đ."),
  upgrade("silver-small-interest", "silver", "Lãi Nhỏ", "Economy", "Nếu thua vòng này, nhận +1đ cuối vòng."),
  upgrade("silver-compound-light", "silver", "Lãi Kép Nhẹ", "Economy", "Nếu vòng này bạn không all-in, nhận thêm +1đ."),
  upgrade("silver-emergency-fund", "silver", "Quỹ Dự Phòng", "Comeback", "Khi còn dưới 10đ, nhận thêm +2đ cuối vòng."),
  upgrade("silver-hold-money", "silver", "Giữ Tiền Là Thắng", "Economy", "Nếu kết thúc vòng có ít nhất 30đ, nhận thêm +2đ."),
  upgrade("silver-no-overspend", "silver", "Không Tiêu Hoang", "Economy", "Nếu tổng bet vòng này không vượt quá 5đ, nhận +2đ."),
  upgrade("silver-soft-call", "silver", "Bet Mềm", "Bet", "Lần call đầu tiên mỗi vòng giảm chi phí 1đ."),
  upgrade("silver-first-strike", "silver", "Đòn Phủ Đầu", "Bet", "Nếu là người bet đầu tiên, bet đầu tiên được giảm 1đ."),
  upgrade("silver-back-door", "silver", "Cửa Sau", "Bet", "Một lần mỗi vòng, sau khi fold được giữ lại 1đ từ số đã bet."),
  upgrade("silver-fold-value", "silver", "Fold Có Lãi", "Bet", "Nếu fold trước showdown, nhận +1đ."),
  upgrade("silver-bad-hand-insurance", "silver", "Bảo Hiểm Bài Xấu", "Bài", "Nếu bài cuối thuộc nhóm yếu nhất bàn, nhận +2đ."),
  upgrade("silver-range-note", "silver", "Ghi Chú Range", "Thông tin", "Theo dõi range một đối thủ trong vòng hiện tại."),
  upgrade("silver-table-tempo", "silver", "Tempo Bàn", "Thông tin", "Sau mỗi vòng, ghi lại người chơi chủ động nhất; nếu thắng họ, nhận +1đ."),
  upgrade("silver-bottom-floor", "silver", "Dưới Đáy Vực", "Comeback", "Nếu đang ít tiền nhất bàn, nhận thêm +3đ."),
  upgrade("silver-chaser", "silver", "Kẻ Bám Đuổi", "Comeback", "Nếu thua vòng này và không top 1 tiền, nhận +2đ."),
  upgrade("silver-last-chip", "silver", "Một Đồng Cũng Chơi", "Comeback", "Khi còn dưới 8đ, lần all-in tiếp theo cộng +2đ vào pot giả lập."),
  upgrade("silver-table-talk", "silver", "Mồm Mép", "Chaos", "Mỗi vòng 1 lần, bluff khiến ít nhất 1 người fold thì nhận +1đ."),
  upgrade("silver-temporary-friend", "silver", "Bạn Thân Tạm Thời", "Chaos", "Chọn 1 người; nếu cả hai cùng sống hết vòng, cả hai nhận +1đ."),
  upgrade("silver-lucky-roll", "silver", "Cầu May", "Chaos", "Tung xúc xắc: 1-2 mất 1đ, 3-4 nhận 1đ, 5-6 nhận 3đ."),
  upgrade("silver-light-ante", "silver", "Phí Bàn Nhẹ", "Tiến độ", "Giảm phí vào bàn của bạn 1đ ở vòng này, tối thiểu 0đ."),
  upgrade("silver-small-pot-cover", "silver", "Pot Nhỏ An Toàn", "Bet", "Nếu thua pot từ 8đ trở xuống, hoàn lại 1đ."),
  upgrade("silver-blind-value", "silver", "Blind Có Giá", "Bet", "Nếu thắng pot khi ở blind, nhận thêm +2đ."),
  upgrade("silver-rich-tax-chip", "silver", "Thuế Nhẹ", "Top 1", "Nếu top 1 nhận lợi tức vòng này, bạn nhận +1đ."),
  upgrade("silver-mini-bounty", "silver", "Bounty Nhỏ", "Top 1", "Nếu thắng pot có người nhiều tiền nhất tham gia, nhận thêm +1đ."),

  upgrade("gold-saving-account", "gold", "Gửi Tiết Kiệm", "Economy", "Lợi tức tăng từ 1đ/10đ thành 1.5đ/10đ, làm tròn xuống."),
  upgrade("gold-interest-plus", "gold", "Lợi Tức +1", "Economy", "Lợi tức cuối vòng của bạn tăng thêm +1đ."),
  upgrade("gold-private-bank", "gold", "Ngân Hàng Riêng", "Economy", "Lợi tức tính theo 1đ/9đ thay vì 1đ/10đ."),
  upgrade("gold-greedy-interest", "gold", "Tham Lam", "Economy", "Lợi tức tăng thêm +1đ, nhưng thua pot thì mất thêm 1đ."),
  upgrade("gold-pressure-raise", "gold", "Raise Áp Lực", "Bet", "Lần raise đầu tiên mỗi vòng khiến người theo phải trả thêm +1đ."),
  upgrade("gold-price-squeezer", "gold", "Kẻ Ép Giá", "Bet", "Khi raise làm ít nhất 2 người fold, nhận +2đ."),
  upgrade("gold-risky-bet", "gold", "Cược Liều", "Bet", "Nếu thắng pot với tổng bet từ 10đ trở lên, nhận thêm +3đ."),
  upgrade("gold-all-in-insurance", "gold", "All-in Có Bảo Hiểm", "Bet", "Nếu all-in và thua, được hoàn lại 2đ."),
  upgrade("gold-pot-builder", "gold", "Dựng Pot", "Bet", "Nếu pot đạt ít nhất 12đ và bạn thắng, nhận thêm +2đ."),
  upgrade("gold-value-line", "gold", "Value Line", "Bet", "Khi thắng showdown bằng hand mạnh, nhận thêm +2đ từ pot."),
  upgrade("gold-change-luck", "gold", "Đổi Vận", "Bài", "Mỗi vòng 1 lần, được đổi 1 lá bài của mình."),
  upgrade("gold-peek", "gold", "Nhìn Trộm", "Thông tin", "Mỗi vòng 1 lần, được xem 1 lá bài úp hoặc 1 thông tin bí mật."),
  upgrade("gold-instinct", "gold", "Linh Cảm", "Thông tin", "Trước showdown, được hỏi bài mình có mạnh hơn ít nhất 1 người không."),
  upgrade("gold-keep-card", "gold", "Giữ Bài", "Bài", "Sau khi chia bài, được giữ lại 1 lá và bốc lại phần còn lại."),
  upgrade("gold-hunt-top-one", "gold", "Săn Top 1", "Top 1", "Nếu thắng pot trước người đang top 1, nhận thêm +3đ."),
  upgrade("gold-rich-tax", "gold", "Thuế Nhà Giàu", "Top 1", "Người nhiều tiền nhất mất 2đ, bạn nhận 1đ."),
  upgrade("gold-interest-thief", "gold", "Kẻ Cướp Lãi", "Top 1", "Một lần mỗi vòng, chọn 1 người: họ mất 1đ lợi tức, bạn nhận 1đ."),
  upgrade("gold-wanted", "gold", "Truy Nã", "Top 1", "Đặt bounty lên người nhiều tiền nhất; ai thắng pot có họ tham gia nhận +3đ."),
  upgrade("gold-comeback-pot", "gold", "Lội Ngược Dòng", "Comeback", "Nếu thắng pot khi đang ít tiền nhất bàn, nhận thêm +4đ."),
  upgrade("gold-last-chance", "gold", "Cơ Hội Cuối", "Comeback", "Lần đầu về 0đ, sống lại với 5đ. Chỉ dùng 1 lần."),
  upgrade("gold-leader-pressure", "gold", "Áp Lực Dẫn Đầu", "Top 1", "Người nhiều tiền nhất phải bet tối thiểu 2đ nếu muốn tham gia vòng."),
  upgrade("gold-reversal", "gold", "Đảo Chiều", "Chaos", "Một lần mỗi trận, người thắng pot nhận ít hơn 2đ; phần đó chia cho người thua nhiều nhất."),
  upgrade("gold-rage-counter", "gold", "Bộ Đếm Nộ", "Comeback", "Thua showdown tích 1 điểm; khi thắng nhận +2đ mỗi điểm rồi xóa."),
  upgrade("gold-death-duel", "gold", "Duel Đến Chết", "Tiến độ", "Một lần mỗi trận, tuyên bố pot tối thiểu 10đ cho vòng hiện tại."),

  upgrade("diamond-banker", "diamond", "Chủ Ngân Hàng", "Economy", "Cuối mỗi vòng, nhận +1đ cho mỗi người chơi còn sống, tối đa +5đ."),
  upgrade("diamond-venture", "diamond", "Đầu Tư Mạo Hiểm", "Economy", "Đầu vòng hy sinh 5đ; nếu thắng pot vòng đó, nhận lại 12đ."),
  upgrade("diamond-lock-pot", "diamond", "Khóa Pot", "Bet", "Một lần mỗi vòng, khi pot đạt 15đ, không ai được raise thêm."),
  upgrade("diamond-finisher", "diamond", "Đòn Kết Liễu", "Bet", "Nếu thắng một người khiến họ về 0đ, nhận thêm +8đ."),
  upgrade("diamond-fate-redraw", "diamond", "Bốc Lại Định Mệnh", "Bài", "Một lần mỗi trận, sau khi thấy bài mình, bỏ hand hiện tại và nhận hand mới."),
  upgrade("diamond-third-hidden-card", "diamond", "Bài Ẩn Thứ Ba", "Bài", "Mỗi vòng bốc thêm 1 lá úp riêng; showdown chọn 2 trong 3 lá."),
  upgrade("diamond-luck-blocker", "diamond", "Chặn Vận May", "Bài", "Một lần mỗi vòng, hủy hiệu ứng đổi bài, bốc lại hoặc xem bài của người khác."),
  upgrade("diamond-rage-scaling", "diamond", "Càng Thua Càng Mạnh", "Comeback", "Mỗi lần thua showdown tích 1 điểm; khi thắng nhận +3đ mỗi điểm rồi xóa."),
  upgrade("diamond-survival-cover", "diamond", "Bảo Hiểm Sinh Tồn", "Comeback", "Nếu còn dưới 10đ, bạn không thể mất quá 5đ trong một vòng."),
  upgrade("diamond-rich-assassin", "diamond", "Sát Thủ Nhà Giàu", "Top 1", "Nếu thắng pot có người nhiều tiền nhất tham gia, lấy thêm 5đ trực tiếp từ họ."),
  upgrade("diamond-steal-interest", "diamond", "Cướp Lợi Tức", "Top 1", "Mỗi vòng chọn 1 người; nhận toàn bộ lợi tức của họ, tối đa +6đ."),
  upgrade("diamond-fate-coin", "diamond", "Đồng Xu Định Mệnh", "Chaos", "Mỗi vòng 1 lần, khi thua showdown tung xu; ngửa hoàn lại 50% số đã bet."),
  upgrade("diamond-revive", "diamond", "Hồi Sinh Kim Cương", "Comeback", "Lần đầu về 0đ, hồi sinh với 12đ và nhận ngay 1 lựa chọn lõi mới không có Kim cương."),
  upgrade("diamond-danger-compound", "diamond", "Lãi Kép Nguy Hiểm", "Economy", "Lợi tức x2, nhưng nếu thua showdown thì mất thêm 3đ."),
  upgrade("diamond-giant-pot", "diamond", "Pot Khổng Lồ", "Bet", "Nếu pot đạt ít nhất 20đ, bạn nhận thêm +5đ nếu thắng pot."),
  upgrade("diamond-royal-bounty", "diamond", "Bounty Hoàng Gia", "Top 1", "Top 1 bị đặt bounty 10đ; ai thắng pot có họ tham gia nhận bounty."),
  upgrade("diamond-jungle-rule", "diamond", "Luật Rừng", "Chaos", "Mỗi vòng 1 lần, chọn luật phụ: không raise, không fold sau call, hoặc pot tối thiểu 10đ."),
  upgrade("diamond-death-hand", "diamond", "Ván Bài Tử Thần", "Tiến độ", "Một lần mỗi trận, người thắng pot nhận +10đ, người thua nhiều nhất mất thêm 5đ."),
];

let state = loadState();
let toastTimer = null;
let audioContext = null;

const elements = {};

document.addEventListener("DOMContentLoaded", () => {
  bindElements();
  bindEvents();
  render();
});

function bindElements() {
  elements.nameGate = document.querySelector("#nameGate");
  elements.playerApp = document.querySelector("#playerApp");
  elements.nameForm = document.querySelector("#nameForm");
  elements.playerNameInput = document.querySelector("#playerNameInput");
  elements.playerNameDisplay = document.querySelector("#playerNameDisplay");
  elements.roundLabel = document.querySelector("#roundLabel");
  elements.statusLabel = document.querySelector("#statusLabel");
  elements.choiceCount = document.querySelector("#choiceCount");
  elements.tierBars = document.querySelector("#tierBars");
  elements.draftBoard = document.querySelector("#draftBoard");
  elements.handCount = document.querySelector("#handCount");
  elements.handGrid = document.querySelector("#handGrid");
  elements.hostPanel = document.querySelector("#hostPanel");
  elements.hostForm = document.querySelector("#hostForm");
  elements.rateSilverInput = document.querySelector("#rateSilverInput");
  elements.rateGoldInput = document.querySelector("#rateGoldInput");
  elements.rateDiamondInput = document.querySelector("#rateDiamondInput");
  elements.ratesTotal = document.querySelector("#ratesTotal");
  elements.nextRatesLabel = document.querySelector("#nextRatesLabel");
  elements.blockedLabel = document.querySelector("#blockedLabel");
  elements.soundButton = document.querySelector('[data-action="toggle-sound"]');
  elements.toast = document.querySelector("#toast");
}

function bindEvents() {
  document.addEventListener("click", handleActionClick);

  elements.nameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    savePlayerName(elements.playerNameInput.value.trim());
  });

  elements.hostForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveNextRates();
  });

  [elements.rateSilverInput, elements.rateGoldInput, elements.rateDiamondInput].forEach((input) => {
    input.addEventListener("input", updateRatesTotal);
  });
}

function loadState() {
  const fallback = createDefaultState();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    return normalizeState(JSON.parse(raw));
  } catch (error) {
    console.warn("Could not load saved state", error);
    return fallback;
  }
}

function createDefaultState() {
  return {
    libraryVersion: CARD_LIBRARY_VERSION,
    playerName: "",
    round: 1,
    soundEnabled: true,
    cards: defaultCards.map((card) => ({ ...card, remaining: card.copies })),
    offer: [],
    hand: [],
    nextRates: null,
    roundRateOverrides: {},
    offerHistory: [],
    nextRoundBlock: null,
  };
}

function normalizeState(savedState) {
  const fallback = createDefaultState();
  const savedCards = Array.isArray(savedState.cards) ? savedState.cards : [];
  const cards = savedState.libraryVersion === CARD_LIBRARY_VERSION
    ? mergeCardLibrary(fallback.cards, savedCards)
    : mergeCardLibrary(fallback.cards, savedCards.filter((card) => String(card.id || "").startsWith("card-")));

  const normalizedCards = cards.map((card) => {
    const copies = clamp(Number(card.copies) || 1, 1, 99);
    const remaining = clamp(
      Number.isFinite(Number(card.remaining)) ? Number(card.remaining) : copies,
      0,
      copies,
    );

    return {
      id: String(card.id || createId("card")),
      tier: tierOrder.includes(card.tier) ? card.tier : "silver",
      name: String(card.name || "Lõi mới"),
      tag: String(card.tag || "Nâng cấp"),
      copies,
      remaining,
      text: String(card.text || "Lõi tự tạo."),
    };
  });

  const cardIds = new Set(normalizedCards.map((card) => card.id));
  const offer = Array.isArray(savedState.offer)
    ? savedState.offer
        .filter((slot) => slot && cardIds.has(slot.cardId))
        .slice(0, 3)
        .map((slot) => ({
          cardId: slot.cardId,
          rerolled: Boolean(slot.rerolled),
        }))
    : [];

  const hand = Array.isArray(savedState.hand)
    ? savedState.hand
        .filter((pick) => pick && cardIds.has(pick.cardId))
        .map((pick) => ({
          id: String(pick.id || createId("pick")),
          cardId: pick.cardId,
          round: clamp(Number(pick.round) || 1, 1, 99),
        }))
    : [];
  const nextRoundBlock = normalizeNextRoundBlock(savedState.nextRoundBlock, cardIds);

  return {
    libraryVersion: CARD_LIBRARY_VERSION,
    playerName: String(savedState.playerName || ""),
    round: clamp(Number(savedState.round) || fallback.round, 1, 99),
    soundEnabled: savedState.soundEnabled !== false,
    cards: normalizedCards,
    offer,
    hand,
    nextRates: normalizeRates(savedState.nextRates),
    roundRateOverrides: normalizeRateOverrides(savedState.roundRateOverrides),
    offerHistory: normalizeOfferHistory(savedState.offerHistory, cardIds),
    nextRoundBlock,
  };
}

function mergeCardLibrary(baseCards, savedCards) {
  const savedById = new Map(savedCards.map((card) => [String(card.id), card]));
  const baseIds = new Set(baseCards.map((card) => card.id));
  const mergedBaseCards = baseCards.map((baseCard) => {
    const savedCard = savedById.get(baseCard.id);
    if (!savedCard) return { ...baseCard };

    return {
      ...baseCard,
      remaining: savedCard.remaining,
    };
  });

  const customCards = savedCards.filter((card) => {
    const cardId = String(card.id || "");
    return cardId.startsWith("card-") && !baseIds.has(cardId);
  });

  return [...mergedBaseCards, ...customCards];
}

function normalizeRates(value) {
  if (!value || typeof value !== "object") return null;
  const rates = {
    silver: clamp(Math.floor(Number(value.silver) || 0), 0, 100),
    gold: clamp(Math.floor(Number(value.gold) || 0), 0, 100),
    diamond: clamp(Math.floor(Number(value.diamond) || 0), 0, 100),
  };
  const total = rates.silver + rates.gold + rates.diamond;
  return total > 0 ? rates : null;
}

function normalizeRateOverrides(value) {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(
    Object.entries(value)
      .map(([round, rates]) => [String(clamp(Number(round) || 1, 1, 99)), normalizeRates(rates)])
      .filter(([, rates]) => rates),
  );
}

function normalizeOfferHistory(value, cardIds) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && Number(item.round) > 0 && typeof item.signature === "string")
    .map((item) => ({
      round: clamp(Number(item.round), 1, 99),
      signature: item.signature
        .split("|")
        .filter((cardId) => cardIds.has(cardId))
        .sort()
        .join("|"),
    }))
    .filter((item) => item.signature)
    .slice(-120);
}

function normalizeNextRoundBlock(value, cardIds) {
  if (!value || typeof value !== "object") return null;
  const cardIdList = Array.isArray(value.cardIds)
    ? [...new Set(value.cardIds.filter((cardId) => cardIds.has(cardId)))]
    : [];
  if (!cardIdList.length) return null;
  return {
    round: clamp(Number(value.round) || 1, 1, 99),
    cardIds: cardIdList,
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function render() {
  const hasName = Boolean(state.playerName.trim());
  elements.nameGate.hidden = hasName;
  elements.playerApp.hidden = !hasName;
  elements.playerNameInput.value = hasName ? state.playerName : elements.playerNameInput.value;
  renderSoundButton();

  if (!hasName) {
    syncIcons();
    return;
  }

  elements.playerNameDisplay.textContent = state.playerName;
  elements.roundLabel.textContent = `Vòng chọn ${state.round}`;
  elements.statusLabel.textContent = state.offer.length ? "Đang chọn" : "Đã chọn";
  elements.choiceCount.textContent = state.offer.length ? `${state.offer.length}/3` : "0/3";

  renderTierBars();
  renderHostPanel();
  renderOffer();
  renderHand();
  syncIcons();
}

function renderTierBars() {
  const rates = getRoundRates(state.round);

  elements.tierBars.innerHTML = tierOrder
    .map((tier) => {
      const info = tierInfo[tier];
      const stock = getTierRemaining(tier);

      return `
        <article class="tier-stat">
          <div class="tier-stat-top">
            <span class="tier-name">
              <span class="tier-dot" style="background:${info.dot}"></span>
              <span>${info.label}</span>
            </span>
            <strong>${rates[tier]}%</strong>
          </div>
          <div class="tier-meter" aria-hidden="true">
            <span class="${info.bgClass}" style="width:${rates[tier]}%"></span>
          </div>
          <span class="tier-stock">${stock.remaining}/${stock.total} trong pool</span>
        </article>
      `;
    })
    .join("");
}

function renderOffer() {
  if (!state.offer.length) {
    elements.draftBoard.style.setProperty("--draft-columns", 1);
    elements.draftBoard.innerHTML = `
      <div class="empty-choice">
        <i data-lucide="badge-check"></i>
        <strong>Vòng này đã xong</strong>
        <span>Thẻ đã nằm trong bộ của bạn.</span>
        <button class="primary-button" type="button" data-action="new-offer">
          <i data-lucide="sparkles"></i>
          <span>Vòng mới</span>
        </button>
      </div>
    `;
    return;
  }

  elements.draftBoard.style.setProperty("--draft-columns", 3);
  elements.draftBoard.innerHTML = state.offer
    .map((slot, index) => {
      const card = getCard(slot.cardId);
      if (!card) return "";
      const info = tierInfo[card.tier];
      const canReroll = !slot.rerolled;
      const disabled = card.remaining <= 0 ? "disabled" : "";

      return `
        <article class="draft-card choice-card ${info.className}" data-suit="${info.suit}">
          <div class="draft-card-content">
            <div class="card-labels">
              <span class="badge-group">
                <span class="tier-badge">${info.label}</span>
                <span class="tag-badge">${escapeHtml(card.tag)}</span>
              </span>
              <span class="copy-badge">${card.remaining}/${card.copies}</span>
            </div>
            <div>
              <h3>${escapeHtml(card.name)}</h3>
              <p>${escapeHtml(card.text)}</p>
            </div>
            <div class="draft-actions">
              <button class="pill-button" type="button" data-action="reroll-slot" data-slot-index="${index}" ${canReroll ? "" : "disabled"}>
                <i data-lucide="refresh-cw"></i>
                <span>${canReroll ? "Đổi" : "Đã đổi"}</span>
              </button>
              <button class="pill-button strong" type="button" data-action="choose-slot" data-slot-index="${index}" ${disabled}>
                <i data-lucide="check"></i>
                <span>Chọn</span>
              </button>
            </div>
            <span class="reroll-note">${canReroll ? "Còn 1 lượt đổi ô này" : "Ô này đã hết lượt đổi"}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderHand() {
  elements.handCount.textContent = `${state.hand.length} thẻ`;

  if (!state.hand.length) {
    elements.handGrid.innerHTML = `
      <div class="empty-hand">
        <i data-lucide="layers-3"></i>
        <strong>Chưa có thẻ</strong>
        <span>Thẻ đã chọn sẽ nằm ở đây.</span>
      </div>
    `;
    return;
  }

  const grouped = groupHand();
  elements.handGrid.innerHTML = grouped
    .map((item) => {
      const card = getCard(item.cardId);
      if (!card) return "";
      const info = tierInfo[card.tier];
      return `
        <article class="hand-card ${info.className}" data-suit="${info.suit}">
          <div class="card-labels">
            <span class="badge-group">
              <span class="tier-badge">${info.label}</span>
              <span class="tag-badge">${escapeHtml(card.tag)}</span>
            </span>
            <span class="copy-badge">x${item.count}</span>
          </div>
          <h3>${escapeHtml(card.name)}</h3>
          <p>${escapeHtml(card.text)}</p>
          <span class="round-chip">Vòng ${item.rounds.join(", ")}</span>
        </article>
      `;
    })
    .join("");
}

function renderSoundButton() {
  if (!elements.soundButton) return;
  elements.soundButton.setAttribute("aria-pressed", String(state.soundEnabled));
  elements.soundButton.innerHTML = `<i data-lucide="${state.soundEnabled ? "volume-2" : "volume-x"}"></i>`;
}

function renderHostPanel() {
  const nextDefaultRates = getPresetRoundRates(state.round + 1);
  const rates = state.nextRates || nextDefaultRates;
  elements.rateSilverInput.value = rates.silver;
  elements.rateGoldInput.value = rates.gold;
  elements.rateDiamondInput.value = rates.diamond;
  updateRatesTotal();

  if (state.nextRates) {
    elements.nextRatesLabel.textContent = `Vòng ${state.round + 1}: Bạc ${state.nextRates.silver}%, Vàng ${state.nextRates.gold}%, Kim cương ${state.nextRates.diamond}%.`;
  } else {
    elements.nextRatesLabel.textContent = "Vòng sau dùng preset mặc định.";
  }

  const block = getActiveNextRoundBlock(state.round + 1);
  if (!block.length) {
    elements.blockedLabel.textContent = "Không có thẻ bị khóa ở vòng kế tiếp.";
    return;
  }

  const blockedNames = block.map((cardId) => getCard(cardId)?.name).filter(Boolean).join(", ");
  elements.blockedLabel.textContent = `Vòng ${state.round + 1} khóa: ${blockedNames}.`;
}

function handleActionClick(event) {
  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;

  const { action, slotIndex } = actionTarget.dataset;

  switch (action) {
    case "new-offer":
      startNewOffer();
      break;
    case "reroll-slot":
      rerollSlot(Number(slotIndex));
      break;
    case "choose-slot":
      chooseSlot(Number(slotIndex));
      break;
    case "edit-name":
      editName();
      break;
    case "toggle-sound":
      toggleSound();
      break;
    case "toggle-host":
      toggleHostPanel();
      break;
    case "close-host":
      elements.hostPanel.hidden = true;
      break;
    case "reset-state":
      resetState();
      break;
  }
}

function savePlayerName(name) {
  if (!name) {
    playSound("error");
    showToast("Nhập tên trước.");
    return;
  }

  state.playerName = name;
  if (!state.offer.length && !state.hand.length) {
    createOffer(false);
  }
  playSound("start");
  showToast(`Chào ${name}.`);
  saveAndRender();
}

function editName() {
  elements.nameGate.hidden = false;
  elements.playerApp.hidden = true;
  elements.playerNameInput.value = state.playerName;
  elements.playerNameInput.focus();
}

function startNewOffer() {
  createOffer(state.hand.length > 0 || state.offer.length > 0);
  playSound("deal");
  saveAndRender();
}

function createOffer(advanceRound) {
  const availableCards = state.cards.filter((card) => card.remaining > 0);
  if (!availableCards.length) {
    state.offer = [];
    playSound("error");
    showToast("Pool đã hết lõi.");
    return;
  }

  if (advanceRound) {
    state.round = clamp(state.round + 1, 1, 99);
  }

  applyNextRatesForCurrentRound();
  clearExpiredNextRoundBlock();

  let offer = [];
  for (let attempt = 0; attempt < 40; attempt += 1) {
    offer = drawOffer();
    const signature = getOfferSignature(offer);
    if (!signature || !isOfferSignatureUsed(state.round, signature)) break;
  }

  state.offer = offer;
  recordOfferSignature(offer);
}

function drawOffer() {
  const offer = [];
  const usedIds = new Set(getBlockedCardIdsForCurrentRound());

  for (let index = 0; index < 3; index += 1) {
    const card = drawOneCard(usedIds);
    if (!card) break;
    usedIds.add(card.id);
    offer.push({ cardId: card.id, rerolled: false });
  }

  return offer;
}

function applyNextRatesForCurrentRound() {
  if (!state.nextRates) return;
  state.roundRateOverrides[String(state.round)] = state.nextRates;
  state.nextRates = null;
}

function clearExpiredNextRoundBlock() {
  if (state.nextRoundBlock && state.nextRoundBlock.round < state.round) {
    state.nextRoundBlock = null;
  }
}

function rerollSlot(index) {
  const slot = state.offer[index];
  if (!slot) return;

  if (slot.rerolled) {
    playSound("error");
    showToast("Ô này đã hết lượt đổi.");
    return;
  }

  const usedIds = new Set([
    ...getBlockedCardIdsForCurrentRound(),
    ...state.offer.map((item, itemIndex) => (itemIndex === index ? null : item.cardId)).filter(Boolean),
  ]);
  usedIds.add(slot.cardId);
  let card = drawOneCard(usedIds);

  if (!card) {
    usedIds.delete(slot.cardId);
    card = drawOneCard(usedIds);
  }

  if (!card) {
    playSound("error");
    showToast("Không còn thẻ khác để đổi.");
    return;
  }

  slot.cardId = card.id;
  slot.rerolled = true;
  if (isOfferSignatureUsed(state.round, getOfferSignature(state.offer))) {
    const fallback = drawDifferentCardForSlot(index, slot.cardId);
    if (fallback) {
      slot.cardId = fallback.id;
    }
  }
  recordOfferSignature(state.offer);
  playSound("reroll");
  saveAndRender();
}

function drawDifferentCardForSlot(index, currentCardId) {
  const baseUsedIds = new Set([
    ...getBlockedCardIdsForCurrentRound(),
    ...state.offer.map((item, itemIndex) => (itemIndex === index ? null : item.cardId)).filter(Boolean),
    currentCardId,
  ]);

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const card = drawOneCard(baseUsedIds);
    if (!card) return null;
    const candidateOffer = state.offer.map((slot, itemIndex) => (
      itemIndex === index ? { ...slot, cardId: card.id } : slot
    ));
    if (!isOfferSignatureUsed(state.round, getOfferSignature(candidateOffer))) {
      return card;
    }
    baseUsedIds.add(card.id);
  }

  return null;
}

function getBlockedCardIdsForCurrentRound() {
  return state.nextRoundBlock?.round === state.round ? state.nextRoundBlock.cardIds : [];
}

function getActiveNextRoundBlock(round) {
  return state.nextRoundBlock?.round === round ? state.nextRoundBlock.cardIds : [];
}

function getOfferSignature(offer) {
  return offer
    .map((slot) => slot.cardId)
    .filter(Boolean)
    .sort()
    .join("|");
}

function isOfferSignatureUsed(round, signature) {
  if (!signature) return false;
  return state.offerHistory.some((item) => item.round === round && item.signature === signature);
}

function recordOfferSignature(offer) {
  const signature = getOfferSignature(offer);
  if (!signature || isOfferSignatureUsed(state.round, signature)) return;
  state.offerHistory.push({ round: state.round, signature });
  state.offerHistory = state.offerHistory
    .filter((item) => item.round >= state.round - 2)
    .slice(-120);
}

function chooseSlot(index) {
  const slot = state.offer[index];
  if (!slot) return;

  const card = getCard(slot.cardId);
  if (!card || card.remaining <= 0) {
    playSound("error");
    showToast("Thẻ này đã hết trong pool.");
    return;
  }

  card.remaining -= 1;
  state.hand.push({
    id: createId("pick"),
    cardId: card.id,
    round: state.round,
  });
  blockCardForNextRound(card.id);
  state.offer = [];
  playSound("select");
  saveAndRender();
  showToast(`Đã chọn ${card.name}.`);
}

function blockCardForNextRound(cardId) {
  const nextRound = clamp(state.round + 1, 1, 99);
  const currentBlock = state.nextRoundBlock?.round === nextRound ? state.nextRoundBlock.cardIds : [];
  state.nextRoundBlock = {
    round: nextRound,
    cardIds: [...new Set([...currentBlock, cardId])],
  };
}

function drawOneCard(usedIds = new Set()) {
  const effectiveRates = getEffectiveTierRates();
  let tier = pickWeighted(
    tierOrder.map((tierName) => ({
      value: tierName,
      weight: effectiveRates[tierName],
    })),
  );

  let pool = state.cards.filter((card) => card.tier === tier && card.remaining > 0 && !usedIds.has(card.id));

  if (!pool.length) {
    pool = state.cards.filter((card) => card.remaining > 0 && !usedIds.has(card.id));
  }

  if (!pool.length) return null;

  return pickWeighted(pool.map((card) => ({ value: card, weight: card.remaining })));
}

function resetState() {
  const confirmed = window.confirm("Reset tên, thẻ đã chọn và vòng hiện tại?");
  if (!confirmed) return;
  state = createDefaultState();
  playSound("reset");
  saveAndRender();
  showToast("Đã reset.");
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  if (state.soundEnabled) {
    ensureAudioContext();
    playSound("start");
  }
  saveAndRender();
}

function toggleHostPanel() {
  elements.hostPanel.hidden = !elements.hostPanel.hidden;
  if (!elements.hostPanel.hidden) {
    renderHostPanel();
  }
}

function updateRatesTotal() {
  const rates = readRateInputs();
  const total = rates.silver + rates.gold + rates.diamond;
  elements.ratesTotal.textContent = `Tổng ${total}%`;
  elements.ratesTotal.classList.toggle("invalid", total !== 100);
}

function saveNextRates() {
  const rates = readRateInputs();
  const total = rates.silver + rates.gold + rates.diamond;

  if (total !== 100) {
    playSound("error");
    showToast("Tổng tỉ lệ phải đúng 100%.");
    return;
  }

  state.nextRates = rates;
  playSound("select");
  saveAndRender();
  showToast(`Đã lưu tỉ lệ cho vòng ${state.round + 1}.`);
}

function readRateInputs() {
  return {
    silver: clamp(Math.floor(Number(elements.rateSilverInput.value) || 0), 0, 100),
    gold: clamp(Math.floor(Number(elements.rateGoldInput.value) || 0), 0, 100),
    diamond: clamp(Math.floor(Number(elements.rateDiamondInput.value) || 0), 0, 100),
  };
}

function saveAndRender() {
  saveState();
  render();
}

function getRoundRates(round) {
  return state.roundRateOverrides?.[String(round)] || getPresetRoundRates(round);
}

function getPresetRoundRates(round) {
  return roundRates[Math.min(round, roundRates.length) - 1] || roundRates[roundRates.length - 1];
}

function getEffectiveTierRates() {
  const rawRates = getRoundRates(state.round);
  const availableTiers = tierOrder.filter((tier) => getTierAvailableRemaining(tier) > 0);
  if (!availableTiers.length) {
    return { silver: 0, gold: 0, diamond: 0 };
  }

  const rawAvailableTotal = availableTiers.reduce((sum, tier) => sum + rawRates[tier], 0);
  if (rawAvailableTotal > 0) {
    return Object.fromEntries(
      tierOrder.map((tier) => [
        tier,
        availableTiers.includes(tier) ? rawRates[tier] / rawAvailableTotal : 0,
      ]),
    );
  }

  const evenRate = 1 / availableTiers.length;
  return Object.fromEntries(tierOrder.map((tier) => [tier, availableTiers.includes(tier) ? evenRate : 0]));
}

function getSlotChanceForCard(card) {
  if (!card || card.remaining <= 0) return 0;
  const tierTotal = getTierRemaining(card.tier).remaining;
  if (!tierTotal) return 0;
  const effectiveRates = getEffectiveTierRates();
  return effectiveRates[card.tier] * (card.remaining / tierTotal);
}

function getTierRemaining(tier) {
  return state.cards
    .filter((card) => card.tier === tier)
    .reduce(
      (totals, card) => ({
        remaining: totals.remaining + card.remaining,
        total: totals.total + card.copies,
      }),
      { remaining: 0, total: 0 },
    );
}

function getTierAvailableRemaining(tier) {
  const blockedIds = new Set(getBlockedCardIdsForCurrentRound());
  return state.cards
    .filter((card) => card.tier === tier && !blockedIds.has(card.id))
    .reduce((sum, card) => sum + card.remaining, 0);
}

function getCard(cardId) {
  return state.cards.find((card) => card.id === cardId);
}

function groupHand() {
  const groups = new Map();
  state.hand.forEach((pick) => {
    const current = groups.get(pick.cardId) || {
      cardId: pick.cardId,
      count: 0,
      rounds: [],
    };
    current.count += 1;
    current.rounds.push(pick.round);
    groups.set(pick.cardId, current);
  });

  return [...groups.values()].sort((first, second) => {
    const firstTier = tierOrder.indexOf(getCard(first.cardId)?.tier || "silver");
    const secondTier = tierOrder.indexOf(getCard(second.cardId)?.tier || "silver");
    return secondTier - firstTier || Math.min(...first.rounds) - Math.min(...second.rounds);
  });
}

function createId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function pickWeighted(items) {
  const total = items.reduce((sum, item) => sum + Math.max(Number(item.weight) || 0, 0), 0);
  if (total <= 0) return items[0]?.value ?? null;

  let roll = Math.random() * total;
  for (const item of items) {
    roll -= Math.max(Number(item.weight) || 0, 0);
    if (roll <= 0) return item.value;
  }

  return items[items.length - 1]?.value ?? null;
}

function formatPercent(value) {
  const percent = clamp(value * 100, 0, 100);
  if (percent >= 10) return `${percent.toFixed(0)}%`;
  if (percent >= 1) return `${percent.toFixed(1)}%`;
  if (percent > 0) return `${percent.toFixed(2)}%`;
  return "0%";
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function emptyState(title, body) {
  return `
    <div class="empty-state">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(body)}</span>
    </div>
  `;
}

function ensureAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function playSound(type) {
  if (!state.soundEnabled) return;
  const context = ensureAudioContext();
  if (!context) return;

  const now = context.currentTime;
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.16, now + 0.015);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
  master.connect(context.destination);

  const patterns = {
    start: [440, 660],
    deal: [392, 523, 659],
    reroll: [720, 540, 810],
    select: [523, 659, 880],
    reset: [330, 220],
    error: [160, 120],
  };
  const wave = type === "error" || type === "reset" ? "triangle" : "sine";
  const notes = patterns[type] || patterns.select;

  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = now + index * 0.075;
    const end = start + (type === "reroll" ? 0.12 : 0.16);

    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(frequency, start);
    if (type === "reroll") {
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.22, end);
    }
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.18, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(start);
    oscillator.stop(end + 0.02);
  });
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 2200);
}

function syncIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}
