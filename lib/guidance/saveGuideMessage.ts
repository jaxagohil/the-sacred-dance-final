import { supabase } from "../../services/supabase";

import {
    buildContextSnapshot,
} from "./buildContextSnapshot";

type Params = {

  userId: string;

  guide: string;

  role:
    | "user"
    | "guide";

  content: string;

  source?: string;

  contextState?: any;
};

export async function saveGuideMessage({

  userId,

  guide,

  role,

  content,

  source = "guidance",

  contextState,

}: Params) {

  //
  // ⏳ 36 HOURS
  //

  const expiresAt =
    new Date(
      Date.now() +

      36 *
        60 *
        60 *
        1000
    ).toISOString();

  //
  // 🧠 SNAPSHOT
  //

  const contextSnapshot =
    buildContextSnapshot(
      contextState
    );

  //
  // 🌊 SAVE
  //

  const { error } =
    await supabase

      .from(
        "guide_messages"
      )

      .insert({

        user_id:
          userId,

        guide,

        role,

        content,

        source,

        expires_at:
          expiresAt,

        context_snapshot:
          contextSnapshot,
      });

  if (error) {

    console.log(
      "❌ SAVE GUIDE MESSAGE ERROR",
      error
    );
  }
}