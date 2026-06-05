// /lib/guidance/orchestration/applyGuideConsciousness.ts

/*
 * --------------------------------------------------------
 * 🌌 APPLY GUIDE CONSCIOUSNESS
 * --------------------------------------------------------
 *
 * PURPOSE:
 *
 * Translate orchestration meaning through:
 * - guide archetype
 * - emotional regulation
 * - nervous-system safety
 * - symbolic pacing
 * - Sacred Dance consciousness
 *
 * IMPORTANT:
 *
 * This file:
 * - does NOT orchestrate
 * - does NOT retrieve
 * - does NOT generate meaning
 * - does NOT style UI
 *
 * It ONLY:
 * - shapes energetic delivery
 * - applies guide consciousness
 * - regulates emotional tone
 * - softens emergence
 *
 * --------------------------------------------------------
 */

import {
  GUIDE_TYPES,
} from "../../../components/guidance/guideConfig";

import {
  Colors,
} from "../../../constants/theme";

/*
 * --------------------------------------------------------
 * 🌌 APPLY GUIDE CONSCIOUSNESS
 * --------------------------------------------------------
 */

export const applyGuideConsciousness = ({

  /*
   * 🌊 ORCHESTRATED FRAGMENT
   */

  fragment = {},

  /*
   * 🌿 GUIDE
   */

  guide =
    GUIDE_TYPES.COSMIC,

  /*
   * 🌌 FIELD STATES
   */

  emotionalField =
    "soft",

  nervousSystemState =
    "regulated",

  orchestrationMode =
    "quiet",

  /*
   * 🌊 RECURRENCE
   */

  recurrenceCount = 0,

  /*
   * 🌿 SYMBOLIC DEPTH
   */

  symbolicTolerance =
    0.5,

}: any) => {

  /*
   * --------------------------------------------------------
   * 🌌 EMPTY
   * --------------------------------------------------------
   */

  if (!fragment) {

    return null;
  }

  /*
   * --------------------------------------------------------
   * 🌊 BASE TEXT
   * --------------------------------------------------------
   */

const text =
  fragment?.text;

  /*
   * --------------------------------------------------------
   * 🌿 BASE FIELD
   * --------------------------------------------------------
   */

  let opacity = 0.82;

  let glow = 0.18;

  let softness = 0.5;

  let symbolicDensity = 0.5;

  let pacingWeight = 1;

  /*
   * --------------------------------------------------------
   * 🌌 NERVOUS SYSTEM SAFETY
   * --------------------------------------------------------
   */

  if (
    nervousSystemState ===
    "contracted"
  ) {

    opacity = 0.62;

    glow = 0.08;

    softness = 0.88;

    symbolicDensity = 0.28;

    pacingWeight = 1.4;
  }

  /*
   * --------------------------------------------------------
   * 🌊 THRESHOLD STATES
   * --------------------------------------------------------
   */

  if (
    orchestrationMode ===
    "threshold"
  ) {

    glow += 0.08;

    pacingWeight += 0.2;
  }

  /*
   * --------------------------------------------------------
   * 🌿 SYMBOLIC OPENNESS
   * --------------------------------------------------------
   */

  if (
    symbolicTolerance > 0.72
  ) {

    symbolicDensity += 0.08;
  }

  /*
   * --------------------------------------------------------
   * 🌌 RECURRENCE SOFTENING
   * --------------------------------------------------------
   *
   * Repeated emergence should:
   * - soften
   * - deepen
   * - become quieter
   *
   * NOT louder.
   *
   * --------------------------------------------------------
   */

  if (
    recurrenceCount > 2
  ) {

    opacity -= 0.08;

    softness += 0.12;
  }

  /*
   * --------------------------------------------------------
   * 🌊 GUIDE CONSCIOUSNESS
   * --------------------------------------------------------
   */

  let archetype =
    "cosmic";

  let guideColor =
  Colors.guideCosmic;  

  /*
   * 🌌 COSMIC
   */

if (
  guide ===
  GUIDE_TYPES.COSMIC
) {

  archetype =
    "cosmic";

  guideColor =
    Colors.guideCosmic;

  glow += 0.06;

  symbolicDensity += 0.12;
}

  /*
   * 🌿 HEART
   */

  if (
    guide ===
    GUIDE_TYPES.HEART
  ) {

    archetype =
      "heart";

      guideColor =
  Colors.guideHeart;

    softness += 0.24;

    glow -= 0.04;

    symbolicDensity -= 0.08;
  }

  /*
   * 🌊 STRUCTURE
   */

  if (
    guide ===
    GUIDE_TYPES.STRUCTURE
  ) {

    archetype =
      "structure";

    softness -= 0.12;

    guideColor =
  Colors.guideStructure;

    symbolicDensity -= 0.18;

    pacingWeight -= 0.1;
  }

  /*
   * --------------------------------------------------------
   * 🌌 EMOTIONAL FIELD
   * --------------------------------------------------------
   */

  if (
    emotionalField ===
    "tender"
  ) {

    softness += 0.18;

    opacity -= 0.08;
  }

  if (
    emotionalField ===
    "cosmic"
  ) {

    glow += 0.12;
  }

  /*
   * --------------------------------------------------------
   * 🌊 RETURN CONSCIOUSNESS
   * --------------------------------------------------------
   */

  return {

    /*
     * 🌌 ORIGINAL
     */

    ...fragment,

    text,

    /*
     * 🌿 GUIDE
     */

    guide,

    archetype,

    guideColor,

    /*
     * 🌊 FIELD ENERGY
     */

    opacity:
      Math.max(
        0.45,
        opacity
      ),

    glow:
      Math.max(
        0.05,
        glow
      ),

    softness:
      Math.min(
        1,
        softness
      ),

    symbolicDensity:
      Math.min(
        1,
        symbolicDensity
      ),

    pacingWeight:
      Math.max(
        0.8,
        pacingWeight
      ),

    /*
     * 🌌 DELIVERY
     */

    cinematic:
      true,

    silenceAware:
      true,

    nervousSystemSafe:
      nervousSystemState !==
      "overwhelmed",

    /*
     * 🌿 RECURRENCE
     */

    recurrenceAware:
      recurrenceCount > 0,
  };
};