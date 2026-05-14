// /lib/context/buildDivineContext.ts

export async function buildDivineContext({

  userContext,

  oracleCard,

  tarotCard,

  dailyField,

}: any) {

  /*
   * ---------------------------------------------------------
   * ENERGY
   * ---------------------------------------------------------
   */

  const energy =
    userContext?.energy || {};

  /*
   * ---------------------------------------------------------
   * MIRROR
   * ---------------------------------------------------------
   */

  const mirror =
    userContext?.mirror || {};

  /*
   * ---------------------------------------------------------
   * STORY
   * ---------------------------------------------------------
   */

  const story =
    userContext?.story || {};

  /*
   * ---------------------------------------------------------
   * DOMINANT PATTERN
   * ---------------------------------------------------------
   */

  const dominantPattern =
    mirror?.dominantPattern ||
    mirror?.primaryPattern ||
    "emotional hesitation";

  /*
   * ---------------------------------------------------------
   * CONTRACTION
   * ---------------------------------------------------------
   */

  const contraction =
    energy?.contraction || 0;

  /*
   * ---------------------------------------------------------
   * EXPANSION
   * ---------------------------------------------------------
   */

  const expansion =
    energy?.expansion || 0;

  /*
   * ---------------------------------------------------------
   * CHAKRA
   * ---------------------------------------------------------
   */

  const dominantChakra =
    energy?.dominant_chakra ||
    "heart";

  /*
   * ---------------------------------------------------------
   * POLARITY
   * ---------------------------------------------------------
   */

  const masculineEnergy =
    energy?.masculine || 0;

  const feminineEnergy =
    energy?.feminine || 0;

  /*
   * ---------------------------------------------------------
   * EMOTIONAL FIELD
   * ---------------------------------------------------------
   */

  const emotionalField: string[] = [];

  if (contraction > expansion) {

    emotionalField.push(
      "hesitation",
      "guarded openness",
      "withdrawal"
    );
  }

  if (expansion > contraction) {

    emotionalField.push(
      "soft opening",
      "movement",
      "possibility"
    );
  }

  /*
   * ---------------------------------------------------------
   * RESPONSE ENERGY
   * ---------------------------------------------------------
   */

  let responseEnergy =
    "quiet";

  if (
    dominantChakra ===
    "throat"
  ) {

    responseEnergy =
      "truth";
  }

  if (
    dominantChakra ===
    "heart"
  ) {

    responseEnergy =
      "tender";
  }

  if (
    dominantChakra ===
    "solar_plexus"
  ) {

    responseEnergy =
      "movement";
  }

  /*
   * ---------------------------------------------------------
   * SYMBOLIC ATMOSPHERE
   * ---------------------------------------------------------
   */

const symbolicAtmosphere = [

  ...(Array.isArray(
    oracleCard?.symbolic_tone
  )

    ? oracleCard
        ?.symbolic_tone

    : oracleCard?.symbolic_tone

      ? [
          oracleCard
            ?.symbolic_tone,
        ]

      : []),

  ...(tarotCard?.symbolic_atmosphere || []),

  ...(dailyField?.symbolicThemes || []),
];

  /*
   * ---------------------------------------------------------
   * IMAGERY
   * ---------------------------------------------------------
   */

  const imagerySuggestions = [

    ...(oracleCard?.imagery_keywords || []),

    ...(tarotCard?.imagery_keywords || []),

    ...(dailyField?.imagery || []),
  ];

  /*
   * ---------------------------------------------------------
   * MOVEMENT
   * ---------------------------------------------------------
   */

  const movementField = [

    ...(oracleCard?.movement_keywords || []),

    ...(tarotCard?.movement_keywords || []),
  ];

  /*
   * ---------------------------------------------------------
   * BEHAVIOURAL THEMES
   * ---------------------------------------------------------
   */

  const behaviouralThemes = [

    ...(oracleCard?.behavioural_themes || []),

    ...(tarotCard?.behavioural_themes || []),
  ];

  /*
 * ---------------------------------------------------------
 * RELATIONAL FIELD
 * ---------------------------------------------------------
 */

const relationalField = [

  oracleCard
    ?.relational_energy,

].filter(Boolean);

  /*
   * ---------------------------------------------------------
   * ENVIRONMENT
   * ---------------------------------------------------------
   */

  const symbolicEnvironment = [

  ...(Array.isArray(
    oracleCard?.symbolic_environment
  )

    ? oracleCard
        ?.symbolic_environment

    : oracleCard?.symbolic_environment

      ? [
          oracleCard
            ?.symbolic_environment,
        ]

      : []),

  ...(tarotCard?.environment_keywords || []),
];

  /*
   * ---------------------------------------------------------
   * QUESTION STYLE
   * ---------------------------------------------------------
   */

  const questionStyle =

    tarotCard?.question_style ||

    oracleCard?.inquiry_energy ||

    "reflective";

  /*
   * ---------------------------------------------------------
   * QUESTION EXAMPLES
   * ---------------------------------------------------------
   */

  const inquiryExamples = [

    ...(oracleCard?.inquiry_examples || []),

    ...(tarotCard?.inquiry_examples || []),
  ];

  /*
   * ---------------------------------------------------------
   * ARCHETYPAL ENERGY
   * ---------------------------------------------------------
   */

  const archetypalEnergy = [

    ...(tarotCard?.archetypal_energy || []),

    ...(dailyField?.guideTone || []),
  ];

  /*
   * ---------------------------------------------------------
   * TENSION PATTERNS
   * ---------------------------------------------------------
   */

  const tensionPatterns = [

    ...(tarotCard?.tension_patterns || []),
  ];

  /*
   * ---------------------------------------------------------
   * CADENCE
   * ---------------------------------------------------------
   */

  const cadenceStyle =

    oracleCard?.cadence_style ||

    tarotCard?.pacing_style ||

    "gentle";

  /*
   * ---------------------------------------------------------
   * TEMPERATURE
   * ---------------------------------------------------------
   */

  const symbolicTemperature = [

    oracleCard?.archetypal_temperature,

    tarotCard?.symbolic_temperature,
  ].filter(Boolean);

  /*
   * ---------------------------------------------------------
   * RETURN
   * ---------------------------------------------------------
   */

  return {

    dominantPattern,

    emotionalField,

    contraction,

    expansion,

    dominantChakra,

    masculineEnergy,

    feminineEnergy,

    responseEnergy,

    symbolicAtmosphere,

    imagerySuggestions,

    movementField,

    behaviouralThemes,
    relationalField,

    symbolicEnvironment,

    questionStyle,

    inquiryExamples,

    archetypalEnergy,

    tensionPatterns,

    cadenceStyle,

    symbolicTemperature,

    storyTheme:
      story?.emotionalTheme || null,

    dailyField: {

      oracleBias:
        dailyField?.oracleBias || [],

      tarotBias:
        dailyField?.tarotBias || [],

      symbolicThemes:
        dailyField?.symbolicThemes || [],

      guideTone:
        dailyField?.guideTone || [],
    },
  };
}