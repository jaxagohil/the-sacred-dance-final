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
   * 🛡 ENGLISH PROTECTION
   * ------------------------------------------------
   */

  if (
    language === "en"
  ) {

    console.log(
      "⚠️ English is canonical source language"
    );

    return;
  }

  /*
   * ------------------------------------------------
   * 🧹 CLEAR EXISTING LANGUAGE
   * ------------------------------------------------
   */

  console.log(
    `🧹 Clearing existing ${language} rows`
  );

  for (const config of TABLE_CONFIGS) {

    try {

      const {
        error,
      } = await supabase

        .from(config.table)

        .delete()

        .eq(
          "language",
          language
        );

      if (error) {

        console.error(
          `❌ Failed clearing ${config.table}`,
          error
        );
      }

      else {

        console.log(
          `🧹 Cleared ${config.table}`
        );
      }

    } catch (err) {

      console.error(
        `❌ Cleanup crash: ${config.table}`,
        err
      );
    }
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

      let sourceQuery;

      /*
       * --------------------------------------------
       * 🎴 ORACLE SOURCE
       * --------------------------------------------
       */

      if (

        config.table ===
        "oracle_card_translations"

      ) {

        sourceQuery = supabase

          .from("oracle_cards")

          .select("*");
      }

      /*
       * --------------------------------------------
       * 🌍 STANDARD SOURCE
       * --------------------------------------------
       */

      else {

        sourceQuery = supabase

          .from(config.table)

          .select("*")

          .eq(
            "language",

            config.sourceLanguage ||
              "en"
          );
      }

      const {

        data: sourceRows,

        error:
          sourceError,

      } = await sourceQuery;

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
             * 🎴 ORACLE CLEANUP
             * --------------------------------------
             */

            if (

              config.table ===
              "oracle_card_translations"

            ) {

              Object.keys(cleaned)
                .forEach((key) => {

                  if (

                    ![
                      "card_number",

                      "title",

                      "affirmation",

                      "language",
                    ].includes(key)

                  ) {

                    delete cleaned[key];
                  }
                });
            }

            /*
             * --------------------------------------
             * 🧹 REMOVE IDS
             * --------------------------------------
             */

if (

  config.table !==
  "emotions"

  &&

  config.table !==
  "chakras"

) {

  delete cleaned.id;
}

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
 * 🧹 REMOVE DUPLICATES
 * --------------------------------------------
 */

const uniqueInserts =
  Array.from(

    new Map(

      inserts.map(
        (item) => [

          JSON.stringify(item),

          item,
        ]
      )

    ).values()
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
    uniqueInserts,

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