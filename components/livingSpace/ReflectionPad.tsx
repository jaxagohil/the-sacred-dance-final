import { Audio } from "expo-av";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { EMOTION_EMOJIS } from "../../constants/emotionEmojis";
import { Fonts } from "../../constants/theme";

import { processJournalReflection } from "../../db/processJournalReflection";
import { buildReflectionPacket } from "../../lib/buildReflectionsPacket";
import { getLanguage } from "../../lib/i18n/t";
import { pickImageForVision } from "../../lib/pickImageForVision";
import { getUserId } from "../../lib/user";

export default function ReflectionPad() {
  const [text, setText] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [saving, setSaving] = useState(false);

  function toggleEmotion(id: string) {
    setSelectedEmotions((current) =>
      current.includes(id)
        ? current.filter((emotion) => emotion !== id)
        : [...current, id]
    );

    setShowEmojis(false);
  }

  async function handleImage() {
    try {
      const image = await pickImageForVision();
      if (image) {
        setImageBase64(image);
      }
    } catch (error) {
      console.error("❌ REFLECTION IMAGE ERROR", error);
      Alert.alert("Image", "Unable to add this image.");
    }
  }

  async function handleVoice() {
    try {
      // Start recording
      if (!recording) {
        const permission = await Audio.requestPermissionsAsync();

        if (!permission.granted) {
          Alert.alert(
            "Microphone access",
            "Please allow microphone access to record a reflection."
          );
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const result = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );

        setRecording(result.recording);
        return;
      }

      // Stop recording and keep its temporary URI for processing
      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();

      setAudioUri(uri || null);
      setRecording(null);
    } catch (error) {
      console.error("❌ REFLECTION AUDIO ERROR", error);
      setRecording(null);
      Alert.alert("Voice reflection", "Unable to record this reflection.");
    }
  }

  async function handleSaveReflection() {
    if (saving) return;

    if (recording) {
      Alert.alert(
        "Voice reflection",
        "Please stop the recording before saving your reflection."
      );
      return;
    }

    if (
      !text.trim() &&
      selectedEmotions.length === 0 &&
      !imageBase64 &&
      !audioUri
    ) {
      Alert.alert(
        "A moment with yourself",
        "Write, select an emotion, add an image or record your voice first."
      );
      return;
    }

    try {
      setSaving(true);

      const userId = await getUserId();

      const packet = await buildReflectionPacket({
        text,
        emotions: selectedEmotions,
        imageBase64,
        audioUri,
      });

      await processJournalReflection({
        userId,
        language: getLanguage(),
        text: packet.text,
        emotions: packet.emotions,
        imageBase64,
        audioUri,
        observableScenes: packet.observableScenes,
        bodyResponses: packet.bodyResponses,
        copingStrategies: packet.copingStrategies,
        manifestations: packet.manifestations,
        nervousSystem: packet.nervousSystem,
      });

      // Clear the reflection and temporary media references,
      // ready for the next reflection.
      setText("");
      setSelectedEmotions([]);
      setImageBase64(null);
      setAudioUri(null);
      setShowEmojis(false);
      setIsActive(false);
    } catch (error) {
      console.error("❌ REFLECTION PAD ERROR", error);

      Alert.alert(
        "Reflection",
        "Something went wrong while processing your reflection."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.pad, isActive && styles.padActive]}>
        {/* LAYERED PAPER */}
        <View style={styles.paperStack}>
          <View style={styles.backPaperThree} />
          <View style={styles.backPaperTwo} />
          <View style={styles.backPaperOne} />

          {/* SINGLE IVORY PAGE */}
          <View
            style={[
              styles.activePaper,
              !isActive && styles.paperMuted,
              isActive && styles.paperActive,
            ]}
          >
            <View style={styles.pageHeader}>
              <Text style={styles.pageEyebrow}>A MOMENT WITH MYSELF</Text>

              <Pressable
                onPress={handleSaveReflection}
                disabled={saving}
                style={styles.saveButton}
                accessibilityRole="button"
                accessibilityLabel="Save reflection"
              >
                <Text style={styles.saveButtonText}>
                  {saving ? "…" : "✓"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.writingArea}>
              <TextInput
                value={text}
                onChangeText={setText}
                onFocus={() => setIsActive(true)}
                onBlur={() => setIsActive(false)}
                placeholder="What do you.. FEEL.THINK.SAY.DO?"
                placeholderTextColor="#A69B89"
                multiline
                textAlignVertical="top"
                style={styles.noteText}
              />
            </View>

            <Text style={styles.paperFooter}>
              REFLECTIONS
            </Text>
          </View>
        </View>

        {/* TOOLBAR */}
        <View style={styles.controls}>
          <Pressable
            style={styles.toolButton}
            onPress={handleImage}
            disabled={saving}
            accessibilityRole="button"
            accessibilityLabel="Add image"
          >
            <Text style={styles.toolIcon}>
              {imageBase64 ? "📷" : "📷"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.toolButton}
            onPress={handleVoice}
            disabled={saving}
            accessibilityRole="button"
            accessibilityLabel={recording ? "Stop recording" : "Record voice reflection"}
          >
            <Text style={[styles.toolIcon, recording && styles.recordingIcon]}>
              {recording ? "⏺" : audioUri ? "🎧" : "🎤"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.toolButton}
            onPress={() => setShowEmojis((current) => !current)}
            accessibilityRole="button"
            accessibilityLabel="Choose an emotion"
          >
            <Text style={styles.toolIcon}>
              {selectedEmotions.length > 0 ? "✨" : "😊"}
            </Text>
          </Pressable>
        </View>

        {/* EMOTION PICKER */}
        {showEmojis && (
          <View style={styles.emojiPicker}>
            {EMOTION_EMOJIS.map((emotion) => {
              const isSelected = selectedEmotions.includes(emotion.id);

              return (
                <Pressable
                  key={emotion.id}
                  onPress={() => toggleEmotion(emotion.id)}
                  style={[
                    styles.emojiOption,
                    isSelected && styles.emojiOptionSelected,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${emotion.id}`}
                >
                  <Text style={styles.emojiText}>{emotion.icon}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 340,
  },

  pad: {
    width: "100%",
    height: 340,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.018)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(201,173,112,0.12)",
  },

  padActive: {
    borderColor: "rgba(201,173,112,0.32)",
    backgroundColor: "rgba(255,255,255,0.035)",
  },

  paperStack: {
    position: "absolute",
    left: 35,
    top: 20,
    width: 205,
    height: 305,
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

  paperMuted: {
    backgroundColor: "#DCD5CB",
    borderColor: "#D4CBBE",
    shadowOpacity: 0.08,
    elevation: 1,
  },

  paperActive: {
    backgroundColor: "#F4EFE8",
    borderColor: "rgba(201,173,112,0.65)",
    shadowColor: "#C9AD70",
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 5,
  },

  activePaper: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F4EFE8",
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

  saveButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  saveButtonText: {
    color: "#A88B50",
    fontSize: 17,
    fontFamily: Fonts.light,
    opacity: 0.9,
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

  recordingIcon: {
    color: "#D87979",
  },

  emojiPicker: {
    position: "absolute",
    right: 38,
    top: 190,
    width: 150,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    backgroundColor: "#17151D",
    borderWidth: 1,
    borderColor: "rgba(201,173,112,0.35)",
    borderRadius: 12,
    padding: 8,
    zIndex: 20,
  },

  emojiOption: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },

  emojiOptionSelected: {
    backgroundColor: "rgba(201,173,112,0.2)",
  },

  emojiText: {
    fontSize: 23,
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
