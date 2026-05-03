import { supabase } from "../services/supabase";

export async function createReflection({
  userId,
  content,
  content_type,
  source,
  metadata,
}: any) {
  if (!content && !metadata) {
    console.warn("⚠️ Empty reflection — skipping insert");
    return null;
  }

  const { data, error } = await supabase
    .from("reflections")
    .insert([
      {
        user_id: userId,
        content,
        content_type,
        source,
        metadata,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("❌ REFLECTION INSERT ERROR:", error);
    throw error;
  }

  return data;
}