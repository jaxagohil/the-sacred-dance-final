
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

  try {
    // 1. ASSEMBLE RELEVANT CONTEXT

    const context = await assembleSovereignIContext({
      event,
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

    return validateDecision(result, event);

  } catch (error) {
    console.error(
      "SOVEREIGN I DECISION ERROR:",
      error
    );

    return createFallbackDecision(event);
  }
}
