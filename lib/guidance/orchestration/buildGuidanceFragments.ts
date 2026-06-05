export const buildGuidanceFragments = ({

  fragments = [],

  silenceWindow = 5000,

  fragmentDuration = 10000,

  orchestrationIntensity = 0.5,

}: any) => {

  return fragments

    .filter(
      (item: any) =>
        item?.text
    )

    .map(

      (
        item: any,
        index: number
      ) => ({

        id:

          item?.id
          || `fragment_${index}`,

        role:
          item?.role,

delay:

  2200 +

  (
    (
      fragmentDuration
      + silenceWindow
    )

    * index
  ),

        duration:
          fragmentDuration,

        cinematic:
          true,

        fade:
          true,

        fragment: {

          text:

            item
              ?.text
              ?.trim?.(),

          guide:
            item?.guide,

          intensity:
            orchestrationIntensity,
        },
      })
    );
};