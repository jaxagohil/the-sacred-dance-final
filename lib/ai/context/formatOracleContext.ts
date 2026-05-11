export function formatOracleContext(
  sacred: any
) {

  if (!sacred) {
    return "";
  }

  const oracleCards =
    sacred?.oracleCards || [];

  const oraclePrompts =
    sacred?.oraclePrompts || [];

  return `

ORACLE CONTEXT:

Oracle Archetypes:
${oracleCards
  .map(
    (card: any) => `

- ${card.title}

Affirmation:
${card.affirmation || ""}

Message:
${card.message || ""}

`
  )
  .join("\n")}

Oracle Reflection Prompts:
${oraclePrompts
  .map(
    (prompt: any) =>
      `- ${prompt.prompt}`
  )
  .join("\n")}

`;
}