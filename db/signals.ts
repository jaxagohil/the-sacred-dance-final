// services/createSignal.ts

import { supabase } from "../services/supabase";

type CreateSignalInput = {
  reflection_id: string;

  user_id: string;

  sourcetype?: string;

  signal_depth?: number;

  // 🧠 AI / semantic
  ai_behaviours?: any[];

  ai_patterns?: any[];

  ai_lens?: any;

  ai_confidence?: number | null;

  ai_intensity?: number | null;

  // ⚡ energy
  energy?: any;

  // 🌍 levels
  levels?: {

    physical?: number;

    emotional?: number;

    energetic?: number;
  };

  // ✨ consciousness movement
  consciousness_movement?: {

    reactivity?: number;

    awareness?: number;

    responsibility?: number;

    embodiment?: number;

    integration?: number;
  };

  // 🌈 semantic layers
  dominant_state?: string;

  energetic_direction?: string;

  nervous_system_state?: string;

  integration_needed?: string;
};

export async function createSignal({
  reflection_id,
  user_id,

  sourcetype = "unknown",

  signal_depth = 1,

  ai_behaviours = [],

  ai_patterns = [],

  ai_lens = {
    people: [],
    places: [],
    things: [],
  },

  ai_confidence = null,

  ai_intensity = null,

  energy = {},

  // 🌍 levels
  levels = {
    physical: 0.5,
    emotional: 0.5,
    energetic: 0.5,
  },

  // ✨ consciousness
  consciousness_movement = {
    reactivity: 0.5,
    awareness: 0.5,
    responsibility: 0.5,
    embodiment: 0.5,
    integration: 0.5,
  },

  // 🌈 semantic
  dominant_state = "processing",

  energetic_direction = "inward",

  nervous_system_state = "processing",

  integration_needed = "",
}: CreateSignalInput) {

  // ---------------------------------
  // 📦 PAYLOAD
  // ---------------------------------

  const payload = {
    reflection_id,

    user_id,

    sourcetype,

    signal_depth,

    // 🧠 AI
    ai_behaviours,

    ai_patterns,

    ai_lens,

    ai_confidence,

    ai_intensity,

    // ⚡ energy
    energy,

    // 🌍 levels
    levels,

    // ✨ consciousness
    consciousness_movement,

    // 🌈 semantic
    dominant_state,

    energetic_direction,

    nervous_system_state,

    integration_needed,
  };

  console.log(
    "⚡ SIGNAL INSERT:",
    payload
  );

  // ---------------------------------
  // 💾 INSERT
  // ---------------------------------

  const { data, error } =
    await supabase
      .from("signals")
      .insert([payload])
      .select()
      .maybeSingle();

  // ---------------------------------
  // ❌ ERROR
  // ---------------------------------

  if (error) {

    console.error(
      "❌ SIGNAL INSERT ERROR:",
      error
    );

    throw error;
  }

  // ---------------------------------
  // ✅ DONE
  // ---------------------------------

  console.log(
    "⚡ SIGNAL CREATED:",
    {
      id: data?.id,

      behaviours:
        data?.ai_behaviours?.length || 0,

      patterns:
        data?.ai_patterns?.length || 0,

      hasLens:
        !!data?.ai_lens,

      hasEnergy:
        !!data?.energy,

      hasLevels:
        !!data?.levels,

      hasConsciousness:
        !!data?.consciousness_movement,

      dominant_state:
        data?.dominant_state,
    }
  );

  return data;
}