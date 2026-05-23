// lib/spiral/aggregateSpiralState.ts

import { supabase } from "../../services/supabase";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type SpiralAggregate = {

  physical: number;

  emotional: number;

  energetic: number;

  consciousness: number;

  dominant_layer: string;

  dominant_pole: string;

  spiral_state: string;

  integration_score: number;

  chakra_activation:
    Record<string, number>;

  recurring_patterns:
    string[];
};

/*
 * --------------------------------------------------
 * 🧮 HELPERS
 * --------------------------------------------------
 */

function clamp(
  value: number,
  min = 0,
  max = 1
) {

  return Math.max(
    min,
    Math.min(max, value)
  );
}

function normalizeMap(
  map: Record<string, number>
) {

  const max = Math.max(
    ...Object.values(map),
    1
  );

  const normalized:
    Record<string, number> = {};

  Object.entries(map).forEach(
    ([key, value]) => {

      normalized[key] =
        clamp(value / max);
    }
  );

  return normalized;
}

/*
 * --------------------------------------------------
 * ⏳ TIME DECAY
 * --------------------------------------------------
 */

function getTimeWeight(
  createdAt: string
) {

  const now =
    new Date().getTime();

  const created =
    new Date(
      createdAt
    ).getTime();

  const daysOld =

    (now - created)

    /

    (1000 * 60 * 60 * 24);

  if (daysOld <= 1)
    return 1;

  if (daysOld <= 7)
    return 0.8;

  if (daysOld <= 30)
    return 0.5;

  if (daysOld <= 90)
    return 0.25;

  if (daysOld <= 180)
    return 0.12;

  return 0.05;
}

/*
 * --------------------------------------------------
 * 🚀 MAIN
 * --------------------------------------------------
 */

export async function
aggregateSpiralState(
  userId: string
): Promise<SpiralAggregate> {

  // --------------------------------------------------
  // 📦 LOAD SIGNALS
  // --------------------------------------------------

  const {
    data: signals,
    error,
  } = await supabase

    .from("signals")

    .select(`
      created_at,

      ai_intensity,

      reality_layers,

      spiral_state,

      dominant_pole,

      integration_score_v2,

      dominant_pattern_v2,

      chakra_activation
    `)

    .eq(
      "user_id",
      userId
    )

    .order(
      "created_at",
      {
        ascending: false,
      }
    )

    .limit(250);

  if (error || !signals) {

    console.error(
      "❌ aggregateSpiralState:",
      error
    );

    return {

      physical: 0,

      emotional: 0,

      energetic: 0,

      consciousness: 0,

      dominant_layer:
        "emotional",

      dominant_pole:
        "center",

      spiral_state:
        "processing",

      integration_score:
        0,

      chakra_activation:
        {},

      recurring_patterns:
        [],
    };
  }

  // --------------------------------------------------
  // 🌈 TOTALS
  // --------------------------------------------------

  let physical = 0;

  let emotional = 0;

  let energetic = 0;

  let consciousness = 0;

  let integration = 0;

  let totalWeight = 0;

  const poleCounts:
    Record<string, number>
      = {};

  const stateCounts:
    Record<string, number>
      = {};

  const chakraMap:
    Record<string, number>
      = {};

  const patternMap:
    Record<string, number>
      = {};

  // --------------------------------------------------
  // 🌊 PROCESS
  // --------------------------------------------------

  signals.forEach(
    (signal: any) => {

      const layers =
        signal.reality_layers;

      if (!layers)
        return;

      const intensity =

        signal.ai_intensity || 1;

      const timeWeight =
        getTimeWeight(
          signal.created_at
        );

      const weight =
        intensity *
        timeWeight;

      // ------------------------------------------------
      // 🌍 REALITY
      // ------------------------------------------------

      physical +=

        (layers.physical || 0)
        * weight;

      emotional +=

        (layers.emotional || 0)
        * weight;

      energetic +=

        (layers.energetic || 0)
        * weight;

      consciousness +=

        (
          layers.consciousness
          || 0
        ) * weight;

      // ------------------------------------------------
      // ☯ INTEGRATION
      // ------------------------------------------------

      integration +=

        (
          signal.integration_score_v2
          || 0
        ) * weight;

      // ------------------------------------------------
      // 🌗 POLES
      // ------------------------------------------------

      const pole =
        signal.dominant_pole;

      if (pole) {

        poleCounts[pole] =

          (
            poleCounts[pole]
            || 0
          ) + weight;
      }

      // ------------------------------------------------
      // 🌀 STATES
      // ------------------------------------------------

      const state =
        signal.spiral_state;

      if (state) {

        stateCounts[state] =

          (
            stateCounts[state]
            || 0
          ) + weight;
      }

      // ------------------------------------------------
      // 🌈 CHAKRAS
      // ------------------------------------------------

      const chakras =

        signal
          .chakra_activation || {};

      Object.entries(
        chakras
      ).forEach(

        ([key, value]) => {

          chakraMap[key] =

            (
              chakraMap[key]
              || 0
            )

            +

            (
              Number(value)
              * weight
            );
        }
      );

      // ------------------------------------------------
      // 🪞 PATTERNS
      // ------------------------------------------------

      const pattern =

        signal
          .dominant_pattern_v2;

      if (pattern) {

        patternMap[pattern] =

          (
            patternMap[pattern]
            || 0
          ) + weight;
      }

      totalWeight += weight;
    }
  );

  // --------------------------------------------------
  // 🌍 NORMALIZE REALITY
  // --------------------------------------------------

  const reality = {

    physical:
      clamp(
        physical /
        totalWeight
      ),

    emotional:
      clamp(
        emotional /
        totalWeight
      ),

    energetic:
      clamp(
        energetic /
        totalWeight
      ),

    consciousness:
      clamp(
        consciousness /
        totalWeight
      ),
  };

  // --------------------------------------------------
  // 🌟 DOMINANT LAYER
  // --------------------------------------------------

  const dominant_layer =

    Object.entries(
      reality
    )

      .sort(
        (a, b) =>

          Number(b[1])

          -

          Number(a[1])
      )[0]?.[0]

    ||

    "emotional";

  // --------------------------------------------------
  // 🌗 DOMINANT POLE
  // --------------------------------------------------

  const dominant_pole =

    Object.entries(
      poleCounts
    )

      .sort(
        (a, b) =>

          Number(b[1])

          -

          Number(a[1])
      )[0]?.[0]

    ||

    "center";

  // --------------------------------------------------
  // 🌀 SPIRAL STATE
  // --------------------------------------------------

  const spiral_state =

    Object.entries(
      stateCounts
    )

      .sort(
        (a, b) =>

          Number(b[1])

          -

          Number(a[1])
      )[0]?.[0]

    ||

    "processing";

  // --------------------------------------------------
  // 🌈 CHAKRAS
  // --------------------------------------------------

  const chakra_activation =
    normalizeMap(
      chakraMap
    );

  // --------------------------------------------------
  // 🪞 RECURRING PATTERNS
  // --------------------------------------------------

  const recurring_patterns =

    Object.entries(
      patternMap
    )

      .sort(
        (a, b) =>

          Number(b[1])

          -

          Number(a[1])
      )

      .slice(0, 5)

      .map(([key]) => key);

  // --------------------------------------------------
  // ✅ RETURN
  // --------------------------------------------------

  return {

    ...reality,

    dominant_layer,

    dominant_pole,

    spiral_state,

    integration_score:

      clamp(
        integration /
        totalWeight
      ),

    chakra_activation,

    recurring_patterns,
  };
}