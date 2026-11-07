
import type {
  SovereignIContextDomain,
  SovereignIEvent,
  SovereignIEventCategory,
  SovereignIEventType,
  SovereignIPersistence,
} from "./sovereignIEvent.types";

const VALID_CATEGORIES: SovereignIEventCategory[] = [
  "domain",
  "system",
];

const VALID_PERSISTENCE: SovereignIPersistence[] = [
  "persistent",
  "transient",
  "system-generated",
];

const VALID_CONTEXTS: SovereignIContextDomain[] = [
  "user",
  "livingField",
  "liveUI",
  "creation",
  "cosmic",
  "capability",
];

const VALID_EVENT_TYPES: SovereignIEventType[] = [
  "expression.submitted",
  "expression.processed",
  "creation.stage.changed",
  "creation.intention.saved",
"responsibility.glimmer.requested",
  "creation.updated",
  "creation.oracle.reading.added",
  "responsibility.dimension.selected",
  "user.baseline.updated",
  "livingField.signal.processed",
  "livingField.context.refreshed",
  "cosmic.context.updated",
];

export interface SovereignIEventValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate the structure of an incoming Sovereign I event.
 *
 * This validator checks structure only.
 * It does not assess significance, impact or relevance.
 */
export function validateSovereignIEvent(
  event: unknown
): SovereignIEventValidationResult {
  const errors: string[] = [];

  if (!event || typeof event !== "object" || Array.isArray(event)) {
    return {
      valid: false,
      errors: ["Event must be a valid object."],
    };
  }

  const candidate = event as Record<string, unknown>;

  if (
    typeof candidate.eventId !== "string" ||
    !candidate.eventId.trim()
  ) {
    errors.push("Event must have a non-empty eventId.");
  }

  if (
    typeof candidate.eventType !== "string" ||
    !VALID_EVENT_TYPES.includes(candidate.eventType as SovereignIEventType)
  ) {
    errors.push("Event must have a valid eventType.");
  }

  if (
    typeof candidate.category !== "string" ||
    !VALID_CATEGORIES.includes(candidate.category as SovereignIEventCategory)
  ) {
    errors.push("Event must have a valid category.");
  }

  if (
    typeof candidate.source !== "string" ||
    !candidate.source.trim()
  ) {
    errors.push("Event must have a non-empty source.");
  }

  if (
    typeof candidate.occurredAt !== "string" ||
    Number.isNaN(Date.parse(candidate.occurredAt))
  ) {
    errors.push("Event must have a valid occurredAt timestamp.");
  }

  if (
    !VALID_PERSISTENCE.includes(
      candidate.persistence as SovereignIPersistence
    )
  ) {
    errors.push("Event must have a valid persistence value.");
  }

  if (!Array.isArray(candidate.contextImpact)) {
    errors.push("Event contextImpact must be an array.");
  } else {
    candidate.contextImpact.forEach((domain, index) => {
      if (
        typeof domain !== "string" ||
        !VALID_CONTEXTS.includes(domain as SovereignIContextDomain)
      ) {
        errors.push(
          `Event contextImpact contains an invalid domain at index ${index}.`
        );
      }
    });
  }

  if (
    candidate.correlationId !== undefined &&
    typeof candidate.correlationId !== "string"
  ) {
    errors.push("Event correlationId must be a string when supplied.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate and narrow an unknown value to a SovereignIEvent.
 */
export function isSovereignIEvent(
  event: unknown
): event is SovereignIEvent {
  return validateSovereignIEvent(event).valid;
}
