import { useRouter } from "expo-router";
import "react-native-get-random-values";

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { processReflection } from "../db/flow";
import { getOrCreateProfile } from "../db/getProfile";
import { getDailyPrompt } from "../db/prompts";
import { getUserId, initUser } from "../lib/user";

import * as ImagePicker from "expo-image-picker";

import {
  Colors,
  Fonts,
  Spacing
} from "../constants/theme";

import { setLanguage, t } from "../lib/i18n/t";

export default function LandingScreen() {
  const router = useRouter();

  const [text, setText] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);

  const [prompt, setPrompt] = useState("...");
  const [loading, setLoading] = useState(true);

  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);

  const [typingTimeout, setTypingTimeout] = useState<any>(null);

  // INIT
  useEffect(() => {
    const init = async () => {
      await initUser();

      const userId = await getUserId();
      const p = await getOrCreateProfile(userId);

      await setLanguage(
        p?.language || "en"
      );

      console.log("LANGUAGE:", p?.language);

const pr =
  await getDailyPrompt(
    userId
  );

setPrompt(pr);

      setLoading(false);
    };

    init();
  }, []);

  // EMOJIS
  const emoji_emotions = [
    { id: "calm", icon: "😌" },
    { id: "open", icon: "✨" },
    { id: "grateful", icon: "💛" },
    { id: "loving", icon: "❤️" },
    { id: "happy", icon: "😊" },
    { id: "hopeful", icon: "🌿" },
    { id: "tired", icon: "😴" },
    { id: "sad", icon: "😔" },
  ];

  const toggleEmotion = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((e) => e !== id)
        : [...prev, id]
    );
    setShowEmojis(false);
  };

  // TYPING
  const handleTyping = (t: string) => {
    setText(t);
    setShowActions(true);

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      setShowActions(false);
    }, 3000);

    setTypingTimeout(timeout);
  };

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

  // SUBMIT (UNCHANGED)
  const handleSubmit = async () => {
    const userId = await getUserId();

    if (
      text.trim() ||
      selected.length > 0 ||
      imageBase64 ||
      audioBase64
    ) {
      await processReflection({
        userId,
        text,
        emotions: selected,
        imageBase64: imageBase64 || undefined,
        audioBase64: audioBase64 || undefined,
        source: "landing",
      });
    }

    router.push("/mirror");
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: "center", alignItems: "center" }}>
<ActivityIndicator
  size="small"
  color="white"
/>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Pressable
        style={{ flex: 1, paddingHorizontal: 20 }}
        onPress={() => {
          setShowActions(true);
          Keyboard.dismiss();
        }}
      >
        {/* TOP */}
        <View style={{ alignItems: "center", marginTop: 140 }}>
          <Image
            source={require("../assets/logo.png")}
            style={{ width: 100, height: 100, marginBottom: 20 }}
          />

          <Text
  style={{

    color:
      Colors.softText,

    textAlign:
      "center",

    fontFamily:
      Fonts.light,

    fontSize: 15,

    lineHeight: 28,

    paddingHorizontal:
      Spacing.lg,
  }}
>
            {prompt}
          </Text>
        </View>

        {/* EMOJIS */}
        {showEmojis && (
          <View
            style={{
              position: "absolute",
              bottom: 140,
              left: 20,
              right: 20,
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {emoji_emotions.map((e) => (
              <TouchableOpacity
                key={e.id}
                onPress={() => toggleEmotion(e.id)}
              >
                <Text style={{ fontSize: 28, margin: 8 }}>
                  {e.icon}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

 {/* ✨ ENTRY */}

{showActions && (

  <View
    style={{
      position: "absolute",

      bottom: 70,

      left: 20,
      right: 20,

      alignItems: "center",
    }}
  >

    {/* ✦ ENTER */}

    <TouchableOpacity

      onPress={handleSubmit}

      style={{
        marginBottom: 26,
      }}
    >

<Text
  style={{

    color: "white",

    fontFamily:
      Fonts.light,

    fontSize: 24,

    opacity: 0.92,

    marginBottom: 50,
  }}
>
        ✦
      </Text>

    </TouchableOpacity>

    {/* 🌊 MODALITIES */}

    <View
      style={{
        flexDirection: "row",

        gap: 28,

        marginBottom: 24,

        opacity: 0.82,
      }}
    >

      <TouchableOpacity
        onPress={handleImage}
      >

        <Text
          style={{
            color:Colors.mutedText,

            fontSize: 18,
          }}
        >
          📷
        </Text>

      </TouchableOpacity>

      <TouchableOpacity>

        <Text
          style={{
            color:Colors.mutedText,

            fontSize: 18,
          }}
        >
          🎤
        </Text>

      </TouchableOpacity>

      <TouchableOpacity

        onPress={() =>
          setShowEmojis(
            !showEmojis
          )
        }
      >

        <Text
          style={{
            color:Colors.mutedText,

            fontSize: 18,
          }}
        >

          {
            selected.length > 0

              ? "✨"

              : "😊"
          }

        </Text>

      </TouchableOpacity>

    </View>

    {/* ✍️ INPUT */}

    <View
      style={{
        width: "82%",
      }}
    >

<TextInput

  value={text}

  onChangeText={
    handleTyping
  }

placeholder={t("landing.write_freely")}

  placeholderTextColor={
    Colors.subtleText
  }

  multiline

  blurOnSubmit={false}

  style={{

    color:
      Colors.softText,

    fontFamily:
      Fonts.light,

    fontSize: 15,

    lineHeight: 28,

    textAlign:
      "center",

    minHeight: 70,

    paddingHorizontal:
      Spacing.md,
  }}
/>

    </View>

  </View>

)}
      </Pressable>
    </KeyboardAvoidingView>
  );
}