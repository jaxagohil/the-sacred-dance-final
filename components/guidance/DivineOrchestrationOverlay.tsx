// guidance/DivineOrchestrationOverlay.tsx

import React, {
  useEffect,
  useRef
} from "react";

import {
  Animated,
  Easing,
  View,
} from "react-native";

import {
  Colors,
} from "../../constants/theme";

import FloatingWhispers from "./FloatingWhispers";

import OrchestrationFragments from "./OrchestrationFragments";

/*
 * --------------------------------------------------------
 * 🌌 STAR POSITIONS
 * --------------------------------------------------------
 */

const stars = [

  {
    id: "1",

    top: 34,
    left: 80,

    size: 2,

    depth: 0.7,
  },

  {
    id: "2",

    top: 62,
    right: 52,

    size: 3,

    depth: 1,
  },

  {
    id: "3",

    top: 120,
    left: 34,

    size: 2,

    depth: 0.5,
  },

  {
    id: "4",

    top: 180,
    right: 90,

    size: 2,

    depth: 0.85,
  },

  {
    id: "5",

    top: 210,
    left: 120,

    size: 1.5,

    depth: 0.45,
  },
];

export default function DivineOrchestrationOverlay({

  field,

}: any) {

  /*
   * --------------------------------------------------------
   * 🌌 FIELD STATES
   * --------------------------------------------------------
   */

  const showWhispers =

    field?.whispers?.length > 0;

  const showFragments =

    field?.fragments?.length > 0;

  /*
   * --------------------------------------------------------
   * 🌊 FIELD INTENSITY
   * --------------------------------------------------------
   */

  const fieldIntensity =

    field?.fieldIntensity
      || 0.5;

  /*
   * --------------------------------------------------------
   * 🌫️ FIELD ATMOSPHERE
   * --------------------------------------------------------
   */

  const atmosphere =

    field?.fieldAtmosphere
      || "quiet";

  /*
   * --------------------------------------------------------
   * 🌌 STAR OPACITY
   * --------------------------------------------------------
   */

  const starOpacity =

    0.24 + (
      fieldIntensity * 0.6
    );

  /*
   * --------------------------------------------------------
   * 🌊 COSMIC BREATHING
   * --------------------------------------------------------
   */

  const breathing =
    useRef(

      new Animated.Value(0)

    ).current;

  /*
   * --------------------------------------------------------
   * ✨ START FIELD BREATHING
   * --------------------------------------------------------
   */

  useEffect(() => {

    Animated.loop(

      Animated.sequence([

        Animated.timing(
          breathing,

          {

            toValue: 1,

            duration: 5200,

            easing:
              Easing.inOut(
                Easing.sin
              ),

            useNativeDriver: true,
          }
        ),

        Animated.timing(
          breathing,

          {

            toValue: 0,

            duration: 5200,

            easing:
              Easing.inOut(
                Easing.sin
              ),

            useNativeDriver: true,
          }
        ),
      ])

    ).start();

  }, []);

  /*
   * --------------------------------------------------------
   * 🌌 FIELD GLOW
   * --------------------------------------------------------
   */

  const glowOpacity =

    breathing.interpolate({

      inputRange: [0, 1],

      outputRange:

        atmosphere ===
        "symbolic"

          ? [0.04, 0.12]

          : [0.02, 0.07],
    });

  /*
   * --------------------------------------------------------
   * 🌊 STAR DRIFT
   * --------------------------------------------------------
   */

  const starDrift =

    breathing.interpolate({

      inputRange: [0, 1],

      outputRange: [-2, 2],
    });

  /*
   * --------------------------------------------------------
   * 🌌 RENDER
   * --------------------------------------------------------
   */

  return (

    <View
      style={{

        height: 280,

        position: "relative",

        overflow: "hidden",

        borderBottomWidth: 1,

        borderBottomColor:
          Colors.border,

        backgroundColor:
          Colors.background,
      }}
    >

      {/* ------------------------------------------------ */}
      {/* 🌫️ FIELD BREATH */}
      {/* ------------------------------------------------ */}

      <Animated.View
        style={{

          position: "absolute",

          top: -80,
          left: -40,

          width: 360,
          height: 360,

          borderRadius: 999,

          backgroundColor:
            Colors.fieldGlow,

          opacity:
            glowOpacity,

          transform: [
            {
              scale:

                breathing.interpolate({

                  inputRange: [0, 1],

                  outputRange:
                    [0.96, 1.06],
                }),
            },
          ],
        }}
      />

      {/* ------------------------------------------------ */}
      {/* ✨ STAR FIELD */}
      {/* ------------------------------------------------ */}

      {stars.map((star) => (

        <Animated.View
          key={star.id}
          style={{

            position: "absolute",

            top: star.top,

            left: star.left,

            right: star.right,

            width: star.size,

            height: star.size,

            borderRadius: 999,

            backgroundColor:

              `rgba(255,255,255,${
                starOpacity
                * star.depth
              })`,

            transform: [

              {
                translateY:

                  Animated.multiply(

                    starDrift,

                    star.depth
                  ),
              },
            ],
          }}
        />

      ))}

      {/* ------------------------------------------------ */}
      {/* 🌊 FLOATING FIELD */}
      {/* ------------------------------------------------ */}

      {showWhispers && (

        <View
          style={{
            position: "absolute",

            width: "100%",
            height: "100%",
          }}
        >

          <FloatingWhispers
            whispers={
              field.whispers
            }

            intensity={
              fieldIntensity
            }

            atmosphere={
              atmosphere
            }
          />

        </View>
      )}

      {/* ------------------------------------------------ */}
      {/* ✨ ORCHESTRATION */}
      {/* ------------------------------------------------ */}

      {showFragments && (

        <View
          style={{

            flex: 1,

            justifyContent: "center",

            alignItems: "center",

            paddingTop: 18,

            zIndex: 20,
          }}
        >

          <OrchestrationFragments
            fragments={
              field.fragments
            }

            atmosphere={
              atmosphere
            }

            intensity={
              fieldIntensity
            }
          />

        </View>
      )}

    </View>
  );
}