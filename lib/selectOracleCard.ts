import { ORACLE_CARDS } from "./oracleCards";

// ✅ infer type from array
type OracleCard = (typeof ORACLE_CARDS)[number];

type SelectionContext = {
  patterns?: string[];
  distortion?: string[];
  lens?: string;
  chakra?: string;
  cosmic?: {
    moon?: string;
    sign?: string;
    energy?: string;
  };
};

// ✅ FIXED TYPE
function mapPatternToTheme(patterns: string[] = []): OracleCard["theme"] {
  const p = patterns.join(" ").toLowerCase();

  if (p.includes("abandon") || p.includes("inner child")) return "healing";
  if (p.includes("control") || p.includes("fear")) return "masculine";
  if (p.includes("intuition") || p.includes("soft")) return "feminine";
  if (p.includes("purpose") || p.includes("destiny")) return "soul";
  if (p.includes("synchronicity") || p.includes("timing")) return "cosmic";
  if (p.includes("relationship") || p.includes("mirror")) return "ascension";
  if (p.includes("boundary") || p.includes("energy")) return "energy";
  if (p.includes("trust") || p.includes("divine")) return "divine";

  return "soul";
}

// 🧠 weighted random helper
function weightedPick(cards: (OracleCard & { weight: number })[]): OracleCard {
  const total = cards.reduce((sum, c) => sum + c.weight, 0);
  let rand = Math.random() * total;

  for (let c of cards) {
    rand -= c.weight;
    if (rand <= 0) return c;
  }

  return cards[0];
}

export function selectOracleCard(context: SelectionContext): OracleCard {
  const theme = mapPatternToTheme(context.patterns);

  const basePool =
    ORACLE_CARDS.filter((c) => c.theme === theme) || ORACLE_CARDS;

  const patterns = (context.patterns || []).join(" ").toLowerCase();
  const distortion = (context.distortion || []).join(" ").toLowerCase();
  const chakra = context.chakra;

  const weighted = basePool.map((card) => {
    let weight = 1;

    // 🔥 theme match
    if (card.theme === theme) weight += 3;

    // 🧠 pattern
    if (patterns.includes("abandon") && card.theme === "healing") weight += 3;
    if (patterns.includes("control") && card.theme === "masculine") weight += 2;
    if (patterns.includes("intuition") && card.theme === "feminine") weight += 2;

    // ⚠️ distortion
    if (distortion.includes("overthinking") && card.theme === "masculine") weight += 2;
    if (distortion.includes("seeking") && card.theme === "feminine") weight += 1;

    // 🌈 chakra (if exists)
    if ((card as any).chakra && chakra && (card as any).chakra === chakra) {
      weight += 2;
    }

    // 🌌 cosmic (light)
    if (context.cosmic?.energy === "grounding" && card.theme === "energy") {
      weight += 1;
    }

    if (context.cosmic?.energy === "expansion" && card.theme === "soul") {
      weight += 1;
    }

    return { ...card, weight };
  });

  return weightedPick(weighted);
}