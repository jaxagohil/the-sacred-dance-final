import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { generateAIResponse } from "../../lib/generateAIResponse";

import {
  Colors,
} from "../../constants/theme";

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
            <Text style={styles.loadingText}>
  listening...
</Text>
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
  paddingVertical: 12,
  paddingHorizontal: 18,

  borderRadius: 999,

  backgroundColor:
    "rgba(255,255,255,0.015)",

  borderWidth: 0.5,

  borderColor:
    "rgba(255,255,255,0.03)",
},

  active: {
backgroundColor:
  "rgba(255,255,255,0.045)",

borderColor:
  "rgba(255,255,255,0.08)",
  },

  disabled: {
    opacity: 0.3,
  },

  text: {
   color:
  Colors.softText,

fontSize: 13,

fontWeight: "300",

letterSpacing: 0.3,
  },

  disabledText: {
color:
  Colors.subtleText,
  },

label: {
  color:
    Colors.mutedText,

  fontSize: 10,

  textAlign: "center",

  marginTop: 6,

  opacity: 0.72,

  letterSpacing: 0.4,
},

  responseBox: {
marginTop: 24,

paddingHorizontal: 32,

maxWidth: "92%",
  },

responseText: {
  color:
    Colors.softText,

  fontSize: 14,

  lineHeight: 28,

  textAlign: "center",

  fontWeight: "300",

  opacity: 0.9,
},

  loadingText: {
  color:
    Colors.mutedText,

  fontSize: 11,

  fontStyle: "italic",

  opacity: 0.72,
},
});