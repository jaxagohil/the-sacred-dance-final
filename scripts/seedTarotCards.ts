import { TAROT_CARDS } from "../lib/tarotCards";

import { supabase } from "../services/supabase";

async function seed() {

  console.log(
    "🔮 Seeding tarot cards..."
  );

  const cards =
    TAROT_CARDS.map((card) => ({

      name:
        card.name,

      arcana:
        card.arcana,

      suit:
        card.suit || null,

      card_number:
        card.number || null,

      archetype:
        card.archetype || null,

      message:
        card.message,

      shadow:
        card.shadow || null,

      integration:
        card.integration || null,
    }));

  const { error } =
    await supabase
      .from("tarot_cards")
      .upsert(cards, {
        onConflict:
          "name",
      });

  if (error) {

    console.error(
      "❌ Tarot Error",
      error
    );

    return;
  }

  console.log(
    "✨ tarot cards seeded"
  );
}

seed();