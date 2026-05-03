import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  message: string;
};

export default function EnergyReading({ message }: Props) {
  return (
    <View style={styles.container}>

      {/* 🌫 soft glow */}
      <View style={styles.glow} />

      {/* ✨ message */}
      <Text style={styles.text}>
        {message}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    maxWidth: 320,
    alignSelf: "center",
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  glow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.06)",
    opacity: 0.5,
  },

  text: {
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 22,
    letterSpacing: 0.3,

    // subtle glow feel
    textShadowColor: "rgba(255,255,255,0.15)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
});