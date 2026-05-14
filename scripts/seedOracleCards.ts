// scripts/seedOracleCards.ts

import { ORACLE_CARDS } from "../lib/xxoracleCards";
import { supabase } from "../services/supabase";

async function seed() {

  //
  // 🌌 cards
  //

  const cards = ORACLE_CARDS.map((card) => ({
    card_number: card.card,

    title:
      card.title,

    affirmation:
      card.affirmation,

    message:
      card.message || null,

    colour:
      card.colour,

    theme:
      card.theme,

    intensity:
      card.intensity,

    chakra:
      card.chakra || null,
  }));

  console.log(
    "🌌 Seeding oracle cards..."
  );

  const { error: cardsError } =
    await supabase
      .from("oracle_cards")
      .upsert(cards, {
        onConflict:
          "card_number",
      });

  if (cardsError) {

    console.error(
      "❌ Cards Error",
      cardsError
    );

    return;
  }

  //
  // ✨ prompts
  //

  console.log(
    "✨ Seeding prompts..."
  );

  const prompts =
    ORACLE_CARDS.flatMap(
      (card) =>

        card.prompts.map(
          (prompt) => ({

            card_number:
              card.card,

            prompt,
          })
        )
    );

  const { error: promptsError } =
    await supabase
      .from("oracle_prompts")
      .insert(prompts);

  if (promptsError) {

    console.error(
      "❌ Prompts Error",
      promptsError
    );

    return;
  }

  console.log(
    "✨ oracle cards seeded"
  );
}

seed();