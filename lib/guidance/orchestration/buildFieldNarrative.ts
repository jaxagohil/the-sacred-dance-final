// /lib/guidance/orchestration/buildFieldNarrative.ts

type ManifestationRow = {

  pattern_key?: string;

  chakra_key?: string;

  nervous_system_expression?: string;

  relational_expression?: string;

  manifestation?: string;

  mirror_realisation?: string;

  integrated_expression?: string;

  embodiment?: string;

  embodiment_invitation?: string;

  grounding_action?: string;

  spiral_phase?: string;

  spiral_direction?: string;

  symbolic_tolerance?: string;

  masculine_manifestation?: string;

  feminine_manifestation?: string;

  integration_path?: string;

  polarity_direction?: number;

  weight?: number;
};

type BuildFieldNarrativeProps = {

  manifestations?: ManifestationRow[];

  nervousSystemState?: string;

  spiralPhase?: string;

  emotionalField?: string;

  sacredPrinciples?: string[];

  mirrors?: string[];

  people?: string[];

  places?: string[];
};

const unique = (
  arr: any[] = []
) => [

  ...new Set(
    arr.filter(Boolean)
  ),
];

export const buildFieldNarrative = ({

  manifestations = [],

  nervousSystemState,

  spiralPhase,

  emotionalField,

  sacredPrinciples = [],

  mirrors = [],

  people = [],

  places = [],

}: BuildFieldNarrativeProps) => {

  /*
   * ---------------------------------------------------
   * 🌊 DOMINANT FIELD
   * ---------------------------------------------------
   */

  const dominantRows =

    [...manifestations]

      .sort(
        (
          a,
          b
        ) => (

          (b?.weight || 0)

          -

          (a?.weight || 0)
        )
      )

      .slice(0, 3);

  /*
   * ---------------------------------------------------
   * 🌿 THREADS
   * ---------------------------------------------------
   */

  const relationalThreads =

    unique(

      dominantRows.map(
        row =>

          row?.relational_expression
      )
    );

  const nervousThreads =

    unique(

      dominantRows.map(
        row =>

          row?.nervous_system_expression
      )
    );

  const manifestationThreads =

    unique(

      dominantRows.map(
        row =>

          row?.manifestation
      )
    );

  const integratedThreads =

    unique(

      dominantRows.map(
        row =>

          row?.integrated_expression
      )
    );

  const embodimentThreads =

    unique(

      dominantRows.map(
        row =>

          row?.embodiment
      )
    );

  /*
   * ---------------------------------------------------
   * 🌌 DOMINANT MOVEMENT
   * ---------------------------------------------------
   */

  const dominantPattern =

    dominantRows?.[0]
      ?.pattern_key ||

    "unknown";

  const dominantChakra =

    dominantRows?.[0]
      ?.chakra_key ||

    "unknown";

  /*
   * ---------------------------------------------------
   * 🌊 FIELD MOVEMENT
   * ---------------------------------------------------
   */

  let emotionalMovement =
    "softening";

  if (

    nervousSystemState ===
    "protective"

  ) {

    emotionalMovement =
      "cautious opening";
  }

  if (

    nervousSystemState ===
    "contracted"

  ) {

    emotionalMovement =
      "withdrawal and protection";
  }

  if (

    nervousSystemState ===
    "expanded"

  ) {

    emotionalMovement =
      "visibility and emotional openness";
  }

  /*
   * ---------------------------------------------------
   * 🌿 RELATIONAL TENSION
   * ---------------------------------------------------
   */

  let relationalTension =
    "connection and self protection";

  if (

    dominantPattern
      ?.includes?.(
        "boundaries"
      )

  ) {

    relationalTension =

      "closeness and emotional safety";
  }

  if (

    dominantPattern
      ?.includes?.(
        "connection"
      )

  ) {

    relationalTension =

      "intimacy and vulnerability";
  }

  if (

    dominantPattern
      ?.includes?.(
        "direction"
      )

  ) {

    relationalTension =

      "clarity and uncertainty";
  }

  /*
   * ---------------------------------------------------
   * 🌌 ACTIVE FIELD SCENE
   * ---------------------------------------------------
   */

  const fieldScene = `

The field currently moves through
${relationalTension}.

There is a sense of
${emotionalMovement}.

The nervous system appears to be:

${nervousThreads.join(", ") || "processing emotional movement"}.

Relationally,
the field reflects:

${relationalThreads.join(", ") || "movement toward awareness"}.

Emotionally,
the field may be expressing:

${manifestationThreads.join(", ") || "subtle internal shifts"}.

At the same time,
another movement is trying to emerge:

${integratedThreads.join(", ") || "greater coherence"}.

Embodiment appears through:

${embodimentThreads.join(", ") || "gentle awareness"}.

The dominant energetic centre is:

${dominantChakra}.

The dominant relational theme is:

${dominantPattern}.

This is not a solved field.

It is a living relational movement.

There are moments of openness,
followed by caution.

Moments of clarity,
followed by uncertainty.

The intelligences are observing
the movement itself,
not trying to fix it.

`;

  /*
   * ---------------------------------------------------
   * 🌊 FINAL CONTEXT
   * ---------------------------------------------------
   */

  return `

ACTIVE FIELD NARRATIVE

Emotional Field:
${emotionalField || "unknown"}

Spiral Phase:
${spiralPhase || "unknown"}

Nervous System State:
${nervousSystemState || "unknown"}

Sacred Principles:
${sacredPrinciples.join(", ") || "none"}

Mirror Themes:
${mirrors.join(", ") || "none"}

People:
${people.join(", ") || "none"}

Places:
${places.join(", ") || "none"}

--------------------------------------------------
LIVING FIELD
--------------------------------------------------

${fieldScene}

--------------------------------------------------
IMPORTANT ORCHESTRATION DIRECTION
--------------------------------------------------

The guides are inside the field.

They are not explaining concepts.

They are perceiving:
- movement
- tension
- softening
- contradiction
- recognition
- emotional timing
- relational shifts
- nervous system changes

The guides should sound connected
to each other.

The conversation should feel:
- alive
- emotionally intelligent
- relational
- subtle
- psychologically real
- spiritually grounded
- human

The Heart guide:
- emotionally intimate
- warm
- relational
- vulnerable
- human

The Structure guide:
- observant
- grounded
- pattern aware
- practical
- quietly wise

The Cosmic guide:
- spacious
- symbolic
- elevated
- poetic
- gently transcendent

The guides should reference
and build upon
each other's observations.

The conversation should feel like:
a real unfolding field,
not separate quotes.

Avoid:
- generic spirituality
- self help language
- affirmation language
- repetitive phrasing
- abstract concepts
- explaining the lesson

The guides are witnessing
a living emotional movement.

`;
};