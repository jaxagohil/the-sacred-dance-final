
/**
 * BUILD GLIMMER CONTEXT
 *
 * Creates one compact, shared context for the three Responsibility
 * Glimmer agents: CAN CHANGE, CAN'T CHANGE and WON'T CHANGE.
 *
 * User Context and Creation Context remain the sources of truth.
 * This builder only selects and bounds existing data.
 * It does not fetch, create or persist context.
 */

type AnyRecord = Record<string, any>;

type BuildGlimmerContextInput = {
  userContext?: AnyRecord | null;
  creationContext?: AnyRecord | null;
  contextVersion?: number;
  language?: string;
};

const LIMITS = {
  maxDepth: 5,
  maxArrayItems: 8,
  maxObjectKeys: 24,
  maxStringLength: 700,
};

const EXCLUDED_KEYS = new Set([
  "signals",
  "rawSignals",
  "allSignals",
  "signalHistory",
  "history",
  "transmissions",
  "messages",
  "lensEntries",
  "strongestEntries",
  "manifestationLibrary",
]);

function compactValue(
  value: any,
  depth = 0,
  budget = { remaining: 2500 }
): any {
  if (
    value == null ||
    typeof value === "boolean" ||
    typeof value === "number"
  ) {
    return value;
  }

  if (typeof value === "string") {
    const text = value.trim();

    if (!text || budget.remaining <= 0) return undefined;

    const limit = Math.min(
      LIMITS.maxStringLength,
      budget.remaining
    );

    const result =
      text.length > limit
        ? `${text.slice(0, limit)}…`
        : text;

    budget.remaining -= result.length;

    return result;
  }

  if (depth >= LIMITS.maxDepth) return undefined;

  if (Array.isArray(value)) {
    return value
      .slice(0, LIMITS.maxArrayItems)
      .map((item) => compactValue(item, depth + 1, budget))
      .filter(
        (item) =>
          item !== undefined &&
          item !== null &&
          item !== ""
      );
  }

  if (typeof value === "object") {
    const result: AnyRecord = {};

    Object.entries(value)
      .filter(([key]) => !EXCLUDED_KEYS.has(key))
      .slice(0, LIMITS.maxObjectKeys)
      .forEach(([key, item]) => {
        const compacted = compactValue(
          item,
          depth + 1,
          budget
        );

        if (
          compacted !== undefined &&
          compacted !== null &&
          compacted !== "" &&
          (!Array.isArray(compacted) || compacted.length > 0)
        ) {
          result[key] = compacted;
        }
      });

    return result;
  }

  return undefined;
}

function compactSection(value: any, maxTextLength = 2000) {
  return compactValue(value, 0, {
    remaining: maxTextLength,
  });
}

/**
 * Select evidence from activated patterns only.
 *
 * patternField is keyed by patterns activated through the
 * person's processed signals. It is not the full pattern library.
 */

function compactPatternField(patternField: AnyRecord | null | undefined) {
  if (!patternField || typeof patternField !== "object") {
    return {};
  }

  const selected: AnyRecord = {};

  Object.entries(patternField)
    .slice(0, 12)
    .forEach(([patternId, entry]: [string, any]) => {
      if (!entry || typeof entry !== "object") return;

      selected[patternId] = {
        id: entry.id || patternId,

        // Canonical Sacred Dance pattern definition.
        pattern: entry.pattern || null,

        // Evidence from the person's processed signals.
        signalCount: entry.signalCount || 0,
        activation: entry.activation || 0,

        feminine: entry.feminine || 0,
        masculine: entry.masculine || 0,
        contraction: entry.contraction || 0,
        expansion: entry.expansion || 0,

        emotions: entry.emotions || [],
        behaviours: entry.behaviours || [],
        lenses: entry.lenses || [],
        manifestations: entry.manifestations || [],

        dominantChakra: entry.dominantChakra || null,
      };
    });

  return compactSection(selected, 5000);
}

function compactChakraManifestations(
  manifestations: AnyRecord | null | undefined
) {
  if (!manifestations || typeof manifestations !== "object") {
    return {};
  }

  const selected: AnyRecord = {};

  Object.entries(manifestations).forEach(([chakra, rows]) => {
    if (!Array.isArray(rows)) return;

    selected[chakra] = rows.slice(0, 8).map((row: any) => ({
      pattern_key: row.pattern_key,
      chakra_key: row.chakra_key,
      chakra_weight: row.chakra_weight ?? row.weight ?? 0,

      manifestation: row.manifestation,
      observable_scene: row.observable_scene,

      wound_expression: row.wound_expression,
      integrated_expression: row.integrated_expression,

      body_response: row.body_response,
      nervous_system_expression: row.nervous_system_expression,

      relational_expression: row.relational_expression,
      feminine_manifestation: row.feminine_manifestation,
      masculine_manifestation: row.masculine_manifestation,

      integration: row.integration,
      integration_path: row.integration_path,
      embodiment: row.embodiment,

      reflective_prompt: row.reflective_prompt,
      mirror_observation: row.mirror_observation,
      mirror_realisation: row.mirror_realisation,
      embodiment_invitation: row.embodiment_invitation,
      micro_embodiment: row.micro_embodiment,
      grounding_action: row.grounding_action,

      spiral_phase: row.spiral_phase,
      spiral_direction: row.spiral_direction,
      spiral_pressure: row.spiral_pressure,
      grounding_depth: row.grounding_depth,
    }));
  });

  return compactSection(selected, 6500);
}

export function buildGlimmerContext({
  userContext = {},
  creationContext = {},
  contextVersion = 0,
  language = "en",
}: BuildGlimmerContextInput = {}) {
  const user = userContext || {};
  const creation = creationContext || {};

  const personal = {
    profile: user.profile || {},
    childhoodSignals: user.childhoodSignals || {},
    observableScenes: user.observableScenes || [],
    recurringManifestations: user.recurringManifestations || [],
    recurringCopingStrategies:
      user.recurringCopingStrategies || [],
    recurringBodyResponses:
      user.recurringBodyResponses || [],
    creationPatterns: user.creationPatterns || [],
  };

const patterns = {
  enrichedPatterns: compactSection(user.enrichedPatterns || [], 5000),
  enrichedBehaviours: compactSection(user.enrichedBehaviours || [], 2500),
  patternField: compactPatternField(user.patternField),
  distortions: compactSection(user.distortions || {}, 1500),
};

  // Canonical Sacred Feminine and Sacred Masculine definitions.
  const polarities = compactSection(
    user.polarities || [],
    3500
  );

  const embodied = {
    chakraManifestations: compactChakraManifestations(
  user.chakraManifestations),
    realityLayers: user.realityLayers || {},
    energy: user.energy || {},
    dominantChakra: user.dominantChakra || null,
    awarenessChakra: user.awarenessChakra || null,
  };

  const creations = {
    intentions: creation.intentions || [],
    steps: creation.steps || [],
    lifePictures: creation.lifePictures || [],
  };

  return {
    language,
    contextVersion,

    // The person's lived experience and recurring evidence.
    personal: compactSection(personal, 2500),

    // Activated patterns and their associated evidence.
    patterns: compactSection(patterns, 3500),

        // Canonical Sacred Feminine and Sacred Masculine knowledge.
    polarities,

    // Energetic and embodied evidence.
    embodied: compactSection(embodied, 3000),

    // The person's creations, considered together.
    creation: compactSection(creations, 2000),
  };
}

export default buildGlimmerContext;
