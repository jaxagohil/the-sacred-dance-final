// /lib/ai/ingestImage.ts

import OpenAI from "openai";

import {
    extractReflectionData,
} from "./extractReflectionData";

const openai = new OpenAI({
  apiKey:
    process.env
      .OPENAI_API_KEY,
});

export async function ingestImage(
  imageUrl: string
) {

  /*
   * --------------------------------------------------
   * 👁 IMAGE OBSERVATION
   * --------------------------------------------------
   */

  const result =
    await openai.chat
      .completions.create({

        model:
          "gpt-4o",

        messages: [
          {
            role:
              "user",

            content: [

              {
                type:
                  "text",

                text: `

Observe the image.

Identify ONLY:
- visible emotional atmosphere
- visible body tension
- visible nervous system cues
- visible behavioural cues
- visible relational energy
- observable scene details

Do NOT interpret spiritually.

Return grounded observations only.

`,
              },

              {
                type:
                  "image_url",

                image_url: {
                  url:
                    imageUrl,
                },
              },
            ],
          },
        ],
      });

  /*
   * --------------------------------------------------
   * 🪞 RAW OBSERVATIONS
   * --------------------------------------------------
   */

  const observations =

    result
      ?.choices?.[0]
      ?.message?.content || "";

  /*
   * --------------------------------------------------
   * 🧠 STRUCTURED EXTRACTION
   * --------------------------------------------------
   */

  const extraction =
    await extractReflectionData(
      observations
    );

  /*
   * --------------------------------------------------
   * 🌌 RETURN
   * --------------------------------------------------
   */

  return {

    source:
      "image",

    reflection:
      observations,

    emotions:
      extraction?.emotions || [],

    behaviours:
      extraction?.behaviours || [],

    bodyResponses:
      extraction?.bodyResponses || [],

    observableScenes:
      extraction?.observableScenes || [],

    copingStrategies:
      extraction?.copingStrategies || [],

    manifestations:
      extraction?.manifestations || [],

    nervousSystem:
      extraction?.nervousSystem || null,
  };
}