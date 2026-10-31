
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
    Pressable,
    StyleSheet,
    View,
} from "react-native";

const GOLD = "#C9AD70";

export type Stage = {
  id: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  prompt: string;
};

export const STAGES: Stage[] = [
  {
    id: "dream",
    label: "Dream",
    icon: "star",
    prompt: "Imagine what is possible.",
  },
  {
    id: "discover",
    label: "Discover",
    icon: "compass",
    prompt: "What do you truly desire?",
  },
  {
    id: "build",
    label: "Build",
    icon: "tool",
    prompt: "What wants to become real?",
  },
  {
    id: "grow",
    label: "Grow",
    icon: "trending-up",
    prompt: "What is ready to flourish?",
  },
  {
    id: "scale",
    label: "Scale",
    icon: "maximize-2",
    prompt: "Where can this creation reach?",
  },
  {
    id: "renew",
    label: "Renew",
    icon: "refresh-cw",
    prompt: "What wants to emerge next?",
  },
];

type Props = {
  activeStage: string;
  onSelect: (stageId: string) => void;
};

export default function JourneyStages({
  activeStage,
  onSelect,
}: Props) {
  return (
    <View style={styles.container}>
      {STAGES.map((stage) => {
        const active = activeStage === stage.id;

        return (
          <Pressable
            key={stage.id}
            onPress={() => onSelect(stage.id)}
            style={[
              styles.stage,
              active && styles.activeStage,
            ]}
            accessibilityRole="button"
            accessibilityLabel={stage.label}
            accessibilityState={{ selected: active }}
            hitSlop={5}
          >
            <Feather
              name={stage.icon}
              size={13}
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
    width: 34,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingVertical: 0,
  },

  stage: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: "transparent",
  },

  activeStage: {
    borderColor: GOLD,
    backgroundColor: "rgba(201,173,112,0.12)",
  },
});