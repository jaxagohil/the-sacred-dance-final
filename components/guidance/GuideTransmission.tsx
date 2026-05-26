// guidance/GuideTransmission.tsx

import React from "react";

import {
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  Fonts,
  Opacity,
} from "../../constants/theme";

import {
  GUIDE_TYPES,
  getGuideConfig,
} from "./guideConfig";

export default function GuideTransmission({

  guide,

  text,

}: any) {

  const config =
    getGuideConfig(
      guide
    );

  const isCosmic =

    guide ===
    GUIDE_TYPES.COSMIC;

  return (

    <ScrollView
      showsVerticalScrollIndicator={false}

      contentContainerStyle={{

        alignItems: "center",

        justifyContent: "center",

        paddingBottom: 24,
      }}
    >

      <View
        style={{

          width: "100%",

          alignItems: "center",
          justifyContent: "center",

          marginBottom: 22,

          paddingHorizontal: 18,
        }}
      >

        {/* ------------------------------------------------ */}
        {/* 🌿 TRANSMISSION */}
        {/* ------------------------------------------------ */}

        <Text
          style={{

            width: "74%",

            color:
              config.fontColor,

            fontFamily:

              isCosmic
                ? Fonts.regular
                : Fonts.light,

            fontSize:

              isCosmic
                ? 13
                : 12,

            lineHeight:

              isCosmic
                ? 24
                : 20,

            textAlign: "center",

            letterSpacing: 0.15,

            opacity:

              isCosmic
                ? 0.92
                : Opacity.medium,

            textShadowColor:

              isCosmic
                ? config.fontColor
                : "transparent",

            textShadowOffset: {
              width: 0,
              height: 0,
            },

            textShadowRadius:

              isCosmic
                ? 5
                : 0,
          }}
        >
          {text}
        </Text>

      </View>

    </ScrollView>
  );
}