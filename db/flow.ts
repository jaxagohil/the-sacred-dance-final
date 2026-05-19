// services/flow.ts

import { supabase } from "../services/supabase";

import { interpretInput } from "../lib/ai/interpretInput";

import { derivePatternsFromBehaviours } from "../lib/derivePatternsFromBehaviours";

import { loadValidSignals } from "../lib/loadValidSignals";

import { createReflection } from "./reflections";

import { createSignal } from "./signals";

import { unique } from "../lib/unique";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type Pattern = {

  id: string;

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
// HELPERS
// --------------------------------------------------

const average = (
  values: number[]
) => {

  if (!values.length)
    return 0;

  return (

    values.reduce(
      (a, b) => a + b,
      0
    ) /

    values.length
  );
};

// --------------------------------------------------
// MAIN
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

    language,

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

    const uniqueBehaviours =

  unique(
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

    .in("id", uniqueBehaviours);

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

    uniqueBehaviours.map(
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
      behaviours
    );

  const rawPatterns =
    derivedPatterns.map(
      (p) => p.id
    );

  console.log(
    "🪞 RAW PATTERNS:",
    rawPatterns
  );

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
  // ⚡ ENERGY SYNTHESIS
  // --------------------------------------------------

  const feminine =
    average(

      behaviours.map(
        (b) =>
          b.feminine || 0
      )
    );

  const masculine =
    average(

      behaviours.map(
        (b) =>
          b.masculine || 0
      )
    );

  const contraction =
    average(

      behaviours.map(
        (b) =>
          b.contraction || 0
      )
    );

  const expansion =
    average(

      behaviours.map(
        (b) =>
          b.expansion || 0
      )
    );

// --------------------------------------------------
// 🌈 PATTERN CHAKRA MANIFESTATIONS
// --------------------------------------------------

const {

  data: chakraManifestations,

  error: chakraError,

} = await supabase

  .from(
    "pattern_chakra_manifestations"
  )

  .select("*")

  .in(
    "pattern_key",
    rawPatterns
  )

  .eq(
    "language",
    language
  );

if (chakraError) {

  console.error(
    "❌ Chakra manifestation error:",
    chakraError
  );
}

console.log(
  "🌈 CHAKRA MANIFESTATIONS:",
  chakraManifestations
);

// --------------------------------------------------
// 🌈 BUILD CHAKRA MAP
// --------------------------------------------------

const chakraMap:
  Record<string, number>
    = {};

chakraManifestations?.forEach(
  (m: any) => {

    const chakra =
      m.chakra_key;

    const weight =
      Number(m.weight || 0);

    chakraMap[chakra] =

      (
        chakraMap[
          chakra
        ] || 0
      ) + weight;
  }
);

// --------------------------------------------------
// 🌈 NORMALIZE CHAKRAS
// --------------------------------------------------

const chakraTotal =

  Object.values(
    chakraMap
  ).reduce(
    (a, b) => a + b,
    0
  ) || 1;

const normalizedChakras:
  Record<string, number>
    = {};

Object.entries(
  chakraMap
).forEach(([k, v]) => {

  normalizedChakras[k] =
    v / chakraTotal;
});

// --------------------------------------------------
// 🌈 DOMINANT CHAKRA
// --------------------------------------------------

const dominant_chakra =

  Object.entries(
    normalizedChakras
  )

    .sort(
      (a, b) =>
        b[1] - a[1]
    )[0]?.[0] ||

  null;

// --------------------------------------------------
// 👁 AWARENESS CHAKRA
// --------------------------------------------------

const chakraKeys =
  Object.keys(
    normalizedChakras
  );

const avg =

  1 / (
    chakraKeys.length || 1
  );

const awarenessMap:
  Record<string, number>
    = {};

chakraKeys.forEach(
  (chakra) => {

    const activation =

      normalizedChakras[
        chakra
      ] || 0;

    const deviation =

      Math.abs(
        activation - avg
      );

    awarenessMap[
      chakra
    ] =

      deviation +

      activation * 0.3;
  }
);

const awarenessChakra =

  Object.entries(
    awarenessMap
  )

    .sort(
      (a, b) =>
        Number(b[1]) -
        Number(a[1])
    )[0]?.[0] ||

  null;
  
  const distorted =
  behaviours.filter(
    (b) =>
      b.quality ===
      "distorted"
  );

const integrated =
  behaviours.filter(
    (b) =>
      b.quality ===
      "divine"
  );

  // --------------------------------------------------
  // ⚡ DISTORTIONS
  // --------------------------------------------------

  const distortions = {

    distorted,

    integrated,

    contractionLevel:
      contraction,

    expansionLevel:
      expansion,

    dominantPolarity:

      feminine >
      masculine

        ? "feminine"

        : "masculine",
  };

  // --------------------------------------------------
  // ✨ FINAL ENERGY
  // --------------------------------------------------

  const energy = {

    feminine,

    masculine,

    contraction,

    expansion,

    chakras:
      normalizedChakras,

    dominant_chakra,

awareness_chakra:
  awarenessChakra,
  };

  console.log(
    "⚡ ENERGY:",
    energy
  );

  console.log(
    "⚡ DISTORTIONS:",
    distortions
  );

  // --------------------------------------------------
  // 🪞 LENS MANIFESTATIONS
  // --------------------------------------------------

const {

  data: lensMappings,

  error: lensError,

} = await supabase

.from(
  "pattern_lens_weights"
)

  .select("*")

.in(
  "pattern_key",
  rawPatterns
)

  .eq(
    "language",
    language
  );

if (lensError) {

  console.error(
    "❌ Lens mapping error:",
    lensError
  );
}

  console.log(
    "🪞 LENS MAPPINGS:",
    lensMappings
  );

  // --------------------------------------------------
  // 🪞 SHAPE LENS MEMORY
  // --------------------------------------------------

  const shapeLensEntries = (
    lens: string
  ) =>

    lensMappings

      ?.filter(
        (m: any) =>
          m.lens === lens
      )

.map((m: any) => ({

  lens,

pattern_key:
  m.pattern_key,

  weight:
    m.weight,

  manifestation:
    m.manifestation,

  observable_scene:
    m.observable_scene,

  body_response:
    m.body_response,

  coping_strategy:
    m.coping_strategy,

  relational_effect:
    m.relational_effect,

  mirror_prompt:
    m.mirror_prompt,

  integrated_expression:
    m.integrated_expression,
})) || [];

  // --------------------------------------------------
  // 🧠 EMBODIED LENS
  // --------------------------------------------------

  const aiLens = {

    people:
      shapeLensEntries(
        "people"
      ),

    places:
      shapeLensEntries(
        "places"
      ),

    things:
      shapeLensEntries(
        "things"
      ),
  };

  // --------------------------------------------------
  // 🌍 LEVELS
  // --------------------------------------------------

  const levels =
    interpretation?.levels || {

      physical: 0.5,

      emotional: 0.5,

      energetic: 0.5,
    };

  console.log(
    "🌍 LEVELS:",
    levels
  );

  // --------------------------------------------------
  // ✨ CONSCIOUSNESS MOVEMENT
  // --------------------------------------------------

  const consciousnessMovement =
    interpretation
      ?.consciousness_movement || {

      reactivity: 0.5,

      awareness: 0.5,

      responsibility: 0.5,

      embodiment: 0.5,

      integration: 0.5,
    };

  console.log(
    "✨ CONSCIOUSNESS:",
    consciousnessMovement
  );

  // --------------------------------------------------
  // 🌈 DOMINANT STATE
  // --------------------------------------------------

  let dominant_state =
    "processing";

  if (contraction > 0.7) {

    dominant_state =
      "contracted";
  }

  if (expansion > 0.7) {

    dominant_state =
      "expansive";
  }

  // --------------------------------------------------
  // 🧠 NERVOUS SYSTEM
  // --------------------------------------------------

  let nervous_system_state =
    "processing";

  if (contraction > 0.75) {

    nervous_system_state =
      "protective";
  }

  if (expansion > 0.7) {

    nervous_system_state =
      "open";
  }

  // --------------------------------------------------
  // 🧭 ENERGETIC DIRECTION
  // --------------------------------------------------

  let energetic_direction =
    "inward";

  if (
    dominant_state ===
    "expansive"
  ) {

    energetic_direction =
      "outward";
  }

  if (

    dominant_chakra ===
      "root" ||

    dominant_chakra ===
      "earth_star"

  ) {

    energetic_direction =
      "grounding";
  }

  // --------------------------------------------------
  // 🩷 INTEGRATION NEED
  // --------------------------------------------------

  const emotionNeed =
    enrichedEmotions[0]
      ?.core_need;

  const behaviourNeed =
    behaviours.find(
      (b) =>
        b.nervous_system_need
    )?.nervous_system_need;

  const integration_needed =

    emotionNeed ||

    behaviourNeed ||

    "self awareness";

  // --------------------------------------------------
  // 🧾 REFLECTION TYPE
  // --------------------------------------------------

  const content_type =

    source === "baseline"

      ? "baseline"

      : emotions?.length

        ? "emotion"

        : "text";

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

      content_type,

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

        levels,

        consciousness_movement:
          consciousnessMovement,

        ...(metadata || {}),
      },

      extracted_emotions:
        uniqueEmotions,

      extracted_patterns:
        rawPatterns,

      extracted_behaviours:
        uniqueBehaviours,

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
  // ⚖️ SIGNAL DEPTH
  // --------------------------------------------------

  const DEFAULT_WEIGHTS = {

    baseline: 1.5,

    journal: 1.0,

    guidance: 0.9,

    landing: 0.6,

    unknown: 0.8,
  };

  const finalDepth =

    signalDepth ||

    DEFAULT_WEIGHTS[
      source as keyof typeof DEFAULT_WEIGHTS
    ] ||

    DEFAULT_WEIGHTS.unknown;

  // --------------------------------------------------
  // ⚡ CREATE SIGNAL
  // --------------------------------------------------

  const signal =
    await createSignal({

      reflection_id:
        reflection.id,

      user_id:
        userId,

      sourcetype:
        source || "unknown",

      baseline_type:
  baselineType || null,  

      signal_depth:
        finalDepth,

      ai_behaviours:
        behaviours,

      ai_patterns:
        patternRows || [],

      ai_lens:
        aiLens,

      ai_confidence:

        interpretation
          .ai_confidence ??

        null,

      ai_intensity:

        interpretation
          .intensity ??

        null,

      energy,

      distortions,

      levels,

      consciousness_movement:
        consciousnessMovement,

      dominant_state,

      energetic_direction,

      nervous_system_state,

      integration_needed,
    });

  console.log(
    "⚡ SIGNAL CREATED:",
    signal
  );

  // --------------------------------------------------
  // ✅ DONE
  // --------------------------------------------------

  return {

    reflection,

    signal,

    energy,

    distortions,

    patterns:
      patternRows || [],

    behaviours,

    emotions:
      enrichedEmotions,
  };
}