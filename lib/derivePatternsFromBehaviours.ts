import { supabase } from "../services/supabase";

console.log("🪞 PATTERN FUNCTION LOADED");

type BehaviourInput = {
  id: string;
  weight?: number;
};

type PatternScore = {
  id: string;
  score: number;
};

export async function derivePatternsFromBehaviours(

  behaviours: BehaviourInput[],

  source: string = "reflection",

  signalDepth: number = 1,
) {

  console.log(
    "🪞 INPUT BEHAVIOURS:",
    behaviours
  );

  // -----------------------------------
  // 🛡 EMPTY GUARD
  // -----------------------------------

  if (!behaviours?.length) {

    console.log(
      "⚠️ NO BEHAVIOURS PROVIDED"
    );

    return [];
  }

  const behaviourIds = behaviours.map(
    (b) => b.id
  );

  console.log(
    "🪞 BEHAVIOUR IDS:",
    behaviourIds
  );

  // -----------------------------------
  // 🧠 LOAD MAP ROWS
  // -----------------------------------

  const { data, error } = await supabase
    .from("behaviour_pattern_map")
    .select("*")
    .in("behaviour_id", behaviourIds);

  if (error) {

    console.error(
      "❌ PATTERN MAP ERROR:",
      error
    );

    return [];
  }

  console.log(
    "🪞 MAP ROWS:",
    data
  );

  // -----------------------------------
  // 🧠 SCORE PATTERNS
  // -----------------------------------

  const patternScores:
    Record<string, number> = {};

 // -----------------------------------
// ⚖️ DYNAMIC THRESHOLD
// -----------------------------------

let minimumWeight = 0.5;

// -----------------------------------
// 🌱 BASELINE
// -----------------------------------

if (source === "baseline") {

  minimumWeight = 0.75;
}

// -----------------------------------
// 📓 JOURNAL
// -----------------------------------

if (source === "journal") {

  minimumWeight = 0.55;
}

// -----------------------------------
// 🌌 GUIDANCE
// -----------------------------------

if (source === "guidance") {

  minimumWeight = 0.5;
}

// -----------------------------------
// 🌊 SIGNAL DEPTH SOFTENING
// -----------------------------------

if (signalDepth >= 4) {

  minimumWeight -= 0.1;
}   

  for (const row of data || []) {

    console.log(
      "🪞 PROCESSING ROW:",
      row
    );

    // -----------------------------------
// 🚫 SKIP WEAK MAPS
// -----------------------------------

if (
  (row.weight || 0)
    < minimumWeight
) {

  console.log(
    "⚖️ SKIPPING WEAK MAP:",
    row
  );

  continue;
}
    const behaviour =
      behaviours.find(
        (b) =>
          b.id === row.behaviour_id
      );

    console.log(
      "🪞 MATCHED BEHAVIOUR:",
      behaviour
    );

    const behaviourWeight =
      behaviour?.weight || 1;

    const mapWeight =
      row.weight || 1;

    const score =
      behaviourWeight * mapWeight;

    console.log(
      "🪞 SCORE:",
      {
        behaviourWeight,
        mapWeight,
        score,
        pattern: row.pattern_id,
      }
    );

    if (
      !patternScores[
        row.pattern_id
      ]
    ) {

      patternScores[
        row.pattern_id
      ] = 0;
    }

    patternScores[
      row.pattern_id
    ] += score;
  }

  console.log(
    "🪞 RAW PATTERN SCORES:",
    patternScores
  );

  // -----------------------------------
  // 🧠 SORT RESULTS
  // -----------------------------------

  const sorted: PatternScore[] =
    Object.entries(patternScores)

      .map(([id, score]) => ({
        id,
        score,
      }))

      .sort(
        (a, b) =>
          b.score - a.score
      );

  console.log(
    "🧠 DERIVED PATTERNS:",
    sorted
  );

  return sorted;
}