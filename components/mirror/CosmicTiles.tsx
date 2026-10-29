
import React, { useEffect, useRef, useState } from "react";

import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Colors } from "../../constants/theme";

type CosmicTilesProps = {
  cosmic: any;
  language?: string;
  languageContext?: any;
  layout?: "horizontal" | "vertical";
};

function getPhaseIcon(type: string) {
  const map: Record<string, string> = {
    amplify: "🌕",
    initiate: "🌑",
    build: "🌓",
    release: "🌘",
  };

  return map[type] || "🌓";
}

export default function CosmicTiles({
  cosmic,
  language,
  languageContext,
  layout = "horizontal",
}: CosmicTilesProps) {

  const [hoveredTile, setHoveredTile] = useState<string | null>(null);

  const shimmerAnim = useRef(
    new Animated.Value(0.18)
  ).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 0.06,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0.18,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [shimmerAnim]);

  const cosmicData = cosmic?.dailyField?.cosmic || {};

  const tiles = [
    {
      key: "sun",
      value: cosmicData?.sun_sign || "",
      line: cosmic?.sun?.line || cosmic?.sunLine || "",
      icon: "☀️",
    },
    {
      key: "energy",
      value: (
        cosmic?.dailyField?.dominantEnergy || "Energy"
      ).split(" ")[0],
      line: cosmic?.energy?.line || cosmic?.energyLine || "",
      icon: "✨",
    },
    {
      key: "moon",
      value: cosmicData?.moon_sign || "",
      line: cosmic?.moon?.line || cosmic?.moonLine || "",
      icon: "🌙",
    },
    {
      key: "phase",
      value: cosmicData?.moon_phase || "",
      line: cosmic?.phase?.line || cosmic?.phaseLine || "",
      icon: getPhaseIcon(cosmic?.phaseType),
    },
  ];


  return (
    <View
      style={[
        styles.wrapper,
        layout === "vertical" && styles.verticalWrapper,
      ]}
    >
      <View
        style={[
          styles.row,
          layout === "vertical" && styles.verticalRow,
        ]}
      >
        {tiles.map((tile) => (
          <Pressable
            key={tile.key}
            onHoverIn={() => setHoveredTile(tile.key)}
            onHoverOut={() => setHoveredTile(null)}
            style={styles.tile}
          >
            <Text style={styles.icon}>{tile.icon}</Text>

            {Platform.OS === "web" && hoveredTile === tile.key && (
  <View style={styles.hoverPanel} pointerEvents="none">
    <Text style={styles.hoverTitle}>
      {tile.value}
    </Text>

    <Text style={styles.hoverText}>
      {tile.line}
    </Text>
  </View>
)}

            {!cosmic && (
              <Animated.View
                style={[
                  styles.loadingOverlay,
                  { opacity: shimmerAnim },
                ]}
              />
            )}
          </Pressable>
        ))}
      </View>


      {Platform.OS !== "web" && (
        <View style={styles.mobileLabels}>
          {tiles.map((tile) => (
            <View key={tile.key} style={styles.mobileLabel}>
              <Text style={styles.value}>{cosmic ? tile.value : ""}</Text>
              <Text style={styles.line}>{cosmic ? tile.line : ""}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
      marginLeft: -100,
  },

  verticalWrapper: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },

  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    gap: Platform.OS === "web" ? 14 : 10,
  },

  verticalRow: {
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },

tile: {
  position: "relative",
  width: Platform.OS === "web" ? 176 : 78,
  minHeight: 92,
  paddingHorizontal: 4,
  paddingVertical: 8,
  borderRadius: 0,
  alignItems: "center",
  alignSelf: "center",
  justifyContent: "center",
  backgroundColor: "transparent",
  borderWidth: 0,
  overflow: "visible",
},

  icon: {
    fontSize: 14,
    opacity: 0.65,
    marginBottom: 5,
  },

  valueWrapper: {
    minHeight: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },

  value: {
    fontSize: 10,
    color: Colors.white,
    textAlign: "center",
    fontWeight: "300",
  },

line: {
  width: 100,
  minHeight: 14,
  fontSize: 9,
  color: Colors.mutedText,
  marginTop: 5,
  textAlign: "center",
  lineHeight: 12,
  opacity: 0.8,
  alignSelf: "center",
},

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.04)",
  },

hoverPanel: {
  position: "absolute",
  bottom: 34,
  left: "80%",
  width: 150,
  transform: [{ translateX: -75 }],
  zIndex: 100,
  alignItems: "flex-start",
  paddingHorizontal: 10,
  paddingVertical: 8,
  backgroundColor: "rgba(0,0,0,0.96)",
},

hoverTitle: {
  fontSize: 10,
  color: "#D6B568",
  textAlign: "left",
  marginBottom: 5,
  letterSpacing: 0.5,
},

hoverText: {
  fontSize: 9,
  color: Colors.mutedText,
  textAlign: "left",
  lineHeight: 13,
  maxWidth: 150,
},

  mobileLabels: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 8,
  },

  mobileLabel: {
    flex: 1,
    alignItems: "center",
  },

});
