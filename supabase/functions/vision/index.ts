import OpenAI from "https://deno.land/x/openai@v4.69.0/mod.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get(
    "OPENAI_API_KEY"
  )!,
});

Deno.serve(async (req) => {

  try {

    const {
      imageUrl,
    } = await req.json();

    const result =
      await openai.chat.completions.create({

        model: "gpt-4o",

        messages: [

          {
            role: "user",

            content: [

              {
                type: "text",

text: `
Observe the image carefully.

Your role is to identify present-moment signals that may help a reflection system understand the emotional and behavioural atmosphere of this moment.

Focus on:

- emotional atmosphere
- behavioural movement
- nervous system cues (if reasonably observable)
- relational energy (if people are visible)
- signs of transition, change, organisation, accumulation, release, completion, creation, rest, connection, separation, openness, engagement, protection, withdrawal, grounding, responsibility, receptivity, or expression
- observable scene details that support these observations

Important:

- Reflect only what is reasonably supported by the image.
- Focus on the present moment.
- Describe emotional and behavioural signals suggested by the environment, activity, posture, facial expression, relationships, and visible context.
- Prioritise what appears to be happening over describing individual objects.

Do not:

- diagnose
- infer trauma
- infer personality
- infer childhood experiences
- assign patterns
- assign chakras
- provide spiritual interpretation
- provide advice

The goal is not to catalogue objects.

The goal is to reflect the emotional and behavioural signals that may be present in this moment.

Return observations in clear natural language.
`,
              },

              {
                type: "image_url",

                image_url: {
                  url:
                    imageUrl,
                },
              },
            ],
          },
        ],
      });

    return Response.json({

      observations:

        result
          .choices?.[0]
          ?.message
          ?.content || "",
    });

  } catch (error) {

  console.error(
    "VISION ERROR",
    error
  );

  return Response.json(
    {
      error:
        error instanceof Error
          ? error.message
          : String(error),
    },
    {
      status: 500,
    }
  );
}
});