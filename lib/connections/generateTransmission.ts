// /lib/connections/generateTransmission.ts

import {
  generateAIResponse,
} from "../ai/generateAIResponse";

type Params = {

  spaceType:
    | "love"
    | "compassion"
    | "unity"
    | "human"
    | "self";

  language?: string;

  languageContext?: any;

  dailyField?: any;
};

export async function
generateTransmission({

  spaceType,

  language = "en",

  languageContext = {},

  dailyField,

}: Params) {

  /*
   * ---------------------------------------------------------
   * 🌕 DAILY FIELD
   * ---------------------------------------------------------
   */

  const cosmic =
    dailyField?.cosmic;

  const symbolicThemes =
    dailyField?.symbolicThemes || [];

  const oracleCard =
    dailyField?.oracleCard;

  /*
   * ---------------------------------------------------------
   * ✨ AI
   * ---------------------------------------------------------
   */

  const transmission =
    await generateAIResponse({

      type:
        "transmission",

      data: {

        /*
         * ---------------------------------------------------
         * 🌍 LANGUAGE
         * ---------------------------------------------------
         */

        language,

        languageContext,

        /*
         * ---------------------------------------------------
         * 🌌 SPACE
         * ---------------------------------------------------
         */

        spaceType,

        /*
         * ---------------------------------------------------
         * 🌕 DAILY ENERGY
         * ---------------------------------------------------
         */

        phase:
          cosmic?.phase,

        moon:
          cosmic?.moon,

        sun:
          cosmic?.sun,

        oracleCard,

        symbolicThemes,

        /*
         * ---------------------------------------------------
         * ✨ FALLBACK
         * ---------------------------------------------------
         */

        base:
          "Something softer is moving today.",
      },
    });

  /*
   * ---------------------------------------------------------
   * 🪵 DEBUG
   * ---------------------------------------------------------
   */

  console.log(
    "✨ TRANSMISSION:",
    transmission
  );

  /*
   * ---------------------------------------------------------
   * ✨ NORMALIZE
   * ---------------------------------------------------------
   */

  const finalText =

    typeof transmission ===
    "string"

      ? transmission

      : transmission?.text ||

        transmission?.response ||

        transmission?.message ||

        "";

  /*
   * ---------------------------------------------------------
   * ✨ FALLBACK
   * ---------------------------------------------------------
   */

  if (!finalText) {

    return {

      transmission:
        "Something softer is moving today.",
    };
  }

  /*
   * ---------------------------------------------------------
   * ✨ RETURN
   * ---------------------------------------------------------
   */

  return {

    transmission:
      finalText

        .replace(/\n/g, " ")

        .replace(/"/g, "")

        .trim(),
  };
}