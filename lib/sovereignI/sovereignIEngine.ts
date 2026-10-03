import { getLifePicture } from "./getLifePicture";

import {
    sovereignIIntelligence,
} from "./sovereignIIntelligence";


export type SovereignIEngineInput = {
  userInput: string;
  lifePicture?: any;
  pendingQuestion?: string | null;
  language?: string;
  alignmentContext?: any;
};

export type SovereignIEngineResult = {
  understanding: string;

  lifePictureUpdates: {
    section: string;
    type: "add" | "update" | "question";
    content: any;
    status: "proposed" | "confirmed" | "unknown";
    reason: string;
  }[];

  needsClarification: boolean;
  question: string | null;

outcome: {
  status: "clear" | "emerging" | "open";
  proposals: {
    statement: string;
    rationale: string;
  }[];
  possibleForms: string[];
  confidence: "human_confirmed" | "proposed";
};

  status:
    | "understanding"
    | "clarifying"
    | "ready_for_outcome";
};

export async function sovereignIEngine({
  userInput,
  lifePicture,
  pendingQuestion,
  language = "en",
  alignmentContext,
}: SovereignIEngineInput): Promise<SovereignIEngineResult | null> {

  const existingLifePicture =
    lifePicture ?? await getLifePicture();

  const intelligenceResult =
  await sovereignIIntelligence({

    userInput,

    lifePicture:
      existingLifePicture,

    pendingQuestion,

    language,

    alignmentContext,
  });

if (!intelligenceResult) {
  return null;
}

return intelligenceResult;  

}