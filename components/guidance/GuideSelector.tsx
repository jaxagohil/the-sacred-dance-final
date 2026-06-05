// guidance/GuideSelector.tsx

import React, {
  useEffect,
  useRef
} from "react";

import {
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Fonts,
  Radius,
} from "../../constants/theme";

import {
  GUIDE_TYPES,
  getGuideConfig,
} from "./guideConfig";

/*
 * --------------------------------------------------------
 * 🌌 GUIDE TYPES
 * --------------------------------------------------------
 */

const guides = [

  {
    id: "1",

    type:
      GUIDE_TYPES.HEART,
  },

  {
    id: "2",

    type:
      GUIDE_TYPES.STRUCTURE,
  },

  {
    id: "3",

    type:
      GUIDE_TYPES.COSMIC,
  },
];

/*
 * --------------------------------------------------------
 * 🌌 COMPONENT
 * --------------------------------------------------------
 */

export default function GuideSelector({

  activeGuide = null,

  activeFieldGuide =
    "cosmic",

  onSelectGuide,

  guideProfiles = {},

}: any) {

  return (

    <View
      style={{

        flexDirection: "row",

        justifyContent: "center",

        alignItems: "center",

        gap: 10,

        marginTop: 5,

        marginBottom: 5,
      }}
    >

      {guides.map((guide) => (

        <GuidePill
          key={guide.id}

          guideType={
            guide.type
          }

          guideProfile={
            guideProfiles[
              guide.type
            ]
          }

          activeGuide={
            activeGuide
          }

          activeFieldGuide={
            activeFieldGuide
          }

          onPress={() => {

            onSelectGuide?.(
              guide.type
            );
          }}
        />

      ))}

    </View>
  );
}

/*
 * --------------------------------------------------------
 * 🌌 GUIDE PILL
 * --------------------------------------------------------
 */

function GuidePill({

  guideType,

  guideProfile,

  activeGuide,

  activeFieldGuide,

  onPress,

}: any) {

  /*
   * --------------------------------------------------------
   * 🌌 CONFIG
   * --------------------------------------------------------
   */

  const config =
    getGuideConfig(
      guideType
    );

  const guideName =

    guideProfile?.name

    || config?.label

    || guideType;

  const isCosmic =

    guideType ===
    GUIDE_TYPES.COSMIC;

  const isActive =

    activeGuide ===
    guideType;

  const isFieldActive =

    activeFieldGuide ===
    guideType;

  /*
   * --------------------------------------------------------
   * 🌊 VALUES
   * --------------------------------------------------------
   */

  const glow =
    useRef(

      new Animated.Value(
        isActive
          ? 1
          : 0
      )

    ).current;

  const breathing =
    useRef(

      new Animated.Value(0)

    ).current;

  /*
   * --------------------------------------------------------
   * 🌌 ATMOSPHERE
   * --------------------------------------------------------
   */

 const atmosphere = {

  activeOpacity: 1,

  inactiveOpacity: 0.44,

  glow: 10,

  duration: 12000,
};

  /*
   * --------------------------------------------------------
   * 🌌 ACTIVE TRANSITION
   * --------------------------------------------------------
   */

  useEffect(() => {

    Animated.timing(glow, {

      toValue:
        isActive
          ? 1
          : 0,

      duration: 1600,

      easing:
        Easing.inOut(
          Easing.sin
        ),

      useNativeDriver: false,
    }).start();

  }, [isActive]);

  /*
   * --------------------------------------------------------
   * 🌊 BREATHING
   * --------------------------------------------------------
   */

  useEffect(() => {

    const loop =

      Animated.loop(

        Animated.sequence([

          Animated.timing(
            breathing,

            {

              toValue: 1,

              duration:
                atmosphere.duration,

              easing:
                Easing.inOut(
                  Easing.sin
                ),

              useNativeDriver: false,
            }
          ),

          Animated.timing(
            breathing,

            {

              toValue: 0,

              duration:
                atmosphere.duration,

              easing:
                Easing.inOut(
                  Easing.sin
                ),

              useNativeDriver: false,
            }
          ),
        ])
      );

    loop.start();

    return () => {

      loop.stop();
    };

  }, []);

  /*
   * --------------------------------------------------------
   * 🌌 OPACITY
   * --------------------------------------------------------
   */

const opacity =

  isFieldActive
    ? 1
    : 0.62;

  /*
   * --------------------------------------------------------
   * 🌫️ SCALE
   * --------------------------------------------------------
   */

  const scale =

    breathing.interpolate({

      inputRange: [0, 1],

      outputRange:

isFieldActive

  ? [1, 1.05]

  : [1, 1],
  
    });

  /*
   * --------------------------------------------------------
   * 🌌 RENDER
   * --------------------------------------------------------
   */

  return (

    <TouchableOpacity
      activeOpacity={0.86}

      onPress={onPress}
    >

      <Animated.View
        style={{

          paddingHorizontal: 12,

          paddingVertical: 6,

          borderRadius:
            Radius.pill,

          overflow: "hidden",

          backgroundColor:

isFieldActive

  ? "rgba(255,255,255,0.05)"

  : "rgba(255,255,255,0.008)",

borderWidth:

  isFieldActive
    ? 1
    : isActive
      ? 0.8
      : 0.5,

          borderColor:

isFieldActive

  ? `${config.fontColor}52`

  : isActive

    ? "rgba(255,255,255,0.18)"

    : "rgba(255,255,255,0.04)",

          opacity:
            opacity,

          transform: [
            {
              scale,
            },
          ],
        }}
      >

        {/* -------------------------------------------- */}
        {/* 🌌 FIELD RESONANCE */}
        {/* -------------------------------------------- */}

        {

          isFieldActive && (

            <Animated.View
              style={{

                position: "absolute",

                width: "170%",
                height: "240%",

                borderRadius: 999,

                alignSelf: "center",

                backgroundColor:
                  `${config.fontColor}08`,

                opacity:

                  breathing.interpolate({

                    inputRange: [0, 1],

                    outputRange:
                       [0.16, 0.32],
                  }),

                transform: [

                  {

                    scale:

                      breathing.interpolate({

                        inputRange: [0, 1],

                        outputRange:
                          [0.94, 1.08],
                      }),
                  },
                ],
              }}
            />

          )
        }

        {/* -------------------------------------------- */}
        {/* 🌊 TEXT */}
        {/* -------------------------------------------- */}

        <Text
          style={{

            color:
              config.fontColor,

            opacity:

              isFieldActive
                ? 1
                : 0.58,

fontFamily:
  Fonts.light,

            fontSize: 10,

            textAlign: "center",

            letterSpacing: 0.5,

            textTransform:
              "lowercase",

            textShadowColor:
              config.fontColor,

            textShadowOffset: {
              width: 0,
              height: 0,
            },

textShadowRadius:

  isFieldActive

    ? 12

    : 1,
          }}
        >
          {guideName}
        </Text>

      </Animated.View>

    </TouchableOpacity>
  );
}