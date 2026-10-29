
import React, { useState } from "react";

import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import EnergyField from "../../components/energy/EnergyField";
import LivingSpaceHeader from "../../components/livingSpace/LivingSpaceHeader";
import CosmicTiles from "../../components/mirror/CosmicTiles";
import Lenses from "../../components/mirror/Lenses";
import ReadingContainer from "../../components/mirror/ReadingContainer";
import { useMirrorStore } from "../../stores/mirrorStore";

const GOLD = "#C9AD70";
const MUTED = "#AAA2B6";
const PANEL = "#101018";
const BORDER = "rgba(201,173,112,0.24)";

function Portal({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.portal,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.portalTitle}>{title}</Text>
      {subtitle ? (
        <Text style={styles.portalSubtitle}>{subtitle}</Text>
      ) : null}
    </Pressable>
  );
}

export default function LivingSpace() {
  const { width } = useWindowDimensions();
  const wide = width >= 1050;

  const [showDivineReading, setShowDivineReading] =
  useState(false);

const {
  cosmic,
  dailyField,
  language,
  languageContext,
  userContext,
  mirrorContext,
} = useMirrorStore();

console.log("LIVING SPACE COSMIC:", cosmic);
console.log("LIVING SPACE DAILY FIELD:", dailyField);

  return (
    <View style={styles.screen}>
      <LivingSpaceHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          wide && styles.contentWide,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* COSMIC WHISPERS */}
        <View style={styles.whispers}>
          <Text style={styles.whisperText}>
            A moment to notice what is emerging ✧
          </Text>
        </View>

        {/* MAIN LIVING SPACE */}
        <View
          style={[
            styles.mainLayout,
            wide && styles.mainLayoutWide,
          ]}
        >
          {/* LEFT: COSMIC SIGNALS + ENERGY FIELD */}
          <View
            style={[
              styles.energyColumn,
              wide && styles.energyColumnWide,
            ]}
          >

<View style={styles.signals}>
  <CosmicTiles
    cosmic={{
  ...cosmic,
  dailyField,
}}
    language={language ?? "en"}
    languageContext={languageContext}
    layout="vertical"
  />
</View>


            <View style={styles.energyArea}>
              <EnergyField
                userContext={null}
                language="en"
              />
            </View>
          </View>

          {/* RIGHT: YOUR WORLD */}
          <View style={styles.world}>
            {/* LENSES + DIVINE READ */}
            <View
              style={[
                styles.topRow,
                !wide && styles.topRowNarrow,
              ]}
            >
<View style={styles.lenses}>
  <Lenses
    userContext={userContext}
    context={mirrorContext || {}}
    language={language ?? "en"}
    languageContext={languageContext}
    presentation="icons"
  />
</View>

<Pressable
  accessibilityRole="button"
  accessibilityLabel="Reveal Divine Reading"
  onPress={() => setShowDivineReading(true)}
  style={({ pressed }) => [
    styles.divineRead,
    pressed && styles.pressed,
  ]}
>
  {showDivineReading ? (
    <ReadingContainer
      userContext={userContext}
      context={mirrorContext || {}}
      language={language ?? "en"}
      languageContext={languageContext}
      cosmic={{ ...cosmic, dailyField }}
      autoOpen
    />
  ) : (
    <View style={styles.cardRow}>
      <View style={styles.miniCard}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.oracleLogo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.miniCard}>
        <Text style={styles.cardSymbol}>◉</Text>
      </View>
    </View>
  )}
</Pressable>
            </View>

            {/* PERSONAL VISION BOARD */}
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.visionBoard,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.sectionLabel}>
                WHAT MATTERS TO ME
              </Text>
              <Text style={styles.visionTitle}>
                Your Vision Board
              </Text>
              <Text style={styles.portalSubtitle}>
                Values · Truth · Intentions · Life Picture
              </Text>
            </Pressable>

            {/* GUIDES + CIRCLES */}
            <View style={styles.connections}>
              <Portal
                title="Guides"
                subtitle="Conversations"
              />
              <Portal
                title="Circles"
                subtitle="People walking with you"
              />
                <Portal
                 title="Journaling"
                 subtitle="Your reflections"
                 />
            </View>
          </View>
        </View>

        {/* CREATION JOURNEY */}
        <View style={styles.journey}>
          <Text style={styles.sectionLabel}>
            CREATION JOURNEY
          </Text>

          <View style={styles.journeyStages}>
            {[
              "Dream",
              "Discover",
              "Build",
              "Grow",
              "Scale",
              "Renew",
            ].map((stage, index) => (
              <View key={stage} style={styles.stage}>
                <View
                  style={[
                    styles.stageDot,
                    index === 0 && styles.activeDot,
                  ]}
                />
                <Text style={styles.stageText}>{stage}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#030405",
  },
  scroll: {
    flex: 1,
  },
  content: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  contentWide: {
    maxWidth: 1500,
    paddingHorizontal: 20,
  },
  whispers: {
    paddingVertical: 10,
    marginBottom: 14,
  },
  sectionLabel: {
    color: GOLD,
    fontSize: 10,
    letterSpacing: 2.2,
    fontWeight: "400",
  },
  whisperText: {
    color: MUTED,
    fontSize: 13,
    marginTop: 7,
  },
  mainLayout: {
    gap: 20,
  },
mainLayoutWide: {
  flexDirection: "row",
  alignItems: "stretch",
  gap: 12,
},
energyColumn: {
  flexDirection: "row",
  alignItems: "stretch",
  gap: 12,
},
energyColumnWide: {
  width: "42%",
  minWidth: 0,
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  paddingLeft: 12,
  paddingRight: 8,
},

readingSection: {
  width: "100%",
  marginTop: 8,
  marginBottom: 8,
},

signals: {
  width: 96,
  flexShrink: 0,
  alignItems: "center",
  justifyContent: "center",
  marginLeft: 12,
},
  portal: {
    flex: 1,
    minWidth: 76,
    minHeight: 76,
    padding: 10,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: PANEL,
    alignItems: "center",
    justifyContent: "center",
  },
  portalTitle: {
    color: "#E9DFC9",
    fontSize: 13,
    textAlign: "center",
  },
  portalSubtitle: {
    color: MUTED,
    fontSize: 10,
    textAlign: "center",
    marginTop: 5,
    lineHeight: 15,
  },
energyArea: {
  flex: 1,
  minWidth: 0,
  minHeight: 300,
  justifyContent: "center",
  alignItems: "center",
  overflow: "visible",
  paddingLeft: 0,
  transform: [{ translateX: -50 }],
},
  world: {
    flex: 1,
    minWidth: 0,
    gap: 16,
  },
topRow: {
  flexDirection: "row",
  alignItems: "flex-start",
  gap: 12,
},
  topRowNarrow: {
    flexWrap: "wrap",
  },
  lenses: {
    flex: 1,
    minWidth: 190,
    gap: 12,
  },
  lensRow: {
    flexDirection: "row",
    gap: 6,
  },
divineRead: {
  flex: 1,
  minWidth: 260,
  padding: 12,
  backgroundColor: "transparent",
  alignItems: "stretch",
  justifyContent: "center",
},

oracleLogo: {
  width: "78%",
  height: "78%",
},
  divineTitle: {
    color: "#E9DFC9",
    fontSize: 15,
    textAlign: "center",
  },
cardRow: {
  flexDirection: "row",
  gap: 12,
  width: "100%",
},
miniCard: {
  flex: 1,
  height: 100,
  borderWidth: 1,
  borderColor: GOLD,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#111018",
},
  cardSymbol: {
    color: GOLD,
    fontSize: 20,
  },
  divineSubtitle: {
    color: MUTED,
    fontSize: 10,
    marginTop: 10,
    textAlign: "center",
  },
  visionBoard: {
    minHeight: 155,
    padding: 20,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: PANEL,
    justifyContent: "center",
    alignItems: "center",
  },
  visionTitle: {
    color: "#E9DFC9",
    fontSize: 23,
    marginTop: 14,
    textAlign: "center",
    fontWeight: "300",
  },
connections: {
  flexDirection: "row",
  gap: 12,
  flexWrap: "wrap",
},
  journey: {
    marginTop: 24,
    padding: 16,
    borderTopWidth: 1,
    borderColor: BORDER,
  },
  journeyStages: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    gap: 4,
  },
  stage: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  stageDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: GOLD,
  },
  activeDot: {
    backgroundColor: GOLD,
  },
  stageText: {
    color: MUTED,
    fontSize: 10,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.72,
  },

  mirrorIcon: {
  flex: 1,
  minWidth: 60,
  height: 76,
  alignItems: "center",
  justifyContent: "center",
},

mirrorGlyph: {
  color: GOLD,
  fontSize: 30,
  fontWeight: "300",
  opacity: 0.85,
},
});
