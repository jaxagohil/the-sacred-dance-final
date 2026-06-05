// lib/spiral/enrichSpiralState.ts

type Behaviour = {

  id: string;

  physical_weight?: number;

  emotional_weight?: number;

  energetic_weight?: number;

  consciousness_weight?: number;
};

type Pattern = {

  id: string;

  weight?: number;

  left_pole?: string;

  right_pole?: string;

  center_expression?: string;

  chakra?: string;

  secondary_chakra?: string[];

  default_direction?: number;
};

type RealityLayers = {

  physical: number;

  emotional: number;

  energetic: number;

  consciousness: number;
};

type Props = {

  behaviours: Behaviour[];

  patterns: Pattern[];

  reality_layers: RealityLayers;
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
 * 🌊 ENRICH SPIRAL STATE
 * --------------------------------------------------
 */

export function enrichSpiralState({

  behaviours,

  patterns,

  reality_layers,

}: Props) {

  /*
   * --------------------------------------------------
   * 🌗 POLE SCORES
   * --------------------------------------------------
   */

  let leftPoleScore = 0;

  let rightPoleScore = 0;

  let centerScore = 0;

  patterns.forEach(
    (pattern) => {

      const direction =

        pattern.default_direction || 0;

      /*
       * ----------------------------------------------
       * ← LEFT
       * ----------------------------------------------
       */

      if (direction < 0) {

        leftPoleScore +=
          Math.abs(direction);
      }

      /*
       * ----------------------------------------------
       * → RIGHT
       * ----------------------------------------------
       */

      if (direction > 0) {

        rightPoleScore +=
          direction;
      }

      /*
       * ----------------------------------------------
       * ☯ CENTER
       * ----------------------------------------------
       */

      if (
        reality_layers.consciousness >
          0.65
      ) {

        centerScore += 1;
      }
    }
  );

  /*
   * --------------------------------------------------
   * 🌈 CHAKRA ACTIVATION
   * --------------------------------------------------
   */

  const chakraActivation:
    Record<string, number> = {

      root: 0,

      sacral: 0,

      solar: 0,

      heart: 0,

      throat: 0,

      third_eye: 0,

      crown: 0,
    };

  patterns.forEach(
    (pattern) => {

      const weight =
        pattern.weight || 1;

      /*
       * ----------------------------------------------
       * PRIMARY
       * ----------------------------------------------
       */

      if (pattern.chakra) {

        chakraActivation[
          pattern.chakra
        ] += weight;
      }

      /*
       * ----------------------------------------------
       * SECONDARY
       * ----------------------------------------------
       */

      if (
        pattern.secondary_chakra
      ) {

        pattern.secondary_chakra.forEach(
          (chakra) => {

            chakraActivation[
              chakra
            ] += weight * 0.5;
          }
        );
      }
    }
  );

  const normalizedChakras =
    normalizeMap(
      chakraActivation
    );

  /*
   * --------------------------------------------------
   * 🧘 INTEGRATION SCORE
   * --------------------------------------------------
   */

  const poleDifference =

    Math.abs(
      leftPoleScore -
      rightPoleScore
    );

  const integrationScore =

    clamp(

      (
        reality_layers.consciousness
        +
        centerScore
      )

      /

      (
        poleDifference + 1
      )
    );

  /*
   * --------------------------------------------------
   * 🌊 SPIRAL DIRECTION
   * --------------------------------------------------
   */

  let spiral_direction =
    "processing";

  /*
   * ----------------------------------------------
   * 🌑 CONTRACTING
   * ----------------------------------------------
   */

  if (

    reality_layers.emotional >
      0.8

    &&

    reality_layers.consciousness <
      0.4

  ) {

    spiral_direction =
      "contracting";
  }

  /*
   * ----------------------------------------------
   * 🌕 EXPANDING
   * ----------------------------------------------
   */

  if (

    reality_layers.energetic >
      0.7

    &&

    reality_layers.consciousness >
      0.6

  ) {

    spiral_direction =
      "expanding";
  }

  /*
   * ----------------------------------------------
   * ☯ INTEGRATING
   * ----------------------------------------------
   */

  if (
    integrationScore >
    0.7
  ) {

    spiral_direction =
      "integrating";
  }

  /*
   * ----------------------------------------------
   * 🌀 OSCILLATING
   * ----------------------------------------------
   */

  if (

    leftPoleScore > 1

    &&

    rightPoleScore > 1

  ) {

    spiral_direction =
      "oscillating";
  }

  /*
   * ----------------------------------------------
   * 💤 STAGNATING
   * ----------------------------------------------
   */

  if (

    reality_layers.physical >
      0.7

    &&

    reality_layers.emotional <
      0.3

    &&

    reality_layers.energetic <
      0.3

  ) {

    spiral_direction =
      "stagnating";
  }

  /*
   * --------------------------------------------------
   * 🌟 DOMINANT POLE
   * --------------------------------------------------
   */

  let dominant_pole =
    "center";

  if (
    leftPoleScore >
    rightPoleScore
  ) {

    dominant_pole =
      "left";
  }

  if (
    rightPoleScore >
    leftPoleScore
  ) {

    dominant_pole =
      "right";
  }

  /*
   * --------------------------------------------------
   * 🪞 DOMINANT PATTERN
   * --------------------------------------------------
   */

  const dominantPattern =

    patterns.sort(
      (a, b) =>

        (b.weight || 0)
        -

        (a.weight || 0)
    )[0];

  /*
   * --------------------------------------------------
   * ✅ RETURN
   * --------------------------------------------------
   */

  return {

    spiral_state:
      spiral_direction,

    spiral_direction,

    dominant_pole,

    integration_score:
      integrationScore,

    left_pole_score:
      clamp(
        leftPoleScore
      ),

    right_pole_score:
      clamp(
        rightPoleScore
      ),

    chakra_activation:
      normalizedChakras,

    dominant_pattern:
      dominantPattern?.id ||

      null,
  };
}