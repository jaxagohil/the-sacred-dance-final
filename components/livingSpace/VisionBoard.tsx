import React, { useEffect, useState } from "react";
import {
  Image,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Audio } from "expo-av";

import { Colors, Fonts } from "../../constants/theme";
import { processSovereignLifePicture } from "../../db/processSovereignLifePicture";
import { saveSovereignLifePicture } from "../../db/saveSovereignLifePicture";
import { buildReflectionPacket } from "../../lib/buildReflectionsPacket";
import { pickSovereignImage } from "../../lib/livingSpace/sovereignI/uploads/pickSovereignImage";
import { uploadSovereignImage } from "../../lib/livingSpace/sovereignI/uploads/uploadSovereignImage";
import { uploadSovereignVoice } from "../../lib/livingSpace/sovereignI/uploads/uploadSovereignVoice";
import { sovereignI } from "../../lib/sovereignIOrchestrator/core/sovereignI";
import { getUserId } from "../../lib/user";
import { supabase } from "../../services/supabase";

type LifeEntry = {
  id: string;
  text: string;
  itemType: "text" | "image" | "quote" | "voice" | "link" | "attachment";
  mimeType?: string;
  uri?: string;
  imageBase64?: string;
  title?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

export default function VisionBoard() {
  const [entries, setEntries] = useState<LifeEntry[]>([]);
  const [entryIds, setEntryIds] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [voiceSound, setVoiceSound] = useState<Audio.Sound | null>(null);
const [playingVoice, setPlayingVoice] = useState<string | null>(null);

  const [boardSize, setBoardSize] = useState({
  width: 0,
  height: 0,
});

const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const loadLifePictures = async () => {
      try {
        const userId = await getUserId();
        if (!userId) return;

        const { data, error } = await supabase
          .from("sovereign_life_pictures")
          .select("id, picture, item_type, uri, title, x, y, width, height, rotation")
          .eq("user_id", userId)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("❌ SOVEREIGN LIFE PICTURES LOAD ERROR:", error);
          return;
        }

        const rows = data || [];
        if (rows.length > 0) {
          setEntries(
            rows.map((row, index) => {
              const storedX = Number(row.x);
              const storedY = Number(row.y);
              const hasStoredPosition =
                Number.isFinite(storedX) &&
                Number.isFinite(storedY) &&
                !(storedX === 0 && storedY === 0);

              return {
                id: row.id,
                text: typeof row.picture?.text === "string" ? row.picture.text : "",
                itemType: row.item_type || "text",
                uri: row.uri || undefined,
                title: row.title || undefined,
                x: hasStoredPosition ? storedX : (index % 2) * 135 + 10,
                y: hasStoredPosition ? storedY : Math.floor(index / 2) * 150 + 10,
                width: Number(row.width) || 180,
                height: Number(row.height) || 120,
                rotation: Number.isFinite(Number(row.rotation))
                  ? Number(row.rotation)
                  : index % 2 === 0 ? -1 : 1,
              };
            })
          );
          setEntryIds(Object.fromEntries(rows.map((row) => [row.id, row.id])));
        }
      } catch (error) {
        console.error("❌ SOVEREIGN LIFE PICTURES LOAD ERROR:", error);
      } finally {
        setLoaded(true);
      }
    };

    void loadLifePictures();
  }, []);

const saveEntry = async (
  entry: LifeEntry,
  processContent = true
) => {
    if (!loaded) return;

    const rawText = entry.text.trim();
    if (!rawText && entry.itemType === "text") return;

    try {
      const userId = await getUserId();
      if (!userId) return;


let storedUri: string | null = entry.uri ?? null;

if (
  entry.itemType === "image" &&
  entry.uri &&
  !entry.uri.startsWith("http")
) {
  storedUri = await uploadSovereignImage({
    uri: entry.uri,
    userId,
    mimeType: entry.mimeType,
  });

  if (!storedUri) return;
}

if (
  entry.itemType === "voice" &&
  entry.uri &&
  !entry.uri.startsWith("http")
) {
  storedUri = await uploadSovereignVoice({
    uri: entry.uri,
    userId,
    mimeType: entry.mimeType,
  });

  if (!storedUri) return;
}


      const saved = await saveSovereignLifePicture({
        userId,
        lifePictureId: entryIds[entry.id],
        text: rawText,
      });

      if (!saved?.id) return;

      const { error: layoutError } = await supabase
        .from("sovereign_life_pictures")
        .update({
          item_type: entry.itemType,
          uri: storedUri,
          title: entry.title || null,
          x: entry.x,
          y: entry.y,
          width: entry.width,
          height: entry.height,
          rotation: entry.rotation,
        })
        .eq("id", saved.id);

      if (layoutError) {
        console.error("❌ LIFE ENTRY LAYOUT SAVE ERROR:", layoutError);
      }

      if (storedUri && storedUri !== entry.uri) {
  setEntries((current) =>
    current.map((item) =>
      item.id === entry.id
        ? { ...item, uri: storedUri }
        : item
    )
  );
}

      if (!entryIds[entry.id]) {
        setEntryIds((current) => ({ ...current, [entry.id]: saved.id, [saved.id]: saved.id }));
        setEntries((current) => current.map((item) =>
          item.id === entry.id ? { ...item, id: saved.id } : item
        ));
      }



if (processContent) {
  let processingSucceeded = false;

  if (
    !entryIds[entry.id] &&
    entry.itemType === "image" &&
    entry.imageBase64
  ) {
    const packet = await buildReflectionPacket({
      text: rawText,
      imageBase64: entry.imageBase64,
    });

    const processed = await processSovereignLifePicture({
      userId,
      text: packet.text,
      imageBase64: entry.imageBase64,
    });

    processingSucceeded = Boolean(processed);

if (processingSucceeded) {
  setEntries((current) =>
    current.map((item) =>
      item.id === entry.id
        ? { ...item, imageBase64: undefined }
        : item
    )
  );
}

  } else if (
    !entryIds[entry.id] &&
    entry.itemType === "voice" &&
    entry.uri &&
    !entry.uri.startsWith("http")
  ) {
    const packet = await buildReflectionPacket({
      text: rawText,
      audioUri: entry.uri,
    });

    const processed = await processSovereignLifePicture({
      userId,
      text: packet.text,
    });

    processingSucceeded = Boolean(processed);

  } else {
    const processed = await processSovereignLifePicture({
      userId,
      text: rawText,
    });

    processingSucceeded = Boolean(processed);
  }

  // Notify Sovereign I only after successful processing.
  if (processingSucceeded) {
    try {
      await sovereignI({
        eventId: `vision-board-${Date.now()}`,
        eventType: "expression.processed",
        category: "domain",
        source: "vision_board",
        occurredAt: new Date().toISOString(),
        payload: {
          source: "vision_board",
          itemType: entry.itemType,
        },
        persistence: "persistent",
contextImpact: ["user", "livingField", "creation"],
      });
    } catch (error) {
      console.error(
        "SOVEREIGN I VISION BOARD EVENT ERROR:",
        error
      );
    }
  }
}

    } catch (error) {
      console.error("❌ SOVEREIGN LIFE PICTURE SAVE ERROR:", error);
    }
  };

const deleteEntry = async (entry: LifeEntry) => {
  try {
    const savedId = entryIds[entry.id];

    console.log("DELETE DEBUG:", {
  entryId: entry.id,
  savedId,
  entryIds,
});

    // Delete from Supabase first, if this entry has been saved
    if (savedId) {
      const userId = await getUserId();

      if (!userId) {
        console.error("❌ DELETE FAILED: USER NOT FOUND");
        return;
      }

      const { data, error } = await supabase
        .from("sovereign_life_pictures")
        .delete()
        .eq("id", savedId)
        .eq("user_id", userId)
        .select("id");

      if (error) {
        console.error("❌ LIFE ENTRY DELETE ERROR:", error);
        return;
      }

      if (!data || data.length === 0) {
        console.error("❌ DELETE FAILED: NO DATABASE ROW WAS DELETED");
        return;
      }
    }

    // Remove from the board only after successful database deletion
    setEntries((current) =>
      current.filter((item) => item.id !== entry.id)
    );

    setEntryIds((current) => {
      const next = { ...current };
      delete next[entry.id];
      if (savedId) delete next[savedId];
      return next;
    });

  } catch (error) {
    console.error("❌ LIFE ENTRY DELETE ERROR:", error);
  }
}; 

const handleVoice = async () => {
  try {
    if (!recording) {
      const permission = await Audio.requestPermissionsAsync();

      if (!permission.granted) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      return;
    }

    await recording.stopAndUnloadAsync();

    const uri = recording.getURI();
    setRecording(null);

    if (!uri) return;

    const index = entries.length;

    const entry: LifeEntry = {
      id: `life-${Date.now()}`,
      text: "",
      itemType: "voice",
      uri,
      mimeType: Platform.OS === "web" ? "audio/webm" : "audio/m4a",
      x: (index % 2) * 135 + 10,
      y: Math.floor(index / 2) * 150 + 10,
      width: 180,
      height: 120,
      rotation: 0,
    };

    setEntries((current) => [...current, entry]);
    void saveEntry(entry);

  } catch (error) {
    console.error("🎤 SOVEREIGN VOICE ERROR:", error);
    setRecording(null);
  }
};


const playVoice = async (entry: LifeEntry) => {
  if (!entry.uri) return;

  try {
    // Stop and unload any previous recording.
    if (voiceSound) {
      await voiceSound.stopAsync();
      await voiceSound.unloadAsync();
      setVoiceSound(null);
      setPlayingVoice(null);
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: entry.uri },
      { shouldPlay: true }
    );

    setVoiceSound(sound);
    setPlayingVoice(entry.id);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        setPlayingVoice(null);
        setVoiceSound(null);
        void sound.unloadAsync();
      }
    });

  } catch (error) {
    console.error("🎤 VOICE PLAYBACK ERROR:", error);
    setPlayingVoice(null);
    setVoiceSound(null);
  }
};


const addText = async () => {
  const index = entries.length;

  const entry: LifeEntry = {
    id: `life-${Date.now()}`,
    text: "What Matters..",
    itemType: "text",
    x: (index % 2) * 135 + 10,
    y: Math.floor(index / 2) * 150 + 10,
    width: 180,
    height: 120,
    rotation: 0,
  };

  setEntries((current) => [...current, entry]);

  await saveEntry(entry);
};

  const addImage = async () => {
    try {
      const image = await pickSovereignImage();
      if (!image) return;
      const index = entries.length;
      const entry: LifeEntry = {
        id: `life-${Date.now()}`,
        text: "",
        itemType: "image",
        uri: image.originalUri,
        imageBase64: image.base64,
        mimeType: image.mimeType,
        x: (index % 2) * 135 + 10,
        y: Math.floor(index / 2) * 150 + 10,
        width: 180,
        height: 140,
        rotation: index % 2 === 0 ? -1.2 : 1.2,
      };
      setEntries((current) => [...current, entry]);
      void saveEntry(entry);
    } catch (error) {
      console.error("❌ LIFE ENTRY IMAGE ERROR:", error);
    }
  };

  const addQuote = () => {
    const index = entries.length;
    const entry: LifeEntry = {
      id: `life-${Date.now()}`,
      text: "",
      itemType: "quote",
      x: (index % 2) * 135 + 10,
      y: Math.floor(index / 2) * 150 + 10,
      width: 320,
      height: 240,
      rotation: index % 2 === 0 ? -1.2 : 1.2,
    };
    setEntries((current) => [...current, entry]);
    void saveEntry(entry);
  };

    return (
    <View style={styles.container}>
      {/* SQUARE VIEWPORT */}
<View
  style={styles.boardViewport}
  onLayout={(event) => {
    const { width, height } = event.nativeEvent.layout;
    setBoardSize({ width, height });
  }}
>

        {/* SCROLLABLE CONTENT */}
<ScrollView
  style={styles.boardScroll}
  onScroll={(event) =>
    setScrollOffset(event.nativeEvent.contentOffset.y)
  }
  scrollEventThrottle={16}
  contentContainerStyle={styles.boardContent}
  showsVerticalScrollIndicator={true}
  nestedScrollEnabled
  directionalLockEnabled
>
          <View style={styles.board}>
            {entries.map((entry) => {
              const panResponder = PanResponder.create({
                // Let vertical gestures scroll the board.
                // Horizontal gestures can still move entries.
onStartShouldSetPanResponder: () => false,

onMoveShouldSetPanResponder: (_, gesture) =>
  Math.abs(gesture.dx) > 5 ||
  Math.abs(gesture.dy) > 5,

onPanResponderMove: (_, gesture) => {
  setEntries((current) =>
    current.map((item) =>
      item.id === entry.id
        ? {
            ...item,
            x: entry.x + gesture.dx,
            y: entry.y + gesture.dy,
          }
        : item
    )
  );
},

onPanResponderRelease: (_, gesture) => {
  const finalX = entry.x + gesture.dx;
  const finalY = entry.y + gesture.dy;

void saveEntry(
  {
    ...entry,
    x: finalX,
    y: finalY,
  },
  false
);
},
              });

return (
  <View
   {...panResponder.panHandlers}

    key={entry.id}
    style={[

      entry.itemType === "quote"
        ? styles.quoteEntry
        : styles.entry,
      {
        left: entry.x,
        top: entry.y,
        width: entry.width,
        height: entry.height,
        transform: [
          { rotate: `${entry.rotation}deg` },
        ],
      },
    ]}
  >

{entry.itemType === "image" && entry.uri ? (
  <Image
    source={{ uri: entry.uri }}
    style={styles.entryImage}
    resizeMode="cover"
  />
) : entry.itemType === "voice" && entry.uri ? (
  <Pressable
    onPress={() => void playVoice(entry)}
    style={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(201,173,112,0.08)",
      borderRadius: 8,
    }}
  >
    <Text style={{ color: "#C9AD70", fontSize: 22 }}>
      {playingVoice === entry.id ? "♫" : "▶"}
    </Text>
    <Text style={{ color: "#AAA2B6", fontSize: 10, marginTop: 6 }}>
      {playingVoice === entry.id ? "PLAYING..." : "VOICE NOTE"}
    </Text>
  </Pressable>
) : entry.itemType === "quote" ? (
                    <View style={styles.quoteCard}>
                      <Text style={styles.quoteMark}>“</Text>
                      <TextInput
                        value={entry.text}
                        onChangeText={(value) => {
                          const estimatedLines = Math.max(
                            1,
                            Math.ceil(value.length / 34)
                          );
                          const nextHeight = Math.max(
                            120,
                            estimatedLines * 24 + 60
                          );

                          setEntries((current) =>
                            current.map((item) =>
                              item.id === entry.id
                                ? {
                                    ...item,
                                    text: value,
                                    height: nextHeight,
                                  }
                                : item
                            )
                          );
                        }}
                        onBlur={() => {
                          const current = entries.find(
                            (item) => item.id === entry.id
                          );
                          if (current) void saveEntry(current);
                        }}
                        multiline
                        placeholder="Your quote..."
                        placeholderTextColor="#77746F"
                        style={styles.quoteText}
                      />
                      <Text style={styles.quoteMark}>”</Text>
                    </View>
                  ) : (
                    <TextInput
                      value={entry.text}
                      onChangeText={(value) =>
                        setEntries((current) =>
                          current.map((item) =>
                            item.id === entry.id
                              ? { ...item, text: value }
                              : item
                          )
                        )
                      }
                      onBlur={() => {
                        const current = entries.find(
                          (item) => item.id === entry.id
                        );
                        if (current) void saveEntry(current);
                      }}
                      multiline
                      placeholder="What matters to you?"
                      placeholderTextColor="#77746F"
                      style={styles.entryText}
                    />
                     )}

                <Pressable
onPress={() => {
  console.log("DELETE BUTTON CLICKED", entry.id);
  void deleteEntry(entry);
}}
                  style={styles.entryDelete}
                  accessibilityRole="button"
                  accessibilityLabel="Delete artefact"
                >
                  <Text style={styles.entryDeleteText}>×</Text>
                </Pressable>

                </View>
              );
            })}
          </View>
        </ScrollView>

{/* FIXED TOOLBAR */}
<View style={styles.controls}>
  <Pressable
    onPress={() => void addImage()}
    style={styles.toolButton}
  >
<Text style={styles.toolIcon}>📷</Text>
  </Pressable>

  <Pressable
  onPress={addText}
  style={styles.toolButton}
  accessibilityRole="button"
  accessibilityLabel="Add text"
>
<Text style={styles.toolIcon}>▤</Text>
</Pressable>

<Pressable
  onPress={() => void handleVoice()}
  style={styles.toolButton}
>
  <Text
    style={[
      styles.toolIcon,
      recording ? { color: "#C9AD70" } : null,
    ]}
  >
    {recording ? "■" : "♫"}
  </Text>
</Pressable>

  <Pressable
    onPress={addQuote}
    style={styles.toolButton}
  >
    <Text style={styles.toolIcon}>“</Text>
  </Pressable>

  <Pressable
    style={styles.toolButton}
    disabled
  >
    <Text style={[styles.toolIcon, styles.disabled]}>↗</Text>
  </Pressable>

  <Pressable
    style={styles.toolButton}
    disabled
  >
    <Text style={[styles.toolIcon, styles.disabled]}>⌁</Text>
  </Pressable>
</View>


        {/* FIXED FOOTER */}
        <Text style={styles.boardTitle}>
          WHAT MATTERS TO ME
        </Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%"},

boardViewport: {
  width: "100%",
  maxWidth: 350,
  height: 265,
  maxHeight: 265,
  alignSelf: "flex-end",
  marginRight: 25,
  paddingLeft: 10,
  position: "relative",
  overflow: "hidden",
  backgroundColor: "rgba(255,255,255,0.018)",
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.05)",
},

  eyebrow: {
    color: Colors.mutedText,
    fontFamily: Fonts.light,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 10,
  },

boardScroll: {
  ...StyleSheet.absoluteFillObject,
  top: 30,
  zIndex: 0,
},

boardContent: {
  minHeight: 620,
},

board: {
  position: "relative",
  width: "100%",
  height: 620,
},
boardTitle: {
  position: "absolute",
  top: 10,
  left: 12,
  zIndex: 5,
  color: "#AAA2B6",
  fontSize: 9,
  letterSpacing: 1.8,
  fontWeight: "400",
},

  entry: {
    position: "absolute",
    padding: 14,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },

  entryDelete: {
  position: "absolute",
  top: 3,
  right: 5,
  zIndex: 20,
  width: 24,
  height: 24,
  alignItems: "center",
  justifyContent: "center",
},

entryDeleteText: {
  color: "#88838E",
  fontSize: 19,
  lineHeight: 22,
},

  entryImage: { width: "100%", height: "100%", borderRadius: 6 },
  entryText: {
    flex: 1,
    color: Colors.white,
    fontFamily: Fonts.light,
    fontSize: 11,
    lineHeight: 18,
    padding: 0,
    textAlignVertical: "top",
  },

  dragHandle: {
  position: "absolute",
  top: 3,
  right: 4,
  zIndex: 5,
  width: 24,
  height: 22,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 6,
  backgroundColor: "rgba(255,255,255,0.07)",
},

dragHandleIcon: {
  color: "#B9AE9A",
  fontSize: 17,
},

  quoteCard: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  quoteMark: { color: Colors.mutedText, fontFamily: Fonts.light, fontSize: 28, lineHeight: 28 },
  quoteEntry: { position: "absolute", padding: 0, backgroundColor: "transparent", borderWidth: 0 },
  quoteText: {
    width: "100%",
    color: Colors.white,
    fontFamily: Fonts.light,
    fontSize: 13,
    lineHeight: 24,
    fontStyle: "italic",
    textAlign: "center",
    padding: 0,
    textAlignVertical: "center",
  },

controls: {
  position: "absolute",
  right: 10,
  bottom: 12,
  alignItems: "center",
  gap: 8,
  zIndex: 10,
},

toolButton: {
  width: 27,
  height: 27,
  alignItems: "center",
  justifyContent: "center",
},

toolIcon: {
  color: "#88838E",
  fontSize: 19,
},

disabled: {
  opacity: 0.3,
},  
addButton: {
  position: "absolute",
  right: 12,
  bottom: 7,
  width: 28,
  height: 28,
  alignItems: "center",
  justifyContent: "center",
  zIndex: 30,
  elevation: 30,
},

addButtonText: {
  color: Colors.mutedText,
  fontFamily: Fonts.light,
  fontSize: 22,
  lineHeight: 22,
},
menu: {
  position: "absolute",
  right: 12,
  bottom: 44,
  paddingVertical: 6,
  paddingHorizontal: 5,
  minWidth: 110,
  backgroundColor: "#11110F",
  borderRadius: 9,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.10)",
  zIndex: 20,
},
  menuItem: { paddingVertical: 8, paddingHorizontal: 10 },
  menuText: { color: Colors.mutedText, fontFamily: Fonts.light, fontSize: 8, letterSpacing: 1.2 },
});