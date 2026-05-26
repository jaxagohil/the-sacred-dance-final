// guidance/ReflectionPortal.tsx

import React from "react";

import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import {
  Colors,
  Fonts,
  Opacity,
  Radius,
} from "../../constants/theme";

import GuideSelector from "./GuideSelector";

export default function ReflectionPortal() {

  return (

    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
    >

      <View
        style={{

          width: "100%",

          alignItems: "center",
          justifyContent: "center",

          paddingVertical: 10,

          borderBottomWidth: 1,

          borderBottomColor:
            Colors.border,

          overflow: "hidden",
        }}
      >

        {/* ------------------------------------------------ */}
        {/* ✨ PORTAL */}
        {/* ------------------------------------------------ */}

        <View
          style={{

            width: "80%",

            paddingHorizontal: 20,

            paddingVertical: 16,

            borderRadius:
              Radius.lg,

            backgroundColor:
              Colors.card,

            borderWidth: 1,

            borderColor:
              Colors.border,

            alignItems: "center",
            justifyContent: "center",
          }}
        >

          {/* ------------------------------------------------ */}
          {/* 🌿 REFLECTION INPUT */}
          {/* ------------------------------------------------ */}

          <TextInput
            placeholder={
              "Share a reflection\nor simply observe..."
            }

            placeholderTextColor={
              Colors.mutedText
            }

            multiline

            textAlign="center"

            returnKeyType="done"

            blurOnSubmit={true}

            onSubmitEditing={
              Keyboard.dismiss
            }

            style={{

              width: "86%",

              color:
                Colors.white,

              fontFamily:
                Fonts.light,

              fontSize: 13,

              lineHeight: 22,

              minHeight: 58,

              textAlignVertical:
                "center",

              opacity:
                Opacity.medium,
            }}
          />

          {/* ------------------------------------------------ */}
          {/* 🌌 FIELD DIVIDER */}
          {/* ------------------------------------------------ */}

          <View
            style={{

              width: "18%",

              height: 1,

              backgroundColor:
                Colors.border,

              marginTop: 2,
              marginBottom: 14,

              opacity: 0.5,
            }}
          />

          {/* ------------------------------------------------ */}
          {/* ✨ GUIDE TUNING */}
          {/* ------------------------------------------------ */}

          <GuideSelector />

          {/* ------------------------------------------------ */}
          {/* ✨ DIAMOND ACTION */}
          {/* ------------------------------------------------ */}

          <TouchableOpacity
            activeOpacity={0.82}

            onPress={Keyboard.dismiss}

            style={{

              marginTop: 14,

              alignItems: "center",
              justifyContent: "center",
            }}
          >

            <Text
              style={{
                color:
                  Colors.diamond,

                fontFamily:
                  Fonts.light,

                fontSize: 14,

                opacity: 0.72,

                letterSpacing: 1,
              }}
            >
              ✧
            </Text>

          </TouchableOpacity>

        </View>

      </View>

    </TouchableWithoutFeedback>
  );
}