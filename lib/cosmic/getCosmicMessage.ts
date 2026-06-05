import {
  generateAIResponse,
} from "../ai/generateAIResponse";

import {
  getCosmicInterpretation,
} from "./cosmicInterpretation";

export async function getCosmicMessage({

  dailyField,

  language,

  languageContext,

}: {

  dailyField: any;

  language?: string;

  languageContext?: any;

}) {

  /*
   * ---------------------------------------------------------
   * 🧠 INTERPRETATION
   * ---------------------------------------------------------
   */

  const interpretation =
    getCosmicInterpretation({

      dailyField,

    });

  /*
   * ---------------------------------------------------------
   * 🌙 COSMIC DATA
   * ---------------------------------------------------------
   */

  const cosmic =
    dailyField?.cosmic || {};

  /*
   * ---------------------------------------------------------
   * 🌌 ACTIVE FIELDS
   * ---------------------------------------------------------
   */

  const activeFields =

    dailyField?.fields?.map(
      (f: any) => f.title
    ) || [];

  const collectiveThemes =

    dailyField?.fields?.map(
      (f: any) =>
        f.collective_theme
    ) || [];

  const energeticThemes =

    dailyField?.fields?.map(
      (f: any) =>
        f.energetic_theme
    ) || [];

  /*
   * ---------------------------------------------------------
   * 🤖 AI REFINEMENT
   * ---------------------------------------------------------
   */

  const aiPayload =
    await generateAIResponse({

      type: "cosmic",

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
         * 🌌 BASE ATMOSPHERE
         * ---------------------------------------------------
         */

        base:
          interpretation.cosmicMessage,

        /*
         * ---------------------------------------------------
         * 🌙 SKY SNAPSHOT
         * ---------------------------------------------------
         */

        moon:
          cosmic?.moon_sign,

        phase:
          cosmic?.moon_phase,

        sun:
          cosmic?.sun_sign,

        /*
         * ---------------------------------------------------
         * 🌌 COLLECTIVE FIELDS
         * ---------------------------------------------------
         */

        activeFields,

        collectiveThemes,

        energeticThemes,

        /*
         * ---------------------------------------------------
         * ⚡ DAILY FIELD
         * ---------------------------------------------------
         */

        dominantEnergy:
          dailyField?.dominantEnergy,

        symbolicThemes:
          dailyField?.symbolicThemes,

        fieldEssence:
  dailyField?.fieldEssence,  

        /*
         * ---------------------------------------------------
         * 🃏 ORACLE
         * ---------------------------------------------------
         */

        oracle:
          dailyField
            ?.oracleCard
            ?.title,

        oracleEnergy:
          dailyField
            ?.oracleCard
            ?.energy_category,

        oracleChakra:
          dailyField
            ?.oracleCard
            ?.chakra,
      },
    });


    console.log(
  "🌌 AI PAYLOAD:",
  aiPayload
);
  /*
   * ---------------------------------------------------------
   * 🌌 RETURN
   * ---------------------------------------------------------
   */

  return {

    ...interpretation,

    /*
     * -------------------------------------------------------
     * 🤖 AI WHISPERS
     * -------------------------------------------------------
     */

    moonLine:

      aiPayload?.moonLine ||

      interpretation.moonLine,

    phaseLine:

      aiPayload?.phaseLine ||

      interpretation.phaseLine,

    sunLine:

      aiPayload?.sunLine ||

      interpretation.sunLine,

    energyLine:

      aiPayload?.energyLine ||

      interpretation.energyLine,

    moon: {

  sign:
    cosmic?.moon_sign,

  phase:
    cosmic?.moon_phase,

  line:

    aiPayload?.moonLine ||

    interpretation.moonLine,
},

phase: {

  type:
    interpretation.phaseType,

  line:

    aiPayload?.phaseLine ||

    interpretation.phaseLine,
},

sun: {

  sign:
    cosmic?.sun_sign,

  line:

    aiPayload?.sunLine ||

    interpretation.sunLine,
},

energy: {

  dominant:
    dailyField
      ?.dominantEnergy,

  line:

    aiPayload?.energyLine ||

    interpretation.energyLine,
},  

    /*
     * -------------------------------------------------------
     * 🌌 RAW AI
     * -------------------------------------------------------
     */

    aiMessage:
      aiPayload,

    cosmic,

    dailyField,
  };
}