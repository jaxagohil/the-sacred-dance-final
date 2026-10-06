import { generateAIResponse } from "../../../ai/generateAIResponse";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export type BuildReadinessState =
  | "exploring"
  | "clarifying"
  | "integrating"
  | "ready"
  | "pause";

export interface AssessBuildReadinessInput {
  conversation: Array<{
    role: "user" | "mirror";
    content: string;
  }>;

  consciousDesire?: string;

  creation?: unknown;
  journey?: unknown;
  livingField?: unknown;
  expressions?: unknown[];
  meanings?: unknown[];
  artifacts?: unknown[];
}

export interface BuildReadiness {
  state: BuildReadinessState;
  understanding: string;
  unresolved: string[];
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

const normaliseState = (
  value: unknown
): BuildReadinessState => {
  if (
    value === "clarifying" ||
    value === "integrating" ||
    value === "ready" ||
    value === "pause"
  ) {
    return value;
  }

  return "exploring";
};

const normaliseReadiness = (
  value: unknown
): BuildReadiness => {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return {
      state: "exploring",
      understanding: "",
      unresolved: [],
      confidence: 0,
    };
  }

  const response =
    value as Record<string, unknown>;

  return {
    state: normaliseState(
      response.state
    ),

    understanding:
      typeof response.understanding ===
      "string"
        ? response.understanding.trim()
        : "",

    unresolved:
      Array.isArray(
        response.unresolved
      )
        ? response.unresolved.filter(
            (
              item
            ): item is string =>
              typeof item ===
                "string" &&
              item.trim().length > 0
          )
        : [],

    confidence:
      clampConfidence(
        response.confidence
      ),
  };
};

// --------------------------------------------------
// ASSESS BUILD READINESS
// --------------------------------------------------

export async function assessBuildReadiness(
  input: AssessBuildReadinessInput
): Promise<BuildReadiness> {

  const {
  conversation,
  consciousDesire,
  creation,
  journey,
  livingField,
  expressions,
  meanings,
  artifacts,
} = input;

  if (
    !Array.isArray(conversation)
  ) {
    throw new Error(
      "assessBuildReadiness: conversation is required."
    );
  }

  if (conversation.length === 0) {
    return {
      state: "exploring",
      understanding: "",
      unresolved: [],
      confidence: 0,
    };
  }

  const prompt = `
You are assessing the current understanding of an ongoing
human–Mirror creation conversation.

This is NOT a coaching assessment.
This is NOT a judgement of the human.
This is NOT a decision about what the human should do.

The human remains sovereign.

CONSCIOUS DESIRE:

If a human-confirmed Conscious Desire is present, treat it as
the current human-owned anchor for the creation.

Do not silently rewrite, replace, or reinterpret it as though
the human has changed their desire.

Later conversation, experience, patterns, emotions, evidence,
or other stages of the Creation Journey may reveal tension,
new information, refinement, expansion, or change.

If there is tension between the confirmed Conscious Desire and
later information, make the tension visible rather than
deciding that the desire has changed.

The human decides whether their desire has changed.

Readiness does not require a perfect plan, certainty, absence
of fear, or a decision to act.

Your task is to assess whether the conversation has developed
enough understanding of the creation to eventually surface
possible next moves.

Do not manufacture certainty.
Do not interpret ambiguity as resistance.
Do not assume fear is a problem.
Do not diagnose the person.
Do not turn patterns into identity.
Do not decide what the human should create or do.

Distinguish carefully between:
- what is actually known
- what the human appears to mean
- what remains unclear
- what is still emerging
- what may need further exploration

READINESS STATES:

exploring
The creation is still emerging. More listening and exploration
are useful.

clarifying
Something important about the creation, desire, meaning,
constraint, tension or direction remains unclear.

integrating
Enough has emerged to reflect on and integrate the current
understanding, but it is not yet necessary to surface next moves.

ready
There is enough contextual understanding of:
- what is being created
- why it matters
- the human's current Conscious Desire
- what has emerged through the Build conversation
- relevant constraints, tensions or possibilities

that meaningful next possibilities could now be surfaced.

The human does NOT need to have chosen one.

pause
The conversation has reached a natural point where continuing
would likely add noise rather than useful understanding.

IMPORTANT:
"ready" means ready to surface possibilities.
It does NOT mean ready to act.
It does NOT mean the human has made a decision.

Return ONLY valid JSON:

{
  "state": "exploring | clarifying | integrating | ready | pause",
  "understanding": "concise description of what is currently understood",
  "unresolved": [
    "important unresolved question or ambiguity"
  ],
  "confidence": 0
}

CONVERSATION:
${JSON.stringify(conversation, null, 2)}

CREATION:
${JSON.stringify(creation ?? null, null, 2)}

JOURNEY:
${JSON.stringify(journey ?? null, null, 2)}

CONSCIOUS DESIRE:
${JSON.stringify(
  consciousDesire?.trim() || null,
  null,
  2
)}

LIVING FIELD:
${JSON.stringify(
  {
    creationPatterns:
      (livingField as any)?.creationPatterns ?? [],

    signals:
      Array.isArray(
        (livingField as any)?.signals
      )
        ? (livingField as any).signals.slice(-8)
        : [],

    chakraState:
      (livingField as any)?.chakraState ?? null,

    spiralScores:
      (livingField as any)?.spiralScores ?? null,

    realityLayers:
      (livingField as any)?.realityLayers ?? null,

    cosmic:
      (livingField as any)?.cosmic ?? null,
  },
  null,
  2
)}

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

    return normaliseReadiness(
      result
    );

  } catch (error) {

    console.error(
      "❌ BUILD READINESS ASSESSMENT ERROR:",
      error
    );

    return {
      state: "exploring",
      understanding: "",
      unresolved: [],
      confidence: 0,
    };
  }
}