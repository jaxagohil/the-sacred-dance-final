import React, { useState } from "react";

import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Colors,
  Fonts,
} from "../constants/theme";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function WelcomeOverlay({
  visible,
  onClose,
}: Props) {

  const [step, setStep] =
    useState(1);

const next = () => {

  if (step < 5) {

    setStep(step + 1);

  }

};

  const cardText = () => {

switch (step) {

  case 1:
    return {
      title:
        "✨\n\nWelcome\n",

      body:
        "Sacred Dance helps you recognise patterns in your thoughts, emotions, behaviours and relationships through reflection.\n\nEverything begins with your own lived experience.\n\nNothing is predicted. Nothing is assigned. Everything starts with what you choose to share.",
    };

  case 2:
    return {
      title:
        "\nTap to Go Deeper\n",

      body:
        "Everything is valid.\n\nEven the smallest reflection can reveal a deeper pattern over time.",
    };

  case 3:
    return {
      title:
        "\nShare Your Reflections\n",

      body:
        "Write, speak or share an image.\n\nWhat you choose to share becomes the starting point for recognising patterns and discovering greater self-awareness.",
    };

  case 4:
    return {
      title:
        "\nA Reflection of You\n",

      body:
        "Language, location, preferences and the people, places and things that matter to you help Sacred Dance build a deeper understanding of your unique reflection journey over time.",
    };

case 5:
  return {
    title:
      "\nAI-Assisted Reflections\n",

    body:
      "Sacred Dance uses AI to create personalised reflections from the journal entries, voice recordings and images you choose to share.\n\nYour information may be securely processed by OpenAI for this purpose.\n\nSacred Dance supports self-reflection. It does not make predictions or decisions about you.\n\nSelect 'Agree & Continue' to enable AI-assisted reflections.",
  };

  default:
    return {
      title:
        "\n\n\nExplore All That Awaits.",

      body:
        "",
    };
}
  };

  const current =
    cardText();

  return (

    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >

      <Pressable
        style={{
          flex: 1,
          backgroundColor:
             "transparent",
        }}
        onPress={step < 5 ? next : undefined}
      >

        <View
          style={{
            position: "absolute",

            top: "38%",

            left: 70,
            right: 70,

            height: 415,

            backgroundColor:
              "rgba(12,12,12,0.88)",

            borderRadius: 20,

            paddingVertical: 18,
            paddingHorizontal: 20,

            alignItems:
              "center",
          }}
        >

          <Text
            style={{
              color:
                Colors.softText,

              fontFamily:
                Fonts.orchestration,

              fontSize: 18,

              textAlign:
                "center",

              marginBottom: 8,
            }}
          >
            {current.title}
          </Text>

          <Text
            style={{
              color:
                Colors.softText,

              fontSize: 10,

              lineHeight: 22,

              textAlign:
                "center",
            }}
          >
            {current.body}
          </Text>

          {step === 5 && (

  <TouchableOpacity

    onPress={() => {

      onClose();

    }}

    style={{

      marginTop: 25,

      backgroundColor: "rgba(255,255,255,0.12)",

      borderRadius: 24,

      paddingVertical: 10,

      paddingHorizontal: 22,

    }}
  >

    <Text
      style={{

        color: Colors.softText,

        fontSize: 13,

        fontFamily: Fonts.light,

      }}
    >
      Agree & Continue
    </Text>

  </TouchableOpacity>

)}

</View>

{step === 2 && (

  <Text
    style={{
      position: "absolute",

      top: "60%",

      alignSelf: "center",

      color:
        Colors.softText,

      fontSize: 28,

      opacity: 0.6,
    }}
  >
    ⤵
  </Text>

)}

{step === 3 && (

  <Text
    style={{
      position: "absolute",

      top: "72%",

      alignSelf: "center",

      color:
        Colors.softText,

      fontSize: 28,

      opacity: 0.6,
    }}
  >
    ⤵
  </Text>

)}

</Pressable>

    </Modal>
  );
}