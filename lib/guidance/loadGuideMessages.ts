import { supabase } from "../../services/supabase";

export async function loadGuideMessages(
  userId: string
) {

  //
  // 🌊 LOAD
  //

  const { data, error } =
    await supabase

      .from(
        "guide_messages"
      )

      .select("*")

      .eq(
        "user_id",
        userId
      )

      .gt(
        "expires_at",

        new Date()
          .toISOString()
      )

      .order(
        "created_at",

        {
          ascending: true,
        }
      );

  if (error) {

    console.log(
      "❌ LOAD GUIDE MESSAGES ERROR",
      error
    );

    return [];
  }

  //
  // ✨ MAP
  //

  return (
    data || []
  ).map((m) => ({

    id: m.id,

    guide:
      m.guide,

    role:
      m.role,

    text:
      m.content,

    createdAt:
      new Date(
        m.created_at
      ).getTime(),
  }));
}