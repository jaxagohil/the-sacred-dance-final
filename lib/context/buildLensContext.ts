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

  behaviours?: any[];

  patterns?: string[];

  mirror?: any;

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

  behaviours = [],

  patterns = [],

  mirror,

  energy,

}: BuildLensContextInput) {

  // --------------------------------------------------
  // 🧠 BEHAVIOUR IDS
  // --------------------------------------------------

  const behaviourIds =
    behaviours

      .map(
        (b: any) =>
          b?.id
      )

      .filter(Boolean);

  // --------------------------------------------------
  // 🪞 DB LOOKUP
  // --------------------------------------------------

  const { data: lensMappings } =
    await supabase

      .from(
        "behaviour_lens_weights"
      )

      .select("*")

      .eq("lens", lens)

      .in(
        "behaviour_id",
        behaviourIds
      )

      .order(
        "weight",
        {
          ascending: false,
        }
      );

  // --------------------------------------------------
  // 🪞 OBSERVABLE SCENES
  // --------------------------------------------------

  const observableScenes =
    unique(

      lensMappings?.map(
        (m: any) =>
          m.observable_scene
      ) || []
    ).slice(0, 10);

  // --------------------------------------------------
  // 🌊 MANIFESTATIONS
  // --------------------------------------------------

  const manifestations =
    unique(

      lensMappings?.map(
        (m: any) =>
          m.manifestation
      ) || []
    ).slice(0, 10);

  // --------------------------------------------------
  // ⚡ BODY RESPONSES
  // --------------------------------------------------

  const bodyResponses =
    unique(

      lensMappings?.map(
        (m: any) =>
          m.body_response
      ) || []
    ).slice(0, 10);

  // --------------------------------------------------
  // 🛡 COPING STRATEGIES
  // --------------------------------------------------

  const copingStrategies =
    unique(

      lensMappings?.map(
        (m: any) =>
          m.coping_strategy
      ) || []
    ).slice(0, 10);

  // --------------------------------------------------
  // 🪞 MIRROR PROMPTS
  // --------------------------------------------------

  const mirrorPrompts =
    unique(

      lensMappings?.map(
        (m: any) =>
          m.mirror_prompt
      ) || []
    ).slice(0, 10);

  // --------------------------------------------------
  // 🌱 INTEGRATED EXPRESSIONS
  // --------------------------------------------------

  const integratedExpressions =
    unique(

      lensMappings?.map(
        (m: any) =>
          m.integrated_expression
      ) || []
    ).slice(0, 10);

  // --------------------------------------------------
  // 🔥 STRONGEST BEHAVIOURS
  // --------------------------------------------------

  const strongestBehaviours =
    lensMappings?.slice(
      0,
      5
    ) || [];

  // --------------------------------------------------
  // ⚡ NERVOUS SYSTEM
  // --------------------------------------------------

  const nervousSystemState =

    energy?.contraction >
    0.7

      ? "protective"

      : "open";

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
    patterns.slice(0, 5);

  // --------------------------------------------------
  // ✨ RETURN
  // --------------------------------------------------

  return {

    lens,

    dominantPattern:
      patterns?.[0] || null,

    mirrorThreads,

    observableScenes,

    manifestations,

    bodyResponses,

    copingStrategies,

    mirrorPrompts,

    integratedExpressions,

    strongestBehaviours,

    nervousSystemState,

    contraction:
      energy?.contraction || 0,

    expansion:
      energy?.expansion || 0,

    dominantChakra:
      energy?.dominant_chakra ||
      null,

    awarenessChakra:

      energy
        ?.awareness_chakra ||

      energy
        ?.dominant_chakra ||

      null,

    lensTension,

    levels:
      mirror?.levels || {},
  };
}