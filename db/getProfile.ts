import { supabase } from "../services/supabase";

export const getOrCreateProfile = async (userId: string) => {
  if (!userId) {
    console.log("⚠️ No userId passed to getOrCreateProfile");
    return null;
  }

  console.log("👤 getOrCreateProfile → userId:", userId);

  try {
    // 1. check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchError) {
      console.error("❌ Profile fetch error:", fetchError);
      return null;
    }

    // 2. if exists → return it
    if (existingProfile) {
      console.log("✅ Existing profile found");
      return existingProfile;
    }

    console.log("🆕 Creating new profile...");

    // 3. create new profile
    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .insert({
        user_id: userId,
        guide_1_name: "nani",
        guide_2_name: "lala",
        guide_3_name: "ammaarah",
      })
      .select()
      .single();

    // 🔧 handle rare duplicate / race condition
    if (insertError) {
      console.warn("⚠️ Insert failed, retrying fetch...", insertError);

      const { data: retryProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      return retryProfile || null;
    }

    console.log("✅ New profile created:", newProfile);

    return newProfile;
  } catch (err) {
    console.error("❌ getOrCreateProfile failed:", err);
    return null;
  }
};
