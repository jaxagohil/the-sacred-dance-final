// services/createReflection.ts

import { supabase } from "../services/supabase";

type CreateReflectionInput = {
  userId: string;

  content?: string;

  content_type?: string;

  source?: string;

  metadata?: Record<string, any>;

  // 🧠 semantic extraction
  extracted_emotions?: string[];

  extracted_patterns?: string[];

  extracted_behaviours?: string[];

  reflection_summary?: string;
};

export async function createReflection({
  userId,
  content,
  content_type,
  source,
  metadata,

  extracted_emotions = [],
  extracted_patterns = [],
  extracted_behaviours = [],

  reflection_summary = "",
}: CreateReflectionInput) {

  // ---------------------------------
  // 🛡 SAFETY
  // ---------------------------------

  if (!content && !metadata) {
    console.warn(
      "⚠️ Empty reflection — skipping insert"
    );

    return null;
  }

  // ---------------------------------
  // 🪞 INSERT PAYLOAD
  // ---------------------------------

  const payload = {
    user_id: userId,

    content: content || null,

    content_type:
      content_type || "text",

    source:
      source || "unknown",

    metadata:
      metadata || {},

    // 🧠 semantic layer
    extracted_emotions,

    extracted_patterns,

    extracted_behaviours,

    reflection_summary,
  };

  console.log(
    "📦 REFLECTION INSERT:",
    payload
  );

  // ---------------------------------
  // 💾 INSERT
  // ---------------------------------

  const { data, error } =
    await supabase
      .from("reflections")
      .insert([payload])
      .select()
      .maybeSingle();

  // ---------------------------------
  // ❌ ERROR
  // ---------------------------------

  if (error) {
    console.error(
      "❌ REFLECTION INSERT ERROR:",
      error
    );

    throw error;
  }

  // ---------------------------------
  // ✅ DONE
  // ---------------------------------

  return data;
}