
import { generateAIResponse } from "@/lib/ai/generateAIResponse";

import type {
  Glimmer,
  GlimmerEngineInput,
} from "../../livingSpace/sovereignI/capabilities/glimmer/glimmer.types";

type CanChangeAgentInput = GlimmerEngineInput & {
  language?: string;
};

export async function canChangeAgent({
  userContext,
  creationContext,
  contextVersion,
  language = "en",
}: CanChangeAgentInput): Promise<Glimmer[]> {

  const response = await generateAIResponse({
    type: "glimmer",

    context: {
      userContext,
      creationContext,
      contextVersion,
      portal: "can",
    },

    data: {
      language,
    },
  });

  const result =
    typeof response === "string"
      ? JSON.parse(response)
      : response;

  return Array.isArray(result?.glimmers)
    ? result.glimmers.map((glimmer: Glimmer) => ({
        ...glimmer,
        portal: "can" as const,
        selected: false,
      }))
    : [];
}
