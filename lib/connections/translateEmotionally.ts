// /lib/connections/translateEmotionally.ts

import { supabase } from "../../services/supabase";

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
     * 🌍 SKIP EMPTY
     * ---------------------------------------------------------
     */

    if (
      !text?.trim()
    ) {

      return text;
    }

    /*
     * ---------------------------------------------------------
     * 🌍 SKIP SAME LANGUAGE
     * ---------------------------------------------------------
     */

    if (
      sourceLanguage ===
      targetLanguage
    ) {

      return text;
    }

    /*
     * ---------------------------------------------------------
     * 🌐 TRANSLATE
     * ---------------------------------------------------------
     */

    const {
      data: result,
      error,
    } = await supabase

      .functions

      .invoke(
        "translate-emotionally",
        {
          body: {

            text,

            sourceLanguage,

            targetLanguage,

            emotionalContext,
          },
        }
      );

    /*
     * ---------------------------------------------------------
     * ❌ ERROR
     * ---------------------------------------------------------
     */

    if (error) {

      console.error(
        "❌ translateEmotionally ERROR",
        error
      );

      return text;
    }

    /*
     * ---------------------------------------------------------
     * ✅ RESULT
     * ---------------------------------------------------------
     */

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