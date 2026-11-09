
/**
 * SOVEREIGN I — CONTEXT GATEWAY
 *
 * Gathers the person's existing Creation Journey
 * and Living Field context for Sovereign I.
 *
 * This file assembles context only.
 * It does not interpret, assess or generate responses.
 */

import {
  getCreationContext,
} from "./getCreationContext";

import type {
  CreationStage,
  SovereignIContext,
} from "../orchestration/sovereignI.types";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export interface GetSovereignContextInput {
  userId: string;
  intentionId: string;
  activeStage?: CreationStage;
  userContext: any;
}

// --------------------------------------------------
// GET CONTEXT
// --------------------------------------------------

export async function getSovereignContext({
  userId,
  intentionId,
  activeStage,
  userContext,
}: GetSovereignContextInput): Promise<SovereignIContext> {
  if (!userId) {
    throw new Error(
      "getSovereignContext: userId is required."
    );
  }

  if (!intentionId) {
    throw new Error(
      "getSovereignContext: intentionId is required."
    );
  }

return getCreationContext({
  userId,
  intentionId,
  activeStage,
  userContext,
});
}
