import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

import OracleCard from "./OracleCard";
import TarotCard from "./TarotCard";
import EnergyReading from "./EnergyReading";

type Props = {
  oracle: { title: string; message: string; theme?: any };
  tarot: { title: string; message: string };
  energyMessage: string;
};

export default function ReadingContainer({
  oracle,
  tarot,
  energyMessage,
}: Props) {
  const [showCards, setShowCards] = useState(false);
  const [showTarot, setShowTarot] = useState(false);
  const [typedText, setTypedText] = useState("");

  const tarotAnim = useRef(new Animated.Value(0)).current;

  // ⏱ Oracle → Tarot delay
  useEffect(() => {
    if (!showCards) return;

    const tarotTimer = setTimeout(() => {
      setShowTarot(true);

      Animated.timing(tarotAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start();
    }, 1200);

    return () => clearTimeout(tarotTimer);
  }, [showCards]);

  // ✨ Typing effect
  useEffect(() => {
    if (!showTarot) return;

    let i = 0;
    let timeout: any;

    const type = () => {
      if (i >= energyMessage.length) return;

      const char = energyMessage[i];
      setTypedText((prev) => prev + char);
      i++;

      let delay = 55 + Math.random() * 40;

      if (char === ".") delay = 400;
      else if (char === ",") delay = 220;
      else if (char === " ") delay = 40;

      timeout = setTimeout(type, delay);
    };

    const startDelay = setTimeout(type, 800);

    return () => {
      clearTimeout(timeout);
      clearTimeout(startDelay);
    };
  }, [showTarot, energyMessage]);

  const tarotStyle = {
    opacity: tarotAnim,
    transform: [
      {
        translateY: tarotAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 14],
        }),
      },
      {
        rotate: "6deg",
      },
      {
        scale: 0.95,
      },
    ],
  };

  return (
    <View style={styles.container}>

      {/* BUTTON */}
      {!showCards && (
        <TouchableOpacity
          onPress={() => setShowCards(true)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Energy Read</Text>
        </TouchableOpacity>
      )}

      {/* EXPERIENCE */}
      {showCards && (
        <View style={styles.inner}>

          {/* CARDS */}
          <View style={styles.cardsWrapper}>

            {/* 🌌 ORACLE */}
            <View style={styles.oracle}>
              <OracleCard {...oracle} />
            </View>

            {/* 🔮 TAROT */}
            {showTarot && (
              <Animated.View style={[styles.tarot, tarotStyle]}>
                <TarotCard {...tarot} />
              </Animated.View>
            )}

          </View>

          {/* ✨ READING */}
          {showTarot && (
            <View style={styles.reading}>
              <EnergyReading message={typedText} />
            </View>
          )}

        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 60,
  },

  inner: {
    alignItems: "center",
  },

  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  buttonText: {
    color: "white",
    fontSize: 14,
  },

  cardsWrapper: {
    marginTop: 60,
    width: 300,
    height: 340,
    justifyContent: "center",
    alignItems: "center",
  },

  oracle: {
    position: "absolute",
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },

  tarot: {
    position: "absolute",
    right: -40,
    zIndex: 2,
  },

  reading: {
    marginTop: 40,
  },
});