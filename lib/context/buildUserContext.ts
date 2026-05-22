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

  ...new Set(arr),

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

function weightedAverage(
  values: {
    value: number;
    weight?: number;
  }[]
) {

  if (!values.length)
    return 0;

  const totalWeight =
    values.reduce(
      (sum, v) =>
        sum + (v.weight || 1),
      0
    );

  if (!totalWeight)
    return 0;

  return (

    values.reduce(
      (sum, v) =>

        sum +

        (
          v.value *
          (v.weight || 1)
        ),

      0
    ) /

    totalWeight
  );
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

      patternField: {},

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

          (
            s?.ai_behaviours || []
          ).map(
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

          (
            s?.ai_patterns || []
          ).map(
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
   * 🌊 PATTERN FIELD
   * ------------------------------------------------
   */

  const patternField:
    Record<string, any>
      = {};

  signals.forEach(
    (signal: any) => {

      const patterns =
        signal?.ai_patterns ||
        [];

      patterns.forEach(
        (p: any) => {

          const patternId =

            typeof p ===
            "string"

              ? p

              : p?.id;

          if (!patternId) {

            return;
          }

          if (
            !patternField[
              patternId
            ]
          ) {

            patternField[
              patternId
            ] = {

              id:
                patternId,

              pattern:
                null,

              signals: [],

              signalCount: 0,

              activation: 0,

              feminine: 0,

              masculine: 0,

              contraction: 0,

              expansion: 0,

              emotions: [],

              behaviours: [],

              lenses: [],

              manifestations: [],

              dominantChakra:
                null,
            };
          }

          patternField[
            patternId
          ].signals.push(
            signal
          );

          patternField[
            patternId
          ].signalCount += 1;
        }
      );
    }
  );

  /*
   * ------------------------------------------------
   * 🌊 ENRICH PATTERN FIELD
   * ------------------------------------------------
   */

  Object.keys(
    patternField
  ).forEach(
    (patternId) => {

      const field =
        patternField[
          patternId
        ];

      const pattern =
        enrichedPatterns.find(
          (p: any) =>
            p.id ===
            patternId
        );

      field.pattern =
        pattern || null;

      field.activation =
        Math.min(
          1,
          field.signalCount /
            10
        );

      const fieldSignals =
        field.signals || [];

field.feminine =
  weightedAverage(

    fieldSignals.flatMap(
      (s: any) =>

        (s?.ai_behaviours || [])
          .map((b: any) => ({

            value:

              Number(
                s?.energy
                  ?.feminine || 0
              ),

            weight:
              b?.occurrences || 1,
          }))
    )
  );

field.masculine =
  weightedAverage(

    fieldSignals.flatMap(
      (s: any) =>

        (s?.ai_behaviours || [])
          .map((b: any) => ({

            value:

              Number(
                s?.energy
                  ?.masculine || 0
              ),

            weight:
              b?.occurrences || 1,
          }))
    )
  );

field.contraction =
  weightedAverage(

    fieldSignals.flatMap(
      (s: any) =>

        (s?.ai_behaviours || [])
          .map((b: any) => ({

            value:

              Number(
                s?.energy
                  ?.contraction || 0
              ),

            weight:
              b?.occurrences || 1,
          }))
    )
  );
field.expansion =
  weightedAverage(

    fieldSignals.flatMap(
      (s: any) =>

        (s?.ai_behaviours || [])
          .map((b: any) => ({

            value:

              Number(
                s?.energy
                  ?.expansion || 0
              ),

            weight:
              b?.occurrences || 1,
          }))
    )
  );

      field.emotions =
        unique(

          fieldSignals.flatMap(
            (s: any) =>
              s?.ai_emotions ||
              []
          )
        );

      field.behaviours =
        unique(

          fieldSignals.flatMap(
            (s: any) =>

              (
                s?.ai_behaviours ||
                []
              ).map(
                (b: any) =>

                  typeof b ===
                  "string"

                    ? b

                    : b?.id
              )
          )
        );

      field.lenses =
        unique(

          fieldSignals.flatMap(
            (s: any) => [

              ...(
                s?.ai_lens
                  ?.people ||
                []
              ),

              ...(
                s?.ai_lens
                  ?.places ||
                []
              ),

              ...(
                s?.ai_lens
                  ?.things ||
                []
              ),
            ]
          )
        );
    }
  );

  /*
   * ------------------------------------------------
   * 🌈 LOAD CHAKRA ROWS
   * ------------------------------------------------
   */

  const {
    data: chakraRows,
  } = await supabase

    .from(
      "pattern_chakra_manifestations"
    )

    .select("*")

    .in(
      "pattern_key",

      patternIds.length
        ? patternIds
        : ["___empty___"]
    )

    .eq(
      "language",
      language
    );

/*
 * ------------------------------------------------
 * 🌈 BUILD CHAKRA POLARITY MAP
 * ------------------------------------------------
 */

const chakraPolarityMap:
  Record<string, number>
    = {};

(
  chakraRows || []
).forEach(
  (row: any) => {

    const field =

      patternField[
        row?.pattern_key
      ];

    if (!field) {

      return;
    }

    const chakra =
      row?.chakra_key;

    const weight =
      Number(
        row?.weight || 0
      );

    const activation =
      Number(
        field?.activation || 0
      );

    const contraction =
      Number(
        field?.contraction || 0
      );

    const expansion =
      Number(
        field?.expansion || 0
      );

    /*
     * negative
     * =
     * contracted
     *
     * positive
     * =
     * expansive
     */

    const polarity =
      expansion -
      contraction;

    chakraPolarityMap[
      chakra
    ] =

      (
        chakraPolarityMap[
          chakra
        ] || 0
      ) +

      (
        polarity *
        activation *
        weight
      );
  }
);

/*
 * ------------------------------------------------
 * 🌈 CLAMP CHAKRAS
 * ------------------------------------------------
 */

Object.keys(
  chakraPolarityMap
).forEach((chakra) => {

  chakraPolarityMap[
    chakra
  ] = Math.max(
    -1,

    Math.min(
      1,

      chakraPolarityMap[
        chakra
      ]
    )
  );
});

/*
 * ------------------------------------------------
 * 👁 DOMINANT CHAKRA
 * ------------------------------------------------
 */

const dominantChakra =
  getDominantChakra(
    chakraPolarityMap
  );

  /*
   * ------------------------------------------------
   * 🌈 ATTACH DOMINANT CHAKRA
   * ------------------------------------------------
   */

  Object.keys(
    patternField
  ).forEach(
    (patternId) => {

      const relatedRows =

        (
          chakraRows || []
        ).filter(
          (r: any) =>

            r?.pattern_key ===
            patternId
        );

      const chakraTotals:
        Record<
          string,
          number
        > = {};

      relatedRows.forEach(
        (row: any) => {

          chakraTotals[
            row?.chakra_key
          ] =

            (
              chakraTotals[
                row
                  ?.chakra_key
              ] || 0
            ) +

            Number(
              row?.weight ||
                0
            );
        }
      );

      const dominant =
        Object.entries(
          chakraTotals
        )

          .sort(
            (a, b) =>

              Number(
                b[1]
              ) -

              Number(
                a[1]
              )
          )[0]?.[0] ||
        null;

      patternField[
        patternId
      ].dominantChakra =
        dominant;
    }
  );

  /*
   * ------------------------------------------------
   * ⚡ ENERGY VALUES
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
    }
  );

  /*
   * ------------------------------------------------
   * 🌑 DISTORTED
   * ------------------------------------------------
   */

  const distortedBehaviours =

    enrichedBehaviours

      .filter(
        (b: any) =>

          b?.quality ===
          "distorted"
      )

      .sort(
        (a: any, b: any) => {

          const aStrength =

            Number(
              a?.contraction ||
                0
            );

          const bStrength =

            Number(
              b?.contraction ||
                0
            );

          return (
            bStrength -
            aStrength
          );
        }
      )

      .slice(0, 3);

  /*
   * ------------------------------------------------
   * 🌕 INTEGRATED
   * ------------------------------------------------
   */

  const integratedBehaviours =

    enrichedBehaviours.filter(
      (b: any) =>

        b?.quality ===
        "divine"
    );

  /*
   * ------------------------------------------------
   * 🌈 AWARENESS CHAKRA
   * ------------------------------------------------
   */

  const awarenessMap:
    Record<string, number>
      = {};

const chakraKeys =
  Object.keys(
    chakraPolarityMap
  );

const avg = 0;

  const distortionMap:
    Record<string, number>
      = {};

  const activatedPatternIds =
    Object.keys(
      patternField
    );

  (
    chakraRows || []
  ).forEach(
    (row: any) => {

      if (

        activatedPatternIds.includes(
          row?.pattern_key
        )

      ) {

        const chakra =
          row?.chakra_key;

        const weight =
          Number(
            row?.weight || 0
          );

        const activation =

          patternField[
            row?.pattern_key
          ]?.activation ||
          0;

        distortionMap[
          chakra
        ] =

          (
            distortionMap[
              chakra
            ] || 0
          ) +

          (
            weight *
            activation
          );
      }
    }
  );

  chakraKeys.forEach(
    (chakra) => {

const activation =

  chakraPolarityMap[
    chakra
  ] || 0;

const deviation =
  Math.abs(
    activation
  );

      const distortion =

        distortionMap[
          chakra
        ] || 0;

awarenessMap[
  chakra
] =

  (
    deviation * 2
  ) +

  (
    distortion * 0.15
  );
    }
  );

  const awarenessChakra =
    Object.entries(
      awarenessMap
    )

      .sort(
        (a, b) =>

          Number(b[1]) -

          Number(a[1])
      )[0]?.[0] ||
    null;

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
      chakraPolarityMap,

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
   * 🪞 LENS ENTRIES
   * ------------------------------------------------
   */

  const allLensEntries =

    signals.flatMap(
      (s: any) => [

        ...(
          s?.ai_lens
            ?.people || []
        ),

        ...(
          s?.ai_lens
            ?.places || []
        ),

        ...(
          s?.ai_lens
            ?.things || []
        ),
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
   * 🌊 RECURRING
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

  const recurringCopingStrategies =
    unique(

      allLensEntries

        .map(
          (l: any) =>
            l?.coping_strategy
        )

        .filter(Boolean)
    );

  const recurringBodyResponses =
    unique(

      allLensEntries

        .map(
          (l: any) =>
            l?.body_response
        )

        .filter(Boolean)
    );

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
    Record<
      string,
      any[]
    > = {};

  Object.keys(
    chakraPolarityMap
  ).forEach((chakra) => {

    const relatedManifestations =

      (
        chakraRows || []
      )

        .filter(
          (row: any) =>

            row?.chakra_key ===
            chakra
        )

        .sort(
          (a: any, b: any) =>

            Number(
              b?.weight || 0
            ) -

            Number(
              a?.weight || 0
            )
        );

    chakraManifestations[
      chakra
    ] =

      relatedManifestations.map(
        (row: any) => ({
  pattern_key:
    row?.pattern_key,

  chakra_weight:
    row?.weight || 0,

  // existing
  body_response:
    row?.body_response || null,

  manifestation:
    row?.manifestation || null,

  observable_scene:
    row?.observable_scene || null,

  integration:
    row?.integration || null,

  // NEW
  wound_expression:
    row?.wound_expression || null,

  integration_path:
    row?.integration_path || null,

  reflective_prompt:
    row?.reflective_prompt || null,

  relational_expression:
    row?.relational_expression || null,

  feminine_manifestation:
    row?.feminine_manifestation || null,

  masculine_manifestation:
    row?.masculine_manifestation || null,
})
      );
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

        energy.contraction >
        0.7

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

      patternField,

      distortions,

      recurringManifestations,

      recurringCopingStrategies,

      recurringMirrorPrompts,
    },

    energetic: {

      dominantChakra,

      awarenessChakra,

      chakras:
        chakraPolarityMap,

      chakraManifestations,
    },

    consciousness: {

      dominantStates:

        unique(

          signals.map(
            (s: any) =>
              s?.dominant_state
          )
        ),

      nervousSystemStates:

        unique(

          signals.map(
            (s: any) =>
              s?.nervous_system_state
          )
        ),

      energeticDirections:

        unique(

          signals.map(
            (s: any) =>
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

  const context =
    await buildMirrorContext({

      energy,

      signals,

      activeLens,

      realityLayers,

      enrichedBehaviours,

      enrichedPatterns,

      patternField,

      distortions,

      lensEntries:
        allLensEntries,

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
        ?.childhood_signals ||
      {},

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

    patternField,

    distortions,

    chakraManifestations,

    /*
     * 🪞 LENSES
     */

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