
/**
 * Sovereign I — Event Types
 *
 * Defines the events that can enter Sovereign I's awareness.
 *
 * Ordinary UI interactions are deliberately excluded.
 */

export type SovereignIEventCategory = 
  | "domain"
  | "system";

export type SovereignIPersistence =
  | "persistent"
  | "transient"
  | "system-generated";

export type SovereignIContextDomain =
  | "user"
  | "livingField"
  | "liveUI"
  | "creation"
  | "cosmic"
  | "capability";

export type SovereignIEventType =
  // Expressions
  | "expression.submitted"
  | "expression.processed"

  // Creation Journey
  | "creation.stage.changed"
  | "creation.intention.saved"
  | "responsibility.glimmer.requested"
  | "creation.updated"
  | "creation.oracle.reading.added"

  // Responsibility
  | "responsibility.dimension.selected"

// User Context
| "user.baseline.updated"

// Living Field
| "livingField.signal.processed"
| "livingField.context.refreshed"

  // Cosmic
  | "cosmic.context.updated";

/**
 * Standard event envelope.
 */
export interface SovereignIEvent<TPayload = unknown> {
  eventId: string;

  eventType: SovereignIEventType;

  category: SovereignIEventCategory;

  source: string;

  occurredAt: string;

  payload: TPayload;

  persistence: SovereignIPersistence;

  contextImpact: SovereignIContextDomain[];

  correlationId?: string;
}
