// /lib/cosmic/getDailyCosmicMessage.ts

import { supabase } from "../../services/supabase";

import {
  getCosmicMessage,
} from "./getCosmicMessage";

/*
 * ---------------------------------------------------------
 * 🔒 GENERATION LOCK
 * ---------------------------------------------------------
 */

let generatingPromise:
  Promise<any> | null = null;

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

/*
 * -------------------------------------------------------
 * 🔒 PREVENT DUPLICATE GENERATION
 * -------------------------------------------------------
 */

if (generatingPromise) {

  console.log(
    "🌌 Waiting for existing cosmic generation"
  );

  return generatingPromise;
}

console.log(
  "🌙 Generating cosmic message:",
  currentLanguage
);

/*
 * -------------------------------------------------------
 * 🌙 GENERATE
 * -------------------------------------------------------
 */

generatingPromise =
  getCosmicMessage({

    dailyField,

    language:
      currentLanguage,

    languageContext,
  });

const cosmicMessage =
  await generatingPromise;

/*
 * -------------------------------------------------------
 * 🔓 CLEAR LOCK
 * -------------------------------------------------------
 */

generatingPromise = null;

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