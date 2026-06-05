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

    patternField?: Record<
      string,
      any
    >;
  };

  evolution: {

    recurringPatterns: string[];

    dominantMovements?: string[];

    activePolarities?: string[];
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

    dominantNarratives?: string[];
  };

  cosmic: any;

  language: any;

  manifestationLibrary?: any[];

  story: {

    primaryScene?: string | null;

    confrontation?: string | null;

    dominantManifestation?: string | null;

    dominantCopingStrategy?: string | null;

    dominantPattern?: string | null;

    emotionalTension?: string | null;

    nervousSystemState?: string | null;

    dominantPolarity?: string | null;
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

  patternField?: Record<
    string,
    any
  >;

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

  patternField = {},

  distortions = {},

  lensEntries = [],

}: BuildMirrorContextInput): Promise<MirrorContext> {

  // --------------------------------------------------
  // 🌌 COSMIC
  // --------------------------------------------------

  const cosmicTransit =
    await getTodaysTransit();

  const {
    data: fieldAmplification,
  } = await supabase

    .from("cosmic_fields")

    .select("*")

    .in(
      "field_state",
      [
        "approaching",
        "peak",
        "integrating",
      ]
    );

  const {
  data: manifestationLibrary,
} = await supabase

  .from(
    "pattern_chakra_manifestations"
  )

  .select("*");  

  // --------------------------------------------------
  // 🌊 SIGNALS
  // --------------------------------------------------

const currentSignals =

  [...signals]

    .sort(
      (a: any, b: any) => {

        const aScore =

          (
            Number(
              a?.signal_depth || 1
            ) *

            Number(
              a?.recognition_weight || 1
            )
          );

        const bScore =

          (
            Number(
              b?.signal_depth || 1
            ) *

            Number(
              b?.recognition_weight || 1
            )
          );

        return bScore - aScore;
      }
    )

    .slice(0, 10);

  const baselineSignals =
    signals.filter(
      (s) =>
        s?.source_type ===
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
  // 🌊 ACTIVE PATTERN FIELD
  // --------------------------------------------------

  const activePatternField =

    Object.values(
      patternField || {}
    )

.sort(
  (a: any, b: any) => {

    const aScore =

      (
        Number(
          a?.activation || 0
        ) *

        Number(
          a?.signalCount || 0
        )
      );

    const bScore =

      (
        Number(
          b?.activation || 0
        ) *

        Number(
          b?.signalCount || 0
        )
      );

    return bScore - aScore;
  }
)

      .slice(0, 10);

  // --------------------------------------------------
  // 🌊 DOMINANT PATTERN
  // --------------------------------------------------

  const dominantPatternObject =

    activePatternField?.[0];

  const dominantPattern =

    dominantPatternObject
      ?.pattern?.id ||

    dominantPatternObject
      ?.pattern?.name ||

    currentPatterns?.[0]
      ?.id ||

    currentPatterns?.[0]
      ?.name ||

    null;

  // --------------------------------------------------
  // 🌊 ACTIVE POLARITIES
  // --------------------------------------------------

  const activePolarities =

    activePatternField.map(
      (p: any) => {

        const contracted =

          Number(
            p?.contraction || 0
          );

        const expanded =

          Number(
            p?.expansion || 0
          );

        if (
          contracted >
          expanded
        ) {

          return `${p?.pattern?.name}: contracted`;
        }

        return `${p?.pattern?.name}: expanding`;
      }
    );

  // --------------------------------------------------
  // 🌊 EMOTIONS
  // --------------------------------------------------

  const currentEmotions =
    unique(

      currentSignals.flatMap(
        (s) =>

          s?.ai_emotions ||

          s?.emotions ||

          []
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

        .slice(0, 5);
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

  const spiralState =
  realityLayers?.spiral || {};

  const peopleLensContext =
    await buildLensContext({

      lens: "people",

      lensEntries,

      patterns:
        currentPatterns,

      patternField,

      distortions,

      realityLayers,

      energy,

      spiralState,

      fieldAmplification,
    });

  const placesLensContext =
    await buildLensContext({

      lens: "places",

      lensEntries,

      patterns:
        currentPatterns,

      patternField,

      distortions,

      realityLayers,

      energy,

      spiralState,

      fieldAmplification,
    });

  const thingsLensContext =
    await buildLensContext({

      lens: "things",

      lensEntries,

      patterns:
        currentPatterns,

      patternField,

      distortions,

      realityLayers,

      energy,

      spiralState,

      fieldAmplification,
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
      ?.observableSceneThreads || []),

    ...(placesLensContext
      ?.observableSceneThreads || []),

    ...(thingsLensContext
      ?.observableSceneThreads || []),
  ];

  const allManifestations = [

    ...(peopleLensContext
      ?.manifestationThreads || []),

    ...(placesLensContext
      ?.manifestationThreads || []),

    ...(thingsLensContext
      ?.manifestationThreads || []),
  ];

  const allCopingStrategies = [

    ...(peopleLensContext
      ?.copingStrategyThreads || []),

    ...(placesLensContext
      ?.copingStrategyThreads || []),

    ...(thingsLensContext
      ?.copingStrategyThreads || []),
  ];

  const primaryScene =
    allScenes?.[0]?.text ||
    null;

  const confrontation =
    allMirrorPrompts?.[0] ||
    null;

  const dominantManifestation =
    allManifestations?.[0]
      ?.text || null;

  const dominantCopingStrategy =
    allCopingStrategies?.[0]
      ?.text || null;

  const emotionalTension =

    realityLayers
      ?.physical
      ?.nervousSystemState ===
    "protective"

      ? dominantCopingStrategy

      : null;

  // --------------------------------------------------
  // 🌊 DOMINANT POLARITY
  // --------------------------------------------------

  const dominantPolarity =

    energy?.feminine >
    energy?.masculine

      ? "feminine"

      : "masculine";

  // --------------------------------------------------
  // 🪞 DOMINANT NARRATIVES
  // --------------------------------------------------

  const dominantNarratives =

    activePatternField

      .map(
        (p: any) =>

          p?.pattern
            ?.mirror_theme ||

          p?.pattern
            ?.description ||

          p?.pattern
            ?.name
      )

      .filter(Boolean)

      .slice(0, 5);

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

      patternField,

      activatedPatterns:

        activePatternField

          .map(
            (p: any) =>

              p?.pattern?.id ||

              p?.pattern?.name
          )

          .filter(Boolean)

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

        activePatternField

          .map(
            (p: any) =>

              p?.pattern?.id ||

              p?.pattern?.name
          )

          .filter(Boolean)

          .slice(0, 5),

      dominantMovements: [

        dominantMovement,
      ],

      activePolarities,
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

        activePatternField

          .map(
            (p: any) =>

              p?.pattern
                ?.mirror_theme ||

              p?.pattern
                ?.name ||

              p?.id
          )

          .filter(Boolean)

          .slice(0, 10),

      dominantNarratives,
    },

    // 🌌 COSMIC
    cosmic:
      cosmicData,

    // 🌍 LANGUAGE
    language:
      languageContext || {},

    manifestationLibrary:
  manifestationLibrary || [],  

    // 🧭 STORY
    story: {

      primaryScene,

      confrontation,

      dominantManifestation,

      dominantCopingStrategy,

      dominantPattern,

      emotionalTension,

      dominantPolarity,

      nervousSystemState:

        realityLayers
          ?.physical
          ?.nervousSystemState ||

        "open",
    },
  };
}