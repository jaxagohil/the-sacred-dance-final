
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View
} from "react-native";

import { Fonts } from "../../../../constants/theme";
import { supabase } from "../../../../services/supabase";

type Props = {
  intentionId: string | null;
};

export default function StageDream({ intentionId }: Props) {
  const [value, setValue] = useState("");

  // LOAD SAVED DREAM
  useEffect(() => {
    let active = true;

    const loadDream = async () => {
      if (!intentionId) {
        setValue("");
        return;
      }

      const { data, error } = await supabase
        .from("sovereign_intention_steps")
        .select("response")
        .eq("intention_id", intentionId)
        .eq("step", "dream")
        .maybeSingle();

      if (!active) return;

      if (error) {
        console.error("DREAM LOAD ERROR:", error);
        return;
      }

      setValue(
        typeof data?.response === "string"
          ? data.response
          : ""
      );
    };

    void loadDream();

    return () => {
      active = false;
    };
  }, [intentionId]);

  // SAVE DREAM
  const saveDream = async () => {
    if (!intentionId) return;

    const response = value.trim();

    try {
      const { data: existing, error: findError } = await supabase
        .from("sovereign_intention_steps")
        .select("id")
        .eq("intention_id", intentionId)
        .eq("step", "dream")
        .maybeSingle();

      if (findError) {
        console.error("DREAM LOOKUP ERROR:", findError);
        return;
      }

      if (existing) {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .update({ response })
          .eq("id", existing.id);

        if (error) {
          console.error("DREAM UPDATE ERROR:", error);
        }
      } else if (response) {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .insert({
            intention_id: intentionId,
            step: "dream",
            response,
          });

        if (error) {
          console.error("DREAM SAVE ERROR:", error);
        }
      }
    } catch (error) {
      console.error("DREAM SAVE ERROR:", error);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.textBox}>
        <TextInput
          value={value}
          onChangeText={setValue}
          onBlur={() => void saveDream()}
          multiline
          placeholder="What do you see..."
          placeholderTextColor="#77746F"
          style={styles.input}
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },

  label: {
    color: "#C9AD70",
    fontFamily: Fonts.light,
    fontSize: 9,
    letterSpacing: 1.8,
    marginBottom: 8,
  },
textBox: {
  width: "100%",
  minHeight: 85,
  padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(201,173,112,0.22)",
    backgroundColor: "rgba(255,255,255,0.025)",
  },

input: {
  width: "100%",
  minHeight: 65,
    color: "#EEECE6",
    fontFamily: Fonts.light,
    fontSize: 12,
    lineHeight: 19,
    padding: 0,
  },
});
