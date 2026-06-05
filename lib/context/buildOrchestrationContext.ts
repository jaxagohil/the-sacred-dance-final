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

}: BuildOrchestrationContextProps) => {

  /*
   * ----------------------------------------
   * RESOLVE DOMINANT FIELD
   * ----------------------------------------
   */

  const dominantRows = manifestations

    .sort(
      (
        a,
        b
      ) => (
        (b?.weight || 0)
        - (a?.weight || 0)
      )
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