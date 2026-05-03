import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { supabase } from "../../services/supabase";
import { processReflection } from "../../db/flow";
import { getUserId } from "../../lib/user";
import EmotionCloudSkia from "../../components/signals/EmotionCloudSkia";

export default function Journal() {
  const [emotions, setEmotions] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [text, setText] = useState("");

  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // 🔄 Load emotions
  useEffect(() => {
    const loadEmotions = async () => {
      const { data } = await supabase
        .from("emotions")
        .select("id, word");

      setEmotions(data || []);
    };

    loadEmotions();
  }, []);

const toggleEmotion = (id: number) => {
  setSelected((prev: number[]) => {
    if (prev.includes(id)) {
      return prev.filter((e) => e !== id);
    }

    if (prev.length >= 3) {
      return prev; // limit to 3
    }

    return [...prev, id];
  });
};

  // 📷 Image Picker
  const handleImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) return;

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        quality: 0.5,
      });

      if (!res.canceled) {
        setImageBase64(res.assets[0].base64 || null);
      }
    } catch (e) {
      console.log("Image error:", e);
    }
  };

  // 🚀 Submit
  const handleSubmit = async () => {
    if (
      !text.trim() &&
      selected.length === 0 &&
      !imageBase64 &&
      !audioBase64
    )
      return;

    setLoading(true);

    console.log("📓 JOURNAL SUBMIT", { text, selected });

    try {
      const userId = await getUserId();

      if (!userId) {
        console.log("❌ No userId");
        setLoading(false);
        return;
      }

      await processReflection({
        userId,
        text,
        emotions: selected,
        imageBase64: imageBase64 || undefined,
        audioBase64: audioBase64 || undefined,
        source: "journal",
      });

      // 🧹 Reset
      setText("");
      setSelected([]);
      setImageBase64(null);
      setAudioBase64(null);

      // 💫 subtle feedback
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);

      console.log("✅ Journal saved");
    } catch (e) {
      console.log("Submit error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 🌿 EMOTION CLOUD */}
<View style={styles.emotionContainer}>
  <EmotionCloudSkia
    emotions={emotions}
    selected={selected}
    onPress={toggleEmotion}
  />
</View>

      {/* ✍️ WRITING AREA + ACTIONS */}
      <View style={styles.contentRow}>
        {/* TEXT AREA */}
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="write freely..."
          placeholderTextColor="#888"
          multiline
          style={styles.textArea}
        />

        {/* ACTION COLUMN */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleImage}>
            <Text style={styles.icon}>📷</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.icon}>🎤</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.icon}>
              {loading ? "..." : selected.length > 0 ? "✨" : "❤️"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.icon}>
              {loading ? "..." : "➤"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 💫 SAVED FEEDBACK */}
      {saved && (
        <Text style={styles.savedText}>saved</Text>
      )}
    </View>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  // 🌿 EMOTIONS
  emotionContainer: {
    marginTop: 80,
    marginLeft: 5,
    marginRight: 5,
    //paddingHorizontal: 10,
  },

  emotionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingBottom: 100,
  },

  emotionChip: {
    borderWidth: 1,
    borderColor: "rgba(234,179,8,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    margin: 6,
  },

  selected: {
    borderColor: "#facc15",
    backgroundColor: "rgba(250,204,21,0.1)",
  },

  emotionText: {
    fontSize: 12,
    color: "#facc15",
  },

  // ✍️ MAIN CONTENT
  contentRow: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 30,
    gap: 12,
  },

  textArea: {
    flex: 1,
    color: "white",
    fontSize: 16,
    textAlignVertical: "top",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 16,
  },

  // 🔥 ACTION COLUMN
  actions: {
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 18,
    paddingBottom: 10,
  },

  icon: {
    fontSize: 20,
    color: "white",
  },

  savedText: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    color: "#888",
    fontSize: 12,
  },
});
