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
 * 🌌 ORCHESTRATION AGENT
 * --------------------------------------------------------
 *
 * The Orchestration Agent determines how the Guides
 * move with one another inside the Living Field.
 *
 * It does NOT write the Guide dialogue.
 * It decides:
 *
 * - who should open
 * - who should respond
 * - whether another Guide should enter
 * - whether something should remain unresolved
 * - what is emerging across the field
 *
 * The existing orchestration renderer remains responsible
 * for the actual Guide language.
 *
 * --------------------------------------------------------
 */

export const orchestrationAgent = async ({

  alignmentContext = {},

  orchestrationField = {},

  emergenceMemory = {},

  activePatterns = [],

  activeChakras = [],

  manifestations = [],

  sacredPrinciples = [],

  sacredPressures = [],

  selectedGuide = GUIDE_TYPES.COSMIC,

  language = "en",

}: any) => {

  const workflow =
    getAlignmentWorkflow(
      "orchestration"
    );

  /*
   * ------------------------------------------------------
   * 🌍 LIVING WORLD
   * ------------------------------------------------------
   *
   * Keep this deliberately compact.
   * The full Mirror World is already available to the
   * orchestration renderer.
   *
   * The Agent needs enough reality to decide what deserves
   * attention — not the entire raw database.
   */

  const mirror =
    alignmentContext?.mirrorContext || {};

const compactList = (
  items: any[],
  maxItems = 8,
  maxChars = 1200
) =>
  (items || [])
    .slice(0, maxItems)
    .map((item: any) => {
      try {
        return JSON.stringify(item)
          .slice(0, maxChars);
      } catch {
        return "";
      }
    })
    .filter(Boolean);

const fieldContext = {

  current:
    alignmentContext?.mirrorContext?.current || {},

  people:
    compactList(
      alignmentContext?.mirrorContext?.people
    ),

  places:
    compactList(
      alignmentContext?.mirrorContext?.places
    ),

  things:
    compactList(
      alignmentContext?.mirrorContext?.things
    ),

  expressionProfile:
    alignmentContext?.expressionProfile || {},

  spiralScores:
    alignmentContext?.spiralScores || {},

  activeLens:
    alignmentContext?.activeLens || "general",

  activePatterns,

  activeChakras,

  manifestations,

  sacredPrinciples,

  sacredPressures,

  emergence:
    emergenceMemory || {},

  orchestration: {

    foregroundGuide:
      orchestrationField?.foregroundGuide,

    orchestrationMode:
      orchestrationField?.orchestrationMode,

    emotionalField:
      orchestrationField?.emotionalField,

    spiralPhase:
      orchestrationField?.spiralPhase,

    nervousSystemState:
      orchestrationField?.nervousSystemState,

    readinessForInsight:
      orchestrationField?.readinessForInsight,

  },
};

  const guideOptions = [

    GUIDE_TYPES.HEART,

    GUIDE_TYPES.STRUCTURE,

    GUIDE_TYPES.COSMIC,

  ];


  /*
   * ------------------------------------------------------
   * 🌌 AGENT PROMPT
   * ------------------------------------------------------
   */

  const prompt = `

You are the Orchestration Agent for Sacred Dance.

You are not one of the Guides.

You are the intelligence that senses the Living Field
and determines how the Guides may move together within it.

The user is NOT being directly addressed.

The Guides are witnessing the field together.

Your role is to determine the next movement of the
conversation between the Guides.

The Guides may:

- open
- respond
- build upon another Guide
- challenge
- soften
- widen
- notice contradiction
- introduce another perspective
- use gentle humour
- pause
- leave something unresolved

Do not force equal participation.

Do not make every Guide speak.

One Guide may be enough.

Several Guides may be meaningful.

The conversation may also become quiet.

The purpose is not to produce more words.

The purpose is to make the Living Field clearer.

--------------------------------------------------------
🌍 THE LIVING WORLD
--------------------------------------------------------

The field may contain:

People
Places
Things
Signs
Mirrors
Feel
Think
Say
Do
Patterns
Behaviours
Chakras
Spiral movement
Emotional field
Nervous-system state
Emergence

Treat these as living context.

When something in People, Places, or Things is
meaningfully connected to what is emerging, the
conversation may bring that relationship into awareness.

Do NOT mention a person, place, or thing merely because
it exists in the data.

Do NOT manufacture symbolic meaning.

Use concrete field evidence when it genuinely matters.

--------------------------------------------------------
🌿 ALIGNMENT OS
--------------------------------------------------------

Feel → Think → Say → Do

Awareness → Observation → Reflection → Choice
→ Integration → Embodiment

The Guides are exploring what is emerging across this
spiral.

They are not coaching the user.

They are witnessing the field together.

--------------------------------------------------------
🌊 CURRENT WORKFLOW
--------------------------------------------------------

${workflow}

--------------------------------------------------------
🌌 AVAILABLE GUIDES
--------------------------------------------------------

${guideOptions.join(", ")}

Currently foregrounded Guide:

${selectedGuide}

The foregrounded Guide may have greater presence,
but does not automatically lead.

--------------------------------------------------------
🌍 CURRENT FIELD
--------------------------------------------------------

${JSON.stringify(
  fieldContext,
  null,
  2
)}

--------------------------------------------------------
🌌 DECISION
--------------------------------------------------------

Decide:

1. Which Guide should open, if any.

2. Which Guide should respond next, if another
   perspective genuinely adds something.

3. Whether a third Guide should enter.

4. The conversational order.

5. What the Guides are collectively noticing.

6. What is emerging across the Living Field.

7. Whether the moment calls for unresolved space
   rather than another statement.

8. What the field may be moving toward.

The conversation should feel like trusted companions
witnessing the same reality together.

Do not create three independent observations.

Do not force a round-robin.

Do not manufacture disagreement.

--------------------------------------------------------
OUTPUT
--------------------------------------------------------

Return ONLY valid JSON.

Return:

{
  "speakers": [
    {
      "guide": "heart | structure | cosmic",
      "role": "opening | response | widening | grounding | softening | challenge | humour | silence",
      "reason": "brief reason this Guide should enter"
    }
  ],
  "emergingField": "what the Guides are collectively noticing",
  "nextMovement": "what the field appears to be moving toward",
  "leaveUnresolved": false,
  "continueOrchestration": true
}

If the field calls for quiet witnessing,
return an empty speakers array.

Do not invent a Guide simply because output is expected.

`;
  

  try {

    const response =
      await generateAIResponse({

        type:
          "orchestration_agent",

        context: {

          directPrompt:
            prompt,

        },

        data: {

          language,

        },

      });


    let parsed =
      response;


    if (
      typeof parsed ===
      "string"
    ) {

      parsed =
        parsed

          .replace(
            /```json/gi,
            ""
          )

          .replace(
            /```/gi,
            ""
          )

          .trim();

      try {

        parsed =
          JSON.parse(parsed);

      } catch {

        return null;

      }

    }


    return parsed;

  } catch (error) {

    console.error(
      "❌ ORCHESTRATION AGENT ERROR",
      error
    );

    return null;

  }

};