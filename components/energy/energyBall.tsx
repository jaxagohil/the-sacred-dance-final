import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import {
  Canvas,
  Circle,
  RadialGradient,
  vec,
  Group,
  BlurMask,
} from "@shopify/react-native-skia";

const { width } = Dimensions.get("window");

const SIZE = width * 0.9;
const CENTER = SIZE / 2;

type Props = {
  masculine: number;
  feminine: number;
};

export default function EnergyBallSkia({
  masculine,
  feminine,
}: Props) {
  const [t, setT] = useState(0);

  // 🌊 breathing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setT((v) => v + 0.02);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // 🧠 VALIDATION (very important)
  if (masculine == null || feminine == null) {
    console.warn("⚠️ EnergyBallSkia missing values", {
      masculine,
      feminine,
    });
    return null;
  }

  // 🧠 STATE CALCULATION
  const imbalance = Math.abs(masculine - feminine);
  const balance = 1 - imbalance / 100;

  const shift = (masculine - feminine) * 0.6;
  const pulse = Math.sin(t) * 6;

  const coreOpacity = 0.4 + balance * 0.6;
  const distortionOpacity = imbalance / 100;

  // 🔍 DEBUG (only when inputs change)
  useEffect(() => {
    console.log("🌿 ENERGY STATE");
    console.log("masculine:", masculine);
    console.log("feminine:", feminine);
    console.log("imbalance:", imbalance);
    console.log("balance:", balance.toFixed(2));
    console.log("shift:", shift.toFixed(2));
    console.log("core strength:", coreOpacity.toFixed(2));
    console.log(
      "distortion:",
      imbalance > 5 ? "ACTIVE ⚠️" : "minimal ✅"
    );
    console.log("------------------------");
  }, [masculine, feminine]);

  return (
    <Canvas style={{ width: SIZE, height: SIZE }}>
      
      {/* 💗 FEMININE FIELD */}
      <Group blendMode="screen">
        <Circle cx={CENTER - 60 - shift} cy={CENTER} r={CENTER * 0.9}>
          <RadialGradient
            c={vec(CENTER - 60 - shift, CENTER)}
            r={CENTER}
            colors={[
              `rgba(255,80,160,${0.5 + balance * 0.2})`,
              "rgba(255,80,160,0.2)",
              "rgba(255,80,160,0.0)",
            ]}
          />
          <BlurMask blur={60} />
        </Circle>
      </Group>

      {/* 💙 MASCULINE FIELD */}
      <Group blendMode="screen">
        <Circle cx={CENTER + 60 - shift} cy={CENTER} r={CENTER * 0.9}>
          <RadialGradient
            c={vec(CENTER + 60 - shift, CENTER)}
            r={CENTER}
            colors={[
              `rgba(80,160,255,${0.5 + balance * 0.2})`,
              "rgba(80,160,255,0.2)",
              "rgba(80,160,255,0.0)",
            ]}
          />
          <BlurMask blur={60} />
        </Circle>
      </Group>

      {/* 🌕 BREATHING RINGS */}
      {[0.6, 0.45, 0.3].map((scale, i) => (
        <Circle
          key={i}
          cx={CENTER}
          cy={CENTER}
          r={CENTER * scale + pulse}
          style="stroke"
          strokeWidth={1}
          color={`rgba(255,255,255,${0.08 + balance * 0.05})`}
        />
      ))}

      {/* ✨ CORE */}
      <Group blendMode="screen">
        <Circle cx={CENTER} cy={CENTER} r={50 + pulse}>
          <RadialGradient
            c={vec(CENTER, CENTER)}
            r={80}
            colors={[
              `rgba(255,220,120,${coreOpacity})`,
              "rgba(255,220,120,0.3)",
              "rgba(255,220,120,0.0)",
            ]}
          />
          <BlurMask blur={30} />
        </Circle>
      </Group>

      {/* ⚠️ DISTORTION DOTS */}
      {distortionOpacity > 0.05 && (
        <>
          <Circle
            cx={CENTER - 140}
            cy={CENTER}
            r={8}
            color={`rgba(180,180,180,${distortionOpacity})`}
          />
          <Circle
            cx={CENTER + 140}
            cy={CENTER}
            r={8}
            color={`rgba(180,180,180,${distortionOpacity})`}
          />
        </>
      )}

      {/* ✨ OUTER FIELD */}
      <Circle cx={CENTER} cy={CENTER} r={CENTER * 0.95}>
        <RadialGradient
          c={vec(CENTER, CENTER)}
          r={CENTER}
          colors={[
            `rgba(255,255,255,${0.05 * balance})`,
            "rgba(255,255,255,0.0)",
          ]}
        />
      </Circle>

    </Canvas>
  );
}