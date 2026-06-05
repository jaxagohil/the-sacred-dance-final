// /lib/guidance/runtime/buildGuidanceField.ts

import {
  GUIDE_TYPES,
} from "../../../components/guidance/guideConfig";

/*
 * --------------------------------------------------------
 * 🌌 BUILD GUIDANCE FIELD
 * --------------------------------------------------------
 *
 * PURPOSE:
 *
 * Prepare resolved guidance state
 * for cinematic UI rendering.
 *
 * IMPORTANT:
 *
 * This file does NOT:
 * - interpret psychology
 * - generate meaning
 * - orchestrate guidance
 * - modify guide consciousness
 * - create symbolic insight
 *
 * Logic already resolved:
 * - signs
 * - pacing
 * - foreground guide
 * - orchestration
 * - symbolic readiness
 *
 * AI already resolved:
 * - tone
 * - voice
 * - emotional cadence
 * - guide language
 *
 * This file ONLY:
 * - packages
 * - formats
 * - sequences
 * - prepares UI state
 *
 * --------------------------------------------------------
 */

export function buildGuidanceField({

  /*
   * 🌌 RESOLVED FIELD
   */

  foregroundField = {},

  signs = [],

  orchestration = {},

  orchestrationField = {},

  pacing = {},

  /*
   * 🌊 GUIDE
   */

  activeGuide =
    GUIDE_TYPES.COSMIC,

  /*
   * 🌿 MEMORY
   */

  emergenceMemory = {},

  transmissions = [],

  /*
   * 🌌 CONTEXT
   */

  mirrorContext = {},

  activeLens = null,

  language = "en",

}: any) {

  /*
   * --------------------------------------------------------
   * 🌌 ATMOSPHERE
   * --------------------------------------------------------
   */

  const fieldAtmosphere =

    orchestration
      ?.fieldAtmosphere

      || "quiet";

  /*
   * --------------------------------------------------------
   * 🌊 SILENCE
   * --------------------------------------------------------
   */

  const silenceWindow =

    pacing
      ?.silenceWindow

      || 5000;

  /*
   * --------------------------------------------------------
   * 🌿 VISIBILITY
   * --------------------------------------------------------
   */

  const maxVisibleFragments =

    pacing
      ?.maxVisibleFragments

      || 1;

  const maxVisibleWhispers =

    pacing
      ?.maxVisibleWhispers

      || 3;

  /*
   * --------------------------------------------------------
   * 🌌 WHISPER POSITIONS
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
  ];

  /*
   * --------------------------------------------------------
   * 🌊 ATMOSPHERIC WHISPERS
   * --------------------------------------------------------
   */

const atmosphericWhispers =

  orchestrationField
    ?.atmosphericWhispers

    || [];
  /*
   * --------------------------------------------------------
   * 🌿 FRAGMENT SEQUENCE
   * --------------------------------------------------------
   */
const fragmentSequence =

  orchestrationField
    ?.fragmentSequence

    || [];

  /*
   * --------------------------------------------------------
   * 🌌 RETURN FIELD
   * --------------------------------------------------------
   */

  return {

    /*
     * 🌊 RAW
     */

    mirrorContext,

    activeLens,

    emergenceMemory,

    language,

    /*
     * 🌿 RESOLVED
     */

    foregroundField,

    orchestration,

    pacing,

    /*
     * 🌌 GUIDE
     */

    foregroundGuide:

      foregroundField
        ?.guide

        || activeGuide,

    /*
     * 🌊 EXPERIENCE
     */

    fieldAtmosphere,

    silenceWindow,

    maxVisibleFragments,

    maxVisibleWhispers,

    /*
     * 🌿 CINEMATIC
     */

    atmosphericWhispers,

    fragmentSequence,

    /*
     * 🌌 FLAGS
     */

    cinematic:
      true,

    silenceAware:
      true,
  };
}