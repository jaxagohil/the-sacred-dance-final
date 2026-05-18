import {
    generateAIResponse,
} from "./generateAIResponse";

export async function extractReflectionData(
  reflection: string
) {

  const result =
    await generateAIResponse({

      type:
        "extract_reflection",

      context: {
        reflection,
      },

      data: {
        reflection,
      },
    });

  /*
   * --------------------------------------------------
   * ❌ INVALID
   * --------------------------------------------------
   */

  if (
    !result ||
    typeof result !==
      "object"
  ) {

    return {

      emotions: [],

      behaviours: [],

      bodyResponses: [],

      observableScenes: [],

      copingStrategies: [],

      manifestations: [],

      nervousSystem:
        null,
    };
  }

  /*
   * --------------------------------------------------
   * ✅ RETURN
   * --------------------------------------------------
   */

  return {

    emotions:
      result?.emotions || [],

    behaviours:
      result?.behaviours || [],

    bodyResponses:
      result?.bodyResponses || [],

    observableScenes:
      result?.observableScenes || [],

    copingStrategies:
      result?.copingStrategies || [],

    manifestations:
      result?.manifestations || [],

    nervousSystem:
      result?.nervousSystem || null,
  };
}