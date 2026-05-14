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

import { t } from "../../lib/i18n/t";

type Props = {

  mirror: any;

  energy: any;

  signals: any[];

  context: any;
};

export default function Lenses({

  mirror,

  energy,

  signals,

  context,

}: Props) {

  const [selected,
    setSelected] =
      useState<
        string | null
      >(null);

  const [responses,
    setResponses] =
      useState<{

        people?: string;

        places?: string;

        things?: string;

      }>({});

  const [loading,
    setLoading] =
      useState(false);

  /*
   * ---------------------------------------------------------
   * 🌌 DAILY FIELD
   * ---------------------------------------------------------
   */

  const dailyField =
    context?.dailyField || {};

  /*
   * ---------------------------------------------------------
   * REAL LENS DATA
   * ---------------------------------------------------------
   */

  const latestSignal =

    [...(signals || [])]

      .reverse()

      .find(

        (signal) => {

          const lens =
            signal?.ai_lens;

          return (

            lens && (

              lens.people?.length ||

              lens.places?.length ||

              lens.things?.length
            )
          );
        }

      ) || null;

  console.log(
    "✨ LATEST SIGNAL:",
    latestSignal
  );

  console.log(
    "👁 AI LENS:",
    latestSignal?.ai_lens
  );

  console.log(
    "🌌 DAILY FIELD:",
    dailyField
  );

  const lensData =
    latestSignal?.ai_lens || {

      people: [],

      places: [],

      things: [],
    };

  /*
   * ---------------------------------------------------------
   * HANDLE PRESS
   * ---------------------------------------------------------
   */

  const handlePress = async (

    lens:

      | "people"

      | "places"

      | "things"

  ) => {

    if (!mirror?.primary) {
      return;
    }

    /*
     * -------------------------------------------------------
     * NO DATA
     * -------------------------------------------------------
     */

    if (

      !lensData[lens] ||

      lensData[lens].length === 0

    ) {

      return;
    }

    setSelected(lens);

    /*
     * -------------------------------------------------------
     * ALREADY GENERATED
     * -------------------------------------------------------
     */

    if (responses[lens]) {
      return;
    }

    setLoading(true);

    try {

      const lensSignals =
        lensData[lens];

      /*
       * -----------------------------------------------------
       * AI RESPONSE
       * -----------------------------------------------------
       */

      const res =
        await generateAIResponse({

          type: "lens",

          /*
           * -------------------------------------------------
           * CONTEXT
           * -------------------------------------------------
           */

          context,

          /*
           * -------------------------------------------------
           * DATA
           * -------------------------------------------------
           */

          data: {

            lens,

            mirror,

            energy,

            lensSignals,

            /*
             * -----------------------------------------------
             * DAILY FIELD
             * -----------------------------------------------
             */

            dailyField,

            /*
             * -----------------------------------------------
             * LENS CONTEXT
             * -----------------------------------------------
             */

            lensContext:

              context
                ?.lensContexts?.[
                  lens
                ],
          },
        });

      setResponses((prev) => ({

        ...prev,

        [lens]: res,
      }));

    } catch (e) {

      console.error(
        "Lens AI error:",
        e
      );

      setResponses((prev) => ({

        ...prev,

        [lens]:
          "...",
      }));

    } finally {

      setLoading(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * BUTTON
   * ---------------------------------------------------------
   */

  const renderButton = (

    lens:

      | "people"

      | "places"

      | "things"

  ) => {

    const hasData =

      lensData[lens]
        ?.length > 0;

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

  /*
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */

  return (

    <View style={styles.container}>

      {/* 🔘 LENSES */}

      <View style={styles.row}>

        {renderButton("people")}

        {renderButton("places")}

        {renderButton("things")}

      </View>

      {/* ✨ LABEL */}

      <Text style={styles.label}>

        {t("mirror.header")}

      </Text>

      {/* 🧠 RESPONSE */}

      {selected && (

        <View style={styles.responseBox}>

          {loading &&
          !responses[selected] ? (

            <Text
              style={
                styles.loadingText
              }
            >

              listening...

            </Text>

          ) : (

            <Text
              style={
                styles.responseText
              }
            >

              {responses[selected]}

            </Text>
          )}

        </View>
      )}

    </View>
  );
}

const styles =
  StyleSheet.create({

  container: {

    width: "100%",

    alignItems: "center",

    marginTop: -10,

    paddingBottom: 24,
  },

  row: {

    flexDirection: "row",

    justifyContent: "center",

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

    fontWeight: "300",

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

    textAlign: "center",

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

    textAlign: "center",

    fontWeight: "300",

    opacity: 0.9,
  },

  loadingText: {

    color:
      Colors.mutedText,

    fontSize: 11,

    fontStyle: "italic",

    opacity: 0.72,
  },
});