
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
import { mirrorBuild } from "../../../../lib/consciousCreating/agents/mirror/mirrorBuild";
import { getUserId } from "../../../../lib/user";
import { supabase } from "../../../../services/supabase";

type ConversationMessage = {
  role: "user" | "mirror";
  content: string;
};

type Props = {
  intentionId: string | null;
};

export default function BuildStage({ intentionId }: Props) {
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    let active = true;

    const loadConversation = async () => {
      if (!intentionId) {
        setConversation([]);
        setMessage("");
        return;
      }

      setConversation([]);
      setMessage("");

      try {
        const { data, error } = await supabase
          .from("sovereign_intention_steps")
          .select("response")
          .eq("intention_id", intentionId)
          .eq("step", "build")
          .maybeSingle();

        if (!active) return;
        if (error) throw error;

        const response =
          typeof data?.response === "object" && data.response !== null
            ? (data.response as Record<string, unknown>)
            : {};

        const loaded = Array.isArray(response.conversation)
          ? response.conversation.filter(
              (item): item is ConversationMessage =>
                typeof item === "object" &&
                item !== null &&
                ((item as any).role === "user" ||
                  (item as any).role === "mirror") &&
                typeof (item as any).content === "string"
            )
          : [];

        setConversation(loaded);
      } catch (error) {
        console.error("BUILD LOAD ERROR:", error);
      }
    };

    void loadConversation();

    return () => {
      active = false;
    };
  }, [intentionId]);

  const sendMessage = async () => {
    const trimmed = message.trim();

    if (!intentionId || !trimmed || isSending) return;

    try {
      setIsSending(true);

      const userId = await getUserId();
      if (!userId) return;

      const nextConversation: ConversationMessage[] = [
        ...conversation,
        { role: "user", content: trimmed },
      ];

      setConversation(nextConversation);
      setMessage("");

      const result = await mirrorBuild({
        userId,
        intentionId,
        message: trimmed,
      });

      setConversation([
        ...nextConversation,
        { role: "mirror", content: result.message },
      ]);
    } catch (error) {
      console.error("MIRROR BUILD ERROR:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.workspace}>

      {/* LEFT — USER INPUT */}
      <View style={styles.inputPanel}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          multiline
          placeholder="What would you like to create?"
          placeholderTextColor="#77746F"
          style={styles.input}
          editable={!isSending}
          textAlignVertical="top"
        />

        <Pressable
          onPress={() => void sendMessage()}
          disabled={!message.trim() || isSending}
          style={[
            styles.sendButton,
            (!message.trim() || isSending) && styles.disabled,
          ]}
        >
          <Text style={styles.sendText}>
            {isSending ? "…" : "↑"}
          </Text>
        </Pressable>
      </View>

      {/* RIGHT — MIRROR CONVERSATION */}
      <View style={styles.conversationPanel}>
        <ScrollView
          ref={scrollRef}
          style={styles.conversation}
          contentContainerStyle={styles.conversationContent}
          showsVerticalScrollIndicator
          onContentSizeChange={() => {
            requestAnimationFrame(() => {
              scrollRef.current?.scrollToEnd({ animated: true });
            });
          }}
        >
          {conversation.length === 0 && !isSending && (
            <Text style={styles.welcome}>
              Your conversation will appear here.
            </Text>
          )}

          {conversation.map((item, index) => (
            <View
              key={`${item.role}-${index}`}
              style={[
                styles.messageRow,
                item.role === "user" && styles.userRow,
              ]}
            >
              <Text
                style={
                  item.role === "user"
                    ? styles.userText
                    : styles.mirrorText
                }
              >
                {item.content}
              </Text>
            </View>
          ))}

          {isSending && (
            <Text style={styles.typing}>
              Mirror is reflecting...
            </Text>
          )}
        </ScrollView>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
workspace: {
  width: "100%",
  height: 90,
  minHeight: 90,
  maxHeight: 90,
  flexGrow: 0,
  flexShrink: 0,
  flexDirection: "row",
  gap: 12,
},

inputPanel: {
  flex: 0.85,
  height: "100%",
    minWidth: 0,
    minHeight: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "rgba(201,173,112,0.24)",
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.018)",
    gap: 6,
  },

  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 40,
    maxHeight: 100,
    padding: 2,
    color: "#EEECE6",
    fontFamily: Fonts.light,
    fontSize: 11,
    lineHeight: 17,
  },

  sendButton: {
    width: 29,
    height: 29,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(201,173,112,0.35)",
    backgroundColor: "rgba(201,173,112,0.08)",
  },

  sendText: {
    color: "#C9AD70",
    fontSize: 17,
  },

  disabled: {
    opacity: 0.35,
  },

conversationPanel: {
  flex: 1.5,
  height: "100%",
    minWidth: 0,
    minHeight: 0,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "rgba(201,173,112,0.18)",
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.012)",
  },

  conversation: {
    flex: 1,
    minHeight: 0,
  },

  conversationContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
    gap: 8,
  },

  welcome: {
    color: Colors.mutedText,
    fontFamily: Fonts.light,
    fontSize: 10,
    lineHeight: 16,
  },

  messageRow: {
    alignSelf: "flex-start",
    maxWidth: "95%",
  },

  userRow: {
    alignSelf: "flex-end",
    padding: 6,
    borderRadius: 7,
    backgroundColor: "rgba(201,173,112,0.07)",
  },

  userText: {
    color: Colors.white,
    fontFamily: Fonts.light,
    fontSize: 10,
    lineHeight: 15,
  },

  mirrorText: {
    color: "#D8D2C8",
    fontFamily: Fonts.light,
    fontSize: 10,
    lineHeight: 15,
  },

  typing: {
    color: Colors.mutedText,
    fontSize: 9,
    fontStyle: "italic",
  },
});
