// --------------------------------------------------
// 🌱 RENEW — GENERATE REFLECTION
// --------------------------------------------------
//
// RENEW does not advise.
// It reflects.
//
// FEEL • THINK • SAY • DO
//
// The human has already done the work.
// The AI's role is to make what is present more visible.
// Then it becomes quiet.
// --------------------------------------------------

import {
    getCreationContext,
} from "../../getCreationContext";

import {
    generateAIResponse,
} from "../../../ai/generateAIResponse";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export interface RenewInputs {
  feel: string;
  think: string;
  say: string;
  do: string;
}

export interface GenerateRenewReflectionInput {
  userId: string;
  intentionId: string;
  inputs: RenewInputs;
}

export type RenewReflection = {
  reflection: string;
};

// --------------------------------------------------
// FALLBACK
// --------------------------------------------------

const fallbackResponse = (): RenewReflection => ({
  reflection: "",
});

// --------------------------------------------------
// MAIN
// --------------------------------------------------

export async function generateRenewReflection(
  input: GenerateRenewReflectionInput
): Promise<RenewReflection> {
  const {
    userId,
    intentionId,
    inputs,
  } = input;

  if (!userId) {
    throw new Error(
      "generateRenewReflection: userId is required."
    );
  }

  if (!intentionId) {
    throw new Error(
      "generateRenewReflection: intentionId is required."
    );
  }

  // --------------------------------------------------
  // 1. LOAD CREATION CONTEXT
  // --------------------------------------------------

  const context = await getCreationContext({
    userId,
    intentionId,
    activeStage: "renew",
  });

  // --------------------------------------------------
  // 2. CURATE CONTEXT
  // --------------------------------------------------
  //
  // RENEW does not need the complete Living Field.
  // The four human inputs are the centre.
  //
  // --------------------------------------------------

  const renewContext = {
    creation: context.creation ?? {},
    journey: context.journey ?? {},
    expressions: context.expressions ?? [],
    meanings: context.meanings ?? [],
    artifacts: context.artifacts ?? [],
    livingField: {
      creationPatterns:
        context.livingField?.creationPatterns ?? [],

      signals:
        Array.isArray(
          context.livingField?.signals
        )
          ? context.livingField.signals.slice(-8)
          : [],

      spiralScores:
        context.livingField?.spiralScores ?? null,

      realityLayers:
        context.livingField?.realityLayers ?? null,
    },
  };

  // --------------------------------------------------
  // 3. BUILD PROMPT
  // --------------------------------------------------

  const prompt = `
You are the RENEW intelligence inside
the Conscious Creating journey.

Your role is to reflect what is present.

You are NOT here to advise the human,
solve anything for them, prescribe action,
or tell them what they should choose.

The human remains the authority.

--------------------------------------------------
THE FOUR HUMAN VOICES
--------------------------------------------------

FEEL
${JSON.stringify(inputs.feel)}

THINK
${JSON.stringify(inputs.think)}

SAY
${JSON.stringify(inputs.say)}

DO
${JSON.stringify(inputs.do)}

These four inputs are the primary material
for the reflection.

Treat the human's own words as meaningful.

Do not replace their language with generic
coaching, therapeutic, spiritual, or business
language unless it is genuinely present in
what they have expressed.

--------------------------------------------------
CREATION CONTEXT
--------------------------------------------------

${JSON.stringify(
  renewContext,
  null,
  2
)}

--------------------------------------------------
YOUR TASK
--------------------------------------------------

Reflect what you notice across FEEL, THINK,
SAY, and DO.

You may notice:

- alignment
- tension
- movement
- consistency
- contradiction
- something becoming clearer
- something that appears ready to change
- something that is already working
- a relationship between what is felt,
  thought, said, and done

Do not assume that tension means something
is wrong.

Do not assume that alignment means something
must be acted upon.

Do not diagnose.

Do not judge.

Do not interpret beyond what the material
supports.

The reflection should help the human SEE
themselves more clearly.

It should feel like a mirror, not advice.

--------------------------------------------------
VOICE
--------------------------------------------------

Be quiet, spacious, precise and human.

Use the human's own language where it carries
meaning.

Do not make the reflection overly poetic.

Do not turn it into a lesson.

Do not give recommendations.

Do not ask a question.

Do not end with a call to action.

Do not say what the human should do next.

--------------------------------------------------
OUTPUT
--------------------------------------------------

Return ONLY valid JSON.

Use exactly this structure:

{
  "reflection": "..."
}

The reflection should be concise:
approximately 2–4 sentences.

Do not include markdown.
Do not include commentary outside the JSON.
`;

  // --------------------------------------------------
  // 4. ASK EXISTING AI SERVICE
  // --------------------------------------------------

  try {
    const result = await generateAIResponse({
      type: "mirror",
      context: {
        directPrompt: prompt,
      },
    });

    // --------------------------------------------------
    // 5. PARSE
    // --------------------------------------------------

    let parsed: any = null;

    if (typeof result === "string") {
      try {
        parsed = JSON.parse(result);
      } catch {
        parsed = null;
      }
    } else if (
      result &&
      typeof result === "object"
    ) {
      parsed = result;
    }

    if (!parsed) {
      return fallbackResponse();
    }

    // --------------------------------------------------
    // 6. NORMALISE
    // --------------------------------------------------

    return {
      reflection:
        typeof parsed.reflection === "string"
          ? parsed.reflection.trim()
          : "",
    };
  } catch (error) {
    console.error(
      "❌ RENEW REFLECTION GENERATION ERROR:",
      error
    );

    return fallbackResponse();
  }
}