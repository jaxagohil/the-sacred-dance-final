
import React, { useEffect, useState } from "react";

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

import { transmissionAgent } from "../../lib/ai/agents/transmissionAgent";
import { buildAlignmentOSContext } from "../../lib/alignment/buildAlignmentOSContext";

import GuideTransmission from "../guidance/GuideTransmission";
import ReflectionPortal from "../guidance/ReflectionPortal";

import { orchestrateGuidance } from "../../lib/guidance/orchestration/orchestrateGuidance";
import { loadGuideMessages } from "../../lib/guidance/runtime/loadGuideMessages";
import { saveGuideMessage } from "../../lib/guidance/runtime/saveGuideMessage";
import { getUserId } from "../../lib/user";

import { resolveGuidancePacing } from "../../lib/guidance/foreground/guidancePacing";
import { resolveForegroundField } from "../../lib/guidance/foreground/resolveForegroundField";
import { buildGuidanceField } from "../../lib/guidance/runtime/buildGuidanceField";

import { processGuidanceReflection } from "../../db/processGuidanceReflection";
import { enterTransmission } from "../../lib/guidance/enterTransmission";
import { generateGuideTransmission } from "../../lib/guidance/generateGuideTransmission";

export default function LivingSpaceHeader() {
  const contextVersion = useMirrorStore(
    (state) => state.contextVersion
  );

  const alignmentContext = buildAlignmentOSContext();

  const [transmissions, setTransmissions] = useState<any[]>([]);
  const [emergenceMemory, setEmergenceMemory] = useState<any>(null);
  const [activeFieldGuide, setActiveFieldGuide] = useState<any>("cosmic");
  const [orchestrationField, setOrchestrationField] = useState<any>(null);
  const [field, setField] = useState<any>(null);

  const [thinking, setThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [portalVisible, setPortalVisible] = useState(false);

  const guideProfiles = {
    heart: {
      name:
        alignmentContext.userContext?.profile?.guide_1_name || "Heart",
    },
    structure: {
      name:
        alignmentContext.userContext?.profile?.guide_2_name || "Structure",
    },
    cosmic: {
      name:
        alignmentContext.userContext?.profile?.guide_3_name || "Cosmic",
    },
  };

  // Load existing conversation
  useEffect(() => {
    let active = true;

    async function loadMessages() {
      try {
        const userId = await getUserId();
        const messages = await loadGuideMessages(userId);

        if (active) {
          setTransmissions(
            (messages || []).filter(
              (item: any) =>
                item?.role === "user" || item?.role === "guide"
            )
          );
        }
      } catch (error) {
        console.error("DIVINE ORCHESTRATION LOAD ERROR", error);
      }
    }

    loadMessages();

    return () => {
      active = false;
    };
  }, []);

  // Build orchestration field
  useEffect(() => {
    let active = true;

    async function hydrateField() {
      try {
        if (!alignmentContext.mirrorContext) return;

        const result = await orchestrateGuidance({
          alignmentContext,
          selectedGuide: activeFieldGuide || "cosmic",
          resolvedContent: field || {},
          emergenceMemory,
        });

        if (active) {
          setOrchestrationField(result);
        }
      } catch (error) {
        console.error("DIVINE ORCHESTRATION HYDRATION ERROR", error);
      }
    }

    hydrateField();

    return () => {
      active = false;
    };
  }, [
    contextVersion,
    emergenceMemory,
    activeFieldGuide,
    alignmentContext.mirrorContext,
  ]);

  // Build current guidance field
  useEffect(() => {
    let active = true;

    async function buildField() {
      try {
        if (!alignmentContext.mirrorContext) return;

        const foregroundField = resolveForegroundField({
          alignmentContext,
          residue: emergenceMemory,
        });

        const pacing = resolveGuidancePacing(foregroundField);

        const finalField = buildGuidanceField({
          alignmentContext,
          foregroundField,
          pacing,
          activeGuide: activeFieldGuide,
          transmissions,
          emergenceMemory,
          orchestrationField,
        });

        if (active) {
          setField(finalField);
        }
      } catch (error) {
        console.error("DIVINE ORCHESTRATION FIELD ERROR", error);
      }
    }

    buildField();

    return () => {
      active = false;
    };
  }, [
    alignmentContext.mirrorContext,
    alignmentContext.activeLens,
    alignmentContext.language,
    activeFieldGuide,
    transmissions,
    emergenceMemory,
    orchestrationField,
  ]);

  // Submit reflection and generate AI response
  async function handleReflection({ text }: any) {
    if (!text?.trim() || thinking) return;

    setThinking(true);

    try {
      const userId = await getUserId();
      const guide = activeFieldGuide || "cosmic";

      const userMessage = {
        id: Date.now(),
        role: "user",
        guide,
        text: text.trim(),
        createdAt: new Date().toISOString(),
      };

      const updatedMessages = [...transmissions, userMessage];

      setTransmissions(updatedMessages);

      await saveGuideMessage({
        userId,
        guide,
        role: "user",
        content: text.trim(),
        language: alignmentContext.language || "en",
        userField: field,
        orchestrationSnapshot: orchestrationField,
      });

      void processGuidanceReflection({
        userId,
        text: text.trim(),
        guide:
          guide === "heart"
            ? "guide_heart"
            : guide === "structure"
            ? "guide_structure"
            : "guide_cosmic",
        language: alignmentContext.language || "en",
        fieldContext: field,
      });

      const result = await enterTransmission({
        userId,
        guide,
        reflection: text.trim(),
        field: field || {},
        alignmentContext,
        existingMessages: updatedMessages,
      });

      setEmergenceMemory(result?.residue);

      const agentDecision = await transmissionAgent({
        reflection: text.trim(),
        recentMessages: updatedMessages,
        alignmentContext,
        field,
        orchestrationField,
        emergenceMemory: result?.residue,
        selectedGuide: guide,
        language: alignmentContext.language || "en",
      });

      const speakers = agentDecision?.speakers || [];

      for (const speaker of speakers) {
        const speakerGuide = speaker?.guide;

        if (!["heart", "structure", "cosmic"].includes(speakerGuide)) {
          continue;
        }

        const response = await generateGuideTransmission({
          guide: speakerGuide,
          reflection: text.trim(),
          recentMessages: updatedMessages,
          alignmentContext,
          field,
          orchestrationField,
          transmissionDecision: agentDecision,
          emergenceMemory: result?.residue,
          language: alignmentContext.language || "en",
        });

        if (!response?.text) continue;

        const guideMessage = {
          id: `guide_${Date.now()}_${speakerGuide}`,
          role: "guide",
          guide: speakerGuide,
          text: response.text,
          createdAt: new Date().toISOString(),
        };

        setTransmissions((previous) => [...previous, guideMessage]);

        await saveGuideMessage({
          userId,
          guide: speakerGuide,
          role: "guide",
          content: response.text,
          language: alignmentContext.language || "en",
          userField: field,
          orchestrationSnapshot: orchestrationField,
        });
      }

      setPortalVisible(false);
    } catch (error) {
      console.error("DIVINE ORCHESTRATION REFLECTION ERROR", error);
    } finally {
      setThinking(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleArea}>
          <Text style={styles.eyebrow}>✧ DIVINE ORCHESTRATION</Text>
        </View>

        <Pressable
          style={styles.askButton}
          onPress={() => setPortalVisible(true)}
        >
          <Text style={styles.askIcon}>✧</Text>
        </Pressable>
      </View>

{transmissions.length > 0 && (
  <View style={styles.conversation}>

        <ScrollView
          style={styles.messages}
          contentContainerStyle={styles.messageContent}
          showsVerticalScrollIndicator={false}
        >
          {transmissions.map((item: any, index: number) => (
            <GuideTransmission
              key={item?.id || index}
              role={item?.role}
              guide={item?.guide}
              guideName={
                guideProfiles[item?.guide as keyof typeof guideProfiles]?.name ||
                "Guide"
              }
              text={item?.text || item?.content || ""}
              isThinking={false}
            />
          ))}

          {thinking && (
            <View style={styles.thinking}>
              <ActivityIndicator color="#C8B4E8" size="small" />
              <Text style={styles.thinkingText}>
                The conversation is unfolding…
              </Text>
            </View>
          )}
        </ScrollView>
  </View>
)}

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

              <Pressable onPress={() => setPortalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.modalSubtitle}>
              Ask a question. Share what's on your mind.
            </Text>

            <ReflectionPortal
              isTyping={isTyping}
              onSubmitReflection={handleReflection}
            />

            {thinking && (
              <Text style={styles.processing}>
                Your reflection is being received…
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
container: {
  width: "100%",
  height: 32,
  backgroundColor: "#030405",
  paddingHorizontal: 18,
  paddingVertical: 0,
  justifyContent: "center",
},
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 2,
  },
  titleArea: {
    flex: 1,
  },
  eyebrow: {
    color: "#C7B5E5",
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "600",
  },
askButton: {
  width: 28,
  height: 28,
  borderRadius: 14,
  backgroundColor: "#211B2B",
  borderWidth: 1,
  borderColor: "#514064",
  alignItems: "center",
  justifyContent: "center",
},
  askIcon: {
    color: "#E2CFFF",
    fontSize: 21,
  },
conversation: {
  minHeight: 0,
  maxHeight: 180,
  marginTop: 0,
  overflow: "hidden",
},
  messages: {
    flex: 1,
    zIndex: 1,
  },
  messageContent: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    flexGrow: 1,
  },
  thinking: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
  },
  thinkingText: {
    color: "#B7A9C8",
    fontSize: 12,
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
