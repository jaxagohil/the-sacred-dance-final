import React, {
  useEffect,
  useState,
} from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  buildDailyField,
} from "../../lib/cosmic/buildDailyField";

import {
  getCosmicInterpretation
} from "../../lib/cosmic/cosmicInterpretation";

import {
  Colors,
} from "../../constants/theme";

function getPhaseIcon(
  type: string
) {

  const map:
    Record<string, string> = {

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

  const [cosmic,
    setCosmic] =
      useState<any>(null);

  useEffect(() => {

    async function load() {

      //
      // 🌌 DAILY FIELD
      //

      const dailyField =
        await buildDailyField();

      //
      // 🧠 INTERPRETATION
      //

      const interpretation =
        getCosmicInterpretation({

          dailyField,

          energy,

          patterns,
        });

      //
      // ✨ MERGED FIELD
      //

      setCosmic({

        ...dailyField,

        ...interpretation,
      });
    }

    load();

  }, [energy, patterns]);

  if (!cosmic) {
    return null;
  }

  //
  // 🌌 COSMIC DATA
  //

  const cosmicData =
    cosmic.cosmic;

  //
  // ✨ TILES
  //

  const tiles = [

    {
      key: "moon",

      value:
        cosmicData.moon,

      line:
        cosmic.moonLine,

      icon: "🌙",
    },

    {
      key: "phase",

      value:
        cosmicData.phase,

      line:
        cosmic.phaseLine,

      icon:
        getPhaseIcon(
          cosmic.phaseType
        ),
    },

    {
      key: "energy",

      value:
        cosmicData.sunEnergy,

      line:
        cosmic.energyLine,

      icon: "✨",
    },

    {
      key: "sun",

      value:
        cosmicData.sun,

      line:
        cosmic.sunLine,

      icon: "☀️",
    },
  ];

  return (

    <View style={styles.wrapper}>

      <View style={styles.container}>

        <View style={styles.row}>

          {tiles.map((t) => {

            return (

              <View
                key={t.key}

                style={
                  styles.tile
                }
              >

                <Text style={styles.icon}>
                  {t.icon}
                </Text>

                <Text style={styles.value}>
                  {t.value}
                </Text>

                <Text style={styles.line}>
                  {t.line}
                </Text>

              </View>
            );
          })}
        </View>

        {/* 🌌 DAILY FIELD MESSAGE */}

        {aiMessage && (

          <Text style={styles.aiText}>

            {aiMessage}

          </Text>
        )}

      </View>

    </View>
  );
}

const styles =
  StyleSheet.create({

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