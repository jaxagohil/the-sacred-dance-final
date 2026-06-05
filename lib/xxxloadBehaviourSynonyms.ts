import { supabase } from "../services/supabase";

let BEHAVIOUR_MAP:
  Record<string, string> = {};

let isLoaded = false;

//
// 🌍 NORMALIZE
//

function normalize(
  value: string
) {

  return value
    ?.toLowerCase()
    .trim();
}

//
// 🧠 LOAD BEHAVIOUR SYNONYMS
//

export async function loadBehaviourSynonyms() {

  if (isLoaded) {

    return BEHAVIOUR_MAP;
  }

  const {
    data,
    error,
  } = await supabase

    .from("behaviour_synonyms")

    .select(
      "synonym, behaviour_id"
    );

  if (error) {

    console.error(
      "❌ Behaviour synonym load error:",
      error
    );

    return {};
  }

  BEHAVIOUR_MAP = {};

  (data || []).forEach((row) => {

    const key =
      normalize(
        row.synonym
      );

    if (!key) {
      return;
    }

    BEHAVIOUR_MAP[key] =
      row.behaviour_id;
  });

  isLoaded = true;

  console.log(
    "✅ Behaviour synonyms loaded:",
    Object.keys(
      BEHAVIOUR_MAP
    ).length
  );

  return BEHAVIOUR_MAP;
}