// /lib/guidance/orchestration/loadEmergenceMemory.ts

import { supabase } from "../../../services/supabase";

/*
 * --------------------------------------------------------
 * 🌌 LOAD EMERGENCE MEMORY
 * --------------------------------------------------------
 *
 * PURPOSE:
 *
 * Retrieve living continuity
 * from:
 *
 * guidance_emergence_memory
 *
 * This file does NOT:
 * - orchestrate
 * - interpret
 * - generate guidance
 * - render UI
 *
 * It ONLY:
 * - retrieves spiral continuity
 * - retrieves recurring themes
 * - retrieves unresolved emergence
 * - retrieves symbolic recurrence
 *
 * --------------------------------------------------------
 */

export const loadEmergenceMemory =
async ({

  /*
   * 👤 USER
   */

  userId,

  /*
   * 🌌 FIELD FILTERS
   */

  activeLens,

  activeChakras = [],

  activePatterns = [],

  spiralPhase,

}: any) => {

  /*
   * --------------------------------------------------------
   * 🌊 SAFETY
   * --------------------------------------------------------
   */

  if (!userId) {

    return {

      recurringThemes: [],

      recurringSymbols: [],

      unresolvedContent: [],

      emotionallyActivePatterns: [],

      emergingGuides: [],

      recentEmergence: [],

      activeSpiralPhase:
        spiralPhase || null,
    };
  }

  /*
   * --------------------------------------------------------
   * 🌌 LOAD MEMORY
   * --------------------------------------------------------
   */

  const {

    data,

    error,

  } = await supabase

    .from(
      "guidance_emergence_memory"
    )

    .select("*")

    .eq(
      "user_id",
      userId
    )

    .order(
      "last_seen_at",
      {
        ascending: false,
      }
    )

    .limit(120);

  /*
   * --------------------------------------------------------
   * 🌊 ERROR
   * --------------------------------------------------------
   */

  if (
    error ||
    !data
  ) {

    console.error(

      "❌ Emergence memory load error",

      error
    );

    return {

      recurringThemes: [],

      recurringSymbols: [],

      unresolvedContent: [],

      emotionallyActivePatterns: [],

      emergingGuides: [],

      recentEmergence: [],

      activeSpiralPhase:
        spiralPhase || null,
    };
  }

  /*
   * --------------------------------------------------------
   * 🌿 ACTIVE MEMORY
   * --------------------------------------------------------
   *
   * Ignore:
   * - fully resolved
   * - emotionally inactive
   *
   * --------------------------------------------------------
   */

  const activeMemory =

    data.filter(
      (item: any) =>

        !item.resolved
    );

  /*
   * --------------------------------------------------------
   * 🌌 RECURRING THEMES
   * --------------------------------------------------------
   */

  const recurringThemes = [

    ...new Set(

      activeMemory.flatMap(
        (item: any) =>

          item.themes || []
      )
    ),
  ]

    .filter(Boolean)

    .slice(0, 12);

  /*
   * --------------------------------------------------------
   * 🌊 RECURRING SYMBOLS
   * --------------------------------------------------------
   */

  const recurringSymbols =

    activeMemory

      .filter(
        (item: any) =>

          item.content_type ===
          "whisper"

          ||

          item.content_type ===
          "symbolic_sign"
      )

      .sort(
        (
          a: any,
          b: any
        ) => (

          b.recurrence_weight || 0

        ) - (

          a.recurrence_weight || 0
        )
      )

      .slice(0, 10);

  /*
   * --------------------------------------------------------
   * 🌿 UNRESOLVED EMERGENCE
   * --------------------------------------------------------
   */

  const unresolvedContent =

    activeMemory

      .filter(
        (item: any) =>

          item.integration_state !==
          "embodied"
      )

      .sort(
        (
          a: any,
          b: any
        ) => (

          b.emotional_impact || 0

        ) - (

          a.emotional_impact || 0
        )
      )

      .slice(0, 12);

  /*
   * --------------------------------------------------------
   * 🌌 EMOTIONALLY ACTIVE PATTERNS
   * --------------------------------------------------------
   */

  const emotionallyActivePatterns = [

    ...new Set(

      activeMemory.flatMap(
        (item: any) =>

          item.patterns || []
      )
    ),
  ]

    .filter(Boolean)

    .slice(0, 10);

  /*
   * --------------------------------------------------------
   * 🌊 EMERGING GUIDES
   * --------------------------------------------------------
   */

  const emergingGuides = [

    ...new Set(

      activeMemory.flatMap(
        (item: any) =>

          item.guides || []
      )
    ),
  ]

    .filter(Boolean)

    .slice(0, 6);

  /*
   * --------------------------------------------------------
   * 🌿 RECENT EMERGENCE
   * --------------------------------------------------------
   */

  const recentEmergence =

    activeMemory

      .slice(0, 8);

  /*
   * --------------------------------------------------------
   * 🌌 CHAKRA RESONANCE
   * --------------------------------------------------------
   */

  const chakraResonance =

    activeMemory.filter(
      (item: any) =>

        item.chakras?.some(
          (
            chakra: string
          ) =>

            activeChakras.includes(
              chakra
            )
        )
    );

  /*
   * --------------------------------------------------------
   * 🌊 LENS RESONANCE
   * --------------------------------------------------------
   */

  const lensResonance =

    activeMemory.filter(
      (item: any) =>

        item.lenses?.includes(
          activeLens
        )
    );

  /*
   * --------------------------------------------------------
   * 🌿 SPIRAL CONTINUITY
   * --------------------------------------------------------
   */

  const spiralContinuity =

    activeMemory.filter(
      (item: any) =>

        item.spiral_phase ===
        spiralPhase
    );

  /*
   * --------------------------------------------------------
   * 🌌 RETURN MEMORY FIELD
   * --------------------------------------------------------
   */

  return {

    /*
     * 🌊 RAW
     */

    allMemory:
      activeMemory,

    /*
     * 🌿 RECURRENCE
     */

    recurringThemes,

    recurringSymbols,

    /*
     * 🌌 ACTIVE SPIRALS
     */

    unresolvedContent,

    spiralContinuity,

    /*
     * 🌊 EMOTIONAL FIELD
     */

    emotionallyActivePatterns,

    chakraResonance,

    lensResonance,

    /*
     * 🌿 GUIDES
     */

    emergingGuides,

    /*
     * ✨ RECENT
     */

    recentEmergence,

    /*
     * 🌌 CURRENT SPIRAL
     */

    activeSpiralPhase:
      spiralPhase || null,
  };
};