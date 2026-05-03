// ---------------------------
// TYPES (added - no logic change)
// ---------------------------
type Behaviour = {
  id: string;
  weight: number;
};

type BehaviourMeta = {
  feminine: number;
  masculine: number;
  contraction: number;
  expansion: number;
  quality: "divine" | "distorted";
  chakra_weights: Record<string, number>;
};

type DistortionDot = {
  side: "masculine" | "feminine";
  intensity: number;
};

type Energy = {
  feminine: number;
  masculine: number;
  contraction: number;
  expansion: number;
  chakras: Record<string, number>;
  dominant_chakra: string | null;
  distortions: DistortionDot[];
};

// ---------------------------
// FUNCTION (your logic untouched)
// ---------------------------
export function buildEnergyFromBehaviours(
  behaviours: Behaviour[],
  lookup: Record<string, BehaviourMeta>
): Energy {
  let feminine = 0;
  let masculine = 0;

  let contraction = 0;
  let expansion = 0;

  const chakraMap: Record<string, number> = {};

  const distortionPerChakra: Record<string, number> = {};

  let masculineDistortion = 0;
  let feminineDistortion = 0;

  if (!behaviours || behaviours.length === 0) {
    return {
      feminine: 0.5,
      masculine: 0.5,
      contraction: 0.5,
      expansion: 0.5,
      chakras: {},
      dominant_chakra: null,
      distortions: [],
    };
  }

  behaviours.forEach((b) => {
    const meta = lookup[b.id];
    if (!meta) return;

    const w = b.weight;

    feminine += w * meta.feminine;
    masculine += w * meta.masculine;

    contraction += w * meta.contraction;
    expansion += w * meta.expansion;

    Object.entries(meta.chakra_weights || {}).forEach(
      ([chakra, value]) => {
        const contribution = w * value;

        chakraMap[chakra] =
          (chakraMap[chakra] || 0) + contribution;

        if (meta.quality === "distorted") {
          distortionPerChakra[chakra] =
            (distortionPerChakra[chakra] || 0) + contribution;
        }
      }
    );

    if (meta.quality === "distorted") {
      if (meta.masculine > meta.feminine) {
        masculineDistortion += w;
      } else {
        feminineDistortion += w;
      }
    }
  });

  const typeTotal = feminine + masculine || 1;
  feminine /= typeTotal;
  masculine /= typeTotal;

  const stateTotal = contraction + expansion || 1;
  contraction /= stateTotal;
  expansion /= stateTotal;

  const chakraTotal =
    Object.values(chakraMap).reduce((a, b) => a + b, 0) || 1;

  const normalizedChakras: Record<string, number> = {};
  Object.entries(chakraMap).forEach(([k, v]) => {
    normalizedChakras[k] = v / chakraTotal;
  });

  const chakraKeys = Object.keys(normalizedChakras);
  const avg = 1 / (chakraKeys.length || 1);

  const imbalanceMap: Record<string, number> = {};

  chakraKeys.forEach((chakra) => {
    const value = normalizedChakras[chakra];
    const deviation = Math.abs(value - avg);
    const distortion = distortionPerChakra[chakra] || 0;

    imbalanceMap[chakra] = deviation + distortion * 0.7;
  });

  const dominant_chakra =
    Object.entries(imbalanceMap).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    null;

  const distortions: DistortionDot[] = [];
  const MAX_DOTS = 4;

  const buildDots = (side: "masculine" | "feminine", total: number) => {
    const count = Math.min(Math.ceil(total * 4), MAX_DOTS);

    // ✅ safety fix (no logic change)
    if (count === 0) return;

    for (let i = 0; i < count; i++) {
      distortions.push({
        side,
        intensity: total / count,
      });
    }
  };

  buildDots("masculine", masculineDistortion);
  buildDots("feminine", feminineDistortion);

  return {
    feminine,
    masculine,
    contraction,
    expansion,
    chakras: normalizedChakras,
    dominant_chakra,
    distortions,
  };
}