// guidance/GuideSelector.tsx

import React, {
  useEffect,
  useRef
} from "react";

import {
  Animated,
  Easing,
  Text,
  View
} from "react-native";

import {
  Fonts
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
  { id: "1", type: GUIDE_TYPES.COSMIC },
  { id: "2", type: GUIDE_TYPES.HEART },
  { id: "3", type: GUIDE_TYPES.STRUCTURE },
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

flexDirection: "column",
alignItems: "flex-start",
paddingLeft: 18,
justifyContent: "center",
gap: 0,
paddingTop: 10,
paddingBottom: 0,
marginTop: 0,
marginBottom: 0,
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

const opacity = 1;

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

<View>

<Animated.View
  style={{
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 2,
    opacity: 1,
  }}
>

        {/* -------------------------------------------- */}
        {/* 🌌 FIELD RESONANCE */}
        {/* -------------------------------------------- */}


        {/* -------------------------------------------- */}
        {/* 🌊 TEXT */}
        {/* -------------------------------------------- */}

<Text
  style={{
    color: config.fontColor,
    fontSize: 14,
    marginRight: 2,
  }}
>
  {guideType === GUIDE_TYPES.COSMIC
    ? "✧"
    : guideType === GUIDE_TYPES.HEART
    ? "♡"
    : "◈"}
</Text>

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
    </View>
  );
}