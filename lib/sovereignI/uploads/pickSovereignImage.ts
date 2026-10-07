import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export type SovereignImage = {
  originalUri: string;
  uri: string;
  base64: string;
  mimeType: string;
};

// --------------------------------------------------
// PICK SOVEREIGN IMAGE
// --------------------------------------------------

export async function pickSovereignImage(): Promise<SovereignImage | null> {
  const permission =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    return null;
  }

  const result =
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
      allowsEditing: false,
    });

  if (
    result.canceled ||
    !result.assets ||
    !result.assets[0]
  ) {
    return null;
  }

  const asset = result.assets[0];

  // --------------------------------------------------
  // ORIGINAL IMAGE
  // --------------------------------------------------

  const originalUri = asset.uri;

  const originalMimeType =
    asset.mimeType || "image/jpeg";

  // --------------------------------------------------
  // NORMALISED IMAGE FOR AI
  // --------------------------------------------------

  const jpegImage =
    await ImageManipulator.manipulateAsync(
      originalUri,
      [],
      {
        compress: 0.7,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      }
    );

  if (!jpegImage.base64) {
    return null;
  }

  return {
    originalUri,
    uri: jpegImage.uri,
    base64: jpegImage.base64,
    mimeType: originalMimeType,
  };
}