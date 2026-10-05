import { supabase } from "../../../../services/supabase";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export type BuildConversationRole = "user" | "mirror";

export interface BuildConversationMessage {
  role: BuildConversationRole;
  content: string;
}

export interface PersistBuildConversationInput {
  intentionId: string;

  conversation: BuildConversationMessage[];

  options?: string[];

  selectedNextStep?: string | null;

  readiness?: {
    state:
      | "exploring"
      | "clarifying"
      | "integrating"
      | "ready"
      | "pause";

    understanding: string;

    unresolved: string[];

    confidence: number;
  };

nextMoves?: Array<{
  title: string;
  description: string;
  type:
    | "explore"
    | "create"
    | "connect"
    | "experiment"
    | "decide";
  rationale: string;
  areas: Array<
    "I"
    | "People"
    | "Planet"
  >;
}>;
}

// --------------------------------------------------
// LOAD
// --------------------------------------------------

export async function loadBuildConversation(
  intentionId: string
): Promise<{
  conversation: BuildConversationMessage[];
  options: string[];
  selectedNextStep: string | null;
}> {
  if (!intentionId) {
    throw new Error(
      "loadBuildConversation: intentionId is required."
    );
  }

  const { data, error } = await supabase
    .from("sovereign_intention_steps")
    .select("response")
    .eq("intention_id", intentionId)
    .eq("step", "build")
    .maybeSingle();

  if (error) {
    console.error(
      "❌ LOAD BUILD CONVERSATION ERROR:",
      error
    );
    throw error;
  }

  if (!data?.response) {
    return {
      conversation: [],
      options: [],
      selectedNextStep: null,
    };
  }

  const parsed =
    typeof data.response === "string"
      ? JSON.parse(data.response)
      : data.response;

  return {
    conversation: Array.isArray(parsed?.conversation)
      ? parsed.conversation
      : [],

    options: Array.isArray(parsed?.options)
      ? parsed.options
      : [],

    selectedNextStep:
      typeof parsed?.selected_next_step === "string"
        ? parsed.selected_next_step
        : null,
  };
}

// --------------------------------------------------
// SAVE
// --------------------------------------------------

export async function persistBuildConversation(
  input: PersistBuildConversationInput
): Promise<void> {
const {
  intentionId,
  conversation,
  options = [],
  selectedNextStep = null,
  readiness,
  nextMoves = [],
} = input;

  if (!intentionId) {
    throw new Error(
      "persistBuildConversation: intentionId is required."
    );
  }

const response = {
  conversation,
  options,
  selected_next_step: selectedNextStep,
};

const aiResponse = {
  ...(readiness ? { readiness } : {}),
  nextMoves,
};

  const { data: existing, error: findError } =
    await supabase
      .from("sovereign_intention_steps")
      .select("id")
      .eq("intention_id", intentionId)
      .eq("step", "build")
      .maybeSingle();

  if (findError) {
    console.error(
      "❌ FIND BUILD CONVERSATION ERROR:",
      findError
    );
    throw findError;
  }

  if (existing) {
    const { error } = await supabase
      .from("sovereign_intention_steps")
.update({
  response,
  ai_response: aiResponse,
})
      .eq("id", existing.id);

    if (error) {
      console.error(
        "❌ UPDATE BUILD CONVERSATION ERROR:",
        error
      );
      throw error;
    }

    return;
  }

  const { error } = await supabase
    .from("sovereign_intention_steps")
.insert({
  intention_id: intentionId,
  step: "build",
  response,
  ai_response: aiResponse,
});

  if (error) {
    console.error(
      "❌ SAVE BUILD CONVERSATION ERROR:",
      error
    );
    throw error;
  }
}