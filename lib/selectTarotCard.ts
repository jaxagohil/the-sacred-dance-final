import { TAROT_CARDS } from "./tarotCards";

type SelectionContext = {
  patterns?: string[];
  distortion?: string[];
};

function mapToSuit(context: SelectionContext) {
  const combined = [
    ...(context.patterns || []),
    ...(context.distortion || []),
  ].join(" ").toLowerCase();

  if (combined.includes("emotion") || combined.includes("intuition")) return "cups";
  if (combined.includes("overthinking") || combined.includes("fear") || combined.includes("anxiety")) return "swords";
  if (combined.includes("action") || combined.includes("drive") || combined.includes("purpose")) return "wands";
  if (combined.includes("ground") || combined.includes("money") || combined.includes("stability")) return "pentacles";

  return "major";
}

// 🧠 weighted pick
function weightedPick(cards: any[]) {
  const total = cards.reduce((sum, c) => sum + c.weight, 0);
  let rand = Math.random() * total;

  for (let c of cards) {
    rand -= c.weight;
    if (rand <= 0) return c;
  }

  return cards[0];
}

export function selectTarotCard(context: SelectionContext) {
  const suit = mapToSuit(context);

  const patterns = (context.patterns || []).join(" ").toLowerCase();
  const distortion = (context.distortion || []).join(" ").toLowerCase();

  // 🎯 base pool
  const basePool =
    suit === "major"
      ? TAROT_CARDS.filter((c) => c.arcana === "major")
      : TAROT_CARDS.filter((c) => c.suit === suit);

  const weighted = basePool.map((card) => {
    let weight = 1;

    // 🔥 suit match boost
    if (card.suit === suit) weight += 3;

    // 🧠 emotional patterns → cups
    if (
      (patterns.includes("emotion") || patterns.includes("intuition")) &&
      card.suit === "cups"
    ) {
      weight += 2;
    }

    // ⚠️ overthinking → swords
    if (
      (distortion.includes("overthinking") || distortion.includes("anxiety")) &&
      card.suit === "swords"
    ) {
      weight += 3;
    }

    // ⚡ action / purpose → wands
    if (
      (patterns.includes("purpose") || patterns.includes("drive")) &&
      card.suit === "wands"
    ) {
      weight += 2;
    }

    // 🌱 grounding → pentacles
    if (
      (patterns.includes("stability") || patterns.includes("money")) &&
      card.suit === "pentacles"
    ) {
      weight += 2;
    }

    // 🔮 major arcana = deeper moments
    if (card.arcana === "major") {
      weight += 1; // subtle bias
    }

    return { ...card, weight };
  });

  return weightedPick(weighted);
}