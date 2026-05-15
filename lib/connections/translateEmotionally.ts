// /lib/connections/translateEmotionally.ts

import { API_URL } from "../config";

type TranslateEmotionallyParams = {

  text: string;

  sourceLanguage?: string;

  targetLanguage?: string;

  emotionalContext?: string;
};

export async function translateEmotionally({

  text,

  sourceLanguage = "auto",

  targetLanguage = "en",

  emotionalContext = "",

}: TranslateEmotionallyParams) {

  try {

    /*
     * ---------------------------------------------------------
     * 🌍 SKIP SAME LANGUAGE
     * ---------------------------------------------------------
     */

    if (
      !text?.trim()
    ) {

      return text;
    }

    if (
      sourceLanguage ===
      targetLanguage
    ) {

      return text;
    }

    /*
     * ---------------------------------------------------------
     * 🧠 PROMPT
     * ---------------------------------------------------------
     */

    const prompt = `

You are translating
a Sacred Dance connection message.

Translate naturally into ${targetLanguage}.

Preserve:
- emotional tone
- softness
- subtle symbolism
- conversational cadence
- nervous-system pacing
- relational warmth

Do not translate literally.

The message should feel
as if originally written
by a native speaker.

Keep the emotional frequency intact.

${emotionalContext
  ? `
Emotional Context:
${emotionalContext}
`
  : ""}

Message:
"${text}"

Return ONLY the translation.

`;

    /*
     * ---------------------------------------------------------
     * 🌐 REQUEST
     * ---------------------------------------------------------
     */

    const response =
      await fetch(

        `${API_URL}/api/ai`,

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({

              prompt,

              language:
                targetLanguage,
            }),
        }
      );

    /*
     * ---------------------------------------------------------
     * 📦 RESULT
     * ---------------------------------------------------------
     */

    const result =
      await response.json();

    return (

      result?.text ||

      result?.response ||

      text
    );

  } catch (error) {

    console.log(
      "❌ translateEmotionally ERROR",
      error
    );

    return text;
  }
}