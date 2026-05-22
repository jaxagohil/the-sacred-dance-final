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
   * 🧠 PROMPT
   * ------------------------------------------------
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

Each row must preserve:
- ids
- keys
- metadata
- numeric values

Translate ONLY these fields:
${JSON.stringify(
  translatableFields
)}

Rows:
${JSON.stringify(rows)}

`;

  /*
   * ------------------------------------------------
   * 🚀 OPENAI
   * ------------------------------------------------
   */

  try {

    const completion =

      await openai.chat.completions.create({

        model:
          "gpt-4.1-mini",

        temperature: 0.4,

        messages: [

          {
            role: "system",

            content:

              "You translate symbolic emotional ontology.",
          },

          {
            role: "user",

            content:
              prompt,
          },
        ],
      });

    /*
     * ------------------------------------------------
     * 🧠 RESPONSE
     * ------------------------------------------------
     */

let text =

  completion
    .choices?.[0]
    ?.message?.content ||

  "[]";

/*
 * ------------------------------------------------
 * 🧹 CLEAN JSON
 * ------------------------------------------------
 */

text = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

    try {

      return JSON.parse(text);

    } catch (err) {

      console.error(
        "❌ Translation parse error:",
        err
      );

      return rows;
    }

  } catch (err) {

    console.error(
      "❌ translateOntologyBatch:",
      err
    );

    return rows;
  }
}