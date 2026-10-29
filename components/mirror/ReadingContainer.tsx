// /components/mirror/ReadingContainer.tsx

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
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
  Fonts,
} from "../../constants/theme";

import {
  generateAIResponse,
} from "../../lib/ai/generateAIResponse";

import {
  selectTarotCard,
} from "../../lib/selectTarotCard";




// --------------------------------------------------
// 🧠 TYPES
// --------------------------------------------------

type Props = {

  userContext?: any;

  context?: any;

  language?: string;

  languageContext?: any;

  cosmic?: any;

  autoOpen?: boolean;
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

    autoOpen = false,


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

  const [messageVisible, setMessageVisible] = useState(false);
  const hasStarted = useRef(false);
  const hasAutoOpened = useRef(false);

  const tarotAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  // --------------------------------------------------
  // 🧠 CONTEXT
  // --------------------------------------------------

 const embodied =
  userContext || {};

const mirror =
  context || {};

  // --------------------------------------------------
  // ✨ OPEN READING
  // --------------------------------------------------

  const handleOpen =
    async () => {
    if (hasStarted.current) return;
    hasStarted.current = true;

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

      hasStarted.current = false;
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
          selectedOracle?.card_number
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

  mirror
    ?.current
    ?.activatedPatterns || [],

distortions:

embodied
  ?.distortions || [],

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

          userContext:
  embodied,

          mirrorContext:
  mirror,

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

            user: embodied,
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

mirror
  ?.current
  ?.dominantPattern,

            recurringPatterns:

mirror
  ?.evolution
  ?.recurringPatterns || [],

            observableScenes:
[
  mirror
    ?.story
    ?.primaryScene,
].filter(Boolean),

            distortions:
embodied
  ?.distortions || [],

awarenessChakra:

  embodied
    ?.energy
    ?.awareness_chakra ||

  null,

dominantChakra:

  embodied
    ?.energy
    ?.dominant_chakra ||

  null,

            cycles:
mirror
  ?.story || {},

            childhoodSignals:

embodied
  ?.childhoodSignals || {},

            patterns:
mirror
  ?.current
  ?.activatedPatterns || [],

            energy:
embodied
  ?.energy || {},
          },
        });

        //console.log( "🃏 RAW TAROT RESULT:", tarotResult);

      //
      // 🌌 DIVINE READING
      //

      const aiText =
        await generateAIResponse({

          type: "divine",

          context: {

            user: embodied,
          },

          data: {

            language,

            languageContext,

            divineContext,

            //
            // 🌊 USER CONTEXT
            //

            dominantPattern:

mirror
  ?.current
  ?.dominantPattern,

            recurringPatterns:

mirror
  ?.evolution
  ?.recurringPatterns || [],

            observableScenes:

[
  mirror
    ?.story
    ?.primaryScene,
].filter(Boolean),

distortions:

embodied
  ?.distortions || [],

awarenessChakra:

  embodied
    ?.energy
    ?.awareness_chakra ||

  null,

dominantChakra:

  embodied
    ?.energy
    ?.dominant_chakra ||

  null,

            childhoodSignals:

              embodied
  ?.childhoodSignals || {},

            cycles:
              mirror
  ?.story || {},

            //
            // 🪞 MIRROR
            //

            mirrorContext:
  mirror,

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

let whisper = tarotResult;

if (
  typeof whisper === "string"
) {

  try {

const cleaned =
  whisper
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

//console.log( "🃏 CLEANED TAROT:", cleaned);    

    if (
      cleaned.startsWith("{")
    ) {

      whisper =
        JSON.parse(
          cleaned
        );
    }

  } catch (err) {

    console.log(  "🃏 TAROT PARSE FAILED",  err);
  }
}

setTarotWhisper(

  typeof whisper === "object"

    ? whisper?.tarotWhisper || ""

    : ""
);

      setLoadingReading(
        false
      );

    } catch (err) {

      //console.log(  "AI fallback" );

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

  useEffect(() => {
    if (autoOpen && !hasAutoOpened.current) {
      hasAutoOpened.current = true;
      void handleOpen();
    }
  }, [autoOpen]);

  // --------------------------------------------------
  // 🔮 TAROT REVEAL
  // --------------------------------------------------

useEffect(() => {
  if (show && oracle && tarot) {
    setShowTarot(true);
  }
}, [show, oracle, tarot]);

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





  // --------------------------------------------------
  // 🎨 ORACLE COLOR
  // --------------------------------------------------

  const borderColor =

    COLOUR_CONFIG[
      oracle?.colour
    ] ||

    "#D4AF37";

  // --------------------------------------------------
  // 🌌 RENDER
  // --------------------------------------------------

return (
  <View style={styles.panelContent}>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={oracle ? "Show Divine Message" : "Reveal Oracle and Tarot"}
      onPress={() => {
        if (!oracle) void handleOpen();
      }}
      onHoverIn={() => {
        if (oracle) setMessageVisible(true);
      }}
      onHoverOut={() => setMessageVisible(false)}
      style={styles.cardStage}
    >
      <View style={styles.cardsRow}>
        {oracle ? (
          <>
            <View style={[styles.revealedCard, { borderColor }]}>
              <Text style={[styles.cardTitle, { color: borderColor }]}>
                {displayOracle?.title || oracle.title}
              </Text>
              <Text style={styles.cardMessage}>
                {displayOracle?.affirmation || oracle.affirmation}
              </Text>
            </View>
            <View style={[styles.revealedCard, { borderColor: "#D4AF37" }]}>
              {showTarot && tarot ? (
                <>
                  <Text style={styles.cardTitle}>{tarot.name}</Text>
                  <Text style={styles.cardMessage}>
                    {loadingReading ? " " : tarotWhisper || tarot.symbolic_temperature}
                  </Text>
                </>
              ) : null}
            </View>
          </>
        ) : (
          <>
            <View style={styles.miniCard}>
              <Image
                source={require("../../assets/logo.png")}
                style={styles.oracleLogo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.miniCard}>
              <Text style={styles.cardSymbol}>◉</Text>
            </View>
          </>
        )}
      </View>
      {oracle && messageVisible ? (
        <View pointerEvents="none" style={styles.messageOverlay}>
          <View style={styles.readingLine} />
          <Text style={styles.reading}>
            {loadingReading ? "The message is emerging…" : typed}
          </Text>
        </View>
      ) : null}
    </Pressable>
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
  flex: 1,
  alignItems: "center",
  minWidth: 0,
},

tarot: {
  flex: 1,
  minWidth: 0,
  alignSelf: "center",
  zIndex: 2,
},

panelContent: {
  width: "100%",
  alignSelf: "stretch",
},

cardStage: {
  width: "100%",
  position: "relative",
},

cardsRow: {
  width: "100%",
  height: 96,
  flexDirection: "row",
  gap: 8,
},

miniCard: {
  flex: 1,
  minWidth: 0,
  height: 96,
  borderWidth: 1,
  borderColor: "#C9AD70",
  borderRadius: 12,
  backgroundColor: "#111018",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
},

oracleLogo: {
  width: "72%",
  height: "72%",
},

cardSymbol: {
  color: "#C9AD70",
  fontSize: 28,
  fontWeight: "300",
},

revealedCard: {
  flex: 1,
  height: 96,
  minWidth: 0,
  borderWidth: 1,
  borderRadius: 12,
  backgroundColor: "#111018",
  padding: 10,
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
},

messageOverlay: {
  ...StyleSheet.absoluteFillObject,
  zIndex: 10,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "rgba(212,175,55,0.8)",
  backgroundColor: "rgba(8,8,14,0.96)",
  padding: 16,
  alignItems: "center",
  justifyContent: "center",
},

cardLabel: {
  fontSize: 9,
  letterSpacing: 2,
  marginBottom: 8,
},

cardTitle: {
  color: "#E9DFC9",
  fontSize: 12,
  textAlign: "center",
  marginBottom: 8,
},

cardMessage: {
  color: "rgba(255,255,255,0.7)",
  fontSize: 10,
  lineHeight: 15,
  textAlign: "center",
},

messageArea: {
  width: "100%",
  alignItems: "center",
  marginTop: 12,
},

readingLine: {
  width: 32,
  height: 1,
  backgroundColor: "rgba(212,175,55,0.5)",
  marginBottom: 10,
},

reading: {
  width: "100%",
  color: "rgba(255,230,180,0.88)",
  fontFamily: Fonts.orchestration,
  fontSize: 12,
  lineHeight: 16,
  textAlign: "center",
},
  });