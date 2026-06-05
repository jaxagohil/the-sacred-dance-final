import { useEffect, useState } from "react";
import "react-native-get-random-values";

import { v4 as uuidv4 } from "uuid";

import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { processJournalReflection } from "../../db/processJournalReflection";

import { getUserId } from "../../lib/user";

import { supabase } from "../../services/supabase";

import {
  Colors,
  Fonts,
  Opacity,
  Spacing,
} from "../../constants/theme";

import EmotionCloudSkia from "../../components/signals/EmotionCloudSkia";
import { getLanguage, t } from "../../lib/i18n/t";

import {
  Audio,
} from "expo-av";
import * as ImagePicker from "expo-image-picker";

 import {
  buildReflectionPacket,
} from "../../lib/buildReflectionsPacket";

const { height } =
  Dimensions.get("window");

type Emotion = {
  id: string;
  word: string;
};

export default function Journal() {

  //
  // 🌊 STATE
  //

  const [text, setText] =
    useState("");

const [selected, setSelected] =
  useState<string[]>([]);

  const [ack, setAck] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [emotions, setEmotions] =
    useState<Emotion[]>([]);

  const [language, setLanguageState] =
  useState("en");  

  const [imageBase64,
  setImageBase64] =
    useState<string | null>(
      null
    );

const [audioUri,
  setAudioUri] =
    useState<string | null>(
      null
    );

        const [recording,
  setRecording] =
    useState<Audio.Recording | null>(
      null
    );

  //
  // ✨ DERIVED
  //

const hasContent =

  text.trim().length > 0 ||

  selected.length > 0 ||

  !!imageBase64 ||

  !!audioUri;

  //
  // 🌿 LOAD EMOTIONS
  //

  useEffect(() => {

    async function loadEmotions() {

const language =
  getLanguage();

  setLanguageState(
  language
);

  console.log(
  "🌍 JOURNAL LANGUAGE:",
  language
);

const { data } =

  await supabase

    .from("emotions")

    .select("id, word")

    .eq(
      "language",
      language
    );

      setEmotions(data || []);
    }

    loadEmotions();

  }, []);

  //
  // 🌊 TOGGLE EMOTION
  //

  const toggleEmotion = (
    id: string
  ) => {

    setSelected((prev) => {

      if (
        prev.includes(id)
      ) {

        return prev.filter(
          (e) => e !== id
        );
      }

      if (
        prev.length >= 3
      ) {

        return prev;
      }

      return [...prev, id];
    });
  };

  //
  // ✍️ TYPING
  //

  const handleTyping = (
    t: string
  ) => {

    setText(t);
  };

  //
  // ✨ RELEASE
  //

  /*
 * --------------------------------------------------
 * 📷 IMAGE
 * --------------------------------------------------
 */

  // IMAGE
  const handleImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) return;

    const res = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.5,
    });

    if (!res.canceled) {
      setImageBase64(res.assets[0].base64 || null);
    }
  };
  /*
 * --------------------------------------------------
 * 🎤 VOICE
 * --------------------------------------------------
 */

const handleVoice =
  async () => {

    try {

      /*
       * --------------------------------------------------
       * 🎙 START
       * --------------------------------------------------
       */

      if (!recording) {

        await Audio
          .requestPermissionsAsync();

        await Audio
          .setAudioModeAsync({

            allowsRecordingIOS:
              true,

            playsInSilentModeIOS:
              true,
          });

        const {
          recording,
        } = await Audio
          .Recording
          .createAsync(

            Audio
              .RecordingOptionsPresets
              .HIGH_QUALITY
          );

        setRecording(
          recording
        );

        console.log(
          "🎙 Recording started"
        );

        return;
      }

      /*
       * --------------------------------------------------
       * ⏹ STOP
       * --------------------------------------------------
       */

      await recording
        .stopAndUnloadAsync();

      const uri =
        recording.getURI();

      setAudioUri(
        uri || null
      );

      setRecording(
        null
      );

      console.log(
        "🎙 Saved:",
        uri
      );

    } catch (err) {

      console.log(
        "🎤 AUDIO ERROR",
        err
      );
    }
  };
  
 const handleRelease =
  async () => {

    if (!hasContent)
      return;

    if (saving)
  return;

    const userId =
      await getUserId();

    if (!userId)
      return;

          const batchId =
  uuidv4();
  
    try {

      setSaving(true);

      /*
       * --------------------------------------------------
       * 🌊 BUILD REFLECTION PACKET
       * --------------------------------------------------
       */

      const packet =

        await buildReflectionPacket({

          text,

          emotions:
            selected,

          imageBase64,

          audioUri,
        });

     /*
 * --------------------------------------------------
 * 🌊 PROCESS JOURNAL REFLECTION
 * --------------------------------------------------
 */

await processJournalReflection({

  userId,

  language,

  batchId,

  text:
    packet.text,

  emotions:
    packet.emotions,

  imageBase64,

  audioUri,

  observableScenes:
    packet.observableScenes,

  bodyResponses:
    packet.bodyResponses,

  copingStrategies:
    packet.copingStrategies,

  manifestations:
    packet.manifestations,

  nervousSystem:
    packet.nervousSystem,
});

/*
 * --------------------------------------------------
 * ✨ RESET
 * --------------------------------------------------
 */

Keyboard.dismiss();

setText("");

setSelected([]);

setImageBase64(
  null
);

setAudioUri(
  null
);

setAudioUri(
  null
);

      setAck(true);

      setTimeout(() => {

        setAck(false);

      }, 1200);

    } catch (error) {

      console.log(
        "❌ JOURNAL ERROR",
        error
      );

    } finally {

      setSaving(false);
    }
  };

  //
  // 🌌 UI
  //

  return (

    <KeyboardAvoidingView

      style={{
        flex: 1,

        backgroundColor:
          Colors.background,
      }}

      behavior={undefined}
    >

      {/* 🌊 MAIN */}

      <Pressable

        style={{
          flex: 1,
        }}

        onPress={() => {

          Keyboard.dismiss();
        }}
      >

 {/* ✍️ WRITING */}

<View
  style={{
    position: "absolute",

    top: 120,

    width: "100%",

    paddingHorizontal: 32,

    maxHeight:
      height * 0.25,

    alignItems:
      "center",
  }}
>

  <TextInput

    value={text}

    onChangeText={
      handleTyping
    }

    placeholder={t("journal.placeholder")}

    placeholderTextColor={
      Colors.subtleText
    }

    multiline

    autoFocus={false}

    returnKeyType="done"

    onSubmitEditing={() =>
      Keyboard.dismiss()
    }

    style={{

      color:
        Colors.softText,

      fontFamily:
        Fonts.light,

      fontSize: 16,

      lineHeight: 28,

      paddingHorizontal:
        Spacing.sm,

      textAlignVertical:
        "top",

      textAlign:
        "center",

      maxWidth: 340,

      width: "100%",

      maxHeight:
        height * 0.32,
    }}
  />

</View>

        {/* 🌌 CENTER ACTIONS */}

<View
  style={{

    position: "absolute",

    top: 340,

    left: 0,
    right: 0,

    alignItems:
      "center",
  }}
>

  {/* 📷 🎤 */}

  <View
    style={{

      flexDirection: "row",

      alignItems: "center",

      gap: 24,

      marginBottom: 18,

      opacity: 0.72,
    }}
  >

    <TouchableOpacity
      onPress={
        handleImage
      }
    >

      <Text
        style={{

          color:
            Colors.mutedText,

          fontSize: 20,
        }}
      >
        📷
      </Text>

    </TouchableOpacity>

    <TouchableOpacity
      onPress={
        handleVoice
      }
    >

      <Text
        style={{

          color:

            recording

              ? Colors.white

              : Colors.mutedText,

          fontSize: 20,
        }}
      >
        {

          recording
            ? "⏺"
            : "🎤"
        }
      </Text>

    </TouchableOpacity>

  </View>

  {/* ✦ */}

  <TouchableOpacity

    onPress={
      handleRelease
    }

    disabled={
      !hasContent
    }
  >

    <Text
      style={{

        color:

          saving

            ? Colors.mutedText

            : hasContent

              ? Colors.white

              : Colors.subtleText,

        fontFamily:
          Fonts.light,

        fontSize: 24,

        opacity:

          hasContent
            ? 0.92
            : 0.24,
      }}
    >
      ✦
    </Text>

  </TouchableOpacity>

</View>

        {/* 🌿 EMOTION CLOUD */}

        <View
          style={{
            position: "absolute",

            bottom:
              height * 0.04,

            left: 0,
            right: 0,

            alignItems:
              "center",

            opacity:
              Opacity.medium,
          }}
        >

          <EmotionCloudSkia

            emotions={
              emotions
            }

            selected={
              selected
            }

            onPress={
              toggleEmotion
            }
          />

        </View>


        {/* 💫 ACK */}

        {ack && (

          <Text
            style={{
              position: "absolute",

              bottom: 40,

              alignSelf:
                "center",

              color:
                Colors.mutedText,

              fontFamily:
                Fonts.light,

              fontSize: 10,
            }}
          >
            held
          </Text>

        )}

      </Pressable>

    </KeyboardAvoidingView>
  );
}