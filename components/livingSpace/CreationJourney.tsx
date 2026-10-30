
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";

type Stage = {
  id: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  prompt: string;
};

const GOLD = "#C9AD70";
const MUTED = "#AAA2B6";
const BORDER = "rgba(201,173,112,0.22)";

const STAGES: Stage[] = [
  { id: "dream", label: "Dream", icon: "star", prompt: "Imagine what is possible." },
  { id: "discover", label: "Discover", icon: "compass", prompt: "What do you truly desire?" },
  { id: "build", label: "Build", icon: "tool", prompt: "What wants to become real?" },
  { id: "grow", label: "Grow", icon: "trending-up", prompt: "What is ready to flourish?" },
  { id: "scale", label: "Scale", icon: "maximize-2", prompt: "Where can this creation reach?" },
  { id: "renew", label: "Renew", icon: "refresh-cw", prompt: "What wants to emerge next?" },
];

export default function CreationJourney() {
  const { width } = useWindowDimensions();
  const wide = width >= 1050;

  const [activeStage, setActiveStage] = useState("dream");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const selected =
    STAGES.find((stage) => stage.id === activeStage) ?? STAGES[0];

  return (
    <View style={[styles.container, !wide && styles.narrow]}>

      {/* LEFT: CREATION */}
      <View style={styles.sidePanel}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="What are you creating?"
          placeholderTextColor="#81796E"
          style={styles.title}
        />

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="A little about your vision..."
          placeholderTextColor="#81796E"
          multiline
          style={styles.description}
        />
      </View>

      {/* CENTRE: JOURNEY */}
      <View style={styles.middlePanel}>
        <View style={styles.stages}>
          {STAGES.map((stage) => {
            const active = activeStage === stage.id;

            return (
              <Pressable
                key={stage.id}
                onPress={() => setActiveStage(stage.id)}
                style={styles.stage}
              >
                <View
                  style={[
                    styles.circle,
                    active && styles.activeCircle,
                  ]}
                >
                  <Feather
                    name={stage.icon}
                    size={17}
                    color={active ? "#F1D49A" : "#A89A83"}
                  />
                </View>

                <Text
                  style={[
                    styles.stageLabel,
                    active && styles.activeLabel,
                  ]}
                >
                  {stage.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.selected}>
          <Text style={styles.selectedTitle}>
            {selected.label}
          </Text>
          <Text style={styles.prompt}>
            {selected.prompt}
          </Text>
        </View>
      </View>

      {/* RIGHT: GENERATED ARTEFACTS */}
      <View style={styles.sidePanel}>
        <View style={styles.artifactCanvas}>
          <Feather
            name="layers"
            size={27}
            color="#776B59"
          />
          <Text style={styles.emptyText}>
            Creation artefacts
          </Text>
          <Text style={styles.emptySubtext}>
            Your ideas, plans and outcomes will appear here.
          </Text>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
container: {
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  marginTop: 40,
  marginBottom: 12,
},

sidePanel: {
  width: 205,
  height: 180,
  flexGrow: 0,
  flexShrink: 0,
  padding: 13,
  borderRadius: 11,
  borderWidth: 1,
  borderColor: BORDER,
  backgroundColor: "transparent",
  justifyContent: "center",
  
},

middlePanel: {
  flex: 1,
  height: 180,
  minWidth: 0,
  padding: 13,
  borderRadius: 11,
  borderWidth: 1,
  borderColor: "rgba(201,173,112,0.35)",
  backgroundColor: "transparent",
  justifyContent: "flex-start",
},

narrow: {
  flexDirection: "column",
},
  title: {
    color: "#EEE5D7",
    fontSize: 16,
    fontWeight: "500",
    paddingVertical: 8,
  },
  description: {
    color: "#D8D0C4",
    fontSize: 12,
    lineHeight: 18,
    minHeight: 55,
    paddingTop: 8,
  },
  stages: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 2,
  },
  stage: {
    flex: 1,
    alignItems: "center",
    gap: 5,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#625B52",
    backgroundColor: "#20201E",
    alignItems: "center",
    justifyContent: "center",
  },
  activeCircle: {
    borderColor: GOLD,
    backgroundColor: "#3A3022",
  },
  stageLabel: {
    color: "#81796E",
    fontSize: 8,
  },
  activeLabel: {
    color: "#E4C58B",
    fontWeight: "700",
  },
  selected: {
    marginTop: 15,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  selectedTitle: {
    color: "#E4C58B",
    fontSize: 14,
    fontWeight: "600",
  },
  prompt: {
    color: "#D8D0C4",
    fontSize: 11,
    marginTop: 6,
  },
  artifactCanvas: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyText: {
    color: "#D8C9AE",
    fontSize: 11,
  },
  emptySubtext: {
    color: MUTED,
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
  },
});
