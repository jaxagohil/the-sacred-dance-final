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