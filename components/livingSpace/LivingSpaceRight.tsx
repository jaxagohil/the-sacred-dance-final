
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors, Fonts } from "../../constants/theme";

const SECTIONS = [
  { id: "orchestration", title: "Divine Orchestration", subtitle: "The greater pattern" },
  { id: "guidance", title: "Conversations with Guides", subtitle: "Listen and explore" },
];

type Props = {
  showPersonalSections?: boolean;
  onSelectSection?: (section: string) => void;
};

export default function LivingSpaceRight({ onSelectSection }: Props) {
  const [messageOpen, setMessageOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handlePress = (id: string) => {
    setActiveSection(current => current === id ? null : id);
    onSelectSection?.(id);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>YOUR GUIDANCE</Text>

      {SECTIONS.slice(0, 1).map(section => (
        <Pressable
          key={section.id}
          onPress={() => handlePress(section.id)}
          accessibilityRole="button"
          style={styles.item}
        >
          <View style={styles.itemText}>
            <Text style={[styles.title, activeSection === section.id && styles.activeTitle]}>
              {section.title}
            </Text>
            {activeSection === section.id && (
              <Text style={styles.subtitle}>{section.subtitle}</Text>
            )}
          </View>
          <Text style={styles.symbol}>✧</Text>
        </Pressable>
      ))}

      <View style={styles.messageArea}>
        <Text style={styles.messageEyebrow}>A MOMENT FOR YOU</Text>
        <Text style={styles.messageTitle}>Divine Message</Text>
        <Text style={styles.messageSubtitle}>
          Make space for a message to unfold.
        </Text>

        <Pressable
          onPress={() => {
            setMessageOpen(open => !open);
            onSelectSection?.("divine-message");
          }}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.messageButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.messageButtonText}>
            {messageOpen ? "Close invitation  ✧" : "Receive your message  ✧"}
          </Text>
        </Pressable>

        {messageOpen && (
          <Text style={styles.revealNote}>
            Your Divine Message experience will open here when connected to
            the existing Oracle and Tarot features.
          </Text>
        )}
      </View>

      {SECTIONS.slice(1).map(section => (
        <Pressable
          key={section.id}
          onPress={() => handlePress(section.id)}
          accessibilityRole="button"
          style={styles.item}
        >
          <View style={styles.itemText}>
            <Text style={[styles.title, activeSection === section.id && styles.activeTitle]}>
              {section.title}
            </Text>
            {activeSection === section.id && (
              <Text style={styles.subtitle}>{section.subtitle}</Text>
            )}
          </View>
          <Text style={styles.symbol}>✧</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 220,
    flexShrink: 0,
  },
  content: {
    paddingTop: 22,
    paddingBottom: 24,
  },
  eyebrow: {
    color: "#A28B60",
    fontSize: 9,
    letterSpacing: 2.4,
    marginBottom: 20,
    fontFamily: Fonts.light,
  },
  item: {
    minHeight: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  itemText: {
    flex: 1,
  },
  title: {
    color: "#B9B4C2",
    fontSize: 13,
    fontFamily: Fonts.light,
  },
  activeTitle: {
    color: "#E7D2A2",
  },
  subtitle: {
    color: "#8F899B",
    fontSize: 10,
    marginTop: 5,
    fontFamily: Fonts.light,
  },
  symbol: {
    color: Colors.gold,
    fontSize: 15,
    marginLeft: 8,
  },
  messageArea: {
    marginTop: 24,
    marginBottom: 26,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(201,173,112,0.42)",
  },
  messageEyebrow: {
    color: "#B59A68",
    fontSize: 8,
    letterSpacing: 1.8,
    marginBottom: 9,
    fontFamily: Fonts.light,
  },
  messageTitle: {
    color: "#E8D5AD",
    fontSize: 20,
    marginBottom: 8,
    fontFamily: Fonts.light,
  },
  messageSubtitle: {
    color: "#A39BAE",
    fontSize: 11,
    lineHeight: 17,
    fontFamily: Fonts.light,
  },
  messageButton: {
    alignSelf: "flex-start",
    marginTop: 15,
    paddingVertical: 9,
    paddingRight: 5,
  },
  messageButtonText: {
    color: "#D9BD80",
    fontSize: 11,
    fontFamily: Fonts.light,
  },
  revealNote: {
    color: "#A39BAE",
    fontSize: 10,
    lineHeight: 16,
    marginTop: 10,
    fontFamily: Fonts.light,
  },
  pressed: {
    opacity: 0.65,
  },
});
