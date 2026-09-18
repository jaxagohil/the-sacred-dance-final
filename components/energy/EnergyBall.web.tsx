import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";

import React from "react";
import { View } from "react-native";

import { EnergyBallContext } from "./EnergyBallContext";

export default function EnergyBall(props: any) {

  return (

    <EnergyBallContext.Provider value={props}>

      <View
        style={{
          transform: [{ scale: 0.72 }],
          marginBottom: 0,
          alignItems: "center",
        }}
      >
        <WithSkiaWeb
          getComponent={() => import("./EnergyBallSkiaWeb")}
          fallback={null}
        />
      </View>

    </EnergyBallContext.Provider>

  );

}