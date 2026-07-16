// lib/spiral/enrichSpiralState.ts

type Behaviour = {

  id: string;

  physical_weight?: number;

  emotional_weight?: number;

  energetic_weight?: number;

  consciousness_weight?: number;

    feel_weight?: number;
  think_weight?: number;
  say_weight?: number;
  do_weight?: number;
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
 * 🪞 EXPRESSION PROFILE
 * --------------------------------------------------
 */

const expression_profile = {

  feel: 0,

  think: 0,

  say: 0,

  do: 0,
};

behaviours.forEach((behaviour) => {

  expression_profile.feel +=
    behaviour.feel_weight || 0;

  expression_profile.think +=
    behaviour.think_weight || 0;

  expression_profile.say +=
    behaviour.say_weight || 0;

  expression_profile.do +=
    behaviour.do_weight || 0;
});

const normalizedExpression = normalizeMap(
  expression_profile
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
 * 🌊 SPIRAL ENGINE
 * --------------------------------------------------
 */

const spiral_scores = {

  awareness: 0,

  observation: 0,

  reflection: 0,

  choice: 0,

  integration: 0,

  embodiment: 0,
};

 /*
 * --------------------------------------------------
 * 🌍 REALITY LAYERS
 * --------------------------------------------------
 */

spiral_scores.awareness +=
  reality_layers.physical;

spiral_scores.observation +=
  reality_layers.emotional;

spiral_scores.reflection +=
  reality_layers.consciousness;
  
/*
 * --------------------------------------------------
 * 🪞 EXPRESSION PROFILE
 * --------------------------------------------------
 */

spiral_scores.observation +=
  normalizedExpression.feel;

spiral_scores.reflection +=
  normalizedExpression.think;

spiral_scores.choice +=
  normalizedExpression.say;

spiral_scores.embodiment +=
  normalizedExpression.do;
  
/*
 * --------------------------------------------------
 * 🧘 INTEGRATION
 * --------------------------------------------------
 */

spiral_scores.integration +=
  integrationScore;

spiral_scores.embodiment +=
  integrationScore * 0.5;
  
  
/*
 * --------------------------------------------------
 * 🌈 CHAKRA EVIDENCE
 * --------------------------------------------------
 */

spiral_scores.awareness +=
  normalizedChakras.root;

spiral_scores.observation +=
  normalizedChakras.sacral;

spiral_scores.reflection +=
  normalizedChakras.heart;

spiral_scores.choice +=
  normalizedChakras.throat;

spiral_scores.integration +=
  normalizedChakras.third_eye;

spiral_scores.embodiment +=
  normalizedChakras.crown;
  
/*
 * --------------------------------------------------
 * 🌊 TOTAL SPIRAL SCORES
 * --------------------------------------------------
 */

const totalSpiralScore =

  Object.values(
    spiral_scores
  ).reduce(
    (sum, value) => sum + value,
    0
  );

const normalizedSpiralScores =

  Object.fromEntries(

    Object.entries(
      spiral_scores
    ).map(
      ([key, value]) => [

        key,

        totalSpiralScore > 0
          ? clamp(
              value /
              totalSpiralScore
            )
          : 0,
      ]
    )

  );
  
/*
 * --------------------------------------------------
 * 🌊 DOMINANT SPIRAL STAGE
 * --------------------------------------------------
 */

const sortedStages =

  Object.entries(
    normalizedSpiralScores
  )

    .sort(
      (a, b) => b[1] - a[1]
    );

const spiral_state =
  sortedStages[0][0];
  
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

    spiral_state,

    spiral_scores:
  normalizedSpiralScores,

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

      expression_profile:
  normalizedExpression,
  };
}