import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { supabase } from "../../services/supabase";
import { getUserId } from "../../lib/user";

import CosmicTiles from "../../components/mirror/CosmicTiles";
import EnergyField from "../../components/energy/EnergyField";
import Lenses from "../../components/mirror/Lenses";
import ReadingContainer from "../../components/mirror/ReadingContainer";

import { getEnergyFromSignals } from "../../lib/energy/getEnergyFromSignals";
import { interpretMirror } from "../../lib/interpretMirror";
import { tMirror } from "../../lib/i18n/index";

import { getCosmicMessage } from "../../lib/getCosmicMessage";

import {
  buildFullChakraScores,
  getAwarenessChakra,
} from "../../lib/energy";

export default function Mirror() {

  const [signals, setSignals] = useState<any[]>([]);
  const [energy, setEnergy] = useState<any>(null);
  const [mirror, setMirror] = useState<any>(null);
  const [energyState, setEnergyState] =
    useState<"loading" | "empty" | "ready">("loading");
  const [signalsLoaded, setSignalsLoaded] = useState(false);

  const [cosmicMessage, setCosmicMessage] = useState<string | null>(null);
  const [cosmic, setCosmic] = useState<any>(null);

  // 🔥 NEW STATES
  const [chakraPatterns, setChakraPatterns] = useState<
    Record<string, { description: string }>
  >({});

  const [distortionBehaviours, setDistortionBehaviours] = useState<any>({
    masculine: [],
    feminine: [],
  });

  // ---------------------------
  // 🔌 LOAD SIGNALS
  // ---------------------------
  useFocusEffect(
    useCallback(() => {
      async function load() {
        setSignalsLoaded(false);

        const userId = await getUserId();

        const { data, error } = await supabase
          .from("signals")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(20);

        if (error) {
          console.error(error);
          setSignalsLoaded(true);
          return;
        }

        setSignals(data || []);
        setSignalsLoaded(true);
      }

      load();
    }, [])
  );

  // ---------------------------
  // ⚡ BUILD EVERYTHING
  // ---------------------------
  useEffect(() => {
    async function build() {
      if (!signalsLoaded) return;

      if (!signals || signals.length === 0) {
        setEnergyState("empty");
        return;
      }

      setEnergyState("loading");

      const result = await getEnergyFromSignals(signals);

      if (!result || !result.patterns) {
        setEnergyState("empty");
        return;
      }

      const patterns = result.patterns;

      // ✅ CHAKRA PATTERNS
      const chakraPatternsResult = result.chakraPatterns || {};

      // 🧠 BUILD DISTORTION BEHAVIOURS
      const masculine: any[] = [];
      const feminine: any[] = [];

      signals.forEach((s) => {
        const behaviours = s.ai_behaviours || [];

        behaviours.forEach((b: any) => {
          if (!b?.statement) return;

          if (b.side === "masculine") masculine.push(b);
          if (b.side === "feminine") feminine.push(b);
        });
      });

      const distortionMap = {
        masculine: masculine.slice(0, 3), // keep top few
        feminine: feminine.slice(0, 3),
      };

      const mirrorResult = interpretMirror(patterns);

      const cosmicResult = await getCosmicMessage({
        energy: result.energy,
        patterns,
      });

      setEnergy(result.energy);
      setMirror(mirrorResult);
      setChakraPatterns(chakraPatternsResult);
      setDistortionBehaviours(distortionMap);

      setCosmic(cosmicResult.cosmic);
      setCosmicMessage(cosmicResult.aiMessage);

      setEnergyState("ready");

      console.log("🧠 chakraPatterns:", chakraPatternsResult);
      console.log("🔥 distortions:", distortionMap);
    }

    build();
  }, [signals, signalsLoaded]);

  // ---------------------------
  // 🧠 CHAKRA PIPELINE
  // ---------------------------
let chakraScores: any = {};
let awarenessChakra: any = null;

if (energy && energy.chakras) {
  chakraScores = buildFullChakraScores(energy.chakras);
  awarenessChakra = getAwarenessChakra(chakraScores);
}

  // ---------------------------
  // STATIC
  // ---------------------------
  const oracle = {
    title: "Presence",
    message: "Everything you seek is already here.",
  };

  const tarot = {
    title: "The Empress",
    message: "Notice what this stirs within you.",
  };

  const energyMessage =
    cosmicMessage ||
    (mirror?.key && mirror?.primary
      ? tMirror(mirror.key)
      : `You are being invited to soften your grip.`);

  // ---------------------------
  // LOADING
  // ---------------------------
  if (energyState === "loading") {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>
          Reading your energy...
        </Text>
      </View>
    );
  }

  if (energyState === "empty") {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>
          No signals yet. Start reflecting ✨
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.top}>
        <CosmicTiles
          energy={energy}
          patterns={mirror?.primary ? [mirror.primary] : []}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ⚡ ENERGY FIELD */}
{energy && (
  <EnergyField
    dominant={awarenessChakra}
    scores={chakraScores}
    energy={energy}
    chakraPatterns={chakraPatterns}
    distortionBehaviours={distortionBehaviours}
  />
)}
        <Lenses mirror={mirror} energy={energy} />

        <ReadingContainer
          oracle={oracle}
          tarot={tarot}
          energyMessage={energyMessage}
        />

        <View style={styles.guide}>
          <TouchableOpacity
            onPress={() => console.log("Go to Guidance")}
            style={styles.guideButton}
          >
            <Text style={styles.guideText}>
              Speak to a guide
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  loadingText: {
    color: "white",
    textAlign: "center",
    marginTop: 100,
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingBottom: 120,
  },

  top: {
    paddingTop: 20,
  },

  guide: {
    alignItems: "center",
    marginTop: 20,
  },

  guideButton: {
    padding: 12,
  },

  guideText: {
    color: "white",
  },
});