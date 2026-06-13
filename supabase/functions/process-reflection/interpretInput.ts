import {
  VALID_BEHAVIOURS,
  VALID_EMOTIONS,
  loadValidSignals,
} from "./loadValidSignals.ts";

import { loadBehaviourSynonyms } from "./loadBehaviourSynonyms.ts";
import { loadEmotionSynonyms } from "./loadEmotionSynonyms.ts";

import {
  saveUnknownSignals,
} from "./saveUnknownSignals.ts";

// ----------------------------------
// 🧠 TYPES
// ----------------------------------

type InterpretInputArgs = {

  language?: string;

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

      v
        ?.toString()
        .toLowerCase()
        .trim()
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
  "🧪 SELF_REFLECTION MAP:",
  behaviourMap["self_reflection"]
);


  try {

    // ----------------------------------
    // 🚀 AI REQUEST
    // ----------------------------------

const res = await fetch(
  "https://ezhqfbedncqrajfhsqhp.supabase.co/functions/v1/interpret",
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

  const rawError =
    await res.text();

  console.error(
    "❌ INTERPRET API FAILED:",
    rawError
  );

return {

  emotions: [],

  behaviours: [],

  people: [],

  places: [],

  things: [],

  people_entities: [],

  places_entities: [],

  things_entities: [],

  polarity: null,

  intensity: 1,

  ai_confidence: null,

  reflection_summary: null,

  lens: {

    people: [],

    places: [],

    things: [],
  },

  levels: {

    physical: 0.5,

    emotional: 0.5,

    energetic: 0.5,
  },

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

    console.log(
  "🧩 RAW ENTITIES",
  {
    people: data?.people,
    places: data?.places,
    things: data?.things,
    people_entities: data?.people_entities,
    places_entities: data?.places_entities,
    things_entities: data?.things_entities,
  }
);

    // ----------------------------------
    // 😊 RAW AI EMOTIONS
    // ----------------------------------

    console.log(
      "🔥 RAW AI EMOTIONS:",
      data?.emotions
    );

// ----------------------------------
// 🚨 NORMALIZED EMOTIONS
// ----------------------------------

const normalizedEmotions =

  normalize(data?.emotions)

    .map((e) =>
      emotionMap[e] || e
    );    

// ----------------------------------
// 🚨 UNKNOWN EMOTIONS
// ----------------------------------

const unknownEmotions =

  normalizedEmotions.filter(
    (e) =>
      !VALID_EMOTIONS.includes(e)
  );

console.log(
  "🚨 UNKNOWN EMOTIONS:",
  unknownEmotions
);

await saveUnknownSignals({

  rawTerms:
    unknownEmotions,

  signalType:
    "emotion",

  source:
    input?.source ||
    "runtime",
});

// ----------------------------------
// 😊 CLEAN EMOTIONS
// ----------------------------------

const aiEmotions =

  normalizedEmotions.filter(
    (e) =>
      VALID_EMOTIONS.includes(e)
  );

console.log(
  "😊 CLEANED EMOTIONS:",
  aiEmotions
);

    // ----------------------------------
    // 🧠 CLEAN BEHAVIOURS
    // ----------------------------------

    // ----------------------------------
// 🚨 UNKNOWN BEHAVIOURS
// ----------------------------------

const normalizedBehaviours =

  normalize(data?.behaviours)

    .map((b) =>
      behaviourMap[b] || b
    );

console.log(
  "🧪 NORMALIZED BEHAVIOURS:",
  normalizedBehaviours
);    

const unknownBehaviours =

  normalizedBehaviours.filter(
    (b) =>
      !VALID_BEHAVIOURS.includes(b)
  );

console.log(
  "🚨 UNKNOWN BEHAVIOURS:",
  unknownBehaviours
);

await saveUnknownSignals({

  rawTerms:
    unknownBehaviours,

  signalType:
    "behaviour",

  source:
    input?.source ||
    "runtime",
});

const aiBehaviours =

  normalizedBehaviours.filter(
    (b) =>
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

  people:
    normalize(data?.people),

  places:
    normalize(data?.places),

  things:
    normalize(data?.things),

  people_entities:
    normalize(data?.people),

  places_entities:
    normalize(data?.places),

  things_entities:
    normalize(data?.things),

  polarity:
    data?.polarity ?? null,

  intensity:
    data?.intensity ?? 1,

  ai_confidence:
    data?.ai_confidence ?? null,

  reflection_summary:
    data?.reflection_summary || null,

  lens: {

    people:
      normalize(data?.people),

    places:
      normalize(data?.places),

    things:
      normalize(data?.things),
  },

  levels:
    data?.levels || {

      physical: 0.5,

      emotional: 0.5,

      energetic: 0.5,
    },

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

console.log(
  "🧩 CLEANED ENTITIES",
  {
    people: cleaned.people,
    places: cleaned.places,
    things: cleaned.things,
  }
);    

console.log(
  "👥 PEOPLE:",
  cleaned.people
);

console.log(
  "📍 PLACES:",
  cleaned.places
);

console.log(
  "📦 THINGS:",
  cleaned.things
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

  people: [],

  places: [],

  things: [],

  people_entities: [],

  places_entities: [],

  things_entities: [],

  polarity: null,

  intensity: 1,

  ai_confidence: null,

  reflection_summary: null,

  lens: {

    people: [],

    places: [],

    things: [],
  },

  levels: {

    physical: 0.5,

    emotional: 0.5,

    energetic: 0.5,
  },

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