// services/connections/messages.ts

import { supabase } from "../supabase";

import {
  getUserId,
} from "../../lib/user";

type FieldSlug =
  | "love"
  | "compassion"
  | "unity";

type SourceType =
  | "circle"
  | "human"
  | "you";

type CreateMessageInput = {

  sourceType:
    SourceType;

  content: string;

  fieldSlug?:
    FieldSlug;

  connectionId?:
    string;
};

type GetMessagesInput = {

  sourceType:
    SourceType;

  fieldSlug?:
    FieldSlug;

  connectionId?:
    string;
};

//
// ✨ CREATE MESSAGE
//

export async function createFieldMessage({
  sourceType,
  fieldSlug,
  connectionId,
  content,
}: CreateMessageInput) {

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
    // ⏳ 36 HOUR EXPIRY
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
    // 🌌 FIELD LOOKUP
    //

    let fieldId:
      string | null =
      null;

    if (
      sourceType ===
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
          "❌ FIELD ERROR",
          fieldError
        );

        return {
          success: false,
        };
      }

      fieldId =
        field.id;
    }

    //
    // 🌊 CREATE MESSAGE
    //

    console.log(
      "💬 CREATE MESSAGE:",
      {
        sourceType,
        fieldSlug,
        connectionId,
        userId,
      }
    );

    const {
      data,
      error,
    } = await supabase

      .from(
        "field_messages"
      )

      .insert({

        //
        // 🌌 FIELD
        //

        source_type:
          sourceType,

        field_id:
          fieldId,

        connection_id:
          connectionId ||
          null,

        //
        // 👤 USER
        //

        user_id:
          userId,

        //
        // 💬 CONTENT
        //

        content:
          content.trim(),

        //
        // ⏰ TIMING
        //

        created_at:
          new Date()
            .toISOString(),

        expires_at:
          expiresAt,

        //
        // ✨ METADATA
        //

        metadata: {

          anonymous: true,

          name:
            profile?.name || null,

          avatar_url:
            profile?.avatar_url || null,
        },
      })

      .select()

      .single();

    if (error) {

      console.error(
        "❌ MESSAGE ERROR",
        error
      );

      return {
        success: false,
      };
    }

    console.log(
      "💬 MESSAGE CREATED:",
      data?.id
    );

    return {
      success: true,
      message: data,
    };

  } catch (error) {

    console.error(
      "❌ CREATE MESSAGE CRASH",
      error
    );

    return {
      success: false,
    };
  }
}

//
// 🌊 GET MESSAGES
//

export async function getFieldMessages({
  sourceType,
  fieldSlug,
  connectionId,
}: GetMessagesInput) {

  try {

    //
    // 👤 CURRENT USER
    //

    const userId =
      await getUserId();

    if (!userId) {

      return [];
    }

    //
    // ⏰ NOW
    //

    const now =
      new Date()
        .toISOString();

    //
    // 🌌 BASE QUERY
    //

    let query =
      supabase

        .from(
          "field_messages"
        )

        .select(`
          id,
          content,
          created_at,
          expires_at,
          source_type,
          field_id,
          connection_id,
          user_id,
          metadata
        `)

        .eq(
          "source_type",
          sourceType
        )

        .eq(
          "deleted",
          false
        )

        .gt(
          "expires_at",
          now
        )

        .order(
          "created_at",
          {
            ascending: false,
          }
        )

        .limit(40);

    //
    // 🌌 CIRCLE
    //

    if (
      sourceType ===
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
          "field_id",
          field.id
        );
    }

    //
    // 👤 HUMAN
    //

    if (
      sourceType ===
      "human"
    ) {

      if (
        !connectionId
      ) {

        console.log(
          "❌ NO CONNECTION ID"
        );

        return [];
      }

      console.log(
        "👤 HUMAN QUERY:",
        connectionId
      );

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
      sourceType ===
      "you"
    ) {

      query =
        query.eq(
          "user_id",
          userId
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
        "❌ GET MESSAGES ERROR",
        error
      );

      return [];
    }

    console.log(
      "🌊 MESSAGES LOADED:",
      data?.length || 0
    );

    return data || [];

  } catch (error) {

    console.error(
      "❌ GET MESSAGES CRASH",
      error
    );

    return [];
  }
}

//
// 🕊 DELETE MESSAGE
//

export async function deleteFieldMessage(
  messageId: string
) {

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
    // 🌊 VERIFY OWNERSHIP
    //

    const {
      data: existing,
      error: existingError,
    } = await supabase

      .from(
        "field_messages"
      )

      .select(
        "id, user_id"
      )

      .eq(
        "id",
        messageId
      )

      .single();

    if (
      existingError ||
      !existing
    ) {

      console.error(
        "❌ MESSAGE NOT FOUND",
        existingError
      );

      return {
        success: false,
      };
    }

    //
    // 🚫 NOT OWNER
    //

    if (
      existing.user_id !==
      userId
    ) {

      console.error(
        "❌ NOT OWNER"
      );

      return {
        success: false,
      };
    }

    //
    // 🕊 SOFT DELETE
    //

    const {
      error,
    } = await supabase

      .from(
        "field_messages"
      )

      .update({

        deleted: true,
      })

      .eq(
        "id",
        messageId
      );

    if (error) {

      console.error(
        "❌ DELETE ERROR",
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
      "❌ DELETE CRASH",
      error
    );

    return {
      success: false,
    };
  }
}