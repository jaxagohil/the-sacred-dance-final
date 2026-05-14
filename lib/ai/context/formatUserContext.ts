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
   * FORMAT
   * ---------------------------------------------------------
   */

  return `

USER CONTEXT

--------------------------------------------------
STORY
--------------------------------------------------

Emotional Theme:
${emotionalTheme || "Unknown"}

Relational Theme:
${relationalTheme || "Unknown"}

Energetic Movement:
${energeticMovement || "Unknown"}

Healing Edge:
${healingEdge || "Unknown"}

--------------------------------------------------
LEVELS OF REALITY
--------------------------------------------------

Physical Layer

Behaviours:
${physical?.behaviours?.join(", ") || "none"}

Actions:
${physical?.actions?.join(", ") || "none"}

Body Themes:
${physical?.bodyThemes?.join(", ") || "none"}

Emotional Layer

Emotions:
${emotional?.emotions?.join(", ") || "none"}

Needs:
${emotional?.needs?.join(", ") || "none"}

Themes:
${emotional?.themes?.join(", ") || "none"}

Energetic Layer

Dominant Chakra:
${energetic?.chakra || "unknown"}

Contraction:
${energetic?.contraction || 0}

Expansion:
${energetic?.expansion || 0}

--------------------------------------------------
ENERGY
--------------------------------------------------

Dominant Chakra:
${dominantChakra || "Unknown"}

Awareness Chakra:
${awarenessChakra || "Unknown"}

--------------------------------------------------
PATTERNS
--------------------------------------------------

${patterns.length

  ? patterns
      .map((p: any) => `- ${p}`)
      .join("\n")

  : "none"}

--------------------------------------------------
DISTORTIONS
--------------------------------------------------

${distortions.length

  ? distortions
      .map(
        (d: any) =>
          `- ${d.statement || d}`
      )
      .join("\n")

  : "none"}

--------------------------------------------------
REFLECTION ECHOES
--------------------------------------------------

${reflectionEchoes.length

  ? reflectionEchoes
      .map((r: any) => `- ${r}`)
      .join("\n")

  : "none"}

`;
}