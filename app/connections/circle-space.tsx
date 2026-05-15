// app/connections/circle-space.tsx

import React, {
  useEffect,
  useState
} from "react";

import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  supabase,
} from "../../services/supabase";

import {
  Colors,
} from "../../constants/theme";

import LivingField from "../../components/connections/LivingField";

import CompassionNode from "../../components/connections/CompassionNode";

import LoveNode from "../../components/connections/LoveNode";

import UnityConsciousnessNode from "../../components/connections/UnityConsciousnessNode";

import {
  enterField,
  getFieldPresence,
  startPresenceHeartbeat,
} from "../../services/connections/presence";

import {
  createFieldMessage,
  getFieldMessages,
} from "../../services/connections/messages";


import {
  generateTransmission,
} from "../../lib/connections/generateTransmission";

import {
  localizeConnectionContent,
} from "../../lib/connections/localizeConnectionContent";

import { t } from "../../lib/i18n/t";

import {
  loadUserLanguage,
} from "../../lib/i18n/loadUserLanguage";


const { width } =
  Dimensions.get("window");

const centerX = width / 2;

export default function CircleSpace() {

  const params =
    useLocalSearchParams();

  const type =
    Array.isArray(
      params.type
    )
      ? params.type[0]
      : params.type;

  //
  // ✨ SAFE TYPE
  //

  const safeType =
    type === "love" ||
    type === "compassion" ||
    type === "unity"
      ? type
      : "unity";

  //
  // ✨ DAILY FIELD
  //

const dailyField = null;

//
// 🌍 LANGUAGE
//

const [

  language,

  setLanguage,

] = useState("en");

const [

  languageContext,

  setLanguageContext,

] = useState<any>({});

//
// ✨ TRANSMISSION
//

const [

  transmission,

  setTransmission,

] = useState(
  "..."
);

const [

  visibleTransmission,

  setVisibleTransmission,

] = useState("");

  //
  // 🌍 FIELD
  //

  const [humans, setHumans] =
    useState<any[]>([]);

  const [messages, setMessages] =
    useState<any[]>([]);

  //
  // ✍️ INPUT
  //

  const [message, setMessage] =
    useState("");

  //
  // ✨ UI
  //

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  //
  // ✨ TITLES
  //

  const title =
    safeType === "love"
      ? "L O V E"

      : safeType ===
        "compassion"
      ? "C O M P A S S I O N"

      : "U N I T Y\nC O N S C I O U S N E S S";

  //
  // 🌌 REFRESH FIELD
  //

  async function refreshField() {

    const {

  language:
    currentLanguage,

} = await loadUserLanguage();

    try {

      const [
        presence,
        fieldMessages,
      ] = await Promise.all([

        getFieldPresence({

          presenceType:
            "circle",

          fieldSlug:
            safeType,
        }),

        getFieldMessages({

          sourceType:
            "circle",

          fieldSlug:
            safeType,
        }),
      ]);

      setHumans(
        presence || []
      );

const localized =
  await localizeConnectionContent({

    items:
      fieldMessages || [],

viewerLanguage:
  currentLanguage,
  });

setMessages(
  localized
);

    } catch (error) {

      console.log(
        "❌ REFRESH FIELD ERROR",
        error
      );
    }
  }

  //
  // 🌌 INITIAL LOAD
  //

  useEffect(() => {

    let mounted = true;

    async function loadField() {

      const {

  language,

  languageContext,

} = await loadUserLanguage();

setLanguage(
  language
);

setLanguageContext(
  languageContext
);

      try {

        await enterField({

          presenceType:
            "circle",

          fieldSlug:
            safeType,
        });

const generatedTransmission =
  await generateTransmission({

    spaceType:
      safeType,

    language,

    languageContext,

    dailyField:
      null,
  });

if (mounted) {

  setTransmission(

    generatedTransmission
      ?.transmission ||

    "The field feels softer today."
  );
}

        const [
          presence,
          fieldMessages,
        ] = await Promise.all([

          getFieldPresence({

            presenceType:
              "circle",

            fieldSlug:
              safeType,
          }),

          getFieldMessages({

            sourceType:
              "circle",

            fieldSlug:
              safeType,
          }),
        ]);

        if (!mounted)
          return;

        setHumans(
          presence || []
        );

const localized =
  await localizeConnectionContent({

    items:
      fieldMessages || [],

    viewerLanguage:
      language,
  });

setMessages(
  localized
);

      } catch (error) {

        console.log(
          "❌ FIELD LOAD ERROR",
          error
        );

      } finally {

        if (mounted) {

          setLoading(false);
        }
      }
    }

    loadField();

    return () => {

      mounted = false;
    };

  }, [safeType]);

  //
  // ❤️ HEARTBEAT
  //

  useEffect(() => {

    const cleanup =
      startPresenceHeartbeat();

    return () => {

      cleanup();
    };

  }, []);

  //
  // 🌊 REALTIME
  //

  useEffect(() => {

    const channel =
      supabase.channel(
        `field-${safeType}`
      );

    channel.on(

      "postgres_changes",

      {
        event: "*",

        schema: "public",

        table:
          "field_messages",
      },

      async () => {

        await refreshField();
      }
    );

    channel.on(

      "postgres_changes",

      {
        event: "*",

        schema: "public",

        table:
          "connection_presence",
      },

      async () => {

        await refreshField();
      }
    );

    channel.subscribe();

    return () => {

      supabase.removeChannel(
        channel
      );
    };

  }, [safeType]);

  //
// ✨ REVEAL TRANSMISSION
//

useEffect(() => {

  if (!transmission) {

    return;
  }

  let index = 0;

  setVisibleTransmission("");

  const interval =
    setInterval(() => {

      index++;

      setVisibleTransmission(

        transmission.slice(
          0,
          index
        )
      );

      if (
        index >=
        transmission.length
      ) {

        clearInterval(
          interval
        );
      }

    }, 55);

  return () =>
    clearInterval(
      interval
    );

}, [transmission]);

  //
  // ✨ SEND
  //

  async function handleSend() {

    if (
      !message.trim() ||
      sending
    ) {

      return;
    }

    try {

      setSending(true);

const result =
  await createFieldMessage({

    sourceType:
      "circle",

    fieldSlug:
      safeType,

    content:
      message,

    language,
  });

      if (
        result.success
      ) {

        await refreshField();

        setMessage("");

        Keyboard.dismiss();
      }

    } catch (error) {

      console.log(
        "❌ SEND ERROR",
        error
      );

    } finally {

      setSending(false);
    }
  }

  return (

    <KeyboardAvoidingView
      style={styles.container}

      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >

      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
      >

        <View style={styles.container}>

          {/* 🌌 FIELD */}

          <LivingField
            dailyField={
              dailyField
            }
          />

          {/* 🌌 NODE */}

          <View style={styles.nodeLayer}>

            <View
              style={{
                transform: [
                  {
                    scale: 1.12,
                  },
                ],

                opacity: 0.8,
              }}
            >

              {safeType === "love" && (

                <LoveNode
                  x={centerX}
                  y={200}
                />

              )}

              {safeType === "compassion" && (

                <CompassionNode
                  x={centerX}
                  y={200}
                />

              )}

              {safeType === "unity" && (

                <UnityConsciousnessNode
                  x={centerX}
                  y={200}
                />

              )}

            </View>

          </View>

          {/* ✨ FIXED */}

          <View style={styles.fixedLayer}>

            <Text style={styles.title}>
              {title}
            </Text>

<Text
  style={
    styles.transmission
  }
>
  {visibleTransmission}
</Text>

            {/* ✍️ INPUT */}

            <View style={styles.inputContainer}>

              <TextInput

                multiline

                value={message}

                onChangeText={
                  setMessage
                }

                maxLength={220}

                placeholder={t("connections.circlespace_placeholder")}

                placeholderTextColor={
                  Colors.subtleText
                }

                style={[
                  styles.input,
                  {
borderColor:
  Colors.fieldRing,
                  },
                ]}
              />

            </View>

          </View>

          {/* 🌊 REFLECTIONS */}

          <View style={styles.reflectionsWindow}>

            <ScrollView

              showsVerticalScrollIndicator={
                false
              }

              keyboardDismissMode="on-drag"

              keyboardShouldPersistTaps="handled"
            >

              {messages.length === 0 ? (

                <View
                  style={{
                    paddingTop: 30,

                    alignItems:
                      "center",
                  }}
                >

                </View>

              ) : (

                messages.map(
                  (item) => (

                    <View
                      key={item.id}

                      style={[
                        styles.reflectionCard,
                        {
borderColor:
  "rgba(255,255,255,0.05)",
                        },
                      ]}
                    >

                      <Text
                        style={
                          styles.reflectionText
                        }
                      >
“{
  item.translatedContent ||

  item.content
}”
                      </Text>

                    </View>
                  )
                )
              )}

              <View
                style={{
                  height: 20,
                }}
              />

            </ScrollView>

          </View>

          {/* ◌ RETURN */}

          <Pressable

            onPress={() =>
              router.back()
            }

            style={styles.portal}
          >

            <Text style={styles.portalText}>
              ◌
            </Text>

          </Pressable>

        </View>

      </TouchableWithoutFeedback>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,

    backgroundColor:
      Colors.background,

    overflow: "hidden",
  },

  nodeLayer: {
    position: "absolute",

    width: "100%",
    height: "100%",

    zIndex: 0,
  },

  fixedLayer: {
    position: "absolute",

    top: 35,

    width: "100%",

    alignItems:
      "center",

    zIndex: 3,
  },

  title: {
    marginTop: 35,

    color:
      Colors.white,

    fontSize: 10,

    textAlign: "center",

    letterSpacing: 2,

    fontWeight: "300",
  },

  transmission: {
    marginTop: 10,

    color:
      Colors.gold,

    fontSize: 14,

    lineHeight: 19,

    textAlign: "center",

    fontWeight: "300",

    paddingHorizontal: 30,

    opacity: 0.88,
  },

  inputContainer: {
    marginTop: 215,

    width: "100%",

    paddingHorizontal: 24,
  },

  input: {
    minHeight: 68,

    borderRadius: 28,

    paddingHorizontal: 22,

    paddingVertical: 8,

    color:
      Colors.white,

    fontSize: 13,

    lineHeight: 22,

    backgroundColor:
      "rgba(255,255,255,0.01)",

    borderWidth: 0.2,

    textAlignVertical: "top",
  },

  reflectionsWindow: {
    position: "absolute",

    top: 430,

    left: 0,
    right: 0,

    bottom: 140,

    paddingHorizontal: 24,

    zIndex: 2,

    pointerEvents:
      "box-none",
  },

  reflectionCard: {
    paddingVertical: 5,

    paddingHorizontal: 10,

    borderRadius: 20,

    marginBottom: 6,

    backgroundColor:
      "rgba(255,255,255,0.008)",

    borderWidth: 0.6,

    opacity: 0.72,
  },

  reflectionText: {
    color:
      Colors.softText,

    fontSize: 12,

    lineHeight: 21,

    fontWeight: "300",
  },

  portal: {
    position: "absolute",

    bottom: 0,

    width: "100%",

    alignItems:
      "center",

    justifyContent:
      "center",

    zIndex: 10,
  },

  portalText: {
    color:
      Colors.portal,

    fontSize: 28,

    fontWeight: "200",
  },

});