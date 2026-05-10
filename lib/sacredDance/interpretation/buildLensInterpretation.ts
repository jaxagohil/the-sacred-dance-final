// lib/sacredDance/interpretation/buildLensInterpretation.ts

//
// 🌌 TYPES
//

type Input = {

  lens?: string;

  patterns?: string[];

  distortions?: string[];
};

export type LensInterpretation = {

  lensTheme: string;

  emotionalFocus: string;

  reflection: string;
};

//
// ✨ MAIN
//

export function buildLensInterpretation({
  lens,
  patterns = [],
  distortions = [],
}: Input): LensInterpretation {

  switch (
    lens?.toLowerCase()
  ) {

    //
    // 👥 PEOPLE
    //

    case "people":

      return {

        lensTheme:
          "relationship mirrors",

        emotionalFocus:
          "emotional resonance and projection",

        reflection: `

Current relationship dynamics may be reflecting
deeper emotional truths through connection,
triggering,
and recognition.

Patterns:
${patterns.join(", ") || "none"}

Distortions:
${distortions.join(", ") || "none"}

`,
      };

    //
    // 🌍 PLACES
    //

    case "places":

      return {

        lensTheme:
          "environmental resonance",

        emotionalFocus:
          "belonging and energetic atmosphere",

        reflection: `

The current field may be responding strongly
to environments,
movement,
and energetic alignment with place.

`,
      };

    //
    // 🪞 THINGS
    //

    case "things":

      return {

        lensTheme:
          "symbolic attachment",

        emotionalFocus:
          "meaning and emotional projection",

        reflection: `

Objects and symbolic attachments may currently
carry deeper emotional meaning than usual.

`,
      };
  }

  //
  // 🌌 DEFAULT
  //

  return {

    lensTheme:
      "general awareness",

    emotionalFocus:
      "inner reflection",

    reflection: `

The emotional field appears reflective,
observant,
and inwardly aware.

`,
  };
}