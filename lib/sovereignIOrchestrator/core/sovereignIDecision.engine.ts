
/**
 * Sovereign I — Decision Engine
 *
 * PURPOSE
 *
 * Assesses an event using its relevant context
 * and returns a validated Sovereign I decision.
 *
 * The engine decides.
 * It does not execute capabilities.
 */

import { generateAIResponse } from "../../ai/generateAIResponse";

import { assembleSovereignIContext } from "../context/sovereignIContext.assembler";

import { getAvailableCapabilities } from "../capabilities/sovereignICapability.resolver";

import { sovereignIDecisionPrompt } from "./sovereignIDecision.prompt";

import type {
  SovereignIContextDomain,
  SovereignIEvent,
} from "../events/sovereignIEvent.types";

import type {
  SovereignIDecision,
  SovereignIDecisionType,
} from "./sovereignIDecision.types";

const VALID_DECISIONS: SovereignIDecisionType[] = [
  "observe",
  "update_context",
  "reassess",
  "invoke_capability",
  "update_presentation",
  "invite",
  "respond",
  "do_nothing",
];

const VALID_LEVELS = ["low", "moderate", "high"];

const VALID_CONTEXTS: SovereignIContextDomain[] = [
  "user",
  "livingField",
  "liveUI",
  "creation",
  "cosmic",
  "capability",
];

/**
 * Safe fallback when the AI response is invalid.
 */
function createFallbackDecision(
  event: SovereignIEvent
): SovereignIDecision {
  return {
    decisionId: `${event.eventId}-fallback`,
    eventId: event.eventId,

    assessment: {
      significance: "low",
      impact: "low",
      relevance: "low",
      reasoning: "No validated assessment was returned.",
    },

    decision: "observe",
    reason: "Retain awareness without taking further action.",
    relevantContexts: [],
    createdAt: new Date().toISOString(),
  };
}

/**
 * Validate and normalise the AI response.
 */
function validateDecision(
  result: any,
  event: SovereignIEvent
): SovereignIDecision {

    // Normalise AI responses that arrive as JSON strings.
  if (typeof result === "string") {
    const cleaned = result
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "");

    try {
      result = JSON.parse(cleaned);
    } catch {
      console.error(
        "SOVEREIGN I: Could not parse AI decision JSON:",
        result
      );

      return createFallbackDecision(event);
    }
  }

  if (
    !result ||
    !VALID_DECISIONS.includes(result.decision)
  ) {
    return createFallbackDecision(event);
  }

  const assessment = result.assessment;

  if (
    !assessment ||
    !VALID_LEVELS.includes(assessment.significance) ||
    !VALID_LEVELS.includes(assessment.impact) ||
    !VALID_LEVELS.includes(assessment.relevance)
  ) {
    return createFallbackDecision(event);
  }

  const relevantContexts = Array.isArray(result.relevantContexts)
    ? result.relevantContexts.filter(
        (domain: string) =>
          VALID_CONTEXTS.includes(domain as SovereignIContextDomain) &&
          event.contextImpact.includes(domain as SovereignIContextDomain)
      )
    : [];

  let decision = result.decision as SovereignIDecisionType;

  let capabilityId: string | undefined;

  if (decision === "invoke_capability") {
    const availableCapabilities = getAvailableCapabilities();

    const capability = availableCapabilities.find(
      (item) => item.id === result.capabilityId
    );

    if (capability) {
      capabilityId = capability.id;
    } else {
      decision = "observe";
    }
  }

  return {
    decisionId: `${event.eventId}-${Date.now()}`,
    eventId: event.eventId,

    assessment: {
      significance: assessment.significance,
      impact: assessment.impact,
      relevance: assessment.relevance,
      reasoning: assessment.reasoning || "",
    },

    decision,

    reason: result.reason || "No reason supplied.",

    relevantContexts,

    capabilityId,

    createdAt: new Date().toISOString(),
  };
}

/**
 * Run the Sovereign I decision process.
 */
export async function runSovereignIDecision(
  event: SovereignIEvent
): Promise<SovereignIDecision> {

    // Living Space entry is an initialisation event,
  // not a request for an AI-driven capability.

  if (event.eventType === "livingSpace.entered") {
    return {
      decisionId: `${event.eventId}-entry`,
      eventId: event.eventId,

      assessment: {
        significance: "low",
        impact: "low",
        relevance: "low",
        reasoning: "Living Space entry triggers context initialisation only.",
      },

      decision: "observe",
      reason: "Initialise User Context without invoking a capability.",
      relevantContexts: [],
      createdAt: new Date().toISOString(),
    };
  }

  try {
    // 1. ASSEMBLE RELEVANT CONTEXT

const context = await assembleSovereignIContext({
  event,
  purpose: "decision",
});

    console.log("SOVEREIGN I CONTEXT SIZES:", {
  userContext: JSON.stringify(context.userContext || {}).length,
  livingField: JSON.stringify(context.livingField || {}).length,
  creationContext: JSON.stringify(context.creationContext || {}).length,
  cosmicContext: JSON.stringify(context.cosmicContext || {}).length,
  capabilityContext: JSON.stringify(context.capabilityContext || {}).length,
  total: JSON.stringify(context).length,
});

    // 2. PREPARE DECISION PROMPT

    const directPrompt = `
${sovereignIDecisionPrompt}

--------------------------------------------------
EVENT
--------------------------------------------------

${JSON.stringify(event, null, 2)}

--------------------------------------------------
AVAILABLE CONTEXT
--------------------------------------------------

${JSON.stringify(context, null, 2)}

--------------------------------------------------
DECISION INSTRUCTION
--------------------------------------------------

Assess this event using only the supplied evidence
and context.

Return exactly one valid JSON decision object
following the required output structure.
`;

    // 3. REQUEST AI ASSESSMENT

    const result = await generateAIResponse({
      type: "sovereign_i_engine",
      context: {
        directPrompt,
      },
      data: {
        language: "en",
      },
    });

    // 4. VALIDATE DECISION

    console.log("SOVEREIGN I RAW AI DECISION:", result);

const validatedDecision = validateDecision(result, event);

console.log("SOVEREIGN I VALIDATED DECISION:", validatedDecision);

    return validateDecision(result, event);

  } catch (error) {
    console.error(
      "SOVEREIGN I DECISION ERROR:",
      error
    );

    return createFallbackDecision(event);
  }
}
