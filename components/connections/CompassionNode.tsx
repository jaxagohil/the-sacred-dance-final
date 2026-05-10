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

export default function CompassionNode({
  x,
  y,
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
  // ✨ SACRED ROTATION
  //

  const rotate =
    useSharedValue(0);

  //
  // ✨ GLOW
  //

  const opacity =
    useSharedValue(0.92);

  //
  // ✨ ACTIVATION
  //

  const pressScale =
    useSharedValue(1);

  const auraScale =
    useSharedValue(1);

  useEffect(() => {

    //
    // 🌊 SOFT BREATH
    //

    scale.value =
      withRepeat(
        withSequence(

          withTiming(1.01, {
            duration: 11000,

            easing:
              Easing.inOut(
                Easing.ease
              ),
          }),

          withTiming(1, {
            duration: 11000,

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
    // ✨ VERTICAL DRIFT
    //

    driftY.value =
      withRepeat(
        withSequence(

          withTiming(-3, {
            duration: 9000,
          }),

          withTiming(3, {
            duration: 9000,
          }),
        ),

        -1,
        true
      );

    //
    // ✨ HORIZONTAL DRIFT
    //

    driftX.value =
      withRepeat(
        withSequence(

          withTiming(3, {
            duration: 8500,
          }),

          withTiming(-4, {
            duration: 8200,
          }),

          withTiming(1, {
            duration: 7000,
          }),
        ),

        -1,
        true
      );

    //
    // ✨ SACRED ROTATION
    //

    rotate.value =
      withRepeat(
        withSequence(

          withTiming(0.4, {
            duration: 18000,
          }),

          withTiming(-0.4, {
            duration: 18000,
          }),
        ),

        -1,
        true
      );

    //
    // ✨ PULSE
    //

    opacity.value =
      withRepeat(
        withSequence(

          withTiming(1, {
            duration: 6000,
          }),

          withTiming(0.86, {
            duration: 6000,
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
          opacity.value,

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
            rotate:
              `${rotate.value}deg`,
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

      onPress={() => {

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

        opacity.value =
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
                "compassion",
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
            r={70}

            style="stroke"
            strokeWidth={1.2}

            color="rgba(255,255,255,0.24)"
          />

          {/* ✨ INNER ORBIT */}

          <Circle
            cx={CENTER}
            cy={CENTER}
            r={50}

            style="stroke"
            strokeWidth={1}

            color="rgba(255,255,255,0.18)"
          />

          {/* ✨ LOTUS GEOMETRY */}

          <Group>

            <Path
              path="
                M90 40
                Q60 90 90 140
                Q120 90 90 40
              "

              style="stroke"
              strokeWidth={1.2}

              color="rgba(255,255,255,0.34)"
            />

            <Path
              path="
                M40 90
                Q90 60 140 90
                Q90 120 40 90
              "

              style="stroke"
              strokeWidth={1.1}

              color="rgba(255,255,255,0.28)"
            />

            <Circle
              cx={CENTER}
              cy={CENTER}
              r={24}

              style="stroke"
              strokeWidth={1}

              color="rgba(255,255,255,0.22)"
            />

          </Group>

          {/* ✨ SUBTLE STARS */}

          <Circle
            cx={56}
            cy={64}
            r={1.3}

            color="rgba(255,255,255,0.82)"
          />

          <Circle
            cx={126}
            cy={58}
            r={1.3}

            color="rgba(255,255,255,0.82)"
          />

          <Circle
            cx={132}
            cy={120}
            r={1.3}

            color="rgba(255,255,255,0.82)"
          />

          <Circle
            cx={60}
            cy={130}
            r={1.3}

            color="rgba(255,255,255,0.82)"
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