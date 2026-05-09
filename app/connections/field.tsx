// app/(tabs)/connections/field.tsx

import React, {
  useEffect,
  useState,
} from "react";

import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  router,
} from "expo-router";

import {
  supabase,
} from "../../services/supabase";

import {
  getUserId,
} from "../../lib/user";

import CompassionNode from "../../components/connections/CompassionNode";
import HumanAvatar from "../../components/connections/HumanAvatar";
import LivingField from "../../components/connections/LivingField";
import LoveNode from "../../components/connections/LoveNode";
import UnityConsciousnessNode from "../../components/connections/UnityConsciousnessNode";
import YouNode from "../../components/connections/YouNode";

const { width, height } =
  Dimensions.get("window");

const centerX = width / 2;
const centerY = height / 2;

//
// 🌌 FIXED HUMAN CONSTELLATION POSITIONS
// (UI STAYS IDENTICAL)
//

const positions = [

  {
    x: centerX - 130,
    y: centerY + 20,
  },

  {
    x: centerX + 100,
    y: centerY + 60,
  },

  {
    x: centerX + 90,
    y: centerY - 340,
  },

  {
    x: centerX - 130,
    y: centerY - 240,
  },

  {
    x: centerX - 50,
    y: centerY - 340,
  },

  {
    x: centerX - 130,
    y: centerY + 210,
  },

  {
    x: centerX + 120,
    y: centerY + 190,
  },

  {
    x: centerX + 135,
    y: centerY - 150,
  },

  {
    x: centerX - 100,
    y: centerY + 280,
  },

  {
    x: centerX + 40,
    y: centerY + 310,
  },

  {
    x: centerX - 135,
    y: centerY - 40,
  },

  {
    x: centerX + 130,
    y: centerY + 270,
  },

  {
    x: centerX - 150,
    y: centerY + 110,
  },

  {
    x: centerX + 130,
    y: centerY + 110,
  },

  {
    x: centerX - 100,
    y: centerY - 330,
  },
];

export default function Field() {

  //
  // 👤 CURRENT USER
  //

  const [currentUser, setCurrentUser] =
    useState<any>(null);

  //
  // 🌍 REAL HUMANS
  //

  const [humans, setHumans] =
    useState<any[]>([]);

  //
  // 👤 DELAYED SELF ARRIVAL
  //

  const [showYou, setShowYou] =
    useState(false);

  //
  // 🌍 ACTIVE HUMANS
  //

  const [visibleHumans, setVisibleHumans] =
    useState<string[]>([]);

  //
  // 👤 LOAD REAL PROFILES
  //

  useEffect(() => {

    async function loadProfiles() {

      try {

        console.log(
          "🌍 LOAD PROFILES"
        );

        //
        // 👤 CURRENT USER ID
        //

        const userId =
          await getUserId();

        console.log(
          "👤 CURRENT USER:",
          userId
        );

        //
        // 🌍 LOAD PROFILES
        //

        const {
          data,
          error,
        } = await supabase

          .from("profiles")

          .select("*");

        if (error) {

          console.log(
            "❌ PROFILES ERROR",
            error
          );

          return;
        }

        console.log(
          "🌍 PROFILES FOUND:",
          data?.length || 0
        );

        //
        // 👤 FIND ME
        //

        const me =
          data?.find(
            (profile) =>
              profile.user_id === userId
          );

console.log(
  "👤 ME:",
  me?.name
);

console.log(
  "👤 MY AVATAR URL:",
  me?.avatar_url
);

        //
        // 🌍 OTHERS
        //

        const others =
          data?.filter(
            (profile) =>
              profile.user_id !== userId
          ) || [];

          console.log(
  "🌍 OTHER HUMANS:",
  others
);

others.forEach((human) => {

  console.log(
    `🌍 ${human.name} AVATAR:`,
    human.avatar_url
  );

});

        //
        // ✨ POSITION HUMANS
        //

        const positioned =
          others.map(
            (human, index) => {

              const position =
                positions[
                  index %
                  positions.length
                ];

              return {

                ...human,

                x: position.x,
                y: position.y,
              };
            }
          );

        setCurrentUser(me);

        setHumans(positioned);

      } catch (error) {

        console.log(
          "❌ LOAD PROFILES ERROR",
          error
        );
      }
    }

    loadProfiles();

  }, []);

  //
  // ✨ YOU ENTERS FIRST
  //

  useEffect(() => {

    const delay =
      2000 + Math.random() * 2000;

    const timer =
      setTimeout(() => {

        setShowYou(true);

      }, delay);

    return () =>
      clearTimeout(timer);

  }, []);

  //
  // 🌌 HUMANS EMERGE AFTER YOU
  //

  useEffect(() => {

    if (
      !showYou ||
      humans.length === 0
    ) {

      return;
    }

    const humanDelay =
      4000 + Math.random() * 2000;

    let interval:
      ReturnType<typeof setInterval>;

    const timer =
      setTimeout(() => {

        const initial =
          [...humans]
            .sort(() =>
              Math.random() - 0.5
            )
            .slice(0, 3)
            .map((h) => h.user_id);

        setVisibleHumans(initial);

        //
        // 🌊 LIVING FIELD
        //

        interval =
          setInterval(() => {

            const shuffled =
              [...humans]
                .sort(() =>
                  Math.random() - 0.5
                );

            const selected =
              shuffled
                .slice(0, 3)
                .map((h) => h.user_id);

            setVisibleHumans(selected);

          }, 7000);

      }, humanDelay);

    return () => {

      clearTimeout(timer);

      if (interval) {

        clearInterval(interval);
      }
    };

  }, [
    showYou,
    humans,
  ]);

  return (

    <View style={styles.container}>

      {/* 🌌 ATMOSPHERIC FIELD */}

      <LivingField />

      {/* 🔵 COMPASSION */}

      <CompassionNode
        x={centerX + 80}
        y={centerY - 210}
      />

      {/* 💗 LOVE */}

      <LoveNode
        x={centerX - 90}
        y={centerY - 110}
      />

      {/* ✨ UNITY */}

      <UnityConsciousnessNode
        x={centerX}
        y={centerY + 180}
      />

      {/* 👤 YOU */}

      <YouNode

        x={centerX}
        y={centerY - 10}

        visible={showYou}

        avatar={
          currentUser?.avatar_url
        }
      />

      {/* 🌍 REAL HUMANS */}

      {humans.map((human) => (

        <HumanAvatar

          key={human.user_id}

          visible={
            visibleHumans.includes(
              human.user_id
            )
          }

          image={
            human.avatar_url
          }

          x={human.x}
          y={human.y}

          onPress={() => {

            console.log(
              "🌍 OPEN HUMAN:",
              human.name
            );

router.push({

  pathname:
    "/connections/human-space",

  params: {

    otherUserId:
      human.user_id,
  },
});
          }}
        />

      ))}

      {/* ◌ RETURN */}

      <Pressable

        onPress={() =>
          router.back()
        }

        style={styles.portal}
      >

        <Text style={styles.portalText}>
          ◌
        </Text>

      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,

    backgroundColor:
      "#020304",
  },

  //
  // ◌ PORTAL
  //

  portal: {
    position: "absolute",

    bottom: 0,

    width: "100%",

    alignItems:
      "center",

    justifyContent:
      "center",

    paddingTop: 20,
    paddingBottom: 8,

    zIndex: 999,
  },

  portalText: {
    color:
      "rgba(255,255,255,0.18)",

    fontSize: 30,

    fontWeight: "200",
  },

});