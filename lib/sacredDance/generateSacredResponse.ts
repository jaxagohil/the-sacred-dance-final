// lib/sacredDance/generateSacredResponse.ts

import {
    generateAIResponse,
} from "../generateAIResponse";

import {
    buildSacredContext,
} from "./buildSacredContext";

import {
    buildSacredPrompt,
} from "./buildSacredPrompt";

//
// 🌌 TYPES
//

export type SacredResponseInput = {

  user?: any;

  theme?: string;

  guide?: string;

  lens?: string;

  language?: string;

  energy?: any;

  mirror?: any;

  signals?: any[];

  livingField?: any;

  context?: {

    patterns?: string[];

    distortions?: string[];

    chakra?: string;

    cosmic?: {

      moon?: string;

      phase?: string;

      sign?: string;

      energy?: string;
    };
  };
};

export type SacredResponse = {

  transmission: string;

  guide?: string;

  oracle?: any;

  tarot?: any;

  cosmic?: any;

  mirror?: any;

  energy?: any;

  snapshot?: any;

  sacredContext?: any;

  metadata?: {

    theme?: string;

    chakra?: string;

    lens?: string;

    generatedAt?: string;
  };
};

//
// ✨ MAIN
//

export async function generateSacredResponse(
  input: SacredResponseInput
): Promise<SacredResponse> {

  //
  // 🌌 BUILD SACRED CONTEXT
  //

  const sacredContext =
    await buildSacredContext(
      input
    );

  //
  // ✨ BUILD PROMPT
  //

  const prompt =
    buildSacredPrompt(
      sacredContext
    );

  //
  // 🤖 AI RESPONSE
  //

  const transmission =
    await generateAIResponse({

      type:
        "sacred_response",

      system:
        prompt.system,

      prompt:
        prompt.user,

      tone:
        prompt.tone,
    });

  //
  // 🌌 RETURN
  //

  return {

    transmission,

    guide:
      sacredContext.guide,

    oracle:
      sacredContext.oracle,

    tarot:
      sacredContext.tarot,

    cosmic:
      sacredContext.cosmic,

    mirror:
      sacredContext.mirror,

    energy:
      sacredContext.energy,

    snapshot:
      sacredContext.snapshot,

    sacredContext,

    metadata: {

      theme:
        sacredContext.theme,

      chakra:
        sacredContext
          ?.synthesis
          ?.dominantChakra,

      lens:
        sacredContext.lens,

      generatedAt:
        new Date().toISOString(),
    },
  };
}