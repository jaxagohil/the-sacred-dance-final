// /components/energy/EnergyField.tsx

import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import ChakraSystem from "../mirror/ChakraSystem";

import EnergyBallSkia from "./energyBallSkia";

import EnergyBody from "./energyBody";

import type {
  Chakra,
} from "../../lib/energy";

import {
  Colors,
} from "../../constants/theme";

// --------------------------------------------------
// ⚡ ENERGY FIELD
// --------------------------------------------------

export default function EnergyField({

  userContext,

  chakraContent,

  language,

  languageContext,

}: {

  userContext: any;

  chakraContent?:
    Record<
      string,
      {
        name: string;

        affirmation: string;
      }
    >;

  language?: string;

  languageContext?: any;

}) {

  // --------------------------------------------------
  // 🧠 USER CONTEXT
  // --------------------------------------------------

  const energy =
    userContext?.energy;

  const chakraScores =
    userContext?.chakraScores || {};

  const chakraPatterns =
    userContext?.chakraPatterns || {};

  const awarenessChakra =
    userContext?.awarenessChakra;

  const distortions =
    userContext?.distortions || {};

  const observableScenes =
    userContext?.observableScenes || [];

  // --------------------------------------------------
  // 🧩 STATE
  // --------------------------------------------------

  const [
    selectedChakra,
    setSelectedChakra,
  ] = React.useState<
    Chakra | null
  >(null);

  // --------------------------------------------------
  // 🧘 AFFIRMATION
  // --------------------------------------------------

  const affirmation =

    awarenessChakra

      ? chakraContent?.[
          awarenessChakra
        ]?.affirmation

      : null;

const selectedChakraData =

  selectedChakra

    ? chakraContent?.[
        selectedChakra
      ]

    : null;

const chakraManifestations =

  selectedChakra

    ? Object.values(
        energy
          ?.distortions ||
          {}
      )
        .flat()
        .filter(
          (d: any) => {

            const weights =
              d?.chakra_weights || {};

            return (
              weights[
                selectedChakra
              ] > 0.5
            );
          }
        )

    : [];

  // --------------------------------------------------
  // 🧩 CLICK HANDLER
  // --------------------------------------------------

  const handleChakraPress = (
    chakra: Chakra
  ) => {

    console.log(
      "👉 Chakra clicked:",
      chakra
    );

    setSelectedChakra(
      chakra
    );
  };

  // --------------------------------------------------
  // 🌌 RENDER
  // --------------------------------------------------

  return (

    <View style={styles.container}>

      {/* 🌌 ENERGY FIELD */}

      <View style={styles.fieldContainer}>

        <View style={styles.inner}>

          {/* 🔵 ENERGY BALL */}

          <View
            style={styles.energyBall}
            pointerEvents="box-none"
          >

            <EnergyBallSkia

              energy={energy}

              distortions={
                distortions
              }

              observableScenes={
                observableScenes
              }

              awarenessChakra={
                awarenessChakra
              }
            />

          </View>

          {/* 🧍 BODY */}

          <View style={styles.body}>

            <EnergyBody />

          </View>

          {/* 🟣 CHAKRAS */}

          <View
            style={styles.chakras}
            pointerEvents="box-none"
          >

            <View
              style={{
                width: 180,
                height: 430,
              }}
            >

              <ChakraSystem

                dominant={
                  awarenessChakra
                }

                scores={
                  chakraScores
                }

                patterns={
                  chakraPatterns
                }

                distortions={
                  distortions
                }

                observableScenes={
                  observableScenes
                }

                onChakraPress={
                  handleChakraPress
                }

                selectedChakra={
                  selectedChakra
                }
              />

            </View>

          </View>

        </View>

      </View>

{selectedChakraData && (

  <View
    style={
      styles.chakraReveal
    }
  >

    <Text
      style={
        styles.chakraTitle
      }
    >

      {
        selectedChakraData
          ?.name
      }

    </Text>

    <Text
      style={
        styles.chakraBody
      }
    >

{chakraManifestations
  ?.slice(0, 3)
  ?.map(
    (
      item: any,
      i: number
    ) => (

      <Text

        key={i}

        style={
          styles.manifestation
        }
      >

        • {

          item
            ?.manifestation ||

          item
            ?.observable_scene ||

          item
            ?.mirror_prompt
        }

      </Text>
    )
  )}
      {
        selectedChakraData
          ?.affirmation
      }

    </Text>

  </View>
)}

      {/* ✨ AFFIRMATION */}

      {affirmation && (

        <View
          style={
            styles.affirmationWrapper
          }
        >

          <Text
            style={
              styles.affirmationText
            }
          >

            {affirmation}

          </Text>

        </View>
      )}

    </View>
  );
}

// --------------------------------------------------
// 🎨 STYLES
// --------------------------------------------------

const styles =
  StyleSheet.create({

    container: {

      alignItems:
        "center",
    },

    fieldContainer: {

      width: 240,

      height: 430,

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    inner: {

      width: "100%",

      height: "100%",

      justifyContent:
        "center",

      alignItems:
        "center",

      marginTop: -12,
    },

    energyBall: {

      position:
        "absolute",

      width: 460,

      height: 460,

      justifyContent:
        "center",

      alignItems:
        "center",

      zIndex: 30,
    },

    body: {

      position:
        "absolute",

      width: 180,

      height: 420,

      justifyContent:
        "center",

      alignItems:
        "center",

      zIndex: 10,
    },

    chakras: {

      ...StyleSheet.absoluteFillObject,

      justifyContent:
        "center",

      alignItems:
        "center",

      zIndex: 20,
    },

    affirmationWrapper: {

      marginTop: -12,

      paddingHorizontal: 24,

      maxWidth: 260,

      opacity: 0.85,

      marginBottom: 50,
    },

    affirmationText: {

      color:
        Colors.softText,

      fontSize: 13,

      fontStyle:
        "italic",

      textAlign:
        "center",

      lineHeight: 24,

      fontWeight: "300",

      opacity: 0.82,
    },

    insightWrapper: {

      marginTop: 6,

      paddingHorizontal: 20,

      maxWidth: 260,
    },

    insightText: {

      color:
        "rgba(255,255,255,0.6)",

      fontSize: 13,

      textAlign:
        "center",

      lineHeight: 18,
    },

chakraReveal: {

  marginTop: 18,

  paddingHorizontal: 22,

  paddingVertical: 16,

  borderRadius: 20,

  backgroundColor:
    "rgba(255,255,255,0.03)",

  maxWidth: 280,
},

chakraTitle: {

  color: "white",

  fontSize: 16,

  textAlign: "center",

  marginBottom: 8,

  opacity: 0.9,
},

chakraBody: {

  color:
    "rgba(255,255,255,0.72)",

  fontSize: 13,

  textAlign: "center",

  lineHeight: 20,
},

manifestation: {

  color:
    "rgba(255,255,255,0.62)",

  fontSize: 12,

  lineHeight: 18,

  marginTop: 8,

  textAlign: "center",
},

  });