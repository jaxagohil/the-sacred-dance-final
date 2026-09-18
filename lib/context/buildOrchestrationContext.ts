// /lib/context/buildOrchestrationContext.ts

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

  spiral_pressure?: number;

  symbolic_tolerance?: string;

  masculine_manifestation?: string;

  feminine_manifestation?: string;

  integration_path?: string;

  polarity_direction?: number;

  weight?: number;
};

type BuildOrchestrationContextProps = {
  manifestations?: ManifestationRow[];

  emotionalField?: string;

  spiralPhase?: string;

  nervousSystemState?: string;

  collectiveAtmosphere?: string[];

  sacredPrinciples?: string[];

  mirrors?: string[];

  signs?: string[];

  people?: string[];

  places?: string[];

  things?: string[];

  lensContexts?: {
    people?: any;
    places?: any;
    things?: any;
  };
};

const formatList = (
  label: string,
  values?: string[]
) => {

  if (
    !values?.length
  ) {
    return "";
  }

  return `

${label}
${values
  .filter(Boolean)
  .map(
    value => `- ${value}`
  )
  .join("\n")}
`;
};

export const buildOrchestrationContext = ({

  manifestations = [],

  emotionalField,

  spiralPhase,

  nervousSystemState,

  collectiveAtmosphere = [],

  sacredPrinciples = [],

  mirrors = [],

  signs = [],

  people = [],

  places = [],

  things = [],

  lensContexts = {},

}: BuildOrchestrationContextProps) => {

  /*
   * ----------------------------------------
   * RESOLVE DOMINANT FIELD
   * ----------------------------------------
   */

const dominantRows = [...manifestations]
  .sort(
    (a, b) =>
      (b?.weight || 0) -
      (a?.weight || 0)
  )
  .slice(0, 3);

  /*
   * ----------------------------------------
   * BUILD ACTIVE FIELD
   * ----------------------------------------
   */

  const activeField = dominantRows

    .map(row => `

PATTERN FIELD

Pattern:
${row?.pattern_key || "unknown"}

Chakra:
${row?.chakra_key || "unknown"}

Nervous System Movement:
${row?.nervous_system_expression || "unknown"}

Relational Movement:
${row?.relational_expression || "unknown"}

Manifestation:
${row?.manifestation || "unknown"}

Mirror Realisation:
${row?.mirror_realisation || "unknown"}

Integrated Expression:
${row?.integrated_expression || "unknown"}

Embodiment:
${row?.embodiment || "unknown"}

Embodiment Invitation:
${row?.embodiment_invitation || "unknown"}

Grounding Action:
${row?.grounding_action || "unknown"}

Integration Path:
${row?.integration_path || "unknown"}

Spiral Phase:
${row?.spiral_phase || "unknown"}

Spiral Direction:
${row?.spiral_direction || "unknown"}

Spiral Pressure:
${row?.spiral_pressure || 0}

Symbolic Tolerance:
${row?.symbolic_tolerance || "unknown"}

Masculine Manifestation:
${row?.masculine_manifestation || "unknown"}

Feminine Manifestation:
${row?.feminine_manifestation || "unknown"}

Polarity Direction:
${row?.polarity_direction || 0}

`)
    .join("\n");

/*
 * ----------------------------------------
 * BUILD FIELD MOVEMENT SUMMARY
 * ----------------------------------------
 */

const fieldMovementSummary =

  dominantRows

    .map(
      row => `

- ${row?.relational_expression || ""}

- ${row?.nervous_system_expression || ""}

- ${row?.integration_path || ""}

- ${row?.embodiment_invitation || ""}

`
    )

    .join("\n");    

    /*
 * ----------------------------------------
 * 🌍 MY WORLD
 * ----------------------------------------
 *
 * Uses the already-resolved People,
 * Places and Things lens contexts.
 *
 * Keep this compact.
 * Orchestration needs lived evidence,
 * not the entire lens architecture.
 * ----------------------------------------
 */

const buildWorldLens = (
  label: string,
  lens: any
) => {

  if (!lens) {
    return "";
  }

    /*
   * ----------------------------------------
   * 🌍 LIVED MOMENTS
   * ----------------------------------------
   *
   * Preserve concrete reality:
   * who / what + what the user actually said.
   * ----------------------------------------
   */

  const livedMoments = (
    lens?.strongestEntries || []
  )
    .map((entry: any) => {

      const reflection =
        entry?.source_reflection
        || entry?.sourceReflection
        || entry?.reflection
        || entry?.text
        || "";

      const entities = (
        entry?.entities || []
      )
        .filter(Boolean)
        .join(", ");

      if (!reflection) {
        return null;
      }

      return entities
        ? `${entities} — "${reflection}"`
        : `"${reflection}"`;
    })
    .filter(Boolean)
    .slice(0, 5);

  const evidence = (
    lens?.evidenceSummaries || []
  )
    .filter(Boolean)
    .slice(0, 3);

  const relational = (
    lens?.relationalMirrors || []
  )
    .map(
      (item: any) =>
        typeof item === "string"
          ? item
          : item?.text
    )
    .filter(Boolean)
    .slice(0, 3);

  const scenes = (
    lens?.observableSceneThreads || []
  )
    .map(
      (item: any) =>
        typeof item === "string"
          ? item
          : item?.text
    )
    .filter(Boolean)
    .slice(0, 3);

  const manifestations = (
    lens?.manifestationThreads || []
  )
    .map(
      (item: any) =>
        typeof item === "string"
          ? item
          : item?.text
    )
    .filter(Boolean)
    .slice(0, 3);

  const emotionalThemes = (
    lens?.emotionalThemes || []
  )
    .filter(Boolean)
    .slice(0, 3);

  const symbolicThemes = (
    lens?.symbolicThemes || []
  )
    .filter(Boolean)
    .slice(0, 3);

  const hasContent =
    livedMoments.length ||
    evidence.length ||
    relational.length ||
    scenes.length ||
    manifestations.length ||
    emotionalThemes.length ||
    symbolicThemes.length;

  if (!hasContent) {
    return "";
  }

  return `

${label}

${formatList(
  "Lived Moments:",
  livedMoments
)}

${formatList(
  "Lived Evidence:",
  evidence
)}

${formatList(
  "Relational Mirrors:",
  relational
)}

${formatList(
  "Observable Movement:",
  scenes
)}

${formatList(
  "Manifestations:",
  manifestations
)}

${formatList(
  "Emotional Themes:",
  emotionalThemes
)}

${formatList(
  "Symbolic Themes:",
  symbolicThemes
)}
`;
};

const myWorldContext = `

--------------------------------------------------
MY WORLD
--------------------------------------------------

These are lived contexts already observed
through the user's People, Places and Things lenses.

They are context, not conclusions.

Use them only when relevant to the current movement.

Do not force a person, place or thing
into the conversation merely because it appears here.

When relevant, prefer concrete lived context
over abstract interpretation.

${buildWorldLens(
  "PEOPLE",
  lensContexts?.people
)}

${buildWorldLens(
  "PLACES",
  lensContexts?.places
)}

${buildWorldLens(
  "THINGS",
  lensContexts?.things
)}
`;

  /*
   * ----------------------------------------
   * BUILD CONTEXT
   * ----------------------------------------
   */

  return `

ACTIVE SACRED DANCE FIELD

Emotional Field:
${emotionalField || "unknown"}

Spiral Phase:
${spiralPhase || "unknown"}

Nervous System State:
${nervousSystemState || "unknown"}

${formatList(
  "Collective Atmosphere:",
  collectiveAtmosphere
)}

${formatList(
  "Sacred Principles:",
  sacredPrinciples
)}

${formatList(
  "Mirror Themes:",
  mirrors
)}

${formatList(
  "Signs:",
  signs
)}

${formatList(
  "People:",
  people
)}

${formatList(
  "Places:",
  places
)}

${formatList(
  "Things:",
  things
)}

${myWorldContext}

FIELD MOVEMENT SUMMARY

${fieldMovementSummary}

--------------------------------------------------
DOMINANT ACTIVE FIELD
--------------------------------------------------

${activeField}

--------------------------------------------------
IMPORTANT ORCHESTRATION NOTE
--------------------------------------------------

The intelligences are not explaining these fields.

They are naturally perceiving movement
inside these relational dynamics.

The orchestration should feel:
- emotionally real
- psychologically grounded
- relationally intelligent
- symbolically alive
- behaviourally recognisable
- embodied
- subtle
- cinematic

The conversation should emerge naturally
from the tensions,
movements,
contradictions,
softenings,
patterns,
and recognitions
inside the active field.

Avoid abstract spirituality.

Ground the orchestration
inside lived emotional reality.

`;
};