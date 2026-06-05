// /lib/guidance/enterTransmission.ts

/*
 * --------------------------------------------------------
 * 🌌 ENTER TRANSMISSION
 * --------------------------------------------------------
 *
 * PURPOSE:
 *
 * Handle relational entry into the field.
 *
 * IMPORTANT:
 *
 * Transmission is NOT:
 * - chatbot messaging
 * - infinite AI conversation
 * - therapeutic processing
 *
 * Transmission IS:
 * - field entry
 * - relational movement
 * - orchestration mutation
 * - nervous system choreography
 * - continuity creation
 *
 * FLOW:
 *
 * user enters
 * → signal created
 * → foreground mutates
 * → orchestration updates
 * → response emerges elsewhere
 * → residue persists
 *
 * --------------------------------------------------------
 */

import {
  ForegroundField,
  GuidanceSignal,
  Transmission,
  TransmissionResidue,
} from "./foreground/guidanceTypes";

import {
  resolveForegroundField,
} from "./foreground/resolveForegroundField";

/*
 * --------------------------------------------------------
 * 🌊 INPUTS
 * --------------------------------------------------------
 */

interface EnterTransmissionProps {

  /*
   * --------------------------------------------------------
   * 🌿 USER
   * --------------------------------------------------------
   */

  userId: string;

  reflection: string;

  guide?: string;

  /*
   * --------------------------------------------------------
   * 🌌 EXISTING FIELD
   * --------------------------------------------------------
   */

  field:
    ForegroundField;

  mirrorContext?: any;

  userContext?: any;

  cosmic?: any;

  signals?: any[];

  residue?: TransmissionResidue | null;

  /*
   * --------------------------------------------------------
   * 🌊 OPTIONAL
   * --------------------------------------------------------
   */

  existingMessages?: Transmission[];
}

/*
 * --------------------------------------------------------
 * 🌿 OUTPUT
 * --------------------------------------------------------
 */

interface EnterTransmissionResult {

  /*
   * --------------------------------------------------------
   * 🌌 FIELD
   * --------------------------------------------------------
   */

  updatedField:
    ForegroundField;

  /*
   * --------------------------------------------------------
   * 🌊 SIGNAL
   * --------------------------------------------------------
   */

  signal:
    GuidanceSignal;

  /*
   * --------------------------------------------------------
   * 🌿 USER TRANSMISSION
   * --------------------------------------------------------
   */

  userTransmission:
    Transmission;

  /*
   * --------------------------------------------------------
   * 🌌 MEMORY
   * --------------------------------------------------------
   */

  residue:
    TransmissionResidue;
}

/*
 * --------------------------------------------------------
 * 🌊 HELPERS
 * --------------------------------------------------------
 */

function detectEmotionalWeight(
  text = ""
): number {

  if (!text) {

    return 0;
  }

  const lowered =
    text.toLowerCase();

  /*
   * --------------------------------------------------------
   * 🌌 HIGH INTENSITY
   * --------------------------------------------------------
   */

  if (
    lowered.includes("overwhelmed")
    ||
    lowered.includes("panic")
    ||
    lowered.includes("afraid")
    ||
    lowered.includes("anxious")
  ) {

    return 0.9;
  }

  /*
   * --------------------------------------------------------
   * 🌊 EMOTIONAL
   * --------------------------------------------------------
   */

  if (
    lowered.includes("sad")
    ||
    lowered.includes("hurt")
    ||
    lowered.includes("miss")
    ||
    lowered.includes("lonely")
  ) {

    return 0.7;
  }

  /*
   * --------------------------------------------------------
   * 🌿 DEFAULT
   * --------------------------------------------------------
   */

  return 0.4;
}

/*
 * --------------------------------------------------------
 * 🌌 ENTER TRANSMISSION
 * --------------------------------------------------------
 */

export async function enterTransmission({

  userId,

  reflection,

  guide = "heart",

  field,

  mirrorContext,

  userContext,

  cosmic,

  signals = [],

  residue = null,

}: EnterTransmissionProps):

  Promise<EnterTransmissionResult> {

  /*
   * --------------------------------------------------------
   * 🌊 USER TRANSMISSION
   * --------------------------------------------------------
   */

  const userTransmission:
    Transmission = {

      id:
        `user-${Date.now()}`,

      role:
        "user",

      text:
        reflection,

      guide:
        guide as any,

      timestamp:
        Date.now(),
    };

  /*
   * --------------------------------------------------------
   * 🌿 CREATE SIGNAL
   * --------------------------------------------------------
   *
   * IMPORTANT:
   *
   * Signals mutate the field.
   *
   * --------------------------------------------------------
   */

  const signal:
    GuidanceSignal = {

      id:
        `signal-${Date.now()}`,

      text:
        reflection,

      type:
        "reflection",

      emotionalWeight:
        detectEmotionalWeight(
          reflection
        ),

      symbolicActivation:

        field?.symbolicIntensity ===
        "high"

          ? 0.8
          : 0.3,

      nervousSystemShift:

        field?.nervousSystemState,

      timestamp:
        Date.now(),
    };

  /*
   * --------------------------------------------------------
   * 🌌 MUTATE FIELD
   * --------------------------------------------------------
   *
   * User entry changes the field.
   *
   * --------------------------------------------------------
   */

  const updatedField =

    resolveForegroundField({

      mirrorContext,

      userContext,

      activeLens:
        field?.activeLens,

      cosmic,

      residue,

      signals: [
        signal,
        ...signals,
      ],
    });

  /*
   * --------------------------------------------------------
   * 🌿 RESIDUE
   * --------------------------------------------------------
   *
   * IMPORTANT:
   *
   * Residue stores:
   * - emotional movement
   * - unresolved themes
   * - orchestration continuity
   * - nervous system direction
   *
   * NOT:
   * - giant chat history
   * - endless AI memory
   *
   * --------------------------------------------------------
   */

  const updatedResidue:
    TransmissionResidue = {

      dominantThemes:

        updatedField?.activePatterns
        || [],

      unresolvedPatterns:

        updatedField?.activePatterns
        || [],

      nervousSystemDirection:

        updatedField?.nervousSystemState,

      orchestrationMode:

        updatedField?.orchestrationMode,

      emotionalTemperature:

        updatedField?.emotionalTemperature,

      symbolicIntensity:

        updatedField?.symbolicIntensity,

      activeGuide:

        updatedField?.activeGuide,

      lastUpdated:
        Date.now(),
    };

  /*
   * --------------------------------------------------------
   * 🌌 RETURN
   * --------------------------------------------------------
   *
   * IMPORTANT:
   *
   * This layer DOES NOT
   * generate language anymore.
   *
   * Language emerges from:
   * orchestration.
   *
   * --------------------------------------------------------
   */

  return {

    updatedField,

    signal,

    userTransmission,

    residue:
      updatedResidue,
  };
}