
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { supabase } from "../../../../services/supabase";

type Props = {
  intentionId: string;
};

const GOLD = "#C9AD70";
const MUTED = "#AAA2B6";

export default function StageDiscover({ intentionId }: Props) {
  const [consciousDesire, setConsciousDesire] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // LOAD SAVED CONSCIOUS DESIRE
  useEffect(() => {
    let active = true;

    const loadDiscover = async () => {
      setConsciousDesire("");

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
            ? data.response as { consciousDesire?: string }
            : {};

        setConsciousDesire(
          typeof response.consciousDesire === "string"
            ? response.consciousDesire
            : ""
        );
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
      } else if (response.consciousDesire) {
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

          <Text style={styles.placeholder}>
            Patterns from your Living Field will appear here.
          </Text>
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
