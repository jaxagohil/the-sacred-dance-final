// /lib/context/buildMirrorContext.ts

import { getTodaysTransit } from "../getTodaysTransit";

import { buildLensContext } from "./buildLensContext";

import { supabase } from "../../services/supabase";

// --------------------------------------------------
// 🧠 TYPES
// --------------------------------------------------

export type MirrorContext = {

  baseline: {

    corePatterns: string[];

    protectionPatterns: string[];

    attachmentThemes: string[];
  };

  current: {

    emotions: string[];

    behaviours: {

      id: string;

      weight: number;

    }[];

    patterns: string[];

    dominantPattern?: string | null;

    dominantChakra?: string | null;

    awarenessChakra?: string | null;

    nervousSystemState?: string | null;

    contraction?: number;

    expansion?: number;
  };

  evolution: {

    recurringPatterns: string[];

    risingPatterns: string[];

    healingPatterns: string[];

    dormantPatterns: string[];
  };

  lens: {

    active:
      | "people"
      | "places"
      | "things"
      | "general";

    people: {

      intensity: number;
    };

    places: {

      intensity: number;
    };

    things: {

      intensity: number;
    };
  };

  lensContexts: {

    people?: any;

    places?: any;

    things?: any;
  };

  energy: {

    feminine?: number;

    masculine?: number;

    contraction?: number;

    expansion?: number;

    dominantChakra?: string | null;

    awarenessChakra?: string | null;

    distortions?: any[];

    chakras?: Record<
      string,
      number
    >;
  };

  levels: any;

  consciousness: {

    reactivity: number;

    awareness: number;

    responsibility: number;

    embodiment: number;

    integration: number;

    dominantMovement?: string;
  };

  voice: {

    reflectionEchoes: string[];

    emotionalThemes: string[];
  };

  cosmic: any;

  language: any;

story: {

  primaryScene?: string | null;

  confrontation?: string | null;

  dominantManifestation?: string | null;

  dominantCopingStrategy?: string | null;

  dominantPattern?: string | null;

  emotionalTension?: string | null;

  nervousSystemState?: string | null;
};
};

// --------------------------------------------------
// 📦 INPUT
// --------------------------------------------------

export type BuildMirrorContextInput = {

  mirror?: any;

  energy?: any;

  cosmic?: any;

  languageContext?: any;

  signals?: any[];

  activeLens?:
    | "people"
    | "places"
    | "things"
    | "general";
};

// --------------------------------------------------
// 🧠 HELPERS
// --------------------------------------------------

const unique = (arr: any[]) =>
  [...new Set(arr)].filter(Boolean);

const extractPatterns = (
  signals: any[]
) =>

  signals

    .flatMap(
      (s) =>
        s?.ai_patterns || []
    )

    .map(
      (p: any) =>
        p?.id || p?.name
    )

    .filter(Boolean);

const extractEmotions = (
  signals: any[]
) =>

  signals

    .flatMap(
      (s) =>
        s?.emotions || []
    )

    .map(
      (e: any) =>
        e?.id || e?.name
    )

    .filter(Boolean);

// --------------------------------------------------
// 🚀 MAIN
// --------------------------------------------------

export async function buildMirrorContext({

  mirror,

  energy,

  cosmic,

  languageContext,

  signals = [],

  activeLens = "general",

}: BuildMirrorContextInput): Promise<MirrorContext> {

  // --------------------------------------------------
  // 🌌 COSMIC
  // --------------------------------------------------

  const cosmicTransit =
    await getTodaysTransit();

  // --------------------------------------------------
  // 🌊 SIGNALS
  // --------------------------------------------------

  const currentSignals =
    signals.slice(0, 7);

  const baselineSignals =
    signals.filter(
      (s) =>
        s?.sourcetype ===
        "baseline"
    );

  // --------------------------------------------------
  // 🌊 PATTERNS
  // --------------------------------------------------

  const currentPatterns =
    unique(
      extractPatterns(
        currentSignals
      )
    );

  const baselinePatterns =
    unique(
      extractPatterns(
        baselineSignals
      )
    );

  // --------------------------------------------------
  // 🌊 EMOTIONS
  // --------------------------------------------------

  const currentEmotions =
    unique(
      extractEmotions(
        currentSignals
      )
    );

  // --------------------------------------------------
  // 🧿 BEHAVIOURS
  // --------------------------------------------------

  const currentBehaviours =

    unique(
      currentSignals.flatMap(
        (s) =>
          s?.ai_behaviours || []
      )
    ).map((b: any) => ({

      id:
        b?.statement ||
        b?.id ||
        b?.name,

      weight:
        b?.weight || 1,
    }));

  // --------------------------------------------------
  // 🗣 REFLECTION ECHOES
  // --------------------------------------------------

  const reflectionIds =
    unique(

      currentSignals

        .map(
          (s) =>
            s?.reflection_id
        )

        .filter(Boolean)
    );

  let reflectionEchoes:
    string[] = [];

  if (
    reflectionIds.length > 0
  ) {

    const {
      data: reflectionsData,
    } = await supabase

      .from("reflections")

      .select("content")

      .in(
        "id",
        reflectionIds
      )

      .limit(20);

    reflectionEchoes =

      (reflectionsData || [])

        .map(
          (r) =>
            r?.content
        )

        .filter(Boolean)

        .slice(0, 10);
  }

  // --------------------------------------------------
  // ✨ CONSCIOUSNESS
  // --------------------------------------------------

  const consciousnessSignals =
    currentSignals.map(
      (s) =>
        s?.consciousness_movement
    );

  const average = (
    key: string
  ) => {

    const values =

      consciousnessSignals

        .map(
          (s) => s?.[key]
        )

        .filter(
          (v) =>
            typeof v === "number"
        );

    if (values.length === 0) {
      return 0.5;
    }

    return (

      values.reduce(
        (a, b) => a + b,
        0
      ) / values.length
    );
  };

  const consciousness = {

    reactivity:
      average("reactivity"),

    awareness:
      average("awareness"),

    responsibility:
      average("responsibility"),

    embodiment:
      average("embodiment"),

    integration:
      average("integration"),
  };

  // --------------------------------------------------
  // 🌊 DOMINANT MOVEMENT
  // --------------------------------------------------

  let dominantMovement =
    "awakening";

  if (
    consciousness.integration >
    0.7
  ) {

    dominantMovement =
      "integrating";
  }

  else if (
    consciousness.embodiment >
    0.7
  ) {

    dominantMovement =
      "embodying";
  }

  else if (
    consciousness.reactivity >
    0.7
  ) {

    dominantMovement =
      "reactive";
  }

  // --------------------------------------------------
  // 🪞 LENS INTENSITY
  // --------------------------------------------------

  const peopleCount =
    currentSignals.filter(
      (s) =>
        s?.ai_lens?.people
          ?.length
    ).length;

  const placesCount =
    currentSignals.filter(
      (s) =>
        s?.ai_lens?.places
          ?.length
    ).length;

  const thingsCount =
    currentSignals.filter(
      (s) =>
        s?.ai_lens?.things
          ?.length
    ).length;

  const totalLens =
    peopleCount +
      placesCount +
      thingsCount || 1;

  // --------------------------------------------------
  // 🌍 LEVELS
  // --------------------------------------------------

  const levels = {

    physical: {

      behaviours:
        currentBehaviours,

      actions: [],

      bodyThemes: [],
    },

    emotional: {

      emotions:
        currentEmotions,

      themes:
        currentPatterns,
    },

    energetic: {

      dominantChakra:
        energy?.dominant_chakra,

      awarenessChakra:

        energy
          ?.awareness_chakra ||

        energy
          ?.dominant_chakra,

      contraction:
        energy?.contraction,

      expansion:
        energy?.expansion,

      distortions:
        energy?.distortions ||
        [],
    },
  };

  // --------------------------------------------------
  // 🪞 LENS CONTEXTS
  // --------------------------------------------------

  const peopleLensContext =
    await buildLensContext({

      lens: "people",

      reflections:
        reflectionEchoes,

      behaviours:
        currentBehaviours,

      patterns:
        currentPatterns,

      levels,

      mirror,

      energy,
    });

  const placesLensContext =
    await buildLensContext({

      lens: "places",

      reflections:
        reflectionEchoes,

      behaviours:
        currentBehaviours,

      patterns:
        currentPatterns,

      levels,

      mirror,

      energy,
    });

  const thingsLensContext =
    await buildLensContext({

      lens: "things",

      reflections:
        reflectionEchoes,

      behaviours:
        currentBehaviours,

      patterns:
        currentPatterns,

      levels,

      mirror,

      energy,
    });

  // --------------------------------------------------
  // 🌌 COSMIC FIELD
  // --------------------------------------------------

  const cosmicData = {

    phase:

      cosmicTransit
        ?.moon_phase ||

      cosmic?.phase,

    moon:

      cosmicTransit
        ?.moon_sign ||

      cosmic?.moon,

    sign:

      cosmicTransit
        ?.sun_sign ||

      cosmic?.sign,

    energy:

      cosmicTransit
        ?.dominant_energy ||

      cosmic?.energy,

    energeticTheme:

      cosmicTransit
        ?.energetic_theme,

    collectiveTheme:

      cosmicTransit
        ?.collective_theme,

    chakraFocus:

      cosmicTransit
        ?.chakra_focus || [],

    retrogrades:

      cosmicTransit
        ?.retrogrades || [],
  };

// --------------------------------------------------
// 🧭 STORY FIELD
// --------------------------------------------------

const dominantPattern =

  currentPatterns?.[0] ||

  mirror?.primary?.id ||

  null;

const allMirrorPrompts = [

  ...(peopleLensContext
    ?.mirrorPrompts || []),

  ...(placesLensContext
    ?.mirrorPrompts || []),

  ...(thingsLensContext
    ?.mirrorPrompts || []),
];

const allScenes = [

  ...(peopleLensContext
    ?.observableScenes || []),

  ...(placesLensContext
    ?.observableScenes || []),

  ...(thingsLensContext
    ?.observableScenes || []),
];

const allManifestations = [

  ...(peopleLensContext
    ?.manifestations || []),

  ...(placesLensContext
    ?.manifestations || []),

  ...(thingsLensContext
    ?.manifestations || []),
];

const allCopingStrategies = [

  ...(peopleLensContext
    ?.copingStrategies || []),

  ...(placesLensContext
    ?.copingStrategies || []),

  ...(thingsLensContext
    ?.copingStrategies || []),
];

const primaryScene =
  allScenes?.[0] || null;

const confrontation =
  allMirrorPrompts?.[0] || null;

const dominantManifestation =
  allManifestations?.[0] || null;

const dominantCopingStrategy =
  allCopingStrategies?.[0] || null;

const emotionalTension =

  energy?.contraction > 0.7

    ? dominantCopingStrategy

    : null;


  // --------------------------------------------------
  // ✅ FINAL
  // --------------------------------------------------

  return {

    // 🧬 BASELINE
    baseline: {

      corePatterns:
        baselinePatterns.slice(
          0,
          5
        ),

      protectionPatterns:

        currentBehaviours

          .map(
            (b) => b.id
          )

          .slice(0, 5),

      attachmentThemes: [],
    },

    // 🌊 CURRENT
    current: {

      emotions:
        currentEmotions,

      behaviours:
        currentBehaviours,

      patterns:
        currentPatterns,

      dominantPattern,

      contraction:
        energy?.contraction,

      expansion:
        energy?.expansion,

      dominantChakra:
        energy?.dominant_chakra,

      awarenessChakra:

        energy
          ?.awareness_chakra ||

        energy
          ?.dominant_chakra,

      nervousSystemState:

        energy?.contraction >
        0.7

          ? "protective"

          : "open",
    },

    // 📈 EVOLUTION
    evolution: {

      recurringPatterns:
        currentPatterns.slice(
          0,
          5
        ),

      risingPatterns: [],

      healingPatterns: [],

      dormantPatterns: [],
    },

    // 🪞 LENS
    lens: {

      active:
        activeLens,

      people: {

        intensity:
          peopleCount /
          totalLens,
      },

      places: {

        intensity:
          placesCount /
          totalLens,
      },

      things: {

        intensity:
          thingsCount /
          totalLens,
      },
    },

    // 🪞 LENS CONTEXTS
    lensContexts: {

      people:
        peopleLensContext,

      places:
        placesLensContext,

      things:
        thingsLensContext,
    },

    // ⚡ ENERGY
    energy: {

      feminine:
        energy?.feminine,

      masculine:
        energy?.masculine,

      contraction:
        energy?.contraction,

      expansion:
        energy?.expansion,

      dominantChakra:
        energy?.dominant_chakra,

      awarenessChakra:

        energy
          ?.awareness_chakra ||

        energy
          ?.dominant_chakra,

      distortions:
        energy?.distortions ||
        [],

      chakras:
        energy?.chakras ||
        {},
    },

    // 🌍 LEVELS
    levels,

    // ✨ CONSCIOUSNESS
    consciousness: {

      ...consciousness,

      dominantMovement,
    },

    // 🗣 VOICE
    voice: {

      reflectionEchoes,

      emotionalThemes:
        currentPatterns,
    },

    // 🌌 COSMIC
    cosmic:
      cosmicData,

    // 🌍 LANGUAGE
    language:
      languageContext || {},

// 🧭 STORY
story: {

  primaryScene,

  confrontation,

  dominantManifestation,

  dominantCopingStrategy,

  dominantPattern,

  emotionalTension,

  nervousSystemState:

    energy?.contraction >
    0.7

      ? "protective"

      : "open",
},
  };
}