// /components/mirror/ChakraSystemRN.tsx

import React from "react";

import {
  Pressable,
  StyleSheet,
  View
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

    ? (

        isSelected
          ? 24
          : isActive
            ? 22
            : 20

      )

    : (

        isSelected
          ? 18
          : isActive
            ? 16
            : 12

      );

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
          // 🌈 RING
          // --------------------------------------------------

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

          // --------------------------------------------------
          // 🌌 NODE
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

              {/* ✨ GLOW */}

              <View

                style={[

                  styles.glow,

                  {

                    width:
                      size + 4,

                    height:
                      size + 4,

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

                    borderWidth:
                      1.5,

                    borderColor:
                      "rgba(255,240,180,0.55)",

opacity: 1,

shadowColor:
  "#FFF0C0",

shadowOpacity:
  0.95,

shadowRadius:
  12,

                    zIndex: 8,
                  }}
                />
              )}

              {/* 🔘 CHAKRA */}

<Pressable

  onPress={() =>
    onChakraPress?.(
      key
    )
  }

  hitSlop={20}
>

  <View
    style={{
      justifyContent:
        "center",

      alignItems:
        "center",

      overflow:
        "visible",
    }}
  >

    {/* 🔘 CHAKRA CORE */}

    <View

      style={[

        styles.core,

        {

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

          justifyContent:
            "center",

          alignItems:
            "center",

          ...(key ===
          "heart"

            ? {

                shadowColor:
                  "#63FF9B",

                shadowOpacity:
                  0.9,

                shadowRadius:
                  30,

                borderWidth:
                  2.5,

                borderColor:
                  "rgba(180,255,210,0.55)",
              }

            : {}),
        },

        isSelected && {

          transform: [
            {
              scale: 1.22,
            },
          ],

          shadowColor:

            key === "heart"

              ? "#63FF9B"

              : baseColor,

          shadowOpacity:
            0.9,

          shadowRadius:
            18,

          elevation: 30,

          borderColor:
            "rgba(255,255,255,0.55)",

          borderWidth:
            2.5,
        },
      ]}
    />

  </View>

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

      width: 70,

      height: 430,

      alignItems:
        "center",
    },

    nodeWrapper: {

      position:
        "absolute",

      width: 44,

      height: 44,

      overflow:
        "visible",

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

    selected: {

      transform: [
        {
          scale: 1.08,
        },
      ],
    },
  });