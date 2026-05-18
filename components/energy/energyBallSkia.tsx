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

  observableScenes?:
    string[];

    lensEntries?:
    any[];

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

   lensEntries,

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

const distortionList = (

  distortions?.distorted || []

).map(
  (d: any) => {

    const matchingLens =

      lensEntries?.find(
        (l: any) =>

          l?.behaviour_id ===
          d?.id
      );

    return {

      ...d,

      manifestation:

        matchingLens
          ?.manifestation ||

        d?.manifestation,

      mirror_prompt:

        matchingLens
          ?.mirror_prompt ||

        d?.mirror_prompt,

      observable_scene:

        matchingLens
          ?.observable_scene ||

        d?.observable_scene,

      coping_strategy:

        matchingLens
          ?.coping_strategy ||

        d?.coping_strategy,
    };
  }
);

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

  (
    Number(
      d?.masculine || 0
    ) >

    Number(
      d?.feminine || 0
    )
  )

    ? "right"

    : "left";

        const x =

          side === "left"

            ? CENTER - 55

            : CENTER + 55;

const intensity =

  Number(

    distortions
      ?.contractionLevel || 0.5

  ) *

  (

    d?.quality ===
    "distorted"

      ? 1.2

      : 0.7
  );

const r =

  6 +

  Number(
    intensity || 0
  ) * 8;

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
    ?.observable_scene ||

  observableScenes?.[
    selected
  ] ||

  behaviour
    ?.manifestation ||

  behaviour
    ?.mirror_prompt ||

  behaviour
    ?.coping_strategy ||

  behaviour
    ?.statement ||

  ""
);
    };

  // --------------------------------------------------
  // 🌌 RENDER
  // --------------------------------------------------

  return (

<View
  style={{
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    overflow: "visible",
    alignItems: "center",
    justifyContent: "center",
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
                (splitX - 80) / CANVAS_SIZE
              ),

              splitX / CANVAS_SIZE,

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

width: CANVAS_SIZE,
height: CANVAS_SIZE,
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
                dot.r + 2
              ) {

setSelected(

  selected === i
    ? null
    : i
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

  <Pressable

    onPress={() =>
      setSelected(null)
    }

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

      maxWidth: 100,

      flexShrink: 1,
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

  </Pressable>
)}
    </View>
  );
}