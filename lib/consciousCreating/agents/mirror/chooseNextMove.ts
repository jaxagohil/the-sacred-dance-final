
import {
  createCreationTiles,
  type CreateCreationTilesResult,
} from "./createCreationTiles";

import {
  createArtifacts,
} from "../artifacts/createArtifacts";

import { getUserId } from "../../../user";
import { getCreationContext } from "../../getCreationContext";
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
  artifacts: Record<string, unknown>[];
}

// --------------------------------------------------
// CHOOSE NEXT MOVE
// --------------------------------------------------

export async function chooseNextMove(
  input: ChooseNextMoveInput
): Promise<ChooseNextMoveResult> {
  const { intentionId, move } = input;

  if (!intentionId) {
    throw new Error("chooseNextMove: intentionId is required.");
  }

  if (!move) {
    throw new Error("chooseNextMove: move is required.");
  }

  // 1. Resolve the current user.
  const userId = await getUserId();

  if (!userId) {
    throw new Error("chooseNextMove: no authenticated user found.");
  }

  // 2. Load the real creation context.
  const creationContext = await getCreationContext({
    userId,
    intentionId,
    activeStage: "build",
  });

  // 3. Create the relevant I / People / Planet tiles.
  const tileResult = await createCreationTiles({
    intentionId,
    move,
  });

  // 4. Generate and save substantive artifacts.
  const artifactResult = await createArtifacts({
    userId,
    intentionId,
    move,
    creationContext,
  });

  // 5. Return the results for the UI to refresh.
  return {
    tiles: tileResult.tiles,
    artifacts: artifactResult.artifacts,
  };
}
