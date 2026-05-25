// /lib/context/buildLensContext.ts

import { supabase } from "../../services/supabase";

// --------------------------------------------------
// 🪞 BUILD LENS CONTEXT
// --------------------------------------------------

type BuildLensContextInput = {

  lens:
    | "people"
    | "places"
    | "things";

  lensEntries?: any[];

  patterns?: any[];

  patternField?: Record<
    string,
    any
  >;

  distortions?: any;

  realityLayers?: any;

  energy?: any;

  spiralState?: any;

  fieldAmplification?: any[];
};

// --------------------------------------------------
// 🧠 HELPERS
// --------------------------------------------------

const unique = (
  arr: any[]
) =>

  [...new Set(arr)].filter(
    Boolean
  );

const buildThreads = (
  values: any[]
) => {

  const map =
    new Map();

  values
    .filter(Boolean)

    .forEach((v) => {

      const key =
        String(v).trim();

      if (!map.has(key)) {

        map.set(key, {

          text: key,

          frequency: 1,
        });

      } else {

        map.get(
          key
        ).frequency += 1;
      }
    });

  return Array.from(
    map.values()
  )

    .sort(
      (a: any, b: any) =>

        b.frequency -
        a.frequency
    )

    .slice(0, 10);
};

// --------------------------------------------------
// 🚀 MAIN
// --------------------------------------------------

export async function buildLensContext({

  lens,

  lensEntries = [],

  patterns = [],

  patternField = {},

  distortions,

  realityLayers,

  energy,

  spiralState,

  fieldAmplification = [],

}: BuildLensContextInput) {

  // --------------------------------------------------
  // 🪞 FILTER ENTRIES
  // --------------------------------------------------

  const entries =

    lensEntries.filter(
      (e: any) =>
        e?.lens === lens
    );

  // --------------------------------------------------
// 🧠 LOAD LENS KEYWORDS
// --------------------------------------------------

const {
  data: lensKeywords = [],
} = await supabase

  .from("lens_keywords")

  .select("*")

  .eq("active", true);
  
  
  // --------------------------------------------------
  // 🌊 PATTERN FIELD
  // --------------------------------------------------

  const activePatterns =

    Object.values(
      patternField || {}
    )

      .sort(
        (a: any, b: any) =>

          Number(
            b?.activation || 0
          ) -

          Number(
            a?.activation || 0
          )
      )

      .slice(0, 10);

  // --------------------------------------------------
// 🌀 SPIRAL FIELD
// --------------------------------------------------

const dominantPole =

  spiralState
    ?.dominant_pole ||

  "center";

const spiralMovement =

  spiralState
    ?.spiral_state ||

  "processing";

const integrationScore =

  spiralState
    ?.integration_score ||

  0;

const recurringPatterns =

  spiralState
    ?.recurring_patterns ||

  [];

const dominantLayer =

  spiralState
    ?.dominant_layer ||

  "emotional";    

  // --------------------------------------------------
  // 🌊 DOMINANT LENS PATTERNS
  // --------------------------------------------------

  const dominantLensPatterns =

    activePatterns

      .filter((p: any) => {

        const lenses =
          p?.lenses || [];

        return lenses.includes(
          lens
        );
      })

      .slice(0, 5);

  // --------------------------------------------------
  // 🌊 PATTERN NARRATIVE
  // --------------------------------------------------

  const patternNarratives =

    dominantLensPatterns.map(
      (p: any) => ({

        id:
          p?.pattern?.id,

        name:
          p?.pattern?.name,

        activation:
          p?.activation || 0,

        signalCount:
          p?.signalCount || 0,

        dominantChakra:
          p?.dominantChakra,

        polarity:

          (
            p?.contraction || 0
          ) >

          (
            p?.expansion || 0
          )

            ? "contracted"

            : "expanding",

        mirrorTheme:

          p?.pattern
            ?.mirror_theme ||

          p?.pattern
            ?.description ||

          null,

        leftPole:

          p?.pattern
            ?.left_pole_label ||

          null,

rightPole:

  p?.pattern
    ?.right_pole_label ||

  null,

reflectionPrompts:

  p?.pattern
    ?.reflection_prompts ||

  [],

manifestationQuestions:

  p?.pattern
    ?.manifestation_questions ||

  [],

observableDynamics:

  p?.pattern
    ?.observable_dynamics ||

  [],

chakraManifestations:

  p?.pattern
    ?.chakra_manifestations ||

  [],
      })
    );

  // --------------------------------------------------
  // ⚡ TOTAL SIGNALS
  // --------------------------------------------------

  const totalSignals =

    realityLayers
      ?.consciousness
      ?.signalCount ||

    0;

  // --------------------------------------------------
  // 🌊 NARRATIVE INTENSITY
  // --------------------------------------------------

  let narrativeIntensity =
    "soft";

if (totalSignals >= 20) {

  narrativeIntensity =
    "moderate";
}

if (totalSignals >= 45) {

  narrativeIntensity =
    "deep";
}

  // --------------------------------------------------
  // 👁 OBSERVABLE SCENES
  // --------------------------------------------------

  const observableSceneThreads =
    buildThreads(

      entries.map(
        (m: any) =>
          m?.observable_scene
      )
    );

  // --------------------------------------------------
  // 🌊 MANIFESTATIONS
  // --------------------------------------------------

  const manifestationThreads =
    buildThreads(

      entries.map(
        (m: any) =>
          m?.manifestation
      )
    );

  // --------------------------------------------------
  // ⚡ BODY RESPONSES
  // --------------------------------------------------

  const bodyResponseThreads =
    buildThreads(

      entries.map(
        (m: any) =>
          m?.body_response
      )
    );

  // --------------------------------------------------
  // 🛡 COPING STRATEGIES
  // --------------------------------------------------

  const copingStrategyThreads =
    buildThreads(

      entries.map(
        (m: any) =>
          m?.coping_strategy
      )
    );

  // --------------------------------------------------
  // 🪞 MIRROR PROMPTS
  // --------------------------------------------------

  const mirrorPrompts =
    unique(

      entries.map(
        (m: any) =>
          m?.mirror_prompt
      )
    ).slice(0, 10);

  // --------------------------------------------------
  // 🌱 INTEGRATED EXPRESSIONS
  // --------------------------------------------------

  const integratedExpressions =
    unique(

      entries.map(
        (m: any) =>
          m?.integrated_expression
      )
    ).slice(0, 10);

  // --------------------------------------------------
  // 🔥 STRONGEST ENTRIES
  // --------------------------------------------------

  const strongestEntries =

    [...entries]

      .sort(
        (a, b) =>

          Number(
            b?.weight || 0
          ) -

          Number(
            a?.weight || 0
          )
      )

      .slice(0, 5);

  // --------------------------------------------------
  // 🪞 REFLECTION EVIDENCE
  // --------------------------------------------------

  const reflectionEvidence =

    strongestEntries.map(
      (entry: any) => ({

        summary:

          entry?.source_summary ||

          null,

        reflection:

          entry?.source_reflection ||

          null,

        depth:

          entry?.source_signal_depth ||

          1,

        sourceType:

          entry?.source_type ||

          "unknown",

        createdAt:

          entry?.source_created_at ||

          null,
      })
    );

    // --------------------------------------------------
// 👥 RELATIONAL MIRRORS
// --------------------------------------------------

const relationalMirrors =
  buildThreads(

    entries.flatMap(
      (e: any) => [

        e?.source_summary,
        e?.source_reflection,
        e?.observable_scene,
      ]
    )
  )
    .filter((t: any) => {

      const text =
        String(
          t?.text || ""
        );

      // crude relational signal
return (
  text.length > 3
);
    })

    .slice(0, 8);

  // --------------------------------------------------
// 🧠 SEMANTIC KEYWORDS
// --------------------------------------------------

const semanticKeywords =

  (lensKeywords || []).filter(
    (k: any) => {

      if (
        k?.category !== lens
      ) {

        return false;
      }

      return reflectionEvidence.some(
        (e: any) => {

          const text = [

            e?.summary,

            e?.reflection,
          ]

            .filter(Boolean)

            .join(" ")

            .toLowerCase();

          return text.includes(

            String(
              k?.keyword || ""
            ).toLowerCase()
          );
        }
      );
    }
  );

const symbolicThemes =
  unique(

    semanticKeywords.map(
      (k: any) =>
        k?.symbolic_meaning
    )
  );

const emotionalThemes =
  unique(

    semanticKeywords.map(
      (k: any) =>
        k?.emotional_meaning
    )
  );  

  // --------------------------------------------------
  // 🪞 EVIDENCE SUMMARIES
  // --------------------------------------------------

  const evidenceSummaries =
    unique(

      reflectionEvidence

        .map(
          (e: any) =>
            e?.summary
        )

        .filter(Boolean)

    ).slice(0, 8);

  // --------------------------------------------------
  // ⚡ EVIDENCE DENSITY
  // --------------------------------------------------

const evidenceDensity =

  dominantLensPatterns.reduce(

    (
      total,
      p: any
    ) =>

      total +

      (

        Number(
          p?.activation || 0
        ) *

        Number(
          p?.signalCount || 0
        )

      ),

    0
  );

  // --------------------------------------------------
  // 🌊 EVIDENCE SCORE
  // --------------------------------------------------

  const evidenceScore =

    strongestEntries.reduce(

      (
        total,
        entry
      ) =>

        total +

        Number(
          entry?.weight || 0
        ),

      0
    );

  // --------------------------------------------------
  // 🌱 RECOGNITION LEVEL
  // --------------------------------------------------

  let recognitionLevel =
    "low";

  if (
  evidenceDensity >= 6
) {

  recognitionLevel =
    "emerging";
}

if (
  evidenceDensity >= 14
) {

  recognitionLevel =
    "recognitional";
}

if (
  evidenceDensity >= 28
) {

  recognitionLevel =
    "deep";
}

  // --------------------------------------------------
  // ⚡ NERVOUS SYSTEM
  // --------------------------------------------------

  const nervousSystemState =

    realityLayers
      ?.physical
      ?.nervousSystemState ||

    "open";

  // --------------------------------------------------
  // 🌌 FIELD AMPLIFICATION
  // --------------------------------------------------

  const activeFieldAmplification =

    fieldAmplification.filter(
      (f: any) =>

        [
          "approaching",
          "peak",
          "integrating",
        ].includes(
          f?.field_state
        )
    );

  // --------------------------------------------------
  // 🌌 ENERGETIC WEATHER
  // --------------------------------------------------

  const energeticWeather = {

    dominantEnergies:

      activeFieldAmplification.map(
        (f: any) =>
          f?.dominant_energy
      ),

    collectiveThemes:

      activeFieldAmplification.map(
        (f: any) =>
          f?.collective_theme
      ),

    energeticThemes:

      activeFieldAmplification.map(
        (f: any) =>
          f?.energetic_theme
      ),

    chakraFocuses:

      activeFieldAmplification.map(
        (f: any) =>
          f?.chakra_focus
      ),

    guidance:

      activeFieldAmplification.map(
        (f: any) =>
          f?.guidance
      ),

    states:

      activeFieldAmplification.map(
        (f: any) =>
          f?.field_state
      ),

    intensities:

      activeFieldAmplification.map(
        (f: any) =>
          Number(
            f?.intensity || 0
          )
      ),
  };

  // --------------------------------------------------
  // 🌊 LENS TENSION
  // --------------------------------------------------

  let lensTension =
    null;

  if (
    lens === "people"
  ) {

    lensTension =
     "relational mirrors, reciprocity, emotional movement, connection, visibility, and relational awareness"
  }

  if (
    lens === "places"
  ) {

    lensTension =
    "belonging, movement, nervous system resonance, expansion, grounding, and environmental awareness"
  }

  if (
    lens === "things"
  ) {

    lensTension =
      "symbolic attachment, identity, conditioning, emotional meaning, comfort seeking, expression, and subconscious patterns"
  }

  const spiralReflection =

  recurringPatterns?.length
    ? "Recurring themes may be revisiting older emotional, relational, behavioural, or nervous system terrain with increasing awareness and embodiment."
    : null;


  // --------------------------------------------------
  // 🪞 MIRROR THREADS
  // --------------------------------------------------

  const mirrorThreads =

    dominantLensPatterns

      .map(
        (p: any) =>

          p?.pattern
            ?.mirror_theme ||

          p?.pattern
            ?.name ||

          p?.id
      )

      .filter(Boolean)

      .slice(0, 5);

  // --------------------------------------------------
// 🪞 CONTEMPLATIVE THREADS
// --------------------------------------------------

const contemplativeQuestions =
  unique(

    dominantLensPatterns.flatMap(
      (p: any) =>

        p?.pattern
          ?.reflection_prompts || []
    )
  ).slice(0, 12);

const manifestationQuestions =
  unique(

    dominantLensPatterns.flatMap(
      (p: any) =>

        p?.pattern
          ?.manifestation_questions || []
    )
  ).slice(0, 12);

const observableDynamicsThreads =
  unique(

    dominantLensPatterns.flatMap(
      (p: any) =>

        p?.pattern
          ?.observable_dynamics || []
    )
  ).slice(0, 12);

const chakraManifestationThreads =
  unique(

    dominantLensPatterns.flatMap(
      (p: any) =>

        p?.pattern
          ?.chakra_manifestations || []
    )
  ).slice(0, 12);    

  // --------------------------------------------------
  // 🌈 CHAKRA THEMES
  // --------------------------------------------------

  const chakraThemes =
    Object.keys(
      energy?.chakras || {}
    )

      .sort(
        (a, b) =>

          Math.abs(
            Number(
              energy?.chakras?.[
                b
              ] || 0
            )
          ) -

          Math.abs(
            Number(
              energy?.chakras?.[
                a
              ] || 0
            )
          )
      )

      .slice(0, 5);

  // --------------------------------------------------
  // ⚡ DISTORTION FIELD
  // --------------------------------------------------

  const dominantDistortions =

    distortions
      ?.distorted

      ?.map(
        (b: any) =>

          b?.shadow_meaning ||

          b?.id
      )

      ?.filter(Boolean)

      ?.slice(0, 5) || [];

  // --------------------------------------------------
  // 🌱 INTEGRATED FIELD
  // --------------------------------------------------

  const integratedField =

    distortions
      ?.integrated

      ?.map(
        (b: any) =>

          b?.integrated_meaning ||

          b?.id
      )

      ?.filter(Boolean)

      ?.slice(0, 5) || [];

  // --------------------------------------------------
  // ✨ RETURN
  // --------------------------------------------------

  return {

    lens,

    relationalMirrors:
  lens === "people"
    ? relationalMirrors
    : [],

    // 🌊 pattern field
    patternNarratives,

    dominantPatterns:

      dominantLensPatterns,

    dominantPattern:

      dominantLensPatterns?.[0]
        ?.pattern?.id ||

      dominantLensPatterns?.[0]
        ?.pattern?.name ||

      patterns?.[0]?.id ||

      patterns?.[0]?.name ||

      null,

    // 🪞 themes
    mirrorThreads,

    chakraThemes,

    energeticWeather,

    // 👁 observable
    evidenceScore,

    recognitionLevel,

    narrativeIntensity,

    evidenceDensity,

    reflectionEvidence,

    evidenceSummaries,

    manifestationThreads,

    bodyResponseThreads,

    copingStrategyThreads,

    observableSceneThreads,

    mirrorPrompts,

    contemplativeQuestions,

manifestationQuestions,

observableDynamicsThreads,

chakraManifestationThreads,

    integratedExpressions,

    // 🔥 strongest
    strongestEntries,

    // ⚡ nervous system
    nervousSystemState,

    contraction:
      energy?.contraction || 0,

    expansion:
      energy?.expansion || 0,

    // 🌈 chakra
    dominantChakra:
      energy?.dominant_chakra ||
      null,

    awarenessChakra:

      energy
        ?.awareness_chakra ||

      energy
        ?.dominant_chakra ||

      null,

    // 🌊 tensions
    lensTension,

    dominantDistortions,

    integratedField,

    // 🌍 inherited
    levels:
      realityLayers || {},

      // 🌀 spiral
spiralMovement,
dominantPole,
integrationScore,
dominantLayer,
recurringPatterns,

semanticKeywords,
symbolicThemes,
emotionalThemes,

spiralReflection,
  };
}