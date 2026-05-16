// /lib/ai/prompts/buildConnectionsPrompt.ts

export function
buildConnectionsPrompt({

  data,

}: any) {

  //
  // 🌌 SPACE
  //

  const spaceType =
    data?.spaceType || "field";

  //
  // ✨ SPACE ATMOSPHERE
  //


//
// 🌍 LANGUAGE
//

const language =
  data?.languageName || "English";

const languageContext =
  data?.languageContext || {};

const emotionalStyle =

  Array.isArray(
    languageContext?.emotional_style
  )

    ? languageContext
        .emotional_style
        .join(", ")

    : "";

const symbolicTolerance =
  languageContext
    ?.symbolic_tolerance || "medium";

const directness =
  languageContext
    ?.directness || "medium";

  const spaceContext =

    //
    // 💗 LOVE
    //

    spaceType === "love"

      ? `
LOVE SPACE

This space is about:
self-love,
openness,
receiving,
heart connection,
inner warmth,
emotional honesty.

The atmosphere should feel:
personally intimate,
heart-opening,
emotionally alive,
softly magnetic,
gently vulnerable.
`

    //
    // 🌍 COMPASSION
    //

    : spaceType === "compassion"

      ? `
COMPASSION SPACE

This space is about:
humanity,
care for others,
the planet,
shared feeling,
empathy,
universal tenderness.

The atmosphere should feel:
emotionally aware,
human,
tender,
expansive,
deeply caring.
`

    //
    // ✨ UNITY
    //

    : spaceType === "unity"

      ? `
UNITY SPACE

This space is about:
oneness,
interconnection,
collective consciousness,
no separation,
shared existence,
the feeling that everything is connected.

The atmosphere should feel:
collective,
boundaryless,
calm,
interwoven,
quietly universal.
`

    //
    // 🌊 HUMAN
    //

    : spaceType === "human"

      ? `
HUMAN SPACE

This space is about:
conversation,
human interaction,
social energy,
relational dynamics,
subtle emotional movement.

The atmosphere should feel:
alive,
social,
emotionally nuanced,
curious,
unspoken.
`

    //
    // 🪞 SELF
    //

    : `
SELF SPACE

This space is about:
inner awareness,
self-connection,
stillness,
personal emotional weather,
presence.

The atmosphere should feel:
quiet,
clear,
spacious,
emotionally aware,
deeply personal.
`;

  //
  // 🌕 COSMIC
  //

  const phase =
    data?.phase || "unknown";

  const moon =
    data?.moon || "unknown";

  const sun =
    data?.sun || "unknown";

  //
  // 🃏 ORACLE
  //

  const oracleCard =
    data?.oracleCard || "unknown";

  //
  // ✨ THEMES
  //

  const symbolicThemes =

    Array.isArray(
      data?.symbolicThemes
    )

      ? data.symbolicThemes
          .join(", ")

      : "";

  //
  // ✨ PROMPT
  //

  return `

This is NOT a coaching conversation.

You are generating ONE short energetic transmission
for a living relational field.

${spaceContext}

MOON:
${moon}

PHASE:
${phase}

SUN:
${sun}

ORACLE CARD:
${oracleCard}

THEMES:
${symbolicThemes}

LANGUAGE:
${language}

Generate ALL output ONLY in ${language}.

Never use English unless the requested language is English.

If the requested language is Hindi,
ALL output must be written in Hindi script.

Do NOT use English words.

The transmission must feel emotionally native,
not translated.

LANGUAGE EMOTIONAL STYLE:
${emotionalStyle}

SYMBOLIC TOLERANCE:
${symbolicTolerance}

DIRECTNESS:
${directness}

The transmission must feel
emotionally native
to ${data?.languageName}.

Do not translate English poetic structure directly.

Shorter and simpler is better.

The emotional cadence,
spacing,
softness,
and symbolic restraint
should feel natural
for someone emotionally fluent
in the ${data?.languageName}.

RULES:

- Maximum 8 words
- One sentence only
- No line breaks
- Describe energetic emotional movement
- The message should feel like emotional weather
- Different spaces should feel emotionally distinct
- The transmission should feel emotionally alive and energetically specific
- Avoid generic softness
- Keep it human and emotionally intelligent
- No therapy language
- No mindfulness language
- No coaching
- No spirituality
- No mysticism
- No emotional processing
- No questions
- No advice

GOOD EXAMPLES:

LOVE:
- Your heart feels more open today.
- Warmth moves through you more freely tonight.

COMPASSION:
- Humanity feels more tender today.
- People seem slower with each other now.

UNITY:
- Everything feels quietly interconnected today.
- Separation feels thinner today.

HUMAN:
- Conversations carry unusual emotional weight today.
- Something unspoken moves between people today.

SELF:
- Your inner world feels unusually clear today.
- Something settles quietly inside today.

Return ONLY the sentence.

`;
}