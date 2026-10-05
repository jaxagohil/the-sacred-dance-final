import {
  captureMeaning,
  Meaning,
} from "./captureMeaning";

import {
  generateAIResponse,
} from "../ai/generateAIResponse";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export interface InterpretExpressionInput {
  userId: string;
  expressionId: string;
  expression: string;

  intentionId?: string | null;

  context?: Record<string, unknown>;
}

export interface MeaningProposal {
  meaning: string;
  confidence: number;
  metadata?: Record<string, unknown>;
}

// --------------------------------------------------
// INTERPRET EXPRESSION
// --------------------------------------------------

/**
 * Interpret a human expression.
 *
 * HUMAN EXPRESSION
 *        ↓
 * AI INTERPRETATION
 *        ↓
 * MEANING PROPOSAL
 *        ↓
 * HUMAN AUTHORITY
 *
 * The AI may propose what it thinks the human means.
 * It does NOT establish that meaning as truth.
 *
 * Every generated meaning is stored as:
 *
 *     status: "proposed"
 *
 * The human can later confirm, challenge, or reject it.
 */
export async function interpretExpression(
  input: InterpretExpressionInput
): Promise<Meaning[]> {

  const {
    userId,
    expressionId,
    expression,
    intentionId = null,
    context = {},
  } = input;

  if (!userId) {
    throw new Error(
      "interpretExpression: userId is required."
    );
  }

  if (!expressionId) {
    throw new Error(
      "interpretExpression: expressionId is required."
    );
  }

  if (!expression?.trim()) {
    throw new Error(
      "interpretExpression: expression is required."
    );
  }

  // --------------------------------------------------
  // BUILD INTERPRETATION PROMPT
  // --------------------------------------------------

  const prompt = `
You are helping a human understand what they may mean.

You are NOT deciding what they mean.

The original human expression must remain untouched.

Your task is to propose one or more possible meanings
that could reasonably be present in the expression.

Distinguish interpretation from fact.

Do not diagnose.

Do not manufacture insight.

Do not turn an interpretation into certainty.

If the expression is ambiguous, preserve the ambiguity.

The human remains the authority on their own meaning.

--------------------------------------------------
HUMAN EXPRESSION
--------------------------------------------------

"${expression.trim()}"

--------------------------------------------------
CREATION CONTEXT
--------------------------------------------------

${JSON.stringify(
  context,
  null,
  2
)}

--------------------------------------------------
OUTPUT
--------------------------------------------------

Return ONLY valid JSON:

{
  "proposals": [
    {
      "meaning": "possible meaning",
      "confidence": 0.0,
      "metadata": {}
    }
  ]
}

Confidence must be between 0 and 1.

If there is not enough evidence to propose a meaningful
interpretation, return:

{
  "proposals": []
}
`;

  // --------------------------------------------------
  // ASK EXISTING AI SERVICE
  // --------------------------------------------------

  let result: any;

  try {

    result =
      await generateAIResponse({
        type: "mirror",
        context: {
          directPrompt: prompt,
        },
      });

  } catch (error) {

    console.error(
      "❌ INTERPRET EXPRESSION AI ERROR:",
      error
    );

    return [];
  }

  // --------------------------------------------------
  // NORMALISE AI RESULT
  // --------------------------------------------------

  let proposals: MeaningProposal[] = [];

  if (
    result &&
    typeof result === "object" &&
    !Array.isArray(result)
  ) {

    const rawProposals =
      (result as Record<string, unknown>)
        .proposals;

    if (
      Array.isArray(rawProposals)
    ) {

      proposals =
        rawProposals
          .filter(
            (
              item
            ): item is Record<
              string,
              unknown
            > =>
              !!item &&
              typeof item ===
                "object"
          )
          .map(
            (item) => ({
              meaning:
                typeof item.meaning ===
                "string"
                  ? item.meaning.trim()
                  : "",

              confidence:
                Number(
                  item.confidence
                ),

              metadata:
                item.metadata &&
                typeof item.metadata ===
                  "object"
                  ? item.metadata as Record<
                      string,
                      unknown
                    >
                  : {},
            })
          )
          .filter(
            (proposal) =>
              proposal.meaning.length >
                0 &&
              Number.isFinite(
                proposal.confidence
              )
          )
          .map(
            (proposal) => ({
              ...proposal,
              confidence:
                Math.max(
                  0,
                  Math.min(
                    1,
                    proposal.confidence
                  )
                ),
            })
          );
    }
  }

  // --------------------------------------------------
  // SAVE PROPOSED MEANINGS
  // --------------------------------------------------

  const meanings: Meaning[] = [];

  for (
    const proposal of proposals
  ) {

    const meaning =
      await captureMeaning({
        userId,

        expressionId,

        intentionId,

        meaning:
          proposal.meaning,

        confidence:
          proposal.confidence,

        status:
          "proposed",

        metadata: {
          ...proposal.metadata,

          source:
            "mirror_expression_interpretation",
        },
      });

    meanings.push(
      meaning
    );
  }

  return meanings;
}