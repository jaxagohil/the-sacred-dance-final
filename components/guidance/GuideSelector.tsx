// guidance/GuideSelector.tsx

import React from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Fonts,
  Opacity,
  Radius,
} from "../../constants/theme";

import {
  GUIDE_TYPES,
  getGuideConfig,
} from "./guideConfig";

/*
 * --------------------------------------------------------
 * 🌌 GUIDE TYPES
 * --------------------------------------------------------
 */

const guides = [

  {
    id: "1",

    type:
      GUIDE_TYPES.HEART,
  },

  {
    id: "2",

    type:
      GUIDE_TYPES.STRUCTURE,
  },

  {
    id: "3",

    type:
      GUIDE_TYPES.COSMIC,
  },
];

export default function GuideSelector() {

  return (

    <View
      style={{

        flexDirection: "row",

        justifyContent: "center",
        alignItems: "center",

        gap: 10,

        marginTop: 2,
      }}
    >

      {guides.map((guide) => {

        const config =
          getGuideConfig(
            guide.type
          );

        const isCosmic =

          guide.type ===
          GUIDE_TYPES.COSMIC;

        return (

          <TouchableOpacity
            key={guide.id}

            activeOpacity={0.8}

            style={{

              paddingHorizontal: 8,

              paddingVertical: 4,

              borderRadius:
                Radius.pill,

              backgroundColor:
                "rgba(255,255,255,0.008)",
            }}
          >

            <Text
              style={{

                color:
                  config.fontColor,

                fontFamily:

                  isCosmic
                    ? Fonts.regular
                    : Fonts.light,

                fontSize: 9,

                textAlign: "center",

                letterSpacing: 0.4,

                opacity:

                  isCosmic
                    ? 0.92
                    : Opacity.medium,

                textTransform:
                  "lowercase",

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
              {guide.type}
            </Text>

          </TouchableOpacity>
        );
      })}

    </View>
  );
}