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

    activatedBehaviours: string[];

    attachmentThemes: string[];
  };

  current: {

    emotions: string[];

    behaviours: any[];

    patterns: any[];

    dominantPattern?: string | null;

    activatedPatterns?: string[];

    dominantChakra?: string | null;

    awarenessChakra?: string | null;

    nervousSystemState?: string | null;

    contraction?: number;

    expansion?: number;
  };

  evolution: {

    recurringPatterns: string[];
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

    mirrorChakraScores?: Record<
  string,
  number
>;

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

    mirrorThemes: string[];
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

  energy?: any;

  cosmic?: any;

  languageContext?: any;

  signals?: any[];

  activeLens?:
    | "people"
    | "places"
    | "things"
    | "general";

  realityLayers?: any;

  enrichedBehaviours?: any[];

  enrichedPatterns?: any[];

  distortions?: any;

  lensEntries?: any[];
};

// --------------------------------------------------
// 🧠 HELPERS
// --------------------------------------------------

const unique = (arr: any[]) =>
  [...new Set(arr)].filter(Boolean);

// --------------------------------------------------
// 🚀 MAIN
// --------------------------------------------------

export async function buildMirrorContext({

  energy,

  cosmic,

  languageContext,

  signals = [],

  activeLens = "general",

  realityLayers = {},

  enrichedBehaviours = [],

  enrichedPatterns = [],

  distortions = {},

  lensEntries = [],

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
  // 🌊 CURRENT FIELD
  // --------------------------------------------------

  const currentPatterns =
    enrichedPatterns || [];

  const currentBehaviours =
    enrichedBehaviours || [];

  const baselinePatterns =

    unique(

      baselineSignals.flatMap(
        (s) =>
          s?.ai_patterns || []
      )
    );

  // --------------------------------------------------
  // 🌊 EMOTIONS
  // --------------------------------------------------

  const currentEmotions =
    unique(

      currentSignals.flatMap(
        (s) =>
          s?.emotions || []
      )
    );

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
    lensEntries.filter(
      (l: any) =>
        l?.lens === "people"
    ).length;

  const placesCount =
    lensEntries.filter(
      (l: any) =>
        l?.lens === "places"
    ).length;

  const thingsCount =
    lensEntries.filter(
      (l: any) =>
        l?.lens === "things"
    ).length;

  const totalLens =
    peopleCount +
      placesCount +
      thingsCount || 1;

  // --------------------------------------------------
  // 🪞 LENS CONTEXTS
  // --------------------------------------------------

  const peopleLensContext =
    await buildLensContext({

      lens: "people",

      lensEntries,

      patterns:
        currentPatterns,

      distortions,

      realityLayers,

      energy,
    });

  const placesLensContext =
    await buildLensContext({

      lens: "places",

      lensEntries,

      patterns:
        currentPatterns,

      distortions,

      realityLayers,

      energy,
    });

  const thingsLensContext =
    await buildLensContext({

      lens: "things",

      lensEntries,

      patterns:
        currentPatterns,

      distortions,

      realityLayers,

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
// 🌈 MIRROR CHAKRA SCORES
// --------------------------------------------------

const mirrorChakraScores:
  Record<string, number> = {};

currentPatterns.forEach(
  (p: any) => {

    const weights =

      p?.chakra_weights ||
      {};

    Object.entries(
      weights
    ).forEach(

      ([chakra, value]) => {

        mirrorChakraScores[
          chakra
        ] =

          (
            mirrorChakraScores[
              chakra
            ] || 0
          ) +

          Number(value || 0);
      }
    );
  }
);

// --------------------------------------------------
// 🌈 NORMALIZE
// --------------------------------------------------

const maxScore =

  Math.max(
    ...Object.values(
      mirrorChakraScores
    ),
    1
  );

Object.keys(
  mirrorChakraScores
).forEach((key) => {

  mirrorChakraScores[
    key
  ] =

    mirrorChakraScores[
      key
    ] / maxScore;
});

  // --------------------------------------------------
  // 🧭 STORY FIELD
  // --------------------------------------------------

  const dominantPattern =

    currentPatterns?.[0]
      ?.id ||

    currentPatterns?.[0]
      ?.name ||

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

    realityLayers
      ?.physical
      ?.nervousSystemState ===
    "protective"

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

activatedBehaviours:

  currentBehaviours

    .map(
      (b: any) =>

        b?.id
    )

    .slice(0, 5),

attachmentThemes:

  realityLayers
    ?.emotional
    ?.recurringCopingStrategies || [],
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

      activatedPatterns:

  currentPatterns

    .map(
      (p: any) =>

        p?.id ||

        p?.name
    )

    .slice(0, 5),

      contraction:
        energy?.contraction,

      expansion:
        energy?.expansion,

      dominantChakra:
        energy?.dominant_chakra,

awarenessChakra:

  energy
    ?.awareness_chakra ||

  null,

      nervousSystemState:

        realityLayers
          ?.physical
          ?.nervousSystemState ||

        "open",
    },

    // 📈 EVOLUTION
    evolution: {

      recurringPatterns:

        currentPatterns

          .map(
            (p: any) =>

              p?.id ||
              p?.name
          )

          .slice(0, 5),
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

  null,

      mirrorChakraScores,    

      chakras:
        energy?.chakras ||
        {},
    },

    // 🌍 LEVELS
    levels:
      realityLayers,

    // ✨ CONSCIOUSNESS
    consciousness: {

      ...consciousness,

      dominantMovement,
    },

// 🗣 VOICE
voice: {

  reflectionEchoes,

  mirrorThemes:

    currentPatterns.map(
      (p: any) =>

        p?.mirror_theme ||

        p?.name ||

        p?.id
    ),
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

        realityLayers
          ?.physical
          ?.nervousSystemState ||

        "open",
    },
  };
}