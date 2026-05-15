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

    const raw =
      data?.choices?.[0]
        ?.message?.content || "{}";

    const parsed =
      JSON.parse(raw);

    return res
      .status(200)
      .json(parsed);

  } catch (e) {

    console.error(
      "❌ API ERROR:",
      e
    );

    return res

      .status(500)

      .json({
        error:
          "Interpret failed",
      });
  }
}