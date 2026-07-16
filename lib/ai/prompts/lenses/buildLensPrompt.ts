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
CURRENT EVIDENCE 
--------------------------------------------------

Evidence Density:
${evidenceDensity}

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
SPIRAL MOVEMENT
--------------------------------------------------

Current spiral movement:
${lensContext?.spiralMovement || "processing"}

Dominant pole:
${lensContext?.dominantPole || "center"}

Dominant layer:
${lensContext?.dominantLayer || "emotional"}

Integration score:
${lensContext?.integrationScore || 0}

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