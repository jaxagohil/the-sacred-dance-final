
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

import { captureExpression } from "./captureExpression";

import { interpretExpression } from "./interpretExpression";

import { SOVEREIGN_I_INSTRUCTIONS } from "./sovereignI.instructions";

import { mirrorCapability } from "../capabilities/mirror/mirrorCapability";

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

  // Human expression pathway
  currentMessage?: string;

  // How Sovereign I was activated
  mode?: "expression" | "event_reassessment";

  // Transient interaction context.
  // This is NOT a persisted Living Field signal.
  eventContext?: {
    type: string;
    [key: string]: unknown;
  };

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
    return JSON.stringify(value ?? {}, null, 2) ?? "{}";
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
  triggerType,
  eventContext,
  capabilityResults,
  canInvokeCapability,
}: {
  context: SovereignIContext;
  conversation: SovereignIConversation;
  currentMessage: string;
  activeStage?: CreationStage;
  triggerType: "expression" | "event_reassessment";
  eventContext?: Record<string, unknown>;
  capabilityResults: SovereignICapabilityResult[];
  canInvokeCapability: boolean;
}): string {
  const livingField = context.livingField;

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
TRIGGER TYPE
----------------------------------------

${triggerType}

----------------------------------------
TRANSIENT INTERACTION EVENT
----------------------------------------

${safeJson(eventContext || {})}

IMPORTANT:

An event_reassessment is a UI interaction or navigation
event. It is not automatically a new human expression.

Do not treat a portal selection or Glimmer selection
as a persisted Living Field signal.

Do not assume that the person has completed an action
merely because they selected a Glimmer.

----------------------------------------
CREATION CONTEXT
----------------------------------------

${safeJson(context)}

----------------------------------------
REALITY LAYERS
----------------------------------------

${safeJson(livingField?.realityLayers)}

----------------------------------------
ENERGY FIELD
----------------------------------------

${safeJson(livingField?.energy)}

These are derived from the existing Living Field.
The Energy Field may contain interactive points such as
chakras, distortion dots and other mapped relationships.
Use only the structures and details actually supplied.

Do not invent values, scores, meanings or changes.
Do not assume that interacting with a point changes the
underlying Reality Layers or Energy Field.

----------------------------------------
CONVERSATION
----------------------------------------

${safeJson(conversation.messages)}

----------------------------------------
CURRENT TRIGGER MESSAGE
----------------------------------------

${currentMessage}

----------------------------------------
PREVIOUS CAPABILITY RESULTS
----------------------------------------

${safeJson(capabilityResults)}

----------------------------------------
YOUR DECISION
----------------------------------------

Consider the whole context:

- The person's existing Living Field
- The four Reality Layers and any selected layer indicator
- The Energy Field, including any selected chakra,
  distortion dot, interaction point or connection
- The creation and its current stage
- The current interaction or human expression
- The conversation
- Previous capability results

For expression mode, consider the new human expression
alongside the existing context.

For event_reassessment mode, consider the transient
interaction alongside the existing context.

Do not confuse an interaction event with a new signal.

Do not assume that every interaction requires a response.

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

Do not impose meaning, positivity or a next step.

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
  triggerType,
  eventContext,
  capabilityResults,
  canInvokeCapability,
}: {
  context: SovereignIContext;
  conversation: SovereignIConversation;
  currentMessage: string;
  activeStage?: CreationStage;
  triggerType: "expression" | "event_reassessment";
  eventContext?: Record<string, unknown>;
  capabilityResults: SovereignICapabilityResult[];
  canInvokeCapability: boolean;
}): Promise<SovereignIDecision> {

  const prompt = buildOrchestrationPrompt({
    context,
    conversation,
    currentMessage,
    activeStage,
    triggerType,
    eventContext,
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

  const mode = input.mode || "expression";

  // ----------------------------------------------
  // VALIDATE TRIGGER
  // ----------------------------------------------

  if (
    mode === "expression" &&
    !input.currentMessage?.trim()
  ) {
    throw new Error(
      "Sovereign I requires a current message in expression mode."
    );
  }

  if (
    mode === "event_reassessment" &&
    !input.eventContext
  ) {
    throw new Error(
      "Sovereign I requires event context for reassessment."
    );
  }

  // This message is used by the existing capability
  // interface. In event mode it describes the event;
  // it is NOT captured as a human expression.

  const currentMessage =
    mode === "expression"
      ? input.currentMessage!.trim()
      : `A UI exploration event (not a new human expression) occurred:\n${safeJson(input.eventContext)}`;

  // ----------------------------------------------
  // 1. LOAD COMPLETE CREATION CONTEXT
  // ----------------------------------------------

  let context = await getSovereignContext({
    userId: input.userId,
    intentionId: input.intentionId,
    activeStage: input.activeStage,
  });

  // ----------------------------------------------
  // 2. CAPTURE AND INTERPRET HUMAN EXPRESSION
  // ----------------------------------------------

  if (mode === "expression") {

    const expression = await captureExpression({
      userId: input.userId,
      intentionId: input.intentionId,
      content: currentMessage,
      sourceType: "text",
    });

    await interpretExpression({
      userId: input.userId,
      intentionId: input.intentionId,
      expressionId: expression.id,
      expression: currentMessage,
      context: {
        creationContext: context,
      },
    });
  }

  // ----------------------------------------------
  // 3. REFRESH CREATION CONTEXT WHEN NEEDED
  // ----------------------------------------------

  // A new human expression may have changed persisted
  // Living Field data through the existing expression
  // pipeline, so rebuild the context after interpretation.
  //
  // Event reassessment does not create an expression or
  // signal. It therefore uses the context loaded above.

  if (mode === "expression") {
    context = await getSovereignContext({
      userId: input.userId,
      intentionId: input.intentionId,
      activeStage: input.activeStage,
    });
  }

  // ----------------------------------------------
  // 4. PREPARE CONVERSATION
  // ----------------------------------------------

  // Conversation history is supplied by the caller.
  // The orchestrator does not assume a separate Build
  // conversation persistence mechanism exists.

  const conversation: SovereignIConversation = {
    messages: [
      ...(input.conversation?.messages || []),
    ],
  };

  // ----------------------------------------------
  // 5. PREPARE CAPABILITY RESULTS
  // ----------------------------------------------

  const capabilityResults: SovereignICapabilityResult[] = [];

  let decision: SovereignIDecision;

  // ----------------------------------------------
  // 6. ORCHESTRATION LOOP
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
      currentMessage,
      activeStage: input.activeStage,
      triggerType: mode,
      eventContext: input.eventContext,
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
      currentMessage,
    });

    capabilityResults.push(result);

    // The next loop iteration gives Sovereign I
    // the capability result and asks it to reassess.
  }

  // ----------------------------------------------
  // 7. SAFETY FALLBACK
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
