import React, {
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  Animated,
  Dimensions,
} from "react-native";

import {
  Canvas,
  Circle,
  Group,
  Line,
  Path,
  RadialGradient,
  Skia,
  vec,
} from "@shopify/react-native-skia";

import {
  Colors,
} from "../../constants/theme";

const { width, height } =
  Dimensions.get("window");

const centerX = width / 2;
const centerY = height / 2;

//
// ✨ CONSTELLATION POINTS
//

const stars = [

  {
    x: centerX - 160,
    y: centerY - 260,
    size: 1.6,
  },

  {
    x: centerX + 120,
    y: centerY - 220,
    size: 2,
  },

  {
    x: centerX - 210,
    y: centerY + 80,
    size: 2.2,
  },

  {
    x: centerX + 180,
    y: centerY + 160,
    size: 1.7,
  },

  {
    x: centerX - 40,
    y: centerY + 260,
    size: 1.8,
  },

  {
    x: centerX + 30,
    y: centerY - 330,
    size: 2,
  },

  {
    x: centerX - 100,
    y: centerY - 60,
    size: 1.7,
  },

  {
    x: centerX + 140,
    y: centerY + 10,
    size: 1.9,
  },

  {
    x: centerX - 240,
    y: centerY - 140,
    size: 1.5,
  },

  {
    x: centerX + 220,
    y: centerY - 60,
    size: 1.6,
  },
];

export default function LivingField() {

  //
  // 🌊 FIELD BREATHING
  //

  const breathe =
    useRef(
      new Animated.Value(0.95)
    ).current;

  //
  // ✨ CONSTELLATION PULSE
  //

  const constellation =
    useRef(
      new Animated.Value(0.4)
    ).current;

  useEffect(() => {

    Animated.loop(

      Animated.sequence([

        Animated.timing(
          breathe,

          {
            toValue: 1,

            duration: 14000,

            useNativeDriver: true,
          }
        ),

        Animated.timing(
          breathe,

          {
            toValue: 0.95,

            duration: 14000,

            useNativeDriver: true,
          }
        ),
      ])

    ).start();

    Animated.loop(

      Animated.sequence([

        Animated.timing(
          constellation,

          {
            toValue: 1,

            duration: 9000,

            useNativeDriver: true,
          }
        ),

        Animated.timing(
          constellation,

          {
            toValue: 0.4,

            duration: 9000,

            useNativeDriver: true,
          }
        ),
      ])

    ).start();

  }, []);

  //
  // ✨ CONSTELLATION LINKS
  //

  const links = useMemo(
    () => [

      [stars[0], stars[6]],
      [stars[6], stars[4]],
      [stars[1], stars[7]],
      [stars[2], stars[4]],
      [stars[8], stars[0]],
      [stars[1], stars[9]],
    ],

    []
  );

  //
  // 🌙 SACRED GEOMETRY
  //

  const arc1 = Skia.Path.Make();

  arc1.addArc(
    {
      x: centerX - 220,
      y: centerY - 220,

      width: 440,
      height: 440,
    },

    210,
    120
  );

  const arc2 = Skia.Path.Make();

  arc2.addArc(
    {
      x: centerX - 300,
      y: centerY - 300,

      width: 600,
      height: 600,
    },

    10,
    90
  );

  return (

    <Animated.View
      style={{
        position: "absolute",

        width,
        height,

        opacity: breathe,
      }}
    >

      <Canvas
        style={{
          position: "absolute",

          width,
          height,
        }}
      >

        {/* 🌌 DEEP FIELD */}

        <Circle
          cx={centerX}
          cy={centerY}

          r={480}
        >
          <RadialGradient
            c={vec(centerX, centerY)}

            r={480}

            colors={[

              Colors.fieldDeep,

              "rgba(0,0,0,0)",
            ]}
          />
        </Circle>

        {/* 💗 HUMAN WARMTH */}

        <Circle
          cx={centerX}
          cy={centerY - 40}

          r={360}
        >
          <RadialGradient
            c={vec(
              centerX,
              centerY - 40
            )}

            r={360}

            colors={[

              "rgba(216,166,255,0.08)",

              "rgba(0,0,0,0)",
            ]}
          />
        </Circle>

        {/* 🌊 CENTRAL FIELD */}

        <Circle
          cx={centerX}
          cy={centerY}

          r={200}
        >
          <RadialGradient
            c={vec(centerX, centerY)}

            r={200}

            colors={[

              Colors.fieldGlow,

              "rgba(0,0,0,0)",
            ]}
          />
        </Circle>

        {/* ✨ SACRED GEOMETRY */}

        <Path

          path={arc1}

          color="rgba(255,255,255,0.025)"

          style="stroke"

          strokeWidth={1}
        />

        <Path

          path={arc2}

          color="rgba(255,255,255,0.018)"

          style="stroke"

          strokeWidth={1}
        />

        {/* ✨ CONSTELLATION LINES */}

        <Group>

          {links.map(
            ([a, b], index) => (

              <Line

                key={`line-${index}`}

                p1={vec(a.x, a.y)}
                p2={vec(b.x, b.y)}

                color="rgba(255,255,255,0.06)"

                strokeWidth={1}
              />
            )
          )}

        </Group>

        {/* ✨ STARS */}

        <Group>

          {stars.map(
            (star, index) => (

              <Circle

                key={`star-${index}`}

                cx={star.x}
                cy={star.y}

                r={star.size}

                color="rgba(255,255,255,0.34)"
              />
            )
          )}

        </Group>

        {/* 🌫️ COSMIC DUST */}

        <Group>

          <Circle
            cx={centerX - 120}
            cy={centerY + 40}
            r={1.2}
            color="rgba(255,255,255,0.08)"
          />

          <Circle
            cx={centerX + 160}
            cy={centerY - 180}
            r={1}
            color="rgba(255,255,255,0.06)"
          />

          <Circle
            cx={centerX + 80}
            cy={centerY + 260}
            r={1.4}
            color="rgba(255,255,255,0.05)"
          />

        </Group>

      </Canvas>

    </Animated.View>
  );
}