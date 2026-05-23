// /lib/guidance/buildFieldSnapshot.ts

export function buildFieldSnapshot(
  userField: any
) {

  if (!userField) {

    return null;
  }

  /*
   * ---------------------------------------------------------
   * 🌌 STORY
   * ---------------------------------------------------------
   */

  const emotionalTheme =

    userField?.story
      ?.emotionalTheme ||

    null;

  const relationalTheme =

    userField?.story
      ?.relationalTheme ||

    null;

  const energeticMovement =

    userField?.story
      ?.energeticMovement ||

    null;

  const healingEdge =

    userField?.story
      ?.healingEdge ||

    null;

  /*
   * ---------------------------------------------------------
   * ⚡ ENERGY
   * ---------------------------------------------------------
   */

  const dominantChakra =

    userField?.energy
      ?.dominantChakra ||

    null;

  const awarenessChakra =

    userField?.energy
      ?.awarenessChakra ||

    null;

  /*
   * ---------------------------------------------------------
   * 🌊 NERVOUS SYSTEM
   * ---------------------------------------------------------
   */

  const nervousSystemState =

    userField?.nervousSystem
      ?.state ||

    null;

  /*
   * ---------------------------------------------------------
   * 🪞 MANIFESTATIONS
   * ---------------------------------------------------------
   */

  const manifestations = (

    userField?.manifestations ||

    []
  )
    .slice(0, 5);

  /*
   * ---------------------------------------------------------
   * 🧠 PATTERNS
   * ---------------------------------------------------------
   */

  const patterns = (

    userField?.current
      ?.patterns ||

    []
  )
    .slice(0, 5);

  /*
   * ---------------------------------------------------------
   * 🌗 DISTORTIONS
   * ---------------------------------------------------------
   */

  const distortions = [

    ...(userField
      ?.distortions
      ?.feminine || []),

    ...(userField
      ?.distortions
      ?.masculine || []),
  ]

    .map((d: any) => ({

      manifestation:
        d?.manifestation ||

        null,

      statement:
        d?.statement ||

        null,

      polarity:
        d?.polarity ||

        null,
    }))

    .slice(0, 3);

  /*
   * ---------------------------------------------------------
   * 💛 RETURN SNAPSHOT
   * ---------------------------------------------------------
   */

  return {

    /*
     * -------------------------------------------------------
     * STORY
     * -------------------------------------------------------
     */

    emotionalTheme,

    relationalTheme,

    energeticMovement,

    healingEdge,

    /*
     * -------------------------------------------------------
     * ENERGY
     * -------------------------------------------------------
     */

    dominantChakra,

    awarenessChakra,

    /*
     * -------------------------------------------------------
     * NERVOUS SYSTEM
     * -------------------------------------------------------
     */

    nervousSystemState,

    /*
     * -------------------------------------------------------
     * FIELD
     * -------------------------------------------------------
     */

    manifestations,

    patterns,

    distortions,

    /*
     * -------------------------------------------------------
     * TIMESTAMP
     * -------------------------------------------------------
     */

    createdAt:
      new Date()
        .toISOString(),
  };
}