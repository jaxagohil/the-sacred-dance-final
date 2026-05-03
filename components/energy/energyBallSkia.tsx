// /components/energy/EnergyBallSkia.tsx

import React, { useEffect, useState } from "react";
import { Dimensions, View, Pressable, Text } from "react-native";
import {
  Canvas,
  Circle,
  LinearGradient,
  RadialGradient,
  vec,
  BlurMask,
} from "@shopify/react-native-skia";

const { width } = Dimensions.get("window");

const SIZE = width * 0.9;
const CENTER = SIZE / 2;
const RADIUS = CENTER * 0.95;

type Props = {
  energy: any;
  distortionBehaviours?: {
    masculine: any[];
    feminine: any[];
  };
};

export default function EnergyBallSkia({
  energy,
  distortionBehaviours,
}: Props) {
  const [t, setT] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setT((v) => v + 0.02);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  if (!energy) return null;

  const masculine = energy.masculine ?? 0;
  const feminine = energy.feminine ?? 0;
  const distortions = energy.distortions ?? [];

  const total = masculine + feminine || 1;
  const feminineRatio = feminine / total;

  const splitX =
    CENTER + (feminineRatio - 0.5) * RADIUS * 1.6;

  const flow = Math.sin(t * 0.8) * 18;

  const HEART_Y = CENTER - 40;

  // 🧠 DOT POSITIONS
  const dotPositions = distortions.map((d: any, i: number) => {
    const y = CENTER - 120 + i * 80;
    const intensity = d.intensity ?? 0.3;

    const x =
      d.side === "feminine"
        ? CENTER - RADIUS * 0.6
        : CENTER + RADIUS * 0.6;

    const r = 6 + intensity * 8;

    return {
      x,
      y,
      r,
      side: d.side as "masculine" | "feminine",
      index: i,
    };
  });

  // 🧠 CORRECT BEHAVIOUR MAPPING
  const getBehaviourText = () => {
    if (selected === null) return "";

    const dot = dotPositions[selected];
    if (!dot) return "";

    const behaviours = distortionBehaviours?.[dot.side] || [];

    const behaviour = behaviours[selected]; // ✅ correct mapping

    return behaviour?.statement || "";
  };

  return (
    <View style={{ width: SIZE, height: SIZE }}>

      {/* 🎨 CANVAS */}
      <Canvas style={{ width: SIZE, height: SIZE }}>

        {/* 🌌 FIELD */}
        <Circle cx={CENTER} cy={CENTER} r={RADIUS}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(SIZE, 0)}
            colors={[
              "rgba(255,80,160,0.5)",
              "rgba(255,80,160,0.25)",
              "rgba(180,120,200,0.18)",
              "rgba(80,150,255,0.25)",
              "rgba(80,150,255,0.5)",
            ]}
            positions={[
              0,
              Math.max(0, (splitX - 80) / SIZE),
              splitX / SIZE,
              Math.min(1, (splitX + 80) / SIZE),
              1,
            ]}
          />
          <BlurMask blur={20} style="normal" />
        </Circle>

        {/* 🌊 FLOW */}
        <Circle cx={CENTER} cy={CENTER} r={RADIUS * 0.85}>
          <RadialGradient
            c={vec(CENTER + flow, CENTER)}
            r={RADIUS}
            colors={[
              "rgba(255,255,255,0.05)",
              "rgba(255,255,255,0.02)",
              "rgba(255,255,255,0)",
            ]}
          />
        </Circle>

        {/* 🌊 RINGS */}
        {[...Array(3)].map((_, i) => {
          const offset = i * 22;
          return (
            <Circle
              key={i}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS * 0.6 + offset}
              color="rgba(255,255,255,0.04)"
              style="stroke"
              strokeWidth={1}
            >
              <BlurMask blur={6} />
            </Circle>
          );
        })}

        {/* 💚 HEART */}
        <Circle
          cx={CENTER}
          cy={HEART_Y}
          r={28 + Math.sin(t) * 2}
        >
          <RadialGradient
            c={vec(CENTER, HEART_Y)}
            r={55}
            colors={[
              "rgba(255,220,120,0.22)",
              "rgba(255,220,120,0.06)",
              "rgba(255,220,120,0)",
            ]}
          />
        </Circle>

        {/* 🌐 EDGE */}
        <Circle cx={CENTER} cy={CENTER} r={RADIUS}>
          <RadialGradient
            c={vec(CENTER, CENTER)}
            r={RADIUS}
            colors={[
              "rgba(0,0,0,0)",
              "rgba(0,0,0,0.15)",
              "rgba(0,0,0,0.4)",
            ]}
          />
        </Circle>

        {/* 🌑 DISTORTION DOTS */}
        {dotPositions.map((dot, i) => (
          <Circle
            key={i}
            cx={dot.x}
            cy={dot.y + Math.sin(t + i) * 3}
            r={dot.r}
            color={
              selected === i
                ? "rgba(255,255,255,0.9)" // ✅ highlight
                : "rgba(180,180,180,0.5)"
            }
          >
            <BlurMask blur={6} />
          </Circle>
        ))}
      </Canvas>

      {/* 🧠 TOUCH LAYER */}
      <Pressable
        style={{
          position: "absolute",
          width: SIZE,
          height: SIZE,
        }}
        onPress={(e) => {
          const { locationX, locationY } = e.nativeEvent;

          dotPositions.forEach((dot, i) => {
            const dx = locationX - dot.x;
            const dy = locationY - dot.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < dot.r + 12) {
              setSelected(i);
            }
          });
        }}
      />

      {/* ✨ BEHAVIOUR TEXT */}
      {selected !== null && dotPositions[selected] && (
        <View
          style={{
            position: "absolute",
            left: dotPositions[selected].x + 10,
            top: dotPositions[selected].y - 10,
            maxWidth: 140,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 11,
              opacity: 0.85,
            }}
          >
            {getBehaviourText()}
          </Text>
        </View>
      )}
    </View>
  );
}