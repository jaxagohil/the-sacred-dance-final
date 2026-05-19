// /lib/tarot/selectTarotCard.ts

import {
  supabase,
} from "../services/supabase";

//
// 🌌 TYPES
//

type TarotCard = {

  id: string;

  name: string;

  arcana?: string;

  suit?: string;

  archetypal_energy?: string;

  symbolic_atmosphere?: string[];

  imagery_keywords?: string[];

  movement_keywords?: string[];

  environment_keywords?: string[];

  question_style?: string;

  inquiry_examples?: string[];

  behavioural_themes?: string[];

  tension_patterns?: string[];

  symbolic_temperature?: string;

  pacing_style?: string;

  archetype_family?: string;

  is_active?: boolean;

  weight?: number;
};

type SelectionContext = {

  patterns?: string[];

  distortions?: {

  distorted?: string[];

  integrated?: string[];
};

  oracleCard?: any;

  cosmic?: {

    phase?: string;

    moon?: string;

    sun?: string;

    dominantEnergy?: string;
  };

  recentCards?: string[];
};

//
// 🧠 HELPERS
//

function normalizeArray(
  value: any
): string[] {

  if (
    Array.isArray(value)
  ) {

    return value
      .filter(Boolean)
      .map((v) =>
        String(v)
          .toLowerCase()
      );
  }

  if (
    typeof value ===
    "string"
  ) {

    return value

      .split(",")

      .map((v) =>
        v.trim()
          .toLowerCase()
      )

      .filter(Boolean);
  }

  return [];
}

//
// 🧠 WEIGHTED RANDOM
//

function weightedPick(
  cards: TarotCard[]
): TarotCard {

  const total =
    cards.reduce(

      (sum, c) =>

        sum + (c.weight || 0),

      0
    );

  let rand =
    Math.random() * total;

  for (const card of cards) {

    rand -=
      card.weight || 0;

    if (rand <= 0) {

      return card;
    }
  }

  return cards[0];
}

//
// 🌌 SELECT TAROT CARD
//

export async function
selectTarotCard({

  patterns = [],

 distortions = {},

  oracleCard,

  cosmic,

  recentCards = [],

}: SelectionContext): Promise<TarotCard> {

  //
  // 🃏 LOAD CARDS
  //

  const {

    data,

    error,

  } = await supabase

    .from(
      "tarot_cards"
    )

    .select("*")

    .eq(
      "is_active",
      true
    );

  //
  // ❌ ERROR
  //

  if (
    error ||
    !data ||
    data.length === 0
  ) {

    console.log(
      "❌ TAROT LOAD ERROR:",
      error
    );

    throw new Error(
      "Unable to load tarot cards."
    );
  }

  //
  // ✨ NORMALIZE USER FIELD
  //

  const normalizedPatterns =

    patterns.map(
      (p) =>
        p.toLowerCase()
    );

const normalizedDistortions =

  (
    distortions?.distorted || []
  )

    .filter(
      (d): d is string =>
        typeof d ===
        "string"
    )

    .map(
      (d) =>
        d.toLowerCase()
    );

  //
  // 🌌 ORACLE FIELD
  //

  const oracleThemes =
    normalizeArray(

      oracleCard
        ?.behavioural_themes
    );

  const oracleImagery =
    normalizeArray(

      oracleCard
        ?.imagery_keywords
    );

  const oracleTone =
    normalizeArray(

      oracleCard
        ?.symbolic_tone
    );

  //
  // ✨ BUILD WEIGHTS
  //

  const weighted =
    data.map(
      (card: TarotCard) => {

        let weight = 1;

        //
        // ✨ NORMALIZE CARD
        //

        const behaviours =
          normalizeArray(
            card
              .behavioural_themes
          );

        const tension =
          normalizeArray(
            card
              .tension_patterns
          );

        const imagery =
          normalizeArray(
            card
              .imagery_keywords
          );

        const movement =
          normalizeArray(
            card
              .movement_keywords
          );

        const atmosphere =
          normalizeArray(
            card
              .symbolic_atmosphere
          );

        //
        // 🪞 USER PATTERN RESONANCE
        //

        normalizedPatterns.forEach(
          (pattern) => {

            if (

              behaviours.includes(
                pattern
              )

            ) {

              weight += 3;
            }

            if (

              imagery.includes(
                pattern
              )

            ) {

              weight += 1.5;
            }
          }
        );

        //
        // ⚠️ DISTORTION RESONANCE
        //

        normalizedDistortions.forEach(
          (distortion) => {

            if (

              tension.includes(
                distortion
              )

            ) {

              weight += 3;
            }

            if (

              behaviours.includes(
                distortion
              )

            ) {

              weight += 2;
            }
          }
        );

        //
        // 🌌 ORACLE RESONANCE
        //

        oracleThemes.forEach(
          (theme) => {

            if (

              behaviours.includes(
                theme
              )

            ) {

              weight += 2;
            }
          }
        );

        oracleImagery.forEach(
          (image) => {

            if (

              imagery.includes(
                image
              )

            ) {

              weight += 1.5;
            }
          }
        );

        oracleTone.forEach(
          (tone) => {

            if (

              atmosphere.includes(
                tone
              )

            ) {

              weight += 1.5;
            }
          }
        );

        //
        // 🌕 MOON PHASE
        //

        if (

          cosmic?.phase ===
          "Full"

        ) {

          if (

            card.arcana ===
            "major"

          ) {

            weight += 2;
          }

          if (

            atmosphere.includes(
              "intense"
            )

          ) {

            weight += 1.5;
          }
        }

        if (

          cosmic?.phase ===
          "Waning"

        ) {

          if (

            movement.includes(
              "release"
            ) ||

            movement.includes(
              "slowing"
            )

          ) {

            weight += 2;
          }
        }

        if (

          cosmic?.phase ===
          "New"

        ) {

          if (

            movement.includes(
              "beginning"
            ) ||

            movement.includes(
              "emerging"
            )

          ) {

            weight += 2;
          }
        }

        //
        // 🌌 COLLECTIVE ENERGY
        //

        if (

          cosmic?.dominantEnergy

        ) {

          if (

            card
              ?.archetypal_energy
              ?.toLowerCase?.()

              .includes(

                cosmic
                  .dominantEnergy
                  .toLowerCase()

              )

          ) {

            weight += 2;
          }
        }

        //
        // 🔮 MAJOR ARCANA
        //

        if (

          card.arcana ===
          "major"

        ) {

          weight += 1;
        }

        //
        // 🔁 REDUCE RECENT REPEATS
        //

        if (

          recentCards.includes(
            card.id
          )

        ) {

          weight *= 0.08;
        }

        //
        // ✨ RANDOM MAGIC
        //

        weight +=
          Math.random() * 1.4;

        return {

          ...card,

          weight,
        };
      }
    );

  //
  // 🌌 FINAL CARD
  //

  return weightedPick(
    weighted
  );
}