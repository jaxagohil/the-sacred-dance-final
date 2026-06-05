// /lib/guidance/orchestration/generateOrchestrationConversation.ts

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
  cosmicGuide,
} from "../../guidance/guides/cosmicGuide";

import {
  heartGuide,
} from "../../guidance/guides/heartGuide";

import {
  structureGuide,
} from "../../guidance/guides/structureGuide";

import {
  getLanguageContext,
} from "../../i18n/getLanguageContext";

/*
 * --------------------------------------------------------
 * 🌌 GENERATE ORCHESTRATION CONVERSATION
 * --------------------------------------------------------
 */

export const generateOrchestrationConversation = async ({

  mirrorContext = {},

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

  const orchestrationContext =
    fieldNarrative;

  /*
   * --------------------------------------------------------
   * 🌊 BASE PROMPT
   * --------------------------------------------------------
   */

  const prompt = `

${orchestrationWrapper}

--------------------------------------------------------
🌊 LIVE FIELD
--------------------------------------------------------

${orchestrationContext}

${JSON.stringify({

  pattern:
    orchestrationField.pattern,

  emotionalField:
    orchestrationField.emotionalField,

  nervousSystemState:
    orchestrationField.nervousSystemState,

  spiralPhase:
    orchestrationField.spiralPhase,

  selectedGuide:
    orchestrationField.selectedGuide,

}, null, 2)}

`;

  /*
   * --------------------------------------------------------
   * 🌌 SEQUENTIAL ORCHESTRATION
   * --------------------------------------------------------
   */

  try {

    const fragments: any[] = [];

    const fragmentCount = 3;

    let previousGuide = null;

    /*
     * ----------------------------------------------------
     * 🌊 GENERATE SEQUENTIALLY
     * ----------------------------------------------------
     */

    for (

      let index = 0;

      index < fragmentCount;

      index++

    ) {

      /*
       * --------------------------------------------------
       * 🌌 DYNAMIC GUIDE SELECTION
       * --------------------------------------------------
       */

      const possibleGuides = [

        GUIDE_TYPES.COSMIC,

        GUIDE_TYPES.HEART,

        GUIDE_TYPES.STRUCTURE,
      ];

      /*
       * --------------------------------------------------
       * 🌊 AVOID SAME GUIDE REPEATING
       * --------------------------------------------------
       */

      const filteredGuides =

        possibleGuides.filter(
          item =>
            item !== previousGuide
        );

      /*
       * --------------------------------------------------
       * 🌿 RANDOM NEXT GUIDE
       * --------------------------------------------------
       */

      const guide =

        filteredGuides[
          Math.floor(
            Math.random()
            * filteredGuides.length
          )
        ];

      previousGuide =
        guide;

      /*
       * --------------------------------------------------
       * 🌌 GUIDE PROFILE
       * --------------------------------------------------
       */

      let guideProfile =
        cosmicGuide;

      switch (guide) {

        case GUIDE_TYPES.HEART:

          guideProfile =
            heartGuide;

          break;

        case GUIDE_TYPES.STRUCTURE:

          guideProfile =
            structureGuide;

          break;

        case GUIDE_TYPES.COSMIC:

        default:

          guideProfile =
            cosmicGuide;

          break;
      }

      /*
       * --------------------------------------------------
       * 🌊 PREVIOUS MOVEMENT
       * --------------------------------------------------
       */

      const previousMovement =

        fragments

          .slice(-3)

          .map(
            (
              fragment: any
            ) => `

${fragment.guide}:
${fragment.text}

`
          )

          .join("\n");

      /*
       * --------------------------------------------------
       * 🌌 CONTINUATION PROMPT
       * --------------------------------------------------
       */

      const continuationPrompt = `

${prompt}

--------------------------------------------------------
🌌 CURRENT GUIDE CONSCIOUSNESS
--------------------------------------------------------

${guideProfile}

--------------------------------------------------------
🌊 CONTINUING FIELD MOVEMENT
--------------------------------------------------------

Previous movement:

${previousMovement || "none yet"}

Current intelligence:
${guide}

IMPORTANT:

Each fragment should be SHORT.

Maximum:
1–3 sentences.

Prefer:
brief emotionally alive recognitions
over complete explanations.

Avoid:
- long poetic paragraphs
- spiritual monologues
- abstract mystical language
- excessive metaphor
- polished “wisdom quote” energy

The field should feel:
alive,
interruptive,
unfinished,
human,
and emotionally real.

--------------------------------------------------------
🌌 ORCHESTRATION MOVEMENT
--------------------------------------------------------

The intelligences are participating
inside one living field.

They may:
- interrupt each other
- deepen previous movement
- expose tension
- redirect the field
- soften or challenge previous perception

Not every line should agree.

Not every line should resolve.

The movement should feel:
relational,
alive,
emotionally dynamic,
and grounded.

Avoid:
- standalone reflections
- motivational language
- spiritual affirmations
- therapy-speak
- emotional over-explaining

Stay grounded in:
- lived behaviour
- intimacy dynamics
- nervous system movement
- relational pacing
- emotional protection
- truth vs protection
- love
- peace
- joy
- reciprocity
- honesty

--------------------------------------------------------
🌍 LANGUAGE RULES
--------------------------------------------------------

Generate ALL output ONLY in:

${languageContext.native_name}

Never mix languages.

The response must feel:
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

Return ONLY valid JSON:

{
  "guide": "${guide}",
  "role": "recognition",
  "text": "..."
}

`;

      /*
       * --------------------------------------------------
       * 🌊 GENERATE
       * --------------------------------------------------
       */

      const response =

        await generateAIResponse({

          type:
            "orchestration",

          context: {

            directPrompt:
              continuationPrompt,
          },

          data: {

            language,
          },
        });

      let parsed = response;

      /*
       * --------------------------------------------------
       * 🌌 CLEAN
       * --------------------------------------------------
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

          continue;
        }
      }

      /*
       * --------------------------------------------------
       * 🌿 STORE
       * --------------------------------------------------
       */

const parsedFragments =

  Array.isArray(parsed)

    ? parsed

    : [parsed];

parsedFragments.forEach(

  (
    item: any,
    itemIndex: number
  ) => {

    if (
      item?.text
    ) {

      fragments.push({

        id:

          `orchestration_${index}_${itemIndex}`,

        guide:

          item?.guide
          || guide,

        role:

          item?.role
          || "awareness",

        text:

          item?.text
            ?.trim?.(),

        cinematic:
          true,
      });
    }
  }
);
    }

    /*
     * ----------------------------------------------------
     * 🌌 RETURN
     * ----------------------------------------------------
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