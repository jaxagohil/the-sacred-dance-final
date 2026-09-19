import OpenAI from "openai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-retry-count, traceparent, tracestate, baggage",
  "Access-Control-Allow-Methods":
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
};

const openai = new OpenAI({
  apiKey:
    Deno.env.get(
      "OPENAI_API_KEY"
    )!,
});

Deno.serve(async (req) => {

    if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

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

const raw =
  completion
    .choices?.[0]
    ?.message
    ?.content || "";

return Response.json(
  {
    text: raw,
  },
  {
    headers: corsHeaders,
  }
);

  } catch (error) {

    console.error(error);

    return Response.json(
      {
        error:
          String(error),
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});