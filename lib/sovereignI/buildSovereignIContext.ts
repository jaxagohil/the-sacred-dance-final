// /lib/sovereignI/buildSovereignIContext.ts

export type SovereignIContextInput = {
  alignmentContext: any;
  lifePicture?: any;
  userInput: string;
};

export function buildSovereignIContext({
  alignmentContext,
  lifePicture,
  userInput,
}: SovereignIContextInput) {

  /*
   * --------------------------------------------------
   * ✦ SOVEREIGN I CONTEXT
   * --------------------------------------------------
   *
   * Sovereign I does not create another field.
   *
   * It receives:
   *
   * 1. What the human has chosen to create
   *    / their Life Picture
   *
   * 2. What the human is bringing now
   *
   * 3. The existing Living Field
   *
   * 4. Existing Alignment OS intelligence
   *
   * Sovereign I then has its own intelligence
   * for helping the human move from awareness
   * toward conscious creation.
   *
   * --------------------------------------------------
   */

  return {

    /*
     * 👤 HUMAN INPUT
     */

    humanInput:
      userInput,

    /*
     * 🌱 LIFE PICTURE
     */

    lifePicture:
      lifePicture || null,

    /*
     * 🌊 EXISTING LIVING FIELD
     *
     * This is the context already built by
     * buildUserContext() → buildMirrorContext().
     *
     * Do not rebuild it here.
     */

    livingField:
      alignmentContext
        ?.mirrorContext || null,

    /*
     * 👁 EXISTING LENSES
     */

    entityLenses:
      alignmentContext
        ?.entityLenses || [],

    /*
     * 🧬 EXPRESSION
     */

    expressionProfile:
      alignmentContext
        ?.expressionProfile || null,

    /*
     * 🌀 SPIRAL
     */

    spiralScores:
      alignmentContext
        ?.spiralScores || null,

    /*
     * ⚡ USER FIELD
     *
     * Keep the existing user context available,
     * but do not create another interpretation of it.
     */

    userContext:
      alignmentContext
        ?.userContext || null,

    /*
     * 🌌 COSMIC
     */

    cosmic:
      alignmentContext
        ?.cosmic || null,

    /*
     * 🌿 ALIGNMENT OS
     */

    alignmentOS: {

      activeLens:
        alignmentContext
          ?.activeLens || null,

      language:
        alignmentContext
          ?.language || null,

      languageContext:
        alignmentContext
          ?.languageContext || null,
    },

  };
}