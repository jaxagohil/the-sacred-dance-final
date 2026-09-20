// app/(tabs)/guidance.tsx

import React, {
  useEffect,
  useState,
} from "react";

import {
  ScrollView,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  buildAlignmentOSContext,
} from "../../lib/alignment/buildAlignmentOSContext";

import {
  transmissionAgent,
} from "../../lib/ai/agents/transmissionAgent";

import GuideSelector from "../../components/guidance/GuideSelector";

import ReflectionPortal from "../../components/guidance/ReflectionPortal";

import GuideTransmission from "../../components/guidance/GuideTransmission";

import DivineOrchestrationOverlay from "../../components/guidance/DivineOrchestrationOverlay";

import {
  orchestrateGuidance,
} from "../../lib/guidance/orchestration/orchestrateGuidance";

import {
  loadGuideMessages,
} from "../../lib/guidance/runtime/loadGuideMessages";

import {
  saveGuideMessage,
} from "../../lib/guidance/runtime/saveGuideMessage";

import {
  getUserId,
} from "../../lib/user";


import {
  resolveForegroundField,
} from "../../lib/guidance/foreground/resolveForegroundField";

import {
  resolveGuidancePacing,
} from "../../lib/guidance/foreground/guidancePacing";

import {
  buildGuidanceField,
} from "../../lib/guidance/runtime/buildGuidanceField";

import {
  processGuidanceReflection,
} from "../../db/processGuidanceReflection";

import {
  enterTransmission,
} from "../../lib/guidance/enterTransmission";

import {
  generateGuideTransmission,
} from "../../lib/guidance/generateGuideTransmission";


/*
 * --------------------------------------------------------
 * 🌌 SIMPLE GUIDANCE
 * --------------------------------------------------------
 *
 * LAYER 1 ONLY:
 * - portal
 * - transmissions
 * - persistence
 *
 * NO:
 * - orchestration
 * - overlays
 * - whispers
 * - fragments
 * - guide pills
 *
 * --------------------------------------------------------
 */

export default function GuidanceScreen() {

  /*
   * --------------------------------------------------------
   * 🌊 TRANSMISSIONS
   * --------------------------------------------------------
   */


const alignmentContext =

  buildAlignmentOSContext();

  const [
    transmissions,
    setTransmissions,
  ] = useState<any[]>([]);

  const [
  emergenceMemory,
  setEmergenceMemory,
] = useState<any>(null);

  const [
  activeGuide,
  setActiveGuide,
] = useState(null);

const [
  activeFieldGuide,
  setActiveFieldGuide,
] = useState<any>(null);

const [
  orchestrationField,
  setOrchestrationField,
] = useState<any>(null);

const [
  field,
  setField,
] = useState<any>(null);

const [
  thinking,
  setThinking,
] = useState(false);

const [
  isTyping,
  setIsTyping,
] = useState(false);

  /*
   * --------------------------------------------------------
   * 🌌 GUIDE NAMES
   * --------------------------------------------------------
   */

  const guideProfiles = {

    heart: {

      name:

       alignmentContext.userContext
          ?.profile
          ?.guide_1_name

        || "Heart",
    },

    structure: {

      name:

        alignmentContext.userContext
          ?.profile
          ?.guide_2_name

        || "Structure",
    },

    cosmic: {

      name:

        alignmentContext.userContext
          ?.profile
          ?.guide_3_name

        || "Cosmic",
    },
  };

  /*
   * --------------------------------------------------------
   * 🌌 LOAD MESSAGES
   * --------------------------------------------------------
   */

  useEffect(() => {

    async function
    loadMessages() {

      try {

        const userId =
          await getUserId();

        const messages =

          await loadGuideMessages(
            userId
          );

        const validMessages =

          (messages || [])
            .filter(
              (item: any) =>

                item?.role ===
                  "user"

                ||

                item?.role ===
                  "guide"
            );

        setTransmissions(
          validMessages
        );

      } catch (error) {

        console.error(

          "❌ LOAD MESSAGES ERROR",

          error
        );
      }
    }

    loadMessages();

  }, []);

  useEffect(() => {

  async function hydrateField() {

    try {

      if (
        !alignmentContext.mirrorContext
      ) {
        return;
      }

const result =

  await orchestrateGuidance({

    alignmentContext,

    selectedGuide:
      activeGuide
      || activeFieldGuide
      || "cosmic",

    resolvedContent:
      field || {},

    emergenceMemory,
  });

      //console.log(  "🌌 HYDRATED ORCHESTRATION",  result);

      setOrchestrationField(
        result
      );

    } catch (error) {

      console.error(
        "❌ HYDRATION ERROR",
        error
      );
    }
  }

  hydrateField();

}, [

  alignmentContext.mirrorContext,

  emergenceMemory,

  activeGuide,
]);

  useEffect(() => {

  async function
  buildField() {

    try {

      if (
        !alignmentContext.mirrorContext
      ) {

        return;
      }

const foregroundField =

  resolveForegroundField({

    alignmentContext,

    residue:
      emergenceMemory,
  });

      const pacing =

        resolveGuidancePacing(
          foregroundField
        );

const finalField =

  buildGuidanceField({

    alignmentContext,

    foregroundField,

    pacing,

    activeGuide,

    transmissions,

    emergenceMemory,

    orchestrationField,
  });

      setField(
        finalField
      );

    } catch (error) {

      console.error(
        "❌ FIELD BUILD ERROR",
        error
      );
    }
  }

  buildField();

}, [

  alignmentContext.mirrorContext,

  activeGuide,

  alignmentContext.activeLens,

  transmissions,

  emergenceMemory,

  alignmentContext.language,
]);


  /*
 * --------------------------------------------------------
 * 🌌 HANDLE REFLECTION
 * --------------------------------------------------------
 */

async function handleReflection({

  text,

}: any) {

  try {

    setThinking(true);

    setIsTyping(false);

    const userId =
      await getUserId();

    /*
     * ----------------------------------------------------
     * 🌿 GUIDE
     * ----------------------------------------------------
     */

    const guide =

      activeGuide

      || activeFieldGuide

      || "cosmic";

    /*
     * ----------------------------------------------------
     * 🌊 USER MESSAGE
     * ----------------------------------------------------
     */

    const userMessage = {

      id:
        Date.now(),

      role:
        "user",

      guide,

      text,

      createdAt:
        new Date()
          .toISOString(),
    };

    /*
     * ----------------------------------------------------
     * 🌌 LOCAL UI
     * ----------------------------------------------------
     */

    setTransmissions(
      (prev) => [

        ...prev,

        userMessage,
      ]
    );

    /*
     * ----------------------------------------------------
     * 🌊 SAVE MEMORY
     * ----------------------------------------------------
     */

    await saveGuideMessage({

      userId,

      guide,

      role:
        "user",

      content:
        text,

      language:
        alignmentContext.language || "en",

      userField:
        field,

      orchestrationSnapshot:
        orchestrationField,
    });

    /*
     * ----------------------------------------------------
     * 🌿 PROCESS REFLECTION
     * ----------------------------------------------------
     */

await processGuidanceReflection({

  userId,

  text,

  guide:

    guide === "heart"

      ? "guide_heart"

      : guide === "structure"

      ? "guide_structure"

      : "guide_cosmic",

      language:
        alignmentContext.language || "en",

      fieldContext:
        field,
    });

    /*
     * ----------------------------------------------------
     * 🌌 ENTER FIELD
     * ----------------------------------------------------
     */

const result =

await enterTransmission({

  userId,

  guide,

  reflection: text,

  field: field || {},

  alignmentContext,

  existingMessages: [
    ...transmissions,
    userMessage,
  ],
});

    /*
     * ----------------------------------------------------
     * 🌊 UPDATE MEMORY
     * ----------------------------------------------------
     */

    setEmergenceMemory(
      result?.residue
    );

const agentDecision =
  await transmissionAgent({

    reflection: text,

    recentMessages: [
      ...transmissions,
      userMessage,
    ],

    alignmentContext,

    field,

    orchestrationField,

    emergenceMemory:
      result?.residue,

    selectedGuide:
      guide,

    language:
      alignmentContext.language || "en",
  });

console.log(
  "🌊 TRANSMISSION AGENT DECISION",
  agentDecision
);    

const speakers =
  agentDecision?.speakers || [];

for (const speaker of speakers) {

  const speakerGuide =
    speaker?.guide;

  if (
    !["heart", "structure", "cosmic"]
      .includes(speakerGuide)
  ) {
    continue;
  }

  const guideTransmission =
    await generateGuideTransmission({

      guide: speakerGuide,

      reflection: text,

      recentMessages: [
        ...transmissions,
        userMessage,
      ],

      alignmentContext,

      field,

      orchestrationField,

      transmissionDecision:
      agentDecision,

      emergenceMemory:
        result?.residue,

      language:
        alignmentContext.language || "en",
    });

  if (
    guideTransmission?.text
  ) {

    const guideMessage = {

      id:
        `guide_${Date.now()}_${speakerGuide}`,

      role:
        "guide",

      guide:
        speakerGuide,

      text:
        guideTransmission.text,

      createdAt:
        new Date()
          .toISOString(),
    };

    setTransmissions(
      (prev) => [
        ...prev,
        guideMessage,
      ]
    );

    await saveGuideMessage({

      userId,

      guide:
        speakerGuide,

      role:
        "guide",

      content:
        guideTransmission.text,

      language:
        alignmentContext.language || "en",

      userField:
        field,

      orchestrationSnapshot:
        orchestrationField,
    });
  }
}


} catch (error) {

  console.error(

    "❌ Reflection flow error",

    error
  );

} finally {

  setThinking(false);
}
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
          "black"
      }}
    >

<DivineOrchestrationOverlay

  field={
    orchestrationField
  }

  initialWhispers={
    alignmentContext.preloadedWhispers
  }

  activeFieldGuide={
    activeFieldGuide
  }

  onForegroundGuideChange={
    setActiveFieldGuide
  }

  showWhispers={
    true
  }

  showFragments={
    true
  }
/>


<GuideSelector

  activeGuide={
    activeGuide
  }

  activeFieldGuide={
    activeFieldGuide
  }

  onSelectGuide={
    setActiveGuide
  }

  guideProfiles={
    guideProfiles
  }
/>
      
      {/* ------------------------------------------------ */}
      {/* 🌊 TRANSMISSIONS                                */}
      {/* ------------------------------------------------ */}

<ScrollView
  style={{
    flex: 1,
    width: "78%",
    alignSelf: "center",
    backgroundColor: "#181719",
    borderRadius: 28,
  }}

        contentContainerStyle={{
          paddingTop: 40,
          paddingBottom: 220,
        }}

        showsVerticalScrollIndicator={
          false
        }
      >

        {transmissions?.map(

          (
            item: any,
            index: number
          ) => (

<GuideTransmission

  key={
    item?.id || index
  }

  role={
    item?.role
  }

  guide={
    item?.guide
  }

guideName={

  item?.guide === "heart"

    ? guideProfiles?.heart?.name

    : item?.guide === "structure"

    ? guideProfiles?.structure?.name

    : item?.guide === "cosmic"

    ? guideProfiles?.cosmic?.name

    : "Guide"
}

  text={
    item?.text
    || item?.content
    || ""
  }

  isThinking={
    thinking
    &&

    index ===
    transmissions.length - 1
  }
/>
          )
        )}

        {thinking && (
          <GuideTransmission
            role="guide"
            guide={
              activeGuide
              || activeFieldGuide
              || "cosmic"
            }
            guideName={
              (activeGuide || activeFieldGuide) === "heart"
                ? guideProfiles?.heart?.name
                : (activeGuide || activeFieldGuide) === "structure"
                ? guideProfiles?.structure?.name
                : guideProfiles?.cosmic?.name
            }
            text=""
            isThinking={true}
          />
        )}

      </ScrollView>

            {/* ------------------------------------------------ */}
      {/* 🌌 PORTAL                                       */}
      {/* ------------------------------------------------ */}

      <View
        style={{
          paddingBottom: 20,
          paddingTop: 10,
        }}
      >

        <ReflectionPortal

isTyping={
  isTyping
}

setIsTyping={
  setIsTyping
}

          onSubmitReflection={
            handleReflection
          }
        />

      </View>


    </SafeAreaView>
  );
}