import { useEffect, useState } from "react";

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

import { processReflection } from "../../db/flow";

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

  //
  // ✨ DERIVED
  //

  const hasContent =

    text.trim().length > 0 ||

    selected.length > 0;

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

  const handleRelease =
    async () => {

      if (!hasContent)
        return;

      const userId =
        await getUserId();

      if (!userId)
        return;

      try {

        setSaving(true);

        await processReflection({

          userId,

          language,

          text,

          emotions:
            selected,

          source:
            "journal",
        });

        Keyboard.dismiss();

        setText("");

        setSelected([]);

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

      {/* ✦ SAVE */}

      <TouchableOpacity

        onPress={handleRelease}

        disabled={!hasContent}

        style={{
          position: "absolute",

          top: 60,

          right: 24,

          zIndex: 10,
        }}
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

                : 0.28,
          }}
        >
          ✦
        </Text>

      </TouchableOpacity>

      {/* 🌊 MAIN */}

      <Pressable

        style={{
          flex: 1,
        }}

        onPress={() => {

          Keyboard.dismiss();
        }}
      >

        {/* 📷 🎤 */}

        <View
          style={{
            position: "absolute",

            top: 80,

            left: 30,

            flexDirection:
              "row",

            gap: 18,

            opacity:
              Opacity.medium,
          }}
        >

          <TouchableOpacity>

            <Text
              style={{
                color:
                  Colors.mutedText,

                fontSize: 18,
              }}
            >
              📷
            </Text>

          </TouchableOpacity>

          <TouchableOpacity>

            <Text
              style={{
                color:
                  Colors.mutedText,

                fontSize: 18,
              }}
            >
              🎤
            </Text>

          </TouchableOpacity>

        </View>

        {/* ✍️ WRITING */}

<View
  style={{
    position: "absolute",

    top: 120,

    left: 30,

    right: 30,

    maxHeight:
      height * 0.35,
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

  lineHeight: 20,

  paddingHorizontal:
    Spacing.sm,

  textAlignVertical:
    "top",
}}
          />

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

              fontSize: 12,
            }}
          >
            held
          </Text>

        )}

      </Pressable>

    </KeyboardAvoidingView>
  );
}