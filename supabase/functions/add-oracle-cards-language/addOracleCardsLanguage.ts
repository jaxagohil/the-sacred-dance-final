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
addOracleCardsLanguage({

  language,

}: Params) {

  console.log(
    `🚀 Starting oracle cards translation: ${language}`
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
      "oracle_card_translations"
    )

    .select(
      "card_number"
    )

    .eq(
      "language",
      language
    );

  const existingCards =
    new Set(

      existingRows?.map(
        row =>
          row.card_number
      ) || []
    );

  /*
   * ----------------------------------------
   * LOAD SOURCE ORACLE CARDS
   * ----------------------------------------
   */

  const {
    data: allRows,
    error: rowsError,
  } = await supabase

    .from(
      "oracle_cards"
    )

    .select("*");

  if (
    rowsError
  ) {

    throw rowsError;
  }

  if (
    !allRows?.length
  ) {

    console.log(
      "⚠️ No oracle cards found"
    );

    return;
  }

  /*
   * ----------------------------------------
   * ONLY TRANSLATE MISSING CARDS
   * ----------------------------------------
   */

  const rows =
    allRows.filter(
      row =>

        !existingCards.has(
          row.card_number
        )
    );

  console.log(
    `📚 Need to translate ${rows.length} oracle cards`
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
        `🎴 ${index + 1}/${rows.length}: Card ${row.card_number}`
      );

      const prompt = `

You are translating a spiritual oracle deck.

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
  "title": "",
  "affirmation": ""
}

DATA:

${JSON.stringify({

        title:
          row.title,

        affirmation:
          row.affirmation,
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
                      "You translate spiritual oracle cards.",
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

        console.error(
          await response.text()
        );

        continue;
      }

      const json =
        await response.json();

      const translated =
        JSON.parse(

          json.choices[0]
            .message.content
        );

      const rowToInsert = {

        card_number:
          row.card_number,

        title:
          translated.title,

        affirmation:
          translated.affirmation,

        language,
      };

      const {
        error: upsertError,
      } = await supabase

        .from(
          "oracle_card_translations"
        )

        .upsert(
          [rowToInsert],
          {

            onConflict:
              "card_number,language",
          }
        );

      if (
        upsertError
      ) {

        console.error(
          upsertError
        );

        continue;
      }

      console.log(
        `✅ Saved Card ${row.card_number}`
      );

    } catch (error) {

      console.error(
        error
      );

      continue;
    }
  }

  console.log(
    "✅ oracle cards complete"
  );
}