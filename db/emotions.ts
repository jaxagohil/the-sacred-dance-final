import { supabase } from "../services/supabase";

export const getEmotions = async (lang: string = "en") => {
  try {
    const { data, error } = await supabase
      .from("emotions")
      .select("id, word") // later: word_hi, word_es etc
      .order("word", { ascending: true });

    if (error) {
      console.error("EMOTIONS ERROR:", error);
      return [];
    }

    return (data || []).map((e) => ({
      id: e.id,
      label: e.word, // 👈 later switch based on lang
    }));
  } catch (err) {
    console.error("EMOTIONS FETCH FAILED:", err);
    return [];
  }
};