import {
  supabase,
} from "../../services/supabase";

import {
  getUserId,
} from "../user";

export async function
loadUserLanguage() {

  try {

    const userId =
      await getUserId();

    if (!userId) {

      return {

        language: "en",

        languageContext: {},
      };
    }

    const {
      data,
      error,
    } = await supabase

      .from("profiles")

      .select(`
        language,
        language_context
      `)

      .eq(
        "user_id",
        userId
      )

      .single();

    if (
      error ||
      !data
    ) {

      return {

        language: "en",

        languageContext: {},
      };
    }

    return {

      language:
        data.language || "en",

      languageContext:
        data.language_context || {},
    };

  } catch (error) {

    console.log(
      "❌ LOAD USER LANGUAGE ERROR",
      error
    );

    return {

      language: "en",

      languageContext: {},
    };
  }
}