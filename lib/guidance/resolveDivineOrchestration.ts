
// /lib/guidance/resolveDivineOrchestration.ts

/*
 * --------------------------------------------------------
 * 🌌 RESOLVE DIVINE ORCHESTRATION
 * --------------------------------------------------------
 *
 * PURPOSE:
 *
 * Resolve guide witnessing fragments
 * from the active foreground field.
 *
 * IMPORTANT:
 *
 * Divine Orchestration is:
 * - witnessing
 * - observing
 * - noticing
 * - symbolic recognition
 * - field awareness
 *
 * Divine Orchestration is NOT:
 * - coaching
 * - therapy
 * - direct advice
 * - over-explaining
 * - chatbot conversation
 *
 * The guides observe the field.
 *
 * Like in the books.
 *
 * --------------------------------------------------------
 */

import {
    DivineOrchestrationFragment,
    ForegroundField,
} from "./guidanceTypes";

/*
 * --------------------------------------------------------
 * 🌊 INPUTS
 * --------------------------------------------------------
 */

interface ResolveDivineOrchestrationProps {

  field:
    ForegroundField;
}

/*
 * --------------------------------------------------------
 * 🌿 HELPERS
 * --------------------------------------------------------
 */

function randomize<T>(
  array: T[] = []
): T[] {

  return [...array].sort(
    () => Math.random() - 0.5
  );
}

/*
 * --------------------------------------------------------
 * 🌌 FRAGMENT LIBRARY
 * --------------------------------------------------------
 *
 * IMPORTANT:
 *
 * These are:
 * - observations
 * - mirrors
 * - orchestration witnessing
 *
 * NOT advice.
 *
 * --------------------------------------------------------
 */

const HEART_FRAGMENTS = [

  "something here still seems to soften slowly",

  "protection and longing appear together here",

  "the field quiets slightly around tenderness",

  "something guarded may finally be slowing enough to be felt",

  "the heart appears to notice before the mind fully arrives",

  "distance and longing seem to move together here",

  "something inside the field still seems to want reassurance",
];

const STRUCTURE_FRAGMENTS = [

  "the same movement appears to be repeating differently now",

  "something familiar continues returning through new forms",

  "the field notices recurring protective choreography",

  "awareness seems present before embodiment fully settles",

  "some patterns soften once they become visible",

  "the structure beneath the reaction appears clearer now",

  "the field recognizes repetition without blame",
];

const COSMIC_FRAGMENTS = [

  "some mirrors appear to echo across multiple layers",

  "timing within the field seems to be shifting gently",

  "the same themes appear to be returning through different pathways",

  "something within the field is widening quietly",

  "certain patterns seem to arrive before understanding fully settles",

  "the field appears to be reorganizing softly around awareness",

  "something unseen still seems to be moving beneath the surface",
];

/*
 * --------------------------------------------------------
 * 🌊 RESOLVE FRAGMENTS
 * --------------------------------------------------------
 */

function getGuideFragments(
  guide: string
): string[] {

  if (guide === "heart") {

    return HEART_FRAGMENTS;
  }

  if (guide === "structure") {

    return STRUCTURE_FRAGMENTS;
  }

  return COSMIC_FRAGMENTS;
}

/*
 * --------------------------------------------------------
 * 🌌 RESOLVE DIVINE ORCHESTRATION
 * --------------------------------------------------------
 */

export function resolveDivineOrchestration({

  field,

}: ResolveDivineOrchestrationProps):

  DivineOrchestrationFragment[] {

  /*
   * --------------------------------------------------------
   * 🌊 SILENCE
   * --------------------------------------------------------
   *
   * Silence is part of orchestration.
   *
   * --------------------------------------------------------
   */

  if (

    Math.random()

    <

    field?.silenceProbability

  ) {

    return [];
  }

  /*
   * --------------------------------------------------------
   * 🌿 ACTIVE GUIDE
   * --------------------------------------------------------
   */

  const guide =
    field?.activeGuide;

  /*
   * --------------------------------------------------------
   * 🌌 ACTIVE FRAGMENTS
   * --------------------------------------------------------
   */

  const availableFragments =

    getGuideFragments(guide);

  /*
   * --------------------------------------------------------
   * 🌊 RANDOMIZE
   * --------------------------------------------------------
   */

  const randomized =
    randomize(
      availableFragments
    );

  /*
   * --------------------------------------------------------
   * 🌿 SELECT
   * --------------------------------------------------------
   *
   * Usually:
   * - 1 fragment
   * - sometimes silence
   *
   * --------------------------------------------------------
   */

  const selected =
    randomized?.slice?.(0, 1)
    || [];

  /*
   * --------------------------------------------------------
   * 🌌 BUILD
   * --------------------------------------------------------
   */

  const fragments:

    DivineOrchestrationFragment[] =

    selected.map(
      (text, index) => ({

        id:

          `${guide}-${index}-${Date.now()}`,

        text,

        guide,

        mode:
          field?.orchestrationMode,

        emotionalWeight:
          1,

        symbolicWeight:

          field?.symbolicIntensity ===
          "high"

            ? 1

            : 0.5,

        pacingWeight:
          field?.pacing,

        silenceAfter:
          true,

        timestamp:
          Date.now(),
      })
    );

  /*
   * --------------------------------------------------------
   * 🌊 RETURN
   * --------------------------------------------------------
   */

  return fragments;
}