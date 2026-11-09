
import { canChangeAgent } from "@/lib/ai/agents/canChange.agent";
import { cantChangeAgent } from "@/lib/ai/agents/cantChange.agent";
import { wontChangeAgent } from "@/lib/ai/agents/wontChange.agent";

import { buildGlimmerContext } from "@/lib/context/buildGlimmerContext";

import type {
  Glimmer,
  GlimmerEngineInput,
  GlimmerEngineOutput,
} from "./glimmer.types";

type GlimmerEngineOptions = GlimmerEngineInput & {
  language?: string;
};

export async function generateGlimmers({
  userContext,
  creationContext,
  contextVersion,
  language = "en",
}: GlimmerEngineOptions): Promise<GlimmerEngineOutput> {

  // 1. BUILD ONE COMPACT CONTEXT FOR ALL THREE PORTAL AGENTS

  const compactContext = buildGlimmerContext({
    userContext: userContext as Record<string, any>,
    creationContext: creationContext as Record<string, any>,
    contextVersion,
    language,
  });

  // Keep User Context and Creation Context distinct
  // for the existing agent prompt structure.

  const { creation, ...compactUserContext } = compactContext;

  const agentInput = {
    userContext: compactUserContext,
    creationContext: creation,
    contextVersion,
    language,
  };

  console.log("GLIMMER CONTEXT SIZE:", {
  userContext: JSON.stringify(agentInput.userContext).length,
  creationContext: JSON.stringify(agentInput.creationContext).length,
  total: JSON.stringify(agentInput).length,
});
  // 2. GENERATE ALL THREE PORTAL PERSPECTIVES

  const results = await Promise.allSettled([
    canChangeAgent(agentInput),
    cantChangeAgent(agentInput),
    wontChangeAgent(agentInput),
  ]);

  // 3. COMBINE THE RESULTS

  const portals = ["CAN", "CAN'T", "WON'T"];

  const glimmers: Glimmer[] = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      glimmers.push(...result.value);
    } else {
      console.error(
        `❌ Glimmer agent failed: ${portals[index]}`,
        result.reason
      );
    }
  });

  return {
    collection: {
      generatedAt: new Date().toISOString(),
      contextVersion,
      glimmers,
    },
    selectedGlimmers: [],
  };
}
