// guidance/FloatingWhispers.tsx

import React, {
  useEffect,
  useRef,
  useState
} from "react";

import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Colors,
  Fonts,
  Radius,
} from "../../constants/theme";

import {
  GUIDE_TYPES,
} from "./guideConfig";

const { width } =
  Dimensions.get("window");

/*
 * --------------------------------------------------------
 * 🌌 TIMING
 * --------------------------------------------------------
 */

const ROTATION_INTERVAL =
  12600;

const SILENCE_DURATION =
  2600;

/*
 * --------------------------------------------------------
 * 🌌 HELPERS
 * --------------------------------------------------------
 */

function weightedShuffle(
  items: any[]
) {

  return [...items]

    .sort(() => {

      const a =
        Math.random();

      const b =
        Math.random();

      return a - b;
    });
}

function randomBetween(
  min: number,
  max: number
) {

  return (

    Math.random()
    * (max - min)

  ) + min;
}

/*
 * --------------------------------------------------------
 * 🌌 POSITION SYSTEM
 * --------------------------------------------------------
 */

const cosmicPositions = [

  {
    top: 12,
    left: 18,
  },

  {
    top: 42,
    right: 20,
  },

  {
    top: 92,
    left: 84,
  },

  {
    top: 138,
    right: 72,
  },
];

const heartPositions = [

  {
    top: 24,
    left: 36,
  },

  {
    top: 84,
    right: 28,
  },

  {
    top: 132,
    left: 52,
  },
];

const structurePositions = [

  {
    top: 18,
    left: 48,
  },

  {
    top: 76,
    right: 42,
  },

  {
    top: 138,
    left: 42,
  },
];

function resolvePositions(
  guide: string
) {

  switch (guide) {

    case GUIDE_TYPES.HEART:

      return heartPositions;

    case GUIDE_TYPES.STRUCTURE:

      return structurePositions;

    default:

      return cosmicPositions;
  }
}

/*
 * --------------------------------------------------------
 * 🌌 COMPONENT
 * --------------------------------------------------------
 */

export default function FloatingWhispers({

  whispers = [],

  intensity = 0.5,

  guide =
    GUIDE_TYPES.COSMIC,

  nervousSystem =
    "regulated",

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
   * 🌊 ACTIVE FIELD
   * --------------------------------------------------------
   */

  const [

    visibleWhispers,

    setVisibleWhispers,

  ] = useState<any[]>([]);

  const [

    inSilence,

    setInSilence,

  ] = useState(false);

  /*
   * --------------------------------------------------------
   * 🌌 WHISPER COUNT
   * --------------------------------------------------------
   */

  const whisperCount =

    nervousSystem ===
    "overwhelmed"

      ? 1

      : nervousSystem ===
        "contracted"

          ? 2

          : 3;

  /*
   * --------------------------------------------------------
   * 🌊 FIELD LOOP
   * --------------------------------------------------------
   */

  useEffect(() => {

    /*
     * --------------------------------------------------------
     * 🌌 WEIGHTED FIELD
     * --------------------------------------------------------
     */
const shuffled =

  weightedShuffle(
    whispers
  );

    /*
     * --------------------------------------------------------
     * 🌫️ PARTIAL EMERGENCE
     * --------------------------------------------------------
     */

    const enriched =

      shuffled

        .slice(
          0,
          whisperCount
        )

        .map((whisper) => {

          const depth =

            Math.random() > 0.68

              ? "background"
              : Math.random() > 0.45

                ? "midground"
                : "foreground";

          const partial =

            Math.random() > 0.78;

return {

  ...(typeof whisper === "string"

    ? {
        text: whisper,
      }

    : whisper),

  depth,

  partial,
};
        });

    /*
     * --------------------------------------------------------
     * 🌌 ACTIVE
     * --------------------------------------------------------
     */

    setVisibleWhispers(
      enriched
    );

    /*
     * --------------------------------------------------------
     * 🌫️ SILENCE LOOP
     * --------------------------------------------------------
     */

    const timer =
      setTimeout(() => {

        setInSilence(true);

        setTimeout(() => {

          setInSilence(false);

        }, SILENCE_DURATION);

      }, ROTATION_INTERVAL);

    return () => {

      clearTimeout(
        timer
      );
    };

  }, [

    whispers,

    whisperCount,
  ]);

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
            key={`${
  typeof whisper === "string"
    ? whisper
    : whisper?.text
}-${index}`}

            whisper={whisper}

            intensity={intensity}

            guide={guide}

            index={index}
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

  guide,

  index,

}: any) {

  /*
   * --------------------------------------------------------
   * 🌊 VALUES
   * --------------------------------------------------------
   */

  const opacity =
    useRef(

      new Animated.Value(0)

    ).current;

  const translateY =
    useRef(

      new Animated.Value(
        randomBetween(
          6,
          14
        )
      )

    ).current;

  const floating =
    useRef(

      new Animated.Value(0)

    ).current;

  /*
   * --------------------------------------------------------
   * 🌌 POSITION
   * --------------------------------------------------------
   */

  const positions =
    resolvePositions(
      guide
    );

  const basePosition =

    positions[
      index
      % positions.length
    ];

  /*
   * --------------------------------------------------------
   * 🌊 ORGANIC DRIFT
   * --------------------------------------------------------
   */

  const driftX =
    randomBetween(
      -14,
      14
    );

  const driftY =
    randomBetween(
      -10,
      10
    );

  /*
   * --------------------------------------------------------
   * 🌌 DEPTH
   * --------------------------------------------------------
   */

  const depth =

    whisper?.depth
      || "foreground";

  /*
   * --------------------------------------------------------
   * 🌫️ TARGET OPACITY
   * --------------------------------------------------------
   */

  let targetOpacity =

    whisper?.opacity
      || 0.55;

  /*
   * 🌌 DEPTH
   */

  if (
    depth ===
    "background"
  ) {

    targetOpacity *= 0.52;
  }

  if (
    depth ===
    "midground"
  ) {

    targetOpacity *= 0.72;
  }

  /*
   * 🌫️ PARTIAL
   */

  if (
    whisper?.partial
  ) {

    targetOpacity *= 1;
  }

  /*
   * 🌊 INTENSITY
   */

  targetOpacity *= (

    0.65 +

    (
      intensity * 0.35
    )
  );

  /*
   * --------------------------------------------------------
   * ✨ START
   * --------------------------------------------------------
   */

  useEffect(() => {

    /*
     * 🌌 EMERGENCE
     */

    Animated.parallel([

      Animated.timing(opacity, {

        toValue:
          Math.min(
            targetOpacity,
            0.92
          ),

        duration:

          randomBetween(
            2400,
            4200
          ),

        easing:
          Easing.inOut(
            Easing.sin
          ),

        useNativeDriver: true,
      }),

      Animated.timing(translateY, {

        toValue: 0,

        duration:

          randomBetween(
            2400,
            4200
          ),

        easing:
          Easing.inOut(
            Easing.sin
          ),

        useNativeDriver: true,
      }),

    ]).start();

    /*
     * --------------------------------------------------------
     * 🌊 FLOATING
     * --------------------------------------------------------
     */

    Animated.loop(

      Animated.sequence([

        Animated.timing(floating, {

          toValue: 1,

          duration:

            randomBetween(
              3800,
              6200
            ),

          easing:
            Easing.inOut(
              Easing.sin
            ),

          useNativeDriver: true,
        }),

        Animated.timing(floating, {

          toValue: 0,

          duration:

            randomBetween(
              3800,
              6200
            ),

          easing:
            Easing.inOut(
              Easing.sin
            ),

          useNativeDriver: true,
        }),
      ])

    ).start();

    /*
     * --------------------------------------------------------
     * 🌫️ DISSOLVE
     * --------------------------------------------------------
     */

const dissolveTime =

  whisper?.recurrence

    ? randomBetween(
        14000,
        24000
      )

: randomBetween(
    18000,
    32000
  );

const dissolve =
  setTimeout(() => {

    Animated.timing(opacity, {

      toValue: 0.08,

      duration:

        randomBetween(
          2200,
          4200
        ),

      easing:
        Easing.inOut(
          Easing.sin
        ),

      useNativeDriver: true,
    }).start();

  }, dissolveTime);

return () => {

  clearTimeout(
    dissolve
  );
};

  }, []);

  /*
   * --------------------------------------------------------
   * 🌌 FLOAT MOTION
   * --------------------------------------------------------
   */

  const floatingY =

    floating.interpolate({

      inputRange: [0, 1],

      outputRange: [-5, 5],
    });

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

          top:
            basePosition.top
            + driftY,

          ...(basePosition.left !== undefined
            ? {
                left:
                  basePosition.left
                  + driftX,
              }
            : {}),

          ...(basePosition.right !== undefined
            ? {
                right:
                  basePosition.right
                  + driftX,
              }
            : {}),

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

            opacity:

              depth ===
              "background"

                ? 0.42
                : 1,

            textShadowColor:
              Colors.gold,

            textShadowOffset: {
              width: 0,
              height: 0,
            },

            textShadowRadius:

              depth ===
              "foreground"

                ? 18
                : 10,
          },
        ]}
      >
        {
  typeof whisper === "string"

    ? whisper

    : whisper?.text || ""
}
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

    pointerEvents: "none",
  },

  whisper: {

    position: "absolute",

    paddingHorizontal: 8,

    paddingVertical: 4,

    borderRadius:
      Radius.pill,
  },

  text: {

    color:
  "#F7D774",

    fontSize: 18,

    fontFamily:
      Fonts.light,

    textAlign: "center",

    letterSpacing: 0.4,
  },
});