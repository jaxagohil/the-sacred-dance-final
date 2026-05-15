// /app/connections/human-space.tsx

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
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
  useLocalSearchParams,
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
  generateTransmission,
} from "../../lib/connections/generateTransmission";

import {
  localizeConnectionContent,
} from "../../lib/connections/localizeConnectionContent";
import { t } from "../../lib/i18n/t";

import {
  loadUserLanguage,
} from "../../lib/i18n/loadUserLanguage";

export default function HumanSpace() {

  //
  // 🌌 PARAMS
  //

  const params =
    useLocalSearchParams();

  const otherUserId =
    Array.isArray(
      params.otherUserId
    )
      ? params.otherUserId[0]
      : params.otherUserId;

//
// ✨ TRANSMISSION
//

const [

  transmission,

  setTransmission,

] = useState(
  "..."
);

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

const [

  visibleTransmission,

  setVisibleTransmission,

] = useState("");

  //
  // 🌊 STATE
  //

  const [connectionId, setConnectionId] =
    useState<string | null>(
      null
    );

  const [currentUser, setCurrentUser] =
    useState<any>(null);

  const [otherHuman, setOtherHuman] =
    useState<any>(null);

  const [messages, setMessages] =
    useState<any[]>([]);

  const [message, setMessage] =
    useState("");

  //
  // ✨ UI
  //

const [

  loading,

  setLoading,

] = useState(true);

  const inputRef =
    useRef<TextInput>(null);

  //
  // 🌌 LOAD
  //

  useEffect(() => {

    let mounted = true;

    async function load() {

      try {

        const myUserId =
          await getUserId();

        if (
          !myUserId ||
          !otherUserId
        ) {

          return;
        }

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

        //
        // 👤 LOAD BOTH
        //

        const [
          meResult,
          otherResult,
        ] = await Promise.all([

          supabase

            .from("profiles")

            .select("*")

            .eq(
              "user_id",
              myUserId
            )

            .single(),

          supabase

            .from("profiles")

            .select("*")

            .eq(
              "user_id",
              otherUserId
            )

            .single(),
        ]);

        if (!mounted) {

          return;
        }

        const me =
          meResult.data;

        const other =
          otherResult.data;

        setCurrentUser(me);

        setOtherHuman(other);

        //
        // ✨ CONNECTION
        //

        const pairId =
          [
            myUserId,
            otherUserId,
          ]
            .sort()
            .join("_");

        setConnectionId(
          pairId
        );

const generatedTransmission =
  await generateTransmission({

    spaceType:
      "human",

    language,

    languageContext,

    dailyField:
      null,
  });

if (mounted) {

  setTransmission(

    generatedTransmission
      ?.transmission ||

    "Connection feels softer today."
  );
}
        //
        // 🌊 LOAD MESSAGES
        //

        const loaded =
          await getFieldMessages({

            sourceType:
              "human",

            connectionId:
              pairId,
          });

        if (!mounted) {

          return;
        }

const localized =
  await localizeConnectionContent({

    items:

      Array.isArray(
        loaded
      )

        ? loaded

        : [],

    viewerLanguage:
      language,
  });

setMessages(
  localized
);

      } catch (error) {

        console.log(
          "❌ HUMAN SPACE ERROR",
          error
        );

      } finally {

        if (mounted) {

          setLoading(false);
        }
      }
    }

    load();

    return () => {

      mounted = false;
    };

  }, [otherUserId]);

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

  async function sendReflection(
    text?: string
  ) {

    try {

      const cleanMessage =
        text?.trim() ||
        message.trim();

      if (
        !cleanMessage
      ) {

        return;
      }

      if (
        !connectionId
      ) {

        return;
      }

      //
      // ✨ CLEAR
      //

      setMessage("");

      //
      // ✨ SAVE
      //

      const result =
        await createFieldMessage({

          sourceType:
            "human",

          connectionId,

content:
  cleanMessage,

language,
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
              "human",

            connectionId,
          });

const localized =
  await localizeConnectionContent({

    items:

      Array.isArray(
        refreshed
      )

        ? refreshed

        : [],

    viewerLanguage:
      language,
  });

setMessages(
  localized
);
      }

    } catch (error) {

      console.log(
        "❌ SEND ERROR",
        error
      );
    }
  }

  //
  // 🌌 UI
  //

  return (

    <View
      style={styles.container}
    >

      {/* 🌌 FIELD */}

      <LivingField
      />

      {/* 👤 ↔️ 🌍 */}

      <View
        style={styles.top}
      >

        {/* 👤 */}

        <View
          style={styles.avatar}
        >

          {currentUser?.avatar_url ? (

            <Image

              source={{
                uri:
                  currentUser.avatar_url,
              }}

              contentFit="cover"

              style={
                styles.avatarImage
              }
            />

          ) : null}

        </View>

        {/* ✨ */}

        <View
          style={
            styles.connectionLine
          }
        />

        {/* 🌍 */}

        <View
          style={styles.avatar}
        >

          {otherHuman?.avatar_url ? (

            <Image

              source={{
                uri:
                  otherHuman.avatar_url,
              }}

              contentFit="cover"

              style={
                styles.avatarImage
              }
            />

          ) : null}

        </View>

      </View>

      {/* ✨ TRANSMISSION */}

      <Text
        style={
          styles.fieldMessage
        }
      >
        {visibleTransmission}
      </Text>

      {/* ✨ INPUT */}

      <View
        style={
          styles.reflectionContainer
        }
      >

        <TextInput

          ref={inputRef}

          value={message}

          multiline

          placeholder={t("connections.humanspace_placeholder")}

          placeholderTextColor={
            Colors.subtleText
          }

          style={
            styles.input
          }

          blurOnSubmit={false}

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

                sendReflection(
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
          styles.messagesContainer
        }

        contentContainerStyle={{
          paddingBottom: 140,
        }}

        showsVerticalScrollIndicator={
          false
        }
      >

        {messages.map(
          (item, index) => (

            <View

              key={
                item?.id ||
                String(index)
              }

              style={
                styles.messageCard
              }
            >

              <Text
                style={
                  styles.messageText
                }
              >

                {
item?.translatedContent ||

item?.content
                }

              </Text>

            </View>
          )
        )}

      </ScrollView>

      {/* ◌ */}

      <Pressable

        onPress={() => {

          router.back();
        }}

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

    </View>
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

    top: {
      marginTop: 120,

      flexDirection: "row",

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    avatar: {
      width: 72,
      height: 72,

      borderRadius: 36,

      overflow: "hidden",

      backgroundColor:
        "rgba(255,255,255,0.015)",

      borderWidth: 0.5,

      borderColor:
        "rgba(255,255,255,0.04)",
    },

    avatarImage: {
      width: "100%",
      height: "100%",
    },

    connectionLine: {
      width: 60,
      height: 1,

      marginHorizontal: 20,

      backgroundColor:
        "rgba(216,166,255,0.12)",
    },

    fieldMessage: {
      marginTop: 42,

      textAlign: "center",

      color:
        Colors.gold,

      fontSize: 14,

      lineHeight: 19,

      fontWeight: "300",

      paddingHorizontal: 58,

      opacity: 0.88,
    },

    reflectionContainer: {
      marginTop: 28,

      paddingHorizontal: 24,
    },

    input: {
      minHeight: 68,

      borderRadius: 28,

      paddingHorizontal: 22,

      paddingVertical: 16,

      color:
        Colors.white,

      fontSize: 13,

      lineHeight: 22,

      backgroundColor:
        "rgba(255,255,255,0.01)",

      borderWidth: 0.5,

      borderColor:
        "rgba(255,255,255,0.04)",

      textAlignVertical:
        "top",
    },

    messagesContainer: {
      flex: 1,

      marginTop: 26,

      paddingHorizontal: 24,
    },

    messageCard: {
      paddingVertical: 8,

      paddingHorizontal: 12,

      borderRadius: 18,

      marginBottom: 8,

      backgroundColor:
        "rgba(255,255,255,0.008)",

      borderWidth: 0.5,

      borderColor:
        "rgba(255,255,255,0.03)",

      opacity: 0.72,
    },

    messageText: {
      color:
        Colors.softText,

      fontSize: 12,

      lineHeight: 20,

      fontWeight: "300",
    },

    portal: {
      position: "absolute",

      bottom: 0,

      width: "100%",

      alignItems:
        "center",

      paddingBottom: 8,
    },

    portalText: {
      fontSize: 28,

      color:
        Colors.portal,

      fontWeight: "200",
    },

  });