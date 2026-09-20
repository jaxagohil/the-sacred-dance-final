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

  orchestrationDecision?: any;

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

  orchestrationDecision,

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

    orchestrationDecision:
    orchestrationDecision || {},

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

The purpose of Transmission is not to make every
user input meaningful, profound, therapeutic, or
actionable.

First determine what the person's input actually is.

It may be:

- a substantive reflection
- a question
- a new subject
- a continuation of the existing thread
- a clarification
- agreement
- disagreement
- acknowledgement
- humour
- emotion
- completion
- or simply a small conversational signal.

Match the response to the size and nature of the input.

A very small input should normally receive a very small
response.

For example:

"agree"
"yes"
"exactly"
"okay"
"haha"
"🙂"

may call for:

- a smile
- a small acknowledgement
- a brief Guide response
- or no response beyond presence.

Do NOT expand a small conversational signal into a
reflection, interpretation, lesson, question, or
spiritual insight unless the Living Field and the
conversation clearly call for it.

Do not manufacture depth.

Do not manufacture a question.

Do not manufacture a movement.

Sometimes the most aligned transmission is simply:

🙂
🤍
✨
"Yes."
"I hear you."
"Exactly."

or silence.

The response should feel like a real conversation
between the person and the Guides, not like an AI
trying to produce content.

--------------------------------------------------
CONVERSATIONAL PROPORTION
--------------------------------------------------

Match the size of the response to the size of the
person's input.

Do not reward every message with a paragraph.

Short input → usually short transmission.

Long reflection → may warrant deeper transmission.

Simple acknowledgement → may warrant only a small
acknowledgement.

Agreement → may warrant a smile, a brief "yes", or
silence.

Do not interpret an acknowledgement as an invitation
to explain it.

Do not turn "agree", "yes", "exactly", "okay", "I know",
or similar small responses into a new teaching,
reflection, question, or insight.

Before selecting a Guide, ask:

"What does this moment actually need?"

The answer may be:

- nothing
- 🤍
- 🙂
- ✨
- one short sentence
- one Guide
- multiple Guides
- a question
- a deeper response

There is no requirement to produce substantial text.

A useful transmission can be extremely small.

If a small response is sufficient, prefer the small
response.

The next conversational movement is not necessarily
a question.

The movement may be:

- presence
- witnessing
- acknowledgement
- deepening
- clarification
- challenge
- invitation
- action
- pause

A question is only one possible form of invitation.

Do not create a question merely because the
conversation can continue.

If the person's reflection already expresses
clarity, completion, relief, grounded choice, or
simple presence, the next movement may be to
witness that movement rather than open another
layer.

The conversation may remain open without requiring
the person to answer anything.

The Guide does not need to extract another feeling,
insight, reflection, or decision.

Ask only when a genuine unresolved movement calls
for an invitation.

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
🌌 ORCHESTRATION DECISION
--------------------------------------------------

The Orchestration Agent has already examined the
Living Field and determined what is moving.

The Orchestration Decision is wider context,
not an instruction that must be followed.

The person's CURRENT reflection or question is the
immediate conversational signal and has priority.

The current input may:

- continue the existing orchestration
- deepen it
- shift it
- challenge it
- resolve something within it
- or introduce something entirely new

Determine which is happening before deciding
how the Guides should participate.

If the current reflection introduces a genuinely
different subject or movement, follow the current
reflection rather than forcing it back into the
existing orchestration.

Do not redo the orchestration simply because the
current reflection is related to it.

Your role is to determine what this particular
conversational moment needs now.

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
6. What movement this particular conversational moment calls for.
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
  "responseMode": "symbol | brief | normal | deep",
  "askQuestion": false,
  "silence": {
    "present": false,
    "symbol": null,
    "reason": ""
  },
  "emergingMovement": "what appears to be emerging",
  "nextAlignedMovement": "the movement this particular moment calls for",
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