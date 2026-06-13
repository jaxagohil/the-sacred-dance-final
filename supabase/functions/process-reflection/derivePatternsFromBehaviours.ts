import { supabase } from "./supabase.ts";

const OPENAI_API_KEY =
  Deno.env.get(
    "OPENAI_API_KEY"
  )!;

console.log("🪞 PATTERN FUNCTION LOADED");

type BehaviourInput = {
  id: string;
  weight?: number;
};

type PatternScore = {
  id: string;
  score: number;
};

export async function derivePatternsFromBehaviours(

  behaviours: BehaviourInput[],

  reflectionText: string = "",

  source: string = "reflection",

  signalDepth: number = 1,
) {

  console.log(
    "🪞 INPUT BEHAVIOURS:",
    behaviours
  );

  // -----------------------------------
  // 🛡 EMPTY GUARD
  // -----------------------------------

  if (!behaviours?.length) {

    console.log(
      "⚠️ NO BEHAVIOURS PROVIDED"
    );

    return [];
  }

  const behaviourIds = behaviours.map(
    (b) => b.id
  );

  console.log(
    "🪞 BEHAVIOUR IDS:",
    behaviourIds
  );

  // -----------------------------------
  // 🧠 LOAD MAP ROWS
  // -----------------------------------

  const { data, error } = await supabase
    .from("behaviour_pattern_map")
    .select("*")
    .in("behaviour_id", behaviourIds);

  if (error) {

    console.error(
      "❌ PATTERN MAP ERROR:",
      error
    );

    return [];
  }

  console.log(
    "🪞 MAP ROWS:",
    data
  );

  // -----------------------------------
  // 🧠 SCORE PATTERNS
  // -----------------------------------

  const patternScores:
    Record<string, number> = {};

 // -----------------------------------
// ⚖️ DYNAMIC THRESHOLD
// -----------------------------------

let minimumWeight = 0.5;

// -----------------------------------
// 🌱 BASELINE
// -----------------------------------

if (source === "baseline") {

  minimumWeight = 0.75;
}

// -----------------------------------
// 📓 JOURNAL
// -----------------------------------

if (source === "journal") {

  minimumWeight = 0.55;
}

// -----------------------------------
// 🌌 GUIDANCE
// -----------------------------------

if (source === "guidance") {

  minimumWeight = 0.5;
}

// -----------------------------------
// 🌊 SIGNAL DEPTH SOFTENING
// -----------------------------------

if (signalDepth >= 4) {

  minimumWeight -= 0.1;
}   

  for (const row of data || []) {

    console.log(
      "🪞 PROCESSING ROW:",
      row
    );

    // -----------------------------------
// 🚫 SKIP WEAK MAPS
// -----------------------------------

if (
  (row.weight || 0)
    < minimumWeight
) {

  console.log(
    "⚖️ SKIPPING WEAK MAP:",
    row
  );

  continue;
}
    const behaviour =
      behaviours.find(
        (b) =>
          b.id === row.behaviour_id
      );

    console.log(
      "🪞 MATCHED BEHAVIOUR:",
      behaviour
    );

    const behaviourWeight =
      behaviour?.weight || 1;

    const mapWeight =
      row.weight || 1;

    const score =
      behaviourWeight * mapWeight;

    console.log(
      "🪞 SCORE:",
      {
        behaviourWeight,
        mapWeight,
        score,
        pattern: row.pattern_id,
      }
    );

    if (
      !patternScores[
        row.pattern_id
      ]
    ) {

      patternScores[
        row.pattern_id
      ] = 0;
    }

    patternScores[
      row.pattern_id
    ] += score;
  }

  console.log(
    "🪞 RAW PATTERN SCORES:",
    patternScores
  );

  // -----------------------------------
  // 🧠 SORT RESULTS
  // -----------------------------------

  const sorted: PatternScore[] =
    Object.entries(patternScores)

      .map(([id, score]) => ({
        id,
        score,
      }))

      .sort(
        (a, b) =>
          b.score - a.score
      );

console.log(
  "🧠 DERIVED PATTERNS:",
  sorted
);

// -----------------------------------
// 🎯 TOP 3 CANDIDATES
// -----------------------------------

const candidatePatterns =
  sorted.slice(0, 3);

console.log(
  "🎯 CANDIDATE PATTERNS:",
  candidatePatterns
);

// -----------------------------------
// 🧠 LOAD PATTERN SEMANTICS
// -----------------------------------

const patternIds =
  candidatePatterns.map(
    (p) => p.id
  );

const {
  data: patternRows,
  error: patternError,
} = await supabase
  .from("patterns")
  .select(`
    id,
    mirror_theme,
    fear,
    gift,
    integration,
    higher_perspective,
    energetic_axis,
    center_expression
  `)
  .in("id", patternIds);

if (
  patternError ||
  !patternRows?.length
) {

  console.log(
    "⚠️ PATTERN SEMANTIC LOAD FAILED"
  );

  return candidatePatterns.slice(0, 2);
}

console.log(
  "🧠 PATTERN SEMANTICS:",
  patternRows
);

console.log(
  "🧠 PATTERN REFLECTION TEXT:",
  reflectionText
);

console.log(
  "🧠 PATTERN SOURCE:",
  source
);

console.log(
  "🧠 PATTERN SIGNAL DEPTH:",
  signalDepth
);

// -----------------------------------
// 🤖 AI PATTERN SELECTION
// -----------------------------------

const semanticPrompt = `
Behaviours:
${behaviours
  .map((b) => b.id)
  .join(", ")}

Reflection:
${reflectionText}

Candidate patterns:

${JSON.stringify(
  patternRows,
  null,
  2
)}

Choose the 1 or 2 patterns that best
represent the reflection.

Use meaning, context and lived reality.

Do not choose patterns simply because
they scored highest.

A simple observation should not create
deep psychological patterns unless the
reflection genuinely supports them.

If the reflection is simple,
neutral or observational,
prefer selecting only one pattern.

Only return two patterns when
multiple themes are clearly present.

Return JSON only:

{
  "patterns": [
    "pattern_id"
  ]
}
`;

const aiRes = await fetch(
  "https://api.openai.com/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Content-Type":
        "application/json",
      Authorization:
        `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0,
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "user",
          content: semanticPrompt,
        },
      ],
    }),
  }
);

if (!aiRes.ok) {

  console.log(
    "⚠️ AI PATTERN SELECTION FAILED"
  );

  return candidatePatterns.slice(0, 2);
}

const aiData =
  await aiRes.json();

const raw =
  aiData?.choices?.[0]
    ?.message?.content;

console.log(
  "🤖 PATTERN AI RAW:",
  raw
);

let selectedPatternIds: string[] = [];

try {

  const parsed =
    JSON.parse(raw);

  selectedPatternIds =
    parsed.patterns || [];

} catch {

  console.log(
    "⚠️ PATTERN AI PARSE FAILED"
  );

  return candidatePatterns.slice(0, 2);
}

console.log(
  "🎯 AI SELECTED PATTERNS:",
  selectedPatternIds
);

return candidatePatterns.filter(
  (p) =>
    selectedPatternIds.includes(
      p.id
    )
);

}