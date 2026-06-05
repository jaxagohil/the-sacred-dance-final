// guidance/GuideTransmission.tsx

import React, {
  useEffect,
  useRef,
} from "react";

import {
  Animated,
  Easing,
  Text,
  View,
} from "react-native";

import {
  Fonts,
} from "../../constants/theme";

/*
 * --------------------------------------------------------
 * 🌌 COMPONENT
 * --------------------------------------------------------
 */

export default function GuideTransmission({

  role = "guide",

guide = "cosmic",

guideName = "Guide",

  text = "",

  isThinking = false,

}: any) {

  /*
   * --------------------------------------------------------
   * 🌊 ANIMATION
   * --------------------------------------------------------
   */

  const opacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const translateY =
    useRef(
      new Animated.Value(10)
    ).current;

  const breathing =
    useRef(
      new Animated.Value(0)
    ).current;

  const atmosphere = {

    width: "82%",

    fontSize: 11,

    lineHeight: 24,

    glow: 2,

    opacity: 0.9,

    breathing: 7600,
  };

  /*
   * --------------------------------------------------------
   * 🌫️ ARRIVAL
   * --------------------------------------------------------
   */

  useEffect(() => {

    Animated.parallel([

      Animated.timing(opacity, {

        toValue: 1,

        duration: 2200,

        easing:
          Easing.inOut(
            Easing.sin
          ),

        useNativeDriver: true,
      }),

      Animated.timing(translateY, {

        toValue: 0,

        duration: 2200,

        easing:
          Easing.inOut(
            Easing.sin
          ),

        useNativeDriver: true,
      }),

    ]).start();

  }, [text]);

  /*
   * --------------------------------------------------------
   * 🌌 BREATHING
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

              duration:
                atmosphere.breathing,

              easing:
                Easing.inOut(
                  Easing.sin
                ),

              useNativeDriver: true,
            }
          ),

          Animated.timing(
            breathing,

            {

              toValue: 0,

              duration:
                atmosphere.breathing,

              easing:
                Easing.inOut(
                  Easing.sin
                ),

              useNativeDriver: true,
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
   * 🌌 THINKING
   * --------------------------------------------------------
   */

  if (isThinking) {

    return (

      <View
        style={{

          width: "100%",

          alignItems: "center",

          justifyContent: "center",

          paddingTop: 18,

          paddingBottom: 10,
        }}
      >

        <Animated.Text
          style={{

            color:
              "rgba(255,255,255,0.42)",

            fontFamily:
              Fonts.light,

            fontSize: 11,

            opacity:

              breathing.interpolate({

                inputRange: [0, 1],

                outputRange:
                  [0.22, 0.58],
              }),

            letterSpacing: 0.6,

            textAlign: "center",
          }}
        >
          ...
        </Animated.Text>

      </View>
    );
  }

  /*
   * --------------------------------------------------------
   * 🌫️ EMPTY
   * --------------------------------------------------------
   */

  if (!text?.trim()) {

    return null;
  }

  /*
   * --------------------------------------------------------
   * 🌌 RENDER
   * --------------------------------------------------------
   */

  return (

    <View
      style={{

        width: "100%",

        alignItems: "center",

        justifyContent: "center",

        paddingTop: 10,
      }}
    >

      <Animated.View
        style={{

          width: "100%",

          alignItems: "center",

          justifyContent: "center",

          marginBottom: 14,

          paddingHorizontal: 20,

          opacity,

          transform: [

            {
              translateY,
            },

            {

              scale:

                breathing.interpolate({

                  inputRange: [0, 1],

                  outputRange:
                    [0.998, 1.004],
                }),
            },
          ],
        }}
      >

        {/* ------------------------------------------------ */}
        {/* 🌊 USER REFLECTION                              */}
        {/* ------------------------------------------------ */}

        {
          role === "user"

          &&

          (

            <Text
              style={{

                width: "82%",

                color:
                  "rgba(255,255,255,0.42)",

                fontFamily:
                  Fonts.light,

                fontSize: 10,

                lineHeight: 20,

                textAlign: "center",

                alignSelf: "center",

                letterSpacing: 0.4,

                marginBottom: 24,
              }}
            >
              {text}
            </Text>
          )
        }

        {/* ------------------------------------------------ */}
        {/* 🌌 GUIDE TRANSMISSION                           */}
        {/* ------------------------------------------------ */}

        {
          role === "guide"

          &&

          (

            <>

              <View
                style={{

                  width: "100%",

                  alignItems: "center",

                  justifyContent: "center",

                  marginBottom: 18,
                }}
              >

                <View
                  style={{

                    width: 80,

                    height: 1,

                    backgroundColor:
                      "rgba(255,255,255,0.08)",

                    marginBottom: 10,
                  }}
                />

                <Text
                  style={{

                    color:
                      "rgba(255,255,255,0.32)",

                    fontFamily:
                      Fonts.light,

                    fontSize: 10,

                    letterSpacing: 1.4,

                    textTransform:
                      "uppercase",
                  }}
                >
                  {guideName}
                </Text>

              </View>

              <Text
                style={{

                  width:
                    atmosphere.width,

                  color:
                    "rgba(255,255,255,0.92)",

                  fontFamily:
                    Fonts.light,

                  fontSize:
                    atmosphere.fontSize,

                  lineHeight:
                    atmosphere.lineHeight,

                  textAlign: "center",

                  alignSelf: "center",

                  letterSpacing: 0.12,

                  opacity:
                    atmosphere.opacity,

                  textShadowColor:
                    "rgba(255,255,255,0.18)",

                  textShadowOffset: {
                    width: 0,
                    height: 0,
                  },

                  textShadowRadius: 2,
                }}
              >
                {text}
              </Text>

            </>
          )
        }

      </Animated.View>

    </View>
  );
}