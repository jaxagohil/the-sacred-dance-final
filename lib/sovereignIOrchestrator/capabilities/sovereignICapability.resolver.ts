
/**
 * Sovereign I — Capability Resolver
 *
 * Finds registered capabilities and checks
 * whether they are available for invocation.
 *
 * Does not execute capabilities.
 */

import { sovereignICapabilities } from "./sovereignICapability.registry";

import type {
    SovereignICapabilityDefinition,
} from "./sovereignICapability.types";

/**
 * Find a capability by its registered ID.
 */
export function resolveCapability(
  capabilityId: string
): SovereignICapabilityDefinition | null {
  return (
    sovereignICapabilities.find(
      (capability) => capability.id === capabilityId
    ) ?? null
  );
}

/**
 * Return capabilities currently available for invocation.
 */
export function getAvailableCapabilities(): SovereignICapabilityDefinition[] {
  return sovereignICapabilities.filter(
    (capability) => capability.availability === "available"
  );
}

/**
 * Check whether a capability can currently be invoked.
 */
export function isCapabilityAvailable(
  capabilityId: string
): boolean {
  const capability = resolveCapability(capabilityId);

  return capability?.availability === "available";
}
