
import { canChangeAgent } from "@/lib/ai/agents/canChange.agent";
import { cantChangeAgent } from "@/lib/ai/agents/cantChange.agent";
import { wontChangeAgent } from "@/lib/ai/agents/wontChange.agent";

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
  const agentInput = {
    userContext,
    creationContext,
    contextVersion,
    language,
  };

  const results = await Promise.allSettled([
    canChangeAgent(agentInput),
    cantChangeAgent(agentInput),
    wontChangeAgent(agentInput),
  ]);

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
