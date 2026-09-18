export function buildGuidanceMirrorWorld(
  mirrorContext: any
) {

  const current =
    mirrorContext?.current || {};

  const lensContexts =
    mirrorContext?.lensContexts || {};

  const selectLens = (
    lens: any = {}
  ) => ({

    patternNarratives:
      lens?.patternNarratives || [],

    mirrorThreads:
      lens?.mirrorThreads || [],

    reflectionEvidence:
      lens?.reflectionEvidence || [],

    manifestationThreads:
      lens?.manifestationThreads || [],

    observableSceneThreads:
      lens?.observableSceneThreads || [],

    recognitionLevel:
      lens?.recognitionLevel || null,

    alignmentState:
      lens?.alignmentState || null,

    symbolicThemes:
      lens?.symbolicThemes || [],

    emotionalThemes:
      lens?.emotionalThemes || [],

    entityEvidence:
      lens?.entityEvidence || [],
  });

  return {

    current: {

      emotions:
        current?.emotions || [],

      dominantPattern:
        current?.dominantPattern || null,

      activatedPatterns:
        current?.activatedPatterns || [],

      contraction:
        current?.contraction ?? 0,

      expansion:
        current?.expansion ?? 0,

      dominantChakra:
        current?.dominantChakra || null,

      awarenessChakra:
        current?.awarenessChakra || null,

      nervousSystemState:
        current?.nervousSystemState || "regulated",

      oracleCard:
        current?.oracleCard || null,
    },

    evolution:
      mirrorContext?.evolution || {},

    energy:
      mirrorContext?.energy || {},

    consciousness:
      mirrorContext?.consciousness || {},

    story:
      mirrorContext?.story || {},

    voice:
      mirrorContext?.voice || {},

    cosmic:
      mirrorContext?.cosmic || {},

    orchestration:
  mirrorContext?.orchestrationContext || {}, 

    lenses: {

      people:
        selectLens(
          lensContexts?.people
        ),

      places:
        selectLens(
          lensContexts?.places
        ),

      things:
        selectLens(
          lensContexts?.things
        ),
    },
  };
}