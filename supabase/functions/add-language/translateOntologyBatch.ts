import OpenAI from "openai";

const openai =
  new OpenAI({

    apiKey:
      Deno.env.get(
        "OPENAI_API_KEY"
      )!,
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

  preserveFields?:
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

  daily_prompts: 20,

  guidance_orchestration_content: 5,

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

  preserveFields = [],

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
           * 🛡 PRESERVE FIELDS
           * --------------------------------------
           */

          for (
            const field of
            preserveFields
          ) {

            cleaned[field] =
              row[field];
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


        console.log(
    `🚀 ${table} | batch=${minimalRows.length}`
  );

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

        console.log(
  "OPENAI RESPONSE RECEIVED"
);

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

          console.log(
  "RAW RESPONSE:"
);

console.log(text);

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

} catch (err: any) {

  console.error(
    `❌ ${table} translation error:`
  );

  console.error(
    err?.message
  );

  console.error(
    JSON.stringify(
      err,
      null,
      2
    )
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