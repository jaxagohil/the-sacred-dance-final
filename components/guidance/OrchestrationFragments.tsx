// guidance/OrchestrationFragments.tsx

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Animated,
  Text,
  View,
} from "react-native";

import {
  Fonts,
  Opacity,
} from "../../constants/theme";

import {
  GUIDE_TYPES,
  getGuideConfig,
} from "./guideConfig";

/*
 * --------------------------------------------------------
 * 🌌 TIMING
 * --------------------------------------------------------
 */

const FADE_DURATION = 2200;

const HOLD_DURATION = 4200;

const SILENCE_DURATION = 1400;

/*
 * --------------------------------------------------------
 * 🌌 COMPONENT
 * --------------------------------------------------------
 */

export default function OrchestrationFragments({

  fragments = [],

  intensity = 0.5,

}: any) {

  /*
   * --------------------------------------------------------
   * 🌌 EMPTY FIELD
   * --------------------------------------------------------
   */

  if (!fragments?.length) {

    return null;
  }

  /*
   * --------------------------------------------------------
   * 🌊 ACTIVE FRAGMENT
   * --------------------------------------------------------
   */

  const [
    activeIndex,

    setActiveIndex,

  ] = useState(0);

  /*
   * --------------------------------------------------------
   * 🌫️ SILENCE WINDOW
   * --------------------------------------------------------
   */

  const [
    inSilence,

    setInSilence,

  ] = useState(false);

  /*
   * --------------------------------------------------------
   * ✨ CURRENT FRAGMENT
   * --------------------------------------------------------
   */

  const activeFragment =

    fragments[
      activeIndex
    ];

  /*
   * --------------------------------------------------------
   * 🌌 FIELD POSITIONS
   * --------------------------------------------------------
   */

const positions = [

  {
    top: 18,
    left: 22,
  },

  {
    top: 42,
    right: 24,
  },

  {
    top: 78,
    left: 34,
  },

  {
    top: 112,
    right: 30,
  },

  {
    top: 148,
    left: 18,
  },
];

  /*
   * --------------------------------------------------------
   * ✨ ACTIVE POSITION
   * --------------------------------------------------------
   */

  const activePosition =

    positions[
      activeIndex %
      positions.length
    ];

  /*
   * --------------------------------------------------------
   * 🌌 GUIDE CONFIG
   * --------------------------------------------------------
   */

  const guideType =

    activeFragment?.guide
      || GUIDE_TYPES.COSMIC;

  const config =
    getGuideConfig(
      guideType
    );

  const isCosmic =

    guideType ===
    GUIDE_TYPES.COSMIC;

  /*
   * --------------------------------------------------------
   * 🌊 ANIMATION
   * --------------------------------------------------------
   */

  const opacity =
    useRef(

      new Animated.Value(0)

    ).current;

  const translateY =
    useRef(

      new Animated.Value(8)

    ).current;

  const scale =
    useRef(

      new Animated.Value(0.985)

    ).current;

  /*
   * --------------------------------------------------------
   * 🌌 BREATHING
   * --------------------------------------------------------
   */

  const breathing =
    useMemo(() => {

      return Animated.loop(

        Animated.sequence([

          Animated.timing(scale, {

            toValue: 1,

            duration: 3200,

            useNativeDriver: true,
          }),

          Animated.timing(scale, {

            toValue: 0.985,

            duration: 3200,

            useNativeDriver: true,
          }),
        ])
      );

    }, []);

  /*
   * --------------------------------------------------------
   * 🌊 START BREATHING
   * --------------------------------------------------------
   */

  useEffect(() => {

    breathing.start();

    return () => {

      breathing.stop();
    };

  }, []);

  /*
   * --------------------------------------------------------
   * 🌌 ORCHESTRATION LOOP
   * --------------------------------------------------------
   */

  useEffect(() => {

    /*
     * --------------------------------------------------------
     * ✨ RESET
     * --------------------------------------------------------
     */

    opacity.setValue(0);

    translateY.setValue(8);

    /*
     * --------------------------------------------------------
     * 🌊 FADE IN
     * --------------------------------------------------------
     */

    Animated.parallel([

      Animated.timing(opacity, {

        toValue:

          isCosmic
            ? 0.96
            : 0.72 * intensity,

        duration:
          FADE_DURATION,

        useNativeDriver: true,
      }),

      Animated.timing(translateY, {

        toValue: 0,

        duration:
          FADE_DURATION,

        useNativeDriver: true,
      }),

    ]).start();

    /*
     * --------------------------------------------------------
     * 🌌 TRANSITION TIMER
     * --------------------------------------------------------
     */

    const timer =
      setTimeout(() => {

        /*
         * --------------------------------------------------------
         * 🌫️ ENTER SILENCE
         * --------------------------------------------------------
         */

        setInSilence(true);

        /*
         * --------------------------------------------------------
         * ✨ FADE OUT
         * --------------------------------------------------------
         */

        Animated.parallel([

          Animated.timing(opacity, {

            toValue: 0,

            duration: 1800,

            useNativeDriver: true,
          }),

          Animated.timing(translateY, {

            toValue: -6,

            duration: 1800,

            useNativeDriver: true,
          }),

        ]).start();

        /*
         * --------------------------------------------------------
         * 🌌 NEXT FRAGMENT
         * --------------------------------------------------------
         */

        setTimeout(() => {

          setActiveIndex(

            (prev: number) => (

              prev + 1

            ) % fragments.length
          );

          setInSilence(false);

        }, SILENCE_DURATION);

      }, HOLD_DURATION);

    return () => {

      clearTimeout(timer);
    };

  }, [

    activeIndex,

    fragments,

    intensity,
  ]);

  /*
   * --------------------------------------------------------
   * 🌫️ SILENCE WINDOW
   * --------------------------------------------------------
   */

  if (
    inSilence
  ) {

    return (

      <View
        style={{
          height: 72,
        }}
      />
    );
  }

  /*
   * --------------------------------------------------------
   * 🌌 RENDER
   * --------------------------------------------------------
   */

  return (

    <View
      style={{

        width: "100%",

        height: "100%",

        position: "relative",

        paddingHorizontal: 24,
      }}
    >

      <Animated.View
        style={{

          width: "62%",

          position: "absolute",

          top:
            activePosition.top,

          left:
            activePosition.left,

          right:
            activePosition.right,

          opacity,

          transform: [

            { translateY },

            { scale },
          ],
        }}
      >

        {/* ------------------------------------------------ */}
        {/* ✨ LIVE FRAGMENT */}
        {/* ------------------------------------------------ */}

        <Text
          style={{

            color:
              config.fontColor,

            fontFamily:

              isCosmic
                ? Fonts.regular
                : Fonts.light,

            fontSize:

              isCosmic
                ? 14
                : 12,

            lineHeight:

              isCosmic
                ? 24
                : 20,

            textAlign: "center",

            opacity:

              isCosmic
                ? 0.92
                : Opacity.medium,

            letterSpacing: 0.15,

            textShadowColor:

              isCosmic
                ? config.fontColor
                : "transparent",

            textShadowOffset: {
              width: 0,
              height: 0,
            },

            textShadowRadius:

              isCosmic
                ? 6
                : 0,
          }}
        >
          {activeFragment?.text}
        </Text>

      </Animated.View>

    </View>
  );
}