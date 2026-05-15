export function formatUserContext(
  user: any
) {

  if (!user) {
    return "";
  }

  /*
   * ---------------------------------------------------------
   * STORY
   * ---------------------------------------------------------
   */

  const emotionalTheme =
    user?.story?.emotionalTheme;

  const relationalTheme =
    user?.story?.relationalTheme;

  const energeticMovement =
    user?.story?.energeticMovement;

  const healingEdge =
    user?.story?.healingEdge;

  const emotionalTension =
    user?.story?.emotionalTension;

  const nervousSystemState =
    user?.story?.nervousSystemState;

  /*
   * ---------------------------------------------------------
   * ENERGY
   * ---------------------------------------------------------
   */

  const dominantChakra =
    user?.energy?.dominantChakra;

  const awarenessChakra =
    user?.awarenessChakra?.name;

  /*
   * ---------------------------------------------------------
   * PATTERNS
   * ---------------------------------------------------------
   */

  const patterns =
    user?.current?.patterns || [];

  /*
   * ---------------------------------------------------------
   * DISTORTIONS
   * ---------------------------------------------------------
   */

  const distortions = [

    ...(user?.distortions?.masculine || []),

    ...(user?.distortions?.feminine || []),
  ];

  /*
   * ---------------------------------------------------------
   * MANIFESTATIONS
   * ---------------------------------------------------------
   */

  const manifestations =

    distortions
      ?.map(
        (d: any) =>

          d?.manifestation ||

          d?.observable_scene ||

          d?.mirror_prompt
      )
      .filter(Boolean)
      .slice(0, 6);

  /*
   * ---------------------------------------------------------
   * VOICE
   * ---------------------------------------------------------
   */

  const reflectionEchoes =
    user?.voice?.reflectionEchoes || [];

  /*
   * ---------------------------------------------------------
   * LEVELS
   * ---------------------------------------------------------
   */

  const physical =
    user?.levels?.physical || {};

  const emotional =
    user?.levels?.emotional || {};

  const energetic =
    user?.levels?.energetic || {};

  /*
   * ---------------------------------------------------------
   * ATMOSPHERIC STATE
   * ---------------------------------------------------------
   */

  const contraction =
    energetic?.contraction || 0;

  const expansion =
    energetic?.expansion || 0;

  let energeticAtmosphere =
    "balanced";

  if (contraction > 0.7) {

    energeticAtmosphere =
      "emotionally contracted and protective";
  }

  if (expansion > 0.7) {

    energeticAtmosphere =
      "open, expressive, and emotionally expansive";
  }

  if (
    contraction > 0.5 &&
    expansion > 0.5
  ) {

    energeticAtmosphere =
      "moving between openness and emotional protection";
  }

  /*
   * ---------------------------------------------------------
   * FORMAT
   * ---------------------------------------------------------
   */

  return `

USER FIELD

--------------------------------------------------
EMOTIONAL ATMOSPHERE
--------------------------------------------------

The user currently appears to be moving through:

- Emotional Theme:
${emotionalTheme || "Unknown"}

- Relational Theme:
${relationalTheme || "Unknown"}

- Energetic Movement:
${energeticMovement || "Unknown"}

- Healing Edge:
${healingEdge || "Unknown"}

- Emotional Tension:
${emotionalTension || "Unknown"}

- Nervous System State:
${nervousSystemState || "Unknown"}

The overall energetic atmosphere feels:

${energeticAtmosphere}

--------------------------------------------------
LEVELS OF REALITY
--------------------------------------------------

Physical Layer

- Behaviours:
${physical?.behaviours?.join(", ") || "none"}

- Actions:
${physical?.actions?.join(", ") || "none"}

- Body Themes:
${physical?.bodyThemes?.join(", ") || "none"}

Emotional Layer

- Emotions:
${emotional?.emotions?.join(", ") || "none"}

- Needs:
${emotional?.needs?.join(", ") || "none"}

- Themes:
${emotional?.themes?.join(", ") || "none"}

Energetic Layer

- Dominant Chakra:
${energetic?.chakra || "unknown"}

- Contraction:
${contraction}

- Expansion:
${expansion}

--------------------------------------------------
ENERGETIC FIELD
--------------------------------------------------

- Dominant Chakra:
${dominantChakra || "Unknown"}

- Awareness Chakra:
${awarenessChakra || "Unknown"}

--------------------------------------------------
ACTIVE MANIFESTATIONS
--------------------------------------------------

${manifestations.length

  ? manifestations
      .map(
        (m: any) =>
          `- ${m}`
      )
      .join("\n")

  : "none"}

--------------------------------------------------
RECURRING PATTERNS
--------------------------------------------------

${patterns.length

  ? patterns
      .map(
        (p: any) =>
          `- ${p}`
      )
      .join("\n")

  : "none"}

--------------------------------------------------
VOICE ECHOES
--------------------------------------------------

${reflectionEchoes.length

  ? reflectionEchoes
      .map(
        (r: any) =>
          `- ${r}`
      )
      .join("\n")

  : "none"}

`;
}