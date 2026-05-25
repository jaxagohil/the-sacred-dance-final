// /components/energy/EnergyField.tsx

import React from "react";

import {
  Pressable,
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
  chakraY,
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

  console.log(
  "👁 AWARENESS CHAKRA:",
  userContext
    ?.energy
    ?.awareness_chakra
);  

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

  const lensEntries =
    userContext?.lensEntries || [];


  // --------------------------------------------------
  // 🌌 EMPTY FIELD
  // --------------------------------------------------

  if (!energy) {

    return (

      <View
        style={styles.container}
      >

        <View
          style={
            styles.fieldContainer
          }
        >

          <View style={styles.inner}>

            <View
              style={
                styles.energyBall
              }
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

                awarenessChakra={
                  null
                }

                dotPositions={[]}
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

  const [
    selectedDistortion,
    setSelectedDistortion,
  ] = React.useState<
    number | null
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

  // --------------------------------------------------
  // 🧿 DISTORTIONS
  // --------------------------------------------------

  const distortionList = (

    distortions?.distorted || []

  ).map(
    (d: any) => {

      const matchingLens =

        lensEntries?.find(
          (l: any) =>

            l?.behaviour_id ===
            d?.id
        );

return {

  ...d,

  mirror_question:

  matchingLens
    ?.mirror_question ||

  d?.mirror_question,

  manifestation:

    matchingLens
      ?.manifestation ||

    d?.manifestation,

  mirror_prompt:

    matchingLens
      ?.mirror_prompt ||

    d?.mirror_prompt,

  observable_scene:

    matchingLens
      ?.observable_scene ||

    d?.observable_scene,

  coping_strategy:

    matchingLens
      ?.coping_strategy ||

    d?.coping_strategy,

  body_response:

    matchingLens
      ?.body_response ||

    d?.body_response,
};
    }
  );      

 // --------------------------------------------------
// 🌈 CHAKRA INTELLIGENCE
// --------------------------------------------------

console.log(
  "🌈 CHAKRA MANIFESTATIONS:",
  userContext?.chakraManifestations
);

const chakraManifestations =

  selectedChakra

    ? (

        userContext
          ?.chakraManifestations?.[
            selectedChakra
          ] || []

      )

    : [];

  // --------------------------------------------------
  // 🌑 DOT POSITIONS
  // --------------------------------------------------

  const dotPositions =
    distortionList.map(
      (d: any, i: number) => {

const primaryChakra =

  d?.chakra_key ||

  awarenessChakra ||

  energy?.dominant_chakra ||

  "heart";

const baseY =

  chakraY[
    primaryChakra as keyof typeof chakraY
  ] || 180;

const y = Math.min(
  baseY + 55,
  315
);

        const side =

          (
            Number(
              d?.masculine || 0
            ) >

            Number(
              d?.feminine || 0
            )
          )

            ? "right"

            : "left";

        const x =

          side === "left"

            ? 145

            : 255;

        const intensity =

          Number(

            distortions
              ?.contractionLevel || 0.5

          ) *

          (

            d?.quality ===
            "distorted"

              ? 1.2

              : 0.7
          );

        const r =

          6 +

          Number(
            intensity || 0
          ) * 8;

        return {

          x,

          y,

r:

  selectedDistortion === i

    ? r * 1.4

    : r,

          side,

          index: i,
        };
      }
    );

  // --------------------------------------------------
  // 🧩 CLICK HANDLERS
  // --------------------------------------------------

const handleChakraPress = (
  chakra: Chakra
) => {

  setSelectedDistortion(
    null
  );

  setSelectedChakra(
    chakra
  );
};

 const getChakraState = (
  value: number
) => {

  if (value <= -0.6) {
    return "contracted";
  }

  if (value <= -0.2) {
    return "underactive";
  }

  if (value < 0.2) {
    return "balanced";
  }

  if (value < 0.6) {
    return "activated";
  }

  return "overactive";
}; 

const chakraScore =

  selectedChakra

    ? (

        energy
          ?.chakras?.[
            selectedChakra
          ] ||

        0
      )

    : 0;

const chakraState =
  getChakraState(
    chakraScore
  );

const manifestation =

  chakraManifestations?.[0];

const polarity =

  selectedDistortion !== null

    ? (

        Number(

          distortionList[
            selectedDistortion
          ]?.masculine || 0

        ) >

        Number(

          distortionList[
            selectedDistortion
          ]?.feminine || 0

        )

          ? "masculine"

          : "feminine"
      )

    : distortions
        ?.dominantPolarity ||

      "feminine";

const isAwarenessChakra =

  selectedChakra ===
  awarenessChakra;

let chakraInsight = "";

if (manifestation) {

  // 🧘 AWARENESS CHAKRA

if (
  isAwarenessChakra
) {

  chakraInsight =

    manifestation
      ?.reflective_prompt ||

    manifestation
      ?.wound_expression ||

    manifestation
      ?.integration_path ||

    manifestation
      ?.relational_expression ||

    manifestation
      ?.integration ||

    manifestation
      ?.body_response ||

    "";
}

  // 🌑 DISTORTION ACTIVE

  else if (
    selectedDistortion !==
    null
  ) {

    chakraInsight =

      polarity ===
      "masculine"

        ? manifestation
            ?.masculine_manifestation

        : manifestation
            ?.feminine_manifestation ||

          "";
  }

  // 🌊 ENERGETIC STATES

  else {

    // 🌑 CONTRACTED

    if (
      chakraState ===
      "contracted"
    ) {

      chakraInsight =

        manifestation
          ?.body_response ||

        "";
    }

    // 🌘 UNDERACTIVE

    else if (
      chakraState ===
      "underactive"
    ) {

      chakraInsight =

        manifestation
          ?.wound_expression ||

        "";
    }

// ⚪ BALANCED

else if (
  chakraState ===
  "balanced"
) {

  chakraInsight =

    manifestation
      ?.integration ||

    manifestation
      ?.reflective_prompt ||

    "";
}

// 🌔 ACTIVATED

else if (
  chakraState ===
  "activated"
) {

  chakraInsight =

    manifestation
      ?.relational_expression ||

    "";
}

// 🌕 OVERACTIVE

else {

  chakraInsight =

    manifestation
      ?.reflective_prompt ||

    manifestation
      ?.manifestation ||

    "";
}
  }
}

  // --------------------------------------------------
  // 🌌 RENDER
  // --------------------------------------------------

  return (

    <View style={styles.container}>

      {/* 🌌 ENERGY FIELD */}

      <View
        style={
          styles.fieldContainer
        }
      >

        <View style={styles.inner}>

          {/* 🔵 ENERGY BALL */}

          <View
            style={
              styles.energyBall
            }

            pointerEvents="none"
          >

            <EnergyBallSkia

              energy={energy}

              distortions={
                distortions
              }

              awarenessChakra={
                awarenessChakra
              }

              dotPositions={
                dotPositions
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

                width: 70,

                height: 430,
              }}
            >

<ChakraSystem

  awareness={
    awarenessChakra
  }

scores={

  Object.fromEntries(

    Object.entries(
      energy?.chakras || {}
    ).map(
      ([k, v]) => [

        k,

        {
          score:
            Number(v),
        },
      ]
    )
  ) as Record<
    string,
    { score: number }
  >
}

  chakraManifestations={
    userContext
      ?.chakraManifestations || {}
  }

  selectedChakra={
    selectedChakra
  }

  onChakraPress={
    handleChakraPress
  }
/>

            </View>

          </View>

          {/* 🌌 OVERLAY */}

          <View

            pointerEvents="box-none"

            style={
              styles.overlay
            }
          >

            {/* 🌑 DISTORTION TOUCHES */}

            {dotPositions.map(
              (dot: any, i: number) => (

                <Pressable

                  key={i}

                  onPress={() => {

                    setSelectedChakra(null);

                    setSelectedDistortion(

                      selectedDistortion === i

                        ? null

                        : i
                    );
                  }}

style={{

  position:
    "absolute",

width: 60,
height: 60,

left:
  dot.x - 30,

top:
  dot.y - 30,

borderRadius: 30,

  zIndex: 90,
}}
                />
              )
            )}

            {/* ✨ CHAKRA LABEL */}           

{selectedChakra &&
 chakraInsight && ( 

 <Pressable

  onPress={() =>
    setSelectedChakra(null)
  }

  style={{

    position:
      "absolute",

    left: 210,

    top:

      (
        chakraY[
          selectedChakra
        ] || 180
      ) + 32,

    maxWidth: 180,

    backgroundColor:
      "rgba(0,0,0,0.22)",

    padding: 10,

    borderRadius: 14,

zIndex: 999,
elevation: 999,
  }}
>

  <Text

    style={{

      color:
        "white",

      fontSize: 10.5,

      lineHeight: 16,

      opacity: 0.92,
    }}
  >

    {chakraInsight}

  </Text>

</Pressable>
            )}

{/* 🌑 DISTORTION REFLECTION */}

{selectedDistortion !== null &&
  dotPositions[selectedDistortion] && (

 <Pressable

  onPress={() =>
    setSelectedDistortion(null)
  }

  style={{

    position: "absolute",

    left:
      dotPositions[
        selectedDistortion
      ].side === "left"

        ? dotPositions[
            selectedDistortion
          ].x - 150

        : dotPositions[
            selectedDistortion
          ].x + 20,

    top:
      dotPositions[
        selectedDistortion
      ].y - 12,

    width: 130,

zIndex: 999,
elevation: 999,
  }}
>

  <Text
    style={{

      color:
        "rgba(255,255,255,0.88)",

      fontSize: 10.5,

      lineHeight: 16,

      fontWeight: "300",

      letterSpacing: 0.2,

      opacity: 0.82,

      textAlign:
        dotPositions[
          selectedDistortion
        ].side === "left"

          ? "right"

          : "left",

      textShadowColor:
        "rgba(0,0,0,0.35)",

      textShadowRadius: 8,
    }}
  >

    {

      distortionList[
        selectedDistortion
      ]?.mirror_question || ""

    }

  </Text>

</Pressable>
)}

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

      justifyContent:
        "center",

      alignItems:
        "center",

      overflow:
        "visible",
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

      zIndex: 10,
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

  ...StyleSheet
    .absoluteFillObject,

  justifyContent:
    "center",

  alignItems:
    "center",

  paddingTop: 135,

  zIndex: 50,
},

    overlay: {

      ...StyleSheet
        .absoluteFillObject,

      zIndex: 60,

      pointerEvents:
        "box-none",
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

  });