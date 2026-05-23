// /lib/guidance/orchestrateGuideResponse.ts

import { processReflection } from "../../../db/flow";

import { buildUserContext } from "../../context/buildUserContext";

import { preprocessGuidanceSignals } from "../core/preprocessGuidanceSignals";

import { orchestrateGuidance } from "../orchestration/orchestrateGuidance";

import { buildGuidePrompt } from "../../ai/prompts/guides/buildGuidePrompt";

import { generateAIResponse } from "../../ai/generateAIResponse";

import { loadGuideMessages } from "./loadGuideMessages";

import { saveGuideMessage } from "./saveGuideMessage";

import { responseChoreography } from "./responseChoreography";

/*
 * ------------------------------------------------
 * TYPES
 * ------------------------------------------------
 */

type OrchestrateGuideResponseProps = {

  userId: string;

  message: string;

  language?: string;

  guide?:
    | "guide_heart"
    | "guide_structure"
    | "guide_cosmic";

  reflectionResult?: any;
};

/*
 * ------------------------------------------------
 * 🌌 ORCHESTRATE GUIDE RESPONSE
 * ------------------------------------------------
 */

export async function orchestrateGuideResponse({

  userId,

  message,

  language = "en",

  guide = "guide_cosmic",

  reflectionResult,

}: OrchestrateGuideResponseProps) {

  try {

    /*
     * ------------------------------------------------
     * 🌱 FIELD CONTEXT
     * ------------------------------------------------
     */

    const fieldContext =
      await buildUserContext({

        userId,

        source:
          "guidance",

        activeLens:
          "general",
      });

    /*
     * ------------------------------------------------
     * 💬 RECENT GUIDE MEMORY
     * ------------------------------------------------
     */

    const recentMessages =
      await loadGuideMessages(
        userId
      );

    /*
     * ------------------------------------------------
     * 🌊 REFLECTION PROCESSING
     * ------------------------------------------------
     */

    let processedReflection =
      reflectionResult;

    /*
     * ------------------------------------------------
     * 🌿 FALLBACK PROCESSING
     * ------------------------------------------------
     */

    if (
      !processedReflection
    ) {

      processedReflection =
        await processReflection({

          userId,

          language,

          source:
            "guidance_runtime",

          baselineType:
            "guidance_runtime",

          signalDepth:
            2,

          text:
            message,
        });
    }

    /*
     * ------------------------------------------------
     * 🌌 GUIDANCE SIGNALS
     * ------------------------------------------------
     */

    const guidanceSignals =
      preprocessGuidanceSignals({

        reflectionResult:
          processedReflection,

        userHistory:
          fieldContext,

        fieldContext,
      });

    /*
     * ------------------------------------------------
     * 🌀 ORCHESTRATION
     * ------------------------------------------------
     */

    const orchestration =
      orchestrateGuidance({

        signals:
          guidanceSignals,

        activePatterns:
          processedReflection
            ?.patterns || [],

        userHistory:
          fieldContext,

        selectedGuide:
          guide,

        recentMessages,
      });

    /*
     * ------------------------------------------------
     * 🌊 RESPONSE CHOREOGRAPHY
     * ------------------------------------------------
     */

    const choreography =
      responseChoreography({

        orchestration,

        guidanceSignals,

        recentMessages,
      });

    /*
     * ------------------------------------------------
     * 💾 SAVE USER MESSAGE
     * ------------------------------------------------
     */

    await saveGuideMessage({

      userId,

      guide,

      role:
        "user",

      content:
        message,

      source:
        "guidance",

      userField:
        fieldContext,

      orchestrationSnapshot: {

        spiralPhase:
          guidanceSignals
            ?.spiralPhase,

        spiralDirection:
          guidanceSignals
            ?.spiralDirection,

        fieldTone:
          guidanceSignals
            ?.fieldTone,

        nervousSystem:
          guidanceSignals
            ?.nervousSystem,

        coherence:
          guidanceSignals
            ?.coherence,

        responseStrategy:
          orchestration
            ?.responseStrategy,

        conversationState:
          orchestration
            ?.conversationState,

        conversationMovement:
          orchestration
            ?.conversationMovement,

        readinessForInsight:
          orchestration
            ?.readinessForInsight,
      },
    });

    /*
     * ------------------------------------------------
     * ✨ BUILD PROMPT
     * ------------------------------------------------
     */

    const prompt =
      buildGuidePrompt({

        reflectionResult:
          processedReflection,

        guidanceSignals,

        orchestration,

        choreography,

        selectedGuide:
          guide,

        fieldContext,

        recentMessages,

        language,

        message,
      });

    /*
     * ------------------------------------------------
     * 🤖 AI RESPONSE
     * ------------------------------------------------
     */

    const response =
      await generateAIResponse({

        type:
          "guide",

        context: {

          directPrompt:
            prompt,
        },

        data: {

          language,

          base:
            "Something quiet is asking to settle before words arrive.",
        },
      });

    /*
     * ------------------------------------------------
     * 💾 SAVE GUIDE RESPONSE
     * ------------------------------------------------
     */

    await saveGuideMessage({

      userId,

      guide,

      role:
        "guide",

      content:
        response,

      source:
        "guidance",

      userField:
        fieldContext,

      orchestrationSnapshot: {

        spiralPhase:
          guidanceSignals
            ?.spiralPhase,

        spiralDirection:
          guidanceSignals
            ?.spiralDirection,

        fieldTone:
          guidanceSignals
            ?.fieldTone,

        nervousSystem:
          guidanceSignals
            ?.nervousSystem,

        coherence:
          guidanceSignals
            ?.coherence,

        responseStrategy:
          orchestration
            ?.responseStrategy,

        conversationState:
          orchestration
            ?.conversationState,

        conversationMovement:
          orchestration
            ?.conversationMovement,

        readinessForInsight:
          orchestration
            ?.readinessForInsight,
      },
    });

    /*
     * ------------------------------------------------
     * 📦 RETURN
     * ------------------------------------------------
     */

    return {

      response,

      orchestration,

      choreography,

      guidanceSignals,

      reflection:
        processedReflection,

      recentMessages,

      userField:
        fieldContext,
    };

  } catch (error) {

    console.log(
      "❌ orchestrateGuideResponse error",
      error
    );

    return {

      response:
        "Something quiet is asking to settle before words arrive.",

      error,
    };
  }
}