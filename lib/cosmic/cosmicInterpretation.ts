// /lib/cosmic/cosmicInterpretation.ts

export function getCosmicInterpretation({

  dailyField,

  energy,

  patterns,

}: {

  dailyField: any;

  energy?: any;

  patterns?: any[];

}) {

  const cosmic =
    dailyField.cosmic;

  const phaseType =
    getPhaseType(
      cosmic.phase
    );

  const topPatterns =
    getTopPatterns(
      patterns || []
    );

  const moonLine =
    getMoonLine(
      cosmic.moon
    );

  const sunLine =
    getSunLine(
      cosmic.sun
    );

  const energyLine =
    getEnergyLine({

      sunEnergy:
        cosmic.sunEnergy,

      phase:
        cosmic.phase,

      energy,
    });

  const phaseLine =
    buildPhasePatternMeaning({

      phaseType,

      patterns:
        topPatterns,
    });

  return {

    phaseType,

    moonLine,

    sunLine,

    energyLine,

    phaseLine,

    cosmicMessage:
      [

        moonLine,

        phaseLine,

        energyLine,

      ]

      .filter(Boolean)

      .join(" "),
  };
}

//
// 🌞 SUN
//

function getSunLine(
  sun: string
) {

  const map:
    Record<string, string> = {

    Aries:
      "A beginning is present.",

    Taurus:
      "Stillness holds something.",

    Gemini:
      "Movement is within.",

    Cancer:
      "Feeling runs quietly.",

    Leo:
      "Something seeks light.",

    Virgo:
      "Attention sharpens here.",

    Libra:
      "Balance is in question.",

    Scorpio:
      "Depth pulls inward.",

    Sagittarius:
      "Something expands outward.",

    Capricorn:
      "Structure is forming.",

    Aquarius:
      "The pattern shifts.",

    Pisces:
      "Edges begin to dissolve.",
  };

  return map[sun] || "";
}

//
// 🌙 MOON
//

function getMoonLine(
  moon: string
) {

  const map:
    Record<string, string> = {

    Aries:
      "Notice what rises before you can stop it.",

    Taurus:
      "See where you are holding on for safety.",

    Gemini:
      "Watch what keeps shifting within you.",

    Cancer:
      "What you feel is asking to be seen.",

    Leo:
      "Notice what wants to be expressed.",

    Virgo:
      "See what you are trying to make sense of.",

    Libra:
      "Notice where you seek balance outside.",

    Scorpio:
      "What is hidden is asking to surface.",

    Sagittarius:
      "See where you are reaching for meaning.",

    Capricorn:
      "Notice what you are holding inside.",

    Aquarius:
      "See where you are stepping back from feeling.",

    Pisces:
      "What you feel may not all be yours.",
  };

  return map[moon] || "";
}

//
// ⚡ ENERGY
//

function getEnergyLine({

  sunEnergy,

  phase,

  energy,

}: any) {

  const base =
    ENERGY_LINES[
      sunEnergy
    ];

  const modifier =
    PHASE_MODIFIERS[
      phase
    ];

  let line =
    modifier
      ? modifier(base)
      : base;

  const chakra =
    energy?.dominant_chakra;

  if (
    chakra === "heart"
  ) {
    return "Return to your heart — gently.";
  }

  if (
    chakra === "throat"
  ) {
    return "Something wants to be expressed.";
  }

  if (
    chakra === "root"
  ) {
    return "Come back into your body.";
  }

  return line;
}

const ENERGY_LINES:
  Record<string, string> = {

  Initiate:
    "Begin without needing certainty.",

  Ground:
    "Return to your body.",

  Express:
    "Let it move through you.",

  Feel:
    "Allow what is present.",

  Shine:
    "Be seen without effort.",

  Refine:
    "Adjust with care.",

  Balance:
    "Come back to center.",

  Transform:
    "Let something shift.",

  Expand:
    "Open your perspective.",

  Build:
    "Stay steady and present.",

  Innovate:
    "See it differently.",

  Surrender:
    "Release control gently.",
};

const PHASE_MODIFIERS:
  Record<
    string,
    (base: string) => string
  > = {

  New:
    (base) =>
      base.replace(
        ".",
        " — gently."
      ),

  Waxing:
    (base) =>
      "Gently, " +
      base.toLowerCase(),

  Full:
    (base) =>
      base.replace(
        ".",
        " — clearly."
      ),

  Waning:
    (base) =>
      base.replace(
        ".",
        " — then let it go."
      ),
};

//
// 🔁 PATTERN
//

function buildPhasePatternMeaning({

  phaseType,

  patterns,

}: any) {

  if (
    !patterns ||
    patterns.length === 0
  ) {
    return "";
  }

  const main =
    patterns[0];

  const clean =
    main.replace(
      "_",
      " "
    );

  if (
    phaseType === "amplify"
  ) {
    return `Notice where ${clean} feels stronger.`;
  }

  if (
    phaseType === "initiate"
  ) {
    return `A new layer of ${clean} is beginning.`;
  }

  if (
    phaseType === "build"
  ) {
    return `${clean} is taking form.`;
  }

  if (
    phaseType === "release"
  ) {
    return `${clean} is ready to soften.`;
  }

  return "";
}

//
// 🌙 HELPERS
//

function getPhaseType(
  phase: string
) {

  if (
    phase === "Full"
  ) {
    return "amplify";
  }

  if (
    phase === "New"
  ) {
    return "initiate";
  }

  if (
    phase === "Waxing"
  ) {
    return "build";
  }

  if (
    phase === "Waning"
  ) {
    return "release";
  }

  return "observe";
}

function getTopPatterns(
  patterns: any[]
) {

  return patterns

    .sort(
      (a, b) =>
        (b.active || 0) -
        (a.active || 0)
    )

    .slice(0, 2)

    .map(
      (p) => p.id
    );
}