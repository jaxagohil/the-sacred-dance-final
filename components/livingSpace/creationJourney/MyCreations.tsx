
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const GOLD = "#C9AD70";

export type CreationItem = {
  id: string;
  title: string;
  description: string;
};

type Props = {
  creations: CreationItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onUpdateTitle: (value: string) => void;
  onUpdateDescription: (value: string) => void;
};

const NOTE_COLOURS = [
  "#E9DCC3",
  "#DCCFE5",
  "#D5E2D0",
  "#E8D0CF",
  "#D8DFE8",
];

export default function MyCreations({
  creations,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
  onUpdateTitle,
}: Props) {

const [deleteTarget, setDeleteTarget] = useState<CreationItem | null>(null);

const confirmDelete = () => {
  if (!deleteTarget) return;

  onDelete(deleteTarget.id);
  setDeleteTarget(null);
};

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.eyebrow}>MY CREATIONS</Text>

      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.notes}
        style={styles.notesWindow}
      >
        {creations.map((item, index) => {
          const selected = item.id === selectedId;
          const noteColour =
            NOTE_COLOURS[index % NOTE_COLOURS.length];

          return (
            <View
              key={item.id}
              style={[
                styles.note,
                { backgroundColor: noteColour },
                selected && styles.noteSelected,
              ]}
            >
              <Pressable
                style={styles.deleteButton}
onPress={() => setDeleteTarget(item)}
                hitSlop={8}
              >
                <Feather name="x" size={12} color="#62584D" />
              </Pressable>

              <Pressable
                style={styles.noteContent}
                onPress={() => onSelect(item.id)}
              >
                {selected ? (
                  <TextInput
                    value={item.title}
                    onChangeText={onUpdateTitle}
                    placeholder="Your idea..."
                    placeholderTextColor="#81796E"
                    style={styles.noteInput}
                    multiline
                    accessibilityLabel="Creation title"
                  />
                ) : (
                  <Text style={styles.noteText} numberOfLines={4}>
                    {item.title || "Untitled"}
                  </Text>
                )}
              </Pressable>
            </View>
          );
        })}
        <Pressable onPress={onCreate} style={styles.addNote}>
          <Feather name="plus" size={17} color={GOLD} />
        </Pressable>
      </ScrollView>

      <Modal
  transparent
  visible={!!deleteTarget}
  animationType="fade"
  onRequestClose={() => setDeleteTarget(null)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.confirmBox}>
      <Text style={styles.confirmTitle}>Delete creation?</Text>

      <Text style={styles.confirmText}>
        "{deleteTarget?.title || "Untitled"}" and its related journey
        data and artefacts will be deleted.
      </Text>

      <View style={styles.confirmActions}>
        <Pressable onPress={() => setDeleteTarget(null)}>
          <Text style={styles.cancelText}>Keep it</Text>
        </Pressable>

        <Pressable onPress={confirmDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  </View>
</Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 5,
    gap: 9,
  },

  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },

  eyebrow: {
    color: "#81796E",
    fontSize: 9,
    letterSpacing: 1.7,
    fontWeight: "500",
  },

notesWindow: {
  width: 550,
  height: 72,
  flexGrow: 0,
  flexShrink: 0,
},

  notes: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 2,
    paddingRight: 8,
  },

note: {
  width: 66,
  height: 56,
  padding: 7,
  paddingTop: 5,
  borderRadius: 3,
  justifyContent: "center",
  transform: [{ rotate: "-1deg" }],
  elevation: 2,
},

  noteSelected: {
    borderWidth: 2,
    borderColor: GOLD,
    transform: [{ rotate: "0deg" }],
  },

  noteContent: {
    flex: 1,
    justifyContent: "center",
  },

  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.7)",
  justifyContent: "center",
  alignItems: "center",
  padding: 24,
},

confirmBox: {
  width: "100%",
  maxWidth: 320,
  backgroundColor: "#20201E",
  borderWidth: 1,
  borderColor: "rgba(201,173,112,0.5)",
  borderRadius: 10,
  padding: 22,
  gap: 14,
},

confirmTitle: {
  color: GOLD,
  fontSize: 15,
  fontWeight: "600",
},

confirmText: {
  color: "#E8E2D8",
  fontSize: 12,
  lineHeight: 18,
},

confirmActions: {
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: 24,
  marginTop: 8,
},

cancelText: {
  color: "#B9B1A5",
  fontSize: 12,
},

deleteText: {
  color: "#E59B91",
  fontSize: 12,
  fontWeight: "600",
},

  deleteButton: {
    position: "absolute",
    top: 3,
    right: 4,
    zIndex: 2,
    padding: 2,
  },

  noteText: {
    color: "#39332B",
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "600",
  },

  noteInput: {
    color: "#39332B",
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "600",
    padding: 0,
    minHeight: 35,
    textAlignVertical: "center",
  },

  addNote: {
width: 32,
height: 32,
borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(201,173,112,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
});
