
/**
 * SOVEREIGN I — ORCHESTRATOR
 *
 * The orchestration intelligence for conscious creation.
 *
 * Reads the person's context, reasons about what is
 * happening and decides what should happen next.
 *
 * Sovereign I orchestrates.
 * Capabilities perform specialised work.
 */

import { generateAIResponse } from "../../../ai/generateAIResponse";

import { getSovereignContext } from "../context/getSovereignIContext";

import { captureExpression } from "../../consciousCreating/captureExpression";

import { interpretExpression } from "../../consciousCreating/interpretExpression";

import { SOVEREIGN_I_INSTRUCTIONS } from "./sovereignI.instructions";

import { mirrorCapability } from "../capabilities/mirror/mirrorCapability";

import {
  loadBuildConversation,
} from "../../consciousCreating/agents/mirror/persistBuildConversation";

import type {
  CreationStage,
  SovereignICapabilityResult,
  SovereignIContext,
  SovereignIConversation,
  SovereignIDecision,
  SovereignIOrchestrationResult,
} from "./sovereignI.types";

// --------------------------------------------------
// INPUT
// --------------------------------------------------

export interface SovereignIInput {
  userId: string;
  intentionId: string;
  currentMessage: string;
  activeStage?: CreationStage;
  conversation?: SovereignIConversation;
}

// --------------------------------------------------
// CONFIGURATION
// --------------------------------------------------

const MAX_CAPABILITY_INVOCATIONS = 1;

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

const getLanguage = (context: SovereignIContext): string => {
  const person = context.person;

  if (
    person &&
    typeof person === "object" &&
    "language" in person &&
    typeof person.language === "string"
  ) {
    return person.language;
  }

  return "en";
};

// --------------------------------------------------
// DECISION PARSING
// --------------------------------------------------

function parseDecision(result: unknown): SovereignIDecision {
  let parsed = result;

  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      throw new Error(
        "Sovereign I returned an invalid decision."
      );
    }
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    Array.isArray(parsed)
  ) {
    throw new Error(
      "Sovereign I returned an invalid decision structure."
    );
  }

  const decision = parsed as Record<string, unknown>;

  switch (decision.action) {
    case "invoke_capability": {
      if (
        decision.capability !== "mirror" ||
        typeof decision.reason !== "string"
      ) {
        throw new Error(
          "Sovereign I returned an unsupported capability."
        );
      }

      return {
        action: "invoke_capability",
        capability: "mirror",
        reason: decision.reason,
      };
    }

    case "respond": {
      if (typeof decision.response !== "string") {
        throw new Error(
          "Sovereign I response is missing."
        );
      }

      return {
        action: "respond",
        response: decision.response,
      };
    }

    case "invite": {
      if (typeof decision.invitation !== "string") {
        throw new Error(
          "Sovereign I invitation is missing."
        );
      }

      return {
        action: "invite",
        invitation: decision.invitation,
      };
    }

    case "no_intervention": {
      return {
        action: "no_intervention",
        reason:
          typeof decision.reason === "string"
            ? decision.reason
            : "No intervention is appropriate.",
      };
    }

    default:
      throw new Error(
        "Sovereign I returned an unknown decision."
      );
  }
}

// --------------------------------------------------
// ORCHESTRATION PROMPT
// --------------------------------------------------

function buildOrchestrationPrompt({
  context,
  conversation,
  currentMessage,
  activeStage,
  capabilityResults,
  canInvokeCapability,
}: {
  context: SovereignIContext;
  conversation: SovereignIConversation;
  currentMessage: string;
  activeStage?: CreationStage;
  capabilityResults: SovereignICapabilityResult[];
  canInvokeCapability: boolean;
}): string {
  return `
${SOVEREIGN_I_INSTRUCTIONS}

----------------------------------------
AVAILABLE CAPABILITIES
----------------------------------------

Currently executable:

1. MIRROR
   Explores the person's creation through conversation.
   Most relevant to BUILD, but may be useful elsewhere
   when conversational exploration is appropriate.

Do not select Glimmer or Reflection.
They are not currently executable.

Capability invocation currently permitted:
${canInvokeCapability ? "YES" : "NO — the invocation limit has been reached."}

----------------------------------------
ACTIVE CREATION STAGE
----------------------------------------

${activeStage || "Not specified"}

----------------------------------------
CREATION CONTEXT
----------------------------------------

${safeJson(context)}

----------------------------------------
CONVERSATION
----------------------------------------

${safeJson(conversation.messages)}

----------------------------------------
CURRENT HUMAN MESSAGE
----------------------------------------

${currentMessage}

----------------------------------------
PREVIOUS CAPABILITY RESULTS
----------------------------------------

${safeJson(capabilityResults)}

----------------------------------------
YOUR DECISION
----------------------------------------

Consider the whole context, the current human message,
the conversation and any previous capability results.

If a capability has already been invoked, consider
what it contributed before deciding what happens next.

Do not repeat work unnecessarily.

Decide whether to:

- invoke_capability
- respond
- invite
- no_intervention

${canInvokeCapability
  ? "You may invoke MIRROR if further specialised exploration is genuinely useful."
  : "You MUST NOT invoke another capability. Make a final decision now."}

Do not invoke a capability automatically.

Do not interpret the person's inner truth as fact.

Return ONLY valid JSON.

For invoke_capability:

{
  "action": "invoke_capability",
  "capability": "mirror",
  "reason": "Brief explanation"
}

For respond:

{
  "action": "respond",
  "response": "Your direct response"
}

For invite:

{
  "action": "invite",
  "invitation": "A gentle invitation"
}

For no_intervention:

{
  "action": "no_intervention",
  "reason": "Why no intervention is appropriate"
}
`;
}

// --------------------------------------------------
// REQUEST A DECISION
// --------------------------------------------------

async function requestDecision({
  context,
  conversation,
  currentMessage,
  activeStage,
  capabilityResults,
  canInvokeCapability,
}: {
  context: SovereignIContext;
  conversation: SovereignIConversation;
  currentMessage: string;
  activeStage?: CreationStage;
  capabilityResults: SovereignICapabilityResult[];
  canInvokeCapability: boolean;
}): Promise<SovereignIDecision> {

  const prompt = buildOrchestrationPrompt({
    context,
    conversation,
    currentMessage,
    activeStage,
    capabilityResults,
    canInvokeCapability,
  });

  const rawDecision = await generateAIResponse({
    type: "sovereign_i_engine",
    context: {
      directPrompt: prompt,
    },
    data: {
      language: getLanguage(context),
    },
  });

  const decision = parseDecision(rawDecision);

  if (
    decision.action === "invoke_capability" &&
    !canInvokeCapability
  ) {
    throw new Error(
      "Sovereign I attempted to invoke a capability after reaching the invocation limit."
    );
  }

  return decision;
}

// --------------------------------------------------
// EXECUTE CAPABILITY
// --------------------------------------------------

async function executeCapability({
  decision,
  context,
  conversation,
  currentMessage,
}: {
  decision: SovereignIDecision;
  context: SovereignIContext;
  conversation: SovereignIConversation;
  currentMessage: string;
}): Promise<SovereignICapabilityResult> {

  if (decision.action !== "invoke_capability") {
    throw new Error(
      "Cannot execute a capability without an invocation decision."
    );
  }

  switch (decision.capability) {
    case "mirror":
      return mirrorCapability({
        context,
        conversation,
        currentMessage,
      });

    default:
      throw new Error(
        "Sovereign I selected a capability that is not executable."
      );
  }
}

// --------------------------------------------------
// MAIN ORCHESTRATOR
// --------------------------------------------------

export async function sovereignIOrchestrator(
  input: SovereignIInput
): Promise<SovereignIOrchestrationResult> {

  if (!input.userId || !input.intentionId) {
    throw new Error(
      "Sovereign I requires userId and intentionId."
    );
  }

  if (!input.currentMessage?.trim()) {
    throw new Error(
      "Sovereign I requires a current message."
    );
  }

  // ----------------------------------------------
  // 1. LOAD COMPLETE CREATION CONTEXT
  // ----------------------------------------------

  let context = await getSovereignContext({
    userId: input.userId,
    intentionId: input.intentionId,
    activeStage: input.activeStage,
  });

  // ----------------------------------------------
  // 2. CAPTURE THE HUMAN EXPRESSION
  // ----------------------------------------------

  const expression = await captureExpression({
    userId: input.userId,
    intentionId: input.intentionId,
    content: input.currentMessage,
    sourceType: "text",
  });

  // ----------------------------------------------
  // 3. INTERPRET THE EXPRESSION
  // ----------------------------------------------

  await interpretExpression({
    userId: input.userId,
    intentionId: input.intentionId,
    expressionId: expression.id,
    expression: input.currentMessage,
    context: {
      creationContext: context,
    },
  });

  // ----------------------------------------------
  // 4. REFRESH CONTEXT
  // ----------------------------------------------

  context = await getSovereignContext({
    userId: input.userId,
    intentionId: input.intentionId,
    activeStage: input.activeStage,
  });

  // ----------------------------------------------
  // 5. PREPARE CONVERSATION
  // ----------------------------------------------

  const existingBuild =
    await loadBuildConversation(input.intentionId);

  const conversation: SovereignIConversation = {
    messages: [
      ...existingBuild.conversation.map((message) => ({
        role:
          message.role === "mirror"
            ? "assistant" as const
            : message.role === "assistant"
              ? "assistant" as const
              : "user" as const,
        content: message.content,
      })),
      ...(input.conversation?.messages || []),
    ],
  };

  // ----------------------------------------------
  // 6. PREPARE CAPABILITY RESULTS
  // ----------------------------------------------

  const capabilityResults: SovereignICapabilityResult[] = [];

  let decision: SovereignIDecision;

  // ----------------------------------------------
  // 7. ORCHESTRATION LOOP
  // ----------------------------------------------

  for (
    let step = 0;
    step <= MAX_CAPABILITY_INVOCATIONS;
    step++
  ) {

    const canInvokeCapability =
      step < MAX_CAPABILITY_INVOCATIONS;

    // --------------------------------------------
    // SOVEREIGN I DECIDES
    // --------------------------------------------

    decision = await requestDecision({
      context,
      conversation,
      currentMessage: input.currentMessage,
      activeStage: input.activeStage,
      capabilityResults,
      canInvokeCapability,
    });

    // --------------------------------------------
    // FINAL DECISION
    // --------------------------------------------

    if (decision.action !== "invoke_capability") {
      return {
        decision,
        capabilityResults,
        response:
          decision.action === "respond"
            ? decision.response
            : decision.action === "invite"
              ? decision.invitation
              : "",
        activeStage: input.activeStage,
      };
    }

    // --------------------------------------------
    // EXECUTE SELECTED CAPABILITY
    // --------------------------------------------

    const result = await executeCapability({
      decision,
      context,
      conversation,
      currentMessage: input.currentMessage,
    });

    capabilityResults.push(result);

    // The next loop iteration gives Sovereign I
    // the capability result and asks it to reassess.
  }

  // ----------------------------------------------
  // 8. SAFETY FALLBACK
  // ----------------------------------------------

  const lastResult =
    capabilityResults[capabilityResults.length - 1];

  return {
    decision: {
      action: "no_intervention",
      reason: "The orchestration invocation limit was reached.",
    },
    capabilityResults,
    response: lastResult?.content || "",
    activeStage: input.activeStage,
  };
}
