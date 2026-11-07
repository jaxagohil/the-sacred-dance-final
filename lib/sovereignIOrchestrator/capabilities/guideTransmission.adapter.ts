
/**
 * Sovereign I — Guide Transmission Adapter
 *
 * PURPOSE
 *
 * Connects the user-initiated Guide Transmission
 * experience to the existing specialist agent.
 *
 * The adapter translates inputs.
 * It does not generate guidance or build context.
 */

import { transmissionAgent } from "../../ai/agents/transmissionAgent";

import type { AlignmentOSContext } from "../../alignment/buildAlignmentOSContext";

export interface GuideTransmissionInput {
  reflection: string;

  recentMessages?: any[];

  alignmentContext: AlignmentOSContext;

  orchestrationField?: any;

  orchestrationDecision?: any;

  selectedGuide?: string;

  language?: string;

  emergenceMemory?: any;
}

/**
 * Invoke the existing Guide Transmission agent.
 *
 * This capability requires an explicit user submission.
 */
export async function invokeGuideTransmission(
  input: GuideTransmissionInput
) {
  const result = await transmissionAgent({
    reflection: input.reflection,

    recentMessages: input.recentMessages,

    alignmentContext: input.alignmentContext,

    field: input.alignmentContext.userContext,

    orchestrationField: input.orchestrationField,

    orchestrationDecision: input.orchestrationDecision,

    selectedGuide: input.selectedGuide,

    language: input.language,

    emergenceMemory: input.emergenceMemory,
  });

  return result;
}
