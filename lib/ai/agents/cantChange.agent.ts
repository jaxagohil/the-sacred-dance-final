
import { generateAIResponse } from "@/lib/ai/generateAIResponse";

import type {
  Glimmer,
  GlimmerEngineInput,
} from "../../livingSpace/sovereignI/capabilities/glimmer/glimmer.types";

type CantChangeAgentInput = GlimmerEngineInput & {
  language?: string;
};

export async function cantChangeAgent({
  userContext,
  creationContext,
  contextVersion,
  language = "en",
}: CantChangeAgentInput): Promise<Glimmer[]> {

  const response = await generateAIResponse({
    type: "glimmer",

    context: {
      userContext,
      creationContext,
      contextVersion,
      portal: "cant",
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
        portal: "cant" as const,
        selected: false,
      }))
    : [];
}
