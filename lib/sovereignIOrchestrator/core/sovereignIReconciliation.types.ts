
/**
 * Sovereign I — Reconciliation Types
 *
 * Defines the contract for evaluating the outcome
 * of a capability invocation.
 */

export type SovereignIReconciliationStatus =
  | "completed"
  | "reassess"
  | "failed"
  | "no_further_action";

export type SovereignIFurtherAction =
  | "none"
  | "refresh_context"
  | "reassess"
  | "review_result";

export interface SovereignIReconciliation {
  eventId: string;

  decisionId: string;

  invocationId?: string;

  capabilityId?: string;

  status: SovereignIReconciliationStatus;

  outcome: string;

  newEvidence?: unknown;

  affectedContexts: string[];

  furtherAction: SovereignIFurtherAction;

  reasoning: string;

  reconciledAt: string;
}
