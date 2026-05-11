export type AIType =
  | "guide"
  | "lens"
  | "cards"
  | "divine";

export interface CompleteGuideContext {

  user?: any;

  sacred?: any;

  interpreted?: any;

  request?: any;
}

export interface AIInput {

  type: AIType;

  context?: CompleteGuideContext;

  data?: any;
}