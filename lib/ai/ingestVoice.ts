// /lib/ai/ingestVoice.ts

import {
    extractReflectionData,
} from "./extractReflectionData";

export async function ingestVoice(
  audioUri: string
) {

  /*
   * --------------------------------------------------
   * 🎙 BUILD FORM DATA
   * --------------------------------------------------
   */

  const formData =
    new FormData();

  formData.append(
    "file",
    {
      uri: audioUri,

      name:
        "reflection.m4a",

      type:
        "audio/m4a",
    } as any
  );

  formData.append(
    "model",
    "gpt-4o-mini-transcribe"
  );

  /*
   * --------------------------------------------------
   * 🧠 TRANSCRIBE
   * --------------------------------------------------
   */

  const response =
    await fetch(

      "https://api.openai.com/v1/audio/transcriptions",

      {

        method: "POST",

        headers: {

          Authorization:
            `Bearer ${process.env.OPENAI_API_KEY}`,
        },

        body: formData,
      }
    );

  const transcription =
    await response.json();

  const text =
    transcription?.text || "";

  /*
   * --------------------------------------------------
   * 🪞 EXTRACT REFLECTION DATA
   * --------------------------------------------------
   */

  const extraction =
    await extractReflectionData(
      text
    );

  /*
   * --------------------------------------------------
   * 🌌 RETURN
   * --------------------------------------------------
   */

  return {

    source:
      "voice",

    reflection:
      text,

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