
import React, { useEffect, useRef } from "react";

import {
    Animated,
    Easing,
    Text,
    View,
} from "react-native";

import { Fonts } from "../../constants/theme";

export default function GuideTransmission({
  role = "guide",
  guideName = "Guide",
  text = "",
  isThinking = false,
}: any) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(6)).current;
  const breathing = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(6);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 900,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [text]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathing, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breathing, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => loop.stop();
  }, []);

  if (isThinking && role === "guide") {
    return (
      <View style={styles.thinking}>
        <Animated.Text
          style={[
            styles.thinkingText,
            {
              opacity: breathing.interpolate({
                inputRange: [0, 1],
                outputRange: [0.25, 0.65],
              }),
            },
          ]}
        >
          ...
        </Animated.Text>
      </View>
    );
  }

  if (!text?.trim()) return null;

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          width: "100%",
          alignItems: "center",
          opacity,
          transform: [{ translateY }],
        }}
      >
        {role === "user" ? (
          <Text style={styles.userText}>{text}</Text>
        ) : (
          <>
            <View style={styles.guideHeader}>
              <View style={styles.divider} />

              <Text style={styles.guideName}>
                {guideName}
              </Text>
            </View>

            <Text style={styles.guideText}>
              {text}
            </Text>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = {
  container: {
    width: "100%" as const,
    alignItems: "center" as const,
    paddingTop: 8,
    paddingBottom: 12,
  },
  guideHeader: {
    alignItems: "center" as const,
    marginBottom: 12,
  },
  divider: {
    width: 54,
    height: 1,
    backgroundColor: "rgba(201,173,112,0.22)",
    marginBottom: 8,
  },
  guideName: {
    color: "rgba(220,205,180,0.55)",
    fontFamily: Fonts.light,
    fontSize: 9,
    letterSpacing: 1.3,
    textTransform: "uppercase" as const,
  },
  guideText: {
    width: "88%" as const,
    color: "rgba(255,255,255,0.88)",
    fontFamily: Fonts.light,
    fontSize: 10,
    lineHeight: 20,
    textAlign: "center" as const,
    letterSpacing: 0.1,
  },
  userText: {
    width: "82%" as const,
    color: "rgba(255,255,255,0.48)",
    fontFamily: Fonts.light,
    fontSize: 10,
    lineHeight: 17,
    textAlign: "right" as const,
    alignSelf: "flex-end" as const,
    marginBottom: 14,
  },
  thinking: {
    width: "100%" as const,
    alignItems: "center" as const,
    paddingVertical: 12,
  },
  thinkingText: {
    color: "rgba(255,255,255,0.5)",
    fontFamily: Fonts.light,
    fontSize: 11,
    letterSpacing: 2,
  },
};
