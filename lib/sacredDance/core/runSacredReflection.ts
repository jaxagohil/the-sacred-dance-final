// /lib/sacredDance/core/runSacredReflection.ts

import { buildContext } from "./buildContext";

import {
  retrieveSacredContext,
} from "./retrieveSacredContext";

import {
  generateAIResponse,
} from "../../ai/generateAIResponse";

import { interpretInput } from "../../ai/interpretInput";

import {
  GuideType,
  LensType,
  MirrorEntryType,
  RealityLayer,
} from "./types";

interface RunSacredReflectionParams {

  rawInput: string;

  entryType: MirrorEntryType;

  lens?: LensType;

  guideType?: GuideType;

  guideName?: string;

  cardType?: string;

  mirrorContext?: any;
}

function mapGuideType(
  guideType?: GuideType
):
  | "guide_heart"
  | "guide_structure"
  | "guide_cosmic" {

  switch (guideType) {

    case "heart":
      return "guide_heart";

    case "structure":
      return "guide_structure";

    case "cosmic":
    default:
      return "guide_cosmic";
  }
}

export async function runSacredReflection({

  rawInput,

  entryType,

  lens,

  guideType,

  guideName,

  cardType,

  mirrorContext,

}: RunSacredReflectionParams) {

  try {

    /*
     * ---------------------------------------------------------
     * 1. INTERPRET INPUT
     * ---------------------------------------------------------
     */

    const interpreted =
      await interpretInput({

        text:
          rawInput,
      });

    console.log(
      "✨ INTERPRETED:",
      interpreted
    );

    /*
     * ---------------------------------------------------------
     * REALITY LAYER
     * ---------------------------------------------------------
     */

    const realityLayer: RealityLayer =

      interpreted?.realityLayer ||

      mirrorContext?.realityLayer ||

      "mixed";

    console.log(
      "🪞 REALITY LAYER:",
      realityLayer
    );

    /*
     * ---------------------------------------------------------
     * 2. BUILD CONTEXT
     * ---------------------------------------------------------
     */

    const context =
      buildContext({

        rawInput,

        entryType,

        lens,

        realityLayer,

        guideType,

        guideName,

        cardType,
      });

    console.log(
      "🧠 CONTEXT:",
      context
    );

    /*
     * ---------------------------------------------------------
     * 3. RETRIEVE SACRED CONTEXT
     * ---------------------------------------------------------
     */

    const sacredContext =
      await retrieveSacredContext({

        emotions:
          interpreted.emotions || [],

        behaviours:
          interpreted.behaviours || [],

        realityLayer,

        lens:
          interpreted.lens,

        limit: 5,
      });

    console.log(
      "📚 SACRED CONTEXT:",
      sacredContext
    );

    /*
     * ---------------------------------------------------------
     * 4. MERGE COMPLETE CONTEXT
     * ---------------------------------------------------------
     */

    const completeGuideContext = {

      /*
       * -------------------------------------------------------
       * 👤 USER CONTEXT
       * -------------------------------------------------------
       */

      user:
        mirrorContext || null,

      /*
       * -------------------------------------------------------
       * 🧿 SACRED CONTEXT
       * -------------------------------------------------------
       */

      sacred:
        sacredContext,

      /*
       * -------------------------------------------------------
       * ✨ INTERPRETED INPUT
       * -------------------------------------------------------
       */

      interpreted,

      /*
       * -------------------------------------------------------
       * 🧠 REQUEST CONTEXT
       * -------------------------------------------------------
       */

      request: {

        rawInput,

        entryType,

        lens,

        realityLayer,

        guideType,

        guideName,

        cardType,
      },
    };

    console.log(
      "🌌 COMPLETE GUIDE CONTEXT:",
      completeGuideContext
    );

    /*
     * ---------------------------------------------------------
     * 5. GENERATE RESPONSE
     * ---------------------------------------------------------
     */

    const response =
      await generateAIResponse({

        type:
          entryType === "guide"

            ? "guide"

            : entryType === "lens"

            ? "lens"

            : entryType === "card"

            ? "cards"

            : "guide",

        /*
         * -----------------------------------------------------
         * 🌌 COMPLETE CONTEXT
         * -----------------------------------------------------
         */

        context:
          completeGuideContext,

        data: {

          /*
           * -------------------------------------------------
           * GUIDE
           * -------------------------------------------------
           */

          guide:
            mapGuideType(
              guideType
            ),

          guideName,

          /*
           * -------------------------------------------------
           * USER MESSAGE
           * -------------------------------------------------
           */

          message:
            rawInput,

          /*
           * -------------------------------------------------
           * SACRED CONTEXT
           * -------------------------------------------------
           */

          fragments:
            sacredContext.fragments,

          principles:
            sacredContext.principles,

          pressures:
            sacredContext.pressures,

          oracleCards:
            sacredContext.oracleCards,

          oraclePrompts:
            sacredContext.oraclePrompts,

          /*
           * -------------------------------------------------
           * USER CONTEXT
           * -------------------------------------------------
           */

          userContext:
            mirrorContext,

          /*
           * -------------------------------------------------
           * INTERPRETED
           * -------------------------------------------------
           */

          interpreted,

          /*
           * -------------------------------------------------
           * REALITY LAYER
           * -------------------------------------------------
           */

          realityLayer,

          /*
           * -------------------------------------------------
           * CARDS
           * -------------------------------------------------
           */

          cards:
            cardType
              ? [cardType]
              : [],

          /*
           * -------------------------------------------------
           * FALLBACK
           * -------------------------------------------------
           */

          base:
            "Something important is moving here.",
        },
      });

    console.log(
      "🌸 RESPONSE:",
      response
    );

    /*
     * ---------------------------------------------------------
     * FINAL RESPONSE
     * ---------------------------------------------------------
     */

    return {

      context,

      interpreted,

      realityLayer,

      sacredContext,

      completeGuideContext,

      response,
    };

  } catch (e) {

    console.error(
      "❌ runSacredReflection error:",
      e
    );

    return null;
  }
}