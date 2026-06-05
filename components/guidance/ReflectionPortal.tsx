// guidance/ReflectionPortal.tsx

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Animated,
  Easing,
  Keyboard,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";

import {
  Colors,
  Fonts,
  Opacity,
  Radius,
} from "../../constants/theme";

import { t } from "../../lib/i18n/t";

/*
 * --------------------------------------------------------
 * 🌌 COMPONENT
 * --------------------------------------------------------
 */

export default function ReflectionPortal({

  onSubmitReflection,

  isTyping = false,

}: any) {

  /*
   * --------------------------------------------------------
   * 🌊 STATE
   * --------------------------------------------------------
   */

  const [

    text,

    setText,

  ] = useState("");

  const [

    placeholderIndex,

    setPlaceholderIndex,

  ] = useState(0);

  /*
   * --------------------------------------------------------
   * 🌌 BREATHING
   * --------------------------------------------------------
   */

  const breathing =
    useRef(

      new Animated.Value(0)

    ).current;

  /*
   * --------------------------------------------------------
   * 🌫️ FOCUS GLOW
   * --------------------------------------------------------
   */

  const focusGlow =
    useRef(

      new Animated.Value(0)

    ).current;

  /*
   * --------------------------------------------------------
   * 🌌 ACTIVE
   * --------------------------------------------------------
   */

  const hasText =
    text.trim().length > 0;

    /*
 * --------------------------------------------------------
 * 🌌 PLACEHOLDERS
 * --------------------------------------------------------
 */

const placeholders = [
  t("guidance.portal"),
];

  /*
   * --------------------------------------------------------
   * 🌊 PLACEHOLDER
   * --------------------------------------------------------
   */

  const placeholder =
    useMemo(() => {

      return placeholders[
        placeholderIndex
      ];

    }, [placeholderIndex]);

  /*
   * --------------------------------------------------------
   * 🌌 ROTATION
   * --------------------------------------------------------
   */

  useEffect(() => {

    const interval =
      setInterval(() => {

        setPlaceholderIndex(
          (prev) => (

            prev + 1
          ) % placeholders.length
        );

      }, 7200);

    return () => {

      clearInterval(
        interval
      );
    };

  }, []);

  /*
   * --------------------------------------------------------
   * 🌫️ BREATHING LOOP
   * --------------------------------------------------------
   */

  useEffect(() => {

    const loop =

      Animated.loop(

        Animated.sequence([

          Animated.timing(
            breathing,

            {

              toValue: 1,

              duration: 7600,

              easing:
                Easing.inOut(
                  Easing.sin
                ),

              useNativeDriver: false,
            }
          ),

          Animated.timing(
            breathing,

            {

              toValue: 0,

              duration: 7600,

              easing:
                Easing.inOut(
                  Easing.sin
                ),

              useNativeDriver: false,
            }
          ),
        ])
      );

    loop.start();

    return () => {

      loop.stop();
    };

  }, []);

  /*
   * --------------------------------------------------------
   * 🌌 FOCUS STATE
   * --------------------------------------------------------
   */

  useEffect(() => {

    Animated.timing(
      focusGlow,

      {

        toValue:

          hasText || isTyping
            ? 1
            : 0,

        duration: 1800,

        easing:
          Easing.inOut(
            Easing.sin
          ),

        useNativeDriver: false,
      }
    ).start();

  }, [

    hasText,
    isTyping,
  ]);

  /*
   * --------------------------------------------------------
   * 🌊 SUBMIT
   * --------------------------------------------------------
   */

  async function handleSubmit() {

    if (!text.trim()) {

      return;
    }

    await onSubmitReflection?.({

      text,
    });

    setText("");
  }

  /*
   * --------------------------------------------------------
   * 🌌 RENDER
   * --------------------------------------------------------
   */

  return (

    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
    >

      <View
        style={{

          width: "100%",

          alignItems: "center",
          justifyContent: "center",

          paddingVertical: 2,

          overflow: "hidden",
        }}
      >

        {/* ------------------------------------------------ */}
        {/* 🌫️ BREATH FIELD */}
        {/* ------------------------------------------------ */}

        <Animated.View
          style={{

            position: "absolute",

width: 420,
height: 420,
bottom: -140,

            borderRadius: 999,

            backgroundColor:
              Colors.fieldGlow,

            opacity:

              focusGlow.interpolate({

                inputRange: [0, 1],

outputRange:
  [0.008, 0.028],
              }),

            transform: [

              {

                scale:

                  breathing.interpolate({

                    inputRange: [0, 1],

                    outputRange:
                      [0.96, 1.04],
                  }),
              },
            ],
          }}
        />

        {/* ------------------------------------------------ */}
        {/* ✨ PORTAL */}
        {/* ------------------------------------------------ */}

        <Animated.View
          style={{

            width: "78%",

            paddingHorizontal: 22,

            paddingVertical: 18,

            borderRadius:
              Radius.lg,

backgroundColor:
  "rgba(255,255,255,0.015)",

            borderWidth: 1,

            borderColor:

              focusGlow.interpolate({

                inputRange: [0, 1],

outputRange: [

  "rgba(120,120,120,0.18)",

  "rgba(180,180,180,0.28)",
],
              }),

            alignItems: "center",
            justifyContent: "center",

            overflow: "hidden",

          }}
        >

          {/* ------------------------------------------------ */}
          {/* 🌿 INPUT */}
          {/* ------------------------------------------------ */}

          <Animated.View
  style={{

    position: "absolute",

    width: "88%",
    height: "82%",

    borderRadius: 999,

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.035)",

    opacity:

      breathing.interpolate({

        inputRange: [0, 1],

        outputRange:
          [0.12, 0.22],
      }),
  }}
/>

          <TextInput
            value={text}

            onChangeText={
              setText
            }

            placeholder={
              placeholder
            }

            placeholderTextColor={
              Colors.mutedText
            }

            multiline

            textAlign="center"

            returnKeyType="done"

            blurOnSubmit={false}

            onSubmitEditing={
              handleSubmit
            }

            style={{

              width: "88%",

              color:
                Colors.white,

              fontFamily:
                Fonts.light,

              fontSize: 13,

              lineHeight: 24,

              minHeight: 62,

              textAlignVertical:
                "center",

              opacity:

                hasText
                  ? 0.94
                  : Opacity.medium,
            }}
          />

          {/* ------------------------------------------------ */}
          {/* 🌌 DIVIDER */}
          {/* ------------------------------------------------ */}

          <Animated.View
            style={{

              width: "18%",

              height: 1,

              backgroundColor:
                Colors.border,

              marginTop: 4,
              marginBottom: 16,

              opacity:

                breathing.interpolate({

                  inputRange: [0, 1],

                  outputRange:
                    [0.32, 0.58],
                }),
            }}
          />

          {/* ------------------------------------------------ */}
          {/* ✨ DIAMOND */}
          {/* ------------------------------------------------ */}

          <TouchableOpacity
            activeOpacity={0.9}

           disabled={!hasText || isTyping}
           
            onPress={
              handleSubmit
            }

            style={{

              marginTop: 16,

              alignItems: "center",
              justifyContent: "center",
            }}
          >

            <Animated.Text
              style={{

                color:
                  Colors.diamond,

                fontFamily:
                  Fonts.light,

                fontSize: 24,

                letterSpacing: 1,

                opacity:

  !hasText || isTyping

    ? 0.24

    : 0.92,

                textShadowColor:
                  Colors.diamond,

                textShadowOffset: {
                  width: 0,
                  height: 0,
                },

                textShadowRadius:

                  hasText && !isTyping
                    ? 12
                    : 4,

                transform: [

                  {

                    scale:

                      breathing.interpolate({

                        inputRange: [0, 1],

                        outputRange:

                          hasText && !isTyping

                            ? [1, 1.08]

                            : [1, 1.03],
                      }),
                  },
                ],
              }}
            >
              ✦
            </Animated.Text>

          </TouchableOpacity>

        </Animated.View>

      </View>

    </TouchableWithoutFeedback>
  );
}