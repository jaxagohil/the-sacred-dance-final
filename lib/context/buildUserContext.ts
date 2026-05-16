// /lib/context/buildUserContext.ts

import { supabase } from "../../services/supabase";

import {
  buildMirrorContext,
} from "./buildMirrorContext";

/*
 * --------------------------------------------------
 * 🧠 TYPES
 * --------------------------------------------------
 */

type BuildUserContextParams = {
  userId: string;

  source?: string;

  activeLens?: string;
};

type EnergyTotals = {
  feminine: number;

  masculine: number;

  contraction: number;

  expansion: number;

  chakras:
    Record<string, number>;

  dominant_chakra:
    string | null;

    awareness_chakra:
  string | null;
};

/*
 * --------------------------------------------------
 * 🧠 HELPERS
 * --------------------------------------------------
 */

const unique = (
  arr: any[]
) => [

  ...new Set(arr)

].filter(Boolean);

function average(
  values: number[]
) {

  if (!values.length)
    return 0;

  return (

    values.reduce(
      (a, b) => a + b,
      0
    ) /

    values.length

  );
}

function normalizeChakras(
  chakraMap:
    Record<string, number>
) {

  const total =

    Object.values(
      chakraMap
    ).reduce(
      (a, b) => a + b,
      0
    ) || 1;

  const normalized:
    Record<string, number>
      = {};

  Object.entries(
    chakraMap
  ).forEach(([k, v]) => {

    normalized[k] =
      Number(v) / total;
  });

  return normalized;
}

function getDominantChakra(
  chakras:
    Record<string, number>
) {

  return Object.entries(
    chakras
  )

    .sort(
      (a, b) =>
        Number(b[1]) -
        Number(a[1])
    )[0]?.[0] || null;
}

/*
 * --------------------------------------------------
 * 🚀 BUILD USER CONTEXT
 * --------------------------------------------------
 */

export async function
buildUserContext({

  userId,

  source = "system",

  activeLens = "general",

}: BuildUserContextParams) {

  /*
   * ------------------------------------------------
   * 👤 PROFILE
   * ------------------------------------------------
   */

  const {
    data: profile,
  } = await supabase

    .from("profiles")

    .select("*")

    .eq(
      "user_id",
      userId
    )

    .maybeSingle();

  /*
   * ------------------------------------------------
   * 🌊 SIGNALS
   * ------------------------------------------------
   */

  const {
    data: signals,
    error,
  } = await supabase

    .from("signals")

    .select("*")

    .eq(
      "user_id",
      userId
    )

    .order(
      "created_at",
      {
        ascending: false,
      }
    )

    .limit(30);

  /*
   * ------------------------------------------------
   * ❌ EMPTY
   * ------------------------------------------------
   */

  if (
    error ||
    !signals ||
    signals.length === 0
  ) {

    return {

      ready: false,

      source,

      activeLens,

      profile:
        profile || null,

      language:
        profile?.language ||
        "en",

      signals: [],

      energy: null,

      behaviours: [],

      enrichedBehaviours: [],

      patterns: [],

      enrichedPatterns: [],

      distortions: {},

      observableScenes: [],

      recurringManifestations: [],

      recurringCopingStrategies: [],

      recurringBodyResponses: [],

      recurringMirrorPrompts: [],

      chakraManifestations: {},

      lensEntries: [],

      realityLayers: {},

      context: null,
    };
  }

  /*
   * ------------------------------------------------
   * 🌍 LANGUAGE
   * ------------------------------------------------
   */

  const language =
    profile?.language ||
    "en";

  /*
   * ------------------------------------------------
   * 🧿 RAW IDS
   * ------------------------------------------------
   */

const behaviourIds =
  unique(

    signals.flatMap(
      (s) =>

        (s?.ai_behaviours || [])
          .map(
            (b: any) =>

              typeof b ===
              "string"

                ? b

                : b?.id
          )
    )
  );

const patternIds =
  unique(

    signals.flatMap(
      (s) =>

        (s?.ai_patterns || [])
          .map(
            (p: any) =>

              typeof p ===
              "string"

                ? p

                : p?.id
          )
    )
  );

  /*
   * ------------------------------------------------
   * 🧠 LOAD BEHAVIOURS
   * ------------------------------------------------
   */

  const {
    data: behaviourRows,
  } = await supabase

    .from("behaviours")

    .select("*")

    .in(
      "id",
      behaviourIds.length
        ? behaviourIds
        : ["___empty___"]
    );

  /*
   * ------------------------------------------------
   * 🌊 LOAD PATTERNS
   * ------------------------------------------------
   */

  const {
    data: patternRows,
  } = await supabase

    .from("patterns")

    .select("*")

    .in(
      "id",
      patternIds.length
        ? patternIds
        : ["___empty___"]
    );

  /*
   * ------------------------------------------------
   * 🪞 LOAD LENS WEIGHTS
   * ------------------------------------------------
   */

const {
  data: lensRows,
} = await supabase

  .from(
    "behaviour_lens_weights"
  )

  .select("*")

  .in(
    "behaviour_id",

    behaviourIds.length
      ? behaviourIds
      : ["___empty___"]
  )

  .eq(
    "language",
    language
  );

  /*
   * ------------------------------------------------
   * 🧠 ENRICHED BEHAVIOURS
   * ------------------------------------------------
   */

  const enrichedBehaviours =
    behaviourRows || [];

  /*
   * ------------------------------------------------
   * 🌊 ENRICHED PATTERNS
   * ------------------------------------------------
   */

  const enrichedPatterns =
    patternRows || [];

  /*
   * ------------------------------------------------
   * ⚡ ENERGY FROM BEHAVIOURS
   * ------------------------------------------------
   */

  const feminineValues:
    number[] = [];

  const masculineValues:
    number[] = [];

  const contractionValues:
    number[] = [];

  const expansionValues:
    number[] = [];

  const chakraMap:
    Record<string, number>
      = {};

  enrichedBehaviours.forEach(
    (b: any) => {

      feminineValues.push(
        Number(
          b?.feminine || 0
        )
      );

      masculineValues.push(
        Number(
          b?.masculine || 0
        )
      );

      contractionValues.push(
        Number(
          b?.contraction || 0
        )
      );

      expansionValues.push(
        Number(
          b?.expansion || 0
        )
      );

      Object.entries(
        b?.chakra_weights || {}
      ).forEach(
        ([chakra, value]) => {

          chakraMap[
            chakra
          ] =

            (
              chakraMap[
                chakra
              ] || 0
            ) +

            Number(value);
        }
      );
    }
  );

  /*
   * ------------------------------------------------
   * 🌊 PATTERN CHAKRAS
   * ------------------------------------------------
   */

  enrichedPatterns.forEach(
    (p: any) => {

      if (p?.chakra) {

        chakraMap[
          p.chakra
        ] =

          (
            chakraMap[
              p.chakra
            ] || 0
          ) + 1;
      }

      (
        p?.secondary_chakras || []
      ).forEach(
        (chakra: string) => {

          chakraMap[
            chakra
          ] =

            (
              chakraMap[
                chakra
              ] || 0
            ) + 0.5;
        }
      );
    }
  );

    const distortedBehaviours =

    enrichedBehaviours.filter(
      (b: any) =>

        b?.quality ===
        "distorted"
    );

  const integratedBehaviours =

    enrichedBehaviours.filter(
      (b: any) =>

        b?.quality ===
        "divine"
    );

  /*
   * ------------------------------------------------
   * 🌈 NORMALIZE CHAKRAS
   * ------------------------------------------------
   */

  const normalizedChakras =
    normalizeChakras(
      chakraMap
    );

    const awarenessMap:
  Record<string, number>
    = {};

    /*
 * ------------------------------------------------
 * 🌈 AWARENESS CHAKRA
 * ------------------------------------------------
 */

const chakraKeys =
  Object.keys(
    normalizedChakras
  );

const avg =

  1 / (
    chakraKeys.length || 1
  );

const distortionMap:
  Record<string, number>
    = {};

/*
 * ------------------------------------------------
 * 🌑 DISTORTION DENSITY
 * ------------------------------------------------
 */

distortedBehaviours.forEach(
  (b: any) => {

    Object.entries(
      b?.chakra_weights || {}
    ).forEach(
      ([chakra, value]) => {

        distortionMap[
          chakra
        ] =

          (
            distortionMap[
              chakra
            ] || 0
          ) +

          Number(value);
      }
    );
  }
);

/*
 * ------------------------------------------------
 * 🌊 AWARENESS SCORE
 * ------------------------------------------------
 */

chakraKeys.forEach(
  (chakra) => {

    const activation =

      normalizedChakras[
        chakra
      ] || 0;

    const deviation =

      Math.abs(
        activation - avg
      );

    const distortion =

      distortionMap[
        chakra
      ] || 0;

    awarenessMap[
      chakra
    ] =

      deviation +

      distortion * 0.7 +

      activation * 0.3;
  }
);

/*
 * ------------------------------------------------
 * 👁 AWARENESS CHAKRA
 * ------------------------------------------------
 */

const awarenessChakra =
  Object.entries(
    awarenessMap
  )

    .sort(
      (a, b) =>

        Number(b[1]) -

        Number(a[1])
    )[0]?.[0] || null;

  const dominantChakra =
    getDominantChakra(
      normalizedChakras
    );

  /*
   * ------------------------------------------------
   * ⚡ ENERGY TOTALS
   * ------------------------------------------------
   */

  const energy:
    EnergyTotals = {

    feminine:
      average(
        feminineValues
      ),

    masculine:
      average(
        masculineValues
      ),

    contraction:
      average(
        contractionValues
      ),

    expansion:
      average(
        expansionValues
      ),

    chakras:
      normalizedChakras,

    dominant_chakra:
      dominantChakra,

   awareness_chakra:
  awarenessChakra,
  };

  /*
   * ------------------------------------------------
   * ⚡ DISTORTIONS
   * ------------------------------------------------
   */

  const distortions = {

    distorted:
      distortedBehaviours,

    integrated:
      integratedBehaviours,

    contractionLevel:

      energy.contraction,

    expansionLevel:

      energy.expansion,

    dominantPolarity:

      energy.feminine >
      energy.masculine

        ? "feminine"

        : "masculine",
  };

  /*
   * ------------------------------------------------
   * 🪞 LENS MEMORY
   * ------------------------------------------------
   */

const allLensEntries =

  signals.flatMap(
    (s: any) => [

      ...(s?.ai_lens
        ?.people || []),

      ...(s?.ai_lens
        ?.places || []),

      ...(s?.ai_lens
        ?.things || []),
    ]
  );

  /*
   * ------------------------------------------------
   * 👁 OBSERVABLE SCENES
   * ------------------------------------------------
   */

  const observableScenes =
    unique(

      allLensEntries

        .map(
          (l: any) =>
            l?.observable_scene
        )

        .filter(Boolean)

    ).slice(0, 20);

  /*
   * ------------------------------------------------
   * 🌊 MANIFESTATIONS
   * ------------------------------------------------
   */

  const recurringManifestations =
    unique(

      allLensEntries

        .map(
          (l: any) =>
            l?.manifestation
        )

        .filter(Boolean)
    );

  /*
   * ------------------------------------------------
   * 🛡 COPING
   * ------------------------------------------------
   */

  const recurringCopingStrategies =
    unique(

      allLensEntries

        .map(
          (l: any) =>
            l?.coping_strategy
        )

        .filter(Boolean)
    );

  /*
   * ------------------------------------------------
   * 🫀 BODY RESPONSES
   * ------------------------------------------------
   */

  const recurringBodyResponses =
    unique(

      allLensEntries

        .map(
          (l: any) =>
            l?.body_response
        )

        .filter(Boolean)
    );

  /*
   * ------------------------------------------------
   * 🪞 MIRROR PROMPTS
   * ------------------------------------------------
   */

  const recurringMirrorPrompts =
    unique(

      allLensEntries

        .map(
          (l: any) =>
            l?.mirror_prompt
        )

        .filter(Boolean)
    );

  /*
   * ------------------------------------------------
   * 🌈 CHAKRA MANIFESTATIONS
   * ------------------------------------------------
   */

  const chakraManifestations:
    Record<string, any[]>
      = {};

  allLensEntries.forEach(
    (entry: any) => {

      const behaviour =
        enrichedBehaviours.find(
          (b: any) =>

            b.id ===
            entry.behaviour_id
        );

      const weights =
        behaviour
          ?.chakra_weights || {};

      Object.entries(
        weights
      ).forEach(
        ([chakra, value]) => {

          if (
            Number(value) <= 0.5
          ) {
            return;
          }

          if (
            !chakraManifestations[
              chakra
            ]
          ) {

            chakraManifestations[
              chakra
            ] = [];
          }

          chakraManifestations[
            chakra
          ].push({

            ...entry,

            chakra_weight:
              value,

            behaviour,
          });
        }
      );
    }
  );

  /*
   * ------------------------------------------------
   * 🧹 DEDUPE CHAKRAS
   * ------------------------------------------------
   */

  Object.keys(
    chakraManifestations
  ).forEach((chakra) => {

    chakraManifestations[
      chakra
    ] =

      chakraManifestations[
        chakra
      ].slice(0, 12);
  });

  /*
   * ------------------------------------------------
   * 🌍 REALITY LAYERS
   * ------------------------------------------------
   */

  const realityLayers = {

    physical: {

      observableScenes,

      recurringBodyResponses,

      nervousSystemState:

        energy.contraction > 0.7

          ? "protective"

          : "open",

      contraction:
        energy.contraction,

      expansion:
        energy.expansion,
    },

    emotional: {

      patterns:
        enrichedPatterns,

      distortions,

      recurringManifestations,

      recurringCopingStrategies,

      recurringMirrorPrompts,
    },

    energetic: {

      dominantChakra,

      awarenessChakra,

      chakras:
        normalizedChakras,

      chakraManifestations,
    },

    consciousness: {

      dominantStates:

        unique(

          signals.map(
            (s) =>
              s?.dominant_state
          )
        ),

      nervousSystemStates:

        unique(

          signals.map(
            (s) =>
              s?.nervous_system_state
          )
        ),

      energeticDirections:

        unique(

          signals.map(
            (s) =>
              s?.energetic_direction
          )
        ),

      integrationNeeds:

        unique(

          enrichedBehaviours.map(
            (b: any) =>

              b?.integration_step
          )
        ),

      soulLessons:

        unique(

          enrichedPatterns.map(
            (p: any) =>

              p?.soul_lesson
          )
        ),

      gifts:

        unique(

          enrichedPatterns.map(
            (p: any) =>
              p?.gift
          )
        ),
    },
  };

  /*
   * ------------------------------------------------
   * 🪞 MIRROR CONTEXT
   * ------------------------------------------------
   */

 /*
 * ------------------------------------------------
 * 🪞 MIRROR CONTEXT
 * ------------------------------------------------
 */

const context =
  await buildMirrorContext({

    // ⚡ ENERGY
    energy,

    // 🌊 SIGNALS
    signals,

    // 👁 ACTIVE LENS
    activeLens,

    // 🌍 REALITY
    realityLayers,

    // 🧠 HYDRATED FIELD
    enrichedBehaviours,

    enrichedPatterns,

    distortions,

    // 🪞 RELATIONAL MEMORY
    lensEntries:
      allLensEntries,

    // 🌍 LANGUAGE
    languageContext: {

      code:
        language,
    },
  });

/*
 * ------------------------------------------------
 * ✨ FINAL
 * ------------------------------------------------
 */

return {

  ready: true,

  source,

  activeLens,

  /*
   * 👤 PROFILE
   */

  profile,

  language,

  childhoodSignals:

    profile
      ?.childhood_signals || {},

  /*
   * 🌊 SIGNALS
   */

  signals,

  /*
   * ⚡ ENERGY
   */

  energy,

  dominantChakra,

  awarenessChakra,

  /*
   * 🧿 FIELD
   */

  behaviours:
    behaviourIds,

  enrichedBehaviours,

  patterns:
    patternIds,

  enrichedPatterns,

  distortions,

  chakraManifestations,

  // 🪞 NEW
  lensEntries:
    allLensEntries,

  /*
   * 👁 OBSERVABLE
   */

  observableScenes,

  /*
   * 🪞 LONGITUDINAL
   */

  recurringManifestations,

  recurringCopingStrategies,

  recurringBodyResponses,

  recurringMirrorPrompts,

  /*
   * 🌍 REALITY
   */

  realityLayers,

  /*
   * 🪞 CONTEXT
   */

  context,
};
}