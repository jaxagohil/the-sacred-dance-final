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

  const [humans, setHumans] =
    useState<any[]>([]);

  const [messages, setMessages] =
    useState<any[]>([]);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  //
  // 🌊 FIELD ENERGY
  //

  const fieldEnergy =
    deriveFieldEnergy(
      messages,
      humans
    );

  const whisper =
    fieldEnergy.whisper;

  const fieldColor =
    fieldEnergy.color;

  //
  // ✨ TITLE
  //

  const title =
    safeType === "love"
      ? "L O V E"

      : safeType === "compassion"
      ? "C O M P A S S I O N"

      : "U N I T Y\nC O N S C I O U S N E S S";

  //
  // ✨ PROMPT
  //

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

      console.log(
        "🌌 REFRESH FIELD:",
        safeType
      );

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

      console.log(
        "🌍 ACTIVE HUMANS:",
        presence?.map(
          (h) => h.name
        )
      );

      console.log(
        "💬 FIELD MESSAGES:",
        fieldMessages?.length || 0
      );

      setHumans(
        presence || []
      );

      setMessages(
        fieldMessages || []
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

        console.log(
          "🌌 LOAD FIELD:",
          safeType
        );

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

        if (!mounted) {
          return;
        }

        console.log(
          "🌍 ACTIVE HUMANS:",
          presence?.map(
            (h) => h.name
          )
        );

        setHumans(
          presence || []
        );

        setMessages(
          fieldMessages || []
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
  // ❤️ PRESENCE HEARTBEAT
  //

  useEffect(() => {

    console.log(
      "❤️ START HEARTBEAT"
    );

    const cleanup =
      startPresenceHeartbeat();

    return () => {

      console.log(
        "🧹 STOP HEARTBEAT"
      );

      cleanup();
    };

  }, []);

  //
  // 🌊 REALTIME FIELD
  //

  useEffect(() => {

    console.log(
      "🌊 START REALTIME:",
      safeType
    );

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

        console.log(
          "💬 REALTIME MESSAGE"
        );

        const updated =
          await getFieldMessages({

            sourceType:
              "circle",

            fieldSlug:
              safeType,
          });

        setMessages(
          updated || []
        );
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

        console.log(
          "👥 REALTIME PRESENCE"
        );

        const updated =
          await getFieldPresence({

            presenceType:
              "circle",

            fieldSlug:
              safeType,
          });

        console.log(
          "🌍 ACTIVE HUMANS:",
          updated?.map(
            (h) => h.name
          )
        );

        setHumans(
          updated || []
        );
      }
    );

    //
    // ▶️ SUBSCRIBE
    //

    channel.subscribe(
      (status) => {

        console.log(
          "🌊 CHANNEL STATUS:",
          status
        );
      }
    );

    //
    // 🧹 CLEANUP
    //

    return () => {

      console.log(
        "🧹 REMOVE CHANNEL"
      );

      supabase.removeChannel(
        channel
      );
    };

  }, [safeType]);

  //
  // ✨ SEND MESSAGE
  //

  async function handleSend() {

    if (
      !message.trim() ||
      sending
    ) {

      return;
    }

    if (
      message.trim().length > 220
    ) {

      return;
    }

    try {

      setSending(true);

      console.log(
        "💬 SEND MESSAGE:",
        message
      );

      //
      // 🌊 CREATE
      //

      const result =
        await createFieldMessage({

          sourceType:
            "circle",

          fieldSlug:
            safeType,

          content:
            message,
        });

      //
      // ✨ LOCAL REFRESH
      //

      if (
        result.success
      ) {

        const updated =
          await getFieldMessages({

            sourceType:
              "circle",

            fieldSlug:
              safeType,
          });

        setMessages(
          updated || []
        );

        setMessage("");

        //
        // ⌨️ DISMISS
        //

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

            {/* ✍️ INPUT */}

            <View style={styles.inputContainer}>

              <TextInput

                multiline

                value={message}

                onChangeText={
                  setMessage
                }

                maxLength={220}

                blurOnSubmit

                onSubmitEditing={
                  handleSend
                }

                placeholder="Share into the field..."

                placeholderTextColor="rgba(255,255,255,0.16)"

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
                        "rgba(255,255,255,0.28)",

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

          {/* 🌍 ACTIVE HUMANS */}

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
                  (human, index) => {

                    const avatar =
                      human?.avatar_url;

                    return (

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

                        {!!avatar && (

                          <Image

                            source={{
                              uri: avatar,
                            }}

                            style={{
                              width: "100%",
                              height: "100%",

                              borderRadius: 999,
                            }}
                          />

                        )}

                      </View>
                    );
                  }
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
              {whisper}
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
      "#020304",
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
      "rgba(255,255,255,1)",

    fontSize: 10,

    textAlign: "center",

    letterSpacing: 2,

    marginLeft: 25,
    marginRight: 25,

    fontWeight: "300",
  },

  prompt: {
    marginTop: 3,

    color:
      "rgba(255,255,255,0.46)",

    fontSize: 13,

    lineHeight: 22,

    textAlign: "center",

    fontWeight: "300",

    paddingHorizontal: 54,
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

    color: "white",

    fontSize: 13,

    lineHeight: 22,

    backgroundColor:
      "rgba(255,255,255,0.015)",

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
      "rgba(255,255,255,0.68)",

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
      "rgba(255,255,255,0.018)",
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
      "rgba(255,255,255,0.18)",

    fontSize: 30,

    fontWeight: "200",
  },

});