import { supabase } from "../../services/supabase";
import { getBehaviourLookup } from "./getBehaviourLookup";
import { buildEnergyFromBehaviours } from "./buildEnergyFromBehaviours";

export async function getEnergyFromSignals(signals: any[]) {
  if (!signals || signals.length === 0) return null;

  const behaviourMap: Record<string, number> = {};
  const behaviourCounts: Record<string, number> = {};

  const baselineBehaviourMap: Record<string, number> = {};

  const baselinePatternMap: Record<string, number> = {};
  const activePatternMap: Record<string, number> = {};

  const recentPatternMap: Record<string, number> = {};
  const olderPatternMap: Record<string, number> = {};

  const now = Date.now();
  const DAY = 1000 * 60 * 60 * 24;
  const RECENT_DAYS = 5;

  // ---------------------------
  // 🔥 LOAD PATTERN MAPPINGS
  // ---------------------------
  const { data: patternMappings, error } = await supabase
    .from("behaviour_pattern_map")
    .select("behaviour_id, pattern_id, weight");

  if (error || !patternMappings) {
    console.error("❌ Pattern mapping error:", error);
    return null;
  }

  // ---------------------------
  // 🔥 LOAD PATTERN META (NEW)
  // ---------------------------
  const { data: patternsData } = await supabase
    .from("patterns")
    .select("id, description, chakra");

  const patternLookup: Record<string, any> = {};
  patternsData?.forEach((p) => {
    patternLookup[p.id] = p;
  });

  // ---------------------------
  // PASS 1: BASELINE
  // ---------------------------
  signals.forEach((signal) => {
    if (signal.sourcetype !== "baseline") return;

    const behaviours = signal.ai_behaviours || [];

    behaviours.forEach((b: any) => {
      if (!b?.id) return;

      baselineBehaviourMap[b.id] =
        (baselineBehaviourMap[b.id] || 0) + (b.weight || 1);

      const matches = patternMappings.filter(
        (m) => m.behaviour_id === b.id
      );

      matches.forEach((m) => {
        const contribution = (b.weight || 1) * (m.weight || 1);

        baselinePatternMap[m.pattern_id] =
          (baselinePatternMap[m.pattern_id] || 0) + contribution;
      });
    });
  });

  // ---------------------------
  // PASS 2: MAIN
  // ---------------------------
  signals.forEach((signal) => {
    const behaviours = signal.ai_behaviours || [];

    const sourceType = signal.sourcetype || "unknown";
    const depth = signal.signal_depth ?? 1;
    const intensity = signal.ai_intensity ?? 0.7;

    let createdAt = now;
    if (signal.created_at) {
      const parsed = new Date(signal.created_at).getTime();
      if (!isNaN(parsed)) createdAt = parsed;
    }

    const ageDays = Math.max(0, (now - createdAt) / DAY);

    const targetPatternMap =
      ageDays <= RECENT_DAYS ? recentPatternMap : olderPatternMap;

    behaviours.forEach((b: any) => {
      if (!b?.id) return;

      const baseWeight = Math.max(b.weight ?? 1, 0.01);

      const recencyFactor = Math.max(Math.exp(-ageDays / 7), 0.1);

      behaviourCounts[b.id] =
        (behaviourCounts[b.id] || 0) + 1;

      const consistencyFactor =
        1 + Math.min(behaviourCounts[b.id] * 0.15, 1);

      const sourceWeightMap: Record<string, number> = {
        baseline: 1.8,
        journal: 1.2,
        guidance: 1.0,
        landing: 0.6,
        unknown: 1.0,
      };

      const sourceFactor = sourceWeightMap[sourceType] || 1;

      const depthFactor = depth;
      const intensityFactor = 0.8 + intensity;

      const baselineStrength = baselineBehaviourMap[b.id] || 0;

      const reinforcementFactor =
        baselineStrength > 0
          ? 1.2 + Math.min(baselineStrength * 0.1, 0.6)
          : 1;

      const finalWeight =
        baseWeight *
        recencyFactor *
        consistencyFactor *
        sourceFactor *
        depthFactor *
        intensityFactor *
        reinforcementFactor;

      behaviourMap[b.id] =
        (behaviourMap[b.id] || 0) + finalWeight;

      const matches = patternMappings.filter(
        (m) => m.behaviour_id === b.id
      );

      matches.forEach((m) => {
        const contribution = finalWeight * (m.weight || 1);

        activePatternMap[m.pattern_id] =
          (activePatternMap[m.pattern_id] || 0) + contribution;

        targetPatternMap[m.pattern_id] =
          (targetPatternMap[m.pattern_id] || 0) + contribution;
      });
    });
  });

  const total = Object.values(behaviourMap).reduce(
    (sum, v) => sum + v,
    0
  );

  if (!total) return null;

  const behaviours = Object.entries(behaviourMap).map(
    ([id, weight]) => ({
      id,
      weight: weight / total,
    })
  );

  const lookup = await getBehaviourLookup();

  if (!lookup || Object.keys(lookup).length === 0) {
    console.error("❌ Empty behaviour lookup");
    return null;
  }

  const energy = buildEnergyFromBehaviours(behaviours, lookup);

  // ---------------------------
  // 🌿 PATTERN STATES (ENRICHED)
  // ---------------------------
  const patternStates = Object.keys({
    ...baselinePatternMap,
    ...activePatternMap,
  }).map((patternId) => {
    const baseline = baselinePatternMap[patternId] || 0;
    const active = activePatternMap[patternId] || 0;

    const recent = recentPatternMap[patternId] || 0;
    const older = olderPatternMap[patternId] || 0;

    const meta = patternLookup[patternId] || {};

    let state = "neutral";

    if (baseline > 0 && active > 0) state = "reinforcing";
    else if (baseline > 0 && active === 0) state = "dormant";
    else if (baseline === 0 && active > 0) state = "emerging";

    let trend = "stable";

    if (recent > older * 1.2) trend = "rising";
    else if (older > recent * 1.2) trend = "healing";

    return {
      id: patternId,
      baseline,
      active,
      state,
      trend,
      recent,
      older,
      description: meta.description,
      chakra: meta.chakra,
    };
  });

  // ---------------------------
  // 🔥 CHAKRA → STRONGEST PATTERN
  // ---------------------------
  const chakraPatternMap: Record<string, any> = {};

  patternStates.forEach((p) => {
    if (!p.chakra) return;

    const existing = chakraPatternMap[p.chakra];

    if (!existing || p.active > existing.weight) {
      chakraPatternMap[p.chakra] = {
        description: p.description,
        weight: p.active,
      };
    }
  });

  return {
    energy,
    patterns: patternStates,
    chakraPatterns: chakraPatternMap, // ✅ THIS is what UI uses
  };
}