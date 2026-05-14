// buildLensContext.ts

import { supabase } from "../../../services/supabase";

import { deriveLensFromBehaviours } from "../../../lib/deriveLensFromBehaviours";

/*
 * ---------------------------------------------------------
 * TYPES
 * ---------------------------------------------------------
 */

type Signal = {

  reflection_id?: string;

  ai_behaviours?: any[];

  ai_patterns?: any[];
};

type Behaviour = {

  id: string;

  weight?: number;

  distortion_type?: string;

  protection_meaning?: string;

  masculine_shadow?: string;

  feminine_shadow?: string;

  expansion_meaning?: string;
};

type Pattern = {

  id: string;

  score?: number;
};

type LensKeyword = {

  keyword: string;

  normalized_keyword: string;

  category: string;

  emotional_meaning?: string;

  symbolic_meaning?: string;

  nervous_system_meaning?: string;

  masculine_shadow?: string;

  feminine_shadow?: string;

  expansion_meaning?: string;

  contraction_meaning?: string;

  mirror_seed?: string;

  inquiry_seed?: string;

  lens?: string[];

  weight?: number;
};

type BuildLensContextInput = {

  lens:
    | "people"
    | "places"
    | "things";

  signals?: Signal[];

  behaviours?: Behaviour[];

  patterns?: Pattern[];

  dominantChakra?: string;

  emotionalTheme?: string;

  relationalTheme?: string;

  energeticMovement?: string;

  nervousSystemState?: string;

  languageCode?: string;

  levels?: {

    physical?: {
      themes?: string[];
    };

    emotional?: {
      themes?: string[];
    };

    energetic?: {
      themes?: string[];
    };
  };
};

/*
 * ---------------------------------------------------------
 * CLEAN
 * ---------------------------------------------------------
 */

const clean = (str?: string) =>

  (str || "")

    .toLowerCase()

    .replace(/[_\s]/g, "")

    .replace(/[^\w]/g, "")

    .trim();

/*
 * ---------------------------------------------------------
 * BUILD LENS CONTEXT
 * ---------------------------------------------------------
 */

export async function buildLensContext({

  lens,

  signals = [],

  behaviours = [],

  patterns = [],

  dominantChakra,

  emotionalTheme,

  relationalTheme,

  energeticMovement,

  nervousSystemState,

  languageCode = "en",

  levels = {},

}: BuildLensContextInput) {

  /*
   * -------------------------------------------------------
   * REFLECTION IDS
   * -------------------------------------------------------
   */

  const reflectionIds =

    (signals || [])

      .map(
        (s) => s.reflection_id
      )

      .filter(Boolean);

  /*
   * -------------------------------------------------------
   * LOAD REFLECTIONS
   * -------------------------------------------------------
   */

  const {
    data: reflectionRows,
    error: reflectionError,
  } = await supabase

    .from("reflections")

    .select(`
      id,
      content,
      metadata,
      source,
      created_at
    `)

    .in(
      "id",
      reflectionIds
    )

    .order(
      "created_at",
      {
        ascending: false,
      }
    )

    .limit(12);

  if (reflectionError) {

    console.error(
      "❌ REFLECTION LOAD ERROR:",
      reflectionError
    );
  }

  const reflections =
    reflectionRows || [];

  /*
   * -------------------------------------------------------
   * REFLECTION TEXT
   * -------------------------------------------------------
   */

  const reflectionText =

    reflections

      .map(
        (r: any) =>
          r.content || ""
      )

      .join(" ");

  const normalizedText =
    clean(reflectionText);

  /*
   * -------------------------------------------------------
   * REFLECTION ECHOES
   * -------------------------------------------------------
   */

  const reflectionEchoes =

    reflections

      .map(
        (r: any) =>
          r.content
      )

      .filter(Boolean)

      .slice(0, 5);

  /*
   * -------------------------------------------------------
   * LOAD KEYWORDS
   * -------------------------------------------------------
   */

  const {
    data: keywordRows,
    error,
  } = await supabase

    .from("lens_keywords")

    .select("*")

    .eq(
      "language_code",
      languageCode
    )

    .eq(
      "active",
      true
    );

  if (error) {

    console.error(
      "❌ LENS KEYWORD ERROR:",
      error
    );
  }

  const keywords:
    LensKeyword[] =

    keywordRows || [];

  /*
   * -------------------------------------------------------
   * DERIVED LENS
   * -------------------------------------------------------
   */

  const derivedLens =
    await deriveLensFromBehaviours(
      behaviours
    );

  const activeLensSignals =
    derivedLens[lens] || [];

  /*
   * -------------------------------------------------------
   * MATCHED KEYWORDS
   * -------------------------------------------------------
   */

  const matchedKeywords =
    keywords.filter((k) => {

      const normalizedKeyword =
        clean(
          k.normalized_keyword ||
          k.keyword
        );

      return normalizedText.includes(
        normalizedKeyword
      );
    });

  /*
   * -------------------------------------------------------
   * SORTED KEYWORDS
   * -------------------------------------------------------
   */

  const sortedKeywords =

    [...matchedKeywords]

      .sort(
        (a, b) =>
          (b.weight || 1) -
          (a.weight || 1)
      );

  const topKeywords =
    sortedKeywords.slice(0, 5);

  /*
   * -------------------------------------------------------
   * TOP EVIDENCE
   * -------------------------------------------------------
   */

  const strongestReflectionEvidence =

    reflections

      .map((r: any) => r.content)

      .filter(Boolean)

      .slice(0, 3);

  /*
   * -------------------------------------------------------
   * CHILDHOOD SIGNALS
   * -------------------------------------------------------
   */

  const childhoodSignals =
    reflections.filter((r: any) => {

      const text =
        clean(r.content);

      return (

        text.includes("child") ||

        text.includes("mother") ||

        text.includes("father") ||

        text.includes("school") ||

        text.includes("family") ||

        text.includes("growingup") ||

        text.includes("young")
      );
    });

  /*
   * -------------------------------------------------------
   * CATEGORY KEYWORDS
   * -------------------------------------------------------
   */

  const peopleKeywords =
    matchedKeywords.filter(
      (k) =>
        k.category === "people"
    );

  const placeKeywords =
    matchedKeywords.filter(
      (k) =>
        k.category === "places"
    );

  const thingKeywords =
    matchedKeywords.filter(
      (k) =>
        k.category === "things"
    );

  const cycleKeywords =
    matchedKeywords.filter(
      (k) =>
        k.category === "cycles"
    );

  /*
   * -------------------------------------------------------
   * SCORES
   * -------------------------------------------------------
   */

  const peopleScore =
    peopleKeywords.reduce(
      (sum, k) =>
        sum + (k.weight || 1),
      0
    );

  const placesScore =
    placeKeywords.reduce(
      (sum, k) =>
        sum + (k.weight || 1),
      0
    );

  const thingsScore =
    thingKeywords.reduce(
      (sum, k) =>
        sum + (k.weight || 1),
      0
    );

  /*
   * -------------------------------------------------------
   * STRONGEST BEHAVIOUR
   * -------------------------------------------------------
   */

  const strongestBehaviour =

    [...behaviours]

      .sort(
        (a, b) =>
          (b.weight || 0) -
          (a.weight || 0)
      )[0] || null;

  /*
   * -------------------------------------------------------
   * DISTORTION
   * -------------------------------------------------------
   */

  const dominantProtection =

    strongestBehaviour
      ?.protection_meaning ||

    topKeywords?.[0]
      ?.contraction_meaning ||

    null;

  /*
   * -------------------------------------------------------
   * POLARITY
   * -------------------------------------------------------
   */

  const masculineDistortion =

    strongestBehaviour
      ?.masculine_shadow ||

    topKeywords?.[0]
      ?.masculine_shadow ||

    null;

  const feminineDistortion =

    strongestBehaviour
      ?.feminine_shadow ||

    topKeywords?.[0]
      ?.feminine_shadow ||

    null;

  /*
   * -------------------------------------------------------
   * EXPANSION
   * -------------------------------------------------------
   */

  const expansionSignals =

    topKeywords

      .map(
        (k) =>
          k.expansion_meaning
      )

      .filter(Boolean)

      .slice(0, 3);

  /*
   * -------------------------------------------------------
   * CHILDHOOD ECHO
   * -------------------------------------------------------
   */

  const strongestChildhoodTheme =

    childhoodSignals?.[0]
      ?.content || null;

  /*
   * -------------------------------------------------------
   * MIRROR MEANING
   * -------------------------------------------------------
   */

  let resolvedMirrorMeaning =
    null;

  if (lens === "people") {

    resolvedMirrorMeaning =
      "life may be reflecting emotional protection through relationships and relational dynamics";
  }

  if (lens === "places") {

    resolvedMirrorMeaning =
      "life may be reflecting nervous system states through environments and emotional atmosphere";
  }

  if (lens === "things") {

    resolvedMirrorMeaning =
      "life may be reflecting coping structures and emotional regulation patterns through attachment and behaviour";
  }

  /*
   * -------------------------------------------------------
   * MIRROR INQUIRY
   * -------------------------------------------------------
   */

  const mirrorInquiry =

    topKeywords?.[0]
      ?.inquiry_seed ||

    "What keeps repeating here emotionally?";

  /*
   * -------------------------------------------------------
   * PRIMARY MIRROR THREAD
   * -------------------------------------------------------
   */

  const primaryMirrorThread = {

    lens,

    dominantChakra,

    contraction:
      nervousSystemState,

    dominantBehaviour:
      strongestBehaviour,

    protection:
      dominantProtection,

    masculineDistortion,

    feminineDistortion,

    recurringKeywords:
      topKeywords,

    evidence:
      strongestReflectionEvidence,

    mirror:
      resolvedMirrorMeaning,

    expansion:
      expansionSignals,

    childhoodEcho:
      strongestChildhoodTheme,

    inquiry:
      mirrorInquiry,
  };

  /*
   * -------------------------------------------------------
   * SPIRAL STATE
   * -------------------------------------------------------
   */

  let spiralState =
    "stable";

  if (
    cycleKeywords.length >= 2
  ) {

    spiralState =
      "repeating";
  }

  if (
    cycleKeywords.length >= 4
  ) {

    spiralState =
      "deep_cycle";
  }

  /*
   * -------------------------------------------------------
   * RETURN
   * -------------------------------------------------------
   */

  return {

    lens,

    dominantChakra,

    emotionalTheme,

    relationalTheme,

    energeticMovement,

    nervousSystemState,

    levels: {

      physical: {

        themes:
          levels?.physical?.themes || [],
      },

      emotional: {

        themes:
          levels?.emotional?.themes || [],
      },

      energetic: {

        themes:
          levels?.energetic?.themes || [],
      },
    },

    reflectionEchoes,

    rawReflections:

      reflections

        .map(
          (r: any) =>
            r.content
        )

        .filter(Boolean)

        .slice(0, 12),

    activeLensSignals,

    primaryMirrorThread,

    symbolicSignals: {

      people:
        peopleKeywords,

      places:
        placeKeywords,

      things:
        thingKeywords,
    },

    cycles: {

      active:
        cycleKeywords.length > 0,

      spiralState,

      keywords:
        cycleKeywords,

      principle:
        "patterns repeat until awareness becomes embodiment",
    },

    people: {

      score:
        peopleScore,

      active:
        peopleScore > 0,
    },

    places: {

      score:
        placesScore,

      active:
        placesScore > 0,
    },

    things: {

      score:
        thingsScore,

      active:
        thingsScore > 0,
    },
  };
}
