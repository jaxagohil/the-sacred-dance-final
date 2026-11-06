
import { supabase } from "../services/supabase";
import { clearCreationProcessing } from "./clearCreationProcessing";

type ProcessCreationDiscoverInput = {
  userId: string;
  intentionId: string;
  consciousDesire: string;
  language?: string;
};

export async function processCreationDiscover({
  userId,
  intentionId,
  consciousDesire,
  language = "en",
}: ProcessCreationDiscoverInput) {
  try {
    if (!userId || !intentionId || !consciousDesire.trim()) {
      return null;
    }

    const { data, error } = await supabase.functions.invoke(
      "process-reflection",
      {
        body: {
          userId,
          language,
          source: "sovereign_i",
          baselineType: "creation_discover",
          signalDepth: 2.5,
          text: consciousDesire.trim(),
          emotions: [],
          metadata: {
            processing_layer: "sovereign_i.creation_journey.discover",
            generated_from: "creation_journey",
            intention_id: intentionId,
            stage: "discover",
          },
        },
      }
    );

    if (error) throw error;

    if (!data) {
      throw new Error("No reflection processing result returned.");
    }

    // REMOVE PREVIOUS DISCOVER PROCESSING FOR THIS CREATION

await clearCreationProcessing({
  userId,
  intentionId,
  stage: "discover",
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
    console.error("PROCESS CREATION DISCOVER ERROR:", error);
    throw error;
  }
}
