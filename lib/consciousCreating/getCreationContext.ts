// --------------------------------------------------
// 🌱 CONSCIOUS CREATING — CREATION CONTEXT
// --------------------------------------------------
//
// This is the context assembler for the
// AI-Native Conscious Creating Service.
//
// It does NOT:
// - generate AI responses
// - interpret meaning
// - recreate Living Field intelligence
// - run Guidance orchestration
//
// It assembles the existing reality of:
// - the person
// - what matters
// - the creation
// - the Creation Journey
// - expressions and meanings
// - artifacts
// - the Living Field
// - relevant chakra knowledge
//
// The AI service will consume this context later.
// --------------------------------------------------

import { supabase } from "../../services/supabase";

import {
  buildUserContext,
} from "../context/buildUserContext";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export type CreationJourneyStage =
  | "dream"
  | "discover"
  | "build"
  | "grow"
  | "scale"
  | "renew";

export type CreationStep = {
  step: CreationJourneyStage;
  response: Record<string, unknown>;
  voice: unknown[];
  images: unknown[];
  attachments: unknown[];
  links: unknown[];
  ai_response: Record<string, unknown>;
  created_at?: string;
};

export type CreationArtifact = {
  id: string;
  intention_id: string;
  area: "I" | "People" | "Planet";
  artifact_type: string;
  title: string;
  content: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type CreationExpression = {
  id: string;
  user_id: string;
  intention_id: string | null;
  source_type:
    | "text"
    | "voice"
    | "image"
    | "link"
    | "attachment"
    | "conversation";
  content: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type CreationMeaning = {
  id: string;
  user_id: string;
  expression_id: string | null;
  intention_id: string | null;
  meaning: string;
  confidence: number | null;
  status:
    | "proposed"
    | "confirmed"
    | "challenged"
    | "rejected";
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type CreationContext = {
  person: {
    userId: string;
    profile: Record<string, unknown> | null;
    language: string;
    expressionProfile: unknown;
  };

  whatMatters: {
    entries: Array<{
      id: string;
      text: string;
    }>;
  };

  creation: {
    id: string;
    rawInput: string;
    status: string;
    spiralStage: CreationJourneyStage | null;
    outcome: unknown;
    createdAt: string;
    updatedAt: string;
  };

  journey: {
    activeStage?: CreationJourneyStage;
    stages: Record<
      CreationJourneyStage,
      CreationStep | null
    >;
  };

  livingField: {
    ready: boolean;
    userContext: unknown;
    mirrorContext: unknown;
    energy: unknown;
    realityLayers: unknown;
    signals: unknown[];
    chakraState: {
      dominantChakra: string | null;
      awarenessChakra: string | null;
      scores: Record<string, number>;
    };
    spiralScores: unknown;
    creationPatterns: unknown[];
    cosmic: unknown;
    language: unknown;
  };

  chakraKnowledge: unknown[];

  expressions: CreationExpression[];

  meanings: CreationMeaning[];

  artifacts: CreationArtifact[];
};

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const emptyStep = (): CreationStep | null => null;

const normaliseResponse = (
  response: unknown
): Record<string, unknown> => {
  if (
    response &&
    typeof response === "object" &&
    !Array.isArray(response)
  ) {
    return response as Record<string, unknown>;
  }

  if (
    response !== null &&
    response !== undefined
  ) {
    return {
      value: response,
    };
  }

  return {};
};

const normaliseArray = (
  value: unknown
): unknown[] => {
  return Array.isArray(value) ? value : [];
};

// --------------------------------------------------
// MAIN
// --------------------------------------------------

export async function getCreationContext({
  userId,
  intentionId,
  activeStage,
}: {
  userId: string;
  intentionId: string;
  activeStage?: CreationJourneyStage;
}): Promise<CreationContext> {

  if (!userId) {
    throw new Error(
      "getCreationContext: userId is required."
    );
  }

  if (!intentionId) {
    throw new Error(
      "getCreationContext: intentionId is required."
    );
  }

  // --------------------------------------------------
  // 1. PERSON / LIVING FIELD
  // --------------------------------------------------
  //
  // Use the existing intelligence engine.
  // Do NOT recreate signals, patterns, behaviours,
  // energy or chakra calculations here.
  // --------------------------------------------------

  const userContext =
    await buildUserContext({
      userId,
      source: "conscious_creating",
      activeLens: "general",
    });

  // --------------------------------------------------
  // 2. CREATION
  // --------------------------------------------------

  const {
    data: intention,
    error: intentionError,
  } = await supabase
    .from("sovereign_intentions")
    .select(
      "id, raw_input, outcome, status, spiral_stage, created_at, updated_at"
    )
    .eq("id", intentionId)
    .eq("user_id", userId)
    .single();

  if (intentionError) {
    console.error(
      "❌ CREATION CONTEXT — INTENTION LOAD ERROR:",
      intentionError
    );

    throw intentionError;
  }

  // --------------------------------------------------
  // 3. JOURNEY
  // --------------------------------------------------
  //
  // Pull the complete Creation Journey, not only
  // the currently visible stage.
  //
  // This is important because DISCOVER may need
  // DREAM, BUILD may need DREAM + DISCOVER, etc.
  // --------------------------------------------------

  const {
    data: stepRows,
    error: stepsError,
  } = await supabase
    .from("sovereign_intention_steps")
    .select(
      "step, response, voice, images, attachments, links, ai_response, created_at"
    )
    .eq("intention_id", intentionId);

  if (stepsError) {
    console.error(
      "❌ CREATION CONTEXT — JOURNEY LOAD ERROR:",
      stepsError
    );

    throw stepsError;
  }

  const stages: Record<
    CreationJourneyStage,
    CreationStep | null
  > = {
    dream: null,
    discover: null,
    build: null,
    grow: null,
    scale: null,
    renew: null,
  };

  for (const row of stepRows || []) {

    const step =
      row.step as CreationJourneyStage;

    if (
      ![
        "dream",
        "discover",
        "build",
        "grow",
        "scale",
        "renew",
      ].includes(step)
    ) {
      continue;
    }

    stages[step] = {
      step,
      response: normaliseResponse(
        row.response
      ),
      voice: normaliseArray(
        row.voice
      ),
      images: normaliseArray(
        row.images
      ),
      attachments: normaliseArray(
        row.attachments
      ),
      links: normaliseArray(
        row.links
      ),
      ai_response:
        row.ai_response &&
        typeof row.ai_response === "object" &&
        !Array.isArray(row.ai_response)
          ? row.ai_response
          : {},
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  // --------------------------------------------------
  // 4. WHAT MATTERS
  // --------------------------------------------------

  const {
    data: lifePictures,
    error: lifePictureError,
  } = await supabase
    .from("sovereign_life_pictures")
    .select("id, picture")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: true,
    });

  if (lifePictureError) {
    console.error(
      "❌ CREATION CONTEXT — LIFE PICTURE LOAD ERROR:",
      lifePictureError
    );

    throw lifePictureError;
  }

  const whatMattersEntries =
    (lifePictures || []).map(
      (row) => ({
        id: row.id,
        text:
          typeof row.picture?.text ===
          "string"
            ? row.picture.text
            : "",
      })
    );

  // --------------------------------------------------
  // 5. EXPRESSIONS
  // --------------------------------------------------
  //
  // Raw human expression is preserved.
  // This is evidence of the person's actual voice.
  // --------------------------------------------------

  const {
    data: expressions,
    error: expressionsError,
  } = await supabase
    .from("expressions")
    .select(
      "id, user_id, intention_id, source_type, content, metadata, created_at, updated_at"
    )
    .eq("user_id", userId)
    .eq("intention_id", intentionId)
    .order("created_at", {
      ascending: true,
    });

  if (expressionsError) {
    console.error(
      "❌ CREATION CONTEXT — EXPRESSIONS LOAD ERROR:",
      expressionsError
    );

    throw expressionsError;
  }

  // --------------------------------------------------
  // 6. MEANINGS
  // --------------------------------------------------

  const {
    data: meanings,
    error: meaningsError,
  } = await supabase
    .from("meanings")
    .select(
      "id, user_id, expression_id, intention_id, meaning, confidence, status, metadata, created_at, updated_at"
    )
    .eq("user_id", userId)
    .eq("intention_id", intentionId)
    .order("created_at", {
      ascending: true,
    });

  if (meaningsError) {
    console.error(
      "❌ CREATION CONTEXT — MEANINGS LOAD ERROR:",
      meaningsError
    );

    throw meaningsError;
  }

  // --------------------------------------------------
  // 7. ARTIFACTS
  // --------------------------------------------------

  const {
    data: artifacts,
    error: artifactsError,
  } = await supabase
    .from("sovereign_intention_artifacts")
    .select(
      "id, intention_id, area, artifact_type, title, content, created_at, updated_at"
    )
    .eq("intention_id", intentionId)
    .order("created_at", {
      ascending: true,
    });

  if (artifactsError) {
    console.error(
      "❌ CREATION CONTEXT — ARTIFACT LOAD ERROR:",
      artifactsError
    );

    throw artifactsError;
  }

  // --------------------------------------------------
  // 8. RELEVANT CHAKRA KNOWLEDGE
  // --------------------------------------------------
  //
  // buildUserContext already calculates the person's
  // CURRENT chakra state.
  //
  // Here we retrieve the static ontology only for
  // chakras that are actually relevant to that state.
  // --------------------------------------------------

  const dominantChakra =
    userContext?.dominantChakra ||
    userContext?.context?.current?.dominantChakra ||
    userContext?.context?.energy?.dominantChakra ||
    null;

  const awarenessChakra =
    userContext?.awarenessChakra ||
    userContext?.context?.current?.awarenessChakra ||
    userContext?.context?.energy?.awarenessChakra ||
    null;

  const relevantChakras = [
    dominantChakra,
    awarenessChakra,
  ].filter(Boolean);

  let chakraKnowledge: unknown[] = [];

  if (relevantChakras.length > 0) {
    const {
      data: chakraRows,
      error: chakraError,
    } = await supabase
      .from("chakras")
      .select("*")
      .in("id", relevantChakras)
      .eq(
        "language",
        userContext?.language || "en"
      );

    if (chakraError) {
      console.error(
        "❌ CREATION CONTEXT — CHAKRA KNOWLEDGE LOAD ERROR:",
        chakraError
      );

      throw chakraError;
    }

    chakraKnowledge =
      chakraRows || [];
  }

  // --------------------------------------------------
  // 9. CHAKRA STATE
  // --------------------------------------------------

  const chakraScores =
    userContext?.chakraScores ||
    userContext?.context?.energy?.chakras ||
    {};

  const curatedCreationPatterns =
  Array.isArray(userContext?.creationPatterns)
    ? [...userContext.creationPatterns]
        .sort((a: any, b: any) => {
          const aImbalance = Math.abs(
            Number(a?.expansion || 0) -
            Number(a?.contraction || 0)
          );

          const bImbalance = Math.abs(
            Number(b?.expansion || 0) -
            Number(b?.contraction || 0)
          );

          return (
            bImbalance -
            aImbalance ||
            Number(b?.signalCount || 0) -
            Number(a?.signalCount || 0)
          );
        })
        .slice(0, 5)
    : []; 

  // --------------------------------------------------
  // 10. RETURN CREATION CONTEXT
  // --------------------------------------------------

  return {
    person: {
      userId,
      profile:
        userContext?.profile || null,
      language:
        userContext?.language || "en",
      expressionProfile:
        userContext?.expressionProfile || null,
    },

    whatMatters: {
      entries:
        whatMattersEntries,
    },

    creation: {
      id: intention.id,
      rawInput:
        intention.raw_input || "",
      status:
        intention.status || "",
      spiralStage:
        intention.spiral_stage ||
        null,
      outcome:
        intention.outcome ?? null,
      createdAt:
        intention.created_at,
      updatedAt:
        intention.updated_at,
    },

    journey: {
      activeStage,
      stages,
    },

    livingField: {
      ready:
        userContext?.ready === true,

      userContext,

      mirrorContext:
        userContext?.context || null,

      energy:
        userContext?.energy || null,

      realityLayers:
        userContext?.realityLayers ||
        userContext?.context?.levels ||
        {},

      signals:
        userContext?.signals || [],

      chakraState: {
        dominantChakra,
        awarenessChakra,
        scores:
          chakraScores || {},
      },

    spiralScores:
      userContext?.spiralScores ||
      null,

creationPatterns: curatedCreationPatterns,

    cosmic:
      userContext?.context?.cosmic ||
      null,

      language:
        userContext?.context?.language ||
        {},
    },

    chakraKnowledge,

    expressions:
      (expressions ||
        []) as CreationExpression[],

    meanings:
      (meanings ||
        []) as CreationMeaning[],

    artifacts:
      (artifacts ||
        []) as CreationArtifact[],
  };
}