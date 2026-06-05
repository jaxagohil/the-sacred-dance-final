import { serve } from "https://deno.land/std/http/server.ts";

const OPENAI_API_KEY =
  Deno.env.get(
    "OPENAI_API_KEY"
  )!;

serve(async (req) => {

  try {

    const {
      text,
      emotions,
      image_base64,
      audio_base64,
    } = await req.json();

    const EMOTIONS = `
angry, anxious, calm, confident, confused, content, curious,
disconnected, frustrated, grateful, happy, heavy, hopeful,
hurt, insecure, inspired, lonely, loving, neutral, numb,
off, open, overwhelmed, peaceful, reflective, restless,
sad, tired, uncertain, crying
`;

    const BEHAVIOURS = `
avoiding, connected, controlling, creating_abundance, decisive,
direct, disconnected, expressing, flowing, focused, grounded,
hiding, intuitive, losing_money, not_receiving, open,
over_responsibility, overgiving, overthinking, overwhelmed,
pausing, people_pleasing, present, processing, reacting,
receiving, reflecting, seeking_validation, self_doubt,
self_trusting, trusting_life, withdrawing
`;

    let inputBlock = "";

    if (image_base64) {

      inputBlock = `
You are analyzing an IMAGE.
Describe briefly what is happening visually.
Then infer the emotional state and behaviours.
`;

    } else if (audio_base64) {

      inputBlock = `
You are analyzing AUDIO.
Transcribe briefly what is being said.
Then infer emotional meaning and behaviours.
`;

    } else {

      inputBlock = `
You are analyzing TEXT.
Text: ${text || "none"}
`;
    }

    const prompt = `
Return ONLY valid JSON. No explanation.

{
  "text": "interpreted meaning",
  "emotions": ["sad"],
  "behaviours": ["withdrawing"],
  "polarity": 0,
  "intensity": 0
}

Interpret the underlying state, not just surface words.

Use ONLY these emotion IDs:
${EMOTIONS}

Use ONLY these behaviour IDs:
${BEHAVIOURS}

User-selected emotions:
${emotions?.join(", ") || "none"}

${inputBlock}
`;

    const aiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${OPENAI_API_KEY}`,
        },

        body: JSON.stringify({

          model:
            "gpt-4o-mini",

          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],

          temperature: 0,

          response_format: {
            type: "json_object",
          },
        }),
      }
    );

    const data =
      await aiRes.json();

    if (!aiRes.ok) {

      console.error(
        "❌ OPENAI ERROR:",
        data
      );

      return new Response(

        JSON.stringify({
          error:
            "OpenAI failed",
        }),

        {
          status: 500,
          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );
    }

    const raw =
      data?.choices?.[0]
        ?.message?.content;

    let parsed: any = {};

    try {

      parsed =
        JSON.parse(raw);

    } catch {

      console.error(
        "❌ JSON PARSE ERROR:",
        raw
      );

      parsed = {};
    }

    const normalize = (
      arr?: string[]
    ) =>

      (arr || []).map(
        (x) =>
          x
            ?.toLowerCase()
            .trim()
      );

    const validEmotionList =

      EMOTIONS

        .split(",")

        .map((e) =>
          e.trim()
        );

    const validBehaviourList =

      BEHAVIOURS

        .split(",")

        .map((b) =>
          b.trim()
        );

    parsed.emotions =

      normalize(
        parsed.emotions
      ).filter((e) =>
        validEmotionList.includes(
          e
        )
      );

    parsed.behaviours =

      normalize(
        parsed.behaviours
      ).filter((b) =>
        validBehaviourList.includes(
          b
        )
      );

    parsed.text =
      parsed.text ||
      text ||
      "";

    console.log(
      "🔥 FINAL AI OUTPUT:",
      parsed
    );

    return new Response(

      JSON.stringify(parsed),

      {
        headers: {
          "Content-Type":
            "application/json",
        },
      }
    );

  } catch (error) {

    console.error(
      "❌ INTERPRET ERROR:",
      error
    );

    return new Response(

      JSON.stringify({
        error: "fail",
      }),

      {
        status: 500,
        headers: {
          "Content-Type":
            "application/json",
        },
      }
    );
  }
});