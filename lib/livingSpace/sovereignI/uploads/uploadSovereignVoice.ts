
import { supabase } from "../../../../services/supabase";

// --------------------------------------------------
// ☁️ UPLOAD SOVEREIGN VOICE
// --------------------------------------------------

export async function uploadSovereignVoice({
  uri,
  userId,
  mimeType,
}: {
  uri: string;
  userId: string;
  mimeType?: string;
}): Promise<string | null> {
  try {
    const response = await fetch(uri);

    if (!response.ok) {
      console.error(
        "❌ SOVEREIGN VOICE FETCH ERROR:",
        response.status
      );
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();

    const contentType =
      mimeType ||
      response.headers.get("content-type") ||
      "audio/m4a";

    const extension =
      contentType.includes("webm")
        ? "webm"
        : contentType.includes("wav")
          ? "wav"
          : contentType.includes("mpeg")
            ? "mp3"
            : "m4a";

    const filePath =
      `${userId}/life-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase
      .storage
      .from("vision-board")
      .upload(filePath, arrayBuffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      console.error(
        "❌ SOVEREIGN VOICE UPLOAD ERROR:",
        uploadError
      );
      return null;
    }

    const { data: publicUrlData } = supabase
      .storage
      .from("vision-board")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;

  } catch (error) {
    console.error(
      "❌ SOVEREIGN VOICE UPLOAD ERROR:",
      error
    );

    return null;
  }
}
