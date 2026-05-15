// /lib/context/buildUserContext.ts

// --------------------------------------------------
// 🧠 SACRED DANCE USER CONTEXT
// --------------------------------------------------
//
// RESPONSIBLE FOR:
//
// ✅ loading DB truth
// ✅ loading patterns table
// ✅ loading chakra meanings
// ✅ loading lens keywords
// ✅ loading profile signals
// ✅ loading recurring cycles
// ✅ loading distortions
// ✅ calculating dominant patterns
// ✅ calculating awareness chakra
// ✅ preparing observable behavioural evidence
// ✅ preparing reality layers
// ✅ preparing mirror-ready emotional field
//
// ❌ NOT responsible for prose
// ❌ NOT responsible for mirror writing
// ❌ NOT responsible for emotional explanations
//
// --------------------------------------------------

import { supabase } from "../../services/supabase";

import {
  getEnergyFromSignals,
} from "../energy/getEnergyFromSignals";

import {
  interpretMirror,
} from "../interpretMirror";

import {
  getCosmicMessage,
} from "../cosmic/getCosmicMessage";

import {
  buildFullChakraScores,
  getAwarenessChakra,
} from "../energy";

import {
  buildMirrorContext,
} from "./buildMirrorContext";

type BuildUserContextParams = {
  userId: string;
  source?: string;
  activeLens?: string;
};

const unique = (arr: any[]) =>
  [...new Set(arr)].filter(Boolean);

export async function buildUserContext({
  userId,
  source = "system",
  activeLens = "general",
}: BuildUserContextParams) {

  // --------------------------------------------------
  // 👤 PROFILE
  // --------------------------------------------------

  const { data: profile } =
    await supabase

      .from("profiles")

      .select("*")

      .eq("user_id", userId)

      .maybeSingle();

  // --------------------------------------------------
  // 🌊 SIGNALS
  // --------------------------------------------------

  const {
    data: signals,
    error,
  } = await supabase

    .from("signals")

    .select("*")

    .eq("user_id", userId)

    .order("created_at", {
      ascending: false,
    })

    .limit(20);

  if (
    error ||
    !signals ||
    signals.length === 0
  ) {

    return {

      ready: false,

      source,

      profile:
        profile || null,

      signals: [],

      energy: null,

      mirror: null,

      cosmic: null,

      dailyField: null,

      context: null,

      chakraPatterns: {},

      chakraScores: {},

      awarenessChakra: null,

      dominantChakra: null,

      activePatterns: [],

      recurringPatterns: [],

      dominantPattern: null,

      behaviours: [],

      distortions: {

        masculine: [],

        feminine: [],
      },

      observableScenes: [],

      cycles: [],

      realityLayers: {},
    };
  }

  // --------------------------------------------------
  // ⚡ ENERGY ENGINE
  // --------------------------------------------------

  const energyResult =
    await getEnergyFromSignals(
      signals
    );

  if (
    !energyResult ||
    !energyResult.patterns
  ) {

    return {

      ready: false,

      source,

      profile:
        profile || null,

      signals,

      energy: null,

      mirror: null,

      cosmic: null,

      dailyField: null,

      context: null,
    };
  }

  // --------------------------------------------------
  // 🌊 PATTERNS
  // --------------------------------------------------

  const patterns =
    energyResult.patterns || [];

  const activePatterns =
    patterns.map(
      (p: any) =>
        p?.id || p?.name
    );

  const dominantPattern =
    activePatterns?.[0] || null;

  const recurringPatterns =

    activePatterns.filter(
      (p: any, i: number, arr: any[]) =>

        arr.indexOf(p) !== i
    );

  // --------------------------------------------------
  // 🧬 PATTERN DEFINITIONS
  // --------------------------------------------------

  const { data: patternDefinitions } =
    await supabase

      .from("patterns")

      .select("*")

      .in(
        "id",
        unique(activePatterns)
      );

  // --------------------------------------------------
  // 🪞 MIRROR
  // --------------------------------------------------

  const mirror =
    interpretMirror(
      patterns
    );

  // --------------------------------------------------
  // 🌌 COSMIC
  // --------------------------------------------------

  const cosmicResult =
    await getCosmicMessage({

      energy:
        energyResult.energy,

      patterns,
    });

  // --------------------------------------------------
  // 🧿 DISTORTIONS
  // --------------------------------------------------

  const masculine: any[] = [];

  const feminine: any[] = [];

  const allBehaviours: any[] = [];

  signals.forEach((s) => {

    const behaviours =
      s?.ai_behaviours || [];

    behaviours.forEach(
      (b: any) => {

        if (!b) return;

        allBehaviours.push(b);

        if (
          b.side ===
          "masculine"
        ) {

          masculine.push(b);
        }

        if (
          b.side ===
          "feminine"
        ) {

          feminine.push(b);
        }
      }
    );
  });

  const distortions = {

    masculine:
      masculine.slice(0, 5),

    feminine:
      feminine.slice(0, 5),
  };

// --------------------------------------------------
// 🪞 LENS MEMORIES
// --------------------------------------------------

const allLensEntries = [

  ...signals.flatMap(
    (s) =>
      s?.ai_lens?.people || []
  ),

  ...signals.flatMap(
    (s) =>
      s?.ai_lens?.places || []
  ),

  ...signals.flatMap(
    (s) =>
      s?.ai_lens?.things || []
  ),
];

// --------------------------------------------------
// 👁 OBSERVABLE SCENES
// --------------------------------------------------

const observableScenes =
  unique(

    allLensEntries

      .map(
        (l: any) =>
          l?.observable_scene
      )

      .filter(Boolean)
  ).slice(0, 20);

// --------------------------------------------------
// 🛡 COPING STRATEGIES
// --------------------------------------------------

const recurringCopingStrategies =
  unique(

    allLensEntries

      .map(
        (l: any) =>
          l?.coping_strategy
      )

      .filter(Boolean)
  );

// --------------------------------------------------
// 🌊 MANIFESTATIONS
// --------------------------------------------------

const recurringManifestations =
  unique(

    allLensEntries

      .map(
        (l: any) =>
          l?.manifestation
      )

      .filter(Boolean)
  );

// --------------------------------------------------
// 🫀 BODY RESPONSES
// --------------------------------------------------

const recurringBodyResponses =
  unique(

    allLensEntries

      .map(
        (l: any) =>
          l?.body_response
      )

      .filter(Boolean)
  );

// --------------------------------------------------
// 🪞 MIRROR PROMPTS
// --------------------------------------------------

const recurringMirrorPrompts =
  unique(

    allLensEntries

      .map(
        (l: any) =>
          l?.mirror_prompt
      )

      .filter(Boolean)
  );

  // --------------------------------------------------
  // 🔁 CYCLES
  // --------------------------------------------------

  const cycles =
    recurringPatterns.map(
      (patternId: string) => {

        const definition =
          patternDefinitions?.find(
            (p: any) =>
              p.id === patternId
          );

        return {

          id:
            patternId,

          name:
            definition?.name,

          description:
            definition?.description,

          soulLesson:
            definition?.soul_lesson,

          integration:
            definition?.integration,

          fear:
            definition?.fear,

          gift:
            definition?.gift,
        };
      }
    );

  // --------------------------------------------------
  // 🧠 CHAKRAS
  // --------------------------------------------------

  const chakraPatterns =
    energyResult
      ?.chakraPatterns || {};

  let chakraScores: any = {};

  let awarenessChakra: any =
    null;

  let dominantChakra: any =
    null;

  if (
    energyResult.energy &&
    energyResult.energy.chakras
  ) {

    chakraScores =
      buildFullChakraScores(

        energyResult.energy
          .chakras
      );

    awarenessChakra =
      getAwarenessChakra(
        chakraScores
      );

    dominantChakra =
      energyResult.energy
        ?.dominant_chakra;
  }

  // --------------------------------------------------
  // 🌍 LANGUAGE
  // --------------------------------------------------

  const language =
    profile?.language || "en";

  // --------------------------------------------------
  // 🧠 REALITY LAYERS
  // --------------------------------------------------

  const realityLayers = {

physical: {

  observableScenes,

  recurringBodyResponses,

  nervousSystemState:

    energyResult.energy
      ?.contraction > 0.7

      ? "protective"

      : "open",

  contraction:
    energyResult.energy
      ?.contraction,

  expansion:
    energyResult.energy
      ?.expansion,
},

emotional: {

  activePatterns,

  recurringPatterns,

  dominantPattern,

  recurringManifestations,

  recurringCopingStrategies,

  recurringMirrorPrompts,

  distortions,
},

    energetic: {

      dominantChakra,

      awarenessChakra,

      chakraScores,

      chakraPatterns,
    },

    soul: {

      soulLessons:

        patternDefinitions?.map(
          (p: any) =>
            p?.soul_lesson
        ) || [],

      gifts:

        patternDefinitions?.map(
          (p: any) =>
            p?.gift
        ) || [],

      integrations:

        patternDefinitions?.map(
          (p: any) =>
            p?.integration
        ) || [],
    },
  };

  // --------------------------------------------------
  // 🧠 CONTEXT
  // --------------------------------------------------

  const context =
    await buildMirrorContext({

      mirror,

      energy:
        energyResult.energy,

      cosmic:
        cosmicResult.cosmic,

      languageContext: {
        code: language,
      },

      signals,

      activeLens,
    });

  // --------------------------------------------------
  // ✨ FINAL
  // --------------------------------------------------

  return {

    ready: true,

    source,

    activeLens,

    // 👤 PROFILE
    profile,

    language,

    childhoodSignals:

      profile
        ?.childhood_signals || {},

    // 🌊 SIGNALS
    signals,

    // ⚡ ENERGY
    energy:
      energyResult.energy,

    chakraPatterns,

    chakraScores,

    dominantChakra,

    awarenessChakra,

    // 🌊 PATTERNS
    activePatterns,

    recurringPatterns,

    dominantPattern,

    patternDefinitions,

    // 🧿 BEHAVIOURS
    behaviours:
      allBehaviours,

    distortions,

    observableScenes,

// 🪞 LONGITUDINAL MEMORY

recurringManifestations,

recurringCopingStrategies,

recurringBodyResponses,

recurringMirrorPrompts,

    // 🔁 CYCLES
    cycles,

    // 🌌 COSMIC
    cosmic:
      cosmicResult.cosmic,

    cosmicMessage:
      cosmicResult.aiMessage,

    dailyField:
      cosmicResult.dailyField,

    // 🪞 MIRROR
    mirror,

    // 🌍 REALITY
    realityLayers,

    // 🧠 CONTEXT
    context,
  };
}