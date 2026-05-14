// /lib/context/buildConnectionsContext.ts

import {
  getUserId,
} from "../user";

import {
  supabase,
} from "../../services/supabase";

import {
  buildUserContext,
} from "./buildUserContext";

type SpaceType =
  | "self"
  | "human"
  | "circle";

type Params = {

  spaceType: SpaceType;

  connectionId?: string;

  fieldSlug?: string;
};

export async function
buildConnectionsContext({

  spaceType,

  connectionId,

  fieldSlug,

}: Params) {

  try {

    //
    // 👤 USER
    //

    const userId =
      await getUserId();

    //
    // 🌌 USER CONTEXT
    //

    const userContext =
      await buildUserContext({

        userId,

        source:
          "connections",

        activeLens:
          "people",
      });

    //
    // 👤 PROFILE
    //

    const {
      data: profile,
    } = await supabase

      .from("profiles")

      .select("*")

      .eq(
        "user_id",
        userId
      )

      .single();

    //
    // 🌊 RECENT SELF REFLECTIONS
    //

    const {
      data: selfReflections,
    } = await supabase

      .from("field_messages")

      .select("*")

      .eq(
        "source_type",
        "self"
      )

      .eq(
        "connection_id",
        userId
      )

      .order(
        "created_at",
        {
          ascending: false,
        }
      )

      .limit(12);

    //
    // 🌍 RECENT HUMAN FIELD
    //

    const {
      data: humanMessages,
    } = await supabase

      .from("field_messages")

      .select("*")

      .eq(
        "source_type",
        "human"
      )

      .order(
        "created_at",
        {
          ascending: false,
        }
      )

      .limit(20);

    //
    // 🌌 CIRCLE FIELD
    //

    let circleMessages:
      any[] = [];

    if (

      spaceType ===
      "circle" &&

      fieldSlug

    ) {

      const {
        data,
      } = await supabase

        .from("field_messages")

        .select("*")

        .eq(
          "source_type",
          "circle"
        )

        .eq(
          "field_slug",
          fieldSlug
        )

        .order(
          "created_at",
          {
            ascending: false,
          }
        )

        .limit(20);

      circleMessages =
        data || [];
    }

    //
    // 🌍 ACTIVE HUMANS
    //

    const {
      data: activeHumans,
    } = await supabase

      .from(
        "connection_presence"
      )

      .select("*")

      .gte(

        "last_seen_at",

        new Date(

          Date.now() -

          1000 *
          60 *
          8

        ).toISOString()
      );

    //
    // ✨ ALL MESSAGES
    //

    const combinedMessages = [

      ...(selfReflections || []),

      ...(humanMessages || []),

      ...(circleMessages || []),
    ];

    //
    // ✨ EMOTIONAL TONE
    //

    const emotionalTone =
      deriveEmotionalTone(
        combinedMessages
      );

    //
    // 🌊 FIELD STATE
    //

    const fieldState =
      deriveFieldState({

        activeHumans:
          activeHumans?.length || 0,

        messageCount:
          combinedMessages.length,
      });

    //
    // ✨ RESONANCE
    //

    const resonanceLevel =
      deriveResonanceLevel(
        combinedMessages
      );

    //
    // 🌙 STILLNESS
    //

    const stillness =
      profile?.is_quiet || false;

    //
    // ✨ DOMINANT EMOTION
    //

    const dominantEmotion =
      deriveDominantEmotion(
        combinedMessages
      );

    //
    // 🌍 CONNECTION ENERGY
    //

    const recentConnectionEnergy =
      deriveConnectionEnergy(
        humanMessages || []
      );

    //
    // 🌌 DAILY FIELD
    //

    const dailyField =
      userContext?.dailyField || null;

    //
    // 🌌 COSMIC
    //

    const cosmic =
      userContext?.cosmic || null;

    //
    // ✨ RETURN
    //

    return {

      spaceType,

      emotionalTone,

      stillness,

      fieldState,

      resonanceLevel,

      activeHumans:
        activeHumans?.length || 0,

      recentConnectionEnergy,

      dominantEmotion,

      profile,

      connectionId,

      fieldSlug,

      //
      // 🌌 COSMIC FIELD
      //

      dailyField,

      cosmic,

      //
      // 🪞 USER CONTEXT
      //

      mirror:
        userContext?.mirror || null,

      energy:
        userContext?.energy || null,

      distortions:
        userContext?.distortions || null,
    };

  } catch (error) {

    console.log(
      "❌ BUILD CONNECTIONS CONTEXT ERROR",
      error
    );

    return {

      spaceType,

      emotionalTone:
        "gentle",

      stillness: false,

      fieldState:
        "quiet",

      resonanceLevel:
        "soft",

      activeHumans: 0,

      recentConnectionEnergy:
        "subtle",

      dominantEmotion:
        "reflective",

      dailyField: null,

      cosmic: null,

      mirror: null,

      energy: null,

      distortions: null,
    };
  }
}

//
// ✨ EMOTIONAL TONE
//

function deriveEmotionalTone(
  messages: any[]
) {

  const text =
    messages

      .map(
        (m) =>
          m?.content || ""
      )

      .join(" ")

      .toLowerCase();

  if (

    text.includes("love") ||

    text.includes("heart") ||

    text.includes("care")

  ) {

    return "warm";
  }

  if (

    text.includes("grief") ||

    text.includes("sad") ||

    text.includes("miss")

  ) {

    return "tender";
  }

  if (

    text.includes("fear") ||

    text.includes("anxious") ||

    text.includes("lost")

  ) {

    return "fragile";
  }

  if (

    text.includes("peace") ||

    text.includes("still")

  ) {

    return "quiet";
  }

  return "gentle";
}

//
// 🌊 FIELD STATE
//

function deriveFieldState({

  activeHumans,

  messageCount,

}: {

  activeHumans: number;

  messageCount: number;
}) {

  if (

    activeHumans === 0 &&

    messageCount < 2

  ) {

    return "still";
  }

  if (
    activeHumans < 4
  ) {

    return "quiet";
  }

  if (
    activeHumans < 10
  ) {

    return "flowing";
  }

  return "alive";
}

//
// ✨ RESONANCE
//

function deriveResonanceLevel(
  messages: any[]
) {

  if (
    messages.length < 3
  ) {

    return "soft";
  }

  if (
    messages.length < 12
  ) {

    return "open";
  }

  return "active";
}

//
// ✨ DOMINANT EMOTION
//

function deriveDominantEmotion(
  messages: any[]
) {

  const text =
    messages

      .map(
        (m) =>
          m?.content || ""
      )

      .join(" ")

      .toLowerCase();

  if (
    text.includes("hope")
  ) {

    return "hopeful";
  }

  if (
    text.includes("lonely")
  ) {

    return "lonely";
  }

  if (
    text.includes("love")
  ) {

    return "loving";
  }

  if (
    text.includes("peace")
  ) {

    return "peaceful";
  }

  return "reflective";
}

//
// 🌍 CONNECTION ENERGY
//

function deriveConnectionEnergy(
  messages: any[]
) {

  if (
    messages.length < 2
  ) {

    return "subtle";
  }

  if (
    messages.length < 10
  ) {

    return "emerging";
  }

  return "resonant";
}