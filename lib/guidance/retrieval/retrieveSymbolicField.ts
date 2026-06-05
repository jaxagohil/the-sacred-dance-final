// /lib/guidance/retrieveSymbolicField.ts

import { supabase } from "../../../services/supabase";

interface RetrieveSymbolicFieldParams {

  /*
   * ---------------------------------------------------------
   * 🌌 LIVING USER FIELD
   * ---------------------------------------------------------
   */

  userField: any;

  /*
   * ---------------------------------------------------------
   * 💬 CURRENT MESSAGE
   * ---------------------------------------------------------
   */

  message?: string;

  /*
   * ---------------------------------------------------------
   * 🪞 ACTIVE GUIDE
   * ---------------------------------------------------------
   */

  guide?:
    | "guide_heart"
    | "guide_structure"
    | "guide_cosmic";

  /*
   * ---------------------------------------------------------
   * 🔢 LIMIT
   * ---------------------------------------------------------
   */

  limit?: number;
}

interface SymbolicFragment {

  id?: string;

  content: string;

  fragmentType?: string;

  themes?: string[];

  emotionalFrequencies?: string[];

  retrievalWeight?: number;
}

interface SacredPrinciple {

  key?: string;

  category?: string;

  principle?: string;
}

interface SacredPressure {

  key?: string;

  category?: string;

  pressure?: string;
}

interface OracleCard {

  id?: string;

  card_number?: number;

  title?: string;

  affirmation?: string;

  message?: string;
}

interface OraclePrompt {

  id?: string;

  card_number?: number;

  prompt?: string;

  weight?: number;
}

interface SymbolicFieldResult {

  fragments:
    SymbolicFragment[];

  principles:
    SacredPrinciple[];

  pressures:
    SacredPressure[];

  oracleCards:
    OracleCard[];

  oraclePrompts:
    OraclePrompt[];

  themes:
    string[];
}

/*
 * ---------------------------------------------------------
 * 🌌 RETRIEVE SYMBOLIC FIELD
 * ---------------------------------------------------------
 */

export async function retrieveSymbolicField({

  userField,

  limit = 5,

}: RetrieveSymbolicFieldParams)
: Promise<SymbolicFieldResult> {

  try {

    /*
     * ---------------------------------------------------------
     * 🧠 BUILD THEMES FROM LIVING FIELD
     * ---------------------------------------------------------
     */

    const themes = [

      /*
       * -------------------------------------------------------
       * STORY
       * -------------------------------------------------------
       */

      userField?.story
        ?.emotionalTheme,

      userField?.story
        ?.relationalTheme,

      userField?.story
        ?.energeticMovement,

      userField?.story
        ?.healingEdge,

      /*
       * -------------------------------------------------------
       * MANIFESTATIONS
       * -------------------------------------------------------
       */

      ...(userField?.manifestations || []),

      /*
       * -------------------------------------------------------
       * PATTERNS
       * -------------------------------------------------------
       */

      ...(userField?.current
        ?.patterns || []),

      /*
       * -------------------------------------------------------
       * DISTORTIONS
       * -------------------------------------------------------
       */

      ...(userField?.distortions
        ?.masculine || [])

        .map((d: any) =>
          d?.manifestation
        ),

      ...(userField?.distortions
        ?.feminine || [])

        .map((d: any) =>
          d?.manifestation
        ),

      /*
       * -------------------------------------------------------
       * EMOTIONS
       * -------------------------------------------------------
       */

      ...(userField?.levels
        ?.emotional
        ?.emotions || []),

      /*
       * -------------------------------------------------------
       * NEEDS
       * -------------------------------------------------------
       */

      ...(userField?.levels
        ?.emotional
        ?.needs || []),

      /*
       * -------------------------------------------------------
       * THEMES
       * -------------------------------------------------------
       */

      ...(userField?.levels
        ?.emotional
        ?.themes || []),

      /*
       * -------------------------------------------------------
       * BEHAVIOURS
       * -------------------------------------------------------
       */

      ...(userField?.levels
        ?.physical
        ?.behaviours || []),

      /*
       * -------------------------------------------------------
       * BODY THEMES
       * -------------------------------------------------------
       */

      ...(userField?.levels
        ?.physical
        ?.bodyThemes || []),

      /*
       * -------------------------------------------------------
       * CHAKRA
       * -------------------------------------------------------
       */

      userField?.energy
        ?.dominantChakra,

      userField?.energy
        ?.awarenessChakra,

    ]
      .filter(Boolean)

      .map(
        (item) =>

          String(item)
            .toLowerCase()
            .trim()
      );

    /*
     * ---------------------------------------------------------
     * ✨ REMOVE DUPLICATES
     * ---------------------------------------------------------
     */

    const uniqueThemes = [
      ...new Set(themes),
    ];

    console.log(
      "🌌 SYMBOLIC THEMES:",
      uniqueThemes
    );

    /*
     * ---------------------------------------------------------
     * 📚 SACRED FRAGMENTS
     * ---------------------------------------------------------
     */

    const {
      data: fragmentsData,
      error: fragmentsError,
    } = await supabase

      .from(
        "sacred_dance_context_fragments"
      )

      .select(`
        id,
        content,
        fragment_type,
        themes,
        emotional_frequencies,
        retrieval_weight
      `)

      .eq(
        "active",
        true
      )

      .overlaps(
        "themes",
        uniqueThemes
      )

      .order(
        "retrieval_weight",
        {
          ascending: false,
        }
      )

      .limit(limit);

    if (fragmentsError) {

      console.error(
        "❌ symbolic fragments error:",
        fragmentsError
      );
    }

    /*
     * ---------------------------------------------------------
     * 🧿 SACRED PRINCIPLES
     * ---------------------------------------------------------
     */

    const {
      data: principlesData,
      error: principlesError,
    } = await supabase

      .from(
        "sacred_dance_principles"
      )

      .select(`
        key,
        category,
        principle
      `)

      .eq(
        "active",
        true
      )

      .order(
        "importance",
        {
          ascending: false,
        }
      );

    if (principlesError) {

      console.error(
        "❌ sacred principles error:",
        principlesError
      );
    }

    /*
     * ---------------------------------------------------------
     * 🌊 SACRED PRESSURES
     * ---------------------------------------------------------
     */

    const {
      data: pressuresData,
      error: pressuresError,
    } = await supabase

      .from(
        "sacred_dance_prompt_pressures"
      )

      .select(`
        key,
        category,
        pressure
      `)

      .eq(
        "active",
        true
      );

    if (pressuresError) {

      console.error(
        "❌ sacred pressures error:",
        pressuresError
      );
    }

    /*
     * ---------------------------------------------------------
     * 🃏 ORACLE CARDS
     * ---------------------------------------------------------
     */

    let oracleCardsQuery =

      supabase

        .from(
          "oracle_cards"
        )

        .select(`
          id,
          card_number,
          title,
          affirmation,
          message
        `);

    if (
      uniqueThemes.length > 0
    ) {

      oracleCardsQuery =
        oracleCardsQuery.or(

          uniqueThemes

            .map(
              (
                theme
              ) =>

                `title.ilike.%${theme}%`
            )

            .join(",")
        );
    }

    const {
      data: oracleCardsData,
      error: oracleCardsError,
    } = await oracleCardsQuery

      .limit(limit);

    if (oracleCardsError) {

      console.error(
        "❌ oracle cards error:",
        oracleCardsError
      );
    }

    /*
     * ---------------------------------------------------------
     * ✨ ORACLE PROMPTS
     * ---------------------------------------------------------
     */

    let oraclePromptsQuery =

      supabase

        .from(
          "oracle_prompts"
        )

        .select(`
          id,
          card_number,
          prompt,
          weight
        `);

    if (
      uniqueThemes.length > 0
    ) {

      oraclePromptsQuery =
        oraclePromptsQuery.or(

          uniqueThemes

            .map(
              (
                theme
              ) =>

                `prompt.ilike.%${theme}%`
            )

            .join(",")
        );
    }

    const {
      data: oraclePromptsData,
      error: oraclePromptsError,
    } = await oraclePromptsQuery

      .order(
        "weight",
        {
          ascending: false,
        }
      )

      .limit(limit * 2);

    if (oraclePromptsError) {

      console.error(
        "❌ oracle prompts error:",
        oraclePromptsError
      );
    }

    /*
     * ---------------------------------------------------------
     * 🌸 RETURN
     * ---------------------------------------------------------
     */

    return {

      fragments:
        fragmentsData || [],

      principles:
        principlesData || [],

      pressures:
        pressuresData || [],

      oracleCards:
        oracleCardsData || [],

      oraclePrompts:
        oraclePromptsData || [],

      themes:
        uniqueThemes,
    };

  } catch (e) {

    console.error(
      "❌ retrieveSymbolicField:",
      e
    );

    return {

      fragments: [],

      principles: [],

      pressures: [],

      oracleCards: [],

      oraclePrompts: [],

      themes: [],
    };
  }
}