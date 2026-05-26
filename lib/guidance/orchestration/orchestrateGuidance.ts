// /lib/guidance/orchestration/orchestrateGuidance.ts

/*
 * ------------------------------------------------
 * 🌌 ORCHESTRATE GUIDANCE
 * ------------------------------------------------
 *
 * IMPORTANT:
 *
 * This file DOES NOT create meaning.
 *
 * Mirror already created:
 * - manifestations
 * - symbolic themes
 * - tensions
 * - mirror prompts
 * - emotional movement
 * - chakra field
 * - narrative echoes
 *
 * Guidance ONLY:
 * - orchestrates
 * - sequences
 * - surfaces
 * - softens
 * - stages the moment
 *
 * ------------------------------------------------
 */

export const orchestrateGuidance = ({

  /*
   * 🌌 REAL MIRROR FIELD
   */

  mirrorContext = {},

  /*
   * 🌿 GUIDE STATE
   */

  selectedGuide,

  /*
   * 🌊 RECENT MESSAGES
   */

  recentMessages = [],

}: any) => {

  /*
   * ------------------------------------------------
   * 🌌 MIRROR FIELD
   * ------------------------------------------------
   */

  const current =

    mirrorContext?.current
      || {};

  const voice =

    mirrorContext?.voice
      || {};

  const story =

    mirrorContext?.story
      || {};

  const lens =

    mirrorContext?.lens
      || {};

  const lensContexts =

    mirrorContext
      ?.lensContexts
      || {};

  /*
   * ------------------------------------------------
   * 🌊 FIELD STATES
   * ------------------------------------------------
   */

  const coherence =

    current?.coherence
      || 0.5;

  const openness =

    current?.openness
      || 0.5;

  const symbolicTolerance =

    current
      ?.symbolicTolerance
      || 0.5;

  const nervousSystemState =

    current
      ?.nervousSystemState
      || "regulated";

  const spiralPhase =

    current
      ?.spiralPhase
      || "observing";

  /*
   * ------------------------------------------------
   * 🌌 ORCHESTRATION MODE
   * ------------------------------------------------
   */

  let orchestrationMode =
    "quiet";

  if (
    symbolicTolerance > 0.7
  ) {

    orchestrationMode =
      "symbolic";
  }

  if (
    spiralPhase ===
    "threshold"
  ) {

    orchestrationMode =
      "threshold";
  }

  if (
    nervousSystemState ===
    "contracted"
  ) {

    orchestrationMode =
      "grounding";
  }

  /*
   * ------------------------------------------------
   * 🌿 ORCHESTRATION INTENSITY
   * ------------------------------------------------
   */

  const orchestrationIntensity = (

    coherence * 0.35 +

    openness * 0.25 +

    symbolicTolerance * 0.4

  );

  /*
   * ------------------------------------------------
   * 🌊 FIELD ATMOSPHERE
   * ------------------------------------------------
   */

  let emotionalField =
    "soft";

  if (
    orchestrationMode ===
    "symbolic"
  ) {

    emotionalField =
      "cosmic";
  }

  if (
    orchestrationMode ===
    "grounding"
  ) {

    emotionalField =
      "tender";
  }

  if (
    orchestrationMode ===
    "threshold"
  ) {

    emotionalField =
      "emergent";
  }

  /*
   * ------------------------------------------------
   * 🌌 SOURCE MATERIAL
   * ------------------------------------------------
   *
   * IMPORTANT:
   *
   * These are ALREADY resolved by Mirror.
   *
   * Guidance only selects/orchestrates.
   *
   * ------------------------------------------------
   */

const symbolicThemes = [

  ...(lensContexts.people
    ?.symbolicThemes || []),

  ...(lensContexts.places
    ?.symbolicThemes || []),

  ...(lensContexts.things
    ?.symbolicThemes || []),
];

const manifestationThreads = [

  ...(lensContexts.people
    ?.manifestationThreads || []),

  ...(lensContexts.places
    ?.manifestationThreads || []),

  ...(lensContexts.things
    ?.manifestationThreads || []),
];

const reflectionEchoes =

  voice?.reflectionEchoes
    || [];

const contemplativeQuestions = [

  ...(lensContexts.people
    ?.contemplativeQuestions || []),

  ...(lensContexts.places
    ?.contemplativeQuestions || []),

  ...(lensContexts.things
    ?.contemplativeQuestions || []),
];

  /*
   * ------------------------------------------------
   * 🌊 FLOATING WHISPERS
   * ------------------------------------------------
   *
   * Surface:
   * - symbolic themes
   * - manifestations
   * - mirror echoes
   *
   * ------------------------------------------------
   */

  const atmosphericWhispers = [

    ...symbolicThemes,

    ...manifestationThreads,

  ]

    .slice(0, 5)

    .map(
      (
        item: any,
        index: number
      ) => ({

        id:
          `whisper_${index}`,

        guide:

          index % 2 === 0

            ? "guide_cosmic"

            : "guide_heart",

        intensity:

          orchestrationIntensity,

        /*
         * 🌌 REAL MIRROR CONTENT
         */

text:

  typeof item === "string"

    ? item

    : item?.text
      || item?.theme
      || item?.manifestation
      || "",
      })
    )

    .filter(
      (w: any) => !!w.text
    );

  /*
   * ------------------------------------------------
   * 🌿 GUIDE FRAGMENTS
   * ------------------------------------------------
   *
   * Surface:
   * - reflection echoes
   * - contemplative questions
   * - symbolic realizations
   *
   * ------------------------------------------------
   */

  const orchestrationFragments = [

    ...reflectionEchoes,

    ...contemplativeQuestions,

  ]

    .slice(0, 3)

    .map(
      (
        item: any,
        index: number
      ) => ({

        id:
          `fragment_${index}`,

        guide:

          index === 0

            ? "guide_cosmic"

            : index === 1

              ? "guide_heart"

              : "guide_structure",

        intensity:

          orchestrationIntensity,

        /*
         * 🌌 REAL MIRROR CONTENT
         */

        text:

  typeof item === "string"

    ? item

    : item?.text
      || item?.prompt
      || item?.question
      || "",
      })
    )

    .filter(
      (f: any) => !!f.text
    );

  /*
   * ------------------------------------------------
   * 🌊 FIELD PACING
   * ------------------------------------------------
   */

  let pacing =
    "slow";

  if (
    orchestrationIntensity
      > 0.72
  ) {

    pacing =
      "floating";
  }

  if (
    orchestrationMode ===
    "grounding"
  ) {

    pacing =
      "gentle";
  }

  /*
   * ------------------------------------------------
   * 🌌 RETURN FIELD
   * ------------------------------------------------
   */

  return {

    /*
     * 🌊 MODES
     */

    orchestrationMode,

    orchestrationStyle:
      orchestrationMode,

    orchestrationIntensity,

    /*
     * 🌌 FIELD
     */

    emotionalField,

    pacing,

    /*
     * 🌿 GUIDES
     */

    foregroundGuide:
      selectedGuide,

    /*
     * ✨ LIVE CONTENT
     */

    atmosphericWhispers,

    orchestrationFragments,

    /*
     * 🌊 GUIDE MOVEMENT
     */

    allowGuideConversation:
      orchestrationFragments
        .length > 0,

    allowPatternReflection:
      true,

    allowSymbolicExpansion:

      symbolicTolerance
        > 0.65,

    /*
     * 🌌 FIELD STATES
     */

    mirrorDepth:
      coherence,

    readinessForInsight:
      openness,

    /*
     * 🌿 FIELD INFLUENCES
     */

    fieldInfluences: {

      symbolicThemes:
        symbolicThemes.length,

      manifestations:
        manifestationThreads.length,

      echoes:
        reflectionEchoes.length,

      contemplations:

        contemplativeQuestions
          .length,
    },
  };
};