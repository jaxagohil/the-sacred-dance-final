// lib/context/buildMirrorContext.ts

import { getTodaysTransit } from "../lib/getTodaysTransit";

// --------------------------------------------------
// 🧠 CONTEXT
// --------------------------------------------------

export type MirrorContext = {

  // 🧬 BASELINE
  baseline: {

    corePatterns: string[];

    protectionPatterns: string[];

    dominantChakras: string[];

    attachmentThemes: string[];
  };

  // 🌊 CURRENT ACTIVATION
  current: {

    emotions: string[];

    behaviours: string[];

    patterns: string[];

    dominantPattern?: string | null;

    contraction?: number;

    expansion?: number;

    dominantChakra?: string | null;

    nervousSystemState?: string | null;
  };

  // 📈 EVOLUTION
  evolution: {

    recurringPatterns: string[];

    risingPatterns: string[];

    healingPatterns: string[];

    dormantPatterns: string[];
  };

  // 🪞 LENS
  lens: {

    active:
      | "people"
      | "places"
      | "things"
      | "general";

    people: {
      intensity: number;
      themes: string[];
    };

    places: {
      intensity: number;
      themes: string[];
    };

    things: {
      intensity: number;
      themes: string[];
    };
  };

  // ⚡ ENERGY
  energy: {

    feminine?: number;

    masculine?: number;

    contraction?: number;

    expansion?: number;

    dominantChakra?: string | null;

    distortions?: any[];

    chakras?: Record<string, number>;
  };

  // 🌍 LEVELS
  levels: {

    physical: {

      behaviours: string[];

      actions: string[];

      bodyThemes: string[];
    };

    emotional: {

      emotions: string[];

      needs: string[];

      themes: string[];
    };

    energetic: {

      chakra?: string | null;

      contraction?: number;

      expansion?: number;

      distortions?: any[];
    };
  };

  // ✨ CONSCIOUSNESS
  consciousness: {

    reactivity: number;

    awareness: number;

    responsibility: number;

    embodiment: number;

    integration: number;

    dominantMovement?: string;
  };

  // 🗣 USER VOICE
  voice: {

    reflectionEchoes: string[];

    symbolicLanguage: string[];

    emotionalThemes: string[];
  };

  // 🌌 COSMIC
 cosmic: {

  phase?: string;

  moon?: string;

  sign?: string;

  energy?: string;

  energeticTheme?: string;

  collectiveTheme?: string;

  chakraFocus?: string[];

  retrogrades?: any[];
};

  // 🧭 STORY
  story: {

    emotionalTheme?: string;

    relationalTheme?: string;

    energeticMovement?: string;

    healingEdge?: string;
  };
};

// --------------------------------------------------
// 📦 INPUT
// --------------------------------------------------

export type BuildMirrorContextInput = {

  mirror?: any;

  energy?: any;

  cosmic?: any;

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

const extractPatterns = (signals: any[]) =>
  signals

    .flatMap(
      (s) => s?.ai_patterns || []
    )

    .map(
      (p: any) =>
        p?.id || p?.name
    )

    .filter(Boolean);

const extractBehaviours = (
  signals: any[]
) =>
  signals

    .flatMap(
      (s) =>
        s?.ai_behaviours || []
    )

    .map(
      (b: any) =>
        b?.id || b?.name
    )

    .filter(Boolean);

const extractEmotions = (
  signals: any[]
) =>
  signals

    .flatMap(
      (s) => s?.emotions || []
    )

    .map(
      (e: any) =>
        e?.id || e?.name
    )

    .filter(Boolean);

const extractChildhoodSignals = (
  signals: any[]
) => {

  const counts:
    Record<string, number> = {};

  signals.forEach((s) => {

    const childhood =
      s?.metadata
        ?.childhood_signals;

    if (!childhood) return;

    Object.entries(
      childhood
    ).forEach(
      ([key, value]) => {

        if (value === 1) {

          counts[key] =
            (counts[key] || 0) + 1;
        }
      }
    );
  });

  return Object.entries(counts)

    .sort(
      (a, b) => b[1] - a[1]
    )

    .map(([key]) => key)

    .slice(0, 5);
};

// --------------------------------------------------
// 🚀 MAIN
// --------------------------------------------------

export async function buildMirrorContext({

  mirror,

  energy,

  cosmic,

  signals = [],

  activeLens = "general",

}: BuildMirrorContextInput): Promise<MirrorContext> {

  // --------------------------------------------------
// 🌌 COSMIC TRANSIT
// --------------------------------------------------

const cosmicTransit =
  await getTodaysTransit();


  // --------------------------------------------------
  // 🧬 BASELINE
  // --------------------------------------------------

  const baselineSignals =
    signals.filter(
      (s) =>
        s?.sourcetype ===
        "baseline"
    );

  // --------------------------------------------------
  // 🌊 CURRENT
  // --------------------------------------------------

  const currentSignals =
    signals.slice(0, 7);

  // --------------------------------------------------
  // 🧬 BASELINE DATA
  // --------------------------------------------------

  const baselinePatterns =
    unique(
      extractPatterns(
        baselineSignals
      )
    );

  const baselineBehaviours =
    unique(
      extractBehaviours(
        baselineSignals
      )
    );

  const childhoodThemes =
    extractChildhoodSignals(
      baselineSignals
    );

  // --------------------------------------------------
  // 🌊 CURRENT DATA
  // --------------------------------------------------

  const currentPatterns =
    unique(
      extractPatterns(
        currentSignals
      )
    );

  const currentBehaviours =
    unique(
      extractBehaviours(
        currentSignals
      )
    );

  const currentEmotions =
    unique(
      extractEmotions(
        currentSignals
      )
    );

  // --------------------------------------------------
  // ✨ CONSCIOUSNESS SYNTHESIS
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
  // 🗣 REFLECTION ECHOES
  // --------------------------------------------------

  const reflectionEchoes =
    currentSignals

      .map(
        (s) =>
          s?.reflection_summary
      )

      .filter(Boolean)

      .slice(0, 5);

  // --------------------------------------------------
  // 🌌 COSMIC
  // --------------------------------------------------

const cosmicData = {

  phase:
    cosmicTransit?.moon_phase
    || cosmic?.phase,

  moon:
    cosmicTransit?.moon_sign
    || cosmic?.moon,

  sign:
    cosmicTransit?.sun_sign
    || cosmic?.sign,

  energy:
    cosmicTransit?.dominant_energy
    || cosmic?.energy,

  energeticTheme:
    cosmicTransit?.energetic_theme,

  collectiveTheme:
    cosmicTransit?.collective_theme,

  chakraFocus:
    cosmicTransit?.chakra_focus || [],

  retrogrades:
    cosmicTransit?.retrogrades || [],
};

  // --------------------------------------------------
  // 🧭 STORY SYNTHESIS
  // --------------------------------------------------

  const dominantPattern =

    currentPatterns[0] ||

    mirror?.primary?.id ||

    null;

  let emotionalTheme =
    "returning to yourself";

  if (
    dominantPattern ===
    "avoidance"
  ) {

    emotionalTheme =
      "creating distance to feel safe";
  }

  if (
    dominantPattern ===
    "people_pleasing"
  ) {

    emotionalTheme =
      "seeking connection through self abandonment";
  }

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
        baselineBehaviours.slice(
          0,
          5
        ),

      dominantChakras:
        energy?.dominant_chakra
          ? [
              energy.dominant_chakra,
            ]
          : [],

      attachmentThemes:
        childhoodThemes,
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

        themes: [
          "connection",
          "visibility",
          "approval",
        ],
      },

      places: {

        intensity:
          placesCount /
          totalLens,

        themes: [
          "safety",
          "grounding",
          "belonging",
        ],
      },

      things: {

        intensity:
          thingsCount /
          totalLens,

        themes: [
          "control",
          "identity",
          "certainty",
        ],
      },
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

      distortions:
        energy?.distortions ||
        [],

      chakras:
        energy?.chakras ||
        {},
    },

    // 🌍 LEVELS
    levels: {

      physical: {

        behaviours:
          currentBehaviours,

        actions: [],

        bodyThemes: [],
      },

      emotional: {

        emotions:
          currentEmotions,

        needs: [],

        themes:
          currentPatterns,
      },

      energetic: {

        chakra:
          energy?.dominant_chakra,

        contraction:
          energy?.contraction,

        expansion:
          energy?.expansion,

        distortions:
          energy?.distortions ||
          [],
      },
    },

    // ✨ CONSCIOUSNESS
    consciousness: {

      ...consciousness,

      dominantMovement,
    },

    // 🗣 VOICE
    voice: {

      reflectionEchoes,

      symbolicLanguage: [],

      emotionalThemes:
        currentPatterns,
    },

    // 🌌 COSMIC
    cosmic:
      cosmicData,

    // 🧭 STORY
    story: {

      emotionalTheme,

      relationalTheme:
        activeLens ===
        "people"
          ? "relationship as mirror"
          : "self relationship",

      energeticMovement:
        energy?.contraction >
        0.7
          ? "contracting inward"
          : "opening outward",

      healingEdge:
        "staying present with yourself",
    },
  };
}