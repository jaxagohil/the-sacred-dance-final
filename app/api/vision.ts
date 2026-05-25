// /app/api/vision+api.ts

import OpenAI from "openai";

import {
  OPENAI_API_KEY,
} from "../../lib/config";

const openai =
  new OpenAI({

    apiKey:
      OPENAI_API_KEY,
  });

/*
 * --------------------------------------------------
 * 👁 VISION API
 * --------------------------------------------------
 */

export async function POST(
  req: Request
) {

  try {

    /*
     * --------------------------------------------------
     * 📦 BODY
     * --------------------------------------------------
     */

    const body =
      await req.json();

    const imageUrl =
      body?.imageUrl;

    if (!imageUrl) {

      return Response.json(

        {
          error:
            "Missing imageUrl",
        },

        {
          status: 400,
        }
      );
    }

    console.log(
      "👁 IMAGE RECEIVED"
    );

    /*
     * --------------------------------------------------
     * 👁 OBSERVE IMAGE
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

    console.log(
      "👁 VISION COMPLETE"
    );

    /*
     * --------------------------------------------------
     * ✨ RESPONSE
     * --------------------------------------------------
     */

    const observations =

      result
        ?.choices?.[0]
        ?.message?.content || "";

    return Response.json({

      observations,
    });

  } catch (error) {

    console.log(
      "❌ VISION ERROR",
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
}