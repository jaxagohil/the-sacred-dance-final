// /components/mirror/ReadingContainer.tsx

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
  supabase,
} from "../../services/supabase";

import {
  buildDivineContext,
} from "../../lib/context/buildDivineContext";

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

import {
  t,
} from "../../lib/i18n/t";

// --------------------------------------------------
// 🧠 TYPES
// --------------------------------------------------

type Props = {

  userContext?: any;

  context?: any;

  language?: string;

  languageContext?: any;

  cosmic?: any;
};

// --------------------------------------------------
// 🎨 COLOUR SYSTEM
// --------------------------------------------------

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

// --------------------------------------------------
// 📖 READING CONTAINER
// --------------------------------------------------

export default function ReadingContainer({

  userContext,

  context,

  language = "en",

  languageContext,

  cosmic,

}: Props) {

  // --------------------------------------------------
  // 🧩 STATE
  // --------------------------------------------------

  const [
    show,
    setShow,
  ] = useState(false);

  const [
    showTarot,
    setShowTarot,
  ] = useState(false);

  const [
    oracle,
    setOracle,
  ] = useState<any>(null);

  const [
    displayOracle,
    setDisplayOracle,
  ] = useState<any>(null);

  const [
    tarot,
    setTarot,
  ] = useState<any>(null);

  const [
    typed,
    setTyped,
  ] = useState("");

  const [
    loadingReading,
    setLoadingReading,
  ] = useState(false);

  const [
    tarotWhisper,
    setTarotWhisper,
  ] = useState("");

  const tarotAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  // --------------------------------------------------
  // 🧠 CONTEXT
  // --------------------------------------------------

  const mirrorContext =
    context || {};

  const ctx =
    userContext || {};

  // --------------------------------------------------
  // ✨ OPEN READING
  // --------------------------------------------------

  const handleOpen =
    async () => {

    //
    // 🌌 DAILY FIELD
    //

    const dailyField =
      cosmic?.dailyField || {};

    //
    // 🃏 DAILY ORACLE
    //

    const selectedOracle =
      dailyField?.oracleCard;

    if (!selectedOracle) {

      console.log(
        "❌ No oracle card selected"
      );

      return;
    }

    //
    // 🌍 LOCALIZATION
    //

    let localizedOracle =
      selectedOracle;

    if (
      language !== "en"
    ) {

      const {
        data: translation,
      } = await supabase

        .from(
          "oracle_card_translations"
        )

        .select("*")

        .eq(
          "card_number",
          selectedOracle.card_number
        )

        .eq(
          "language",
          language
        )

        .maybeSingle();

      if (translation) {

        localizedOracle = {

          ...selectedOracle,

          title:
            translation.title,

          affirmation:
            translation.affirmation,
        };
      }
    }

    setOracle(
      selectedOracle
    );

    setDisplayOracle(
      localizedOracle
    );

    //
    // 🔮 TAROT
    //

    const selectedTarot =
      await selectTarotCard({

        patterns:
          ctx?.activePatterns || [],

        distortions:
          ctx?.distortions || {},

        oracleCard:
          selectedOracle,

        cosmic:
          cosmic?.cosmic,
      });

    //
    // ✨ DISPLAY
    //

    setTarot(
      selectedTarot
    );

    setShowTarot(false);

    tarotAnim.setValue(0);

    setShow(true);

    setTarotWhisper("");

    //
    // 🤖 AI READING
    //

    setLoadingReading(true);

    try {

      //
      // ✨ DIVINE CONTEXT
      //

      const divineContext =
        await buildDivineContext({

          userContext: ctx,

          mirrorContext,

          oracleCard:
            selectedOracle,

          tarotCard:
            selectedTarot,

          dailyField,
        });

      //
      // 🃏 TAROT WHISPER
      //

      const tarotResult =
        await generateAIResponse({

          type: "tarot",

          context: {

            user: ctx,
          },

          data: {

            language,

            languageContext,

            //
            // 🃏 ORACLE
            //

            oracle:
              selectedOracle?.title,

            oracleMeaning:
              selectedOracle?.message,

            oracleSubheader:
              selectedOracle?.theme,

            //
            // 🔮 TAROT
            //

            symbolicTemperature:

              selectedTarot
                ?.symbolic_temperature,

            //
            // 🌌 COSMIC
            //

            moon:
              cosmic?.cosmic
                ?.moon_sign,

            phase:
              cosmic?.cosmic
                ?.moon_phase,

            sun:
              cosmic?.cosmic
                ?.sun_sign,

            cosmicMessage:

              cosmic?.moonLine +

              " " +

              cosmic?.phaseLine +

              " " +

              cosmic?.sunLine,

            //
            // 🌊 USER CONTEXT
            //

            dominantPattern:

              ctx?.dominantPattern,

            recurringPatterns:

              ctx?.recurringPatterns || [],

            observableScenes:

              ctx?.observableScenes || [],

            distortions:

              ctx?.distortions || {},

            awarenessChakra:

              ctx?.awarenessChakra,

            dominantChakra:

              ctx?.dominantChakra,

            cycles:
              ctx?.cycles || [],

            childhoodSignals:

              ctx?.childhoodSignals || {},

            patterns:
              ctx?.activePatterns || [],

            energy:
              ctx?.energy || {},
          },
        });

      //
      // 🌌 DIVINE READING
      //

      const aiText =
        await generateAIResponse({

          type: "divine",

          context: {

            user: ctx,
          },

          data: {

            language,

            languageContext,

            divineContext,

            //
            // 🌊 USER CONTEXT
            //

            dominantPattern:

              ctx?.dominantPattern,

            recurringPatterns:

              ctx?.recurringPatterns || [],

            observableScenes:

              ctx?.observableScenes || [],

            distortions:

              ctx?.distortions || {},

            awarenessChakra:

              ctx?.awarenessChakra,

            dominantChakra:

              ctx?.dominantChakra,

            childhoodSignals:

              ctx?.childhoodSignals || {},

            cycles:
              ctx?.cycles || [],

            //
            // 🪞 MIRROR
            //

            mirrorContext,

            //
            // 🃏 ORACLE
            //

            oracleCard: {

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

              energyCategory:

                selectedOracle
                  ?.energy_category,

              emotionalFrequency:

                selectedOracle
                  ?.emotional_frequency,

              symbolicTone:

                selectedOracle
                  ?.symbolic_tone,

              relationalEnergy:

                selectedOracle
                  ?.relational_energy,

              cadenceStyle:

                selectedOracle
                  ?.cadence_style,

              inquiryEnergy:

                selectedOracle
                  ?.inquiry_energy,

              symbolicEnvironment:

                selectedOracle
                  ?.symbolic_environment,

              archetypalTemperature:

                selectedOracle
                  ?.archetypal_temperature,

              imageryKeywords:

                selectedOracle
                  ?.imagery_keywords || [],

              inquiryExamples:

                selectedOracle
                  ?.inquiry_examples || [],

              behaviouralThemes:

                selectedOracle
                  ?.behavioural_themes || [],

              movementKeywords:

                selectedOracle
                  ?.movement_keywords || [],
            },

            //
            // 🔮 TAROT
            //

            tarotCard: {

              name:
                selectedTarot?.name,

              arcana:
                selectedTarot?.arcana,

              suit:
                selectedTarot?.suit,

              archetype:

                selectedTarot
                  ?.archetype_family,

              questionStyle:

                selectedTarot
                  ?.question_style,

              symbolicTemperature:

                selectedTarot
                  ?.symbolic_temperature,

              pacingStyle:

                selectedTarot
                  ?.pacing_style,

              symbolicAtmosphere:

                selectedTarot
                  ?.symbolic_atmosphere || [],

              imageryKeywords:

                selectedTarot
                  ?.imagery_keywords || [],

              movementKeywords:

                selectedTarot
                  ?.movement_keywords || [],

              environmentKeywords:

                selectedTarot
                  ?.environment_keywords || [],

              inquiryExamples:

                selectedTarot
                  ?.inquiry_examples || [],

              behaviouralThemes:

                selectedTarot
                  ?.behavioural_themes || [],

              archetypalEnergy:

                selectedTarot
                  ?.archetypal_energy || [],

              tensionPatterns:

                selectedTarot
                  ?.tension_patterns || [],
            },

            //
            // 🌌 FIELD
            //

            dailyField,

            //
            // ✨ BASE
            //

            base:
              "Beloved... breathe.",
          },
        });

      //
      // ✨ RESPONSE
      //

      setTyped(

        typeof aiText ===
        "string"

          ? aiText

          : aiText?.reading ||

            ""
      );

      setTarotWhisper(

        typeof tarotResult ===
        "object"

          ? tarotResult
              ?.tarotWhisper ||

            ""

          : tarotResult || ""
      );

      setLoadingReading(
        false
      );

    } catch (err) {

      console.log(
        "AI fallback"
      );

      setTyped(

        selectedOracle
          ?.affirmation ||

        "..."
      );

      setTarotWhisper(

        selectedTarot
          ?.symbolic_temperature ||

        ""
      );

      setLoadingReading(
        false
      );
    }
  };

  // --------------------------------------------------
  // 🔮 TAROT REVEAL
  // --------------------------------------------------

  useEffect(() => {

    if (
      !show ||
      !oracle
    ) return;

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

  // --------------------------------------------------
  // ✨ TAROT STYLE
  // --------------------------------------------------

  const tarotStyle = {

    opacity:
      tarotAnim,

    transform: [

      {

        translateY:

          tarotAnim.interpolate({

            inputRange:
              [0, 1],

            outputRange:
              [30, -10],
          }),
      },

      {
        rotate: "5deg",
      },
    ],
  };

  // --------------------------------------------------
  // ✨ INITIAL
  // --------------------------------------------------

  if (!oracle) {

    return (

      <View style={styles.container}>

        <TouchableOpacity
          onPress={handleOpen}
        >

          <Text style={styles.trigger}>

            {t(
              "mirror.divine_guidance"
            )}

          </Text>

        </TouchableOpacity>

      </View>
    );
  }

  // --------------------------------------------------
  // 🎨 ORACLE COLOR
  // --------------------------------------------------

  const borderColor =

    COLOUR_CONFIG[
      oracle.colour
    ] ||

    "#D4AF37";

  // --------------------------------------------------
  // 🌌 RENDER
  // --------------------------------------------------

  return (

    <View style={styles.container}>

      {show && (

        <View style={styles.canvas}>

          {/* 🃏 ORACLE */}

          <View
            style={
              styles.oracleWrap
            }
          >

            <OracleCard

              number={
                oracle.card_number
              }

              title={

                displayOracle
                  ?.title ||

                oracle.title
              }

              message={

                displayOracle
                  ?.affirmation ||

                oracle.affirmation
              }

              colour={
                borderColor
              }
            />

          </View>

          {/* 🔮 TAROT */}

          {showTarot &&
            tarot && (

            <Animated.View

              style={[

                styles.tarot,

                tarotStyle,
              ]}
            >

              <TarotCard

                number={
                  tarot.number
                }

                title={
                  tarot.name
                }

                archetype={
                  tarot.archetype
                }

                message={

                  loadingReading

                    ? ""

                    : tarotWhisper ||

                      tarot.symbolic_temperature
                }
              />

            </Animated.View>
          )}

          {/* 🧠 READING */}

          {showTarot && (

            <ScrollView

              style={
                styles.readingScroll
              }

              contentContainerStyle={{

                alignItems:
                  "center",

                paddingBottom:
                  140,
              }}

              showsVerticalScrollIndicator={
                false
              }
            >

              {/* 🌙 LINE */}

              <View
                style={
                  styles.readingLine
                }
              />

              {/* ✨ TEXT */}

              <Text
                style={
                  styles.reading
                }
              >

                {

                  loadingReading

                    ? ""

                    : typed
                }

              </Text>

            </ScrollView>
          )}

        </View>
      )}

    </View>
  );
}

// --------------------------------------------------
// 🎨 STYLES
// --------------------------------------------------

const styles =
  StyleSheet.create({

    container: {

      alignItems:
        "center",

      marginTop: 40,
    },

    trigger: {

      color:
        Colors.softText,

      fontSize: 14,

      letterSpacing: 1,

      marginTop: 20,
    },

    canvas: {

      width: "100%",

      alignItems:
        "center",

      paddingTop: 40,
    },

    readingScroll: {

      width: "100%",

      marginTop: 20,
    },

    oracleWrap: {

      alignItems:
        "center",

      marginTop: 20,

      zIndex: 1,
    },

    tarot: {

      marginTop: -120,

      alignSelf:
        "flex-end",

      marginRight: 22,

      width: 180,

      zIndex: 2,
    },

    readingLine: {

      width: 42,

      height: 1,

      borderRadius: 999,

      backgroundColor:
        "rgba(255,255,255,0.12)",

      marginTop: 10,

      marginBottom: 2,
    },

    reading: {

      marginTop: 20,

      paddingHorizontal: 40,

      paddingVertical: 10,

      paddingBottom: 20,

      maxWidth: 280,

      textAlign:
        "center",

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