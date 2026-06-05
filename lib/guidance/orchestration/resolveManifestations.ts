// /lib/guidance/orchestration/resolveManifestations.ts

export const resolveManifestations = ({

  activePatterns = [],

  activeChakras = [],

  manifestationLibrary = [],

}: any) => {

  /*
   * ------------------------------------------------
   * 🌌 IDS
   * ------------------------------------------------
   */

  const patternKeys =

    activePatterns.map(
      (item: any) =>

        item?.key
        || item?.name
        || item?.id
    );

  const chakraKeys =

    activeChakras.map(
      (item: any) =>

        item?.id
    );

  /*
   * ------------------------------------------------
   * 🌊 MATCH
   * ------------------------------------------------
   */

  return manifestationLibrary

    .filter((row: any) => {

      const patternMatch =

        patternKeys.includes(
          row?.pattern_key
        );

      const chakraMatch =

        chakraKeys.includes(
          row?.chakra_key
        );

      return (
        patternMatch
        || chakraMatch
      );
    })

    /*
     * ------------------------------------------------
     * 🌿 WEIGHT
     * ------------------------------------------------
     */

    .map((row: any) => ({

      ...row,

      weight:

        (
          row?.energetic_weight
          || 0.5
        )

        +

        (
          row?.spiral_pressure
          || 0
        ),
    }))

    /*
     * ------------------------------------------------
     * 🌌 SORT
     * ------------------------------------------------
     */

    .sort(
      (
        a: any,
        b: any
      ) => (

        (b?.weight || 0)

        -

        (a?.weight || 0)
      )
    )

    /*
     * ------------------------------------------------
     * 🌊 LIMIT
     * ------------------------------------------------
     */

    .slice(0, 4);
};