// /lib/sacredDance/core/buildContext.ts

import {
  EmotionalContext,
  GuideType,
  LensType,
  MirrorEntryType,
  RealityLayer,
} from "./types";

interface BuildContextParams {

  rawInput: string;

  entryType: MirrorEntryType;

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
      rawInput.trim(),

    entryType,

    /*
     * ---------------------------------------------------------
     * EXPERIENCE TYPE
     * ---------------------------------------------------------
     */

    lens,

    /*
     * ---------------------------------------------------------
     * REALITY LAYER
     * ---------------------------------------------------------
     */

    realityLayer,

    /*
     * ---------------------------------------------------------
     * GUIDE
     * ---------------------------------------------------------
     */

    guideType,

    guideName,

    /*
     * ---------------------------------------------------------
     * CARD
     * ---------------------------------------------------------
     */

    cardType,
  };
}