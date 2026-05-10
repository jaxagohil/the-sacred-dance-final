import { supabase } from "../../services/supabase";

export async function cleanupGuideMessages() {

  //
  // 🧹 DELETE EXPIRED
  //

  const { error } =
    await supabase

      .from(
        "guide_messages"
      )

      .delete()

      .lt(
        "expires_at",

        new Date()
          .toISOString()
      );

  if (error) {

    console.log(
      "❌ CLEANUP GUIDE MESSAGES ERROR",
      error
    );
  }
}