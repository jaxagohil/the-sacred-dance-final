// components/connections/HumanAvatar.tsx

import React, {
  useEffect,
} from "react";

import {
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";


import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type Props = {
  image?: string;

  x: number;
  y: number;

  size?: number;

  glowColor?: string;

  visible?: boolean;

  humanId?: string;

  onPress?: () => void;
};

const AnimatedPressable =
  Animated.createAnimatedComponent(
    Pressable
  );

const AnimatedImage =
  Animated.createAnimatedComponent(
    Image
  );

export default function HumanAvatar({

  image,

  x,
  y,

  size = 58,

  glowColor =
    "rgba(255,255,255,0.12)",

  visible = false,

  humanId,

  onPress,

}: Props) {

  const glowSize =
    size + 24;

  // ✨ constellation opacity
  const opacity =
    useSharedValue(0.28);

  // 👤 avatar opacity
  const avatarOpacity =
    useSharedValue(0);

  // 🌊 breathing
  const scale =
    useSharedValue(0.96);

  // ✨ floating
  const driftY =
    useSharedValue(0);

  // 🌌 visibility transitions
  useEffect(() => {

    opacity.value =
      withTiming(
        visible ? 1 : 0.28,
        {
          duration: 3200,

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
          duration: 3200,

          easing:
            Easing.inOut(
              Easing.ease
            ),
        }
      );

    scale.value =
      withTiming(
        visible ? 1 : 0.96,
        {
          duration: 3200,

          easing:
            Easing.inOut(
              Easing.ease
            ),
        }
      );

  }, [visible]);

  // 🌊 living movement
  useEffect(() => {

    driftY.value =
      withRepeat(
        withSequence(

          withTiming(-2, {
            duration: 4200,
          }),

          withTiming(2, {
            duration: 4200,
          }),
        ),

        -1,
        true
      );

  }, []);

  const animatedStyle =
    useAnimatedStyle(() => {

      return {

        opacity:
          opacity.value,

        transform: [

          {
            translateY:
              driftY.value,
          },

          {
            scale:
              scale.value,
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

  onPress?.();
}}

      style={[
        {
          position: "absolute",

          left: x,
          top: y,

          justifyContent:
            "center",

          alignItems:
            "center",
        },

        animatedStyle,
      ]}
    >

      {/* ✨ CONSTELLATION PLACEHOLDER */}

      <View
        style={[
          styles.outerGlow,

          {
            width: glowSize + 22,
            height: glowSize + 22,

            borderRadius: 999,

            backgroundColor:
              glowColor,
          },
        ]}
      />

      {/* ✨ INNER FIELD */}

      <View
        style={[
          styles.innerGlow,

          {
            width: glowSize,
            height: glowSize,

            borderRadius: 999,
          },
        ]}
      />

      {/* 👤 HUMAN */}

      {image && (

        <AnimatedImage
          source={{ uri: image }}

          style={[
            {
              width: size,
              height: size,

              borderRadius:
                size / 2,

              borderWidth: 0.5,

              borderColor:
                "rgba(255,255,255,0.75)",
            },

            avatarStyle,
          ]}
        />

      )}

      {/* ✨ PARTICLES */}

      <View
        style={[
          styles.particle,

          {
            left: -6,
            top: 10,
          },
        ]}
      />

      <View
        style={[
          styles.particle,

          {
            right: -4,
            top: 24,

            width: 3,
            height: 3,

            opacity: 0.45,
          },
        ]}
      />

      <View
        style={[
          styles.particle,

          {
            bottom: -4,
            left: 20,

            width: 2,
            height: 2,

            opacity: 0.32,
          },
        ]}
      />

    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({

  outerGlow: {
    position: "absolute",

    opacity: 0.18,
  },

  innerGlow: {
    position: "absolute",

    backgroundColor:
      "black",

    opacity: 0.45,
  },

  particle: {
    position: "absolute",

    width: 4,
    height: 4,

    borderRadius: 999,

    backgroundColor:
      "rgba(255,255,255,0.7)",
  },

});