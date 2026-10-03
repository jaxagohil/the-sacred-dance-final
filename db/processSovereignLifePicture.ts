import { supabase } from "../services/supabase";

// --------------------------------------------------
// 🌌 PROCESS SOVEREIGN I — LIFE PICTURE
// --------------------------------------------------

type ProcessSovereignLifePictureInput = {

  userId: string;

  language?: string;

  text?: string;

  imageBase64?: string | null;
};

// --------------------------------------------------
// 🚀 MAIN
// --------------------------------------------------

export async function processSovereignLifePicture({

  userId,

  language = "en",

  text = "",

  imageBase64,

}: ProcessSovereignLifePictureInput) {

  try {

    // --------------------------------------------------
    // 🚫 NOTHING TO PROCESS
    // --------------------------------------------------

    if (
      !text?.trim() &&
      !imageBase64
    ) {

      return;

    }

    // --------------------------------------------------
    // 🧠 MODALITIES
    // --------------------------------------------------

    const modalities = {

      text:
        Boolean(
          text?.trim()
        ),

      image:
        Boolean(
          imageBase64
        ),

    };

    // --------------------------------------------------
    // 🌊 SIGNAL DEPTH
    // --------------------------------------------------

    let signalDepth = 2.5;

    if (
      modalities.text &&
      modalities.image
    ) {

      signalDepth = 3;

    }

    // --------------------------------------------------
    // 🌌 LIFE PICTURE REFLECTION
    // --------------------------------------------------

    const lifePictureReflection = `

A conscious Life Picture has been shared
through Sovereign I.

This Life Picture represents what the person
currently sees as meaningful, desired, possible,
important, or worth creating in their life.

It is a snapshot of their present perspective.

It should NOT automatically be treated as:

- fixed identity
- permanent truth
- prediction
- personality definition
- psychological diagnosis

Life Picture:

"${text || "No written Life Picture provided"}"
`;

    // --------------------------------------------------
    // ⚡ PROCESS THROUGH EXISTING PIPELINE
    // --------------------------------------------------

    const {
      data,
      error,
    } =
      await supabase.functions.invoke(
        "process-reflection",
        {
          body: {

            userId,

            language,

            source:
              "sovereign_i",

            baselineType:
              "life_picture",

            signalDepth,

            text:
              lifePictureReflection,

            emotions:
              [],

            metadata: {

              processing_layer:
                "sovereign_i.life_picture",

              generated_from:
                "sovereign_i",

              generated_at:
                new Date().toISOString(),

              life_picture:
                true,

              modalities,

              modality_count:
                Object.values(
                  modalities
                ).filter(Boolean).length,

              image_present:
                Boolean(imageBase64),

            },

          },
        }
      );

    // --------------------------------------------------
    // ❌ ERROR
    // --------------------------------------------------

    if (error) {

      console.error(
        "❌ Sovereign I Life Picture processing error",
        error
      );

      return;

    }

    // --------------------------------------------------
    // ✅ SUCCESS
    // --------------------------------------------------

    console.log(
      "✅ Sovereign I Life Picture processed",
      data
    );

    return data;

  } catch (error) {

    console.error(
      "❌ processSovereignLifePicture error",
      error
    );
  }
}