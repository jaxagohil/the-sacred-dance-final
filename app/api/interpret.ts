export default async function handler(req, res) {

  try {

    const {

      text,

      emotions,

      childhoodSignals,

      image_base64,

      audio_base64,

      language,

    } = req.body;

    const selectedSignals =

      Object.entries(
        childhoodSignals || {}
      )

        .filter(
          ([_, value]) =>
            value === 1
        )

        .map(
          ([key]) => key
        );

    const unselectedSignals =

      Object.entries(
        childhoodSignals || {}
      )

        .filter(
          ([_, value]) =>
            value === 0
        )

        .map(
          ([key]) => key
        );

    const prompt = `

Return ONLY valid JSON.

Use EXACTLY this JSON structure:

{
  "emotions": [],
  "behaviours": [],
  "polarity": null,
  "intensity": 0.5,
  "ai_confidence": 0.5,
  "reflection_summary": "",
  "lens": {
    "people": [],
    "places": [],
    "things": []
  },
  "levels": {
    "physical": 0.5,
    "emotional": 0.5,
    "energetic": 0.5
  },
  "consciousness_movement": {
    "reactivity": 0.5,
    "awareness": 0.5,
    "responsibility": 0.5,
    "embodiment": 0.5,
    "integration": 0.5
  }
}

IMPORTANT:

- emotions must be lowercase ids
- behaviours must be lowercase ids
- never return explanations outside JSON
- never return markdown
- never return prose

Valid behaviours include examples like:
-accountable
-addiction
-aggressive
-avoidant
-chaotic
-collaborative
-compassionate
-controlling
-courageous
-creative
-critical
-decisive
-defensive
-dependable
-dependent
-disciplined
-disconnected
-dominating
-empathetic
-enmeshed
-expressive
-focused
-graceful
-grounded
-guarded
-honourable
-insecure
-intuitive
-magnetic
-manipulative
-nurturing
-overgiving
-passive
-protective
-reactive
-receptive
-rigid
-self_sacrificing
-stable
-suppressive
-validation_seeking

Valid emotions include examples like:
-angry
-anxious
-calm
-confident
-confused
-content
-curious
-disconnected
-frustrated
-grateful
-happy
-heavy
-hopeful
-hurt
-insecure
-inspired
-lonely
-loving
-neutral
-numb
-off
-open
-overwhelmed
-peaceful
-reflective
-restless
-sad
-tired
-uncertain

Only return behaviours and emotions
that strongly match the input.

Do not force interpretation.

It is valid to return empty arrays
if signals are unclear.

The user may write in multiple languages or mixed-language emotional expression.

Infer emotional meaning regardless of language.

Canonical emotional and behavioural interpretation should remain internally consistent.

Use the childhood signals as subtle emotional and behavioural context.

Selected signals may indicate emotional imprint themes.

Unselected signals may also indicate missing emotional experiences or protective adaptations.

Do NOT diagnose.
Do NOT label attachment styles.
Do NOT use clinical language.
Do NOT overstate certainty.

Instead:
- infer emotional tones
- infer nervous system tendencies
- infer behavioural protection patterns
- infer emotional needs gently

Focus on:
- emotions
- behaviours
- relational patterns
- energetic state
- contraction vs openness

Respond ONLY with valid JSON.

Text:
${text || "none"}

Language:
${language || "unknown"}

Emotions:
${emotions?.join(", ") || "none"}

Selected Childhood Signals:
${selectedSignals.join(", ") || "none"}

Unselected Childhood Signals:
${unselectedSignals.join(", ") || "none"}

Structured Childhood Signals:
${JSON.stringify(
  childhoodSignals || {}
)}

Image:
${image_base64
  ? "[provided]"
  : "none"}

Audio:
${audio_base64
  ? "[provided]"
  : "none"}
`;

    const aiRes =
      await fetch(
        "https://api.openai.com/v1/chat/completions",
        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${process.env.OPENAI_API_KEY}`,
          },

body: JSON.stringify({

  model: "gpt-4o-mini",

  response_format: {
    type: "json_object",
  },

  messages: [

              {
                role: "user",
                content: prompt,
              },
            ],

            temperature: 0,
          }),
        }
      );

    const data =
      await aiRes.json();

      console.log(
  "🧠 OPENAI RAW:",
  JSON.stringify(
    data,
    null,
    2
  )
);

    const raw =
      data?.choices?.[0]
        ?.message?.content || "{}";

let parsed = {};

try {

  parsed =
    JSON.parse(raw);

} catch (e) {

  console.error(
    "❌ JSON PARSE FAILED:",
    raw
  );

  parsed = {

    emotions: [],

    behaviours: [],

    polarity: null,

    intensity: 0.5,

    ai_confidence: 0.5,

    reflection_summary: "",

    lens: {
      people: [],
      places: [],
      things: [],
    },

    levels: {
      physical: 0.5,
      emotional: 0.5,
      energetic: 0.5,
    },

    consciousness_movement: {
      reactivity: 0.5,
      awareness: 0.5,
      responsibility: 0.5,
      embodiment: 0.5,
      integration: 0.5,
    },
  };
}

    return res
      .status(200)
      .json(parsed);

  } catch (e: any) {

  console.error(
    "❌ OPENAI INTERPRET ERROR:",
    e
  );

  return res

    .status(500)

    .json({

      error:
        "OpenAI failed",

      details:
        e?.message || e,
    });
}
}