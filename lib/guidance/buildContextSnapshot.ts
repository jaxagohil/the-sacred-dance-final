export function buildContextSnapshot(
  contextState: any
) {

  if (!contextState) {
    return null;
  }

  //
  // 🧿 DISTORTION
  //

  let dominantDistortion =
    null;

  if (
    contextState
      ?.distortions
      ?.feminine?.[0]
  ) {
    dominantDistortion = {

      side:
        "feminine",

      statement:

        contextState
          .distortions
          .feminine[0]
          .statement,
    };
  }

  if (
    contextState
      ?.distortions
      ?.masculine?.[0]
  ) {
    dominantDistortion = {

      side:
        "masculine",

      statement:

        contextState
          .distortions
          .masculine[0]
          .statement,
    };
  }

  //
  // ✨ RETURN
  //

  return {

    awarenessChakra:

      contextState
        ?.awarenessChakra
        ?.chakra || null,

    activeLens:

      contextState
        ?.activeLens || null,

    energeticState:

      contextState
        ?.energy
        ?.state || null,

    dominantDistortion,
  };
}