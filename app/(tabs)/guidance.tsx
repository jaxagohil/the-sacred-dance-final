// app/(tabs)/guidance.tsx

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  processReflection,
} from "../../db/flow";

import {
  getUserId,
} from "../../lib/user";

import {
  orchestrateGuideResponse,
} from "../../lib/guidance/orchestrateGuideResponse";

import {
  buildUserContext,
} from "../../lib/context/buildUserContext";

import {
  saveGuideMessage,
} from "../../lib/guidance/saveGuideMessage";

import {
  loadGuideMessages,
} from "../../lib/guidance/loadGuideMessages";

import {
  cleanupGuideMessages,
} from "../../lib/guidance/cleanupGuideMessages";

import {
  Colors,
  Fonts,
} from "../../constants/theme";

import {
  getLanguage,
  t,
} from "../../lib/i18n/t";

type GuideKey =
  | "guide_heart"
  | "guide_structure"
  | "guide_cosmic";

type Segment = {

  id: string;

  guide: GuideKey;

  role:
    | "user"
    | "guide";

  text: string;

  createdAt: number;
};

const guideConfig:
  Record<
    GuideKey,
    { color: string }
  > = {

  guide_heart: {
    color: Colors.pink,
  },

  guide_structure: {
    color: Colors.blue,
  },

  guide_cosmic: {
    color: Colors.softText,
  },
};

export default function Guidance() {

  /*
   * ---------------------------------------------------------
   * 🌊 STATE
   * ---------------------------------------------------------
   */

  const [input, setInput] =
    useState("");

  const [segments, setSegments] =
    useState<Segment[]>([]);

  const [activeGuide, setActiveGuide] =
    useState<GuideKey>(
      "guide_heart"
    );

  const [loading, setLoading] =
    useState(false);

  const [language, setLanguage] =
    useState("en");

  /*
   * ---------------------------------------------------------
   * 🌌 FIELD
   * ---------------------------------------------------------
   */

  const [fieldContext, setFieldContext] =
    useState<any>(null);

  const [contextReady, setContextReady] =
    useState(false);

  /*
   * ---------------------------------------------------------
   * 👤 GUIDE NAMES
   * ---------------------------------------------------------
   */

  const [guideNames, setGuideNames] =
    useState<
      Record<GuideKey, string>
    >({

      guide_heart:
        "nani",

      guide_structure:
        "lala",

      guide_cosmic:
        "ammaarah",
    });

  /*
   * ---------------------------------------------------------
   * 🌌 REFS
   * ---------------------------------------------------------
   */

  const inputRef =
    useRef<TextInput>(null);

  const flatListRef =
    useRef<FlatList>(null);

  /*
   * ---------------------------------------------------------
   * ✨ DERIVED
   * ---------------------------------------------------------
   */

  const hasContent =
    Boolean(input.trim());

  /*
   * ---------------------------------------------------------
   * 🌊 AUTO SCROLL
   * ---------------------------------------------------------
   */

  const scrollToBottom = () => {

    requestAnimationFrame(() => {

      flatListRef.current
        ?.scrollToEnd({

          animated: true,
        });

    });
  };

// ---------------------------------------------------------
// 🧠 LOAD CONTEXT
// ---------------------------------------------------------

useEffect(() => {

  async function loadContext() {

    try {

      const userId =
        await getUserId();

      const currentLanguage =
        getLanguage();

      setLanguage(
        currentLanguage
      );

      /*
       * ---------------------------------------------------
       * ⚡ RENDER UI IMMEDIATELY
       * ---------------------------------------------------
       */

      setContextReady(true);

      /*
       * ---------------------------------------------------
       * 🧹 CLEANUP (BACKGROUND)
       * ---------------------------------------------------
       */

      cleanupGuideMessages();

      /*
       * ---------------------------------------------------
       * 🌌 LOAD IN PARALLEL
       * ---------------------------------------------------
       */

      const [
        built,
        messages,
      ] = await Promise.all([

        buildUserContext({

          userId,

          source:
            "guidance",

          activeLens:
            "general",
        }),

        loadGuideMessages(
          userId
        ),
      ]);

      /*
       * ---------------------------------------------------
       * 🌌 FIELD
       * ---------------------------------------------------
       */

      setFieldContext(
        built
      );

      /*
       * ---------------------------------------------------
       * 👤 GUIDE NAMES
       * ---------------------------------------------------
       */

      if (built?.profile) {

        setGuideNames({

          guide_heart:

            built.profile
              .heart_guide_name ||

            "nani",

          guide_structure:

            built.profile
              .structure_guide_name ||

            "lala",

          guide_cosmic:

            built.profile
              .cosmic_guide_name ||

            "ammaarah",
        });
      }

      /*
       * ---------------------------------------------------
       * 🌊 MESSAGES
       * ---------------------------------------------------
       */

      setSegments(
        messages
      );

    } catch (e) {

      console.log(
        "❌ CONTEXT LOAD ERROR",
        e
      );
    }
  }

  loadContext();

}, []);

  /*
   * ---------------------------------------------------------
   * ✨ SEND MESSAGE
   * ---------------------------------------------------------
   */

  const sendMessage =
    async () => {

      if (!input.trim())
        return;

      const text =
        input.trim();

      setInput("");

      Keyboard.dismiss();

      /*
       * ---------------------------------------------------
       * 👤 USER
       * ---------------------------------------------------
       */

      const userId =
        await getUserId();

      /*
       * ---------------------------------------------------
       * 🌊 USER SEGMENT
       * ---------------------------------------------------
       */

      const userSegment = {

        id:
          Date.now()
            .toString(),

        role:
          "user" as const,

        guide:
          activeGuide,

        text,

        createdAt:
          Date.now(),
      };

      /*
       * ---------------------------------------------------
       * 🌊 APPEND
       * ---------------------------------------------------
       */

      setSegments((prev) => [

        ...prev,

        userSegment,
      ]);

      /*
       * ---------------------------------------------------
       * 💾 SAVE USER
       * ---------------------------------------------------
       */

      await saveGuideMessage({

        userId,

        guide:
          activeGuide,

        role:
          "user",

        content:
          text,

        source:
          "guidance",

        contextState:
          fieldContext,
      });

      /*
       * ---------------------------------------------------
       * 🌌 PROCESS REFLECTION
       * ---------------------------------------------------
       */

      await processReflection({

        userId,

        language,

        text,

        source:
          "guidance",

        guide:
          activeGuide,
      });

      /*
       * ---------------------------------------------------
       * ✨ LOADING
       * ---------------------------------------------------
       */

      setLoading(true);

      try {

        /*
         * ---------------------------------------------------
         * 🌊 ORCHESTRATE GUIDE
         * ---------------------------------------------------
         */

        const guideResponse =
          await orchestrateGuideResponse({

            userId,

            message:
              text,

            language,

            guide:
              activeGuide,
          });

        /*
         * ---------------------------------------------------
         * 🌸 FINAL RESPONSE
         * ---------------------------------------------------
         */

        const res =

          guideResponse
            ?.response ||

          "Something important is moving here.";

        /*
         * ---------------------------------------------------
         * 🌌 GUIDE SEGMENT
         * ---------------------------------------------------
         */

        const guideSegment = {

          id:

            Date.now()
              .toString() + "-g",

          guide:
            activeGuide,

          role:
            "guide" as const,

          text:
            res,

          createdAt:
            Date.now(),
        };

        /*
         * ---------------------------------------------------
         * 🌊 APPEND
         * ---------------------------------------------------
         */

        setSegments((prev) => [

          ...prev,

          guideSegment,
        ]);

        /*
         * ---------------------------------------------------
         * 💾 SAVE GUIDE
         * ---------------------------------------------------
         */

        await saveGuideMessage({

          userId,

          guide:
            activeGuide,

          role:
            "guide",

          content:
            res,

          source:
            "guidance",

          contextState:
            guideResponse
              ?.userField,
        });

        /*
         * ---------------------------------------------------
         * 🌌 REFRESH FIELD
         * ---------------------------------------------------
         */

        setTimeout(async () => {

          try {

            const refreshed =
              await buildUserContext({

                userId,

                source:
                  "guidance",

                activeLens:
                  "general",
              });

            setFieldContext(
              refreshed
            );

          } catch (e) {

            console.log(
              "❌ FIELD REFRESH ERROR",
              e
            );
          }

        }, 1200);

      } catch (e) {

        console.log(
          "❌ GUIDANCE ERROR",
          e
        );

      } finally {

        setLoading(false);
      }
    };

  /*
   * ---------------------------------------------------------
   * ⏳ LOADING
   * ---------------------------------------------------------
   */

  if (!contextReady) {

    return (

      <SafeAreaView
        style={{
          flex: 1,

          backgroundColor:
            Colors.background,

          justifyContent:
            "center",

          alignItems:
            "center",
        }}
      >

        <ActivityIndicator
          size="small"
          color="white"
        />

      </SafeAreaView>
    );
  }

  /*
   * ---------------------------------------------------------
   * 🌌 UI
   * ---------------------------------------------------------
   */

  return (

    <SafeAreaView
      style={{
        flex: 1,

        backgroundColor:
          Colors.background,
      }}
    >

      <KeyboardAvoidingView

        style={{
          flex: 1,
        }}

        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >

        <View
          style={{
            flex: 1,

            paddingTop: 26,
          }}
        >

          {/* ✦ SEND */}

          <View
            style={{
              alignItems:
                "flex-end",

              paddingHorizontal:
                28,
            }}
          >

            <TouchableOpacity

              onPress={sendMessage}

              disabled={!hasContent}
            >

              <Text
                style={{

                  color:

                    hasContent

                      ? Colors.white

                      : Colors.subtleText,

                  opacity:

                    hasContent
                      ? 0.92
                      : 0.3,

                  fontSize: 20,

                  fontFamily:
                    Fonts.light,
                }}
              >
                ✦
              </Text>

            </TouchableOpacity>

          </View>

          {/* ✍️ INPUT */}

          <View
            style={{
              paddingHorizontal:
                28,

              marginTop: 24,
            }}
          >

            <TextInput

              ref={inputRef}

              value={input}

              onChangeText={
                setInput
              }

              placeholder={t("guidance.placeholder")}

              placeholderTextColor={
                Colors.subtleText
              }

              multiline

              style={{

                color:
                  Colors.softText,

                fontFamily:
                  Fonts.light,

                fontSize: 15,

                lineHeight: 25,

                minHeight: 80,

                maxHeight: 160,

                textAlignVertical:
                  "top",
              }}
            />

          </View>

          {/* 🧿 GUIDES */}

          <View
            style={{
              flexDirection:
                "row",

              justifyContent:
                "center",

              gap: 24,

              marginTop: 30,

              paddingBottom: 18,
            }}
          >

            {Object.entries(
              guideConfig
            ).map(([key, g]) => {

              const active =
                activeGuide === key;

              return (

                <TouchableOpacity

                  key={key}

                  onPress={() =>

                    setActiveGuide(
                      key as GuideKey
                    )
                  }
                >

                  <Text
                    style={{

                      color:
                        g.color,

                      opacity:

                        active
                          ? 1
                          : 0.28,

                      fontSize:

                        active
                          ? 14
                          : 12,

                      fontFamily:
                        Fonts.light,
                    }}
                  >
                    {

                      guideNames[
                        key as GuideKey
                      ]

                    }
                  </Text>

                </TouchableOpacity>
              );
            })}

          </View>

          {/* 🌊 TRANSMISSIONS */}

          <View
            style={{
              flex: 1,

              paddingHorizontal:
                30,
            }}
          >

            <FlatList

              ref={flatListRef}

              data={segments}

              keyExtractor={(i) =>
                i.id
              }

              onContentSizeChange={
                scrollToBottom
              }

              showsVerticalScrollIndicator={
                false
              }

              keyboardShouldPersistTaps="handled"

              contentContainerStyle={{

                paddingTop: 12,

                paddingBottom: 40,
              }}

              renderItem={({ item }) => {

                return (

                  <View
                    style={{

                      marginBottom:

                        item.role ===
                        "user"

                          ? 18

                          : 32,
                    }}
                  >

                    {/* ✨ GUIDE */}

                    {item.role ===
                      "guide" && (

                      <Text
                        style={{

                          color:

                            guideConfig[
                              item.guide
                            ].color,

                          fontSize: 11,

                          opacity: 0.5,

                          marginBottom: 6,

                          fontFamily:
                            Fonts.light,
                        }}
                      >
                        {

                          guideNames[
                            item.guide
                          ]

                        }
                      </Text>

                    )}

                    {/* 🌊 MESSAGE */}

                    <Text
                      style={{

                        color:

                          item.role ===
                          "user"

                            ? Colors.mutedText

                            : Colors.softText,

                        opacity:

                          item.role ===
                          "user"

                            ? 0.72
                            : 1,

                        fontFamily:
                          Fonts.light,

                        fontSize:

                          item.role ===
                          "user"

                            ? 14
                            : 15,

                        lineHeight:

                          item.role ===
                          "user"

                            ? 24
                            : 25,
                      }}
                    >
                      {item.text}
                    </Text>

                  </View>
                );
              }}
            />

          </View>

          {/* ✨ LOADING */}

          {loading && (

            <View
              style={{
                alignItems:
                  "center",

                paddingBottom: 20,

                paddingTop: 10,
              }}
            >

              <Text
                style={{

                  color:
                    Colors.subtleText,

                  fontFamily:
                    Fonts.light,

                  fontSize: 13,
                }}
              >
                listening...
              </Text>

            </View>

          )}

        </View>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}