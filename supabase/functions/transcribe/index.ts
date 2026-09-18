import OpenAI from "https://deno.land/x/openai@v4.69.0/mod.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get(
    "OPENAI_API_KEY"
  )!,
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-retry-count, traceparent, tracestate, baggage",
  "Access-Control-Allow-Methods":
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
};

Deno.serve(async (req) => {

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

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
          headers: corsHeaders,
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

return Response.json(
  {
    text:
      transcription.text || "",
  },
  {
    headers: corsHeaders,
  }
);

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
         headers: corsHeaders,
      }
    );
  }
});