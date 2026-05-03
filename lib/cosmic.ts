// /src/lib/cosmic.ts

export function getCosmicData() {
  const now = new Date();

  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();

  const sun = getSunSign(month, day);
  const phase = getMoonPhase(now);
  const moon = getMoonSignApprox(now);

  return {
    sun,
    moon,
    phase,
    sunEnergy: getSunEnergy(sun),
  };
}

// 🌞 SUN SIGN
function getSunSign(month: number, day: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

// 🌙 ONLY 4 PHASES
function getMoonPhase(date: Date): string {
  const synodicMonth = 29.53058867;
  const knownNewMoon = new Date("2024-01-11T11:57:00Z");

  const daysSince =
    (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);

  const phase = daysSince % synodicMonth;

  if (phase < 1.84566 || phase > 27.68493) return "New";
  if (phase < 12.91963) return "Waxing";
  if (phase < 16.61096) return "Full";
  return "Waning";
}

// 🌙 MOON SIGN (approx)
function getMoonSignApprox(date: Date): string {
  const signs = [
    "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
    "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
  ];

  const baseDate = new Date("2024-01-01T00:00:00Z");

  const days = Math.floor(
    (date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const index = Math.floor(days / 2.3) % 12;

  return signs[(index + 12) % 12];
}

// ⚡ SUN ENERGY
function getSunEnergy(sign: string): string {
  const map: Record<string, string> = {
    Aries: "Initiate",
    Taurus: "Ground",
    Gemini: "Express",
    Cancer: "Feel",
    Leo: "Shine",
    Virgo: "Refine",
    Libra: "Balance",
    Scorpio: "Transform",
    Sagittarius: "Expand",
    Capricorn: "Build",
    Aquarius: "Innovate",
    Pisces: "Surrender",
  };

  return map[sign] || "Flow";
}

// ---------------------------
// 🧠 INTERPRETATION
// ---------------------------

export function getCosmicInterpretation(
  cosmic: {
    sun: string;
    moon: string;
    phase: string;
    sunEnergy: string;
  },
  energy?: any,
  patterns?: any[]
) {
  const phaseType = getPhaseType(cosmic.phase);
  const topPatterns = getTopPatterns(patterns);

  const moonLine = getMoonLine(cosmic.moon);
  const sunLine = getSunLine(cosmic.sun);
  const energyLine = getEnergyLine(cosmic.sunEnergy, cosmic.phase, energy);

  const phasePattern = buildPhasePatternMeaning({
    phaseType,
    patterns: topPatterns,
  });

  const phaseLine = phasePattern.text;

  const cosmicMessage = enhanceCosmicMessage({
    moonLine,
    phaseLine,
    energyLine,
    phaseType,
    patterns: topPatterns,
  });

  return {
    sunLine,
    moonLine,
    phaseLine,
    energyLine,
    cosmicMessage,
    phaseType,
  };
}

// 🌞 SUN
function getSunLine(sun: string): string {
  return SUN_LINES[sun] || "";
}

const SUN_LINES: Record<string, string> = {
  Aries: "A beginning is present.",
  Taurus: "Stillness holds something.",
  Gemini: "Movement is within.",
  Cancer: "Feeling runs quietly.",
  Leo: "Something seeks light.",
  Virgo: "Attention sharpens here.",
  Libra: "Balance is in question.",
  Scorpio: "Depth pulls inward.",
  Sagittarius: "Something expands outward.",
  Capricorn: "Structure is forming.",
  Aquarius: "The pattern shifts.",
  Pisces: "Edges begin to dissolve.",
};

// 🌙 MOON
function getMoonLine(moon: string): string {
  return MOON_LINES[moon] || "";
}

const MOON_LINES: Record<string, string> = {
  Aries: "Notice what rises before you can stop it.",
  Taurus: "See where you are holding on for safety.",
  Gemini: "Watch what keeps shifting within you.",
  Cancer: "What you feel is asking to be seen.",
  Leo: "Notice what wants to be expressed.",
  Virgo: "See what you are trying to make sense of.",
  Libra: "Notice where you seek balance outside.",
  Scorpio: "What is hidden is asking to surface.",
  Sagittarius: "See where you are reaching for meaning.",
  Capricorn: "Notice what you are holding inside.",
  Aquarius: "See where you are stepping back from feeling.",
  Pisces: "What you feel may not all be yours.",
};

// ⚡ ENERGY
function getEnergyLine(
  sunEnergy: string,
  phase: string,
  energy?: any
): string {
  const base = ENERGY_LINES[sunEnergy];
  const modifier = PHASE_MODIFIERS[phase];

  let line = modifier ? modifier(base) : base;

  const chakra = energy?.dominant_chakra;

  if (chakra === "heart") return "Return to your heart — gently.";
  if (chakra === "throat") return "Something wants to be expressed.";
  if (chakra === "root") return "Come back into your body.";

  return line;
}

const ENERGY_LINES: Record<string, string> = {
  Initiate: "Begin without needing certainty.",
  Ground: "Return to your body.",
  Express: "Let it move through you.",
  Feel: "Allow what is present.",
  Shine: "Be seen without effort.",
  Refine: "Adjust with care.",
  Balance: "Come back to center.",
  Transform: "Let something shift.",
  Expand: "Open your perspective.",
  Build: "Stay steady and present.",
  Innovate: "See it differently.",
  Surrender: "Release control gently.",
};

const PHASE_MODIFIERS: Record<string, (base: string) => string> = {
  New: (base) => base.replace(".", " — gently."),
  Waxing: (base) => "Gently, " + base.toLowerCase(),
  Full: (base) => base.replace(".", " — clearly."),
  Waning: (base) => base.replace(".", " — then let it go."),
};

// 🔁 PHASE × PATTERN
function buildPhasePatternMeaning({
  phaseType,
  patterns,
}: {
  phaseType: string;
  patterns: string[];
}) {
  if (!patterns || patterns.length === 0) {
    return { type: "neutral", text: "" };
  }

  const main = patterns[0];
  const clean = main.replace("_", " ");

  if (phaseType === "amplify") {
    return { type: phaseType, text: `Notice where ${clean} feels stronger.` };
  }

  if (phaseType === "initiate") {
    return { type: phaseType, text: `A new layer of ${clean} is beginning.` };
  }

  if (phaseType === "build") {
    return { type: phaseType, text: `${clean} is taking form.` };
  }

  if (phaseType === "release") {
    return { type: phaseType, text: `${clean} is ready to soften.` };
  }

  return { type: phaseType, text: "" };
}

// 🧠 AI-STYLE SYNTHESIS
function enhanceCosmicMessage({
  moonLine,
  phaseLine,
  energyLine,
  phaseType,
  patterns,
}: any) {
  const parts = [moonLine, phaseLine, energyLine].filter(Boolean);

  let message = parts.join(" ");

  if (phaseType === "amplify") {
    message += " This may feel stronger than usual.";
  }

  if (phaseType === "release") {
    message += " You do not need to hold this.";
  }

  if (patterns?.length) {
    const p = patterns[0].replace("_", " ");
    message += ` This may be connected to ${p}.`;
  }

  return message;
}

// HELPERS
function getPhaseType(phase: string) {
  if (phase === "Full") return "amplify";
  if (phase === "New") return "initiate";
  if (phase === "Waxing") return "build";
  if (phase === "Waning") return "release";
  return "observe";
}

function getTopPatterns(patterns: any[]) {
  if (!patterns || patterns.length === 0) return [];

  return patterns
    .sort((a, b) => (b.active || 0) - (a.active || 0))
    .slice(0, 2)
    .map((p) => p.id);
}