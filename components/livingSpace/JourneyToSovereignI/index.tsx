
import { useIsFocused } from "@react-navigation/native";
import { Eye, Sun, Waves } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useMirrorStore } from "@/stores/mirrorStore";

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

const isFocused = useIsFocused();

const contextReady = useMirrorStore(
  (state) => state.userContext?.ready === true
);

const contextVersion = useMirrorStore(
  (state) => state.contextVersion
);

const glimmersRequestedVersion = useRef<number | null>(null);

const generateGlimmersForContext = async () => {
  setGlimmerStatus("loading");

  try {

    console.log("SOVEREIGN I GLIMMER REQUEST STARTED");

const eventId = `responsibility-glimmer-${Date.now()}`;

console.log("GLIMMER EVENT SUBMITTED:", {
  eventId,
  contextVersion,
  timestamp: new Date().toISOString(),
});

    const outcome = await sovereignI({
      eventId: `responsibility-glimmer-${Date.now()}`,
      eventType: "responsibility.glimmer.requested",
      category: "domain",
      source: "responsibility_awareness",
      occurredAt: new Date().toISOString(),
      payload: {
        requestedBy: "workspace",
        source: "responsibility_awareness",
      },
      persistence: "transient",
      contextImpact: ["user", "creation"],
    });


    console.log("SOVEREIGN I GLIMMER OUTCOME:", outcome);

    console.log(
  "GLIMMER CAPABILITY OUTPUT:",
  outcome.capabilityResult?.output
);

console.log(
  "GLIMMER ROUTING:",
  outcome.routing
);

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

useEffect(() => {
  console.log("GLIMMER TRIGGER CHECK:", {
    isFocused,
    contextReady,
    contextVersion,
    alreadyRequested: glimmersRequestedVersion.current,
  });

  // Only run inside active Living Space
  if (!isFocused) return;

  // Wait for actual User Context
  if (!contextReady) return;

  // Avoid duplicate requests for the same context version
  if (glimmersRequestedVersion.current === contextVersion) return;

  console.log("GLIMMER GENERATION STARTING:", contextVersion);

  glimmersRequestedVersion.current = contextVersion;

  setGlimmers([]);
  setSelectedGlimmerIds([]);
  setFinalGlimmerId(null);

  void generateGlimmersForContext();

}, [isFocused, contextReady, contextVersion]);

const openPortal = (portalId: PortalId) => {
  setSelectedPortal(portalId);
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
  <View style={styles.portalRow}>
    {PORTALS.map((portal) => {
      const PortalIcon = portal.icon;
      const isActive = selectedPortal === portal.id;
      const portalGlimmers = glimmers.filter(
        (glimmer) => glimmer.portal === portal.id
      );

      return (
        <View
          key={portal.id}
          style={[
            styles.portalButton,
            isActive && styles.portalButtonActive,
          ]}
        >
          {!isActive && (
            <>
              <Pressable
                onPress={() => openPortal(portal.id)}
                style={styles.portalHeader}
              >
                <PortalIcon
                  size={17}
                  color={COLORS.gold}
                  strokeWidth={1.3}
                />

                <Text style={styles.portalTitle}>
                  {portal.title}
                </Text>

                <Text style={styles.portalCount}>
                  {String(portalGlimmers.length).padStart(2, "0")}
                </Text>
              </Pressable>

              <Text style={styles.portalQuestionSmall}>
                {portal.question}
              </Text>
            </>
          )}

          {isActive && (
            <Pressable
              onPress={() => setSelectedPortal(null)}
              style={styles.activePortalTitle}
            >
            </Pressable>
          )}

          {isActive ? (
            <ScrollView
              style={styles.portalGlimmerScroll}
              contentContainerStyle={styles.glimmerChoices}
              showsVerticalScrollIndicator
              nestedScrollEnabled
            >
              {glimmerStatus === "loading" && (
                <Text style={styles.glimmerChoiceText}>
                  Discovering your Glimmers...
                </Text>
              )}

              {glimmerStatus === "error" && (
                <Text style={styles.glimmerChoiceText}>
                  Glimmers could not be generated. Please try again later.
                </Text>
              )}

              {glimmerStatus === "empty" && (
                <Text style={styles.glimmerChoiceText}>
                  No Glimmers were returned for this request.
                </Text>
              )}

              {portalGlimmers.map((glimmer) => {
                const isSelected =
                  selectedGlimmerIds.includes(glimmer.id);

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
          ) : (
            <View style={styles.portalPrompt}>
            </View>
          )}
        </View>
      );
    })}
  </View>
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

      </View>

      {/* REALITY LAYERS */}
      <View style={styles.realitySection}>
        <Text style={styles.sectionTitle}>MY REALITY</Text>

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


portalRow: {
  flexDirection: "row",
  alignItems: "stretch",
  gap: 8,
  minWidth: 0,
},

  activePortalTitle: {
    width: "100%",
    paddingBottom: 5,
  },

portalButton: {
  flex: 1,
  minWidth: 0,
  height: 80,
  borderWidth: 1,
  borderColor: COLORS.border,
  borderRadius: 8,
  backgroundColor: "#101018",
  justifyContent: "center",
  alignItems: "flex-start",
  paddingHorizontal: 12,
  paddingVertical: 8,
  gap: 5,
},

portalButtonActive: {
  borderColor: COLORS.gold,
},

portalHeader: {
  flexDirection: "row",
  alignItems: "center",
  width: "100%",
  gap: 7,
},


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

  portalTitle: {
    color: COLORS.text,
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.7,
  },

portalCount: {
  color: COLORS.gold,
  fontSize: 25,
  fontWeight: "600",
  marginLeft: "auto",
  fontVariant: ["tabular-nums"],
  lineHeight: 28,
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

  close: {
    color: COLORS.muted,
    fontSize: 13,
  },

  portalQuestion: {
    color: COLORS.text,
    fontSize: 9,
  },

portalGlimmerScroll: {
  flex: 1,
  minHeight: 0,
  width: "100%",
},

portalPrompt: {
  flex: 1,
  justifyContent: "center",
},


  glimmerChoices: {
    gap: 6,
  },

glimmerChoice: {
  width: "100%",
  paddingVertical: 5,
  paddingHorizontal: 2,
  gap: 4,
},

  glimmerChoiceText: {
    color: COLORS.text,
    fontSize: 9,
    lineHeight: 13,
  },
});
