// /lib/sacredDance/core/buildContext.ts

// --------------------------------------------------
// 🧠 SACRED DANCE INTERACTION CONTEXT
// --------------------------------------------------
//
// RESPONSIBLE FOR:
//
// ✅ normalizing UI/session input
// ✅ defining interaction type
// ✅ defining active lens
// ✅ defining active guide
// ✅ defining active reality layer
// ✅ defining card/oracle context
//
// ❌ NOT responsible for emotional intelligence
// ❌ NOT responsible for patterns
// ❌ NOT responsible for distortions
// ❌ NOT responsible for mirror logic
// ❌ NOT responsible for prose generation
//
// --------------------------------------------------

import {
  EmotionalContext,
  GuideType,
  LensType,
  MirrorEntryType,
  RealityLayer,
} from "./types";

// --------------------------------------------------
// 🧠 INPUT
// --------------------------------------------------

interface BuildContextParams {

  /*
   * ---------------------------------------------------------
   * USER INPUT
   * ---------------------------------------------------------
   */

  rawInput: string;

  /*
   * ---------------------------------------------------------
   * ENTRY TYPE
   * ---------------------------------------------------------
   */

  entryType: MirrorEntryType;

  /*
   * ---------------------------------------------------------
   * LENS
   * ---------------------------------------------------------
   */

  lens?: LensType;

  /*
   * ---------------------------------------------------------
   * REALITY LAYER
   * ---------------------------------------------------------
   */

  realityLayer?: RealityLayer;

  /*
   * ---------------------------------------------------------
   * GUIDE
   * ---------------------------------------------------------
   */

  guideType?: GuideType;

  guideName?: string;

  /*
   * ---------------------------------------------------------
   * CARD
   * ---------------------------------------------------------
   */

  cardType?: string;
}

// --------------------------------------------------
// 🚀 BUILD CONTEXT
// --------------------------------------------------

export function buildContext({

  rawInput,

  entryType,

  lens,

  realityLayer,

  guideType,

  guideName,

  cardType,

}: BuildContextParams): EmotionalContext {

  return {

    /*
     * ---------------------------------------------------------
     * CORE INPUT
     * ---------------------------------------------------------
     */

    rawInput:
      rawInput?.trim() || "",

    /*
     * ---------------------------------------------------------
     * INTERACTION TYPE
     * ---------------------------------------------------------
     */

    entryType,

    /*
     * ---------------------------------------------------------
     * LENS
     * ---------------------------------------------------------
     */

    lens:
      lens || "general",

    /*
     * ---------------------------------------------------------
     * REALITY LAYER
     * ---------------------------------------------------------
     */

    realityLayer:
      realityLayer || "emotional",

    /*
     * ---------------------------------------------------------
     * GUIDE
     * ---------------------------------------------------------
     */

    guideType:
      guideType || null,

    guideName:
      guideName || null,

    /*
     * ---------------------------------------------------------
     * CARD
     * ---------------------------------------------------------
     */

    cardType:
      cardType || null,
  };
}