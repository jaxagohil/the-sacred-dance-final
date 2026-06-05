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
addBehavioursLanguage({

  language,

}: Params) {

  console.log(
    `🚀 Starting behaviours translation: ${language}`
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
   * LOAD ENGLISH BEHAVIOURS
   * ----------------------------------------
   */

  const {
    data: rows,
    error: rowsError,
  } = await supabase

    .from("behaviours")

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

  if (
    !rows?.length
  ) {

    console.log(
      "⚠️ No English behaviours found"
    );

    return;
  }

  /*
   * ----------------------------------------
   * LOAD EXISTING TRANSLATIONS
   * ----------------------------------------
   */

  const {
    data: existingRows,
    error: existingError,
  } = await supabase

    .from("behaviours")

    .select("id")

    .eq(
      "language",
      language
    );

  if (
    existingError
  ) {

    throw existingError;
  }

  const existingIds =
    new Set(
      existingRows.map(
        row => row.id
      )
    );

  const rowsToTranslate =
    rows.filter(
      row =>
        !existingIds.has(
          row.id
        )
    );

  console.log(
    `📚 Need to translate ${rowsToTranslate.length} behaviours`
  );

  if (
    rowsToTranslate.length === 0
  ) {

    console.log(
      "✅ Language already complete"
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
    index < rowsToTranslate.length;
    index++
  ) {

    const row =
      rowsToTranslate[index];

    try {

      console.log(
        `🧠 ${index + 1}/${rowsToTranslate.length}: ${row.name}`
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
  "name": "",
  "statement": "",
  "shadow_meaning": "",
  "integrated_meaning": "",
  "nervous_system_need": "",
  "mirror_question": "",
  "integration_step": "",
  "embodiment": ""
}

DATA:

${JSON.stringify({

        name:
          row.name,

        statement:
          row.statement,

        shadow_meaning:
          row.shadow_meaning,

        integrated_meaning:
          row.integrated_meaning,

        nervous_system_need:
          row.nervous_system_need,

        mirror_question:
          row.mirror_question,

        integration_step:
          row.integration_step,

        embodiment:
          row.embodiment,
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
          `No OpenAI response for ${row.name}`
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

      delete rowToInsert.row_id;

      delete rowToInsert.created_at;

      delete rowToInsert.updated_at;

      const {
        error:
          upsertError,
      } = await supabase

        .from(
          "behaviours"
        )

        .insert(
          [rowToInsert]
        );

      if (
        upsertError
      ) {

        console.error(
          `❌ INSERT FAILED ${row.name}`
        );

        console.error(
          upsertError
        );

        continue;
      }

      console.log(
        `✅ Saved ${row.name}`
      );

    } catch (error) {

      console.error(
        `❌ FAILED ${row.name}`
      );

      console.error(
        error
      );

      continue;
    }
  }

  console.log(
    "✅ behaviours complete"
  );
}