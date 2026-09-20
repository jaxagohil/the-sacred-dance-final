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

People, Places, and Things are not background metadata.

They are the living world of the story.

When a named person, place, or thing is materially involved
in what is unfolding, name it.

Prefer the concrete relationship over an abstract description.

For example:

- If a person's presence changes a choice, name the person.
- If a place is part of the choice, name the place.
- If something that happened between two people matters, name
  the people and the event.
- If a current pattern is repeating through a relationship,
  connect the pattern to the people involved.

Do not hide behind words such as "the field", "the dynamic",
"the relationship", or "the energy" when the actual people,
place, or thing can be named.

Do not mention entities simply to decorate the conversation.
Mention them because they are part of what is happening.

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
🌌 ORCHESTRATION LOGIC
--------------------------------------------------------

Before deciding who speaks, first understand what is
actually happening in the Living Field.

Work through these questions in order:

1. CONNECTION

What separate people, places, things, patterns,
behaviours, feelings, events or timings are meaningfully
connected right now?

Do not simply list them.

Identify the relationship between them.

For example:

- a person + a place
- a current choice + an old pattern
- something someone said + something they are doing
- a relationship + a tendency to settle
- an unresolved question + an approaching timing
- a previous movement + what is happening now

Only use connections supported by the field.

2. TENSION

What is unresolved or pulling in different directions?

Look especially for the difference between:

Feel → Think → Say → Do

and between:

Awareness → Observation → Reflection → Choice
→ Integration → Embodiment

Do not manufacture conflict.

If there is no meaningful tension, say so.

3. MOVEMENT

What has already started moving?

Something may be:

- changing
- repeating
- ending
- returning
- becoming visible
- becoming harder to avoid
- moving from unconscious pattern toward awareness
- moving from awareness toward choice

The important question is:

"What is already moving?"

Not:

"What should happen?"

4. TIMING

Is there something about timing that matters to this
movement?

Timing may include:

- something approaching
- something that has just happened
- a recurring cycle
- a threshold
- a relationship moment
- a cosmic or seasonal marker
- something already unfolding in the user's life

Timing is context.

Do not treat timing as proof that an event will happen.

Do not predict.

5. STORY MOVEMENT

Given the connections, tension, movement and timing:

What could naturally move the story forward?

This is where People, Places and Things become important.

The story does not move through abstract insight alone.

Ask:

- Is a person already present in the situation?
- Is a place affecting or reflecting the choice?
- Is another person changing the context?
- Is a thing, event, message, meeting, journey or circumstance
  creating movement?
- Is the user's relationship with a person, place or thing
  making an existing pattern visible?

Connect these only when the supplied field supports them.

The Guides are not predicting what will happen.

They are noticing where the existing People, Places and Things
create a possible next movement in the story.

For example:

If someone is uncertain whether to stay or leave,
and another significant person is already in the same place,
the orchestration should notice that relationship.

It should ask what that presence changes in the field.

It should NOT simply say:
"She is uncertain about belonging."

It should be able to see:
"She is in Srinagar. Shabir is in Srinagar. She is questioning
whether to stay. She has a known tendency to settle."

Those are not four separate facts.

They may be one developing story.

The Guides should explore that connection and determine
whether something is beginning to move because of it.

This does NOT mean giving advice to the user.

It means identifying the movement that the Guides are
beginning to witness.

The movement may be:

- a conversation
- a meeting
- a realization
- a choice becoming clearer
- someone approaching someone
- someone leaving or staying
- something being revealed
- a pattern becoming visible through a real-world event
- a relationship changing
- a decision being delayed
- a question remaining open

The movement can remain uncertain.

The Guides do not control the characters.

They witness what is becoming possible.

--------------------------------------------------------
🌌 GUIDE CONVERSATION
--------------------------------------------------------

Only AFTER identifying the above should you decide which
Guides need to speak.

The Guides are responding to the SAME field.

They are not producing separate interpretations.

A second Guide should enter only if they see something
the first Guide has not seen.

A third Guide should enter only if another perspective
changes, deepens, challenges or widens what is already
being noticed.

A Guide may disagree.

A Guide may simply notice.

A Guide may say very little.

A Guide may leave something unresolved.

The conversation should therefore feel like:

Guide sees something
→ another Guide connects it to something else
→ another Guide may challenge or widen it
→ something becomes clearer
→ the story has somewhere to move

--------------------------------------------------------
🌌 DECISION
--------------------------------------------------------

Decide:

1. What meaningful connections exist in the field.

2. What tension, if any, exists between them.

3. What is already moving.

4. Whether timing matters to that movement.

5. What the story may naturally be moving toward.

6. Which Guide needs to open because they see the first
   important connection.

7. Which Guide, if any, genuinely needs to respond.

8. Whether another Guide needs to enter.

9. Whether something should remain unresolved.

IMPORTANT:

Do not answer with abstract spiritual language unless
the field itself supports it.

Do not use words such as "energy", "timeline",
"integration", "alignment", "spiral", "field" or
"orchestration" merely because they sound appropriate.

Every meaningful statement should connect to something
observable in the supplied field.

The purpose of Orchestration is not to explain the user.

The purpose is to reveal relationships between what is
already happening so that the story can move.

--------------------------------------------------------

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
"emergingField": "the meaningful connection or relationship the Guides are collectively noticing",
"nextMovement": "the concrete story movement that may naturally emerge from that connection",
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