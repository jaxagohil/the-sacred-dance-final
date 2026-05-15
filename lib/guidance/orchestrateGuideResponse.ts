// /lib/guidance/orchestrateGuideResponse.ts

import {
  generateAIResponse,
} from "../ai/generateAIResponse";

import {
  retrieveSymbolicField,
} from "./retrieveSymbolicField";

import {
  buildUserContext,
} from "../context/buildUserContext";

type GuideType =
  | "guide_heart"
  | "guide_structure"
  | "guide_cosmic";

interface OrchestrateGuideResponseParams {

  userId: string;

  message: string;

  language?: string;

  guide: GuideType;
}

function buildAcknowledgement(
  message: string
) {

  if (!message?.trim()) {

    return "";
  }

  return `
The guide should first acknowledge
the emotional reality
of the user's current message
before expanding into deeper reflection.

The response should feel continuous,
relational,
and aware of the ongoing emotional field.
`;
}

export async function orchestrateGuideResponse({

  userId,

  message,

  language = "en",

  guide,

}: OrchestrateGuideResponseParams) {

  try {

    /*
     * ---------------------------------------------------------
     * 🌌 BUILD LIVING FIELD
     * ---------------------------------------------------------
     */

const userField =
  await buildUserContext({

    userId,

    source:
      "guidance",
  });

    /*
     * ---------------------------------------------------------
     * 🧿 SYMBOLIC FIELD
     * ---------------------------------------------------------
     */

    const symbolicField =
      await retrieveSymbolicField({

        userField,

        message,

        guide,
      });

    /*
     * ---------------------------------------------------------
     * 🌊 ACKNOWLEDGEMENT
     * ---------------------------------------------------------
     */

    const acknowledgement =
      buildAcknowledgement(
        message
      );

    /*
     * ---------------------------------------------------------
     * ✨ GENERATE RESPONSE
     * ---------------------------------------------------------
     */

    const response =
      await generateAIResponse({

        type:
          "guide",

        /*
         * ---------------------------------------------------
         * 🌌 CONTEXT
         * ---------------------------------------------------
         */

        context: {

          /*
           * -------------------------------------------------
           * 🌊 LIVING USER FIELD
           * -------------------------------------------------
           */

          user:
            userField,

          /*
           * -------------------------------------------------
           * 🧿 SYMBOLIC FIELD
           * -------------------------------------------------
           */

          symbolic:
            symbolicField,
        },

        /*
         * ---------------------------------------------------
         * ✨ DATA
         * ---------------------------------------------------
         */

        data: {

          /*
           * -------------------------------------------------
           * 🌍 LANGUAGE
           * -------------------------------------------------
           */

          language,

          languageContext:

            userField?.language ||

            {},

          /*
           * -------------------------------------------------
           * 🪞 GUIDE
           * -------------------------------------------------
           */

          guide,

          /*
           * -------------------------------------------------
           * 💬 USER MESSAGE
           * -------------------------------------------------
           */

          message,

          /*
           * -------------------------------------------------
           * 🌊 ACKNOWLEDGEMENT
           * -------------------------------------------------
           */

          acknowledgement,

          /*
           * -------------------------------------------------
           * 🌌 USER FIELD
           * -------------------------------------------------
           */

          userContext:
            userField,

          /*
           * -------------------------------------------------
           * 🧿 SYMBOLIC FIELD
           * -------------------------------------------------
           */

          symbolicField,
        },
      });

    /*
     * ---------------------------------------------------------
     * 🌸 RETURN
     * ---------------------------------------------------------
     */

    return {

      response,

      userField,

      symbolicField,
    };

  } catch (e) {

    console.error(
      "❌ orchestrateGuideResponse:",
      e
    );

    return {

      response:
        "Something important is moving here.",

      userField:
        null,

      symbolicField:
        null,
    };
  }
}