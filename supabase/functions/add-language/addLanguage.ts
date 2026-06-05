import { supabase } from "./supabase.ts";

import {
  TABLE_CONFIGS,
} from "./tableConfigs.ts";

import {
  translateOntologyBatch,
} from "./translateOntologyBatch.ts";

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

const sourceTable =

  (config as any).sourceTable ||

  config.table;

sourceQuery = supabase

  .from(sourceTable)

  .select("*")

  .eq(
    "language",

    config.sourceLanguage ||
      "en"
  );
  /*
   * --------------------------------------------
   * 🌌 GUIDANCE CONTENT ONLY
   * --------------------------------------------
   */

  if (

    config.table ===
    "guidance_orchestration_content"

  ) {

    sourceQuery =

      sourceQuery.not(
        "text",
        "is",
        null
      );
  }
}

      const {

        data: sourceRows,

        error:
          sourceError,

      } = await sourceQuery;

      console.log(
  "🌌 guidance rows:",
  sourceRows?.length
);

console.log(
  "🌌 first row:",
  sourceRows?.[0]
);

console.log(
  "🌌 query language:",
  config.sourceLanguage
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
 * LOAD EXISTING LANGUAGE ROWS
 * --------------------------------------------
 */

const {
  data: existingRows,
} = await supabase

  .from(config.table)

  .select("*")

  .eq(
    "language",
    language
  );

let rowsForTranslation =
  sourceRows;

/*
 * --------------------------------------------
 * RESUME MODE
 * --------------------------------------------
 */

if (
  existingRows?.length
) {

  /*
   * 🎴 ORACLE CARDS
   */

  if (
    config.table ===
    "oracle_card_translations"
  ) {

    const existingCards =
      new Set(

        existingRows.map(
          row =>
            row.card_number
        )
      );

    rowsForTranslation =
      sourceRows.filter(
        row =>

          !existingCards.has(
            row.card_number
          )
      );
  }

  /*
   * 🌈 PATTERN CHAKRA
   */

  else if (

    config.table ===
    "pattern_chakra_manifestations"

  ) {

    const existingKeys =
      new Set(

        existingRows.map(
          row =>
            `${row.pattern_key}|${row.chakra_key}`
        )
      );

    rowsForTranslation =
      sourceRows.filter(
        row =>

          !existingKeys.has(
            `${row.pattern_key}|${row.chakra_key}`
          )
      );
  }

/*
 * 🧠 EVERYTHING ELSE
 */

else {

  console.log(
    `⚠️ Resume not supported for ${config.table}`
  );

  rowsForTranslation =
    sourceRows;
}
}

console.log(
  `📚 Need to translate ${rowsForTranslation.length} rows`
);

if (
  rowsForTranslation.length === 0
) {

  console.log(
    `✅ ${config.table} already complete`
  );

  continue;
}

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
  rowsForTranslation,

  targetLanguage:
    language,

  languageProfile,

  translatableFields:

    config.translatableFields,

  preserveFields:

    config.preserveFields,
});

      /*
       * --------------------------------------------
       * 🛡 EMPTY PROTECTION
       * --------------------------------------------
       */

      if (
        !translatedRows?.length
      ) {

        console.error(

          `❌ No translated rows returned for ${config.table}`
        );

        continue;
      }

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
             * 🧹 REMOVE DB IDS
             * --------------------------------------
             */

            const preserveIdTables = [

              "emotions",

              "chakras",
            ];

            if (

              !preserveIdTables.includes(
                config.table
              )

            ) {

              delete cleaned.id;
            }

            /*
             * --------------------------------------
             * 🧹 ALWAYS REMOVE ROW IDS
             * --------------------------------------
             */

            delete cleaned.row_id;

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

console.log(
  `💾 Inserting ${uniqueInserts.length} rows into ${config.table}`
);

      /*
       * --------------------------------------------
       * 💾 UPSERT
       * --------------------------------------------
       */

const result = await supabase
  .from(config.table)
  .upsert(
    uniqueInserts,
    {
      onConflict:
        config.onConflict ||
        "language",
    }
  );

console.log(
  "UPSERT RAW RESULT"
);

console.log(result);

if (!result) {

  console.error(
    "UPSERT RETURNED UNDEFINED"
  );

  continue;
}

const {
  error: insertError,
} = result;

if (
  insertError
) {

  console.error(
    `❌ Insert failed: ${config.table}`
  );

  console.error(
    JSON.stringify(
      insertError,
      null,
      2
    )
  );
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