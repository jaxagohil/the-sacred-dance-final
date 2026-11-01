
import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { Fonts } from "../../../../constants/theme";
import { getUserId } from "../../../../lib/user";
import { supabase } from "../../../../services/supabase";

import {
    generateRenewReflection,
} from "../../../../lib/consciousCreating/agents/renew/generateRenewReflection";

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

export default function StageRenew({
  intentionId,
}: Props) {
  const [renewState, setRenewState] =
    useState<RenewState>(createEmptyState);

  const [loaded, setLoaded] = useState(false);

  const [isReflecting, setIsReflecting] =
    useState(false);

  // --------------------------------------------------
  // LOAD RENEW
  // --------------------------------------------------

  useEffect(() => {
    let active = true;

    const loadRenew = async () => {
      if (!intentionId) {
        setRenewState(createEmptyState());
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
          setRenewState(createEmptyState());
          return;
        }

        const response =
          typeof data.response === "string"
            ? JSON.parse(data.response)
            : data.response;

        setRenewState({
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
        });
      } catch (error) {
        console.error("RENEW LOAD ERROR:", error);
        if (active) {
          setRenewState(createEmptyState());
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

  // --------------------------------------------------
  // SAVE RENEW
  // --------------------------------------------------

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

  // --------------------------------------------------
  // UPDATE FIELD
  // --------------------------------------------------

  const updateField = (
    field: keyof RenewState,
    value: string
  ) => {
    setRenewState((current) => ({
      ...current,
      [field]: value,
      reflection: "",
    }));
  };

  // --------------------------------------------------
  // SAVE FIELD
  // --------------------------------------------------

  const saveField = () => {
    void saveRenew(renewState);
  };

  // --------------------------------------------------
  // GENERATE AI REFLECTION
  // --------------------------------------------------

  const generateReflection = async () => {
    if (!intentionId || isReflecting) return;

    const hasInput =
      renewState.feel.trim() ||
      renewState.think.trim() ||
      renewState.say.trim() ||
      renewState.do.trim();

    if (!hasInput) return;

    try {
      setIsReflecting(true);

      const userId = await getUserId();
      if (!userId) return;

      const result = await generateRenewReflection({
        userId,
        intentionId,
        inputs: {
          feel: renewState.feel,
          think: renewState.think,
          say: renewState.say,
          do: renewState.do,
        },
      });

      const nextState = {
        ...renewState,
        reflection: result.reflection,
      };

      setRenewState(nextState);

      await saveRenew(nextState);
    } catch (error) {
      console.error("RENEW REFLECTION ERROR:", error);
    } finally {
      setIsReflecting(false);
    }
  };

  // --------------------------------------------------
  // AUTO REFLECTION
  // All four fields + 3 seconds of stillness
  // --------------------------------------------------

  useEffect(() => {
    if (!loaded || isReflecting || renewState.reflection.trim()) {
      return;
    }

    const hasAllInputs =
      renewState.feel.trim() &&
      renewState.think.trim() &&
      renewState.say.trim() &&
      renewState.do.trim();

    if (!hasAllInputs) return;

    const timer = setTimeout(() => {
      void generateReflection();
    }, 3000);

    return () => clearTimeout(timer);
  }, [
    loaded,
    renewState.feel,
    renewState.think,
    renewState.say,
    renewState.do,
    renewState.reflection,
    isReflecting,
  ]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (!loaded) {
    return (
      <View>
        <Text style={styles.muted}>...</Text>
      </View>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <View style={styles.container}>

      <View style={styles.renewGrid}>
        <View style={styles.renewBlock}>
          <Text style={styles.renewLabel}>FEEL</Text>
          <TextInput
            value={renewState.feel}
            onChangeText={(value) =>
              updateField("feel", value)
            }
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
            onChangeText={(value) =>
              updateField("think", value)
            }
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
            onChangeText={(value) =>
              updateField("say", value)
            }
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
            onChangeText={(value) =>
              updateField("do", value)
            }
            onBlur={saveField}
            multiline
            placeholder="What am I doing?"
            placeholderTextColor="#77746F"
            style={styles.renewInput}
          />
        </View>
      </View>

      {isReflecting && (
        <Text style={styles.muted}>
          Reflecting...
        </Text>
      )}

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

  prompt: {
    color: "#AAA2B6",
    fontFamily: Fonts.light,
    fontSize: 12,
    lineHeight: 19,
    marginBottom: 18,
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
  minHeight: 90,
  padding: 5,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "rgba(201,173,112,0.22)",
  backgroundColor: "rgba(255,255,255,0.025)",
},

  renewLabel: {
    color: "#C9AD70",
    fontFamily: Fonts.light,
    fontSize: 9,
    letterSpacing: 1.8,
    marginBottom: 9,
  },

  renewInput: {
    minHeight: 55,
    color: "#EEECE6",
    fontFamily: Fonts.light,
    fontSize: 11,
    lineHeight: 17,
    padding: 0,
    textAlignVertical: "top",
    //outlineStyle: "none" as const,
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
