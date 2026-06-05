// /lib/guidance/orchestration/buildGuidanceWhispers.ts

/*
 * ------------------------------------------------
 * 🌌 BUILD GUIDANCE WHISPERS
 * ------------------------------------------------
 *
 * PURPOSE:
 *
 * Create symbolic signs for the field.
 *
 * IMPORTANT:
 *
 * Whispers are:
 * - signs
 * - symbols
 * - atmospheres
 * - emergence
 *
 * They are NOT:
 * - guidance
 * - coaching
 * - interpretation
 * - explanations
 *
 * ------------------------------------------------
 */

import {
  shuffle,
} from "lodash";

/*
 * ------------------------------------------------
 * 🌊 HELPERS
 * ------------------------------------------------
 */

const safeArray = (
  value: any
) => {

  if (
    Array.isArray(value)
  ) {

    return value;
  }

  return [];
};

const createWhisper = (

  text: string,

  weight = 0.5,

  source = "field",

  recurrence = false

) => ({

  text,

  weight,

  source,

  recurrence,
});

function weightedShuffle(
  items: any[]
) {

  return [...items]

    .sort(
      (
        a,
        b
      ) => {

        /*
         * 🌌 RECURRENCE
         */

        const aRecurrence =

          a?.recurrence
            ? 0.25
            : 0;

        const bRecurrence =

          b?.recurrence
            ? 0.25
            : 0;

        /*
         * 🌊 MEMORY
         */

        const aMemory =

          a?.source === "memory"
            ? 0.4
            : 0;

        const bMemory =

          b?.source === "memory"
            ? 0.4
            : 0;

        /*
         * 🌿 TOTAL WEIGHT
         */

        const aWeight =

          (
            a?.weight
            || 0.5
          )

          + aRecurrence
          + aMemory;

        const bWeight =

          (
            b?.weight
            || 0.5
          )

          + bRecurrence
          + bMemory;

        /*
         * 🌌 ORGANIC RANDOMNESS
         */

        return (

          (
            Math.random()
            * bWeight
          )

          -

          (
            Math.random()
            * aWeight
          )
        );
      }
    );
}

/*
 * ------------------------------------------------
 * 🌌 BUILD
 * ------------------------------------------------
 */

export const buildGuidanceWhispers = ({

  /*
   * 🌿 ORACLE
   */

  oracleCard,

  /*
   * 🌊 FIELD
   */

  activePatterns = [],

  activeChakras = [],

  manifestations = [],

  /*
   * 🌌 CONTEXT
   */

  mirrorContext,

  cosmicContext,

  /*
   * 🌿 ORCHESTRATION
   */

  resolvedContent,

  emergenceMemory,

}: any) => {

  /*
   * ------------------------------------------------
   * 🌌 FIELD
   * ------------------------------------------------
   */

  const whispers: any[] = [];

  /*
   * ------------------------------------------------
   * 🌊 ORACLE CARD
   * ------------------------------------------------
   */

  if (oracleCard) {

    /*
     * ✨ SYMBOL
     */

    if (
      oracleCard?.symbol
    ) {

      whispers.push(

        createWhisper(
          oracleCard.symbol,
          0.9,
          "oracle",
          true
        )
      );
    }

    /*
     * 🌌 ENVIRONMENTS
     */

    const environments =

      safeArray(

        oracleCard
          ?.symbolic_environment
      );

    shuffle(
      environments
    )

    .slice(0, 2)

    .forEach(
      (
        item: string
      ) => {

        whispers.push(

          createWhisper(
            item,
            0.65,
            "environment"
          )
        );
      }
    );

    /*
     * 🌊 ENERGY CATEGORY
     */

    if (
      oracleCard
        ?.energy_category
    ) {

      whispers.push(

        createWhisper(
          oracleCard.energy_category,
          0.72,
          "oracle"
        )
      );
    }
  }

  /*
   * ------------------------------------------------
   * 🌿 PATTERNS
   * ------------------------------------------------
   */

  activePatterns.forEach(
    (
      pattern: any
    ) => {

      /*
       * ✨ SYMBOL
       */

      if (
        pattern?.symbol
      ) {

        whispers.push({

          text:
            pattern.symbol,

          weight: 0.92,

          source:
            "pattern",

          recurrence:
            true,
        });
      }
    }
  );

  /*
   * ------------------------------------------------
   * 🌊 CHAKRAS
   * ------------------------------------------------
   */

  activeChakras.forEach(
    (
      chakra: any
    ) => {

      /*
       * ✨ SYMBOL
       */

      if (
        chakra?.symbol
      ) {

        whispers.push({

          text:
            chakra.symbol,

          weight: 0.82,

          source:
            "chakra",

          recurrence:
            true,
        });
      }

      /*
       * 🌿 INTEGRATION
       */

      if (
        chakra?.integration
      ) {

        whispers.push(

          createWhisper(
            chakra.integration,
            0.68,
            "chakra"
          )
        );
      }
    }
  );

  /*
   * ------------------------------------------------
   * 🌌 MANIFESTATIONS
   * ------------------------------------------------
   */

  manifestations.forEach(
    (
      manifestation: any
    ) => {

      /*
       * ✨ SYMBOL
       */

      if (
        manifestation?.symbol
      ) {

        whispers.push({

          text:
            manifestation.symbol,

          weight: 0.76,

          source:
            "manifestation",

          recurrence:
            true,
        });
      }
    }
  );

  /*
   * ------------------------------------------------
   * 🌿 ORCHESTRATION CONTENT
   * ------------------------------------------------
   */

  const orchestrationWhispers =

    safeArray(

      resolvedContent
        ?.whispers
    );

  orchestrationWhispers
    .slice(0, 4)
    .forEach(

      (entry: any) => {

if (
  entry?.text
) {

  const text =

    entry.text
      ?.toString?.()
      ?.trim?.();

  if (
    text &&
    text.split(" ").length <= 3
  ) {

    whispers.push(

      createWhisper(
        text,
        0.8,
        "orchestration",
        true
      )
    );
  }
}

        if (
          entry?.symbol
        ) {

          whispers.push(

            createWhisper(
              entry.symbol,
              0.82,
              "orchestration",
              true
            )
          );
        }
      }
    );

  /*
   * ------------------------------------------------
   * 🌊 EMERGENCE MEMORY
   * ------------------------------------------------
   */

  const recurringSymbols =

    safeArray(

      emergenceMemory
        ?.recurringSymbols
    );

  recurringSymbols
    .slice(0, 2)
    .forEach(

      (entry: any) => {

        if (
          entry?.text
        ) {

          whispers.push(

            createWhisper(
              entry.text,
              0.95,
              "memory",
              true
            )
          );
        }

        if (
          entry?.symbol
        ) {

          whispers.push(

            createWhisper(
              entry.symbol,
              0.96,
              "memory",
              true
            )
          );
        }
      }
    );

  /*
   * ------------------------------------------------
   * 🌌 COSMIC FIELD
   * ------------------------------------------------
   */

  if (
    cosmicContext
      ?.isFullMoon
  ) {

    whispers.push(

      createWhisper(
        "🌕",
        0.94,
        "cosmic",
        true
      )
    );
  }

  if (
    cosmicContext
      ?.isEclipse
  ) {

    whispers.push(

      createWhisper(
        "🌑",
        0.94,
        "cosmic",
        true
      )
    );
  }

  if (
    cosmicContext
      ?.isPortal
  ) {

    whispers.push(

      createWhisper(
        "🌀",
        0.9,
        "portal",
        true
      )
    );
  }

  /*
   * ------------------------------------------------
   * 🌿 MIRROR FIELD
   * ------------------------------------------------
   */

  const emotionalField =

    mirrorContext
      ?.current
      ?.emotionalField;

  /*
   * ------------------------------------------------
   * 🌊 CLEAN
   * ------------------------------------------------
   */

  const cleaned =

    whispers

      .filter(
        (item) => item?.text
      )

      .map((item) => ({

        ...item,

        text:

          item
            ?.text
            ?.toString?.()
            ?.trim?.(),
      }))

      .filter(
        (item) => item?.text
      );

  /*
   * ------------------------------------------------
   * 🌌 UNIQUE
   * ------------------------------------------------
   */

  const uniqueMap =
    new Map();

  cleaned.forEach(
    (item: any) => {

      const existing =

        uniqueMap.get(
          item.text
        );

      if (
        !existing ||

        item.weight >
        existing.weight
      ) {

        uniqueMap.set(
          item.text,
          item
        );
      }
    }
  );

  const unique =

    Array.from(
      uniqueMap.values()
    );

  /*
   * ------------------------------------------------
   * 🌿 FINAL
   * ------------------------------------------------
   */

  console.log(
    "🌌 RAW WHISPERS",
    unique
  );

  return weightedShuffle(
    unique
  )

  .slice(0, 12);
};