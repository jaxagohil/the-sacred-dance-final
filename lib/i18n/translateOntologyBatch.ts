// /lib/i18n/translateOntologyBatch.ts

import OpenAI from "openai";

import {
  OPENAI_API_KEY,
} from "../config";

const openai =
  new OpenAI({

    apiKey:
      OPENAI_API_KEY,
  });

type TranslateParams = {

  table: string;

  rows: any[];

  targetLanguage: string;

  languageProfile?: {

    emotional_style?: string;

    sentence_rhythm?: string;

    warmth_style?: string;

    symbolism_density?: string;

    mystical_tolerance?: string;

    directness?: string;
  };

  translatableFields:
    string[];
};

/*
 * ------------------------------------------------
 * 🧠 BATCH SIZES
 * ------------------------------------------------
 */

const TABLE_BATCH_SIZES:
  Record<string, number> = {

  emotions: 20,

  emotion_synonyms: 50,

  behaviour_synonyms: 50,

  chakras: 20,

  pattern_chakra_manifestations: 5,

  oracle_card_translations: 5,

  daily_prompts: 20,

  ui_translations: 50,
};

/*
 * ------------------------------------------------
 * 🌍 TRANSLATE ONTOLOGY
 * ------------------------------------------------
 */

export async function
translateOntologyBatch({

  table,

  rows,

  targetLanguage,

  languageProfile,

  translatableFields,

}: TranslateParams) {

  /*
   * ------------------------------------------------
   * 🌍 NOTHING TO DO
   * ------------------------------------------------
   */

  if (
    !rows?.length ||

    targetLanguage === "en"
  ) {

    return rows;
  }

  /*
   * ------------------------------------------------
   * 🌍 LANGUAGE STYLE
   * ------------------------------------------------
   */

  const styleContext = `

Emotional Style:
${languageProfile?.emotional_style || "warm"}

Sentence Rhythm:
${languageProfile?.sentence_rhythm || "gentle"}

Warmth Style:
${languageProfile?.warmth_style || "soft"}

Symbolism Density:
${languageProfile?.symbolism_density || "medium"}

Mystical Tolerance:
${languageProfile?.mystical_tolerance || "medium"}

Directness:
${languageProfile?.directness || "balanced"}

`;

  /*
   * ------------------------------------------------
   * 🧠 BATCHING
   * ------------------------------------------------
   */

  const batchSize =

    TABLE_BATCH_SIZES[
      table
    ] || 20;

  const batches = [];

  for (
    let i = 0;

    i < rows.length;

    i += batchSize
  ) {

    batches.push(

      rows.slice(
        i,
        i + batchSize
      )
    );
  }

  console.log(

    `🌍 ${table}: ${rows.length} rows in ${batches.length} batches`
  );

  /*
   * ------------------------------------------------
   * 🌍 RESULTS
   * ------------------------------------------------
   */

  const allResults: any[] =
    [];

  /*
   * ------------------------------------------------
   * 🌍 LOOP BATCHES
   * ------------------------------------------------
   */

  for (
    const batch of batches
  ) {

    /*
     * --------------------------------------------
     * 🧹 MINIMAL ROWS
     * --------------------------------------------
     */

    const minimalRows =

      batch.map(
        (row: any) => {

          const cleaned:
            any = {};

          /*
           * --------------------------------------
           * 🆔 PRESERVE IDS
           * --------------------------------------
           */

          if (
            row.id !==
            undefined
          ) {

            cleaned.id =
              row.id;
          }

          if (
            row.row_id !==
            undefined
          ) {

            cleaned.row_id =
              row.row_id;
          }

          if (
            row.card_number !==
            undefined
          ) {

            cleaned.card_number =
              row.card_number;
          }

          if (
            row.pattern_key !==
            undefined
          ) {

            cleaned.pattern_key =
              row.pattern_key;
          }

          if (
            row.chakra_key !==
            undefined
          ) {

            cleaned.chakra_key =
              row.chakra_key;
          }

          if (
            row.emotion_id !==
            undefined
          ) {

            cleaned.emotion_id =
              row.emotion_id;
          }

          if (
            row.behaviour_id !==
            undefined
          ) {

            cleaned.behaviour_id =
              row.behaviour_id;
          }

          if (
            row.key !==
            undefined
          ) {

            cleaned.key =
              row.key;
          }

          if (
            row.screen !==
            undefined
          ) {

            cleaned.screen =
              row.screen;
          }

          /*
           * --------------------------------------
           * 🌍 TRANSLATABLE FIELDS
           * --------------------------------------
           */

          for (
            const field of
            translatableFields
          ) {

            cleaned[field] =
              row[field];
          }

          return cleaned;
        }
      );

    /*
     * --------------------------------------------
     * 🧠 PROMPT
     * --------------------------------------------
     */

    const prompt = `

You are translating symbolic emotional ontology
for a contemplative spiritual reflection app.

This is NOT literal translation.

The goal is:
- emotional equivalence
- nervous-system resonance
- contemplative tone
- symbolic coherence
- soft human cadence

Do NOT sound robotic.
Do NOT over-explain.
Do NOT westernize.

Preserve:
- emotional subtlety
- relational sensitivity
- poetic softness

Language:
${targetLanguage}

Language Style:
${styleContext}

Return ONLY valid JSON array.

IMPORTANT:
- Return EXACTLY ${minimalRows.length} rows
- Preserve ids and metadata exactly
- Do NOT remove fields
- Do NOT add commentary
- Do NOT wrap in markdown
- Maintain field names exactly

Translate ONLY these fields:
${JSON.stringify(
  translatableFields
)}

Rows:
${JSON.stringify(
  minimalRows
)}

`;

    /*
     * --------------------------------------------
     * 🚀 OPENAI
     * --------------------------------------------
     */

    try {

      const completion =

        await openai.chat.completions.create({

          model:
            "gpt-4.1-mini",

          temperature:
            0.4,

          messages: [

            {
              role:
                "system",

              content:

                "You translate symbolic emotional ontology.",
            },

            {
              role:
                "user",

              content:
                prompt,
            },
          ],
        });

      /*
       * ------------------------------------------
       * 🧠 RESPONSE
       * ------------------------------------------
       */

      let text =

        completion
          .choices?.[0]
          ?.message
          ?.content ||

        "[]";

      /*
       * ------------------------------------------
       * 🧹 CLEAN JSON
       * ------------------------------------------
       */

      text = text

        .replace(
          /```json/g,
          ""
        )

        .replace(
          /```/g,
          ""
        )

        .trim();

      /*
       * ------------------------------------------
       * 🧠 PARSE
       * ------------------------------------------
       */

      try {

        const parsed =
          JSON.parse(text);

        /*
         * --------------------------------------
         * 🛡 VALIDATE ARRAY
         * --------------------------------------
         */

        if (

          !Array.isArray(
            parsed
          )

        ) {

          console.error(

            `❌ ${table} returned non-array`
          );

          continue;
        }

        /*
         * --------------------------------------
         * 🛡 VALIDATE COUNT
         * --------------------------------------
         */

        if (

          parsed.length !==
          minimalRows.length

        ) {

          console.error(

            `❌ ${table} row mismatch:
expected ${minimalRows.length}
received ${parsed.length}`
          );

          continue;
        }

        console.log(

          `✅ ${table} batch translated:
${parsed.length} rows`
        );

        allResults.push(
          ...parsed
        );

      } catch (err) {

        console.error(

          `❌ ${table} parse error:`,

          err
        );

        continue;
      }

    } catch (err) {

      console.error(

        `❌ ${table} translation error:`,

        err
      );

      continue;
    }
  }

  /*
   * ------------------------------------------------
   * 🛡 FINAL VALIDATION
   * ------------------------------------------------
   */

  if (

    allResults.length !==
    rows.length

  ) {

    console.error(

      `❌ FINAL ROW MISMATCH:
expected ${rows.length}
received ${allResults.length}`
    );

    return [];
  }

  /*
   * ------------------------------------------------
   * ✅ DONE
   * ------------------------------------------------
   */

  return allResults;
}