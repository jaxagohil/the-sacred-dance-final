// services/flow.ts

import { supabase } from "../services/supabase";

import { interpretInput } from "../lib/ai/interpretInput";

import { deriveLensFromBehaviours } from "../lib/deriveLensFromBehaviours";

import { derivePatternsFromBehaviours } from "../lib/derivePatternsFromBehaviours";

import { buildEnergyFromBehaviours } from "../lib/energy/buildEnergyFromBehaviours";

import { getBehaviourLookup } from "../lib/energy/getBehaviourLookup";

import { loadValidSignals } from "../lib/loadValidSignals";

import { createReflection } from "./reflections";

import { createSignal } from "./signals";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

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

  chakra_weights?:
    Record<string, number>;
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
  } = input;

  // --------------------------------------------------
  // 🧠 INTERPRET INPUT
  // --------------------------------------------------

  const interpretation =
    await interpretInput({
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
    .in("id", rawEmotions);

  if (emotionError) {

    console.error(
      "❌ Emotion enrichment error:",
      emotionError
    );
  }

  const enrichedEmotions: Emotion[] =
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

  let rawBehaviours: string[] =
    interpretation.behaviours || [];

  // 🛡 fallback
  if (rawBehaviours.length === 0) {
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
    .in("id", rawBehaviours);

  if (behaviourError) {

    console.error(
      "❌ Behaviour enrichment error:",
      behaviourError
    );
  }

  const behaviourMap = new Map(
    (behaviourRows || []).map(
      (b: any) => [b.id, b]
    )
  );

  const intensity =
    interpretation.intensity || 1;

  const behaviours: Behaviour[] =
    rawBehaviours.map((id) => {

      const row =
        behaviourMap.get(id);

      return {

        id,

        weight:
          intensity,

        // 🧠 semantic
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

        // ⚡ energetic
        contraction:
          row?.contraction || 0,

        expansion:
          row?.expansion || 0,

        masculine:
          row?.masculine || 0,

        feminine:
          row?.feminine || 0,

        quality:
          row?.quality || "distorted",

        chakra_weights:
          row?.chakra_weights || {},
      };
    });

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
  // ⚡ ENERGY
  // --------------------------------------------------

  const lookup =
    await getBehaviourLookup();

  const energy =
    buildEnergyFromBehaviours(
      behaviours,
      lookup
    );

  console.log(
    "⚡ ENERGY:",
    energy
  );

  // --------------------------------------------------
  // 🧠 LENS
  // --------------------------------------------------

  const lensRaw =
    await deriveLensFromBehaviours(
      behaviours
    );

  const aiLens = {

    people:
      lensRaw.people.map(
        (b) => b.id
      ),

    places:
      lensRaw.places.map(
        (b) => b.id
      ),

    things:
      lensRaw.things.map(
        (b) => b.id
      ),
  };

  console.log(
    "🧠 LENS:",
    aiLens
  );

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
  interpretation?.consciousness_movement || {

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

  const contraction =
    energy?.contraction || 0;

  const expansion =
    energy?.expansion || 0;

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
  // 🧠 NERVOUS SYSTEM STATE
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

  // 🌱 grounding phase
  if (
    energy?.dominant_chakra ===
      "root" ||

    energy?.dominant_chakra ===
      "earth_star"
  ) {
    energetic_direction =
      "grounding";
  }

  // --------------------------------------------------
  // 🩷 INTEGRATION NEED
  // --------------------------------------------------

  const emotionNeed =
    enrichedEmotions[0]?.core_need;

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

  emotions:
    emotions || [],

  childhood_signals:
    childhoodSignals || null,

  pattern:
    pattern || null,

  energyAxes:
    energyAxes || null,

  // 🌍 levels
  levels,

  // ✨ consciousness
  consciousness_movement:
    consciousnessMovement,

  ...(metadata || {}),
},

      // 🧠 semantic extraction
      extracted_emotions:
        rawEmotions,

      extracted_patterns:
        rawPatterns,

      extracted_behaviours:
        rawBehaviours,

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

      signal_depth:
        finalDepth,

      // 🧠 semantic
      ai_behaviours:
        behaviours,

      ai_patterns:
        patternRows || [],

      ai_lens:
        aiLens,

      ai_confidence:
        interpretation.ai_confidence ??
        null,

      ai_intensity:
        interpretation.intensity ??
        null,

      // ⚡ energy synthesis
      energy,

      // 🌍 levels
      levels,

      // ✨ consciousness
      consciousness_movement:
        consciousnessMovement,

      // 🌈 states
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
    patterns: patternRows || [],
    behaviours,
    emotions: enrichedEmotions,
  };
}