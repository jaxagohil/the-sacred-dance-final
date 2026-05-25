// /lib/cosmic/getDailyField.ts

import { supabase } from "../../services/supabase";

import {
  buildDailyField,
} from "./buildDailyField";

/*
 * ---------------------------------------------------------
 * 🌌 GET DAILY FIELD
 * ---------------------------------------------------------
 */

export async function getDailyField(
  userId: string
) {

  /*
   * -------------------------------------------------------
   * 🌍 PROFILE
   * -------------------------------------------------------
   */

  const {
    data: profile,
  } = await supabase

    .from("profiles")

    .select("timezone")

    .eq(
      "user_id",
      userId
    )

    .maybeSingle();

  const timezone =
    profile?.timezone ||
    "Asia/Kolkata";

  /*
   * -------------------------------------------------------
   * 📅 TODAY
   * -------------------------------------------------------
   */

  const today =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          timezone,
      }
    ).format(
      new Date()
    );

  /*
   * -------------------------------------------------------
   * 🔍 CHECK EXISTING
   * -------------------------------------------------------
   */

  const {
    data: existing,
    error,
  } = await supabase

    .from("daily_reads")

    .select("*")

    .eq("date", today)

    .maybeSingle();

  /*
   * -------------------------------------------------------
   * ✅ EXISTING FIELD
   * -------------------------------------------------------
   */

  if (
    existing &&
    !error
  ) {

    console.log(
      "🌌 Using existing daily field"
    );

    return existing.field;
  }

  /*
   * -------------------------------------------------------
   * 🌙 BUILD NEW FIELD
   * -------------------------------------------------------
   */

  console.log(
    "🌙 Building new daily field"
  );

  const field =
    await buildDailyField();

  /*
   * -------------------------------------------------------
   * 💾 SAVE
   * -------------------------------------------------------
   */

  const payload = {

    date: today,

    /*
     * ---------------------------------------------------
     * 🃏 ORACLE
     * ---------------------------------------------------
     */

    card:
      field?.oracleCard || null,

    /*
     * ---------------------------------------------------
     * 🌌 COSMIC
     * ---------------------------------------------------
     */

    cosmic:
      field?.cosmic || null,

    /*
     * ---------------------------------------------------
     * ⚡ FULL FIELD
     * ---------------------------------------------------
     */

    field,

    /*
     * ---------------------------------------------------
     * 🕊 CREATED FOR
     * ---------------------------------------------------
     */

    created_for:
      "global",
  };

  const {
    error: insertError,
  } = await supabase

    .from("daily_reads")

    .insert(payload);

  if (insertError) {

    console.error(
      "❌ DAILY FIELD INSERT ERROR:",
      insertError
    );
  }

  /*
   * -------------------------------------------------------
   * 🌌 RETURN
   * -------------------------------------------------------
   */

  return field;
}