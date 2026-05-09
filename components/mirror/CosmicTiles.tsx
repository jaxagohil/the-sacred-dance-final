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
  aiMessage,
}: {
  energy?: any;
  patterns?: any[];
  aiMessage?: string;
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
                  //isEnergy && styles.energyTile,
                ]}
              >
                <Text style={styles.icon}>{t.icon}</Text>
                <Text style={styles.value}>{t.value}</Text>
                <Text style={styles.line}>{t.line}</Text>
              </View>
            );
          })}
        </View>

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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },

  container: {
    paddingVertical: 6,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  tile: {
    flex: 1,
    borderRadius: 16,
    paddingHorizontal: 6,
    paddingVertical: 12,
    minHeight: 85,
    alignItems: "center",
    marginHorizontal: 6,
    backgroundColor: "rgba(255,255,255,0.02)",
  },

  energyTile: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  icon: {
    fontSize: 14,
    opacity: 0.5,
    marginBottom: 6,
  },

  value: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
  },

  line: {
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
    marginTop: 6,
    textAlign: "center",
    lineHeight: 14,
  },

  aiText: {
    marginTop: 12,
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 10,
  },
});