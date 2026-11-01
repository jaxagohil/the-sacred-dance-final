
import { useEffect, useState } from "react";
import {
  StyleSheet
} from "react-native";

import { supabase } from "../../../../services/supabase";

type Props = {
  intentionId: string | null;
};

export default function StageDream({ intentionId }: Props) {
  const [value, setValue] = useState("");

  // Load the saved dream whenever the selected creation changes.
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

  // Save when the user leaves the text field.
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

  return
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  prompt: {
    color: "#E4C58B",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    minHeight: 100,
    color: "#EEE5D7",
    fontSize: 13,
    lineHeight: 21,
    padding: 0,
  },
});
