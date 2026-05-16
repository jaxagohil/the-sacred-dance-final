// /lib/i18n/getLanguageName.ts

import { supabase } from "../../services/supabase";

export async function
getLanguageName(
  code?: string
) {

  /*
   * --------------------------------------------------
   * 🛡 FALLBACK
   * --------------------------------------------------
   */

  if (!code) {
    return "English";
  }

  /*
   * --------------------------------------------------
   * 🌍 LOAD LANGUAGE
   * --------------------------------------------------
   */

  const {
    data,
    error,
  } = await supabase

    .from("languages")

    .select(`
      name
    `)

    .eq(
      "code",
      code
    )

    .maybeSingle();

  /*
   * --------------------------------------------------
   * ❌ ERROR
   * --------------------------------------------------
   */

  if (
    error ||
    !data?.name
  ) {

    console.log(
      "❌ LANGUAGE NAME ERROR:",
      code
    );

    return "English";
  }

  /*
   * --------------------------------------------------
   * ✅ RETURN
   * --------------------------------------------------
   */

  return data.name;
}