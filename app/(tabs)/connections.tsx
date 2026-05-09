import React, { useEffect, useRef } from "react";

import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";

import {
  initUser,
} from "../../lib/user";

export default function ConnectionsPortal() {

  // 🌊 pulses
  const pulse1 =
    useRef(new Animated.Value(0)).current;

  const pulse2 =
    useRef(new Animated.Value(0)).current;

  const pulse3 =
    useRef(new Animated.Value(0)).current;

  // 🌍 earth rotation
  const rotation =
    useRef(new Animated.Value(0)).current;

  useEffect(() => {

    const createPulse = (
      anim: Animated.Value,
      delay: number
    ) => {

      Animated.loop(

        Animated.sequence([

          Animated.delay(delay),

          Animated.timing(anim, {
            toValue: 1,
            duration: 5000,

            easing: Easing.out(
              Easing.ease
            ),

            useNativeDriver: true,
          }),

          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])

      ).start();
    };

    createPulse(pulse1, 0);
    createPulse(pulse2, 1600);
    createPulse(pulse3, 3200);

    // 🌍 slow earth rotation
    Animated.loop(

      Animated.timing(rotation, {
        toValue: 1,
        duration: 90000,

        easing: Easing.linear,

        useNativeDriver: true,
      })

    ).start();

  }, []);

  const rotateInterpolate =
    rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

const handleEnter = async () => {

  try {

    console.log(
      "🌍 ENTER CONNECTIONS"
    );

    //
    // 👤 ENSURE USER EXISTS
    //

    const userId =
      await initUser();

    console.log(
      "👤 ACTIVE USER:",
      userId
    );

    //
    // 🌌 ENTER FIELD
    //

    router.push(
      "/connections/field"
    );

  } catch (error) {

    console.log(
      "❌ CONNECTIONS ENTRY ERROR",
      error
    );
  }
};

  const renderPulse = (
    anim: Animated.Value,
    opacity: number
  ) => (
    <Animated.View
      style={[
        styles.pulse,

        {
          opacity:
            anim.interpolate({
              inputRange: [0, 0.2, 1],

              outputRange: [
                0,
                opacity,
                0,
              ],
            }),

          transform: [
            {
              scale:
                anim.interpolate({
                  inputRange: [0, 1],

                  outputRange: [
                    1,
                    4.5,
                  ],
                }),
            },
          ],
        },
      ]}
    />
  );

  return (
    <View style={styles.container}>

      {/* 🌊 FREQUENCY RINGS */}
      {renderPulse(pulse1, 0.35)}
      {renderPulse(pulse2, 0.25)}
      {renderPulse(pulse3, 0.18)}

      {/* 🌍 CENTER */}
      <View style={styles.centerWrap}>

        {/* 🌍 rotating earth */}
        <Animated.Image
          source={{
            uri:
              "https://upload.wikimedia.org/wikipedia/commons/6/6f/Earth_Eastern_Hemisphere.jpg",
          }}
          style={[
            styles.earth,

            {
              transform: [
                {
                  rotate:
                    rotateInterpolate,
                },
              ],
            },
          ]}
        />

        {/* ✦ DIAMOND */}
        <Pressable
          style={styles.diamondWrap}
          onPress={handleEnter}
        >
          <Text style={styles.diamond}>
            ✦
          </Text>
        </Pressable>

        {/* ✨ YNWA */}
        <Text style={styles.ynwa}>
          YNWA
        </Text>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,

    backgroundColor: "black",

    justifyContent: "center",
    alignItems: "center",
  },

  centerWrap: {
    alignItems: "center",
    marginTop: -80,
  },

  // 🌍 earth
  earth: {
    width: 180,
    height: 180,

    borderRadius: 90,

    zIndex: 10,
  },

  // 🌊 frequency rings
  pulse: {
    position: "absolute",

    width: 220,
    height: 220,

    borderRadius: 999,

    borderWidth: 2,

    borderColor:
      "rgba(255,255,255,0.45)",
  },

  // ✦ diamond
  diamondWrap: {
    marginTop: 26,
  },

  diamond: {
    color:
      "rgba(255,255,255,0.9)",

    fontSize: 24,
  },

  // ✨ ynwa
  ynwa: {
    color:
      "rgba(255,255,255,0.45)",

    marginTop: 18,

    letterSpacing: 4,

    fontSize: 11,
  },
});