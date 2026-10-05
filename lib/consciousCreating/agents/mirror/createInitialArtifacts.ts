import { supabase } from "../../../../services/supabase";

import type {
    CreationArea,
    NextMove,
} from "./generateNextMoves";

import type { CreationTile } from "./createCreationTiles";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export interface CreationArtifact {
  id: string;
  intention_id: string;
  tile_id: string | null;
  area: CreationArea;
  artifact_type: string;
  title: string;
  content: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CreateInitialArtifactsInput {
  intentionId: string;
  move: NextMove;
  tiles: CreationTile[];
}

export interface CreateInitialArtifactsResult {
  artifacts: CreationArtifact[];
}

// --------------------------------------------------
// CREATE INITIAL ARTIFACTS
// --------------------------------------------------

export async function createInitialArtifacts(
  input: CreateInitialArtifactsInput
): Promise<CreateInitialArtifactsResult> {
  const {
    intentionId,
    move,
    tiles,
  } = input;

  if (!intentionId) {
    throw new Error(
      "createInitialArtifacts: intentionId is required."
    );
  }

  if (!move) {
    throw new Error(
      "createInitialArtifacts: move is required."
    );
  }

  if (!Array.isArray(tiles) || tiles.length === 0) {
    throw new Error(
      "createInitialArtifacts: tiles are required."
    );
  }

  const rows = tiles.map((tile) => ({
    intention_id: intentionId,
    tile_id: tile.id,
    area: tile.area,
    artifact_type: "creation_seed",
    title: move.title,
    content: {
      description: move.description,
      type: move.type,
      rationale: move.rationale,
      source: "next_move",
    },
  }));

  const {
    data,
    error,
  } = await supabase
    .from("sovereign_intention_artifacts")
    .insert(rows)
    .select();

  if (error) {
    console.error(
      "❌ CREATE INITIAL ARTIFACTS ERROR:",
      error
    );

    throw error;
  }

  return {
    artifacts:
      (data ?? []) as CreationArtifact[],
  };
}