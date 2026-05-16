import { supabase } from "../../services/supabase";

import {
    TABLE_CONFIGS,
} from "./tableConfigs";

import {
    translateOntologyBatch,
} from "./translateOntologyBatch";

type AddLanguageParams = {

  language: string;
};

export async function
addLanguage({

  language,

}: AddLanguageParams) {

  /*
   * ------------------------------------------------
   * 🌍 LANGUAGE PROFILE
   * ------------------------------------------------
   */

  const {
    data: languageProfile,
  } = await supabase

    .from("languages")

    .select("*")

    .eq("code", language)

    .single();

  /*
   * ------------------------------------------------
   * 🪞 TABLE CONFIG
   * ------------------------------------------------
   */

  const config =
    TABLE_CONFIGS.find(

      (t) =>

        t.table ===
        "behaviour_lens_weights"
    );

  if (!config) {

    console.error(
      "❌ Missing table config"
    );

    return;
  }

  /*
   * ------------------------------------------------
   * 🇬🇧 LOAD ENGLISH ROWS
   * ------------------------------------------------
   */

  const {
    data: englishRows,
  } = await supabase

    .from(config.table)

    .select("*")

    .eq(
      "language",
      config.sourceLanguage
    );

  if (!englishRows?.length) {

    console.error(
      "❌ No English rows found"
    );

    return;
  }

  console.log(
    `🌍 Loaded ${englishRows.length} English rows`
  );

  /*
   * ------------------------------------------------
   * 🌍 TRANSLATE
   * ------------------------------------------------
   */

  const translatedRows =

    await translateOntologyBatch({

      table:
        config.table,

      rows:
        englishRows,

      targetLanguage:
        language,

      languageProfile,

      translatableFields:

        config.translatableFields,
    });

  /*
   * ------------------------------------------------
   * 🧠 PREPARE INSERTS
   * ------------------------------------------------
   */

  const inserts =

    translatedRows.map(

      (row: any) => ({

        ...row,

        id: undefined,

        language,
      })
    );

  /*
   * ------------------------------------------------
   * 💾 INSERT
   * ------------------------------------------------
   */

  const {
    error,
  } = await supabase

    .from(config.table)

    .insert(inserts);

  if (error) {

    console.error(
      "❌ Insert error:",
      error
    );

    return;
  }

  console.log(
    `✅ Added ${language} rows`
  );
}