
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { getUserId } from "../../lib/user";
import { supabase } from "../../services/supabase";

import MyCreations, {
  CreationItem,
} from "./creationJourney/MyCreations";

import JourneyStages, {
  STAGES,
} from "./creationJourney/JourneyStages";

import StageDiscover from "./creationJourney/stages/StageDiscover";
import StageDream from "./creationJourney/stages/StageDream";

const MUTED = "#AAA2B6";
const BORDER = "rgba(201,173,112,0.22)";

export default function CreationJourney() {
  const { width } = useWindowDimensions();
  const wide = width >= 1050;

  const [activeStage, setActiveStage] = useState("dream");
  const [creations, setCreations] = useState<CreationItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadCreations = async () => {
      try {
        const userId = await getUserId();
        if (!userId) return;

        const { data, error } = await supabase
          .from("sovereign_intentions")
          .select(
            "id, raw_input, outcome, status, spiral_stage, created_at, updated_at"
          )
          .eq("user_id", userId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        if (!active) return;

        const items: CreationItem[] = (data || []).map((row) => ({
          id: row.id,
          title: row.raw_input || "",
          description: row.outcome || "",
        }));

        setCreations(items);

        if (items.length > 0) {
          setSelectedId(items[0].id);
        }
      } catch (error) {
        console.error("CREATIONS LOAD ERROR:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadCreations();

    return () => {
      active = false;
    };
  }, []);

  const updateCreation = async (
    updates: Partial<CreationItem>
  ) => {
    if (!selectedId) return;

    setCreations((current) =>
      current.map((item) =>
        item.id === selectedId ? { ...item, ...updates } : item
      )
    );

    const dbUpdates: Record<string, string> = {};

    if (updates.title !== undefined) {
      dbUpdates.raw_input = updates.title;
    }

    if (updates.description !== undefined) {
      dbUpdates.outcome = updates.description;
    }

    if (Object.keys(dbUpdates).length === 0) return;

    const { error } = await supabase
      .from("sovereign_intentions")
      .update(dbUpdates)
      .eq("id", selectedId);

    if (error) {
      console.error("CREATION UPDATE ERROR:", error);
    }
  };

  const createCreation = async () => {
    try {
      const userId = await getUserId();
      if (!userId) return;

      const { data, error } = await supabase
        .from("sovereign_intentions")
        .insert({
          user_id: userId,
          raw_input: "New creation",
          status: "active",
          spiral_stage: "dream",
        })
        .select(
          "id, raw_input, outcome, status, spiral_stage, created_at, updated_at"
        )
        .single();

      if (error) throw error;

      const newCreation: CreationItem = {
        id: data.id,
        title: data.raw_input || "",
        description: data.outcome || "",
      };

      setCreations((current) => [...current, newCreation]);
      setSelectedId(data.id);
      setActiveStage("dream");
    } catch (error) {
      console.error("CREATION CREATE ERROR:", error);
    }
  };


  // DELETE A CREATION AND ITS RELATED DATA
  const deleteCreation = async (id: string) => {
    try {
      const userId = await getUserId();
      if (!userId) return;

      const { error } = await supabase
        .from("sovereign_intentions")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) throw error;

      setCreations((current) => {
        const remaining = current.filter((item) => item.id !== id);

        if (selectedId === id) {
          setSelectedId(remaining[0]?.id ?? null);
          setActiveStage("dream");
        }

        return remaining;
      });
    } catch (error) {
      console.error("CREATION DELETE ERROR:", error);
    }
  };

  const selected =
    STAGES.find((stage) => stage.id === activeStage) ?? STAGES[0];

  return (
    <View style={styles.container}>
      {/* SMALL, SCROLLABLE CREATION NOTES */}
      <MyCreations
        creations={creations}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onCreate={createCreation}
        onDelete={deleteCreation}
        onUpdateTitle={(value) => updateCreation({ title: value })}
        onUpdateDescription={(value) =>
          updateCreation({ description: value })
        }
      />

      {/* JOURNEY + ARTEFACTS */}
      <View style={[styles.contentRow, !wide && styles.contentNarrow]}>
<View
  style={[
    styles.middlePanel,
    !wide && styles.middlePanelNarrow,
  ]}
>
          <View style={styles.journeyContent}>
            <JourneyStages
              activeStage={activeStage}
              onSelect={setActiveStage}
            />

            <ScrollView
              style={styles.stageScroll}
              contentContainerStyle={styles.stageScrollContent}
              showsVerticalScrollIndicator
            >
<View style={styles.selected}>
  <Text style={styles.selectedTitle}>
    {selected.label}
  </Text>

  <Text style={styles.selectedPrompt} numberOfLines={1}>
    {selected.prompt}
  </Text>
</View>

              {!loading && selectedId && activeStage === "dream" && (
                <StageDream intentionId={selectedId} />
              )}

              {!loading && selectedId && activeStage === "discover" && (
                <StageDiscover intentionId={selectedId} />
              )}
            </ScrollView>
          </View>
        </View>

        <View style={[styles.sidePanel, !wide && styles.sidePanelNarrow]}>
          <View style={styles.artifactHeader}>
            <Text style={styles.artifactTitle}>CREATION ARTEFACTS</Text>
            <Text style={styles.artifactSymbol}>✧</Text>
          </View>

          <View style={styles.artifactCanvas}>
            <Text style={styles.artifactMessage}>
              Your ideas are taking shape.
            </Text>
            <Text style={styles.emptySubtext}>
              Plans, experiments, images and outcomes will gather here.
            </Text>
            <View style={styles.artifactDecoration}>
              <Text style={styles.artifactDecorationText}>✧</Text>
              <Text style={styles.artifactDecorationText}>◈</Text>
              <Text style={styles.artifactDecorationText}>✦</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "stretch",
    gap: 1,
    marginTop: 2,
    marginBottom: 20,
  },

  contentRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "stretch",
    gap: 12,
  },

contentNarrow: {
  flexDirection: "column",
  gap: 12,
},

middlePanelNarrow: {
  flex: 0,
},

middlePanel: {
flex: 2.72,
  minWidth: 0,
  minHeight: 145,
  padding: 10,
  borderRadius: 11,
  borderWidth: 1,
  borderColor: "rgba(201,173,112,0.35)",
  backgroundColor: "rgba(16,16,24,0.35)",
},

  journeyContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    minHeight: 120,
  },

  selectedPrompt: {
  color: MUTED,
  fontSize: 10,
  lineHeight: 14,
  marginTop: 2,
},

  stageScroll: {
    flex: 1,
    minWidth: 0,
  },

  stageScrollContent: {
    paddingBottom: 12,
  },

  stageWorkspace: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
    paddingLeft: 14,
    borderLeftWidth: 1,
    borderLeftColor: BORDER,
  },

  selected: {
    paddingTop: 4,
    paddingBottom: 8,
  },

  selectedTitle: {
    color: "#E4C58B",
    fontSize: 14,
    fontWeight: "600",
  },

sidePanel: {
  flex: 1,
  minWidth: 0,
  minHeight: 145,
  padding: 12,
  borderRadius: 11,
  borderWidth: 1,
  borderColor: BORDER,
  backgroundColor: "rgba(18,16,23,0.55)",
},

  sidePanelNarrow: {
    width: "100%",
    flex: 0,
  },

  artifactHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  artifactTitle: {
    color: "#D8C9AE",
    fontSize: 9,
    letterSpacing: 1.7,
    fontWeight: "600",
  },

  artifactSymbol: {
    color: "#C9AD70",
    fontSize: 20,
  },

  artifactCanvas: {
    flex: 1,
    minHeight: 90,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  artifactMessage: {
    color: "#E4C58B",
    fontSize: 13,
    fontWeight: "500",
  },

  emptySubtext: {
    color: MUTED,
    fontSize: 10,
    lineHeight: 16,
    textAlign: "center",
    maxWidth: 230,
  },

  artifactDecoration: {
    flexDirection: "row",
    gap: 22,
    marginTop: 8,
  },

  artifactDecorationText: {
    color: "#776B59",
    fontSize: 22,
  },
});
