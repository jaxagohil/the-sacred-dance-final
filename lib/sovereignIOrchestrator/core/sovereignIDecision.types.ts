
/**
 * Sovereign I — Decision Types
 *
 * Defines the assessment dimensions and possible
 * decisions available to Sovereign I.
 */

import type {
    SovereignIContextDomain,
} from "../events/sovereignIEvent.types";

/**
 * The three dimensions used to assess an event.
 */
export interface SovereignIEventAssessment {
  significance: string;
  impact: string;
  relevance: string;

  reasoning?: string;
}

/**
 * Possible decisions Sovereign I can make.
 */
export type SovereignIDecisionType =
  | "observe"
  | "update_context"
  | "reassess"
  | "invoke_capability"
  | "update_presentation"
  | "invite"
  | "respond"
  | "do_nothing";

/**
 * Result of the Sovereign I decision process.
 */
export interface SovereignIDecision {
  decisionId: string;

  eventId: string;

  assessment: SovereignIEventAssessment;

  decision: SovereignIDecisionType;

  reason: string;

  relevantContexts?: SovereignIContextDomain[];

  capabilityId?: string;

  createdAt: string;
}
