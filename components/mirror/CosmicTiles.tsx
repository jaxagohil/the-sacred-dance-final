import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import {
  getCosmicData,
  getCosmicInterpretation,
} from "../../lib/cosmic";

function getPhaseIcon(type: string) {
  const map: Record<string, string> = {
    amplify: "🌕",
    initiate: "🌑",
    build: "🌓",
    release: "🌘",
  };

  return map[type] || "🌓";
}

export default function CosmicTiles({
  energy,
  patterns,
  aiMessage, // 🔥 NEW (safe)
}: {
  energy?: any;
  patterns?: any[];
  aiMessage?: string; // 🔥 NEW
}) {
  const [cosmic, setCosmic] = useState<any>(null);

  useEffect(() => {
    const data = getCosmicData();

    const interpretation = getCosmicInterpretation(
      data,
      energy,
      patterns
    );

    setCosmic({ ...data, ...interpretation });
  }, [energy, patterns]);

  if (!cosmic) return null;

  const tiles = [
    {
      key: "moon",
      value: cosmic.moon,
      line: cosmic.moonLine,
      icon: "🌙",
    },
    {
      key: "phase",
      value: cosmic.phase,
      line: cosmic.phaseLine,
      icon: getPhaseIcon(cosmic.phaseType),
    },
    {
      key: "energy",
      value: cosmic.sunEnergy,
      line: cosmic.energyLine,
      icon: "✨",
    },
    {
      key: "sun",
      value: cosmic.sun,
      line: cosmic.sunLine,
      icon: "☀️",
    },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.row}>
          {tiles.map((t) => {
            const isEnergy = t.key === "energy";

            return (
              <View
                key={t.key}
                style={[
                  styles.tile,
                  isEnergy ? styles.energyTile : styles.normalTile,
                ]}
              >
                <Text style={styles.icon}>{t.icon}</Text>
                <Text style={styles.value}>{t.value}</Text>
                <Text style={styles.line}>{t.line}</Text>
              </View>
            );
          })}
        </View>

        {/* 🔥 OPTIONAL AI MESSAGE (safe, non-breaking) */}
        {aiMessage && (
          <Text style={styles.aiText}>
            {aiMessage}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },

  container: {
    backgroundColor: "rgba(255,255,255,0.02)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 24,
    padding: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  tile: {
    flex: 1,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 10,
    minHeight: 90,
    alignItems: "center",
    marginHorizontal: 2,
  },

  normalTile: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  energyTile: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  icon: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 4,
  },

  value: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },

  line: {
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
    marginTop: 6,
    textAlign: "center",
    lineHeight: 14,
  },

  // 🔥 NEW
  aiText: {
    marginTop: 10,
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    lineHeight: 18,
  },
});