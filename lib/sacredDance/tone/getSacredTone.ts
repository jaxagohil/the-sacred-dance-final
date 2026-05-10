// lib/sacredDance/tone/getSacredTone.ts

import {
    getGuideConfig,
} from "../guides/getGuideConfig";

//
// 🌌 TYPES
//

export type SacredToneInput = {

  guide?: string;

  chakra?: string;

  lens?: string;

  theme?: string;
};

export type SacredTone = {

  style: string;

  pacing: string;

  emotionalDepth: number;

  mysticism: number;

  directness: number;

  warmth: number;

  spaciousness: number;
};

//
// ✨ MAIN
//

export function getSacredTone(
  input: SacredToneInput
): SacredTone {

  const {

    guide,

    chakra,

    lens,

    theme,

  } = input;

  //
  // 🌙 GUIDE CONFIG
  //

  const guideConfig =
    getGuideConfig(
      guide
    );

  //
  // 🌌 BASE TONE
  //

  const tone: SacredTone = {

    style:
      guideConfig.archetype,

    pacing:
      guideConfig.pacing,

    emotionalDepth:
      0.8,

    mysticism:
      guideConfig.mysticism,

    directness:
      guideConfig.directness,

    warmth:
      guideConfig.warmth,

    spaciousness:
      guideConfig.spaciousness,
  };

  //
  // ⚡ CHAKRA MODULATION
  //

  switch (
    chakra?.toLowerCase()
  ) {

    case "root":

      tone.directness += 0.1;

      tone.mysticism -= 0.1;

      break;

    case "sacral":

      tone.emotionalDepth += 0.08;

      break;

    case "solar":

      tone.directness += 0.12;

      break;

    case "heart":

      tone.warmth += 0.12;

      break;

    case "throat":

      tone.directness += 0.08;

      break;

    case "third_eye":

      tone.mysticism += 0.12;

      break;

    case "crown":

      tone.spaciousness += 0.12;

      tone.mysticism += 0.1;

      break;
  }

  //
  // 🪞 LENS MODULATION
  //

  switch (
    lens?.toLowerCase()
  ) {

    case "people":

      tone.emotionalDepth += 0.08;

      break;

    case "places":

      tone.spaciousness += 0.08;

      break;

    case "things":

      tone.directness += 0.06;

      break;
  }

  //
  // 🌙 THEMES
  //

  switch (
    theme?.toLowerCase()
  ) {

    case "abandonment":

      tone.warmth += 0.15;

      tone.directness -= 0.1;

      break;

    case "awakening":

      tone.mysticism += 0.12;

      tone.spaciousness += 0.08;

      break;

    case "truth":

      tone.directness += 0.12;

      break;

    case "union":

      tone.emotionalDepth += 0.1;

      tone.warmth += 0.08;

      break;
  }

  //
  // 🧘 NORMALIZE
  //

  tone.emotionalDepth =
    clamp(
      tone.emotionalDepth
    );

  tone.mysticism =
    clamp(
      tone.mysticism
    );

  tone.directness =
    clamp(
      tone.directness
    );

  tone.warmth =
    clamp(
      tone.warmth
    );

  tone.spaciousness =
    clamp(
      tone.spaciousness
    );

  //
  // 🌌 RETURN
  //

  return tone;
}

//
// ✨ HELPERS
//

function clamp(
  value: number
) {

  return Math.max(
    0,
    Math.min(1, value)
  );
}