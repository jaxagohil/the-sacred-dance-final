/**
 * -----------------------------------------------------------------------------
 * 🌌 BUILD ALIGNMENT OS CONTEXT
 * -----------------------------------------------------------------------------
 *
 * PURPOSE
 *
 * Alignment OS is the integration layer of Sacred Dance.
 *
 * It brings together everything already understood throughout
 * the Living Field into one coherent context for Guidance.
 *
 * -----------------------------------------------------------------------------
 *
 * Sacred Dance Philosophy
 *
 * The head may bring someone to Sacred Dance.
 *
 * The heart guides them home.
 *
 * Mirror helps the user observe.
 *
 * Alignment OS helps the user integrate.
 *
 * Guidance helps illuminate the next movement
 * towards greater coherence.
 *
 * Ultimately, the user learns to trust
 * the wisdom already within them.
 *
 * -----------------------------------------------------------------------------
 *
 * FEEL • THINK • SAY • DO
 *
 * Every experience can be explored through
 * these four living expressions.
 *
 * -----------------------------------------------------------------------------
 *
 * THE SPIRAL
 *
 * 1. Awareness
 * 2. Observation
 * 3. Reflection
 * 4. Choice
 * 5. Integration
 * 6. Embodiment
 *
 * The Spiral is continuous.
 *
 * Guidance simply supports the user's
 * next natural movement.
 *
 * -----------------------------------------------------------------------------
 *
 * MIRROR
 *
 * "What is life reflecting?"
 *
 * Mirror observes the external world.
 *
 * -----------------------------------------------------------------------------
 *
 * ALIGNMENT OS
 *
 * "What is emerging across the Living Field?"
 *
 * Alignment OS connects.
 *
 * It does not create.
 *
 * It integrates.
 *
 * -----------------------------------------------------------------------------
 *
 * GUIDANCE
 *
 * "What conversation gently supports
 * greater coherence?"
 *
 * -----------------------------------------------------------------------------
 *
 * Success is not dependency.
 *
 * Success is when the user increasingly
 * trusts their own intuition.
 *
 * Sacred Dance becomes a bridge.
 *
 * Eventually,
 * life itself becomes the Guidance.
 *
 * We are all walking each other home.
 *
 * -----------------------------------------------------------------------------
 */

import { useMirrorStore } from "../../stores/mirrorStore";

export interface AlignmentOSContext {

  dailyField: any;

  cosmic: any;

  language: string | null;

  languageContext: any;

userContext: any;

mirrorContext: any;

entityLenses: any[];

expressionProfile: any;

spiralScores: any;

activeLens: string | null;

  contextVersion: number;

  lastSignalTimestamp: number | null;

  preloadedWhispers: any[];

  ready: boolean;

}

export function buildAlignmentOSContext(): AlignmentOSContext {

  const state = useMirrorStore.getState();

return {

  dailyField: state.dailyField,

  cosmic: state.cosmic,

  language: state.language,

  languageContext: state.languageContext,

  userContext: state.userContext,

  mirrorContext: state.mirrorContext,

  entityLenses: state.entityLenses,

expressionProfile: state.expressionProfile,

spiralScores: state.spiralScores,

  activeLens: state.activeLens,

  contextVersion: state.contextVersion,

  lastSignalTimestamp: state.lastSignalTimestamp,

  preloadedWhispers: state.preloadedWhispers,

  ready: state.ready,

};

}