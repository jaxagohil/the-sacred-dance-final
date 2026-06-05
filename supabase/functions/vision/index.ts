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
Observe the image.

Identify:
- emotional atmosphere
- body tension
- nervous system cues
- behavioural cues
- relational energy
- observable scene details

Do not interpret spiritually.
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
      error
    );

    return Response.json(

      {
        error:
          "Vision failed",
      },

      {
        status: 500,
      }
    );
  }
});