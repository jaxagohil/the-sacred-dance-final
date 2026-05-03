type InterpretInputArgs = {
  text?: string;
  emotions?: string[];
  image_base64?: string;
  audio_base64?: string;
  source?: string; // ✅ NEW
};

// 🌐 UPDATE THIS WHEN YOUR IP CHANGES
const API_URL = "https://wing-manor-unsecured.ngrok-free.dev";

// ✅ controlled vocab (DB aligned)
const VALID_EMOTIONS = [
  "angry","anxious","calm","confident","confused","content","curious",
  "disconnected","frustrated","grateful","happy","heavy","hopeful",
  "hurt","insecure","inspired","lonely","loving","neutral","numb",
  "off","open","overwhelmed","peaceful","reflective","restless",
  "sad","tired","uncertain","crying"
];

const VALID_BEHAVIOURS = [
  "avoiding","connected","controlling","creating_abundance","decisive",
  "direct","disconnected","expressing","flowing","focused","grounded",
  "hiding","intuitive","losing_money","not_receiving","open",
  "over_responsibility","overgiving","overthinking","overwhelmed",
  "pausing","people_pleasing","present","processing","reacting",
  "receiving","reflecting","seeking_validation","self_doubt",
  "self_trusting","trusting_life","withdrawing"
];

const VALID_PATTERNS = [
  "abandonment","abundance","alignment","avoidance","connection","control",
  "disconnection","expression","flow","instability","over_responsibility",
  "presence","receiving","scarcity","self_doubt","stability","suppression","trust"
];

// 🔧 fallback normalization
const EMOTION_MAP: Record<string, string> = {
  sadness: "sad",
  grief: "sad",
  joy: "happy",
  love: "loving",
  fear: "anxious",
  anger: "angry",
};

const normalize = (arr?: string[]) =>
  (arr || [])
    .map((e) => e?.toLowerCase().trim())
    .filter(Boolean);

const normalizeEmotion = (e: string) =>
  EMOTION_MAP[e] || e;

// 🛡 consistent empty fallback
const EMPTY_RESULT = {
  emotions: [],
  behaviours: [],
  patterns: [],
  polarity: null,
  intensity: null,
  ai_confidence: null,
  lens: { people: [], places: [], things: [] },
};

export async function interpretInput(input: InterpretInputArgs) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    console.log("🔥 INTERPRET CALLED:", input.source);

    const res = await fetch(`${API_URL}/api/interpret`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...input,
        source: input.source, // ✅ PASS SOURCE
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.error("❌ API failed:", res.status);
      return EMPTY_RESULT;
    }

    const data = await res.json();

    console.log("🔥 RAW AI RESPONSE:", data);

    // --------------------------
    // ✅ CLEAN + VALIDATE
    // --------------------------

    const aiEmotions = normalize(data?.emotions)
      .map(normalizeEmotion)
      .filter((e) => VALID_EMOTIONS.includes(e));

    const aiBehaviours = normalize(data?.behaviours)
      .filter((b) => VALID_BEHAVIOURS.includes(b));

    const aiPatterns = normalize(data?.patterns)
      .filter((p) => VALID_PATTERNS.includes(p));

    // --------------------------
    // 🛡️ FALLBACKS
    // --------------------------

    const fallbackEmotions = normalize(input.emotions)
      .filter((e) => VALID_EMOTIONS.includes(e));

    const finalEmotions =
      aiEmotions.length > 0 ? aiEmotions : fallbackEmotions;

    const finalBehaviours =
      aiBehaviours.length > 0 ? aiBehaviours : [];

    // --------------------------
    // 🧠 INTENSITY (SOURCE-AWARE)
    // --------------------------

    const rawIntensity =
      typeof data?.intensity === "number"
        ? Math.min(Math.max(data.intensity, 0), 1)
        : null;

    const intensity =
      input.source === "landing"
        ? rawIntensity !== null
          ? rawIntensity * 0.7 // 🔥 soften landing
          : null
        : rawIntensity;

    const polarity =
      data?.polarity === "expansion" || data?.polarity === "contraction"
        ? data.polarity
        : null;

    const lens = {
      people: normalize(data?.lens?.people),
      places: normalize(data?.lens?.places),
      things: normalize(data?.lens?.things),
    };

    // --------------------------
    // 🎯 PATTERN CONTROL (LANDING SAFE)
    // --------------------------

    const finalPatterns =
      input.source === "landing"
        ? aiPatterns.slice(0, 1) // 🔥 limit pattern strength
        : aiPatterns;

    // --------------------------
    // ⚠️ EMPTY SIGNAL GUARD
    // --------------------------

    if (
      finalEmotions.length === 0 &&
      finalBehaviours.length === 0 &&
      finalPatterns.length === 0
    ) {
      console.warn("⚠️ Empty signal — skipping");
      return EMPTY_RESULT;
    }

    const cleaned = {
      emotions: finalEmotions,
      behaviours: finalBehaviours,
      patterns: finalPatterns,
      polarity,
      intensity,
      ai_confidence: data?.ai_confidence ?? null,
      lens,
    };

    console.log("🧠 CLEANED AI:", cleaned);

    return cleaned;

  } catch (e) {
    console.error("❌ interpretInput error:", e);
    return EMPTY_RESULT;
  }
}