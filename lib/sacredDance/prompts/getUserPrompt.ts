// lib/sacredDance/prompts/getUserPrompt.ts

import type {
    SacredContext,
} from "../buildSacredContext";

//
// ✨ MAIN
//

export function getUserPrompt(
  context: SacredContext
): string {

  return `

GUIDE:
${context.guide?.name || "none"}

THEME:
${context.themes?.[0] || "general"}

LENS:
${context.lens || "general"}

DOMINANT CHAKRA:
${context.chakras?.[0] || "unknown"}

EMOTIONAL FREQUENCY:
${context.emotionalFrequencies?.[0] || "unknown"}

━━━━━━━━━━
ORACLE
━━━━━━━━━━

CARD:
${context.oracle?.title || "unknown"}

MESSAGE:
${context.oracle?.affirmation || "unknown"}

INTERPRETATION:
${context.interpretations?.cards?.oracleLayer?.emotionalMeaning || ""}

ENERGETIC MEANING:
${context.interpretations?.cards?.oracleLayer?.energeticMeaning || ""}

━━━━━━━━━━
TAROT
━━━━━━━━━━

CARD:
${context.tarot?.name || "unknown"}

ARCHETYPE:
${context.tarot?.archetype || "unknown"}

MESSAGE:
${context.tarot?.message || "unknown"}

INTERPRETATION:
${context.interpretations?.cards?.tarotLayer?.emotionalMeaning || ""}

ARCHETYPAL MEANING:
${context.interpretations?.cards?.tarotLayer?.archetypalMeaning || ""}

━━━━━━━━━━
GUIDE INTERPRETATION
━━━━━━━━━━

GUIDE ROLE:
${context.interpretations?.guide?.energeticRole || "unknown"}

GUIDE STYLE:
${context.interpretations?.guide?.emotionalStyle || "unknown"}

GUIDE REFLECTION:
${context.interpretations?.guide?.reflection || ""}

━━━━━━━━━━
LENS INTERPRETATION
━━━━━━━━━━

LENS THEME:
${context.interpretations?.lens?.lensTheme || "unknown"}

EMOTIONAL FOCUS:
${context.interpretations?.lens?.emotionalFocus || "unknown"}

REFLECTION:
${context.interpretations?.lens?.reflection || ""}

━━━━━━━━━━
SACRED SYNTHESIS
━━━━━━━━━━

${context.interpretations?.cards?.synthesis || ""}

━━━━━━━━━━
LANGUAGE FIELD
━━━━━━━━━━

The transmission should:
- feel emotionally intimate
- feel calm and spacious
- feel emotionally intelligent
- sound human and grounded
- avoid generic spirituality
- avoid overexplaining
- avoid sounding instructional

Write:
- in flowing paragraphs
- with gentle pacing
- with emotional precision
- like a sacred mirror

The response should feel:
- deeply personal
- quietly transformative
- emotionally safe
- spiritually aware

`;
}