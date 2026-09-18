// /lib/ai/ingestVoice.ts

import { Platform } from "react-native";

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

if (Platform.OS === "web") {

  const audioBlob =
    await fetch(audioUri)
      .then(response => response.blob());

      console.log(
  "🎙 WEB AUDIO DEBUG",
  audioBlob.type,
  audioBlob.size
);

  formData.append(
    "file",
    audioBlob,
    "reflection.webm"
  );

} else {

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

}

    /*
     * --------------------------------------------------
     * 🎙 TRANSCRIBE API
     * --------------------------------------------------
     */

    const response =
      await fetch(
  "https://ezhqfbedncqrajfhsqhp.supabase.co/functions/v1/transcribe",
  {
    method: "POST",
    body: formData,
  }
)

console.log(
  "🎙 TRANSCRIBE STATUS",
  response.status
);

    /*
     * --------------------------------------------------
     * 📦 RAW RESPONSE
     * --------------------------------------------------
     */

    const raw =
      await response.text();

    //console.log(  "🎙 RAW TRANSCRIBE RESPONSE",  raw);

    /*
     * --------------------------------------------------
     * 🧠 SAFE JSON PARSE
     * --------------------------------------------------
     */

    let result = null;

    try {

      result =
        JSON.parse(raw);

    } catch {

      console.log(
        "❌ Transcribe response was not JSON"
      );

      return null;
    }

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

const extraction = {
  emotions: [],
  behaviours: [],
  bodyResponses: [],
  observableScenes: [],
  copingStrategies: [],
  manifestations: [],
  nervousSystem: null,
};

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