import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  message: string;
  theme?: "blue" | "gold" | "copper" | "pink" | "black";
};

const themeStyles = {
  blue: {
    glow: "rgba(120,180,255,0.25)",
    tint: "rgba(120,180,255,0.18)",
  },
  gold: {
    glow: "rgba(255,210,120,0.25)",
    tint: "rgba(255,210,120,0.18)",
  },
  copper: {
    glow: "rgba(249,115,22,0.25)",
    tint: "rgba(249,115,22,0.18)",
  },
  pink: {
    glow: "rgba(255,120,180,0.25)",
    tint: "rgba(255,120,180,0.18)",
  },
  black: {
    glow: "rgba(255,215,0,0.12)",
    tint: "rgba(255,255,255,0.06)",
  },
};

export default function OracleCard({
  title,
  message,
  theme = "blue",
}: Props) {
  const t = themeStyles[theme];

  return (
    <View style={styles.wrapper}>

      {/* 🌫 AURA */}
      <View
        style={[
          styles.aura,
          { backgroundColor: t.glow },
        ]}
      />

      {/* 🃏 CARD */}
      <View style={[styles.card, { shadowColor: t.glow }]}>

        {/* ✨ INNER LIGHT */}
        <View style={[styles.innerGlow, { backgroundColor: t.tint }]} />

        {/* CONTENT */}
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>

        {/* SYMBOL */}
        <View style={styles.symbolWrap}>
          <Text style={styles.symbol}>✧</Text>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },

  aura: {
    position: "absolute",
    width: 260,
    height: 340,
    borderRadius: 30,
    opacity: 0.25,
    transform: [{ scale: 1.2 }],
  },

  card: {
    width: 220,
    height: 320,
    borderRadius: 30,

    backgroundColor: "rgba(10,10,15,0.7)",

    paddingHorizontal: 24,
    paddingVertical: 28,

    justifyContent: "space-between",
    overflow: "hidden",

    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },

    elevation: 4,
  },

  innerGlow: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    height: 120,
    borderRadius: 100,
    opacity: 0.12,
  },

  content: {
    alignItems: "center",
    marginTop: 20,
  },

  title: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 12,
    letterSpacing: 0.5,
    textAlign: "center",
  },

  message: {
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 8,
  },

  symbolWrap: {
    alignItems: "center",
    marginBottom: 6,
  },

  symbol: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 11,
    letterSpacing: 3,
  },
});