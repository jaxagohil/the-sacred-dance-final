export function formatUserContext(
  user: any
) {

  if (!user) {
    return "";
  }

  const emotionalTheme =
    user?.story?.emotionalTheme;

  const relationalTheme =
    user?.story?.relationalTheme;

  const energeticMovement =
    user?.story?.energeticMovement;

  const healingEdge =
    user?.story?.healingEdge;

  const dominantChakra =
    user?.energy?.dominantChakra;

  const awarenessChakra =
    user?.awarenessChakra?.name;

  const patterns =
    user?.current?.patterns || [];

  const distortions = [

    ...(user?.distortions?.masculine || []),

    ...(user?.distortions?.feminine || []),
  ];

  const reflectionEchoes =
    user?.voice?.reflectionEchoes || [];

  return `

USER CONTEXT:

Emotional Theme:
${emotionalTheme || "Unknown"}

Relational Theme:
${relationalTheme || "Unknown"}

Energetic Movement:
${energeticMovement || "Unknown"}

Healing Edge:
${healingEdge || "Unknown"}

Dominant Chakra:
${dominantChakra || "Unknown"}

Awareness Chakra:
${awarenessChakra || "Unknown"}

Patterns:
${patterns
  .map((p: any) => `- ${p}`)
  .join("\n")}

Distortions:
${distortions
  .map(
    (d: any) =>
      `- ${d.statement || d}`
  )
  .join("\n")}

Reflection Echoes:
${reflectionEchoes
  .map((r: any) => `- ${r}`)
  .join("\n")}

`;
}