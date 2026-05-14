import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  buildDivineContext,
} from "../../lib/context/buildDivineContext";

import {
  buildDailyField,
} from "../../lib/cosmic/buildDailyField";

import {
  Colors,
} from "../../constants/theme";

import {
  generateAIResponse,
} from "../../lib/ai/generateAIResponse";

import {
  selectTarotCard,
} from "../../lib/selectTarotCard";

import OracleCard from "./OracleCard";

import TarotCard from "./TarotCard";

import { t } from "../../lib/i18n/t";

type Props = {
  context?: any;
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
    // 🌌 DAILY FIELD
    //

    const dailyField =
      await buildDailyField();

    //
    // 🃏 DAILY ORACLE
    //

    const selectedOracle =
      dailyField.oracleCard;

      if (!selectedOracle) {

  console.log(
    "❌ No oracle card selected"
  );

  return;
}

    //
    // 🔮 TAROT ACTIVATION
    //

const selectedTarot =
  await selectTarotCard({

    patterns:
      ctx?.patterns || [],

    distortion:
      ctx?.distortion || [],

    oracleCard:
      selectedOracle,

    cosmic:
      dailyField?.cosmic,

  });
    //
    // ✨ DISPLAY
    //

    setOracle(selectedOracle);

    setTarot(selectedTarot);

    setShowTarot(false);

    tarotAnim.setValue(0);

    setShow(true);

    setTyped(
      "Beloved..."
    );

    //
    // 🤖 AI READING
    //

    try {

      //
      // ✨ DIVINE CONTEXT
      //

      const divineContext =
        await buildDivineContext({

          userContext: ctx,

          oracleCard:
            selectedOracle,

          tarotCard:
            selectedTarot,

          dailyField,
        });

      //
      // 🤖 GENERATE
      //


      console.log(
  "🌌 DIVINE PAYLOAD:",
  {

    oracle: {

      title:
        selectedOracle?.title,

      tone:
        selectedOracle?.symbolic_tone,

      energy:
        selectedOracle?.energy_category,

      themes:
        selectedOracle?.behavioural_themes,
    },

    tarot: {

      name:
        selectedTarot?.name,

      atmosphere:
        selectedTarot?.symbolic_atmosphere,

      tension:
        selectedTarot?.tension_patterns,

      pacing:
        selectedTarot?.pacing_style,
    },
  }
);

      const aiText =
        await generateAIResponse({

          type: "divine",

          context: {

            user: ctx,
          },

 data: {

  divineContext,

  message:
    "Divine Guidance for this soul in the present moment.",

  oracleCard: {

    //
    // 🃏 CORE
    //

    number:
      selectedOracle?.card_number,

    title:
      selectedOracle?.title,

    affirmation:
      selectedOracle?.affirmation,

    message:
      selectedOracle?.message,

    theme:
      selectedOracle?.theme,

    chakra:
      selectedOracle?.chakra,

    colour:
      selectedOracle?.colour,

    //
    // 🌌 SYMBOLIC FIELD
    //

    energyCategory:
      selectedOracle?.energy_category,

    emotionalFrequency:
      selectedOracle?.emotional_frequency,

    symbolicTone:
      selectedOracle?.symbolic_tone,

    relationalEnergy:
      selectedOracle?.relational_energy,

    cadenceStyle:
      selectedOracle?.cadence_style,

    inquiryEnergy:
      selectedOracle?.inquiry_energy,

    symbolicEnvironment:
      selectedOracle?.symbolic_environment,

    archetypalTemperature:
      selectedOracle?.archetypal_temperature,

    //
    // 🧠 ARRAYS
    //

    imageryKeywords:
      selectedOracle?.imagery_keywords || [],

    inquiryExamples:
      selectedOracle?.inquiry_examples || [],

    behaviouralThemes:
      selectedOracle?.behavioural_themes || [],

    movementKeywords:
      selectedOracle?.movement_keywords || [],
  },

  tarotCard: {

    //
    // 🔮 CORE
    //

    name:
      selectedTarot?.name,

    arcana:
      selectedTarot?.arcana,

    suit:
      selectedTarot?.suit,

    archetype:
      selectedTarot?.archetype_family,

    //
    // 🌌 SYMBOLIC FIELD
    //

    questionStyle:
      selectedTarot?.question_style,

    symbolicTemperature:
      selectedTarot?.symbolic_temperature,

    pacingStyle:
      selectedTarot?.pacing_style,

    //
    // 🧠 ARRAYS
    //

    symbolicAtmosphere:
      selectedTarot?.symbolic_atmosphere || [],

    imageryKeywords:
      selectedTarot?.imagery_keywords || [],

    movementKeywords:
      selectedTarot?.movement_keywords || [],

    environmentKeywords:
      selectedTarot?.environment_keywords || [],

    inquiryExamples:
      selectedTarot?.inquiry_examples || [],

    behaviouralThemes:
      selectedTarot?.behavioural_themes || [],

    archetypalEnergy:
      selectedTarot?.archetypal_energy || [],

    tensionPatterns:
      selectedTarot?.tension_patterns || [],
  },

  dailyField,

  base:
    "Beloved... breathe.",
},
        });

      setTyped(aiText);

    } catch (err) {

      console.log(
        "AI fallback"
      );

      setTyped(

        selectedOracle
          ?.affirmation ||

        "Beloved..."
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
            {t("mirror.divine_guidance")}
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
              number={oracle.card_number}
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
                message={tarot.symbolic_temperature}
              />

            </Animated.View>
          )}

          {/* 🧠 READING */}

          {showTarot && (

            <ScrollView
              style={styles.readingScroll}

              contentContainerStyle={{
                alignItems: "center",
                paddingBottom: 140,
              }}

              showsVerticalScrollIndicator={false}
            >

              {/* 🌙 READING LINE */}

              <View
                style={
                  styles.readingLine
                }
              />

              <Text style={styles.reading}>
                {typed}
              </Text>

            </ScrollView>
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

  readingScroll: {

    width: "100%",

    marginTop: 20,
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

    marginTop: 10,

    marginBottom: 2,
  },

  //
  // 🧠 READING
  //

  reading: {

    marginTop: 20,

    paddingHorizontal: 40,

    paddingVertical: 10,

    paddingBottom: 20,

    maxWidth: 280,

    textAlign: "center",

    color:
      "rgba(255,255,255,0.84)",

    lineHeight: 20,

    fontSize: 15,

    fontWeight: "300",

    letterSpacing: 0.1,

    backgroundColor:
      "rgba(255,255,255,0.02)",

    borderRadius: 28,

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.04)",
  },
});