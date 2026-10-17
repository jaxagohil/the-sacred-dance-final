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

  consciousDesire?: string;

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
// COMPACT CONTEXT FOR NEXT MOVES
// --------------------------------------------------

const compactJourney = (
  value: unknown
) => {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return null;
  }

  const journey =
    value as Record<string, unknown>;

  const stages =
    journey.stages;

  if (
    !stages ||
    typeof stages !== "object"
  ) {
    return journey;
  }

  const stageMap =
    stages as Record<string, unknown>;

  return {
    activeStage:
      journey.activeStage ?? "build",

    stages: Object.fromEntries(
      Object.entries(stageMap).map(
        ([stage, data]) => {

          if (
            !data ||
            typeof data !== "object"
          ) {
            return [
              stage,
              data,
            ];
          }

          const stageData =
            data as Record<string, unknown>;

          return [
            stage,
            {
              step:
                stageData.step,

              response:
                stageData.response,

              ai_response:
                stageData.ai_response,
            },
          ];
        }
      )
    ),
  };
};

const compactLivingField = (
  value: unknown
) => {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return null;
  }

  const field =
    value as Record<string, unknown>;

  return {
    ready:
      field.ready ?? null,

    energy:
      field.energy ?? null,

    realityLayers:
      field.realityLayers ?? null,

    signals:
      Array.isArray(field.signals)
        ? field.signals.slice(-5)
        : [],

    chakraState:
      field.chakraState ?? null,

    spiralScores:
      field.spiralScores ?? null,

    creationPatterns:
      Array.isArray(
        field.creationPatterns
      )
        ? field.creationPatterns
            .slice(0, 5)
        : [],

    cosmic:
      field.cosmic ?? null,
  };
};

const compactConversation =
  (
    value: GenerateNextMovesInput["conversation"]
  ) => {

    return value.slice(-8);
  };

const compactList = (
  value: unknown[] | undefined,
  limit: number
) => {

  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return value.slice(-limit);
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
    consciousDesire,
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

  // --------------------------------------------------
  // COMPACT THE CONTEXT BEFORE BUILDING THE PROMPT
  // --------------------------------------------------

  const compactJourneyContext =
    compactJourney(journey);

  const compactLivingFieldContext =
    compactLivingField(
      livingField
    );

  const compactConversationContext =
    compactConversation(
      conversation
    );

  const compactExpressions =
    compactList(
      expressions,
      10
    );

  const compactMeanings =
    compactList(
      meanings,
      10
    );

  const compactArtifacts =
    compactList(
      artifacts,
      10
    );

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

PRIORITISE THE LATEST EXCHANGE:

Use the most recent user message and the Mirror's response
to determine what possibilities are relevant now.

Interpret the user's latest answer in the context of the
question or topic immediately preceding it.

If the user has answered a question, the next moves should
reflect that answer and advance the specific conversation
naturally. Do not keep offering options from an earlier
point in the conversation unless they remain genuinely
relevant.

For example, if the conversation has moved to a LinkedIn
posting schedule, offer possibilities related to that
schedule or the user's expressed intention. Do not continue
offering earlier options about clarifying the overall
creation unless that is still relevant.

The latest exchange should guide the immediate next moves,
while the wider creation context remains the anchor.

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


CREATION PURPOSE — THE PRIMARY ANCHOR

Identify the human's intended creation from the Conscious Desire,
creation details, and conversation.

Treat that intention as the primary anchor for generating next moves.

Every proposed move must have a clear, explainable connection
to this specific creation and its current state.

Ask yourself:
- What is the human seeking to create, experience, change or explore?
- What has the human already expressed about this creation?
- What possibility emerges naturally from the current context?
- How might this possibility serve the creation without assuming
  what the human should want or do next?

Generate possibilities that are specific to this creation,
not activities that could be suggested to almost anyone.

The moves may involve exploring, creating, connecting,
experimenting or deciding, depending on what the context calls for.
Do not favour one type of move over another.

Each move's rationale must explain its connection to the
human's intended creation and current context.

If the intention or direction is unclear, offer a relevant
possibility for clarifying it rather than inventing an answer.

The human remains sovereign: offer meaningful possibilities,
not prescribed steps or a predetermined path.

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

CONSCIOUS DESIRE:
${JSON.stringify(
  consciousDesire?.trim() || null,
  null,
  2
)}

CONSCIOUS CREATING:

The Creation Journey is a spiral, not a linear sequence.

The creation may move between:
DREAM → DISCOVER → BUILD → GROW → SCALE → RENEW
in any direction and may return to an earlier state.

Generate possibilities from the creation as it exists now.

The human-confirmed Conscious Desire is the current human-owned
anchor.

Do not silently replace or redefine that desire.

Later experiences, expressions, meanings, artifacts, patterns,
or other journey stages may reveal new possibilities or tension,
but they do not automatically mean the human's desire has changed.

A next move should emerge from the thread of the creation —
not from a generic idea of what usually comes next.

Specificity is not the opposite of expansion.
A small, specific possibility may be exactly what allows the
creation to become more real.

Use the human's own expressions and meanings as important
sources of language and direction.

Do not introduce unrelated possibilities simply because they
sound interesting.

READINESS:
${JSON.stringify(readiness, null, 2)}

CONVERSATION:
${JSON.stringify(
  compactConversationContext,
  null,
  2
)}

CREATION:
${JSON.stringify(
  creation ?? null,
  null,
  2
)}

JOURNEY:
${JSON.stringify(
  compactJourneyContext,
  null,
  2
)}

LIVING FIELD:
${JSON.stringify(
  compactLivingFieldContext,
  null,
  2
)}

EXPRESSIONS:
${JSON.stringify(
  compactExpressions,
  null,
  2
)}

MEANINGS:
${JSON.stringify(
  compactMeanings,
  null,
  2
)}

ARTIFACTS:
${JSON.stringify(
  compactArtifacts,
  null,
  2
)}

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