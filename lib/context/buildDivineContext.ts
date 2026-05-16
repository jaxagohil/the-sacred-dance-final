// /lib/context/buildDivineContext.ts

export async function buildDivineContext({

  userContext,

  oracleCard,

  tarotCard,

  dailyField,

}: any) {

  /*
   * ---------------------------------------------------------
   * ⚡ ENERGY
   * ---------------------------------------------------------
   */

  const energy =
    userContext?.energy || {};

  /*
   * ---------------------------------------------------------
   * 🪞 MIRROR
   * ---------------------------------------------------------
   */

  const mirror =
    userContext?.mirror || {};

  /*
   * ---------------------------------------------------------
   * 🌍 REALITY
   * ---------------------------------------------------------
   */

  const realityLayers =
    userContext?.realityLayers || {};

  /*
   * ---------------------------------------------------------
   * 🌊 STORY
   * ---------------------------------------------------------
   */

  const story =
    mirror?.story || {};

  /*
   * ---------------------------------------------------------
   * 🧬 PATTERNS
   * ---------------------------------------------------------
   */

  const enrichedPatterns =

    userContext
      ?.enrichedPatterns || [];

  /*
   * ---------------------------------------------------------
   * 🧠 BEHAVIOURS
   * ---------------------------------------------------------
   */

  const enrichedBehaviours =

    userContext
      ?.enrichedBehaviours || [];

  /*
   * ---------------------------------------------------------
   * 🌈 DISTORTIONS
   * ---------------------------------------------------------
   */

  const distortions =

    userContext
      ?.distortions
      ?.distorted || [];

  const integratedField =

    userContext
      ?.distortions
      ?.integrated || [];

  /*
   * ---------------------------------------------------------
   * 🌈 CHAKRAS
   * ---------------------------------------------------------
   */

  const chakraManifestations =

    userContext
      ?.chakraManifestations || {};

  /*
   * ---------------------------------------------------------
   * 🧠 DOMINANT PATTERN
   * ---------------------------------------------------------
   */

  const dominantPattern =

    story?.dominantPattern ||

    enrichedPatterns?.[0]
      ?.id ||

    enrichedPatterns?.[0]
      ?.name ||

    "processing";

  /*
   * ---------------------------------------------------------
   * ⚡ ENERGY STATE
   * ---------------------------------------------------------
   */

  const contraction =
    energy?.contraction || 0;

  const expansion =
    energy?.expansion || 0;

  const dominantChakra =

    energy?.dominant_chakra ||

    "heart";

    const awarenessChakra =

    energy?.awareness_chakra ||

    "heart";

  const masculineEnergy =
    energy?.masculine || 0;

  const feminineEnergy =
    energy?.feminine || 0;

  /*
   * ---------------------------------------------------------
   * 🌊 EMOTIONAL FIELD
   * ---------------------------------------------------------
   */

  const emotionalField = [

    ...(realityLayers
      ?.emotional
      ?.recurringManifestations || []),

    ...(realityLayers
      ?.emotional
      ?.recurringCopingStrategies || []),

  ].slice(0, 10);

  /*
   * ---------------------------------------------------------
   * 🌱 RESPONSE ENERGY
   * ---------------------------------------------------------
   */

  const responseEnergy =

    story?.emotionalTension ||

    realityLayers
      ?.physical
      ?.nervousSystemState ||

    "present";

  /*
   * ---------------------------------------------------------
   * 🌌 SYMBOLIC ATMOSPHERE
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

    ...(tarotCard
      ?.symbolic_atmosphere || []),

    ...(dailyField
      ?.symbolicThemes || []),

    ...(realityLayers
      ?.consciousness
      ?.soulLessons || []),

  ];

  /*
   * ---------------------------------------------------------
   * 🖼 IMAGERY
   * ---------------------------------------------------------
   */

  const imagerySuggestions = [

    ...(oracleCard
      ?.imagery_keywords || []),

    ...(tarotCard
      ?.imagery_keywords || []),

    ...(dailyField
      ?.imagery || []),

    ...(realityLayers
      ?.physical
      ?.observableScenes || []),
  ];

  /*
   * ---------------------------------------------------------
   * 🌊 MOVEMENT
   * ---------------------------------------------------------
   */

  const movementField = [

    ...(oracleCard
      ?.movement_keywords || []),

    ...(tarotCard
      ?.movement_keywords || []),

    ...(realityLayers
      ?.emotional
      ?.recurringManifestations || []),
  ];

  /*
   * ---------------------------------------------------------
   * 🧠 BEHAVIOURAL THEMES
   * ---------------------------------------------------------
   */

  const behaviouralThemes = [

    ...(oracleCard
      ?.behavioural_themes || []),

    ...(tarotCard
      ?.behavioural_themes || []),

    ...enrichedBehaviours.map(
      (b: any) =>

        b?.id
    ),

  ].filter(Boolean);

  /*
   * ---------------------------------------------------------
   * 💞 RELATIONAL FIELD
   * ---------------------------------------------------------
   */

  const relationalField = [

    oracleCard
      ?.relational_energy,

    ...(realityLayers
      ?.emotional
      ?.recurringMirrorPrompts || []),

  ].filter(Boolean);

  /*
   * ---------------------------------------------------------
   * 🌍 ENVIRONMENT
   * ---------------------------------------------------------
   */

  const symbolicEnvironment = [

    ...(Array.isArray(
      oracleCard
        ?.symbolic_environment
    )

      ? oracleCard
          ?.symbolic_environment

      : oracleCard
          ?.symbolic_environment

        ? [
            oracleCard
              ?.symbolic_environment,
          ]

        : []),

    ...(tarotCard
      ?.environment_keywords || []),

    ...(realityLayers
      ?.physical
      ?.observableScenes || []),
  ];

  /*
   * ---------------------------------------------------------
   * ❓ QUESTION STYLE
   * ---------------------------------------------------------
   */

  const questionStyle =

    tarotCard
      ?.question_style ||

    oracleCard
      ?.inquiry_energy ||

    "reflective";

  /*
   * ---------------------------------------------------------
   * 🪞 INQUIRY
   * ---------------------------------------------------------
   */

  const inquiryExamples = [

    ...(oracleCard
      ?.inquiry_examples || []),

    ...(tarotCard
      ?.inquiry_examples || []),

    ...(realityLayers
      ?.emotional
      ?.recurringMirrorPrompts || []),

  ];

  /*
   * ---------------------------------------------------------
   * 🧬 ARCHETYPAL ENERGY
   * ---------------------------------------------------------
   */

  const archetypalEnergy = [

    ...(tarotCard
      ?.archetypal_energy || []),

    ...(dailyField
      ?.guideTone || []),

    ...(realityLayers
      ?.consciousness
      ?.gifts || []),
  ];

  /*
   * ---------------------------------------------------------
   * ⚡ TENSION PATTERNS
   * ---------------------------------------------------------
   */

  const tensionPatterns = [

    ...(tarotCard
      ?.tension_patterns || []),

    ...distortions.map(
      (d: any) =>

        d?.shadow_meaning
    ),

  ].filter(Boolean);

  /*
   * ---------------------------------------------------------
   * 🌱 INTEGRATED THEMES
   * ---------------------------------------------------------
   */

  const integratedThemes =

    integratedField.map(
      (b: any) =>

        b?.integrated_meaning
    ).filter(Boolean);

  /*
   * ---------------------------------------------------------
   * 🌊 CADENCE
   * ---------------------------------------------------------
   */

  const cadenceStyle =

    oracleCard
      ?.cadence_style ||

    tarotCard
      ?.pacing_style ||

    "gentle";

  /*
   * ---------------------------------------------------------
   * 🌡 TEMPERATURE
   * ---------------------------------------------------------
   */

  const symbolicTemperature = [

    oracleCard
      ?.archetypal_temperature,

    tarotCard
      ?.symbolic_temperature,

  ].filter(Boolean);

  /*
   * ---------------------------------------------------------
   * 🌈 CHAKRA FIELD
   * ---------------------------------------------------------
   */

  const activeChakraField =

    chakraManifestations[
      awarenessChakra
    ] || [];

  /*
   * ---------------------------------------------------------
   * ✨ RETURN
   * ---------------------------------------------------------
   */

  return {

    dominantPattern,

    contraction,

    expansion,

    dominantChakra,

    awarenessChakra,

    masculineEnergy,

    feminineEnergy,

    responseEnergy,

    emotionalField,

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

    integratedThemes,

    cadenceStyle,

    symbolicTemperature,

    activeChakraField,

    soulLessons:

      realityLayers
        ?.consciousness
        ?.soulLessons || [],

    gifts:

      realityLayers
        ?.consciousness
        ?.gifts || [],

    storyTheme:
      story?.emotionalTheme || null,

    dailyField: {

      oracleBias:
        dailyField
          ?.oracleBias || [],

      tarotBias:
        dailyField
          ?.tarotBias || [],

      symbolicThemes:
        dailyField
          ?.symbolicThemes || [],

      guideTone:
        dailyField
          ?.guideTone || [],
    },
  };
}