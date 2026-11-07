
import type { SovereignIEvent } from "../events/sovereignIEvent.types";
import type { SovereignIRoutingResult } from "./sovereignIDecision.router";
import type { SovereignIDecision } from "./sovereignIDecision.types";

import { invokeSovereignICapability } from "../capabilities/sovereignICapability.invoker";
import { assembleSovereignIContext } from "../context/sovereignIContext.assembler";
import { validateSovereignIEvent } from "../events/sovereignIEvent.validator";
import { runSovereignIDecision } from "./sovereignIDecision.engine";
import { routeSovereignIDecision } from "./sovereignIDecision.router";
import { reconcileSovereignIResult } from "./sovereignIReconciliation.engine";

import { buildAlignmentOSContext } from "../../alignment/buildAlignmentOSContext";

import type { SovereignICapabilityResult } from "../capabilities/sovereignICapability.types";
import type { SovereignIReconciliation } from "./sovereignIReconciliation.types";

import { useMirrorStore } from "../../../stores/mirrorStore";
import { initialiseAlignmentOSContext } from "../../context/initialiseAlignmentOSContext";

export interface SovereignIOutcome {
  eventId: string;
  decision: SovereignIDecision;
  routing: SovereignIRoutingResult;
  capabilityResult?: SovereignICapabilityResult;
  reconciliation?: SovereignIReconciliation;
}

/**
 * Sovereign I — Central Orchestrator
 *
 * Receives events, validates them, coordinates decisions,
 * routes authorised capabilities and reconciles results.
 */
export async function sovereignI(
  event: SovereignIEvent
): Promise<SovereignIOutcome> {

  // 1. VALIDATE EVENT

  const validation = validateSovereignIEvent(event);

  if (!validation.valid) {
    throw new Error(
      `Invalid Sovereign I event: ${validation.errors.join(" ")}`
    );
  }

  // 2. REFRESH CONTEXT WHEN BASELINE CHANGES

  if (
    event.eventType === "user.baseline.updated" ||
    event.eventType === "expression.processed" ||
    event.eventType === "creation.updated"
  ) {
    await initialiseAlignmentOSContext();

    const state = useMirrorStore.getState();

    state.setContextVersion(state.contextVersion + 1);
  }

  // 3. ASSESS AND DECIDE

  const decision = await runSovereignIDecision(event);

  // 4. ROUTE DECISION

  const routing = routeSovereignIDecision(decision);

  const outcome: SovereignIOutcome = {
    eventId: event.eventId,
    decision,
    routing,
  };

  // 5. CHECK WHETHER AN EXECUTABLE CAPABILITY WAS AUTHORISED

  if (
    routing.route !== "invoke_capability" ||
    !routing.readyForExecution ||
    !routing.capabilityId
  ) {
    return outcome;
  }

  const capabilityId = routing.capabilityId;

  // Only capabilities with implemented execution paths are handled here.

  if (
    capabilityId !== "divine-orchestration" &&
    capabilityId !== "glimmer"
  ) {
    return outcome;
  }

  // 6. ASSEMBLE SOVEREIGN I CONTEXT

  const context = await assembleSovereignIContext({ event });

  // 7. INVOKE THE AUTHORISED CAPABILITY

  let capabilityResult: SovereignICapabilityResult;

  if (capabilityId === "divine-orchestration") {

    // Preserve the existing Divine Orchestration flow.

    const alignmentContext = buildAlignmentOSContext();

    capabilityResult = await invokeSovereignICapability({
      eventId: event.eventId,
      capabilityId: "divine-orchestration",
      invocationSource: "sovereign_i",
      context,
      divineOrchestrationInput: {
        alignmentContext,
        language: alignmentContext.language ?? undefined,
      },
    });

  } else {

    // Glimmer receives the whole person and their creations.

    const state = useMirrorStore.getState();

    capabilityResult = await invokeSovereignICapability({
      eventId: event.eventId,
      capabilityId: "glimmer",
      invocationSource: "sovereign_i",
      context,
      glimmerInput: {
        userContext: context.userContext?.data,
        creationContext: context.creationContext?.data,
        contextVersion: state.contextVersion,
        language: state.language ?? "en",
      },
    });
  }

  outcome.capabilityResult = capabilityResult;

  // 8. RECONCILE RESULT

  outcome.reconciliation = reconcileSovereignIResult(
    event,
    decision,
    capabilityResult
  );

  return outcome;
}
