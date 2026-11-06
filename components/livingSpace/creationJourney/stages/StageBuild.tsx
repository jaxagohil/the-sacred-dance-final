
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
  const [isSaving, setIsSaving] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    let active = true;

    const loadConversation = async () => {
      setConversation([]);
      setMessage("");

      if (!intentionId) return;

      try {
        const { data, error } = await supabase
          .from("sovereign_intention_steps")
          .select("response")
          .eq("intention_id", intentionId)
          .eq("step", "build")
          .maybeSingle();

        if (error) throw error;
        if (!active) return;

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

    if (!intentionId || !trimmed || isSaving) return;

    setIsSaving(true);

    try {
      const nextConversation: ConversationMessage[] = [
        ...conversation,
        { role: "user", content: trimmed },
      ];

      const { data: existing, error: findError } = await supabase
        .from("sovereign_intention_steps")
        .select("id")
        .eq("intention_id", intentionId)
        .eq("step", "build")
        .maybeSingle();

      if (findError) throw findError;

      const response = { conversation: nextConversation };

      if (existing) {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .update({ response })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .insert({
            intention_id: intentionId,
            step: "build",
            response,
          });

        if (error) throw error;
      }

      setConversation(nextConversation);
      setMessage("");
    } catch (error) {
      console.error("BUILD SAVE ERROR:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.workspace}>
      {/* LEFT — IDEATION INPUT */}
      <View style={styles.inputPanel}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          multiline
          placeholder="Let's ideate..."
          placeholderTextColor="#77746F"
          style={styles.input}
          editable={!isSaving}
          textAlignVertical="top"
        />

        <Pressable
          onPress={() => void sendMessage()}
          disabled={!message.trim() || isSaving}
          style={[
            styles.sendButton,
            (!message.trim() || isSaving) && styles.disabled,
          ]}
        >
          <Text style={styles.sendText}>
            {isSaving ? "…" : "↑"}
          </Text>
        </Pressable>
      </View>

      {/* RIGHT — IDEATION CONVERSATION */}
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
          {conversation.length === 0 && (
            <View style={styles.welcomeContainer}>
            </View>
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
                    : styles.responseText
                }
              >
                {item.content}
              </Text>
            </View>
          ))}

          {isSaving && (
            <Text style={styles.typing}>Saving...</Text>
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

  welcomeContainer: {
    gap: 5,
  },

  welcomeTitle: {
    color: "#C9AD70",
    fontFamily: Fonts.light,
    fontSize: 9,
    letterSpacing: 1.5,
  },

  welcome: {
    color: Colors.mutedText,
    fontFamily: Fonts.light,
    fontSize: 10,
    lineHeight: 16,
  },

  welcomePrompt: {
    color: "#C9AD70",
    fontFamily: Fonts.light,
    fontSize: 9,
    fontStyle: "italic",
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

  responseText: {
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
