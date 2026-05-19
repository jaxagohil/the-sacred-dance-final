// /app/api/transcribe/route.ts

import OpenAI from "openai";

import {
  OPENAI_API_KEY,
} from "../../../lib/config";

const openai =
  new OpenAI({

    apiKey:
      OPENAI_API_KEY,
  });
  
export async function POST(
  req: Request
) {

  try {

    /*
     * --------------------------------------------------
     * 📦 FORM DATA
     * --------------------------------------------------
     */

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

    /*
     * --------------------------------------------------
     * 🎙 TRANSCRIBE
     * --------------------------------------------------
     */

    const transcription =
      await openai.audio
        .transcriptions.create({

          file,

          model:
            "gpt-4o-mini-transcribe",
        });

    /*
     * --------------------------------------------------
     * ✨ RESPONSE
     * --------------------------------------------------
     */

    return Response.json({

      text:
        transcription.text ||
        "",
    });

  } catch (error) {

    console.log(
      "❌ TRANSCRIBE ERROR",
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
}