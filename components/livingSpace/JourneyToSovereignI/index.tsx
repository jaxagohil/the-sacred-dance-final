
import { Eye, Sun, Waves } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

type PortalId = "can" | "cant" | "wont";

type Glimmer = {
  id: string;
  title: string;
  detail: string;
  reality: string;
  portal?: string;
};

type Portal = {
  id: PortalId;
  title: string;
  question: string;
  icon: React.ComponentType<any>;
  glimmers: Glimmer[];
};

type Props = {
  onSelectNextStep?: (glimmer: Glimmer) => void;
};

const COLORS = {
  gold: "#C9AD70",
  text: "#F2EEE7",
  muted: "#AAA2B6",
  green: "#78A77B",
  inactive: "#34343B",
  border: "rgba(201,173,112,0.24)",
};

const PORTALS: Portal[] = [
  {
    id: "can",
    title: "CAN CHANGE",
    icon: Sun,
    question: "What can i  create in my reality?",
    glimmers: [
      {
        id: "c1",
        title: "Choose your health without waiting for motivation.",
        detail: "One small action today can support the life you want to create.",
        reality: "Physical",
      },
      {
        id: "c2",
        title: "What is one habit you are ready to change?",
        detail: "Focus on a choice you can make today.",
        reality: "Physical",
      },
      {
        id: "c3",
        title: "Where can you take ownership of your choices?",
        detail: "Notice where your actions can create a different experience.",
        reality: "Emotional",
      },
    ],
  },
  {
    id: "cant",
    title: "CAN'T CHANGE",
    icon: Waves,
    question: "Where am I giving away my power?",
    glimmers: [
      {
        id: "cc1",
        title: "Can you stop attaching your peace to someone else's decisions?",
        detail: "Separate what belongs to you from what belongs to others.",
        reality: "Emotional",
      },
      {
        id: "cc2",
        title: "Can you trust the process without demanding immediate results?",
        detail: "Explore acceptance without abandoning your agency.",
        reality: "Energetic",
      },
      {
        id: "cc3",
        title: "What are you trying to control that isn't yours to control?",
        detail: "Notice where your energy is being spent.",
        reality: "Physical",
      },
    ],
  },
  {
    id: "wont",
    title: "WON'T CHANGE",
    icon: Eye,
    question: "What am I unwilling to question?",
    glimmers: [
      {
        id: "w1",
        title: "Am I protecting an old story about myself?",
        detail: "Question whether a familiar belief still serves your creation.",
        reality: "Emotional",
      },
      {
        id: "w2",
        title: "What have I accepted without questioning?",
        detail: "Look again at inherited ideas and familiar expectations.",
        reality: "Energetic",
      },
      {
        id: "w3",
        title: "Is this a conscious boundary or a fear-based attachment?",
        detail: "Distinguish what you value from what you may be protecting.",
        reality: "Physical",
      },
    ],
  },
];

const REALITY = [
  { label: "Physical", active: 2, total: 3 },
  { label: "Emotional", active: 2, total: 3 },
  { label: "Energetic", active: 1, total: 3 },
  { label: "Consciousness", active: 0, total: 1 },
];

export default function JourneyToSovereignI({
  onSelectNextStep,
}: Props) {
  const [selectedPortal, setSelectedPortal] =
    useState<PortalId | null>(null);

  const [selectedGlimmerId, setSelectedGlimmerId] =
    useState("c1");

  const allGlimmers = useMemo(
    () =>
      PORTALS.flatMap((portal) =>
        portal.glimmers.map((glimmer) => ({
          ...glimmer,
          portal: portal.title,
        }))
      ),
    []
  );

  const selectedGlimmer =
    allGlimmers.find(
      (glimmer) => glimmer.id === selectedGlimmerId
    ) ?? allGlimmers[0];

  const activePortal = PORTALS.find(
    (portal) => portal.id === selectedPortal
  );

  const chooseGlimmer = (glimmer: Glimmer) => {
    setSelectedGlimmerId(glimmer.id);
    onSelectNextStep?.(glimmer);
    setSelectedPortal(null);
  };

  return (
    <View style={styles.container}>

      {/* PORTALS + NEXT STEP */}
      <View style={styles.bottomRow}>
        <View style={styles.portalArea}>
          {activePortal ? (
            <View style={styles.portalDetail}>
              <View style={styles.portalHeader}>
                <Text style={styles.sectionTitle}>
                  {activePortal.title}
                </Text>

                <Pressable
                  onPress={() => setSelectedPortal(null)}
                  hitSlop={8}
                >
                  <Text style={styles.close}>✕</Text>
                </Pressable>
              </View>

              <Text style={styles.portalQuestion}>
                {activePortal.question}
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.glimmerChoices}
              >
                {activePortal.glimmers.map((glimmer) => (
                  <Pressable
                    key={glimmer.id}
                    onPress={() => chooseGlimmer(glimmer)}
                    style={styles.glimmerChoice}
                  >
                    <Text
                      style={styles.glimmerChoiceText}
                      numberOfLines={3}
                    >
                      {glimmer.title}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : (
            <View style={styles.portalRow}>
              {PORTALS.map((portal) => {
                const PortalIcon = portal.icon;

                return (
                  <Pressable
                    key={portal.id}
                    onPress={() => setSelectedPortal(portal.id)}
                    style={styles.portalButton}
                  >
                    <PortalIcon
                      size={19}
                      color={COLORS.gold}
                      strokeWidth={1.3}
                    />

                    <Text style={styles.portalTitle}>
                      {portal.title}
                    </Text>

                    <Text style={styles.portalQuestionSmall}>
                      {portal.question}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {/* MY 1 NEXT STEP */}
        <View style={styles.nextStep}>
          <Text style={styles.sectionTitle}>
            MY 1 NEXT STEP
          </Text>

          <View style={styles.nextStepDivider} />

          <Text
            style={styles.nextStepTitle}
            numberOfLines={4}
          >
            {selectedGlimmer.title}
          </Text>

          <Text style={styles.nextStepReality}>
            {selectedGlimmer.reality}
          </Text>
        </View>
      </View>

      {/* FOUR REALITY LAYERS — TEN EQUAL BLOCKS */}
      <View style={styles.realitySection}>
        <Text style={styles.sectionTitle}>
          MY REALITY
        </Text>

        {/* LAYER LABELS */}
        <View style={styles.realityLabels}>
          {REALITY.map((group) => (
            <View
              key={group.label}
              style={[
                styles.realityLabelGroup,
                { flex: group.total },
              ]}
            >
              <Text style={styles.realityLabel}>
                {group.label}
              </Text>
            </View>
          ))}
        </View>

        {/* TEN EQUAL-SIZED INDICATORS */}
        <View style={styles.realityBlocks}>
          {REALITY.map((group) => (
            <View
              key={group.label}
              style={[
                styles.realityBlockGroup,
                { flex: group.total },
              ]}
            >
              {Array.from(
                { length: group.total },
                (_, index) => (
                  <View
                    key={`${group.label}-${index}`}
                    style={[
                      styles.segment,
                      {
                        backgroundColor:
                          index < group.active
                            ? COLORS.green
                            : COLORS.inactive,
                      },
                    ]}
                  />
                )
              )}
            </View>
          ))}
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minWidth: 0,
    backgroundColor: "transparent",
    gap: 14,
  },

  sectionTitle: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: "500",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  /* PORTALS */

  bottomRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 5,
    minWidth: 0,
  },

  portalArea: {
    flex: 3,
    minWidth: 0,
    justifyContent: "center",
  },

  portalRow: {
    flexDirection: "row",
    gap: 8,
    minWidth: 0,
  },

  portalButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 80,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: "#101018",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 7,
  },

  portalTitle: {
    color: COLORS.text,
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.7,
  },

  portalQuestionSmall: {
    color: COLORS.muted,
    fontSize: 8,
    lineHeight: 12,
  },

  /* NEXT STEP */

  nextStep: {
    flex: 1,
    minWidth: 130,
    minHeight: 80,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: "#101018",
    padding: 12,
    justifyContent: "center",
    gap: 8,
  },

  nextStepDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },

  nextStepTitle: {
    color: COLORS.text,
    fontSize: 10,
    lineHeight: 15,
    fontWeight: "500",
  },

  nextStepReality: {
    color: COLORS.green,
    fontSize: 8,
    letterSpacing: 0.5,
  },

  /* REALITY LAYERS */

  realitySection: {
    gap: 7,
  },

  realityLabels: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },

  realityLabelGroup: {
    minWidth: 0,
  },

  realityLabel: {
    color: COLORS.text,
    fontSize: 8,
    fontWeight: "500",
  },

  realityBlocks: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },

  realityBlockGroup: {
    flexDirection: "row",
    gap: 4,
    minWidth: 0,
  },

  segment: {
    flex: 1,
    height: 5,
    borderRadius: 2,
  },

  /* GLIMMER SELECTION */

  portalDetail: {
    minHeight: 104,
    justifyContent: "center",
    gap: 7,
  },

  portalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  close: {
    color: COLORS.muted,
    fontSize: 13,
  },

  portalQuestion: {
    color: COLORS.text,
    fontSize: 9,
  },

  glimmerChoices: {
    gap: 6,
  },

  glimmerChoice: {
    width: 150,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 5,
    justifyContent: "center",
  },

  glimmerChoiceText: {
    color: COLORS.text,
    fontSize: 9,
    lineHeight: 13,
  },
});
