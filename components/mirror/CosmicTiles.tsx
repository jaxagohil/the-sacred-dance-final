import React, {
  useEffect,
  useRef,
} from "react";

import {
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";

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

  cosmic,

  language,

  languageContext,

}: {

  cosmic: any;

  language?: string;

  languageContext?: any;

}) {

  //
  // ✨ SHIMMER
  //

  const shimmerAnim =
    useRef(
      new Animated.Value(0.28)
    ).current;

  //
  // 🌫 BREATHING EFFECT
  //

  useEffect(() => {

    Animated.loop(

      Animated.sequence([

        Animated.timing(
          shimmerAnim,

          {
            toValue: 0.06,

            duration: 1600,

            useNativeDriver: true,
          }
        ),

        Animated.timing(
          shimmerAnim,

          {
            toValue: 0.18,

            duration: 1600,

            useNativeDriver: true,
          }
        ),
      ])

    ).start();

  }, []);

  //
  // 🌫 LOADING STATE
  //

  if (!cosmic) {

    return (

      <View style={styles.wrapper}>

        <View style={styles.container}>

          <View style={styles.row}>

            {[1,2,3,4].map((i) => (

              <Animated.View
                key={i}

                style={[

                  styles.tile,

                  styles.loadingTile,

                  {
                    opacity:
                      shimmerAnim,
                  },
                ]}
              />

            ))}

          </View>

        </View>

      </View>
    );
  }

  //
  // 🌌 COSMIC DATA
  //

const cosmicData =

  cosmic?.dailyField
    ?.cosmic || {};

  console.log(cosmic);  

  //
  // ✨ TILES
  //

  const tiles = [

    {
      key: "moon",

      value:
        cosmicData?.moon_sign || "",

line:
  cosmic?.moon?.line ||
  cosmic?.moonLine,

      icon: "🌙",
    },

    {
      key: "phase",

      value:
        cosmicData?.moon_phase || "",

line:
  cosmic?.phase?.line ||
  cosmic?.phaseLine,

      icon:
        getPhaseIcon(
          cosmic.phaseType
        ),
    },

{
  key: "energy",

  value:
    (
      (
        cosmic?.dailyField
          ?.dominantEnergy ||

        "Energy"
      )

      .split(" ")[0]
    )

      .charAt(0)

      .toUpperCase()

    +

    (
      (
        cosmic?.dailyField
          ?.dominantEnergy ||

        "Energy"
      )

      .split(" ")[0]
    )

      .slice(1),

  line:
    cosmic?.energy?.line ||
    cosmic?.energyLine,

  icon: "✨",
},

    {
      key: "sun",

      value:
        cosmicData?.sun_sign || "",

line:
  cosmic?.sun?.line ||
  cosmic?.sunLine,

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

<View style={styles.valueWrapper}>

<Text

  style={styles.value}

  numberOfLines={2}

>

  {t.value}

</Text>

</View>

                <Text style={styles.line}>
                  {t.line}
                </Text>

              </View>
            );
          })}
        </View>

      </View>

    </View>
  );
}

const styles =
  StyleSheet.create({

 valueWrapper: {

  minHeight: 28,

  justifyContent: "center",

  alignItems: "center",

  paddingHorizontal: 4,
},   

  wrapper: {

    paddingHorizontal: 20,

    paddingTop: 26,

    paddingBottom: 14,
  },

  container: {

    alignItems: "center",

    paddingVertical: 6,

    minHeight: 110,
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

  loadingTile: {

    backgroundColor:
      "rgba(255,255,255,0.04)",
  },

  icon: {

    fontSize: 14,

    opacity: 0.48,

    marginBottom: 6,
  },

  value: {

    fontSize: 10,

    color:
      Colors.white,

    textAlign: "center",

    marginTop: 1,

    opacity: 1,

    fontWeight: "300",
  },

  line: {

      minHeight: 52,

    fontSize: 10,

    color:
      Colors.mutedText,

    marginTop: 10,

    textAlign: "center",

    lineHeight: 14,

    opacity: 0.95,
  },
});