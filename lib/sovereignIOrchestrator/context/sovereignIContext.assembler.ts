
/**
 * Sovereign I — Context Assembler
 *
 * PURPOSE
 *
 * Gathers existing context from Sacred Dance
 * into one package for a Sovereign I decision.
 *
 * This file does not:
 * - Build or calculate User Context.
 * - Rebuild the Living Field.
 * - Interpret user information.
 * - Make orchestration decisions.
 */

import { supabase } from "../../../services/supabase";
import { useMirrorStore } from "../../../stores/mirrorStore";
import { getUserId } from "../../user";

import { getAvailableCapabilities } from "../capabilities/sovereignICapability.resolver";

import type {
  SovereignIContextPackage
} from "../core/sovereignIContext.types";

import type {
  SovereignIContextDomain,
  SovereignIEvent,
} from "../events/sovereignIEvent.types";

export interface SovereignIContextAssemblyInput {
  event?: SovereignIEvent;

  liveUIContext?: unknown;

  creationId?: string;

  purpose?: "decision" | "capability";
}

function createMetadata(
  source: string,
  updatedAt: string,
  persistence: "persistent" | "transient" | "system-generated",
  evidenceType: "observed" | "user-expressed" | "calculated" | "interpreted"
) {
  return {
    source,
    updatedAt,
    persistence,
    evidenceType,
  };
}

function shouldInclude(
  domain: SovereignIContextDomain,
  event?: SovereignIEvent
) {
  if (!event) return true;

  return event.contextImpact.includes(domain);
}

/**
 * Assemble the context relevant to an event.
 */
export async function assembleSovereignIContext(
  input: SovereignIContextAssemblyInput = {}
): Promise<SovereignIContextPackage> {

  const assembledAt = new Date().toISOString();

  const state = useMirrorStore.getState();

  const context: SovereignIContextPackage = {
    assembledAt,
    eventId: input.event?.eventId,
  };

// 1. USER CONTEXT
if (shouldInclude("user", input.event)) {
  const fullUserContext = state.userContext ?? {};

  const userData =
    input.purpose === "decision"
      ? {
          contextVersion: state.contextVersion,
          available: Object.keys(fullUserContext).length > 0,
          sections: Object.keys(fullUserContext),
          patterns: Array.isArray(fullUserContext.patterns)
            ? fullUserContext.patterns.slice(0, 12)
            : [],
          energy: fullUserContext.energy
            ? {
                chakras: fullUserContext.energy.chakras,
              }
            : undefined,
        }
      : fullUserContext;

  context.userContext = {
    domain: "user",
    data: userData,
    metadata: createMetadata(
      "mirrorStore.userContext",
      state.lastSignalTimestamp
        ? new Date(state.lastSignalTimestamp).toISOString()
        : assembledAt,
      "persistent",
      "calculated"
    ),
  };
}

  // 2. LIVING FIELD
  if (shouldInclude("livingField", input.event)) {
    context.livingField = {
      domain: "livingField",
      data: {

established: {
  realityLayers: state.userContext?.realityLayers,

  energyField: {
    dailyField: state.dailyField,
    mirrorContext: state.mirrorContext,
    energy: state.userContext?.energy,
  },

  chakras: state.userContext?.energy?.chakras,

  patterns: state.userContext?.patterns,

  manifestations: state.userContext?.recurringManifestations,
},

        emerging: {},
      },
      metadata: createMetadata(
        "mirrorStore and existing Living Field context",
        state.lastSignalTimestamp
          ? new Date(state.lastSignalTimestamp).toISOString()
          : assembledAt,
        "persistent",
        "calculated"
      ),
    };
  }

  // 3. LIVE UI CONTEXT
  if (shouldInclude("liveUI", input.event) && input.liveUIContext !== undefined) {
    context.liveUIContext = {
      domain: "liveUI",
      data: input.liveUIContext,
      metadata: createMetadata(
        "Living Space UI",
        assembledAt,
        "transient",
        "observed"
      ),
    };
  }

  // 4. CREATION CONTEXT
  if (shouldInclude("creation", input.event)) {
    const userId = await getUserId();

    if (userId) {
      let intentionsQuery = supabase
        .from("sovereign_intentions")
        .select(
          "id, raw_input, outcome, status, spiral_stage, created_at, updated_at"
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (input.creationId) {
        intentionsQuery = intentionsQuery.eq("id", input.creationId);
      }

      const { data: intentions, error: intentionsError } =
        await intentionsQuery;

      if (intentionsError) throw intentionsError;

      const intentionIds = (intentions || []).map(
        (intention) => intention.id
      );

      let steps: any[] = [];

      if (intentionIds.length > 0) {
        const { data, error } = await supabase
          .from("sovereign_intention_steps")
          .select("intention_id, step, response")
          .in("intention_id", intentionIds);

        if (error) throw error;

        steps = data || [];
      }

      const { data: lifePictures, error: lifePicturesError } =
  await supabase
    .from("sovereign_life_pictures")
    .select("id, picture, item_type, title, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

if (lifePicturesError) throw lifePicturesError;

context.creationContext = {
  domain: "creation",
  data:
    input.purpose === "decision"
      ? {
          intentionCount: (intentions || []).length,
          intentions: (intentions || []).slice(0, 8).map((intention) => ({
            id: intention.id,
            rawInput:
              typeof intention.raw_input === "string"
                ? intention.raw_input.slice(0, 300)
                : "",
            outcome:
              typeof intention.outcome === "string"
                ? intention.outcome.slice(0, 300)
                : "",
            status: intention.status,
            spiralStage: intention.spiral_stage,
          })),
          stepCount: steps.length,
          lifePictureCount: (lifePictures || []).length,
          lifePictures: (lifePictures || []).slice(0, 8).map((picture) => ({
            itemType: picture.item_type,
            title: picture.title,
            text:
              typeof picture.picture?.text === "string"
                ? picture.picture.text.slice(0, 200)
                : "",
          })),
        }
      : {
          intentions: intentions || [],
          steps,
          lifePictures: (lifePictures || []).map((picture) => ({
            id: picture.id,
            text:
              typeof picture.picture?.text === "string"
                ? picture.picture.text
                : "",
            itemType: picture.item_type,
            title: picture.title,
            createdAt: picture.created_at,
          })),
        },
  metadata: createMetadata(
    "sovereign_intentions, sovereign_intention_steps and sovereign_life_pictures",
    assembledAt,
    "persistent",
    "user-expressed"
  ),
};
    }
  }

  // 5. COSMIC CONTEXT
  if (shouldInclude("cosmic", input.event)) {
    context.cosmicContext = {
      domain: "cosmic",
      data: {
        cosmic: state.cosmic,
        dailyField: state.dailyField,
      },
      metadata: createMetadata(
        "mirrorStore",
        assembledAt,
        "system-generated",
        "calculated"
      ),
    };
  }

  // 6. CAPABILITY CONTEXT
  if (shouldInclude("capability", input.event)) {
    context.capabilityContext = {
      domain: "capability",
      data: getAvailableCapabilities(),
      metadata: createMetadata(
        "Sovereign I Capability Registry",
        assembledAt,
        "system-generated",
        "observed"
      ),
    };
  }

  return context;
}
