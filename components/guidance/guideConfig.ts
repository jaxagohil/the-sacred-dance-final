// /constants/guideConfig.ts

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