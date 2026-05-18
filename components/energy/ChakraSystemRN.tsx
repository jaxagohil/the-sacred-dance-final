// /components/mirror/ChakraSystemRN.tsx

import React from "react";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  chakraColours,
  chakraOrder,
  chakraY,
} from "../../lib/energy";

import type {
  Chakra,
} from "../../lib/energy";

// --------------------------------------------------
// 🧠 TYPES
// --------------------------------------------------

type Props = {

  awareness?: Chakra;

  scores?: Record<
    Chakra,
    {
      score: number;
    }
  >;

  selectedChakra?:
    Chakra | null;

  onChakraPress?: (
    chakra: Chakra
  ) => void;

  bodyResponse?: string;
};

// --------------------------------------------------
// 🌈 CHAKRA SYSTEM RN
// --------------------------------------------------

export default function
ChakraSystemRN({

  awareness,

  scores,

  selectedChakra,

  onChakraPress,

  bodyResponse,

}: Props) {

  // --------------------------------------------------
  // 🌊 AVERAGE
  // --------------------------------------------------

  const avg =

    scores

      ? Object.values(
          scores
        ).reduce(
          (a, b) =>
            a + b.score,
          0
        ) /

        Object.keys(scores)
          .length

      : 1 /
        chakraOrder.length;

  // --------------------------------------------------
  // 🧠 STATE
  // --------------------------------------------------

  const getState = (
    value: number
  ) => {

    if (
      value <
      avg * 0.6
    ) {

      return "low";
    }

    if (
      value >
      avg * 1.4
    ) {

      return "high";
    }

    return "balanced";
  };

  // --------------------------------------------------
  // 🌌 RENDER
  // --------------------------------------------------

  return (

    <View style={styles.container}>

      {chakraOrder.map(
        (key) => {

          const chakra =
            scores?.[key];

          const value =

            chakra?.score ??
            avg;

          const state =
            getState(
              value
            );

          const isActive =
            awareness === key;

          const isSelected =
            selectedChakra ===
            key;

          const y =
            chakraY[key] ?? 0;

          // --------------------------------------------------
          // 🌈 COLOUR
          // --------------------------------------------------

          const baseColor =

            key === "heart"

              ? "#0d9f34"

              : chakraColours[
                  key
                ] ?? "#999";

          // --------------------------------------------------
          // 🌊 SIZE
          // --------------------------------------------------

const size =

  key === "heart"

    ? 20

    : 12;

          // --------------------------------------------------
          // 🌑 OPACITY
          // --------------------------------------------------

          let opacity = 0.95;

          if (
            state === "low"
          ) {

            opacity = 0.75;
          }

          // --------------------------------------------------
          // 🌈 NODE
          // --------------------------------------------------

          return (

<View

  key={key}

  style={[

    styles.nodeWrapper,

    {
      top: y,
    },
  ]}
>
  {/* 💚 HEART FIELD */}

  {key === "heart" && (

    <Text

      style={{

        position:
          "absolute",

        fontSize: 70,

        color:
          "rgba(220,220,220,0.10)",

        zIndex: 2,

        top: 40,
      }}
    >

      ♡

    </Text>
  )}

              {/* ✨ GLOW */}

<View

  style={[

    styles.glow,

    {

      width: size + 4,

      height: size + 4,

      borderRadius:
        (size + 4) / 2,

      backgroundColor:
        baseColor,

      opacity: 0.12,

      zIndex: 1,
    },
  ]}
/>

{/* 🌟 AWARENESS HALO */}

{isActive && (

  <View

    style={{

      position:
        "absolute",

      width:
        size + 10,

      height:
        size + 10,

      borderRadius:
        (size + 10) / 2,

      borderWidth: 1.5,

      borderColor:
        "rgba(255,240,180,0.55)",

      opacity: 0.9,

      zIndex: 8,
    }}
  />
)}

              {/* 🔘 CORE */}

              {isSelected &&
 bodyResponse && (

  <Pressable

    onPress={() =>
      onChakraPress?.(
        key
      )
    }

    style={{

      position:
        "absolute",

      left:
        size + 18,

      maxWidth: 120,

      backgroundColor:
        "rgba(0,0,0,0.22)",

      padding: 8,

      borderRadius: 12,

      zIndex: 50,
    }}
  >

    <Text

      style={{

        color:
          "white",

        fontSize: 12,

        lineHeight: 18,

        opacity: 0.9,
      }}
    >

      {bodyResponse}

    </Text>

  </Pressable>
)}

<Pressable

  onPress={() =>
    onChakraPress?.(
      key
    )
  }

  hitSlop={20}
>

  <View

    style={[

      styles.core,

    (() => {

let ringColor =
  "transparent";

if (
  state === "low"
) {

  ringColor =
    "rgba(220,220,220,0.30)";
}

if (
  state === "high"
) {

  ringColor =
    "rgba(80,80,80,0.90)";
}

      return {

        width: size,

        height: size,

        borderRadius:
          size / 2,

        backgroundColor:
          baseColor,

borderWidth:

  state ===
  "balanced"

    ? 0

    : 2,

        borderColor:
          ringColor,

        opacity,

        zIndex: 20,

        elevation: 20,

        ...(key ===
        "heart"

          ? {

              shadowColor:
                "#63FF9B",

              shadowOpacity: 0.9,

              shadowRadius: 30,
            }

          : {}),
      };

    })(),

    isSelected &&

      styles.selected,
  ]}
/>

</Pressable>

</View>

          );
        }
      )}
    </View>
  );
}

// --------------------------------------------------
// 🎨 STYLES
// --------------------------------------------------

const styles =
  StyleSheet.create({

    container: {

      position:
        "absolute",

      width: 180,

      height: 520,

      alignItems:
        "center",
    },

    nodeWrapper: {

      position:
        "absolute",

      width: 160,

      height: 160,

      overflow: "visible",

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    glow: {

      position:
        "absolute",
    },

    core: {

      borderWidth: 2,

      borderColor:
        "rgba(255,255,255,0.22)",
    },
  });