/**
 * SOVEREIGN I — Core Types
 *
 * Sovereign I is the orchestration intelligence for conscious creation.
 *
 * It reads the person's Creation Journey and Living Field,
 * determines what may be useful, and chooses whether to:
 * - invoke a capability
 * - respond directly
 * - invite further exploration
 * - or do nothing
 *
 * Sovereign I does not own the person's meaning, choices or creation.
 */

import type {
  CreationContext,
  CreationJourneyStage,
} from "../../consciousCreating/getCreationContext";

// --------------------------------------------------
// CREATION JOURNEY
// --------------------------------------------------

export type CreationStage = CreationJourneyStage;

export type CreationArea =
  | "I"
  | "People"
  | "Planet";

// --------------------------------------------------
// CONTEXT
// --------------------------------------------------

/**
 * The assembled context available to Sovereign I.
 *
 * This brings together existing Creation Journey data
 * and the Living Field. It does not create a new
 * interpretation or duplicate existing intelligence.
 */

export type SovereignIContext = CreationContext;

// --------------------------------------------------
// CONVERSATION
// --------------------------------------------------

export type SovereignIMessageRole =
  | "user"
  | "assistant"
  | "system";

export interface SovereignIMessage {
  role: SovereignIMessageRole;
  content: string;
  timestamp?: string;
}

export interface SovereignIConversation {
  messages: SovereignIMessage[];
}

// --------------------------------------------------
// CAPABILITIES
// --------------------------------------------------

/**
 * Capabilities are specialised functions Sovereign I
 * can choose to invoke.
 *
 * They do not independently orchestrate the whole journey.
 */

export type SovereignICapabilityId =
  | "mirror"
  | "glimmer"
  | "reflection";

export interface SovereignICapabilityInput {
  context: SovereignIContext;
  conversation: SovereignIConversation;
  currentMessage?: string;
  stage?: CreationStage;
}

export interface SovereignICapabilityResult {
  capabilityId: SovereignICapabilityId;
  content: string;
  data?: unknown;
  confidence?: number;
}

// --------------------------------------------------
// ORCHESTRATION DECISION
// --------------------------------------------------

/**
 * Sovereign I decides what, if anything, should happen next.
 *
 * An invocation is a choice, not an obligation.
 * No intervention is a valid outcome.
 */

export type SovereignIDecision =
  | {
      action: "invoke_capability";
      capability: SovereignICapabilityId;
      reason: string;
      input?: Record<string, unknown>;
    }
  | {
      action: "respond";
      response: string;
    }
  | {
      action: "invite";
      invitation: string;
    }
  | {
      action: "no_intervention";
      reason: string;
    };

// --------------------------------------------------
// ORCHESTRATION INPUT
// --------------------------------------------------

export interface SovereignIOrchestrationInput {
  userId: string;
  intentionId?: string;
  currentMessage?: string;
  activeStage?: CreationStage;
  context: SovereignIContext;
  conversation: SovereignIConversation;
  previousCapabilityResults?: SovereignICapabilityResult[];
  orchestrationStep?: number;
}

// --------------------------------------------------
// ORCHESTRATION OUTPUT
// --------------------------------------------------

export interface SovereignIOrchestrationResult {
  decision: SovereignIDecision;
  capabilityResults?: SovereignICapabilityResult[];
  response?: string;
  activeStage?: CreationStage;
  confidence?: number;
}

// --------------------------------------------------
// SOVEREIGN I PRINCIPLES
// --------------------------------------------------

/**
 * These are architectural boundaries, not merely
 * conversational style preferences.
 *
 * Sovereign I:
 * - invites awareness; it does not declare inner truth
 * - distinguishes evidence from interpretation
 * - can challenge without judgement or control
 * - acknowledges genuine external constraints
 * - does not manufacture insight or positivity
 * - preserves the human's ownership of meaning
 * - can choose not to intervene
 */

export type SovereignIPrinciple =
  | "awareness_without_imposed_meaning"
  | "honesty_without_judgement"
  | "compassion_without_collusion"
  | "challenge_without_control"
  | "sovereignty_without_abandonment";