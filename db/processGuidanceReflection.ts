// --------------------------------------------------
// 🌊 PROCESS GUIDANCE REFLECTION
// --------------------------------------------------

import { supabase } from "../services/supabase";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type ProcessGuidanceReflectionInput = {

  userId: string;

  language?: string;

  batchId?: string;

  text?: string;

  guide?:
    | "guide_heart"
    | "guide_structure"
    | "guide_cosmic";

  activeGuideName?: string;

  conversationLength?: number;

  fieldContext?: any;
};

// --------------------------------------------------
// 🚀 MAIN
// --------------------------------------------------

export async function processGuidanceReflection({

  userId,

  language = "en",

  batchId,

  text = "",

  guide = "guide_heart",

  activeGuideName,

  conversationLength = 0,

  fieldContext,

}: ProcessGuidanceReflectionInput) {

  try {

    // --------------------------------------------------
    // 🚫 EMPTY
    // --------------------------------------------------

    if (!text?.trim()) {

      return;
    }

    // --------------------------------------------------
    // 🌊 RELATIONAL DEPTH
    // --------------------------------------------------

    let signalDepth = 1.5;

    if (
      text.length > 180
    ) {

      signalDepth = 2;
    }

    if (
      text.length > 450
    ) {

      signalDepth = 2.5;
    }

    // --------------------------------------------------
    // 🌊 CONVERSATION DEPTH
    // --------------------------------------------------

    if (
      conversationLength > 20
    ) {

      signalDepth += 0.5;
    }

    // --------------------------------------------------
    // 🌊 RELATIONAL ATMOSPHERE
    // --------------------------------------------------

    const dominantPatterns =

      fieldContext
        ?.patternField

        ? Object.values(
            fieldContext
              ?.patternField
          )

            .sort(
              (
                a: any,
                b: any
              ) =>

                Number(
                  b?.activation || 0
                ) -

                Number(
                  a?.activation || 0
                )
            )

            .slice(0, 3)

            .map(
              (p: any) =>

                p?.pattern?.name
            )

        : [];

    // --------------------------------------------------
    // 🪞 GUIDANCE REFLECTION
    // --------------------------------------------------

    const reflectionText = `

A guidance interaction
has been shared.

Guidance conversations often contain:
- emotional reaching
- reflection seeking
- nervous system exposure
- uncertainty
- emotional openness
- guardedness
- relational testing
- reassurance seeking
- emotional processing

Messages shared with guides
may reflect:
- present emotional atmosphere
- relational movement
- inner conflict
- pattern activation
- emotional pacing
- subtle nervous system shifts

Guidance reflections should be approached gently.

They should NOT automatically
be treated as:
- identity
- permanent emotional truth
- fixed personality structure

The user shared:

"${text}"

The active guide presence was:

${activeGuideName || guide}

Current relational field patterns:

${dominantPatterns?.join(", ") || "none"}

Current nervous system atmosphere:

${
  fieldContext
    ?.realityLayers
    ?.physical
    ?.nervousSystemState ||

  "unknown"
}

Dominant energetic atmosphere:

${
  fieldContext
    ?.energy
    ?.dominantChakra ||

  "unknown"
}

The reflection should prioritize:
- observable emotional movement
- relational pacing
- emotional atmosphere
- repeated tensions

The reflection should avoid:
- spiritual certainty
- psychological diagnosis
- identity conclusions
- overinterpretation
`;

    // --------------------------------------------------
    // 🚀 PROCESS
    // --------------------------------------------------

    const { data, error } =

  await supabase.functions.invoke(
    "process-reflection",
    {
      body: {

        userId,

        language,

        source:
          "guidance",

        baselineType:
          "guidance_relational",

        signalDepth,

        text:
          reflectionText,

        metadata: {

          batch_id:
            batchId,

          processing_layer:
            "guidance.relational",

          generated_from:
            "guidance_screen",

          generated_at:
            new Date().toISOString(),

          guide,

          active_guide_name:
            activeGuideName,

          conversation_length:
            conversationLength,

          dominant_patterns:
            dominantPatterns,

          nervous_system:

            fieldContext
              ?.realityLayers
              ?.physical
              ?.nervousSystemState ||

            null,

          dominant_chakra:

            fieldContext
              ?.energy
              ?.dominantChakra ||

            null,
        },
      },
    }
  );

if (error) {

  console.error(
    "❌ Guidance processing error",
    error
  );

} else {

  console.log(
    "✅ Guidance processed",
    data
  );
}

    // --------------------------------------------------
    // ✅ DONE
    // --------------------------------------------------

    console.log(
      "🌊 Guidance reflection processed"
    );

  } catch (error) {

    console.log(
      "❌ processGuidanceReflection error",
      error
    );
  }
}