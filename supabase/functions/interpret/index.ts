import { serve } from "https://deno.land/std/http/server.ts";

import { createClient } from "https://esm.sh/@supabase/supabase-js";

const OPENAI_API_KEY =
  Deno.env.get(
    "OPENAI_API_KEY"
  )!;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);  

serve(async (req) => {

  try {

    const {
      text,
      emotions,
      image_base64,
      audio_base64,
    } = await req.json();

const { data: emotionRows } =
  await supabase
    .from("emotions")
    .select("id");

const { data: behaviourRows } =
  await supabase
    .from("behaviours")
    .select("id");

const EMOTIONS =
  (emotionRows || [])
    .map((e) => e.id)
    .join(", ");

const BEHAVIOURS =
  (behaviourRows || [])
    .map((b) => b.id)
    .join(", ");

    console.log(
  "🧠 SIGNAL REGISTRY",
  {
    emotions:
      emotionRows?.length || 0,

    behaviours:
      behaviourRows?.length || 0,
  }
);

    let inputBlock = "";

    if (image_base64) {

  inputBlock = `
Interpret the present-moment state.

Focus on:
- emotions currently present
- behaviours currently expressed
- people receiving attention
- places carrying significance
- things carrying meaning

Do not diagnose.
Do not infer trauma.
Do not infer personality.
Do not infer childhood experiences.

Focus on what appears active in this moment.

Identify:

- emotional atmosphere
- behavioural movement
- signs of transition
- signs of organisation
- signs of accumulation
- signs of release
- signs of completion
- signs of preparation
- signs of connection
- signs of separation
- signs of engagement
- signs of withdrawal
- signs of grounding
- signs of responsibility

Focus on what is happening in the moment,
not simply the objects present.

Return:

- emotions
- behaviours
- people
- places
- things

People:
humans visible,
important relationships,
or people receiving attention.

Places:
environments that appear
emotionally or behaviourally relevant.

Things:
objects, possessions,
symbols, tools,
items receiving attention,
items involved in transition,
organisation, release,
care, creativity,
responsibility or meaning.

Do not list every object.

Return only people, places
and things that appear
emotionally, behaviourally
or symbolically relevant
to the present moment.
`;


    } else if (audio_base64) {

      inputBlock = `
You are analyzing a present-moment voice reflection.

Identify:

- emotional atmosphere
- behavioural movement
- signs of connection
- signs of withdrawal
- signs of responsibility
- signs of receiving
- signs of overgiving
- signs of self-trust
- signs of self-doubt
- signs of openness
- signs of protection
- signs of grounding
- signs of overwhelm
- signs of reflection
- signs of processing

Return:

- emotions
- behaviours
- people
- places
- things

People:
people receiving attention,
being discussed,
remembered,
loved,
avoided,
blamed,
missed,
supported
or connected to.

Places:
places mentioned,
remembered,
avoided,
longed for
or emotionally significant.

Things:
objects,
possessions,
symbols,
responsibilities,
projects,
commitments,
or meaningful items
receiving attention.

Focus on the present-moment meaning,
not literal transcription.
`;

    } else {

      inputBlock = `
You are analyzing a present-moment written reflection.

Identify:

- emotional atmosphere
- behavioural movement
- signs of connection
- signs of withdrawal
- signs of responsibility
- signs of receiving
- signs of overgiving
- signs of self-trust
- signs of self-doubt
- signs of openness
- signs of protection
- signs of grounding
- signs of overwhelm
- signs of reflection
- signs of processing

Return:

- emotions
- behaviours
- people
- places
- things

People:
people receiving attention,
being discussed,
remembered,
loved,
avoided,
blamed,
missed,
supported
or connected to.

Places:
places mentioned,
remembered,
avoided,
longed for
or emotionally significant.

Things:
objects,
possessions,
symbols,
responsibilities,
projects,
commitments,
or meaningful items
receiving attention.

Text:

${text || "none"}

Focus on the present-moment meaning,
not literal keywords.

`;
    }

    const prompt = `
Return ONLY valid JSON. No explanation.

{
  "text": "interpreted meaning",
  "emotions": [],
  "behaviours": [],
  "people": [],
  "places": [],
  "things": [],
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


console.log(
  "🧠 INTERPRET INPUT",
  {
    text,
    emotions,
    hasImage:
      Boolean(image_base64),
    hasAudio:
      Boolean(audio_base64),
  }
);

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

  console.log(
    "🔥 RAW INTERPRET OUTPUT",
    parsed
  );

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

parsed.people =
  parsed.people || [];

parsed.places =
  parsed.places || [];

parsed.things =
  parsed.things || [];

parsed.people =
  normalize(parsed.people);

parsed.places =
  normalize(parsed.places);

parsed.things =
  normalize(parsed.things);

    parsed.text =
      parsed.text ||
      text ||
      "";

    console.log(
      "🔥 FINAL AI OUTPUT:",
      parsed
    );

    console.log(
  "👥 PEOPLE:",
  parsed.people
);

console.log(
  "📍 PLACES:",
  parsed.places
);

console.log(
  "📦 THINGS:",
  parsed.things
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