/* ======================================================== */
/* 🌊 TRANSMISSION AGENT */
/* ======================================================== */

import {
    generateAIResponse,
} from "../generateAIResponse";

import {
    getAlignmentWorkflow,
} from "../../alignment/getAlignmentContent";

import {
    GUIDE_TYPES,
} from "../../../components/guidance/guideConfig";

/*
 * --------------------------------------------------------
 * 🌊 TYPES
 * --------------------------------------------------------
 */

type TransmissionAgentInput = {

  reflection: string;

  recentMessages?: any[];

  alignmentContext?: any;

  field?: any;

  orchestrationField?: any;

  emergenceMemory?: any;

  selectedGuide?: string;

  language?: string;
};

/*
 * --------------------------------------------------------
 * 🌊 TRANSMISSION AGENT
 * --------------------------------------------------------
 *
 * PURPOSE:
 *
 * Decide how the Living Field should enter
 * the next conversational movement.
 *
 * The agent does NOT write the Guide response.
 *
 * It decides:
 *
 * - which Guide(s) should participate
 * - what is emerging
 * - what movement the conversation is exploring
 * - whether another Guide perspective is useful
 *
 * The existing Guide transmission layer
 * remains responsible for language.
 *
 * --------------------------------------------------------
 */

export async function transmissionAgent({

  reflection,

  recentMessages = [],

  alignmentContext,

  field,

  orchestrationField,

  emergenceMemory,

  selectedGuide,

  language = "en",

}: TransmissionAgentInput) {

  try {

    if (!reflection?.trim()) {

      return null;
    }

    /*
     * ----------------------------------------------------
     * 🌊 WORKFLOW
     * ----------------------------------------------------
     */

    const workflow =
      getAlignmentWorkflow(
        "transmission"
      );

    /*
     * ----------------------------------------------------
     * 🌿 CONVERSATION
     * ----------------------------------------------------
     */

    const recentConversation =

      recentMessages
        ?.slice(-8)
        ?.map(
          (message: any) =>
            `${message?.role}: ${message?.text || message?.content || ""}`
        )
        ?.join("\n") || "";

    /*
     * ----------------------------------------------------
     * 🌌 FIELD
     * ----------------------------------------------------
     */

const fieldContext = {

  current:
    alignmentContext
      ?.mirrorContext
      ?.current || {},

  expressionProfile:
    alignmentContext
      ?.expressionProfile || {},

  spiralScores:
    alignmentContext
      ?.spiralScores || {},

  activeLens:
    alignmentContext
      ?.activeLens || "general",

  reflectionResult:
    field
      ?.reflectionResult || {},

  guidanceSignals:
    field
      ?.guidanceSignals || {},

  emergence:
    emergenceMemory || {},

  orchestration: {

    foregroundGuide:
      orchestrationField
        ?.foregroundGuide,

    orchestrationMode:
      orchestrationField
        ?.orchestrationMode,

    emotionalField:
      orchestrationField
        ?.emotionalField,

    readinessForInsight:
      orchestrationField
        ?.readinessForInsight,

  },

};

    /*
     * ----------------------------------------------------
     * 🌿 GUIDE OPTIONS
     * ----------------------------------------------------
     */

    const guideOptions = [

      GUIDE_TYPES.HEART,

      GUIDE_TYPES.STRUCTURE,

      GUIDE_TYPES.COSMIC,

    ];

    /*
     * ----------------------------------------------------
     * 🌊 AGENT PROMPT
     * ----------------------------------------------------
     */

    const prompt = `

You are the Transmission Agent for Sacred Dance.

Your role is to decide how the next conversational
movement should unfold.

You are NOT the Guide speaking to the user.

You are deciding which Guide or Guides should speak.

The available Guides are:

- heart
- structure
- cosmic

A Guide should participate only when that perspective
has something meaningful to add.

One Guide may respond.

More than one Guide may respond.

Do not force equal participation.

The user's reflection is the immediate conversational
signal.

The Living Field provides the wider context.

Use:

- Feel
- Think
- Say
- Do

alongside:

- patterns
- behaviours
- Spiral position
- Mirror context
- guidance signals
- emergence
- current orchestration

to understand what is actually moving.

The purpose is not to generate advice.

The purpose is to identify the next useful movement
toward greater awareness, coherence and embodiment.

Respect the Transmission workflow below.

--------------------------------------------------
TRANSMISSION WORKFLOW
--------------------------------------------------

${workflow}

--------------------------------------------------
AVAILABLE GUIDES
--------------------------------------------------

${JSON.stringify(
  guideOptions,
  null,
  2
)}

--------------------------------------------------
CURRENTLY SELECTED GUIDE
--------------------------------------------------

${selectedGuide || "none"}

--------------------------------------------------
RECENT CONVERSATION
--------------------------------------------------

${recentConversation || "none"}

--------------------------------------------------
CURRENT USER REFLECTION
--------------------------------------------------

${reflection}

--------------------------------------------------
LIVING FIELD
--------------------------------------------------

${JSON.stringify(
  fieldContext,
  null,
  2
)}

--------------------------------------------------
DECISION
--------------------------------------------------

Decide:

1. Which Guide or Guides should participate next.
2. The order in which they should participate.
3. Whether this moment calls for silence instead of a Guide response.
4. If silence is appropriate, whether a small presence symbol
   such as 🤍, 🙂, or ✨ would naturally support that silence.
5. What is emerging in the conversation.
6. What aligned movement the conversation may be approaching.
7. Whether the conversation should continue.

Silence is a valid and intentional response.

Do not select a Guide simply because a response is expected.

If silence is appropriate, return an empty speakers array.

Do not force an insight, question, interpretation, or advice
when the field is asking for space.

A Guide may be selected because they:

- illuminate something the current perspective misses
- notice a pattern or contradiction
- bring emotional truth
- bring grounded discernment
- widen perspective
- soften or deepen what has already been said
- help the user move from recognition toward choice,
  integration or embodiment

Do not select another Guide simply for variety.

Return ONLY valid JSON.

Use exactly this structure:

{
  "speakers": [
    {
      "guide": "heart | structure | cosmic",
      "reason": "brief reason this Guide should participate"
    }
  ],
  "silence": {
    "present": false,
    "symbol": null,
    "reason": ""
  },
  "emergingMovement": "what appears to be emerging",
  "nextAlignedMovement": "the movement the conversation may be approaching",
  "continueConversation": true
}

Language:

${language}

`;

    /*
     * ----------------------------------------------------
     * 🌌 ASK AI
     * ----------------------------------------------------
     */

    const result =

      await generateAIResponse({

        type:
          "transmission_agent",

        context: {

          directPrompt:
            prompt,

        },

        data: {

          language,

        },

      });

    /*
     * ----------------------------------------------------
     * 🧹 PARSE
     * ----------------------------------------------------
     */

    if (
      typeof result ===
      "object"
      && result !== null
    ) {

      return result;
    }

    if (
      typeof result ===
      "string"
    ) {

      const cleaned =
        result
          .replace(
            /```json/g,
            ""
          )
          .replace(
            /```/g,
            ""
          )
          .trim();

      try {

        return JSON.parse(
          cleaned
        );

      } catch (error) {

        console.error(
          "❌ TRANSMISSION AGENT JSON ERROR",
          error
        );

        return null;
      }
    }

    return null;

  } catch (error) {

    console.error(
      "❌ TRANSMISSION AGENT ERROR",
      error
    );

    return null;
  }
}