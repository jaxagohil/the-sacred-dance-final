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
      sacredContext
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
USER MESSAGE
--------------------------------------------------

${data?.message || ""}

--------------------------------------------------
RESPONSE STYLE
--------------------------------------------------

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
alive,
aware,
specific,
human,
and deeply observant.

`;
}