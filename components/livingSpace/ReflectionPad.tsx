
import React, { useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { Colors, Fonts } from "../../constants/theme";

type ReflectionNote = {
  id: string;
  text: string;
};

const EMOJIS = ["✨", "❤️", "🌿", "🌙", "☀️", "🦋"];

export default function ReflectionPad() {
  const [notes, setNotes] = useState<ReflectionNote[]>([
    { id: "1", text: "" },
    { id: "2", text: "" },
    { id: "3", text: "" },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [emojiIndex, setEmojiIndex] = useState(0);

  const activeNote = notes[activeIndex];

  function updateNote(text: string) {
    setNotes((current) =>
      current.map((note, index) =>
        index === activeIndex ? { ...note, text } : note
      )
    );
  }

  function addNote() {
    const newNote = {
      id: Date.now().toString(),
      text: "",
    };

    setNotes((current) => [...current, newNote]);
    setActiveIndex(notes.length);
  }

  function addEmoji() {
    const emoji = EMOJIS[emojiIndex % EMOJIS.length];
    updateNote((activeNote?.text || "") + emoji);
    setEmojiIndex((current) => current + 1);
  }

  function previousNote() {
    setActiveIndex((current) => Math.max(0, current - 1));
  }

  function nextNote() {
    setActiveIndex((current) =>
      Math.min(notes.length - 1, current + 1)
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.pad}>

        {/* LAYERED PAPER */}
        <View style={styles.paperStack}>
          <View style={styles.backPaperThree} />
          <View style={styles.backPaperTwo} />
          <View style={styles.backPaperOne} />

          {/* ACTIVE IVORY PAGE */}
          <View style={styles.activePaper}>

            <View style={styles.pageHeader}>
              <Text style={styles.pageEyebrow}>A MOMENT WITH MYSELF</Text>

              <View style={styles.pageNavigation}>
                <Pressable
                  onPress={previousNote}
                  disabled={activeIndex === 0}
                  style={styles.pageArrow}
                >
                  <Text style={[
                    styles.arrowText,
                    activeIndex === 0 && styles.faded,
                  ]}>‹</Text>
                </Pressable>

                <Text style={styles.pageNumber}>
                  {String(activeIndex + 1).padStart(2, "0")}
                </Text>

                <Pressable
                  onPress={nextNote}
                  disabled={activeIndex === notes.length - 1}
                  style={styles.pageArrow}
                >
                  <Text style={[
                    styles.arrowText,
                    activeIndex === notes.length - 1 && styles.faded,
                  ]}>›</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.writingArea}>
              <TextInput
                key={activeNote?.id}
                value={activeNote?.text || ""}
                onChangeText={updateNote}
                placeholder="What is on your mind?"
                placeholderTextColor="#A69B89"
                multiline
                textAlignVertical="top"
                style={styles.noteText}
              />
            </View>

            <Text style={styles.paperFooter}>A THOUGHT · A FEELING · A MOMENT</Text>
          </View>
        </View>

        {/* TOOLBAR */}
        <View style={styles.controls}>
          <Pressable
            style={styles.toolButton}
            onPress={() =>
              Alert.alert("Add an image", "We'll connect image selection next.")
            }
          >
            <Text style={styles.toolIcon}>▧</Text>
          </Pressable>

          <Pressable
            style={styles.toolButton}
            onPress={() =>
              Alert.alert("Voice reflection", "We'll connect voice recording next.")
            }
          >
            <Text style={styles.toolIcon}>♩</Text>
          </Pressable>

          <Pressable
            style={styles.toolButton}
            onPress={addEmoji}
          >
            <Text style={styles.toolIcon}>☺</Text>
          </Pressable>
        </View>

        {/* ADD PAGE */}
        <Pressable
          style={styles.addButton}
          onPress={addNote}
        >
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>

        {/* FOOTER */}
        <Text style={styles.label}>REFLECTIONS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 360,
  },

  pad: {
    width: "100%",
    height: 360,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#101014",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(201,173,112,0.12)",
  },

  paperStack: {
    position: "absolute",
    left: 12,
    top: 12,
    width: 205,
    height: 290,
  },

  backPaperThree: {
    position: "absolute",
    top: 7,
    left: 7,
    right: 0,
    bottom: 0,
    backgroundColor: "#CFC4B0",
    borderRadius: 3,
    transform: [{ rotate: "2deg" }],
  },

  backPaperTwo: {
    position: "absolute",
    top: 4,
    left: 4,
    right: 0,
    bottom: 0,
    backgroundColor: "#E0D5C3",
    borderRadius: 3,
    transform: [{ rotate: "-1deg" }],
  },

  backPaperOne: {
    position: "absolute",
    top: 2,
    left: 2,
    right: 0,
    bottom: 0,
    backgroundColor: "#E9DECB",
    borderRadius: 3,
  },

  activePaper: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F3EBDD",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#E4D8C5",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
  },

  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(105,88,65,0.16)",
  },

  pageEyebrow: {
    color: "#93836C",
    fontSize: 7,
    letterSpacing: 1.3,
  },

  pageNavigation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  pageArrow: {
    width: 16,
    alignItems: "center",
  },

  arrowText: {
    color: "#88765C",
    fontSize: 19,
    lineHeight: 20,
  },

  pageNumber: {
    color: "#88765C",
    fontSize: 8,
    fontFamily: Fonts.light,
  },

  faded: {
    opacity: 0.2,
  },

  writingArea: {
    flex: 1,
    paddingTop: 14,
  },

  noteText: {
    flex: 1,
    color: "#494137",
    fontSize: 13,
    lineHeight: 21,
    fontFamily: Fonts.light,
    padding: 0,
  },

  paperFooter: {
    color: "#A89A83",
    fontSize: 6,
    letterSpacing: 1.1,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(105,88,65,0.13)",
  },

  controls: {
    position: "absolute",
    right: 9,
    top: 210,
    alignItems: "center",
    gap: 10,
  },

  toolButton: {
    width: 29,
    height: 29,
    alignItems: "center",
    justifyContent: "center",
  },

  toolIcon: {
    color: "#AAA2B6",
    fontSize: 19,
  },

  addButton: {
    position: "absolute",
    right: 12,
    bottom: 7,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  addButtonText: {
    color: Colors.mutedText,
    fontFamily: Fonts.light,
    fontSize: 22,
    lineHeight: 22,
  },

  label: {
    position: "absolute",
    bottom: 13,
    left: 12,
    color: "#77747F",
    fontSize: 9,
    letterSpacing: 1.8,
    fontWeight: "400",
  },
});
