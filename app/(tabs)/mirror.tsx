// /screens/mirror/Mirror.tsx

import React, {
  useEffect,
  useState,
} from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useFocusEffect,
} from "@react-navigation/native";

import {
  useCallback,
} from "react";

import CosmicLoadingField from "../../components/mirror/cosmicLoadingField";

import EnergyField from "../../components/energy/EnergyField";

import CosmicTiles from "../../components/mirror/CosmicTiles";

import Lenses from "../../components/mirror/Lenses";

import ReadingContainer from "../../components/mirror/ReadingContainer";

import {
  getUserId,
} from "../../lib/user";

import {
  supabase,
} from "../../services/supabase";

import {
  getDailyField,
} from "../../lib/cosmic/getDailyField";

import {
  getDailyCosmicMessage,
} from "../../lib/cosmic/getDailyCosmicMessage";

import {
  loadUserLanguage,
} from "../../lib/i18n/loadUserLanguage";

import {
  buildUserContext,
} from "../../lib/context/buildUserContext";

import {
  buildMirrorContext,
} from "../../lib/context/buildMirrorContext";

// --------------------------------------------------
// 🪞 MIRROR
// --------------------------------------------------

export default function Mirror() {

  // --------------------------------------------------
  // 🧠 STATE
  // --------------------------------------------------

  const [
    userContext,
    setUserContext,
  ] = useState<any>(null);

  const [
    mirrorContext,
    setMirrorContext,
  ] = useState<any>(null);

  const [
    energyState,
    setEnergyState,
  ] = useState<
    "loading" |
    "empty" |
    "ready"
  >("loading");

  const [
    dailyField,
    setDailyField,
  ] = useState<any>(null);

  const [
    cosmic,
    setCosmic,
  ] = useState<any>(null);

const [
  language,
  setLanguage,
] = useState<string | null>(
  null
);

  const [
    languageContext,
    setLanguageContext,
  ] = useState<any>(null);

  const [
    chakraContent,
    setChakraContent,
  ] = useState<any>({});

  // --------------------------------------------------
// 🌍 LANGUAGE
// --------------------------------------------------

useFocusEffect(

  useCallback(() => {

    async function loadLanguage() {

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
    }

    loadLanguage();

  }, [])
);

  // --------------------------------------------------
  // 🧘 CHAKRA CONTENT
  // --------------------------------------------------

  useEffect(() => {

    async function loadChakras() {

      if (!language)
        return;

      const {
        data: chakraRows,
      } = await supabase

        .from("chakras")

        .select("*")

        .eq(
          "language",
          language
        );

      const map: any = {};

      chakraRows?.forEach((c) => {

        map[c.id] = {

          name:
            c.name,

          affirmation:
            c.affirmation,
        };
      });

      setChakraContent(
        map
      );
    }

    loadChakras();

  }, [language]);

  // --------------------------------------------------
  // 🌌 DAILY FIELD
  // --------------------------------------------------

  useEffect(() => {

    async function loadDailyField() {

      const field =
        await getDailyField();

      setDailyField(
        field
      );
    }

    loadDailyField();

  }, []);

  // --------------------------------------------------
  // 🌌 DAILY COSMIC
  // --------------------------------------------------

  useEffect(() => {

    async function loadCosmic() {

      console.log(
  "🌍 COSMIC LANGUAGE:",
  language
);

      if (!dailyField)
        return;

      if (!language)
        return;

      if (!languageContext)
        return;

      const cosmicMessage =

        await getDailyCosmicMessage({

          dailyField,

          language,

          languageContext,
        });

      setCosmic({

        ...cosmicMessage,

        cosmic:
          dailyField.cosmic,

        dailyField,
      });
    }

    loadCosmic();

  }, [

    dailyField,

    language,

    languageContext,
  ]);

  // --------------------------------------------------
  // 🧠 USER CONTEXT
  // --------------------------------------------------

  useEffect(() => {

    async function loadUserContext() {

      try {

        setEnergyState(
          "loading"
        );

        const userId =
          await getUserId();

        const context =

          await buildUserContext({

            userId,

            source:
              "mirror",

            activeLens:
              "general",
          });

        setUserContext(
          context
        );

        if (
          !context ||
          !context.ready
        ) {

          setEnergyState(
            "empty"
          );

          return;
        }

        setEnergyState(
          "ready"
        );

      } catch (err) {

        console.error(
          "❌ USER CONTEXT ERROR:",
          err
        );

        setEnergyState(
          "empty"
        );
      }
    }

    loadUserContext();

  }, []);

  // --------------------------------------------------
  // 🪞 MIRROR CONTEXT
  // --------------------------------------------------

  useEffect(() => {

    async function loadMirrorContext() {

      if (!userContext)
        return;

      if (!cosmic)
        return;

      const context =

        await buildMirrorContext({

          userContext,

          cosmic,

          languageContext,

          activeLens:
            "general",
        });

      setMirrorContext(
        context
      );
    }

    loadMirrorContext();

  }, [

    userContext,

    cosmic,

    languageContext,
  ]);

  // --------------------------------------------------
  // 🌌 LOADING
  // --------------------------------------------------

if (

  !language ||

  !languageContext ||

  !cosmic ||

  energyState ===
    "loading"

) {

    return (
      <CosmicLoadingField />
    );
  }

  // --------------------------------------------------
  // 🌑 EMPTY
  // --------------------------------------------------

  if (
    energyState ===
    "empty"
  ) {

    return (

      <View
        style={
          styles.container
        }
      >

        <Text
          style={
            styles.loadingText
          }
        >

          No signals yet.
          Start reflecting ✨

        </Text>

      </View>
    );
  }

  // --------------------------------------------------
  // 🪞 RENDER
  // --------------------------------------------------

  return (

    <View style={styles.container}>

      {/* 🌌 TOP */}

      <View style={styles.top}>

        <CosmicTiles

          cosmic={cosmic}

          language={
            language
          }

          languageContext={
            languageContext
          }
        />

      </View>

      {/* 🪞 CONTENT */}

      <ScrollView

        style={styles.scroll}

        contentContainerStyle={
          styles.content
        }

        showsVerticalScrollIndicator={
          false
        }
      >

        {/* ⚡ ENERGY */}

        {userContext && (

          <EnergyField

            userContext={
              userContext
            }

            chakraContent={
              chakraContent
            }

            language={
              language
            }

            languageContext={
              languageContext
            }
          />

        )}

        {/* 👁 LENSES */}

        {mirrorContext && (

          <Lenses

            userContext={
              userContext
            }

            context={
              mirrorContext
            }

            language={
              language
            }

            languageContext={
              languageContext
            }
          />

        )}

        {/* 📖 READING */}

        {mirrorContext && (

          <ReadingContainer

            userContext={
              userContext
            }

            context={
              mirrorContext
            }

            language={
              language
            }

            languageContext={
              languageContext
            }

            cosmic={
              cosmic
            }
          />

        )}

      </ScrollView>

    </View>
  );
}

// --------------------------------------------------
// 🎨 STYLES
// --------------------------------------------------

const styles =
  StyleSheet.create({

    container: {

      flex: 1,

      backgroundColor:
        "#000",
    },

    loadingText: {

      color: "white",

      textAlign:
        "center",

      marginTop: 150,
    },

    scroll: {
      flex: 1,
    },

    content: {

      paddingBottom:
        150,
    },

    top: {

      paddingTop: 20,
    },
  });