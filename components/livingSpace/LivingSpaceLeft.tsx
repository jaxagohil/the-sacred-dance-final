
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors, Fonts } from "../../constants/theme";

const SECTIONS = [
  { id: "you", title: "My profile", subtitle: "Your presence" },
  { id: "matters", title: "What matters to me", subtitle: "Your values and vision" },
  { id: "life-picture", title: "Life Picture", subtitle: "The life taking shape" },
  { id: "creations", title: "My creations", subtitle: "Dreams in motion" },
  { id: "circles", title: "Circles", subtitle: "Your people and conversations" },
  { id: "journal", title: "Journaling", subtitle: "Your reflections" },
];

type Props = {
  onSelectSection?: (section: string) => void;
};

export default function LivingSpaceLeft({ onSelectSection }: Props) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handlePress = (id: string) => {
    setActiveSection(current => current === id ? null : id);
    onSelectSection?.(id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>YOUR WORLD</Text>

      {SECTIONS.map((section, index) => {
        const active = activeSection === section.id;

        return (
          <Pressable
            key={section.id}
            onPress={() => handlePress(section.id)}
            accessibilityRole="button"
            accessibilityLabel={section.title}
            style={({ pressed }) => [
              styles.item,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.itemText}>
              <Text style={[styles.title, active && styles.activeTitle]}>
                {section.title}
              </Text>
              {active && (
                <Text style={styles.subtitle}>{section.subtitle}</Text>
              )}
            </View>
            <Text style={[styles.symbol, active && styles.activeSymbol]}>
              {active ? "✧" : index === 0 ? "○" : "·"}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 180,
    flexShrink: 0,
    paddingTop: 22,
  },
  eyebrow: {
    color: "#A28B60",
    fontSize: 9,
    letterSpacing: 2.4,
    marginBottom: 24,
    fontFamily: Fonts.light,
  },
  item: {
    minHeight: 43,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 9,
    paddingRight: 5,
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
    color: "#776A83",
    fontSize: 17,
    marginLeft: 8,
  },
  activeSymbol: {
    color: Colors.gold,
  },
  pressed: {
    opacity: 0.65,
  },
});
