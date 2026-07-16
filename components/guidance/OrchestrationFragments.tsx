// guidance/OrchestrationFragments.tsx

import React, {
  useEffect,
  useRef,
  useState
} from "react";

import {
  Animated,
  Easing,
  Text,
  View,
} from "react-native";

import {
  Fonts,
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

const LINE_FADE_IN =
  2600;

const LINE_FADE_OUT =
  9200;

const SILENCE_WINDOW =
  14000;

/*
 * --------------------------------------------------------
 * 🌌 SINGLE LINE
 * --------------------------------------------------------
 */

function ConversationLine({

  line,

  index,

}: any) {

  /*
   * --------------------------------------------------------
   * 🌌 GUIDE
   * --------------------------------------------------------
   */

  const guideType =

    line?.guide
    || GUIDE_TYPES.COSMIC;

  const config =

    getGuideConfig(
      guideType
    );

  const guideColor =

    config?.fontColor
    || "white";

  /*
   * --------------------------------------------------------
   * 🌿 ROLE
   * --------------------------------------------------------
   */

  const role =

    line?.role
    || "recognition";

  /*
   * --------------------------------------------------------
   * 🌌 MOTION
   * --------------------------------------------------------
   */

  const opacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const translateY =
    useRef(
      new Animated.Value(12)
    ).current;

  const breathing =
    useRef(
      new Animated.Value(0.985)
    ).current;

  /*
   * --------------------------------------------------------
   * 🌌 DURATION
   * --------------------------------------------------------
   */

  const wordCount =

    line?.text
      ?.split?.(" ")
      ?.length || 0;

  const lineDuration =

    12000 +

    (
      wordCount * 220
    );

  /*
   * --------------------------------------------------------
   * 🌊 OPACITY LAYERS
   * --------------------------------------------------------
   */

const layeredOpacity = 0.96;

  /*
   * --------------------------------------------------------
   * 🌿 ROLE ENERGY
   * --------------------------------------------------------
   */

  const roleSpacing =

    role === "widening"
      ? 0.55

      : role === "grounding"
        ? 0.15

        : 0.3;

  /*
   * --------------------------------------------------------
   * 🌌 ENTRY
   * --------------------------------------------------------
   */

  useEffect(() => {

    Animated.parallel([

      Animated.timing(opacity, {

        toValue:
          layeredOpacity,

        duration:
          LINE_FADE_IN,

        easing:
          Easing.inOut(
            Easing.sin
          ),

        useNativeDriver: true,
      }),

      Animated.timing(translateY, {

        toValue:
          role === "widening"
            ? -4
            : 0,

        duration:
          LINE_FADE_IN,

        easing:
          Easing.inOut(
            Easing.sin
          ),

        useNativeDriver: true,
      }),

    ]).start();

    /*
     * --------------------------------------------------------
     * 🌌 BREATHING
     * --------------------------------------------------------
     */

    Animated.loop(

      Animated.sequence([

        Animated.timing(
          breathing,

          {

            toValue:
              1,

            duration:
              5200,

            easing:
              Easing.inOut(
                Easing.sin
              ),

            useNativeDriver: true,
          }
        ),

        Animated.timing(
          breathing,

          {

            toValue:
              0.985,

            duration:
              5200,

            easing:
              Easing.inOut(
                Easing.sin
              ),

            useNativeDriver: true,
          }
        ),

      ])

    ).start();

    /*
     * --------------------------------------------------------
     * 🌫️ EXIT
     * --------------------------------------------------------
     */

    const exitTimer =
      setTimeout(() => {

        Animated.parallel([

          Animated.timing(opacity, {

            toValue: 0,

            duration:
              LINE_FADE_OUT,

            easing:
              Easing.inOut(
                Easing.sin
              ),

            useNativeDriver: true,
          }),

          Animated.timing(translateY, {

            toValue:
              -8,

            duration:
              LINE_FADE_OUT,

            easing:
              Easing.inOut(
                Easing.sin
              ),

            useNativeDriver: true,
          }),

        ]).start();

      }, lineDuration);

    return () => {

      clearTimeout(
        exitTimer
      );
    };

  }, []);

  /*
   * --------------------------------------------------------
   * 🌊 RENDER
   * --------------------------------------------------------
   */

  return (

    <Animated.View
      style={{

        alignSelf: "center",

      maxWidth: "92%",

opacity,

        transform: [

          {
            translateY,
          },

          {
            scale:
              breathing,
          },
        ],

        marginBottom:

          8 +

          roleSpacing * 6,

        width: "100%",
      }}
    >

      <Text
        style={{

          color:
            guideColor,

  fontFamily:
  Fonts.orchestration,

          fontSize: 16,

          lineHeight: 28,

          textAlign: "center",

          letterSpacing: 0,

          textShadowColor:
            guideColor,

          textShadowOffset: {
            width: 0,
            height: 0,
          },

textShadowRadius:

  index === 0

    ? (
        role === "widening"
          ? 8
          : 5
      )

    : 4,

opacity:

  index === 0
    ? 0.94
    : layeredOpacity,
        }}
      >
        {line?.text}
      </Text>

    </Animated.View>
  );
}

/*
 * --------------------------------------------------------
 * 🌌 MAIN
 * --------------------------------------------------------
 */

export default function OrchestrationFragments({

  sequence = [],

  onForegroundGuideChange,

  showFragments = true,

}: any) {

  /*
   * --------------------------------------------------------
   * 🌌 EMPTY
   * --------------------------------------------------------
   */

if (

  !sequence?.length ||

  !showFragments

) {

  return null;
}

  /*
   * --------------------------------------------------------
   * 🌊 ACTIVE
   * --------------------------------------------------------
   */

  const [

    activeLines,

    setActiveLines,

  ] = useState<any[]>([]);

  const currentGuideRef =
  useRef(null);
      

  /*
   * --------------------------------------------------------
   * 🌌 LOOP
   * --------------------------------------------------------
   */

  useEffect(() => {

    let mounted = true;

    let currentIndex = 0;

    /*
     * --------------------------------------------------------
     * 🌊 RUN
     * --------------------------------------------------------
     */

    const runConversation = () => {

      if (!mounted) {

        return;
      }

      /*
       * ----------------------------------------------------
       * 🌫️ RESET
       * ----------------------------------------------------
       */

      if (
        currentIndex >=
        sequence.length
      ) {

        setTimeout(() => {

          currentIndex = 0;

          runConversation();

        }, SILENCE_WINDOW);

        return;
      }

      /*
       * ----------------------------------------------------
       * 🌌 ENTRY
       * ----------------------------------------------------
       */

      const entry =

        sequence[
          currentIndex
        ];

      const line =

        entry?.fragment

        || entry;

      /*
       * ----------------------------------------------------
       * 🌊 LAYERED CONVERSATION
       * ----------------------------------------------------
       */

setActiveLines((previous: any[]) => {

  /*
   * ----------------------------------------------------
   * 🌌 SYNC GUIDE WITH VISIBLE LINE
   * ----------------------------------------------------
   */

  if (
    line?.guide &&
    line.guide !==
      currentGuideRef.current
  ) {

    currentGuideRef.current =
      line.guide;

    onForegroundGuideChange?.(
      line.guide
    );
  }

  return [

    line,
  ];
});

      /*
       * ----------------------------------------------------
       * 🌫️ REMOVE
       * ----------------------------------------------------
       */

      const wordCount =

        line?.text
          ?.split?.(" ")
          ?.length || 0;

      const lineDuration =

        12000 +

        (
          wordCount * 220
        );

      /*
       * ----------------------------------------------------
       * 🌌 NEXT
       * ----------------------------------------------------
       */

      currentIndex++;

      /*
       * ----------------------------------------------------
       * 🌊 CONVERSATIONAL BREATH
       * ----------------------------------------------------
       */

      const nextDelay =

        9200

        +

        (
          wordCount * 260
        );

      setTimeout(

        runConversation,

        nextDelay
      );
    };

    /*
     * --------------------------------------------------------
     * 🌌 START
     * --------------------------------------------------------
     */

    runConversation();

    return () => {

      mounted = false;
    };

  }, []);

  /*
   * --------------------------------------------------------
   * 🌊 RENDER
   * --------------------------------------------------------
   */

  return (

    <View
      pointerEvents="none"
      style={{

        position: "absolute",

        top: "30%",

        width: "100%",

        alignItems: "center",

        paddingHorizontal: 38,
      }}
    >

      <Animated.View
        style={{

          width: "100%",

          alignItems: "center",
        }}
      >

{activeLines.map(

  (
    line,
    index
  ) => (

    <ConversationLine
      key={`${line.text}-${index}`}

      line={line}

      index={index}

      isActive={
        index ===
        activeLines.length - 1
      }
    />
  )
)}

      </Animated.View>

    </View>
  );
}