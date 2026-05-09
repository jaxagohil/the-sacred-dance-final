// lib/energy/getBehaviourLookup.ts

import { supabase } from "../../services/supabase";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export type BehaviourMeta = {

  // ⚖️ polarity
  feminine: number;
  masculine: number;

  // 🌗 energetic movement
  contraction: number;
  expansion: number;

  // ✨ state
  quality:
    | "divine"
    | "distorted";

  energetic_state?: string;

  // 🌈 chakra system
  chakra_weights:
    Record<string, number>;

  // 🧠 nervous system
  nervous_system_need?: string;

  // 🪞 semantic layer
  shadow_meaning?: string;

  integrated_meaning?: string;

  mirror_question?: string;

  integration_step?: string;

  embodiment?: string;
};

// --------------------------------------------------
// 🚀 LOAD LOOKUP
// --------------------------------------------------

export async function getBehaviourLookup(): Promise<
  Record<string, BehaviourMeta>
> {

  const { data, error } =
    await supabase
      .from("behaviours")
      .select(`
        id,

        feminine,
        masculine,

        contraction,
        expansion,

        quality,
        energetic_state,

        chakra_weights,

        nervous_system_need,

        shadow_meaning,
        integrated_meaning,

        mirror_question,
        integration_step,

        embodiment
      `);

  // --------------------------------------------------
  // ❌ ERROR
  // --------------------------------------------------

  if (error) {

    console.error(
      "❌ Behaviour lookup error:",
      error
    );

    return {};
  }

  // --------------------------------------------------
  // 🛡 SAFETY
  // --------------------------------------------------

  if (!data) {
    return {};
  }

  // --------------------------------------------------
  // 🧠 BUILD LOOKUP
  // --------------------------------------------------

  const lookup:
    Record<string, BehaviourMeta> = {};

  data.forEach((row) => {

    lookup[row.id] = {

      // ⚖️ polarity
      feminine:
        row.feminine ?? 0.5,

      masculine:
        row.masculine ?? 0.5,

      // 🌗 energetic movement
      contraction:
        row.contraction ?? 0.5,

      expansion:
        row.expansion ?? 0.5,

      // ✨ state
      quality:
        row.quality ||
        "distorted",

      energetic_state:
        row.energetic_state ||
        "neutral",

      // 🌈 chakra system
      chakra_weights:
        row.chakra_weights || {},

      // 🧠 nervous system
      nervous_system_need:
        row.nervous_system_need ||
        null,

      // 🪞 semantic layer
      shadow_meaning:
        row.shadow_meaning ||
        null,

      integrated_meaning:
        row.integrated_meaning ||
        null,

      mirror_question:
        row.mirror_question ||
        null,

      integration_step:
        row.integration_step ||
        null,

      embodiment:
        row.embodiment ||
        null,
    };
  });

  // --------------------------------------------------
  // 🧠 DEBUG
  // --------------------------------------------------

  console.log(
    "🧠 BEHAVIOUR LOOKUP LOADED:",
    Object.keys(lookup).length
  );

  return lookup;
}