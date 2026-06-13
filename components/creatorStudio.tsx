// /app/creator.tsx

import React from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useRouter,
} from "expo-router";

import {
  supabase,
} from "../services/supabase";

// --------------------------------------------------
// 🌌 CREATOR SCREEN
// --------------------------------------------------

export default function CreatorScreen() {

  const router =
    useRouter();

  /*
   * --------------------------------------------------
   * 🌍 LANGUAGE INPUT
   * --------------------------------------------------
   */

  const [
    languageCode,

    setLanguageCode,
  ] = React.useState(
    "hi"
  );

  // --------------------------------------------------
  // 🧩 SECTIONS
  // --------------------------------------------------

  const sections = [

    {
      title:
        "🌍 Language Studio",

      items: [

        "Add language",

        "Translation coverage",

        "Missing translations",

        "AI language testing",

        "Fallback review",
      ],
    },

    {
      title:
        "🧠 AI Prompt Studio",

      items: [

        "Prompt versions",

        "Lens tuning",

        "Guide tuning",

        "Divine tuning",

        "Language review",
      ],
    },

    {
      title:
        "🌌 Cosmic Field Studio",

      items: [

        "Symbolic themes",

        "Energetic atmosphere",

        "Collective pacing",

        "Oracle bias",

        "Cadence styles",
      ],
    },

    {
      title:
        "🪞 Signal Observatory",

      items: [

        "Top distortions",

        "Chakra trends",

        "Body responses",

        "Coping strategies",

        "Language trends",
      ],
    },

    {
      title:
        "🎴 Oracle Studio",

      items: [

        "Oracle translations",

        "Guide assignment",

        "Archetype mapping",

        "Symbolic tags",
      ],
    },

    {
      title:
        "💚 Emotional Safety",

      items: [

        "Unsafe wording",

        "Dependency review",

        "Grounding injections",

        "Escalation routing",
      ],
    },

    {
      title:
        "👁 Lens Calibration",

      items: [

        "People lens",

        "Places lens",

        "Things lens",

        "Confrontation intensity",

        "Behavioural realism",
      ],
    },

    {
      title:
        "🧘 Chakra Mapping",

      items: [

        "Chakra keywords",

        "Body mapping",

        "Nervous system mapping",

        "Behaviour mapping",
      ],
    },

    {
      title:
        "🎙 Media Processing",

      items: [

        "Transcription review",

        "Vision analysis review",

        "Extraction debugging",

        "Failed jobs",
      ],
    },

    {
      title:
        "🪐 Creator Notes",

      items: [

        "Field observations",

        "Release notes",

        "Prompt evolution",

        "Future architecture",
      ],
    },
  ];

  // --------------------------------------------------
  // 🌌 RENDER
  // --------------------------------------------------

  return (

    <ScrollView

      style={styles.container}

      contentContainerStyle={
        styles.content
      }

      showsVerticalScrollIndicator={
        false
      }
    >

      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.title}>

          Sacred Dance Observatory

        </Text>

        <Text style={styles.subtitle}>

          Internal creator consciousness
          layer. Emotional calibration,
          AI tuning, language evolution,
          and energetic field observation.

        </Text>

        {/* 🏠 BACK */}

        <TouchableOpacity

          onPress={() =>
            router.push("/")
          }

          style={styles.backButton}
        >

          <Text
            style={
              styles.backText
            }
          >

            ← Return to Landing

          </Text>

        </TouchableOpacity>

        {/* 🌍 LANGUAGE */}

        {__DEV__ && (

          <View
            style={{
              marginTop: 18,
            }}
          >

            <TextInput

              value={languageCode}

              onChangeText={
                setLanguageCode
              }

              placeholder=
                "Language code"

              placeholderTextColor=
                "rgba(255,255,255,0.3)"

              autoCapitalize="none"

              autoCorrect={false}

              style={{

                width: 180,

                paddingHorizontal: 16,

                paddingVertical: 12,

                borderRadius: 16,

                backgroundColor:
                  "rgba(255,255,255,0.05)",

                borderWidth: 1,

                borderColor:
                  "rgba(255,255,255,0.08)",

                color: "white",

                fontSize: 14,

                marginBottom: 12,
              }}
            />

            <TouchableOpacity

              style={
                styles.languageButton
              }

              onPress={async () => {

                const code =

                  languageCode
                    .trim()
                    .toLowerCase();

                if (!code) {

                  console.log(
                    "❌ Missing language code"
                  );

                  return;
                }

                //console.log(  `🌍 Generating ${code}`);

try {

const {
  data,
  error,
} = await supabase.functions.invoke(
  "add-language",
  {
    body: {
      language: code,
    },
  }
);

  //console.log(  "DATA:",  data );

  //console.log(  "ERROR:",  error);

} catch (err) {

  console.log(
    "FUNCTION CRASH:",
    err
  );
}
              }}
            >

              <Text
                style={
                  styles.languageText
                }
              >

                🌍 Generate {languageCode}

              </Text>

            </TouchableOpacity>

          </View>
        )}

      </View>

      {/* GRID */}

      <View style={styles.grid}>

        {sections.map(
          (section) => (

            <View

              key={
                section.title
              }

              style={styles.card}
            >

              <Text
                style={
                  styles.cardTitle
                }
              >

                {section.title}

              </Text>

              <View
                style={
                  styles.items
                }
              >

                {section.items.map(
                  (item) => (

                    <View

                      key={item}

                      style={
                        styles.item
                      }
                    >

                      <Text
                        style={
                          styles.itemText
                        }
                      >

                        {item}

                      </Text>

                    </View>
                  )
                )}

              </View>

            </View>
          )
        )}

      </View>

    </ScrollView>
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
        "black",
    },

    content: {

      padding: 24,

      paddingBottom: 120,
    },

    header: {

      marginBottom: 36,
    },

    title: {

      color: "white",

      fontSize: 34,

      fontWeight: "300",

      letterSpacing: 1,

      marginBottom: 14,
    },

    subtitle: {

      color:
        "rgba(255,255,255,0.5)",

      fontSize: 15,

      lineHeight: 26,

      maxWidth: 600,
    },

    backButton: {

      marginTop: 24,

      alignSelf:
        "flex-start",

      paddingHorizontal: 18,

      paddingVertical: 10,

      borderRadius: 999,

      backgroundColor:
        "rgba(255,255,255,0.06)",

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.08)",
    },

    backText: {

      color: "white",

      opacity: 0.82,

      fontSize: 14,
    },

    languageButton: {

      alignSelf:
        "flex-start",

      paddingHorizontal: 18,

      paddingVertical: 10,

      borderRadius: 999,

      backgroundColor:
        "rgba(120,120,255,0.08)",

      borderWidth: 1,

      borderColor:
        "rgba(120,120,255,0.12)",
    },

    languageText: {

      color: "white",

      opacity: 0.75,

      fontSize: 14,
    },

    grid: {

      gap: 18,
    },

    card: {

      borderRadius: 28,

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.08)",

      backgroundColor:
        "rgba(255,255,255,0.04)",

      padding: 22,
    },

    cardTitle: {

      color: "white",

      fontSize: 20,

      fontWeight: "300",

      marginBottom: 18,
    },

    items: {

      gap: 10,
    },

    item: {

      borderRadius: 18,

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.05)",

      backgroundColor:
        "rgba(0,0,0,0.18)",

      paddingHorizontal: 16,

      paddingVertical: 14,
    },

    itemText: {

      color:
        "rgba(255,255,255,0.72)",

      fontSize: 14,

      lineHeight: 20,
    },
  });