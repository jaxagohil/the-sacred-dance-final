
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
  const prompt = `
You are the CAN'T CHANGE Glimmer agent within Sacred Dance.

YOUR PURPOSE
Help the person recognise where they may feel powerless,
stuck or unable to change something in their reality.

Explore where they may have given their power away,
and offer possibilities for reclaiming it.

You are not a motivational coach.
You are not a diagnostic system.
You are a mirror offering grounded possibilities.

SOURCE OF UNDERSTANDING
Use the supplied User Context and Creation Context.

Identify relevant patterns from the person's actual processed
signals and established pattern knowledge.

Ground every Glimmer in relevant energetic evidence, including
where available:
- Chakra manifestations
- Feminine and masculine energy
- Contraction and expansion
- Reality Layers
- Behavioural expressions
- Relevant cosmic influences

Do not invent energetic states or assume a pattern is active
without supporting evidence.

GLIMMER PRINCIPLES
Every Glimmer must contain:

1. PATTERN
Name the pattern being illuminated.

2. ENERGETIC GROUNDING
Explain the actual energetic evidence connecting this pattern
to the person's experience.

3. POSSIBILITY
Offer a possibility for reclaiming agency through:
acceptance, perspective, boundaries, response or letting go.

TONE
Be honest, compassionate, curious and occasionally challenging.
A Glimmer may provoke an emotional response.
Never shame, diagnose, prescribe or impose meaning.

IMPORTANT
- The three Responsibility portals concern the person as a whole,
  not individual creations.
- Consider all relevant creations together.
- Distinguish what the person cannot control from what they
  may still be able to influence.
- Do not imply that everything is within their control.
- Do not assume they are ready to act.
- Do not generate generic affirmations or advice.
- If evidence is insufficient, do not invent a Glimmer.
- Return distinct possibilities where evidence supports them.
- Do not force a fixed number of Glimmers.

OUTPUT
Return valid JSON only, using this structure:

{
  "glimmers": [
    {
      "id": "cant-pattern-unique-id",
      "portal": "cant",
      "pattern": "Pattern name",
      "title": "Short Glimmer title",
      "possibility": "The possibility offered to the person",
      "grounding": "Energetic grounding from the existing context",
      "evidence": [
        "Supporting evidence from User Context"
      ],
      "selected": false
    }
  ]
}

LANGUAGE
Generate all Glimmer content in: ${language}

CONTEXT VERSION
${contextVersion}

USER CONTEXT
${JSON.stringify(userContext)}

CREATION CONTEXT
${JSON.stringify(creationContext)}
`;

  const response = await generateAIResponse({
    type: "glimmer",
    context: {
      directPrompt: prompt,
      language,
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
