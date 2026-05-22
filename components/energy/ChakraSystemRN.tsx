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

  chakraManifestations?: Record<
  Chakra,
  any[]
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

  chakraManifestations,

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

  if (value <= -0.6) {
    return "contracted";
  }

  if (value <= -0.2) {
    return "underactive";
  }

  if (value < 0.2) {
    return "balanced";
  }

  if (value < 0.6) {
    return "activated";
  }

  return "overactive";
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

const manifestations =

  chakraManifestations?.[
    key
  ] || [];

const hasMessage =

  manifestations.some(
    (m: any) =>

      m?.body_response ||
      m?.wound_expression ||
      m?.relational_expression ||
      m?.reflective_prompt ||
      m?.integration_path
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

          // --------------------------------------------------
          // 🌈 RING
          // --------------------------------------------------

let ringColor =
  "transparent";

if (hasMessage) {

  ringColor =
    "rgba(220,220,220,0.55)";
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

  onPress={() => {

    if (!hasMessage) {
      return;
    }

    onChakraPress?.(
      key
    );
  }}

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
  hasMessage ? 4 : 0,

borderColor:
  "rgba(220,220,220,0.5)",

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