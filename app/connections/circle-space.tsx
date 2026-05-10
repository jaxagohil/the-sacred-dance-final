// app/connections/circle-space.tsx

import React, {
  useEffect,
  useState,
} from "react";

import {
  Dimensions,
  Image,
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
  deriveFieldEnergy,
} from "../../services/connections/fieldEnergy";

import {
  buildConnectionsContext,
} from "../../lib/context/buildConnectionsContext";

import {
  generateTransmission,
} from "../../lib/connections/generateTransmission";

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
  // ✨ TRANSMISSIONS
  //

  const [transmission, setTransmission] =
    useState("");

  const [whisperMessage, setWhisperMessage] =
    useState("");

  //
  // 🌊 FIELD ENERGY
  //

  const fieldEnergy =
    deriveFieldEnergy(
      messages,
      humans
    );

  const fieldColor =
    fieldEnergy.color;

  //
  // ✨ TITLES
  //

  const title =
    safeType === "love"
      ? "L O V E"

      : safeType === "compassion"
      ? "C O M P A S S I O N"

      : "U N I T Y\nC O N S C I O U S N E S S";

  const prompt =
    safeType === "love"

      ? "Where are you being invited to soften?"

      : safeType === "compassion"

      ? "What tenderness is asking to be seen?"

      : "What separation are you ready to release?";

  //
  // 🌌 REFRESH FIELD
  //

  async function refreshField() {

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

      setMessages(
        fieldMessages || []
      );

      //
      // ✨ CONTEXT
      //

      const context =
        await buildConnectionsContext({

          spaceType:
            "circle",

          fieldSlug:
            safeType,
        });

      const transmissionData =
        generateTransmission({
          context,
        });

      setTransmission(
        transmissionData.transmission
      );

      setWhisperMessage(
        transmissionData.whisper
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

      try {

        //
        // 🌌 ENTER FIELD
        //

        await enterField({

          presenceType:
            "circle",

          fieldSlug:
            safeType,
        });

        //
        // 🌊 LOAD
        //

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

        setMessages(
          fieldMessages || []
        );

        //
        // ✨ CONTEXT
        //

        const context =
          await buildConnectionsContext({

            spaceType:
              "circle",

            fieldSlug:
              safeType,
          });

        const transmissionData =
          generateTransmission({
            context,
          });

        setTransmission(
          transmissionData.transmission
        );

        setWhisperMessage(
          transmissionData.whisper
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

    //
    // ✨ MESSAGES
    //

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

    //
    // 👥 PRESENCE
    //

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

          {/* 🌌 LIVING FIELD */}

          <LivingField />

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

            <Text style={styles.prompt}>
              {prompt}
            </Text>

            <Text style={styles.transmission}>
              {transmission}
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

                placeholder="Share into the field..."

                placeholderTextColor={
                  Colors.subtleText
                }

                style={[
                  styles.input,
                  {
                    borderColor:
                      fieldColor,
                  },
                ]}
              />

            </View>

          </View>

          {/* ✨ REFLECTIONS */}

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

                  <Text
                    style={{
                      color:
                        Colors.mutedText,

                      fontSize: 12,

                      fontWeight: "300",
                    }}
                  >

                    The field is quiet today.

                  </Text>

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
                            `${fieldColor}22`,
                        },
                      ]}
                    >

                      <Text
                        style={
                          styles.reflectionText
                        }
                      >
                        “{item.content}”
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

          {/* 🌍 HUMANS */}

          <View style={styles.bottom}>

            {loading ? (

              <>
                <View style={styles.avatar} />
                <View style={styles.avatar} />
                <View style={styles.avatar} />
              </>

            ) : (

              humans

                .filter(
                  (human) =>
                    !!human?.avatar_url
                )

                .map(
                  (human, index) => (

                    <View
                      key={
                        human.id ||
                        index
                      }

                      style={[
                        styles.avatar,
                        {
                          borderColor:
                            `${fieldColor}66`,
                        },
                      ]}
                    >

                      <Image

                        source={{
                          uri:
                            human.avatar_url,
                        }}

                        style={{
                          width: "100%",
                          height: "100%",

                          borderRadius: 999,
                        }}
                      />

                    </View>
                  )
                )
            )}

          </View>

          {/* ✨ WHISPER */}

          <View style={styles.whisperContainer}>

            <Text
              style={[
                styles.whisper,
                {
                  color:
                    fieldColor,
                },
              ]}
            >
              {whisperMessage}
            </Text>

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

  prompt: {
    marginTop: 3,

    color:
      Colors.mutedText,

    fontSize: 13,

    lineHeight: 22,

    textAlign: "center",

    fontWeight: "300",

    paddingHorizontal: 54,
  },

  transmission: {
    marginTop: 12,

    color:
      Colors.softText,

    fontSize: 12,

    lineHeight: 22,

    textAlign: "center",

    fontWeight: "300",

    paddingHorizontal: 48,

    opacity: 0.82,
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

    opacity: 0.5,
  },

  reflectionText: {
    color:
      Colors.softText,

    fontSize: 12,

    lineHeight: 21,

    fontWeight: "300",
  },

  bottom: {
    position: "absolute",

    bottom: 75,

    width: "100%",

    flexDirection: "row",

    justifyContent:
      "center",

    alignItems:
      "center",

    gap: 18,

    zIndex: 5,
  },

  avatar: {
    width: 40,
    height: 40,

    borderRadius: 999,

    overflow: "hidden",

    borderWidth: 1,

    backgroundColor:
      "rgba(255,255,255,0.015)",
  },

  whisperContainer: {
    position: "absolute",

    bottom: 25,

    width: "100%",

    paddingHorizontal: 54,

    zIndex: 3,
  },

  whisper: {
    fontSize: 11,

    lineHeight: 24,

    textAlign: "center",

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