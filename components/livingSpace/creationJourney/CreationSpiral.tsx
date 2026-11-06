
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

const GOLD = "#C9AD70";
const INACTIVE = "#C9AD70";
const ACTIVE = "#FFE2A3";

const WIDTH = 100;
const HEIGHT = 110;
const BUTTON_SIZE = 20;
const ICON_SIZE = 15;

type Props = {
  activeStage: string;
  onSelect: (stageId: string) => void;
};

type SpiralStage = {
  id: string;
  icon: keyof typeof Feather.glyphMap;
  offsetX: number;
  offsetY: number;
};

const STAGES: SpiralStage[] = [
  { id: "dream", icon: "star", offsetX: 0, offsetY: 0 },
  { id: "discover", icon: "compass", offsetX: 0, offsetY: 0 },
  { id: "grow", icon: "trending-up", offsetX: -12, offsetY: 2 },
  { id: "build", icon: "tool", offsetX: 20, offsetY: 10 },
  { id: "scale", icon: "maximize-2", offsetX: -17, offsetY: 2 },
  { id: "renew", icon: "refresh-cw", offsetX: 10, offsetY: 0 },
];

const CX = 50;
const BOTTOM = 119;
const TOP = 11;
const TURNS = 6;
const MAX_RADIUS = 47;
const MIN_RADIUS = 5;
const DEPTH = 4.5;

function getSpiralPoint(t: number) {
  const angle = t * TURNS * Math.PI * 2;
  const radius =
    MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * (1 - t);

  return {
    x: CX + radius * Math.cos(angle),
    y:
      BOTTOM -
      (BOTTOM - TOP) * t +
      DEPTH * Math.sin(angle),
  };
}

function createSpiralPath() {
  const steps = 360;

  return Array.from({ length: steps + 1 }, (_, i) => {
    const point = getSpiralPoint(i / steps);
    return `${i === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }).join(" ");
}

export default function CreationSpiral({
  activeStage,
  onSelect,
}: Props) {
  const spiralPath = createSpiralPath();

  return (
    <View style={styles.container}>
      <Svg
        width={WIDTH}
        height={HEIGHT}
        viewBox="0 0 118 130"
        style={StyleSheet.absoluteFill}
      >
        <Path
          d={spiralPath}
          fill="none"
          stroke={GOLD}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>

      {STAGES.map((stage, index) => {
        const active = activeStage === stage.id;
        const point = getSpiralPoint(index / (STAGES.length - 1));

        return (
          <Pressable
            key={stage.id}
            onPress={() => onSelect(stage.id)}
            accessibilityRole="button"
            accessibilityLabel={stage.id}
            accessibilityState={{ selected: active }}
            style={[
styles.stageButton,
active && styles.stageButtonActive,
{
  left: point.x * (WIDTH / 118) + stage.offsetX - BUTTON_SIZE / 2,
  top: point.y * (HEIGHT / 130) + stage.offsetY - BUTTON_SIZE / 2,
},
            ]}
          >
            <Feather
              name={stage.icon}
              size={ICON_SIZE}
              color={active ? ACTIVE : INACTIVE}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: HEIGHT,
    position: "relative",
  },
stageButton: {
  position: "absolute",
  width: BUTTON_SIZE,
  height: BUTTON_SIZE,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: BUTTON_SIZE / 2,
  backgroundColor: "#111116",
  borderWidth: 1,
  borderColor: "rgba(201,173,112,0.45)",
},

stageButtonActive: {
  backgroundColor: "#211B12",
  borderColor: "#F1D49A",
  borderWidth: 1.3,
  shadowColor: "#F1D49A",
  shadowOpacity: 0.45,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 0 },
  elevation: 4,
},
});
