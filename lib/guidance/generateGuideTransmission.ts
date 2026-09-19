/* ======================================================== */
/* 🌌 GENERATE GUIDE TRANSMISSION */
/* ======================================================== */

import {
  generateAIResponse,
} from "../ai/generateAIResponse";

import {
  AlignmentOSContext,
} from "../alignment/buildAlignmentOSContext";

import {
  buildGuidanceMirrorWorld,
} from "./context/buildGuidanceMirrorWorld";

import {
  buildGuidePrompt,
} from "../ai/prompts/guides/buildGuidePrompt";

import {
  transmissionWrapper,
} from "../ai/prompts/guides/transmissionWrapper";

/* ======================================================== */
/* 🌊 TYPES */
/* ======================================================== */

type GenerateGuideTransmissionInput = {

  guide?: string;

  reflection?: string;

  recentMessages?: any[];

  alignmentContext: AlignmentOSContext;

  field?: any;

  orchestrationField?: any;

  emergenceMemory?: any;

  language?: string;
};

/* ======================================================== */
/* 🌌 MAIN */
/* ======================================================== */

export async function generateGuideTransmission({

  guide = "cosmic",

  reflection = "",

  recentMessages = [],

alignmentContext,

  field,

  orchestrationField,

  emergenceMemory,

  language = "en",

}: GenerateGuideTransmissionInput) {

  try {

    /* ---------------------------------------------------- */
    /* 🚫 EMPTY */
    /* ---------------------------------------------------- */

    if (!reflection?.trim()) {

      return null;
    }

    /* ---------------------------------------------------- */
    /* 🌌 AI */
    /* ---------------------------------------------------- */

    console.log(
  "🌍 TRANSMISSION LANGUAGE:",
  language
);


const mirrorWorld =
  buildGuidanceMirrorWorld(
    alignmentContext.mirrorContext
  );

const guidePrompt =

  buildGuidePrompt({

    fieldContext: {

      user:
        alignmentContext.userContext,

      sacred: {

        emergenceMemory,

        selectedGuide:
          guide,
      },

      mirrorContext:
        mirrorWorld,

      expressionProfile:
        alignmentContext.expressionProfile,

      spiralScores:
        alignmentContext.spiralScores,

      activeLens:
        alignmentContext.activeLens,

      entityLenses:
        alignmentContext.entityLenses,

      dailyField:
        alignmentContext.dailyField,
    },

    orchestration:
      orchestrationField,

    recentMessages,

    guidanceSignals:
      field?.guidanceSignals || {},

    reflectionResult:
      field?.reflectionResult || {},

    language,

    message:
      reflection,

    workflow: "transmission",  
  });
  
  const finalPrompt = `

${transmissionWrapper}

${guidePrompt}

`;


    const result =

await generateAIResponse({

  type:
    "transmission",

  context: {

    directPrompt:
      finalPrompt,
  },

  data: {

    language,
  },
});

    console.log(
      "🌌 GUIDE TRANSMISSION RESULT",
      result
    );

    /* ---------------------------------------------------- */
    /* 🌊 CLEAN */
    /* ---------------------------------------------------- */

let text = (

  typeof result === "string"

    ? result

    : (

        result?.text

        || result?.response

        || result?.message

        || ""
      )

);

    text = text

      ?.replace?.(
        /```json/g,
        ""
      )

      ?.replace?.(
        /```/g,
        ""
      )

      ?.replace?.(
        /💬 AI RESPONSE:/g,
        ""
      )

      ?.trim?.();

    console.log(
      "✅ FINAL GUIDE TEXT",
      text
    );

    /* ---------------------------------------------------- */
    /* 🚫 EMPTY */
    /* ---------------------------------------------------- */

    if (!text) {

      return null;
    }

    /* ---------------------------------------------------- */
    /* ✅ DONE */
    /* ---------------------------------------------------- */

    return {

      guide,

      text,
    };

  } catch (error) {

    console.error(

      "❌ generateGuideTransmission error",

      error
    );

    return null;
  }
}