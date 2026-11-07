
/**
 * Sovereign I — Capability Invoker
 *
 * PURPOSE
 *
 * Controls the invocation of registered specialist capabilities.
 *
 * It checks availability, invocation permissions and
 * required context before delegating execution.
 *
 * It does not make decisions or assemble context.
 */

import type {
  SovereignICapabilityResult,
} from "./sovereignICapability.types";

import {
  isCapabilityAvailable,
  resolveCapability,
} from "./sovereignICapability.resolver";

import {
  invokeDivineOrchestration,
  type DivineOrchestrationInput,
} from "./divineOrchestration.adapter";

import {
  invokeGuideTransmission,
  type GuideTransmissionInput,
} from "./guideTransmission.adapter";

import {
  invokeGlimmer,
  type GlimmerCapabilityInput,
} from "./glimmer.adapter";

import type {
  SovereignIContextPackage,
} from "../core/sovereignIContext.types";

export type SovereignIInvocationSource =
  | "sovereign_i"
  | "user";

export interface SovereignICapabilityInvocationRequest {
  eventId: string;
  capabilityId: string;
  invocationSource: SovereignIInvocationSource;
  context: SovereignIContextPackage;
  divineOrchestrationInput?: DivineOrchestrationInput;
  guideTransmissionInput?: GuideTransmissionInput;
  glimmerInput?: GlimmerCapabilityInput;
}

/**
 * Check that all required context domains are present.
 */
function validateRequiredContext(
  context: SovereignIContextPackage,
  requiredDomains: string[]
): string[] {
  const contextSections: Record<string, unknown> = {
    user: context.userContext,
    livingField: context.livingField,
    liveUI: context.liveUIContext,
    creation: context.creationContext,
    cosmic: context.cosmicContext,
    capability: context.capabilityContext,
  };

  return requiredDomains.filter(
    (domain) => !contextSections[domain]
  );
}

/**
 * Invoke a registered Sovereign I capability.
 */
export async function invokeSovereignICapability(
  request: SovereignICapabilityInvocationRequest
): Promise<SovereignICapabilityResult> {

  const invocationId = `${request.capabilityId}-${Date.now()}`;

  const capability = resolveCapability(request.capabilityId);

  if (!capability) {
    return {
      invocationId,
      capabilityId: request.capabilityId,
      eventId: request.eventId,
      success: false,
      error: "Capability is not registered.",
      completedAt: new Date().toISOString(),
    };
  }

  // 1. CHECK INVOCATION PERMISSION

  const expectedSource =
    capability.invocationMode === "user_initiated"
      ? "user"
      : "sovereign_i";

  if (request.invocationSource !== expectedSource) {
    return {
      invocationId,
      capabilityId: capability.id,
      eventId: request.eventId,
      success: false,
      error: "Invocation source does not match capability permissions.",
      completedAt: new Date().toISOString(),
    };
  }

  // 2. CHECK AVAILABILITY

  if (!isCapabilityAvailable(capability.id)) {
    return {
      invocationId,
      capabilityId: capability.id,
      eventId: request.eventId,
      success: false,
      error: "Capability is currently unavailable.",
      completedAt: new Date().toISOString(),
    };
  }

  // 3. CHECK REQUIRED CONTEXT

  const missingContexts = validateRequiredContext(
    request.context,
    capability.requiredContext
  );

  if (missingContexts.length > 0) {
    return {
      invocationId,
      capabilityId: capability.id,
      eventId: request.eventId,
      success: false,
      error: `Required context is missing: ${missingContexts.join(", ")}.`,
      completedAt: new Date().toISOString(),
    };
  }

  try {
    // 4. DELEGATE TO THE VERIFIED ADAPTER

    let output: unknown;

    switch (capability.id) {
      case "divine-orchestration": {
        if (!request.divineOrchestrationInput) {
          throw new Error(
            "Divine Orchestration input was not supplied."
          );
        }

        output = await invokeDivineOrchestration(
          request.divineOrchestrationInput
        );
        break;
      }

      case "guide-transmission": {
        if (!request.guideTransmissionInput) {
          throw new Error(
            "Guide Transmission input was not supplied."
          );
        }

        if (
          !request.guideTransmissionInput.reflection.trim()
        ) {
          throw new Error(
            "Guide Transmission requires a user-submitted expression."
          );
        }

        output = await invokeGuideTransmission(
          request.guideTransmissionInput
        );
        break;
      }

      case "glimmer": {
        if (!request.glimmerInput) {
          throw new Error(
            "Glimmer input was not supplied."
          );
        }

        output = await invokeGlimmer(
          request.glimmerInput
        );
        break;
      }

      default:
        throw new Error(
          "No verified adapter is connected for this capability."
        );
    }

    return {
      invocationId,
      capabilityId: capability.id,
      eventId: request.eventId,
      success: true,
      output,
      completedAt: new Date().toISOString(),
    };

  } catch (error) {
    return {
      invocationId,
      capabilityId: capability.id,
      eventId: request.eventId,
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Capability invocation failed.",
      completedAt: new Date().toISOString(),
    };
  }
}
