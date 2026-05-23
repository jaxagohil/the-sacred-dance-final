// /lib/guidance/core/preprocessGuidanceSignals.ts

interface PreprocessGuidanceSignalsProps {

  reflectionResult: any;

  userHistory?: any;

  fieldContext?: any;
}

export const preprocessGuidanceSignals = ({
  reflectionResult,
  userHistory,
  fieldContext,
}: PreprocessGuidanceSignalsProps) => {

  /*
   * ------------------------------------------------
   * 🌱 EXTRACT BASE SIGNALS
   * ------------------------------------------------
   */

  const emotions =
    reflectionResult?.emotions || [];

  const behaviours =
    reflectionResult?.behaviours || [];

  const patterns =
    reflectionResult?.patterns || [];

  const signals =
    reflectionResult?.signals || {};

  /*
   * ------------------------------------------------
   * 🌊 EMOTIONAL INTENSITY
   * ------------------------------------------------
   */

  const emotionalIntensity =
    Math.min(
      emotions.length * 0.15,
      1
    );

  /*
   * ------------------------------------------------
   * 🌿 CONTRACTION
   * ------------------------------------------------
   */

  let contraction = 0.3;

  if (
    behaviours.includes(
      "overthinking"
    )
  ) {
    contraction += 0.2;
  }

  if (
    behaviours.includes(
      "waiting"
    )
  ) {
    contraction += 0.2;
  }

  if (
    behaviours.includes(
      "withdrawing"
    )
  ) {
    contraction += 0.2;
  }

  if (
    emotions.includes(
      "fear"
    )
  ) {
    contraction += 0.2;
  }

  contraction =
    Math.min(contraction, 1);

  /*
   * ------------------------------------------------
   * ☀️ OPENNESS
   * ------------------------------------------------
   */

  let openness = 0.5;

  if (
    behaviours.includes(
      "self_reflection"
    )
  ) {
    openness += 0.2;
  }

  if (
    behaviours.includes(
      "vulnerability"
    )
  ) {
    openness += 0.2;
  }

  if (
    emotions.includes(
      "acceptance"
    )
  ) {
    openness += 0.1;
  }

  openness =
    Math.min(openness, 1);

  /*
   * ------------------------------------------------
   * 🌌 REALITY LAYERS
   * ------------------------------------------------
   */

  const realityLayers = {

    physical: 0.3,

    emotional: 0.6,

    energetic: 0.2,
  };

  /*
   * Physical Layer
   */

  const physicalKeywords = [

    "money",

    "work",

    "body",

    "sleep",

    "health",

    "tired",

    "stress",

    "home",

    "moving",
  ];

  /*
   * Emotional Layer
   */

  const emotionalKeywords = [

    "love",

    "hurt",

    "abandonment",

    "grief",

    "fear",

    "sadness",

    "longing",
  ];

  /*
   * Energetic Layer
   */

  const energeticKeywords = [

    "synchronicity",

    "energy",

    "awakening",

    "sign",

    "mirror",

    "soul",

    "spiritual",
  ];

const reflectionText =

  String(

    reflectionResult
      ?.reflection

    ||

    reflectionResult
      ?.content

    ||

    reflectionResult
      ?.text

    ||

    ""

  ).toLowerCase();

  physicalKeywords.forEach(
    (keyword) => {

      if (
        reflectionText.includes(
          keyword
        )
      ) {

        realityLayers.physical += 0.1;
      }
    }
  );

  emotionalKeywords.forEach(
    (keyword) => {

      if (
        reflectionText.includes(
          keyword
        )
      ) {

        realityLayers.emotional += 0.1;
      }
    }
  );

  energeticKeywords.forEach(
    (keyword) => {

      if (
        reflectionText.includes(
          keyword
        )
      ) {

        realityLayers.energetic += 0.1;
      }
    }
  );

  /*
   * ------------------------------------------------
   * 🌱 NERVOUS SYSTEM STATE
   * ------------------------------------------------
   */

  let nervousSystem =
    "regulated";

  if (
    contraction > 0.7
  ) {

    nervousSystem =
      "activated";
  }

  if (
    openness > 0.7
    && contraction < 0.4
  ) {

    nervousSystem =
      "expanding";
  }

  if (
    contraction > 0.5
    && openness < 0.4
  ) {

    nervousSystem =
      "guarded";
  }

  /*
   * ------------------------------------------------
   * 🌌 SYMBOLIC TOLERANCE
   * ------------------------------------------------
   */

  let symbolicTolerance = 0.3;

  if (
    realityLayers.energetic > 0.6
  ) {

    symbolicTolerance += 0.3;
  }

  if (
    openness > 0.7
  ) {

    symbolicTolerance += 0.2;
  }

  symbolicTolerance =
    Math.min(
      symbolicTolerance,
      1
    );

  /*
   * ------------------------------------------------
   * 🌿 EXTERNAL FOCUS
   * ------------------------------------------------
   */

  let externalFocus = 0.2;

  if (
    reflectionText.includes("he ")
    || reflectionText.includes("she ")
    || reflectionText.includes("they ")
  ) {

    externalFocus += 0.4;
  }

  if (
    behaviours.includes(
      "waiting"
    )
  ) {

    externalFocus += 0.2;
  }

  externalFocus =
    Math.min(
      externalFocus,
      1
    );

  /*
   * ------------------------------------------------
   * 🪞 SELF AWARENESS
   * ------------------------------------------------
   */

  let selfAwareness = 0.4;

  if (
    behaviours.includes(
      "self_reflection"
    )
  ) {

    selfAwareness += 0.3;
  }

  if (
    reflectionText.includes(
      "i notice"
    )
  ) {

    selfAwareness += 0.2;
  }

  if (
    reflectionText.includes(
      "i feel"
    )
  ) {

    selfAwareness += 0.1;
  }

  selfAwareness =
    Math.min(
      selfAwareness,
      1
    );

  /*
   * ------------------------------------------------
   * 🌱 EMBODIMENT
   * ------------------------------------------------
   */

  let embodiment = 0.4;

  if (
    behaviours.includes(
      "grounding"
    )
  ) {

    embodiment += 0.2;
  }

  if (
    behaviours.includes(
      "presence"
    )
  ) {

    embodiment += 0.2;
  }

  embodiment =
    Math.min(
      embodiment,
      1
    );

  /*
   * ------------------------------------------------
   * 🌍 GROUNDING
   * ------------------------------------------------
   */

  let grounding = 0.5;

  if (
    realityLayers.physical > 0.7
  ) {

    grounding += 0.2;
  }

  if (
    nervousSystem === "activated"
  ) {

    grounding -= 0.2;
  }

  grounding =
    Math.max(
      0,
      Math.min(grounding, 1)
    );

  /*
   * ------------------------------------------------
   * ✨ COHERENCE
   * ------------------------------------------------
   */

  let coherence = (

    openness
    + embodiment
    + selfAwareness
    + grounding

  ) / 4;

  coherence =
    Math.min(
      coherence,
      1
    );

  /*
   * ------------------------------------------------
   * 🌀 SPIRAL DIRECTION
   * ------------------------------------------------
   */

  let spiralDirection =
    "integrating";

  if (
    contraction > 0.7
  ) {

    spiralDirection =
      "contracting";
  }

  if (
    externalFocus > 0.7
  ) {

    spiralDirection =
      "looping";
  }

  if (
    openness > 0.7
    && coherence > 0.6
  ) {

    spiralDirection =
      "expanding";
  }

  /*
   * ------------------------------------------------
   * 🌿 SPIRAL PHASE
   * ------------------------------------------------
   */

  let spiralPhase =
    "recognizing";

  if (
    selfAwareness < 0.4
  ) {

    spiralPhase =
      "surviving";
  }

  if (
    selfAwareness > 0.7
    && embodiment < 0.5
  ) {

    spiralPhase =
      "awakening";
  }

  if (
    embodiment > 0.7
    && coherence > 0.7
  ) {

    spiralPhase =
      "integrating";
  }

  /*
   * ------------------------------------------------
   * 🌌 FIELD TONE
   * ------------------------------------------------
   */

  let fieldTone =
    "soft";

  if (
    contraction > 0.7
  ) {

    fieldTone =
      "contracted";
  }

  if (
    openness > 0.7
  ) {

    fieldTone =
      "expansive";
  }

  if (
    coherence > 0.7
  ) {

    fieldTone =
      "golden";
  }

  /*
   * ------------------------------------------------
   * 💛 LOVE • PEACE • JOY
   * ------------------------------------------------
   */

  const emotionalField = {

    love:
      openness,

    peace:
      grounding,

    joy:
      coherence,
  };

  /*
   * ------------------------------------------------
   * 📦 RETURN ENRICHED SIGNALS
   * ------------------------------------------------
   */

  return {

    /*
     * Existing
     */

    emotions,

    behaviours,

    patterns,

    signals,

    /*
     * Sacred Dance Enrichment
     */

    nervousSystem,

    contraction,

    openness,

    coherence,

    embodiment,

    grounding,

    symbolicTolerance,

    externalFocus,

    selfAwareness,

    realityLayers,

    spiralDirection,

    spiralPhase,

    fieldTone,

    emotionalField,

    /*
     * Energy / Gold
     */

    goldPresence:
      coherence > 0.7,

    /*
     * Context
     */

    userHistory,

    fieldContext,
  };
};