// /lib/guidance/guidancePacing.ts

/*
 * --------------------------------------------------------
 * 🌌 GUIDANCE PACING
 * --------------------------------------------------------
 *
 * PURPOSE:
 *
 * Resolve nervous-system-aware pacing
 * for the Guidance field.
 *
 * IMPORTANT:
 *
 * Pacing controls:
 * - silence
 * - symbolic density
 * - mutation speed
 * - response size
 * - orchestration frequency
 * - field spaciousness
 *
 * Guidance should breathe.
 *
 * NOT:
 * - constantly generate
 * - constantly escalate
 * - constantly explain
 *
 * Restraint creates resonance.
 *
 * --------------------------------------------------------
 */

import {
    ForegroundField,
} from "./guidanceTypes";

/*
 * --------------------------------------------------------
 * 🌊 PACING PROFILE
 * --------------------------------------------------------
 */

export interface GuidancePacingProfile {

  /*
   * --------------------------------------------------------
   * 🌌 SIGNS
   * --------------------------------------------------------
   */

  maxSigns:
    number;

  signFrequency:
    number;

  /*
   * --------------------------------------------------------
   * 🌊 ORCHESTRATION
   * --------------------------------------------------------
   */

  fragmentProbability:
    number;

  silenceProbability:
    number;

  /*
   * --------------------------------------------------------
   * 🌿 TRANSMISSION
   * --------------------------------------------------------
   */

  responseLength:

    | "minimal"
    | "short"
    | "medium";

  /*
   * --------------------------------------------------------
   * 🌌 FIELD MOVEMENT
   * --------------------------------------------------------
   */

  mutationSpeed:

    | "very_slow"
    | "slow"
    | "moderate";

  symbolicAllowance:

    | "silent"
    | "low"
    | "moderate"
    | "high";

  /*
   * --------------------------------------------------------
   * 🌊 OVERLAY
   * --------------------------------------------------------
   */

  overlayDrift:
    number;

  /*
   * --------------------------------------------------------
   * 🌿 TIMING
   * --------------------------------------------------------
   */

  silenceWindow:
    number;
}

/*
 * --------------------------------------------------------
 * 🌌 RESOLVE GUIDANCE PACING
 * --------------------------------------------------------
 */

export function resolveGuidancePacing(

  field:
    ForegroundField

): GuidancePacingProfile {

  /*
   * --------------------------------------------------------
   * 🌊 DEFAULTS
   * --------------------------------------------------------
   */

  let profile:
    GuidancePacingProfile = {

      maxSigns: 3,

      signFrequency: 0.4,

      fragmentProbability: 0.5,

      silenceProbability: 0.35,

      responseLength: "short",

      mutationSpeed: "slow",

      symbolicAllowance: "low",

      overlayDrift: 1,

      silenceWindow: 4000,
    };

  /*
   * --------------------------------------------------------
   * 🌍 PHYSICAL
   * --------------------------------------------------------
   *
   * Grounding.
   * Regulation.
   * Minimal symbolism.
   *
   * --------------------------------------------------------
   */

  if (
    field?.realityLayer ===
    "physical"
  ) {

    profile = {

      ...profile,

      maxSigns: 1,

      signFrequency: 0.1,

      fragmentProbability: 0.2,

      silenceProbability: 0.85,

      responseLength: "minimal",

      mutationSpeed: "very_slow",

      symbolicAllowance: "silent",

      overlayDrift: 0.4,

      silenceWindow: 7000,
    };
  }

  /*
   * --------------------------------------------------------
   * 🌊 EMOTIONAL
   * --------------------------------------------------------
   */

  if (
    field?.realityLayer ===
    "emotional"
  ) {

    profile = {

      ...profile,

      maxSigns: 3,

      signFrequency: 0.35,

      fragmentProbability: 0.5,

      silenceProbability: 0.45,

      responseLength: "short",

      mutationSpeed: "slow",

      symbolicAllowance: "low",

      overlayDrift: 0.8,

      silenceWindow: 5000,
    };
  }

  /*
   * --------------------------------------------------------
   * 🌌 ENERGETIC
   * --------------------------------------------------------
   */

  if (
    field?.realityLayer ===
    "energetic"
  ) {

    profile = {

      ...profile,

      maxSigns: 5,

      signFrequency: 0.65,

      fragmentProbability: 0.7,

      silenceProbability: 0.4,

      responseLength: "medium",

      mutationSpeed: "moderate",

      symbolicAllowance: "moderate",

      overlayDrift: 1.2,

      silenceWindow: 3500,
    };
  }

  /*
   * --------------------------------------------------------
   * ✨ CONSCIOUSNESS
   * --------------------------------------------------------
   *
   * IMPORTANT:
   *
   * Higher awareness should NOT
   * create overwhelming output.
   *
   * More spaciousness.
   * More silence.
   *
   * --------------------------------------------------------
   */

  if (
    field?.realityLayer ===
    "consciousness"
  ) {

    profile = {

      ...profile,

      maxSigns: 4,

      signFrequency: 0.45,

      fragmentProbability: 0.5,

      silenceProbability: 0.6,

      responseLength: "short",

      mutationSpeed: "slow",

      symbolicAllowance: "high",

      overlayDrift: 1,

      silenceWindow: 6000,
    };
  }

  /*
   * --------------------------------------------------------
   * 🌊 OVERWHELM
   * --------------------------------------------------------
   *
   * Nervous system safety first.
   *
   * --------------------------------------------------------
   */

  if (
    field?.nervousSystemState ===
    "overwhelmed"
  ) {

    profile = {

      ...profile,

      maxSigns: 0,

      signFrequency: 0,

      fragmentProbability: 0.1,

      silenceProbability: 0.92,

      responseLength: "minimal",

      mutationSpeed: "very_slow",

      symbolicAllowance: "silent",

      overlayDrift: 0.2,

      silenceWindow: 9000,
    };
  }

  /*
   * --------------------------------------------------------
   * 🌿 CONTRACTED
   * --------------------------------------------------------
   */

  if (
    field?.nervousSystemState ===
    "contracted"
  ) {

    profile = {

      ...profile,

      maxSigns:
        Math.min(
          profile.maxSigns,
          2
        ),

      responseLength: "short",

      silenceProbability:
        Math.max(
          profile.silenceProbability,
          0.7
        ),

      mutationSpeed: "very_slow",
    };
  }

  /*
   * --------------------------------------------------------
   * 🌌 REGULATED
   * --------------------------------------------------------
   */

  if (
    field?.nervousSystemState ===
    "regulated"
  ) {

    profile = {

      ...profile,

      signFrequency:
        profile.signFrequency + 0.1,

      fragmentProbability:
        profile.fragmentProbability + 0.1,
    };
  }

  /*
   * --------------------------------------------------------
   * 🌊 HIGH SYMBOLISM
   * --------------------------------------------------------
   *
   * IMPORTANT:
   *
   * More symbolism
   * should create MORE silence.
   *
   * NOT more output.
   *
   * --------------------------------------------------------
   */

  if (
    field?.symbolicIntensity ===
    "high"
  ) {

    profile = {

      ...profile,

      silenceProbability:

        Math.max(
          profile.silenceProbability,
          0.65
        ),

      responseLength: "short",
    };
  }

  /*
   * --------------------------------------------------------
   * 🌿 RETURN
   * --------------------------------------------------------
   */

  return profile;
}