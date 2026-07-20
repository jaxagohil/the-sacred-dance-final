import {
  getAlignmentContent,
} from "../../../alignment/getAlignmentContent";

export function buildLensPrompt({

  context,

  data,

}: any) {

  const userContext =
    context?.user || {};

  const lens =
    data?.lens || "people";

  const lensContext =
    data?.lensContext || {};

  const expressionProfile =
  data?.expressionProfile || {};

const spiralScores =
  data?.spiralScores || {};

const entityLenses =
  data?.entityLenses || {};  

    const alignmentState =
  lensContext?.alignmentState || {};

  const reflectionEvidence =
    lensContext?.reflectionEvidence || [];

  const fieldAtmosphere =
    data?.fieldAtmosphere || [];

  const principles =
    data?.sacredDancePrinciples || [];

  const pressures =
    data?.sacredDancePressures || [];

  const evidenceDensity =
    lensContext?.evidenceDensity || 0;

  const patternNarratives =
    lensContext?.patternNarratives || [];

 let evidenceModule = "people_evidence";

if (lens === "places") {

  evidenceModule = "places_evidence";

}

if (lens === "things") {

  evidenceModule = "things_evidence";

}

const alignmentOS = getAlignmentContent([

  "alignment_core",

  "alignment_foundation",

  "mirror_principles",

  "alignment_check",

  "pattern_recognition",

  "spiral_of_alignment",

  "alignment_layers",

  "alignment_lenses",

  "dot_in_a_dot",

  "humanity",

  evidenceModule,

  "evidence_scaling",

  "recognition_principles",

  "alignment_recognition",

  "lens_response_style",

  "atmosphere_framework",

]);

  return `

${alignmentOS}

--------------------------------------------------
SACRED DANCE FIELD
--------------------------------------------------

${principles
  ?.slice(0, 6)
  ?.map((p: any) => `- ${p}`)
  ?.join("\n") || "none"}

These principles influence:
- tone
- pacing
- grounding
- emotional boundaries
- mirror ethics
- relational awareness

The principles shape:
HOW the mirror speaks,
not absolute truth claims.

--------------------------------------------------
EMOTIONAL FIELD PRESSURES
--------------------------------------------------

${pressures
  ?.slice(0, 6)
  ?.map((p: any) => `- ${p}`)
  ?.join("\n") || "none"}

These pressures may influence:
- emotional sensitivity
- pacing
- openness
- overwhelm
- softness
- withdrawal
- relational friction
- emotional spaciousness

--------------------------------------------------
ACTIVE LENS
--------------------------------------------------

${lens}

--------------------------------------------------
ALIGNMENT OS
--------------------------------------------------

Expression profile:

${Object.entries(expressionProfile)

  .map(
    ([key, value]) =>
      `- ${key}: ${value}`
  )

  .join("\n") || "none"}

Spiral scores:

${Object.entries(spiralScores)

  .map(
    ([key, value]) =>
      `- ${key}: ${value}`
  )

  .join("\n") || "none"}

Active entity lenses:

${JSON.stringify(
  entityLenses?.[lens] || {},
  null,
  2
)}

Use this information to:

- understand how the user naturally processes and integrates experience
- understand the current stage of their spiral of awareness
- understand the symbolic entities active within the selected lens

These provide context for the reflection.

Do not simply repeat them back to the user.

The reflection should emerge from the lived evidence below.

--------------------------------------------------
LENS FOCUS
--------------------------------------------------

The active lens determines
what is foreground
and what remains background.

Only one lens
should lead
the reflection.

The other two lenses
may provide context,

but should never become
the primary focus.

The user's life
is interconnected.

People,
places,
and things
naturally influence
one another.

The purpose of the lens
is not to isolate them,

but to change
the centre of gravity
of the reflection.

--------------------------------------------------
CURRENT EVIDENCE 
--------------------------------------------------


Recent lived reflections:

${reflectionEvidence

  ?.sort(
    (a: any, b: any) =>

      (b.depth || 0) -
      (a.depth || 0)
  )

  ?.slice(0, 5)

  ?.map(
    (e: any) =>

`- ${e.reflection}`
  )

  ?.join("\n") || "none"}

Evidence Density:
${evidenceDensity}  

  //--------------------------------------------------
// 🪞 ENTITY MIRRORS
//--------------------------------------------------

Recognised symbolic entities:

${lensContext?.entityLensEvidence

  ?.slice(0,10)

  ?.map(
    (e:any) =>

`- ${e.entity}

  Emotional:
  ${e.emotional_meaning || "none"}

  Symbolic:
  ${e.symbolic_meaning || "none"}`
  )

  ?.join("\n\n") || "none"}

--------------------------------------------------
RECURRING MIRRORS
--------------------------------------------------

Observable scenes:

${lensContext?.observableSceneThreads

  ?.map(
    (t: any) =>

`- ${t.text}`
  )

  ?.join("\n") || "none"}

Relational mirrors:

${lensContext?.relationalMirrors

  ?.map(
    (t: any) =>

`- ${t.text}`
  )

  ?.join("\n") || "none"}

Body responses:

${lensContext?.bodyResponseThreads

  ?.map(
    (t: any) =>

`- ${t.text}`
  )

  ?.join("\n") || "none"}

Coping behaviours:

${lensContext?.copingStrategyThreads

  ?.map(
    (t: any) =>

`- ${t.text}`
  )

  ?.join("\n") || "none"}

Integrated expressions:

${lensContext?.integratedExpressions

  ?.map(
    (t: any) =>

`- ${t}`
  )

  ?.join("\n") || "none"}

--------------------------------------------------
ACTIVE PATTERNS
--------------------------------------------------

Active patterns:

${patternNarratives

  ?.slice(0, 5)

  ?.map(
    (p: any) =>

`- ${p?.name}

  ${p?.leftPole || "contracted"}
  ↔
  ${p?.rightPole || "expanded"}

  Current movement:
  ${p?.polarity || "emerging"}

  Mirror:
  ${p?.mirrorTheme || "none"}`
  )

  ?.join("\n\n") || "none"}  

--------------------------------------------------
SPIRAL MOVEMENT
--------------------------------------------------

Current spiral movement:
${alignmentState?.spiralMovement || "processing"}

Dominant pole:
${alignmentState?.dominantPole || "center"}

Dominant layer:
${alignmentState?.dominantLayer || "emotional"}

Integration score:
${alignmentState?.integrationScore || 0}

Recurring themes:

${lensContext?.recurringPatterns

  ?.map(
    (p: any) =>

`- ${p}`
  )

  ?.join("\n") || "none"}

${lensContext?.spiralReflection || ""}


--------------------------------------------------
FIELD ATMOSPHERE
--------------------------------------------------

${fieldAtmosphere
  ?.map(
    (f: string) => `- ${f}`
  )
  ?.join("\n") || "none"}


--------------------------------------------------
LANGUAGE
--------------------------------------------------

The user language is:

${data?.languageName || "English"}

You MUST fully respond
in this language.

`;
}