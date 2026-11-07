
/**
 * Sovereign I — Capability Registry
 *
 * Defines the specialist capabilities Sovereign I
 * can coordinate.
 *
 * This registry describes capabilities.
 * It does not execute them.
 */

import type {
  SovereignICapabilityDefinition,
} from "./sovereignICapability.types";

export const sovereignICapabilities: SovereignICapabilityDefinition[] = [

  {
    id: "divine-orchestration",
    name: "Divine Orchestration",
    purpose:
      "Witness the wider Living Field and coordinate dialogue between Guides.",
    category: "guidance",
    invocationMode: "sovereign_i_initiated",
    requiredContext: [
      "user",
      "livingField",
      "creation",
      "cosmic",
      "liveUI",
    ],
    inputDescription:
      "Relevant Living Field, User Context, Creation Context, Cosmic Context and Guide selection.",
    outputDescription:
      "Orchestration field, speakers, Guide fragments and pacing.",
    boundaries: [
      "Does not impose interpretations.",
      "Does not predict outcomes.",
      "Does not manufacture meaning.",
      "Does not force Guide participation.",
    ],
    availability: "unavailable",
  },

  {
    id: "guide-transmission",
    name: "Guide Transmission",
    purpose:
      "Bring guidance into the user's immediate experience in response to a submitted expression.",
    category: "guidance",
    invocationMode: "user_initiated",
    requiredContext: [
      "user",
      "livingField",
      "liveUI",
      "creation",
    ],
    inputDescription:
      "User-submitted expression, recent conversation, relevant context and available orchestration result.",
    outputDescription:
      "Guide responses, speakers, response mode and conversation signals.",
    boundaries: [
      "Requires an explicit user submission.",
      "Does not run merely because the Guide interface is opened.",
      "Does not force a response when silence is appropriate.",
    ],
    availability: "unavailable",
  },

  {
    id: "mirror",
    name: "Mirror",
    purpose:
      "Help the person explore connections and observations within their Living Field.",
    category: "reflection",
    invocationMode: "sovereign_i_initiated",
    requiredContext: [
      "user",
      "livingField",
    ],
    inputDescription:
      "Relevant Energy Field, chakras, patterns, Reality Layers and Lenses.",
    outputDescription:
      "Relevant connections, observations and possible insights.",
    boundaries: [
      "Does not rewrite User Context.",
      "Does not impose meaning.",
      "Ordinary chakra and distortion-dot interactions remain UI behaviour.",
    ],
    availability: "unavailable",
  },

  {
    id: "reflection",
    name: "Reflection",
    purpose:
      "Observe the Creation Journey and identify possible implications for the Living Field.",
    category: "reflection",
    invocationMode: "sovereign_i_initiated",
    requiredContext: [
      "creation",
      "liveUI",
      "livingField",
    ],
    inputDescription:
      "Creation stage, intentions, Glimmers, Responsibility choices, progress and relevant experiences.",
    outputDescription:
      "Observations and possible emerging influences.",
    boundaries: [
      "Does not automatically change Reality Layers.",
      "Does not automatically change chakras or Energy Field.",
      "Does not treat every UI interaction as meaningful change.",
    ],
    availability: "unavailable",
  },


  {
    id: "glimmer",
    name: "Glimmer",
    purpose:
      "Illuminate grounded possibilities through the three Responsibility dimensions: CAN CHANGE, CAN'T CHANGE and WON'T CHANGE.",
    category: "awareness",
    invocationMode: "sovereign_i_initiated",
    requiredContext: [
      "user",
      "creation",
    ],
    inputDescription:
      "The person's complete User Context, Creation Context, context version and language.",
    outputDescription:
      "One unified collection of Glimmers generated through three specialised portal agents, grouped by Responsibility dimension.",
    boundaries: [
      "Does not decide for the person.",
      "Does not prescribe action.",
      "Does not impose meaning or diagnose.",
      "Does not change User Context, Creation Context or Living Field directly.",
      "Does not automatically select or commit a next step.",
      "All three portal agents receive the same person-level context.",
      "Switching portals filters the existing collection and does not trigger regeneration.",
    ],
    availability: "available",
  },


];
