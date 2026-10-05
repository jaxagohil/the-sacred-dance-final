import {
    createCreationTiles,
    type CreateCreationTilesResult,
} from "./createCreationTiles";

import {
    createInitialArtifacts,
    type CreationArtifact,
} from "./createInitialArtifacts";

import type { NextMove } from "./generateNextMoves";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export interface ChooseNextMoveInput {
  intentionId: string;
  move: NextMove;
}

export interface ChooseNextMoveResult
  extends CreateCreationTilesResult {
  artifacts: CreationArtifact[];
}

// --------------------------------------------------
// CHOOSE NEXT MOVE
// --------------------------------------------------

export async function chooseNextMove(
  input: ChooseNextMoveInput
): Promise<ChooseNextMoveResult> {
  const {
    intentionId,
    move,
  } = input;

  if (!intentionId) {
    throw new Error(
      "chooseNextMove: intentionId is required."
    );
  }

  if (!move) {
    throw new Error(
      "chooseNextMove: move is required."
    );
  }

  // --------------------------------------------------
  // 1. CREATE TILE(S)
  // --------------------------------------------------

  const tileResult = await createCreationTiles({
    intentionId,
    move,
  });

  // --------------------------------------------------
  // 2. CREATE INITIAL ARTIFACT(S)
  // --------------------------------------------------

  const artifactResult =
    await createInitialArtifacts({
      intentionId,
      move,
      tiles: tileResult.tiles,
    });

  // --------------------------------------------------
  // 3. RETURN THE CREATED CREATION
  // --------------------------------------------------

  return {
    tiles: tileResult.tiles,
    artifacts: artifactResult.artifacts,
  };
}