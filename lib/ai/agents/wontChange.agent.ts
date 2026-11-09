
import { generateAIResponse } from "@/lib/ai/generateAIResponse";

import type {
  Glimmer,
  GlimmerEngineInput,
} from "../../livingSpace/sovereignI/capabilities/glimmer/glimmer.types";

type WontChangeAgentInput = GlimmerEngineInput & {
  language?: string;
};

export async function wontChangeAgent({
  userContext,
  creationContext,
  contextVersion,
  language = "en",
}: WontChangeAgentInput): Promise<Glimmer[]> {

  const response = await generateAIResponse({
    type: "glimmer",

    context: {
      userContext,
      creationContext,
      contextVersion,
      portal: "wont",
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
        portal: "wont" as const,
        selected: false,
      }))
    : [];
}
