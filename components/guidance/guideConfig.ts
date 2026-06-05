// /guideConfig.ts

import {
  Colors,
} from "../../constants/theme";

/*
 * --------------------------------------------------------
 * 🌌 GUIDE TYPES
 * --------------------------------------------------------
 */

export const GUIDE_TYPES = {

  HEART:
    "heart",

  STRUCTURE:
    "structure",

  COSMIC:
    "cosmic",
};

/*
 * --------------------------------------------------------
 * 🌊 GUIDE ATMOSPHERES
 * --------------------------------------------------------
 *
 * PURPOSE:
 *
 * Shared emotional choreography
 * across:
 *
 * - overlay
 * - whispers
 * - fragments
 * - transmission
 * - portal
 *
 * --------------------------------------------------------
 */

const guideAtmospheres = {

  heart: {

    /*
     * 🌿 Emotional Feel
     */

    temperature:
      "warm",

    density:
      "soft",

    /*
     * 🌊 Motion
     */

    breathing:
      5200,

    shimmer:
      0.08,

    drift:
      1.2,

    /*
     * 🌫️ UI Feel
     */

    opacity:
      0.88,

    glow:
      8,
  },

  structure: {

    /*
     * 🌿 Emotional Feel
     */

    temperature:
      "grounded",

    density:
      "structured",

    /*
     * 🌊 Motion
     */

    breathing:
      4200,

    shimmer:
      0.05,

    drift:
      0.7,

    /*
     * 🌫️ UI Feel
     */

    opacity:
      0.78,

    glow:
      4,
  },

  cosmic: {

    /*
     * 🌿 Emotional Feel
     */

    temperature:
      "expansive",

    density:
      "spacious",

    /*
     * 🌊 Motion
     */

    breathing:
      7600,

    shimmer:
      0.22,

    drift:
      2,

    /*
     * 🌫️ UI Feel
     */

    opacity:
      0.96,

    glow:
      12,
  },
};

/*
 * --------------------------------------------------------
 * 🌿 GUIDE CONFIG
 * --------------------------------------------------------
 */

export const guideConfig = {

  heart: {

    type:
      GUIDE_TYPES.HEART,

    color:
      Colors.guideHeart,

    glow:
      Colors.guideGlow,

    fontColor:
      Colors.guideHeart,

    label:
      "Heart",

    icon:
      "✦",

    atmosphere:
      guideAtmospheres.heart,
  },

  structure: {

    type:
      GUIDE_TYPES.STRUCTURE,

    color:
      Colors.guideStructure,

    glow:
      Colors.guideGlow,

    fontColor:
      Colors.guideStructure,

    label:
      "Structure",

    icon:
      "◌",

    atmosphere:
      guideAtmospheres.structure,
  },

  cosmic: {

    type:
      GUIDE_TYPES.COSMIC,

    color:
      Colors.guideCosmic,

    glow:
      Colors.guideGlow,

    fontColor:
      Colors.guideCosmic,

    label:
      "Cosmic",

    icon:
      "☼",

    atmosphere:
      guideAtmospheres.cosmic,
  },
};

/*
 * --------------------------------------------------------
 * 🌌 GUIDE HELPERS
 * --------------------------------------------------------
 */

export function getGuideConfig(
  type: string
) {

  return (

    guideConfig[
      type as keyof typeof guideConfig
    ] ||

    guideConfig.cosmic
  );
}

/*
 * --------------------------------------------------------
 * 🌊 ATMOSPHERE HELPER
 * --------------------------------------------------------
 */

export function getGuideAtmosphere(
  type: string
) {

  return (

    getGuideConfig(type)
      ?.atmosphere ||

    guideAtmospheres.cosmic
  );
}