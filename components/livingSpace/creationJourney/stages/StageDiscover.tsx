
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { processCreationDiscover } from "../../../../db/processCreationDiscover";
import { sovereignI } from "../../../../lib/sovereignIOrchestrator/core/sovereignI";
import { supabase } from "../../../../services/supabase";

type Props = {
  intentionId: string;
};

type Pattern = {
  id?: string;
  name?: string;
};

const GOLD = "#C9AD70";
const MUTED = "#AAA2B6";

export default function StageDiscover({ intentionId }: Props) {
  const [consciousDesire, setConsciousDesire] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [patterns, setPatterns] = useState<Pattern[]>([]);

  // LOAD SAVED CONSCIOUS DESIRE AND PROCESSED PATTERNS
  useEffect(() => {
    let active = true;

    const loadDiscover = async () => {
      setConsciousDesire("");
      setPatterns([]);

      try {
        const { data, error } = await supabase
          .from("sovereign_intention_steps")
          .select("response")
          .eq("intention_id", intentionId)
          .eq("step", "discover")
          .maybeSingle();

        if (error) throw error;
        if (!active) return;

        const response =
          data?.response &&
          typeof data.response === "object"
            ? data.response as {
                consciousDesire?: string;
                patterns?: Pattern[];
              }
            : {};

        setConsciousDesire(
          typeof response.consciousDesire === "string"
            ? response.consciousDesire
            : ""
        );

        if (Array.isArray(response.patterns)) {
          setPatterns(response.patterns);
        }
      } catch (error) {
        console.error("DISCOVER LOAD ERROR:", error);
      }
    };

    void loadDiscover();

    return () => {
      active = false;
    };
  }, [intentionId]);

  // SAVE CONSCIOUS DESIRE
  const saveConsciousDesire = async () => {
    if (!intentionId) return;

    const trimmedDesire = consciousDesire.trim();

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
        consciousDesire: trimmedDesire,
      };

      if (existing) {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .update({ response })
          .eq("id", existing.id);

        if (error) throw error;
      } else if (trimmedDesire) {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .insert({
            intention_id: intentionId,
            step: "discover",
            response,
          });

        if (error) throw error;
      }

      // PROCESS THE DESIRE THROUGH THE EXISTING PIPELINE
      if (!trimmedDesire) {
        setPatterns([]);
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("User not authenticated.");

      setIsProcessing(true);

      const result = await processCreationDiscover({
        userId: user.id,
        intentionId,
        consciousDesire: trimmedDesire,
      });

      if (result) {
        setPatterns(result.patterns || []);

        // Keep the processed patterns alongside the human response.
        const { error: updateError } = await supabase
          .from("sovereign_intention_steps")
          .update({
            response: {
              consciousDesire: trimmedDesire,
              patterns: result.patterns || [],
            },
          })
          .eq("intention_id", intentionId)
          .eq("step", "discover");

        if (updateError) throw updateError;

        // Notify Sovereign I after successful processing and persistence.
        try {
          await sovereignI({
            eventId: `creation-discover-${Date.now()}`,
            eventType: "creation.updated",
            category: "domain",
            source: "creation_journey",
            occurredAt: new Date().toISOString(),
            payload: {
              intentionId,
              stage: "discover",
            },
            persistence: "persistent",
            contextImpact: ["user", "livingField", "creation"],
          });
        } catch (error) {
          console.error("SOVEREIGN I DISCOVER EVENT ERROR:", error);
        }
      }
    } catch (error) {
      console.error("DISCOVER SAVE / PROCESS ERROR:", error);
    } finally {
      setIsSaving(false);
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* CONSCIOUS DESIRE */}
      <View style={styles.portalGroup}>
        <View style={styles.desireBox}>

          <TextInput
            value={consciousDesire}
            onChangeText={setConsciousDesire}
            onBlur={() => void saveConsciousDesire()}
            multiline
            scrollEnabled
            placeholder="What is it that you truly desire?"
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

          {isProcessing ? (
            <Text style={styles.placeholder}>
              Exploring your Living Field...
            </Text>
          ) : patterns.length > 0 ? (
            patterns.map((pattern, index) => (
              <Text
                key={pattern.id || index}
                style={styles.patternText}
              >
                {pattern.name || pattern.id}
              </Text>
            ))
          ) : (
            <Text style={styles.placeholder}>
              Patterns from your Living Field will appear here.
            </Text>
          )}

        </View>
      </View>

      {/* REFLECTION */}
      <View style={styles.reflectionColumn}>
        <View style={styles.reflectionBox}>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    minWidth: 0,
    minHeight: 0,
    flexDirection: "row",
    gap: 6,
  },

  portalGroup: {
    flex: 2.2,
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

  boxLabel: {
    color: "#81796E",
    fontSize: 8,
    letterSpacing: 1.2,
    marginBottom: 8,
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
    borderWidth: 1,
    borderColor: "rgba(201,173,112,0.16)",
    borderRadius: 8,
    backgroundColor: "#08090A",
  },

  placeholder: {
    color: "#77746F",
    fontSize: 9,
    lineHeight: 14,
  },

  patternText: {
    color: GOLD,
    fontSize: 9,
    lineHeight: 14,
    marginBottom: 5,
  },

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

  reflectionPlaceholder: {
    color: "#77746F",
    fontSize: 10,
    lineHeight: 15,
  },
});
