// /components/mirror/CosmicLoadingField.tsx

import React, {
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  View,
} from "react-native";

const { width, height } =
  Dimensions.get("window");

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function CosmicLoadingField() {

  //
  // 🌫 CENTER GLOW
  //

  const glowAnim =
    useRef(
      new Animated.Value(0.18)
    ).current;

  //
  // ☄️ SHOOTING STAR
  //

  const shootingX =
    useRef(
      new Animated.Value(-140)
    ).current;

  const shootingY =
    useRef(
      new Animated.Value(0)
    ).current;

  const shootingOpacity =
    useRef(
      new Animated.Value(0)
    ).current;

  //
  // ✨ PARTICLES
  //

  const particles = useMemo(() => {

    return Array.from({ length: 26 }).map(() => ({

      x:
        random(-20, width + 20),

      y:
        random(80, height - 80),

      size:
        random(1.5, 5),

      opacity:
        new Animated.Value(
          random(0.08, 0.5)
        ),

      driftY:
        new Animated.Value(0),

      driftX:
        new Animated.Value(0),

      scale:
        new Animated.Value(
          random(0.8, 1.4)
        ),

      duration:
        random(4000, 9000),

      delay:
        random(0, 3000),
    }));

  }, []);

  //
  // 🌫 CENTRAL BREATH
  //

  useEffect(() => {

    Animated.loop(

      Animated.sequence([

        Animated.timing(
          glowAnim,
          {
            toValue: 0.05,

            duration: 2600,

            easing:
              Easing.inOut(
                Easing.ease
              ),

            useNativeDriver: true,
          }
        ),

        Animated.timing(
          glowAnim,
          {
            toValue: 0.22,

            duration: 2600,

            easing:
              Easing.inOut(
                Easing.ease
              ),

            useNativeDriver: true,
          }
        ),
      ])

    ).start();

  }, []);

  //
  // ✨ PARTICLE ANIMATION
  //

  useEffect(() => {

    particles.forEach((p) => {

      Animated.loop(

        Animated.sequence([

          Animated.parallel([

            Animated.timing(
              p.opacity,
              {
                toValue:
                  random(0.05, 0.8),

                duration:
                  p.duration,

                delay:
                  p.delay,

                easing:
                  Easing.inOut(
                    Easing.ease
                  ),

                useNativeDriver: true,
              }
            ),

            Animated.timing(
              p.driftY,
              {
                toValue:
                  random(-40, 40),

                duration:
                  p.duration,

                easing:
                  Easing.inOut(
                    Easing.ease
                  ),

                useNativeDriver: true,
              }
            ),

            Animated.timing(
              p.driftX,
              {
                toValue:
                  random(-20, 20),

                duration:
                  p.duration,

                easing:
                  Easing.inOut(
                    Easing.ease
                  ),

                useNativeDriver: true,
              }
            ),

            Animated.timing(
              p.scale,
              {
                toValue:
                  random(0.6, 1.8),

                duration:
                  p.duration,

                easing:
                  Easing.inOut(
                    Easing.ease
                  ),

                useNativeDriver: true,
              }
            ),
          ]),

          Animated.parallel([

            Animated.timing(
              p.opacity,
              {
                toValue:
                  random(0.04, 0.3),

                duration:
                  p.duration,

                easing:
                  Easing.inOut(
                    Easing.ease
                  ),

                useNativeDriver: true,
              }
            ),

            Animated.timing(
              p.driftY,
              {
                toValue:
                  random(-20, 20),

                duration:
                  p.duration,

                easing:
                  Easing.inOut(
                    Easing.ease
                  ),

                useNativeDriver: true,
              }
            ),

            Animated.timing(
              p.driftX,
              {
                toValue:
                  random(-12, 12),

                duration:
                  p.duration,

                easing:
                  Easing.inOut(
                    Easing.ease
                  ),

                useNativeDriver: true,
              }
            ),

            Animated.timing(
              p.scale,
              {
                toValue:
                  random(0.8, 1.2),

                duration:
                  p.duration,

                easing:
                  Easing.inOut(
                    Easing.ease
                  ),

                useNativeDriver: true,
              }
            ),
          ]),
        ])

      ).start();

    });

  }, []);

  //
  // ☄️ SHOOTING STAR
  //

  useEffect(() => {

    function runStar() {

      shootingX.setValue(-140);

      shootingY.setValue(
        random(120, 340)
      );

      Animated.sequence([

        Animated.delay(
          random(3000, 8000)
        ),

        Animated.parallel([

          Animated.timing(
            shootingX,
            {
              toValue:
                width + 180,

              duration: 1200,

              easing:
                Easing.out(
                  Easing.quad
                ),

              useNativeDriver: true,
            }
          ),

                      Animated.timing(
  shootingY,
  {
    toValue:
      random(260, 520),

    duration: 1200,

    easing:
      Easing.out(
        Easing.quad
      ),

    useNativeDriver: true,
  }
),

          Animated.sequence([

            Animated.timing(
              shootingOpacity,
              {
                toValue: 1,

                duration: 180,

                useNativeDriver: true,
              }
            ),

            Animated.timing(
              shootingOpacity,
              {
                toValue: 0,

                duration: 1800,

                useNativeDriver: true,
              }
            ),
          ]),
        ]),
      ]).start(() => {
        runStar();
      });
    }

    runStar();

  }, []);

  return (

    <View style={styles.container}>

      {/* 🌫 COSMIC FIELD */}

      <Animated.View
        style={[
          styles.glow,
          {
            opacity:
              glowAnim,

            transform: [

              {
                scale:
                  glowAnim.interpolate({
                    inputRange:
                      [0.05, 0.22],

                    outputRange:
                      [0.92, 1.08],
                  }),
              },
            ],
          },
        ]}
      />

      {/* ☄️ SHOOTING STAR */}

      <Animated.View
        style={[

          styles.shootingStar,

          {
            opacity:
              shootingOpacity,

            transform: [

              {
                translateX:
                  shootingX,
              },

              {
                translateY:
                  shootingY,
              },

              {
                rotate:
                  "-24deg",
              },
            ],
          },
        ]}
      />

      {/* ✨ CONSTELLATION DUST */}

      {particles.map((p, i) => {

        return (

          <Animated.View
            key={i}
            style={[

              styles.star,

              {
                width:
                  p.size,

                height:
                  p.size,

                borderRadius:
                  p.size,

                left:
                  p.x,

                top:
                  p.y,

                opacity:
                  p.opacity,

                transform: [

                  {
                    translateY:
                      p.driftY,
                  },

                  {
                    translateX:
                      p.driftX,
                  },

                  {
                    scale:
                      p.scale,
                  },
                ],
              },
            ]}
          />
        );
      })}

    </View>
  );
}

const styles =
  StyleSheet.create({

  container: {

    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor:
      "#000",

    overflow: "hidden",
  },

  glow: {

    position: "absolute",

    width: 220,
    height: 220,

    borderRadius: 999,

    backgroundColor:
      "rgba(255,255,255,0.06)",
  },

shootingStar: {

  position: "absolute",

  width: 80,

  height: 0.8,

  borderRadius: 999,

  backgroundColor:
    "rgba(255,255,255,0.75)",

  shadowColor:
    "#fff",

  shadowOpacity: 0.7,

  shadowRadius: 6,

  elevation: 6,
},

  star: {

    position: "absolute",

    backgroundColor:
      "rgba(255,255,255,0.95)",

    shadowColor:
      "#fff",

    shadowOpacity: 0.9,

    shadowRadius: 4,

    elevation: 4,
  },
});