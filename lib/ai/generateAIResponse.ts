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

const directPrompt =
  context && "directPrompt" in context
    ? context.directPrompt
    : undefined;

const prompt =
  directPrompt ||
  await buildPrompt({
    type,
    context,
    data,
  });

console.log("AI REQUEST PROMPT:", {
  type,
  length: prompt.length,
  preview: prompt.slice(0, 500),
});

if (type === "glimmer") {
  const userContextStart = prompt.indexOf("USER CONTEXT");
  const creationContextStart = prompt.indexOf("CREATION CONTEXT");

  const userContextText =
    userContextStart !== -1
      ? prompt.slice(
          userContextStart,
          creationContextStart !== -1
            ? creationContextStart
            : undefined
        )
      : "";

  console.log(
    "GLIMMER POLARITY DATA:",
    userContextText.match(
      /.{0,150}(?:polarities|sacredFeminine|sacredMasculine|core_energy|shadow_expression|integrated_expression|nervous_system_pattern|healing_path).{0,500}/gi
    )
  );
}

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

  if (error.context) {

    try {

      const errorBody =
        await error.context.json();

      console.error(
        "❌ EDGE FUNCTION BODY:",
        JSON.stringify(
          errorBody,
          null,
          2
        )
      );

    } catch (bodyError) {

      console.error(
        "❌ COULD NOT READ EDGE ERROR BODY:",
        bodyError
      );
    }
  }

  throw error;
}

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

  if (type === "sovereign_i_engine") {
    throw err;
  }

  return data?.base || "...";
}
}