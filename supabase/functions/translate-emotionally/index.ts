import OpenAI from "npm:openai@^4";

const openai = new OpenAI({
  apiKey:
    Deno.env.get(
      "OPENAI_API_KEY"
    )!,
});

Deno.serve(async (req) => {

  try {

    const {
      text,
      sourceLanguage,
      targetLanguage,
      emotionalContext,
    } = await req.json();

    const prompt = `

You are translating
a Sacred Dance connection message.

Translate naturally into ${targetLanguage}.

Preserve:
- emotional tone
- softness
- subtle symbolism
- conversational cadence
- nervous-system pacing
- relational warmth

Do not translate literally.

The message should feel
as if originally written
by a native speaker.

Keep the emotional frequency intact.

${emotionalContext
  ? `
Emotional Context:
${emotionalContext}
`
  : ""}

Message:
"${text}"

Return ONLY the translation.

`;

    const completion =
      await openai.chat.completions.create({

        model:
          "gpt-4.1-mini",

        temperature:
          0.4,

        messages: [
          {
            role:
              "user",

            content:
              prompt,
          },
        ],
      });

    return Response.json({

      text:
        completion
          .choices?.[0]
          ?.message
          ?.content || "",
    });

  } catch (error) {

    console.error(error);

    return Response.json(
      {
        error:
          String(error),
      },
      {
        status: 500,
      }
    );
  }
});