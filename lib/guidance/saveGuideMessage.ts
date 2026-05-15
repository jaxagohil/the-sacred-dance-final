import { supabase } from "../../services/supabase";

import {
  buildFieldSnapshot,
} from "./buildFieldSnapshot";

type Params = {

  userId: string;

  guide: string;

  role:
    | "user"
    | "guide";

  content: string;

  source?: string;

  language?: string;

  userField?: any;
};

export async function saveGuideMessage({

  userId,

  guide,

  role,

  content,

  source = "guidance",

  userField,

}: Params) {

  /*
   * ---------------------------------------------------------
   * ⏳ 36 HOURS
   * ---------------------------------------------------------
   */

  const expiresAt =
    new Date(

      Date.now() +

      36 *
        60 *
        60 *
        1000

    ).toISOString();

  /*
   * ---------------------------------------------------------
   * 🌌 FIELD SNAPSHOT
   * ---------------------------------------------------------
   */

  const fieldSnapshot =
    buildFieldSnapshot(
      userField
    );

  /*
   * ---------------------------------------------------------
   * 🌊 SAVE MESSAGE
   * ---------------------------------------------------------
   */

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
          fieldSnapshot,
      });

  /*
   * ---------------------------------------------------------
   * ❌ ERROR
   * ---------------------------------------------------------
   */

  if (error) {

    console.log(

      "❌ SAVE GUIDE MESSAGE ERROR",

      error
    );
  }
}