/* ======================================================== */
/* 🌌 GENERATE GUIDE TRANSMISSION */
/* ======================================================== */

import {
  generateAIResponse,
} from "../ai/generateAIResponse";

import {
  AlignmentOSContext,
} from "../alignment/buildAlignmentOSContext";

import {
  transmissionWrapper,
} from "../ai/prompts/guides/transmissionWrapper";

/* ======================================================== */
/* 🌊 TYPES */
/* ======================================================== */

type GenerateGuideTransmissionInput = {

  guide?: string;

  reflection?: string;

  recentMessages?: any[];

  alignmentContext: AlignmentOSContext;

  field?: any;

  orchestrationField?: any;

  transmissionDecision?: any;

  emergenceMemory?: any;

  language?: string;
};

/* ======================================================== */
/* 🌌 MAIN */
/* ======================================================== */

export async function generateGuideTransmission({

  guide = "cosmic",

  reflection = "",

  recentMessages = [],

alignmentContext,

  field,

  orchestrationField,

  transmissionDecision,

  emergenceMemory,

  language = "en",

}: GenerateGuideTransmissionInput) {

  try {

    /* ---------------------------------------------------- */
    /* 🚫 EMPTY */
    /* ---------------------------------------------------- */

    if (!reflection?.trim()) {

      return null;
    }

    /* ---------------------------------------------------- */
    /* 🌌 AI */
    /* ---------------------------------------------------- */

    console.log(
  "🌍 TRANSMISSION LANGUAGE:",
  language
);


const finalPrompt = `

${transmissionWrapper}

--------------------------------------------------
GUIDE
--------------------------------------------------

You are the Guide:

${guide}

You are speaking directly to the person.

Your role is not to analyse the Living Field again.

The Transmission Agent has already decided
what this moment needs.

Your task is simply to express that movement
naturally through the voice of this Guide.

--------------------------------------------------
TRANSMISSION DECISION
--------------------------------------------------

${JSON.stringify(
  transmissionDecision || {},
  null,
  2
)}

--------------------------------------------------
CURRENT REFLECTION
--------------------------------------------------

${reflection}

--------------------------------------------------
RECENT CONVERSATION
--------------------------------------------------

${recentMessages
  ?.slice(-8)
  ?.map(
    (message: any) =>
      `${message?.role}: ${
        message?.text ||
        message?.content ||
        ""
      }`
  )
  ?.join("\n") || "none"}

--------------------------------------------------
ORCHESTRATION
--------------------------------------------------

${JSON.stringify(
  orchestrationField || {},
  null,
  2
)}

--------------------------------------------------
EMERGENCE
--------------------------------------------------

${JSON.stringify(
  emergenceMemory || {},
  null,
  2
)}

--------------------------------------------------
LANGUAGE
--------------------------------------------------

${language}

--------------------------------------------------
HUMAN RESPONSE
--------------------------------------------------

Meet the person where they actually are.

The current reflection is the person's immediate
human moment.

Answer what is actually being asked or expressed.

If the person is asking a practical question,
give a practical answer.

If they are asking for suggestions,
offer suggestions.

If they are asking for information,
give information.

If they are asking for perspective,
offer perspective.

If they are sharing an emotion,
meet the emotion before looking for a deeper meaning.

If they are being playful,
allow the conversation to be playful.

Do not turn a practical question into a spiritual
or poetic reflection simply because the Living Field
contains deeper material.

Do not make every human moment symbolic.

The wider Living Field may enrich the response
when it is genuinely relevant, but it must not
replace the person's actual question.

--------------------------------------------------
TRANSMISSION DECISION
--------------------------------------------------

Follow the Transmission Decision.

Do not redo the orchestration.

Do not analyse the Living Field again.

Do not introduce a new lesson,
pattern, question, or insight
unless the Transmission Decision calls for it.

Match the response mode appropriately.

If the decision calls for a brief response,
be brief.

If it calls for presence,
be present.

If it calls for a question,
ask only the question that belongs
to this moment.

If it calls for silence,
do not manufacture a response.

Speak naturally.

The person should feel that they are
in conversation with a Guide,
not receiving an AI-generated explanation.

Return only the Guide's response.

`;


    const result =

await generateAIResponse({

  type:
    "transmission",

  context: {

    directPrompt:
      finalPrompt,
  },

  data: {

    language,
  },
});

    console.log(
      "🌌 GUIDE TRANSMISSION RESULT",
      result
    );

    /* ---------------------------------------------------- */
    /* 🌊 CLEAN */
    /* ---------------------------------------------------- */

let text = (

  typeof result === "string"

    ? result

    : (

        result?.text

        || result?.response

        || result?.message

        || ""
      )

);

    text = text

      ?.replace?.(
        /```json/g,
        ""
      )

      ?.replace?.(
        /```/g,
        ""
      )

      ?.replace?.(
        /💬 AI RESPONSE:/g,
        ""
      )

      ?.trim?.();

    console.log(
      "✅ FINAL GUIDE TEXT",
      text
    );

    /* ---------------------------------------------------- */
    /* 🚫 EMPTY */
    /* ---------------------------------------------------- */

    if (!text) {

      return null;
    }

    /* ---------------------------------------------------- */
    /* ✅ DONE */
    /* ---------------------------------------------------- */

    return {

      guide,

      text,
    };

  } catch (error) {

    console.error(

      "❌ generateGuideTransmission error",

      error
    );

    return null;
  }
}