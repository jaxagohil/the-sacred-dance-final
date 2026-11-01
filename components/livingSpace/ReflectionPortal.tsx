
import React, { useState } from "react";
import {
    StyleSheet,
    TextInput,
    View
} from "react-native";

import { Fonts } from "../../constants/theme";

export default function ReflectionPortal({
  onSubmitReflection,
  isTyping = false,
}: any) {
  const [text, setText] = useState("");

  async function handleSubmit() {
    const reflection = text.trim();

    if (!reflection || isTyping) return;

    await onSubmitReflection?.({ text: reflection });
    setText("");
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Share a thought or ask your Guides..."
        placeholderTextColor="#89818F"
        multiline
        maxLength={2000}
        editable={!isTyping}
        returnKeyType="send"
        blurOnSubmit={false}
        nativeID="reflection-input"
        selectionColor="#C9AD70"
cursorColor="#C9AD70"
        onSubmitEditing={handleSubmit}
        onKeyPress={(event) => {
          if (event.nativeEvent.key === "Enter") {
            event.preventDefault?.();
            handleSubmit();
          }
        }}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#17151B",
    borderWidth: 1,
    borderColor: "rgba(201,173,112,0.28)",
    borderRadius: 13,
    paddingHorizontal: 13,
    paddingVertical: 1,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 90,
    color: "#E9E2EA",
    fontFamily: Fonts.light,
    fontSize: 10,
    lineHeight: 18,
    textAlignVertical: "center",
    paddingVertical: 7,
  },
});
