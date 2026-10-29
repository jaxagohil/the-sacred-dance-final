import React, { ReactNode, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Colors, Fonts } from "../constants/theme";

type SpaceSection =
  | "profile"
  | "whatMatters"
  | "lifePicture"
  | "creations"
  | "guidance"
  | "journal"
  | "circles";

type LivingSpaceProps = {
  /** Mount the existing Mirror/EnergyField here. The Mirror itself is not recreated. */
  mirrorContent: ReactNode;
  /** Existing features can be passed in as slots as they are connected. */
  leftContent?: Partial<Record<"profile" | "whatMatters" | "lifePicture" | "creations", ReactNode>>;
  rightContent?: Partial<Record<"guidance" | "journal" | "circles", ReactNode>>;
  journeyContent?: ReactNode;
  onOpenSection?: (section: SpaceSection) => void;
};

const GOLD = "#C9AD70";
const MUTED = "#A39A89";
const LINE = "rgba(201,173,112,0.18)";
const PANEL = "rgba(255,255,255,0.025)";

const leftSections: { key: SpaceSection; title: string; subtitle: string }[] = [
  { key: "profile", title: "You", subtitle: "Your presence" },
  { key: "whatMatters", title: "What matters to me", subtitle: "Values & vision" },
  { key: "lifePicture", title: "Life Picture", subtitle: "The life taking shape" },
  { key: "creations", title: "My creations", subtitle: "Dreams in motion" },
];

const rightSections: { key: SpaceSection; title: string; subtitle: string }[] = [
  { key: "guidance", title: "Divine Guidance", subtitle: "Listen for what is emerging" },
  { key: "journal", title: "Reflections", subtitle: "A space to meet yourself" },
  { key: "circles", title: "Circles", subtitle: "People on the path with you" },
];

/**
 * A quiet workspace shell for bringing existing Sacred Dance experiences together.
 * This component intentionally does not replace or reimplement domain logic.
 */
export default function LivingSpace({
  mirrorContent,
  leftContent = {},
  rightContent = {},
  journeyContent,
  onOpenSection,
}: LivingSpaceProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 1100;
  const [expanded, setExpanded] = useState<SpaceSection | null>(null);

  const openSection = (section: SpaceSection) => {
    setExpanded(current => current === section ? null : section);
    onOpenSection?.(section);
  };

  const renderSection = (
    section: { key: SpaceSection; title: string; subtitle: string },
    slot: ReactNode | undefined,
  ) => (
    <Pressable
      key={section.key}
      accessibilityRole="button"
      accessibilityLabel={section.title}
      onPress={() => openSection(section.key)}
      style={({ pressed }) => [styles.section, pressed && styles.sectionPressed]}
    >
      <View style={styles.sectionCopy}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
      </View>
      <Text style={styles.chevron}>{expanded === section.key ? "−" : "+"}</Text>
      {expanded === section.key && (
        <View style={styles.expandedContent}>
          {slot || (
            <Text style={styles.slotHint}>
              Connect the existing {section.title} experience here.
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.atmosphere}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}><Text style={styles.brandGlyph}>✧</Text></View>
          <View>
            <Text style={styles.eyebrow}>THE SACRED DANCE</Text>
            <Text style={styles.heading}>Divine Orchestration</Text>
          </View>
        </View>
        <Text style={styles.atmosphereLine}>A living field for what is ready to emerge</Text>
      </View>

      <View style={[styles.workspace, wide && styles.workspaceWide]}>
        {wide && (
          <ScrollView style={styles.sideColumn} contentContainerStyle={styles.sideContent}>
            <Text style={styles.sideEyebrow}>YOUR INNER WORLD</Text>
            {leftSections.map(section => renderSection(section, leftContent[section.key as keyof typeof leftContent]))}
          </ScrollView>
        )}

        <View style={styles.mirrorColumn}>
          <View style={styles.mirrorFrame}>
            {mirrorContent}
          </View>
          <Text style={styles.mirrorWhisper}>I am Love, Loved & Lovable</Text>
          {!wide && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mobileRail}>
              {leftSections.map(section => (
                <Pressable key={section.key} onPress={() => openSection(section.key)} style={styles.mobilePill}>
                  <Text style={styles.mobilePillText}>{section.title}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
          {!wide && expanded && (
            <View style={styles.mobileExpanded}>
              {leftContent[expanded as keyof typeof leftContent] || rightContent[expanded as keyof typeof rightContent] || (
                <Text style={styles.slotHint}>Connect the existing {expanded} experience here.</Text>
              )}
            </View>
          )}
        </View>

        <ScrollView style={styles.sideColumn} contentContainerStyle={styles.sideContent}>
          <Text style={styles.sideEyebrow}>LISTEN & CONNECT</Text>
          {rightSections.map(section => renderSection(section, rightContent[section.key as keyof typeof rightContent]))}
          {!wide && (
            <>
              <Text style={[styles.sideEyebrow, styles.mobileSectionLabel]}>YOUR INNER WORLD</Text>
              {leftSections.map(section => renderSection(section, leftContent[section.key as keyof typeof leftContent]))}
            </>
          )}
        </ScrollView>
      </View>

      <View style={styles.journey}>
        <Text style={styles.journeyLabel}>CREATION JOURNEY</Text>
        {journeyContent || (
          <View style={styles.stages}>
            {["Dream", "Discover", "Build", "Grow", "Scale", "Renew"].map((stage, index) => (
              <View key={stage} style={styles.stage}>
                <View style={[styles.stageDot, index === 0 && styles.stageDotActive]} />
                <Text style={[styles.stageText, index === 0 && styles.stageTextActive]}>{stage}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, minHeight: "100%", backgroundColor: "#030405" },
  atmosphere: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.045)" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 11 },
  brandMark: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: LINE, alignItems: "center", justifyContent: "center" },
  brandGlyph: { color: GOLD, fontSize: 20 },
  eyebrow: { color: GOLD, fontSize: 9, letterSpacing: 2.5, fontFamily: Fonts.light },
  heading: { color: "#EEE7DA", fontSize: 19, fontFamily: Fonts.light, marginTop: 2 },
  atmosphereLine: { color: MUTED, fontSize: 11, marginTop: 10, marginLeft: 43, fontFamily: Fonts.light },
  workspace: { flex: 1, gap: 12, paddingHorizontal: 12, paddingTop: 12 },
  workspaceWide: { flexDirection: "row", paddingHorizontal: 20, gap: 20 },
  sideColumn: { flex: 1, minWidth: 0 },
  sideContent: { gap: 8, paddingBottom: 18 },
  sideEyebrow: { color: "#7F776A", fontSize: 9, letterSpacing: 1.8, marginBottom: 4, marginTop: 8, paddingHorizontal: 5, fontFamily: Fonts.light },
  section: { borderWidth: 1, borderColor: "rgba(255,255,255,0.055)", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, backgroundColor: PANEL, flexDirection: "row", flexWrap: "wrap", alignItems: "center" },
  sectionPressed: { borderColor: LINE, backgroundColor: "rgba(201,173,112,0.055)" },
  sectionCopy: { flex: 1 },
  sectionTitle: { color: "#D8D0C2", fontSize: 12, fontFamily: Fonts.light },
  sectionSubtitle: { color: "#777166", fontSize: 10, marginTop: 4, fontFamily: Fonts.light },
  chevron: { color: GOLD, fontSize: 17, paddingHorizontal: 3 },
  expandedContent: { width: "100%", paddingTop: 12 },
  slotHint: { color: MUTED, fontSize: 11, lineHeight: 17, fontFamily: Fonts.light },
  mirrorColumn: { flex: wide ? 2.2 : 1, minWidth: 0, justifyContent: "center", alignItems: "stretch" },
  mirrorFrame: { flex: 1, minHeight: wide ? 380 : 250, alignItems: "stretch", justifyContent: "center" },
  mirrorWhisper: { textAlign: "center", color: "#D7C69C", fontSize: 12, letterSpacing: 0.6, paddingVertical: 12, fontFamily: Fonts.light },
  mobileRail: { gap: 7, paddingVertical: 8 },
  mobilePill: { borderWidth: 1, borderColor: LINE, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },
  mobilePillText: { color: "#C8BFAF", fontSize: 10, fontFamily: Fonts.light },
  mobileExpanded: { borderTopWidth: 1, borderTopColor: LINE, padding: 12 },
  mobileSectionLabel: { marginTop: 14 },
  journey: { borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.07)", paddingHorizontal: 22, paddingTop: 10, paddingBottom: 16 },
  journeyLabel: { textAlign: "center", color: "#80745E", fontSize: 8, letterSpacing: 2, marginBottom: 10, fontFamily: Fonts.light },
  stages: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", maxWidth: 720, alignSelf: "center", width: "100%" },
  stage: { alignItems: "center", gap: 5, flex: 1 },
  stageDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: "#5D5548" },
  stageDotActive: { backgroundColor: GOLD, width: 7, height: 7, borderRadius: 4 },
  stageText: { color: "#777064", fontSize: 9, fontFamily: Fonts.light },
  stageTextActive: { color: GOLD },
});
