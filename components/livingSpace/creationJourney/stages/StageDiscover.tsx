
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Feather } from "@expo/vector-icons";

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
  const [consciousDesire, setConsciousDesire] = useState("");
  const [patternReflection, setPatternReflection] = useState("");
  const [creationPatterns, setCreationPatterns] =
    useState<CreationPattern[]>([]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --------------------------------------------------
  // REFRESH
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

      const proposal = await discoverConsciousDesire({
        context,
      }) as DiscoverProposal | null;

      if (!proposal) return;

      setConsciousDesire(proposal.desire || "");
      setPatternReflection(proposal.patternReflection || "");

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
  // LOAD
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
        data?.response && typeof data.response === "object"
          ? data.response as { consciousDesire?: string }
          : {};

      const aiResponse =
        data?.ai_response && typeof data.ai_response === "object"
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
  // SAVE
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

  // --------------------------------------------------
  // INITIALISE
  // --------------------------------------------------

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
    <View style={styles.container}>

      {/* LEFT GROUP: DESIRE + PATTERNS */}

      <View style={styles.portalGroup}>
        <View style={styles.portalColumns}>

          {/* CONSCIOUS DESIRE */}

          <View style={styles.desireColumn}>
            <View style={styles.desireBox}>

              <View style={styles.desireHeader}>

                <Pressable
                  onPress={() => void refreshConsciousDesire()}
                  disabled={isRefreshing}
                  style={styles.refreshButton}
                  accessibilityLabel="Refresh conscious desire"
                >
                  {isRefreshing ? (
                    <ActivityIndicator
                      size="small"
                      color={GOLD}
                    />
                  ) : (
                    <Feather
                      name="refresh-cw"
                      size={13}
                      color={GOLD}
                    />
                  )}
                </Pressable>
              </View>

              <TextInput
                value={consciousDesire}
                onChangeText={setConsciousDesire}
                onBlur={() => void saveConsciousDesire()}
                multiline
                scrollEnabled
                placeholder="Your conscious desire..."
                placeholderTextColor="#77746F"
                style={styles.input}
              />

              {isSaving && (
                <Text style={styles.saveStatus}>
                  Saving...
                </Text>
              )}
            </View>
          </View>

          {/* CREATION PATTERNS */}

          <View style={styles.patternColumn}>
            <View style={styles.patternBox}>
              {creationPatterns.slice(0, 3).map((pattern) => {
                const position = Math.max(
                  0,
                  Math.min(1, pattern.position)
                );

                return (
                  <View
                    key={pattern.id}
                    style={styles.pattern}
                  >
                    <View style={styles.poles}>
                      <Text
                        style={styles.poleLabel}
                        numberOfLines={1}
                      >
                        {pattern.leftPole}
                      </Text>

                      <Text
                        style={styles.poleLabel}
                        numberOfLines={1}
                      >
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
            </View>
          </View>

        </View>
      </View>

      {/* AI REFLECTION */}

      <View style={styles.reflectionColumn}>
        <View style={styles.reflectionBox}>
          {patternReflection ? (
            <ScrollView
              style={styles.reflectionScroll}
              contentContainerStyle={styles.reflectionContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.reflection}>
                {patternReflection}
              </Text>
            </ScrollView>
          ) : (
            <Text style={styles.reflectionPlaceholder}>
              Your AI reflection will appear here.
            </Text>
          )}
        </View>
      </View>

    </View>
  );
}

// --------------------------------------------------
// STYLES
// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    minWidth: 0,
    minHeight: 0,
    flexDirection: "row",
    gap: 6,
  },

  // LEFT GROUP — 2.2 parts

  portalGroup: {
    flex: 2.2,
    minWidth: 0,
    minHeight: 0,
  },

  portalColumns: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    flexDirection: "row",
    gap: 0,
  },

  // CONSCIOUS DESIRE — wider part

desireColumn: {
  flex: 2.15,
  minWidth: 0,
  minHeight: 0,
},

desireBox: {
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  padding: 10,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "rgba(201,173,112,0.22)",
  backgroundColor: "#08090A",
},

  desireHeader: {
    height: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },

  boxLabel: {
    color: "#81796E",
    fontSize: 8,
    letterSpacing: 1.2,
  },

  refreshButton: {
    width: 22,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    flex: 1,
    minHeight: 0,
    color: "#EEECE6",
    fontSize: 11,
    lineHeight: 17,
    padding: 0,
    margin: 0,
    textAlignVertical: "top",
  },

  saveStatus: {
    color: MUTED,
    fontSize: 9,
    marginTop: 3,
  },

  // PATTERNS — narrower part

patternColumn: {
  flex: 0.7,
  minWidth: 0,
  minHeight: 0,
},

  patternBox: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    paddingHorizontal: 7,
    paddingVertical: 9,
    borderColor: "rgba(201,173,112,0.16)",
    backgroundColor: "#08090A",
    justifyContent: "space-evenly",
    gap: 7,
  },

  pattern: {
    gap: 6,
  },

  poles: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 3,
  },

  poleLabel: {
    color: MUTED,
    fontSize: 8,
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

  // AI REFLECTION — wider and shifted left

  reflectionColumn: {
    flex: 1.3,
    minWidth: 0,
    minHeight: 0,
  },

  reflectionBox: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(201,173,112,0.22)",
    backgroundColor: "#08090A",
  },

  reflectionScroll: {
    flex: 1,
    minHeight: 0,
  },

  reflectionContent: {
    flexGrow: 1,
  },

  reflection: {
    color: MUTED,
    fontSize: 10,
    lineHeight: 15,
  },

  reflectionPlaceholder: {
    color: "#77746F",
    fontSize: 10,
    lineHeight: 15,
  },
});
