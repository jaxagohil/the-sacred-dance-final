// /lib/cosmic/cosmicInterpretation.ts

export function getCosmicInterpretation({

  dailyField,

}: {

  dailyField: any;

}) {

  /*
   * ---------------------------------------------------------
   * 🌌 COSMIC
   * ---------------------------------------------------------
   */

const cosmic =
  dailyField?.cosmic || {};

  /*
   * ---------------------------------------------------------
   * 🌌 RETURN
   * ---------------------------------------------------------
   */

  return {

    phaseType:
      getPhaseType(
        cosmic.moon_phase
      ),

    moonLine:
      "The atmosphere is shifting.",

    phaseLine:
      "Something subtle is unfolding.",

    sunLine:
      "Energy moves gently today.",

    energyLine:
      "Move softly with yourself.",

    cosmicMessage:
      "The atmosphere is shifting.",
  };
}

/*
 * ---------------------------------------------------------
 * 🌙 HELPERS
 * ---------------------------------------------------------
 */

function getPhaseType(
  phase: string
) {

  if (
    phase === "Full"
  ) {
    return "amplify";
  }

  if (
    phase === "New"
  ) {
    return "initiate";
  }

  if (
    phase === "Waxing"
  ) {
    return "build";
  }

  if (
    phase === "Waning"
  ) {
    return "release";
  }

  return "observe";
}