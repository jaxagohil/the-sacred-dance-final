import React, { useState } from "react";

import {
  Modal,
  Pressable,
  Text,
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

      return;
    }

    onClose?.();
  };

  const cardText = () => {

    switch (step) {

      case 1:
        return {
          title: "✨\n\nWelcome\n\nSacred Dance is for You, by You.",
          body:
            "",
        };

      case 2:
        return {
          title: "\nTap to Go Deeper\n",
    body:
      "Everything is valid. The smallest reflection can reveal a deeper pattern.",

        };

      case 3:
        return {
          title: "\nShare Your Reflections\n",
    body:
      "Life is happening for you. What you share, you become aware of.",

        };

case 4:
  return {
    title:
      "\nA Reflection of You",

    body:
      "Location - Language - Preferences\n\nThe people, places and things that matter most. Over time, Sacred Dance remembers.",
  };       

      default:
        return {
          title: "\n\n\nExplore.. All that Awaits.",
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
        onPress={next}
      >

        <View
          style={{
            position: "absolute",

            top: "38%",

            left: 70,
            right: 70,

            height: 200,

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

</View>

{step === 2 && (

  <Text
    style={{
      position: "absolute",

      top: "55%",

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