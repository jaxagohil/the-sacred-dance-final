import { supabase } from "../services/supabase";

type Behaviour = {
  id: string;
  weight?: number;
};

type LensKey = "people" | "places" | "things";

type LensResult = {
  people: { id: string; score: number }[];
  places: { id: string; score: number }[];
  things: { id: string; score: number }[];
};

type DBRow = {
  behaviour_id: string;
  lens: LensKey;
  weight: number;
};

// ---------------------------
// 🧠 CLEAN HELPER
// ---------------------------
const clean = (str?: string) =>
  (str || "")
    .toLowerCase()
    .replace(/[_\s]/g, "")
    .replace(/[^\w]/g, "")
    .trim();

export async function deriveLensFromBehaviours(
  behaviours: Behaviour[]
): Promise<LensResult> {

  console.log("🔥 INPUT BEHAVIOURS:", behaviours);

  if (!behaviours?.length) {
    return {
      people: [],
      places: [],
      things: [],
    };
  }

  // ---------------------------
  // 🧠 NORMALIZE INPUT
  // ---------------------------
  const normalizedBehaviours = behaviours.map((b) => ({
    id: clean(b.id),
    originalId: b.id,
    weight: b.weight || 1,
  }));

  const ids = normalizedBehaviours.map((b) => b.id);

  console.log("🔥 NORMALIZED IDS:", ids);

  // ---------------------------
  // 🧠 FETCH DB ROWS
  // ---------------------------
  const { data: allRows, error } = await supabase
    .from("behaviour_lens_weights")
    .select("behaviour_id, lens, weight");

  if (error) {
    console.error("❌ Lens weight fetch error:", error);

    return {
      people: [],
      places: [],
      things: [],
    };
  }

  console.log(
    "🔥 DB IDS:",
    (allRows || []).map((r: DBRow) => `[${r.behaviour_id}]`)
  );

  // ---------------------------
  // 🧠 SAFE FILTER
  // ---------------------------
  const lookup = new Set(ids);

  const rows = (allRows || []).filter((row: DBRow) =>
    lookup.has(clean(row.behaviour_id))
  );

  console.log("🔥 FILTERED ROWS:", rows);

  if (rows.length === 0) {
    console.warn("⚠️ No lens weights found AFTER FILTER:", ids);
  }

  // ---------------------------
  // 🧠 BUILD MAP
  // ---------------------------
  const map: Record<
    string,
    {
      people: number;
      places: number;
      things: number;
    }
  > = {};

  rows.forEach((row: DBRow) => {

    const key = clean(row.behaviour_id);

    if (!map[key]) {
      map[key] = {
        people: 0,
        places: 0,
        things: 0,
      };
    }

    map[key][row.lens] = row.weight;
  });

  console.log("🔥 LENS MAP:", map);

  // ---------------------------
  // 🧠 BUILD RESULT
  // ---------------------------
  const result: LensResult = {
    people: [],
    places: [],
    things: [],
  };

  normalizedBehaviours.forEach((b) => {

    const mapping = map[b.id];

    if (!mapping) {
      console.warn("⚠️ No mapping for behaviour:", b.id);
      return;
    }

    const scores = {
      people: mapping.people * b.weight,
      places: mapping.places * b.weight,
      things: mapping.things * b.weight,
    };

    if (scores.people > 0.3) {
      result.people.push({
        id: b.originalId,
        score: scores.people,
      });
    }

    if (scores.places > 0.3) {
      result.places.push({
        id: b.originalId,
        score: scores.places,
      });
    }

    if (scores.things > 0.3) {
      result.things.push({
        id: b.originalId,
        score: scores.things,
      });
    }
  });

  // ---------------------------
  // 🧠 SORT
  // ---------------------------
  result.people.sort((a, b) => b.score - a.score);
  result.places.sort((a, b) => b.score - a.score);
  result.things.sort((a, b) => b.score - a.score);

  console.log("🔥 FINAL LENS RESULT:", result);

  return result;
}