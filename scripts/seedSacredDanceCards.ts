// /scripts/seedSacredDanceCards.ts

import { supabase } from "../services/supabase";

import {
    oracleCardSeeds,
    tarotCardSeeds,
} from "../lib/seed/sacredDanceCardSeeds";

async function seedOracleCards() {

  console.log(
    "🌙 Seeding oracle cards..."
  );

  for (const card of oracleCardSeeds) {

    const { error } =
      await supabase

        .from("oracle_cards")

        .update({

          energy_category:
            card.energy_category,

          emotional_frequency:
            card.emotional_frequency,

          symbolic_tone:
            card.symbolic_tone,

          relational_energy:
            card.relational_energy,

          cadence_style:
            card.cadence_style,

          imagery_keywords:
            card.imagery_keywords,

          inquiry_energy:
            card.inquiry_energy,

          inquiry_examples:
            card.inquiry_examples,

          behavioural_themes:
            card.behavioural_themes,

          movement_keywords:
            card.movement_keywords,

          symbolic_environment:
            card.symbolic_environment,

          archetypal_temperature:
            card.archetypal_temperature,

        })

        .eq(
          "title",
          card.title
        );

    if (error) {

      console.log(
        "❌ Oracle failed:",
        card.title,
        error.message
      );

    } else {

      console.log(
        "✅ Oracle updated:",
        card.title
      );
    }
  }
}

async function seedTarotCards() {

  console.log(
    "🔮 Seeding tarot cards..."
  );

  for (const card of tarotCardSeeds) {

    const { error } =
      await supabase

        .from("tarot_cards")

        .update({

          archetype_family:
            card.archetype_family,

          symbolic_atmosphere:
            card.symbolic_atmosphere,

          imagery_keywords:
            card.imagery_keywords,

          movement_keywords:
            card.movement_keywords,

          environment_keywords:
            card.environment_keywords,

          question_style:
            card.question_style,

          inquiry_examples:
            card.inquiry_examples,

          behavioural_themes:
            card.behavioural_themes,

          archetypal_energy:
            card.archetypal_energy,

          tension_patterns:
            card.tension_patterns,

          symbolic_temperature:
            card.symbolic_temperature,

          pacing_style:
            card.pacing_style,

        })

        .eq(
          "name",
          card.name
        );

    if (error) {

      console.log(
        "❌ Tarot failed:",
        card.name,
        error.message
      );

    } else {

      console.log(
        "✅ Tarot updated:",
        card.name
      );
    }
  }
}

async function run() {

  await seedOracleCards();

  await seedTarotCards();

  console.log(
    "✨ Sacred Dance symbolic fields seeded"
  );
}

run();