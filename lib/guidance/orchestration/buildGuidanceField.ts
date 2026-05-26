// /lib/guidance/orchestration/buildGuidanceField.ts

import {
  orchestrateGuidance,
} from "./orchestrateGuidance";

import {
  GUIDE_TYPES,
} from "../../../components/guidance/guideConfig";

/*
 * --------------------------------------------------------
 * 🌌 BUILD GUIDANCE FIELD
 * --------------------------------------------------------
 *
 * Creates the live orchestration field
 * for the Divine Orchestration layer.
 *
 * Mirror → Guidance → Orchestration → UI
 *
 * --------------------------------------------------------
 */

export const buildGuidanceField = ({

  /*
   * 🌌 REAL MIRROR CONTEXT
   */

  mirrorContext = {},

  /*
   * 🪞 ACTIVE MIRROR PATTERNS
   */

  activePatterns = [],

  /*
   * 🌿 ACTIVE LENSES
   */

  activeLenses = [],

  /*
   * ✨ ACTIVE CHAKRAS
   */

  activeChakras = [],

  /*
   * 🌌 DISTORTION DOTS
   */

  distortionDots = [],

  /*
   * 🌊 USER HISTORY
   */

  userHistory = {},

  /*
   * 💬 RECENT GUIDANCE MESSAGES
   */

  recentMessages = [],

  /*
   * 🌸 CURRENT GUIDE
   */

  selectedGuide =
    GUIDE_TYPES.COSMIC,

}: any) => {

  /*
   * --------------------------------------------------------
   * 🌌 MIRROR FIELD
   * --------------------------------------------------------
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

  const lenses =

    mirrorContext?.lenses
      || {};

  /*
   * --------------------------------------------------------
   * 🌌 ORCHESTRATION ENGINE
   * --------------------------------------------------------
   */

  const orchestration =

    orchestrateGuidance({

      mirrorContext,

      activePatterns,

      activeLenses,

      activeChakras,

      distortionDots,

      userHistory,

      selectedGuide,

      recentMessages,
    });

  /*
   * --------------------------------------------------------
   * 🌿 FIELD ENERGY
   * --------------------------------------------------------
   */

  const fieldIntensity = (

    (current.coherence || 0.5)
      * 0.3 +

    (current.symbolicTolerance || 0.5)
      * 0.2 +

    (current.openness || 0.5)
      * 0.2 +

    (current.repetition || 0.5)
      * 0.15 +

    (current.selfAwareness || 0.5)
      * 0.15

  );

  /*
   * --------------------------------------------------------
   * 🌊 ACTIVE CHAKRA FIELD
   * --------------------------------------------------------
   */

  const dominantChakra =

    activeChakras?.[0]
      || null;

  /*
   * --------------------------------------------------------
   * ✨ LENS FIELD
   * --------------------------------------------------------
   */

  const dominantLens =

    activeLenses?.[0]
      || null;

  /*
   * --------------------------------------------------------
   * 🌌 DISTORTION PRESENCE
   * --------------------------------------------------------
   */

  const distortionPresence =

    distortionDots?.length > 0;

  /*
   * --------------------------------------------------------
   * 🌸 FIELD ATMOSPHERE
   * --------------------------------------------------------
   */

  let fieldAtmosphere =
    "quiet";

  if (
    orchestration
      .orchestrationMode ===
    "threshold"
  ) {

    fieldAtmosphere =
      "emerging";
  }

  if (
    orchestration
      .orchestrationMode ===
    "symbolic"
  ) {

    fieldAtmosphere =
      "symbolic";
  }

  if (
    orchestration
      .orchestrationMode ===
    "grounding"
  ) {

    fieldAtmosphere =
      "soft";
  }

  /*
   * --------------------------------------------------------
   * 🌊 SILENCE WINDOWS
   * --------------------------------------------------------
   */

  let silenceFrequency =
    0.4;

  if (
    current.coherence > 0.7
  ) {

    silenceFrequency =
      0.65;
  }

  /*
   * --------------------------------------------------------
   * ✨ FORMAT WHISPERS
   * --------------------------------------------------------
   */

  const whisperPositions = [

    {
      top: 18,
      left: 28,
    },

    {
      top: 52,
      right: 34,
    },

    {
      top: 108,
      left: 64,
    },

    {
      top: 154,
      right: 22,
    },

    {
      top: 208,
      left: 40,
    },
  ];

  const formattedWhispers = (

    orchestration
      ?.atmosphericWhispers

      || []

  ).map(

    (
      whisper: any,
      index: number
    ) => {

      const position =

        whisperPositions[
          index %
          whisperPositions.length
        ];

      return {

        id:
          `whisper_${index}`,

        /*
         * 🌌 SYMBOLIC KEY
         */

        manifestationKey:

          whisper
            ?.manifestationKey
            || null,

        /*
         * ✨ GUIDE
         */

        guide:

          whisper.guide
          || GUIDE_TYPES.COSMIC,

        /*
         * 🌊 INTENSITY
         */

intensity:

  whisper.intensity
  || 0.5,

text:
  whisper.text || "",

...position,

        /*
         * 🌿 POSITION
         */

        ...position,
      };
    }
  );

  /*
   * --------------------------------------------------------
   * ✨ FORMAT FRAGMENTS
   * --------------------------------------------------------
   */

  const formattedFragments = (

    orchestration
      ?.orchestrationFragments

      || []

  ).map(

    (
      fragment: any,
      index: number
    ) => {

      return {

        id:

          fragment.id
          || `fragment_${index}`,

        /*
         * 🌌 SYMBOLIC KEY
         */

        manifestationKey:

          fragment
            ?.manifestationKey
            || null,

        /*
         * ✨ GUIDE
         */

        guide:

          fragment.guide
          || GUIDE_TYPES.COSMIC,

        /*
         * 🌊 INTENSITY
         */

intensity:

  fragment.intensity
  || 0.5,

text:
  fragment.text || "",
      };
    }
  );

  /*
   * --------------------------------------------------------
   * ✨ RETURN FIELD
   * --------------------------------------------------------
   */

  console.log(
  "🌌 MIRROR CONTEXT",
  mirrorContext
);

  return {

    /*
     * 🌌 RAW ORCHESTRATION
     */

    orchestration,

    /*
     * 🌊 MIRROR FIELD
     */

    mirrorContext,

    current,

    voice,

    story,

    lenses,

    /*
     * 🌊 LIVE FIELD
     */

    orchestrationMode:

      orchestration
        .orchestrationMode,

    orchestrationStyle:

      orchestration
        .orchestrationStyle,

    orchestrationIntensity:

      orchestration
        .orchestrationIntensity,

    /*
     * 🌿 FIELD CONTENT
     */

    whispers:
      formattedWhispers,

    fragments:
      formattedFragments,

    /*
     * 🌸 GUIDE FIELD
     */

    foregroundGuide:

      orchestration
        .foregroundGuide,

    fieldInfluences:

      orchestration
        .fieldInfluences,

    /*
     * 🪞 MIRROR CONTINUITY
     */

    activePatterns,

    activeLenses,

    activeChakras,

    dominantChakra,

    dominantLens,

    distortionDots,

    distortionPresence,

    /*
     * 🌌 FIELD STATES
     */

    fieldAtmosphere,

    fieldIntensity,

    silenceFrequency,

    /*
     * 🌊 EMOTIONAL FIELD
     */

    emotionalField:

      orchestration
        .emotionalField,

    /*
     * ✨ FIELD MOVEMENT
     */

    pacing:

      orchestration
        .pacing,

    mirrorDepth:

      orchestration
        .mirrorDepth,

    readinessForInsight:

      orchestration
        .readinessForInsight,

    /*
     * 🌿 GUIDE MOVEMENT
     */

    allowGuideConversation:

      orchestration
        .allowGuideConversation,

    allowPatternReflection:

      orchestration
        .allowPatternReflection,

    allowSymbolicExpansion:

      orchestration
        .allowSymbolicExpansion,
  };
};