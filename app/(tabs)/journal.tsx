import { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";

import { supabase } from "../../services/supabase";
import { processReflection } from "../../db/flow";
import { getUserId } from "../../lib/user";

import EmotionCloudSkia from "../../components/signals/EmotionCloudSkia";

const { height } = Dimensions.get("window");

type Mode = "idle" | "writing";

type Emotion = {
  id: number;
  word: string;
};

export default function Journal() {
  const [mode, setMode] = useState<Mode>("idle");

  const [text, setText] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  

  const [ack, setAck] = useState(false);
  const [emotions, setEmotions] = useState<Emotion[]>([]);

  const [keyboardVisible, setKeyboardVisible] = useState(false);

 const hasContent =
  text.length > 0 ||
  selected.length > 0;

  useEffect(() => {
    const loadEmotions = async () => {
      const { data } = await supabase
        .from("emotions")
        .select("id, word");

      setEmotions(data || []);
    };

    loadEmotions();
  }, []);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const toggleEmotion = (id: number) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((e) => e !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const handleTyping = (t: string) => {
    setText(t);
  };

  const handleRelease = async () => {
    if (!text.trim() && selected.length === 0) return;

    const userId = await getUserId();
    if (!userId) return;

    await processReflection({
      userId,
      text,
      emotions: selected,
      source: "journal",
    });

    Keyboard.dismiss();

    setText("");
    setSelected([]);
    setMode("idle");

    setAck(true);
    setTimeout(() => setAck(false), 1200);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "black" }}
      behavior={undefined}
    >
      {/* ✦ DIAMOND (TOP LAYER - ALWAYS VISIBLE) */}
 <TouchableOpacity
  onPress={handleRelease}
  style={{
    position: "absolute",
    top: 60,
    right: 24,
    zIndex: 10,
  }}
>
  <Text
    style={{
      color: hasContent ? "white" : "#555",
      fontSize: 18,
    }}
  >
    ✦
  </Text>
</TouchableOpacity>

      {/* MAIN CONTENT */}
      <Pressable
        style={{ flex: 1 }}
        onPress={() => {
          Keyboard.dismiss();
          setMode("writing");
        }}
      >

        {/* 📷 🎤 MEDIA */}
        {mode === "writing" && (
          <View
            style={{
              position: "absolute",
              top: 80,
              left: 30,
              flexDirection: "row",
              gap: 18,
              opacity: 0.6,
            }}
          >
            <TouchableOpacity>
              <Text style={{ color: "#666", fontSize: 18 }}>📷</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={{ color: "#666", fontSize: 18 }}>🎤</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ✍️ WRITING */}
        {mode === "writing" && (
          <View
            style={{
              position: "absolute",
              top: 120,
              left: 30,
              right: 30,
            }}
          >
            <TextInput
              value={text}
              onChangeText={handleTyping}
              placeholder="..."
              placeholderTextColor="#444"
              multiline
              autoFocus
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
              style={{
                color: "white",
                fontSize: 18,
                lineHeight: 26,
              }}
            />
          </View>
        )}

        {/* 🌿 EMOTION CLOUD */}
        {!keyboardVisible && (
          <View
            style={{
              position: "absolute",
              bottom: height * 0.08,
              left: 0,
              right: 0,
              alignItems: "center",
            }}
          >
            <EmotionCloudSkia
              emotions={emotions}
              selected={selected}
              onPress={toggleEmotion}
            />
          </View>
        )}

        {/* ✨ PROMPT */}
        {mode === "idle" && (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: height * 0.45,
              alignSelf: "center",
            }}
          >
            <Text style={{ color: "#666", fontSize: 14 }}>
              ,,,
            </Text>
          </View>
        )}

        {/* 💫 ACK */}
        {ack && (
          <Text
            style={{
              position: "absolute",
              bottom: 40,
              alignSelf: "center",
              color: "#888",
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