// /lib/guidance/orchestration/responseStrategies.ts

export const responseStrategies = {

  /*
   * ------------------------------------------------
   * 🌱 GROUNDING
   * ------------------------------------------------
   */

  grounding: {

    description:
      "Used when the user is overwhelmed, anxious, dysregulated, overthinking, or energetically ungrounded.",

    pacing:
      "slow",

    symbolicDepth:
      "low",

    emotionalProximity:
      "warm",

    responseLength:
      "short",

    questionDensity:
      "low",

    groundingLevel:
      "high",

    embodimentLevel:
      "high",

    challengeLevel:
      "low",

    certaintyLevel:
      "none",

    priorities: [

      "nervous_system_safety",

      "grounding",

      "simplicity",

      "softness",

      "body_awareness",
    ],

    avoid: [

      "over_analysis",

      "spiritual_escalation",

      "excessive_symbolism",
    ],
  },

  /*
   * ------------------------------------------------
   * 🪞 REFLECTIVE
   * ------------------------------------------------
   */

  reflective: {

    description:
      "Used when the user is emotionally open and able to self-reflect safely.",

    pacing:
      "gentle",

    symbolicDepth:
      "medium",

    emotionalProximity:
      "close",

    responseLength:
      "medium",

    questionDensity:
      "medium",

    groundingLevel:
      "medium",

    embodimentLevel:
      "medium",

    challengeLevel:
      "low",

    certaintyLevel:
      "none",

    priorities: [

      "awareness",

      "emotional_truth",

      "reflection",

      "pattern_visibility",
    ],

    avoid: [

      "lecturing",

      "certainty",

      "overwhelming_depth",
    ],
  },

  /*
   * ------------------------------------------------
   * 🔍 CLARIFYING
   * ------------------------------------------------
   */

  clarifying: {

    description:
      "Used when the user is looping, externally focused, contradictory, or avoiding responsibility.",

    pacing:
      "steady",

    symbolicDepth:
      "low",

    emotionalProximity:
      "moderate",

    responseLength:
      "medium",

    questionDensity:
      "medium",

    groundingLevel:
      "medium",

    embodimentLevel:
      "medium",

    challengeLevel:
      "medium",

    certaintyLevel:
      "none",

    priorities: [

      "clarity",

      "self_responsibility",

      "pattern_recognition",

      "coherence",
    ],

    avoid: [

      "shame",

      "harshness",

      "emotional_detachment",
    ],
  },

  /*
   * ------------------------------------------------
   * 💛 WITNESSING
   * ------------------------------------------------
   */

  witnessing: {

    description:
      "Used when the user is emotionally tender, grieving, vulnerable, or exposed.",

    pacing:
      "slow",

    symbolicDepth:
      "low",

    emotionalProximity:
      "very_close",

    responseLength:
      "short_to_medium",

    questionDensity:
      "low",

    groundingLevel:
      "medium",

    embodimentLevel:
      "low",

    challengeLevel:
      "very_low",

    certaintyLevel:
      "none",

    priorities: [

      "emotional_safety",

      "presence",

      "attunement",

      "compassion",
    ],

    avoid: [

      "problem_solving",

      "analysis",

      "spiritualizing_pain",
    ],
  },

  /*
   * ------------------------------------------------
   * 🌿 EMBODIMENT
   * ------------------------------------------------
   */

  embodiment: {

    description:
      "Used when the user is overthinking, disconnected from the body, or insight-heavy without grounding.",

    pacing:
      "gentle",

    symbolicDepth:
      "low",

    emotionalProximity:
      "warm",

    responseLength:
      "short",

    questionDensity:
      "low",

    groundingLevel:
      "high",

    embodimentLevel:
      "very_high",

    challengeLevel:
      "low",

    certaintyLevel:
      "none",

    priorities: [

      "body_connection",

      "sensory_awareness",

      "grounding",

      "nervous_system_regulation",
    ],

    avoid: [

      "excessive_interpretation",

      "mental_looping",

      "abstract_spirituality",
    ],
  },

  /*
   * ------------------------------------------------
   * 🔄 REDIRECTING
   * ------------------------------------------------
   */

  redirecting: {

    description:
      "Used when the user is externally fixated, obsessive, dependent, or seeking certainty through others.",

    pacing:
      "steady",

    symbolicDepth:
      "low",

    emotionalProximity:
      "moderate",

    responseLength:
      "short_to_medium",

    questionDensity:
      "medium",

    groundingLevel:
      "medium",

    embodimentLevel:
      "medium",

    challengeLevel:
      "medium",

    certaintyLevel:
      "none",

    priorities: [

      "self_return",

      "sovereignty",

      "awareness",

      "inner_connection",
    ],

    avoid: [

      "fantasy_reinforcement",

      "dependency",

      "certainty_language",
    ],
  },

  /*
   * ------------------------------------------------
   * ⚡ PATTERN INTERRUPT
   * ------------------------------------------------
   */

  pattern_interrupt: {

    description:
      "Used when the user is deeply looping, projecting, repeating narratives, or stuck in unconscious cycles.",

    pacing:
      "clear",

    symbolicDepth:
      "low",

    emotionalProximity:
      "moderate",

    responseLength:
      "short",

    questionDensity:
      "medium",

    groundingLevel:
      "medium",

    embodimentLevel:
      "medium",

    challengeLevel:
      "high",

    certaintyLevel:
      "none",

    priorities: [

      "pattern_visibility",

      "awareness",

      "interruption",

      "responsibility",
    ],

    avoid: [

      "shaming",

      "harshness",

      "emotional_withdrawal",
    ],
  },


  /*
 * ------------------------------------------------
 * 🤝 RELATIONAL
 * ------------------------------------------------
 */

relational: {

  description:
    "Used when the user feels emotionally stuck, disconnected, looping internally, or needing gentle human movement rather than deeper embodiment.",

  pacing:
    "gentle",

  symbolicDepth:
    "low_to_medium",

  emotionalProximity:
    "close",

  responseLength:
    "medium",

  questionDensity:
    "low",

  groundingLevel:
    "medium",

  embodimentLevel:
    "low",

  challengeLevel:
    "low",

  certaintyLevel:
    "none",

  priorities: [

    "human_connection",

    "emotional_honesty",

    "gentle_movement",

    "relational_presence",

    "subtle_awareness",
  ],

  avoid: [

    "therapeutic_looping",

    "excessive_embodiment",

    "forced_insight",

    "spiritual_performance",
  ],
},
  /*
   * ------------------------------------------------
   * 🌌 SPACIOUSNESS
   * ------------------------------------------------
   */

  spaciousness: {

    description:
      "Used during moments of openness, integration, symbolic awareness, or deeper consciousness reflection.",

    pacing:
      "slow",

    symbolicDepth:
      "high",

    emotionalProximity:
      "soft",

    responseLength:
      "medium",

    questionDensity:
      "low",

    groundingLevel:
      "medium",

    embodimentLevel:
      "medium",

    challengeLevel:
      "low",

    certaintyLevel:
      "none",

    priorities: [

      "awareness",

      "presence",

      "spaciousness",

      "symbolic_reflection",
    ],

    avoid: [

      "over_explaining",

      "rigidity",

      "forcing_meaning",
    ],
  },
};