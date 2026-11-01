// /components/mirror/Lenses.tsx

import React, {
  useState,
} from "react";

import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  generateAIResponse,
} from "../../lib/ai/generateAIResponse";

import {
  Colors,
} from "../../constants/theme";

import {
  t,
} from "../../lib/i18n/t";

import {
  useMirrorStore,
} from "../../stores/mirrorStore";

import OrnateMirror from "../livingSpace/OrnateMirror";

// --------------------------------------------------
// 🧠 TYPES
// --------------------------------------------------

type Props = {
  userContext: any;
  context: any;
  language: any;
  languageContext: any;
  presentation?: "buttons" | "icons";
};

// --------------------------------------------------
// 👁 LENSES
// --------------------------------------------------

export default function Lenses({

  userContext,

  context,

  language,

  languageContext,

    presentation = "buttons",

}: Props) {

  // --------------------------------------------------
  // 🧩 STATE
  // --------------------------------------------------

  const [
    selected,
    setSelected,
  ] = useState<
  "people" | "places" | "things" | null
>(null);

const [showLensResponse, setShowLensResponse] = useState(false);

const [hovered, setHovered] = useState<
  "people" | "places" | "things" | null
>(null);

  const [
    responses,
    setResponses,
  ] = useState<{

    people?: string;

    places?: string;

    things?: string;

  }>({});

  const [
    loading,
    setLoading,
  ] = useState(false);

  /*
 * --------------------------------------------------
 * 🌌 ALIGNMENT OS
 * --------------------------------------------------
 */

const {

  entityLenses,

  expressionProfile,

  spiralScores,

} = useMirrorStore();

  // --------------------------------------------------
  // 🌌 DAILY FIELD
  // --------------------------------------------------

const dailyField =

  context
    ?.cosmic || {};

  // --------------------------------------------------
  // 🪞 LENS CONTEXTS
  // --------------------------------------------------

  const lensContexts =

    context
      ?.lensContexts || {};

  // --------------------------------------------------
  // 👁 LENS DATA
  // --------------------------------------------------

  const peopleContext =
    lensContexts.people;

  const placesContext =
    lensContexts.places;

  const thingsContext =
    lensContexts.things;

  // --------------------------------------------------
  // 👁 HAS DATA
  // --------------------------------------------------

const hasPeople = true;
const hasPlaces = true;
const hasThings = true;

  // --------------------------------------------------
  // 🧠 GET CONTEXT
  // --------------------------------------------------

  const getLensContext = (
    lens:
      | "people"
      | "places"
      | "things"
  ) => {

    return (
      lensContexts?.[lens]
    );
  };

  // --------------------------------------------------
  // 🚀 HANDLE PRESS
  // --------------------------------------------------

const handlePress = async (
  lens: "people" | "places" | "things"
) => {
  setSelected(lens);
  setShowLensResponse(true);

    // --------------------------------------------------
    // 🧠 EXISTING
    // --------------------------------------------------

    if (responses[lens]) {
      return;
    }

    const lensContext =
      getLensContext(
        lens
      );

    setLoading(true);

    try {

      // --------------------------------------------------
      // ✨ AI RESPONSE
      // --------------------------------------------------

      const res =
        await generateAIResponse({

          type: "lens",

          // --------------------------------------------------
          // 🧠 CONTEXT
          // --------------------------------------------------

          context,

          // --------------------------------------------------
          // 🌊 DATA
          // --------------------------------------------------

          data: {

            language,

            languageContext,

            lens,

            mirrorContext:
              context,

            lensContext,

expressionProfile,

spiralScores,

entityLenses,

            dailyField,

            aiLens:

context
  ?.aiLens?.[
    lens
  ] || {},

    cosmicField:

context
  ?.cosmic || {},

            // --------------------------------------------------
            // 🪞 OBSERVABLE REALITY
            // --------------------------------------------------

observableSceneThreads:

  lensContext
    ?.observableSceneThreads || [],

            nervousSystemState:

              lensContext
                ?.nervousSystemState || null,


// --------------------------------------------------
// 🪞 MANIFESTATION FIELD
// --------------------------------------------------

manifestationThreads:

  lensContext
    ?.manifestationThreads || [],

  energeticWeather:

  lensContext
    ?.energeticWeather || {},  

copingStrategyThreads:

  lensContext
    ?.copingStrategyThreads || [],

bodyResponseThreads:

  lensContext
    ?.bodyResponseThreads || [],

mirrorPrompts:

  lensContext
    ?.mirrorPrompts || [],

integratedExpressions:

  lensContext
    ?.integratedExpressions || [],



            // --------------------------------------------------
            // 🌊 PATTERNS
            // --------------------------------------------------

            dominantPattern:

context
  ?.current
  ?.dominantPattern,

            activatedPatterns:

context
  ?.current
  ?.activatedPatterns || [],


awarenessChakra:

  userContext
    ?.energy
    ?.awareness_chakra ||
  null,

            dominantChakra:

              userContext
                ?.dominantChakra,
          },
        });

      setResponses(
        (prev) => ({

          ...prev,

          [lens]: res,
        })
      );

    } catch (e) {

      console.error(
        "❌ LENS AI ERROR:",
        e
      );

      setResponses(
        (prev) => ({

          ...prev,

          [lens]:
            "...",
        })
      );

    } finally {

      setLoading(false);
    }
  };

  // --------------------------------------------------
  // 🔘 BUTTON
  // --------------------------------------------------

  const renderButton = (

    lens:
      | "people"
      | "places"
      | "things"

  ) => {

    const hasData =

      lens === "people"

        ? hasPeople

        : lens === "places"

        ? hasPlaces

        : hasThings;

    return (

      <TouchableOpacity

        style={[

          styles.button,

          selected === lens &&
            styles.active,

          !hasData &&
            styles.disabled,
        ]}

        onPress={() =>
          handlePress(lens)
        }

        disabled={!hasData}
      >

        <Text

          style={[

            styles.text,

            !hasData &&
              styles.disabledText,
          ]}
        >

          {t(`mirror.${lens}`)}

        </Text>

      </TouchableOpacity>
    );
  };

  const lensLabels = {
  people: "People",
  places: "Places",
  things: "Things",
};

const renderIcon = (
  lens: "people" | "places" | "things"
) => {
  const icons = {
    people: "♙",
    places: "⌖",
    things: "✧",
  };

  return (
    <OrnateMirror
      key={lens}
      symbol={icons[lens]}
      selected={selected === lens}
      onPress={() => handlePress(lens)}
      width={56}
      height={116}
    />
  );
};


  // --------------------------------------------------
  // 🌌 RENDER
  // --------------------------------------------------

  return (

    <View style={styles.container}>

      {/* 🔘 LENSES */}

<View
  style={[
    styles.row,
    presentation === "icons" && styles.iconRow,
  ]}
>
  {presentation === "icons"
    ? (
        <>
          {renderIcon("people")}
          {renderIcon("places")}
          {renderIcon("things")}
        </>
      )
    : (
        <>
          {renderButton("people")}
          {renderButton("places")}
          {renderButton("things")}
        </>
      )}
</View>

      {/* ✨ LABEL */}

      <Text style={styles.label}>

        {t("mirror.header")}

      </Text>

      {/* 🪞 RESPONSE */}


{hovered && (
  <View
    pointerEvents="none"
    style={styles.responseBox}
  >
    <Text style={styles.responseHeading}>
      {lensLabels[hovered]}
    </Text>

    {loading && !responses[hovered] ? (
      <Text style={styles.loadingText}>
        ...
      </Text>
    ) : (
      <Text style={styles.responseText}>
        {responses[hovered] || ""}
      </Text>
    )}
  </View>
)}

<Modal
  visible={showLensResponse}
  transparent
  animationType="fade"
  onRequestClose={() => setShowLensResponse(false)}
>
  <Pressable
    style={styles.lensResponseBackdrop}
    onPress={() => setShowLensResponse(false)}
  >
    <View
      style={styles.lensResponseFrame}
      onStartShouldSetResponder={() => true}
    >
      {loading ? (
        <ActivityIndicator color="#D9BD80" size="small" />
      ) : selected ? (
        <Text style={styles.lensResponseText}>
          {responses[selected] || ""}
        </Text>
      ) : null}
    </View>
  </Pressable>
</Modal>

    </View>
  );
}

// --------------------------------------------------
// 🎨 STYLES
// --------------------------------------------------

const styles =
  StyleSheet.create({

container: {
  width: "100%",
  alignItems: "center",
  marginTop: 5,
  paddingBottom: 10,
  position: "relative",
  zIndex: 20,
},

    row: {

      flexDirection:
        "row",

      justifyContent:
        "center",

      gap: 12,

      marginBottom: 10,
    },

    button: {

      paddingVertical: 12,

      paddingHorizontal: 18,

      borderRadius: 999,

      backgroundColor:
        "rgba(255,255,255,0.015)",

      borderWidth: 0.5,

      borderColor:
        "rgba(255,255,255,0.03)",
    },

    active: {

      backgroundColor:
        "rgba(255,255,255,0.045)",

      borderColor:
        "rgba(255,255,255,0.08)",
    },

    disabled: {

      opacity: 0.3,
    },

    text: {

      color:
        Colors.softText,

      fontSize: 13,

      fontWeight:
        "300",

      letterSpacing: 0.3,
    },

    disabledText: {

      color:
        Colors.subtleText,
    },

    label: {

      color:
        Colors.mutedText,

      fontSize: 10,

      textAlign:
        "center",

      marginTop: 2,

      opacity: 0.72,

      letterSpacing: 0.4,
    },

lensResponseBackdrop: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.35)",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  paddingTop: 225,
  paddingLeft: "47%",
},

lensResponseFrame: {
  width: 300,
  maxWidth: "90%",
  paddingVertical: 16,
  paddingHorizontal: 2,
  backgroundColor: "rgba(22,22,29,0.96)",
  borderWidth: 1,
  borderColor: "rgba(201,173,112,0.4)",
  borderRadius: 12,
},

lensResponseText: {
  color: "#E8E0D5",
  fontSize: 10,
  lineHeight: 18,
  textAlign: "center",
},
responseBox: {
  position: "absolute",
  top: 10,
  paddingHorizontal: 24,
  width: "100%",
  maxWidth: 900,
  backgroundColor: "rgba(3,4,5,0.96)",
  zIndex: 20,
  elevation: 20,
},

responseText: {
  color: Colors.softText,
  fontSize: 10,
  lineHeight: 15,
  textAlign: "center",
  fontWeight: "300",
  opacity: 0.85,
},

responseHeading: {
  color: "#C9AD70",
  fontSize: 13,
  textAlign: "center",
  marginBottom: 8,
},

responsePrompt: {
  color: Colors.mutedText,
  fontSize: 10,
  textAlign: "center",
  marginBottom: 12,
  letterSpacing: 0.3,
},

    loadingText: {

      color:
        Colors.mutedText,

      fontSize: 11,

      fontStyle:
        "italic",

      opacity: 0.72,
    },

iconRow: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: 18,
  marginBottom: 14,
},

hoverLabel: {
  position: "absolute",
  top: 48,
  color: "#AAA2B6",
  fontSize: 10,
  textAlign: "center",
},


  });