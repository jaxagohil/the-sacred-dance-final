// lib/sacredDance/buildSacredPrompt.ts

import type {
  SacredContext,
} from "./buildSacredContext";

import {
  getSacredTone,
} from "./tone/getSacredTone";

import {
  buildResponseStructure,
} from "./response/buildResponseStructure";

import {
  getSystemPrompt,
} from "./prompts/getSystemPrompt";

import {
  getUserPrompt,
} from "./prompts/getUserPrompt";

//
// 🌌 TYPES
//

export type SacredPrompt = {

  system: string;

  user: string;

  tone: {

    style: string;

    pacing: string;

    emotionalDepth: number;

    mysticism: number;

    directness: number;

    warmth: number;

    spaciousness: number;
  };

  structure: any;
};

//
// ✨ MAIN
//

export function buildSacredPrompt(
  context: SacredContext
): SacredPrompt {

  //
  // 🌙 DYNAMIC TONE
  //

  const tone =
    getSacredTone({

      guide:
        context.guide,

      chakra:
        context
          ?.synthesis
          ?.dominantChakra,

      lens:
        context.lens,

      theme:
        context.theme,
    });

  //
  // 🌌 RESPONSE STRUCTURE
  //

  const structure =
    buildResponseStructure({

      guide:
        context.guide,

      lens:
        context.lens,

      chakra:
        context
          ?.synthesis
          ?.dominantChakra,

      theme:
        context.theme,

      hasOracle:
        !!context.oracle,

      hasTarot:
        !!context.tarot,
    });

  //
  // 🌌 SYSTEM PROMPT
  //

  const system =
    getSystemPrompt({

      tone,

      structure,

      guide:
        context.guide,

      promptPressures:
        context
          .promptPressures,
    });

  //
  // 🧠 USER PROMPT
  //

  const user =
    getUserPrompt(
      context
    );

  //
  // 🌌 RETURN
  //

  return {

    system,

    user,

    tone,

    structure,
  };
}