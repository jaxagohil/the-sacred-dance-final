import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  message: string;
};

export default function TarotCard({ title, message }: Props) {
  return (
    <View style={styles.wrapper}>

      {/* 🌫 aura (simulated glow) */}
      <View style={styles.aura} />

      {/* 🃏 card */}
      <View style={styles.card}>

        {/* TOP */}
        <View>

          {/* Symbol */}
          <View style={styles.symbolWrap}>
            <Text style={styles.symbol}>◇</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {title}
          </Text>

          {/* Message */}
          <Text style={styles.message}>
            {message}
          </Text>

        </View>

        {/* bottom spacer */}
        <View />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },

  aura: {
    position: "absolute",
    width: 200,
    height: 180,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    opacity: 0.4,
  },

  card: {
    width: 180,
    minHeight: 160,
    borderRadius: 16,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",

    backgroundColor: "rgba(255,255,255,0.06)",

    paddingHorizontal: 16,
    paddingVertical: 20,

    justifyContent: "space-between",

    // shadow (iOS)
    shadowColor: "#fff",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },

    // elevation (Android)
    elevation: 3,
  },

  symbolWrap: {
    alignItems: "center",
    marginBottom: 6,
  },

  symbol: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
  },

  title: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 0.5,
  },

  message: {
    fontSize: 11,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: 4,
  },
});