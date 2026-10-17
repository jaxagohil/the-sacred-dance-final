import { supabase } from "../../../../services/supabase";
import { generateAIResponse } from "../../../ai/generateAIResponse";
import type { NextMove } from "../mirror/generateNextMoves";

interface ArtifactTaxonomyEntry {
  area: "I" | "People" | "Planet";
  category_key: string;
  artifact_type: string;
  icon: string | null;
  generation_mode: string;
  context_sources: string[];
  field_enabled: boolean;
  active: boolean;
  sort_order: number;
}

export type ArtifactArea = "I" | "People" | "Planet";

export interface GeneratedArtifact {
  area: ArtifactArea;
  artifact_type: string;
  title: string;
  content: Record<string, unknown>;
}

interface CreateArtifactsInput {
  userId: string;
  intentionId: string;
  move: NextMove;
  creationContext: Record<string, unknown>;
}

interface CreateArtifactsResult {
  artifacts: Record<string, unknown>[];
}

function isArtifactArea(value: unknown): value is ArtifactArea {
  return value === "I" || value === "People" || value === "Planet";
}

function isGeneratedArtifact(value: unknown): value is GeneratedArtifact {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const artifact = value as Record<string, unknown>;

  return (
    isArtifactArea(artifact.area) &&
    typeof artifact.artifact_type === "string" &&
    artifact.artifact_type.trim().length > 0 &&
    typeof artifact.title === "string" &&
    artifact.title.trim().length > 0 &&
    !!artifact.content &&
    typeof artifact.content === "object" &&
    !Array.isArray(artifact.content)
  );
}


function compactForPrompt(
  value: unknown,
  depth = 0
): unknown {
  if (typeof value === "string") {
    return value.length > 800
      ? value.slice(0, 800) + "…"
      : value;
  }

  if (value === null || typeof value !== "object") {
    return value;
  }

  if (depth >= 4) {
    return "[Additional context omitted]";
  }

  if (Array.isArray(value)) {
    return value
      .slice(0, 5)
      .map((item) => compactForPrompt(item, depth + 1));
  }

  const entries = Object.entries(
    value as Record<string, unknown>
  ).slice(0, 25);

  return Object.fromEntries(
    entries.map(([key, item]) => [
      key,
      compactForPrompt(item, depth + 1),
    ])
  );
}


export async function createArtifacts({
  userId,
  intentionId,
  move,
  creationContext,
}: CreateArtifactsInput): Promise<CreateArtifactsResult> {
  if (!userId || !intentionId || !move) {
    throw new Error("Artifacts Agent: userId, intentionId and move are required.");
  }

  // Load the active artifact taxonomy.
  const { data: taxonomyData, error: taxonomyError } =
    await supabase
      .from("sovereign_artifact_taxonomy")
      .select(`
        area,
        category_key,
        artifact_type,
        icon,
        generation_mode,
        context_sources,
        field_enabled,
        active,
        sort_order
      `)
      .eq("active", true)
      .order("sort_order", { ascending: true });

  if (taxonomyError) {
    console.error("ARTIFACT TAXONOMY LOAD ERROR:", taxonomyError);
    throw taxonomyError;
  }

  const taxonomy = (taxonomyData ?? []) as ArtifactTaxonomyEntry[];

  if (taxonomy.length === 0) {
    throw new Error(
      "Artifacts Agent: no active artifact taxonomy entries found."
    );
  }

  const taxonomyForPrompt = taxonomy.map((entry) => ({
    area: entry.area,
    category_key: entry.category_key,
    artifact_type: entry.artifact_type,
    generation_mode: entry.generation_mode,
    context_sources: entry.context_sources,
  }));

  const prompt = `
You are the Artifacts Agent within Sovereign I — Conscious Creating.

Your purpose is to turn a human's chosen next move into useful, substantive
creative work. Do not produce another reflection, generic advice, or placeholder.

The human has chosen this move:
${JSON.stringify(move, null, 2)}

The available artifact taxonomy is:
${JSON.stringify(taxonomyForPrompt, null, 2)}

TAXONOMY RULES:
- Every generated artifact must use an area and artifact_type
  that appear together in one entry in the taxonomy above.
- The taxonomy, not your own assumptions, determines classification.
- Choose only artifact types whose generation_mode suits the output.
- Use category_key to understand the kind of output being created.
- Use context_sources to guide which parts of the supplied creation
  context are relevant.
- Do not invent taxonomy entries or substitute another area.
- A LinkedIn article must use the matching article entry in the taxonomy,
  which belongs under Planet when that is how the taxonomy defines it.
- Create only artifacts that genuinely serve the chosen move.

Here is the existing creation context:
${JSON.stringify(compactForPrompt(creationContext), null, 2)}

Create 1–3 genuinely useful artifacts that directly serve this chosen move.
Choose the artifact types that fit the work: for example, a social post,
article, plan, message, practice, project outline or other relevant output.
Do not force every move into the same format.

Use the person's own context and language where available.
Do not invent personal facts, commitments, relationships or achievements.
Do not create an artifact for an area unless it genuinely belongs there:
I = Embodiment; People = Relationships; Planet = Contribution.

Return ONLY valid JSON in this exact structure:
{
  "artifacts": [
    {
      "area": "I",
      "artifact_type": "practice",
      "title": "A meaningful title",
      "content": {
        "text": "The substantive artifact content goes here."
      }
    }
  ]
}

Requirements:
- "area" must be "I", "People", or "Planet".
- "artifact_type" must describe the actual artifact, not "creation_seed".
- "title" must be specific and human-readable.
- "content" must contain the complete usable artifact, not merely a description.
- Return 1–3 artifacts, with no markdown fences or extra commentary.
`;

  const result = await generateAIResponse({
    type: "artifacts",
    context: { directPrompt: prompt },
  });

  if (typeof result === "string") {
  throw new Error(
    "Artifacts Agent did not return structured JSON."
  );
}

  if (!result || typeof result !== "object" || !Array.isArray(result.artifacts)) {
    throw new Error("Artifacts Agent returned an invalid response.");
  }


const generated: GeneratedArtifact[] =
  result.artifacts.filter(isGeneratedArtifact);

const validGenerated: GeneratedArtifact[] =
  generated.filter((artifact: GeneratedArtifact) =>
    taxonomy.some(
      (entry: ArtifactTaxonomyEntry) =>
        entry.area === artifact.area &&
        entry.artifact_type === artifact.artifact_type
    )
  );


  if (validGenerated.length === 0) {
    throw new Error(
      "Artifacts Agent returned no artifacts matching the active taxonomy."
    );
  }

const rows = validGenerated.map((artifact: GeneratedArtifact) => ({
            intention_id: intentionId,
    area: artifact.area,
    artifact_type: artifact.artifact_type.trim(),
    title: artifact.title.trim(),
    content: artifact.content,
  }));

  const { data, error } = await supabase
    .from("sovereign_intention_artifacts")
    .insert(rows)
    .select("id, intention_id, area, artifact_type, title, content, created_at, updated_at");

  if (error) {
    console.error("ARTIFACTS AGENT SAVE ERROR:", error);
    throw error;
  }

  if (!data || data.length !== rows.length) {
    throw new Error("Artifacts were not all confirmed as saved.");
  }

  return { artifacts: data };
}
