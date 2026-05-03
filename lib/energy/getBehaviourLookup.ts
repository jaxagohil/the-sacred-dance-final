import { supabase } from "../../services/supabase";

type BehaviourMeta = {
  feminine: number;
  masculine: number;
  contraction: number;
  expansion: number;
  quality: "divine" | "distorted";
  chakra_weights: Record<string, number>;
};

export async function getBehaviourLookup(): Promise<
  Record<string, BehaviourMeta>
> {
  const { data, error } = await supabase
    .from("behaviours")
    .select(
      "id, feminine, masculine, contraction, expansion, quality, chakra_weights"
    );

  if (error) {
    console.error("❌ Behaviour lookup error:", error);
    return {};
  }

  if (!data) return {}; // ✅ safety guard

  const lookup: Record<string, BehaviourMeta> = {};

  data.forEach((row) => {
    lookup[row.id] = {
      feminine: row.feminine ?? 0.5,
      masculine: row.masculine ?? 0.5,
      contraction: row.contraction ?? 0.5,
      expansion: row.expansion ?? 0.5,
      quality: row.quality || "divine",
      chakra_weights: row.chakra_weights || {},
    };
  });

  return lookup;
}