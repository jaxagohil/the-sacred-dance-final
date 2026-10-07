// --------------------------------------------------
// 💠 SAVE SOVEREIGN LIFE PICTURE
// --------------------------------------------------

import { supabase } from "../services/supabase";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type SaveSovereignLifePictureInput = {
  userId: string;
  lifePictureId?: string;
  text: string;
};

// --------------------------------------------------
// MAIN
// --------------------------------------------------

export async function saveSovereignLifePicture({
  userId,
  lifePictureId,
  text,
}: SaveSovereignLifePictureInput) {

  const rawText = text.trim();

  const payload = {
    user_id: userId,
    picture: {
      text: rawText,
    },
    status: "emerging",
  };

  // --------------------------------------------------
  // UPDATE EXISTING ENTRY
  // --------------------------------------------------

  if (lifePictureId) {

    const {
      data,
      error,
    } = await supabase
      .from("sovereign_life_pictures")
      .update(payload)
      .eq("id", lifePictureId)
      .eq("user_id", userId)
      .select("id, picture, status, version, updated_at")
      .single();

    if (error) {
      console.error(
        "❌ SOVEREIGN LIFE PICTURE UPDATE ERROR:",
        error
      );
      throw error;
    }

    return data;
  }

  // --------------------------------------------------
  // CREATE NEW ENTRY
  // --------------------------------------------------

  const {
    data,
    error,
  } = await supabase
    .from("sovereign_life_pictures")
    .insert(payload)
    .select("id, picture, status, version, updated_at")
    .single();

  if (error) {
    console.error(
      "❌ SOVEREIGN LIFE PICTURE INSERT ERROR:",
      error
    );
    throw error;
  }

  return data;
}
