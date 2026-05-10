import React, {
  useEffect,
} from "react";

import {
  Pressable,
  View,
} from "react-native";

import {
  Canvas,
  Circle,
  Path,
} from "@shopify/react-native-skia";

import {
  router,
} from "expo-router";

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type Props = {
  x: number;
  y: number;

  //
  // ✨ DECORATIVE MODE
  //

  interactive?: boolean;
};

const SIZE = 180;
const CENTER = 90;

const AnimatedPressable =
  Animated.createAnimatedComponent(
    Pressable
  );

const AnimatedView =
  Animated.createAnimatedComponent(
    View
  );

export default function LoveNode({
  x,
  y,

  interactive = true,
}: Props) {

  //
  // 🌊 BREATHING
  //

  const scale =
    useSharedValue(1);

  //
  // ✨ MOVEMENT
  //

  const driftY =
    useSharedValue(0);

  const driftX =
    useSharedValue(0);

  //
  // ✨ ACTIVATION
  //

  const pressScale =
    useSharedValue(1);

  const auraScale =
    useSharedValue(1);

  //
  // ✨ FIELD GLOW
  //

  const glowOpacity =
    useSharedValue(0.92);

  useEffect(() => {

    //
    // 🌊 BREATHING PULSE
    //

    scale.value =
      withRepeat(
        withSequence(

          withTiming(1.018, {
            duration: 5000,

            easing:
              Easing.inOut(
                Easing.ease
              ),
          }),

          withTiming(1, {
            duration: 5000,

            easing:
              Easing.inOut(
                Easing.ease
              ),
          }),
        ),

        -1,
        true
      );

    //
    // ✨ VERTICAL MOVEMENT
    //

    driftY.value =
      withRepeat(
        withSequence(

          withTiming(-5, {
            duration: 5000,
          }),

          withTiming(5, {
            duration: 5000,
          }),
        ),

        -1,
        true
      );

    //
    // ✨ HORIZONTAL MOVEMENT
    //

    driftX.value =
      withRepeat(
        withSequence(

          withTiming(2, {
            duration: 5200,
          }),

          withTiming(-2, {
            duration: 4600,
          }),

          withTiming(1, {
            duration: 3800,
          }),
        ),

        -1,
        true
      );

    //
    // ✨ FIELD PULSE
    //

    glowOpacity.value =
      withRepeat(
        withSequence(

          withTiming(1, {
            duration: 5000,
          }),

          withTiming(0.88, {
            duration: 5000,
          }),
        ),

        -1,
        true
      );

  }, []);

  //
  // ✨ FIELD MOVEMENT
  //

  const animatedStyle =
    useAnimatedStyle(() => {

      return {

        opacity:
          glowOpacity.value,

        transform: [

          {
            translateX:
              driftX.value,
          },

          {
            translateY:
              driftY.value,
          },

          {
            scale:
              scale.value *
              pressScale.value,
          },
        ],
      };
    });

  //
  // ✨ GEOMETRY EXPANSION
  //

  const canvasStyle =
    useAnimatedStyle(() => {

      return {

        transform: [

          {
            scale:
              auraScale.value,
          },
        ],
      };
    });

  return (

    <AnimatedPressable

      disabled={!interactive}

      onPress={() => {

        //
        // ✨ DECORATIVE MODE
        //

        if (!interactive)
          return;

        //
        // ✨ AWAKEN NODE
        //

        pressScale.value =
          withTiming(1.18, {
            duration: 650,

            easing:
              Easing.out(
                Easing.exp
              ),
          });

        auraScale.value =
          withTiming(1.12, {
            duration: 700,

            easing:
              Easing.out(
                Easing.exp
              ),
          });

        glowOpacity.value =
          withTiming(1, {
            duration: 500,
          });

        //
        // ✨ ENTER RESONANCE
        //

        setTimeout(() => {

          router.push({
            pathname:
              "/connections/circle-space",

            params: {
              type:
                "love",
            },
          });

        }, 820);

        //
        // ✨ RESTORE FIELD
        //

        setTimeout(() => {

          pressScale.value =
            withTiming(1, {
              duration: 1200,

              easing:
                Easing.out(
                  Easing.exp
                ),
            });

          auraScale.value =
            withTiming(1, {
              duration: 1200,

              easing:
                Easing.out(
                  Easing.exp
                ),
            });

        }, 1400);

      }}

      style={[
        {
          position: "absolute",

          left:
            x - SIZE / 2,

          top:
            y - SIZE / 2,

          width: SIZE,
          height: SIZE,

          justifyContent:
            "center",

          alignItems:
            "center",
        },

        animatedStyle,
      ]}
    >

      <AnimatedView
        style={canvasStyle}
      >

        <Canvas

          pointerEvents="none"

          style={{
            width: SIZE,
            height: SIZE,
          }}
        >

          {/* ✨ OUTER ORBIT */}

          <Circle
            cx={CENTER}
            cy={CENTER}
            r={68}

            style="stroke"
            strokeWidth={1.2}

            color="rgba(255,255,255,0.24)"
          />

          {/* ✨ INNER ORBIT */}

          <Circle
            cx={CENTER}
            cy={CENTER}
            r={48}

            style="stroke"
            strokeWidth={1}

            color="rgba(255,255,255,0.18)"
          />

          {/* ✨ VESICA */}

          <Circle
            cx={72}
            cy={90}
            r={28}

            style="stroke"
            strokeWidth={1.3}

            color="rgba(255,255,255,0.34)"
          />

          <Circle
            cx={108}
            cy={90}
            r={28}

            style="stroke"
            strokeWidth={1.3}

            color="rgba(255,255,255,0.34)"
          />

          {/* ✨ INNER WARMTH */}

          <Circle
            cx={CENTER}
            cy={CENTER}
            r={10}

            color="rgba(216,166,255,0.08)"
          />

          {/* ✨ INNER RING */}

          <Circle
            cx={CENTER}
            cy={CENTER}
            r={16}

            style="stroke"
            strokeWidth={1}

            color="rgba(255,255,255,0.22)"
          />

          {/* ✨ AXIS */}

          <Path
            path="
              M90 40
              L90 140
            "

            style="stroke"
            strokeWidth={0.9}

            color="rgba(255,255,255,0.18)"
          />

          {/* ✨ CORE */}

          <Circle
            cx={CENTER}
            cy={CENTER}
            r={4.5}

            color="white"
          />

        </Canvas>

      </AnimatedView>

    </AnimatedPressable>
  );
}