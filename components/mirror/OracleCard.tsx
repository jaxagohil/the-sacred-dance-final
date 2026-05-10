import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {

  number?: number;

  title: string;

  message: string;

  colour?: string;
};

//
// 🌈 COLOUR MAP
// supports DB values like:
// gold / pink / blue / copper
//

const colourMap: Record<string, string> = {

  gold: "#D4AF37",

  pink: "#EC4899",

  blue: "#60A5FA",

  copper: "#B87333",

  black: "#999999",
};

export default function OracleCard({

  number,

  title,

  message,

  colour = "gold",

}: Props) {

  //
  // ✨ REAL COLOUR
  //

  const actualColour =
    colourMap[colour.toLowerCase()]
    || colour;

  return (

    <View style={styles.wrapper}>

      {/* 🌫 FIELD */}

      <View
        style={[
          styles.aura,

          {
            backgroundColor:
              actualColour,
          },
        ]}
      />

      {/* 🃏 CARD */}

      <View
        style={[
          styles.card,

          {
            borderColor:
              `${actualColour}55`,
          },
        ]}
      >

        {/* ✨ TOP SIGNATURE */}

        <View
          style={[
            styles.topLine,

            {
              backgroundColor:
                actualColour,
            },
          ]}
        />

        {/* 🌌 CONTENT */}

        <View style={styles.content}>

          {/* 🔢 NUMBER */}

          {number !== undefined && (

            <Text style={styles.number}>
              {number}
            </Text>
          )}

          {/* ✨ TITLE */}

          <Text
            style={[
              styles.title,

              {
                color:
                  actualColour,
              },
            ]}
          >
            {title}
          </Text>

          {/* ✧ SYMBOL */}

          <Text
            style={[
              styles.symbol,

              {
                color:
                  actualColour,
              },
            ]}
          >
            ✦
          </Text>

          {/* 🌙 MESSAGE */}

          <Text style={styles.message}>
            {message}
          </Text>

        </View>

        {/* 🌈 SIGNATURE */}

        <View
          style={[
            styles.signature,

            {
              backgroundColor:
                actualColour,
            },
          ]}
        />

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
    alignItems: "center",
    justifyContent: "center",
  },

  //
  // 🌫 FIELD
  //

  aura: {
    position: "absolute",

    width: 250,
    height: 380,

    borderRadius: 46,

    opacity: 0.08,

    transform: [
      {
        scale: 1.04,
      },
    ],
  },

  //
  // 🃏 CARD
  //

  card: {

    width: 230,
    height: 370,

    borderRadius: 36,

    backgroundColor:
      "rgba(4,4,6,0.96)",

    borderWidth: 1.2,

    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 26,

    justifyContent:
      "space-between",

    overflow: "hidden",

    shadowColor:
      "#000",

    shadowOpacity: 0.18,

    shadowRadius: 24,

    shadowOffset: {
      width: 0,
      height: 10,
    },

    elevation: 5,
  },

  //
  // ✨ TOP LINE
  //

  topLine: {
    alignSelf: "center",

    width: 36,
    height: 1.5,

    borderRadius: 999,

    opacity: 0.9,

    marginBottom: 24,
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
    fontSize: 11,

    color:
      "rgba(255,255,255,0.24)",

    letterSpacing: 4,

    marginBottom: 15,
  },

  //
  // ✨ TITLE
  //

  title: {
    fontSize: 16,

    textTransform:
      "uppercase",

    letterSpacing: 4,

    textAlign: "center",

    marginBottom: 40,

    opacity: 0.92,
  },

  //
  // ✧ SYMBOL
  //

  symbol: {
    fontSize: 12,

    opacity: 0.85,

    marginBottom: 20,
  },

  //
  // 🌙 MESSAGE
  //

  message: {
    fontSize: 14,

    color:
      "rgba(255,255,255,0.72)",

    textAlign: "center",

    lineHeight: 26,

    maxWidth: 160,
        marginBottom: 100,
  },

  //
  // 🌈 SIGNATURE
  //

  signature: {
    alignSelf: "center",

    width: 60,
    height: 1.5,

    borderRadius: 999,

    opacity: 0.9,
  },
});