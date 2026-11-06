import { supabase } from "../../services/supabase";

export type ExpressionSourceType =
  | "text"
  | "voice"
  | "image"
  | "link"
  | "attachment"
  | "conversation";

export interface CaptureExpressionInput {
  userId: string;
  content: string;
  sourceType: ExpressionSourceType;

  intentionId?: string | null;

  metadata?: Record<string, unknown>;
}

export interface Expression {
  id: string;
  user_id: string;
  intention_id: string | null;
  source_type: ExpressionSourceType;
  content: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/**
 * Capture something the human has expressed.
 *
 * This stores the raw human expression.
 * It does NOT interpret, summarise, clean up or generate meaning.
 *
 * The distinction is intentional:
 *
 * EXPRESSION = what the human actually expressed
 * MEANING    = what the system later understands from it
 */
export async function captureExpression(
  input: CaptureExpressionInput
): Promise<Expression> {
  const {
    userId,
    content,
    sourceType,
    intentionId = null,
    metadata = {},
  } = input;

  if (!userId) {
    throw new Error("captureExpression: userId is required.");
  }

  if (!content?.trim()) {
    throw new Error("captureExpression: content is required.");
  }

  const { data, error } = await supabase
    .from("expressions")
    .insert({
      user_id: userId,
      intention_id: intentionId,
      source_type: sourceType,
      content: content.trim(),
      metadata,
    })
    .select()
    .single();

  if (error) {
    console.error("captureExpression failed:", error);
    throw error;
  }

  return data as Expression;
}