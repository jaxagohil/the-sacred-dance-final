
import { Eye, Sun, Waves } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { Glimmer as EngineGlimmer } from "@/lib/livingSpace/sovereignI/capabilities/glimmer/glimmer.types";
import { sovereignI } from "@/lib/sovereignIOrchestrator/core/sovereignI";

type PortalId = "can" | "cant" | "wont";

type Glimmer = EngineGlimmer & {
  detail: string;
  reality: string;
};

type Portal = {
  id: PortalId;
  title: string;
  question: string;
  icon: React.ComponentType<any>;
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
    question: "What can I create in my reality?",
  },
  {
    id: "cant",
    title: "CAN'T CHANGE",
    icon: Waves,
    question: "Where am I giving away my power?",
  },
  {
    id: "wont",
    title: "WON'T CHANGE",
    icon: Eye,
    question: "What am I unwilling to question?",
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

  const [glimmers, setGlimmers] = useState<Glimmer[]>([]);
const [selectedGlimmerIds, setSelectedGlimmerIds] =
  useState<string[]>([]);

const [finalGlimmerId, setFinalGlimmerId] =
  useState<string | null>(null);

  const [glimmerStatus, setGlimmerStatus] =
    useState<"idle" | "loading" | "ready" | "empty" | "error">("idle");

  const glimmersRequested = useRef(false);

  const activePortal = PORTALS.find(
    (portal) => portal.id === selectedPortal
  );

  const portalGlimmers = glimmers.filter(
    (glimmer) => glimmer.portal === selectedPortal
  );


const openPortal = async (portalId: PortalId) => {
  setSelectedPortal(portalId);

  if (glimmersRequested.current) return;

  glimmersRequested.current = true;
  setGlimmerStatus("loading");

  try {
    const outcome = await sovereignI({
      eventId: `responsibility-glimmer-${Date.now()}`,
      eventType: "responsibility.glimmer.requested",
      category: "domain",
      source: "responsibility_awareness",
      occurredAt: new Date().toISOString(),
      payload: {
        requestedBy: "user",
        source: "responsibility_awareness",
      },
      persistence: "transient",
      contextImpact: ["user", "creation"],
    });

    const result = outcome.capabilityResult?.output;

    if (
      outcome.routing.route !== "invoke_capability" ||
      outcome.routing.capabilityId !== "glimmer" ||
      !result ||
      typeof result !== "object" ||
      !("collection" in result)
    ) {
      setGlimmerStatus("empty");
      return;
    }

    const collection = (
      result as { collection: { glimmers: EngineGlimmer[] } }
    ).collection;

    const generated = collection.glimmers.map((glimmer) => ({
      ...glimmer,
      detail: glimmer.possibility,
      reality: glimmer.pattern,
    }));

    setGlimmers(generated);
    setGlimmerStatus(generated.length ? "ready" : "empty");
  } catch (error) {
    console.error("Glimmer request failed:", error);
    setGlimmerStatus("error");
  }
};

 const selectedGlimmers = glimmers.filter((glimmer) =>
  selectedGlimmerIds.includes(glimmer.id)
);

const finalGlimmer = selectedGlimmers.find(
  (glimmer) => glimmer.id === finalGlimmerId
);

const chooseGlimmer = (glimmer: Glimmer) => {
  setSelectedGlimmerIds((current) =>
    current.includes(glimmer.id)
      ? current.filter((id) => id !== glimmer.id)
      : [...current, glimmer.id]
  );
};

const commitNextStep = () => {
  if (!finalGlimmer) return;

  onSelectNextStep?.(finalGlimmer);
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
{portalGlimmers.map((glimmer) => {
  const isSelected = selectedGlimmerIds.includes(glimmer.id);

  return (
    <Pressable
      key={glimmer.id}
      onPress={() => chooseGlimmer(glimmer)}
      style={[
        styles.glimmerChoice,
        isSelected && styles.glimmerSelected,
      ]}
    >
      <Text style={styles.glimmerChoiceText}>
        {isSelected ? "☑" : "□"} {glimmer.title}
      </Text>

      <Text style={styles.glimmerChoiceText}>
        {glimmer.possibility}
      </Text>
    </Pressable>
  );
})}
              </ScrollView>
            </View>
          ) : (
            <View style={styles.portalRow}>
              {PORTALS.map((portal) => {
                const PortalIcon = portal.icon;

                return (
                  <Pressable
                    key={portal.id}
onPress={() => openPortal(portal.id)}
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

  {selectedGlimmers.length === 0 ? (
    <Text style={styles.nextStepTitle}>
      Select Glimmers from any portal to explore your possibilities.
    </Text>
  ) : (
    <>
      {selectedGlimmers.map((glimmer) => (
        <Pressable
          key={glimmer.id}
          onPress={() => setFinalGlimmerId(glimmer.id)}
          style={[
            styles.selectedGlimmer,
            finalGlimmerId === glimmer.id &&
              styles.glimmerSelected,
          ]}
        >
          <Text style={styles.nextStepTitle}>
            {finalGlimmerId === glimmer.id ? "◉ " : "○ "}
            {glimmer.title}
          </Text>
          <Text style={styles.nextStepReality}>
            {glimmer.pattern} · {glimmer.portal.toUpperCase()}
          </Text>
        </Pressable>
      ))}

      <Pressable
        onPress={commitNextStep}
        disabled={!finalGlimmer}
        style={[
          styles.commitButton,
          !finalGlimmer && styles.commitButtonDisabled,
        ]}
      >
        <Text style={styles.commitButtonText}>
          MAKE THIS MY NEXT STEP
        </Text>
      </Pressable>
    </>
  )}
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

  glimmerSelected: {
  borderColor: COLORS.gold,
  backgroundColor: "rgba(201,173,112,0.10)",
},

selectedGlimmer: {
  padding: 6,
  borderWidth: 1,
  borderColor: COLORS.border,
  borderRadius: 5,
  gap: 4,
},

commitButton: {
  padding: 9,
  backgroundColor: COLORS.gold,
  borderRadius: 5,
  alignItems: "center",
},

commitButtonDisabled: {
  opacity: 0.4,
},

commitButtonText: {
  color: "#101018",
  fontSize: 8,
  fontWeight: "700",
  letterSpacing: 0.8,
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
