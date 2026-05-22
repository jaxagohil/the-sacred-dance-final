// --------------------------------------------------
// 🌊 PROCESS LANDING REFLECTION
// --------------------------------------------------

import { processReflection } from "./flow";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type ProcessLandingReflectionInput = {

  userId: string;

  language?: string;

  batchId?: string;

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

export async function processLandingReflection({

  userId,

  language = "en",

  batchId,

  text = "",

  emotions = [],

  imageBase64,

  audioUri,

  observableScenes = [],

  bodyResponses = [],

  copingStrategies = [],

  manifestations = [],

  nervousSystem,

}: ProcessLandingReflectionInput) {

  try {

    // --------------------------------------------------
    // 🧠 MODALITIES
    // --------------------------------------------------

    const modalities = {

      text:
        Boolean(
          text?.trim()
        ),

      emotions:
        emotions.length > 0,

      image:
        Boolean(
          imageBase64
        ),

      voice:
        Boolean(
          audioUri
        ),
    };

    // --------------------------------------------------
    // 🌊 MODALITY COUNT
    // --------------------------------------------------

    const modalityCount =

      Object.values(
        modalities
      ).filter(Boolean)
        .length;

    // --------------------------------------------------
    // ⚡ SIGNAL DEPTH
    // --------------------------------------------------

    let signalDepth = 1.5;

    if (
      modalityCount >= 2
    ) {

      signalDepth = 2.5;
    }

    if (
      modalityCount >= 3
    ) {

      signalDepth = 3.5;
    }

    if (
      modalityCount >= 4
    ) {

      signalDepth = 4;
    }

    // --------------------------------------------------
    // 🪞 REFLECTION TEXT
    // --------------------------------------------------

    const reflectionText = `

A present-moment reflection
has been shared through one or more modalities.

The reflection may contain:
- emotional atmosphere
- nervous system activation
- environmental sensitivity
- relational movement
- coping responses
- emotional pacing
- subtle pattern repetition

This reflection should be approached gently.

Present-moment reflections
do not automatically represent:
- identity
- fixed patterns
- personality structure
- long-term emotional truth

The reflection shared is:

"${text || "No written reflection provided"}"

Present emotional states:

${emotions?.join(", ") || "none"}

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
    // 🚀 PROCESS
    // --------------------------------------------------

    await processReflection({

      userId,

      language,

      source:
        "landing",

      baselineType:
        "present_moment",

      signalDepth,

      text:
        reflectionText,

      emotions,

      metadata: {

        batch_id:
          batchId,

        processing_layer:
          "landing.reflection",

        generated_from:
          "landing_screen",

        generated_at:
          new Date().toISOString(),

        modalities,

        modality_count:
          modalityCount,

        observable_scenes:
          observableScenes,

        body_responses:
          bodyResponses,

        coping_strategies:
          copingStrategies,

        manifestations,

        nervous_system:
          nervousSystem,

        image_present:
          Boolean(
            imageBase64
          ),

        voice_present:
          Boolean(
            audioUri
          ),
      },
    });

    // --------------------------------------------------
    // ✅ DONE
    // --------------------------------------------------

    console.log(
      "🌊 Landing reflection processed"
    );

  } catch (error) {

    console.log(
      "❌ processLandingReflection error",
      error
    );
  }
}