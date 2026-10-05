import { supabase } from "../../../../services/supabase";

import type {
    CreationArea,
    NextMove,
} from "./generateNextMoves";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export interface CreationTile {
  id: string;
  intention_id: string;
  area: CreationArea;
  title: string;
  description: string | null;
  is_new: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCreationTilesInput {
  intentionId: string;
  move: NextMove;
}

export interface CreateCreationTilesResult {
  tiles: CreationTile[];
}

// --------------------------------------------------
// CREATE CREATION TILES
// --------------------------------------------------

export async function createCreationTiles(
  input: CreateCreationTilesInput
): Promise<CreateCreationTilesResult> {
  const {
    intentionId,
    move,
  } = input;

  if (!intentionId) {
    throw new Error(
      "createCreationTiles: intentionId is required."
    );
  }

  if (!move) {
    throw new Error(
      "createCreationTiles: move is required."
    );
  }

  if (
    !Array.isArray(move.areas) ||
    move.areas.length === 0
  ) {
    throw new Error(
      "createCreationTiles: move must contain at least one area."
    );
  }

  const rows = move.areas.map(
    (area) => ({
      intention_id: intentionId,
      area,
      title: move.title,
      description: move.description,
      is_new: true,
    })
  );

  const {
    data,
    error,
  } = await supabase
    .from("sovereign_creation_tiles")
    .insert(rows)
    .select();

  if (error) {
    console.error(
      "❌ CREATE CREATION TILES ERROR:",
      error
    );

    throw error;
  }

  return {
    tiles:
      (data ?? []) as CreationTile[],
  };
}