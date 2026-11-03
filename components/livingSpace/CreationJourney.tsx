
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
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

import JourneyToSovereignI from "./JourneyToSovereignI";

import BuildStage from "./creationJourney/stages/StageBuild";
import StageDiscover from "./creationJourney/stages/StageDiscover";
import StageDream from "./creationJourney/stages/StageDream";
import StageGrow from "./creationJourney/stages/StageGrow";
import StageRenew from "./creationJourney/stages/StageRenew";
import StageScale from "./creationJourney/stages/StageScale";

const MUTED = "#AAA2B6";
const BORDER = "rgba(201,173,112,0.22)";

export default function CreationJourney() {

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



      {/* CREATION JOURNEY — FULL WIDTH */}
      <View style={styles.contentRow}>
        <View style={styles.middlePanel}>
          <View style={styles.journeyContent}>
            <View style={styles.journeyStagesOffset}>
              <JourneyStages
                activeStage={activeStage}
                onSelect={setActiveStage}
              />
            </View>

 
<View style={styles.stageArea}>
<View style={styles.selected}>
  <Text style={styles.selectedTitle}>
    {selected.label}
  </Text>
  <Text
    style={styles.selectedPrompt}
    numberOfLines={1}
  >
    {selected.prompt}
  </Text>
</View>

  {!loading && selectedId && activeStage === "build" && (
    <BuildStage intentionId={selectedId} />
  )}

  {!loading && selectedId && activeStage === "grow" && (
    <StageGrow intentionId={selectedId} />
  )}

  {!loading && selectedId && activeStage === "scale" && (
    <StageScale intentionId={selectedId} />
  )}

  {!loading && selectedId && activeStage === "renew" && (
    <StageRenew intentionId={selectedId} />
  )}

  {!loading && selectedId && activeStage === "dream" && (
    <StageDream intentionId={selectedId} />
  )}

{!loading && selectedId && activeStage === "discover" && (
  <View style={styles.discoverFullWidth}>
    <StageDiscover intentionId={selectedId} />
  </View>
)}
</View>

          </View>
        </View>
      </View>

      {/* SOVEREIGN I — SEPARATE FULL-WIDTH WORKSPACE */}
      <View style={styles.sovereignPanel}>
        <JourneyToSovereignI />
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "stretch",
    gap: 1,
    marginTop: 0,
    marginBottom: 20,
  },


contentRow: {
  width: "100%",
  flexDirection: "row",
  alignItems: "stretch",
},

middlePanel: {
  flex: 1,
  width: "100%",
  height: 130,
  minWidth: 0,
  minHeight: 130,
  maxHeight: 130,
  padding: 10,
  backgroundColor: "transparent",
  borderWidth: 0,
  borderRadius: 0,
},

discoverFullWidth: {
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  marginLeft: 0,
  marginRight: -10,
},

sovereignPanel: {
  width: "100%",
  minWidth: 0,
  minHeight: 175,
  marginTop: 12,
  paddingTop: 10,
  backgroundColor: "transparent",
},


journeyStagesOffset: {
  transform: [{ translateX: -12 }],
},

journeyContent: {
  flex: 1,
  flexDirection: "row",
  alignItems: "stretch",
  minHeight: 0,
},

stageArea: {
  flex: 1,
  minWidth: 0,
  minHeight: 0,
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
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  paddingTop: 4,
  paddingBottom: 8,
},

selectedTitle: {
  color: "#E4C58B",
  fontSize: 14,
  fontWeight: "600",
},

selectedPrompt: {
  color: MUTED,
  fontSize: 10,
  lineHeight: 14,
  marginTop: 0,
  flexShrink: 1,
},

sidePanel: {
  flex: 1,
  height: 190,
  minHeight: 190,
  maxHeight: 190,
  minWidth: 0,
  padding: 0,
  borderWidth: 0,
  borderRadius: 0,
  backgroundColor: "transparent",
},

  sidePanelNarrow: {
    width: "100%",
    flex: 0,
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
