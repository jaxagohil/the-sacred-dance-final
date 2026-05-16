import { MirrorKey } from "../lib/i18n/index";

type PatternState = {
  id: string;
  baseline: number;
  active: number;
  state: "reinforcing" | "dormant" | "emerging" | "neutral";
  trend: "rising" | "healing" | "stable";
  recent?: number;
  older?: number;
};

type ScoredPattern = PatternState & {
  score: number;
};

type MirrorResult = {
  primary: PatternState | null;
  secondary?: PatternState | null;
  key: MirrorKey | null;
};

export function interpretMirror(
  patterns: PatternState[]
): MirrorResult | null {
  if (!patterns || patterns.length === 0) return null;

  // ---------------------------
  // STEP 1: Score patterns
  // ---------------------------
  const scored: ScoredPattern[] = patterns.map((p) => {
    const score =
      (p.active || 0) * 1.5 +
      (p.baseline || 0) * 1.0 +
      (p.state === "reinforcing" ? 1.2 : 0) +
      (p.trend === "rising" ? 1.5 : 0);

    return { ...p, score };
  });

  // ---------------------------
  // STEP 2: Sort (safe copy)
  // ---------------------------
  const sorted = [...scored].sort((a, b) => b.score - a.score);

  const primary = sorted[0] || null;
  const secondary = sorted[1] || null;

  // ---------------------------
  // STEP 3: Key (not message)
  // ---------------------------
  const key = getPatternKey(primary);

  return {
    primary,
    secondary,
    key,
  };
}

// ---------------------------
// 🔑 KEY LAYER (replaces message)
// ---------------------------
function getPatternKey(
  p: PatternState | null
): MirrorKey | null {
  if (!p) return null;

  const recent = p.recent || 0;
  const older = p.older || 0;

  const risingStrength = older > 0 ? recent / older : recent;
  const healingStrength = recent > 0 ? older / recent : older;

  const isStrongRising = risingStrength > 1.8;
  const isStrongHealing = healingStrength > 1.8;

  // reinforcing + rising
  if (p.state === "reinforcing" && p.trend === "rising") {
    return isStrongRising
      ? "reinforcing_rising_strong"
      : "reinforcing_rising_soft";
  }

  // reinforcing + healing
  if (p.state === "reinforcing" && p.trend === "healing") {
    return isStrongHealing
      ? "reinforcing_healing_strong"
      : "reinforcing_healing_soft";
  }

  // emerging + rising
  if (p.state === "emerging" && p.trend === "rising") {
    return isStrongRising
      ? "emerging_rising_strong"
      : "emerging_rising_soft";
  }

  // dormant
  if (p.state === "dormant") {
    return "dormant";
  }

  // general healing
  if (p.trend === "healing") {
    return isStrongHealing
      ? "healing_strong"
      : "healing_soft";
  }

  // default
  return "default";
}