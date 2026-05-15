import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Colors,
  Radius
} from "../../constants/theme";

type Props = {

  number?: number;

  title: string;

  message: string;

  archetype?: string;
};

export default function TarotCard({

  number,

  title,

  message,

  archetype,

}: Props) {

  return (

    <View style={styles.wrapper}>

      {/* 🌫 FIELD */}

      <View style={styles.aura} />

      {/* 🃏 CARD */}

      <View style={styles.card}>

        {/* ✨ TOP SIGNATURE */}

        <View style={styles.topLine} />

        {/* ✨ INNER LIGHT */}

        <View style={styles.innerGlow} />

        {/* 🌌 CONTENT */}

        <View style={styles.content}>

          {/* 🔢 NUMBER */}

          {number !== undefined && (

            <Text style={styles.number}>
              {number}
            </Text>
          )}

          {/* ✧ SYMBOL */}

          <View style={styles.symbolWrap}>

            <Text style={styles.symbol}>
              ◇
            </Text>

          </View>

          {/* ✨ TITLE */}

          <Text style={styles.title}>
            {title}
          </Text>



          {/* 🌌 MESSAGE */}

          <Text style={styles.message}>
            {message}
          </Text>

        </View>

        {/* 🌈 SIGNATURE */}

        <View style={styles.signature} />

      </View>

    </View>
  );
}

const styles =
  StyleSheet.create({

  //
  // 🌌 WRAPPER
  //

  wrapper: {
    position: "relative",

    alignItems: "center",
    justifyContent: "center",
  },

  //
  // 🌫 FIELD
  //

  aura: {
    position: "absolute",

    width: 210,
    height: 280,

    borderRadius:
      Radius.xl,

    backgroundColor:
      "rgba(255,255,255,0.04)",

    opacity: 0.08,

    transform: [
      {
        scale: 1.08,
      },
    ],
  },

  //
  // 🃏 CARD
  //

  card: {

    width: 190,

    minHeight: 255,

    borderRadius:
      28,

    backgroundColor:
      "rgba(5,5,8,0.98)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.06)",

    paddingHorizontal:
      22,

    paddingTop:
      24,

    paddingBottom:
      20,

    justifyContent:
      "space-between",

    overflow: "hidden",

    shadowColor:
      "#000",

    shadowOpacity: 0.22,

    shadowRadius: 18,

    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 4,
  },

  //
  // ✨ TOP LINE
  //

  topLine: {
    alignSelf: "center",

    width: 26,
    height: 1,

    borderRadius: 999,

    backgroundColor:
      "rgba(255,255,255,0.22)",

    marginBottom: 20,
  },

  //
  // ✨ INNER LIGHT
  //

  innerGlow: {
    position: "absolute",

    top: 90,

    left: 30,
    right: 30,

    height: 80,

    borderRadius: 999,

    backgroundColor:
      "rgba(255,255,255,0.03)",

    opacity: 0.7,
  },

  //
  // 🌌 CONTENT
  //

  content: {
    alignItems: "center",

    flex: 1,

    justifyContent: "center",
  },

  //
  // 🔢 NUMBER
  //

  number: {
    color:
      "rgba(255,255,255,0.18)",

    fontSize: 10,

    letterSpacing: 3,

    marginBottom: 14,
  },

  //
  // ✧ SYMBOL
  //

  symbolWrap: {
    alignItems: "center",

    marginBottom: 12,
  },

  symbol: {
    color:
      "rgba(255,255,255,0.24)",

    fontSize: 10,

    letterSpacing: 2,
  },

  //
  // ✨ TITLE
  //

  title: {
    fontSize: 15,

    color:
      "rgba(255,255,255,0.90)",

    textAlign: "center",

    marginBottom: 10,

    letterSpacing: 0.4,
  },

  //
  // 🌙 ARCHETYPE
  //

  archetype: {
    color:
      "rgba(255,255,255,0.30)",

    fontSize: 9,

    textTransform:
      "uppercase",

    letterSpacing: 2.5,

    marginBottom: 16,
  },

  //
  // 🌌 MESSAGE
  //

  message: {
    fontSize: 12,

    color:
      Colors.softText,

    textAlign: "center",

    lineHeight: 22,

    paddingHorizontal: 4,

    maxWidth: 145,
  },

  //
  // 🌈 SIGNATURE
  //

  signature: {
    alignSelf: "center",

    width: 40,
    height: 1,

    borderRadius: 999,

    backgroundColor:
      "rgba(255,255,255,0.18)",

    opacity: 0.9,
  },
});