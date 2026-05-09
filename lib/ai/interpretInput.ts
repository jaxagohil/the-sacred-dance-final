import { API_URL } from "../../lib/config";

import {
  VALID_BEHAVIOURS,
  VALID_EMOTIONS,
  loadValidSignals,
} from "../loadValidSignals";

import { loadBehaviourSynonyms } from "../loadBehaviourSynonyms";
import { loadEmotionSynonyms } from "../loadEmotionSynonyms";

// ----------------------------------
// 🧠 TYPES
// ----------------------------------

type InterpretInputArgs = {
  text?: string;

  emotions?: string[];

  childhoodSignals?: Record<
    string,
    number
  >;

  pattern?: string;

  energyAxes?: any;

  source?: string;

  image_base64?: string;

  audio_base64?: string;
};

// ----------------------------------
// 🧠 NORMALIZE
// ----------------------------------

const normalize = (arr?: string[]) =>
  (arr || [])
    .map((v) =>
      v?.toLowerCase().trim()
    )
    .filter(Boolean);

// ----------------------------------
// 🧠 INTERPRET
// ----------------------------------

export async function interpretInput(
  input: InterpretInputArgs
) {

  // ----------------------------------
  // 🛡 LOAD SYSTEM REGISTRIES
  // ----------------------------------

  await loadValidSignals();

  const emotionMap =
    await loadEmotionSynonyms();

  const behaviourMap =
    await loadBehaviourSynonyms();

  console.log(
    "🧠 INTERPRET API:",
    `${API_URL}/api/interpret`
  );

  try {

    // ----------------------------------
    // 🚀 AI REQUEST
    // ----------------------------------

    const res = await fetch(
      `${API_URL}/api/interpret`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(input),
      }
    );

    // ----------------------------------
    // ❌ FAILED
    // ----------------------------------

    if (!res.ok) {

      console.error(
        "❌ INTERPRET API FAILED"
      );

      return {

        emotions: [],

        behaviours: [],

        polarity: null,

        intensity: 1,

        ai_confidence: null,

        reflection_summary: null,

        lens: {
          people: [],
          places: [],
          things: [],
        },

        // 🌍 levels
        levels: {
          physical: 0.5,
          emotional: 0.5,
          energetic: 0.5,
        },

        // ✨ consciousness
        consciousness_movement: {
          reactivity: 0.5,
          awareness: 0.5,
          responsibility: 0.5,
          embodiment: 0.5,
          integration: 0.5,
        },
      };
    }

    // ----------------------------------
    // 📦 RAW RESPONSE
    // ----------------------------------

    const data = await res.json();

    console.log(
      "🔥 RAW AI RESPONSE:",
      data
    );

    // ----------------------------------
    // 😊 RAW AI EMOTIONS
    // ----------------------------------

    console.log(
      "🔥 RAW AI EMOTIONS:",
      data?.emotions
    );

    // ----------------------------------
    // 🧠 CLEAN EMOTIONS
    // ----------------------------------

    const aiEmotions =
      normalize(data?.emotions)

        .map((e) =>
          emotionMap[e] || e
        )

        .filter((e) =>
          VALID_EMOTIONS.includes(e)
        );

    console.log(
      "😊 CLEANED EMOTIONS:",
      aiEmotions
    );

    // ----------------------------------
    // 🧠 CLEAN BEHAVIOURS
    // ----------------------------------

    const aiBehaviours =
      normalize(data?.behaviours)

        .map((b) =>
          behaviourMap[b] || b
        )

        .filter((b) =>
          VALID_BEHAVIOURS.includes(b)
        );

    console.log(
      "🧠 CLEANED BEHAVIOURS:",
      aiBehaviours
    );

    // ----------------------------------
    // 🛡 FALLBACK EMOTIONS
    // ----------------------------------

    const fallbackEmotions =
      normalize(input.emotions)

        .map((e) =>
          emotionMap[e] || e
        )

        .filter((e) =>
          VALID_EMOTIONS.includes(e)
        );

    // ----------------------------------
    // 🧠 FINAL EMOTIONS
    // ----------------------------------

    const finalEmotions =
      aiEmotions.length > 0
        ? aiEmotions
        : fallbackEmotions;

    // ----------------------------------
    // 🧠 FINAL CLEAN OBJECT
    // ----------------------------------

    const cleaned = {

      emotions:
        finalEmotions,

      behaviours:
        aiBehaviours,

      polarity:
        data?.polarity ?? null,

      intensity:
        data?.intensity ?? 1,

      ai_confidence:
        data?.ai_confidence ?? null,

      reflection_summary:
        data?.reflection_summary
        || null,

      lens:
        data?.lens || {
          people: [],
          places: [],
          things: [],
        },

      // 🌍 levels
      levels:
        data?.levels || {
          physical: 0.5,
          emotional: 0.5,
          energetic: 0.5,
        },

      // ✨ consciousness
      consciousness_movement:
        data?.consciousness_movement || {

          reactivity: 0.5,

          awareness: 0.5,

          responsibility: 0.5,

          embodiment: 0.5,

          integration: 0.5,
        },
    };

    console.log(
      "🧠 CLEANED AI:",
      cleaned
    );

    return cleaned;

  } catch (e) {

    console.error(
      "❌ interpretInput error:",
      e
    );

    return {

      emotions: [],

      behaviours: [],

      polarity: null,

      intensity: 1,

      ai_confidence: null,

      reflection_summary: null,

      lens: {
        people: [],
        places: [],
        things: [],
      },

      // 🌍 levels
      levels: {
        physical: 0.5,
        emotional: 0.5,
        energetic: 0.5,
      },

      // ✨ consciousness
      consciousness_movement: {
        reactivity: 0.5,
        awareness: 0.5,
        responsibility: 0.5,
        embodiment: 0.5,
        integration: 0.5,
      },
    };
  }
}