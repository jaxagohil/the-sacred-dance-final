import { useRouter } from "expo-router";
import "react-native-get-random-values";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";

import { processReflection } from "../db/flow";
import { getDailyPrompt } from "../db/prompts";
import { getOrCreateProfile } from "../db/getProfile";
import { setLanguage } from "../lib/i18n/i18n";
import { initUser, getUserId } from "../lib/user";

import * as ImagePicker from "expo-image-picker";

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

      if (p?.language) setLanguage(p.language);

      const pr = await getDailyPrompt(userId);
      setPrompt(pr || "Love .. Remembering itself");

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
      <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "black" }}
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

          <Text style={{ color: "#aaa", textAlign: "center" }}>
            {prompt}
          </Text>
        </View>

        {/* INPUT */}
        {showInput && (
          <View
            style={{
              position: "absolute",
              top: "60%",
              left: 20,
              right: 20,
            }}
          >
            <TextInput
              value={text}
              onChangeText={handleTyping}
              placeholder="write freely..."
              placeholderTextColor="#555"
              multiline
              blurOnSubmit={false}
              style={{
                color: "white",
                fontSize: 18,
                lineHeight: 26,
              }}
            />
          </View>
        )}

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

        {/* ACTIONS */}
        {showActions && (
          <View
            style={{
              position: "absolute",
              bottom: 60,
              alignSelf: "center",
              flexDirection: "row",
              gap: 30,
              opacity: 0.85,
            }}
          >
            {/* ✍️ OPEN INPUT */}
            <TouchableOpacity onPress={() => setShowInput(true)}>
              <Text style={{ color: "#aaa", fontSize: 20 }}>✍️</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleImage}>
              <Text style={{ color: "#aaa", fontSize: 20 }}>📷</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={{ color: "#aaa", fontSize: 20 }}>🎤</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowEmojis(!showEmojis)}>
              <Text style={{ color: "#aaa", fontSize: 20 }}>
                {selected.length > 0 ? "✨" : "❤️"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSubmit}>
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  opacity:
                    text || selected.length || imageBase64 || audioBase64
                      ? 1
                      : 0.6,
                }}
              >
                ✦
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Pressable>
    </KeyboardAvoidingView>
  );
}