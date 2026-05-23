import {
    responseStrategies,
} from "../orchestration/responseStrategies";

type Props = {

  orchestration: any;

  guidanceSignals: any;

  recentMessages?: any[];
};

export function responseChoreography({

  orchestration,

  guidanceSignals,

  recentMessages = [],

}: Props) {

  /*
   * ------------------------------------------------
   * 🌊 SIGNALS
   * ------------------------------------------------
   */

  const nervousSystem =

    guidanceSignals
      ?.nervousSystem ||

    "regulated";

  const coherence =

    guidanceSignals
      ?.coherence || 0;

  const spiralDirection =

    guidanceSignals
      ?.spiralDirection;

  const fieldTone =

    guidanceSignals
      ?.fieldTone;

  /*
   * ------------------------------------------------
   * 🌿 ACTIVE STRATEGY
   * ------------------------------------------------
   */

  const strategy =

    responseStrategies[
      orchestration
        ?.responseStrategy
    ]

    ||

    responseStrategies
      .reflective;

  /*
   * ------------------------------------------------
   * 🌱 DEFAULTS
   * ------------------------------------------------
   */

  let responseLength =

    strategy
      ?.responseLength ||

    "medium";

  let questionCount =

    strategy
      ?.questionDensity ===
        "low"

      ? 0

      : 1;

  let symbolicDensity =

    strategy
      ?.symbolicDepth ||

    "light";

  let pacing =

    strategy
      ?.pacing ||

    "reflective";

  let embodimentInterrupt =
    null;

  let shouldPause =
    false;

  /*
   * ------------------------------------------------
   * 🔥 ACTIVATED SYSTEM
   * ------------------------------------------------
   */

  if (

    nervousSystem ===
      "activated"

    ||

    fieldTone ===
      "contracted"

  ) {

    responseLength =
      "short";

    questionCount =
      0;

    symbolicDensity =
      "none";

    pacing =
      "grounding";

    embodimentInterrupt =
      "slow_down";

    shouldPause =
      true;
  }

  /*
   * ------------------------------------------------
   * 🌌 HIGH SYMBOLIC STATE
   * ------------------------------------------------
   */

  if (

    coherence > 0.7

    &&

    nervousSystem !==
      "activated"

  ) {

    symbolicDensity =
      "medium";
  }

  /*
   * ------------------------------------------------
   * 🌀 LOOPING
   * ------------------------------------------------
   */

  if (

    spiralDirection ===
      "looping"

  ) {

    questionCount =
      1;

    responseLength =
      "short";
  }

  /*
   * ------------------------------------------------
   * 🌿 EMBODIMENT OVERRIDE
   * ------------------------------------------------
   */

  if (

    strategy
      ?.embodimentLevel ===
        "very_high"

  ) {

    embodimentInterrupt =
      "body_connection";
  }

  /*
   * ------------------------------------------------
   * 🌊 RECENT MESSAGE SATURATION
   * ------------------------------------------------
   */

  if (
    recentMessages.length > 12
  ) {

    shouldPause =
      true;
  }

  /*
   * ------------------------------------------------
   * ✨ RETURN
   * ------------------------------------------------
   */

  return {

    strategy:
      orchestration
        ?.responseStrategy,

    responseLength,

    questionCount,

    symbolicDensity,

    pacing,

    embodimentInterrupt,

    shouldPause,
  };
}