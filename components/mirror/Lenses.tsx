import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { generateAIResponse } from "../../lib/generateAIResponse";

type Props = {
  mirror: any;
  energy: any;
  signals: any[];
};

export default function Lenses({
  mirror,
  energy,
  signals,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [responses, setResponses] = useState<{
    people?: string;
    places?: string;
    things?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  // 🔥 REAL LENS DATA
const latestSignal = signals?.[0];

const lensData = latestSignal?.ai_lens || {
  people: [],
  places: [],
  things: [],
};

  const handlePress = async (lens: "people" | "places" | "things") => {
    if (!mirror?.primary) return;

    // ❌ if no data → do nothing
    if (!lensData[lens] || lensData[lens].length === 0) return;

    setSelected(lens);

    // ✅ already generated → don't regenerate
    if (responses[lens]) return;

    setLoading(true);

    try {
const behaviours = lensData[lens];

const res = await generateAIResponse({
  type: "lens",
  data: {
    lens,
    chakra: energy?.dominant_chakra,
    pattern: mirror?.primary?.name || "unknown",
    patternState: mirror?.primary?.state || "unknown",
    patternTrend: mirror?.primary?.trend || "stable",
    behaviours, // ✅ already string[]
  },
});

      setResponses((prev) => ({
        ...prev,
        [lens]: res,
      }));
    } catch (e) {
      console.error("Lens AI error:", e);
      setResponses((prev) => ({
        ...prev,
        [lens]: "...",
      }));
    } finally {
      setLoading(false);
    }
  };

  const renderButton = (lens: "people" | "places" | "things") => {
    const hasData = lensData[lens]?.length > 0;

    return (
      <TouchableOpacity
        style={[
          styles.button,
          selected === lens && styles.active,
          !hasData && styles.disabled,
        ]}
        onPress={() => handlePress(lens)}
        disabled={!hasData}
      >
        <Text style={[styles.text, !hasData && styles.disabledText]}>
          {lens}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>

      {/* 🔘 LENSES */}
      <View style={styles.row}>
        {renderButton("people")}
        {renderButton("places")}
        {renderButton("things")}
      </View>

      {/* ✨ LABEL */}
      <Text style={styles.label}>
        what are your mirrors showing you?
      </Text>

      {/* 🧠 RESPONSE */}
      {selected && (
        <View style={styles.responseBox}>
          {loading && !responses[selected] ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.responseText}>
              {responses[selected]}
            </Text>
          )}
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginTop: -10,
    paddingBottom: 24,
  },

  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 14,
  },

  button: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.03)",
  },

  active: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  disabled: {
    opacity: 0.3,
  },

  text: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },

  disabledText: {
    color: "rgba(255,255,255,0.3)",
  },

  label: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 11,
    textAlign: "center",
    marginTop: 4,
  },

  responseBox: {
    marginTop: 18,
    paddingHorizontal: 20,
    maxWidth: "90%",
  },

  responseText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
});