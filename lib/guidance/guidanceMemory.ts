// /lib/guidance/guidanceMemory.ts

/*
 * --------------------------------------------------------
 * 🌌 GUIDANCE MEMORY
 * --------------------------------------------------------
 *
 * PURPOSE:
 *
 * Distill lightweight relational residue
 * from recent transmissions.
 *
 * IMPORTANT:
 *
 * Guidance remembers:
 * - movement
 * - atmosphere
 * - pacing
 * - emotional residue
 *
 * Guidance does NOT remember:
 * - giant transcripts
 * - endless psychological history
 * - exhaustive symbolic analysis
 *
 * The field should feel:
 * alive,
 * recent,
 * soft,
 * breathable.
 *
 * --------------------------------------------------------
 */

import {
  ActiveGuide,
  EmotionalTemperature,
  NervousSystemState,
  OrchestrationMode,
  SymbolicIntensity,
  Transmission,
  TransmissionResidue,
} from "./foreground/guidanceTypes";

/*
 * --------------------------------------------------------
 * 🌊 INPUTS
 * --------------------------------------------------------
 */

interface BuildGuidanceMemoryProps {

  transmissions:
    Transmission[];

  existingResidue?:
    TransmissionResidue | null;
}

/*
 * --------------------------------------------------------
 * 🌿 HELPERS
 * --------------------------------------------------------
 */

function extractThemes(
  text = ""
): string[] {

  const lowered =
    text.toLowerCase();

  const themes: string[] = [];

  /*
   * --------------------------------------------------------
   * 🌊 RELATIONAL
   * --------------------------------------------------------
   */

  if (
    lowered.includes("seen")
    ||
    lowered.includes("visible")
  ) {

    themes.push(
      "visibility"
    );
  }

  if (
    lowered.includes("abandon")
    ||
    lowered.includes("left")
  ) {

    themes.push(
      "abandonment"
    );
  }

  if (
    lowered.includes("trust")
  ) {

    themes.push(
      "trust"
    );
  }

  if (
    lowered.includes("love")
    ||
    lowered.includes("heart")
  ) {

    themes.push(
      "heart"
    );
  }

  if (
    lowered.includes("fear")
    ||
    lowered.includes("afraid")
  ) {

    themes.push(
      "fear"
    );
  }

  return themes;
}

/*
 * --------------------------------------------------------
 * 🌌 NERVOUS SYSTEM
 * --------------------------------------------------------
 */

function detectNervousSystem(

  text = ""

): NervousSystemState {

  const lowered =
    text.toLowerCase();

  if (
    lowered.includes("panic")
    ||
    lowered.includes("overwhelmed")
  ) {

    return "overwhelmed";
  }

  if (
    lowered.includes("afraid")
    ||
    lowered.includes("anxious")
  ) {

    return "contracted";
  }

  if (
    lowered.includes("soft")
    ||
    lowered.includes("calm")
  ) {

    return "soft";
  }

  return "regulated";
}

/*
 * --------------------------------------------------------
 * 🌊 EMOTIONAL TEMPERATURE
 * --------------------------------------------------------
 */

function detectTemperature(

  text = ""

): EmotionalTemperature {

  const lowered =
    text.toLowerCase();

  if (
    lowered.includes("overwhelmed")
    ||
    lowered.includes("intense")
  ) {

    return "intense";
  }

  if (
    lowered.includes("hurt")
    ||
    lowered.includes("sad")
    ||
    lowered.includes("miss")
  ) {

    return "tender";
  }

  return "warm";
}

/*
 * --------------------------------------------------------
 * 🌌 SYMBOLIC INTENSITY
 * --------------------------------------------------------
 */

function detectSymbolicIntensity(

  text = ""

): SymbolicIntensity {

  const lowered =
    text.toLowerCase();

  if (
    lowered.includes("sign")
    ||
    lowered.includes("synchronicity")
    ||
    lowered.includes("energy")
  ) {

    return "moderate";
  }

  return "low";
}

/*
 * --------------------------------------------------------
 * 🌿 ORCHESTRATION MODE
 * --------------------------------------------------------
 */

function resolveMode(

  nervousSystem:
    NervousSystemState

): OrchestrationMode {

  if (
    nervousSystem ===
    "overwhelmed"
  ) {

    return "grounding";
  }

  if (
    nervousSystem ===
    "contracted"
  ) {

    return "softening";
  }

  return "observing";
}

/*
 * --------------------------------------------------------
 * 🌌 GUIDE
 * --------------------------------------------------------
 */

function resolveGuide(

  themes: string[]

): ActiveGuide {

  if (

    themes.includes(
      "visibility"
    )

    ||

    themes.includes(
      "abandonment"
    )

  ) {

    return "heart";
  }

  if (
    themes.includes(
      "fear"
    )
  ) {

    return "structure";
  }

  return "cosmic";
}

/*
 * --------------------------------------------------------
 * 🌊 BUILD GUIDANCE MEMORY
 * --------------------------------------------------------
 */

export function buildGuidanceMemory({

  transmissions = [],

  existingResidue = null,

}: BuildGuidanceMemoryProps):

  TransmissionResidue {

  /*
   * --------------------------------------------------------
   * 🌿 RECENT WINDOW
   * --------------------------------------------------------
   *
   * Guidance remembers:
   * recent movement,
   * not infinite history.
   *
   * --------------------------------------------------------
   */

  const recent =
    transmissions
      ?.slice?.(-12)
      || [];

  /*
   * --------------------------------------------------------
   * 🌌 COMBINED TEXT
   * --------------------------------------------------------
   */

  const combinedText =

    recent
      ?.map?.(
        (message) =>
          message?.text || ""
      )

      ?.join?.(" ")

    || "";

  /*
   * --------------------------------------------------------
   * 🌊 THEMES
   * --------------------------------------------------------
   */

  const dominantThemes =

    Array.from(

      new Set(
        extractThemes(
          combinedText
        )
      )
    );

  /*
   * --------------------------------------------------------
   * 🌿 NERVOUS SYSTEM
   * --------------------------------------------------------
   */

  const nervousSystemDirection =

    detectNervousSystem(
      combinedText
    );

  /*
   * --------------------------------------------------------
   * 🌌 TEMPERATURE
   * --------------------------------------------------------
   */

  const emotionalTemperature =

    detectTemperature(
      combinedText
    );

  /*
   * --------------------------------------------------------
   * 🌊 SYMBOLIC
   * --------------------------------------------------------
   */

  const symbolicIntensity =

    detectSymbolicIntensity(
      combinedText
    );

  /*
   * --------------------------------------------------------
   * 🌿 MODE
   * --------------------------------------------------------
   */

  const orchestrationMode =

    resolveMode(
      nervousSystemDirection
    );

  /*
   * --------------------------------------------------------
   * 🌌 GUIDE
   * --------------------------------------------------------
   */

  const activeGuide =

    resolveGuide(
      dominantThemes
    );

  /*
   * --------------------------------------------------------
   * 🌊 UNRESOLVED
   * --------------------------------------------------------
   *
   * For now:
   * lightweight carry-forward.
   *
   * Later:
   * signal-aware resolution.
   *
   * --------------------------------------------------------
   */

  const unresolvedPatterns =

    dominantThemes?.slice?.(0, 2)
    || [];

  /*
   * --------------------------------------------------------
   * 🌿 RETURN
   * --------------------------------------------------------
   */

  return {

    dominantThemes,

    unresolvedPatterns,

    nervousSystemDirection,

    orchestrationMode,

    emotionalTemperature,

    symbolicIntensity,

    activeGuide,

    lastUpdated:
      Date.now(),
  };
}