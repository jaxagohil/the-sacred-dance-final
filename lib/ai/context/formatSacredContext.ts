export function formatSacredContext(
  sacred: any
) {

  if (!sacred) {
    return "";
  }

  const principles =
    sacred?.principles || [];

  const pressures =
    sacred?.pressures || [];

  const fragments =
    sacred?.fragments || [];

  return `

SACRED CONTEXT:

Principles:
${principles
  .map(
    (p: any) =>
      `- ${p.principle}`
  )
  .join("\n")}

Prompt Pressures:
${pressures
  .map(
    (p: any) =>
      `- ${p.pressure}`
  )
  .join("\n")}

Retrieved Fragments:
${fragments
  .map(
    (f: any) =>
      `- ${f.content}`
  )
  .join("\n")}

`;
}