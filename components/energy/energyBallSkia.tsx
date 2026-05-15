// /components/energy/EnergyBallSkia.tsx

import React, {
  useEffect,
  useState,
} from "react";

import {
  Dimensions,
  Pressable,
  Text,
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

import {
  chakraY,
} from "../../lib/energy";

// --------------------------------------------------
// 🌌 DIMENSIONS
// --------------------------------------------------

const { width } =
  Dimensions.get("window");

const SIZE = width * 0.9;

const CENTER = SIZE / 2;

const RADIUS =
  CENTER * 0.95;

// --------------------------------------------------
// 🧠 TYPES
// --------------------------------------------------

type Props = {

  energy: any;

  distortions?: {

    masculine: any[];

    feminine: any[];
  };

  observableScenes?:
    string[];

  awarenessChakra?:
    string | null;
};

// --------------------------------------------------
// 🧠 HELPERS
// --------------------------------------------------

const getPrimaryChakra =
  (
    chakraWeights?: Record<
      string,
      number
    >
  ) => {

    if (!chakraWeights)
      return "heart";

    return Object
      .entries(
        chakraWeights
      )
      .sort(
        (a, b) =>
          b[1] - a[1]
      )[0]?.[0];
  };

// --------------------------------------------------
// ⚡ ENERGY BALL
// --------------------------------------------------

export default function EnergyBallSkia({

  energy,

  distortions,

  observableScenes,

  awarenessChakra,

}: Props) {

  // --------------------------------------------------
  // 🧩 STATE
  // --------------------------------------------------

  const [
    t,
    setT,
  ] = useState(0);

  const [
    selected,
    setSelected,
  ] = useState<
    number | null
  >(null);

  // --------------------------------------------------
  // 🌊 ANIMATION
  // --------------------------------------------------

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

  // --------------------------------------------------
  // 🧿 DISTORTIONS
  // --------------------------------------------------

  const distortionList = [

    ...(distortions
      ?.masculine || []),

    ...(distortions
      ?.feminine || []),
  ];

  // --------------------------------------------------
  // 🌑 DOT POSITIONS
  // --------------------------------------------------

  const dotPositions =
    distortionList.map(
      (d: any, i: number) => {

        const primaryChakra =

          getPrimaryChakra(
            d?.chakra_weights
          );

        const y =

          chakraY[
            primaryChakra as keyof typeof chakraY
          ] || CENTER;

        const side =

          d?.feminine >
          d?.masculine

            ? "left"

            : "right";

        const x =

          side === "left"

            ? CENTER - 55

            : CENTER + 55;

        const intensity =

          d?.intensity ??

          d?.contraction ??

          0.3;

        const r =
          6 +
          intensity * 8;

        return {

          x,

          y,

          r,

          side,

          index: i,
        };
      }
    );

  // --------------------------------------------------
  // 🧠 BEHAVIOUR TEXT
  // --------------------------------------------------

  const getBehaviourText =
    () => {

      if (
        selected === null
      ) {

        return "";
      }

      const behaviour =

        distortionList[
          selected
        ];

      if (!behaviour)
        return "";

      return (

        behaviour
          ?.manifestation ||

        behaviour
          ?.mirror_prompt ||

        behaviour
          ?.observable_scene ||

        behaviour
          ?.coping_strategy ||

        behaviour
          ?.statement ||

        observableScenes?.[
          selected
        ] ||

        ""
      );
    };

  // --------------------------------------------------
  // 🌌 RENDER
  // --------------------------------------------------

  return (

    <View
      style={{
        width: SIZE,
        height: SIZE,
      }}
    >

      {/* 🎨 CANVAS */}

      <Canvas
        style={{
          width: SIZE,
          height: SIZE,
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
              SIZE,
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
                  SIZE
              ),

              splitX / SIZE,

              Math.min(
                1,
                (splitX + 80) /
                  SIZE
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

        {/* 💚 HEART */}

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
        215,
        120,
        ${
          coherence *
          0.28
        }
      )`,

      `rgba(
        255,
        215,
        120,
        ${
          coherence *
          0.12
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

        <Circle

          cx={CENTER}

          cy={HEART_Y}

          r={
            28 +
            Math.sin(t) * 2
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
                ) *
                  3
              }

              r={dot.r}

              color={

                selected === i

                  ? "rgba(255,255,255,0.9)"

                  : "rgba(180,180,180,0.5)"
              }
            >

              <BlurMask
                blur={6}
              />

            </Circle>
          )
        )}

      </Canvas>

      {/* 🧠 TOUCH LAYER */}

      <Pressable

        style={{

          position:
            "absolute",

          width: SIZE,

          height: SIZE,
        }}

        onPress={(e) => {

          const {

            locationX,

            locationY,

          } = e.nativeEvent;

          dotPositions.forEach(
            (dot, i) => {

              const dx =
                locationX -
                dot.x;

              const dy =
                locationY -
                dot.y;

              const distance =
                Math.sqrt(

                  dx * dx +

                  dy * dy
                );

              if (
                distance <
                dot.r + 12
              ) {

                setSelected(
                  i
                );
              }
            }
          );
        }}
      />

      {/* ✨ BEHAVIOUR */}

      {selected !== null &&

        dotPositions[
          selected
        ] && (

        <View

          style={{

            position:
              "absolute",

            left:

              dotPositions[
                selected
              ].x + 10,

            top:

              dotPositions[
                selected
              ].y - 10,

            maxWidth: 170,
          }}
        >

          <Text

            style={{

              color:
                "white",

              fontSize: 12,
              
              lineHeight: 18,

              opacity: 0.85,

backgroundColor:
  "rgba(0,0,0,0.22)",

padding: 8,

borderRadius: 12,

            }}
          >

            {getBehaviourText()}

          </Text>

        </View>
      )}

    </View>
  );
}