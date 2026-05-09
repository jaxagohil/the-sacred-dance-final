import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";

import { generateAIResponse } from "../../lib/generateAIResponse";

type GuideKey = "guide_heart" | "guide_structure" | "guide_cosmic";

type Segment = {
  id: string;
  guide?: GuideKey;
  role: "user" | "guide";
  text: string;
};

const guideConfig = {
  guide_heart: { label: "nani", color: "#ff6b9a" },
  guide_structure: { label: "lala", color: "#4da6ff" },
  guide_cosmic: { label: "ammaarah", color: "#ffffff" },
};

export default function Guidance() {
  const [input, setInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [activeGuide, setActiveGuide] =
    useState<GuideKey>("guide_heart");

  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);

  const hasContent = input.length > 0;

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

  useEffect(() => {
    if (showInput) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showInput]);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [segments]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const text = input;

    setSegments((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        text,
      },
    ]);

    setInput("");
    Keyboard.dismiss();
    setLoading(true);

    try {
      const res = await generateAIResponse({
        type: "guide",
        data: {
          guide: activeGuide,
          guideName: guideConfig[activeGuide].label,
          message: text,
        },
      });

      setSegments((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-g",
          guide: activeGuide,
          role: "guide",
          text: res,
        },
      ]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "black" }}
      behavior={undefined}
    >
      <Pressable
        style={{ flex: 1 }}
        onPress={() => setShowInput(true)}
      >

        {/* ✦ (CONSISTENT POSITION) */}
        <TouchableOpacity
          onPress={sendMessage}
          style={{
            position: "absolute",
            top: 60,
            right: 24,
            zIndex: 20,
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

        {/* ✍️ INPUT (MORE SPACE) */}
        {showInput && (
          <View
            style={{
              position: "absolute",
              top: 100,   // 👈 slightly lower
              left: 0,
              right: 0,
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <View style={{ width: "85%" }}>
              <TextInput
                ref={inputRef}
                value={input}
                onChangeText={setInput}
                placeholder="..."
                placeholderTextColor="#555"
                multiline
                style={{
                  color: "white",
                  fontSize: 18,
                  minHeight: 80,   // 👈 more breathing room
                }}
              />
            </View>
          </View>
        )}

        {/* 🧿 GUIDES (MOVED DOWN) */}
        <View
          style={{
            position: "absolute",
            top: 200,   // 👈 pushed down
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "center",
            gap: 20,
          }}
        >
          {Object.entries(guideConfig).map(([key, g]) => {
            const active = activeGuide === key;

            return (
              <TouchableOpacity
                key={key}
                onPress={() =>
                  setActiveGuide(key as GuideKey)
                }
              >
                <Text
                  style={{
                    color: g.color,
                    opacity: active ? 1 : 0.3,
                    fontSize: active ? 16 : 13,
                  }}
                >
                  {g.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 🌊 CHAT */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1, marginTop: 260 }}
          contentContainerStyle={{
            paddingHorizontal: 30,
            paddingBottom: 120,
          }}
        >
          {segments.map((seg) => {
            if (seg.role === "guide" && keyboardVisible) return null;

            return (
              <View
                key={seg.id}
                style={{
                  marginBottom:
                    seg.role === "user" ? 6 : 18,
                  maxWidth: "85%",
                }}
              >
                {seg.role === "guide" && (
                  <Text
                    style={{
                      color: guideConfig[seg.guide!].color,
                      fontSize: 12,
                      opacity: 0.6,
                      marginBottom: 4,
                    }}
                  >
                    {guideConfig[seg.guide!].label}
                  </Text>
                )}

                <Text
                  style={{
                    color: seg.role === "user" ? "#aaa" : "white",
                    fontSize: 16,
                    lineHeight: 24,
                    fontStyle:
                      seg.role === "user" ? "italic" : "normal",
                  }}
                >
                  {seg.text}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {loading && (
          <View style={{ position: "absolute", top: "50%" }}>
            <Text style={{ color: "#555" }}>…</Text>
          </View>
        )}

      </Pressable>
    </KeyboardAvoidingView>
  );
}