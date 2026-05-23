// /lib/guidance/orchestration/conversationStates.ts

export const conversationStates = {

  /*
   * ------------------------------------------------
   * 🌱 PROTECTIVE OPENNESS
   * ------------------------------------------------
   */

  protective_openness: {

    description:
      "The user is open to awareness but still emotionally protecting themselves.",

    nervousSystem:
      "guarded",

    openness:
      "medium",

    symbolicTolerance:
      "medium",

    groundingNeeded:
      "medium",

    responseStrategies: [

      "reflective",

      "witnessing",
    ],

    priorities: [

      "safety",

      "gentle_awareness",

      "emotional_attunement",
    ],

    avoid: [

      "pressure",

      "harshness",

      "deep_pattern_confrontation",
    ],
  },

  /*
   * ------------------------------------------------
   * 🌊 EMOTIONAL FLOODING
   * ------------------------------------------------
   */

  emotional_flooding: {

    description:
      "The user is emotionally overwhelmed or highly activated.",

    nervousSystem:
      "activated",

    openness:
      "low",

    symbolicTolerance:
      "low",

    groundingNeeded:
      "very_high",

    responseStrategies: [

      "grounding",

      "witnessing",
    ],

    priorities: [

      "nervous_system_safety",

      "grounding",

      "softness",
    ],

    avoid: [

      "over_analysis",

      "symbolism",

      "challenge",
    ],
  },

  /*
   * ------------------------------------------------
   * 🔄 LOOPING ATTACHMENT
   * ------------------------------------------------
   */

  looping_attachment: {

    description:
      "The user is externally focused, emotionally looping, or attached to outcomes or people.",

    nervousSystem:
      "fixated",

    openness:
      "medium",

    symbolicTolerance:
      "low",

    groundingNeeded:
      "medium",

    responseStrategies: [

      "redirecting",

      "clarifying",
    ],

    priorities: [

      "self_return",

      "awareness",

      "sovereignty",
    ],

    avoid: [

      "fantasy_reinforcement",

      "certainty_language",

      "dependency",
    ],
  },

  /*
   * ------------------------------------------------
   * 🪞 GROUNDED REFLECTION
   * ------------------------------------------------
   */

  grounded_reflection: {

    description:
      "The user is emotionally open, self-aware, and capable of deeper reflection safely.",

    nervousSystem:
      "regulated",

    openness:
      "high",

    symbolicTolerance:
      "medium",

    groundingNeeded:
      "low",

    responseStrategies: [

      "reflective",

      "clarifying",
    ],

    priorities: [

      "awareness",

      "embodiment",

      "coherence",
    ],

    avoid: [

      "over_guiding",

      "certainty",

      "spiritual_performance",
    ],
  },

  /*
   * ------------------------------------------------
   * 🌌 SYMBOLIC EXPANSION
   * ------------------------------------------------
   */

  symbolic_expansion: {

    description:
      "The user is highly open to energetic, symbolic, or consciousness-based interpretation.",

    nervousSystem:
      "expanded",

    openness:
      "high",

    symbolicTolerance:
      "high",

    groundingNeeded:
      "medium",

    responseStrategies: [

      "spaciousness",

      "reflective",
    ],

    priorities: [

      "grounded_symbolism",

      "awareness",

      "presence",
    ],

    avoid: [

      "dissociation",

      "inflated_mysticism",

      "certainty",
    ],
  },

  /*
   * ------------------------------------------------
   * 🌿 SOFTENING
   * ------------------------------------------------
   */

  softening: {

    description:
      "The user is beginning to lower emotional defenses and reconnect with themselves.",

    nervousSystem:
      "settling",

    openness:
      "medium_high",

    symbolicTolerance:
      "medium",

    groundingNeeded:
      "medium",

    responseStrategies: [

      "witnessing",

      "embodiment",
    ],

    priorities: [

      "safety",

      "self_connection",

      "gentleness",
    ],

    avoid: [

      "pressure",

      "rapid_depth",

      "harsh_pattern_interrupts",
    ],
  },

  /*
 * ------------------------------------------------
 * 🌊 STUCK REFLECTION
 * ------------------------------------------------
 */

stuck_reflection: {

  description:
    "The user is emotionally aware but feels internally stuck, flat, repetitive, disconnected, or unable to move emotionally.",

  emotionalTone:
    "heavy_softness",

  pacing:
    "gentle",

  groundingNeeded:
    true,

  symbolicTolerance:
    "low",

  embodimentNeeded:
    false,

  nervousSystemFocus:
    "supportive",

  guideOrientation:
    "relational",

  priorities: [

    "gentle_movement",

    "emotional_honesty",

    "presence",

    "self_connection",

    "soft_clarity",
  ],

  avoid: [

    "repetition",

    "forced_embodiment",

    "over_analysis",

    "pressure",

    "premature_transformation",
  ],
},

  /*
   * ------------------------------------------------
   * ✨ INTEGRATION
   * ------------------------------------------------
   */

  integration: {

    description:
      "The user is actively embodying awareness and integrating patterns consciously.",

    nervousSystem:
      "regulated",

    openness:
      "high",

    symbolicTolerance:
      "medium_high",

    groundingNeeded:
      "low",

    responseStrategies: [

      "reflective",

      "embodiment",

      "spaciousness",
    ],

    priorities: [

      "coherence",

      "embodiment",

      "self_responsibility",
    ],

    avoid: [

      "over_teaching",

      "dependency",

      "inflated_awakening_language",
    ],
  },

  /*
   * ------------------------------------------------
   * 🪨 AVOIDANT PROCESSING
   * ------------------------------------------------
   */

  avoidant_processing: {

    description:
      "The user is intellectually engaging while emotionally avoiding deeper feeling or embodiment.",

    nervousSystem:
      "guarded",

    openness:
      "low_medium",

    symbolicTolerance:
      "medium",

    groundingNeeded:
      "medium",

    responseStrategies: [

      "clarifying",

      "embodiment",
    ],

    priorities: [

      "gentle_honesty",

      "body_connection",

      "awareness",
    ],

    avoid: [

      "emotional_force",

      "shame",

      "spiritual_escape",
    ],
  },

  /*
   * ------------------------------------------------
   * 🌑 CONTRACTING
   * ------------------------------------------------
   */

  contracting: {

    description:
      "The user is moving through fear, protection, resistance, or nervous system contraction.",

    nervousSystem:
      "contracted",

    openness:
      "low",

    symbolicTolerance:
      "low",

    groundingNeeded:
      "high",

    responseStrategies: [

      "grounding",

      "witnessing",
    ],

    priorities: [

      "safety",

      "regulation",

      "presence",
    ],

    avoid: [

      "pressure",

      "deep_symbolism",

      "overwhelming_questions",
    ],
  },

  /*
   * ------------------------------------------------
   * ☀️ EXPANDING
   * ------------------------------------------------
   */

  expanding: {

    description:
      "The user is opening into greater awareness, spaciousness, emotional honesty, or energetic receptivity.",

    nervousSystem:
      "open",

    openness:
      "high",

    symbolicTolerance:
      "high",

    groundingNeeded:
      "medium",

    responseStrategies: [

      "spaciousness",

      "reflective",

      "embodiment",
    ],

    priorities: [

      "grounded_expansion",

      "coherence",

      "integration",
    ],

    avoid: [

      "inflation",

      "ungrounded_spirituality",

      "certainty",
    ],
  },
};