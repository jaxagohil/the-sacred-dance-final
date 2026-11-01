
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    View,
} from "react-native";

type Percent = `${number}%`;

type Whisper = {
  text: string;
  source?: string;
};

const positions: { left: Percent; top: number }[] = [
  { left: "16%", top: 8 },
  { left: "35%", top: 48 },
  { left: "57%", top: 12 },
  { left: "73%", top: 43 },
  { left: "88%", top: 10 },
  { left: "46%", top: 35 },
  { left: "25%", top: 32 },
];

const sparkles: {
  left: Percent;
  top: number;
  size: number;
  symbol: string;
}[] = [
  { left: "8%", top: 18, size: 13, symbol: "✦" },
  { left: "19%", top: 52, size: 8, symbol: "·" },
  { left: "31%", top: 12, size: 17, symbol: "✧" },
  { left: "43%", top: 57, size: 10, symbol: "✶" },
  { left: "56%", top: 8, size: 7, symbol: "·" },
  { left: "67%", top: 42, size: 15, symbol: "✦" },
  { left: "79%", top: 15, size: 9, symbol: "✧" },
  { left: "91%", top: 53, size: 13, symbol: "✶" },
  { left: "49%", top: 34, size: 6, symbol: "·" },
  { left: "25%", top: 34, size: 11, symbol: "✦" },
];

function WhisperSign({ text, index }: { text: string; index: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;
  const [position, setPosition] = useState(
    positions[index % positions.length]
  );

  useEffect(() => {
    let active = true;

    const showWhisper = () => {
      if (!active) return;

      opacity.setValue(0);
      drift.setValue(0);

      setPosition(
        positions[Math.floor(Math.random() * positions.length)]
      );

      Animated.sequence([
        Animated.delay(index * 1800),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.65,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(drift, {
            toValue: -7,
            duration: 5000,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(1800),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished && active) {
          showWhisper();
        }
      });
    };

    showWhisper();

    return () => {
      active = false;
      opacity.stopAnimation();
      drift.stopAnimation();
    };
  }, [index, opacity, drift]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.whisper,
        position,
        {
          opacity,
          transform: [{ translateY: drift }],
        },
      ]}
    >
      <Text style={styles.whisperText}>{text}</Text>
    </Animated.View>
  );
}

function Twinkle({
  left,
  top,
  size,
  symbol,
  index,
}: {
  left: Percent;
  top: number;
  size: number;
  symbol: string;
  index: number;
}) {
  const opacity = useRef(new Animated.Value(0.15)).current;
  const scale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(index * 350),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.85,
            duration: 1300 + index * 100,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1.25,
            duration: 1300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.12,
            duration: 1700,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.7,
            duration: 1700,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [index, opacity, scale]);

  return (
    <Animated.Text
      pointerEvents="none"
      style={[
        styles.sparkle,
        {
          left,
          top,
          fontSize: size,
          opacity,
          transform: [{ scale }],
        },
      ]}
    >
      {symbol}
    </Animated.Text>
  );
}

export default function FloatingWhispers({
  whispers = [],
}: {
  whispers?: Whisper[];
}) {
  return (
    <View pointerEvents="none" style={styles.field}>
      {sparkles.map((sparkle, index) => (
        <Twinkle key={index} {...sparkle} index={index} />
      ))}

      {whispers.slice(0, 3).map((whisper, index) => (
        <WhisperSign
          key={`${whisper.text}_${index}`}
          text={whisper.text}
          index={index}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    zIndex: 0,
  },

sparkle: {
  position: "absolute",
  color: "#E8D5A5",
  textShadowColor: "#C7A8FF",
  textShadowRadius: 12,
  textShadowOffset: { width: 0, height: 0 },
},
  whisper: {
    position: "absolute",
  },
  whisperText: {
    color: "#D9C8F0",
    fontSize: 13,
    textShadowColor: "#B99BE8",
    textShadowRadius: 12,
  },
});
