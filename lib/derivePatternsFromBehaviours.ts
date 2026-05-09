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
  behaviours: BehaviourInput[]
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

  for (const row of data || []) {

    console.log(
      "🪞 PROCESSING ROW:",
      row
    );

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