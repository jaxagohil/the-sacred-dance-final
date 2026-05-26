// guidance/FloatingWhispers.tsx

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Colors,
  Fonts,
  Opacity,
  Radius,
} from "../../constants/theme";

import {
  GUIDE_TYPES,
  getGuideConfig,
} from "./guideConfig";

const { width } =
  Dimensions.get("window");

/*
 * --------------------------------------------------------
 * 🌌 TIMING
 * --------------------------------------------------------
 */

const ROTATION_INTERVAL =
  5200;

const SILENCE_DURATION =
  1400;

/*
 * --------------------------------------------------------
 * 🌌 COMPONENT
 * --------------------------------------------------------
 */

export default function FloatingWhispers({

  whispers = [],

  intensity = 0.5,

}: any) {

  /*
   * --------------------------------------------------------
   * 🌫️ EMPTY FIELD
   * --------------------------------------------------------
   */

  if (!whispers?.length) {

    return null;
  }

  /*
   * --------------------------------------------------------
   * 🌊 ACTIVE WINDOW
   * --------------------------------------------------------
   */

  const [
    visibleWhispers,

    setVisibleWhispers,

  ] = useState<any[]>([]);

  const [
    cycle,

    setCycle,

  ] = useState(0);

  const [
    inSilence,

    setInSilence,

  ] = useState(false);

  /*
   * --------------------------------------------------------
   * 🌌 ROTATING SET
   * --------------------------------------------------------
   */

  const rotatingWhispers =
    useMemo(() => {

      if (!whispers.length) {

        return [];
      }

      const startIndex =

        cycle % whispers.length;

      return [

        whispers[startIndex],

        whispers[
          (startIndex + 1)
          % whispers.length
        ],

        whispers[
          (startIndex + 2)
          % whispers.length
        ],

      ].filter(Boolean);

    }, [

      whispers,

      cycle,
    ]);

  /*
   * --------------------------------------------------------
   * 🌊 ORCHESTRATION LOOP
   * --------------------------------------------------------
   */

  useEffect(() => {

    setVisibleWhispers(
      rotatingWhispers
    );

    const timer =
      setTimeout(() => {

        setInSilence(true);

        setTimeout(() => {

          setCycle(
            (prev) => prev + 1
          );

          setInSilence(false);

        }, SILENCE_DURATION);

      }, ROTATION_INTERVAL);

    return () => {

      clearTimeout(timer);
    };

  }, [rotatingWhispers]);

  /*
   * --------------------------------------------------------
   * 🌫️ SILENCE
   * --------------------------------------------------------
   */

  if (inSilence) {

    return null;
  }

  /*
   * --------------------------------------------------------
   * 🌌 RENDER
   * --------------------------------------------------------
   */

  return (

    <View style={styles.container}>

      {visibleWhispers.map(
        (
          whisper: any,
          index: number
        ) => (

          <FloatingWhisperItem
            key={
              whisper.id
                || index
            }

            whisper={whisper}

            index={index}

            intensity={intensity}
          />
        )
      )}

    </View>
  );
}

/*
 * --------------------------------------------------------
 * 🌌 WHISPER ITEM
 * --------------------------------------------------------
 */

function FloatingWhisperItem({

  whisper,

  intensity,

  index,

}: any) {

  /*
   * --------------------------------------------------------
   * 🌸 GUIDE CONFIG
   * --------------------------------------------------------
   */

  const guideType =

    whisper.guide
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
   * 🌊 ANIMATION VALUES
   * --------------------------------------------------------
   */

  const opacity =
    useRef(

      new Animated.Value(0)

    ).current;

  const translateY =
    useRef(

      new Animated.Value(10)

    ).current;

  const floating =
    useRef(

      new Animated.Value(0)

    ).current;

  /*
   * --------------------------------------------------------
   * ✨ START ANIMATION
   * --------------------------------------------------------
   */

  useEffect(() => {

    /*
     * 🌌 FADE IN
     */

    Animated.parallel([

      Animated.timing(opacity, {

        toValue:

          isCosmic
            ? 0.92 * intensity
            : 0.58 * intensity,

        duration:
          2400,

        useNativeDriver: true,
      }),

      Animated.timing(translateY, {

        toValue: 0,

        duration:
          2400,

        useNativeDriver: true,
      }),

    ]).start();

    /*
     * 🌊 FLOATING LOOP
     */

    Animated.loop(

      Animated.sequence([

        Animated.timing(floating, {

          toValue: 1,

          duration:
            3200 +
            index * 200,

          useNativeDriver: true,
        }),

        Animated.timing(floating, {

          toValue: 0,

          duration:
            3200 +
            index * 180,

          useNativeDriver: true,
        }),
      ])

    ).start();

  }, []);

  /*
   * --------------------------------------------------------
   * 🌌 FLOAT MOTION
   * --------------------------------------------------------
   */

  const floatingY =

    floating.interpolate({

      inputRange: [0, 1],

      outputRange: [-6, 6],
    });

  /*
   * --------------------------------------------------------
   * 🌌 POSITIONING
   * --------------------------------------------------------
   */

  const top =
    whisper.top
    ?? (50 + index * 54);

  /*
   * --------------------------------------------------------
   * 🌌 RENDER
   * --------------------------------------------------------
   */

  return (

    <Animated.View
      style={[

        styles.whisper,

        {

          top,

          left:
            whisper.left,

          right:
            whisper.right,

          opacity,

          transform: [

            {
              translateY:
                Animated.add(
                  translateY,
                  floatingY
                ),
            },
          ],
        },
      ]}
    >

      <Text
        style={[

          styles.text,

          {

            color:
              config.fontColor,

            opacity:

              isCosmic
                ? 0.95
                : Opacity.medium,

            fontFamily:

              isCosmic
                ? Fonts.regular
                : Fonts.light,

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
                ? 10
                : 0,
          },
        ]}
      >
        {whisper.text}
      </Text>

    </Animated.View>
  );
}

/*
 * --------------------------------------------------------
 * 🌌 STYLES
 * --------------------------------------------------------
 */

const styles = StyleSheet.create({

  container: {

    width: width,

    height: 280,

    position: "absolute",

    top: 0,
    left: 0,

    justifyContent: "center",
    alignItems: "center",
  },

  whisper: {

    position: "absolute",

    paddingHorizontal: 14,

    paddingVertical: 8,

    borderRadius:
      Radius.pill,

    backgroundColor:
      Colors.whisperBackground,

    borderWidth: 1,

    borderColor:
      Colors.whisperBorder,
  },

  text: {

    fontSize: 11,

    fontFamily:
      Fonts.light,

    textAlign: "center",

    letterSpacing: 0.3,
  },
});