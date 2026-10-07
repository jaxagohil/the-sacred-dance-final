// --------------------------------------------------
// 🌱 SCALE — GENERATE POSSIBILITIES
// --------------------------------------------------
//
// SCALE does not decide what the creation should become.
// It reflects the whole Creation Journey and offers
// contextual possibilities across:
// PEOPLE • PLACES • THINGS
//
// The human remains the authority.
// --------------------------------------------------

import {
  getCreationContext,
} from "../../getCreationContext";

import {
  generateAIResponse,
} from "../../../ai/generateAIResponse";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export type ScalePortal =
  | "people"
  | "places"
  | "things";

export type ScalePossibility = {
  id: string;
  portal: ScalePortal;
  text: string;
};

export type ScalePossibilities = {
  people: ScalePossibility[];
  places: ScalePossibility[];
  things: ScalePossibility[];
  reflection: string;
};

export interface GenerateScalePossibilitiesInput {
  userId: string;
  intentionId: string;
}

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const createId = (
  portal: ScalePortal,
  index: number
): string => {
  return `scale-${portal}-${index + 1}`;
};

const normalisePortal = (
  value: unknown,
  portal: ScalePortal
): ScalePossibility[] => {

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is {
        text?: unknown;
      } =>
        !!item &&
        typeof item === "object"
    )
    .map(
      (item, index) => ({
        id: createId(
          portal,
          index
        ),

        portal,

        text:
          typeof item.text === "string"
            ? item.text.trim()
            : "",
      })
    )
    .filter(
      item =>
        item.text.length > 0
    )
    .slice(0, 5);
};

// --------------------------------------------------
// FALLBACK
// --------------------------------------------------

const fallbackResponse =
  (): ScalePossibilities => ({
    people: [],
    places: [],
    things: [],
    reflection: "",
  });

// --------------------------------------------------
// MAIN
// --------------------------------------------------

export async function generateScalePossibilities(
  input: GenerateScalePossibilitiesInput
): Promise<ScalePossibilities> {

  const {
    userId,
    intentionId,
  } = input;

  if (!userId) {
    throw new Error(
      "generateScalePossibilities: userId is required."
    );
  }

  if (!intentionId) {
    throw new Error(
      "generateScalePossibilities: intentionId is required."
    );
  }

  // --------------------------------------------------
  // 1. LOAD THE COMPLETE CREATION CONTEXT
  // --------------------------------------------------

  const context =
    await getCreationContext({
      userId,
      intentionId,
      activeStage: "scale",
    });

    // --------------------------------------------------
// 1A. CURATE THE LIVING FIELD FOR SCALE
// --------------------------------------------------
//
// SCALE does not need the complete Living Field.
// It needs the parts that help reveal:
// - what is active
// - where energy is moving
// - what is expanding / contracting
// - where the creation may want to take form
//
// The full Living Field remains intact.
// We only send a relevant slice to this agent.
// --------------------------------------------------

const scaleLivingField = {
  creationPatterns:
    context.livingField?.creationPatterns ?? [],

  signals:
    Array.isArray(
      context.livingField?.signals
    )
      ? context.livingField.signals.slice(-8)
      : [],

  chakraState:
    context.livingField?.chakraState ?? null,

  spiralScores:
    context.livingField?.spiralScores ?? null,

  realityLayers:
    context.livingField?.realityLayers ?? null,

  cosmic:
    context.livingField?.cosmic ?? null,
};

  // --------------------------------------------------
  // 2. BUILD SCALE PROMPT
  // --------------------------------------------------

  const prompt = `
You are the SCALE intelligence inside
the Conscious Creating journey.

Your role is NOT to tell the human what to do.

Your role is to look at the creation as a whole
and gently reveal possibilities they may not
have considered.

The human remains the authority.

--------------------------------------------------
LANGUAGE AND EXPANSION
--------------------------------------------------

Use the CREATION, EXPRESSIONS, and MEANINGS as
the primary source for understanding what this
human is consciously creating.

EXPRESSIONS contain the human's own words,
phrases, desires, ideas, and ways of describing
what matters to them.

MEANINGS contain the meaning identified from those
expressions.

Preserve distinctive language from the human when
it carries something important about what they want.

Do not unnecessarily replace the human's language
with generic therapeutic, coaching, business, or
AI-generated terminology.

At the same time, SCALE is allowed to introduce
new possibilities, connections, and forms that the
human has not explicitly named.

Expand the thread rather than simply repeating it.

A possibility should feel connected to something
that is already present in the human's creation,
while opening the field beyond what they have
already consciously considered.

The expansion may come through PEOPLE, PLACES, or
THINGS, and may draw on relevant signals from the
Living Field.

Do not lose the original desire while expanding it.

--------------------------------------------------
CREATION JOURNEY
--------------------------------------------------

${JSON.stringify(
  context.creation ?? {},
  null,
  2
)}

--------------------------------------------------
JOURNEY
--------------------------------------------------

${JSON.stringify(
  context.journey ?? {},
  null,
  2
)}

--------------------------------------------------
LIVING FIELD — RELEVANT SCALE SIGNALS
--------------------------------------------------

${JSON.stringify(
  scaleLivingField,
  null,
  2
)}

--------------------------------------------------
EXPRESSIONS
--------------------------------------------------

${JSON.stringify(
  context.expressions ?? [],
  null,
  2
)}

--------------------------------------------------
MEANINGS
--------------------------------------------------

${JSON.stringify(
  context.meanings ?? [],
  null,
  2
)}

--------------------------------------------------
ARTIFACTS
--------------------------------------------------

${JSON.stringify(
  context.artifacts ?? [],
  null,
  2
)}

--------------------------------------------------
YOUR TASK
--------------------------------------------------

Generate contextual possibilities across three
dimensions:

PEOPLE
Who might this creation want to reach,
include, collaborate with, serve, or be held by?

PLACES
Where might this creation live, happen,
gather, travel, or take root?

THINGS
What forms, expressions, offerings, objects,
experiences, tools, or manifestations might
this creation become?

Generate up to 5 possibilities for each.

IMPORTANT FORMAT:

Each possibility must be a short headline, not a sentence or explanation.

Keep each one to approximately 2–6 words.

Examples:
- A Garden Home
- Sacred Dance Community
- Local Women
- Mountain Retreats
- Walking Together
- Conscious Living Space

Do not explain the possibility.
Do not add context.
Do not use full sentences.

The possibilities should:

- emerge from the creation itself
- reflect what has already been expressed
- use the language found in the human's expressions
  and meanings wherever appropriate
- expand from those expressions and meanings rather
  than inventing an unrelated direction
- be traceable to something present in the creation,
  its expressions, meanings, or relevant Living Field
  signals
- include possibilities the human may not have
  consciously considered
- be specific enough to imagine while remaining a short headline
- remain open rather than prescriptive
- honour the human's values and what matters
- avoid generic business-growth advice
- avoid assuming that "bigger" means better
- avoid inventing facts
- avoid turning every creation into a commercial product
- allow for intimate, local, relational or
  unconventional forms

IMPORTANT:

These are POSSIBILITIES, not recommendations.

Do not rank them.

Do not tell the human which one to choose.

Do not use language such as:
"You should..."
"The best option is..."
"You need to..."

Instead, phrase each possibility as an
invitation to consider.

--------------------------------------------------
OUTPUT
--------------------------------------------------

Return ONLY valid JSON.

Use exactly this structure:

{
  "people": [
    {
      "text": "..."
    }
  ],
  "places": [
    {
      "text": "..."
    }
  ],
  "things": [
    {
      "text": "..."
    }
  ],
  "reflection": "..."
}

The reflection should be one or two sentences
describing the pattern you notice across the
possibilities.

Do not include markdown.
Do not include commentary outside the JSON.
`;

  // --------------------------------------------------
  // 3. ASK EXISTING AI SERVICE
  // --------------------------------------------------

  try {

    const result =
      await generateAIResponse({
        type: "mirror",

        context: {
          directPrompt: prompt,
        },
      });

    // --------------------------------------------------
    // 4. PARSE RESPONSE
    // --------------------------------------------------

    let parsed: any = null;

    if (
      typeof result === "string"
    ) {

      try {
        parsed =
          JSON.parse(result);
      } catch {
        parsed = null;
      }

    } else if (
      result &&
      typeof result === "object"
    ) {

      parsed = result;
    }

    if (!parsed) {
      return fallbackResponse();
    }

    // --------------------------------------------------
    // 5. NORMALISE
    // --------------------------------------------------

    return {
      people:
        normalisePortal(
          parsed.people,
          "people"
        ),

      places:
        normalisePortal(
          parsed.places,
          "places"
        ),

      things:
        normalisePortal(
          parsed.things,
          "things"
        ),

      reflection:
        typeof parsed.reflection === "string"
          ? parsed.reflection.trim()
          : "",
    };

  } catch (error) {

    console.error(
      "❌ SCALE POSSIBILITY GENERATION ERROR:",
      error
    );

    return fallbackResponse();
  }
}