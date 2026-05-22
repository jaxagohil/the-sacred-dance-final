// services/flow.ts

import { supabase } from "../services/supabase";

import { interpretInput } from "../lib/ai/interpretInput";

import { derivePatternsFromBehaviours } from "../lib/derivePatternsFromBehaviours";

import { loadValidSignals } from "../lib/loadValidSignals";

import { createReflection } from "./reflections";

import { createSignalFromInterpretation } from "./createSignalFromInterpretation";

import { unique } from "../lib/unique";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type Pattern = {

  id: string;

  score?: number;

  name?: string;

  description?: string;

  soul_lesson?: string;

  mirror_theme?: string;

  affirmation?: string;
};

type Behaviour = {

  id: string;

  weight: number;

  shadow_meaning?: string;

  integrated_meaning?: string;

  nervous_system_need?: string;

  mirror_question?: string;

  integration_step?: string;

  embodiment?: string;

  energetic_state?: string;

  contraction?: number;

  expansion?: number;

  masculine?: number;

  feminine?: number;

  quality?:
    | "divine"
    | "distorted";
};

type Emotion = {

  id: string;

  emotional_family?: string;

  nervous_system_state?: string;

  somatic_expression?: string;

  core_need?: string;

  integration?: string;
};

// --------------------------------------------------
// 🚀 MAIN
// --------------------------------------------------

export async function processReflection(
  input: any
) {

  console.log(
    "🚀 PROCESS REFLECTION START"
  );

  // --------------------------------------------------
  // 🛡 LOAD VALID SIGNALS
  // --------------------------------------------------

  await loadValidSignals();

  // --------------------------------------------------
  // 📦 INPUT
  // --------------------------------------------------

  const {

    userId,

    text,

    emotions,

    childhoodSignals,

    pattern,

    energyAxes,

    source,

    metadata,

    signalDepth,

    language = "en",

    baselineType,

  } = input;

  // --------------------------------------------------
  // 🧠 INTERPRET INPUT
  // --------------------------------------------------

  const interpretation =
    await interpretInput({

      language,

      text,

      emotions,

      childhoodSignals,

      pattern,

      energyAxes,

      source,
    });

  console.log(
    "🧠 INTERPRETATION:",
    interpretation
  );

  // --------------------------------------------------
  // 😊 RAW EMOTIONS
  // --------------------------------------------------

  const rawEmotions =
    interpretation.emotions || [];

  const uniqueEmotions =
    unique(
      rawEmotions
    );

  console.log(
    "😊 RAW EMOTIONS:",
    rawEmotions
  );

  // --------------------------------------------------
  // 😊 ENRICH EMOTIONS
  // --------------------------------------------------

  const {

    data: emotionRows,

    error: emotionError,

  } = await supabase

    .from("emotions")

    .select("*")

    .in("id", uniqueEmotions);

  if (emotionError) {

    console.error(
      "❌ Emotion enrichment error:",
      emotionError
    );
  }

  const enrichedEmotions:
    Emotion[] =

    (emotionRows || []).map(
      (e: any) => ({

        id: e.id,

        emotional_family:
          e.emotional_family,

        nervous_system_state:
          e.nervous_system_state,

        somatic_expression:
          e.somatic_expression,

        core_need:
          e.core_need,

        integration:
          e.integration,
      })
    );

  console.log(
    "😊 ENRICHED EMOTIONS:",
    enrichedEmotions
  );

  // --------------------------------------------------
  // 🧠 RAW BEHAVIOURS
  // --------------------------------------------------

  let rawBehaviours:
    string[] =

    interpretation.behaviours || [];

  if (
    rawBehaviours.length === 0
  ) {

    console.log(
      "⚠️ No behaviours derived"
    );
  }

  console.log(
    "🧠 RAW BEHAVIOURS:",
    rawBehaviours
  );

  // --------------------------------------------------
  // 🧠 ENRICH BEHAVIOURS
  // --------------------------------------------------

  const {

    data: behaviourRows,

    error: behaviourError,

  } = await supabase

    .from("behaviours")

    .select("*")

.in(
  "id",

  unique(rawBehaviours)
);

  if (behaviourError) {

    console.error(
      "❌ Behaviour enrichment error:",
      behaviourError
    );
  }

  const behaviourMap =
    new Map(

      (behaviourRows || []).map(
        (b: any) => [b.id, b]
      )
    );

  const intensity =
    interpretation.intensity || 1;

  const behaviours:
    Behaviour[] =

    rawBehaviours.map(
      (id) => {

        const row =
          behaviourMap.get(id);

        return {

          id,

          weight:
            intensity,

          shadow_meaning:
            row?.shadow_meaning || null,

          integrated_meaning:
            row?.integrated_meaning || null,

          nervous_system_need:
            row?.nervous_system_need || null,

          mirror_question:
            row?.mirror_question || null,

          integration_step:
            row?.integration_step || null,

          embodiment:
            row?.embodiment || null,

          energetic_state:
            row?.energetic_state ||
            "neutral",

          contraction:
            row?.contraction || 0,

          expansion:
            row?.expansion || 0,

          masculine:
            row?.masculine || 0,

          feminine:
            row?.feminine || 0,

          quality:
            row?.quality ||
            "distorted",
        };
      }
    );

  console.log(
    "🧠 ENRICHED BEHAVIOURS:",
    behaviours
  );

  // --------------------------------------------------
  // 🪞 DERIVE PATTERNS
  // --------------------------------------------------

  const derivedPatterns =
await derivePatternsFromBehaviours(

  behaviours,

  source,

  signalDepth,
);

  const rawPatterns =
    derivedPatterns.map(
      (p: Pattern) => p.id
    );

  console.log(
    "🪞 RAW PATTERNS:",
    rawPatterns
  );

  // --------------------------------------------------
  // 🪞 ENRICH PATTERNS
  // --------------------------------------------------

  const {

    data: patternRows,

    error: patternError,

  } = await supabase

    .from("patterns")

    .select("*")

    .in("id", rawPatterns);

  if (patternError) {

    console.error(
      "❌ Pattern enrichment error:",
      patternError
    );
  }

  console.log(
    "🪞 ENRICHED PATTERNS:",
    patternRows
  );

  // --------------------------------------------------
  // 🧠 REFLECTION SUMMARY
  // --------------------------------------------------

  const emotionSummary =
    enrichedEmotions

      .map(
        (e) =>
          e.integration
      )

      .filter(Boolean)

      .slice(0, 1);

  const behaviourSummary =
    behaviours

      .map(
        (b) =>
          b.shadow_meaning
      )

      .filter(Boolean)

      .slice(0, 2);

  const reflection_summary =

    [
      ...emotionSummary,

      ...behaviourSummary,

    ].join(". ");

  console.log(
    "🧠 REFLECTION SUMMARY:",
    reflection_summary
  );

  // --------------------------------------------------
  // 🧾 CREATE REFLECTION
  // --------------------------------------------------

  const reflection =
    await createReflection({

      userId,

      content:

        text ||

        pattern ||

        "",

      content_type:
        baselineType ||
        source ||
        "reflection",

      source,

      metadata: {

        language:
          language || "en",

        baseline_type:
          baselineType || null,

        emotions:
          emotions || [],

        childhood_signals:
          childhoodSignals || null,

        pattern:
          pattern || null,

        energyAxes:
          energyAxes || null,

        ...(metadata || {}),
      },

      extracted_emotions:
        uniqueEmotions,

      extracted_patterns:
        rawPatterns,

extracted_behaviours:

  unique(
    rawBehaviours
  ),

      reflection_summary,
    });

  if (!reflection?.id) {

    throw new Error(
      "Reflection insert failed"
    );
  }

  console.log(
    "🧾 REFLECTION CREATED:",
    reflection.id
  );

  // --------------------------------------------------
  // ⚡ CREATE SIGNALS
  // --------------------------------------------------

// --------------------------------------------------
// ⚡ GROUP DISTINCT PATTERNS
// --------------------------------------------------

const groupedPatterns =
  new Map<string, any>();

for (const pattern of derivedPatterns) {

  const existing =
    groupedPatterns.get(
      pattern.id
    );

  if (!existing) {

groupedPatterns.set(
  pattern.id,
  {
    ...pattern,

behaviours:

  behaviours.map(
    (b) => ({

      ...b,

      occurrences: 1,
    })
  ),

    emotions: [
      ...enrichedEmotions,
    ],
  }
);

  } else {

existing.score =
  Number(
    (
      existing.score +
      pattern.score
    ).toFixed(2)
  );

// --------------------------------------------------
// 🧠 MERGE BEHAVIOURS
// --------------------------------------------------

const mergedBehaviourMap =
  new Map<string, any>();

[
  ...(existing.behaviours || []),

  ...behaviours.map(
    (b) => ({
      ...b,

      occurrences: 1,
    })
  ),

].forEach((b: any) => {

  const existingBehaviour =
    mergedBehaviourMap.get(
      b.id
    );

  if (!existingBehaviour) {

    mergedBehaviourMap.set(
      b.id,
      {
        ...b,

        occurrences: 1,
      }
    );

  } else {

    existingBehaviour.occurrences += 1;
  }
});

existing.behaviours =
  Array.from(
    mergedBehaviourMap.values()
  );

// --------------------------------------------------
// 😊 MERGE EMOTIONS
// --------------------------------------------------
existing.emotions =

  Array.from(

    new Map(

      [

        ...(existing.emotions || []),

        ...enrichedEmotions,

      ].map((e: any) => [
        e.id,
        e
      ])

    ).values()
  );

  }
}
// --------------------------------------------------
// ⚡ CREATE DISTINCT SIGNALS
// --------------------------------------------------

const signals = [];

for (const currentPattern of groupedPatterns.values()) {

  console.log(
    `⚡ PROCESSING DISTINCT PATTERN SIGNAL: ${currentPattern.id}`
  );

  const signalResult =
    await createSignalFromInterpretation({

      reflection,

      userId,

      interpretation,

      behaviours,

      currentPattern,

      enrichedEmotions,

      source,

      baselineType,

      signalDepth,

      language,

      text,

      reflection_summary,
    });

  if (
    signalResult?.signal
  ) {

    signals.push(
      signalResult.signal
    );
  }
}

  console.log(
    `⚡ CREATED ${signals.length} SIGNALS`
  );

  // --------------------------------------------------
  // ✅ MARK REFLECTION PROCESSED
  // --------------------------------------------------

  await supabase

    .from("reflections")

    .update({

      signal_processed:
        true,

      processed_at:
        new Date().toISOString(),
    })

    .eq(
      "id",
      reflection.id
    );

  // --------------------------------------------------
  // ✅ DONE
  // --------------------------------------------------

  return {

    reflection,

    signals,

    behaviours,

    emotions:
      enrichedEmotions,

    patterns:
      patternRows || [],
  };
}