import { supabase } from "@/lib/supabase";

import {
  buildCardInterpretation,
} from "./interpretation/buildCardInterpretation";

import {
  buildLensInterpretation,
} from "./interpretation/buildLensInterpretation";

import {
  buildGuideInterpretation,
} from "./interpretation/buildGuideInterpretation";

import {
  buildLanguageField,
} from "./language/buildLanguageField";

type BuildSacredContextInput = {

  userMessage: string;

  themes?: string[];

  chakras?: string[];

  emotionalFrequencies?: string[];

  guideKey?: string;

  lens?: string;

  oracle?: any;

  tarot?: any;

  limitPrinciples?: number;

  limitLanguage?: number;

  limitFragments?: number;
};

type SacredContextField = {

  guide: any | null;

  principles: any[];

  language: any[];

  languageField: {

    emotionalQualities: string[];

    vocabulary: string[];

    phrases: string[];

    energeticTone: string;
  };

  promptPressures: any[];

  fragments: any[];

  themes: string[];

  chakras: string[];

  emotionalFrequencies: string[];

  lens?: string;

  oracle?: any;

  tarot?: any;

  interpretations: {

    cards: any;

    lens: any;

    guide: any;
  };

  systemTone: string;

  orchestrationNotes: {

    dominantTheme?: string;

    dominantChakra?: string;

    emotionalState?: string;
  };
};

export async function buildSacredContext({

  userMessage,

  themes = [],

  chakras = [],

  emotionalFrequencies = [],

  guideKey,

  lens = "general",

  oracle,

  tarot,

  limitPrinciples = 3,

  limitLanguage = 4,

  limitFragments = 5,

}: BuildSacredContextInput): Promise<SacredContextField> {

  //
  // STEP 1 — GUIDE
  //

  let guide = null;

  if (guideKey) {

    const { data } =
      await supabase

        .from(
          "sacred_dance_guides"
        )

        .select("*")

        .eq(
          "key",
          guideKey
        )

        .eq(
          "active",
          true
        )

        .single();

    guide = data;
  }

  //
  // STEP 2 — PRINCIPLES
  //

  let principlesQuery =
    supabase

      .from(
        "sacred_dance_principles"
      )

      .select("*")

      .eq(
        "active",
        true
      )

      .order(
        "importance",
        {
          ascending: false,
        }
      )

      .limit(
        limitPrinciples
      );

  if (themes.length > 0) {

    principlesQuery =
      principlesQuery.in(
        "category",
        themes
      );
  }

  const {
    data: principles,
  } = await principlesQuery;

  //
  // STEP 3 — LANGUAGE
  //

  let languageQuery =
    supabase

      .from(
        "sacred_dance_language"
      )

      .select("*")

      .eq(
        "active",
        true
      )

      .order(
        "retrieval_weight",
        {
          ascending: false,
        }
      )

      .limit(
        limitLanguage
      );

  if (guideKey) {

    languageQuery =
      languageQuery.contains(
        "guide_affinity",
        [guideKey]
      );
  }

  const {
    data: language,
  } = await languageQuery;

  //
  // STEP 3B — PROMPT PRESSURES
  //

  const {
    data: promptPressures,
  } = await supabase

    .from(
      "sacred_dance_prompt_pressures"
    )

    .select("*")

    .eq(
      "active",
      true
    )

    .order(
      "emotional_weight",
      {
        ascending: false,
      }
    );

  //
  // STEP 4 — CONTEXT FRAGMENTS
  //

  let fragmentsQuery =
    supabase

      .from(
        "sacred_dance_context_fragments"
      )

      .select("*")

      .eq(
        "active",
        true
      )

      .order(
        "retrieval_weight",
        {
          ascending: false,
        }
      )

      .limit(
        limitFragments
      );

  //
  // Theme filtering
  //

  if (themes.length > 0) {

    fragmentsQuery =
      fragmentsQuery.overlaps(
        "themes",
        themes
      );
  }

  //
  // Chakra filtering
  //

  if (chakras.length > 0) {

    fragmentsQuery =
      fragmentsQuery.overlaps(
        "chakras",
        chakras
      );
  }

  //
  // Emotional filtering
  //

  if (
    emotionalFrequencies.length > 0
  ) {

    fragmentsQuery =
      fragmentsQuery.overlaps(
        "emotional_frequencies",
        emotionalFrequencies
      );
  }

  //
  // Guide filtering
  //

  if (guideKey) {

    fragmentsQuery =
      fragmentsQuery.overlaps(
        "guide_affinities",
        [guideKey]
      );
  }

  const {
    data: fragments,
  } = await fragmentsQuery;

  //
  // STEP 5 — INTERPRETATIONS
  //

  const cardInterpretation =
    buildCardInterpretation({

      oracle,

      tarot,

      chakra:
        chakras[0],

      theme:
        themes[0],

      lens,
    });

  const lensInterpretation =
    buildLensInterpretation({

      lens,

      patterns:
        themes,

      distortions:
        emotionalFrequencies,
    });

  const guideInterpretation =
    buildGuideInterpretation({

      guide:
        guideKey,

      chakra:
        chakras[0],

      theme:
        themes[0],
    });

  //
  // STEP 5B — LANGUAGE FIELD
  //

  const languageField =
    buildLanguageField({

      guide:
        guideKey,

      themes,

      chakras,

      emotionalFrequencies,

      languageEntries:
        language ?? [],
    });

  //
  // STEP 6 — BUILD CONTEXT
  //

  const sacredContext:
    SacredContextField = {

    guide:
      guide ?? null,

    principles:
      principles ?? [],

    language:
      language ?? [],

    languageField,

    promptPressures:
      promptPressures ?? [],

    fragments:
      fragments ?? [],

    themes,

    chakras,

    emotionalFrequencies,

    lens,

    oracle,

    tarot,

    interpretations: {

      cards:
        cardInterpretation,

      lens:
        lensInterpretation,

      guide:
        guideInterpretation,
    },

    systemTone:
      "sacred_dance",

    orchestrationNotes: {

      dominantTheme:
        themes[0],

      dominantChakra:
        chakras[0],

      emotionalState:
        emotionalFrequencies[0],
    },
  };

  //
  // DEBUG LOGGING
  //

  console.log(
    "🌸 Sacred Context Built"
  );

  console.log({

    guide:
      sacredContext
        .guide?.key,

    principles:
      sacredContext
        .principles.length,

    language:
      sacredContext
        .language.length,

    fragments:
      sacredContext
        .fragments.length,

    themes,

    chakras,

    emotionalFrequencies,

    languageTone:
      sacredContext
        .languageField
        .energeticTone,

    promptPressures:
      sacredContext
        .promptPressures
        .length,

    hasInterpretations:
      !!sacredContext
        .interpretations,
  });

  return sacredContext;
}