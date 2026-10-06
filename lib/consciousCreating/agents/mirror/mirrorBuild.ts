import {
  getCreationContext,
} from "../../getCreationContext";

import {
  captureExpression,
} from "../../captureExpression";

import {
  interpretExpression,
} from "../../interpretExpression";

import {
  generateAIResponse,
} from "../../../ai/generateAIResponse";

import {
  buildMirrorPrompt,
} from "./buildMirrorPrompt";

import {
  loadBuildConversation,
  persistBuildConversation,
} from "./persistBuildConversation";

import {
  assessBuildReadiness,
  type BuildReadiness,
} from "./assessBuildReadiness";

import {
  generateNextMoves,
} from "./generateNextMoves";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export type MirrorConversationState =
  | "continue"
  | "pause"
  | "ready_for_next_moves";

import type {
  NextMove,
} from "./generateNextMoves";

export interface MirrorBuildResponse {
  message: string;
  conversationState: MirrorConversationState;
  nextMoves: NextMove[];
  confidence: number;
  readiness: BuildReadiness;
}

export interface MirrorBuildInput {
  userId: string;
  intentionId: string;
  message: string;
}

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const fallbackResponse =
  (): MirrorBuildResponse => ({
    message:
      "I'm here. Tell me a little more about what is happening with this creation.",
    conversationState:
      "continue",
    nextMoves: [],
    confidence: 0,
    readiness: {
      state: "exploring",
      understanding: "",
      unresolved: [],
      confidence: 0,
    },
  });


const clampConfidence =
  (value: unknown): number => {

    const number =
      Number(value);

    if (
      !Number.isFinite(number)
    ) {
      return 0;
    }

    return Math.max(
      0,
      Math.min(1, number)
    );
  };

const normaliseState =
  (
    value: unknown
  ): MirrorConversationState => {

    if (
      value === "pause" ||
      value ===
        "ready_for_next_moves"
    ) {
      return value;
    }

    return "continue";
  };

// --------------------------------------------------
// NORMALISE MIRROR RESPONSE
// --------------------------------------------------

const normaliseResponse =
  (
    value: unknown
  ): MirrorBuildResponse => {

    if (
      !value ||
      typeof value !== "object" ||
      Array.isArray(value)
    ) {
      return fallbackResponse();
    }

    const response =
      value as Record<
        string,
        unknown
      >;

    const message =
      typeof response.message ===
      "string"
        ? response.message.trim()
        : "";

    if (!message) {
      return fallbackResponse();
    }

    const nextMoves =
      Array.isArray(
        response.nextMoves
      )
        ? response.nextMoves.filter(
            (
              item
            ): item is string =>
              typeof item ===
                "string" &&
              item.trim()
                .length > 0
          )
        : [];

return {
  message,

  conversationState:
    normaliseState(
      response.conversationState
    ),

  nextMoves,

  confidence:
    clampConfidence(
      response.confidence
    ),

  readiness: {
    state: "exploring",
    understanding: "",
    unresolved: [],
    confidence: 0,
  },
};

};

// --------------------------------------------------
// MIRROR AGENT
// --------------------------------------------------

export async function mirrorBuild(
  input: MirrorBuildInput
): Promise<MirrorBuildResponse> {

  const {
    userId,
    intentionId,
    message,
  } = input;

  if (!userId) {
    throw new Error(
      "mirrorBuild: userId is required."
    );
  }

  if (!intentionId) {
    throw new Error(
      "mirrorBuild: intentionId is required."
    );
  }

  if (!message?.trim()) {
    throw new Error(
      "mirrorBuild: message is required."
    );
  }

  const humanMessage =
    message.trim();

  // --------------------------------------------------
  // 1. LOAD EXISTING BUILD CONVERSATION
  // --------------------------------------------------

  const existingConversation =
    await loadBuildConversation(
      intentionId
    );

  // --------------------------------------------------
  // 2. CAPTURE RAW HUMAN EXPRESSION
  // --------------------------------------------------

  const expression =
    await captureExpression({
      userId,

      intentionId,

      content:
        humanMessage,

      sourceType:
        "conversation",

      metadata: {
        stage: "build",
      },
    });

  // --------------------------------------------------
  // 3. GET EXISTING CREATION CONTEXT
  // --------------------------------------------------

  const contextBeforeMeaning =
    await getCreationContext({
      userId,
      intentionId,
      activeStage: "build",
    });

  // --------------------------------------------------
  // 4. INTERPRET CURRENT EXPRESSION
  // --------------------------------------------------

await interpretExpression({
  userId,

  expressionId:
    expression.id,

  expression:
    humanMessage,

  intentionId,

  context: {
    creation:
      contextBeforeMeaning.creation,
  },
});

  // --------------------------------------------------
  // 5. RELOAD CONTEXT
  // --------------------------------------------------

  const context =
    await getCreationContext({
      userId,
      intentionId,
      activeStage: "build",
    });

  // --------------------------------------------------
  // 6. BUILD MIRROR'S BRAIN
  // --------------------------------------------------

const prompt =
  buildMirrorPrompt({
    context,

    message:
      humanMessage,

    conversation:
      existingConversation.conversation,
  });

  // --------------------------------------------------
  // 7. SEND THROUGH EXISTING AI SERVICE
  // --------------------------------------------------

  try {

    const result =
      await generateAIResponse({
        type: "mirror",

        context: {
          directPrompt:
            prompt,
        },
      });

    // --------------------------------------------------
    // 8. NORMALISE MIRROR RESPONSE
    // --------------------------------------------------

    const mirrorResponse =
      normaliseResponse(
        result
      );

    // --------------------------------------------------
// 9. ASSESS BUILD READINESS
// --------------------------------------------------

const nextConversation = [
  ...existingConversation.conversation,

  {
    role: "user" as const,
    content: humanMessage,
  },

  {
    role: "mirror" as const,
    content:
      mirrorResponse.message,
  },
];

const readiness =
  await assessBuildReadiness({
conversation:
  nextConversation,

consciousDesire:
  context.journey.stages.discover?.response &&
  typeof context.journey.stages.discover.response.consciousDesire === "string"
    ? context.journey.stages.discover.response.consciousDesire.trim()
    : "",

creation:
  context.creation,

    journey:
      context.journey,

    livingField:
      context.livingField,

    expressions:
      context.expressions,

    meanings:
      context.meanings,

    artifacts:
      context.artifacts,
  });

mirrorResponse.readiness =
  readiness;  

// --------------------------------------------------
// 10. GENERATE NEXT MOVES FROM THE BUILD CONVERSATION
// --------------------------------------------------

// Readiness remains useful intelligence,
// but it is no longer the gate for possibilities.

if (
  mirrorResponse.conversationState !== "pause"
) {
  const nextMovesResult =
    await generateNextMoves({
      conversation:
        nextConversation,

      consciousDesire:
        context.journey.stages.discover?.response &&
        typeof context.journey.stages.discover.response.consciousDesire === "string"
          ? context.journey.stages.discover.response.consciousDesire.trim()
          : "",

      creation:
        context.creation,

      journey:
        context.journey,

      livingField:
        context.livingField,

      expressions:
        context.expressions,

      meanings:
        context.meanings,

      artifacts:
        context.artifacts,

      readiness,
    });

  mirrorResponse.nextMoves =
    nextMovesResult.moves;
} else {
  mirrorResponse.nextMoves = [];
}


    // --------------------------------------------------
// 11. PERSIST COMPLETE CONVERSATION
// --------------------------------------------------

await persistBuildConversation({
  intentionId,

  conversation:
    nextConversation,

  options:
    existingConversation.options,

  selectedNextStep:
    existingConversation.selectedNextStep,

  readiness,

nextMoves:
  mirrorResponse.nextMoves,
});

    // --------------------------------------------------
    // 12. RETURN MIRROR RESPONSE
    // --------------------------------------------------

    return mirrorResponse;

  } catch (error) {

    console.error(
      "❌ MIRROR BUILD ERROR:",
      error
    );

    return fallbackResponse();
  }
}
