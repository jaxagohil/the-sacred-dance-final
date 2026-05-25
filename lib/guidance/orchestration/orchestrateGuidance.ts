// /lib/guidance/orchestration/orchestrateGuidance.ts

import { conversationStates } from "./conversationStates";

import { responseStrategies } from "./responseStrategies";

export const orchestrateGuidance = ({

  signals,

  activePatterns,

  userHistory,

  selectedGuide =
    "guide_cosmic",

  recentMessages = [],

}: any) => {

  /*
   * ------------------------------------------------
   * 🌌 SACRED DANCE FIELD DEFAULTS
   * ------------------------------------------------
   */

  let foregroundGuide =
    selectedGuide;

  let fieldInfluences = {

    heart: 0.4,

    structure: 0.4,

    cosmic: 1.0,
  };

  let conversationState:
    keyof typeof conversationStates =
      "protective_openness";

  let responseStrategy:
    keyof typeof responseStrategies =
      "reflective";

  /*
   * ------------------------------------------------
   * 🌿 CONVERSATIONAL MOVEMENT
   * ------------------------------------------------
   */

  let conversationMovement =
    "arrival";

  /*
   * ------------------------------------------------
   * 🪞 MIRROR DEPTH
   * ------------------------------------------------
   */

  let mirrorDepth = 1;

  /*
   * ------------------------------------------------
   * 🌌 DOMINANT FIELD
   * ------------------------------------------------
   */

  let dominantField =
    "patterns";

  /*
   * ------------------------------------------------
   * 🌊 RECENT QUESTION TYPES
   * ------------------------------------------------
   */

  const recentQuestionTypes =

    recentMessages

      .map(
        (m: any) =>
          m?.questionType
      )

      .filter(Boolean);

  const lastQuestionType =

    recentQuestionTypes[
      recentQuestionTypes.length - 1
    ] || null;

  /*
   * ------------------------------------------------
   * 🌱 REALITY LAYER DETECTION
   * ------------------------------------------------
   */

  const dominantRealityLayer =

    Object.entries(
      signals.realityLayers || {}
    )

      .sort(
        (a: any, b: any) =>
          b[1] - a[1]
      )[0]?.[0]

      || "emotional";

  /*
   * ------------------------------------------------
   * 🌌 DOMINANT FIELD SELECTION
   * ------------------------------------------------
   */

  if (
    signals.spiralPhase ===
    "threshold"
  ) {

    dominantField =
      "spiral";
  }

  if (
    signals.externalFocus > 0.7
  ) {

    dominantField =
      "mirror";
  }

  if (
    dominantRealityLayer ===
    "physical"
  ) {

    dominantField =
      "grounding";
  }

  if (
    signals.symbolicTolerance > 0.75
  ) {

    dominantField =
      "symbolic";
  }

  if (
    signals.coherence > 0.8
  ) {

    dominantField =
      "integration";
  }

  /*
   * ------------------------------------------------
   * 🌊 EMOTIONAL FLOODING
   * ------------------------------------------------
   */

  if (

    signals.nervousSystem ===
      "activated"

    &&

    signals.contraction > 0.7

  ) {

    conversationState =
      "emotional_flooding";

    responseStrategy =
      "grounding";

    conversationMovement =
      "grounding";

    dominantField =
      "nervous_system";

    fieldInfluences = {

      heart: 1.0,

      structure: 0.2,

      cosmic: 0.2,
    };
  }

  /*
   * ------------------------------------------------
   * 🔄 LOOPING ATTACHMENT
   * ------------------------------------------------
   */

  if (

    signals.repetition > 0.8

    &&

    signals.externalFocus > 0.7

  ) {

    conversationState =
      "looping_attachment";

    responseStrategy =
      "redirecting";

    conversationMovement =
      "perspective_shift";

    dominantField =
      "mirror";

    fieldInfluences = {

      heart: 0.5,

      structure: 1.0,

      cosmic: 0.3,
    };
  }

  /*
   * ------------------------------------------------
   * 🌊 USER STUCKNESS
   * ------------------------------------------------
   */

  const userStuckness =

    signals.repetition > 0.7

    &&

    signals.contraction > 0.6;

  if (
    userStuckness
  ) {

    conversationState =
      "stuck_reflection";

    conversationMovement =
      "gentle_perspective";

    responseStrategy =
      "relational";

    dominantField =
      "patterns";

    fieldInfluences = {

      heart: 0.8,

      structure: 0.7,

      cosmic: 0.2,
    };
  }

  /*
   * ------------------------------------------------
   * 🌌 SYMBOLIC EXPANSION
   * ------------------------------------------------
   */

  if (

    signals.symbolicTolerance > 0.8

    &&

    signals.grounding > 0.4

  ) {

    conversationState =
      "symbolic_expansion";

    responseStrategy =
      "spaciousness";

    conversationMovement =
      "deepening";

    dominantField =
      "symbolic";

    fieldInfluences = {

      heart: 0.5,

      structure: 0.3,

      cosmic: 1.0,
    };
  }

  /*
   * ------------------------------------------------
   * ✨ INTEGRATION
   * ------------------------------------------------
   */

  if (

    signals.selfAwareness > 0.7

    &&

    signals.embodiment > 0.6

  ) {

    conversationState =
      "integration";

    responseStrategy =
      "reflective";

    conversationMovement =
      "integrating";

    dominantField =
      "integration";

    fieldInfluences = {

      heart: 0.8,

      structure: 0.7,

      cosmic: 0.9,
    };
  }

  /*
   * ------------------------------------------------
   * 🌿 PHYSICAL GROUNDING
   * ------------------------------------------------
   */

  if (

    dominantRealityLayer ===
      "physical"

  ) {

    responseStrategy =
      "grounding";
  }

  /*
   * ------------------------------------------------
   * 🌿 GROUNDING PRIORITY
   * ------------------------------------------------
   */

  const groundingPriority =

    signals.contraction > 0.6

    ||

    signals.nervousSystem ===
      "activated";

  /*
   * ------------------------------------------------
   * 🌌 READINESS FOR INSIGHT
   * ------------------------------------------------
   */

  const readinessForInsight = (

    (signals.selfAwareness || 0.5)
      * 0.3 +

    (signals.openness || 0.5)
      * 0.3 +

    (signals.embodiment || 0.5)
      * 0.2 +

    (signals.coherence || 0.5)
      * 0.2

  );

  /*
   * ------------------------------------------------
   * 🪞 MIRROR DEPTH EVOLUTION
   * ------------------------------------------------
   */

  if (
    readinessForInsight > 0.55
  ) {

    mirrorDepth = 2;
  }

  if (
    readinessForInsight > 0.7
  ) {

    mirrorDepth = 3;
  }

  if (

    readinessForInsight > 0.82

    &&

    signals.coherence > 0.7

  ) {

    mirrorDepth = 4;
  }

  /*
   * ------------------------------------------------
   * 🌊 NERVOUS SYSTEM SAFETY
   * ------------------------------------------------
   */

  if (
    groundingPriority
  ) {

    mirrorDepth = Math.min(
      mirrorDepth,
      2
    );
  }

  /*
   * ------------------------------------------------
   * 🌱 RELATIONAL OPENNESS
   * ------------------------------------------------
   */

  const relationalOpenness = (

    (signals.openness || 0.5)
      * 0.5 +

    (signals.selfAwareness || 0.5)
      * 0.5

  );

  /*
   * ------------------------------------------------
   * 🌌 GUIDE MOVEMENT PERMISSIONS
   * ------------------------------------------------
   */

  const allowPatternReflection =

    readinessForInsight > 0.55;

  const allowPerspectiveShift =

    readinessForInsight > 0.7

    &&

    signals.nervousSystem !==
      "activated";

  const allowSymbolicExpansion =

    selectedGuide ===
      "guide_cosmic"

    &&

    readinessForInsight > 0.7

    &&

    signals.symbolicTolerance > 0.6

    &&

    signals.nervousSystem !==
      "activated";

  /*
   * ------------------------------------------------
   * 🌊 REPEATED QUESTION PROTECTION
   * ------------------------------------------------
   */

  const embodimentQuestionCount =

    recentQuestionTypes.filter(
      (q: string) =>
        q === "embodiment"
    ).length;

  const avoidEmbodimentQuestions =

    embodimentQuestionCount >= 1;

  /*
   * ------------------------------------------------
   * 🌊 CONVERSATIONAL REDIRECTION
   * ------------------------------------------------
   */

  if (
    avoidEmbodimentQuestions
  ) {

    if (
      conversationMovement ===
      "grounding"
    ) {

      conversationMovement =
        "clarifying";
    }

    if (
      responseStrategy ===
      "grounding"
    ) {

      responseStrategy =
        "reflective";
    }
  }

  const avoidReflectiveQuestions =

    recentQuestionTypes.filter(
      (q: string) =>
        q === "reflective"
    ).length >= 2;

  /*
   * ------------------------------------------------
   * 💛 LOVE • PEACE • JOY
   * ------------------------------------------------
   */

  const emotionalField = {

    love:
      0.8,

    peace:
      signals.contraction < 0.5
        ? 0.7
        : 0.3,

    joy:
      signals.openness > 0.6
        ? 0.6
        : 0.2,
  };

  /*
   * ------------------------------------------------
   * 🌸 FIELD PACING REFINEMENT
   * ------------------------------------------------
   */

  if (
    emotionalField.peace > 0.7
  ) {

    conversationMovement =
      "softening";
  }

  if (

    emotionalField.love > 0.85

    &&

    signals.coherence > 0.7

  ) {

    responseStrategy =
      "relational";
  }

  if (
    emotionalField.joy > 0.65
  ) {

    fieldInfluences.cosmic += 0.1;
  }

  /*
   * ------------------------------------------------
   * 🌌 SACRED DANCE FIELD
   * ------------------------------------------------
   */

  const sacredDanceField = {

    coherence:
      signals.coherence || 0.5,

    spiralDirection:
      signals.spiralDirection
      || "integrating",

    spiralPhase:
      signals.spiralPhase
      || "recognizing",

    dominantRealityLayer,

    dominantField,

    goldPresence:
      signals.coherence > 0.7,

    fieldTone:
      signals.coherence > 0.7
        ? "warm_coherent"
        : "soft_emerging",
  };

  /*
   * ------------------------------------------------
   * 🌱 EMBODIMENT PRIORITY
   * ------------------------------------------------
   */

  const embodimentPriority =

    signals.embodiment < 0.5;

  /*
   * ------------------------------------------------
   * 🌌 SACRED DANCE PRINCIPLES
   * ------------------------------------------------
   */

  const sacredDancePrinciples = [

    "awareness_over_answers",

    "patterns_over_reactions",

    "embodiment_over_performance",

    "coherence_over_certainty",

    "spiral_awareness",

    "reality_layer_awareness",

    "masculine_feminine_balance",

    "nervous_system_compassion",

    "collective_conditioning_awareness",

    "self_return",

    "grounded_love",

    "sovereignty",

    "peace",

    "joy",

    "compassion",
  ];

  /*
   * ------------------------------------------------
   * 📦 RETURN RELATIONAL BLUEPRINT
   * ------------------------------------------------
   */

  return {

    /*
     * 🌌 GUIDE FIELD
     */

    foregroundGuide,

    fieldInfluences,

    /*
     * 🌱 CONVERSATION STATE
     */

    conversationState,

    conversationMovement,

    stateConfig:

      conversationStates[
        conversationState
      ],

    /*
     * 🌿 RESPONSE STRATEGY
     */

    responseStrategy,

    strategyConfig:

      responseStrategies[
        responseStrategy
      ],

    /*
     * 🌌 SACRED DANCE FIELD
     */

    sacredDanceField,

    dominantField,

    emotionalField,

    sacredDancePrinciples,

    /*
     * 🌊 CONVERSATIONAL MEMORY
     */

    recentQuestionTypes,

    lastQuestionType,

    relationalOpenness,

    readinessForInsight,

    mirrorDepth,

    /*
     * 🌿 MOVEMENT PERMISSIONS
     */

    allowPatternReflection,

    allowPerspectiveShift,

    allowSymbolicExpansion,

    avoidEmbodimentQuestions,

    avoidReflectiveQuestions,

    /*
     * 🌱 ORCHESTRATION OUTPUTS
     */

    symbolicDepth:

      responseStrategies[
        responseStrategy
      ].symbolicDepth,

    groundingNeeded:
      groundingPriority,

    embodimentNeeded:
      embodimentPriority,

    pacing:

      responseStrategies[
        responseStrategy
      ].pacing,

    responseLength:

      responseStrategies[
        responseStrategy
      ].responseLength,

    shouldAskQuestions:

      mirrorDepth > 2

      &&

      readinessForInsight > 0.72

      &&

      !avoidReflectiveQuestions

      &&

      signals.nervousSystem !==
        "activated",

    shouldMirrorPatterns:
      allowPatternReflection,

    shouldSuggestGrounding:
      groundingPriority,

    shouldSuggestEmbodiment:
      embodimentPriority,

    /*
     * 🌌 GUIDE FEELING
     */

    atmosphere: [

      "love",

      "peace",

      "joy",

      "softness",

      "coherence",

      "presence",
    ],

    /*
     * 🌿 AVOIDANCES
     */

    avoid: [

      "certainty",

      "dependency",

      "fear_based_spirituality",

      "emotional_overwhelm",

      "guru_posturing",

      "spiritual_inflation",
    ],
  };
};