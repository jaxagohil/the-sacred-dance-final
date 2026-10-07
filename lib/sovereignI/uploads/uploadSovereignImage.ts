import { supabase } from "../../../services/supabase";

// --------------------------------------------------
// ☁️ UPLOAD SOVEREIGN IMAGE
// --------------------------------------------------

export async function uploadSovereignImage({
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
        "❌ SOVEREIGN IMAGE FETCH ERROR:",
        response.status
      );
      return null;
    }

    const arrayBuffer =
      await response.arrayBuffer();

    const contentType =
      mimeType ||
      response.headers.get("content-type") ||
      "image/jpeg";

    const extension =
      contentType === "image/png"
        ? "png"
        : contentType === "image/webp"
          ? "webp"
          : contentType === "image/gif"
            ? "gif"
            : "jpg";

    const filePath =
      `${userId}/life-${Date.now()}.${extension}`;

    const {
      error: uploadError,
    } = await supabase
      .storage
      .from("vision-board")
      .upload(
        filePath,
        arrayBuffer,
        {
          contentType,
          upsert: false,
        }
      );

    if (uploadError) {
      console.error(
        "❌ SOVEREIGN IMAGE UPLOAD ERROR:",
        uploadError
      );
      return null;
    }

    const {
      data: publicUrlData,
    } = supabase
      .storage
      .from("vision-board")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error(
      "❌ SOVEREIGN IMAGE UPLOAD ERROR:",
      error
    );

    return null;
  }
}