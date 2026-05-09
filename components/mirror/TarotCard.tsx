import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  message: string;
};

export default function TarotCard({ title, message }: Props) {
  return (
    <View style={styles.wrapper}>

      {/* 🌫 AURA */}
      <View style={styles.aura} />

      {/* 🃏 CARD */}
      <View style={styles.card}>

        {/* ✨ INNER LIGHT */}
        <View style={styles.innerGlow} />

        {/* CONTENT */}
        <View style={styles.content}>

          {/* SYMBOL */}
          <View style={styles.symbolWrap}>
            <Text style={styles.symbol}>◇</Text>
          </View>

          {/* TITLE */}
          <Text style={styles.title}>
            {title}
          </Text>

          {/* MESSAGE */}
          <Text style={styles.message}>
            {message}
          </Text>

        </View>

        {/* spacer */}
        <View style={styles.spacer} />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  aura: {
    position: "absolute",
    width: 230,
    height: 300,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.08)",
    opacity: 0.25,
    transform: [{ scale: 1.2 }],
  },

  card: {
    width: 180,
    minHeight: 250,

    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",

    paddingHorizontal: 16,
    paddingVertical: 30,

    justifyContent: "flex-start", // 👈 key fix

    overflow: "hidden",

    shadowColor: "#fff",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },

    elevation: 3,
  },

  innerGlow: {
    position: "absolute",
    top: 80, // 👈 fixed
    left: 0,
    right: 0,
    height: 90,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.08)",
    opacity: 0.12,
  },

  content: {
    alignItems: "center",
    marginTop: 40, // 👈 pushes content down
  },

  spacer: {
    height: 20, // 👈 keeps bottom breathing space
  },

  symbolWrap: {
    alignItems: "center",
    marginBottom: 8,
  },

  symbol: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 11,
    letterSpacing: 2,
  },

  title: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 0.5,
  },

  message: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    lineHeight: 17,
    paddingHorizontal: 4,
  },
});