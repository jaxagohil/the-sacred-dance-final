
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

import {
  discoverConsciousDesire,
  getCreationContext,
} from "../../../../lib/consciousCreating";

import { getUserId } from "../../../../lib/user";
import { supabase } from "../../../../services/supabase";

type Props = {
  intentionId: string;
};

type CreationPattern = {
  id: string;
  name: string;
  leftPole: string;
  rightPole: string;
  position: number;
};

type DiscoverProposal = {
  desire?: string;
  patternReflection?: string;
};

const GOLD = "#C9AD70";
const MUTED = "#AAA2B6";

export default function StageDiscover({ intentionId }: Props) {
  const { width } = useWindowDimensions();
  const wide = width >= 650;

  const [consciousDesire, setConsciousDesire] = useState("");
  const [patternReflection, setPatternReflection] = useState("");
  const [creationPatterns, setCreationPatterns] =
    useState<CreationPattern[]>([]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --------------------------------------------------
  // REFRESH CONSCIOUS DESIRE
  // --------------------------------------------------

  const refreshConsciousDesire = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    try {
      const userId = await getUserId();
      if (!userId) return;

      const context = await getCreationContext({
        userId,
        intentionId,
      });

      console.log("DISCOVER CONTEXT:", context);
console.log("LIVING FIELD:", context.livingField);
console.log(
  "CREATION PATTERNS:",
  context.livingField?.creationPatterns
);

      const proposal = await discoverConsciousDesire({
        context,
      }) as DiscoverProposal | null;

      if (!proposal) return;

      // Show the new proposal in the editor.
      setConsciousDesire(proposal.desire || "");
      setPatternReflection(proposal.patternReflection || "");

      // Preserve the user's confirmed response separately.
      const { data: existing, error: findError } =
        await supabase
          .from("sovereign_intention_steps")
          .select("id")
          .eq("intention_id", intentionId)
          .eq("step", "discover")
          .maybeSingle();

      if (findError) throw findError;

      if (existing) {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .update({ ai_response: proposal })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .insert({
            intention_id: intentionId,
            step: "discover",
            response: { consciousDesire: "" },
            ai_response: proposal,
          });

        if (error) throw error;
      }

      console.log(
  "REFRESH PATTERNS:",
  context.livingField?.creationPatterns
);

      // Refresh the patterns from the same context.
      setCreationPatterns(
        Array.isArray(context.livingField?.creationPatterns)
          ? context.livingField.creationPatterns as CreationPattern[]
          : []
      );
    } catch (error) {
      console.error("DISCOVER REFRESH ERROR:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [intentionId, isRefreshing]);

  // --------------------------------------------------
  // LOAD DISCOVER
  // --------------------------------------------------

  const loadDiscover = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("sovereign_intention_steps")
        .select("id, response, ai_response")
        .eq("intention_id", intentionId)
        .eq("step", "discover")
        .maybeSingle();

      if (error) throw error;

      const response =
        data?.response &&
        typeof data.response === "object"
          ? data.response as { consciousDesire?: string }
          : {};

      const aiResponse =
        data?.ai_response &&
        typeof data.ai_response === "object"
          ? data.ai_response as DiscoverProposal
          : {};

      setConsciousDesire(
        response.consciousDesire || aiResponse.desire || ""
      );

      setPatternReflection(
        aiResponse.patternReflection || ""
      );

      const userId = await getUserId();
      if (!userId) return;

      const context = await getCreationContext({
        userId,
        intentionId,
      });

      setCreationPatterns(
        Array.isArray(context.livingField?.creationPatterns)
          ? context.livingField.creationPatterns as CreationPattern[]
          : []
      );

      if (!aiResponse.patternReflection?.trim()) {
        await refreshConsciousDesire();
      }
    } catch (error) {
      console.error("DISCOVER LOAD ERROR:", error);
    }
  }, [intentionId, refreshConsciousDesire]);

  // --------------------------------------------------
  // SAVE CONFIRMED CONSCIOUS DESIRE
  // --------------------------------------------------

  const saveConsciousDesire = async () => {
    setIsSaving(true);

    try {
      const { data: existing, error: findError } =
        await supabase
          .from("sovereign_intention_steps")
          .select("id")
          .eq("intention_id", intentionId)
          .eq("step", "discover")
          .maybeSingle();

      if (findError) throw findError;

      const response = {
        consciousDesire: consciousDesire.trim(),
      };

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
            step: "discover",
            response,
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error("DISCOVER SAVE ERROR:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    setConsciousDesire("");
    setPatternReflection("");
    setCreationPatterns([]);

    void loadDiscover();
  }, [loadDiscover]);

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[
        styles.columns,
        !wide && styles.stacked,
      ]}>

        {/* LEFT: CONSCIOUS DESIRE */}

        <View style={styles.desireColumn}>
          <View style={styles.questionRow}>

            <Pressable
              onPress={() => void refreshConsciousDesire()}
              disabled={isRefreshing}
              style={styles.refreshButton}
              accessibilityLabel="Refresh conscious desire"
            >
              {isRefreshing ? (
                <ActivityIndicator size="small" color={GOLD} />
              ) : (
                <Text style={styles.refreshText}>↻ Refresh</Text>
              )}
            </Pressable>
          </View>

          <TextInput
            value={consciousDesire}
            onChangeText={setConsciousDesire}
            onBlur={() => void saveConsciousDesire()}
            multiline
            placeholder="Your conscious desire..."
            placeholderTextColor="#77746F"
            style={styles.input}
          />

          {isSaving && (
            <Text style={styles.saveStatus}>Saving...</Text>
          )}
        </View>

        {/* RIGHT: PATTERNS AND REFLECTION */}

        <View style={styles.patternColumn}>
          {creationPatterns.map((pattern) => {
            const position = Math.max(
              0,
              Math.min(1, pattern.position)
            );

            return (
              <View key={pattern.id} style={styles.pattern}>
                <View style={styles.poles}>
                  <Text style={styles.poleLabel}>
                    {pattern.leftPole}
                  </Text>

                  <Text style={styles.poleLabel}>
                    {pattern.rightPole}
                  </Text>
                </View>

                <View style={styles.track}>
                  <View
                    style={[
                      styles.dot,
                      { left: `${position * 100}%` },
                    ]}
                  />
                </View>
              </View>
            );
          })}

          {patternReflection ? (
            <Text style={styles.reflection}>
              {patternReflection}
            </Text>
          ) : null}
        </View>

      </View>
    </ScrollView>
  );
}

// --------------------------------------------------
// STYLES
// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },

  content: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  columns: {
    flex: 1,
    flexDirection: "row",
    gap: 22,
  },

  stacked: {
    flexDirection: "column",
  },

  desireColumn: {
    flex: 1,
    minWidth: 0,
  },

  questionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  question: {
    flex: 1,
    color: "#E4C58B",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
  },

  refreshButton: {
    paddingVertical: 3,
    paddingHorizontal: 2,
  },

  refreshText: {
    color: GOLD,
    fontSize: 10,
  },

  input: {
    color: "#EEE5D7",
    fontSize: 12,
    lineHeight: 20,
    minHeight: 100,
    padding: 0,
    marginTop: 12,
    textAlignVertical: "top",
  },

  saveStatus: {
    color: MUTED,
    fontSize: 9,
    marginTop: 4,
  },

  patternColumn: {
    flex: 1,
    minWidth: 0,
    gap: 15,
  },

  pattern: {
    gap: 5,
  },

  poles: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },

  poleLabel: {
    color: MUTED,
    fontSize: 9,
    flexShrink: 1,
  },

  track: {
    height: 2,
    backgroundColor: "#51483A",
    justifyContent: "center",
  },

  dot: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: GOLD,
    marginLeft: -3,
  },

  reflection: {
    color: "#81796E",
    fontSize: 10,
    lineHeight: 16,
    marginTop: 3,
  },
});
