/**
 * BUILD GUIDANCE CONTEXT
 *
 * Creates one compact, shared context for the two Guidance agents.
 * Mirror Store remains the source of truth. This builder only selects and
 * bounds existing data; it does not fetch, create or persist Living Field data.
 */

type AnyRecord = Record<string, any>;

type BuildGuidanceContextInput = {
  alignmentContext?: AnyRecord | null;
  selectedGuide?: string | null;
};

const LIMITS = {
  maxDepth: 5,
  maxArrayItems: 8,
  maxObjectKeys: 28,
  maxStringLength: 900,
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
]);

function compactValue(
  value: any,
  depth = 0,
  budget = { remaining: 5000 }
): any {
  if (
    value == null ||
    typeof value === "boolean" ||
    typeof value === "number"
  ) {
    return value;
  }

  if (typeof value === "string") {
    const available = Math.max(0, budget.remaining);
    if (!available) return undefined;

    const text = value.trim();
    if (!text) return undefined;

    const limit = Math.min(LIMITS.maxStringLength, available);
    const result = text.length > limit ? `${text.slice(0, limit)}…` : text;
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
        const compacted = compactValue(item, depth + 1, budget);

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

function compactSection(value: any, maxTextLength = 3000) {
  return compactValue(value, 0, { remaining: maxTextLength });
}

function compactLens(lensContext: any) {
  if (!lensContext || typeof lensContext !== "object") return null;

  // These are derived interpretations/evidence from buildLensContext.
  // Do not send the raw source entries or full signal history.
  const selected = {
        // Preserve real-world entity evidence for orchestration.
    entityLensEvidence: lensContext.entityLensEvidence,
    lens: lensContext.lens,
    relationalMirrors: lensContext.relationalMirrors,
    patternNarratives: lensContext.patternNarratives,
    dominantPatterns: lensContext.dominantPatterns,
    dominantPattern: lensContext.dominantPattern,
    mirrorThreads: lensContext.mirrorThreads,
    chakraThemes: lensContext.chakraThemes,
    energeticWeather: lensContext.energeticWeather,
    recognitionLevel: lensContext.recognitionLevel,
    narrativeIntensity: lensContext.narrativeIntensity,
    reflectionEvidence: lensContext.reflectionEvidence,
    evidenceSummaries: lensContext.evidenceSummaries,
    manifestationThreads: lensContext.manifestationThreads,
    bodyResponseThreads: lensContext.bodyResponseThreads,
    copingStrategyThreads: lensContext.copingStrategyThreads,
    observableSceneThreads: lensContext.observableSceneThreads,
    mirrorPrompts: lensContext.mirrorPrompts,
    contemplativeQuestions: lensContext.contemplativeQuestions,
    integratedExpressions: lensContext.integratedExpressions,
    nervousSystemState: lensContext.nervousSystemState,
    contraction: lensContext.contraction,
    expansion: lensContext.expansion,
    dominantChakra: lensContext.dominantChakra,
    awarenessChakra: lensContext.awarenessChakra,
    lensTension: lensContext.lensTension,
    dominantDistortions: lensContext.dominantDistortions,
    integratedField: lensContext.integratedField,
    spiralMovement: lensContext.spiralMovement,
    dominantPole: lensContext.dominantPole,
    integrationScore: lensContext.integrationScore,
    dominantLayer: lensContext.dominantLayer,
    recurringPatterns: lensContext.recurringPatterns,
    alignmentState: lensContext.alignmentState,
    symbolicThemes: lensContext.symbolicThemes,
    emotionalThemes: lensContext.emotionalThemes,
    spiralReflection: lensContext.spiralReflection,
  };

  return compactSection(selected, 2400);
}

function compactMirror(mirrorContext: any) {
  if (!mirrorContext || typeof mirrorContext !== "object") return null;

  return compactSection(
    {
      // Actual buildMirrorContext shape.
      baseline: mirrorContext.baseline,
      current: mirrorContext.current,
      evolution: mirrorContext.evolution,
      lens: mirrorContext.lens,
      voice: mirrorContext.voice,
      story: mirrorContext.story,
      levels: mirrorContext.levels,
      consciousness: mirrorContext.consciousness,
      manifestationLibrary: mirrorContext.manifestationLibrary,
      lensContexts: {
        people: compactLens(mirrorContext.lensContexts?.people),
        places: compactLens(mirrorContext.lensContexts?.places),
        things: compactLens(mirrorContext.lensContexts?.things),
      },
    },
    3600
  );
}

export function buildGuidanceContext({
  alignmentContext = {},
  selectedGuide = "cosmic",
}: BuildGuidanceContextInput = {}) {
  const source = alignmentContext || {};
  const userContext = source.userContext || {};

  // In the current architecture the full MirrorContext is returned as
  // userContext.context. Some callers may also expose it as mirrorContext.
  const mirrorContext =
    source.mirrorContext ||
    userContext.context ||
    {};

  const lensContexts = mirrorContext.lensContexts || {};

  const personal = {
    profile: userContext.profile || {},
    childhoodSignals: userContext.childhoodSignals || {},
    observableScenes: userContext.observableScenes || [],
    recurringManifestations: userContext.recurringManifestations || [],
    recurringCopingStrategies: userContext.recurringCopingStrategies || [],
    recurringBodyResponses: userContext.recurringBodyResponses || [],
    recurringMirrorPrompts: userContext.recurringMirrorPrompts || [],
    creationPatterns: userContext.creationPatterns || [],
    // Include selected enriched pattern/behaviour knowledge, not raw signal rows.
    enrichedPatterns: userContext.enrichedPatterns || [],
    enrichedBehaviours: userContext.enrichedBehaviours || [],
    patternField: userContext.patternField || {},
    distortions: userContext.distortions || {},
  };

  const embodied = {
    chakraManifestations: userContext.chakraManifestations || {},
    realityLayers: userContext.realityLayers || {},
    spiral: userContext.spiral || userContext.realityLayers?.spiral || {},
    energy: userContext.energy || {},
    dominantChakra: userContext.dominantChakra || null,
    awarenessChakra: userContext.awarenessChakra || null,
  };

  return {
    selectedGuide,
    language: source.language || userContext.language || "en",
    languageContext: compactSection(
      source.languageContext || mirrorContext.language || {},
      500
    ),

    // Lived experience first: profile, recurring real-world evidence,
    // observable scenes, coping and manifestation patterns.
    personal: compactSection(personal, 4200),

    // The MirrorContext actually produced by buildMirrorContext.
    mirror: compactMirror(mirrorContext),

    // Keep each lens distinct so the agent can recognise the real-world domain.
    lenses: {
      people: compactLens(lensContexts.people),
      places: compactLens(lensContexts.places),
      things: compactLens(lensContexts.things),
    },

    // Embodied/energetic context is available, but separate from personal evidence.
    embodied: compactSection(embodied, 2200),

    // AlignmentOS data remains distinct from the person's lived evidence.
    alignment: compactSection(
      {
        dailyField: source.dailyField || {},
        entityLenses: userContext.entityLenses || source.entityLenses || [],
        expressionProfile:
          userContext.expressionProfile || source.expressionProfile || {},
        spiralScores:
          userContext.spiralScores || source.spiralScores || {},
        activeLens: source.activeLens || userContext.activeLens || null,
        contextVersion: source.contextVersion ?? null,
        lastSignalTimestamp: source.lastSignalTimestamp ?? null,
      },
      1200
    ),

    // Cosmic context remains distinct from personal and AlignmentOS context.
    cosmic: compactSection(source.cosmic || {}, 900),
  };
}

export default buildGuidanceContext;
