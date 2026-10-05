import { supabase } from "../../services/supabase";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export type MeaningStatus =
  | "proposed"
  | "confirmed"
  | "challenged"
  | "rejected";

export interface CaptureMeaningInput {
  userId: string;
  meaning: string;

  expressionId?: string | null;
  intentionId?: string | null;

  confidence?: number | null;
  status?: MeaningStatus;

  metadata?: Record<string, unknown>;
}

export interface Meaning {
  id: string;
  user_id: string;
  expression_id: string | null;
  intention_id: string | null;
  meaning: string;
  confidence: number | null;
  status: MeaningStatus;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface UpdateMeaningStatusInput {
  meaningId: string;
  userId: string;
  status: MeaningStatus;
  metadata?: Record<string, unknown>;
}

// --------------------------------------------------
// CAPTURE MEANING
// --------------------------------------------------

/**
 * Store an interpreted meaning.
 *
 * MEANING is what the system understands from an expression.
 *
 * It is deliberately separate from the original expression so
 * the human's actual words are never overwritten by interpretation.
 *
 * New meanings default to "proposed".
 * The human remains the authority on whether the meaning is correct.
 */
export async function captureMeaning(
  input: CaptureMeaningInput
): Promise<Meaning> {
  const {
    userId,
    meaning,
    expressionId = null,
    intentionId = null,
    confidence = null,
    status = "proposed",
    metadata = {},
  } = input;

  if (!userId) {
    throw new Error("captureMeaning: userId is required.");
  }

  if (!meaning?.trim()) {
    throw new Error("captureMeaning: meaning is required.");
  }

  const { data, error } = await supabase
    .from("meanings")
    .insert({
      user_id: userId,
      expression_id: expressionId,
      intention_id: intentionId,
      meaning: meaning.trim(),
      confidence,
      status,
      metadata,
    })
    .select()
    .single();

  if (error) {
    console.error("captureMeaning failed:", error);
    throw error;
  }

  return data as Meaning;
}

// --------------------------------------------------
// UPDATE MEANING STATUS
// --------------------------------------------------

/**
 * Update the human's response to an interpreted meaning.
 *
 * The meaning itself is not rewritten here.
 * We preserve what was originally proposed and record the
 * human's response through status + metadata.
 */
export async function updateMeaningStatus(
  input: UpdateMeaningStatusInput
): Promise<Meaning> {
  const {
    meaningId,
    userId,
    status,
    metadata,
  } = input;

  if (!meaningId) {
    throw new Error("updateMeaningStatus: meaningId is required.");
  }

  if (!userId) {
    throw new Error("updateMeaningStatus: userId is required.");
  }

  const updatePayload: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (metadata !== undefined) {
    updatePayload.metadata = metadata;
  }

  const { data, error } = await supabase
    .from("meanings")
    .update(updatePayload)
    .eq("id", meaningId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("updateMeaningStatus failed:", error);
    throw error;
  }

  return data as Meaning;
}

// --------------------------------------------------
// CONFIRM
// --------------------------------------------------

/**
 * Human confirms that the proposed meaning feels accurate.
 */
export async function confirmMeaning(
  meaningId: string,
  userId: string
): Promise<Meaning> {
  return updateMeaningStatus({
    meaningId,
    userId,
    status: "confirmed",
  });
}

// --------------------------------------------------
// CHALLENGE
// --------------------------------------------------

/**
 * Human says the proposed meaning is not quite right.
 *
 * The original meaning remains intact so the system can see
 * what it previously understood.
 *
 * Additional human clarification can be stored in metadata.
 */
export async function challengeMeaning(
  meaningId: string,
  userId: string,
  clarification?: string
): Promise<Meaning> {
  return updateMeaningStatus({
    meaningId,
    userId,
    status: "challenged",
    metadata: clarification
      ? {
          human_challenge: clarification,
        }
      : undefined,
  });
}

// --------------------------------------------------
// REJECT
// --------------------------------------------------

/**
 * Human rejects the proposed meaning.
 *
 * We do not delete it because the rejected interpretation
 * is still useful context for understanding how the system
 * misunderstood the expression.
 */
export async function rejectMeaning(
  meaningId: string,
  userId: string,
  reason?: string
): Promise<Meaning> {
  return updateMeaningStatus({
    meaningId,
    userId,
    status: "rejected",
    metadata: reason
      ? {
          human_rejection: reason,
        }
      : undefined,
  });
}