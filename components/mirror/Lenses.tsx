// /components/mirror/Lenses.tsx

import React, {
  useState,
} from "react";

import {
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

// --------------------------------------------------
// 🧠 TYPES
// --------------------------------------------------

type Props = {

  userContext: any;

  context: any;

  language: any;

  languageContext: any;
};

// --------------------------------------------------
// 👁 LENSES
// --------------------------------------------------

export default function Lenses({

  userContext,

  context,

  language,

  languageContext,

}: Props) {

  // --------------------------------------------------
  // 🧩 STATE
  // --------------------------------------------------

  const [
    selected,
    setSelected,
  ] = useState<
    string | null
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

  // --------------------------------------------------
  // 🌌 DAILY FIELD
  // --------------------------------------------------

  const dailyField =

    userContext
      ?.dailyField || {};

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

const hasPeople =

  !!(
    peopleContext
      ?.observableScenes
      ?.length ||

    peopleContext
      ?.manifestations
      ?.length
  );

  const hasPlaces =


    !!(
    placesContext
      ?.observableScenes
      ?.length ||

    placesContext
      ?.manifestations
      ?.length
  );

  const hasThings =

  !!(
    thingsContext
      ?.observableScenes
      ?.length ||

    thingsContext
      ?.manifestations
      ?.length
  );

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

console.log(
  "👁 LENS CONTEXTS:",
  lensContexts
);

  // --------------------------------------------------
  // 🚀 HANDLE PRESS
  // --------------------------------------------------

  const handlePress = async (

    lens:
      | "people"
      | "places"
      | "things"

  ) => {

    setSelected(lens);

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

 if (

  !lensContext
    ?.manifestations
    ?.length &&

  !lensContext
    ?.observableScenes
    ?.length
) {

      return;
    }

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

            userContext,

            mirrorContext:
              context,

            lensContext,

            dailyField,

            aiLens:

  userContext
    ?.aiLens?.[
      lens
    ] || {},

    cosmicField:

  userContext
    ?.dailyField || {},

            // --------------------------------------------------
            // 🪞 OBSERVABLE REALITY
            // --------------------------------------------------

            observableScenes:

              lensContext
                ?.observableScenes || [],

            nervousSystemState:

              lensContext
                ?.nervousSystemState || null,


// --------------------------------------------------
// 🪞 MANIFESTATION FIELD
// --------------------------------------------------

manifestations:

  lensContext
    ?.manifestations || [],

copingStrategies:

  lensContext
    ?.copingStrategies || [],

bodyResponses:

  lensContext
    ?.bodyResponses || [],

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

              userContext
                ?.dominantPattern,

            recurringPatterns:

              userContext
                ?.recurringPatterns || [],

            distortions:

              userContext
                ?.distortions || {},

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

  // --------------------------------------------------
  // 🌌 RENDER
  // --------------------------------------------------

  return (

    <View style={styles.container}>

      {/* 🔘 LENSES */}

      <View style={styles.row}>

        {renderButton(
          "people"
        )}

        {renderButton(
          "places"
        )}

        {renderButton(
          "things"
        )}

      </View>

      {/* ✨ LABEL */}

      <Text style={styles.label}>

        {t("mirror.header")}

      </Text>

      {/* 🪞 RESPONSE */}

      {selected && (

        <View
          style={
            styles.responseBox
          }
        >

          {loading &&
          !responses[
            selected
          ] ? (

            <Text
              style={
                styles.loadingText
              }
            >

              ...

            </Text>

          ) : (

            <Text
              style={
                styles.responseText
              }
            >

              {
                responses[
                  selected
                ]
              }

            </Text>
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

      width: "100%",

      alignItems:
        "center",

      marginTop: -10,

      paddingBottom: 24,
    },

    row: {

      flexDirection:
        "row",

      justifyContent:
        "center",

      gap: 12,

      marginBottom: 14,
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

      marginTop: 6,

      opacity: 0.72,

      letterSpacing: 0.4,
    },

    responseBox: {

      marginTop: 24,

      paddingHorizontal: 32,

      maxWidth: "92%",
    },

    responseText: {

      color:
        Colors.softText,

      fontSize: 14,

      lineHeight: 28,

      textAlign:
        "center",

      fontWeight:
        "300",

      opacity: 0.9,
    },

    loadingText: {

      color:
        Colors.mutedText,

      fontSize: 11,

      fontStyle:
        "italic",

      opacity: 0.72,
    },
  });