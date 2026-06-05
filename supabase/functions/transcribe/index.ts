import OpenAI from "https://deno.land/x/openai@v4.69.0/mod.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get(
    "OPENAI_API_KEY"
  )!,
});

Deno.serve(async (req) => {

  try {

    const formData =
      await req.formData();

    const file =
      formData.get(
        "file"
      ) as File;

    if (!file) {

      return Response.json(
        {
          error:
            "Missing audio file",
        },
        {
          status: 400,
        }
      );
    }

    const transcription =
      await openai.audio
        .transcriptions.create({

          file,

          model:
            "gpt-4o-mini-transcribe",
        });

    return Response.json({

      text:
        transcription.text || "",
    });

  } catch (error) {

    console.error(
      error
    );

    return Response.json(
      {
        error:
          "Transcription failed",
      },
      {
        status: 500,
      }
    );
  }
});