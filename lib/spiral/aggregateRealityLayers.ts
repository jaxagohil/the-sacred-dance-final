import { supabase } from "../../services/supabase";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type RealityLayers = {

  physical: number;

  emotional: number;

  energetic: number;

  consciousness: number;
};

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

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

    (now - created) /

    (1000 * 60 * 60 * 24);

  /*
   * ----------------------------------------------
   * 🌊 DECAY CURVE
   * ----------------------------------------------
   */

  if (daysOld <= 1)
    return 1.0;

  if (daysOld <= 3)
    return 0.9;

  if (daysOld <= 7)
    return 0.7;

  if (daysOld <= 14)
    return 0.55;

  if (daysOld <= 30)
    return 0.4;

  if (daysOld <= 90)
    return 0.2;

  if (daysOld <= 180)
    return 0.1;

  return 0.05;
}

// --------------------------------------------------
// 🚀 MAIN
// --------------------------------------------------

export async function
aggregateRealityLayers(
  userId: string
) {

  // --------------------------------------------------
  // 📦 LOAD SIGNALS
  // --------------------------------------------------

  const {
    data: signals,
    error,
  } = await supabase

    .from("signals")

    .select(`
      reality_layers,
      ai_intensity,
      created_at
    `)

    .eq(
      "user_id",
      userId
    )

    .not(
      "reality_layers",
      "is",
      null
    )

    .order(
      "created_at",
      {
        ascending: false,
      }
    )

    .limit(250);

  if (error) {

    console.error(
      "❌ aggregateRealityLayers error:",
      error
    );

    return {

      physical: 0,

      emotional: 0,

      energetic: 0,

      consciousness: 0,

      dominant_layer:
        "emotional",

      spiral_state:
        "processing",
    };
  }

  // --------------------------------------------------
  // 🌊 EMPTY
  // --------------------------------------------------

  if (!signals?.length) {

    return {

      physical: 0,

      emotional: 0,

      energetic: 0,

      consciousness: 0,

      dominant_layer:
        "emotional",

      spiral_state:
        "processing",
    };
  }

  // --------------------------------------------------
  // 🌈 TOTALS
  // --------------------------------------------------

  const totals: RealityLayers = {

    physical: 0,

    emotional: 0,

    energetic: 0,

    consciousness: 0,
  };

  let totalWeight = 0;

  // --------------------------------------------------
  // 🌊 AGGREGATE
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

      /*
       * --------------------------------------------
       * ⚡ FINAL WEIGHT
       * --------------------------------------------
       */

      const weight =

        intensity *
        timeWeight;

      totals.physical +=

        (layers.physical || 0)
        * weight;

      totals.emotional +=

        (layers.emotional || 0)
        * weight;

      totals.energetic +=

        (layers.energetic || 0)
        * weight;

      totals.consciousness +=

        (
          layers.consciousness
          || 0
        ) * weight;

      totalWeight +=
        weight;
    }
  );

  // --------------------------------------------------
  // 🌈 NORMALIZE
  // --------------------------------------------------

  const realityLayers = {

    physical: clamp(
      totals.physical /
      totalWeight
    ),

    emotional: clamp(
      totals.emotional /
      totalWeight
    ),

    energetic: clamp(
      totals.energetic /
      totalWeight
    ),

    consciousness: clamp(
      totals.consciousness /
      totalWeight
    ),
  };

  // --------------------------------------------------
  // 🌟 DOMINANT LAYER
  // --------------------------------------------------

  const dominant_layer =

    Object.entries(
      realityLayers
    ).sort(
      (a, b) =>
        Number(b[1]) -
        Number(a[1])
    )[0]?.[0] ||

    "emotional";

  // --------------------------------------------------
  // 🌀 SPIRAL STATE
  // --------------------------------------------------

  let spiral_state =
    "processing";

  if (
    realityLayers.consciousness >
    0.75
  ) {

    spiral_state =
      "integrating";
  }

  if (
    realityLayers.emotional >
      0.8
    &&
    realityLayers.consciousness <
      0.4
  ) {

    spiral_state =
      "emotionally_flooded";
  }

  if (
    realityLayers.physical >
      0.8
    &&
    realityLayers.emotional <
      0.3
  ) {

    spiral_state =
      "shutdown";
  }

  if (
    realityLayers.energetic >
      0.8
    &&
    realityLayers.consciousness >
      0.7
  ) {

    spiral_state =
      "expanding";
  }

  // --------------------------------------------------
  // ✅ RETURN
  // --------------------------------------------------

  return {

    ...realityLayers,

    dominant_layer,

    spiral_state,
  };
}