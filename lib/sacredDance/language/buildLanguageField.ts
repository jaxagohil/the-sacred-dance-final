// lib/sacredDance/language/buildLanguageField.ts

//
// 🌌 TYPES
//

type Input = {

  guide?: string;

  themes?: string[];

  chakras?: string[];

  emotionalFrequencies?: string[];

  languageEntries?: any[];
};

export type LanguageField = {

  emotionalQualities: string[];

  vocabulary: string[];

  phrases: string[];

  energeticTone: string;
};

//
// ✨ MAIN
//

export function buildLanguageField({
  guide,
  themes = [],
  chakras = [],
  emotionalFrequencies = [],
  languageEntries = [],
}: Input): LanguageField {

  //
  // 🌙 BASE FIELD
  //

  const emotionalQualities =
    new Set<string>();

  const vocabulary =
    new Set<string>();

  const phrases =
    new Set<string>();

  //
  // ✨ GUIDE MODULATION
  //

  switch (
    guide?.toLowerCase()
  ) {

    //
    // 🌸 NANI
    //

    case "nani":

      emotionalQualities.add(
        "gentle"
      );

      emotionalQualities.add(
        "maternal"
      );

      vocabulary.add(
        "softly"
      );

      vocabulary.add(
        "held"
      );

      vocabulary.add(
        "heart"
      );

      phrases.add(
        "there is no rush"
      );

      phrases.add(
        "you are allowed to soften"
      );

      break;

    //
    // 🜂 LALA
    //

    case "lala":

      emotionalQualities.add(
        "grounded"
      );

      emotionalQualities.add(
        "clear"
      );

      vocabulary.add(
        "steady"
      );

      vocabulary.add(
        "truth"
      );

      vocabulary.add(
        "clarity"
      );

      phrases.add(
        "stand where you are"
      );

      phrases.add(
        "clarity arrives slowly"
      );

      break;

    //
    // ✨ AMMAARAH
    //

    case "ammaarah":

      emotionalQualities.add(
        "spacious"
      );

      emotionalQualities.add(
        "expansive"
      );

      vocabulary.add(
        "field"
      );

      vocabulary.add(
        "awareness"
      );

      vocabulary.add(
        "consciousness"
      );

      phrases.add(
        "the field is shifting"
      );

      phrases.add(
        "awareness is unfolding"
      );

      break;

    //
    // 🌺 THAKORJI
    //

    case "thakorji":

      emotionalQualities.add(
        "devotional"
      );

      emotionalQualities.add(
        "loving"
      );

      vocabulary.add(
        "beloved"
      );

      vocabulary.add(
        "devotion"
      );

      vocabulary.add(
        "trust"
      );

      phrases.add(
        "love is already present"
      );

      phrases.add(
        "the heart remembers"
      );

      break;
  }

  //
  // ⚡ CHAKRA MODULATION
  //

  chakras.forEach(
    (chakra) => {

      switch (
        chakra?.toLowerCase()
      ) {

        case "root":

          emotionalQualities.add(
            "grounded"
          );

          vocabulary.add(
            "stability"
          );

          break;

        case "heart":

          emotionalQualities.add(
            "warm"
          );

          vocabulary.add(
            "connection"
          );

          break;

        case "crown":

          emotionalQualities.add(
            "spacious"
          );

          vocabulary.add(
            "expansion"
          );

          break;
      }
    }
  );

  //
  // 🌙 THEMES
  //

  themes.forEach(
    (theme) => {

      switch (
        theme?.toLowerCase()
      ) {

        case "abandonment":

          emotionalQualities.add(
            "safe"
          );

          phrases.add(
            "you do not need to hold this alone"
          );

          break;

        case "awakening":

          emotionalQualities.add(
            "transformative"
          );

          phrases.add(
            "something new is emerging"
          );

          break;

        case "union":

          emotionalQualities.add(
            "connected"
          );

          phrases.add(
            "the heart is learning trust again"
          );

          break;
      }
    }
  );

  //
  // 🌊 EMOTIONAL FREQUENCIES
  //

  emotionalFrequencies.forEach(
    (frequency) => {

      emotionalQualities.add(
        frequency
      );
    }
  );

  //
  // 🌌 DB LANGUAGE ENTRIES
  //

  languageEntries.forEach(
    (entry) => {

      //
      // vocabulary
      //

      if (
        entry?.word
      ) {

        vocabulary.add(
          entry.word
        );
      }

      //
      // phrase
      //

      if (
        entry?.phrase
      ) {

        phrases.add(
          entry.phrase
        );
      }

      //
      // emotional quality
      //

      if (
        entry?.emotional_quality
      ) {

        emotionalQualities.add(
          entry.emotional_quality
        );
      }
    }
  );

  //
  // 🌌 ENERGETIC TONE
  //

  const energeticTone =
    Array.from(
      emotionalQualities
    )
      .slice(0, 4)
      .join(", ");

  //
  // 🌌 RETURN
  //

  return {

    emotionalQualities:
      Array.from(
        emotionalQualities
      ),

    vocabulary:
      Array.from(
        vocabulary
      ),

    phrases:
      Array.from(
        phrases
      ),

    energeticTone,
  };
}