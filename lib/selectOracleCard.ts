// /lib/oracle/selectOracleCard.ts

import {
  supabase,
} from "../services/supabase";

//
// 🌌 TYPES
//

type OracleCard = {

  id: string;

  title: string;

  card_number?: number;

  theme?: string;

  chakra?: string;

  energy_category?: string;

  emotional_frequency?: string;

  symbolic_tone?: string[];

  relational_energy?: string;

  cadence_style?: string;

  imagery_keywords?: string[];

  inquiry_energy?: string;

  inquiry_examples?: string[];

  behavioural_themes?: string[];

  movement_keywords?: string[];

  symbolic_environment?: string[];

  archetypal_temperature?: string;

  is_active?: boolean;

  weight?: number;
};

type SelectionContext = {

  cosmic?: {

    sun?: string;

    moon?: string;

    phase?: string;

    dominantEnergy?: string;

    collectiveTheme?: string;

    archetypes?: any[];
  };

  recentCards?: string[];
};

//
// 🧠 WEIGHTED RANDOM
//

function weightedPick(

  cards: (
    OracleCard & {
      weight: number;
    }
  )[]

): OracleCard {

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
// 🌌 HELPERS
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
// 🌌 SELECT ORACLE CARD
//

export async function
selectOracleCard({

  cosmic,

  recentCards = [],

}: SelectionContext): Promise<OracleCard> {

  //
  // 🃏 LOAD CARDS
  //

  const {

    data,

    error,

  } = await supabase

    .from(
      "oracle_cards"
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
      "❌ ORACLE LOAD ERROR:",
      error
    );

    throw new Error(
      "Unable to load oracle cards."
    );
  }

  //
  // 🌌 ARCHETYPES
  //

  const archetypes =
    cosmic?.archetypes || [];

  //
  // ✨ BUILD WEIGHTS
  //

  const weighted =
    data.map(
      (card: OracleCard) => {

        let weight = 1;

        //
        // ✨ NORMALIZE CARD DATA
        //

        const imagery =
          normalizeArray(
            card.imagery_keywords
          );

        const behaviours =
          normalizeArray(
            card.behavioural_themes
          );

        const movement =
          normalizeArray(
            card.movement_keywords
          );

        const environments =
          normalizeArray(
            card.symbolic_environment
          );

        const tone =
          normalizeArray(
            card.symbolic_tone
          );

        //
        // 🌌 ARCHETYPE RESONANCE
        //

        archetypes.forEach(
          (archetype: any) => {

            const themes =
              normalizeArray(
                archetype
                  ?.themes
              );

            const oracleBias =
              normalizeArray(
                archetype
                  ?.oracle_bias
              );

            const emotionalTone =

              String(

                archetype
                  ?.emotional_tone ||

                ""

              )

              .toLowerCase();

            const movementStyle =

              String(

                archetype
                  ?.movement_style ||

                ""

              )

              .toLowerCase();

            //
            // 🌌 SYMBOLIC RESONANCE
            //

            themes.forEach(
              (theme) => {

                if (

                  imagery.includes(
                    theme
                  )

                ) {

                  weight += 2;
                }

                if (

                  behaviours.includes(
                    theme
                  )

                ) {

                  weight += 2;
                }

                if (

                  environments.includes(
                    theme
                  )

                ) {

                  weight += 1.5;
                }
              }
            );

            //
            // ✨ ORACLE BIAS
            //

            oracleBias.forEach(
              (bias) => {

                if (

                  behaviours.includes(
                    bias
                  )

                ) {

                  weight += 2.5;
                }

                if (

                  tone.includes(
                    bias
                  )

                ) {

                  weight += 1.5;
                }
              }
            );

            //
            // 🌊 EMOTIONAL TONE
            //

            if (

              card
                ?.emotional_frequency
                ?.toLowerCase?.()

                .includes(
                  emotionalTone
                )

            ) {

              weight += 2;
            }

            //
            // 🌬 MOVEMENT STYLE
            //

            if (

              movement.includes(
                movementStyle
              )

            ) {

              weight += 2;
            }

            //
            // ⚡ ACTIVATION WEIGHT
            //

            weight +=

              (
                archetype
                  ?.activation_weight ||

                1
              ) * 0.6;
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

            tone.includes(
              "intense"
            ) ||

            tone.includes(
              "revealing"
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
              "emerging"
            ) ||

            movement.includes(
              "beginning"
            )

          ) {

            weight += 2;
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

            tone.includes(
              "reflective"
            )

          ) {

            weight += 2;
          }
        }

        //
        // ⚡ COLLECTIVE ENERGY
        //

        if (

          cosmic?.dominantEnergy

        ) {

          if (

            card
              ?.energy_category
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
          Math.random() * 1.2;

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