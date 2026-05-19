import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";

export default function EnergyBody() {
  return (
    <View style={styles.container}>
      <Svg
        viewBox="0 0 180 360"
        width={140}
        height={280}
        opacity={0.8}
      >
        {/* HEAD */}
        <Circle
          cx="90"
          cy="50"
          r="22"
          fill="rgba(255,255,255,0.08)"
        />

        {/* BODY CURVE */}
        <Path
          d="M90 90 C65 130, 70 200, 90 235 C110 200, 115 130, 90 90"
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={1.8}
        />

        {/* ♡ HEART FIELD */}

<Path
  d="
    M90 113
    C78 95, 54 103, 54 125
    C54 147, 78 161, 90 177
    C102 161, 126 147, 126 125
    C126 103, 102 95, 90 113
  "

  fill="none"

  stroke="rgba(190, 151, 35, 0.16)"

  strokeWidth={2.2}

  strokeLinecap="round"
/>

        {/* LEGS */}
        <Path
          d="M90 235 L72 325 M90 235 L108 325"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={1.8}
          strokeLinecap="round"
        />

        {/* SPINE */}
        <Line
          x1="90"
          y1="40"
          x2="90"
          y2="255"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={1.5}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 0,
  },
});