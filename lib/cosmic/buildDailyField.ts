// /lib/cosmic/buildDailyField.ts

import {
  supabase,
} from "../../services/supabase";

import {
  getCosmicData,
} from "./getCosmicData";

import {
  selectOracleCard,
} from "../selectOracleCard";

export async function
buildDailyField() {

  //
  // 🌌 TODAY
  //

  const today =
    new Date()

      .toISOString()

      .split("T")[0];

  //
  // 🌌 EXISTING FIELD
  //

  const {

    data: existingField,

  } = await supabase

    .from(
      "daily_fields"
    )

    .select("*")

    .eq(
      "date",
      today
    )

    .maybeSingle();

  //
  // ♻️ REUSE EXISTING
  //

  if (existingField) {

    console.log(
      "♻️ USING EXISTING DAILY FIELD:",
      existingField
        ?.oracle_card
        ?.title
    );

    return {

      cosmic:
        existingField.cosmic,

      oracleCard:
        existingField.oracle_card,

      symbolicThemes:
        existingField.symbolic_themes || [],

      archetypes:
        existingField.archetypes || [],

      dominantEnergy:
        existingField.dominant_energy,

      dominantChakra:
        existingField.dominant_chakra,

      fieldMessage:
        existingField.field_message,

      fieldEssence:
  existingField.field_essence || {},  

      fields: [],
    };
  }

  //
  // 🌌 COSMIC CALCULATIONS
  //

  const cosmic =
    getCosmicData();

  //
  // 🌙 DETERMINE FIELD KEYS
  //

  const keys: string[] = [];

  //
  // 🌕 MOON PHASES
  //

  if (
    cosmic.phase ===
    "Full"
  ) {

    keys.push(
      "full_moon"
    );
  }

  if (
    cosmic.phase ===
    "New"
  ) {

    keys.push(
      "new_moon"
    );
  }

  if (
    cosmic.phase ===
    "Waning"
  ) {

    keys.push(
      "last_quarter_moon"
    );
  }

  //
  // 🌌 FIELD DEFINITIONS
  //

  const {

    data,

    error,

  } = await supabase

    .from(
      "cosmic_field_definitions"
    )

    .select("*")

    .in(
      "key",
      keys
    )

    .eq(
      "active",
      true
    );

  //
  // ❌ ERROR
  //

  if (error) {

    console.log(
      "❌ buildDailyField:",
      error.message
    );

    return {

      cosmic,

      fields: [],
    };
  }

  //
  // 🌙 SAFE FIELDS
  //

  const fields =
    data || [];

  //
  // 🧠 BUILD FIELD
  //

  const symbolicThemes =
    fields.flatMap(
      (f: any) =>

        f.symbolic_themes || []
    );

  const guideTone =
    fields.flatMap(
      (f: any) =>

        f.guide_tone || []
    );

  //
  // 🌌 LOAD ARCHETYPES
  //

  const {

    data: archetypes,

  } = await supabase

    .from(
      "cosmic_archetypes"
    )

    .select("*")

    .eq(
      "active",
      true
    );

  //
  // 🃏 SELECT ORACLE
  //

  const oracleCard =
    await selectOracleCard({

      cosmic: {

        ...cosmic,

        archetypes:
          archetypes || [],
      },

    });

  //
  // 🌌 DOMINANT ENERGY
  //

  const dominantEnergy =

    oracleCard
      ?.energy_category ||

    cosmic?.sunEnergy ||

    "flow";

  //
  // 🌈 DOMINANT CHAKRA
  //

  const dominantChakra =

    oracleCard
      ?.chakra ||

    null;

  //
  // ✨ FIELD MESSAGE
  //

  const fieldMessage =

    oracleCard
      ?.affirmation ||

    "Something sacred is moving today.";

 /*
 * ---------------------------------------------------------
 * 🌌 FIELD ESSENCE
 * ---------------------------------------------------------
 */

const fieldEssence = {

  atmosphere:

    oracleCard
      ?.symbolic_tone ||

    "reflective",

  pacing:

    oracleCard
      ?.cadence_style ||

    "steady",

  relationalField:

    oracleCard
      ?.relational_energy ||

    "introspective",

  nervousSystem:

    oracleCard
      ?.emotional_frequency ||

    "sensitive",

  movement:

    (
      oracleCard
        ?.movement_keywords || []

    )[0] ||

    "observe",

  symbolicTexture:

    oracleCard
      ?.symbolic_environment ||

    "quiet space",
};   

  //
  // 💾 STORE FIELD
  //

  await supabase

    .from(
      "daily_fields"
    )

    .insert({

      date:
        today,

      oracle_card:
        oracleCard,

      cosmic,

      field_message:
        fieldMessage,

      field_essence:
        fieldEssence,  

      dominant_chakra:
        dominantChakra,

      dominant_energy:
        dominantEnergy,

      symbolic_themes:
        symbolicThemes,

      archetypes:
        archetypes || [],
    });

  //
  // 🪵 DEBUG
  //

  console.log(
    "🌌 NEW DAILY FIELD CREATED:",
    {

      title:
        oracleCard?.title,

      card:
        oracleCard?.card_number,

      energy:
        dominantEnergy,

      chakra:
        dominantChakra,
    }
  );

  //
  // 🌌 RETURN
  //

  return {

    cosmic,

    fields,

    oracleCard,

    symbolicThemes,

    guideTone,

    archetypes:
      archetypes || [],

    dominantEnergy,

    dominantChakra,

    fieldMessage,

    fieldEssence,

    emotionalBias:
      average(

        fields.map(
          (f: any) =>

            f.emotional_bias || 0
        )
      ),

    reflectionBias:
      average(

        fields.map(
          (f: any) =>

            f.reflection_bias || 0
        )
      ),

    movementBias:
      average(

        fields.map(
          (f: any) =>

            f.movement_bias || 0
        )
      ),

    relationalBias:
      average(

        fields.map(
          (f: any) =>

            f.relational_bias || 0
        )
      ),

    nervousSystemBias:
      average(

        fields.map(
          (f: any) =>

            f.nervous_system_bias || 0
        )
      ),
  };
}

//
// 🧠 HELPERS
//

function average(
  numbers: number[]
) {

  if (
    !numbers ||
    numbers.length === 0
  ) {

    return 0;
  }

  return (

    numbers.reduce(

      (a, b) => a + b,

      0
    ) /

    numbers.length
  );
}