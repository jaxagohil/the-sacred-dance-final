// /lib/energy.ts

export type Chakra =
  | "soul_star"
  | "crown"
  | "third_eye"
  | "throat"
  | "heart"
  | "solar_plexus"
  | "sacral"
  | "root"
  | "earth_star";

export const chakraOrder: Chakra[] = [
  "soul_star",
  "crown",
  "third_eye",
  "throat",
  "heart",
  "solar_plexus",
  "sacral",
  "root",
  "earth_star",
];

//
// 🎯 Y positions
//

export const chakraY: Record<
  Chakra,
  number
> = {

  soul_star: -15,

  crown: 13,

  third_eye: 30,

  throat: 57,

  heart: 105,

  solar_plexus: 140,

  sacral: 160,

  root: 185,

  earth_star: 270,
};
//
// 🎨 Colors
//

export const chakraColours: Record<Chakra, string> = {
  soul_star: "#f8f2dc",
  crown: "#de9fed",
  third_eye: "#7a6cff",
  throat: "#34b3da",
  heart: "#0c5c29",
  solar_plexus: "#facc15",
  sacral: "#fb923c",
  root: "#a11f1f",
  earth_star: "#4f4e52",
};

//
// 🧠 Energy state type
//

export type EnergyState = {
  dominant: Chakra;
  scores: Record<Chakra, { score: number }>;
};

//
// 🔥 CORE: Build FULL chakra system
//

export function buildFullChakraScores(
  raw: Record<string, number> = {}
): Record<Chakra, { score: number }> {

  const result =
    {} as Record<
      Chakra,
      { score: number }
    >;

  const values =
    Object.values(raw);

  const avg =
    values.length > 0

      ? values.reduce(
          (a, b) => a + b,
          0
        ) / values.length

      : 0.1;

  chakraOrder.forEach((key) => {

    let score = raw[key];

    //
    // 🔁 derive missing chakras intelligently
    //

    if (score === undefined) {

      if (key === "third_eye") {

        score =
          (
            (raw.crown ?? avg) +
            (raw.throat ?? avg)
          ) / 2;

      } else if (
        key === "soul_star"
      ) {

        score =
          (
            (raw.crown ?? avg) +
            avg
          ) / 2;

      } else if (
        key === "earth_star"
      ) {

        score =
          (
            (raw.root ?? avg) +
            avg
          ) / 2;

      } else {

        score = avg;
      }
    }

    result[key] = {
      score,
    };
  });

  return result;
}

//
// 🧠 Awareness
//

export function getAwarenessChakra(
  scores: Record<
    Chakra,
    { score: number }
  >
): Chakra {

  const values =
    Object.values(scores)
      .map((s) => s.score);

  const avg =
    values.reduce(
      (a, b) => a + b,
      0
    ) / values.length;

  let target: Chakra =
    "heart";

  let maxGap =
    -Infinity;

  Object.entries(scores)
    .forEach(([key, val]) => {

      //
      // only consider UNDERACTIVE chakras
      //

      if (val.score < avg) {

        const gap =
          avg - val.score;

        if (gap > maxGap) {

          maxGap = gap;

          target =
            key as Chakra;
        }
      }
    });

  return target;
}

//
// ⚠️ DEV ONLY
// fallback generator
//

export function getEnergyState(): EnergyState {

  const scores =
    {} as Record<
      Chakra,
      { score: number }
    >;

  let total = 0;

  chakraOrder.forEach((c) => {

    const value =
      Math.random();

    scores[c] = {
      score: value,
    };

    total += value;
  });

  chakraOrder.forEach((c) => {

    scores[c].score =
      scores[c].score / total;
  });

  let dominant: Chakra =
    chakraOrder[0];

  let max =
    -Infinity;

  chakraOrder.forEach((c) => {

    const value =
      scores[c].score;

    if (value > max) {

      max = value;

      dominant = c;
    }
  });

  return {
    dominant,
    scores,
  };
}