import OpenAI from "openai";

const openai = new OpenAI({
  apiKey:
    Deno.env.get(
      "OPENAI_API_KEY"
    )!,
});

Deno.serve(async (req) => {

  try {

    const {
      prompt,
    } = await req.json();

    const completion =
      await openai.chat.completions.create({

        model:
          "gpt-4.1-mini",

        temperature:
          0.7,

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