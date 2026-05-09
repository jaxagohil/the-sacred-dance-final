// components/connections/LivingField.tsx

import React from "react";

import {
    Dimensions,
} from "react-native";

import {
    Canvas,
    Circle,
    RadialGradient,
    vec
} from "@shopify/react-native-skia";

const { width, height } =
  Dimensions.get("window");

const centerX = width / 2;
const centerY = height / 2;

export default function LivingField() {

  return (
    <Canvas
      style={{
        position: "absolute",
        width,
        height,
      }}
    >

      {/* 🌌 cosmic atmosphere */}
      <Circle
        cx={centerX}
        cy={centerY}

        r={430}
      >
        <RadialGradient
          c={vec(centerX, centerY)}

          r={430}

          colors={[
            "rgba(20,30,70,0.26)",
            "rgba(0,0,0,0)",
          ]}
        />
      </Circle>

      {/* 🔵 COMPASSION */}
  

      {/* 💗 LOVE */}


      {/* ✨ NEW EARTH */}
 

    </Canvas>
  );
}