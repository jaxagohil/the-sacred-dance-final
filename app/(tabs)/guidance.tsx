import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { generateAIResponse } from "../../lib/generateAIResponse";

type Message = {
  id: string;
  role: "user" | "guide";
  text: string;
};

const guideConfig = {
  guide_heart: { label: "nani", color: "#ff6b9a" },
  guide_structure: { label: "lala", color: "#4da6ff" },
  guide_cosmic: { label: "ammaarah", color: "#ffffff" },
};

export default function Guidance() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [activeGuide, setActiveGuide] =
    useState<keyof typeof guideConfig>("guide_heart");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const text = input;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", text },
    ]);

    setInput("");

    try {
      const res = await generateAIResponse({
        type: "guide",
        data: {
          guide: activeGuide,
          guideName: guideConfig[activeGuide].label,
          message: text,
        },
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-g",
          role: "guide",
          text: res,
        },
      ]);
    } catch (e) {
      console.log("AI error:", e);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black", paddingTop: 90 }}>
      {/* GUIDES */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {Object.entries(guideConfig).map(([key, g]) => {
          const active = activeGuide === key;

          return (
            <TouchableOpacity
              key={key}
              onPress={() =>
                setActiveGuide(key as keyof typeof guideConfig)
              }
              style={{
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: active ? g.color : "#333",
              }}
            >
              <Text
                style={{
                  color: active ? g.color : "#888",
                  fontSize: 14,
                }}
              >
                {g.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* CHAT */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 20,
        }}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 12,
              alignSelf:
                item.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
            }}
          >
            <View
              style={{
                backgroundColor:
                  item.role === "user" ? "#222" : "#111",
                padding: 12,
                borderRadius: 14,
              }}
            >
              <Text style={{ color: "white" }}>{item.text}</Text>
            </View>
          </View>
        )}
      />

      {/* INPUT */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          padding: 12,
          borderTopWidth: 1,
          borderTopColor: "#222",
           marginBottom: 20,
        }}
      >
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="share what’s coming up..."
          placeholderTextColor="#888"
          multiline
          style={{
            flex: 1,
            minHeight: 100,
            maxHeight: 250,
            color: "white",
            backgroundColor: "#1a1a1a",
            borderRadius: 18,
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
        />

        <View
          style={{
            marginLeft: 10,
            justifyContent: "space-between",
            height: 78,
          }}
        >
          <TouchableOpacity
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              borderWidth: 1,
              borderColor: "#444",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <Text>🙂</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={sendMessage}
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: "#333",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white" }}>↑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}