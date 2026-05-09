import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

import { generateAIResponse } from "../../lib/generateAIResponse";
import { selectOracleCard } from "../../lib/selectOracleCard";
import { selectTarotCard } from "../../lib/selectTarotCard";

type Props = {
  context?: {
    patterns?: string[];
    distortion?: string[];
    lens?: string;
    chakra?: string;
    cosmic?: {
      phase?: string;
      moon?: string;
      energy?: string;
      sign?: string;
    };
  };
};

// 🎨 COLOUR SYSTEM
const COLOUR_CONFIG: Record<string, string> = {
  silver: "rgba(192,192,192,0.6)",
  copper: "rgba(184,115,51,0.6)",
  gold: "rgba(212,175,55,0.6)",
  pink: "rgba(236,72,153,0.6)",
  royalblue: "rgba(65,105,225,0.6)",
  navy: "rgba(11,31,58,0.6)",
  black: "rgba(255,255,255,0.2)",
  white: "rgba(255,255,255,0.3)",
  silvergold: "rgba(214,194,122,0.6)",
  greygold: "rgba(168,162,158,0.6)",
  grey: "rgba(107,114,128,0.6)",
  maroon: "rgba(127,29,29,0.6)",
  orange: "rgba(249,115,22,0.6)",
  yellow: "rgba(250,204,21,0.6)",
  green: "rgba(34,197,94,0.6)",
  blue: "rgba(59,130,246,0.6)",
  purple: "rgba(139,92,246,0.6)",
};

export default function ReadingContainer({ context }: Props) {
  const [show, setShow] = useState(false);
  const [showTarot, setShowTarot] = useState(false);

  const [oracle, setOracle] = useState<any>(null);
  const [tarot, setTarot] = useState<any>(null);
  const [typed, setTyped] = useState("");

  const tarotAnim = useRef(new Animated.Value(0)).current;

  const handleOpen = async () => {
    const ctx = context || {};

    // 🧠 Select cards
    const selectedOracle = selectOracleCard(ctx);
    const selectedTarot = selectTarotCard(ctx);

    setOracle(selectedOracle);
    setTarot(selectedTarot);

    setTyped("");
    setShowTarot(false);
    setShow(true);

    // 🤖 AI CALL (FIXED + FULL CONTEXT)
    try {
      const aiText = await generateAIResponse({
        type: "cards",
        data: {
          oracle: {
            title: selectedOracle.title,
            affirmation: selectedOracle.affirmation,
          },
          tarot: {
            name: selectedTarot.name,
            message: selectedTarot.message,
          },

          // 🔥 core signals
          patterns: ctx.patterns,
          distortion: ctx.distortion,
          lens: ctx.lens,
          chakra: ctx.chakra,

          // 🌌 cosmic flattened
          phase: ctx.cosmic?.phase,
          moon: ctx.cosmic?.moon,
          energy: ctx.cosmic?.energy,
        },
      });

      setTyped(aiText);
    } catch (err) {
      console.log("AI fallback");

      // ✅ FIXED fallback
      setTyped(selectedOracle.affirmation || "");
    }
  };

  // 🔮 tarot reveal
  useEffect(() => {
    if (!show || !oracle) return;

    const t = setTimeout(() => {
      setShowTarot(true);

      Animated.timing(tarotAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start();
    }, 1200);

    return () => clearTimeout(t);
  }, [show, oracle]);

  const tarotStyle = {
    opacity: tarotAnim,
    transform: [
      {
        translateY: tarotAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [30, -10],
        }),
      },
      { rotate: "5deg" },
    ],
  };

  if (!oracle) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={handleOpen}>
          <Text style={styles.trigger}>
            Energy Read
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const borderColor =
    COLOUR_CONFIG[oracle.colour] ||
    "rgba(255,255,255,0.2)";

  return (
    <View style={styles.container}>
      {show && (
        <View style={styles.canvas}>

          {/* 🃏 ORACLE (AFFIRMATION ONLY) */}
          <View style={styles.oracleWrap}>
            <View style={[styles.oracleCard, { borderColor }]}>
              <Text style={styles.oracleTitle}>
                {oracle.title}
              </Text>

              <Text style={styles.oracleMessage}>
                {oracle.affirmation}
              </Text>
            </View>
          </View>

          {/* 🔮 TAROT */}
          {showTarot && tarot && (
            <Animated.View style={[styles.tarot, tarotStyle]}>
              <View style={styles.tarotCard}>
                <Text style={styles.tarotTitle}>
                  {tarot.name}
                </Text>
                <Text style={styles.tarotMessage}>
                  {tarot.message}
                </Text>
              </View>
            </Animated.View>
          )}

          {/* 🧠 AI READING */}
          {showTarot && (
            <Text style={styles.reading}>
              {typed}
            </Text>
          )}

        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 40,
  },

  trigger: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    marginTop: 20,
  },

  canvas: {
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
  },

  oracleWrap: {
    alignItems: "center",
    marginTop: 20,
  },

  oracleCard: {
    width: 260,
    minHeight: 340,
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderRadius: 30,
    backgroundColor: "#000",
    borderWidth: 3,
    alignItems: "center",
  },

  oracleTitle: {
    fontSize: 17,
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },

  oracleMessage: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    lineHeight: 22,
  },

  tarot: {
    marginTop: -160,
    alignSelf: "flex-end",
    marginRight: 30,
    width: 190,
    zIndex: 2,
  },

  tarotCard: {
    minHeight: 260,
    paddingVertical: 28,
    paddingHorizontal: 16,
    borderRadius: 26,
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
  },

  tarotTitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },

  tarotMessage: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },

  reading: {
    marginTop: 28,
    paddingHorizontal: 30,
    textAlign: "center",
    color: "rgba(255,255,255,0.85)",
    lineHeight: 22,
  },
});