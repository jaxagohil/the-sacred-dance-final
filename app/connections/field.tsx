// app/connections/field.tsx

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

import {
  buildDailyField,
} from "../../lib/cosmic/buildDailyField";

import {
  Colors,
} from "../../constants/theme";

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
// 🌌 POSITIONS
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
];

export default function Field() {

  //
  // 👤 USER
  //

  const [currentUser, setCurrentUser] =
    useState<any>(null);

  //
  // 🌕 DAILY FIELD
  //

  const [

    dailyField,

    setDailyField,

  ] = useState<any>(null);

  //
  // 🌍 HUMANS
  //

  const [humans, setHumans] =
    useState<any[]>([]);

  //
  // 👤 SELF
  //

  const [showYou, setShowYou] =
    useState(false);

  //
  // 🌍 ACTIVE
  //

  const [visibleHumans, setVisibleHumans] =
    useState<string[]>([]);

  //
  // 🌌 LOAD
  //

  useEffect(() => {

    async function load() {

      try {

        //
        // 👤 USER
        //

        const userId =
          await getUserId();

        //
        // 🌕 DAILY FIELD
        //

        const field =
          await buildDailyField();

        setDailyField(
          field
        );

        //
        // 🌍 LOAD HUMANS
        //

        const {
          data,
          error,
        } = await supabase

          .from("profiles")

          .select("*");

        if (error) {

          console.log(
            "❌ PROFILE ERROR",
            error
          );

          return;
        }

        //
        // 👤 ME
        //

        const me =
          data?.find(
            (profile) =>
              profile.user_id === userId
          );

        //
        // 🌍 OTHERS
        //

        const others =
          data?.filter(
            (profile) =>
              profile.user_id !== userId
          ) || [];

        //
        // ✨ POSITION
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
          "❌ FIELD ERROR",
          error
        );
      }
    }

    load();

  }, []);

  //
  // 👤 YOU
  //

  useEffect(() => {

    const delay =
      300 + Math.random() * 300;

    const timer =
      setTimeout(() => {

        setShowYou(true);

      }, delay);

    return () =>
      clearTimeout(timer);

  }, []);

  //
  // 🌍 HUMAN ROTATION
  //

  useEffect(() => {

    if (
      !showYou ||
      humans.length === 0
    ) {

      return;
    }

    const timer =
      setTimeout(() => {

        const initial =
          [...humans]

            .sort(
              () =>
                Math.random() - 0.5
            )

            .slice(0, 2)

            .map(
              (h) => h.user_id
            );

        setVisibleHumans(
          initial
        );

      }, 2500);

    return () =>
      clearTimeout(timer);

  }, [
    showYou,
    humans,
  ]);

  //
  // 🌌 UI
  //

  return (

    <View style={styles.container}>

      {/* 🌌 FIELD */}

      <LivingField
        dailyField={
          dailyField
        }
      />

      {/* 💗 LOVE */}

      <LoveNode

        x={centerX - 90}
        y={centerY - 110}

        opacity={1}

        onPress={() => {

          router.push(
            "/connections/circle-space?type=love"
          );
        }}
      />

      {/* 🔵 COMPASSION */}

      <CompassionNode

        x={centerX + 80}
        y={centerY - 210}

        opacity={1}

        onPress={() => {

          router.push(
            "/connections/circle-space?type=compassion"
          );
        }}
      />

      {/* ✨ UNITY */}

      <UnityConsciousnessNode

        x={centerX}
        y={centerY + 180}

        opacity={1}

        onPress={() => {

          router.push(
            "/connections/circle-space?type=unity"
          );
        }}
      />

      {/* 👤 YOU */}

      <YouNode

        x={centerX}
        y={centerY - 10}

        visible={showYou}

        opacity={1}

        avatar={
          currentUser?.avatar_url
        }

        onPress={() => {

          router.push(
            "/connections/you-space"
          );
        }}
      />

      {/* 🌍 HUMANS */}

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

          opacity={1}

          onPress={() => {

            router.push(

              `/connections/human-space?otherUserId=${human.user_id}`

            );
          }}
        />

      ))}

      {/* ◌ */}

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

const styles =
  StyleSheet.create({

    container: {
      flex: 1,

      backgroundColor:
        Colors.background,

      overflow: "hidden",
    },

    portal: {
      position: "absolute",

      bottom: 0,

      width: "100%",

      alignItems:
        "center",

      justifyContent:
        "center",

      zIndex: 10,
    },

    portalText: {
      color:
        Colors.portal,

      fontSize: 28,

      fontWeight: "200",
    },

  });