import {
  CreationContext,
} from "./getCreationContext";

import {
  buildDiscoverPrompt,
} from "./prompts/buildDiscoverPrompt";

import {
  supabase,
} from "../../services/supabase";

import {
  generateAIResponse,
} from "../ai/generateAIResponse";

export interface DiscoverConsciousDesireInput {
  context: CreationContext;
}

export interface ConsciousDesireProposal {
  desire: string;
  creationDetails: string[];
  synthesis: string;
  patternReflection: string;
  evidence: string[];
  tensions: string[];
  confidence: number;
}

export async function discoverConsciousDesire(
  input: DiscoverConsciousDesireInput
): Promise<ConsciousDesireProposal | null> {
  const { context } = input;

  if (!context) {
    throw new Error(
      "discoverConsciousDesire: context is required."
    );
  }

const prompt =
  buildDiscoverPrompt(context);

console.log(
  "🌱 DISCOVER — PROMPT BUILT"
);

const result =
  await generateAIResponse({

    type:
      "conscious_creating_discover",

    context: {
      directPrompt:
        prompt,
    },

    data: {
      language:
        context.person.language || "en",
    },

  });

console.log(
  "🌱 DISCOVER — AI RESULT:",
  result
);

console.log(
  "🌱 DISCOVER — AI RESULT TYPE:",
  typeof result,
  Array.isArray(result)
);

let parsedResult: any = result;

if (typeof parsedResult === "string") {
  const cleaned = parsedResult
    .replace(/```json/gi, "")
    .replace(/```/gi, "")
    .trim();

  try {
    parsedResult = JSON.parse(cleaned);
  } catch (error) {
    console.error(
      "❌ DISCOVER — JSON PARSE ERROR:",
      error
    );
    return null;
  }
}

if (
  !parsedResult ||
  typeof parsedResult !== "object"
) {
  return null;
}

const proposal: ConsciousDesireProposal = {
  desire:
    typeof parsedResult.desire === "string"
      ? parsedResult.desire
      : "",

  creationDetails:
    Array.isArray(parsedResult.creationDetails)
      ? parsedResult.creationDetails
      : [],

  synthesis:
    typeof parsedResult.synthesis === "string"
      ? parsedResult.synthesis
      : "",

  patternReflection:
    typeof parsedResult.patternReflection === "string"
      ? parsedResult.patternReflection
      : "",

  evidence:
    Array.isArray(parsedResult.evidence)
      ? parsedResult.evidence
      : [],

  tensions:
    Array.isArray(parsedResult.tensions)
      ? parsedResult.tensions
      : [],

  confidence:
    typeof parsedResult.confidence === "number"
      ? parsedResult.confidence
      : 0,
};

// --------------------------------------------------
// 💾 SAVE DISCOVER AI RESPONSE
// --------------------------------------------------

const intentionId =
  context.creation.id;

const {
  data: existingStep,
  error: findError,
} = await supabase
  .from("sovereign_intention_steps")
  .select("id")
  .eq("intention_id", intentionId)
  .eq("step", "discover")
  .maybeSingle();

if (findError) {
  console.error(
    "❌ DISCOVER — FIND STEP ERROR:",
    findError
  );
} else if (existingStep) {
  const { error: updateError } =
    await supabase
      .from("sovereign_intention_steps")
      .update({
        ai_response: proposal,
      })
      .eq("id", existingStep.id);

  if (updateError) {
    console.error(
      "❌ DISCOVER — AI RESPONSE UPDATE ERROR:",
      updateError
    );
  }
} else {
  const { error: insertError } =
    await supabase
      .from("sovereign_intention_steps")
      .insert({
        intention_id: intentionId,
        step: "discover",
        ai_response: proposal,
      });

  if (insertError) {
    console.error(
      "❌ DISCOVER — AI RESPONSE INSERT ERROR:",
      insertError
    );
  }
}

console.log(
  "💾 DISCOVER — AI RESPONSE SAVED:",
  proposal
);

return proposal;
}