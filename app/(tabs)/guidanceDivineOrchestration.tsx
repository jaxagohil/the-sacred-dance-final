// app/(tabs)/guidanceDivineOrchestration.tsx

import React, {
  useMemo,
  useState,
} from "react";

import {
  SafeAreaView,
  ScrollView,
} from "react-native";

import {
  Colors,
} from "../../constants/theme";

import {
  GUIDE_TYPES,
} from "../../components/guidance/guideConfig";

import {
  buildGuidanceField,
} from "../../lib/guidance/orchestration/buildGuidanceField";

import {
  useMirrorStore,
} from "../../stores/mirrorStore";

import DivineOrchestrationOverlay from "../../components/guidance/DivineOrchestrationOverlay";

import ReflectionPortal from "../../components/guidance/ReflectionPortal";

import GuideTransmission from "../../components/guidance/GuideTransmission";

/*
 * --------------------------------------------------------
 * 🌌 GUIDANCE SCREEN
 * --------------------------------------------------------
 */

export default function GuidanceDivineOrchestration() {

  /*
   * --------------------------------------------------------
   * 🌌 MIRROR FIELD
   * --------------------------------------------------------
   */

  const {

    userContext,

    mirrorContext,

    activeLens,

    ready,

  } = useMirrorStore();

  /*
   * --------------------------------------------------------
   * 🌊 LIVE TRANSMISSIONS
   * --------------------------------------------------------
   */

  const [transmissions] =
    useState([

      {
        id: "1",

        guide:
          GUIDE_TYPES.COSMIC,

        text:
          "Life sometimes repeats symbols gently until awareness catches up.",
      },

      {
        id: "2",

        guide:
          GUIDE_TYPES.HEART,

        text:
          "Something inside you already knows what is softening here.",
      },
    ]);

  /*
   * --------------------------------------------------------
   * 🌌 BUILD LIVE FIELD
   * --------------------------------------------------------
   */

  console.log(
  "🌌 STORE MIRROR CONTEXT",
  mirrorContext
);

  const field = useMemo(() => {

    /*
     * --------------------------------------------------------
     * 🌊 NO FIELD YET
     * --------------------------------------------------------
     */

    if (

      !userContext ||

      !mirrorContext

    ) {

      return null;
    }

    /*
     * --------------------------------------------------------
     * 🌿 BUILD GUIDANCE FIELD
     * --------------------------------------------------------
     */

    return buildGuidanceField({

      /*
       * 🌊 REAL MIRROR CONTEXT
       */

      mirrorContext,

      /*
       * 🌌 ACTIVE FIELD DATA
       */

      activePatterns:

        mirrorContext
          ?.enrichedPatterns || [],

      activeLenses: [

        activeLens,
      ].filter(Boolean),

      activeChakras:

        mirrorContext
          ?.energy
          ?.activeChakras || [],

      distortionDots:

        Object.keys(
          mirrorContext
            ?.distortions || {}
        ),

      /*
       * 🌿 GUIDE STATE
       */

      selectedGuide:
        GUIDE_TYPES.COSMIC,

      /*
       * ✨ RECENT TRANSMISSIONS
       */

      recentMessages:
        transmissions,
    });

  }, [

    userContext,

    mirrorContext,

    activeLens,

    transmissions,
  ]);

  /*
   * --------------------------------------------------------
   * 🌌 LOADING
   * --------------------------------------------------------
   */

  if (

    !ready ||

    !userContext ||

    !mirrorContext ||

    !field

  ) {

    return null;
  }

  /*
   * --------------------------------------------------------
   * 🌌 SCREEN
   * --------------------------------------------------------
   */

  return (

    <SafeAreaView
      style={{
        flex: 1,

        backgroundColor:
          Colors.background,
      }}
    >

      {/* ------------------------------------------------ */}
      {/* 🌌 ORCHESTRATION FIELD */}
      {/* ------------------------------------------------ */}

      <DivineOrchestrationOverlay
        field={field}
      />

      {/* ------------------------------------------------ */}
      {/* 🌿 REFLECTION PORTAL */}
      {/* ------------------------------------------------ */}

      <ReflectionPortal />

      {/* ------------------------------------------------ */}
      {/* ✨ TRANSMISSION MEMORY */}
      {/* ------------------------------------------------ */}

      <ScrollView
        showsVerticalScrollIndicator={false}

        contentContainerStyle={{

          paddingTop: 18,

          paddingBottom: 40,

          alignItems: "center",
        }}
      >

        {transmissions.map(
          (transmission) => (

            <GuideTransmission
              key={transmission.id}

              guide={
                transmission.guide
              }

              text={
                transmission.text
              }
            />
          )
        )}

      </ScrollView>

    </SafeAreaView>
  );
}