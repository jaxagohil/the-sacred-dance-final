// /lib/context/buildLensContext.ts

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

  distortions?: any;

  realityLayers?: any;

  energy?: any;
};

// --------------------------------------------------
// 🧠 HELPERS
// --------------------------------------------------

const unique = (arr: any[]) =>

  [...new Set(arr)].filter(
    Boolean
  );

// --------------------------------------------------
// 🚀 MAIN
// --------------------------------------------------

export async function buildLensContext({

  lens,

  lensEntries = [],

  patterns = [],

  distortions,

  realityLayers,

  energy,

}: BuildLensContextInput) {

  // --------------------------------------------------
  // 🪞 FILTER ENTRIES
  // --------------------------------------------------

  const entries =

    lensEntries.filter(
      (e: any) =>
        e?.lens === lens
    );

    console.log(
  "🪞 RAW LENS ENTRIES:",
  lensEntries
);

  // --------------------------------------------------
  // 🪞 OBSERVABLE SCENES
  // --------------------------------------------------

  const observableScenes =
    unique(

      entries.map(
        (m: any) =>
          m?.observable_scene
      )
    ).slice(0, 10);

  // --------------------------------------------------
  // 🌊 MANIFESTATIONS
  // --------------------------------------------------

  const manifestations =
    unique(

      entries.map(
        (m: any) =>
          m?.manifestation
      )
    ).slice(0, 10);

  // --------------------------------------------------
  // ⚡ BODY RESPONSES
  // --------------------------------------------------

  const bodyResponses =
    unique(

      entries.map(
        (m: any) =>
          m?.body_response
      )
    ).slice(0, 10);

  // --------------------------------------------------
  // 🛡 COPING STRATEGIES
  // --------------------------------------------------

  const copingStrategies =
    unique(

      entries.map(
        (m: any) =>
          m?.coping_strategy
      )
    ).slice(0, 10);

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
  // ⚡ NERVOUS SYSTEM
  // --------------------------------------------------

const nervousSystemState =

  realityLayers
    ?.physical
    ?.nervousSystemState ||

  "open";

  // --------------------------------------------------
  // 🌊 LENS TENSION
  // --------------------------------------------------

  let lensTension =
    null;

  if (
    lens === "people"
  ) {

    lensTension =
      "relational safety and emotional closeness";
  }

  if (
    lens === "places"
  ) {

    lensTension =
      "environmental regulation and nervous system safety";
  }

  if (
    lens === "things"
  ) {

    lensTension =
      "coping systems and emotional avoidance";
  }

  // --------------------------------------------------
  // 🪞 MIRROR THREADS
  // --------------------------------------------------

  const mirrorThreads =

    patterns

      .map(
        (p: any) =>

          p?.mirror_theme ||

          p?.name ||

          p?.id
      )

      .filter(Boolean)

      .slice(0, 5);

  // --------------------------------------------------
  // 🌈 CHAKRA THEMES
  // --------------------------------------------------

  const chakraThemes =
    unique(

      patterns.flatMap(
        (p: any) => [

          p?.chakra,

          ...(p?.secondary_chakras || [])
        ]
      )
    );

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

    // 🪞 patterns
    dominantPattern:

      patterns?.[0]?.id ||

      patterns?.[0]?.name ||

      null,

    mirrorThreads,

    chakraThemes,

    // 👁 observable
    observableScenes,

    manifestations,

    bodyResponses,

    copingStrategies,

    mirrorPrompts,

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
  };
}