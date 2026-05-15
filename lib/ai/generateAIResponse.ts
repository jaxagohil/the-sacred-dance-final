// /lib/ai/generateAIResponse.ts

import { API_URL } from "../config";

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

    buildPrompt({

      type,

      context,

      data,
    });

  console.log(
    "🧠 FINAL PROMPT:",
    prompt
  );

  try {

    /*
     * -----------------------------------------------------
     * ⏱ TIMEOUT
     * -----------------------------------------------------
     */

    const controller =
      new AbortController();

    const timeout =
      setTimeout(
        () =>
          controller.abort(),
        25000
      );

    /*
     * -----------------------------------------------------
     * 🌐 REQUEST
     * -----------------------------------------------------
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
                data?.language || "en",
            }),

          signal:
            controller.signal,
        }
      );

    clearTimeout(
      timeout
    );

    /*
     * -----------------------------------------------------
     * 📦 RAW RESPONSE
     * -----------------------------------------------------
     */

    const text =
      await response.text();

    let result: any =
      null;

    try {

      result =
        JSON.parse(text);

    } catch (e) {

      console.error(
        "❌ RAW AI RESPONSE:",
        text
      );

      return (

        data?.base ||

        "..."
      );
    }

    console.log(
      "📦 BACKEND RESULT:",
      result
    );

    /*
     * -----------------------------------------------------
     * ❌ API ERROR
     * -----------------------------------------------------
     */

    if (!response.ok) {

      console.error(
        "❌ AI ERROR:",
        result
      );

      return (

        data?.base ||

        "Something didn’t come through."
      );
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
     * ⏱ TIMEOUT
     * -----------------------------------------------------
     */

    if (
      err?.name ===
      "AbortError"
    ) {

      return (
        "Taking a little longer…"
      );
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
  }
}