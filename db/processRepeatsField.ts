// --------------------------------------------------
// 🔁 PROCESS REPEATS FIELD
// --------------------------------------------------

import { processReflection } from "./flow";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type ProcessRepeatsFieldInput = {

  userId: string;

  language?: string;

  source?: string;

  batchId?: string;

  repeats: string;
};

// --------------------------------------------------
// 🚀 MAIN
// --------------------------------------------------

export async function processRepeatsField({

  userId,

  language = "en",

  source = "baseline",

  batchId,

  repeats,

}: ProcessRepeatsFieldInput) {

  try {

    // --------------------------------------------------
    // 🚫 EMPTY
    // --------------------------------------------------

    if (
      !repeats?.trim()
    ) {

      console.log(
        "🔁 No repeats provided"
      );

      return;
    }

    // --------------------------------------------------
    // 🪞 REFLECTION TEXT
    // --------------------------------------------------

    const reflectionText = `

Based on what has been shared so far,
there are signs that certain emotional,
relational,
or energetic experiences
may continue repeating across time.

These repetitions may not simply reflect circumstance,
but deeper nervous system patterns,
protective adaptations,
relational expectations,
or unconscious emotional loops
that continue seeking awareness,
safety,
integration,
or resolution.

The repeated experience shared is:

"${repeats}"

There may be moments
where familiar emotional dynamics
feel easier to recreate
than entering unfamiliar patterns of openness,
safety,
trust,
visibility,
or embodiment.
`;

    // --------------------------------------------------
    // 🚀 PROCESS
    // --------------------------------------------------

    await processReflection({

      userId,

      language,

      source,

      baselineType:
        "repeats",

      signalDepth:
        1.5,

      text:
        reflectionText,

      metadata: {

        repeats,

        batch_id:
          batchId,

        processing_layer:
          "you.repeats",

        generated_from:
          "repeats_field",

        generated_at:
          new Date().toISOString(),
      },
    });

    // --------------------------------------------------
    // ✅ DONE
    // --------------------------------------------------

    console.log(
      "🔁 Repeats field processed"
    );

  } catch (error) {

    console.log(
      "❌ processRepeatsField error",
      error
    );
  }
}