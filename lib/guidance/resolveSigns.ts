// /lib/guidance/resolveSigns.ts

/*
 * --------------------------------------------------------
 * 🌌 RESOLVE SIGNS
 * --------------------------------------------------------
 *
 * PURPOSE:
 *
 * Resolve symbolic field particles
 * from the active foreground field.
 *
 * IMPORTANT:
 *
 * Signs are:
 * - atmospheric
 * - symbolic
 * - subconscious
 * - sparse
 * - low cognitive load
 *
 * Signs are NOT:
 * - explanations
 * - guidance
 * - coaching
 * - AI prose
 *
 * Signs should feel:
 * discovered,
 * not generated.
 *
 * --------------------------------------------------------
 */

import {
    ForegroundField,
    Sign,
} from "./guidanceTypes";

/*
 * --------------------------------------------------------
 * 🌊 INPUTS
 * --------------------------------------------------------
 */

interface ResolveSignsProps {

  field:
    ForegroundField;

  /*
   * --------------------------------------------------------
   * 🌌 OPTIONAL SOURCES
   * --------------------------------------------------------
   */

  chakraSigns?: any[];

  oracleSigns?: any[];

  cosmicSigns?: any[];

  patternSigns?: any[];

  angelNumbers?: any[];
}

/*
 * --------------------------------------------------------
 * 🌿 HELPERS
 * --------------------------------------------------------
 */

function randomize<T>(
  array: T[] = []
): T[] {

  return [...array].sort(
    () => Math.random() - 0.5
  );
}

/*
 * --------------------------------------------------------
 * 🌌 RESOLVE SIGNS
 * --------------------------------------------------------
 */

export function resolveSigns({

  field,

  chakraSigns = [],

  oracleSigns = [],

  cosmicSigns = [],

  patternSigns = [],

  angelNumbers = [],

}: ResolveSignsProps): Sign[] {

  /*
   * --------------------------------------------------------
   * 🌊 SILENCE
   * --------------------------------------------------------
   *
   * Silence is part of intelligence.
   *
   * --------------------------------------------------------
   */

  if (

    Math.random()

    <

    field?.silenceProbability

  ) {

    return [];
  }

  /*
   * --------------------------------------------------------
   * 🌿 SYMBOLIC LIMITS
   * --------------------------------------------------------
   */

  let maxSigns = 3;

  if (
    field?.symbolicIntensity ===
    "moderate"
  ) {

    maxSigns = 5;
  }

  if (
    field?.symbolicIntensity ===
    "high"
  ) {

    maxSigns = 7;
  }

  /*
   * --------------------------------------------------------
   * 🌌 POOLS
   * --------------------------------------------------------
   */

  const resolvedSigns: Sign[] = [];

  /*
   * --------------------------------------------------------
   * 🌊 CHAKRA SIGNS
   * --------------------------------------------------------
   */

  field?.activeChakras
    ?.forEach?.((chakra) => {

      const matches =

        chakraSigns?.filter?.(
          (sign) =>

            sign?.chakra === chakra
        ) || [];

      const randomized =
        randomize(matches);

      const first =
        randomized?.[0];

      if (first) {

        resolvedSigns.push({

          id:
            first?.id
            || `${chakra}-sign`,

          text:
            first?.symbol
            || first?.text
            || chakra,

          type:
            "chakra",

          weight:
            first?.weight
            || 1,

          rarity:
            first?.rarity
            || 1,

          recurring:
            false,

          timestamp:
            Date.now(),
        });
      }
    });

  /*
   * --------------------------------------------------------
   * 🌿 PATTERN SIGNS
   * --------------------------------------------------------
   */

  field?.activePatterns
    ?.forEach?.((pattern) => {

      const matches =

        patternSigns?.filter?.(
          (sign) =>

            sign?.pattern === pattern
        ) || [];

      const randomized =
        randomize(matches);

      const first =
        randomized?.[0];

      if (first) {

        resolvedSigns.push({

          id:
            first?.id
            || `${pattern}-sign`,

          text:
            first?.symbol
            || first?.text
            || pattern,

          type:
            "pattern",

          weight:
            first?.weight
            || 1,

          rarity:
            first?.rarity
            || 1,

          recurring:
            false,

          timestamp:
            Date.now(),
        });
      }
    });

  /*
   * --------------------------------------------------------
   * 🌌 COSMIC SIGNS
   * --------------------------------------------------------
   *
   * Only allow stronger cosmic symbolism
   * if symbolic intensity supports it.
   *
   * --------------------------------------------------------
   */

  if (

    field?.symbolicIntensity ===
    "moderate"

    ||

    field?.symbolicIntensity ===
    "high"

  ) {

    const randomized =
      randomize(cosmicSigns);

    const first =
      randomized?.[0];

    if (first) {

      resolvedSigns.push({

        id:
          first?.id
          || "cosmic-sign",

        text:
          first?.symbol
          || first?.text
          || "☽",

        type:
          "cosmic",

        weight:
          first?.weight
          || 1,

        rarity:
          first?.rarity
          || 1,

        recurring:
          false,

        timestamp:
          Date.now(),
      });
    }
  }

  /*
   * --------------------------------------------------------
   * 🌊 ANGEL NUMBERS
   * --------------------------------------------------------
   */

  if (
    field?.amplification > 0.5
  ) {

    const randomized =
      randomize(angelNumbers);

    const first =
      randomized?.[0];

    if (first) {

      resolvedSigns.push({

        id:
          first?.id
          || "angel-number",

        text:
          first?.number
          || first?.text
          || "111",

        type:
          "angel_number",

        weight:
          first?.weight
          || 1,

        rarity:
          first?.rarity
          || 1,

        recurring:
          false,

        timestamp:
          Date.now(),
      });
    }
  }

  /*
   * --------------------------------------------------------
   * 🌿 ORACLE SIGNS
   * --------------------------------------------------------
   */

  if (
    field?.symbolicIntensity ===
    "high"
  ) {

    const randomized =
      randomize(oracleSigns);

    const first =
      randomized?.[0];

    if (first) {

      resolvedSigns.push({

        id:
          first?.id
          || "oracle-sign",

        text:
          first?.symbol
          || first?.text
          || "gold thread",

        type:
          "oracle",

        weight:
          first?.weight
          || 1,

        rarity:
          first?.rarity
          || 1,

        recurring:
          false,

        timestamp:
          Date.now(),
      });
    }
  }

  /*
   * --------------------------------------------------------
   * 🌌 CLEANUP
   * --------------------------------------------------------
   *
   * Remove:
   * - empty signs
   * - duplicates
   *
   * --------------------------------------------------------
   */

  const uniqueSigns =

    resolvedSigns.filter(

      (sign, index, self) => {

        if (!sign?.text) {

          return false;
        }

        return (

          index ===

          self.findIndex(

            (s) =>
              s?.text === sign?.text
          )
        );
      }
    );

  /*
   * --------------------------------------------------------
   * 🌊 LIMIT
   * --------------------------------------------------------
   */

  return uniqueSigns
    .slice(0, maxSigns);
}