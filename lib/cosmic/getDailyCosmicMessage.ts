// /lib/cosmic/getDailyCosmicMessage.ts

import { supabase } from "../../services/supabase";

import {
  getCosmicMessage,
} from "./getCosmicMessage";

/*
 * ---------------------------------------------------------
 * 🌌 GET DAILY COSMIC MESSAGE
 * ---------------------------------------------------------
 */

export async function getDailyCosmicMessage({

  dailyField,

  language,

  languageContext,

}: {

  dailyField: any;

  language?: string;

  languageContext?: any;

}) {

  /*
   * -------------------------------------------------------
   * 📅 TODAY
   * -------------------------------------------------------
   */

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  /*
   * -------------------------------------------------------
   * 🌍 LANGUAGE
   * -------------------------------------------------------
   */

  const currentLanguage =
    language || "en";

  /*
   * -------------------------------------------------------
   * 🔍 CHECK EXISTING
   * -------------------------------------------------------
   */

  const {
    data: existing,
    error,
  } = await supabase

    .from(
      "daily_cosmic_messages"
    )

    .select("*")

    .eq(
      "date",
      today
    )

    .eq(
      "language",
      currentLanguage
    )

    .maybeSingle();

  /*
   * -------------------------------------------------------
   * ✅ EXISTING
   * -------------------------------------------------------
   */

  if (
    existing?.cosmic_message &&
    !error
  ) {

    console.log(
      "🌌 Using cached cosmic message:",
      currentLanguage
    );

    return existing
      .cosmic_message;
  }

  /*
   * -------------------------------------------------------
   * 🌙 GENERATE NEW
   * -------------------------------------------------------
   */

  console.log(
    "🌙 Generating cosmic message:",
    currentLanguage
  );

  const cosmicMessage =
    await getCosmicMessage({

      dailyField,

      language:
        currentLanguage,

      languageContext,
    });

  /*
   * -------------------------------------------------------
   * 💾 SAVE
   * -------------------------------------------------------
   */

  const payload = {

    date: today,

    language:
      currentLanguage,

    cosmic_message:
      cosmicMessage,
  };

  const {
    error: insertError,
  } = await supabase

    .from(
      "daily_cosmic_messages"
    )

.upsert(
  payload,
  {
    onConflict:
      "date,language",
  }
);

  if (insertError) {

    console.error(
      "❌ DAILY COSMIC INSERT ERROR:",
      insertError
    );
  }

  /*
   * -------------------------------------------------------
   * 🌌 RETURN
   * -------------------------------------------------------
   */

  return cosmicMessage;
}