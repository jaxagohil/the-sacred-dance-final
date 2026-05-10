// app/connections/you-space.tsx

import React, {
    useEffect,
    useState,
} from "react";

import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    Image,
} from "expo-image";

import {
    router,
} from "expo-router";

import {
    supabase,
} from "../../services/supabase";

import {
    Colors,
} from "../../constants/theme";

import LivingField from "../../components/connections/LivingField";

import {
    getUserId,
} from "../../lib/user";

import {
    createFieldMessage,
    getFieldMessages,
} from "../../services/connections/messages";

import {
    buildConnectionsContext,
} from "../../lib/context/buildConnectionsContext";

import {
    generateTransmission,
} from "../../lib/connections/generateTransmission";

export default function YouSpace() {

  //
  // 🌊 STATE
  //

  const [profile, setProfile] =
    useState<any>(null);

  const [stillness, setStillness] =
    useState(false);

  const [keyboardVisible, setKeyboardVisible] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [reflections, setReflections] =
    useState<any[]>([]);

  const [recentHumans, setRecentHumans] =
    useState<any[]>([]);

  //
  // ✨ TRANSMISSIONS
  //

  const [transmission, setTransmission] =
    useState("");

  const [whisperMessage, setWhisperMessage] =
    useState("");

  //
  // ⌨️ KEYBOARD
  //

  useEffect(() => {

    const showListener =
      Keyboard.addListener(
        "keyboardDidShow",
        () => {
          setKeyboardVisible(true);
        }
      );

    const hideListener =
      Keyboard.addListener(
        "keyboardDidHide",
        () => {
          setKeyboardVisible(false);
        }
      );

    return () => {

      showListener.remove();
      hideListener.remove();
    };

  }, []);

  //
  // 👤 LOAD
  //

  useEffect(() => {

    async function load() {

      try {

        const userId =
          await getUserId();

        if (!userId) {

          return;
        }

        //
        // 👤 PROFILE
        //

        const {
          data,
        } = await supabase

          .from("profiles")

          .select("*")

          .eq(
            "user_id",
            userId
          )

          .single();

        setProfile(data);

        setStillness(
          data?.is_quiet || false
        );

        //
        // 🌊 SELF REFLECTIONS
        //

        const loaded =
          await getFieldMessages({

            sourceType:
              "self",

            connectionId:
              userId,
          });

        setReflections(
          Array.isArray(
            loaded
          )
            ? loaded
            : []
        );

        //
        // ✨ CONTEXT
        //

        const context =
          await buildConnectionsContext({

            spaceType:
              "self",
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

        //
        // 🌍 RECENT HUMANS
        //

        const {
          data: recentMessages,
        } = await supabase

          .from("field_messages")

          .select("*")

          .eq(
            "source_type",
            "human"
          )

          .order(
            "created_at",
            {
              ascending: false,
            }
          )

          .limit(30);

        if (
          recentMessages?.length
        ) {

          //
          // ✨ FIND RECENT HUMAN IDS
          //

          const uniqueUserIds =
            Array.from(

              new Set(

                recentMessages

                  .map((m) => {

                    const parts =
                      m.connection_id
                        ?.split("_") || [];

                    return parts.find(
                      (id: string) =>
                        id !== userId
                    );
                  })

                  .filter(Boolean)
              )
            )

            .slice(0, 3);

          //
          // 🌍 LOAD HUMAN PROFILES
          //

          const {
            data: humans,
          } = await supabase

            .from("profiles")

            .select("*")

            .in(
              "user_id",
              uniqueUserIds
            );

          setRecentHumans(
            humans || []
          );
        }

      } catch (error) {

        console.log(
          "❌ YOU SPACE ERROR",
          error
        );
      }
    }

    load();

  }, []);

  //
  // 🌙 STILLNESS
  //

  async function toggleStillness() {

    try {

      const next =
        !stillness;

      setStillness(next);

      if (!profile?.user_id) {

        return;
      }

      await supabase

        .from("profiles")

        .update({

          is_quiet:
            next,
        })

        .eq(
          "user_id",
          profile.user_id
        );

      //
      // ✨ REFRESH CONTEXT
      //

      const context =
        await buildConnectionsContext({

          spaceType:
            "self",
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
        "❌ STILLNESS ERROR",
        error
      );
    }
  }

  //
  // ✨ SAVE REFLECTION
  //

  async function saveReflection(
    text?: string
  ) {

    try {

      const clean =
        text?.trim() ||
        message.trim();

      if (
        !clean
      ) {

        return;
      }

      if (
        !profile?.user_id
      ) {

        return;
      }

      //
      // ✨ CLEAR
      //

      setMessage("");

      //
      // 🌊 SAVE
      //

      const result =
        await createFieldMessage({

          sourceType:
            "self",

          connectionId:
            profile.user_id,

          content:
            clean,
        });

      //
      // ✨ REFRESH
      //

      if (
        result?.success
      ) {

        const refreshed =
          await getFieldMessages({

            sourceType:
              "self",

            connectionId:
              profile.user_id,
          });

        setReflections(
          Array.isArray(
            refreshed
          )
            ? refreshed
            : []
        );

        //
        // ✨ REFRESH CONTEXT
        //

        const context =
          await buildConnectionsContext({

            spaceType:
              "self",
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
      }

    } catch (error) {

      console.log(
        "❌ REFLECTION ERROR",
        error
      );
    }
  }

  //
  // 🌌 UI
  //

  return (

    <KeyboardAvoidingView

      style={styles.container}

      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
    >

      <Pressable

        style={styles.container}

        onPress={() =>
          Keyboard.dismiss()
        }
      >

        {/* 🌌 LIVING FIELD */}

        <LivingField />

        {/* 🧿 YOU */}

        <View style={styles.top}>

          <Pressable

            onPress={
              toggleStillness
            }

            style={[

              styles.avatar,

              stillness && {

                opacity: 0.32,

                borderColor:
                  "rgba(255,255,255,0.04)",

                backgroundColor:
                  "rgba(255,255,255,0.01)",
              },
            ]}
          >

            {profile?.avatar_url ? (

              <Image

                source={{
                  uri:
                    profile.avatar_url,
                }}

                contentFit="cover"

                style={
                  styles.avatarImage
                }
              />

            ) : null}

          </Pressable>

        </View>

        {/* ✨ TRANSMISSION */}

        <View
          style={
            styles.transmissionContainer
          }
        >

          <Text
            style={
              styles.transmission
            }
          >
            {transmission}
          </Text>

          <Text
            style={
              styles.whisper
            }
          >
            {whisperMessage}
          </Text>

        </View>

        {/* ✍️ REFLECTION */}

        <View
          style={
            styles.inputContainer
          }
        >

          <TextInput

            multiline

            keyboardAppearance="dark"

            value={message}

            placeholder="
Breathe. Write softly...
"

            placeholderTextColor={
              Colors.subtleText
            }

            style={styles.input}

            onChangeText={(text) => {

              //
              // ✨ RETURN SEND
              //

              if (
                text.endsWith("\n")
              ) {

                const clean =
                  text.trim();

                if (clean) {

                  saveReflection(
                    clean
                  );
                }

                return;
              }

              setMessage(text);
            }}
          />

        </View>

        {/* 🌊 REFLECTIONS */}

        <ScrollView

          style={
            styles.reflectionsContainer
          }

          contentContainerStyle={{
            paddingBottom: 240,
          }}

          showsVerticalScrollIndicator={
            false
          }
        >

          {reflections.map(
            (item, index) => (

              <View

                key={
                  item?.id ||
                  String(index)
                }

                style={
                  styles.reflectionCard
                }
              >

                <Text
                  style={
                    styles.reflectionText
                  }
                >

                  {
                    item?.content
                  }

                </Text>

              </View>
            )
          )}

        </ScrollView>

        {/* 🌌 CURRENT NODE */}

        {!keyboardVisible && (

          <View
            style={
              styles.nodeContainer
            }
          >

            <View
              style={
                styles.fieldOrb
              }
            />

          </View>

        )}

        {/* 🌍 RECENT RESONANCE */}

        {!keyboardVisible && (

          <View
            style={
              styles.bottom
            }
          >

            <View
              style={
                styles.humansRow
              }
            >

              {recentHumans.map(
                (
                  human,
                  index
                ) => (

                  <Pressable

                    key={
                      human.user_id ||
                      index
                    }

                    onPress={() => {

                      router.push({

                        pathname:
                          "/connections/human-space",

                        params: {

                          otherUserId:
                            human.user_id,

                          source:
                            "you-space",
                        },
                      });
                    }}

                    style={[

                      styles.humanAvatar,

                      {
                        opacity:
                          0.55 +
                          Math.random() *
                            0.45,
                      },
                    ]}
                  >

                    <Image

                      source={{
                        uri:
                          human.avatar_url,
                      }}

                      contentFit="cover"

                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />

                  </Pressable>
                )
              )}

            </View>

          </View>

        )}

        {/* ◌ RETURN */}

        <Pressable

          onPress={() =>
            router.back()
          }

          style={styles.portal}
        >

          <Text
            style={
              styles.portalText
            }
          >
            ◌
          </Text>

        </Pressable>

      </Pressable>

    </KeyboardAvoidingView>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,

      backgroundColor:
        Colors.background,

      overflow: "hidden",
    },

    /* 🧿 YOU */

    top: {
      alignItems:
        "center",

      marginTop: 110,
    },

    avatar: {
      width: 82,
      height: 82,

      borderRadius: 999,

      overflow: "hidden",

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.08)",

      backgroundColor:
        "rgba(255,255,255,0.015)",
    },

    avatarImage: {
      width: "100%",
      height: "100%",
    },

    /* ✨ TRANSMISSION */

    transmissionContainer: {
      marginTop: 30,

      paddingHorizontal: 34,
    },

    transmission: {
      color:
        Colors.softText,

      fontSize: 16,

      lineHeight: 30,

      textAlign: "center",

      fontWeight: "300",
    },

    whisper: {
      marginTop: 10,

      color:
        Colors.mutedText,

      fontSize: 11,

      lineHeight: 22,

      textAlign: "center",

      fontWeight: "300",

      opacity: 0.8,
    },

    /* ✍️ REFLECTION */

    inputContainer: {
      marginTop: 28,

      paddingHorizontal: 24,
    },

    input: {
      minHeight: 120,

      borderRadius: 28,

      paddingHorizontal: 20,
      paddingVertical: 18,

      color:
        Colors.white,

      fontSize: 13,

      lineHeight: 24,

      backgroundColor:
        "rgba(255,255,255,0.01)",

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.03)",

      textAlignVertical:
        "top",
    },

    /* 🌊 REFLECTIONS */

    reflectionsContainer: {
      flex: 1,

      marginTop: 24,

      paddingHorizontal: 24,
    },

    reflectionCard: {
      marginBottom: 8,

      paddingHorizontal: 12,

      paddingVertical: 10,

      borderRadius: 18,

      backgroundColor:
        "rgba(255,255,255,0.008)",

      borderWidth: 0.5,

      borderColor:
        "rgba(255,255,255,0.03)",
    },

    reflectionText: {
      color:
        Colors.softText,

      fontSize: 12,

      lineHeight: 21,

      fontWeight: "300",
    },

    /* 🌌 NODE */

    nodeContainer: {
      position: "absolute",

      bottom: 150,

      width: "100%",

      alignItems: "center",
    },

    fieldOrb: {
      width: 110,
      height: 110,

      borderRadius: 999,

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.06)",

      backgroundColor:
        "rgba(255,255,255,0.012)",
    },

    /* 🌍 HUMANS */

    bottom: {
      position: "absolute",

      bottom: 64,

      width: "100%",
    },

    humansRow: {
      flexDirection: "row",

      justifyContent:
        "center",

      alignItems: "center",

      gap: 16,
    },

    humanAvatar: {
      width: 52,
      height: 52,

      borderRadius: 999,

      overflow: "hidden",

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.08)",

      backgroundColor:
        "rgba(255,255,255,0.015)",
    },

    /* ◌ RETURN */

    portal: {
      position: "absolute",

      bottom: -2,

      width: "100%",

      alignItems: "center",
    },

    portalText: {
      color:
        Colors.portal,

      fontSize: 30,
    },

  });