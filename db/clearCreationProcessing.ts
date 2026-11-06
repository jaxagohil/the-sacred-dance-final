
import { supabase } from "../services/supabase";

type CreationStage = "discover" | "grow";

type ClearCreationProcessingInput = {
  userId: string;
  intentionId: string;
  stage: CreationStage;
  keepReflectionId?: string | null;
};

export async function clearCreationProcessing({
  userId,
  intentionId,
  stage,
  keepReflectionId,
}: ClearCreationProcessingInput) {
  if (!userId || !intentionId) {
    throw new Error(
      "User ID and intention ID are required."
    );
  }

  const processingLayer =
    `sovereign_i.creation_journey.${stage}`;

  // 1. FIND PREVIOUS REFLECTIONS FOR THIS CREATION AND STAGE

  let reflectionQuery = supabase
    .from("reflections")
    .select("id")
    .eq("user_id", userId)
    .eq("source", "sovereign_i")
    .contains("metadata", {
      intention_id: intentionId,
      stage,
      processing_layer: processingLayer,
    });

  // Preserve the newly generated reflection.
  if (keepReflectionId) {
    reflectionQuery = reflectionQuery.neq(
      "id",
      keepReflectionId
    );
  }

  const { data: reflections, error: reflectionError } =
    await reflectionQuery;

  if (reflectionError) {
    throw reflectionError;
  }

  const reflectionIds =
    (reflections || []).map((reflection) => reflection.id);

  if (reflectionIds.length === 0) {
    return {
      deletedReflections: 0,
      deletedSignals: 0,
    };
  }

  // 2. DELETE SIGNALS LINKED TO THOSE REFLECTIONS

  const { data: deletedSignals, error: signalError } =
    await supabase
      .from("signals")
      .delete()
      .in("reflection_id", reflectionIds)
      .select("id");

  if (signalError) {
    throw signalError;
  }

  // 3. DELETE THE PREVIOUS REFLECTIONS

  const { data: deletedReflections, error: deleteError } =
    await supabase
      .from("reflections")
      .delete()
      .in("id", reflectionIds)
      .select("id");

  if (deleteError) {
    throw deleteError;
  }

  return {
    deletedReflections: deletedReflections?.length || 0,
    deletedSignals: deletedSignals?.length || 0,
  };
}
