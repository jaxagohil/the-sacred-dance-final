// /components/energy/EnergyField.tsx

import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import ChakraSystem from "./ChakraSystemRN";

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

  userContext
    ?.energy
    ?.awareness_chakra ||

  null;

  const distortions =
  userContext?.distortions || {

    distorted: [],

    integrated: [],

    contractionLevel: 0,

    expansionLevel: 0,

    dominantPolarity:
      "feminine",
  };

  const observableScenes =
    userContext?.observableScenes || [];

  const lensEntries =
  userContext?.lensEntries || [];  

  /*
 * --------------------------------------------------
 * 🌌 EMPTY FIELD
 * --------------------------------------------------
 */

if (
  !energy
) {

  return (

    <View
      style={styles.container}
    >

      <View
        style={styles.fieldContainer}
      >

        <View style={styles.inner}>

          <View
            style={styles.energyBall}
          >

            <EnergyBallSkia

              energy={{

                feminine: 0.5,

                masculine: 0.5,

                contraction: 0.5,

                expansion: 0.5,

                chakras: {},

                dominant_chakra:
                  null,

                awareness_chakra:
                  null,
              }}

              distortions={{

                distorted: [],

                integrated: [],

                contractionLevel: 0,

                expansionLevel: 0,

                dominantPolarity:
                  "feminine",
              }}

              observableScenes={[]}

              lensEntries={null}

              awarenessChakra={
                null
              }
            />

          </View>

          <View style={styles.body}>

            <EnergyBody />

          </View>

        </View>

      </View>

    </View>
  );
}  

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

  // --------------------------------------------------
  // 🌈 CHAKRA MANIFESTATIONS
  // --------------------------------------------------

  const chakraManifestations =

    selectedChakra

      ? [

          ...(distortions
            ?.distorted || []),

          ...(distortions
            ?.integrated || []),
        ]

.filter(
  (d: any) => {

    if (
      !selectedChakra
    ) {

      return false;
    }

    const weights =
      d?.chakra_weights;

    if (!weights) {

      return false;
    }

    return (
      Number(
        weights[
          selectedChakra
        ] || 0
      ) > 0
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

  selectedChakra === chakra

    ? null

    : chakra
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

              lensEntries={
              lensEntries}
  
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

  awareness={
    awarenessChakra
  }

  scores={
    chakraScores
  }

  selectedChakra={
    selectedChakra
  }

  onChakraPress={
    handleChakraPress
  }

  bodyResponse={

    chakraManifestations?.[0]
      ?.body_response ||

    ""
  }
/>

            </View>

          </View>

        </View>

      </View>


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
  width: "100%",
  height: 430,
  justifyContent: "center",
  alignItems: "center",
  overflow: "visible",
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

      zIndex: 1,
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

      fontSize: 15,

      fontStyle:
        "italic",

      textAlign:
        "center",

      lineHeight: 24,

      fontWeight: "300",

      opacity: 0.85,
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