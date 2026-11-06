
import { supabase } from "../services/supabase";
import { clearCreationProcessing } from "./clearCreationProcessing";

type ProcessCreationGrowInput = {
  userId: string;
  intentionId: string;
  sliders: Record<string, number>;
  additionalText?: string;
  language?: string;
};

export async function processCreationGrow({
  userId,
  intentionId,
  sliders,
  additionalText = "",
  language = "en",
}: ProcessCreationGrowInput) {
  try {
    if (!userId || !intentionId) {
      return null;
    }

    const sliderDescriptions = Object.entries(sliders)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    const text = `
CREATION JOURNEY — GROW

The following values represent the person's current relationship
with the qualities they are exploring in their creation.

GROW VALUES:
${sliderDescriptions}

ADDITIONAL REFLECTION:
${additionalText.trim() || "No additional reflection provided."}
`;

    const { data, error } = await supabase.functions.invoke(
      "process-reflection",
      {
        body: {
          userId,
          language,
          source: "sovereign_i",
          baselineType: "creation_grow",
          signalDepth: 2.5,
          text,
          emotions: [],
          metadata: {
            processing_layer: "sovereign_i.creation_journey.grow",
            generated_from: "creation_journey",
            intention_id: intentionId,
            stage: "grow",
            sliders,
            additional_text: additionalText.trim(),
          },
        },
      }
    );

    if (error) throw error;

    if (!data) {
      throw new Error("No Grow processing result returned.");
    }

    // REMOVE PREVIOUS GROW PROCESSING FOR THIS CREATION
    await clearCreationProcessing({
      userId,
      intentionId,
      stage: "grow",
      keepReflectionId: data.reflection?.id,
    });

    return {
      reflection: data.reflection || null,
      signals: data.signals || [],
      behaviours: data.behaviours || [],
      emotions: data.emotions || [],
      patterns: data.patterns || [],
    };
  } catch (error) {
    console.error("PROCESS CREATION GROW ERROR:", error);
    throw error;
  }
}
