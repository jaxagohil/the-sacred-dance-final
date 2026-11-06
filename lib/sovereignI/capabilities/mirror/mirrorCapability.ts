
import { generateAIResponse } from "../../../ai/generateAIResponse";

import type {
    SovereignICapabilityResult,
    SovereignIContext,
    SovereignIConversation,
} from "../../orchestration/sovereignI.types";

import { MIRROR_INSTRUCTIONS } from "./mirror.instructions";

// --------------------------------------------------
// INPUT
// --------------------------------------------------

export interface MirrorCapabilityInput {
  context: SovereignIContext;
  conversation: SovereignIConversation;
  currentMessage: string;
}

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const safeJson = (value: unknown): string => {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "{}";
  }
};

const extractMessage = (result: unknown): string => {
  if (typeof result === "string") {
    return result;
  }

  if (
    result &&
    typeof result === "object" &&
    !Array.isArray(result)
  ) {
    const value = result as Record<string, unknown>;

    if (typeof value.message === "string") {
      return value.message;
    }

    if (typeof value.content === "string") {
      return value.content;
    }

    if (typeof value.response === "string") {
      return value.response;
    }
  }

  throw new Error(
    "Mirror: AI response did not contain a message."
  );
};

// --------------------------------------------------
// PROMPT
// --------------------------------------------------

function buildMirrorPrompt(
  input: MirrorCapabilityInput
): string {
  return `
${MIRROR_INSTRUCTIONS}

----------------------------------------
CREATION CONTEXT
----------------------------------------

${safeJson(input.context)}

----------------------------------------
CONVERSATION
----------------------------------------

${safeJson(input.conversation.messages)}

----------------------------------------
CURRENT MESSAGE
----------------------------------------

${input.currentMessage}

----------------------------------------
RESPONSE
----------------------------------------

Respond directly to the person's current message.

Use the wider context where relevant.
Do not repeat the entire context.
Do not manufacture insight or force a next step.

Return the conversational response only.
`;
}

// --------------------------------------------------
// MIRROR CAPABILITY
// --------------------------------------------------

export async function mirrorCapability(
  input: MirrorCapabilityInput
): Promise<SovereignICapabilityResult> {
  if (!input.currentMessage?.trim()) {
    throw new Error(
      "Mirror: currentMessage is required."
    );
  }

  const prompt = buildMirrorPrompt(input);

  const result = await generateAIResponse({
    type: "mirror",
    context: {
      directPrompt: prompt,
    },
data: {
  language:
    input.context.person &&
    typeof input.context.person === "object" &&
    "language" in input.context.person &&
    typeof input.context.person.language === "string"
      ? input.context.person.language
      : "en",
},
  });

  const message = extractMessage(result);

  return {
    capabilityId: "mirror",
    content: message,
  };
}
