import { supabase } from "../services/supabase";

let EMOTION_MAP: Record<string, string> = {};

let isLoaded = false;

export async function loadEmotionSynonyms() {

  if (isLoaded) {
    return EMOTION_MAP;
  }

  const { data, error } = await supabase
    .from("emotion_synonyms")
    .select("synonym, emotion_id");

  if (error) {

    console.error(
      "❌ Emotion synonym load error:",
      error
    );

    return {};
  }

  EMOTION_MAP = {};

  (data || []).forEach((row) => {

    EMOTION_MAP[
      row.synonym.toLowerCase()
    ] = row.emotion_id;
  });

  isLoaded = true;

  console.log(
    "✅ Emotion synonyms loaded:",
    Object.keys(EMOTION_MAP).length
  );

  return EMOTION_MAP;
}