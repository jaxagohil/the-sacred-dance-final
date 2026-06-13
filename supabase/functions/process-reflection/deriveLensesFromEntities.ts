// lib/deriveLensesFromEntities.ts

import { supabase } from "./supabase.ts";

console.log(
  "🪞 LENS FUNCTION LOADED"
);

type LensScore = {
  lens: string;
  score: number;
};

type LensResult = {
  lens: string;
  entity: string;
  emotional_meaning?: string;
  symbolic_meaning?: string;
  score: number;
};

export async function deriveLensesFromEntities(

  people: string[] = [],

  places: string[] = [],

  things: string[] = [],
) {

  const entities = [

    ...people,

    ...places,

    ...things,

  ];

  console.log(
    "🪞 ENTITY INPUT:",
    entities
  );

if (!entities.length) {

  return {

    lensScores: [],

    entityLenses: [],
  };
}


console.log(
  "🧪 LOOKING UP",
  entities
);

// -----------------------------------
// 🧠 LOOKUP KEYWORDS
// -----------------------------------

const searchEntities =
  entities
    .map(e =>
      e.toLowerCase().trim()
    )
    .filter(Boolean);

console.log(
  "🧪 SEARCH TERMS:",
  searchEntities
);

const { data, error } =
  await supabase
    .from("lens_keywords")
    .select("*")
    .filter(
      "search_terms",
      "ov",
      `{${searchEntities.join(",")}}`
    );

console.log(
  "🧪 FILTER VALUE:",
  `{${searchEntities.join(",")}}`
);    

console.log(
  "🧪 QUERY ERROR:",
  error
);

console.log(
  "🧪 LENS KEYWORDS:",
  data
);

// -----------------------------------
// 🪞 FALLBACK ENTITY EVIDENCE
// -----------------------------------

if (!data?.length) {

  const fallbackEntities =
    entities.map(entity => ({

      lens: "entity",

      entity,

      emotional_meaning: undefined,

      symbolic_meaning: undefined,

      score: 1,

    }));

  console.log(
    "🪞 FALLBACK ENTITIES:",
    fallbackEntities
  );

  return {

    lensScores: [],

    entityLenses:
      fallbackEntities,
  };
}

  // -----------------------------------
  // 🧠 SCORE LENSES
  // -----------------------------------

  const scores:
    Record<string, number> = {};

  for (const row of data || []) {

    const lenses =
      row.lens || [];

    const weight =
      row.lens_weight ||
      row.weight ||
      1;

    for (const lens of lenses) {

      if (!scores[lens]) {

        scores[lens] = 0;
      }

      scores[lens] += weight;
    }
  }

  console.log(
    "🪞 RAW LENS SCORES:",
    scores
  );

  // -----------------------------------
// 🪞 ENTITY LENS EVIDENCE
// -----------------------------------

const entityLenses:
  LensResult[] = [];

for (const row of data || []) {

  const lenses =
    row.lens || [];

  const weight =
    row.weight || 1;

  for (const lens of lenses) {

    entityLenses.push({

      lens,

      entity:
        row.normalized_keyword,

      emotional_meaning:
        row.emotional_meaning,

      symbolic_meaning:
        row.symbolic_meaning,

      score:
        weight,
    });
  }
}

  const results: LensScore[] =

    Object.entries(scores)

      .map(
        ([lens, score]) => ({
          lens,
          score,
        })
      )

      .sort(
        (a, b) =>
          b.score - a.score
      );

console.log(
  "🪞 DERIVED LENSES:",
  results
);

console.log(
  "🪞 ENTITY LENSES:",
  entityLenses
);

return {

  lensScores:
    results,

  entityLenses,
};
}