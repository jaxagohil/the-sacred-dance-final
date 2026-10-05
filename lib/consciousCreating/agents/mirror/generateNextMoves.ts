import {
  generateAIResponse,
} from "../../../ai/generateAIResponse";

import type {
  BuildReadiness,
} from "./assessBuildReadiness";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export type NextMoveType =
  | "explore"
  | "create"
  | "connect"
  | "experiment"
  | "decide";

export type CreationArea =
  | "I"
  | "People"
  | "Planet";

export interface NextMove {
  title: string;
  description: string;
  type: NextMoveType;
  rationale: string;
  areas: CreationArea[];
}

export interface GenerateNextMovesInput {
  creation?: unknown;
  journey?: unknown;

  conversation: Array<{
    role: "user" | "mirror";
    content: string;
  }>;

  livingField?: unknown;
  expressions?: unknown[];
  meanings?: unknown[];
  artifacts?: unknown[];

  readiness: BuildReadiness;
}

export interface GenerateNextMovesResult {
  moves: NextMove[];
  confidence: number;
}

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const clampConfidence = (
  value: unknown
): number => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(1, number)
  );
};

const normaliseMoveType = (
  value: unknown
): NextMoveType => {
  if (
    value === "create" ||
    value === "connect" ||
    value === "experiment" ||
    value === "decide"
  ) {
    return value;
  }

  return "explore";
};

const normaliseCreationAreas = (
  value: unknown
): CreationArea[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (
      area
    ): area is CreationArea =>
      area === "I" ||
      area === "People" ||
      area === "Planet"
  );
};

const normaliseMoves = (
  value: unknown
): NextMove[] => {
  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return value
    .filter(
      (
        item
      ): item is Record<string, unknown> =>
        !!item &&
        typeof item === "object" &&
        !Array.isArray(item)
    )
    .map(
      (
        item
      ): NextMove => ({
        title:
          typeof item.title ===
          "string"
            ? item.title.trim()
            : "",

        description:
          typeof item.description ===
          "string"
            ? item.description.trim()
            : "",

        type:
          normaliseMoveType(
            item.type
          ),

        rationale:
          typeof item.rationale ===
          "string"
            ? item.rationale.trim()
            : "",

        areas:
          normaliseCreationAreas(
            item.areas
          ),
      })
    )
    .filter(
      (
        move
      ) =>
        move.title.length > 0 &&
        move.description.length > 0 &&
        move.areas.length > 0
    )
    .slice(0, 4);
};

// --------------------------------------------------
// GENERATE NEXT MOVES
// --------------------------------------------------

export async function generateNextMoves(
  input: GenerateNextMovesInput
): Promise<GenerateNextMovesResult> {

  const {
    creation,
    journey,
    conversation,
    livingField,
    expressions,
    meanings,
    artifacts,
    readiness,
  } = input;

  if (
    !Array.isArray(conversation)
  ) {
    throw new Error(
      "generateNextMoves: conversation is required."
    );
  }

  if (!readiness) {
    throw new Error(
      "generateNextMoves: readiness is required."
    );
  }

  if (
    readiness.state !== "ready"
  ) {
    return {
      moves: [],
      confidence: 0,
    };
  }

  const prompt = `
You are generating possible next moves for an ongoing
human–Mirror creation conversation.

The human remains sovereign.

You are NOT deciding what the human should do.
You are NOT giving instructions.
You are NOT prescribing a path.
You are NOT optimizing for productivity.
You are NOT assuming that action is better than waiting.

Your role is to surface a small number of meaningful
possibilities that the human could consciously consider.

A next move may be:
- exploring something further
- creating something
- connecting with someone or something
- running a small experiment
- making a conscious decision

Only generate moves that arise naturally from the actual
creation context and conversation.

Do not manufacture possibilities simply to fill the list.

Do not:
- repeat generic productivity advice
- invent facts
- turn unresolved questions into recommendations
- interpret fear as something that must be overcome
- assume expansion is better
- assume action is better
- decide the desired outcome
- turn patterns into identity
- pressure the human toward a choice

The possibilities should feel specific to THIS creation.

Return between 2 and 4 moves.

Each move must contain:
- title
- description
- type
- rationale
- areas

"areas" must contain one or more of:
- "I"
- "People"
- "Planet"

A move may belong to one, two, or all three areas.

Choose the areas based on what the move actually creates
or changes. Do not add an area simply to include more areas.

The rationale should explain why this possibility emerges
from the current creation context.

IMPORTANT:

"Do nothing for now" is NOT an AI-generated move.
The human/Sovereign I interface will always provide that
choice separately.

Return ONLY valid JSON:

{
  "moves": [
    {
      "title": "short title",
      "description": "what this possibility could involve",
      "type": "explore | create | connect | experiment | decide",
      "rationale": "why this possibility emerges from the context",
      "areas": ["I"]
    }
  ],
  "confidence": 0
}

READINESS:
${JSON.stringify(readiness, null, 2)}

CONVERSATION:
${JSON.stringify(conversation, null, 2)}

CREATION:
${JSON.stringify(creation ?? null, null, 2)}

JOURNEY:
${JSON.stringify(journey ?? null, null, 2)}

LIVING FIELD:
${JSON.stringify(livingField ?? null, null, 2)}

EXPRESSIONS:
${JSON.stringify(expressions ?? [], null, 2)}

MEANINGS:
${JSON.stringify(meanings ?? [], null, 2)}

ARTIFACTS:
${JSON.stringify(artifacts ?? [], null, 2)}
`;

  try {

    const result =
      await generateAIResponse({
        type: "mirror",

        context: {
          directPrompt:
            prompt,
        },
      });

    const response =
      result as Record<
        string,
        unknown
      >;

    return {
      moves:
        normaliseMoves(
          response?.moves
        ),

      confidence:
        clampConfidence(
          response?.confidence
        ),
    };

  } catch (error) {

    console.error(
      "❌ NEXT MOVES GENERATION ERROR:",
      error
    );

    return {
      moves: [],
      confidence: 0,
    };
  }
}