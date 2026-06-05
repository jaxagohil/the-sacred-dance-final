import * as ImagePicker from "expo-image-picker";

import * as ImageManipulator from "expo-image-manipulator";

export async function pickImageForVision() {

  const permission =

    await ImagePicker
      .requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {

    return null;
  }

  const res =

    await ImagePicker
      .launchImageLibraryAsync({

        base64: true,

        quality: 0.5,
      });

  if (res.canceled) {

    return null;
  }

  console.log(
    "IMAGE TYPE",
    res.assets[0].mimeType
  );

  const jpegImage =

    await ImageManipulator
      .manipulateAsync(

        res.assets[0].uri,

        [],

        {
          compress: 0.7,

          format:
            ImageManipulator
              .SaveFormat
              .JPEG,

          base64: true,
        }
      );

  console.log(
  "JPEG CREATED",
  jpegImage.base64?.substring(0, 20)
);    

  return jpegImage.base64 || null;
}