// /components/mirror/ChakraSystem.tsx

import React from "react";

import Svg, {
  Circle,
  G,
  Path,
  Text as SvgText,
} from "react-native-svg";

import {
  chakraColours,
  chakraOrder,
  chakraY,
} from "../../lib/energy";

import type {
  Chakra,
} from "../../lib/energy";

// --------------------------------------------------
// 🧠 TYPES
// --------------------------------------------------

type Props = {

  dominant?: Chakra;

  scores?: Record<
    Chakra,
    {
      score: number;
    }
  >;

  onChakraPress?: (
    chakra: Chakra
  ) => void;

  selectedChakra?:
    Chakra | null;

  patterns?: Record<
    Chakra,
    {
      description: string;
    }
  >;

  distortions?: {

    masculine: any[];

    feminine: any[];
  };

  observableScenes?:
    string[];
};

// --------------------------------------------------
// 🧘 CHAKRA SYSTEM
// --------------------------------------------------

export default function ChakraSystem({

  dominant,

  scores,

  onChakraPress,

  selectedChakra,

  patterns,

  distortions,

  observableScenes,

}: Props) {

  // --------------------------------------------------
  // 🌊 AVERAGE
  // --------------------------------------------------

  const avg =

    scores

      ? Object.values(
          scores
        ).reduce(
          (a, b) =>
            a + b.score,
          0
        ) /

        Object.keys(scores)
          .length

      : 1 /
        chakraOrder.length;

  // --------------------------------------------------
  // 🧠 CHAKRA STATE
  // --------------------------------------------------

  const getState = (
    value: number
  ) => {

    if (
      value <
      avg * 0.6
    ) {

      return "low";
    }

    if (
      value >
      avg * 1.4
    ) {

      return "high";
    }

    return "balanced";
  };

  // --------------------------------------------------
  // 🧠 CHAKRA INSIGHT
  // --------------------------------------------------

  const getInsight = (
    chakra: Chakra
  ) => {

    const patternText =

      patterns?.[
        chakra
      ]?.description;

    if (patternText)
      return patternText;

    return (
      observableScenes?.[0] ||
      ""
    );
  };

  // --------------------------------------------------
  // 🌌 RENDER
  // --------------------------------------------------

  return (

    <Svg

      viewBox="0 0 180 430"

      width={140}

      height={430}

      style={{

        position:
          "absolute",

        top: 0,

        left: "50%",

        transform: [
          {
            translateX: -70,
          },
        ],
      }}
    >

      {chakraOrder.map(
        (key) => {

          const chakra =
            scores?.[key];

          const value =

            chakra?.score ??
            avg;

          const state =
            getState(
              value
            );

          const isActive =
            dominant === key;

          const y =
            chakraY[key] ??
            0;

          const baseColor =

            chakraColours[
              key
            ] ?? "#999";

          // --------------------------------------------------
          // 🌊 SCALE
          // --------------------------------------------------

          let scale = 1;

          if (
            state === "low"
          ) {

            scale = 0.9;
          }

          if (
            state === "high"
          ) {

            scale = 1.1;
          }

          const baseSize = 6;

          const sizeBase =

            key === "heart"

              ? baseSize +
                5 +
                value * 2 +
                (
                  isActive
                    ? 3
                    : 0
                )

              : baseSize +
                value * 0.8 +
                (
                  isActive
                    ? 2
                    : 0
                );

          const size =
            sizeBase *
            scale;

          // --------------------------------------------------
          // 🌑 RING
          // --------------------------------------------------

          let ringColor =
            "transparent";

          if (
            state === "low"
          ) {

            ringColor =
              "rgba(200,200,200,0.9)";
          }

          if (
            state === "high"
          ) {

            ringColor =
              "rgba(0,255,120,0.9)";
          }

          const ringWidth =
            isActive
              ? 1.6
              : 1;

          // --------------------------------------------------
          // 🧠 INSIGHT
          // --------------------------------------------------

          const insight =
            getInsight(
              key
            );

          // --------------------------------------------------
          // ❤️ HEART
          // --------------------------------------------------

          if (
            key === "heart"
          ) {

            return (

              <G

                key={key}

                transform={`translate(90, ${y})`}
              >

                {/* ❤️ OUTLINE */}

                <G transform="scale(1.15)">

                  <Path

                    d="M0,-20 
                     C16,-34 38,-14 0,32 
                     C-38,-14 -16,-34 0,-20 Z"

                    fill="none"

                    stroke="rgba(170,170,170,0.4)"

                    strokeWidth={1.2}
                  />

                </G>

                {/* ✨ GLOW */}

                <Circle

                  r={size + 6}

                  fill={baseColor}

                  opacity={0.08}
                />

                {/* 🌑 RING */}

                {ringColor !==
                  "transparent" && (

                  <Circle

                    r={size + 1}

                    fill="none"

                    stroke={
                      ringColor
                    }

                    strokeWidth={
                      ringWidth
                    }
                  />

                )}

                {/* 🔘 CORE */}

{/* 👆 TOUCH AREA */}

<Circle

  r={size + 10}

  fill="transparent"

  onPress={() =>
    onChakraPress?.(
      key
    )
  }
/>

{/* 🔘 CORE */}

<Circle

  r={size}

  fill={baseColor}
  />



                {/* 👁 ACTIVE */}

                {isActive && (

                  <>

                    <Circle

                      r={size + 2}

                      fill="none"

                      stroke="white"

                      strokeWidth={1.5}

                      opacity={0.9}
                    />

                    <Circle

                      r={size + 14}

                      fill="none"

                      stroke={
                        baseColor
                      }

                      strokeWidth={2.5}

                      opacity={0.3}
                    />

                  </>

                )}

                {/* ✨ INSIGHT */}

                {selectedChakra ===
                  key &&

                  insight !== "" && (

                  <G transform="translate(18, -4)">

                    <SvgText

                      fill="white"

                      fontSize="10"

                      opacity={0.85}

                      textAnchor="start"
                    >

                      {insight}

                    </SvgText>

                  </G>

                )}

              </G>
            );
          }

          // --------------------------------------------------
          // 🔘 OTHER CHAKRAS
          // --------------------------------------------------

          return (

            <G key={key}>

              {/* ✨ GLOW */}

              <Circle

                cx="90"

                cy={y}

                r={size + 6}

                fill={baseColor}

                opacity={0.08}
              />

              {/* 🌑 RING */}

              {ringColor !==
                "transparent" && (

                <Circle

                  cx="90"

                  cy={y}

                  r={size + 1}

                  fill="none"

                  stroke={
                    ringColor
                  }

                  strokeWidth={
                    ringWidth
                  }
                />

              )}

              {/* 🔘 CORE */}


{/* 👆 TOUCH AREA */}

<Circle

  cx="90"

  cy={y}

  r={size + 10}

  fill="transparent"

  onPress={() =>
    onChakraPress?.(
      key
    )
  }
/>

{/* 🔘 CORE */}

<Circle

  cx="90"

  cy={y}

  r={size}

  fill={baseColor}
/>

              {/* 👁 ACTIVE */}

              {isActive && (

                <>

                  <Circle

                    cx="90"

                    cy={y}

                    r={size + 2}

                    fill="none"

                    stroke="white"

                    strokeWidth={1}

                    opacity={0.7}
                  />

                  <Circle

                    cx="90"

                    cy={y}

                    r={size + 14}

                    fill="none"

                    stroke={
                      baseColor
                    }

                    strokeWidth={2}

                    opacity={0.35}
                  />

                </>

              )}

              {/* ✨ INSIGHT */}

              {selectedChakra ===
                key &&

                insight !== "" && (

                <G
                  transform={`translate(90, ${y})`}
                >

                  <G
                    transform={`translate(${
                      key ===
                        "crown" ||

                      key ===
                        "throat"

                        ? 16

                        : 18
                    }, -4)`}
                  >

                    <SvgText

                      fill="white"

                      fontSize="10"

                      opacity={0.85}

                      textAnchor="start"
                    >

                      {insight}

                    </SvgText>

                  </G>

                </G>

              )}

            </G>
          );
        }
      )}

    </Svg>
  );
}