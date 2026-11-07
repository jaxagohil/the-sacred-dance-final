
/**
 * Sovereign I — Glimmer Adapter
 *
 * PURPOSE
 *
 * Connects Sovereign I to the Glimmer Engine.
 *
 * The adapter translates assembled context into
 * the input required by the Glimmer Engine.
 *
 * It does not build context or make decisions.
 */

import { generateGlimmers } from "../../livingSpace/sovereignI/capabilities/glimmer/glimmerEngine";

import type {
    GlimmerEngineOutput,
} from "../../livingSpace/sovereignI/capabilities/glimmer/glimmer.types";

export interface GlimmerCapabilityInput {
  userContext: unknown;
  creationContext: unknown;
  contextVersion: number;
  language?: string;
}

/**
 * Invoke the Glimmer Engine.
 */
export async function invokeGlimmer(
  input: GlimmerCapabilityInput
): Promise<GlimmerEngineOutput> {
  return generateGlimmers({
    userContext: input.userContext,
    creationContext: input.creationContext,
    contextVersion: input.contextVersion,
    language: input.language,
  });
}
