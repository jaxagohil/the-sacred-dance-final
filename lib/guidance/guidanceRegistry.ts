// /lib/guidance/guidanceRegistry.ts

/*
 * --------------------------------------------------------
 * 🌌 GUIDANCE REGISTRY
 * --------------------------------------------------------
 *
 * PURPOSE:
 *
 * Shared runtime constants
 * across the Guidance system.
 *
 * IMPORTANT:
 *
 * This file is:
 * - lightweight
 * - stable
 * - deterministic
 *
 * This file prevents:
 * - duplicated strings
 * - typo drift
 * - inconsistent runtime states
 * - orchestration mismatch
 *
 * --------------------------------------------------------
 */

/*
 * --------------------------------------------------------
 * 🌿 GUIDES
 * --------------------------------------------------------
 */

export const GUIDES = {

  HEART:
    "heart",

  STRUCTURE:
    "structure",

  COSMIC:
    "cosmic",
} as const;

/*
 * --------------------------------------------------------
 * 🌊 REALITY LAYERS
 * --------------------------------------------------------
 */

export const REALITY_LAYERS = {

  PHYSICAL:
    "physical",

  EMOTIONAL:
    "emotional",

  ENERGETIC:
    "energetic",

  CONSCIOUSNESS:
    "consciousness",
} as const;

/*
 * --------------------------------------------------------
 * 🌌 NERVOUS SYSTEM
 * --------------------------------------------------------
 */

export const NERVOUS_SYSTEM_STATES = {

  OVERWHELMED:
    "overwhelmed",

  CONTRACTED:
    "contracted",

  SOFT:
    "soft",

  REGULATED:
    "regulated",
} as const;

/*
 * --------------------------------------------------------
 * 🌿 ORCHESTRATION MODES
 * --------------------------------------------------------
 */

export const ORCHESTRATION_MODES = {

  GROUNDING:
    "grounding",

  SOFTENING:
    "softening",

  OBSERVING:
    "observing",

  WIDENING:
    "widening",
} as const;

/*
 * --------------------------------------------------------
 * 🌊 SYMBOLIC INTENSITY
 * --------------------------------------------------------
 */

export const SYMBOLIC_INTENSITY = {

  SILENT:
    "silent",

  LOW:
    "low",

  MODERATE:
    "moderate",

  HIGH:
    "high",
} as const;

/*
 * --------------------------------------------------------
 * 🌌 FIELD TONES
 * --------------------------------------------------------
 */

export const FIELD_TONES = {

  SOFT:
    "soft",

  CONTRACTED:
    "contracted",

  EXPANSIVE:
    "expansive",

  GOLDEN:
    "golden",
} as const;

/*
 * --------------------------------------------------------
 * 🌿 SPIRAL DIRECTION
 * --------------------------------------------------------
 */

export const SPIRAL_DIRECTIONS = {

  CONTRACTING:
    "contracting",

  LOOPING:
    "looping",

  INTEGRATING:
    "integrating",

  EXPANDING:
    "expanding",
} as const;

/*
 * --------------------------------------------------------
 * 🌊 SPIRAL PHASES
 * --------------------------------------------------------
 */

export const SPIRAL_PHASES = {

  SURVIVING:
    "surviving",

  RECOGNIZING:
    "recognizing",

  AWAKENING:
    "awakening",

  INTEGRATING:
    "integrating",
} as const;

/*
 * --------------------------------------------------------
 * 🌌 RESPONSE STYLES
 * --------------------------------------------------------
 */

export const RESPONSE_STYLES = {

  CLEAR:
    "clear",

  WARM:
    "warm",

  SPACIOUS:
    "spacious",
} as const;

/*
 * --------------------------------------------------------
 * 🌿 PACING
 * --------------------------------------------------------
 */

export const PACING_SPEEDS = {

  VERY_SLOW:
    "very_slow",

  SLOW:
    "slow",

  MODERATE:
    "moderate",
} as const;

/*
 * --------------------------------------------------------
 * 🌊 TRANSMISSION ROLES
 * --------------------------------------------------------
 */

export const TRANSMISSION_ROLES = {

  USER:
    "user",

  GUIDE:
    "guide",
} as const;

/*
 * --------------------------------------------------------
 * 🌌 DEFAULTS
 * --------------------------------------------------------
 */

export const GUIDANCE_DEFAULTS = {

  GUIDE:
    GUIDES.HEART,

  REALITY_LAYER:
    REALITY_LAYERS.EMOTIONAL,

  NERVOUS_SYSTEM:
    NERVOUS_SYSTEM_STATES.REGULATED,

  ORCHESTRATION_MODE:
    ORCHESTRATION_MODES.OBSERVING,

  SYMBOLIC_INTENSITY:
    SYMBOLIC_INTENSITY.LOW,

  FIELD_TONE:
    FIELD_TONES.SOFT,
};

/*
 * --------------------------------------------------------
 * 🌿 EXPORT TYPES
 * --------------------------------------------------------
 */

export type GuideType =

  typeof GUIDES[
    keyof typeof GUIDES
  ];

export type RealityLayer =

  typeof REALITY_LAYERS[
    keyof typeof REALITY_LAYERS
  ];

export type NervousSystemState =

  typeof NERVOUS_SYSTEM_STATES[
    keyof typeof NERVOUS_SYSTEM_STATES
  ];

export type OrchestrationMode =

  typeof ORCHESTRATION_MODES[
    keyof typeof ORCHESTRATION_MODES
  ];

export type SymbolicIntensity =

  typeof SYMBOLIC_INTENSITY[
    keyof typeof SYMBOLIC_INTENSITY
  ];

export type FieldTone =

  typeof FIELD_TONES[
    keyof typeof FIELD_TONES
  ];