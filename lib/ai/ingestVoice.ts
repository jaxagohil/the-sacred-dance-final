// /lib/ai/ingestVoice.ts

import {
  API_URL,
} from "../config";

import {
  extractReflectionData,
} from "./extractReflectionData";

// --------------------------------------------------
// 🎙 INGEST VOICE
// --------------------------------------------------

export async function ingestVoice(
  audioUri: string
) {

  try {

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

    /*
     * --------------------------------------------------
     * 🎙 TRANSCRIBE API
     * --------------------------------------------------
     */

    const response =
      await fetch(

        `${API_URL}/api/transcribe`,

        {

          method: "POST",

          body: formData,
        }
      );

    const result =
      await response.json();

    /*
     * --------------------------------------------------
     * ❌ API ERROR
     * --------------------------------------------------
     */

    if (!response.ok) {

      console.log(
        "❌ TRANSCRIBE API ERROR",
        result
      );

      return null;
    }

    /*
     * --------------------------------------------------
     * 🪞 TRANSCRIPTION
     * --------------------------------------------------
     */

    const text =
      result?.text || "";

    /*
     * --------------------------------------------------
     * 🧠 EXTRACT REFLECTION DATA
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

  } catch (error) {

    console.log(
      "❌ INGEST VOICE ERROR",
      error
    );

    return null;
  }
}