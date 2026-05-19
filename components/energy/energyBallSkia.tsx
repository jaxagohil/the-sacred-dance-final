// /components/energy/EnergyBallSkia.tsx

import React, {
  useEffect,
  useState,
} from "react";

import {
  Dimensions,
  View,
} from "react-native";

import {
  BlurMask,
  Canvas,
  Circle,
  LinearGradient,
  RadialGradient,
  vec,
} from "@shopify/react-native-skia";

// --------------------------------------------------
// 🌌 DIMENSIONS
// --------------------------------------------------

const { width } =
  Dimensions.get("window");

const SIZE = width * 0.84;

const CANVAS_SIZE =
  SIZE + 80;

const CENTER =
  CANVAS_SIZE / 2;

const RADIUS =
  CENTER * 0.8;

// --------------------------------------------------
// 🧠 TYPES
// --------------------------------------------------

type Props = {

  energy: any;

  distortions?: {

    distorted?: any[];

    integrated?: any[];

    contractionLevel?: number;

    expansionLevel?: number;

    dominantPolarity?:
      | "feminine"
      | "masculine";
  };

  awarenessChakra?:
    string | null;

  dotPositions?: {

    x: number;

    y: number;

    r: number;

    side: string;

    index: number;

  }[];
};

// --------------------------------------------------
// ⚡ ENERGY BALL
// --------------------------------------------------

export default function EnergyBallSkia({

  energy,

  distortions,

  awarenessChakra,

  dotPositions = [],

}: Props) {

  // --------------------------------------------------
  // 🌊 ANIMATION
  // --------------------------------------------------

  const [
    t,
    setT,
  ] = useState(0);

  useEffect(() => {

    const interval =
      setInterval(() => {

        setT(
          (v) => v + 0.02
        );

      }, 30);

    return () =>
      clearInterval(
        interval
      );

  }, []);

  // --------------------------------------------------
  // 🚫 EMPTY
  // --------------------------------------------------

  if (!energy)
    return null;

  // --------------------------------------------------
  // ⚡ ENERGY
  // --------------------------------------------------

  const masculine =
    energy.masculine ?? 0;

  const feminine =
    energy.feminine ?? 0;

  const total =
    masculine +
      feminine || 1;

  const feminineRatio =
    feminine / total;

  const balance =

    1 -

    Math.abs(
      masculine -
      feminine
    );

  const contraction =

    energy?.contraction ??
    0.5;

  const expansion =

    energy?.expansion ??
    0.5;

  const coherence =

    (
      balance * 0.4 +

      expansion * 0.4 +

      (1 - contraction) *
        0.2
    );

  const splitX =

    CENTER +

    (
      feminineRatio - 0.5
    ) *

      RADIUS *
      1.6;

  // --------------------------------------------------
  // 🌊 FLOW
  // --------------------------------------------------

  const flow =
    Math.sin(t * 0.8) * 18;

  const HEART_Y =
    CENTER - 40;

  const awarenessGlow =

  awarenessChakra

    ? 0.18

    : 0.08;  

  // --------------------------------------------------
  // 🌌 RENDER
  // --------------------------------------------------

  return (

    <View
      style={{
        width: CANVAS_SIZE,

        height: CANVAS_SIZE,

        overflow:
          "visible",

        alignItems:
          "center",

        justifyContent:
          "center",
      }}
    >

      {/* 🎨 CANVAS */}

      <Canvas
        style={{
          width: CANVAS_SIZE,

          height: CANVAS_SIZE,
        }}
      >

        {/* 🌌 FIELD */}

        <Circle

          cx={CENTER}

          cy={CENTER}

          r={RADIUS}
        >

          <LinearGradient

            start={vec(0, 0)}

            end={vec(
              CANVAS_SIZE,
              0
            )}

            colors={[

              "rgba(255,80,160,0.5)",

              "rgba(255,80,160,0.25)",

              "rgba(180,120,200,0.18)",

              "rgba(80,150,255,0.25)",

              "rgba(80,150,255,0.5)",
            ]}

            positions={[

              0,

              Math.max(
                0,
                (splitX - 80) /
                  CANVAS_SIZE
              ),

              splitX /
                CANVAS_SIZE,

              Math.min(
                1,
                (splitX + 80) /
                  CANVAS_SIZE
              ),

              1,
            ]}
          />

          <BlurMask
            blur={20}
            style="normal"
          />

        </Circle>

        {/* 🌊 FLOW */}

        <Circle

          cx={CENTER}

          cy={CENTER}

          r={
            RADIUS * 0.85
          }
        >

          <RadialGradient

            c={vec(
              CENTER + flow,
              CENTER
            )}

            r={RADIUS}

            colors={[

              "rgba(255,255,255,0.05)",

              "rgba(255,255,255,0.02)",

              "rgba(255,255,255,0)",
            ]}
          />

        </Circle>

        {/* 🌊 RINGS */}

        {[...Array(3)].map(
          (_, i) => {

            const offset =
              i * 22;

            return (

              <Circle

                key={i}

                cx={CENTER}

                cy={CENTER}

                r={
                  RADIUS *
                    0.6 +
                  offset
                }

                color="rgba(255,255,255,0.04)"

                style="stroke"

                strokeWidth={1}
              >

                <BlurMask
                  blur={6}
                />

              </Circle>
            );
          }
        )}

        {/* ✨ COHERENCE */}

        <Circle

          cx={CENTER}

          cy={CENTER}

          r={
            RADIUS *
            0.55 *
            coherence
          }
        >

          <RadialGradient

            c={vec(
              CENTER,
              CENTER
            )}

            r={
              RADIUS *
              0.7
            }

            colors={[

              `rgba(
  255,
  235,
  180,
                ${
coherence *
awarenessGlow
                }
              )`,

              `rgba(
  255,
  235,
  180,
                ${
coherence *
(awarenessGlow * 0.7)
                }
              )`,

              "rgba(255,215,120,0)",
            ]}
          />

          <BlurMask
            blur={40}
            style="normal"
          />

        </Circle>

        {/* 💚 HEART */}

        <Circle

          cx={CENTER}

          cy={HEART_Y}

          r={
30 +
Math.sin(t * 1.2) * 3.5
          }
        >

          <RadialGradient

            c={vec(
              CENTER,
              HEART_Y
            )}

            r={55}

            colors={[

              "rgba(255,220,120,0.22)",

              "rgba(255,220,120,0.06)",

              "rgba(255,220,120,0)",
            ]}
          />

          <BlurMask
  blur={18}
  style="normal"
/>

        </Circle>

        {/* 🌐 EDGE */}

        <Circle

          cx={CENTER}

          cy={CENTER}

          r={RADIUS}
        >

          <RadialGradient

            c={vec(
              CENTER,
              CENTER
            )}

            r={RADIUS}

            colors={[

              "rgba(0,0,0,0)",

              "rgba(0,0,0,0.15)",

              "rgba(0,0,0,0.4)",
            ]}
          />

        </Circle>

        {/* 🌑 DISTORTION DOTS */}

        {dotPositions.map(
          (dot, i) => (

            <Circle

              key={i}

              cx={dot.x}

              cy={
                dot.y +
                Math.sin(
                  t + i
                ) * 1.8
              }

              opacity={
  dot.r > 10
    ? 0.95
    : 0.72
}

              r={dot.r}

              color=
                "rgba(180,180,180,0.5)"
            >

              <BlurMask
                blur={6}
              />

            </Circle>
          )
        )}

      </Canvas>

    </View>
  );
}