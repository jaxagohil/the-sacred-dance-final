// /lib/ai/ingestImage.ts
import {
  extractReflectionData,
} from "./extractReflectionData";

// --------------------------------------------------
// 👁 INGEST IMAGE
// --------------------------------------------------

export async function ingestImage(
  imageUrl: string
) {

  try {

    /*
     * --------------------------------------------------
     * 👁 CALL VISION API
     * --------------------------------------------------
     */

const response =
  await fetch(
    "https://ezhqfbedncqrajfhsqhp.supabase.co/functions/v1/vision",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        imageUrl,
      }),
    }
  );

  console.log(
  "👁 VISION STATUS",
  response.status
);
    /*
     * --------------------------------------------------
     * 📦 RAW RESPONSE
     * --------------------------------------------------
     */

    const raw =
      await response.text();

    console.log(
      "👁 RAW VISION RESPONSE",
      raw
    );

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
        "❌ Vision response was not JSON"
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
        "❌ VISION API ERROR",
        result
      );

      return null;
    }

    /*
     * --------------------------------------------------
     * 🪞 OBSERVATIONS
     * --------------------------------------------------
     */

    const observations =

      result
        ?.observations || "";

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

  } catch (error) {

    console.log(
      "❌ INGEST IMAGE ERROR",
      error
    );

    return null;
  }
}