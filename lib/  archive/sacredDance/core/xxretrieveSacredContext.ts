// /lib/sacredDance/core/retrieveSacredContext.ts

import { supabase } from "../../../services/supabase";

import {
  RealityLayer,
  RetrievedFragment,
} from "./types";

interface RetrieveSacredContextParams {

  emotions?: string[];

  behaviours?: string[];

  /*
   * ---------------------------------------------------------
   * REALITY LAYER
   * ---------------------------------------------------------
   */

  realityLayer?: RealityLayer;

  lens?: {
    people?: string[];
    places?: string[];
    things?: string[];
  };

  limit?: number;
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

interface SacredContextResult {

  fragments:
    RetrievedFragment[];

  principles:
    SacredPrinciple[];

  pressures:
    SacredPressure[];

  oracleCards:
    OracleCard[];

  oraclePrompts:
    OraclePrompt[];
}

export async function retrieveSacredContext({

  emotions = [],

  behaviours = [],

  realityLayer,

  lens,

  limit = 5,

}: RetrieveSacredContextParams)
: Promise<SacredContextResult> {

  try {

    /*
     * ---------------------------------------------------------
     * BUILD SIGNALS
     * ---------------------------------------------------------
     */

    const lensSignals = [

      ...(lens?.people || []),

      ...(lens?.places || []),

      ...(lens?.things || []),
    ];

    const themes = [

      ...emotions,

      ...behaviours,

      ...lensSignals,

      ...(realityLayer
        ? [realityLayer]
        : []),
    ]
      .filter(Boolean)
      .map(
        (
          item
        ) =>
          item
            .toLowerCase()
            .trim()
      );

    /*
     * ---------------------------------------------------------
     * FRAGMENTS
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
        themes
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
        "❌ fragments retrieval error:",
        fragmentsError
      );
    }

    /*
     * ---------------------------------------------------------
     * PRINCIPLES
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
        "❌ principles retrieval error:",
        principlesError
      );
    }

    /*
     * ---------------------------------------------------------
     * PROMPT PRESSURES
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
        "❌ pressures retrieval error:",
        pressuresError
      );
    }

    /*
     * ---------------------------------------------------------
     * ORACLE CARDS
     * ---------------------------------------------------------
     */

    let oracleCardsQuery = supabase

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

    if (themes.length > 0) {

      oracleCardsQuery =
        oracleCardsQuery.or(

          themes
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
        "❌ oracle cards retrieval error:",
        oracleCardsError
      );
    }

    /*
     * ---------------------------------------------------------
     * ORACLE PROMPTS
     * ---------------------------------------------------------
     */

    let oraclePromptsQuery = supabase

      .from(
        "oracle_prompts"
      )

      .select(`
        id,
        card_number,
        prompt,
        weight
      `);

    if (themes.length > 0) {

      oraclePromptsQuery =
        oraclePromptsQuery.or(

          themes
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
        "❌ oracle prompts retrieval error:",
        oraclePromptsError
      );
    }

    /*
     * ---------------------------------------------------------
     * CLEAN FRAGMENTS
     * ---------------------------------------------------------
     */

    const fragments: RetrievedFragment[] = (

      fragmentsData?.map(
        (
          fragment
        ): RetrievedFragment => ({

          id:
            fragment.id,

          content:
            fragment.content,

          fragmentType:
            fragment.fragment_type,

          themes:
            fragment.themes || [],

          emotionalFrequencies:
            fragment.emotional_frequencies || [],

          retrievalWeight:
            fragment.retrieval_weight || 1,
        })
      ) || []
    );

    /*
     * ---------------------------------------------------------
     * RETURN
     * ---------------------------------------------------------
     */

    return {

      fragments,

      principles:
        principlesData || [],

      pressures:
        pressuresData || [],

      oracleCards:
        oracleCardsData || [],

      oraclePrompts:
        oraclePromptsData || [],
    };

  } catch (e) {

    console.error(
      "❌ retrieveSacredContext crash:",
      e
    );

    return {

      fragments: [],

      principles: [],

      pressures: [],

      oracleCards: [],

      oraclePrompts: [],
    };
  }
}