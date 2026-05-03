import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function EmotionCloudSimple({ emotions }: any) {
  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (id: number) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  return (
    <View style={styles.container}>
      {emotions.map((e: any) => {
        const isSelected = selected.includes(e.id);

        return (
          <Pressable key={e.id} onPress={() => toggle(e.id)}>
            <Text
              style={[
                styles.text,
                isSelected && styles.selected,
              ]}
            >
              {e.word}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 20,
    gap: 10,
  },
  text: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  selected: {
    color: "#FFD700",
  },
});