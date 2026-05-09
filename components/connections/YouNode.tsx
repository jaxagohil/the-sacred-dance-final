// components/connections/YouNode.tsx

import React, {
  useEffect,
} from "react";

import {
  Image,
  Pressable,
  View,
} from "react-native";

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

  avatar?: string;

  visible?: boolean;
};

const SIZE = 72;

const AnimatedPressable =
  Animated.createAnimatedComponent(
    Pressable
  );

const AnimatedImage =
  Animated.createAnimatedComponent(
    Image
  );

export default function YouNode({
  x,
  y,
  avatar,
  visible = false,
}: Props) {

  console.log(
    "👤 YOU NODE AVATAR:",
    avatar
  );

  // ✨ field opacity

  const opacity =
    useSharedValue(0);

  // 👤 avatar opacity

  const avatarOpacity =
    useSharedValue(0);

  // 🌊 breathing

  const scale =
    useSharedValue(0.96);

  // ✨ soft floating

  const driftY =
    useSharedValue(0);

  // ✨ activation

  const pressScale =
    useSharedValue(1);

  const glowOpacity =
    useSharedValue(0.92);

  // 🌌 appear / disappear

  useEffect(() => {

    opacity.value =
      withTiming(
        visible ? 1 : 0,
        {
          duration: 3000,

          easing:
            Easing.inOut(
              Easing.ease
            ),
        }
      );

    avatarOpacity.value =
      withTiming(
        visible ? 1 : 0,
        {
          duration: 3000,

          easing:
            Easing.inOut(
              Easing.ease
            ),
        }
      );

    scale.value =
      withTiming(
        visible ? 1 : 0.94,
        {
          duration: 3000,

          easing:
            Easing.inOut(
              Easing.ease
            ),
        }
      );

  }, [visible]);

  // 🌊 living movement

  useEffect(() => {

    // breathing

    scale.value =
      withRepeat(
        withSequence(

          withTiming(1.02, {
            duration: 4000,

            easing:
              Easing.inOut(
                Easing.ease
              ),
          }),

          withTiming(1, {
            duration: 4000,

            easing:
              Easing.inOut(
                Easing.ease
              ),
          }),
        ),

        -1,
        true
      );

    // imperfect drift

    driftY.value =
      withRepeat(
        withSequence(

          withTiming(-3, {
            duration: 5000,
          }),

          withTiming(2, {
            duration: 4200,
          }),

          withTiming(-1, {
            duration: 3800,
          }),
        ),

        -1,
        true
      );

    // ✨ subtle pulse

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

  // ✨ stable field

  const animatedStyle =
    useAnimatedStyle(() => {

      return {

        opacity:
          opacity.value *
          glowOpacity.value,

        transform: [

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

  const avatarStyle =
    useAnimatedStyle(() => {

      return {

        opacity:
          avatarOpacity.value,
      };
    });

  return (
    <AnimatedPressable

      onPress={() => {

        // ✨ awaken node

        pressScale.value =
          withTiming(1.16, {
            duration: 650,

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

          router.push(
            "/connections/you-space"
          );

        }, 820);

        // ✨ restore field

        setTimeout(() => {

          pressScale.value =
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

          zIndex: 100,

          shadowColor: "#fff",

          shadowOpacity: 0.18,

          shadowRadius: 16,

          shadowOffset: {
            width: 0,
            height: 0,
          },
        },

        animatedStyle,
      ]}
    >

      {/* ✨ AURA */}

      <View
        style={{
          position: "absolute",

          width: SIZE + 18,
          height: SIZE + 18,

          borderRadius: 999,

          backgroundColor:
            "rgba(255,255,255,0.035)",
        }}
      />

      {/* 👤 USER AVATAR */}

      <View
        style={{
          width: SIZE,
          height: SIZE,

          borderRadius:
            SIZE / 2,

          overflow: "hidden",

          borderWidth: 1.5,

          borderColor:
            "rgba(255,255,255,0.18)",

          backgroundColor:
            "rgba(255,255,255,0.05)",
        }}
      >

        {avatar ? (

          <AnimatedImage
            source={{ uri: avatar }}

            resizeMode="cover"

            style={[
              {
                width: "100%",
                height: "100%",
              },

              avatarStyle,
            ]}

            onError={(e) =>
              console.log(
                "❌ IMAGE ERROR:",
                e.nativeEvent
              )
            }
          />

        ) : (

          <View
            style={{
              flex: 1,

              backgroundColor:
                "rgba(255,255,255,0.08)",
            }}
          />

        )}

      </View>

    </AnimatedPressable>
  );
}