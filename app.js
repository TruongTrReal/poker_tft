const STORAGE_KEY = "poker-tactics-player-v1";
const CARD_LIBRARY_VERSION = 4;
const CHEAT_ROLL_CHANCE = 0.1;

const draftTierOrder = ["silver", "gold", "diamond"];
const tierOrder = ["silver", "gold", "diamond", "cheat"];

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
  cheat: {
    label: "Gian lận",
    className: "cheat",
    bgClass: "cheat-bg",
    suit: "★",
    dot: "#ff405f",
  },
};

const tierRates = {
  silver: { silver: 100, gold: 0, diamond: 0, cheat: 0 },
  gold: { silver: 0, gold: 100, diamond: 0, cheat: 0 },
  diamond: { silver: 0, gold: 0, diamond: 100, cheat: 0 },
};

const defaultRoundTiers = ["silver", "silver", "gold", "gold", "diamond"];

function upgrade(id, tier, name, tag, text, copiesOrOptions) {
  const defaultCopies = tier === "cheat" ? 1 : tier === "diamond" ? 2 : tier === "gold" ? 4 : 6;
  const options = typeof copiesOrOptions === "object" ? copiesOrOptions : {};
  const copies = typeof copiesOrOptions === "number" ? copiesOrOptions : options.copies;
  return {
    id,
    tier,
    name,
    tag,
    copies: copies || defaultCopies,
    minRound: options.minRound || 1,
    text,
  };
}

const defaultCards = [
  upgrade("silver-small-investor", "silver", "Nhà Đầu Tư Nhỏ", "Economy", "Nhận ngay +3đ."),
  upgrade("silver-small-interest", "silver", "Lãi Nhỏ", "Economy", "Nếu thua vòng này, nhận +2đ cuối vòng."),
  upgrade("silver-compound-light", "silver", "Lãi Kép Nhẹ", "Economy", "Nếu vòng này bạn không all-in, nhận thêm +2đ."),
  upgrade("silver-emergency-fund", "silver", "Quỹ Dự Phòng", "Comeback", "Khi còn dưới 6đ, nhận thêm +4đ cuối vòng."),
  upgrade("silver-hold-money", "silver", "Giữ Tiền Là Thắng", "Economy", "Nếu kết thúc vòng có ít nhất 15đ, nhận thêm +2đ."),
  upgrade("silver-no-overspend", "silver", "Không Tiêu Hoang", "Economy", "Nếu tổng bet vòng này không vượt quá 5đ, nhận +2đ."),
  upgrade("silver-soft-call", "silver", "Bet Mềm", "Bet", "Lần call đầu tiên mỗi vòng giảm chi phí 1đ."),
  upgrade("silver-first-strike", "silver", "Đòn Phủ Đầu", "Bet", "Nếu là người bet đầu tiên, bet đầu tiên được giảm 1đ."),
  upgrade("silver-back-door", "silver", "Cửa Sau", "Bet", "Một lần mỗi vòng, sau khi fold được giữ lại 1đ từ số đã bet."),
  upgrade("silver-fold-value", "silver", "Fold Có Lãi", "Bet", "Nếu fold trước showdown, nhận +1đ."),
  upgrade("silver-bad-hand-insurance", "silver", "Bảo Hiểm Bài Xấu", "Bài", "Nếu bài cuối thuộc nhóm yếu nhất bàn, nhận +2đ."),
  upgrade("silver-bottom-floor", "silver", "Dưới Đáy Vực", "Comeback", "Từ vòng 2: nếu đang ít tiền nhất bàn, nhận thêm +3đ.", { minRound: 2 }),
  upgrade("silver-chaser", "silver", "Kẻ Bám Đuổi", "Comeback", "Từ vòng 2: nếu thua vòng này và không top 1 tiền, nhận +2đ.", { minRound: 2 }),
  upgrade("silver-last-chip", "silver", "Một Đồng Cũng Chơi", "Comeback", "Từ vòng 2: khi còn dưới 5đ, lần all-in tiếp theo cộng +2đ vào pot giả lập.", { minRound: 2 }),
  upgrade("silver-temporary-friend", "silver", "Bạn Thân Tạm Thời", "Chaos", "Chọn 1 người; nếu cả hai cùng sống hết vòng, cả hai nhận +1đ."),
  upgrade("silver-lucky-roll", "silver", "Cầu May", "Chaos", "Tung xúc xắc: 1-2 mất 1đ, 3-4 nhận 1đ, 5-6 nhận 3đ."),
  upgrade("silver-light-ante", "silver", "Phí Bàn Nhẹ", "Tiến độ", "Giảm phí vào bàn của bạn 1đ ở vòng này, tối thiểu 0đ."),
  upgrade("silver-small-pot-cover", "silver", "Pot Nhỏ An Toàn", "Bet", "Nếu thua pot từ 8đ trở xuống, hoàn lại 1đ."),
  upgrade("silver-blind-value", "silver", "Blind Có Giá", "Bet", "Nếu thắng pot khi ở blind, nhận thêm +2đ."),
  upgrade("silver-rich-tax-chip", "silver", "Thuế Nhẹ", "Top 1", "Từ vòng 2: nếu top 1 nhận lợi tức vòng này, bạn nhận +1đ.", { minRound: 2 }),
  upgrade("silver-mini-bounty", "silver", "Bounty Nhỏ", "Top 1", "Từ vòng 2: nếu thắng pot có người nhiều tiền nhất tham gia, nhận thêm +1đ.", { minRound: 2 }),

  upgrade("gold-saving-account", "gold", "Gửi Tiết Kiệm", "Economy", "Lợi tức từ 1đ/10đ thành 1.5/10đ"),
  upgrade("gold-interest-plus", "gold", "Lợi Tức +1", "Economy", "Lợi tức cuối vòng của bạn tăng thêm +1đ."),
  upgrade("gold-private-bank", "gold", "Ngân Hàng Riêng", "Economy", "Lợi tức tính theo 1đ/8đ thay vì 1đ/10đ, vẫn giới hạn tối đa 5đ."),
  upgrade("gold-greedy-interest", "gold", "Tham Lam", "Economy", "Lợi tức tăng thêm +2đ, nhưng thua pot thì mất 1đ."),
  upgrade("gold-pressure-raise", "gold", "Raise Áp Lực", "Bet", "Lần raise đầu tiên mỗi vòng khiến người theo phải trả thêm +3đ."),
  upgrade("gold-price-squeezer", "gold", "Kẻ Ép Giá", "Bet", "Khi raise làm ít nhất 1 người fold, nhận +3đ."),
  upgrade("gold-risky-bet", "gold", "Cược Liều", "Bet", "Nếu thắng pot với tổng bet từ 10đ trở lên, nhận thêm +5đ."),
  upgrade("gold-all-in-insurance", "gold", "All-in Có Bảo Hiểm", "Bet", "Nếu all-in và thua, được hoàn lại 8đ."),
  upgrade("gold-pot-builder", "gold", "Dựng Pot", "Bet", "Các vòng, nếu pot đạt ít nhất 20đ, nhận thêm +2đ."),
  upgrade("gold-value-line", "gold", "Value Line", "Bet", "Khi thắng showdown có con 2, nhận thêm +5đ từ pot."),
  upgrade("gold-change-luck", "gold", "Đổi Vận", "Bài", "Đến hết trận, mỗi vòng 1 lần, được đổi 1 lá bài của mình trước khi mở lá 4."),
  upgrade("gold-peek", "gold", "Nhìn Trộm", "Thông tin", "Đến hết trận, mỗi vòng 1 lần, được xem 2 lá bài vòng mở 3 lá."),
  upgrade("gold-instinct", "gold", "Linh Cảm", "Thông tin", "Đến hết trận, trước showdown mỗi vòng, được hỏi bài mình có mạnh hơn ít nhất 1 người không."),
  upgrade("gold-keep-card", "gold", "Giữ Bài", "Bài", "Đến hết trận, sau khi chia bài mỗi vòng, được giữ lại 1 lá và bốc lại phần còn lại trước khi mở lá 5."),
  upgrade("gold-hunt-top-one", "gold", "Săn Top 1", "Top 1", "Từ vòng 2: nếu thắng pot trước người đang top 1, nhận thêm +5đ.", { minRound: 2 }),
  upgrade("gold-rich-tax", "gold", "Thuế Nhà Giàu", "Top 1", "Từ vòng 2: người nhiều tiền nhất mất 3đ, bạn nhận 2đ.", { minRound: 2 }),
  upgrade("gold-interest-thief", "gold", "Kẻ Cướp Lãi", "Top 1", "Từ vòng 2: mỗi vòng chọn 1 người; họ mất 2đ lợi tức, bạn nhận 3đ.", { minRound: 2 }),
  upgrade("gold-wanted", "gold", "Truy Nã", "Top 1", "Từ vòng 2: đặt bounty lên người nhiều tiền nhất; ai thắng pot có họ tham gia nhận +5đ.", { minRound: 2 }),
  upgrade("gold-comeback-pot", "gold", "Lội Ngược Dòng", "Comeback", "Từ vòng 2: nếu thắng pot khi đang ít tiền nhất bàn, nhận thêm +7đ.", { minRound: 2 }),
  upgrade("gold-last-chance", "gold", "Cơ Hội Cuối", "Comeback", "Từ vòng 2 đến hết trận: nếu về 0đ, sống lại với 4đ và mất 1 dấu. Bắt đầu với 2 dấu.", { minRound: 2 }),
  upgrade("gold-leader-pressure", "gold", "Áp Lực Dẫn Đầu", "Top 1", "Từ vòng 2: người nhiều tiền nhất phải bet tối thiểu 4đ nếu muốn tham gia vòng.", { minRound: 2 }),
  upgrade("gold-reversal", "gold", "Đảo Chiều", "Chaos", "Đến hết trận, mỗi vòng lần đầu bạn thua pot, người thắng nhận ít hơn 3đ; phần đó trả lại cho người thua nhiều nhất."),
  upgrade("gold-rage-counter", "gold", "Bộ Đếm Nộ", "Comeback", "Từ vòng 2: thua tích 1 điểm; khi thắng nhận +3đ mỗi điểm rồi xóa.", { minRound: 2 }),
  upgrade("gold-death-duel", "gold", "Duel Đến Chết", "Tiến độ", "Đến hết trận, đầu mỗi vòng bạn có thể tuyên bố bet đầu tối thiểu 5đ; nếu thắng pot đó, nhận thêm +5đ."),
  upgrade("gold-interest-bank", "gold", "Sổ Lãi Trần", "Economy", "Đến hết trận, nếu lợi tức của bạn chạm trần 5đ, nhận thêm +2đ một lần trong vòng đó."),
  upgrade("gold-early-dividend", "gold", "Cổ Tức Sớm", "Economy", "Đến hết trận, nhận +2đ cuối mỗi vòng nếu bạn vẫn còn ít nhất 8đ sau khi trả bet."),
  upgrade("gold-ante-farmer", "gold", "Nông Dân Ante", "Economy", "Mỗi khi bạn thắng pot nhỏ hơn 8đ, nhận thêm +2đ."),
  upgrade("gold-save-or-surge", "gold", "Giữ Hay Bung", "Economy", "Đến hết trận, đầu mỗi vòng chọn: không raise để nhận +5đ cuối vòng, hoặc raise đầu của bạn x2 áp lực nhưng sẽ phải call để tiếp tục."),
  upgrade("gold-late-fee", "gold", "Phí Vào Muộn", "Bet", "Người cuối cùng call raise của bạn phải trả thêm 3đ vào pot."),
  upgrade("gold-double-barrel", "gold", "Hai Nòng", "Bet", "Nếu bạn raise ở 2 lượt bet liên tiếp trong cùng vòng, nhận +6đ nếu thắng pot."),
  upgrade("gold-pot-skimmer", "gold", "Vớt Mép Pot", "Bet", "Đến hết trận, mỗi vòng 1 lần, nếu fold sau khi đã bỏ ít nhất 3đ vào pot, hoàn lại 3đ."),
  upgrade("gold-side-quest", "gold", "Kèo Phụ", "Bet", "Đến hết trận, đầu mỗi vòng chọn 1 đối thủ; nếu bạn thắng pot có họ tham gia, nhận +3đ."),
  upgrade("gold-clean-fold", "gold", "Fold Sạch", "Kỷ luật", "Nếu bạn fold trước khi bỏ quá 1đ vào pot, nhận 1 dấu. Đủ 3 dấu đổi lấy +5đ."),
  upgrade("gold-suit-contract", "gold", "Hợp Đồng Chất", "Bài", "Đến hết trận, trước khi xem bài mỗi vòng, chọn 1 chất. Nếu showdown hand thắng có chất đó, nhận +4đ."),
  upgrade("gold-card-market", "gold", "Chợ Bài", "Bài", "Đến hết trận, mỗi vòng 1 lần, trả 1đ để đổi 1 lá. Nếu vẫn thua showdown, hoàn lại 1đ."),
  upgrade("gold-shared-bounty", "gold", "Bounty Chia Đôi", "Top 1", "Từ vòng 2: đặt bounty 4đ lên top 1; nếu người khác ăn bounty, bạn cũng nhận 2đ.", { minRound: 2 }),
  upgrade("gold-short-stack-sponsor", "gold", "Nhà Tài Trợ Short Stack", "Comeback", "Từ vòng 2 đến hết trận: nếu bắt đầu vòng với 5đ hoặc ít hơn, nhận +2đ và call đầu giảm 1đ.", { minRound: 2 }),
  upgrade("gold-vendetta", "gold", "Ân Oán", "Comeback", "Từ vòng 2 đến hết trận: mục tiêu luôn là người vừa thắng bạn gần nhất; nếu thắng pot trước họ, nhận +5đ.", { minRound: 2 }),

  upgrade("diamond-banker", "diamond", "Chủ Ngân Hàng", "Economy", "Cuối mỗi vòng, nhận +5đ cho mỗi 1 người chơi còn sống."),
  upgrade("diamond-venture", "diamond", "Đầu Tư Mạo Hiểm", "Economy", "Đến hết trận, đầu mỗi vòng có thể hy sinh 2đ; nếu thắng pot vòng đó, nhận lại 10đ."),
  upgrade("diamond-lock-pot", "diamond", "Khóa Pot", "Bet", "Đến hết trận, mỗi vòng 1 lần, khi pot đạt 15đ, bạn có thể khóa để không ai được raise thêm."),
  upgrade("diamond-fate-redraw", "diamond", "Bốc Lại Định Mệnh", "Bài", "Đến hết trận, mỗi vòng 1 lần sau khi thấy bài mình, có thể bỏ hand hiện tại và nhận hand mới. Trước khi mở lá 4."),
  upgrade("diamond-third-hidden-card", "diamond", "Bài Ẩn Thứ Ba", "Bài", "Đến hết trận, mỗi vòng bốc thêm 1 lá úp riêng, mở khi showdown; showdown chọn 2 trong 3 lá."),
  upgrade("diamond-luck-blocker", "diamond", "Chặn Vận May", "Bài", "Đến hết trận, mỗi vòng 1 lần, hủy hiệu ứng đổi bài, bốc lại hoặc xem bài của người khác."),
  upgrade("diamond-rage-scaling", "diamond", "Càng Thua Càng Mạnh", "Comeback", "Từ vòng 2: mỗi lần thua showdown tích 1 điểm; khi thắng nhận +5đ mỗi điểm rồi xóa.", { minRound: 2 }),
  upgrade("diamond-survival-cover", "diamond", "Bảo Hiểm Sinh Tồn", "Comeback", "Mỗi vòng, nếu bắt đầu dưới 6đ, bạn có thể đổi 1 lá trong hand mà không thể cản phá.", { minRound: 2 }),
  upgrade("diamond-rich-assassin", "diamond", "Sát Thủ Nhà Giàu", "Top 1", "Từ vòng 2: nếu thắng pot có người nhiều tiền nhất tham gia, lấy thêm 7đ trực tiếp từ họ.", { minRound: 2 }),
  upgrade("diamond-steal-interest", "diamond", "Cướp Lợi Tức", "Top 1", "Từ vòng 2: mỗi vòng chọn 1 người; nhận toàn bộ lợi tức của họ, tối đa +5đ.", { minRound: 2 }),
  upgrade("diamond-fate-coin", "diamond", "Đồng Xu Định Mệnh", "Chaos", "Đến hết trận, mỗi vòng 1 lần, khi thua showdown mở 1 lá bài; lá đỏ hoàn lại 50% số đã bet."),
  upgrade("diamond-revive", "diamond", "Hồi Sinh Kim Cương", "Comeback", "Từ vòng 2 đến hết trận: nếu về 0đ, hồi sinh với 12đ. Sau mỗi lần hồi sinh, lần sau hồi ít hơn 4đ.", { minRound: 2 }),
  upgrade("diamond-danger-compound", "diamond", "Lãi Kép Nguy Hiểm", "Economy", "Lợi tức +5, nhận 20đ."),
  upgrade("diamond-giant-pot", "diamond", "Pot Khổng Lồ", "Bet", "Nếu pot đạt ít nhất 15đ, bạn nhận thêm +7đ nếu thắng pot."),
  upgrade("diamond-royal-bounty", "diamond", "Bounty Hoàng Gia", "Top 1", "Từ vòng 2: top 1 bị đặt bounty 8đ; ai thắng pot có họ tham gia nhận bounty.", { minRound: 2 }),
  upgrade("diamond-jungle-rule", "diamond", "Luật Rừng", "Chaos", "Đến hết trận, mỗi vòng 1 lần, chọn luật phụ: không raise sau khi mở lá 4, không fold sau call, hoặc bet đầu 6đ."),
  upgrade("diamond-interest-engine", "diamond", "Động Cơ Lợi Tức", "Economy", "Đến hết trận, sau khi nhận lợi tức, nếu bạn không thắng vòng đó, nhận thêm +2đ."),
  upgrade("diamond-black-card", "diamond", "Thẻ Đen", "Economy", "Đến hết trận, mỗi vòng 1 lần, mua 1 quyền: trả 2đ để đổi 1 lá bài, xem trước 2 lá vòng bet đầu, hoặc bắt 1 người phải chơi blind bet."),
  upgrade("diamond-pot-alchemy", "diamond", "Giả Kim Pot", "Economy", "Khi pot đạt ít nhất 12đ, bạn có thể fold và nhận hoàn tiền 100%. Quá 20đ không còn quyền."),
  upgrade("diamond-final-table", "diamond", "Bàn Chung Kết", "Bet", "Mỗi vòng, lần đầu bạn raise sau khi đã có ít nhất 3 người vào pot sẽ ép mỗi người theo thêm 5đ."),
  upgrade("diamond-blood-price", "diamond", "Giá Máu", "Bet", "Nếu bạn thắng pot mà đã có người all-in, nhận thêm +20đ."),
  upgrade("diamond-iron-bankroll", "diamond", "Bankroll Thép", "Bet", "Mỗi vòng 1 lần, nếu một bet khiến bạn còn dưới 3đ, tặng bạn 7đ để all-in."),
  upgrade("diamond-oracle", "diamond", "Tiên Tri", "Thông tin", "Mỗi vòng trước bet đầu, xem bài của người nhiều điểm nhất."),
  upgrade("diamond-perfect-mulligan", "diamond", "Mulligan Hoàn Hảo", "Bài", "Đến hết trận, mỗi vòng, được chia 2 cửa, chỉ cần bet như 1 cửa. Không còn nhận lợi tức nữa."),
  upgrade("diamond-split-destiny", "diamond", "Chia Đôi Định Mệnh", "Bài", "Đến hết trận, trước showdown mỗi vòng, chọn giữ hand hiện tại hoặc bốc hand mới. Nếu bốc mới, phải theo kết quả mới."),
  upgrade("diamond-underdog-contract", "diamond", "Khế Ước Kèo Dưới", "Comeback", "Thắng nhận thêm +10đ.", { minRound: 2 }),
  upgrade("diamond-crown-tax", "diamond", "Thuế Vương Miện", "Top 1", "Từ vòng 2: mỗi khi top 1 thắng pot, họ nộp 4đ vào bounty chung. Người hạ họ lấy bounty.", { minRound: 2 }),
  upgrade("diamond-throne-breaker", "diamond", "Phá Ngai", "Top 1", "Nếu ghép được 3636, AK47, A2A2 sẽ mạnh như tứ quý.", { minRound: 2 }),

  upgrade("cheat-death-hand", "cheat", "Ván Bài Tử Thần", "Siêu lỗi", "Đến hết trận, mỗi khi bạn thắng pot từ 15đ trở lên, nhận thêm +6đ và người thua nhiều nhất mất thêm 4đ."),
  upgrade("cheat-no-limit-crown", "cheat", "Vương Miện No Limit", "Snowball", "Đến hết trận, mọi raise đầu tiên của bạn mỗi vòng có tối thiểu +4đ; nếu thắng pot, nhận thêm +12đ."),
  upgrade("cheat-royal-treasury", "cheat", "Kho Bạc Gian Lận", "Economy", "Đến hết trận, mỗi khi lợi tức của bạn chạm trần 5đ, đặt 1 dấu kho bạc. Đủ 2 dấu nhận +10đ."),
  upgrade("cheat-grand-auction", "cheat", "Kẻ Bao Đồng", "Bài", "Chỉ được chơi bài mù, nhưng được xem bài người khác."),
  upgrade("cheat-time-walk", "cheat", "Đi Ngược Thời Gian", "Bài", "Đến hết trận, mỗi vòng 1 lần, sau khi đổi bài bất lợi cho bạn, được đổi thêm lần nữa."),
  upgrade("cheat-mirror-match", "cheat", "Gương Đỏ", "Copy", "Đến hết trận, mỗi vòng 1 lần, sao chép 1 hiệu ứng người mà khác sử dụng."),
  upgrade("cheat-finisher", "cheat", "Đòn Kết Liễu Đỏ", "Snowball", "Nếu thắng một người khiến họ về 0đ, nhận thêm +10đ và +3đ lợi tức."),
  upgrade("cheat-phoenix-debt", "cheat", "Nợ Phượng Hoàng Đỏ", "Comeback", "Lần đầu về 0đ, hồi sinh với 30đ.",
  upgrade("cheat-house-edge", "cheat", "Nhà Cái Đứng Sau", "Snowball", "Nhận ngay 100đ, không được nhận lợi tức hay thu nhập nữa."),
  upgrade("cheat-rigged-deck", "cheat", "Bộ Bài Đã Xếp", "Bài", "Đến hết trận, mỗi vòng 1 lần sau khi xem bài, được bốc lại toàn bộ hand; nếu hand mới thắng, nhận thêm +3đ."),
  upgrade("cheat-insider-trading", "cheat", "Giao Dịch Nội Gián", "Thông tin", "Đến hết trận, mỗi vòng 1 lần trước showdown, xem bài của 1 người rồi được quyền fold và hoàn lại 50% số đã bet."),
  upgrade("cheat-blood-all-in", "cheat", "All-in Máu Lạnh", "Bet", "Đến hết trận, nếu all-in thắng, nhận thêm thưởng bằng 35% pot, tối đa +8đ; nếu thua, hoàn 20%. Không thể all-in 2 vấn liên tiếp."),
  upgrade("cheat-crown-swap", "cheat", "Đổi Ngai", "Top 1", "Từ vòng 2: nếu thắng pot có top 1 tham gia, chuyển 20% điểm từ họ sang bạn.", { minRound: 2 }),
  upgrade("cheat-tax-raid", "cheat", "Đột Kích Kho Bạc", "Economy", "Đến hết trận, cuối mỗi vòng lấy 4đ từ mỗi người đang có ít nhất 18đ."),
  upgrade("cheat-double-core", "cheat", "Lõi Kép Bất Hợp Pháp", "Draft", "Đến hết trận, các lõi bạc, vàng của bạn x2 sức mạnh."),
  upgrade("cheat-forged-interest", "cheat", "Lãi Giả", "Economy", "Đến hết trận, bắt đầu mỗi vòng nhận 10đ, không còn nhận lợi tức."),
  upgrade("cheat-blackmail", "cheat", "Tống Tiền", "Thông tin", "Đến hết trận, đầu mỗi vòng chọn 1 người: họ đưa bạn 4đ hoặc công khai sức mạnh hand theo yếu/trung bình/mạnh."),
  upgrade("cheat-royal-immunity", "cheat", "Miễn Tội Hoàng Gia", "Phòng thủ", "Đến hết trận, mỗi vòng lần đầu bạn thua pot, hoàn lại tối đa 3đ từ phần đã bet."),
  upgrade("cheat-bank-heist", "cheat", "Cướp Ngân Hàng", "Economy", "Nhận ngay +8đ. Đến hết trận, mỗi khi bạn thắng pot, gửi thêm 5đ vào kho; đủ 30đ trong kho thì đổi lấy quyền all-in giảm giá 50%."),
  upgrade("cheat-scripted-river", "cheat", "Song Kiếm Tai Ương", "Bài", "Bài của bạn luôn là bài đôi, lấy theo lá cao hơn của hand. Không được raise."),
  upgrade("cheat-infinite-reraise", "cheat", "Raise Vô Hạn", "Bet", "Khi bạn raise thì người khác buộc phải theo, không được fold."),
  upgrade("cheat-contract-killer", "cheat", "Hợp Đồng Sát Thủ", "Bounty", "Đến hết trận, đầu mỗi vòng chọn 1 mục tiêu. Nếu họ mất ít nhất 5đ vì bạn, nhận thêm +8đ."),
  upgrade("cheat-corrupt-dealer", "cheat", "Dealer Bị Mua", "Bài", "Đến hết trận, mỗi vòng 1 lần, yêu cầu chia lại 1 lá cho bạn hoặc cho một đối thủ trước showdown."),
  upgrade("cheat-red-jackpot", "cheat", "Jackpot Đỏ", "Snowball", "Đến hết trận, nếu thắng pot có ít nhất 4 người tham gia, nhận thêm +8đ."),
  upgrade("cheat-anti-gravity", "cheat", "Bankroll Không Trọng Lực", "Economy", "Đến hết trận, lợi tức của bạn không có giới hạn."),
  upgrade("cheat-perfect-crime", "cheat", "Tội Ác Hoàn Hảo", "Bet", "Đến hết trận, lần đầu mỗi vòng sau khi thắng pot, lấy thêm +8đ; hiệu ứng này không thể bị sao chép hoặc chặn."),
];

let state = loadState();
let toastTimer = null;
let audioContext = null;
let serverState = {
  connected: false,
  isHost: false,
  gameId: null,
  round: 0,
  phase: "offline",
  currentTier: "silver",
  nextTier: null,
  blockedCardIds: [],
  selectedThisRound: [],
  offerSignatures: [],
};
const hostToken = new URLSearchParams(window.location.search).get("host") || "";
const playerId = getOrCreatePlayerId();

const elements = {};

document.addEventListener("DOMContentLoaded", () => {
  bindElements();
  bindEvents();
  initServerSync();
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
  elements.choiceSection = document.querySelector("#choiceSection");
  elements.handPanel = document.querySelector("#handPanel");
  elements.hostPanel = document.querySelector("#hostPanel");
  elements.nextTierButtons = document.querySelectorAll("[data-action='select-next-tier']");
  elements.nextTierLabel = document.querySelector("#nextTierLabel");
  elements.blockedLabel = document.querySelector("#blockedLabel");
  elements.hostButton = document.querySelector('[data-action="toggle-host"]');
  elements.soundButton = document.querySelector('[data-action="toggle-sound"]');
  elements.toast = document.querySelector("#toast");
}

function bindEvents() {
  document.addEventListener("click", handleActionClick);

  elements.nameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    savePlayerName(elements.playerNameInput.value.trim());
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
    gameId: null,
    playerName: "",
    round: 1,
    soundEnabled: true,
    cards: defaultCards.map((card) => ({ ...card, remaining: card.copies })),
    offer: [],
    hand: [],
    nextTier: null,
    roundTierOverrides: {},
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
      minRound: clamp(Math.floor(Number(card.minRound) || 1), 1, 99),
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
    gameId: savedState.gameId ? String(savedState.gameId) : null,
    playerName: String(savedState.playerName || ""),
    round: clamp(Number(savedState.round) || fallback.round, 1, 99),
    soundEnabled: savedState.soundEnabled !== false,
    cards: normalizedCards,
    offer,
    hand,
    nextTier: normalizeTier(savedState.nextTier) || ratesToTier(savedState.nextRates),
    roundTierOverrides: normalizeTierOverrides(savedState.roundTierOverrides, savedState.roundRateOverrides),
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

function normalizeTier(value) {
  return tierOrder.includes(value) ? value : null;
}

function normalizeDraftTier(value) {
  return draftTierOrder.includes(value) ? value : null;
}

function ratesToTier(value) {
  if (!value || typeof value !== "object") return null;
  const entries = draftTierOrder.map((tier) => [tier, Number(value[tier]) || 0]);
  const [bestTier, bestValue] = entries.sort((first, second) => second[1] - first[1])[0];
  return bestValue > 0 ? bestTier : null;
}

function normalizeTierOverrides(tierOverrides, rateOverrides) {
  const normalized = {};
  if (tierOverrides && typeof tierOverrides === "object") {
    Object.entries(tierOverrides).forEach(([round, tier]) => {
      const normalizedTier = normalizeDraftTier(tier);
      if (normalizedTier) normalized[String(clamp(Number(round) || 1, 1, 99))] = normalizedTier;
    });
  }
  if (rateOverrides && typeof rateOverrides === "object") {
    Object.entries(rateOverrides).forEach(([round, rates]) => {
      const key = String(clamp(Number(round) || 1, 1, 99));
      if (!normalized[key]) {
        const tier = ratesToTier(rates);
        if (tier) normalized[key] = tier;
      }
    });
  }
  return normalized;
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
  const appVisible = hasName || serverState.isHost;
  elements.nameGate.hidden = appVisible;
  elements.playerApp.hidden = !appVisible;
  elements.playerNameInput.value = hasName ? state.playerName : elements.playerNameInput.value;
  elements.hostButton.hidden = !serverState.isHost;
  elements.hostPanel.hidden = !serverState.isHost || elements.hostPanel.hidden;
  document.querySelectorAll('[data-action="new-offer"]').forEach((button) => {
    button.hidden = !serverState.isHost && serverState.connected;
  });
  renderSoundButton();

  if (!appVisible) {
    syncIcons();
    return;
  }

  const isHostOnly = serverState.isHost && !hasName;
  elements.choiceSection.hidden = isHostOnly;
  elements.handPanel.hidden = isHostOnly;
  elements.playerNameDisplay.textContent = isHostOnly ? "Quản trò" : state.playerName;
  elements.roundLabel.textContent = serverState.connected
    ? (serverState.round ? `Vòng chọn ${serverState.round}` : "Chưa mở vòng")
    : `Vòng chọn ${state.round}`;
  elements.statusLabel.textContent = getStatusLabel();
  elements.choiceCount.textContent = state.offer.length ? `${state.offer.length}/3` : "0/3";

  renderTierBars();
  renderHostPanel();
  if (!isHostOnly) {
    renderOffer();
    renderHand();
  }
  syncIcons();
}

function getStatusLabel() {
  if (!serverState.connected) return state.offer.length ? "Đang chọn" : "Đã chọn";
  if (serverState.isHost) return serverState.phase === "open" ? "Vòng đang mở" : "Đang chờ";
  if (!state.playerName.trim()) return "Nhập tên";
  if (serverState.phase !== "open") return "Chờ quản trò";
  if (hasSelectedRound(serverState.round)) return "Đã chọn";
  return state.offer.length ? "Đang chọn" : "Chờ bốc";
}

function renderTierBars() {
  const rates = getDisplayTierRates();

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
  if (serverState.connected && serverState.phase !== "open") {
    elements.draftBoard.style.setProperty("--draft-columns", 1);
    elements.draftBoard.innerHTML = `
      <div class="empty-choice">
        <i data-lucide="hourglass"></i>
        <strong>Chờ quản trò</strong>
        <span>Vòng chọn mới chưa được mở.</span>
      </div>
    `;
    return;
  }

  if (!state.offer.length) {
    elements.draftBoard.style.setProperty("--draft-columns", 1);
    elements.draftBoard.innerHTML = `
      <div class="empty-choice">
        <i data-lucide="badge-check"></i>
        <strong>Vòng này đã xong</strong>
        <span>Thẻ đã nằm trong bộ của bạn.</span>
        <button class="primary-button" type="button" data-action="new-offer" ${serverState.connected && !serverState.isHost ? "hidden" : ""}>
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

async function initServerSync() {
  await refreshServerState();
  window.setInterval(refreshServerState, 1000);
}

async function refreshServerState() {
  try {
    const query = hostToken ? `?host=${encodeURIComponent(hostToken)}` : "";
    const response = await fetch(`/api/state${query}`, { cache: "no-store" });
    if (!response.ok) throw new Error("state fetch failed");
    const nextState = await response.json();
    const nextGameId = nextState.gameId ? String(nextState.gameId) : null;
    if (nextGameId) {
      syncLocalGameId(nextGameId);
    }
    serverState = {
      connected: true,
      isHost: Boolean(nextState.isHost),
      gameId: nextGameId,
      round: Number(nextState.round) || 0,
      phase: String(nextState.phase || "waiting"),
      currentTier: normalizeTier(nextState.currentTier) || ratesToTier(nextState.currentRates) || "silver",
      nextTier: normalizeTier(nextState.nextTier) || ratesToTier(nextState.nextRates),
      blockedCardIds: Array.isArray(nextState.blockedCardIds) ? nextState.blockedCardIds : [],
      selectedThisRound: Array.isArray(nextState.selectedThisRound)
        ? nextState.selectedThisRound.map((item) => item.cardId).filter(Boolean)
        : [],
      offerSignatures: Array.isArray(nextState.offerSignatures) ? nextState.offerSignatures : [],
    };
    syncWithServerState();
    render();
  } catch (error) {
    if (serverState.connected) {
      serverState = { ...serverState, connected: false, isHost: false, phase: "offline" };
      render();
    }
  }
}

function syncLocalGameId(gameId) {
  if (state.gameId === gameId) return;

  if (!state.gameId) {
    state.gameId = gameId;
    saveState();
    return;
  }

  resetLocalGame(gameId);
}

function resetLocalGame(gameId) {
  const playerName = state.playerName;
  const soundEnabled = state.soundEnabled;
  state = createDefaultState();
  state.gameId = gameId;
  state.playerName = playerName;
  state.soundEnabled = soundEnabled;
  saveState();
}

async function apiPost(path, payload = {}) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, hostToken }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "request failed");
  }
  await refreshServerState();
  return data;
}

function syncWithServerState() {
  if (!serverState.connected || !state.playerName.trim()) return;

  if (serverState.phase !== "open") {
    state.offer = [];
    saveState();
    return;
  }

  if (state.round !== serverState.round) {
    state.round = serverState.round;
    state.offer = [];
    if (!hasSelectedRound(serverState.round)) {
      createOffer(false);
    }
    saveState();
    return;
  }

  if (!state.offer.length && !hasSelectedRound(serverState.round)) {
    createOffer(false);
    saveState();
  }
}

function renderHostPanel() {
  const currentRound = serverState.connected ? serverState.round : state.round;
  const nextDefaultTier = getPresetRoundTier(currentRound + 1);
  const pendingTier = serverState.connected ? serverState.nextTier : state.nextTier;
  const selectedTier = pendingTier || nextDefaultTier;

  elements.nextTierButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.tier === selectedTier));
  });

  if (pendingTier) {
    elements.nextTierLabel.textContent = `Vòng ${currentRound + 1}: toàn bộ thẻ ${tierInfo[pendingTier].label}.`;
  } else {
    elements.nextTierLabel.textContent = `Vòng ${currentRound + 1}: mặc định ${tierInfo[nextDefaultTier].label}.`;
  }

  const block = serverState.connected
    ? serverState.selectedThisRound || []
    : getActiveNextRoundBlock(currentRound + 1);
  if (!block.length) {
    elements.blockedLabel.textContent = "Không có thẻ bị khóa ở vòng kế tiếp.";
    return;
  }

  const blockedNames = block.map((cardId) => getCard(cardId)?.name).filter(Boolean).join(", ");
  elements.blockedLabel.textContent = `Vòng ${currentRound + 1} khóa: ${blockedNames}.`;
}

function handleActionClick(event) {
  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;

  const { action, slotIndex, tier } = actionTarget.dataset;

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
    case "select-next-tier":
      saveNextTier(tier);
      break;
    case "host-new-game":
      startHostNewGame();
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
  if (!serverState.connected && !state.offer.length && !state.hand.length) {
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

async function startNewOffer() {
  if (serverState.connected) {
    if (!serverState.isHost) {
      playSound("error");
      showToast("Chờ quản trò mở vòng mới.");
      return;
    }
    try {
      await apiPost("/api/host/open");
      playSound("deal");
      showToast(`Đã mở vòng ${serverState.round}.`);
    } catch (error) {
      playSound("error");
      showToast("Không mở được vòng mới.");
    }
    return;
  }

  createOffer(state.hand.length > 0 || state.offer.length > 0);
  playSound("deal");
  saveAndRender();
}

function createOffer(advanceRound) {
  const availableCards = state.cards.filter((card) => canDraftCard(card));
  if (!availableCards.length) {
    state.offer = [];
    playSound("error");
    showToast("Pool đã hết lõi.");
    return;
  }

  if (advanceRound) {
    state.round = clamp(state.round + 1, 1, 99);
  }

  if (!serverState.connected) {
    applyNextTierForCurrentRound();
  }
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

function applyNextTierForCurrentRound() {
  if (!state.nextTier) return;
  state.roundTierOverrides[String(state.round)] = state.nextTier;
  state.nextTier = null;
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
  if (serverState.connected && serverState.round === state.round) {
    return serverState.blockedCardIds || [];
  }
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
  if (serverState.connected && serverState.round === round && serverState.offerSignatures.includes(signature)) {
    return true;
  }
  return state.offerHistory.some((item) => item.round === round && item.signature === signature);
}

function recordOfferSignature(offer) {
  const signature = getOfferSignature(offer);
  if (!signature || isOfferSignatureUsed(state.round, signature)) return;
  state.offerHistory.push({ round: state.round, signature });
  state.offerHistory = state.offerHistory
    .filter((item) => item.round >= state.round - 2)
    .slice(-120);
  if (serverState.connected && serverState.phase === "open") {
    fetch("/api/offer-signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ round: state.round, signature, playerId }),
    }).catch(() => {});
  }
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
  if (serverState.connected) {
    fetch("/api/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerId,
        playerName: state.playerName,
        round: state.round,
        cardId: card.id,
      }),
    }).catch(() => {});
  } else {
    blockCardForNextRound(card.id);
  }
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

  let pool = state.cards.filter((card) => card.tier === tier && canDraftCard(card) && !usedIds.has(card.id));

  if (!pool.length) return null;

  return pickWeighted(pool.map((card) => ({ value: card, weight: card.remaining })));
}

function resetState() {
  const confirmed = window.confirm("Reset tên, thẻ đã chọn và vòng hiện tại?");
  if (!confirmed) return;
  const currentGameId = state.gameId;
  state = createDefaultState();
  state.gameId = currentGameId;
  playSound("reset");
  saveAndRender();
  showToast("Đã reset.");
}

async function startHostNewGame() {
  if (!serverState.connected || !serverState.isHost) {
    playSound("error");
    showToast("Chỉ thiết bị quản trò được tạo ván mới.");
    return;
  }

  const confirmed = window.confirm("Tạo ván mới cho toàn bộ bàn? Người chơi sẽ mất bộ thẻ hiện tại.");
  if (!confirmed) return;

  try {
    const previousGameId = state.gameId;
    await apiPost("/api/host/new-game");
    if (state.gameId === previousGameId && serverState.gameId) {
      resetLocalGame(serverState.gameId);
    }
    playSound("reset");
    showToast("Đã tạo ván mới.");
    render();
  } catch (error) {
    playSound("error");
    showToast("Không tạo được ván mới.");
  }
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

async function saveNextTier(tier) {
  const nextTier = normalizeDraftTier(tier);
  if (!nextTier) return;

  if (serverState.connected) {
    if (!serverState.isHost) {
      playSound("error");
      showToast("Chỉ thiết bị quản trò được chọn loại thẻ.");
      return;
    }
    try {
      await apiPost("/api/host/tier", { tier: nextTier });
      playSound("select");
      showToast(`Vòng ${serverState.round + 1} sẽ là ${tierInfo[nextTier].label}.`);
    } catch (error) {
      playSound("error");
      showToast("Không lưu được loại thẻ.");
    }
    return;
  }

  state.nextTier = nextTier;
  playSound("select");
  saveAndRender();
  showToast(`Vòng ${state.round + 1} sẽ là ${tierInfo[nextTier].label}.`);
}

function saveAndRender() {
  saveState();
  render();
}

function getRoundRates(round) {
  if (serverState.connected && serverState.round === round) {
    return tierRates[serverState.currentTier] || tierRates.silver;
  }
  return tierRates[getRoundTier(round)] || tierRates.silver;
}

function getRoundTier(round) {
  return state.roundTierOverrides?.[String(round)] || getPresetRoundTier(round);
}

function getPresetRoundTier(round) {
  return defaultRoundTiers[Math.min(round, defaultRoundTiers.length) - 1] || defaultRoundTiers[defaultRoundTiers.length - 1];
}

function getEffectiveTierRates() {
  const rawRates = getRoundRates(state.round);
  const cheatRate = getTierAvailableRemaining("cheat") > 0 ? CHEAT_ROLL_CHANCE : 0;
  const normalScale = 1 - cheatRate;

  return Object.fromEntries(tierOrder.map((tier) => {
    if (tier === "cheat") return [tier, cheatRate];
    return [tier, ((rawRates[tier] || 0) / 100) * normalScale];
  }));
}

function getDisplayTierRates() {
  const effectiveRates = getEffectiveTierRates();
  return Object.fromEntries(tierOrder.map((tier) => [tier, Math.round((effectiveRates[tier] || 0) * 100)]));
}

function getSlotChanceForCard(card) {
  if (!canDraftCard(card)) return 0;
  const tierTotal = getTierRemaining(card.tier).remaining;
  if (!tierTotal) return 0;
  const effectiveRates = getEffectiveTierRates();
  return effectiveRates[card.tier] * (card.remaining / tierTotal);
}

function getTierRemaining(tier) {
  return state.cards
    .filter((card) => card.tier === tier && card.minRound <= state.round)
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
    .filter((card) => card.tier === tier && canDraftCard(card) && !blockedIds.has(card.id))
    .reduce((sum, card) => sum + card.remaining, 0);
}

function canDraftCard(card) {
  return Boolean(card && card.remaining > 0 && (card.minRound || 1) <= state.round);
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

function getOrCreatePlayerId() {
  const key = "poker-tactics-player-id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = createId("player");
    localStorage.setItem(key, id);
  }
  return id;
}

function hasSelectedRound(round) {
  return state.hand.some((pick) => Number(pick.round) === Number(round));
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
