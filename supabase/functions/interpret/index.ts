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
    .select(`
      id,
      statement,
      shadow_meaning,
      integrated_meaning,
      nervous_system_need,
      mirror_question,
      integration_step,
      embodiment
    `);

const { data: lensRows } =
  await supabase
    .from("lens_keywords")
    .select(`
      normalized_keyword,
      category,
      emotional_meaning,
      symbolic_meaning
    `);    

const BEHAVIOUR_CONTEXT =
  (behaviourRows || [])

    .map((b) => `

Behaviour ID:
${b.id}

Statement:
${b.statement || ""}

Shadow Meaning:
${b.shadow_meaning || ""}

Integrated Meaning:
${b.integrated_meaning || ""}

Nervous System Need:
${b.nervous_system_need || ""}

Mirror Question:
${b.mirror_question || ""}

Integration Step:
${b.integration_step || ""}

Embodiment:
${b.embodiment || ""}

`)
.join("\n");  

const LENS_CONTEXT =
  (lensRows || [])
    .map((l) => `

Concept:
${l.normalized_keyword}

Category:
${l.category}

Emotional Meaning:
${l.emotional_meaning || ""}

Symbolic Meaning:
${l.symbolic_meaning || ""}

`)
.join("\n");

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

Every reflection contains behavioural movement.

A behaviour represents how awareness,
attention, energy, connection,
protection, responsibility,
processing or engagement is being expressed.

Even simple observations contain behaviour.

Never return an empty behaviours array.

Select the closest valid behaviour
from the provided behaviour registry.

Focus on what is happening in the moment,
not simply the objects present.

Return:

- emotions
- behaviours
- people
- places
- things

People:

People, relationships,
family members,
partners, former partners,
friends, mentors,
teachers, healers,
guides, ancestors,
children, loved ones,
significant figures,
or people receiving
meaningful attention.

People may be physically present,
remembered, missed,
loved, avoided,
dreamed about,
longed for,
in conflict with,
inspired by,
supported by,
or emotionally significant.

Return only people that appear
symbolically, emotionally,
relationally or behaviourally
relevant to the reflection.

Places:

Places, environments,
buildings, homes,
rooms, cities,
towns, countries,
regions, workplaces,
schools, places of worship,
healing spaces,
natural environments,
mountains, lakes,
oceans, rivers,
forests, parks,
gardens, beaches,
or locations receiving
meaningful attention.

Places may be physical,
remembered, imagined,
dreamed of, longed for,
visited, avoided,
or emotionally significant.

Return only places that
appear symbolically,
emotionally or behaviourally
relevant to the reflection.

Things:

Things are meaningful concepts,
symbols, values, intentions,
beliefs, emotions, memories,
dreams or experiences
receiving attention.

A Thing does not need
to be physical.

Use the Concept Registry
to identify the closest concepts.

If an emotion, belief,
memory, intention,
experience or symbol
represents the focus
of attention,
it may also be returned
as a Thing.

Prefer concepts from the
Concept Registry rather
than inventing new concepts.

If a reflection contains only emotions,
thoughts or inner experiences,
the corresponding Things should still
be returned.

Do not list every object.

Return only people, places
and things that appear
emotionally, behaviourally
or symbolically relevant
to the present moment.

When analysing childhood signals,
return symbolic concepts as Things.

Common symbolic childhood concepts:

safety
protection
belonging
visibility
trust
connection
love
acceptance
criticism
rejection

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

Every reflection contains behavioural movement.

A behaviour represents how awareness,
attention, energy, connection,
protection, responsibility,
processing or engagement is being expressed.

Even simple observations contain behaviour.

Never return an empty behaviours array.

Select the closest valid behaviour
from the provided behaviour registry.

Return:

- emotions
- behaviours
- people
- places
- things

People:

People, relationships,
family members,
partners, former partners,
friends, mentors,
teachers, healers,
guides, ancestors,
children, loved ones,
significant figures,
or people receiving
meaningful attention.

People may be physically present,
remembered, missed,
loved, avoided,
dreamed about,
longed for,
in conflict with,
inspired by,
supported by,
or emotionally significant.

Return only people that appear
symbolically, emotionally,
relationally or behaviourally
relevant to the reflection.

Places:

Places, environments,
buildings, homes,
rooms, cities,
towns, countries,
regions, workplaces,
schools, places of worship,
healing spaces,
natural environments,
mountains, lakes,
oceans, rivers,
forests, parks,
gardens, beaches,
or locations receiving
meaningful attention.

Places may be physical,
remembered, imagined,
dreamed of, longed for,
visited, avoided,
or emotionally significant.

Return only places that
appear symbolically,
emotionally or behaviourally
relevant to the reflection.

Things:

Things are meaningful concepts,
symbols, values, intentions,
beliefs, emotions, memories,
dreams or experiences
receiving attention.

A Thing does not need
to be physical.

Use the Concept Registry
to identify the closest concepts.

If an emotion, belief,
memory, intention,
experience or symbol
represents the focus
of attention,
it may also be returned
as a Thing.

Prefer concepts from the
Concept Registry rather
than inventing new concepts.

If a reflection contains only emotions,
thoughts or inner experiences,
the corresponding Things should still
be returned.

Do not list every object.

Return only people, places
and things that appear
emotionally, behaviourally
or symbolically relevant
to the present moment.

When analysing childhood signals,
return symbolic concepts as Things.

Common symbolic childhood concepts:

safety
protection
belonging
visibility
trust
connection
love
acceptance
criticism
rejection

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

Every reflection contains behavioural movement.

A behaviour represents how awareness,
attention, energy, connection,
protection, responsibility,
processing or engagement is being expressed.

Even simple observations contain behaviour.

Never return an empty behaviours array.

Select the closest valid behaviour
from the provided behaviour registry.

Return:

- emotions
- behaviours
- people
- places
- things

People:

People, relationships,
family members,
partners, former partners,
friends, mentors,
teachers, healers,
guides, ancestors,
children, loved ones,
significant figures,
or people receiving
meaningful attention.

People may be physically present,
remembered, missed,
loved, avoided,
dreamed about,
longed for,
in conflict with,
inspired by,
supported by,
or emotionally significant.

Return only people that appear
symbolically, emotionally,
relationally or behaviourally
relevant to the reflection.

Places:

Places, environments,
buildings, homes,
rooms, cities,
towns, countries,
regions, workplaces,
schools, places of worship,
healing spaces,
natural environments,
mountains, lakes,
oceans, rivers,
forests, parks,
gardens, beaches,
or locations receiving
meaningful attention.

Places may be physical,
remembered, imagined,
dreamed of, longed for,
visited, avoided,
or emotionally significant.

Return only places that
appear symbolically,
emotionally or behaviourally
relevant to the reflection.

Things:

Things are meaningful concepts,
symbols, values, intentions,
beliefs, emotions, memories,
dreams or experiences
receiving attention.

A Thing does not need
to be physical.

Use the Concept Registry
to identify the closest concepts.

If an emotion, belief,
memory, intention,
experience or symbol
represents the focus
of attention,
it may also be returned
as a Thing.

Prefer concepts from the
Concept Registry rather
than inventing new concepts.

If a reflection contains only emotions,
thoughts or inner experiences,
the corresponding Things should still
be returned.

Do not list every object.

Return only people, places
and things that appear
emotionally, behaviourally
or symbolically relevant
to the present moment.

When analysing childhood signals,
return symbolic concepts as Things.

Common symbolic childhood concepts:

safety
protection
belonging
visibility
trust
connection
love
acceptance
criticism
rejection

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

Behaviour Registry:

${BEHAVIOUR_CONTEXT}

Use the registry descriptions,
shadow meanings,
integrated meanings,
nervous system needs,
mirror questions,
integration steps
and embodiments
to determine the closest behaviour.

Do not rely solely on behaviour IDs.

Behaviours are mandatory.

Every reflection contains behavioural movement.

A behaviour represents how attention,
energy,
awareness,
care,
connection,
protection,
responsibility,
receiving,
expression,
processing,
or engagement
is being expressed.

Choose at least one behaviour.

Every reflection contains behavioural movement.

If uncertainty exists,
select the closest behaviour
rather than returning none.

Do not invent new behaviours.

Do not return an empty behaviours array.

If multiple behaviours are possible,
select the one most strongly supported
by the reflection.

Behaviours are mandatory.

Do not return an empty behaviours array.

Concept Registry:

${LENS_CONTEXT}

Things represent what the reflection
is giving attention to.

A Thing is usually a concept,
value, belief, need, intention,
emotion, memory, symbol,
relationship dynamic,
or experience.

Things are NOT limited to
physical objects.

Every reflection usually contains
at least one Thing.

If no people or places are present,
identify the concepts receiving
the person's attention.

Return those concepts as Things.

Use the Concept Registry to choose
the closest matching concepts.

Prefer registry concepts rather than
inventing new ones.

Only return an empty Things array
when no meaningful concept can
reasonably be identified.

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

console.log(
  "🧠 FULL PROMPT:",
  prompt
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

  console.log(
    "🎯 RAW AI BEHAVIOURS:",
    parsed?.behaviours
  );  

} catch {

  console.error(
    "❌ JSON PARSE ERROR:",
    raw
  );

  parsed = {};
}

const normalize = (
  arr?: any[]
) =>

  (arr || [])

    .map((x) => {

      if (typeof x === "string") {

        return x;
      }

      return x?.id;
    })

    .filter(Boolean)

    .map((x) =>

      x
        .toLowerCase()
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

      if (!parsed.behaviours.length) {

  console.warn(
    "⚠️ NO VALID BEHAVIOUR RETURNED"
  );

  parsed.behaviours = [
    "intuitive"
  ];
}

console.log(
  "🎯 FINAL BEHAVIOURS:",
  parsed.behaviours
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