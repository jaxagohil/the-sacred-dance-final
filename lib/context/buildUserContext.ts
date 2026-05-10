// /lib/context/buildUserContext.ts

import { supabase } from "../../services/supabase";

import { getEnergyFromSignals } from "../energy/getEnergyFromSignals";

import { interpretMirror } from "../interpretMirror";

import { getCosmicMessage } from "../getCosmicMessage";

import {
    buildFullChakraScores,
    getAwarenessChakra,
} from "../energy";

import { buildMirrorContext } from "../createContextBuilder";

type BuildUserContextParams = {
  userId: string;

  source?: string;

  activeLens?: string;
};

export async function buildUserContext({
  userId,
  source = "system",
  activeLens = "general",
}: BuildUserContextParams) {
  //
  // 👤 PROFILE
  //

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  //
  // 🌊 SIGNALS
  //

  const { data: signals, error } = await supabase
    .from("signals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    })
    .limit(20);

  if (error || !signals || signals.length === 0) {
    return {
      ready: false,

      source,

      profile: profile || null,

      signals: [],

      energy: null,

      mirror: null,

      cosmic: null,

      context: null,

      chakraPatterns: {},

      distortions: {
        masculine: [],
        feminine: [],
      },

      awarenessChakra: null,
    };
  }

  //
  // ⚡ ENERGY
  //

  const energyResult =
    await getEnergyFromSignals(signals);

  if (
    !energyResult ||
    !energyResult.patterns
  ) {
    return {
      ready: false,

      source,

      profile: profile || null,

      signals,

      energy: null,

      mirror: null,

      cosmic: null,

      context: null,

      chakraPatterns: {},

      distortions: {
        masculine: [],
        feminine: [],
      },

      awarenessChakra: null,
    };
  }

  //
  // 🌊 PATTERNS
  //

  const patterns =
    energyResult.patterns;

  const chakraPatterns =
    energyResult.chakraPatterns || {};

  //
  // 🪞 MIRROR
  //

  const mirror =
    interpretMirror(patterns);

  //
  // 🌌 COSMIC
  //

  const cosmicResult =
    await getCosmicMessage({
      energy: energyResult.energy,
      patterns,
    });

  //
  // 🧿 DISTORTIONS
  //

  const masculine: any[] = [];

  const feminine: any[] = [];

  signals.forEach((s) => {
    const behaviours =
      s.ai_behaviours || [];

    behaviours.forEach((b: any) => {
      if (!b?.statement) return;

      if (b.side === "masculine") {
        masculine.push(b);
      }

      if (b.side === "feminine") {
        feminine.push(b);
      }
    });
  });

  const distortions = {
    masculine: masculine.slice(0, 3),

    feminine: feminine.slice(0, 3),
  };

  //
  // 🧠 CHAKRAS
  //

  let chakraScores: any = {};

  let awarenessChakra: any = null;

  if (
    energyResult.energy &&
    energyResult.energy.chakras
  ) {
    chakraScores =
      buildFullChakraScores(
        energyResult.energy.chakras
      );

    awarenessChakra =
      getAwarenessChakra(
        chakraScores
      );
  }

  //
  // 🧠 CONTEXT
  //

  const context =
    await buildMirrorContext({
      mirror,

      energy:
        energyResult.energy,

      cosmic:
        cosmicResult.cosmic,

      signals,

      activeLens,
    });

  //
  // ✨ RETURN
  //

  return {
    ready: true,

    source,

    activeLens,

    //
    // 👤 USER
    //

    profile: profile || null,

    //
    // 🌊 SIGNALS
    //

    signals,

    //
    // ⚡ ENERGY
    //

    energy:
      energyResult.energy,

    chakraPatterns,

    chakraScores,

    awarenessChakra,

    //
    // 🪞 MIRROR
    //

    mirror,

    distortions,

    //
    // 🌌 COSMIC
    //

    cosmic:
      cosmicResult.cosmic,

    cosmicMessage:
      cosmicResult.aiMessage,

    //
    // 🧠 CONTEXT
    //

    context,
  };
}