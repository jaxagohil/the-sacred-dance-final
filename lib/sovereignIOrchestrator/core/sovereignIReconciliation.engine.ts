
/**
 * Sovereign I — Reconciliation Engine
 *
 * PURPOSE
 *
 * Evaluates the outcome of a capability invocation
 * in relation to the original event and decision.
 *
 * It does not rewrite context or execute further actions.
 */

import type { SovereignIEvent } from "../events/sovereignIEvent.types";

import type { SovereignIDecision } from "./sovereignIDecision.types";

import type {
    SovereignICapabilityResult,
} from "../capabilities/sovereignICapability.types";

import type {
    SovereignIReconciliation
} from "./sovereignIReconciliation.types";

/**
 * Reconcile a capability result with its originating event
 * and Sovereign I decision.
 */
export function reconcileSovereignIResult(
  event: SovereignIEvent,
  decision: SovereignIDecision,
  result: SovereignICapabilityResult
): SovereignIReconciliation {

  const reconciledAt = new Date().toISOString();

  // 1. VERIFY TRACEABILITY

  if (
    result.eventId !== event.eventId ||
    decision.eventId !== event.eventId
  ) {
    return {
      eventId: event.eventId,
      decisionId: decision.decisionId,
      invocationId: result.invocationId,
      capabilityId: result.capabilityId,
      status: "failed",
      outcome:
        "The capability result could not be matched to its originating event.",
      affectedContexts: [],
      furtherAction: "review_result",
      reasoning:
        "Event, decision and capability result identifiers do not match.",
      reconciledAt,
    };
  }

  // 2. HANDLE CAPABILITY FAILURE

  if (!result.success) {
    return {
      eventId: event.eventId,
      decisionId: decision.decisionId,
      invocationId: result.invocationId,
      capabilityId: result.capabilityId,
      status: "failed",
      outcome:
        result.error || "Capability invocation failed.",
      affectedContexts: [],
      furtherAction: "review_result",
      reasoning:
        "The capability did not complete successfully. No automatic retry or context update is initiated.",
      reconciledAt,
    };
  }

  // 3. HANDLE SUCCESSFUL CAPABILITY RESULT

  return {
    eventId: event.eventId,
    decisionId: decision.decisionId,
    invocationId: result.invocationId,
    capabilityId: result.capabilityId,
    status: "completed",
    outcome:
      "Capability invocation completed successfully.",
    newEvidence: result.output,
    affectedContexts: [],
    furtherAction: "none",
    reasoning:
      "The capability result is retained for consideration. No context change is assumed or applied automatically.",
    reconciledAt,
  };
}
