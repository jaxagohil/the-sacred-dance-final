 
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const GOLD = "#C9AD70";

const STAGES = [
  { id: "dream", icon: "star", x: "25%", y: "83%" },
  { id: "discover", icon: "compass", x: "37%", y: "68%" },
  { id: "build", icon: "tool", x: "50%", y: "48%" },
  { id: "grow", icon: "trending-up", x: "17%", y: "48%" },
  { id: "scale", icon: "maximize-2", x: "83%", y: "43%" },
  { id: "renew", icon: "refresh-cw", x: "57%", y: "15%" },
] as const;

type Props = {
  activeStage: string;
  onSelectStage: (stage: string) => void;
};

export default function CreationSpiral({
  activeStage,
  onSelectStage,
}: Props) {
  return (
    <View style={styles.container}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 300 260"
        preserveAspectRatio="xMidYMid meet"
      >
        <Path
          d="
            M 65 225
            C 25 205, 45 160, 95 165
            C 145 170, 145 225, 100 225
            C 45 225, 35 165, 75 125
            C 115 85, 190 100, 205 145
            C 220 190, 270 165, 265 110
            C 260 55, 205 25, 145 35
            C 105 42, 95 75, 125 90
            C 150 102, 170 85, 160 70
            C 150 58, 130 62, 130 75
          "
          fill="none"
          stroke={GOLD}
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>

      {STAGES.map((stage) => {
        const active = activeStage === stage.id;

        return (
          <Pressable
            key={stage.id}
            onPress={() => onSelectStage(stage.id)}
            style={[
              styles.marker,
              { left: stage.x, top: stage.y },
              active && styles.activeMarker,
            ]}
          >
            <Feather
              name={stage.icon}
              size={active ? 14 : 12}
              color={active ? "#F1D49A" : "#81796E"}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 230,
    aspectRatio: 1.15,
    alignSelf: "center",
    position: "relative",
  },
  marker: {
    position: "absolute",
    width: 24,
    height: 24,
    marginLeft: -12,
    marginTop: -12,
    alignItems: "center",
    justifyContent: "center",
  },
  activeMarker: {
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 15,
    backgroundColor: "#292116",
  },
});
