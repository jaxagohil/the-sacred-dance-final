import React from "react";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Colors,
  Fonts,
  Opacity,
} from "../../constants/theme";

export default function EmotionCloudSimple({

  emotions,

  selected,

  onPress,

}: any) {

  return (

    <View style={styles.container}>

      {emotions.map((e: any) => {

        const isSelected =
          selected.includes(
            e.id
          );

        return (

          <Pressable

            key={e.id}

            onPress={() =>
              onPress(e.id)
            }
          >

            <Text
              style={[

                styles.text,

                isSelected &&
                  styles.selected,
              ]}
            >
              {e.word}
            </Text>

          </Pressable>
        );
      })}

    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {

      flexDirection:
        "row",

      flexWrap:
        "wrap",

      justifyContent:
        "center",

      paddingHorizontal: 30,
    },

    text: {

      color:
        Colors.mutedText,

      fontFamily:
        Fonts.light,

      fontSize: 15,

      lineHeight: 28,

      paddingHorizontal: 5,

      paddingVertical: 4,
    },

    selected: {

      color:
        Colors.gold,

      opacity:
        Opacity.strong,
    },
  });