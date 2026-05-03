import { supabase } from "../services/supabase";

export async function getDailyPrompt(userId: string) {
  const today = new Date().toISOString().split("T")[0];

  // 🌕 1. seasonal
  const { data: seasonal } = await supabase
    .from("daily_prompts")
    .select("*")
    .eq("type", "seasonal")
    .eq("active", true)
    .lte("start_date", today)
    .gte("end_date", today)
    .order("priority", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (seasonal) return seasonal.prompt;

  // 🌸 2. onboarding
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.created_at) {
    const start = new Date(user.created_at);
    const diffDays =
      Math.floor(
        (Date.now() - start.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

    if (diffDays <= 30) {
      const { data: onboarding } = await supabase
        .from("daily_prompts")
        .select("*")
        .eq("type", "onboarding")
        .eq("day_number", diffDays)
        .maybeSingle();

      if (onboarding) return onboarding.prompt;
    }
  }

  // 🌿 3. default
  const { data: fallback } = await supabase
    .from("daily_prompts")
    .select("*")
    .eq("type", "default")
    .limit(1)
    .maybeSingle();

  return fallback?.prompt || "Love .. Remembering itself";
}