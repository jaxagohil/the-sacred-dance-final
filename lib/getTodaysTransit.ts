// services/getTodaysTransit.ts

import { supabase } from "../services/supabase";

// --------------------------------------------------
// 🌌 GET TODAY'S COSMIC TRANSIT
// --------------------------------------------------

export async function
getTodaysTransit() {

  try {

    // --------------------------------------------------
    // 📅 TODAY
    // --------------------------------------------------

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    // --------------------------------------------------
    // 🌌 FETCH
    // --------------------------------------------------

    const { data, error } =

      await supabase

        .from(
          "cosmic_transits"
        )

        .select("*")

        .eq(
          "transit_date",
          today
        )

        .maybeSingle();

    // --------------------------------------------------
    // ❌ ERROR
    // --------------------------------------------------

    if (error) {

      console.error(
        "❌ cosmic transit error:",
        error
      );

      return null;
    }

    // --------------------------------------------------
    // ✅ DONE
    // --------------------------------------------------

    console.log(
      "🌌 cosmic transit:",
      data
    );

    return data || null;

  } catch (e) {

    console.error(
      "❌ getTodaysTransit failed:",
      e
    );

    return null;
  }
}