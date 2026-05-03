import { useRouter } from "expo-router";
import "react-native-get-random-values";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
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
  const [showEmojis, setShowEmojis] = useState(false);
  const [prompt, setPrompt] = useState("...");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);

  // 🌿 INIT (NO AUTH)
  useEffect(() => {
    const init = async () => {
      try {
        console.log("🚀 INIT START");

        // ✅ ensure user exists
        await initUser();

        const userId = await getUserId();
        console.log("👤 USER ID:", userId);

        // ✅ PROFILE
        try {
          const p = await getOrCreateProfile(userId);
          setProfile(p);

          if (p?.language) {
            setLanguage(p.language);
          }
        } catch (e) {
          console.log("❌ PROFILE ERROR:", e);
        }

        // ✅ PROMPT
        let pr = null;

        try {
          pr = await getDailyPrompt(userId);
        } catch (e) {
          console.log("❌ PROMPT ERROR:", e);
        }

        const DEFAULT_PROMPT = "Love .. Remembering itself";

        setPrompt(pr && pr.trim() ? pr : DEFAULT_PROMPT);

      } catch (e) {
        console.log("❌ INIT ERROR:", e);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const emoji_emotions = [
    { id: "calm", icon: "😌" },
    { id: "open", icon: "✨" },
    { id: "grateful", icon: "💛" },
    { id: "loving", icon: "❤️" },
    { id: "happy", icon: "😊" },
    { id: "hopeful", icon: "🌿" },
    { id: "tired", icon: "😴" },
    { id: "sad", icon: "😔" },
    { id: "crying", icon: "😢" },
    { id: "hurt", icon: "💔" },
    { id: "peaceful", icon: "😮‍💨" },
    { id: "neutral", icon: "😐" },
    { id: "anxious", icon: "😰" },
    { id: "confused", icon: "😕" },
    { id: "angry", icon: "😡" },
    { id: "curious", icon: "😲" },
    { id: "confident", icon: "😎" },
  ];

  const toggleEmotion = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((e) => e !== id)
        : [...prev, id]
    );
    setShowEmojis(false);
  };

  const handleImage = async () => {
    try {
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
    } catch (e) {
      console.log("📷 Image error:", e);
    }
  };

  // 🚀 SUBMIT (ALLOW EMPTY)
  const handleSubmit = async () => {
    console.log("➡️ SUBMIT CLICKED");

    const userId = await getUserId();

    try {
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

        console.log("✅ Reflection saved");
      } else {
        console.log("➡️ Skipping save (empty input)");
      }

    } catch (e) {
      console.log("❌ PROCESS ERROR:", e);
    }

    // ✅ ALWAYS NAVIGATE
    router.push("/mirror");
  };

  // 🔄 LOADING
  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "white" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
        />

        <Text style={styles.prompt}>{prompt}</Text>
      </View>

      {showEmojis && (
        <View style={styles.emojiContainer}>
          {emoji_emotions.map((e) => (
            <TouchableOpacity
              key={e.id}
              onPress={() => toggleEmotion(e.id)}
            >
              <Text style={styles.emoji}>{e.icon}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.inputBar}>
        <TouchableOpacity onPress={handleImage}>
          <Text style={styles.icon}>📷</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log("🎤 voice coming soon")}>
          <Text style={styles.icon}>🎤</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowEmojis(!showEmojis)}>
          <Text style={styles.icon}>
            {selected.length > 0 ? "✨" : "❤️"}
          </Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Write freely..."
          placeholderTextColor="#aaa"
          value={text}
          onChangeText={setText}
        />

        <TouchableOpacity onPress={handleSubmit}>
          <Text style={styles.icon}>➤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },

  center: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  top: {
    alignItems: "center",
    marginTop: 140,
  },

  logo: {
    width: 100,
    height: 100,
    marginBottom: 26,
  },

  prompt: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
  },

  emojiContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  emoji: {
    fontSize: 26,
    margin: 8,
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 40,
  },

  input: {
    flex: 1,
    color: "white",
    marginHorizontal: 10,
  },

  icon: {
    fontSize: 20,
    color: "white",
    marginHorizontal: 6,
  },
});
