// /lib/cosmic/buildDailyField.ts

import {
  supabase,
} from "../../services/supabase";

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

      fields:
        existingField.fields || [],
    };
  }

  /*
   * ---------------------------------------------------------
   * 🌌 SKY SNAPSHOT
   * ---------------------------------------------------------
   */

  const {
    data: cosmic,
  } = await supabase

    .from("cosmic_sky")

    .select("*")

    .eq(
      "date",
      today
    )

    .maybeSingle();

  /*
   * ---------------------------------------------------------
   * 🌌 ACTIVE COSMIC FIELDS
   * ---------------------------------------------------------
   */

  const {

    data: activeFields,

    error,

  } = await supabase

    .from("cosmic_fields")

    .select("*")

    .lte(
      "starts_at",
      new Date().toISOString()
    )

    .gte(
      "ends_at",
      new Date().toISOString()
    )

    .eq(
      "active",
      true
    );

  /*
   * ---------------------------------------------------------
   * ❌ ERROR
   * ---------------------------------------------------------
   */

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

  /*
   * ---------------------------------------------------------
   * 🌌 SAFE FIELDS
   * ---------------------------------------------------------
   */

  const fields =
    activeFields || [];

  /*
   * ---------------------------------------------------------
   * 🧠 BUILD FIELD
   * ---------------------------------------------------------
   */

  const symbolicThemes =
    fields.flatMap(
      (f: any) =>

        f.keywords || []
    );

  /*
   * ---------------------------------------------------------
   * 🌌 LOAD ARCHETYPES
   * ---------------------------------------------------------
   */

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

  /*
   * ---------------------------------------------------------
   * 🃏 SELECT ORACLE
   * ---------------------------------------------------------
   */

  const oracleCard =
    await selectOracleCard({

      cosmic: {

        ...cosmic,

        fields,

        archetypes:
          archetypes || [],
      },

    });

  /*
   * ---------------------------------------------------------
   * 🌌 DOMINANT ENERGY
   * ---------------------------------------------------------
   */

  const dominantEnergy =

    oracleCard
      ?.energy_category ||

    fields?.[0]
      ?.dominant_energy ||

    "flow";

  /*
   * ---------------------------------------------------------
   * 🌈 DOMINANT CHAKRA
   * ---------------------------------------------------------
   */

  const dominantChakra =

    oracleCard
      ?.chakra ||

    fields?.[0]
      ?.chakra_focus ||

    null;

  /*
   * ---------------------------------------------------------
   * ✨ FIELD MESSAGE
   * ---------------------------------------------------------
   */

const fieldMessage =

  fields?.[0]
    ?.guidance ||

  "The atmosphere is quietly shifting.";

  /*
   * ---------------------------------------------------------
   * 🌌 FIELD ESSENCE
   * ---------------------------------------------------------
   */

  const fieldEssence = {

    atmosphere:

      oracleCard
        ?.symbolic_tone ||

      fields?.[0]
        ?.collective_theme ||

      "reflective",

    pacing:

      oracleCard
        ?.cadence_style ||

      "steady",

    relationalField:

      oracleCard
        ?.relational_energy ||

      fields?.[0]
        ?.energetic_theme ||

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

      fields?.[0]
        ?.dominant_energy ||

      "quiet space",
  };

  /*
   * ---------------------------------------------------------
   * 💾 STORE FIELD
   * ---------------------------------------------------------
   */

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

      fields,

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

  /*
   * ---------------------------------------------------------
   * 🪵 DEBUG
   * ---------------------------------------------------------
   */

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

      moon:
        cosmic?.moon_sign,

      phase:
        cosmic?.moon_phase,

      sun:
        cosmic?.sun_sign,

      activeFields:
        fields.map(
          (f: any) =>
            f.title
        ),
    }
  );

  /*
   * ---------------------------------------------------------
   * 🌌 RETURN
   * ---------------------------------------------------------
   */

  return {

    cosmic,

    fields,

    oracleCard,

    symbolicThemes,

    archetypes:
      archetypes || [],

    dominantEnergy,

    dominantChakra,

    fieldMessage,

    fieldEssence,
  };
}