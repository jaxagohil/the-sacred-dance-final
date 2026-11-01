
import React, { useEffect, useRef, useState } from "react";

import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { Colors, Fonts } from "../../../../constants/theme";
import { getUserId } from "../../../../lib/user";
import { supabase } from "../../../../services/supabase";

import { chooseNextMove } from "../../../../lib/consciousCreating/agents/mirror/chooseNextMove";
import type { NextMove } from "../../../../lib/consciousCreating/agents/mirror/generateNextMoves";
import { mirrorBuild } from "../../../../lib/consciousCreating/agents/mirror/mirrorBuild";

type ConversationMessage = {
  role: "user" | "mirror";
  content: string;
};

type BuildStageProps = {
  intentionId: string | null;
  onOptionsChange: (options: NextMove[]) => void;
  onCreationCreated: () => void;
};

export default function BuildStage({
  intentionId,
  onOptionsChange,
  onCreationCreated,
}: BuildStageProps) {
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [message, setMessage] = useState("");
  const [nextMoves, setNextMoves] = useState<NextMove[]>([]);
  const [selectedNextMove, setSelectedNextMove] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isChoosing, setIsChoosing] = useState(false);

  const conversationScrollRef = useRef<ScrollView>(null);

  // --------------------------------------------------
  // LOAD EXISTING BUILD CONVERSATION
  // --------------------------------------------------

  useEffect(() => {
    const loadBuildStep = async () => {
      if (!intentionId) {
        setConversation([]);
        setNextMoves([]);
        onOptionsChange([]);
        setSelectedNextMove(null);
        setMessage("");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("sovereign_intention_steps")
          .select("response, ai_response")
          .eq("intention_id", intentionId)
          .eq("step", "build")
          .maybeSingle();

        if (error) {
          console.error("❌ SOVEREIGN BUILD LOAD ERROR:", error);
          return;
        }

        if (!data) {
          setConversation([]);
          setNextMoves([]);
          onOptionsChange([]);
          setSelectedNextMove(null);
          return;
        }

        const response =
          typeof data.response === "object" && data.response !== null
            ? (data.response as Record<string, unknown>)
            : {};

        const aiResponse =
          typeof data.ai_response === "object" && data.ai_response !== null
            ? (data.ai_response as Record<string, unknown>)
            : {};

        const loadedConversation = Array.isArray(response.conversation)
          ? response.conversation.filter(
              (item): item is ConversationMessage =>
                typeof item === "object" &&
                item !== null &&
                ((item as any).role === "user" ||
                  (item as any).role === "mirror") &&
                typeof (item as any).content === "string"
            )
          : [];

        const loadedNextMoves = Array.isArray(aiResponse.nextMoves)
          ? (aiResponse.nextMoves as NextMove[])
          : [];

        setConversation(loadedConversation);
        setNextMoves(loadedNextMoves);
        onOptionsChange(loadedNextMoves);
        setSelectedNextMove(null);
      } catch (error) {
        console.error("❌ SOVEREIGN BUILD LOAD ERROR:", error);

        setConversation([]);
        setNextMoves([]);
        onOptionsChange([]);
        setSelectedNextMove(null);
      }
    };

    void loadBuildStep();
  }, [intentionId, onOptionsChange]);

  // --------------------------------------------------
  // SEND MESSAGE TO MIRROR
  // --------------------------------------------------

  const sendMessage = async () => {
    const trimmed = message.trim();

    if (!intentionId || !trimmed || isSending) {
      return;
    }

    try {
      setIsSending(true);

      const userId = await getUserId();

      if (!userId) {
        return;
      }

      const nextConversation = [
        ...conversation,
        {
          role: "user" as const,
          content: trimmed,
        },
      ];

      setConversation(nextConversation);
      setMessage("");

      const result = await mirrorBuild({
        userId,
        intentionId,
        message: trimmed,
      });

      const mirrorConversation = [
        ...nextConversation,
        {
          role: "mirror" as const,
          content: result.message,
        },
      ];

      setConversation(mirrorConversation);

      const generatedMoves = result.nextMoves || [];

      setNextMoves(generatedMoves);
      onOptionsChange(generatedMoves);

      setSelectedNextMove(null);
    } catch (error) {
      console.error("❌ SOVEREIGN MIRROR BUILD ERROR:", error);
    } finally {
      setIsSending(false);
    }
  };

  // --------------------------------------------------
  // CHOOSE ONE NEXT MOVE
  // --------------------------------------------------

  const handleNextMove = async (move: NextMove) => {
    if (!intentionId || isChoosing) {
      return;
    }

    try {
      setIsChoosing(true);
      setSelectedNextMove(move.title);

      console.log("🔎 CHOOSE NEXT MOVE INPUT:", {
        intentionId,
        move,
      });

      const result = await chooseNextMove({
        intentionId,
        move,
      });

      console.log("✨ CREATION CREATED:", result);

      onCreationCreated();
    } catch (error) {
      console.error("❌ CHOOSE NEXT MOVE ERROR:", error);
      setSelectedNextMove(null);
    } finally {
      setIsChoosing(false);
    }
  };

  // --------------------------------------------------
  // PAUSE
  // --------------------------------------------------

  const handlePause = () => {
    setSelectedNextMove("DO NOTHING FOR NOW");
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <View style={styles.buildWorkspace}>

      {/* MIRROR CONVERSATION */}

      <ScrollView
        ref={conversationScrollRef}
        style={styles.buildConversation}
        onContentSizeChange={() => {
          requestAnimationFrame(() => {
            conversationScrollRef.current?.scrollToEnd({
              animated: true,
            });
          });
        }}
      >
        {conversation.map((item, index) => {
          const isUser = item.role === "user";

          return (
            <View
              key={`${item.role}-${index}`}
              style={[
                styles.chatRow,
                isUser ? styles.chatRowUser : styles.chatRowMirror,
              ]}
            >
              <View
                style={[
                  styles.chatBubble,
                  isUser ? styles.chatBubbleUser : styles.chatBubbleMirror,
                ]}
              >
                <Text
                  style={
                    isUser ? styles.chatTextUser : styles.chatTextMirror
                  }
                >
                  {item.content}
                </Text>
              </View>
            </View>
          );
        })}

        {isSending && (
          <View style={[styles.chatRow, styles.chatRowMirror]}>
            <View style={[styles.chatBubble, styles.chatBubbleMirror]}>
              <Text style={styles.chatSender}>MIRROR</Text>
              <Text style={styles.chatTextMirror}>...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* MESSAGE INPUT */}

      <View style={styles.buildInputRow}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          multiline
          placeholder="Talk to me about this creation..."
          placeholderTextColor="#77746F"
          style={styles.buildMessageInput}
          editable={!isSending}
          onSubmitEditing={() => {
            void sendMessage();
          }}
        />

        <Pressable
          onPress={() => {
            void sendMessage();
          }}
          disabled={!message.trim() || isSending}
          style={[
            styles.buildSendButton,
            (!message.trim() || isSending) &&
              styles.buildSendButtonDisabled,
          ]}
        >
          <Text style={styles.buildSendButtonText}>
            {isSending ? "…" : "↑"}
          </Text>
        </Pressable>
      </View>

      {/* DYNAMIC NEXT MOVES */}

      {nextMoves.length > 0 && (
        <View style={styles.nextMovesSection}>
          <View style={styles.nextMovesList}>
            {nextMoves.map((move, index) => {
              const selected = selectedNextMove === move.title;

              return (
                <Pressable
                  key={`${move.title}-${index}`}
                  onPress={() => {
                    void handleNextMove(move);
                  }}
                  disabled={isChoosing}
                  style={[
                    styles.nextMoveButton,
                    selected && styles.nextMoveButtonSelected,
                  ]}
                >
                  <Text style={styles.nextMoveTitle}>
                    {move.title}
                  </Text>
                </Pressable>
              );
            })}

            {/* DO NOTHING IS ALWAYS A HUMAN CHOICE */}

            <Pressable
              onPress={handlePause}
              style={[
                styles.pauseMoveButton,
                selectedNextMove === "DO NOTHING FOR NOW" &&
                  styles.nextMoveButtonSelected,
              ]}
            >
              <Text style={styles.pauseMoveTitle}>
                DO NOTHING FOR NOW
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buildWorkspace: {
    width: "100%",
    flex: 1,
    minHeight: 0,
    gap: 12,
  },

  mirrorWelcomeText: {
    color: Colors.mutedText,
    fontFamily: Fonts.light,
    fontSize: 11,
    lineHeight: 19,
  },

  buildConversation: {
    flex: 1,
    minHeight: 80,
    width: "100%",
  },

  chatRow: {
    width: "100%",
    flexDirection: "row",
  },

  chatRowUser: {
    justifyContent: "flex-end",
    paddingRight: 14,
  },

  chatRowMirror: {
    justifyContent: "flex-start",
  },

  chatBubble: {
    maxWidth: "82%",
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 11,
  },

  chatBubbleMirror: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },

  chatBubbleUser: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  chatSender: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 7,
    letterSpacing: 1.3,
    marginBottom: 5,
  },

  chatTextMirror: {
    color: Colors.mutedText,
    fontFamily: Fonts.light,
    fontSize: 11,
    lineHeight: 17,
  },

  chatTextUser: {
    color: Colors.white,
    fontFamily: Fonts.light,
    fontSize: 11,
    lineHeight: 17,
  },

  buildInputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },

  buildMessageInput: {
    flex: 1,
    minHeight: 38,
    maxHeight: 60,
    paddingVertical: 0,
    paddingHorizontal: 13,
    borderRadius: 13,
    backgroundColor: "#EEECE6",
    color: "#2A2927",
    fontFamily: Fonts.light,
    fontSize: 11,
    lineHeight: 17,
    textAlignVertical: "top",
  },

  buildSendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  buildSendButtonDisabled: {
    opacity: 0.35,
  },

  buildSendButtonText: {
    color: Colors.white,
    fontFamily: Fonts.light,
    fontSize: 16,
  },

  nextMovesSection: {
    paddingTop: 20,
  },

  nextMovesList: {
    flexDirection: "row",
    gap: 7,
    width: "100%",
  },

  nextMoveButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 58,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: "rgba(201,168,78,0.14)",
  },

  nextMoveButtonSelected: {
    backgroundColor: "rgba(95,158,114,0.15)",
    borderColor: "rgba(95,158,114,0.42)",
  },

  nextMoveTitle: {
    color: Colors.white,
    fontFamily: Fonts.light,
    fontSize: 9,
    lineHeight: 13,
    textAlign: "center",
  },

  pauseMoveButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 58,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor: "transparent",
  },

  pauseMoveTitle: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 8,
    letterSpacing: 1,
    textAlign: "center",
  },
});
