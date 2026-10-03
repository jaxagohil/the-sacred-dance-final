import { supabase } from "../../services/supabase";
import { getUserId } from "../user";

export async function updateLifePicture(
  updates: {
    section: string;
    type: "add" | "update" | "question";
    content: any;
    status: "proposed" | "confirmed" | "unknown";
    reason: string;
  }[]
) {
  const confirmedUpdates =
    updates.filter(
      (update) =>
        update.status === "confirmed" &&
        update.type !== "question"
    );

  if (!confirmedUpdates.length) {
    return null;
  }

  const userId = await getUserId();

  if (!userId) {
    return null;
  }

  const { data: existing, error: fetchError } =
    await supabase
      .from("sovereign_life_pictures")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

  if (fetchError) {
    console.error(
      "❌ LIFE PICTURE FETCH ERROR:",
      fetchError
    );

    return null;
  }

  const picture = {
    ...(existing?.picture || {}),
  };

  for (const update of confirmedUpdates) {
    const section = update.section;

    if (
      update.content &&
      typeof update.content === "object" &&
      !Array.isArray(update.content)
    ) {
      picture[section] = {
        ...(picture[section] || {}),
        ...update.content,
      };
    } else {
      picture[section] = update.content;
    }
  }

  if (existing) {
    const { data, error } =
      await supabase
        .from("sovereign_life_pictures")
        .update({
          picture,
          status: "emerging",
          version:
            (existing.version || 0) + 1,
          last_confirmed_at:
            new Date().toISOString(),
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

    if (error) {
      console.error(
        "❌ LIFE PICTURE UPDATE ERROR:",
        error
      );

      return null;
    }

    const events = confirmedUpdates.map((update) => ({
      user_id: userId,
      life_picture_id: existing.id,
      event_type: update.type,
      content: {
        section: update.section,
        content: update.content,
        status: update.status,
        reason: update.reason,
      },
    }));

    const { error: eventError } =
      await supabase
        .from("sovereign_life_picture_events")
        .insert(events);

    if (eventError) {
      console.error(
        "❌ LIFE PICTURE EVENT ERROR:",
        eventError
      );
    }

    return data;
  }

  const { data, error } =
    await supabase
      .from("sovereign_life_pictures")
      .insert({
        user_id: userId,
        picture,
        status: "emerging",
        version: 1,
        last_confirmed_at:
          new Date().toISOString(),
      })
      .select()
      .single();

  if (error) {
    console.error(
      "❌ LIFE PICTURE CREATE ERROR:",
      error
    );

    return null;
  }

  const events = confirmedUpdates.map((update) => ({
    user_id: userId,
    life_picture_id: data.id,
    event_type: update.type,
    content: {
      section: update.section,
      content: update.content,
      status: update.status,
      reason: update.reason,
    },
  }));

  const { error: eventError } =
    await supabase
      .from("sovereign_life_picture_events")
      .insert(events);

  if (eventError) {
    console.error(
      "❌ LIFE PICTURE EVENT ERROR:",
      eventError
    );
  }

  return data;
}