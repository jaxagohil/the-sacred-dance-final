// --------------------------------------------------
// 🌊 PROCESS JOURNAL REFLECTION
// --------------------------------------------------

import { supabase } from "../services/supabase";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type ProcessJournalReflectionInput = {
  userId: string;
  language?: string;
  text?: string;
  emotions?: string[];
  imageBase64?: string | null;
  audioUri?: string | null;
  observableScenes?: string[];
  bodyResponses?: string[];
  copingStrategies?: string[];
  manifestations?: string[];
  nervousSystem?: string | null;
};

// --------------------------------------------------
// 🚀 MAIN
// --------------------------------------------------

export async function processJournalReflection({
  userId,
  language = "en",
  text = "",
  emotions = [],
  imageBase64,
  audioUri,
  observableScenes = [],
  bodyResponses = [],
  copingStrategies = [],
  manifestations = [],
  nervousSystem,
}: ProcessJournalReflectionInput): Promise<boolean> {

  try {

    // --------------------------------------------------
    // 🧠 MODALITIES
    // --------------------------------------------------

    const modalities = {
      text: Boolean(text?.trim()),
      emotions: emotions.length > 0,
      image: Boolean(imageBase64),
      voice: Boolean(audioUri),
    };

    // --------------------------------------------------
    // 🌊 MODALITY COUNT
    // --------------------------------------------------

    const modalityCount =
      Object.values(modalities).filter(Boolean).length;

    // --------------------------------------------------
    // 🌊 NARRATIVE DEPTH
    // --------------------------------------------------

    let narrativeDepth = 2.5;

    if (modalityCount >= 2) {
      narrativeDepth = 3;
    }

    if (modalityCount >= 3) {
      narrativeDepth = 4;
    }

    if (modalityCount >= 4) {
      narrativeDepth = 5;
    }

    // --------------------------------------------------
    // 🌊 EMOTIONAL FIELD DEPTH
    // --------------------------------------------------

    let emotionalFieldDepth = 1.5;

    if (emotions.length >= 2) {
      emotionalFieldDepth = 2;
    }

    if (emotions.length >= 3) {
      emotionalFieldDepth = 2.5;
    }

    // --------------------------------------------------
    // 🪞 NARRATIVE REFLECTION
    // --------------------------------------------------

    const narrativeReflection = `

An intentional journal reflection
has been shared.

Journal reflections often contain:
- emotional meaning making
- conscious reflection
- relational processing
- nervous system awareness
- internal observation
- emotional pacing
- subtle pattern repetition

The reflection may contain:
- emotional contradiction
- partial awareness
- uncertainty
- shifting perspectives
- layered emotional movement

The reflection should NOT automatically
be treated as:
- fixed identity
- permanent emotional truth
- personality definition

Written reflection:

"${text || "No written reflection provided"}"

Observable scenes:

${observableScenes?.join(", ") || "none"}

Body responses:

${bodyResponses?.join(", ") || "none"}

Coping strategies:

${copingStrategies?.join(", ") || "none"}

Manifestations:

${manifestations?.join(", ") || "none"}

Nervous system state:

${nervousSystem || "unknown"}
`;

    // --------------------------------------------------
    // 🌊 EMOTIONAL FIELD REFLECTION
    // --------------------------------------------------

    const emotionalFieldReflection = `

An emotional field selection
has been shared through the journal.

Selected emotions often represent:
- energetic atmosphere
- nervous system tone
- emotional weather
- subtle internal states
- present-moment feeling textures

These emotional selections
should be treated gently.

Selected emotions
do NOT automatically represent:
- identity
- fixed patterns
- permanent emotional truth

Selected emotions:

${emotions?.join(", ") || "none"}

Current nervous system atmosphere:

${nervousSystem || "unknown"}
`;

    // --------------------------------------------------
    // 🚫 SKIP EMPTY
    // --------------------------------------------------

    const hasNarrativeReflection =
      Boolean(text?.trim()) ||
      Boolean(imageBase64) ||
      Boolean(audioUri);

    const hasEmotionReflection =
      emotions.length > 0;

    // --------------------------------------------------
    // 🪞 + 🌊 PROCESS REFLECTIONS IN PARALLEL
    // --------------------------------------------------

    const processingTasks: Promise<boolean>[] = [];

    // --------------------------------------------------
    // 🪞 NARRATIVE
    // --------------------------------------------------

    if (hasNarrativeReflection) {

      processingTasks.push(
        (async (): Promise<boolean> => {

          const timer = "⏱️ JOURNAL NARRATIVE";

          console.time(timer);

          try {

            const {
              data: narrativeData,
              error: narrativeError,
            } = await supabase.functions.invoke(
              "process-reflection",
              {
                body: {
                  userId,
                  language,
                  source: "journal",
                  baselineType: "journal",
                  signalDepth: narrativeDepth,
                  text: narrativeReflection,
                  emotions,

                  metadata: {
                    processing_layer: "journal.narrative",
                    generated_from: "journal_screen",
                    generated_at: new Date().toISOString(),
                    modalities,
                    modality_count: modalityCount,
                    observable_scenes: observableScenes,
                    body_responses: bodyResponses,
                    coping_strategies: copingStrategies,
                    manifestations,
                    nervous_system: nervousSystem,
                    image_present: Boolean(imageBase64),
                    voice_present: Boolean(audioUri),
                  },
                },
              }
            );

            if (narrativeError) {
              console.error(
                "❌ Journal narrative error",
                narrativeError
              );

              return false;
            }

            console.log(
              "✅ Journal narrative processed",
              narrativeData
            );

            return true;

          } catch (error) {

            console.error(
              "❌ Journal narrative exception",
              error
            );

            return false;

          } finally {

            console.timeEnd(timer);
          }

        })()
      );
    }

    // --------------------------------------------------
    // 🌊 EMOTIONAL FIELD
    // --------------------------------------------------

    if (hasEmotionReflection) {

      processingTasks.push(
        (async (): Promise<boolean> => {

          const timer = "⏱️ JOURNAL EMOTIONAL";

          console.time(timer);

          try {

            const {
              data: emotionalData,
              error: emotionalError,
            } = await supabase.functions.invoke(
              "process-reflection",
              {
                body: {
                  userId,
                  language,
                  source: "journal",
                  baselineType: "journal",
                  signalDepth: emotionalFieldDepth,
                  text: emotionalFieldReflection,
                  emotions,

                  metadata: {
                    processing_layer: "journal.emotional_field",
                    generated_from: "journal_screen",
                    generated_at: new Date().toISOString(),
                    emotional_field: true,
                    selected_emotions: emotions,
                    emotional_field_depth: emotionalFieldDepth,
                    nervous_system: nervousSystem,
                  },
                },
              }
            );

            if (emotionalError) {
              console.error(
                "❌ Journal emotional field error",
                emotionalError
              );

              return false;
            }

            console.log(
              "✅ Journal emotional field processed",
              emotionalData
            );

            return true;

          } catch (error) {

            console.error(
              "❌ Journal emotional field exception",
              error
            );

            return false;

          } finally {

            console.timeEnd(timer);
          }

        })()
      );
    }

    // --------------------------------------------------
    // ⏳ WAIT FOR ALL REQUESTED PROCESSING
    // --------------------------------------------------

    if (processingTasks.length === 0) {
      console.warn(
        "⚠️ No Journal Reflection processing tasks were created."
      );

      return false;
    }

    const processingResults = await Promise.all(
      processingTasks
    );

    const allProcessedSuccessfully =
      processingResults.every(Boolean);

    if (!allProcessedSuccessfully) {
      console.warn(
        "⚠️ Journal Reflection processing was incomplete."
      );

      return false;
    }

    console.log(
      "✅ JOURNAL REFLECTION: ALL PROCESSING COMPLETED"
    );

    return true;

  } catch (error) {

    console.error(
      "❌ processJournalReflection error",
      error
    );

    return false;
  }
}