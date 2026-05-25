// /screens/mirror/Mirror.tsx

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ScrollView,
  StyleSheet,
  View
} from "react-native";

import {
  useFocusEffect,
} from "@react-navigation/native";

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
  buildUserContext,
} from "../../lib/context/buildUserContext";

import {
  buildMirrorContext,
} from "../../lib/context/buildMirrorContext";

import {
  getLanguage,
} from "../../lib/i18n/t";

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

        const currentLanguage =
          getLanguage();

        console.log(
          "🌍 MIRROR LANGUAGE:",
          currentLanguage
        );

        setLanguage(
          currentLanguage
        );

        const {
          data,
        } = await supabase

          .from("languages")

          .select("*")

          .eq(
            "code",
            currentLanguage
          )

          .maybeSingle();

        setLanguageContext(
          data || {}
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

const userId =
  await getUserId();

const field =
  await getDailyField(
    userId
  );

      setDailyField(
        field
      );
    }

    loadDailyField();

  }, []);

  // --------------------------------------------------
  // 🌌 COSMIC FIELD
  // --------------------------------------------------

  useEffect(() => {

    async function loadCosmic() {

      if (!dailyField)
        return;

      if (!language)
        return;

      if (!languageContext)
        return;

      console.log(
        "🌍 VERIFIED LANGUAGE:",
        language
      );

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

useFocusEffect(

  useCallback(() => {

    async function
    loadUserContext() {

      try {

        const userId =
          await getUserId();

        // 🛡 SAFETY
        if (!userId) {

          return;
        }

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

          return;
        }

      } catch (err) {

        console.error(
          "❌ USER CONTEXT ERROR:",
          err
        );
      }
    }

    loadUserContext();

  }, [])
);

  // --------------------------------------------------
  // 🪞 MIRROR CONTEXT
  // --------------------------------------------------

  useEffect(() => {

    async function loadMirrorContext() {

      if (!userContext)
        return;

      if (!cosmic)
        return;

      if (!languageContext)
        return;

      const context =

        await buildMirrorContext({

          // ⚡ ENERGY
          energy:
            userContext?.energy,

          // 🌌 COSMIC
          cosmic,

          // 🌍 LANGUAGE
          languageContext,

          // 🌊 SIGNALS
          signals:
            userContext?.signals || [],

          // 🪞 ACTIVE LENS
          activeLens:
            "general",

          // 🌍 REALITY LAYERS
          realityLayers:
            userContext
              ?.realityLayers || {},

          // 🧠 BEHAVIOURS
          enrichedBehaviours:
            userContext
              ?.enrichedBehaviours || [],

          // 🌊 PATTERNS
          enrichedPatterns:
            userContext
              ?.enrichedPatterns || [],

              patternField:
  userContext
    ?.patternField || {},

          // 🌈 DISTORTIONS
distortions:

  userContext
    ?.distortions || {

      distorted: [],

      integrated: [],
    },

          // 👁 LENS MEMORY
          lensEntries:
            userContext
              ?.lensEntries || [],
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

  !userContext

) {

  return (
    <CosmicLoadingField />
  );
}

  // --------------------------------------------------
  // 🪞 RENDER
  // --------------------------------------------------

  return (

    <View style={styles.container}>

      {/* 🌌 COSMIC */}

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

      {/* 🌍 FIELD */}

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