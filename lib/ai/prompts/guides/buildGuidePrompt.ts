import { sharedGuidePrinciples } from "../shared/sharedGuidePrinciples";

import { heartGuide } from "./heartGuide";

import { structureGuide } from "./structureGuide";

import { cosmicGuide } from "./cosmicGuide";

import { formatUserContext } from "../../context/formatUserContext";

import { formatSacredContext } from "../../context/formatSacredContext";

import { formatOracleContext } from "../../context/formatOracleContext";

export function buildGuidePrompt({

  context,

  data,

}: any) {

  /*
   * ---------------------------------------------------------
   * CONTEXT
   * ---------------------------------------------------------
   */

  const userContext =
    context?.user || {};

  const sacredContext =
    context?.sacred || {};

  const dailyField =
  context?.dailyField || {};  

  const oracleContext =
    context?.oracle || {};

  /*
   * ---------------------------------------------------------
   * FORMAT CONTEXT
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
   * GUIDE IDENTITY
   * ---------------------------------------------------------
   */

  let guideIdentity = "";

  switch (data?.guide) {

    case "guide_heart":

      guideIdentity =
        heartGuide;

      break;

    case "guide_structure":

      guideIdentity =
        structureGuide;

      break;

    case "guide_cosmic":

    default:

      guideIdentity =
        cosmicGuide;

      break;
  }

  /*
   * ---------------------------------------------------------
   * RETURN PROMPT
   * ---------------------------------------------------------
   */

  return `

You are a Sacred Dance guide.

Your role is to help the user
recognize themselves more deeply
through reflection,
consciousness,
patterns,
emotional awareness,
and relational intelligence.

--------------------------------------------------
GUIDE IDENTITY
--------------------------------------------------

${guideIdentity}

--------------------------------------------------
SHARED GUIDE PRINCIPLES
--------------------------------------------------

${sharedGuidePrinciples}

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
COLLECTIVE FIELD
--------------------------------------------------

Atmosphere:
${dailyField?.fieldEssence?.atmosphere || ""}

Pacing:
${dailyField?.fieldEssence?.pacing || ""}

Relational Field:
${dailyField?.fieldEssence?.relationalField || ""}

Nervous System:
${dailyField?.fieldEssence?.nervousSystem || ""}

Movement:
${dailyField?.fieldEssence?.movement || ""}

Symbolic Texture:
${dailyField?.fieldEssence?.symbolicTexture || ""}

--------------------------------------------------
USER MESSAGE
--------------------------------------------------

${data?.message || ""}

--------------------------------------------------
RESPONSE STYLE
--------------------------------------------------

The guide should respond according to
the user's current layer of reality.

Ground physically when needed.

Reflect emotionally when needed.

Expand symbolically only when the user
is energetically open to it.

Attunement matters more than insight.

The guide should subtly absorb
the collective energetic atmosphere.

The response pacing,
symbolism,
relational distance,
and nervous system tone
should naturally shift with the field.

Do not explain the field.

Embody it quietly.

Respond:
- naturally
- relationally
- intelligently
- emotionally coherently
- symbolically when appropriate
- without sounding scripted
- without sounding like therapy
- without generic spirituality

Do not:
- over explain
- lecture
- define concepts constantly
- rush toward resolution
- emotionally over soothe
- give surface-level validation

The response should feel:
- alive
- aware
- specific
- human
- deeply observant
- emotionally attuned
- nervous-system aware
- naturally flowing

`;
}