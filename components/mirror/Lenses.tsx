import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { generateAIResponse } from "../../lib/generateAIResponse";

type Props = {
  mirror: any;
  energy: any;
};

export default function Lenses({ mirror, energy }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handlePress = async (lens: "people" | "places" | "things") => {
    if (!mirror?.primary) return;

    setSelected(lens);
    setLoading(true);
    setResponse("");

    try {
      const res = await generateAIResponse({
        type: "lens",
        data: {
          lens,
          chakra: energy?.dominant_chakra,

          // 🔥 core truth from engine
          pattern: mirror.primary.id,
          patternState: mirror.primary.state,
          patternTrend: mirror.primary.trend,
        },
      });

      setResponse(res);
    } catch (e) {
      console.error("Lens AI error:", e);
      setResponse("...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* 🔘 BUTTONS */}
      <View style={styles.row}>

        {/* 💗 PEOPLE */}
        <TouchableOpacity
          style={[styles.button, styles.things]}
          onPress={() => handlePress("people")}
        >
          <Text style={styles.text}>People</Text>
        </TouchableOpacity>

        {/* 💙 PLACES */}
        <TouchableOpacity
          style={[styles.button, styles.things]}
          onPress={() => handlePress("places")}
        >
          <Text style={styles.text}>Places</Text>
        </TouchableOpacity>

        {/* ✨ THINGS */}
        <TouchableOpacity
          style={[styles.button, styles.things]}
          onPress={() => handlePress("things")}
        >
          <Text style={styles.text}>Things</Text>
        </TouchableOpacity>

      </View>

      {/* ✨ LABEL */}
      <Text style={styles.label}>
        What are your mirrors showing you?
      </Text>

      {/* 🧠 RESPONSE */}
      {selected && (
        <View style={styles.responseBox}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.responseText}>
              {response}
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
    gap: 16,
    marginBottom: 16,
  },

  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  text: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
  },

  label: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "center",
    maxWidth: 220,
  },

  responseBox: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    maxWidth: "90%",
  },

  responseText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },

  // 🎨 COLORS

  people: {
    backgroundColor: "rgba(255,120,180,0.12)",
    shadowColor: "#ff78b4",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },

  places: {
    backgroundColor: "rgba(120,180,255,0.12)",
    shadowColor: "#78b4ff",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },

  things: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.1)",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
});