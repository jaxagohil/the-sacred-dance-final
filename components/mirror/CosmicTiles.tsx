import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  getCosmicData,
  getCosmicInterpretation,
} from "../../lib/cosmic";

import {
  Colors,
} from "../../constants/theme";

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
paddingTop: 26,
paddingBottom: 14,
  },

  container: {
    alignItems: "center",
    paddingVertical: 6,
  },

  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },

tile: {
  width: 78,

  borderRadius: 22,

  paddingHorizontal: 8,
  paddingVertical: 14,

  minHeight: 92,

  alignItems: "center",
  justifyContent: "center",

  backgroundColor:
    "rgba(255,255,255,0.015)",

  borderWidth: 0.5,

  borderColor:
    "rgba(255,255,255,0.03)",
},

  energyTile: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  icon: {
fontSize: 12,

opacity: 0.38,
    marginBottom: 6,
  },

value: {
  fontSize: 11,

  color:
    Colors.white,

  textAlign: "center",

  marginTop: 2,

  opacity: 0.82,

  fontWeight: "300",
},

line: {
  fontSize: 9,

  color:
    Colors.mutedText,

  marginTop: 8,

  textAlign: "center",

  lineHeight: 13,

  opacity: 0.72,
},

aiText: {
  marginTop: 18,

  fontSize: 11,

  color:
    Colors.softText,

  textAlign: "center",

  lineHeight: 21,

  paddingHorizontal: 26,

  opacity: 0.72,

  fontStyle: "italic",
},
});