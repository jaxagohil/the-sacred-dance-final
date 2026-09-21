// /screens/mirror/Mirror.tsx

import React, {
  useCallback,
  useEffect,
  useState
} from "react";

import {
  useFocusEffect,
} from "@react-navigation/native";

import {
  ScrollView,
  StyleSheet,
  View
} from "react-native";

import {
  getUserId,
} from "../../lib/user";

import {
  supabase,
} from "../../services/supabase";

import CosmicLoadingField from "../../components/mirror/cosmicLoadingField";

import EnergyField from "../../components/energy/EnergyField";

import CosmicTiles from "../../components/mirror/CosmicTiles";

import Lenses from "../../components/mirror/Lenses";

import ReadingContainer from "../../components/mirror/ReadingContainer";

import {
  buildUserContext,
} from "../../lib/context/buildUserContext";

import {
  useMirrorStore,
} from "../../stores/mirrorStore";

import {
  buildGuidanceWhispers,
} from "../../lib/guidance/orchestration/buildGuidanceWhispers";

// --------------------------------------------------
// 🪞 MIRROR
// --------------------------------------------------

export default function Mirror() {

    /*
   * --------------------------------------------------
   * 🌌 MIRROR STORE
   * --------------------------------------------------
   */

  const {

    dailyField:
  globalDailyField,

cosmic:
  globalCosmic,

language:
  globalLanguage,

languageContext:
  globalLanguageContext,

    setUserContext:
      setGlobalUserContext,

    setMirrorContext:
      setGlobalMirrorContext,

    setEntityLenses:
  setGlobalEntityLenses,

setExpressionProfile:
  setGlobalExpressionProfile,

setSpiralScores:
  setGlobalSpiralScores,  

    setCosmic:
      setGlobalCosmic,

    setDailyField:
      setGlobalDailyField,

    setLanguage:
      setGlobalLanguage,

    setLanguageContext:
      setGlobalLanguageContext,

    setActiveLens:
  setGlobalActiveLens,  

    setReady:
      setGlobalReady,

      setPreloadedWhispers,

  } = useMirrorStore();

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
] = useState<any>(null);

  /*
 * --------------------------------------------------
 * 🌌 HYDRATE FROM PRELOAD
 * --------------------------------------------------
 */

useEffect(() => {

  if (
    globalDailyField
  ) {

    setDailyField(
      globalDailyField
    );
  }

  if (
    globalCosmic
  ) {

    setCosmic(
      globalCosmic
    );
  }

  if (
    globalLanguage
  ) {

    setLanguage(
      globalLanguage
    );
  }

  if (
    globalLanguageContext
  ) {

    setLanguageContext(
      globalLanguageContext
    );
  }

}, [

  globalDailyField,

  globalCosmic,

  globalLanguage,

  globalLanguageContext,
]);

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
  // 🧠 USER CONTEXT
  // --------------------------------------------------

useFocusEffect(
  useCallback(() => {

    async function loadUserContext() {

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
            source: "mirror",
            activeLens: "general",
          });

        setUserContext(
          context
        );

        setGlobalUserContext(
          context
        );

        setGlobalActiveLens(
          "general"
        );

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

  if (!userContext?.context)
    return;

  if (!cosmic)
    return;

  if (!languageContext)
    return;

  const context =
    userContext.context;

  //console.log("🪞 MIRROR CONTEXT:",context);

//console.log( "👁 LENS CONTEXTS:",  context?.lensContexts);  

  setMirrorContext(
    context
  );

  setGlobalMirrorContext(
    context
  );

  setGlobalEntityLenses(
    userContext?.entityLenses || []
  );

  setGlobalExpressionProfile(
    userContext?.expressionProfile || null
  );

  setGlobalSpiralScores(
    userContext?.spiralScores || null
  );

  /* -------------------------------------------------- */
  /* 🌌 PRELOAD WHISPERS                               */
  /* -------------------------------------------------- */

  const whispers =
    buildGuidanceWhispers({

      mirrorContext:
        context,

      cosmicContext:
        cosmic,

      activePatterns:
        userContext
          ?.enrichedPatterns || [],

      activeChakras:
        userContext
          ?.energy
          ?.activeChakras || [],

      manifestations:
        userContext
          ?.manifestations || [],

      emergenceMemory:
        userContext
          ?.emergenceMemory || {},

      resolvedContent: {
        whispers: [],
      },
    });

  setPreloadedWhispers(
    whispers
  );

  setGlobalReady(
    true
  );

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

  !userContext ||

    !chakraContent

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

<Lenses

  userContext={
    userContext
  }

  context={
    mirrorContext || {}
  }

  language={
    language
  }

  languageContext={
    languageContext
  }

/>

        {/* 📖 READING */}

<ReadingContainer

  userContext={
    userContext
  }

  context={
    mirrorContext || {}
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