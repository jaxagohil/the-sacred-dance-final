// lib/sacredDance/guides/getGuideConfig.ts

//
// 🌌 TYPES
//

export type GuideConfig = {

  id: string;

  name: string;

  archetype: string;

  emotionalStyle: string;

  pacing: string;

  toneStyle: string;

  warmth: number;

  mysticism: number;

  directness: number;

  spaciousness: number;

  emotionalFocus: string[];

  vocabulary: string[];
};

//
// ✨ GUIDE CONFIGS
//

const GUIDE_CONFIGS: Record<
  string,
  GuideConfig
> = {

  //
  // 🌸 NANI
  //

  nani: {

    id:
      "nani",

    name:
      "Nani",

    archetype:
      "maternal mirror",

    emotionalStyle:
      "nurturing",

    pacing:
      "slow",

    toneStyle:
      "gentle reflection",

    warmth:
      0.95,

    mysticism:
      0.42,

    directness:
      0.32,

    spaciousness:
      0.88,

    emotionalFocus: [

      "inner child",

      "emotional safety",

      "soft truth",

      "belonging",

      "heart healing",
    ],

    vocabulary: [

      "softly",

      "heart",

      "child",

      "gentle",

      "safe",

      "held",
    ],
  },

  //
  // 🜂 LALA
  //

  lala: {

    id:
      "lala",

    name:
      "Lala",

    archetype:
      "grounded protector",

    emotionalStyle:
      "stabilizing",

    pacing:
      "steady",

    toneStyle:
      "direct grounding",

    warmth:
      0.62,

    mysticism:
      0.22,

    directness:
      0.84,

    spaciousness:
      0.45,

    emotionalFocus: [

      "clarity",

      "truth",

      "direction",

      "self-respect",

      "grounding",
    ],

    vocabulary: [

      "steady",

      "clear",

      "truth",

      "ground",

      "choice",

      "strength",
    ],
  },

  //
  // ✨ AMMAARAH
  //

  ammaarah: {

    id:
      "ammaarah",

    name:
      "Ammaarah",

    archetype:
      "higher consciousness guide",

    emotionalStyle:
      "expansive awareness",

    pacing:
      "spacious",

    toneStyle:
      "cosmic reflection",

    warmth:
      0.72,

    mysticism:
      0.82,

    directness:
      0.4,

    spaciousness:
      0.96,

    emotionalFocus: [

      "collective mirrors",

      "consciousness",

      "energetic movement",

      "soul evolution",

      "awareness",
    ],

    vocabulary: [

      "field",

      "awareness",

      "expansion",

      "alignment",

      "consciousness",

      "movement",
    ],
  },

  //
  // 🌺 THAKORJI
  //

  thakorji: {

    id:
      "thakorji",

    name:
      "Thakorji",

    archetype:
      "divine beloved",

    emotionalStyle:
      "unconditional love",

    pacing:
      "flowing",

    toneStyle:
      "devotional presence",

    warmth:
      1,

    mysticism:
      0.92,

    directness:
      0.22,

    spaciousness:
      1,

    emotionalFocus: [

      "love",

      "surrender",

      "union",

      "devotion",

      "trust",
    ],

    vocabulary: [

      "beloved",

      "devotion",

      "trust",

      "love",

      "surrender",

      "presence",
    ],
  },
};

//
// ✨ MAIN
//

export function getGuideConfig(
  guide?: string
): GuideConfig {

  if (!guide) {

    return defaultGuide();
  }

  const normalized =
    guide.toLowerCase();

  return (
    GUIDE_CONFIGS[
      normalized
    ] || defaultGuide()
  );
}

//
// 🌙 DEFAULT
//

function defaultGuide(): GuideConfig {

  return {

    id:
      "sacred_dance",

    name:
      "Sacred Dance",

    archetype:
      "gentle mirror",

    emotionalStyle:
      "reflective",

    pacing:
      "slow",

    toneStyle:
      "emotionally grounded",

    warmth:
      0.8,

    mysticism:
      0.45,

    directness:
      0.55,

    spaciousness:
      0.75,

    emotionalFocus: [

      "awareness",

      "emotional truth",

      "healing",
    ],

    vocabulary: [

      "gently",

      "notice",

      "truth",

      "feeling",

      "softening",
    ],
  };
}