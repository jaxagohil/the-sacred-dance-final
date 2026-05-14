import {
  generateAIResponse,
} from "../ai/generateAIResponse";

import {
  buildDailyField,
} from "./buildDailyField";

import {
  getCosmicInterpretation,
} from "./cosmicInterpretation";

export async function getCosmicMessage({

  energy,

  patterns,

}: {

  energy?: any;

  patterns?: any[];

}) {

  //
  // 🌌 DAILY FIELD
  //

  const dailyField =
    await buildDailyField();

  //
  // 🧠 INTERPRETATION
  //

  const interpretation =
    getCosmicInterpretation({

      dailyField,

      energy,

      patterns,
    });

  //
  // 🌙 COSMIC DATA
  //

  const cosmic =
    dailyField.cosmic;

  //
  // 🤖 AI REFINEMENT
  //

  const aiText =
    await generateAIResponse({

      type: "cosmic",

      data: {

        base:
          interpretation.cosmicMessage,

        phase:
          cosmic.phase,

        sunEnergy:
          cosmic.sunEnergy,

        sun:
          cosmic.sun,

        moon:
          cosmic.moon,

        pattern:
          patterns?.[0]?.id,

        symbolicThemes:
          dailyField.symbolicThemes,

        imagery:
          dailyField.imagery,

        guideTone:
          dailyField.guideTone,

        oracleBias:
          dailyField.oracleBias,
      },
    });

  //
  // 🌌 RETURN
  //

  return {

    ...interpretation,

    aiMessage:
      aiText ||
      interpretation.cosmicMessage,

    cosmic,

    dailyField,
  };
}