// --------------------------------------------------
// ⚡ CREATE SIGNAL FROM INTERPRETATION
// --------------------------------------------------

import { supabase } from "../services/supabase";

import { createSignal } from "./signals";

import { enrichSpiralState } from "../lib/spiral/enrichSpiralState";

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const average = (
  values: number[]
) => {

  if (!values.length)
    return 0;

  return (

    values.reduce(
      (a, b) => a + b,
      0
    ) /

    values.length
  );
};

const weightedAverage = (
  items: any[],
  key: string
) => {

  if (!items.length)
    return 0;

  let totalWeight = 0;

  let total = 0;

  items.forEach((item) => {

    const occurrences =
      item.occurrences || 1;

    total +=
      (item[key] || 0) *
      occurrences;

    totalWeight +=
      occurrences;
  });

  return totalWeight === 0

    ? 0

    : total / totalWeight;
};

// --------------------------------------------------
// 🚀 MAIN
// --------------------------------------------------

export async function createSignalFromInterpretation({

  reflection,

  userId,

  interpretation,

  behaviours,

  currentPattern,

  enrichedEmotions,

  source,

  baselineType,

  signalDepth,

  language,

  text,

  reflection_summary,

}: any) {

  // --------------------------------------------------
  // 🪞 CURRENT PATTERN
  // --------------------------------------------------

  const patternKey =
    currentPattern?.id;

  const patternScore =
    Number(
      currentPattern?.score || 0
    );

  const spectrumSide =

    patternScore < 0

      ? "left"

      : patternScore > 0

      ? "right"

      : "center";

  // --------------------------------------------------
// 🧠 ACTIVE BEHAVIOURS
// --------------------------------------------------

const activeBehaviours =

  currentPattern
    ?.behaviours ||

  behaviours;    

  // --------------------------------------------------
  // ⚡ ENERGY SYNTHESIS
  // --------------------------------------------------

const feminine =
  weightedAverage(
    activeBehaviours,
    "feminine"
  );

  const masculine =
  weightedAverage(
    activeBehaviours,
    "masculine"
  );

  const contraction =
  weightedAverage(
    activeBehaviours,
    "contraction"
  );

  const expansion =
  weightedAverage(
    activeBehaviours,
    "expansion"
  );

  // --------------------------------------------------
  // 🌈 CHAKRA MANIFESTATIONS
  // --------------------------------------------------

  const {

    data: chakraManifestations,

  } = await supabase

    .from(
      "pattern_chakra_manifestations"
    )

    .select("*")

    .eq(
      "pattern_key",
      patternKey
    )

    .eq(
      "language",
      language
    );

  // --------------------------------------------------
  // 🌈 CHAKRA MAP
  // --------------------------------------------------

  const chakraMap:
    Record<string, number>
      = {};

  chakraManifestations?.forEach(
    (m: any) => {

      const chakra =
        m.chakra_key;

      const weight =
        Number(m.weight || 0);

      chakraMap[chakra] =

        (
          chakraMap[
            chakra
          ] || 0
        ) + weight;
    }
  );

  // --------------------------------------------------
  // 🌈 NORMALIZE CHAKRAS
  // --------------------------------------------------

  const chakraTotal =

    Object.values(
      chakraMap
    ).reduce(
      (a, b) => a + b,
      0
    ) || 1;

  const normalizedChakras:
    Record<string, number>
      = {};

  Object.entries(
    chakraMap
  ).forEach(([k, v]) => {

    normalizedChakras[k] =
      Number(
        (
          v / chakraTotal
        ).toFixed(3)
      );
  });

  // --------------------------------------------------
  // 🌈 PRIMARY CHAKRA
  // --------------------------------------------------

  const primaryChakra =

    Object.entries(
      normalizedChakras
    )

      .sort(
        (a, b) =>
          Number(b[1]) -
          Number(a[1])
      )[0]?.[0] ||

    null;

  // --------------------------------------------------
  // ⚡ DISTORTIONS
  // --------------------------------------------------


const distorted =
  activeBehaviours.filter(
      (b: any) =>
        b.quality ===
        "distorted"
    );

const integrated =
  activeBehaviours.filter(
      (b: any) =>
        b.quality ===
        "divine"
    );

  // --------------------------------------------------
  // ⚡ POLARITY
  // --------------------------------------------------

  let polarity_score = 0;

  if (
    masculine > feminine
  ) {

    polarity_score =
      Number(
        (
          masculine -
          feminine
        ).toFixed(3)
      );
  }

  if (
    feminine > masculine
  ) {

    polarity_score =
      Number(
        (
          -(
            feminine -
            masculine
          )
        ).toFixed(3)
      );
  }

  // --------------------------------------------------
  // ⚡ INTEGRATION SCORE
  // --------------------------------------------------

  const totalQualities =

    distorted.length +
    integrated.length;

  const integration_score =

    totalQualities === 0

      ? 0

      : Number(
          (
            integrated.length /
            totalQualities
          ).toFixed(3)
        );

  // --------------------------------------------------
  // ⚡ NERVOUS SYSTEM ACTIVATION
  // --------------------------------------------------

  const nervous_system_activation =

    Number(
      (
        (
          contraction +

          (
            interpretation
              ?.consciousness_movement
              ?.reactivity || 0
          )
        ) / 2
      ).toFixed(3)
    );

  // --------------------------------------------------
  // ⚡ EMBODIMENT SCORE
  // --------------------------------------------------

  const embodiment_score =

    Number(
      (
        interpretation
          ?.consciousness_movement
          ?.embodiment || 0
      ).toFixed(3)
    );

  // --------------------------------------------------
  // ⚡ DISTORTIONS
  // --------------------------------------------------

  const distortions = {

    distorted,

    integrated,

    contractionLevel:
      contraction,

    expansionLevel:
      expansion,

    dominantPolarity:

      feminine >
      masculine

        ? "feminine"

        : "masculine",
  };

  // --------------------------------------------------
  // ⚡ ENERGY
  // --------------------------------------------------

  const energy = {

    feminine,

    masculine,

    contraction,

    expansion,

    chakras:
      normalizedChakras,

    dominant_chakra:
      primaryChakra,
  };

  // --------------------------------------------------
  // 🪞 LENS MAPPINGS
  // --------------------------------------------------

  const {

    data: lensMappings,

  } = await supabase

    .from(
      "pattern_lens_weights"
    )

    .select("*")

    .eq(
      "pattern_key",
      patternKey
    )

    .eq(
      "language",
      language
    );

  // --------------------------------------------------
  // 🌈 LENS SCORES
  // --------------------------------------------------

  const lensScores:
    Record<string, number>
      = {

        people: 0,

        places: 0,

        things: 0,
      };

  lensMappings?.forEach(
    (m: any) => {

      lensScores[
        m.lens
      ] = Number(
        m.weight || 0
      );
    }
  );

 // --------------------------------------------------
// 🌍 REALITY LAYERS
// --------------------------------------------------

const realityLayers = {

  physical:
    weightedAverage(
      activeBehaviours,
      "physical_weight"
    ),

  emotional:
    weightedAverage(
      activeBehaviours,
      "emotional_weight"
    ),

  energetic:
    weightedAverage(
      activeBehaviours,
      "energetic_weight"
    ),

  consciousness:
    weightedAverage(
      activeBehaviours,
      "consciousness_weight"
    ),
};

// --------------------------------------------------
// 🌀 SPIRAL ENRICHMENT
// --------------------------------------------------

const spiralData =

  enrichSpiralState({

    behaviours:
      activeBehaviours,

    patterns:
      [currentPattern],

    reality_layers:
      realityLayers,
  });
  // --------------------------------------------------
  // ✨ CONSCIOUSNESS
  // --------------------------------------------------

  const consciousnessMovement =
    interpretation
      ?.consciousness_movement || {

      reactivity: 0.5,

      awareness: 0.5,

      responsibility: 0.5,

      embodiment: 0.5,

      integration: 0.5,
    };

  // --------------------------------------------------
  // 🌈 STATES
  // --------------------------------------------------

  let dominant_state =
    "processing";

  if (contraction > 0.7) {

    dominant_state =
      "contracted";
  }

  if (expansion > 0.7) {

    dominant_state =
      "expansive";
  }

  let nervous_system_state =
    "processing";

  if (contraction > 0.75) {

    nervous_system_state =
      "protective";
  }

  if (expansion > 0.7) {

    nervous_system_state =
      "open";
  }

  let energetic_direction =
    "inward";

  if (
    dominant_state ===
    "expansive"
  ) {

    energetic_direction =
      "outward";
  }

  // --------------------------------------------------
  // 🩷 INTEGRATION NEED
  // --------------------------------------------------

  const emotionNeed =
    enrichedEmotions[0]
      ?.core_need;

  const behaviourNeed =
    activeBehaviours.find(
      (b: any) =>
        b.nervous_system_need
    )?.nervous_system_need;

  const integration_needed =

    emotionNeed ||

    behaviourNeed ||

    "self awareness";

  // --------------------------------------------------
  // 🪞 LENS MEMORY
  // --------------------------------------------------

  const shapeLensEntries = (
    lens: string
  ) =>

    lensMappings

      ?.filter(
        (m: any) =>
          m.lens === lens
      )

      .map((m: any) => ({

        lens,

        pattern_key:
          m.pattern_key,

        weight:
          m.weight,

        manifestation:
          m.manifestation,

        observable_scene:
          m.observable_scene,

        body_response:
          m.body_response,

        coping_strategy:
          m.coping_strategy,

        relational_effect:
          m.relational_effect,

        mirror_prompt:
          m.mirror_prompt,

        integrated_expression:
          m.integrated_expression,

        source_reflection:
          text || null,

        source_summary:
          reflection_summary || null,

        source_created_at:
          new Date().toISOString(),

        source_signal_depth:
          signalDepth || 1,

        source_type:
          source || "unknown",
      })) || [];

  // --------------------------------------------------
  // 🧠 AI LENS
  // --------------------------------------------------

  const aiLens = {

    people:
      shapeLensEntries(
        "people"
      ),

    places:
      shapeLensEntries(
        "places"
      ),

    things:
      shapeLensEntries(
        "things"
      ),
  };

  // --------------------------------------------------
  // ⚡ CREATE SIGNAL
  // --------------------------------------------------

  const signal =
    await createSignal({

      reflection_id:
        reflection.id,

      user_id:
        userId,

      sourcetype:
        source || "unknown",

      signal_origin:
        source || "reflection",

      baseline_type:
        baselineType || null,

      signal_depth:
        signalDepth,

      temporal_weight:
        1,

ai_behaviours:
  activeBehaviours,

      ai_patterns: [
        currentPattern,
      ],

      ai_lens:
        aiLens,

      primary_pattern:
        patternKey,

      pattern_score:
        patternScore,

      spectrum_side:
        spectrumSide,

      primary_chakra:
        primaryChakra,

      chakra_scores:
        normalizedChakras,

      lens_scores:
        lensScores,

      ai_confidence:

        interpretation
          .ai_confidence ??

        null,

      ai_intensity:

        interpretation
          .intensity ??

        null,

      energy,

      distortions,

reality_layers:
  realityLayers,

      consciousness_movement:
        consciousnessMovement,

      dominant_state,

      energetic_direction,

      nervous_system_state,

      integration_needed,

      polarity_score,

      integration_score,

      embodiment_score,

      nervous_system_activation,

      // 🌀 SPIRAL

spiral_state:
  spiralData.spiral_state,

spiral_direction:
  spiralData.spiral_direction,

dominant_pole:
  spiralData.dominant_pole,

integration_score_v2:
  spiralData.integration_score,

left_pole_score:
  spiralData.left_pole_score,

right_pole_score:
  spiralData.right_pole_score,

dominant_pattern_v2:
  spiralData.dominant_pattern,

chakra_activation:
  spiralData.chakra_activation,
    });

  // --------------------------------------------------
  // ✅ DONE
  // --------------------------------------------------

  return {

    signal,

    energy,

    distortions,

    realityLayers,

    spiralData,

    aiLens,
  };
}