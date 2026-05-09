// components/connections/UnityConsciousnessNode.tsx

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
    Group,
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

export default function UnityConsciousnessNode({
  x,
  y,
}: Props) {

  const scale =
    useSharedValue(1);

  const drift =
    useSharedValue(0);

  const rotate =
    useSharedValue(0);

  // ✨ activation

  const pressScale =
    useSharedValue(1);

  const glowOpacity =
    useSharedValue(0.92);

  const auraScale =
    useSharedValue(1);

  useEffect(() => {

    // 🌊 breathing

    scale.value =
      withRepeat(
        withSequence(

          withTiming(1.012, {
            duration: 9000,

            easing:
              Easing.inOut(
                Easing.ease
              ),
          }),

          withTiming(1, {
            duration: 9000,

            easing:
              Easing.inOut(
                Easing.ease
              ),
          }),
        ),

        -1,
        true
      );

    // ✨ drift

    drift.value =
      withRepeat(
        withSequence(

          withTiming(-4, {
            duration: 7000,
          }),

          withTiming(4, {
            duration: 7000,
          }),
        ),

        -1,
        true
      );

    // ✨ slow rotation

    rotate.value =
      withRepeat(
        withTiming(360, {
          duration: 90000,

          easing:
            Easing.linear,
        }),

        -1
      );

    // ✨ pulse

    glowOpacity.value =
      withRepeat(
        withSequence(

          withTiming(1, {
            duration: 5000,
          }),

          withTiming(0.84, {
            duration: 5000,
          }),
        ),

        -1,
        true
      );

  }, []);

  // ✨ stable touch layer

  const animatedStyle =
    useAnimatedStyle(() => {

      return {

        opacity:
          glowOpacity.value,

        transform: [

          {
            translateY:
              drift.value,
          },

          {
            scale:
              scale.value *
              pressScale.value,
          },
        ],
      };
    });

  // ✨ rotating geometry only

  const canvasStyle =
    useAnimatedStyle(() => {

      return {

        transform: [

          {
            scale:
              auraScale.value,
          },

          {
            rotate:
              `${rotate.value}deg`,
          },
        ],
      };
    });

  return (
    <AnimatedPressable

      onPress={() => {

        // ✨ awaken node

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

        // ✨ enter resonance

        setTimeout(() => {

          router.push({
            pathname:
              "/connections/circle-space",

            params: {
              type:
                "unity",
            },
          });

        }, 820);

        // ✨ restore field
        // after navigation

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
            r={72}

            style="stroke"
            strokeWidth={1.2}

            color="rgba(255,255,255,0.28)"
          />

          {/* ✨ INNER ORBIT */}

          <Circle
            cx={CENTER}
            cy={CENTER}
            r={54}

            style="stroke"
            strokeWidth={1}

            color="rgba(255,255,255,0.20)"
          />

          {/* ✨ SACRED GEOMETRY */}

          <Group>

            <Path
              path="
                M90 30
                L90 150
              "

              style="stroke"
              strokeWidth={1}

              color="rgba(255,255,255,0.24)"
            />

            <Path
              path="
                M30 90
                L150 90
              "

              style="stroke"
              strokeWidth={1}

              color="rgba(255,255,255,0.24)"
            />

            <Path
              path="
                M48 48
                L132 132
              "

              style="stroke"
              strokeWidth={0.8}

              color="rgba(255,255,255,0.18)"
            />

            <Path
              path="
                M132 48
                L48 132
              "

              style="stroke"
              strokeWidth={0.8}

              color="rgba(255,255,255,0.18)"
            />

            <Circle
              cx={CENTER}
              cy={CENTER}
              r={36}

              style="stroke"
              strokeWidth={1.4}

              color="rgba(255,255,255,0.34)"
            />

            <Circle
              cx={CENTER}
              cy={CENTER}
              r={18}

              style="stroke"
              strokeWidth={1}

              color="rgba(255,255,255,0.24)"
            />

          </Group>

          {/* ✨ SATELLITE STARS */}

          <Circle
            cx={90}
            cy={18}
            r={1.6}
            color="white"
          />

          <Circle
            cx={162}
            cy={90}
            r={1.6}
            color="white"
          />

          <Circle
            cx={90}
            cy={162}
            r={1.6}
            color="white"
          />

          <Circle
            cx={18}
            cy={90}
            r={1.6}
            color="white"
          />

          {/* ✨ CORE */}

          <Circle
            cx={CENTER}
            cy={CENTER}
            r={5}
            color="white"
          />

        </Canvas>

      </AnimatedView>

    </AnimatedPressable>
  );
}