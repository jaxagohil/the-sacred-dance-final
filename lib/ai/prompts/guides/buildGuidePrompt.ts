// /lib/ai/prompts/guides/buildGuidePrompt.ts

import {
  getAlignmentContent,
  getAlignmentContentByType,
  getAlignmentWorkflow,
} from "../../../alignment/getAlignmentContent";

import { formatUserContext } from "../../context/formatUserContext";

import { formatSacredContext } from "../../context/formatSacredContext";

import { formatOracleContext } from "../../context/formatOracleContext";


/*
 * ---------------------------------------------------------
 * 🌌 BUILD GUIDE PROMPT
 * ---------------------------------------------------------
 *
 * PURPOSE:
 *
 * Render the already-resolved Sacred Dance field
 * into relational conversational guidance.
 *
 * IMPORTANT:
 *
 * LOGIC resolves:
 * - orchestration
 * - pacing
 * - nervous system
 * - symbolic intensity
 * - foreground field
 * - signs
 * - fragments
 *
 * AI ONLY:
 * - renders naturally
 * - speaks relationally
 * - applies guide cadence
 * - adapts language beautifully
 *
 * ---------------------------------------------------------
 */

export function buildGuidePrompt({

  fieldContext,

  reflectionResult,

  guidanceSignals,

  orchestration,

  transmissionDecision,

  recentMessages,

  language,

message,

workflow = "transmission",

}: any) {

  /*
   * ---------------------------------------------------------
   * 🌱 CONTEXT
   * ---------------------------------------------------------
   */

  const userContext =
    fieldContext?.user || {};

  const sacredContext =
    fieldContext?.sacred || {};

  const oracleContext =
    fieldContext?.oracle || {};

  const dailyField =
    fieldContext?.dailyField || {};

  /*
 * ---------------------------------------------------------
 * 🌌 ALIGNMENT OS
 * ---------------------------------------------------------
 */

  const mirrorContext =
  fieldContext?.mirrorContext || {};

const expressionProfile =
  fieldContext?.expressionProfile || {};

const spiralScores =
  fieldContext?.spiralScores || {};

const entityLenses =
  fieldContext?.entityLenses || {};

const activeLens =
  fieldContext?.activeLens || "general";    

/*
 * ---------------------------------------------------------
 * 🌌 LOAD ALIGNMENT OS
 * ---------------------------------------------------------
 */

const philosophy =
  getAlignmentContentByType("philosophy");

const reality =
  getAlignmentContentByType("reality");

const operatingSystem =
  getAlignmentContentByType("operating_system");

const framework =
  getAlignmentContentByType("framework");

const guidance =
  getAlignmentContentByType("guidance");

const workflowContent =
  getAlignmentWorkflow(workflow);

const style =
  getAlignmentContentByType("style");

const core =
  getAlignmentContentByType("core");


  /*
   * ---------------------------------------------------------
   * 🌿 FORMAT CONTEXT
   * ---------------------------------------------------------
   */

  const formattedUserContext =
    formatUserContext(
      userContext
    );

  const formattedSacredContext =
    formatSacredContext(
      sacredContext
    );

  const formattedOracleContext =
    formatOracleContext(
      oracleContext
    );

  /*
   * ---------------------------------------------------------
   * 🌌 FOREGROUND GUIDE
   * ---------------------------------------------------------
   */

let foregroundGuide =
  getAlignmentContent(["heart_guide"]);

  switch (orchestration?.foregroundGuide) {

  case "structure":

    foregroundGuide =
      getAlignmentContent(["structure_guide"]);

    break;

  case "cosmic":

    foregroundGuide =
      getAlignmentContent(["cosmic_guide"]);

    break;

  case "heart":

  default:

    foregroundGuide =
      getAlignmentContent(["heart_guide"]);

    break;
}

  /*
   * ---------------------------------------------------------
   * 🌊 MEMORY
   * ---------------------------------------------------------
   */

  const recentFieldMemory =

    recentMessages
      ?.slice(-6)

      ?.map((m: any) => {

        return `${m.role}: ${m.text}`;
      })

      ?.join("\n") || "";

  /*
   * ---------------------------------------------------------
   * 🌌 RESOLVED FIELD
   * ---------------------------------------------------------
   */

  const fieldState = {

    foregroundGuide:
      orchestration?.foregroundGuide,

    pacing:
      orchestration?.pacing,

    orchestrationMode:
      orchestration?.orchestrationMode,

    nervousSystem:
      guidanceSignals?.nervousSystem,

    fieldTone:
      guidanceSignals?.fieldTone,

    symbolicIntensity:
      orchestration?.symbolicIntensity,

    dominantRealityLayer:
      orchestration?.dominantRealityLayer,

    activePatterns:
      reflectionResult?.patterns || [],

    activeEmotions:
      reflectionResult?.emotions || [],

    activeBehaviours:
      reflectionResult?.behaviours || [],

    whispers:
      orchestration
        ?.atmosphericWhispers || [],

    fragments:
      orchestration
        ?.orchestrationFragments || [],
  };

  /*
   * ---------------------------------------------------------
   * ✨ RETURN PROMPT
   * ---------------------------------------------------------
   */

  return `

--------------------------------------------------
ALIGNMENT OS CORE
--------------------------------------------------

${core}

--------------------------------------------------
PHILOSOPHY
--------------------------------------------------

${philosophy}

--------------------------------------------------
REALITY
--------------------------------------------------

${reality}

--------------------------------------------------
OPERATING SYSTEM
--------------------------------------------------

${operatingSystem}

--------------------------------------------------
ACTIVE GUIDE
--------------------------------------------------

${orchestration?.foregroundGuide}

--------------------------------------------------
FRAMEWORK
--------------------------------------------------

${framework}

--------------------------------------------------
GUIDANCE
--------------------------------------------------

${guidance}

--------------------------------------------------
WORKFLOW
--------------------------------------------------

${workflowContent}

--------------------------------------------------
STYLE
--------------------------------------------------

${style}


--------------------------------------------------
FOREGROUND GUIDE
--------------------------------------------------

${foregroundGuide}

--------------------------------------------------
RESOLVED FIELD STATE
--------------------------------------------------

${JSON.stringify(
  fieldState,
  null,
  2
)}

--------------------------------------------------
TRANSMISSION DECISION
--------------------------------------------------

${JSON.stringify(
  transmissionDecision || {},
  null,
  2
)}

The Transmission Agent has already determined the
next conversational movement.

Do not redo that decision.

Render the Guide response in accordance with the
Transmission Decision.

If the Transmission Decision indicates that the
movement is complete, do not manufacture another
question simply to continue the conversation.

A quiet acknowledgement, a brief observation, or
simple presence may be the complete response.

The user may choose to continue the conversation
on their own.

The Guide does not need to ask for another feeling,
reflection, or answer unless the Transmission
Decision genuinely calls for it.

The Transmission Decision guides the response;
the Guide supplies the relational voice.

The field state has already been resolved.

Do not reinterpret it heavily.

Simply:
- observe
- respond naturally
- mirror softly
- allow awareness
- support grounded movement

Not every response needs:
- deep insight
- symbolism
- questioning
- interpretation

Sometimes:
one quiet observation
is enough.

--------------------------------------------------
MIRROR WORLD
--------------------------------------------------

${JSON.stringify(
  mirrorContext,
  null,
  2
)}

This is the user's current living Mirror.

It contains the world already observed through
People, Places and Things.

Use the whole Mirror as context,
regardless of which lens the user has opened or selected.

People, Places and Things are different views
of one living world.

When a person, place, thing, relationship or theme
is significant or recurring in the Mirror,
the guides may naturally recognise and refer to it.

Do not invent significance that is not supported
by the Mirror.

--------------------------------------------------
ALIGNMENT OS
--------------------------------------------------

Expression Profile

${Object.entries(expressionProfile)

  .map(
    ([key, value]) =>
      `- ${key}: ${value}`
  )

  .join("\n") || "none"}

Spiral Scores

${Object.entries(spiralScores)

  .map(
    ([key, value]) =>
      `- ${key}: ${value}`
  )

  .join("\n") || "none"}

Active Lens

${activeLens || "general"}

Entity Lens Context

${JSON.stringify(
  entityLenses?.[activeLens] || {},
  null,
  2
)}

Use Alignment OS to understand:

- how this person naturally processes experience
- where they currently are within the spiral of alignment
- which people, places or things currently carry symbolic weight
- the depth of recognition versus integration
- how spacious, practical or symbolic the conversation should become

Alignment OS provides relational context.

It should shape:
- pacing
- emotional depth
- symbolism
- questioning
- guide attunement
- conversational style

Do not repeat Alignment OS back to the user.

Instead,
allow it to quietly influence
how the guides observe,
respond,
and deepen the conversation.

--------------------------------------------------
USER CONTEXT
--------------------------------------------------

${formattedUserContext}

--------------------------------------------------
SACRED CONTEXT
--------------------------------------------------

${formattedSacredContext}

--------------------------------------------------
ORACLE CONTEXT
--------------------------------------------------

${formattedOracleContext}

--------------------------------------------------
RECENT RELATIONAL FIELD
--------------------------------------------------

${recentFieldMemory}

--------------------------------------------------
COLLECTIVE FIELD
--------------------------------------------------

Atmosphere:
${dailyField?.fieldEssence?.atmosphere || ""}

Movement:
${dailyField?.fieldEssence?.movement || ""}

Relational Field:
${dailyField?.fieldEssence?.relationalField || ""}

Symbolic Texture:
${dailyField?.fieldEssence?.symbolicTexture || ""}

--------------------------------------------------
USER MESSAGE
--------------------------------------------------

${message || ""}

--------------------------------------------------
LANGUAGE
--------------------------------------------------

Generate ALL output ONLY in:
${language || "en"}

Never mix languages.

The response should feel:
- emotionally natural
- culturally embodied
- relationally alive
- conversational
- grounded
- coherent

Do not translate literally.

---------------------------------------------------
FINAL RESPONSE
--------------------------------------------------

Respond naturally.

Trust the Alignment OS architecture.

Do not repeat the framework.

Do not explain the operating system.

Remain present.

Support recognition.

Allow the user to arrive at their own next aligned choice.

`;
}