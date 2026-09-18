// /lib/ai/buildPrompt.ts

import {
  getLanguageName,
} from "../i18n/getLanguageName";

import {
  buildDivinePrompt,
} from "./prompts/buildDivinePrompt";

import {
  buildGuidePrompt,
} from "./prompts/guides/buildGuidePrompt";

import {
  buildLensPrompt,
} from "./prompts/lenses/buildLensPrompt";


import {
  buildCosmicPrompt,
} from "./prompts/buildCosmicPrompt";

import {
  buildTarotPrompt,
} from "./prompts/buildTarotPrompt";

export async function buildPrompt({

  type,

  context,

  data,

}: any) {

  /*
   * -------------------------------------------------------
   * 🌍 LANGUAGE NAME
   * -------------------------------------------------------
   */

  const languageName =
    await getLanguageName(
      data?.language
    );

  const enrichedData = {

    ...data,

    languageName,
  };

  switch (type) {

    /*
     * -------------------------------------------------------
     * DIVINE
     * -------------------------------------------------------
     */

    case "divine":

      return buildDivinePrompt({

        context,

        data: enrichedData,
      });

    /*
     * -------------------------------------------------------
     * LENS
     * -------------------------------------------------------
     */

case "lens":

  return buildLensPrompt({
    context,
    data: enrichedData,
  });

    /*
     * -------------------------------------------------------
     * TAROT
     * -------------------------------------------------------
     */

    case "tarot":

      return buildTarotPrompt({

        context,

        data: enrichedData,
      });

    /*
     * -------------------------------------------------------
     * GUIDANCE - Orchestration & Transmission
     * -------------------------------------------------------
     */

case "orchestration":

  return buildGuidePrompt({

    fieldContext:
      context?.fieldContext || {},

    reflectionResult:
      context?.reflectionResult || {},

    guidanceSignals:
      context?.guidanceSignals || {},

    orchestration:
      context?.orchestration || {},

    recentMessages:
      context?.recentMessages || [],

    language:
      context?.language || enrichedData.language,

    message:
      context?.message || "",

    workflow:
      "orchestration",

    data:
      enrichedData,
  });

case "transmission":

  return buildGuidePrompt({

    fieldContext:
      context?.fieldContext || {},

    reflectionResult:
      context?.reflectionResult || {},

    guidanceSignals:
      context?.guidanceSignals || {},

    orchestration:
      context?.orchestration || {},

    recentMessages:
      context?.recentMessages || [],

    language:
      context?.language || enrichedData.language,

    message:
      context?.message || "",

    workflow:
      "transmission",

    data:
      enrichedData,
  });

    /*
     * -------------------------------------------------------
     * COSMIC
     * -------------------------------------------------------
     */

    case "cosmic":

      return buildCosmicPrompt({

        context,

        data: enrichedData,
      });

    /*
     * -------------------------------------------------------
     * DEFAULT
     * -------------------------------------------------------
     */

default:

  throw new Error(
    `Unknown prompt type: ${type}`
  );
  }
}