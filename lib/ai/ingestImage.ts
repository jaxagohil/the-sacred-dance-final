// /lib/ai/ingestImage.ts

import {
  API_URL,
} from "../config";

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

        `${API_URL}/api/vision`,

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({

              imageUrl,
            }),
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