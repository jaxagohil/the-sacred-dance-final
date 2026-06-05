import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase =
  createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get(
      "SUPABASE_SERVICE_ROLE_KEY"
    )!
  );

type Params = {

  language: string;
};

export async function
addPatternChakraLanguage({

  language,

}: Params) {

  console.log(
    `🚀 Starting pattern_chakra_manifestations translation: ${language}`
  );

  /*
   * ----------------------------------------
   * LOAD LANGUAGE PROFILE
   * ----------------------------------------
   */

  const {
    data: languageProfile,
    error: languageError,
  } = await supabase

    .from("languages")

    .select("*")

    .eq(
      "code",
      language
    )

    .single();

  if (
    languageError ||
    !languageProfile
  ) {

    throw languageError;
  }

  /*
   * ----------------------------------------
   * LOAD EXISTING TRANSLATIONS
   * ----------------------------------------
   */

  const {
    data: existingRows,
  } = await supabase

    .from(
      "pattern_chakra_manifestations"
    )

    .select(
      "pattern_key, chakra_key"
    )

    .eq(
      "language",
      language
    );

  const existingKeys =
    new Set(

      existingRows?.map(
        row =>
          `${row.pattern_key}_${row.chakra_key}`
      ) || []
    );

  /*
   * ----------------------------------------
   * LOAD ENGLISH ROWS
   * ----------------------------------------
   */

  const {
    data: allRows,
    error: rowsError,
  } = await supabase

    .from(
      "pattern_chakra_manifestations"
    )

    .select("*")

    .eq(
      "language",
      "en"
    );

  if (
    rowsError
  ) {

    throw rowsError;
  }

  const rows =
    allRows.filter(
      row =>

        !existingKeys.has(
          `${row.pattern_key}_${row.chakra_key}`
        )
    );

  console.log(
    `📚 Need to translate ${rows.length} manifestations`
  );

  if (
    !rows.length
  ) {

    console.log(
      "✅ Nothing to translate"
    );

    return;
  }

  /*
   * ----------------------------------------
   * PROCESS ROWS
   * ----------------------------------------
   */

  for (
    let index = 0;
    index < rows.length;
    index++
  ) {

    const row =
      rows[index];

    try {

      console.log(
        `🧠 ${index + 1}/${rows.length}: ${row.pattern_key} / ${row.chakra_key}`
      );

      const prompt = `

You are translating emotional and spiritual ontology.

Translate into:

${language}

Emotional Style:
${languageProfile.emotional_style || "warm"}

Sentence Rhythm:
${languageProfile.sentence_rhythm || "gentle"}

Warmth Style:
${languageProfile.warmth_style || "soft"}

Symbolism Density:
${languageProfile.symbolism_density || "medium"}

Mystical Tolerance:
${languageProfile.mystical_tolerance || "medium"}

Directness:
${languageProfile.directness || "balanced"}

Return ONLY valid JSON.

{
  "wound_expression": "",
  "body_response": "",
  "nervous_system_expression": "",
  "relational_expression": "",
  "manifestation": "",
  "masculine_manifestation": "",
  "feminine_manifestation": "",
  "integrated_expression": "",
  "embodiment": "",
  "integration_path": "",
  "affirmation": "",
  "mirror_observation": "",
  "mirror_realisation": "",
  "reflective_prompt": ""
}

DATA:

${JSON.stringify({

        wound_expression:
          row.wound_expression,

        body_response:
          row.body_response,

        nervous_system_expression:
          row.nervous_system_expression,

        relational_expression:
          row.relational_expression,

        manifestation:
          row.manifestation,

        masculine_manifestation:
          row.masculine_manifestation,

        feminine_manifestation:
          row.feminine_manifestation,

        integrated_expression:
          row.integrated_expression,

        embodiment:
          row.embodiment,

        integration_path:
          row.integration_path,

        affirmation:
          row.affirmation,

        mirror_observation:
          row.mirror_observation,

        mirror_realisation:
          row.mirror_realisation,

        reflective_prompt:
          row.reflective_prompt,
      })}

`;

      const response =
        await fetch(
          "https://api.openai.com/v1/chat/completions",
          {

            method:
              "POST",

            headers: {

              Authorization:
                `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,

              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({

                model:
                  "gpt-4.1-mini",

                temperature:
                  0.3,

                response_format: {
                  type:
                    "json_object",
                },

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
              }),
          }
        );

      if (
        !response.ok
      ) {

        const errorText =
          await response.text();

        console.error(
          "❌ OPENAI ERROR"
        );

        console.error(
          errorText
        );

        continue;
      }

      const json =
        await response.json();

      const content =
        json?.choices?.[0]
          ?.message
          ?.content;

      if (
        !content
      ) {

        throw new Error(
          `No OpenAI response`
        );
      }

      const translated =
        JSON.parse(
          content
        );

      const rowToInsert = {

        ...row,

        ...translated,

        language,
      };

      delete rowToInsert.id;

      delete rowToInsert.created_at;

      delete rowToInsert.updated_at;

      const {
        error: upsertError,
      } = await supabase

        .from(
          "pattern_chakra_manifestations"
        )

        .upsert(
          [rowToInsert],
          {

            onConflict:
              "pattern_key,chakra_key,language",
          }
        );

      if (
        upsertError
      ) {

        console.error(
          `❌ UPSERT FAILED ${row.pattern_key}/${row.chakra_key}`
        );

        console.error(
          upsertError
        );

        continue;
      }

      console.log(
        `✅ Saved ${row.pattern_key}/${row.chakra_key}`
      );

    } catch (error) {

      console.error(
        `❌ FAILED ${row.pattern_key}/${row.chakra_key}`
      );

      console.error(
        error
      );

      continue;
    }
  }

  console.log(
    "✅ pattern_chakra_manifestations complete"
  );
}