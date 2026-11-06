
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Fonts } from "../../../../constants/theme";
import { supabase } from "../../../../services/supabase";

type RenewState = {
  feel: string;
  think: string;
  say: string;
  do: string;
  reflection: string;
};

type Props = {
  intentionId: string | null;
};

const createEmptyState = (): RenewState => ({
  feel: "",
  think: "",
  say: "",
  do: "",
  reflection: "",
});

export default function StageRenew({ intentionId }: Props) {
  const [renewState, setRenewState] =
    useState<RenewState>(createEmptyState);

  const [loaded, setLoaded] = useState(false);

  const stateRef = useRef(renewState);

  useEffect(() => {
    stateRef.current = renewState;
  }, [renewState]);

  // LOAD RENEW
  useEffect(() => {
    let active = true;

    const loadRenew = async () => {
      const emptyState = createEmptyState();
      stateRef.current = emptyState;
      setRenewState(emptyState);

      if (!intentionId) {
        setLoaded(true);
        return;
      }

      setLoaded(false);

      try {
        const { data, error } = await supabase
          .from("sovereign_intention_steps")
          .select("response")
          .eq("intention_id", intentionId)
          .eq("step", "renew")
          .maybeSingle();

        if (error) throw error;
        if (!active) return;

        if (!data?.response) {
          stateRef.current = emptyState;
          setRenewState(emptyState);
          return;
        }

        const response =
          typeof data.response === "string"
            ? JSON.parse(data.response)
            : data.response;

        const nextState: RenewState = {
          feel:
            typeof response?.feel === "string"
              ? response.feel
              : "",
          think:
            typeof response?.think === "string"
              ? response.think
              : "",
          say:
            typeof response?.say === "string"
              ? response.say
              : "",
          do:
            typeof response?.do === "string"
              ? response.do
              : "",
          reflection:
            typeof response?.reflection === "string"
              ? response.reflection
              : "",
        };

        stateRef.current = nextState;
        setRenewState(nextState);
      } catch (error) {
        console.error("RENEW LOAD ERROR:", error);

        if (active) {
          stateRef.current = emptyState;
          setRenewState(emptyState);
        }
      } finally {
        if (active) setLoaded(true);
      }
    };

    void loadRenew();

    return () => {
      active = false;
    };
  }, [intentionId]);

  // SAVE RENEW
  const saveRenew = async (nextState: RenewState) => {
    if (!intentionId) return;

    try {
      const response = {
        feel: nextState.feel.trim(),
        think: nextState.think.trim(),
        say: nextState.say.trim(),
        do: nextState.do.trim(),
        reflection: nextState.reflection.trim(),
      };

      const { data: existing, error: findError } =
        await supabase
          .from("sovereign_intention_steps")
          .select("id")
          .eq("intention_id", intentionId)
          .eq("step", "renew")
          .maybeSingle();

      if (findError) throw findError;

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
            step: "renew",
            response,
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error("RENEW SAVE ERROR:", error);
    }
  };

  // UPDATE FIELD
  const updateField = (
    field: keyof Pick<RenewState, "feel" | "think" | "say" | "do">,
    value: string
  ) => {
    const nextState: RenewState = {
      ...stateRef.current,
      [field]: value,
    };

    stateRef.current = nextState;
    setRenewState(nextState);
  };

  // SAVE FIELD
  const saveField = () => {
    if (!loaded) return;
    void saveRenew(stateRef.current);
  };

  if (!loaded) {
    return (
      <View>
        <Text style={styles.muted}>...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.renewGrid}>
        <View style={styles.renewBlock}>
          <Text style={styles.renewLabel}>FEEL</Text>
          <TextInput
            value={renewState.feel}
            onChangeText={(value) => updateField("feel", value)}
            onBlur={saveField}
            multiline
            placeholder="What am I feeling?"
            placeholderTextColor="#77746F"
            style={styles.renewInput}
          />
        </View>

        <View style={styles.renewBlock}>
          <Text style={styles.renewLabel}>THINK</Text>
          <TextInput
            value={renewState.think}
            onChangeText={(value) => updateField("think", value)}
            onBlur={saveField}
            multiline
            placeholder="What am I thinking?"
            placeholderTextColor="#77746F"
            style={styles.renewInput}
          />
        </View>

        <View style={styles.renewBlock}>
          <Text style={styles.renewLabel}>SAY</Text>
          <TextInput
            value={renewState.say}
            onChangeText={(value) => updateField("say", value)}
            onBlur={saveField}
            multiline
            placeholder="What am I saying?"
            placeholderTextColor="#77746F"
            style={styles.renewInput}
          />
        </View>

        <View style={styles.renewBlock}>
          <Text style={styles.renewLabel}>DO</Text>
          <TextInput
            value={renewState.do}
            onChangeText={(value) => updateField("do", value)}
            onBlur={saveField}
            multiline
            placeholder="What am I doing?"
            placeholderTextColor="#77746F"
            style={styles.renewInput}
          />
        </View>
      </View>

      {!!renewState.reflection && (
        <View style={styles.reflection}>
          <Text style={styles.reflectionText}>
            {renewState.reflection}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  renewGrid: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 5,
    width: "100%",
  },

  renewBlock: {
    flex: 1,
    minWidth: 0,
    height: 76,
    padding: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(201,173,112,0.22)",
    backgroundColor: "rgba(255,255,255,0.025)",
  },

  renewLabel: {
    color: "#C9AD70",
    fontFamily: Fonts.light,
    fontSize: 8,
    letterSpacing: 1.5,
    marginBottom: 5,
  },

  renewInput: {
    minHeight: 38,
    color: "#EEECE6",
    fontFamily: Fonts.light,
    fontSize: 10,
    lineHeight: 15,
    padding: 0,
    textAlignVertical: "top",
  },

  reflection: {
    marginTop: 16,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(201,173,112,0.3)",
    backgroundColor: "rgba(201,173,112,0.06)",
  },

  reflectionText: {
    color: "#EEECE6",
    fontFamily: Fonts.light,
    fontSize: 12,
    lineHeight: 20,
  },

  muted: {
    color: "#AAA2B6",
    fontFamily: Fonts.light,
    fontSize: 11,
  },
});
