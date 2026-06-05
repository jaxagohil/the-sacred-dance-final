// /lib/guidance/resolveForegroundField.ts

/*
 * --------------------------------------------------------
 * 🌌 RESOLVE FOREGROUND FIELD
 * --------------------------------------------------------
 *
 * PURPOSE:
 *
 * Resolve the SINGLE active foreground field
 * for Guidance.
 *
 * IMPORTANT:
 *
 * This file does NOT:
 * - generate meaning
 * - create patterns
 * - infer spirituality
 * - orchestrate prose
 * - generate AI responses
 *
 * Meaning already exists within:
 * - signals
 * - patterns
 * - mirror context
 * - reality layers
 * - lenses
 * - longitudinal awareness
 *
 * This file ONLY:
 * - prioritizes
 * - softens
 * - regulates
 * - foregrounds
 * - reduces complexity
 *
 * ONE field.
 * MANY render systems.
 *
 * --------------------------------------------------------
 */

import {
  ActiveGuide,
  EmotionalTemperature,
  ForegroundField,
  NervousSystemState,
  OrchestrationMode,
  RealityLayer,
  SymbolicIntensity,
  TransmissionResidue,
} from "./guidanceTypes";

/*
 * --------------------------------------------------------
 * 🌊 INPUTS
 * --------------------------------------------------------
 */

interface ResolveForegroundFieldProps {

  mirrorContext?: any;

  userContext?: any;

  activeLens?: string | null;

  cosmic?: any;

  signals?: any[];

  residue?: TransmissionResidue | null;
}

/*
 * --------------------------------------------------------
 * 🌌 RESOLVE FOREGROUND FIELD
 * --------------------------------------------------------
 */

export function resolveForegroundField({

  mirrorContext,

  userContext,

  activeLens = null,

  cosmic,

  signals = [],

  residue = null,

}: ResolveForegroundFieldProps): ForegroundField {

  /*
   * --------------------------------------------------------
   * 🌍 REALITY LAYER
   * --------------------------------------------------------
   *
   * IMPORTANT:
   *
   * Reality layer should already exist
   * upstream inside:
   * - signals
   * - mirror synthesis
   * - pattern resolution
   *
   * We prioritize existing intelligence,
   * not re-infer everything.
   *
   * --------------------------------------------------------
   */

  const realityLayer: RealityLayer =

    mirrorContext?.dominantRealityLayer

    || signals?.[0]?.realityLayer

    || "emotional";

  /*
   * --------------------------------------------------------
   * 🌊 NERVOUS SYSTEM
   * --------------------------------------------------------
   */

  const nervousSystemState: NervousSystemState =

    mirrorContext?.nervousSystemState

    || residue?.nervousSystemDirection

    || "soft";

  /*
   * --------------------------------------------------------
   * 🌿 ACTIVE GUIDE
   * --------------------------------------------------------
   *
   * Guides represent:
   * attentional bias.
   *
   * --------------------------------------------------------
   */

  let activeGuide: ActiveGuide = "heart";

  if (
    realityLayer === "energetic"
    ||
    realityLayer === "consciousness"
  ) {

    activeGuide = "cosmic";
  }

  if (
    realityLayer === "physical"
  ) {

    activeGuide = "structure";
  }

  /*
   * --------------------------------------------------------
   * 🌌 SYMBOLIC INTENSITY
   * --------------------------------------------------------
   *
   * Controls:
   * - signs
   * - symbolism
   * - orchestration spaciousness
   *
   * --------------------------------------------------------
   */

  let symbolicIntensity:
    SymbolicIntensity = "low";

  if (
    realityLayer === "physical"
  ) {

    symbolicIntensity = "silent";
  }

  if (
    realityLayer === "energetic"
  ) {

    symbolicIntensity = "moderate";
  }

  if (
    realityLayer === "consciousness"
    &&
    nervousSystemState !== "overwhelmed"
  ) {

    symbolicIntensity = "high";
  }

  /*
   * --------------------------------------------------------
   * 🌊 ORCHESTRATION MODE
   * --------------------------------------------------------
   */

  let orchestrationMode:
    OrchestrationMode = "observing";

  if (
    nervousSystemState === "contracted"
    ||
    nervousSystemState === "overwhelmed"
  ) {

    orchestrationMode = "grounding";
  }

  if (
    nervousSystemState === "soft"
  ) {

    orchestrationMode = "softening";
  }

  if (
    realityLayer === "consciousness"
  ) {

    orchestrationMode = "widening";
  }

  /*
   * --------------------------------------------------------
   * 🌿 EMOTIONAL TEMPERATURE
   * --------------------------------------------------------
   */

  let emotionalTemperature:
    EmotionalTemperature = "warm";

  if (
    nervousSystemState === "overwhelmed"
  ) {

    emotionalTemperature = "intense";
  }

  if (
    nervousSystemState === "regulated"
  ) {

    emotionalTemperature = "cool";
  }

  if (
    nervousSystemState === "soft"
  ) {

    emotionalTemperature = "tender";
  }

  /*
   * --------------------------------------------------------
   * 🌌 ACTIVE PATTERNS
   * --------------------------------------------------------
   *
   * IMPORTANT:
   *
   * Foreground ≠ full reality.
   *
   * We intentionally reduce complexity.
   *
   * --------------------------------------------------------
   */

  const activePatterns =

    mirrorContext?.dominantPatterns
      ?.slice?.(0, 2)

    ||

    [];

  /*
   * --------------------------------------------------------
   * 🌊 ACTIVE CHAKRAS
   * --------------------------------------------------------
   */

  const activeChakras =

    mirrorContext?.activeChakras
      ?.slice?.(0, 2)

    ||

    [];

  /*
   * --------------------------------------------------------
   * 🌿 SILENCE
   * --------------------------------------------------------
   *
   * Silence is part of intelligence.
   *
   * --------------------------------------------------------
   */

  let silenceProbability = 0.35;

  if (
    nervousSystemState === "overwhelmed"
  ) {

    silenceProbability = 0.85;
  }

  if (
    symbolicIntensity === "high"
  ) {

    silenceProbability = 0.55;
  }

  /*
   * --------------------------------------------------------
   * 🌌 PACING
   * --------------------------------------------------------
   *
   * Lower = slower.
   *
   * --------------------------------------------------------
   */

  let pacing = 1;

  if (
    nervousSystemState === "overwhelmed"
  ) {

    pacing = 0.5;
  }

  if (
    nervousSystemState === "regulated"
  ) {

    pacing = 1.2;
  }

  /*
   * --------------------------------------------------------
   * 🌊 FIELD ENERGY
   * --------------------------------------------------------
   */

  const amplification =

    mirrorContext?.amplification
    || 0;

  const coherence =

    mirrorContext?.coherence
    || 0;

  /*
   * --------------------------------------------------------
   * 🌿 PRINCIPLES
   * --------------------------------------------------------
   *
   * Optional contextual surfacing.
   *
   * NOT giant injections.
   *
   * --------------------------------------------------------
   */

  const activePrinciples =

    mirrorContext?.activePrinciples
    || [];

  /*
   * --------------------------------------------------------
   * 🌌 RETURN FIELD
   * --------------------------------------------------------
   */

  return {

    realityLayer,

    activeGuide,

    orchestrationMode,

    nervousSystemState,

    emotionalTemperature,

    symbolicIntensity,

    activePatterns,

    activeChakras,

    activeLens,

    pacing,

    silenceProbability,

    amplification,

    coherence,

    activePrinciples,

    activeSignals:

      signals?.map?.(
        (signal) => signal?.id
      ) || [],

    timestamp:
      Date.now(),
  };
}