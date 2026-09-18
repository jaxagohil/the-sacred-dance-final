export type AIType =
  | "guide"
  | "lens"
  | "cards"
  | "divine"
  | "tarot"
  | "transmission"
  | "orchestration"
  | "cosmic";

export interface CompleteGuideContext {

  /*
   * ---------------------------------------------------------
   * ✨ DIRECT PROMPT
   * ---------------------------------------------------------
   */

  directPrompt?: string;

  /*
   * ---------------------------------------------------------
   * 🌊 EXISTING CONTEXT
   * ---------------------------------------------------------
   */

  user?: any;

  symbolic?: any;

  sacred?: any;

  oracle?: any;

  dailyField?: any;

  interpreted?: any;

  request?: any;

  /*
   * ---------------------------------------------------------
   * 🌌 GUIDANCE CONTEXT
   * ---------------------------------------------------------
   */

  fieldContext?: any;

  orchestration?: any;

  recentMessages?: any[];

  guidanceSignals?: any;

  reflectionResult?: any;

  language?: string;

  message?: string;
}

export interface AIInput {

  type: AIType;

  context?: CompleteGuideContext;

  data?: any;
}