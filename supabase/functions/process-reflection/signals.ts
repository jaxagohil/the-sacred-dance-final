// services/createSignal.ts

import { supabase } from "./supabase.ts";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type CreateSignalInput = {

  // --------------------------------------------------
  // CORE
  // --------------------------------------------------

  reflection_id: string;

  user_id: string;

  sourcetype?: string;

  signal_origin?: string;

  baseline_type?: string;

  signal_depth?: number;

  temporal_weight?: number;

  // --------------------------------------------------
  // 🧠 BEHAVIOURS / PATTERNS
  // --------------------------------------------------

  ai_behaviours?: any[];

  ai_patterns?: any[];

  ai_lens?: any;

  primary_pattern?: string;

  pattern_score?: number;

  spectrum_side?: string;

  // --------------------------------------------------
  // 🌈 LENS SYSTEM
  // --------------------------------------------------

  lens_scores?: Record<
    string,
    number
  >;

  // --------------------------------------------------
  // ⚡ CHAKRAS
  // --------------------------------------------------

  primary_chakra?:
    string | null;

  chakra_scores?: Record<
    string,
    number
  >;

  // --------------------------------------------------
  // 🤖 AI CONFIDENCE
  // --------------------------------------------------

  ai_confidence?:
    number | null;

  ai_intensity?:
    number | null;

  // --------------------------------------------------
  // ⚡ ENERGY
  // --------------------------------------------------

  energy?: {

    feminine?: number;

    masculine?: number;

    contraction?: number;

    expansion?: number;

    chakras?:
      Record<string, number>;

    dominant_chakra?:
      string | null;
  };

  // --------------------------------------------------
  // ⚡ DISTORTIONS
  // --------------------------------------------------

  distortions?: {

    distorted?: any[];

    integrated?: any[];

    contractionLevel?: number;

    expansionLevel?: number;

    dominantPolarity?:
      | "feminine"
      | "masculine";
  };

  // --------------------------------------------------
  // 🌍 REALITY LAYERS
  // --------------------------------------------------

reality_layers?: {

  physical?: number;

  emotional?: number;

  energetic?: number;

  consciousness?: number;
};
  // --------------------------------------------------
  // ✨ CONSCIOUSNESS
  // --------------------------------------------------

  consciousness_movement?: {

    reactivity?: number;

    awareness?: number;

    responsibility?: number;

    embodiment?: number;

    integration?: number;
  };

  // --------------------------------------------------
  // 🌈 SEMANTIC
  // --------------------------------------------------

  dominant_state?: string;

  energetic_direction?:
    string;

  nervous_system_state?:
    string;

  integration_needed?:
    string;

  // --------------------------------------------------
  // 🌗 SACRED DANCE
  // --------------------------------------------------

  polarity_score?: number;

  integration_score?:
    number;

  embodiment_score?:
    number;

  nervous_system_activation?:
    number;

    // 🌀 SPIRAL

spiral_state?: string;

spiral_direction?: string;

dominant_pole?: string;

integration_score_v2?: number;

left_pole_score?: number;

right_pole_score?: number;

dominant_pattern_v2?: string | null;

chakra_activation?:
  Record<string, number>;
};


// --------------------------------------------------
// 🚀 MAIN
// --------------------------------------------------

export async function
createSignal({

  // --------------------------------------------------
  // CORE
  // --------------------------------------------------

  reflection_id,

  user_id,

  sourcetype = "unknown",

  signal_origin =
    "reflection",

  baseline_type =
    undefined,

  signal_depth = 1,

  temporal_weight = 1,

  // --------------------------------------------------
  // 🧠 BEHAVIOURS / PATTERNS
  // --------------------------------------------------

  ai_behaviours = [],

  ai_patterns = [],

  ai_lens = {

    people: [],

    places: [],

    things: [],
  },

  primary_pattern = "",

  pattern_score = 0,

  spectrum_side =
    "center",

  // --------------------------------------------------
  // 🌈 LENSES
  // --------------------------------------------------

  lens_scores = {

    people: 0,

    places: 0,

    things: 0,
  },

  // --------------------------------------------------
  // ⚡ CHAKRAS
  // --------------------------------------------------

  primary_chakra =
    null,

  chakra_scores = {},

  // --------------------------------------------------
  // 🤖 AI
  // --------------------------------------------------

  ai_confidence = null,

  ai_intensity = null,

  // --------------------------------------------------
  // ⚡ ENERGY
  // --------------------------------------------------

  energy = {

    feminine: 0.5,

    masculine: 0.5,

    contraction: 0.5,

    expansion: 0.5,

    chakras: {},

    dominant_chakra:
      null,
  },

  // --------------------------------------------------
  // ⚡ DISTORTIONS
  // --------------------------------------------------

  distortions = {

    distorted: [],

    integrated: [],

    contractionLevel: 0.5,

    expansionLevel: 0.5,

    dominantPolarity:
      "feminine",
  },

  // --------------------------------------------------
  // 🌍 REALITY LAYERS
  // --------------------------------------------------

  reality_layers = {

  physical: 0,

  emotional: 0,

  energetic: 0,

  consciousness: 0,
},

  // --------------------------------------------------
  // ✨ CONSCIOUSNESS
  // --------------------------------------------------

  consciousness_movement = {

    reactivity: 0.5,

    awareness: 0.5,

    responsibility: 0.5,

    embodiment: 0.5,

    integration: 0.5,
  },

  // --------------------------------------------------
  // 🌈 SEMANTIC
  // --------------------------------------------------

  dominant_state =
    "processing",

  energetic_direction =
    "inward",

  nervous_system_state =
    "processing",

  integration_needed =
    "",

  // --------------------------------------------------
  // 🌗 SACRED DANCE
  // --------------------------------------------------

  polarity_score = 0,

  integration_score = 0,

  embodiment_score = 0,

  nervous_system_activation = 0,

  // 🌀 SPIRAL

spiral_state =
  "processing",

spiral_direction =
  "processing",

dominant_pole =
  "center",

integration_score_v2 = 0,

left_pole_score = 0,

right_pole_score = 0,

dominant_pattern_v2 =
  null,

chakra_activation = {},

}: CreateSignalInput) {

  try {

    // --------------------------------------------------
    // 📦 PAYLOAD
    // --------------------------------------------------

    const payload = {

      // ------------------------------------------------
      // CORE
      // ------------------------------------------------

      reflection_id,

      user_id,

      sourcetype,

      signal_origin,

      baseline_type,

      signal_depth,

      temporal_weight,

      // ------------------------------------------------
      // 🧠 BEHAVIOURS / PATTERNS
      // ------------------------------------------------

      ai_behaviours,

      ai_patterns,

      ai_lens,

      primary_pattern,

      pattern_key:
  primary_pattern,

      pattern_score,

      spectrum_side,

      // ------------------------------------------------
      // 🌈 LENSES
      // ------------------------------------------------

      lens_scores,

      // ------------------------------------------------
      // ⚡ CHAKRAS
      // ------------------------------------------------

      primary_chakra,

      chakra_scores,

      // ------------------------------------------------
      // 🤖 AI
      // ------------------------------------------------

      ai_confidence,

      ai_intensity,

      // ------------------------------------------------
      // ⚡ ENERGY
      // ------------------------------------------------

      energy,

      // ------------------------------------------------
      // ⚡ DISTORTIONS
      // ------------------------------------------------

      distortions,

      // ------------------------------------------------
      // 🌍 REALITY LAYER
      // ------------------------------------------------

      reality_layers,

      // ------------------------------------------------
      // ✨ CONSCIOUSNESS
      // ------------------------------------------------

      consciousness_movement,

      // ------------------------------------------------
      // 🌈 SEMANTIC
      // ------------------------------------------------

      dominant_state,

      energetic_direction,

      nervous_system_state,

      integration_needed,

      // ------------------------------------------------
      // 🌗 SACRED DANCE
      // ------------------------------------------------

      polarity_score,

      integration_score,

      embodiment_score,

      nervous_system_activation,

      // 🌀 SPIRAL

spiral_state,

spiral_direction,

dominant_pole,

integration_score_v2,

left_pole_score,

right_pole_score,

dominant_pattern_v2,

chakra_activation,
    };

    // --------------------------------------------------
    // 🪞 DEBUG
    // --------------------------------------------------

    console.log(
      "⚡ SIGNAL INSERT:",
      payload
    );

    // --------------------------------------------------
    // 💾 INSERT
    // --------------------------------------------------

    const {
      data,
      error,
    } = await supabase

      .from("signals")

      .insert([payload])

      .select()

      .maybeSingle();

    // --------------------------------------------------
    // ❌ ERROR
    // --------------------------------------------------

    if (error) {

      console.error(
        "❌ SIGNAL INSERT ERROR:",
        error
      );

      throw error;
    }

    // --------------------------------------------------
    // ✅ CREATED
    // --------------------------------------------------

    console.log(
      "✨ SIGNAL CREATED:",
      {

        id:
          data?.id,

        pattern:
          data?.primary_pattern,

          pattern_key:
  data?.primary_pattern,

        pattern_score:
          data?.pattern_score,

        spectrum_side:
          data?.spectrum_side,

        primary_chakra:
          data?.primary_chakra,

        polarity_score:
          data?.polarity_score,

        integration_score:
          data?.integration_score,

        embodiment_score:
          data?.embodiment_score,

        nervous_system_activation:

          data
            ?.nervous_system_activation,

            spiral_state:
  data?.spiral_state,

spiral_direction:
  data?.spiral_direction,

dominant_pole:
  data?.dominant_pole,

integration_score_v2:
  data?.integration_score_v2,

        dominant_state:

          data
            ?.dominant_state,
      }
    );

    // --------------------------------------------------
    // ✨ RETURN
    // --------------------------------------------------

    return data;

  } catch (error) {

    console.error(
      "❌ createSignal error:",
      error
    );

    throw error;
  }
}