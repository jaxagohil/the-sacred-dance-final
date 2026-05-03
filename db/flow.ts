import { createReflection } from "./reflections";
import { createSignal } from "./signals";
import { interpretInput } from "../lib/ai/interpretInput";
import { supabase } from "../services/supabase";
import { buildEnergyFromBehaviours } from "../lib/energy/buildEnergyFromBehaviours";
import { getBehaviourLookup } from "../lib/energy/getBehaviourLookup";

export async function processReflection({
  userId,
  text,
  emotions,
  imageBase64,
  audioBase64,
  source,
  metadata,
  signalDepth,
}: any) {
  console.log("🚀 PROCESS REFLECTION START");

  if (
    !text &&
    !imageBase64 &&
    !audioBase64 &&
    (!emotions || emotions.length === 0)
  ) {
    throw new Error("No input provided for reflection");
  }

  const content_type =
    text && (imageBase64 || audioBase64)
      ? "mixed"
      : text
      ? "text"
      : imageBase64
      ? "image"
      : audioBase64
      ? "voice"
      : "none";

  const sourceType = source || "unknown";

  // ---------------------------
  // 🧾 SAVE REFLECTION
  // ---------------------------
  const reflection = await createReflection({
    userId,
    content: text || "",
    content_type,
    source,
    metadata: {
      emotions: emotions || [],
      input_mode: [
        ...(text ? ["text"] : []),
        ...(imageBase64 ? ["image"] : []),
        ...(audioBase64 ? ["voice"] : []),
      ],
      ...(metadata || {}),
    },
  });

  if (!reflection?.id) {
    throw new Error("Reflection insert failed");
  }

  console.log("🧾 REFLECTION CREATED:", reflection.id);

  // ---------------------------
  // 🧠 SIGNAL WEIGHTS
  // ---------------------------
  const DEFAULT_WEIGHTS = {
    baseline: 1.5,
    journal: 1.0,
    guidance: 0.9,
    landing: 0.6,
    unknown: 0.8,
  };

  const finalDepth =
    signalDepth ||
    DEFAULT_WEIGHTS[sourceType as keyof typeof DEFAULT_WEIGHTS] ||
    DEFAULT_WEIGHTS.unknown;

  // ---------------------------
  // 🧠 SHOULD USE AI?
  // ---------------------------
  const shouldUseAI =
    sourceType === "journal" ||
    sourceType === "guidance" ||
    sourceType === "landing" ||
    (sourceType === "baseline" && metadata?.type === "pattern");

  // ====================================================
  // 🌱 BASELINE
  // ====================================================
  if (sourceType === "baseline" && !shouldUseAI) {
    console.log("🌱 BASELINE SIGNAL (mapped + sliders)");

    const sliders = {
      givingreceiving: metadata?.sliders?.givingreceiving ?? 0,
      flowstructure: metadata?.sliders?.flowstructure ?? 0,
      abundancelack: metadata?.sliders?.abundancelack ?? 0,
    };

    const textLower = (text || "").toLowerCase();

    let detectedEmotion = "neutral";

    if (textLower.includes("alone")) detectedEmotion = "lonely";
    else if (textLower.includes("safe")) detectedEmotion = "calm";
    else if (textLower.includes("confused")) detectedEmotion = "confused";
    else if (textLower.includes("happy")) detectedEmotion = "happy";
    else if (textLower.includes("insecure")) detectedEmotion = "insecure";

    const { data: mappings } = await supabase
      .from("emotion_behaviour_map")
      .select("behaviour_id, weight")
      .eq("emotion_id", detectedEmotion);

    let behaviours =
      (mappings || []).map((m) => ({
        id: m.behaviour_id,
        weight: m.weight || 0.6,
      })) || [];

    // sliders → behaviours
    if (sliders.givingreceiving > 0.3) {
      behaviours.push({ id: "overgiving", weight: 1.2 });
    } else if (sliders.givingreceiving < -0.3) {
      behaviours.push({ id: "not_receiving", weight: 1.2 });
    } else {
      behaviours.push({ id: "receiving", weight: 0.8 });
    }

    if (sliders.flowstructure > 0.3) {
      behaviours.push({ id: "controlling", weight: 1.1 });
    } else if (sliders.flowstructure < -0.3) {
      behaviours.push({ id: "flowing", weight: 1.0 });
    }

    if (sliders.abundancelack < -0.3) {
      behaviours.push({ id: "scarcity", weight: 1.2 });
    } else if (sliders.abundancelack > 0.3) {
      behaviours.push({ id: "creating_abundance", weight: 1.0 });
    }

    if (!behaviours.length) {
      behaviours = [{ id: "present", weight: 1 }];
    }

    const patterns =
      metadata?.type === "pattern"
        ? [{ id: "self_doubt", weight: 1.2 }]
        : [];

    // 🔥 ENERGY (FIXED)
    const lookup = await getBehaviourLookup();
    const energy = buildEnergyFromBehaviours(behaviours, lookup);

    const signal = await createSignal(
      reflection.id,
      userId,
      {
        ai_behaviours: behaviours,
        ai_patterns: patterns,
        ai_confidence: null,
        ai_lens: { people: [], places: [], things: [] },
        ai_intensity: null,
        raw_text: text,
        energy,
      },
      sourceType,
      finalDepth
    );

    console.log("⚡ BASELINE SIGNAL CREATED:", signal);
    return reflection;
  }

  // ====================================================
  // 🧠 AI PIPELINE
  // ====================================================
  let interpretation: any = null;

  try {
    if (text && text.trim().length > 0) {
      interpretation = await interpretInput({
        text,
        emotions,
        image_base64: imageBase64,
        audio_base64: audioBase64,
        source: sourceType,
      });
    }
  } catch (e) {
    console.warn("⚠️ AI FAILED — continuing", e);
  }

  const normalize = (arr?: string[]) =>
    (arr || [])
      .map((e) => e?.toLowerCase().trim())
      .filter(Boolean);

  const EMOTION_MAP: Record<string, string> = {
    sadness: "sad",
    grief: "sad",
    joy: "happy",
    love: "loving",
    fear: "anxious",
    anger: "angry",
  };

  const normalizeEmotion = (e: string) => EMOTION_MAP[e] || e;

  const userEmotions = normalize(emotions);
  const aiEmotions = normalize(interpretation?.emotions).map(normalizeEmotion);

  let finalEmotions =
    userEmotions.length > 0 ? userEmotions : aiEmotions;

  if (!finalEmotions.length) finalEmotions = ["neutral"];

  const aiBehavioursRaw = normalize(interpretation?.behaviours);

  const { data: behaviourRows } = await supabase
    .from("behaviours")
    .select("id");

  const VALID_BEHAVIOURS = (behaviourRows || []).map((b) => b.id);

  const aiBehaviours = aiBehavioursRaw.filter((b) =>
    VALID_BEHAVIOURS.includes(b)
  );

  let behaviours: { id: string; weight: number }[] = [];

  if (aiBehaviours.length > 0) {
    behaviours = aiBehaviours.map((id) => ({
      id,
      weight: 1,
    }));
  } else {
    const { data: mappings } = await supabase
      .from("emotion_behaviour_map")
      .select("emotion_id, behaviour_id, weight")
      .in("emotion_id", finalEmotions);

    const behaviourWeights: Record<string, number> = {};

    (mappings || []).forEach((m) => {
      if (!m.behaviour_id) return;
      behaviourWeights[m.behaviour_id] =
        (behaviourWeights[m.behaviour_id] || 0) + (m.weight || 0);
    });

    behaviours = Object.entries(behaviourWeights).map(
      ([id, weight]) => ({ id, weight })
    );
  }

  if (!behaviours.length) {
    behaviours = [{ id: "present", weight: 1 }];
  }

  // 🔥 ENERGY (FIXED HERE TOO)
  const lookup = await getBehaviourLookup();
  const energy = buildEnergyFromBehaviours(behaviours, lookup);

  const signal = await createSignal(
    reflection.id,
    userId,
    {
      ai_behaviours: behaviours,
      ai_patterns: [],
      ai_confidence: interpretation?.ai_confidence ?? null,
      ai_lens: interpretation?.lens || {
        people: [],
        places: [],
        things: [],
      },
      ai_intensity: interpretation?.intensity ?? null,
      energy,
    },
    sourceType,
    finalDepth
  );

  console.log("⚡ SIGNAL CREATED:", signal);

  return reflection;
}