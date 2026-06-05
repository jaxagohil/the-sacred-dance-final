// /lib/i18n/getLanguageContext.ts

import { supabase } from "../../services/supabase";

/*
 * ---------------------------------------------------------
 * 🌍 GET LANGUAGE CONTEXT
 * ---------------------------------------------------------
 */

export async function getLanguageContext(
  code: string = "en"
) {

  /*
   * -------------------------------------------------------
   * 🌍 LOAD LANGUAGE
   * -------------------------------------------------------
   */

  console.log(
  "🌍 LANGUAGE LOOKUP:",
  code
);

  const {
    data,
    error,
  } = await supabase

    .from("languages")

    .select("*")

    .eq("code", code)

    .single();

  /*
   * -------------------------------------------------------
   * ❌ ERROR
   * -------------------------------------------------------
   */

  if (
    error ||

    !data
  ) {

    console.error(
      "❌ LANGUAGE CONTEXT ERROR:",
      error
    );

    /*
     * -----------------------------------------------------
     * 🌍 FALLBACK
     * -----------------------------------------------------
     */

    return {

      code: "en",

      name: "English",

      native_name:
        "English",

      emotional_style: [
        "clear",
        "reflective",
        "emotionally grounded",
      ],

      directness:
        "medium",

      symbolism_density:
        "medium",

      nervous_system_tone:
        "balanced",

      sentence_rhythm:
        "natural",

      mystical_tolerance:
        "medium",

      warmth_style:
        "gentle",
    };
  }

  /*
   * -------------------------------------------------------
   * ✅ RETURN
   * -------------------------------------------------------
   */

  return data;
}