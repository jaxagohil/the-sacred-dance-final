// /lib/guidance/orchestration/generateOrchestrationConversation.ts

import {
  orchestrationAgent,
} from "../../ai/agents/orchestrationAgent";

import {
  GUIDE_TYPES,
} from "../../../components/guidance/guideConfig";

import {
  generateAIResponse,
} from "../../ai/generateAIResponse";

import {
  orchestrationWrapper,
} from "../../ai/prompts/guides/orchestrationWrapper";

import {
  buildFieldNarrative,
} from "./buildFieldNarrative";

import {
  getLanguageContext,
} from "../../i18n/getLanguageContext";

import {
  buildOrchestrationContext,
} from "../../context/buildOrchestrationContext";


import {
  buildGuidanceMirrorWorld,
} from "../context/buildGuidanceMirrorWorld";

/*
 * --------------------------------------------------------
 * 🌌 GENERATE ORCHESTRATION CONVERSATION
 * --------------------------------------------------------
 */

export const generateOrchestrationConversation = async ({

  alignmentContext = {},

  activePatterns = [],

  activeChakras = [],

  manifestations = [],

  selectedGuide =
    GUIDE_TYPES.COSMIC,

  resolvedContent = {},

  emergenceMemory = {},

  sacredPrinciples = [],

  sacredPressures = [],

  language = "en",

}: any) => {

  const {

  mirrorContext,

  entityLenses,

  expressionProfile,

  spiralScores,

  activeLens,

  cosmic,

    user,

} = alignmentContext;

  /*
   * --------------------------------------------------------
   * 🌊 CURRENT FIELD
   * --------------------------------------------------------
   */

  const current =

    mirrorContext?.current
    || {};

const languageContext =

  typeof language === "object"

    ? language

    : await getLanguageContext(
        language
      ); 

  /*
   * --------------------------------------------------------
   * 🌿 PRIMARY PATTERN
   * --------------------------------------------------------
   */

  const primaryPattern =

    activePatterns?.[0]
    || {};

  /*
   * --------------------------------------------------------
   * 🌌 FIELD CONTEXT
   * --------------------------------------------------------
   */

  const orchestrationField = {

    pattern:

      primaryPattern
        ?.name

      || primaryPattern
        ?.title

      || primaryPattern
        ?.mirror_theme

      || "emergence",

    higherPerspective:

      primaryPattern
        ?.higher_perspective

      || "",

    nervousSystemState:

      current
        ?.nervousSystemState

      || "regulated",

    spiralPhase:

      current
        ?.spiralPhase

      || "observing",

    emotionalField:

      current
        ?.emotionalField

      || "soft",

    symbolicTolerance:

      current
        ?.symbolicTolerance

      || 0.5,

    coherence:

      current
        ?.coherence

      || 0.5,

    openness:

      current
        ?.openness

      || 0.5,

people:
  mirrorContext
    ?.people || [],

places:
  mirrorContext
    ?.places || [],

things:
  mirrorContext
    ?.things || [],

manifestations,

    activeChakras,

    sacredPrinciples,

    sacredPressures,

    emergenceMemory,

    oracleCard:

      current
        ?.oracleCard

      || null,

    signs:

      mirrorContext
        ?.signs

      || [],

    selectedGuide,

    language,
  };

  /*
   * --------------------------------------------------------
   * 🌌 FIELD NARRATIVE
   * --------------------------------------------------------
   */

  const fieldNarrative =

    buildFieldNarrative({

      manifestations,

      emotionalField:
        orchestrationField.emotionalField,

      spiralPhase:
        orchestrationField.spiralPhase,

      nervousSystemState:
        orchestrationField.nervousSystemState,

      sacredPrinciples,

      mirrors:
        mirrorContext?.mirrors || [],

      people:
        orchestrationField.people,

      places:
        orchestrationField.places,
    });



/*
 * --------------------------------------------------------
 * 🌌 ORCHESTRATION CONTEXT
 * --------------------------------------------------------
 */

//console.log( "🪞 RAW PEOPLE LENS:", JSON.stringify(   mirrorContext?.lensContexts?.people,   null,   2));

//console.log( "🪞 RAW PLACES LENS:",  JSON.stringify(  mirrorContext?.lensContexts?.places,  null, 2 ));

//console.log(  "🪞 RAW THINGS LENS:",  JSON.stringify( mirrorContext?.lensContexts?.things,  null,  2  ));

const orchestrationContext =

  buildOrchestrationContext({

    manifestations,

    emotionalField:
      orchestrationField.emotionalField,

    spiralPhase:
      orchestrationField.spiralPhase,

    nervousSystemState:
      orchestrationField.nervousSystemState,

    sacredPrinciples,

    mirrors:
      mirrorContext?.mirrors || [],

    signs:
      mirrorContext?.signs || [],

    people:
      orchestrationField.people,

    places:
      orchestrationField.places,

    things:
      orchestrationField.things,

    lensContexts:
      mirrorContext?.lensContexts || {},
  });

  //console.log( "🌍 MY WORLD CONTEXT:",orchestrationContext);

  /*
   * --------------------------------------------------------
   * 🌊 BASE PROMPT
   * --------------------------------------------------------
   */

const mirrorWorld =

  buildGuidanceMirrorWorld({
    ...alignmentContext.mirrorContext,
    orchestrationContext,
  });

  //console.log( "🌍 MIRROR WORLD",JSON.stringify( mirrorWorld,  null, 2 ));

  /*
   * --------------------------------------------------------
   * 🌌 COMPACT ORCHESTRATION PROMPT
   * --------------------------------------------------------
   *
   * Orchestration does not need the full Guide prompt.
   *
   * The Agent has already examined the Living Field.
   * The conversation generator needs the actual world,
   * the orchestration context, and the Agent's decision.
   *
   * Keep this prompt deliberately small.
   * --------------------------------------------------------
   */

const userName =
  alignmentContext?.userContext?.name ||
  alignmentContext?.userContext?.full_name ||
  alignmentContext?.userContext?.display_name ||
  alignmentContext?.userContext?.profile?.name ||
  "";

  const orchestrationPrompt = `

${orchestrationWrapper}

--------------------------------------------------------
🌍 LIVING WORLD
--------------------------------------------------------

The person at the centre of this living story is:
${userName || "the person"}

When referring to this person, never call them "the user".
Use their name naturally when appropriate.

The following is the actual Living World available
to the Guides.

Do not invent people, places, things, events or
relationships that are not present here.

When a person, place or thing is materially involved
in what is unfolding, name it.

Prefer the concrete relationship over abstract language.

Do not hide behind phrases such as:
"the field"
"the dynamic"
"the relationship"
"the energy"

when the actual person, place or thing can be named.

LIVING WORLD:

${JSON.stringify(orchestrationContext, null, 2)}

--------------------------------------------------------
🌌 CURRENT ORCHESTRATION FIELD
--------------------------------------------------------

${JSON.stringify(orchestrationField, null, 2)}

--------------------------------------------------------
🌌 ORCHESTRATION
--------------------------------------------------------

The Orchestration Agent will determine the movement
of the story.

The Guides are not giving separate interpretations.

They are witnessing the same moment together.

They may notice different things, question one another,
challenge one another, connect events, recognise a pattern,
notice timing, or leave something unresolved.

The purpose is not to explain everything.

The purpose is to reveal what is connected,
what is moving, and what may move the story forward.

`;

  /*
   * --------------------------------------------------------
   * 🌌 LIVING ORCHESTRATION
   * --------------------------------------------------------
   */

  try {

  const agentDecision =
  await orchestrationAgent({

alignmentContext: {
  ...alignmentContext,

  mirrorContext: {
    ...alignmentContext.mirrorContext,

    orchestrationContext,
  },
},

    orchestrationField,

    emergenceMemory,

    activePatterns,

    activeChakras,

    manifestations,

    sacredPrinciples,

    sacredPressures,

    selectedGuide,

    language,
  });

console.log(
  "🌌 ORCHESTRATION AGENT DECISION",
  agentDecision
);  

const conversationPrompt = `

${orchestrationPrompt}

--------------------------------------------------------
🌌 ORCHESTRATION DECISION
--------------------------------------------------------

The Orchestration Agent has already witnessed the Living
Field and determined the movement of the story.

Use its decision as the internal direction for this
conversation.

${JSON.stringify(agentDecision, null, 2)}

Do not repeat the decision mechanically.

Let the Guides speak naturally from it.

The conversation must remain grounded in the actual
people, places, things, patterns and events contained
in the Living Field.

The Guides should reveal the connection and movement
through their conversation.

--------------------------------------------------------
🌌 LIVING ORCHESTRATION
--------------------------------------------------------

Generate one living conversation
between the Sacred Dance intelligences.

The conversation should emerge
from the whole Mirror World
and the current Alignment OS field.

Do not generate separate standalone reflections.

The intelligences are witnessing
the same living moment together.

Allow the movement itself to determine:
- who speaks
- who responds
- who interrupts
- who softens
- who challenges
- who widens
- when humour naturally appears
- when something is better left unresolved

The selected guide is:

${selectedGuide}

This guide may have greater presence
in the field,
but does not need to dominate
the conversation.

--------------------------------------------------------
🌍 LANGUAGE RULES
--------------------------------------------------------

Generate ALL output ONLY in:

${languageContext.native_name}

Never mix languages.

The conversation must feel:
naturally written,
emotionally native,
and culturally natural
in the requested language.

Do not translate literally.

Language Emotional Style:
${languageContext.emotional_style}

Directness:
${languageContext.directness}

Sentence Rhythm:
${languageContext.sentence_rhythm}

Warmth Style:
${languageContext.warmth_style}

Mystical Tolerance:
${languageContext.mystical_tolerance}

--------------------------------------------------------
OUTPUT
--------------------------------------------------------

Return ONLY valid JSON.

Return a JSON array.

Each item must contain:

{
  "guide": "heart | structure | cosmic",
  "role": "short movement label",
  "text": "short conversational fragment"
}

Do not include markdown.

`;

    /*
     * --------------------------------------------------------
     * 🌊 GENERATE COMPLETE CONVERSATION
     * --------------------------------------------------------
     */

    console.log("🌌 ORCHESTRATION PROMPT LENGTH:", conversationPrompt.length);

    const response =

      await generateAIResponse({

        type:
          "orchestration",

        context: {

          directPrompt:
            conversationPrompt,
        },

        data: {

          language,
        },
      });

    let parsed = response;

    /*
     * --------------------------------------------------------
     * 🌌 CLEAN
     * --------------------------------------------------------
     */

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

        return [];
      }
    }

    /*
     * --------------------------------------------------------
     * 🌿 NORMALISE
     * --------------------------------------------------------
     */

    const parsedFragments =

      Array.isArray(parsed)

        ? parsed

        : [parsed];

    const validGuides = [

      GUIDE_TYPES.HEART,

      GUIDE_TYPES.STRUCTURE,

      GUIDE_TYPES.COSMIC,
    ];

    const fragments =

      parsedFragments

        .filter(
          (item: any) =>
            item?.text
        )

        .map(
          (
            item: any,
            index: number
          ) => ({

            id:
              `orchestration_${index}`,

            guide:

              validGuides.includes(
                item?.guide
              )

                ? item.guide

                : selectedGuide,

            role:
              item?.role
              || "awareness",

            text:
              item?.text
                ?.trim?.(),

            cinematic:
              true,
          })
        );

    /*
     * --------------------------------------------------------
     * 🌌 RETURN
     * --------------------------------------------------------
     */

    return fragments;

  } catch (error) {

    console.log(
      "❌ orchestration generation failed",
      error
    );

    return [];
  }
};