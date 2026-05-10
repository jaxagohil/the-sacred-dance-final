// lib/sacredDance/buildSacredContext.ts

import {
  buildMirrorContext,
} from "../createContextBuilder";

import {
  buildContextSnapshot,
} from "../guidance/buildContextSnapshot";

import {
  selectOracleCard,
} from "../selectOracleCard";

import {
  selectTarotCard,
} from "../selectTarotCard";

import { supabase } from "@/lib/supabase";

//
// 🌌 TYPES
//

export type BuildSacredContextInput = {

  user?: any;

  guide?: string;

  theme?: string;

  lens?: string;

  language?: string;

  userMessage?: string;

  mirror?: any;

  energy?: any;

  signals?: any[];

  livingField?: any;

  context?: {

    patterns?: string[];

    distortions?: string[];

    chakra?: string;

    cosmic?: {

      moon?: string;

      phase?: string;

      sign?: string;

      energy?: string;
    };
  };
};

export type SacredContext = {

  guide?: string;

  language?: string;

  theme?: string;

  lens?: string;

  userMessage?: string;

  //
  // 🪞 MIRROR
  //

  mirror: any;

  //
  // ⚡ ENERGY
  //

  energy: any;

  //
  // 🌌 COSMIC
  //

  cosmic: any;

  //
  // 🧘 SNAPSHOT
  //

  snapshot: any;

  //
  // 🃏 CARDS
  //

  oracle: any;

  tarot: any;

  //
  // 🌊 FIELD
  //

  livingField: {

    emotional?: any;

    relational?: any;

    spiritual?: any;

    intensity?: number;
  };

  //
  // 🪞 MIRROR PATTERNS
  //

  mirrorPatterns: any[];

  //
  // ✨ SACRED SYNTHESIS
  //

  synthesis: {

    dominantPattern?: string;

    dominantChakra?: string;

    emotionalTheme?: string;

    energeticMovement?: string;

    consciousnessState?: string;

    relationalTheme?: string;

  };

  //
  // 🌙 METADATA
  //

  metadata: {

    generatedAt: string;
  };
};

//
// ✨ MAIN
//

export async function buildSacredContext(
  input: BuildSacredContextInput
): Promise<SacredContext> {

  const {

    user,

    guide,

    theme,

    lens,

    language = "en",

    userMessage = "",

    mirror,

    energy,

    signals = [],

    livingField,

    context,

  } = input;

  //
  // 🪞 MIRROR CONTEXT
  //

  const mirrorContext =
    await buildMirrorContext({

      mirror,

      energy,

      cosmic:
        context?.cosmic,

      signals,

      activeLens:
        (lens as any) ||
        "general",
    });

  //
  // 🧘 SNAPSHOT
  //

  const snapshot =
    buildContextSnapshot({

      user,

      mirror,

      energy,

      signals,

      mirrorContext,
    });

  //
  // 🃏 ORACLE
  //

  const oracle =
    selectOracleCard({

      theme,

      energy,

      mirror,

      context,
    });

  //
  // 🔮 TAROT
  //

  const tarot =
    selectTarotCard({

      energy,

      mirror,

      context,
    });

  //
  // 🌊 FIELD SUMMARY
  //

  const fieldSummary = {

    emotional:
      livingField?.emotional,

    relational:
      livingField?.relational,

    spiritual:
      livingField?.spiritual,

    intensity:
      livingField?.intensity,
  };

  //
  // 🪞 MIRROR PATTERN DETECTION
  //

  const {
    data: allPatterns,
  } = await supabase

    .from(
      "sacred_dance_mirror_patterns"
    )

    .select("*")

    .eq(
      "active",
      true
    );

  const lowerMessage =
    userMessage.toLowerCase();

  const mirrorPatterns =
    (allPatterns ?? [])

      .filter((pattern) => {

        const phrases =
          pattern.common_phrases || [];

        const keywords =
          pattern.keywords || [];

        const phraseMatch =
          phrases.some(
            (phrase: string) =>
              lowerMessage.includes(
                phrase.toLowerCase()
              )
          );

        const keywordMatch =
          keywords.some(
            (keyword: string) =>
              lowerMessage.includes(
                keyword.toLowerCase()
              )
          );

        return (
          phraseMatch ||
          keywordMatch
        );
      })

      .sort(
        (a, b) =>
          (b.retrieval_weight || 0)
          -
          (a.retrieval_weight || 0)
      )

      .slice(0, 3);

  //
  // ✨ SYNTHESIS
  //

  const synthesis = {

    dominantPattern:
      mirrorContext?.current
        ?.dominantPattern,

    dominantChakra:
      mirrorContext?.energy
        ?.dominantChakra,

    emotionalTheme:
      mirrorContext?.story
        ?.emotionalTheme,

    energeticMovement:
      mirrorContext?.story
        ?.energeticMovement,

    consciousnessState:
      mirrorContext
        ?.consciousness
        ?.dominantMovement,

    relationalTheme:
      mirrorContext?.story
        ?.relationalTheme,
  };

  //
  // 🌌 RETURN
  //

  return {

    guide,

    language,

    theme,

    lens,

    userMessage,

    mirror:
      mirrorContext,

    energy,

    cosmic:
      mirrorContext?.cosmic,

    snapshot,

    oracle,

    tarot,

    livingField:
      fieldSummary,

    mirrorPatterns,

    synthesis,

    metadata: {

      generatedAt:
        new Date().toISOString(),
    },
  };
}