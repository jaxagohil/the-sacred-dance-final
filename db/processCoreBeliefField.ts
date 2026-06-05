// --------------------------------------------------
// 🪞 PROCESS CORE BELIEF FIELD
// --------------------------------------------------

import { supabase } from "../services/supabase";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type ProcessCoreBeliefFieldInput = {

  userId: string;

  language?: string;

  source?: string;

  batchId?: string;

  coreBelief: string;
};

// --------------------------------------------------
// 🚀 MAIN
// --------------------------------------------------

export async function processCoreBeliefField({

  userId,

  language = "en",

  source = "baseline",

  batchId,

  coreBelief,

}: ProcessCoreBeliefFieldInput) {

  try {

    // --------------------------------------------------
    // 🚫 EMPTY
    // --------------------------------------------------

    if (
      !coreBelief?.trim()
    ) {

      console.log(
        "🪞 No core belief provided"
      );

      return;
    }

    // --------------------------------------------------
    // 🪞 REFLECTION TEXT
    // --------------------------------------------------

    const reflectionText = `

Based on what has been shared so far,
there are signs that certain identity-level beliefs,
emotional truths,
or internal narratives
may still shape
how safety,
connection,
worthiness,
visibility,
trust,
or belonging
are experienced.

Core beliefs often form slowly through lived experience,
protection,
adaptation,
conditioning,
and repeated emotional environments.

Over time,
these internal truths
can begin shaping:
relationships,
expectations,
self perception,
emotional openness,
and nervous system responses.

The belief shared is:

"${coreBelief}"

There may be moments
where this internal belief
quietly influences
how reality,
relationships,
or emotional experiences
are interpreted or anticipated.
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

        source,

        baselineType:
          "core_belief",

        signalDepth:
          2,

        text:
          reflectionText,

        metadata: {

          core_belief:
            coreBelief,

          batch_id:
            batchId,

          processing_layer:
            "you.core_belief",

          generated_from:
            "core_belief_field",

          generated_at:
            new Date().toISOString(),
        },
      },
    }
  );

if (error) {

  console.error(
    "❌ Core belief processing error",
    error
  );

} else {

  console.log(
    "✅ Core belief processed",
    data
  );
}

    // --------------------------------------------------
    // ✅ DONE
    // --------------------------------------------------

    console.log(
      "🪞 Core belief field processed"
    );

  } catch (error) {

    console.log(
      "❌ processCoreBeliefField error",
      error
    );
  }
}