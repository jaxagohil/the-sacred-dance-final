import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useMirrorStore } from "../../stores/mirrorStore";

import { orchestrationAgent } from "../../lib/ai/agents/orchestrationAgent";
import { transmissionAgent } from "../../lib/ai/agents/transmissionAgent";
import { buildAlignmentOSContext } from "../../lib/alignment/buildAlignmentOSContext";

import GuideSelector from "../guidance/GuideSelector";
import GuideTransmission from "../guidance/GuideTransmission";
import ReflectionPortal from "../guidance/ReflectionPortal";

const VALID_GUIDES = ["heart", "structure", "cosmic"];

type Message = {
  id: string;
  role: "user" | "guide";
  guide: string;
  text: string;
  createdAt: string;
};

export default function LivingSpaceHeader({ onFieldChange }: any) {
  const contextVersion = useMirrorStore((state) => state.contextVersion);
  const ready = useMirrorStore((state) => state.ready);

  const alignmentContext = useMemo(
    () => buildAlignmentOSContext(),
    [contextVersion, ready]
  );

  const [selectedGuide, setSelectedGuide] = useState("cosmic");
  const [activeFieldGuide, setActiveFieldGuide] = useState("cosmic");

  const [orchestrationResult, setOrchestrationResult] = useState<any>(null);
  const [transmissions, setTransmissions] = useState<Message[]>([]);

  const [orchestrationLoading, setOrchestrationLoading] = useState(false);
  const [currentFragmentIndex, setCurrentFragmentIndex] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [portalVisible, setPortalVisible] = useState(false);

  const orchestrationRequest = useRef(0);
  const transmissionRequest = useRef(0);

  const guideProfiles = {
    heart: {
      name: alignmentContext?.userContext?.profile?.guide_1_name || "Heart",
    },
    structure: {
      name: alignmentContext?.userContext?.profile?.guide_2_name || "Structure",
    },
    cosmic: {
      name: alignmentContext?.userContext?.profile?.guide_3_name || "Cosmic",
    },
  };

  const language = alignmentContext?.language || "en";

  // --------------------------------------------------
  // ORCHESTRATION
  // Runs on entry and when the existing Living Field changes.
  // Its conversation is displayed in the centre section.
  // --------------------------------------------------

  useEffect(() => {
    let active = true;
    const requestId = ++orchestrationRequest.current;

    async function runOrchestration() {
      if (!ready || !alignmentContext?.mirrorContext) return;

      setOrchestrationLoading(true);

      try {
        const result = await orchestrationAgent({
          alignmentContext,
          selectedGuide,
          language,
        });

        if (
          !active ||
          requestId !== orchestrationRequest.current ||
          !result
        ) {
          return;
        }

        const foregroundGuide = VALID_GUIDES.includes(
          result?.speakers?.[0]?.guide
        )
          ? result.speakers[0].guide
          : "cosmic";

        setActiveFieldGuide(foregroundGuide);
        setOrchestrationResult(result);
        onFieldChange?.(result);
      } catch (error) {
        console.error("ORCHESTRATION AGENT ERROR", error);
      } finally {
        if (active && requestId === orchestrationRequest.current) {
          setOrchestrationLoading(false);
        }
      }
    }

    runOrchestration();

    return () => {
      active = false;
    };
  }, [contextVersion, ready, alignmentContext, selectedGuide, language]);

  // --------------------------------------------------
  // TRANSMISSION
  // Runs only after the user submits through Reflection Portal.
  // Conversation remains in local component state.
  // --------------------------------------------------

  async function handleReflection({ text }: any) {
    const reflection = text?.trim();

    if (!reflection || thinking) return;

    const requestId = ++transmissionRequest.current;
    setThinking(true);

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: "user",
      guide: selectedGuide,
      text: reflection,
      createdAt: new Date().toISOString(),
    };

    const updatedMessages = [...transmissions, userMessage];
    setTransmissions(updatedMessages);

    try {
      const result = await transmissionAgent({
        reflection,
        recentMessages: updatedMessages.slice(-8),
        alignmentContext,
        field: alignmentContext?.userContext || {},
        orchestrationField: orchestrationResult || {},
        orchestrationDecision: orchestrationResult || {},
        selectedGuide,
        language,
      });

      if (requestId !== transmissionRequest.current) return;

      if (!result) {
        throw new Error("Transmission Agent returned no response.");
      }

      const responses = Array.isArray(result?.responses)
        ? result.responses
        : [];

      const guideMessages: Message[] = responses
        .filter(
          (item: any) =>
            VALID_GUIDES.includes(item?.guide) &&
            typeof item?.text === "string" &&
            item.text.trim()
        )
        .map((item: any, index: number) => ({
          id: `guide_${Date.now()}_${index}`,
          role: "guide",
          guide: item.guide,
          text: item.text.trim(),
          createdAt: new Date().toISOString(),
        }));

      if (guideMessages.length) {
        setTransmissions((previous) => [...previous, ...guideMessages]);
      }

      setPortalVisible(false);
    } catch (error) {
      console.error("TRANSMISSION AGENT ERROR", error);
    } finally {
      if (requestId === transmissionRequest.current) {
        setThinking(false);
      }
    }
  }

  const orchestrationFragments = Array.isArray(orchestrationResult?.fragments)
    ? orchestrationResult.fragments.filter(
        (item: any) =>
          VALID_GUIDES.includes(item?.guide) &&
          typeof item?.text === "string" &&
          item.text.trim()
      )
    : [];

  // Split long Guide fragments into readable continuations. Each continuation
  // keeps the same Guide colour and occupies the same fixed area.
  const orchestrationSegments = orchestrationFragments.flatMap(
    (fragment: any, fragmentIndex: number) => {
      const words = fragment.text.trim().split(/\s+/);
      const chunks: string[] = [];
      let chunk = "";

      words.forEach((word: string) => {
        const candidate = chunk ? `${chunk} ${word}` : word;

        if (candidate.length > 105 && chunk) {
          chunks.push(chunk);
          chunk = word;
        } else {
          chunk = candidate;
        }
      });

      if (chunk) chunks.push(chunk);

return chunks.map((text: string, segmentIndex: number) => ({
  guide: fragment.guide,
  text,
  fragmentIndex,
  segmentIndex,
  hasContinuation: segmentIndex < chunks.length - 1,
}));
    }
  );

  // Advance through a Guide's continuation before moving to the next Guide.
  useEffect(() => {
    setCurrentFragmentIndex(0);

    if (orchestrationSegments.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentFragmentIndex((previous) =>
        (previous + 1) % orchestrationSegments.length
      );
    }, 15000);

    return () => clearInterval(interval);
  }, [orchestrationResult]);

  const currentFragment =
    orchestrationSegments.length > 0
      ? orchestrationSegments[
          currentFragmentIndex % orchestrationSegments.length
        ]
      : null;

  // The selected segment is already sized for the fixed orchestration area.
const displayFragment = currentFragment
  ? `${currentFragment.text}${currentFragment.hasContinuation ? " ..." : ""}`
  : "";

  const guideColor =
    currentFragment?.guide === "heart"
      ? "#E7A6C8" // Heart — pink
      : currentFragment?.guide === "structure"
      ? "#91B8F4" // Structure — blue
      : "#F2EEE8"; // Cosmic — white


  return (
    <View style={styles.container}>
      {/* LEFT — GUIDE NAMES. Keep this selector and its placement intact. */}
      <View style={styles.guidesColumn}>
        <GuideSelector
          activeGuide={selectedGuide}
          activeFieldGuide={activeFieldGuide}
          onSelectGuide={setSelectedGuide}
          guideProfiles={guideProfiles}
        />
      </View>

      {/* CENTRE — ORCHESTRATION ABOVE THE ENERGY BALL */}
      <View style={styles.orchestrationColumn}>
        {currentFragment ? (
          <Text
            key={`${currentFragment.guide}_${currentFragmentIndex}`}
style={[
  styles.orchestrationText,
  {
    color: guideColor,
    textShadowColor: guideColor,
  },
]}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {displayFragment}
          </Text>
        ) : orchestrationLoading ? (
          <View style={styles.orchestrationLoading}>
            <ActivityIndicator color="#C8B4E8" size="small" />
          </View>
        ) : null}
      </View>

{/* RIGHT — LATEST TRANSMISSION + ASK BUTTON */}
<View style={styles.transmissionColumn}>
  <View style={styles.transmissionDisplay}>

    <ScrollView
      style={styles.transmissionScroll}
      contentContainerStyle={styles.transmissionContent}
      showsVerticalScrollIndicator={false}
    >
      {transmissions.length > 0 ? (
        <GuideTransmission
          key={transmissions[transmissions.length - 1].id}
          role={transmissions[transmissions.length - 1].role}
          guide={transmissions[transmissions.length - 1].guide}
          guideName={
            guideProfiles[
              transmissions[transmissions.length - 1].guide as keyof typeof guideProfiles
            ]?.name || "Guide"
          }
          text={transmissions[transmissions.length - 1].text}
          isThinking={false}
        />
      ) : (
        <Text style={styles.transmissionPlaceholder}>
          Your transmissions will appear here…
        </Text>
      )}

      {thinking ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color="#C8B4E8" size="small" />
          <Text style={styles.loadingText}>
            The conversation is unfolding…
          </Text>
        </View>
      ) : null}
    </ScrollView>
  </View>

  <Pressable
    style={styles.askButton}
    onPress={() => setPortalVisible(true)}
    accessibilityRole="button"
    accessibilityLabel="Ask or reflect"
  >
    <Text style={styles.askIcon}>✧</Text>
  </Pressable>
</View>

      <Modal
        visible={portalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPortalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>A moment for reflection</Text>
              <Pressable
                onPress={() => setPortalVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Close reflection portal"
              >
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.modalSubtitle}>
              Ask a question. Share what’s on your mind.
            </Text>

            <ReflectionPortal
              isTyping={thinking}
              onSubmitReflection={handleReflection}
            />

            {thinking ? (
              <Text style={styles.processing}>
                Your reflection is being received…
              </Text>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
container: {
  width: "100%",
  height: 76,
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "transparent",
  paddingLeft: 0,
  paddingRight: 150,
  gap: 18,
  overflow: "hidden",
},

  guidesColumn: {
    width: 150,
    flexShrink: 0,
    alignItems: "flex-start",
  },

  orchestrationColumn: {
    flex: 1.05,
    minWidth: 0,
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 10,
    overflow: "visible",
  },

orchestrationText: {
  width: 450,
  maxWidth: 450,
  marginLeft: 20,
  alignSelf: "flex-start",
  textAlign: "center",
  fontSize: 14,
  lineHeight: 20,
  fontWeight: "400",
  letterSpacing: 0.2,
  textShadowOffset: {
    width: 0,
    height: 0,
  },
  textShadowRadius: 14,
},

  orchestrationLoading: {
    width: 320,
    alignItems: "center",
    justifyContent: "center",
  },

transmissionColumn: {
  flex: 1.15,
  minWidth: 0,
  height: "100%",
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  overflow: "hidden",
},

transmissionDisplay: {
  flex: 1,
  minWidth: 0,
  justifyContent: "center",
  alignItems: "flex-end",
},

transmissionScroll: {
  maxHeight: 52,
},

transmissionContent: {
  paddingBottom: 2,
  gap: 4,
},

transmissionPlaceholder: {
  color: "#82798B",
  fontSize: 11,
  marginTop: 5,
  textAlign: "right",
},

askButton: {
  width: 42,
  height: 42,
  flexShrink: 0,
  borderRadius: 21,
  backgroundColor: "#211B2B",
  borderWidth: 1,
  borderColor: "#C9AD70",
  alignItems: "center",
  justifyContent: "center",
  transform: [{ translateY: -5 }],
marginLeft: 8,
},

  sectionLabel: {
    color: "#82798B",
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: "600",
  },

  askIcon: {
    color: "#E2CFFF",
    fontSize: 21,
  },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingVertical: 8,
  },

  loadingText: {
    color: "#B7A9C8",
    fontSize: 11,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.82)",
    justifyContent: "center",
    alignItems: "center",
    padding: 22,
  },

  modalCard: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#111014",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#42364E",
    padding: 20,
    overflow: "hidden",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  modalTitle: {
    color: "#F0E8F7",
    fontSize: 17,
    fontWeight: "500",
  },

  closeButton: {
    color: "#C9B8D9",
    fontSize: 19,
    padding: 6,
  },

  modalSubtitle: {
    color: "#A99BB6",
    fontSize: 13,
    marginTop: 10,
    marginBottom: 18,
  },

  processing: {
    color: "#C8B4E8",
    textAlign: "center",
    fontSize: 12,
    marginTop: 12,
  },
});
