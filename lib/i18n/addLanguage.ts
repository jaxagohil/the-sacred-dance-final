// /lib/i18n/addLanguage.ts

import { supabase } from "../../services/supabase";

import {
  TABLE_CONFIGS,
} from "./tableConfigs";

import {
  translateOntologyBatch,
} from "./translateOntologyBatch";

// --------------------------------------------------
// 🧠 TYPES
// --------------------------------------------------

type AddLanguageParams = {

  language: string;
};

// --------------------------------------------------
// 🌍 ADD LANGUAGE
// --------------------------------------------------

export async function
addLanguage({

  language,

}: AddLanguageParams) {

  console.log(
    `🌍 Starting language generation: ${language}`
  );

  /*
   * ------------------------------------------------
   * 🌍 LANGUAGE PROFILE
   * ------------------------------------------------
   */

  const {
    data: languageProfile,

    error:
      languageError,
  } = await supabase

    .from("languages")

    .select("*")

    .eq("code", language)

    .single();

  if (
    languageError ||
    !languageProfile
  ) {

    console.error(
      "❌ Missing language profile",
      languageError
    );

    return;
  }

  /*
   * ------------------------------------------------
   * 🌍 LOOP TABLES
   * ------------------------------------------------
   */

  for (const config of TABLE_CONFIGS) {

    try {

      console.log(
        `\n🌍 Processing table: ${config.table}`
      );

      /*
       * --------------------------------------------
       * 🇬🇧 LOAD SOURCE ROWS
       * --------------------------------------------
       */

      const {
        data: sourceRows,

        error:
          sourceError,
      } = await supabase

        .from(config.table)

        .select("*")

        .eq(
          "language",

          config.sourceLanguage ||
            "en"
        );

      if (
        sourceError
      ) {

        console.error(

          `❌ Failed loading ${config.table}`,

          sourceError
        );

        continue;
      }

      if (
        !sourceRows?.length
      ) {

        console.log(

          `⚠️ No English rows for ${config.table}`
        );

        continue;
      }

      console.log(

        `✅ Loaded ${sourceRows.length} rows`
      );

      /*
       * --------------------------------------------
       * 🌍 TRANSLATE
       * --------------------------------------------
       */

      const translatedRows =

        await translateOntologyBatch({

          table:
            config.table,

          rows:
            sourceRows,

          targetLanguage:
            language,

          languageProfile,

          translatableFields:

            config.translatableFields,
        });

      /*
       * --------------------------------------------
       * 🧠 PREPARE INSERTS
       * --------------------------------------------
       */

      const inserts =

        translatedRows.map(

          (row: any) => {

            const cleaned =
              {
                ...row,
              };

            /*
             * --------------------------------------
             * 🧹 REMOVE IDS
             * --------------------------------------
             */

            delete cleaned.id;

            /*
             * --------------------------------------
             * 🌍 SET LANGUAGE
             * --------------------------------------
             */

            cleaned.language =
              language;

            /*
             * --------------------------------------
             * 🕒 CLEAN TIMESTAMPS
             * --------------------------------------
             */

            delete cleaned.created_at;

            delete cleaned.updated_at;

            return cleaned;
          }
        );

      /*
       * --------------------------------------------
       * 💾 UPSERT
       * --------------------------------------------
       */

      const {
        error:
          insertError,
      } = await supabase

        .from(config.table)

        .upsert(
          inserts,

          {
            onConflict:
              config.onConflict ||

              "language",
          }
        );

      if (
        insertError
      ) {

        console.error(

          `❌ Insert failed: ${config.table}`,

          insertError
        );

        continue;
      }

      console.log(

        `✅ ${config.table} complete`
      );

    } catch (err) {

      console.error(

        `❌ Table crash: ${config.table}`,

        err
      );
    }
  }

  /*
   * ------------------------------------------------
   * ✅ DONE
   * ------------------------------------------------
   */

  console.log(

    `\n✅ Finished generating ${language}`
  );
}