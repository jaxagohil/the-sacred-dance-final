
/**
 * Sovereign I — Capability Types
 *
 * Defines the standard contract for specialist capabilities.
 * The registry describes capabilities; it does not execute them.
 */

import type {
  SovereignIContextDomain,
} from "../events/sovereignIEvent.types";

export type SovereignICapabilityCategory =
  | "awareness"
  | "reflection"
  | "guidance"
  | "creation"
  | "experience";

export type SovereignIInvocationMode =
  | "sovereign_i_initiated"
  | "user_initiated";

export type SovereignICapabilityAvailability =
  | "available"
  | "unavailable"
  | "disabled";

/**
 * Describes a specialist capability.
 */
export interface SovereignICapabilityDefinition {
  id: string;

  name: string;

  purpose: string;

  category: SovereignICapabilityCategory;

  invocationMode: SovereignIInvocationMode;

  requiredContext: SovereignIContextDomain[];

  inputDescription: string;

  outputDescription: string;

  boundaries: string[];

  availability: SovereignICapabilityAvailability;
}

/**
 * Information supplied when a capability is invoked.
 */
export interface SovereignICapabilityInvocation<TInput = unknown> {
  invocationId: string;

  capabilityId: string;

  eventId?: string;

  input: TInput;

  invokedAt: string;
}

/**
 * Standard result returned by a capability.
 */

export interface SovereignICapabilityResult<TOutput = unknown> {
  invocationId: string;

  capabilityId: string;

  eventId?: string;

  success: boolean;

  output?: TOutput;

  error?: string;

  completedAt: string;
}

