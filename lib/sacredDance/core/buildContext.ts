// /lib/sacredDance/core/buildContext.ts

import {
  EmotionalContext,
  GuideType,
  LensType,
  MirrorEntryType,
} from "./types";

interface BuildContextParams {
  rawInput: string;

  entryType: MirrorEntryType;

  lens?: LensType;

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