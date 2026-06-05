// /lib/guidance/orchestration/orchestrateGuidance.ts

import {
  GUIDE_TYPES,
} from "../../../components/guidance/guideConfig";

import {
  Colors,
} from "../../../constants/theme";

import {
  buildGuidanceWhispers,
} from "./buildGuidanceWhispers";


import {
  buildGuidanceFragments,
} from "./buildGuidanceFragments";

import {
  generateOrchestrationConversation,
} from "./generateOrchestrationConversation";

import {
  resolveManifestations,
} from "./resolveManifestations";

/*
 * ------------------------------------------------
 * 🌌 ORCHESTRATE GUIDANCE
 * ------------------------------------------------
 */

export const orchestrateGuidance = async ({

  mirrorContext = {},

  selectedGuide =
    GUIDE_TYPES.COSMIC,

  resolvedContent = {},

  emergenceMemory = {},

}: any) => {

  /*
   * ------------------------------------------------
   * 🌌 CURRENT FIELD
   * ------------------------------------------------
   */

  const current =

    mirrorContext?.current
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
   * 🌿 ORCHESTRATION MODE
   * ------------------------------------------------
   */

  let orchestrationMode =
    "quiet";

  if (
    symbolicTolerance > 0.72
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
   * 🌌 ORCHESTRATION INTENSITY
   * ------------------------------------------------
   */

  const orchestrationIntensity = (

    coherence * 0.35 +

    openness * 0.25 +

    symbolicTolerance * 0.4

  );

  /*
   * ------------------------------------------------
   * 🌊 EMOTIONAL FIELD
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
   * 🌿 ACTIVE PATTERNS
   * ------------------------------------------------
   */

const activePatterns =

  current?.patterns

    || Object.values(
      current
        ?.patternField
        || {}
    )

    || [];


  /*
   * ------------------------------------------------
   * 🌊 ACTIVE CHAKRAS
   * ------------------------------------------------
   */

const activeChakras = [

  {
    id:
      current
        ?.dominantChakra,

    symbol:

      (
        current
          ?.patterns
          || []
      ).find(

        (pattern: any) =>

          pattern?.chakra ===

          mirrorContext
            ?.dominantChakra
      )?.symbol,
  },
].filter(
  (chakra) =>
    chakra?.id
);
  /*
   * ------------------------------------------------
   * 🌌 MANIFESTATIONS
   * ------------------------------------------------
   */


const manifestations =

  resolveManifestations({

    activePatterns,

    activeChakras,

    manifestationLibrary:

      mirrorContext
        ?.manifestationLibrary

      || [],
  });

  /*
   * ------------------------------------------------
   * 🌊 WHISPERS
   * ------------------------------------------------
   */

  const atmosphericWhispers =

    buildGuidanceWhispers({

      oracleCard:
        current?.oracleCard,

      activePatterns,

      activeChakras,

      manifestations,

      mirrorContext,

      cosmicContext:
        current?.cosmicContext,

      resolvedContent,

      emergenceMemory,
    })

 .map(
  (
    whisper: any,
    index: number
  ) => ({

    id:
      `whisper_${index}`,

    text:

      typeof whisper === "string"

        ? whisper

        : whisper?.text || "",

    weight:
      whisper?.weight || 0.5,

    source:
      whisper?.source || "field",

    recurrence:
      whisper?.recurrence || false,

    type:
      "symbolic_sign",

    opacity:

      orchestrationIntensity > 0.72

        ? 0.42

        : orchestrationIntensity > 0.55

          ? 0.34

          : 0.26,

    color:
      Colors.gold,

    intensity:
      orchestrationIntensity,

    drift:
      "slow",

    cinematic:
      true,
  })
);

  /*
   * ------------------------------------------------
   * 🌿 FRAGMENTS
   * ------------------------------------------------
   */

 const orchestrationLead =

  selectedGuide ||

  GUIDE_TYPES.COSMIC; 

const candidateFragments =

  await generateOrchestrationConversation({

      mirrorContext,

      activePatterns,

      activeChakras,

      manifestations,

selectedGuide:
  orchestrationLead,

      resolvedContent,

      emergenceMemory,

      sacredPrinciples:

        resolvedContent
          ?.principles || [],

      sacredPressures:

        resolvedContent
          ?.pressures || [],

          language:
  mirrorContext
    ?.language
    || "en",
    });

  /*
   * ------------------------------------------------
   * 🌌 PACING
   * ------------------------------------------------
   */

  let pacing =
    "slow";

  let silenceWindow =
    5000;

  let fragmentDuration =
    10000;

  if (
    orchestrationMode ===
    "threshold"
  ) {

    pacing =
      "cinematic";

    silenceWindow =
      9000;

    fragmentDuration =
      12000;
  }

  if (
    orchestrationMode ===
    "grounding"
  ) {

    pacing =
      "gentle";

    silenceWindow =
      7000;

    fragmentDuration =
      5000;
  }


    const fragmentSequence =

  buildGuidanceFragments({

    fragments:
      candidateFragments,

    silenceWindow,

    fragmentDuration,

    orchestrationIntensity,

    emotionalField,

    pacing,

    selectedGuide,
  });  
  /*
   * ------------------------------------------------
   * 🌌 RECURRENCE
   * ------------------------------------------------
   */

  const recurrencePlan = {

    allowRecurrence:
      true,

    recurrenceMode:
      "evolving",

    allowSymbolicReturn:
      symbolicTolerance > 0.65,

    allowDelayedEchoes:
      orchestrationMode !==
      "grounding",
  };

  /*
   * ------------------------------------------------
   * 🌊 RETURN
   * ------------------------------------------------
   */

  return {

    orchestrationMode,

    orchestrationIntensity,

    emotionalField,

    pacing,

    atmosphericWhispers,

    maxVisibleWhispers:
      4,

    fragmentSequence,

    maxVisibleFragments:
      2,

    silenceWindow,

    recurrencePlan,

    foregroundGuide:
      orchestrationLead,

    mirrorDepth:
      coherence,

    readinessForInsight:
      openness,

    allowGuideConversation:

      fragmentSequence
        .length > 0,

    allowPatternReflection:
      true,

    allowSymbolicExpansion:

      symbolicTolerance
        > 0.65,

    cinematic:
      true,

    silenceAware:
      true,
  };
};