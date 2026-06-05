// /lib/guidance/guidanceTypes.ts

/*
 * --------------------------------------------------------
 * 🌌 GUIDANCE TYPES
 * --------------------------------------------------------
 *
 * Canonical orchestration types
 * for the living Guidance field.
 *
 * IMPORTANT:
 *
 * These types do NOT create meaning.
 *
 * Meaning already exists inside:
 * - signals
 * - patterns
 * - mirror context
 * - lenses
 * - reality layers
 * - orchestration tables
 *
 * These types ONLY define:
 * - what becomes foregrounded
 * - how the field moves
 * - how orchestration renders
 *
 * --------------------------------------------------------
 */

/*
 * --------------------------------------------------------
 * 🌍 REALITY LAYERS
 * --------------------------------------------------------
 *
 * Represents:
 * where the user is currently
 * most grounded within experience.
 *
 * IMPORTANT:
 *
 * Reality layers are NOT hierarchy.
 * They are NOT identity.
 *
 * They are foreground processing states.
 *
 * --------------------------------------------------------
 */

export type RealityLayer =

  | "physical"
  | "emotional"
  | "energetic"
  | "consciousness";

/*
 * --------------------------------------------------------
 * 🌊 NERVOUS SYSTEM
 * --------------------------------------------------------
 */

export type NervousSystemState =

  | "regulated"
  | "soft"
  | "activated"
  | "contracted"
  | "overwhelmed"
  | "expansive";

/*
 * --------------------------------------------------------
 * 🌌 SYMBOLIC INTENSITY
 * --------------------------------------------------------
 *
 * Controls:
 * - sign density
 * - symbolic allowance
 * - orchestration spaciousness
 *
 * --------------------------------------------------------
 */

export type SymbolicIntensity =

  | "silent"
  | "low"
  | "moderate"
  | "high";

/*
 * --------------------------------------------------------
 * 🌿 EMOTIONAL TEMPERATURE
 * --------------------------------------------------------
 */

export type EmotionalTemperature =

  | "cool"
  | "warm"
  | "tender"
  | "intense";

/*
 * --------------------------------------------------------
 * 🌊 ORCHESTRATION MODE
 * --------------------------------------------------------
 *
 * Governs:
 * - pacing
 * - witnessing
 * - spaciousness
 * - field movement
 *
 * --------------------------------------------------------
 */

export type OrchestrationMode =

  | "still"
  | "observing"
  | "softening"
  | "grounding"
  | "widening"
  | "integrating"
  | "transitioning";

/*
 * --------------------------------------------------------
 * 🌌 GUIDES
 * --------------------------------------------------------
 *
 * IMPORTANT:
 *
 * Guides are NOT personalities.
 *
 * Guides represent:
 * attentional bias.
 *
 * --------------------------------------------------------
 */

export type ActiveGuide =

  | "cosmic"
  | "heart"
  | "structure";

/*
 * --------------------------------------------------------
 * 🌌 FOREGROUND FIELD
 * --------------------------------------------------------
 *
 * The SINGLE resolved field state
 * for Guidance.
 *
 * IMPORTANT:
 *
 * ONE field.
 * MANY render systems.
 *
 * Everything reads THIS:
 * - Signs
 * - Divine Orchestration
 * - Transmission
 * - Overlay
 * - UI pacing
 *
 * --------------------------------------------------------
 */

export interface ForegroundField {

  /*
   * --------------------------------------------------------
   * 🌍 REALITY
   * --------------------------------------------------------
   */

  realityLayer:
    RealityLayer;

  /*
   * --------------------------------------------------------
   * 🌊 ACTIVE GUIDE
   * --------------------------------------------------------
   */

  activeGuide:
    ActiveGuide;

  /*
   * --------------------------------------------------------
   * 🌿 FIELD MOVEMENT
   * --------------------------------------------------------
   */

  orchestrationMode:
    OrchestrationMode;

  nervousSystemState:
    NervousSystemState;

  emotionalTemperature:
    EmotionalTemperature;

  symbolicIntensity:
    SymbolicIntensity;

  /*
   * --------------------------------------------------------
   * 🌌 ACTIVE FIELD
   * --------------------------------------------------------
   */

  activePatterns:
    string[];

  activeChakras:
    string[];

  activeLens:
    string | null;

  /*
   * --------------------------------------------------------
   * 🌊 PACING
   * --------------------------------------------------------
   */

  pacing:
    number;

  silenceProbability:
    number;

  /*
   * --------------------------------------------------------
   * 🌿 FIELD ENERGY
   * --------------------------------------------------------
   */

  amplification:
    number;

  coherence:
    number;

  /*
   * --------------------------------------------------------
   * 🌌 CONTEXTUAL SURFACING
   * --------------------------------------------------------
   */

  activePrinciples?:
    string[];

  activeSignals?:
    string[];

  /*
   * --------------------------------------------------------
   * 🌊 TIMESTAMP
   * --------------------------------------------------------
   */

  timestamp?:
    number;
}

/*
 * --------------------------------------------------------
 * 🌌 SIGNS
 * --------------------------------------------------------
 *
 * Symbolic field particles.
 *
 * NOT:
 * - guidance
 * - coaching
 * - explanations
 * - conversations
 *
 * Examples:
 * - 11:11
 * - ☽
 * - mirrored timing
 * - root flare
 *
 * --------------------------------------------------------
 */

export interface Sign {

  id: string;

  text: string;

  type?:

    | "angel_number"
    | "chakra"
    | "oracle"
    | "cosmic"
    | "pattern"
    | "symbolic";

  weight?:
    number;

  rarity?:
    number;

  recurring?:
    boolean;

  timestamp?:
    number;
}

/*
 * --------------------------------------------------------
 * 🌊 DIVINE ORCHESTRATION
 * --------------------------------------------------------
 *
 * Guide witnessing fragments.
 *
 * IMPORTANT:
 *
 * These are NOT:
 * - advice
 * - therapy
 * - chatbot coaching
 *
 * These ARE:
 * - field observations
 * - symbolic witnessing
 * - orchestration noticing
 * - pattern recognition
 *
 * --------------------------------------------------------
 */

export interface DivineOrchestrationFragment {

  id: string;

  text: string;

  guide:
    ActiveGuide;

  mode?:
    OrchestrationMode;

  emotionalWeight?:
    number;

  symbolicWeight?:
    number;

  pacingWeight?:
    number;

  silenceAfter?:
    boolean;

  timestamp?:
    number;
}

/*
 * --------------------------------------------------------
 * 🌿 GUIDANCE SIGNAL
 * --------------------------------------------------------
 *
 * Created when the user:
 * - reflects
 * - asks
 * - uploads voice
 * - enters transmission
 *
 * Signals mutate the field.
 *
 * --------------------------------------------------------
 */

export interface GuidanceSignal {

  id: string;

  text?: string;

  type?:

    | "reflection"
    | "question"
    | "voice"
    | "image"
    | "emotion";

  emotionalWeight?:
    number;

  symbolicActivation?:
    number;

  nervousSystemShift?:
    NervousSystemState;

  timestamp:
    number;
}

/*
 * --------------------------------------------------------
 * 🌌 TRANSMISSION
 * --------------------------------------------------------
 *
 * Relational field exchange.
 *
 * IMPORTANT:
 *
 * Transmission is NOT chatbot memory.
 *
 * --------------------------------------------------------
 */

export interface Transmission {

  id: string;

  role:
    "user" | "guide";

  text: string;

  guide?:
    ActiveGuide;

  timestamp:
    number;
}

/*
 * --------------------------------------------------------
 * 🌊 TRANSMISSION RESIDUE
 * --------------------------------------------------------
 *
 * 36h field continuity memory.
 *
 * IMPORTANT:
 *
 * Stores:
 * - emotional movement
 * - unresolved mirrors
 * - pacing residue
 * - symbolic residue
 *
 * NOT giant chat logs.
 *
 * --------------------------------------------------------
 */

export interface TransmissionResidue {

  dominantThemes:
    string[];

  unresolvedPatterns:
    string[];

  nervousSystemDirection:
    NervousSystemState;

  orchestrationMode:
    OrchestrationMode;

  emotionalTemperature:
    EmotionalTemperature;

  symbolicIntensity:
    SymbolicIntensity;

  activeGuide:
    ActiveGuide;

  lastUpdated:
    number;
}