import { supabase } from "../services/supabase";

type BehaviourWeight = {
  id: string;
  weight: number;
};

type PatternWeight = {
  id: string;
  weight: number;
};

type SignalPayload = {
  ai_behaviours: BehaviourWeight[];
  ai_patterns?: PatternWeight[];

  ai_confidence?: number | null;
  ai_intensity?: number | null;

  ai_lens?: {
    people?: string[];
    places?: string[];
    things?: string[];
  };

  raw_text?: string;

  energy?: any; // 🔥 ADD THIS
};

export async function createSignal(
  reflectionId: string,
  userId: string,
  payload: SignalPayload,
  sourceType: string,
  signalDepth: number
) {
  const hasBehaviours =
    payload.ai_behaviours && payload.ai_behaviours.length > 0;

  const hasRawText =
    payload.raw_text && payload.raw_text.trim().length > 0;

  if (!hasBehaviours && !hasRawText) {
    console.warn("⚠️ Empty signal — skipping");
    return null;
  }

  const { data, error } = await supabase
    .from("signals")
    .insert([
      {
        reflection_id: reflectionId,
        user_id: userId,

        // ✅ CORE DATA
        ai_behaviours: payload.ai_behaviours,
        ai_patterns: payload.ai_patterns || [],

        // ✅ META
        ai_confidence: payload.ai_confidence ?? null,

        ai_lens: payload.ai_lens || {
          people: [],
          places: [],
          things: [],
        },

        ai_intensity: payload.ai_intensity ?? null,

        energy: payload.energy || null, // 🔥 ADD THIS

        sourcetype: sourceType || "unknown",
        signal_depth: signalDepth ?? 1,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("❌ SIGNAL INSERT ERROR:", error);
    throw error;
  }

  console.log("⚡ SIGNAL CREATED:", data);

  return data;
}