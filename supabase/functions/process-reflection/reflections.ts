// services/createReflection.ts

import { supabase } from "./supabase.ts";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type CreateReflectionInput = {

  // --------------------------------------------------
  // 👤 CORE
  // --------------------------------------------------

  userId: string;

  content?: string;

  content_type?: string;

  source?: string;

  metadata?: Record<
    string,
    any
  >;

  // --------------------------------------------------
  // 🧠 SEMANTIC EXTRACTION
  // --------------------------------------------------

  extracted_emotions?:
    string[];

  extracted_patterns?:
    string[];

  extracted_behaviours?:
    string[];

  reflection_summary?:
    string;
};

// --------------------------------------------------
// 🚀 CREATE REFLECTION
// --------------------------------------------------

export async function
createReflection({

  // --------------------------------------------------
  // 👤 CORE
  // --------------------------------------------------

  userId,

  content,

  content_type,

  source,

  metadata,

  // --------------------------------------------------
  // 🧠 SEMANTIC EXTRACTION
  // --------------------------------------------------

  extracted_emotions = [],

  extracted_patterns = [],

  extracted_behaviours = [],

  reflection_summary = "",

}: CreateReflectionInput) {

  // ---------------------------------
  // 🛡 SAFETY
  // ---------------------------------

  if (
    !content &&
    !metadata
  ) {

    console.warn(
      "⚠️ Empty reflection — skipping insert"
    );

    return null;
  }

  // ---------------------------------
  // 🪞 INSERT PAYLOAD
  // ---------------------------------

  const payload = {

    // ---------------------------------
    // 👤 CORE
    // ---------------------------------

    user_id: userId,

    content:
      content || null,

    content_type:

      content_type ||
      "text",

    source:
      source ||
      "unknown",

    metadata:
      metadata || {},

    // ---------------------------------
    // 🧠 SEMANTIC EXTRACTION
    // ---------------------------------

    extracted_emotions,

    extracted_patterns,

    extracted_behaviours,

    reflection_summary,

    // ---------------------------------
    // ⚡ PROCESSING STATE
    // ---------------------------------

    signal_processed:
      false,

    processing_started_at:
      null,

    processed_at:
      null,
  };

  // ---------------------------------
  // 🪞 DEBUG
  // ---------------------------------

  console.log(
    "📦 REFLECTION INSERT:",
    payload
  );

  // ---------------------------------
  // 💾 INSERT
  // ---------------------------------

  const {
    data,
    error,
  } = await supabase

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
  // ✅ SUCCESS
  // ---------------------------------

  console.log(
    "🪞 REFLECTION CREATED:",
    {

      id:
        data?.id,

      source:
        data?.source,

      content_type:

        data
          ?.content_type,

      signal_processed:

        data
          ?.signal_processed,
    }
  );

  // ---------------------------------
  // ✨ RETURN
  // ---------------------------------

  return data;
}