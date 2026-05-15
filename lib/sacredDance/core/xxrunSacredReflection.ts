// /lib/sacredDance/core/runSacredReflection.ts

import { buildContext } from "./buildContext";

import {
  retrieveSacredContext,
} from "./retrieveSacredContext";

import {
  generateAIResponse,
} from "../../ai/generateAIResponse";

import {
  interpretInput,
} from "../../ai/interpretInput";

import {
  GuideType,
  LensType,
  MirrorEntryType,
  RealityLayer,
} from "./types";

interface RunSacredReflectionParams {

  language?: string;

  rawInput: string;

  entryType: MirrorEntryType;

  lens?: LensType;

  guideType?: GuideType;

  guideName?: string;

  cardType?: string;

  /*
   * ---------------------------------------------------------
   * 🌌 FIELD CONTEXT
   * ---------------------------------------------------------
   */

  context?: any;
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

  language,

  rawInput,

  entryType,

  lens,

  guideType,

  guideName,

  cardType,

  context,

}: RunSacredReflectionParams) {

  try {

    /*
     * ---------------------------------------------------------
     * 1. INTERPRET INPUT
     * ---------------------------------------------------------
     */

    const interpreted =
      await interpretInput({

        language,

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

      context?.realityLayer ||

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

    const requestContext =
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
      "🧠 REQUEST CONTEXT:",
      requestContext
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
       * 👤 USER FIELD
       * -------------------------------------------------------
       */

      user:
        context || null,

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

      request:
        requestContext,
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

          language,

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
           * USER FIELD
           * -------------------------------------------------
           */

          userContext:
            context,

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

      requestContext,

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