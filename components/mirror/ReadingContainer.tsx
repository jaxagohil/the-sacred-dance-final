import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Colors,
} from "../../constants/theme";

import {
  generateAIResponse,
} from "../../lib/generateAIResponse";

import {
  selectOracleCard,
} from "../../lib/selectOracleCard";

import {
  selectTarotCard,
} from "../../lib/selectTarotCard";

import OracleCard from "./OracleCard";

import TarotCard from "./TarotCard";

type Props = {
  context?: {
    patterns?: string[];
    distortion?: string[];
    lens?: string;
    chakra?: string;

    cosmic?: {
      phase?: string;
      moon?: string;
      energy?: string;
      sign?: string;
    };
  };
};

//
// 🎨 COLOUR SYSTEM
//

const COLOUR_CONFIG:
  Record<string, string> = {

  silver:
    "#C0C0C0",

  copper:
    "#B87333",

  gold:
    "#D4AF37",

  pink:
    "#EC4899",

  royalblue:
    "#4169E1",

  navy:
    "#0B1F3A",

  black:
    "#999999",

  white:
    "#FFFFFF",

  silvergold:
    "#D6C27A",

  greygold:
    "#A8A29E",

  grey:
    "#6B7280",

  maroon:
    "#7F1D1D",

  orange:
    "#F97316",

  yellow:
    "#FACC15",

  green:
    "#22C55E",

  blue:
    "#3B82F6",

  purple:
    "#8B5CF6",
};

export default function ReadingContainer({
  context,
}: Props) {

  const [show, setShow] =
    useState(false);

  const [showTarot, setShowTarot] =
    useState(false);

  const [oracle, setOracle] =
    useState<any>(null);

  const [tarot, setTarot] =
    useState<any>(null);

  const [typed, setTyped] =
    useState("");

  const tarotAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  //
  // ✨ OPEN READING
  //

  const handleOpen =
    async () => {

    const ctx =
      context || {};

    //
    // 🧠 SELECT CARDS
    //

    const selectedOracle =
      selectOracleCard(ctx);

    const selectedTarot =
      selectTarotCard(ctx);

    setOracle(selectedOracle);

    setTarot(selectedTarot);

    setTyped("");

    setShowTarot(false);

    tarotAnim.setValue(0);

    setShow(true);

    //
    // 🤖 AI READING
    //

    try {

      const aiText =
        await generateAIResponse({

        type: "cards",

        data: {

          oracle: {

            number:
              selectedOracle.card,

            title:
              selectedOracle.title,

            affirmation:
              selectedOracle.affirmation,
          },

          tarot: {

            name:
              selectedTarot.name,

            archetype:
              selectedTarot.archetype,

            message:
              selectedTarot.message,
          },

          patterns:
            ctx.patterns,

          distortion:
            ctx.distortion,

          lens:
            ctx.lens,

          chakra:
            ctx.chakra,

          phase:
            ctx.cosmic?.phase,

          moon:
            ctx.cosmic?.moon,

          energy:
            ctx.cosmic?.energy,
        },
      });

      setTyped(aiText);

    } catch (err) {

      console.log(
        "AI fallback"
      );

      setTyped(
        selectedOracle
          .affirmation || ""
      );
    }
  };

  //
  // 🔮 TAROT REVEAL
  //

  useEffect(() => {

    if (!show || !oracle)
      return;

    const t =
      setTimeout(() => {

      setShowTarot(true);

      Animated.timing(
        tarotAnim,

        {
          toValue: 1,

          duration: 700,

          useNativeDriver: true,
        }

      ).start();

    }, 1200);

    return () =>
      clearTimeout(t);

  }, [show, oracle]);

  //
  // ✨ TAROT ANIMATION
  //

  const tarotStyle = {

    opacity:
      tarotAnim,

    transform: [

      {
        translateY:
          tarotAnim.interpolate({
            inputRange: [0, 1],

            outputRange:
              [30, -10],
          }),
      },

      {
        rotate: "5deg",
      },
    ],
  };

  //
  // ✨ INITIAL STATE
  //

  if (!oracle) {

    return (

      <View style={styles.container}>

        <TouchableOpacity
          onPress={handleOpen}
        >

          <Text style={styles.trigger}>
            pull a reading
          </Text>

        </TouchableOpacity>

      </View>
    );
  }

  //
  // 🎨 ORACLE COLOUR
  //

  const borderColor =
    COLOUR_CONFIG[
      oracle.colour
    ] ||

    "#D4AF37";

  return (

    <View style={styles.container}>

      {show && (

        <View style={styles.canvas}>

          {/* 🃏 ORACLE */}

          <View style={styles.oracleWrap}>

            <OracleCard
              number={oracle.card}
              title={oracle.title}
              message={
                oracle.affirmation
              }
              colour={borderColor}
            />

          </View>

          {/* 🔮 TAROT */}

          {showTarot && tarot && (

            <Animated.View
              style={[
                styles.tarot,
                tarotStyle,
              ]}
            >

              <TarotCard
                number={tarot.number}
                title={tarot.name}
                archetype={tarot.archetype}
                message={tarot.message}
              />

            </Animated.View>
          )}

          {/* 🧠 READING */}

          {showTarot && (

            <>

              {/* 🌙 READING LINE */}

              <View
                style={
                  styles.readingLine
                }
              />

              <Text style={styles.reading}>
                {typed}
              </Text>

            </>
          )}

        </View>
      )}

    </View>
  );
}

const styles =
  StyleSheet.create({

  //
  // 🌌 CONTAINER
  //

  container: {
    alignItems: "center",

    marginTop: 40,
  },

  //
  // ✨ TRIGGER
  //

  trigger: {
    color:
      Colors.softText,

    fontSize: 14,

    letterSpacing: 1,

    marginTop: 20,
  },

  //
  // 🌌 CANVAS
  //

  canvas: {
    width: "100%",

    alignItems: "center",

    paddingTop: 40,
  },

  //
  // 🃏 ORACLE
  //

  oracleWrap: {
    alignItems: "center",

    marginTop: 20,

    zIndex: 1,
  },

  //
  // 🔮 TAROT
  //

  tarot: {

    marginTop: -120,

    alignSelf: "flex-end",

    marginRight: 22,

    width: 180,

    zIndex: 2,
  },

  //
  // 🌙 READING LINE
  //

  readingLine: {

    width: 42,
    height: 1,

    borderRadius: 999,

    backgroundColor:
      "rgba(255,255,255,0.12)",

    marginTop: 44,
    marginBottom: -16,
  },

  //
  // 🧠 READING
  //

  reading: {

    marginTop: 42,

    paddingHorizontal: 14,

    paddingVertical: 5,

    maxWidth: 340,

    textAlign: "center",

    color:
      "rgba(255,255,255,0.84)",

    lineHeight: 30,

    fontSize: 15,

    fontWeight: "300",

    letterSpacing: 0.1,

    backgroundColor:
      "rgba(255,255,255,0.02)",

    borderRadius: 28,

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.04)",

    overflow: "hidden",

  },
});