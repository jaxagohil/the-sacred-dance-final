// --------------------------------------------------
// 🧒 PROCESS CHILDHOOD FIELD
// --------------------------------------------------

import { supabase } from "../services/supabase";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type ProcessChildhoodFieldInput = {

  userId: string;

  language?: string;

  source?: string;

  batchId?: string;

  childhoodSignals:
    Record<string, number>;

  repeats?: string;
};

// --------------------------------------------------
// 🧠 CHILDHOOD MAP
// --------------------------------------------------

const CHILDHOOD_MAP = {

  felt_seen: `

There are signs that emotional recognition
and being truly seen
may still influence
how connection,
visibility,
and validation
are experienced now.
`,

  felt_safe: `

There are signs that emotional safety,
nervous system settling,
and trust in connection
may still shape
current relational expectations.
`,

  felt_alone: `

There are signs that emotional isolation,
self-protection,
or internal withdrawal
may still appear
during emotional difficulty.
`,

  felt_loved: `

There are signs that experiences of love,
care,
and emotional warmth
may still influence
how openness and closeness are received now.
`,

  felt_judged: `

There are signs that emotional monitoring,
fear of criticism,
or self-protection
may still shape
how expression,
visibility,
and vulnerability appear.
`,

  felt_insecure: `

There are signs that uncertainty,
emotional instability,
or nervous system vigilance
may still influence
how safety and grounding are experienced.
`,

  father_emotionally_present: `

There are signs that experiences
around masculine emotional presence,
support,
protection,
or emotional reliability
may still influence
relational expectations now.
`,

  mother_emotionally_present: `

There are signs that experiences
around emotional nurturing,
care,
softness,
and emotional availability
may still influence
how closeness and safety are experienced now.
`,

  dreams_were_heard: `

There are signs that being encouraged,
heard,
supported,
or emotionally witnessed
may still shape
how expression and self-trust appear now.
`,

  boundaries_respected: `

There are signs that experiences
around emotional boundaries,
space,
and personal safety
may still influence
how protection,
openness,
and closeness are navigated now.
`,
};

// --------------------------------------------------
// 🚀 MAIN
// --------------------------------------------------

export async function processChildhoodField({

  userId,

  language = "en",

  source = "baseline",

  batchId,

  childhoodSignals,

  repeats,

}: ProcessChildhoodFieldInput) {

  try {

    // --------------------------------------------------
    // 🌱 ACTIVE SIGNALS
    // --------------------------------------------------

    const activeSignals =

      Object.entries(
        childhoodSignals
      )

        .filter(
          ([_, value]) =>
            value === 1
        );

    // --------------------------------------------------
    // 🚫 NOTHING ACTIVE
    // --------------------------------------------------

    if (
      !activeSignals.length
    ) {

      console.log(
        "🧒 No childhood signals active"
      );

      return;
    }

    // --------------------------------------------------
    // 🌱 PROCESS EACH SIGNAL
    // --------------------------------------------------

    for (const [key] of activeSignals) {

      console.log(
        `🧒 Processing childhood signal: ${key}`
      );

      const reflectionText = `

Based on what has been shared so far,
there are early emotional environments
that may still influence
how safety,
connection,
protection,
belonging,
visibility,
or emotional openness
are experienced now.

${
  CHILDHOOD_MAP[
    key as keyof typeof CHILDHOOD_MAP
  ]
}
`;

      // --------------------------------------------------
      // 🚀 PROCESS REFLECTION
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
          "childhood",

        signalDepth: 1.5,

        text:
          reflectionText,

        childhoodSignals: {
          [key]: 1,
        },

        metadata: {

          childhood_signal:
            key,

          processing_layer:
            "you.childhood",

          batch_id:
            batchId,

          generated_from:
            "childhood_field",

          generated_at:
            new Date().toISOString(),
        },
      },
    }
  );

if (error) {

  console.error(
    "❌ Childhood processing error",
    error
  );

} else {

  console.log(
    "✅ Childhood processed",
    data
  );
}
    }

    // --------------------------------------------------
    // ✅ DONE
    // --------------------------------------------------

    console.log(
      `🧒 Childhood field processed (${activeSignals.length} signals)`
    );

  } catch (error) {

    console.log(
      "❌ processChildhoodField error",
      error
    );
  }
}