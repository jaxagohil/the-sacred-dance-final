/* ======================================================== */
/* 🌌 GENERATE GUIDE TRANSMISSION */
/* ======================================================== */

import {
  generateAIResponse,
} from "../ai/generateAIResponse";

/* ======================================================== */
/* 🌊 TYPES */
/* ======================================================== */

type GenerateGuideTransmissionInput = {

  guide?: string;

  reflection?: string;

  userContext?: any;

  mirrorContext?: any;

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

  userContext,

  mirrorContext,

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

    const result =

      await generateAIResponse({

        type:
          "transmission",

        context: {

          fieldContext: {

            user:
              userContext,

            sacred: {

              emergenceMemory,

              selectedGuide:
                guide,
            },

            dailyField:
              orchestrationField,
          },

          orchestration:
            orchestrationField,

          recentMessages:
            [],

          guidanceSignals:
            field?.guidanceSignals || {},

          reflectionResult:
            field?.reflectionResult || {},

          language,

          message:
            reflection,
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