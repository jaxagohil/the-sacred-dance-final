import { supabase } from "../../services/supabase";
import { getUserId } from "../user";

export async function getLifePicture() {
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("sovereign_life_pictures")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("❌ LIFE PICTURE FETCH ERROR:", error);
    return null;
  }

  return data;
}