
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, {
    Circle,
    Defs,
    Ellipse,
    LinearGradient,
    Path,
    RadialGradient,
    Stop,
} from "react-native-svg";

type Props = {
  symbol: string;
  selected?: boolean;
  onPress?: () => void;
  width?: number;
  height?: number;
};

export default function OrnateMirror({
  symbol,
  selected = false,
  onPress,
  width = 56,
  height = 116,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={[
        styles.mirror,
        {
          width,
          height,
          shadowOpacity: selected ? 0.65 : 0.25,
        },
      ]}
    >
      <Svg width="100%" height="100%" viewBox="0 0 100 190">
        <Defs>
          <LinearGradient id="silver" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#737B85" />
            <Stop offset="0.22" stopColor="#F5F4EF" />
            <Stop offset="0.42" stopColor="#A0A7B0" />
            <Stop offset="0.58" stopColor="#FFFFFF" />
            <Stop offset="0.8" stopColor="#858C96" />
            <Stop offset="1" stopColor="#DDE0E4" />
          </LinearGradient>

          <LinearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#AEB6C0" />
            <Stop offset="0.25" stopColor="#626D7B" />
            <Stop offset="0.52" stopColor="#303947" />
            <Stop offset="0.78" stopColor="#737E8B" />
            <Stop offset="1" stopColor="#A9B0B9" />
          </LinearGradient>

          <RadialGradient id="reflection">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.3" />
            <Stop offset="0.6" stopColor="#DDE4EB" stopOpacity="0.1" />
            <Stop offset="1" stopColor="#A9B8CF" stopOpacity="0" />
          </RadialGradient>

          <LinearGradient id="glimmer" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
            <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.45" />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Main architectural silver silhouette */}
<Path
  d="
    M50 3
    L59 15
    L70 23
    L81 38
    L84 49
    L84 157
    Q84 166 76 170
    L24 170
    Q16 166 16 157
    L16 49
    L19 38
    L30 23
    L41 15
    Z
  "
  fill="url(#silver)"
  stroke="#F5F4EF"
  strokeWidth="0.7"
/>

        {/* Pointed ornamental crown */}
        <Path
          d="
            M50 5
            L57 15
            L65 18
            L72 28
            L50 37
            L28 28
            L35 18
            L43 15
            Z
          "
          fill="url(#silver)"
          stroke="#FFFFFF"
          strokeWidth="0.7"
        />

        {/* Crown filigree */}
        <Path
          d="
            M50 8
            C45 15 40 20 37 27
            C42 29 46 31 50 35
            C54 31 58 29 63 27
            C60 20 55 15 50 8
            M40 22 L50 29 L60 22
            M45 16 L50 22 L55 16
          "
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="0.8"
          opacity="0.95"
        />

        {/* Crown centre ornament */}
        <Path
          d="M50 11 L53 19 L50 24 L47 19 Z"
          fill="none"
          stroke="#F8F4EA"
          strokeWidth="0.8"
        />

        {/* Reflective glass */}
        <Path
d="
  M50 29
  L58 36
  L69 42
  L76 51
  L77 59
  L77 155
  Q77 162 70 163
  L30 163
  Q23 162 23 155
  L23 59
  L24 51
  L31 42
  L42 36
  Z
"
          fill="url(#glass)"
          stroke="#DCE0E5"
          strokeWidth="0.5"
        />

        {/* Subtle mirror reflection */}
        <Ellipse
          cx="50"
          cy="105"
          rx="20"
          ry="52"
          fill="url(#reflection)"
        />

        {/* Vertical glimmer */}
        <Path
          d="
            M40 55
            C37 80 39 115 44 151
            L47 163
            C45 128 45 88 48 53
            Z
          "
          fill="url(#glimmer)"
          opacity="0.55"
        />

        {/* Fine architectural side engraving */}
        <Path
          d="
            M20 48 L24 53 L24 142
            M80 48 L76 53 L76 142
            M20 65 L24 70
            M80 65 L76 70
            M20 124 L24 119
            M80 124 L76 119
          "
          stroke="#FFFFFF"
          strokeWidth="0.7"
          fill="none"
          opacity="0.9"
        />

        {/* Delicate side filigree */}
        <Path
          d="
            M20 80
            C27 75 27 69 22 66
            M80 80
            C73 75 73 69 78 66
            M20 108
            C27 113 27 119 22 122
            M80 108
            C73 113 73 119 78 122
          "
          stroke="#F8F4EA"
          strokeWidth="0.65"
          fill="none"
        />

        {/* Rounded lower frame ornament */}
        <Path
          d="
            M35 169
            C42 177 46 180 50 181
            C54 180 58 177 65 169
            M43 174 L50 179 L57 174
          "
          stroke="#FFFFFF"
          strokeWidth="0.8"
          fill="none"
        />

        {/* Small silver engraved details */}
        {[31, 69].map((x) =>
          [43, 151].map((y) => (
            <Circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r="1.5"
              fill="#FFFFFF"
            />
          ))
        )}
      </Svg>

      {/* Gold lens symbol */}
      <View pointerEvents="none" style={styles.symbolContainer}>
        <View style={styles.symbolGlow} />
        <Text style={styles.symbolText}>{symbol}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  mirror: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D8DCE8",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    elevation: 5,
  },

  symbolContainer: {
    position: "absolute",
    top: "32%",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  symbolGlow: {
    position: "absolute",
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: "rgba(201,173,112,0.10)",
  },

  symbolText: {
    color: "#D9BD80",
    fontSize: 19,
    fontWeight: "300",
    textShadowColor: "rgba(201,173,112,0.8)",
    textShadowRadius: 8,
  },
});
