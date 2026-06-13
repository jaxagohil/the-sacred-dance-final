import { supabase } from "../../services/supabase";

import { buildPrompt } from "./buildPrompt";

import {
  AIInput,
} from "./types/aiTypes";

/*
 * ---------------------------------------------------------
 * 🚀 GENERATE AI RESPONSE
 * ---------------------------------------------------------
 */

export async function generateAIResponse({

  type,

  context,

  data,

}: AIInput) {

  /*
   * -------------------------------------------------------
   * 🧠 BUILD PROMPT
   * -------------------------------------------------------
   */

const prompt =

  context?.directPrompt

  ||

  await buildPrompt({

    type,

    context,

    data,
  });

  try {

    /*
     * -----------------------------------------------------
     * 🌐 REQUEST
     * -----------------------------------------------------
     */

const {
  data: result,
  error,
} = await supabase
  .functions
  .invoke(
    "generate-ai-response",
    {
      body: {
        prompt,
        language:
          data?.language || "en",
      },
    }
  );


if (error) {

  console.error(
    "❌ AI ERROR:",
    error
  );

  console.error(
    "❌ AI ERROR DETAILS:",
    JSON.stringify(
      error,
      null,
      2
    )
  );

  throw error;
}

console.log(
  "📦 BACKEND RESULT:",
  result
);

    /*
     * -----------------------------------------------------
     * ✅ FINAL RESPONSE
     * -----------------------------------------------------
     */

    const finalResult =

      result?.text ||

      result?.response ||

      result?.message ||

      result;

/*
 * -----------------------------------------------------
 * 📝 STRING
 * -----------------------------------------------------
 */

if (
  typeof finalResult ===
  "string"
) {

  const cleaned =
    finalResult.trim();

  /*
   * ---------------------------------------------------
   * 🌌 TRY JSON PARSE
   * ---------------------------------------------------
   */

  if (
    cleaned.startsWith("{")
  ) {

    try {

      return JSON.parse(
        cleaned
      );

    } catch (e) {

      console.error(
        "❌ INNER JSON PARSE ERROR:",
        cleaned
      );
    }
  }

  /*
   * ---------------------------------------------------
   * 📝 NORMAL STRING
   * ---------------------------------------------------
   */

  return cleaned;
}

    /*
     * -----------------------------------------------------
     * 🌌 OBJECT
     * -----------------------------------------------------
     */

    if (
      typeof finalResult ===
      "object"
    ) {

      return finalResult;
    }

    /*
     * -----------------------------------------------------
     * ❌ FALLBACK
     * -----------------------------------------------------
     */

    return (

      data?.base ||

      "..."
    );

  } catch (err: any) {

    console.error(
      "❌ AI FETCH ERROR:",
      err?.message || err
    );

    /*
     * -----------------------------------------------------
     * ❌ FALLBACK
     * -----------------------------------------------------
     */

    return (

      data?.base ||

      "..."
    );
  }
}