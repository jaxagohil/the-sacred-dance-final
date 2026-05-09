// services/connections/presence.ts

import {
  AppState,
} from "react-native";

import { supabase } from "../supabase";

import {
  getUserId,
} from "../../lib/user";

type FieldSlug =
  | "love"
  | "compassion"
  | "unity";

type PresenceType =
  | "circle"
  | "human"
  | "you";

type EnterPresenceInput = {

  presenceType:
    PresenceType;

  fieldSlug?:
    FieldSlug;

  connectionId?:
    string;
};

type GetPresenceInput = {

  presenceType:
    PresenceType;

  fieldSlug?:
    FieldSlug;

  connectionId?:
    string;
};

//
// ⏳ PRESENCE WINDOW
//

const PRESENCE_MINUTES =
  15;

//
// ⏳ EXPIRY HELPER
//

function getExpiryTime() {

  return new Date(
    Date.now() +
    PRESENCE_MINUTES *
    60 *
    1000
  ).toISOString();
}

//
// 🌌 ENTER PRESENCE
//

export async function enterField({
  presenceType,
  fieldSlug,
  connectionId,
}: EnterPresenceInput) {

  try {

    //
    // 👤 CURRENT USER
    //

    const userId =
      await getUserId();

    if (!userId) {

      return {
        success: false,
      };
    }

    //
    // 👤 LOAD PROFILE
    //

    const {
      data: profile,
      error: profileError,
    } = await supabase

      .from("profiles")

      .select(`
        user_id,
        name,
        avatar_url
      `)

      .eq(
        "user_id",
        userId
      )

      .single();

    if (profileError) {

      console.log(
        "❌ PROFILE ERROR",
        profileError
      );
    }

    //
    // 🌌 FIELD LOOKUP
    //

    let fieldId:
      string | null =
      null;

    if (
      presenceType ===
      "circle"
    ) {

      if (!fieldSlug) {

        return {
          success: false,
        };
      }

      const {
        data: field,
        error: fieldError,
      } = await supabase

        .from(
          "connection_fields"
        )

        .select("*")

        .eq(
          "slug",
          fieldSlug
        )

        .single();

      if (
        fieldError ||
        !field
      ) {

        console.error(
          "❌ FIELD ERROR",
          fieldError
        );

        return {
          success: false,
          error:
            fieldError,
        };
      }

      fieldId =
        field.id;
    }

    //
    // 🌊 UPSERT PRESENCE
    //

    const {
      data: presence,
      error: presenceError,
    } = await supabase

      .from(
        "connection_presence"
      )

      .upsert(
        {

          //
          // 👤 IDENTITY
          //

          user_id:
            userId,

          name:
            profile?.name || null,

          avatar_url:
            profile?.avatar_url || null,

          //
          // 🌌 FIELD
          //

          presence_type:
            presenceType,

          active_field_id:
            fieldId,

          connection_id:
            connectionId ||
            null,

          //
          // 🌊 STATE
          //

          open_to_connection:
            true,

          updated_at:
            new Date()
              .toISOString(),

          expires_at:
            getExpiryTime(),
        },

        {
          onConflict:
            "user_id",
        }
      )

      .select()

      .single();

    if (
      presenceError
    ) {

      console.error(
        "❌ PRESENCE ERROR",
        presenceError
      );

      return {
        success: false,
        error:
          presenceError,
      };
    }

    console.log(
      "🌊 PRESENCE UPDATED:",
      presence?.name
    );

    return {
      success: true,
      presence,
    };

  } catch (error) {

    console.error(
      "❌ ENTER PRESENCE CRASH",
      error
    );

    return {
      success: false,
      error,
    };
  }
}

//
// 🔄 REFRESH PRESENCE
//

export async function refreshPresence() {

  try {

    const userId =
      await getUserId();

    if (!userId) {

      return;
    }

    const {
      error,
    } = await supabase

      .from(
        "connection_presence"
      )

      .update({

        updated_at:
          new Date()
            .toISOString(),

        expires_at:
          getExpiryTime(),
      })

      .eq(
        "user_id",
        userId
      );

    if (error) {

      console.error(
        "❌ REFRESH ERROR",
        error
      );
    }

  } catch (error) {

    console.error(
      "❌ REFRESH CRASH",
      error
    );
  }
}

//
// 🌌 START HEARTBEAT
//

export function startPresenceHeartbeat() {

  let interval:
    NodeJS.Timeout;

  const start = () => {

    refreshPresence();

    interval =
      setInterval(() => {

        refreshPresence();

      }, 5 * 60 * 1000);
  };

  const stop = () => {

    if (interval) {

      clearInterval(
        interval
      );
    }
  };

  //
  // ▶️ START
  //

  start();

  //
  // 📱 APP STATE
  //

  const subscription =
    AppState.addEventListener(
      "change",
      (state) => {

        if (
          state === "active"
        ) {

          start();

        } else {

          stop();
        }
      }
    );

  //
  // 🧹 CLEANUP
  //

  return () => {

    stop();

    subscription.remove();
  };
}

//
// 👥 GET PRESENCE
//

export async function getFieldPresence({
  presenceType,
  fieldSlug,
  connectionId,
}: GetPresenceInput) {

  try {

    //
    // 👤 CURRENT USER
    //

    const currentUserId =
      await getUserId();

    //
    // ⏰ NOW
    //

    const now =
      new Date()
        .toISOString();

    //
    // 🌊 BASE QUERY
    //

    let query =
      supabase

        .from(
          "connection_presence"
        )

        .select("*")

        .eq(
          "presence_type",
          presenceType
        )

        .eq(
          "open_to_connection",
          true
        )

        .gt(
          "expires_at",
          now
        )

        .neq(
          "user_id",
          currentUserId
        )

        .order(
          "updated_at",
          {
            ascending: false,
          }
        )

        .limit(5);

    //
    // 🌌 CIRCLE
    //

    if (
      presenceType ===
      "circle"
    ) {

      if (!fieldSlug) {

        return [];
      }

      const {
        data: field,
        error: fieldError,
      } = await supabase

        .from(
          "connection_fields"
        )

        .select("id")

        .eq(
          "slug",
          fieldSlug
        )

        .single();

      if (
        fieldError ||
        !field
      ) {

        console.error(
          "❌ FIELD FETCH ERROR",
          fieldError
        );

        return [];
      }

      query =
        query.eq(
          "active_field_id",
          field.id
        );
    }

    //
    // 👤 HUMAN
    //

    if (
      presenceType ===
      "human"
    ) {

      if (
        !connectionId
      ) {

        return [];
      }

      query =
        query.eq(
          "connection_id",
          connectionId
        );
    }

    //
    // 🪞 YOU
    //

    if (
      presenceType ===
      "you"
    ) {

      query =
        query.eq(
          "user_id",
          currentUserId
        );
    }

    //
    // 🌊 LOAD
    //

    const {
      data,
      error,
    } = await query;

    if (error) {

      console.error(
        "❌ PRESENCE FETCH ERROR",
        error
      );

      return [];
    }

    return data || [];

  } catch (error) {

    console.error(
      "❌ GET PRESENCE CRASH",
      error
    );

    return [];
  }
}

//
// 🌙 STILLNESS
//

export async function setStillnessMode(
  enabled: boolean
) {

  try {

    const userId =
      await getUserId();

    if (!userId) {

      return {
        success: false,
      };
    }

    const {
      error,
    } = await supabase

      .from(
        "connection_presence"
      )

      .update({

        metadata: {

          stillness:
            enabled,
        },

        updated_at:
          new Date()
            .toISOString(),

        expires_at:
          getExpiryTime(),
      })

      .eq(
        "user_id",
        userId
      );

    if (error) {

      console.error(
        "❌ STILLNESS ERROR",
        error
      );

      return {
        success: false,
      };
    }

    return {
      success: true,
    };

  } catch (error) {

    console.error(
      "❌ STILLNESS CRASH",
      error
    );

    return {
      success: false,
    };
  }
}