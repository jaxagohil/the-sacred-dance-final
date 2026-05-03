import React from "react";
import { View, Text, StyleSheet } from "react-native";

import EnergyBallSkia from "./energyBallSkia";
import EnergyBody from "./energyBody";
import ChakraSystem from "../mirror/ChakraSystem";
import { getAffirmation } from "../../lib/energy";

import type { Chakra } from "../../lib/energy";

export default function EnergyField({
  dominant,
  scores,
  energy,
  chakraPatterns, // ✅ ADD THIS
}: {
  dominant?: Chakra;
  scores: Record<Chakra, { score: number }>;
  energy: any;
  chakraPatterns?: Record<string, { description: string }>;
}) {

  // ---------------------------
  // 🧩 STATE (ONLY ONCE)
  // ---------------------------
  const [selectedChakra, setSelectedChakra] = React.useState<Chakra | null>(null);

  // ---------------------------
  // 🔍 DEBUG
  // ---------------------------
  console.log("🔥 EnergyField energy:", energy);
  console.log("🧠 Chakra scores:", scores);
  console.log("🎯 Awareness Chakra:", dominant);

  // ---------------------------
  // 🧠 TRUST MIRROR
  // ---------------------------
  const awarenessChakra = dominant;

  // ---------------------------
  // 🧘 AFFIRMATION
  // ---------------------------
  const affirmation = awarenessChakra
    ? getAffirmation(awarenessChakra)
    : null;

  // ---------------------------
  // 🧩 CLICK HANDLER
  // ---------------------------
  const handleChakraPress = (chakra: Chakra) => {
    console.log("👉 Chakra clicked:", chakra);
    setSelectedChakra(chakra);
  };

  return (
    <View style={styles.container}>

      {/* 🌌 ENERGY FIELD */}
      <View style={styles.fieldContainer}>
        <View style={styles.inner}>

          {/* 🔵 ENERGY BALL (DOES NOT BLOCK TOUCH) */}
          <View style={styles.energyBall} pointerEvents="none">
            <EnergyBallSkia energy={energy} />
          </View>

          {/* 🧍 BODY */}
          <View style={styles.body}>
            <EnergyBody />
          </View>

          {/* 🟣 CHAKRAS (CLICKABLE LAYER) */}
          <View style={styles.chakras} pointerEvents="box-none">
            <View style={{ width: 180, height: 430 }}>
              <ChakraSystem
                dominant={awarenessChakra}
                scores={scores}
                onChakraPress={handleChakraPress}
                selectedChakra={selectedChakra} // ✅ ADD THIS
                patterns={chakraPatterns}
              />
            </View>
          </View>

        </View>
      </View>

      {/* ✨ AFFIRMATION */}
      {affirmation && (
        <View style={styles.affirmationWrapper}>
          <Text style={styles.affirmationText}>
            {affirmation}
          </Text>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },

  fieldContainer: {
    width: 200,
    height: 400,
    justifyContent: "center",
    alignItems: "center",
  },

  inner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30, // 🔥 move up
  },

  energyBall: {
    position: "absolute",
    width: 420,
    height: 420,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 30,
  },

  body: {
    position: "absolute",
    width: 180,
    height: 420,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  chakras: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },

  affirmationWrapper: {
    marginTop: -12,
    paddingHorizontal: 24,
    maxWidth: 260,
    opacity: 0.85,
    marginBottom: 35,
  },

  affirmationText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 20,
  },

  insightWrapper: {
    marginTop: 6,
    paddingHorizontal: 20,
    maxWidth: 260,
  },

  insightText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
});