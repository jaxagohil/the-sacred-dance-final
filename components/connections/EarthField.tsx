import React, { useMemo, useRef, useEffect } from "react";
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";

const SIZE = 260;

type Node = {
  id: number;
  x: number;
  y: number;
  size: number;
};

export default function EarthField() {
  const rotate = useRef(new Animated.Value(0)).current;

  // 🔄 slow rotation animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 120000, // 2 mins rotation
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // 🌐 nodes
  const nodes: Node[] = useMemo(() => {
    const center = 50;

    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: center + (Math.random() - 0.5) * 50,
      y: center + (Math.random() - 0.5) * 50,
      size: 2 + Math.random() * 2,
    }));
  }, []);

  return (
    <View style={styles.container}>

      {/* 🌊 glow */}
      <View style={styles.glow} />

      {/* 🌍 rotating earth */}
      <Animated.View
        style={[
          styles.earthContainer,
          { transform: [{ rotate: spin }] },
        ]}
      >
        <Image
          source={require("../../assets/earth.png")} // ⚠️ adjust path
          style={styles.earth}
          resizeMode="cover"
        />
      </Animated.View>

      {/* 🌐 nodes rotating slower */}
      <Animated.View
        style={[
          styles.nodesContainer,
          { transform: [{ rotate: spin }] },
        ]}
      >
        {nodes.map((node) => (
          <View
            key={node.id}
            style={[
              styles.nodeWrapper,
              {
                left: `${node.x}%`,
                top: `${node.y}%`,
              },
            ]}
          >
            <View
              style={[
                styles.nodeGlow,
                {
                  width: node.size * 6,
                  height: node.size * 6,
                },
              ]}
            />
            <View
              style={[
                styles.node,
                {
                  width: node.size,
                  height: node.size,
                },
              ]}
            />
          </View>
        ))}
      </Animated.View>

      {/* 🌐 atmosphere */}
      <View style={styles.atmosphere} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 320,
    height: 320,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  glow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(0, 255, 255, 0.08)",
  },

  earthContainer: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    overflow: "hidden",
  },

  earth: {
    width: "100%",
    height: "100%",
  },

  atmosphere: {
    position: "absolute",
    width: SIZE + 5,
    height: SIZE + 5,
    borderRadius: (SIZE + 5) / 2,
    borderWidth: 1,
    borderColor: "rgba(0,255,255,0.2)",
  },

  nodesContainer: {
    position: "absolute",
    width: SIZE,
    height: SIZE,
  },

  nodeWrapper: {
    position: "absolute",
    transform: [{ translateX: -5 }, { translateY: -5 }],
  },

  nodeGlow: {
    position: "absolute",
    borderRadius: 50,
    backgroundColor: "rgba(0,255,255,0.1)",
  },

  node: {
    borderRadius: 50,
    backgroundColor: "rgba(200,255,255,0.9)",
  },
});
