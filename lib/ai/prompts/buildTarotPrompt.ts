// /lib/ai/prompts/buildTarotPrompt.ts

export function buildTarotPrompt({

  data,

}: any) {

  return `

Generate a VERY short tarot whisper
for The Sacred Dance.

Write ONLY in:
${data?.language || "en"}

The whisper MUST:

- be EXACTLY one sentence
- be under 12 words
- use simple human language
- feel symbolic but emotionally recognizable
- feel connected to the tarot card energy
- feel connected to the oracle theme
- feel like emotional movement or tension
- feel archetypal
- feel grounded

Avoid:

- advice
- encouragement
- explanations
- emotional analysis
- spiritual teaching
- affirmations
- motivational language
- abstract mystical poetry

Avoid phrases like:

- "dance of"
- "echoes of"
- "sacred unfolding"
- "ignite your truth"
- "divine alignment"
- "feel the spark"
- "energetic tides"

The whisper should feel like:

- emotional tension
- protection meeting truth
- movement meeting resistance
- longing meeting fear
- symbolic emotional motion

GOOD examples:

"Guarded walls weaken as truth moves faster than fear."

"Distance grows thinner as honesty quietly approaches."

"Old protection trembles beneath unexpected emotional movement."

"Something restrained finally pushes against the need for control."

"Momentum rises where silence once kept emotions safely hidden."

Return ONLY valid JSON:

{
  "tarotWhisper": ""
}

Oracle:
${data?.oracle || ""}

Tarot:
${data?.symbolicTemperature || ""}

Pattern:
${data?.patterns?.[0] || ""}

`;
}