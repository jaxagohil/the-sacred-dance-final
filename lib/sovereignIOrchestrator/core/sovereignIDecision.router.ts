
import type { SovereignIDecision } from "./sovereignIDecision.types";

export type SovereignIRouteType =
  | "observe"
  | "update_context"
  | "reassess"
  | "invoke_capability"
  | "update_presentation"
  | "invite"
  | "respond"
  | "do_nothing";

export interface SovereignIRoutingResult {
  decisionId: string;
  route: SovereignIRouteType;
  capabilityId?: string;
  relevantContexts: string[];
  reason: string;
  readyForExecution: boolean;
}

/**
 * Sovereign I — Decision Router
 *
 * Translates a validated decision into a routing instruction.
 *
 * It does not execute capabilities or update context.
 */
export function routeSovereignIDecision(
  decision: SovereignIDecision
): SovereignIRoutingResult {

  const route = decision.decision;

  const capabilityId =
    route === "invoke_capability"
      ? decision.capabilityId
      : undefined;

  return {
    decisionId: decision.decisionId,
    route,
    capabilityId,
    relevantContexts: decision.relevantContexts ?? [],
    reason: decision.reason,
    readyForExecution:
      route !== "invoke_capability" || Boolean(capabilityId),
  };
}
