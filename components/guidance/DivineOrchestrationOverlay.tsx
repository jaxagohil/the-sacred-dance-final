// guidance/DivineOrchestrationOverlay.tsx

import React, {
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  Animated,
  Easing,
  View,
} from "react-native";

import {
  Colors,
} from "../../constants/theme";

import FloatingWhispers from "./FloatingWhispers";

import OrchestrationFragments from "./OrchestrationFragments";

import {
  GUIDE_TYPES,
} from "./guideConfig";

/*
 * --------------------------------------------------------
 * 🌌 STAR POSITIONS
 * --------------------------------------------------------
 */

const stars = [

  /*
   * ✨ FOREGROUND
   */

  {
    id: "1",

    top: 34,
    left: 80,

    size: 3.5,

    depth: 0.9,
  },

  {
    id: "2",

    top: 62,
    right: 52,

    size: 4,

    depth: 1,
  },

  {
    id: "3",

    top: 120,
    left: 34,

    size: 5,

    depth: 0.75,
  },

  /*
   * 🌌 MID DEPTH
   */

  {
    id: "4",

    top: 180,
    right: 90,

    size: 3.5,

    depth: 0.82,
  },

  {
    id: "5",

    top: 210,
    left: 120,

    size: 3,

    depth: 0.62,
  },

  /*
   * 🌫️ DISTANT FIELD
   */

  {
    id: "6",

    top: 18,
    right: 18,

    size: 2,

    depth: 0.35,
  },

  {
    id: "7",

    top: 260,
    left: 28,

    size: 2,

    depth: 0.32,
  },

  {
    id: "8",

    top: 142,
    right: 14,

    size: 1.6,

    depth: 0.28,
  },

  /*
   * ✨ ANCIENT DISTANT STARS
   */

  {
    id: "9",

    top: 88,
    left: 180,

    size: 6,

    depth: 0.12,
  },

  {
    id: "10",

    top: 220,
    right: 160,

    size: 7,

    depth: 0.08,
  },
];

/*
 * --------------------------------------------------------
 * 🌌 HELPERS
 * --------------------------------------------------------
 */

function resolveBreathingDuration(
  nervousSystem: string
) {

  switch (nervousSystem) {

    case "overwhelmed":

      return 8200;

    case "contracted":

      return 6800;

    case "expanded":

      return 4600;

    default:

      return 5600;
  }
}

function resolveGuideAtmosphere(
  guide: string
) {

  switch (guide) {

    case GUIDE_TYPES.HEART:

      return {

        shimmerBoost:
          0.12,

        glowMax:
          0.08,

        drift:
          1.4,
      };

    case GUIDE_TYPES.STRUCTURE:

      return {

        shimmerBoost:
          0.06,

        glowMax:
          0.05,

        drift:
          0.8,
      };

    default:

      return {

        shimmerBoost:
          0.22,

        glowMax:
          0.14,

        drift:
          2,
      };
  }
}

/*
 * --------------------------------------------------------
 * 🌌 COMPONENT
 * --------------------------------------------------------
 */

export default function DivineOrchestrationOverlay({

  field,

  initialWhispers = [],

  isTyping = false,

  onForegroundGuideChange,

}: any) {

  /*
   * --------------------------------------------------------
   * 🌌 FIELD STATES
   * --------------------------------------------------------
   */

const activeWhispers =

  field?.atmosphericWhispers
    ?.length > 0

    ? field?.atmosphericWhispers

    : initialWhispers;

const showWhispers =
  activeWhispers?.length > 0;

  const showFragments =

    field?.fragmentSequence
      ?.length > 0;

  /*
   * --------------------------------------------------------
   * 🌊 FIELD
   * --------------------------------------------------------
   */

  const fieldIntensity =

    field?.orchestrationIntensity
      || 0.5;

  const atmosphere =

    field?.emotionalField
      || "quiet";

  const foregroundGuide =

    field?.foregroundGuide
      || GUIDE_TYPES.COSMIC;

  const nervousSystem =

    field?.nervousSystem
      || "regulated";

  /*
   * --------------------------------------------------------
   * 🌿 ATMOSPHERE PROFILE
   * --------------------------------------------------------
   */

  const profile =
    useMemo(() => {

      return resolveGuideAtmosphere(
        foregroundGuide
      );

    }, [foregroundGuide]);

  /*
   * --------------------------------------------------------
   * 🌊 BREATHING SPEED
   * --------------------------------------------------------
   */

  const breathingDuration =
    resolveBreathingDuration(
      nervousSystem
    );

  /*
   * --------------------------------------------------------
   * 🌌 STAR OPACITY
   * --------------------------------------------------------
   */

  const starOpacity =

    (
      0.32 +

      (
        fieldIntensity * 0.38
      )

    );

  /*
   * --------------------------------------------------------
   * 🌫️ FIELD BREATHING
   * --------------------------------------------------------
   */

  const breathing =
    useRef(

      new Animated.Value(0)

    ).current;

  /*
   * --------------------------------------------------------
   * ✨ STAR SHIMMERS
   * --------------------------------------------------------
   */

  const starShimmers =
    useRef(

      stars.map(
        () => new Animated.Value(0)
      )

    ).current;

  /*
   * --------------------------------------------------------
   * 🌌 STAR DRIFTS
   * --------------------------------------------------------
   */

  const starDrifts =
    useRef(

      stars.map(
        () => ({
          x:
            new Animated.Value(0),

          y:
            new Animated.Value(0),
        })
      )

    ).current;

  /*
   * --------------------------------------------------------
   * 🌌 START BREATHING
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
                breathingDuration,

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

              toValue: 0,

              duration:
                breathingDuration,

              easing:
                Easing.inOut(
                  Easing.sin
                ),

              useNativeDriver: true,
            }
          ),
        ])
      );

    loop.start();

    return () => {

      loop.stop();
    };

  }, [

    breathingDuration,
  ]);

  /*
   * --------------------------------------------------------
   * 🌌 STAR SHIMMERING
   * --------------------------------------------------------
   */

  useEffect(() => {

    const animations =

      starShimmers.map(
        (
          shimmer,
          index
        ) =>

          Animated.loop(

            Animated.sequence([

              Animated.delay(

                1200 * index +

                (
                  Math.random()
                  * 1200
                )
              ),

              Animated.timing(
                shimmer,

                {

                  toValue: 1,

                  duration:

                    1200 +

                    (
                      index * 240
                    ),

                  easing:
                    Easing.inOut(
                      Easing.sin
                    ),

                  useNativeDriver: true,
                }
              ),

              Animated.timing(
                shimmer,

                {

                  toValue: 0,

                  duration:

                    1800 +

                    (
                      index * 340
                    ),

                  easing:
                    Easing.inOut(
                      Easing.sin
                    ),

                  useNativeDriver: true,
                }
              ),
            ])
          )
      );

    const shimmerField =

      Animated.parallel(
        animations
      );

    shimmerField.start();

    return () => {

      shimmerField.stop();
    };

  }, []);

  /*
   * --------------------------------------------------------
   * 🌌 STAR DRIFT FIELD
   * --------------------------------------------------------
   */

  useEffect(() => {

    const loops =

      starDrifts.map(

        (
          drift,
          index
        ) => {

          const distance =

            22 +

            (
              index * 4
            );

const duration =

  18000 +

  (
    index * 2400
  );

          return Animated.loop(

            Animated.sequence([

              Animated.parallel([

                Animated.timing(
                  drift.x,

                  {

                    toValue:
                      distance,

                    duration,

                    easing:
                      Easing.inOut(
                        Easing.sin
                      ),

                    useNativeDriver: true,
                  }
                ),

                Animated.timing(
                  drift.y,

                  {

                    toValue:
                      -distance,

                    duration,

                    easing:
                      Easing.inOut(
                        Easing.sin
                      ),

                    useNativeDriver: true,
                  }
                ),
              ]),

              Animated.parallel([

                Animated.timing(
                  drift.x,

                  {

                    toValue:
                      -distance,

                    duration,

                    easing:
                      Easing.inOut(
                        Easing.sin
                      ),

                    useNativeDriver: true,
                  }
                ),

                Animated.timing(
                  drift.y,

                  {

                    toValue:
                      distance,

                    duration,

                    easing:
                      Easing.inOut(
                        Easing.sin
                      ),

                    useNativeDriver: true,
                  }
                ),
              ]),
            ])
          );
        }
      );

    const field =
      Animated.parallel(
        loops
      );

    field.start();

    return () => {

      field.stop();
    };

  }, []);

  /*
   * --------------------------------------------------------
   * 🌫️ FIELD GLOW
   * --------------------------------------------------------
   */

  const glowOpacity =

    breathing.interpolate({

      inputRange: [0, 1],

      outputRange: [

        atmosphere ===
        "quiet"

          ? 0

          : 0.02,

        profile.glowMax
        * fieldIntensity
        * (
          isTyping
            ? 0.6
            : 1
        ),
      ],
    });

  /*
   * --------------------------------------------------------
   * 🌊 STAR DRIFT
   * --------------------------------------------------------
   */

  const starDrift =

    breathing.interpolate({

      inputRange: [0, 1],

      outputRange: [

        -profile.drift,

        profile.drift,
      ],
    });

  /*
   * --------------------------------------------------------
   * 🌌 RENDER
   * --------------------------------------------------------
   */

  return (

    <View
      style={{

        height: 270,

        position: "relative",

        overflow: "hidden",

        backgroundColor:
          "black",
      }}
    >

      {/* ------------------------------------------------ */}
      {/* 🌫️ FIELD BREATH */}
      {/* ------------------------------------------------ */}

      <Animated.View
        style={{

          position: "absolute",

          top: -120,
          left: -20,

          width: 460,
          height: 460,

          borderRadius: 999,

          backgroundColor:
            "black",

          opacity:
            glowOpacity,

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

      {/* ------------------------------------------------ */}
      {/* ✨ STAR FIELD */}
      {/* ------------------------------------------------ */}

      {stars.map((
        star,
        index
      ) => (

        <Animated.View
          key={star.id}
          style={{

            position: "absolute",

            top: star.top,

            left: star.left,

            right: star.right,

            width: star.size,

            height: star.size,

            borderRadius: 999,

            backgroundColor:
              Colors.starBright,

            opacity:

              starShimmers[
                index
              ].interpolate({

                inputRange: [0, 1],

                outputRange: [

                  (
                    starOpacity
                    * star.depth
                  ),

                  (
                    (
                      starOpacity
                      * star.depth
                    )

                    +

                    profile.shimmerBoost
                  ),
                ],
              }),

            transform: [

              {
                translateX:

                  Animated.multiply(

                    starDrifts[
                      index
                    ].x,

                    Math.max(
                      star.depth,
                      0.35
                    )
                  ),
              },

              {
                translateY:

                  Animated.add(

                    Animated.multiply(

                      starDrifts[
                        index
                      ].y,

                      Math.max(
                        star.depth,
                        0.35
                      )
                    ),

                    Animated.multiply(

                      starDrift,

                      star.depth
                    )
                  ),
              },

              {
  rotate: starShimmers[
    index
  ].interpolate({

    inputRange: [0, 1],

    outputRange: [
      "0deg",
      "8deg",
    ],
  }),
},

              {
                scale:

                  starShimmers[
                    index
                  ].interpolate({

                    inputRange: [0, 1],

                    outputRange:
                      [1, 1.45],
                  }),
              },
            ],
          }}
        />

      ))}

      {/* ------------------------------------------------ */}
      {/* 🌊 FLOATING WHISPERS */}
      {/* ------------------------------------------------ */}

      {showWhispers && (

        <View
          style={{

            position: "absolute",

            width: "100%",
            height: "100%",
          }}
        >

          <FloatingWhispers

whispers={
  activeWhispers
}

            intensity={
              fieldIntensity
            }

            guide={
              foregroundGuide
            }

            nervousSystem={
              nervousSystem
            }
          />

        </View>
      )}

      {/* ------------------------------------------------ */}
      {/* ✨ ORCHESTRATION */}
      {/* ------------------------------------------------ */}

      {showFragments && (

        <View
          style={{

            position: "absolute",

            width: "100%",
            height: "100%",

            zIndex: 20,

            pointerEvents: "none",
          }}
        >

          <OrchestrationFragments

            sequence={

              field
                ?.fragmentSequence
            }

            onForegroundGuideChange={
  onForegroundGuideChange
}

            intensity={
              fieldIntensity
            }

            pacing={
              field?.pacing
            }

            silenceWindow={

              field
                ?.silenceWindow
            }
          />

        </View>
      )}

    </View>
  );
}