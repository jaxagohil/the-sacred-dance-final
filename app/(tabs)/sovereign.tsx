/**
 * Sovereign I — FINAL UI
 *
 * Frozen architecture:
 * 25% What Matters | 50% Creations | 25% What This Creation Is Changing
 *
 * Creation Journey:
 *   | "dream"
 *   | "discover"
 *   | "build"
 *   | "grow"
 *   | "scale"
 *   | "renew";
 *
 * Patterns are visible inside the creation journey.
 * The Living Field remains the intelligence underneath.
 *
 * Right column:
 * I | People | Planet
 *
 * Mobile:
 * three horizontal swipeable pages:
 * What Matters ⇆ Creations ⇆ I / People / Planet
 *
 * UI/local interaction only.
 * Existing data, signals and buildUserContext logic connect later.
 */

import React, { useEffect, useState } from "react";

import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";


import { processSovereignLifePicture } from "../../db/processSovereignLifePicture";
import { saveSovereignLifePicture } from "../../db/saveSovereignLifePicture";

import { chooseNextMove } from "../../lib/consciousCreating/agents/mirror/chooseNextMove";
import type { NextMove } from "../../lib/consciousCreating/agents/mirror/generateNextMoves";
import { mirrorBuild } from "../../lib/consciousCreating/agents/mirror/mirrorBuild";

import {
  discoverConsciousDesire,
  getCreationContext,
} from "../../lib/consciousCreating";

import { getUserId } from "../../lib/user";
import { supabase } from "../../services/supabase";

import { Colors, Fonts } from "../../constants/theme";

type IntentionState = "intention" | "exploring" | "creation";

type Intention = {
  id: string;
  text: string;
  state: IntentionState;
};

type LifeEntry = {
  id: string;
  text: string;
};

type JourneyStage =
  | "dream"
  | "discover"
  | "build"
  | "grow"
  | "scale"
  | "renew";

const JOURNEY: {
  id: JourneyStage;
  label: string;
  number: string;
  prompt: string;
}[] = [
  {
    id: "dream",
    label: "DREAM",
    number: "01",
    prompt: "What do you see, feel or imagine? This is your space. Dream away.",
  },
  {
    id: "discover",
    label: "DISCOVER",
    number: "02",
    prompt: "Conscious Desire",
  },
  {
    id: "build",
    label: "BUILD",
    number: "03",
    prompt: "What wants to become real? Bring it into conversation. Let reality answer back.",
  },
  {
    id: "grow",
    label: "GROW",
    number: "04",
    prompt: "What is alive, and what is ready to grow? Be open to what wants to support you.",
  },
  {
    id: "scale",
    label: "SCALE",
    number: "05",
    prompt: "Where could this expand? Notice what is already available to receive.",
  },
  {
    id: "renew",
    label: "RENEW",
    number: "06",
    prompt: "What has changed, what can be released, and what wants to emerge? Listen to your heart.",
  },
];

// UI placeholder only. Existing 18-pattern structure will replace this in Step 2.
type CreationPattern = {
  id: string;
  name: string;
  leftPole: string;
  rightPole: string;
  position: number;
};

type Artifact = {
  id: string;
  intention_id: string;
  area: "I" | "People" | "Planet";
  artifact_type: string;
  title: string;
  content: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export default function SovereignIConsole() {
  const { width } = useWindowDimensions();
  const mobile = width < 900;

const [intentions, setIntentions] = useState<Intention[]>([]);

const [selectedIntentionId, setSelectedIntentionId] =
  useState<string | null>(null);

const [intentionsLoaded, setIntentionsLoaded] =
  useState(false);

useEffect(() => {
  const loadIntentions = async () => {
    try {
      const userId = await getUserId();

      if (!userId) {
        return;
      }

      const { data, error } = await supabase
        .from("sovereign_intentions")
        .select(
          "id, raw_input, outcome, status, spiral_stage, created_at, updated_at"
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error(
          "❌ SOVEREIGN INTENTIONS LOAD ERROR:",
          error
        );
        return;
      }

      const rows = data || [];

      setIntentions(
        rows.map((row) => ({
          id: row.id,
          text: row.raw_input || "",
          state:
            row.status === "creation"
              ? "creation"
              : row.status === "exploring"
                ? "exploring"
                : "intention",
        }))
      );

      if (rows.length > 0) {
        setSelectedIntentionId(rows[0].id);
      }
    } catch (error) {
      console.error(
        "❌ SOVEREIGN INTENTIONS LOAD ERROR:",
        error
      );
    } finally {
      setIntentionsLoaded(true);
    }
  };

  loadIntentions();
}, []);  

useEffect(() => {
  const loadJourneySteps = async () => {
if (!selectedIntentionId) {
  setJourneyData({
    dream: {},
    discover: {},
    build: {},
    grow: {},
    scale: {},
    renew: {},
  });
  return;
}

    const { data, error } = await supabase
      .from("sovereign_intention_steps")
      .select("step, response")
      .eq("intention_id", selectedIntentionId);

    if (error) {
      console.error(
        "❌ SOVEREIGN JOURNEY LOAD ERROR:",
        error
      );
      return;
    }

    const rows = data || [];

const dreamRow = rows.find((row) => row.step === "dream");
const discoverRow = rows.find((row) => row.step === "discover");
const buildRow = rows.find((row) => row.step === "build");
const growRow = rows.find((row) => row.step === "grow");
const scaleRow = rows.find((row) => row.step === "scale");
const renewRow = rows.find((row) => row.step === "renew");

setJourneyData({
  dream:
    dreamRow?.response &&
    typeof dreamRow.response === "object" &&
    !Array.isArray(dreamRow.response)
      ? (dreamRow.response as Record<string, unknown>)
      : dreamRow?.response
        ? { value: dreamRow.response }
        : {},

  discover:
    discoverRow?.response &&
    typeof discoverRow.response === "object" &&
    !Array.isArray(discoverRow.response)
      ? (discoverRow.response as Record<string, unknown>)
      : discoverRow?.response
        ? { value: discoverRow.response }
        : {},

  build:
    buildRow?.response &&
    typeof buildRow.response === "object" &&
    !Array.isArray(buildRow.response)
      ? (buildRow.response as Record<string, unknown>)
      : buildRow?.response
        ? { value: buildRow.response }
        : {},

  grow:
    growRow?.response &&
    typeof growRow.response === "object" &&
    !Array.isArray(growRow.response)
      ? (growRow.response as Record<string, unknown>)
      : growRow?.response
        ? { value: growRow.response }
        : {},

  scale:
    scaleRow?.response &&
    typeof scaleRow.response === "object" &&
    !Array.isArray(scaleRow.response)
      ? (scaleRow.response as Record<string, unknown>)
      : scaleRow?.response
        ? { value: scaleRow.response }
        : {},

  renew:
    renewRow?.response &&
    typeof renewRow.response === "object" &&
    !Array.isArray(renewRow.response)
      ? (renewRow.response as Record<string, unknown>)
      : renewRow?.response
        ? { value: renewRow.response }
        : {},
});
  };

  loadJourneySteps();
}, [selectedIntentionId]);

  const [activeStage, setActiveStage] =
    useState<JourneyStage>("dream");

  const [lifeEntries, setLifeEntries] = useState<LifeEntry[]>([
    {
      id: "life-1",
      text: "A simple, conscious life with love, peace, joy and enough space to create.",
    },
  ]);

  const [lifePictureIds, setLifePictureIds] =
  useState<Record<string, string>>({});

const [lifePictureLoaded, setLifePictureLoaded] =
  useState(false);

type CreationStageData = {
  dream: Record<string, unknown>;
  discover: Record<string, unknown>;
  build: Record<string, unknown>;
  grow: Record<string, unknown>;
  scale: Record<string, unknown>;
  renew: Record<string, unknown>;
};

const [journeyData, setJourneyData] =
  useState<CreationStageData>({
    dream: {},
    discover: {},
    build: {},
    grow: {},
    scale: {},
    renew: {},
  });

  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [nextStepOptions, setNextStepOptions] =
  useState<string[]>([]);

  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
const [artifactsLoaded, setArtifactsLoaded] = useState(false);

useEffect(() => {
  const loadArtifacts = async () => {
    if (!selectedIntentionId) {
      setArtifacts([]);
      setArtifactsLoaded(true);
      return;
    }

    setArtifactsLoaded(false);

    const { data, error } = await supabase
      .from("sovereign_intention_artifacts")
      .select(
        "id, intention_id, area, artifact_type, title, content, created_at, updated_at"
      )
      .eq("intention_id", selectedIntentionId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "❌ SOVEREIGN ARTIFACTS LOAD ERROR:",
        error
      );
      setArtifacts([]);
      setArtifactsLoaded(true);
      return;
    }

    setArtifacts((data || []) as Artifact[]);
    setArtifactsLoaded(true);
  };

  void loadArtifacts();
}, [selectedIntentionId]);

// --------------------------------------------------
// 💠 LIFE PICTURE — LOAD FROM DB
// --------------------------------------------------

useEffect(() => {
  const loadLifePictures = async () => {
    try {
      const userId = await getUserId();

      if (!userId) {
        return;
      }

      const {
        data,
        error,
      } = await supabase
        .from("sovereign_life_pictures")
        .select("id, picture, status, version, updated_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error(
          "❌ SOVEREIGN LIFE PICTURES LOAD ERROR:",
          error
        );
        return;
      }

      const rows = data || [];

      if (rows.length > 0) {
        setLifeEntries(
          rows.map((row) => ({
            id: row.id,
            text:
              typeof row.picture?.text === "string"
                ? row.picture.text
                : "",
          }))
        );

        setLifePictureIds(
          Object.fromEntries(
            rows.map((row) => [row.id, row.id])
          )
        );
      }
    } catch (error) {
      console.error(
        "❌ SOVEREIGN LIFE PICTURES LOAD ERROR:",
        error
      );
    } finally {
      setLifePictureLoaded(true);
    }
  };

  loadLifePictures();
}, []);

// --------------------------------------------------
// 💾 LIFE PICTURE — SAVE ONE ENTRY
// --------------------------------------------------

const saveLifeEntry = async (entry: LifeEntry) => {
  if (!lifePictureLoaded) {
    return;
  }

  const rawText = entry.text.trim();

  if (!rawText) {
    return;
  }

  try {
    const userId = await getUserId();

    if (!userId) {
      return;
    }

    const saved = await saveSovereignLifePicture({
      userId,
      lifePictureId: lifePictureIds[entry.id],
      text: rawText,
    });

if (saved && !lifePictureIds[entry.id]) {
  setLifePictureIds((current) => ({
    ...current,
    [entry.id]: saved.id,
    [saved.id]: saved.id,
  }));

  setLifeEntries((current) =>
    current.map((item) =>
      item.id === entry.id
        ? {
            ...item,
            id: saved.id,
          }
        : item
    )
  );
}

    console.log(
      "💾 SOVEREIGN LIFE PICTURE SAVED:",
      saved?.id
    );

    if (saved?.id) {

await processSovereignLifePicture({
  userId,
  text: rawText,
});

}

  } catch (error) {
    console.error(
      "❌ SOVEREIGN LIFE PICTURE SAVE ERROR:",
      error
    );
  }
};

const selectedIntention =
  intentions.find((item) => item.id === selectedIntentionId) || null;

const createIntention = async () => {
  try {
    const userId = await getUserId();

    if (!userId) {
      return;
    }

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

    if (error) {
      console.error(
        "❌ SOVEREIGN INTENTION CREATE ERROR:",
        error
      );
      return;
    }

    const newIntention: Intention = {
      id: data.id,
      text: data.raw_input || "",
      state:
        data.status === "creation"
          ? "creation"
          : data.status === "exploring"
            ? "exploring"
            : "intention",
    };

    setIntentions((current) => [...current, newIntention]);
    setSelectedIntentionId(data.id);
  } catch (error) {
    console.error(
      "❌ SOVEREIGN INTENTION CREATE ERROR:",
      error
    );
  }
};

const updateIntention = async (text: string) => {
  setIntentions((current) =>
    current.map((item) =>
      item.id === selectedIntentionId ? { ...item, text } : item
    )
  );

  if (!selectedIntentionId) {
    return;
  }

  const { error } = await supabase
    .from("sovereign_intentions")
    .update({
      raw_input: text,
    })
    .eq("id", selectedIntentionId);

  if (error) {
    console.error(
      "❌ SOVEREIGN INTENTION UPDATE ERROR:",
      error
    );
  }
};

const chooseStep = async (id: string) => {
  setSelectedStep(id);

  setIntentions((current) =>
    current.map((item) =>
      item.id === selectedIntentionId
        ? { ...item, state: "creation" }
        : item
    )
  );

  if (!selectedIntentionId) {
    return;
  }

  const { error } = await supabase
    .from("sovereign_intentions")
    .update({
      status: "creation",
    })
    .eq("id", selectedIntentionId);

  if (error) {
    console.error(
      "❌ SOVEREIGN INTENTION STATUS UPDATE ERROR:",
      error
    );
  }
};

  return (
    <View style={styles.screen}>
<ScrollView
  horizontal={mobile}
  pagingEnabled={mobile}
  scrollEnabled={mobile}
  showsHorizontalScrollIndicator={false}
  showsVerticalScrollIndicator={!mobile}
        contentContainerStyle={[
          styles.page,
          mobile && styles.pageMobile,
        ]}
      >
        <View
          style={[
            styles.columns,
            mobile && styles.columnsMobile,
          ]}
        >
          {/* =====================================================
              COLUMN 1 — WHAT MATTERS
          ===================================================== */}
          <View style={[styles.column, styles.leftColumn, mobile && styles.mobileColumn]}>
            <ColumnHeading label="What Matters To Me" />

            <View style={styles.lifeEntries}>
              {lifeEntries.map((entry) => (
                <View key={entry.id} style={styles.lifeEntry}>
<TextInput
  value={entry.text}
  onChangeText={(value) =>
    setLifeEntries((current) =>
      current.map((item) =>
        item.id === entry.id
          ? { ...item, text: value }
          : item
      )
    )
  }
  onBlur={() => {
    const currentEntry = lifeEntries.find(
      (item) => item.id === entry.id
    );

    if (currentEntry) {
      void saveLifeEntry(currentEntry);
    }
  }}
  multiline
  placeholder="What matters to you?"
  placeholderTextColor={Colors.subtleText}
  style={styles.lifeEntryText}
/>
                </View>
              ))}

              <Pressable
                onPress={() =>
                  setLifeEntries((current) => [
                    ...current,
                    { id: `life-${Date.now()}`, text: "" },
                  ])
                }
                style={styles.addLifeEntry}
              >
                <Text style={styles.addLifeEntryText}>
                  + ADD SOMETHING THAT MATTERS
                </Text>
              </Pressable>
            </View>

          </View>

          {/* =====================================================
              COLUMN 2 — CREATIONS
          ===================================================== */}
          <View style={[styles.column, styles.middleColumn, mobile && styles.mobileColumn]}>
<View style={styles.columnHeader}>
  <ColumnHeading label="What I'm Creating" />

  <View style={styles.columnHeaderActions}>
    <Pressable onPress={createIntention} hitSlop={12}>
      <Text style={styles.plus}>+</Text>
    </Pressable>

    <Pressable onPress={() => {}} hitSlop={12}>
      <Text style={styles.headerVoice}>🎤</Text>
    </Pressable>
  </View>
</View>

            <View style={styles.creationTiles}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tileRail}
              >
                {intentions.map((intention) => {
                  const selected = intention.id === selectedIntentionId;

                  const stateColor =
                    intention.state === "creation"
                      ? "#5F9E72"
                      : intention.state === "exploring"
                        ? "#C9A84E"
                        : "#666666";

                  return (
                    <Pressable
                      key={intention.id}
                      onPress={() => setSelectedIntentionId(intention.id)}
                      style={[
                        styles.intentionTile,
                        selected && styles.intentionTileSelected,
                      ]}
                    >
                      <View
                        style={[
                          styles.stateDot,
                          { backgroundColor: stateColor },
                        ]}
                      />

                      {selected ? (
                        <TextInput
                          value={intention.text}
                          onChangeText={updateIntention}
                          multiline
                          style={styles.tileInput}
                          placeholderTextColor={Colors.subtleText}
                        />
                      ) : (
                        <Text style={styles.tileText}>{intention.text}</Text>
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            <RowHeading number="02" title="The Creation Journey" />
<View style={styles.journeyArea}>
  <View style={styles.journeyRail}>
    {JOURNEY.map((stage, index) => {
      const active = activeStage === stage.id;

      return (
        <Pressable
          key={stage.id}
          onPress={() => setActiveStage(stage.id)}
          style={styles.journeyItem}
        >
          <View
            style={[
              styles.journeyNode,
              active && styles.journeyNodeActive,
            ]}
          >
            <Text
              style={[
                styles.journeyConcept,
                active && styles.journeyConceptActive,
              ]}
            >
              {stage.label}
            </Text>
          </View>

          <Text style={styles.journeyNumber}>
            {stage.number}
          </Text>

          {index < JOURNEY.length - 1 && (
            <View style={styles.journeyConnector} />
          )}
        </Pressable>
      );
    })}
  </View>

  <ScrollView
  style={styles.journeyContentScroll}
  showsVerticalScrollIndicator={true}
>

  <View style={styles.stageWorkspace}>
{activeStage === "dream" && (
<StageDream
  intentionId={selectedIntentionId}
/>
)}

{activeStage === "discover" && (
  <StageDiscover intentionId={selectedIntentionId} />
)}

{activeStage === "build" && (
  <StageBuild
    intentionId={selectedIntentionId}
    onOptionsChange={setNextStepOptions}
  />
)}

{activeStage === "grow" && (
  <StageGrow
    intentionId={selectedIntentionId}
  />
)}

{activeStage === "scale" && (
  <StageScale intentionId={selectedIntentionId} />
)}

{activeStage === "renew" && (
  <StageRenew intentionId={selectedIntentionId} />
)}
  </View>
  
</ScrollView>
</View>

<View style={styles.oneStepRail}>
  {nextStepOptions.map((option, index) => {
    const selected = selectedStep === option;

    return (
      <Pressable
        key={`${option}-${index}`}
        onPress={() => chooseStep(option)}
        style={[
          styles.stepTile,
          selected && styles.stepTileSelected,
        ]}
      >
        <Text style={styles.stepTileTitle}>
          NEXT
        </Text>

        <Text style={styles.stepTileDescription}>
          {option}
        </Text>
      </Pressable>
    );
  })}

  <Pressable
    onPress={() => chooseStep("DO NOTHING FOR NOW")}
    style={[
      styles.stepTile,
      selectedStep === "DO NOTHING FOR NOW" &&
        styles.stepTileSelected,
    ]}
  >
    <Text style={styles.stepTileTitle}>
      PAUSE
    </Text>

    <Text style={styles.stepTileDescription}>
      Do nothing for now.
    </Text>
  </Pressable>
</View>

          </View>

          {/* =====================================================
              COLUMN 3 — WHAT THIS CREATION IS CHANGING
          ===================================================== */}
          <View style={[styles.column, styles.rightColumn, mobile && styles.mobileColumn]}>
<ColumnHeading label="What This Creation Creates" />

<ArtifactArea
  area="I"
  title="Embodiment"
  artifacts={artifacts}
  loaded={artifactsLoaded}
/>

<ArtifactArea
  area="People"
  title="Relationships"
  artifacts={artifacts}
  loaded={artifactsLoaded}
/>

<ArtifactArea
  area="Planet"
  title="Contribution"
  artifacts={artifacts}
  loaded={artifactsLoaded}
/>

          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* ===============================================================
   COMPONENTS
=============================================================== */

function ColumnHeading({ label }: { label: string }) {
  return <Text style={styles.eyebrow}>{label}</Text>;
}

function RowHeading({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <View style={styles.rowHeading}>
      <Text style={styles.rowNumber}>{number}</Text>
      <Text style={styles.rowTitle}>{title}</Text>
      <View style={styles.rowLine} />
    </View>
  );
}

function CompactInputIcons() {
  return (
    <View style={styles.compactIcons}>
      <Pressable onPress={() => {}} style={styles.compactIcon}>
        <Text style={styles.compactIconText}>Aa</Text>
      </Pressable>
      <Pressable onPress={() => {}} style={styles.compactIcon}>
        <Text style={styles.compactIconText}>🎤</Text>
      </Pressable>
      <Pressable onPress={() => {}} style={styles.compactIcon}>
        <Text style={styles.compactIconText}>📷</Text>
      </Pressable>
    </View>
  );
}

function ArtifactArea({
  area,
  title,
  artifacts,
  loaded,
}: {
  area: "I" | "People" | "Planet";
  title: string;
  artifacts: Artifact[];
  loaded: boolean;
}) {
  const areaArtifacts = artifacts.filter(
    (artifact) => artifact.area === area
  );

  return (
    <View style={styles.outputArea}>
      <View style={styles.outputAreaHeader}>
        <Text style={styles.outputAreaLabel}>
          {area}
        </Text>

        <Text style={styles.outputAreaTitle}>
          {title}
        </Text>
      </View>

      {!loaded ? (
        <Text style={styles.outputAreaBody}>
          Loading...
        </Text>
      ) : areaArtifacts.length === 0 ? (
        <Text style={styles.outputAreaBody}>
          Artifacts created from this journey will appear here.
        </Text>
      ) : (
        <View style={{ gap: 9 }}>
          {areaArtifacts.map((artifact) => (
            <Pressable
              key={artifact.id}
              onPress={() => {
                // Artifact reader will come here.
              }}
              style={{
                padding: 12,
                borderRadius: 10,
                backgroundColor:
                  "rgba(255,255,255,0.045)",
                borderWidth: 1,
                borderColor:
                  "rgba(255,255,255,0.07)",
              }}
            >
              <Text
                style={{
                  color: Colors.white,
                  fontFamily: Fonts.light,
                  fontSize: 11,
                  lineHeight: 16,
                }}
              >
                {artifact.title}
              </Text>

              <Text
                style={{
                  color: Colors.subtleText,
                  fontFamily: Fonts.light,
                  fontSize: 8,
                  lineHeight: 13,
                  marginTop: 5,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                {artifact.artifact_type.replace(
                  /_/g,
                  " "
                )}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

function StageDream({
  intentionId,
}: {
  intentionId: string | null;
}) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const loadDream = async () => {
      if (!intentionId) {
        setValue("");
        return;
      }

      const { data, error } = await supabase
        .from("sovereign_intention_steps")
        .select("response")
        .eq("intention_id", intentionId)
        .eq("step", "dream")
        .maybeSingle();

      if (error) {
        console.error("❌ SOVEREIGN DREAM LOAD ERROR:", error);
        return;
      }

      if (!data?.response) {
        setValue("");
        return;
      }

      setValue(
        typeof data.response === "string"
          ? data.response
          : ""
      );
    };

    void loadDream();
  }, [intentionId]);

  return (
    <View>
      <TextInput
        value={value}
        onChangeText={setValue}
        onBlur={async () => {
          if (!intentionId || !value.trim()) {
            return;
          }

          try {
            const {
              data: existing,
              error: findError,
            } = await supabase
              .from("sovereign_intention_steps")
              .select("id")
              .eq("intention_id", intentionId)
              .eq("step", "dream")
              .maybeSingle();

            if (findError) {
              console.error(
                "❌ SOVEREIGN DREAM LOAD ERROR:",
                findError
              );
              return;
            }

            if (existing) {
              const { error } = await supabase
                .from("sovereign_intention_steps")
                .update({
                  response: value.trim(),
                })
                .eq("id", existing.id);

              if (error) {
                console.error(
                  "❌ SOVEREIGN DREAM UPDATE ERROR:",
                  error
                );
              }
            } else {
              const { error } = await supabase
                .from("sovereign_intention_steps")
                .insert({
                  intention_id: intentionId,
                  step: "dream",
                  response: value.trim(),
                });

              if (error) {
                console.error(
                  "❌ SOVEREIGN DREAM SAVE ERROR:",
                  error
                );
              }
            }
          } catch (error) {
            console.error(
              "❌ SOVEREIGN DREAM SAVE ERROR:",
              error
            );
          }
        }}
        multiline
placeholder="What do you see, feel or imagine? This is your space. Dream away."
placeholderTextColor="#77746F"
        style={styles.largeInput}
      />
    </View>
  );
}

function StageDiscover({
  intentionId,
}: {
  intentionId: string | null;
}) {
const [consciousDesire, setConsciousDesire] = useState("");

const [patternReflection, setPatternReflection] = useState("");

const [isRefreshing, setIsRefreshing] = useState(false);

const [creationPatterns, setCreationPatterns] =
  useState<CreationPattern[]>([]);

  useEffect(() => {
    const loadDiscoverStep = async () => {
      if (!intentionId) {
        return;
      }

      try {
const { data, error } = await supabase
  .from("sovereign_intention_steps")
  .select("response, ai_response")
  .eq("intention_id", intentionId)
  .eq("step", "discover")
  .maybeSingle();

        if (error) {
          console.error(
            "❌ SOVEREIGN DISCOVER LOAD ERROR:",
            error
          );
          return;
        }

if (data) {
  const response =
    typeof data.response === "object" &&
    data.response !== null
      ? data.response as {
          consciousDesire?: string;
        }
      : {};

const aiResponse =
  typeof data.ai_response === "object" &&
  data.ai_response !== null
    ? data.ai_response as {
        desire?: string;
        patternReflection?: string;
      }
    : {};

setConsciousDesire(
  response.consciousDesire ||
  aiResponse.desire ||
  ""
);

setPatternReflection(
  aiResponse.patternReflection ||
  ""
);
}
      } catch (error) {
        console.error(
          "❌ SOVEREIGN DISCOVER LOAD ERROR:",
          error
        );
      }
    };

    void loadDiscoverStep();
  }, [intentionId]);

  useEffect(() => {
    const loadCreationPatterns = async () => {
      if (!intentionId) {
        setCreationPatterns([]);
        return;
      }

      try {
        const userId = await getUserId();

        if (!userId) {
          setCreationPatterns([]);
          return;
        }

        const context = await getCreationContext({
          userId,
          intentionId,
        });

setCreationPatterns(
  Array.isArray(context.livingField?.creationPatterns)
    ? (context.livingField.creationPatterns as CreationPattern[])
    : []
);
      } catch (error) {
        console.error(
          "❌ SOVEREIGN DISCOVER PATTERNS LOAD ERROR:",
          error
        );
        setCreationPatterns([]);
      }
    };

    void loadCreationPatterns();
  }, [intentionId]);

  const saveConsciousDesire = async () => {
    if (!intentionId) {
      return;
    }

    try {
      const response = {
        consciousDesire: consciousDesire.trim(),
      };

      const { data: existing, error: findError } =
        await supabase
          .from("sovereign_intention_steps")
          .select("id")
          .eq("intention_id", intentionId)
          .eq("step", "discover")
          .maybeSingle();

      if (findError) {
        console.error(
          "❌ SOVEREIGN DISCOVER FIND ERROR:",
          findError
        );
        return;
      }

      if (existing) {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .update({
            response,
          })
          .eq("id", existing.id);

        if (error) {
          console.error(
            "❌ SOVEREIGN DISCOVER UPDATE ERROR:",
            error
          );
        }
      } else {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .insert({
            intention_id: intentionId,
            step: "discover",
            response,
          });

        if (error) {
          console.error(
            "❌ SOVEREIGN DISCOVER SAVE ERROR:",
            error
          );
        }
      }
    } catch (error) {
      console.error(
        "❌ SOVEREIGN DISCOVER SAVE ERROR:",
        error
      );
    }
  };

  const refreshConsciousDesire = async () => {

    console.log(
  "🔄 SOVEREIGN DISCOVER — REFRESH START",
  Date.now()
);

  if (!intentionId || isRefreshing) {
    return;
  }

  try {
    setIsRefreshing(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(
        "❌ SOVEREIGN DISCOVER REFRESH USER ERROR:",
        userError
      );
      return;
    }

    const context = await getCreationContext({
      userId: user.id,
      intentionId,
    });

    const proposal = await discoverConsciousDesire({
      context,
    });

    if (!proposal) {
      console.error(
        "❌ SOVEREIGN DISCOVER REFRESH — NO PROPOSAL"
      );
      return;
    }

setConsciousDesire(proposal.desire || "");

setPatternReflection(
  proposal.patternReflection || ""
);

console.log(
  "🔄 SOVEREIGN DISCOVER — REFRESHED:",
  proposal
);
  } catch (error) {
    console.error(
      "❌ SOVEREIGN DISCOVER REFRESH ERROR:",
      error
    );
  } finally {
    setIsRefreshing(false);
  }
};

return (
  <View>

<View style={styles.feelingCard}>

  <TextInput
    value={consciousDesire}
    onChangeText={setConsciousDesire}
    onBlur={() => {
      void saveConsciousDesire();
    }}
    multiline
    placeholder="Conscious desire"
    placeholderTextColor="#77746F"
    style={styles.conversationInput}
  />

</View>

          <View style={styles.discoverHeader}>

      <Pressable
        onPress={() => {
          void refreshConsciousDesire();
        }}
        disabled={isRefreshing}
        style={styles.refreshButton}
      >
        <Text style={styles.refreshButtonText}>
          {isRefreshing ? "Refreshing…" : "↻ Refresh"}
        </Text>
      </Pressable>
    </View>

      {/* -------------------------------------------- */}
      {/* PATTERNS                                    */}
      {/* -------------------------------------------- */}

      <View style={styles.patternsSection}>
        <View style={styles.patternsHeader}>
          <Text style={styles.patternsHint}>
            What is participating in this creation?
          </Text>
        </View>

        <View style={styles.patternGrid}>
{creationPatterns.map((pattern) => (
              <View
              key={pattern.id}
              style={styles.patternCard}
            >
<View style={styles.patternAxis}>
  <Text style={styles.patternLabel}>
    {pattern.leftPole}
  </Text>

  <View style={styles.patternTrack}>
    <View
      style={[
        styles.patternDot,
        {
          left: `${pattern.position * 100}%`,
        },
      ]}
    />
  </View>

  <Text style={styles.patternLabel}>
    {pattern.rightPole}
  </Text>
</View>


            </View>
          ))}

            {patternReflection ? (
    <Text
      style={{
        marginTop: 14,
        color: "#77746F",
        fontFamily: Fonts.light,
        fontSize: 10,
        lineHeight: 16,
      }}
    >
      {patternReflection}
    </Text>
  ) : null}
        </View>
      </View>
    </View>
  );
}

function StageBuild({
  intentionId,
  onOptionsChange,
}: {
  intentionId: string | null;
  onOptionsChange: (options: NextMove[]) => void;
}) {
  type ConversationMessage = {
    role: "user" | "mirror";
    content: string;
  };

  const [conversation, setConversation] =
    useState<ConversationMessage[]>([]);

  const [message, setMessage] = useState("");

  const [nextMoves, setNextMoves] =
    useState<NextMove[]>([]);

  const [selectedNextMove, setSelectedNextMove] =
    useState<string | null>(null);

  const [isSending, setIsSending] =
    useState(false);

  const [isChoosing, setIsChoosing] =
    useState(false);

  // --------------------------------------------------
  // LOAD EXISTING BUILD CONVERSATION
  // --------------------------------------------------

  useEffect(() => {
    const loadBuildStep = async () => {
      if (!intentionId) {
        setConversation([]);
        setNextMoves([]);
        onOptionsChange([]);
        setSelectedNextMove(null);
        setMessage("");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("sovereign_intention_steps")
          .select("response, ai_response")
          .eq("intention_id", intentionId)
          .eq("step", "build")
          .maybeSingle();

        if (error) {
          console.error(
            "❌ SOVEREIGN BUILD LOAD ERROR:",
            error
          );
          return;
        }

        if (!data) {
          setConversation([]);
          setNextMoves([]);
          onOptionsChange([]);
          setSelectedNextMove(null);
          return;
        }

        const response =
          typeof data.response === "object" &&
          data.response !== null
            ? data.response as Record<string, unknown>
            : {};

        const aiResponse =
          typeof data.ai_response === "object" &&
          data.ai_response !== null
            ? data.ai_response as Record<string, unknown>
            : {};

const loadedConversation =
  Array.isArray(response.conversation)
    ? response.conversation.filter(
        (item): item is ConversationMessage =>
          typeof item === "object" &&
          item !== null &&
          ((item as any).role === "user" ||
            (item as any).role === "mirror") &&
          typeof (item as any).content === "string"
      )
    : [];

        const loadedNextMoves =
          Array.isArray(aiResponse.nextMoves)
            ? aiResponse.nextMoves as NextMove[]
            : [];

        setConversation(loadedConversation);
        setNextMoves(loadedNextMoves);
        onOptionsChange(loadedNextMoves);

        setSelectedNextMove(null);
      } catch (error) {
        console.error(
          "❌ SOVEREIGN BUILD LOAD ERROR:",
          error
        );

        setConversation([]);
        setNextMoves([]);
        onOptionsChange([]);
        setSelectedNextMove(null);
      }
    };

    void loadBuildStep();
  }, [intentionId]);

  // --------------------------------------------------
  // SEND MESSAGE TO MIRROR
  // --------------------------------------------------

  const sendMessage = async () => {
    const trimmed = message.trim();

    if (
      !intentionId ||
      !trimmed ||
      isSending
    ) {
      return;
    }

    try {
      setIsSending(true);

      const userId = await getUserId();

      if (!userId) {
        return;
      }

      const nextConversation = [
        ...conversation,
        {
          role: "user" as const,
          content: trimmed,
        },
      ];

      setConversation(nextConversation);
      setMessage("");

      const result = await mirrorBuild({
        userId,
        intentionId,
        message: trimmed,
      });

      const mirrorConversation = [
        ...nextConversation,
        {
          role: "mirror" as const,
          content: result.message,
        },
      ];

      setConversation(mirrorConversation);

      const generatedMoves = result.nextMoves || [];

      setNextMoves(generatedMoves);
      onOptionsChange(generatedMoves);

      setSelectedNextMove(null);
    } catch (error) {
      console.error(
        "❌ SOVEREIGN MIRROR BUILD ERROR:",
        error
      );
    } finally {
      setIsSending(false);
    }
  };

  // --------------------------------------------------
  // CHOOSE ONE NEXT MOVE
  // --------------------------------------------------

  const handleNextMove = async (
    move: NextMove
  ) => {
    if (
      !intentionId ||
      isChoosing
    ) {
      return;
    }

    try {
      setIsChoosing(true);

      setSelectedNextMove(move.title);

      const result = await chooseNextMove({
        intentionId,
        move,
      });

      console.log(
        "✨ CREATION CREATED:",
        result
      );

      // The chosen move has now become real.
      // Keep the available next moves visible;
      // the parent Column 3 will refresh separately.
    } catch (error) {
      console.error(
        "❌ CHOOSE NEXT MOVE ERROR:",
        error
      );

      setSelectedNextMove(null);
    } finally {
      setIsChoosing(false);
    }
  };

  // --------------------------------------------------
  // PAUSE
  // --------------------------------------------------

  const handlePause = () => {
    setSelectedNextMove("DO NOTHING FOR NOW");
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <View style={styles.buildWorkspace}>

      {/* -------------------------------------------- */}
      {/* MIRROR CONVERSATION                         */}
      {/* -------------------------------------------- */}

      <ScrollView style={styles.buildConversation}>

        {conversation.length === 0 ? (
          <View style={styles.mirrorWelcome}>

            <Text style={styles.mirrorWelcomeText}>
              I'm here with you in this creation.
              Tell me what's alive.
            </Text>
          </View>
        ) : (
          conversation.map((item, index) => {
            const isUser =
              item.role === "user";

            return (
              <View
                key={`${item.role}-${index}`}
                style={[
                  styles.chatRow,
                  isUser
                    ? styles.chatRowUser
                    : styles.chatRowMirror,
                ]}
              >
                <View
                  style={[
                    styles.chatBubble,
                    isUser
                      ? styles.chatBubbleUser
                      : styles.chatBubbleMirror,
                  ]}
                >
                  {!isUser && (
                    <Text style={styles.chatSender}>
                      MIRROR
                    </Text>
                  )}

                  <Text
                    style={
                      isUser
                        ? styles.chatTextUser
                        : styles.chatTextMirror
                    }
                  >
                    {item.content}
                  </Text>
                </View>
              </View>
            );
          })
        )}

        {isSending && (
          <View
            style={[
              styles.chatRow,
              styles.chatRowMirror,
            ]}
          >
            <View
              style={[
                styles.chatBubble,
                styles.chatBubbleMirror,
              ]}
            >
              <Text style={styles.chatSender}>
                MIRROR
              </Text>

              <Text style={styles.chatTextMirror}>
                ...
              </Text>
            </View>
          </View>
        )}

      </ScrollView>

      {/* -------------------------------------------- */}
      {/* MESSAGE INPUT                               */}
      {/* -------------------------------------------- */}

      <View style={styles.buildInputRow}>

        <TextInput
          value={message}
          onChangeText={setMessage}
          multiline
          placeholder="Talk to me about this creation..."
          placeholderTextColor="#77746F"
          style={styles.buildMessageInput}
          editable={!isSending}
          onSubmitEditing={() => {
            void sendMessage();
          }}
        />

        <Pressable
          onPress={() => {
            void sendMessage();
          }}
          disabled={
            !message.trim() ||
            isSending
          }
          style={[
            styles.buildSendButton,
            (!message.trim() || isSending) &&
              styles.buildSendButtonDisabled,
          ]}
        >
          <Text style={styles.buildSendButtonText}>
            {isSending ? "…" : "↑"}
          </Text>
        </Pressable>

      </View>

      {/* -------------------------------------------- */}
      {/* DYNAMIC NEXT MOVES                          */}
      {/* -------------------------------------------- */}

      {nextMoves.length > 0 && (
        <View style={styles.nextMovesSection}>

          <Text style={styles.nextMovesLabel}>
            WHAT COULD HAPPEN NEXT
          </Text>

          <View style={styles.nextMovesList}>

            {nextMoves.map((move, index) => {
              const selected =
                selectedNextMove === move.title;

              return (
                <Pressable
                  key={`${move.title}-${index}`}
                  onPress={() => {
                    void handleNextMove(move);
                  }}
                  disabled={isChoosing}
                  style={[
                    styles.nextMoveButton,
                    selected &&
                      styles.nextMoveButtonSelected,
                  ]}
                >
                  <Text style={styles.nextMoveTitle}>
                    {move.title}
                  </Text>

                  <Text style={styles.nextMoveDescription}>
                    {move.description}
                  </Text>
                </Pressable>
              );
            })}

          </View>

          {/* DO NOTHING IS ALWAYS A HUMAN CHOICE */}

          <Pressable
            onPress={handlePause}
            style={[
              styles.pauseMoveButton,
              selectedNextMove ===
                "DO NOTHING FOR NOW" &&
                styles.nextMoveButtonSelected,
            ]}
          >
            <Text style={styles.pauseMoveTitle}>
              DO NOTHING FOR NOW
            </Text>
          </Pressable>

        </View>
      )}

    </View>
  );
}

function StageGrow({
  intentionId,
}: {
  intentionId: string | null;
  creationText: string;
}) {
  const GROW_OPTIONS = [
    "Space",
    "Time",
    "Attention",
    "Support",
    "Energy",
    "Resources",
    "Something else",
  ];

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [additionalText, setAdditionalText] = useState("");

  useEffect(() => {
    const loadGrowStep = async () => {
      if (!intentionId) {
        setSelectedOptions([]);
        setText("");
        setAdditionalText("");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("sovereign_intention_steps")
          .select("response")
          .eq("intention_id", intentionId)
          .eq("step", "grow")
          .maybeSingle();

        if (error) {
          console.error(
            "❌ SOVEREIGN GROW LOAD ERROR:",
            error
          );
          return;
        }

        if (!data?.response) {
          setSelectedOptions([]);
          setText("");
          setAdditionalText("");
          return;
        }

        const parsed =
          typeof data.response === "string"
            ? JSON.parse(data.response)
            : data.response;

        setSelectedOptions(
          Array.isArray(parsed?.selectedOptions)
            ? parsed.selectedOptions
            : []
        );

        setText(
          typeof parsed?.text === "string"
            ? parsed.text
            : ""
        );

        setAdditionalText(
          typeof parsed?.additionalText === "string"
            ? parsed.additionalText
            : ""
        );
      } catch (error) {
        console.error(
          "❌ SOVEREIGN GROW RESPONSE PARSE ERROR:",
          error
        );

        setSelectedOptions([]);
        setText("");
        setAdditionalText("");
      }
    };

    void loadGrowStep();
  }, [intentionId]);

  const saveGrow = async (
    nextOptions: string[],
    nextText: string,
    nextAdditionalText: string
  ) => {
    if (!intentionId) {
      return;
    }

    try {
      const response = {
        selectedOptions: nextOptions,
        text: nextText,
        additionalText: nextAdditionalText,
      };

      const { data: existing, error: findError } =
        await supabase
          .from("sovereign_intention_steps")
          .select("id")
          .eq("intention_id", intentionId)
          .eq("step", "grow")
          .maybeSingle();

      if (findError) {
        console.error(
          "❌ SOVEREIGN GROW FIND ERROR:",
          findError
        );
        return;
      }

      if (existing) {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .update({
            response,
          })
          .eq("id", existing.id);

        if (error) {
          console.error(
            "❌ SOVEREIGN GROW UPDATE ERROR:",
            error
          );
        }
      } else {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .insert({
            intention_id: intentionId,
            step: "grow",
            response,
          });

        if (error) {
          console.error(
            "❌ SOVEREIGN GROW SAVE ERROR:",
            error
          );
        }
      }
    } catch (error) {
      console.error(
        "❌ SOVEREIGN GROW SAVE ERROR:",
        error
      );
    }
  };

  const toggleOption = async (option: string) => {
    const nextOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];

    setSelectedOptions(nextOptions);

    await saveGrow(
      nextOptions,
      text,
      additionalText
    );
  };

  const updateText = (value: string) => {
    setText(value);
  };

  const updateAdditionalText = (value: string) => {
    setAdditionalText(value);
  };

  const saveText = async () => {
    await saveGrow(
      selectedOptions,
      text,
      additionalText
    );
  };

  const saveAdditionalText = async () => {
    await saveGrow(
      selectedOptions,
      text,
      additionalText
    );
  };

  return (
    <View>

      {/* MAIN REFLECTION */}

      {/* OPTIONS */}
      <View style={{ marginTop: 20 }}>
        <Text style={styles.smallLabel}>
          What does it need now?
        </Text>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 12,
          }}
        >
          {GROW_OPTIONS.map((option) => {
            const selected =
              selectedOptions.includes(option);

            return (
              <Pressable
                key={option}
                onPress={() =>
                  void toggleOption(option)
                }
                style={{
                  paddingVertical: 9,
                  paddingHorizontal: 14,
                  borderRadius: 20,
                  backgroundColor: selected
                    ? "#EEECE6"
                    : "rgba(255,255,255,0.045)",
                  borderWidth: 1,
                  borderColor: selected
                    ? "#EEECE6"
                    : "rgba(255,255,255,0.10)",
                }}
              >
                <Text
                  style={{
                    color: selected
                      ? "#2A2927"
                      : Colors.mutedText,
                    fontFamily: Fonts.light,
                    fontSize: 10,
                    lineHeight: 14,
                  }}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* OPTIONAL ADDITION */}
      <View style={{ marginTop: 20 }}>
        <View
style={{
  width: "100%",
  minHeight: 90,
  padding: 14,
  borderRadius: 11,
  backgroundColor: "#EEECE6",
}}
        >
          <TextInput
            value={additionalText}
            onChangeText={updateAdditionalText}
            onBlur={() =>
              void saveAdditionalText()
            }
            multiline
            placeholder="Anything else you want to notice..."
            placeholderTextColor="#77746F"
            style={{
              minHeight: 60,
              color: "#2A2927",
              fontFamily: Fonts.light,
              fontSize: 12,
              lineHeight: 18,
              padding: 0,
              outlineStyle: "none" as const,
              textAlignVertical: "top" as const,
            }}
          />
        </View>
      </View>
    </View>
  );
}

function StageScale({
  intentionId,
}: {
  intentionId: string | null;
}) {
const SCALE_QUESTIONS = [
  {
    id: "desire",
    question: "Does this creation want to expand?",
    options: [
      "Yes",
      "Not yet",
      "Unsure",
    ],
    multiple: false,
  },
  {
    id: "where",
    question: "Where or what could expand?",
    options: [
      "Reach",
      "Impact",
      "Expression",
      "Community",
      "Geography",
      "Something else",
    ],
    multiple: true,
  },
  {
    id: "support",
    question:
      "What support is available — or could be received — for this expansion?",
    options: [
      "People",
      "Partnership",
      "Resources",
      "Money",
      "Technology",
      "Visibility",
      "Community",
      "An invitation",
      "Something unexpected",
    ],
    multiple: true,
  },
  {
    id: "pace",
    question: "What pace feels right?",
    options: [
      "Gentle",
      "Steady",
      "Focused",
      "Bold",
      "Not sure",
    ],
    multiple: false,
  },
  {
    id: "notRequired",
    question:
      "What does this expansion NOT require from you?",
    options: [
      "Hustling",
      "Proving",
      "Doing everything myself",
      "Moving faster",
      "Saying yes to everything",
      "Controlling the outcome",
      "Nothing — it feels aligned",
    ],
    multiple: true,
  },
];

  const [responses, setResponses] = useState<
    Record<
      string,
      {
        selectedOptions: string[];
        text: string;
      }
    >
  >({});

  useEffect(() => {
    const loadScaleStep = async () => {
      if (!intentionId) {
        setResponses({});
        return;
      }

      try {
        const { data, error } = await supabase
          .from("sovereign_intention_steps")
          .select("response")
          .eq("intention_id", intentionId)
          .eq("step", "scale")
          .maybeSingle();

        if (error) {
          console.error(
            "❌ SOVEREIGN SCALE LOAD ERROR:",
            error
          );
          return;
        }

        if (!data?.response) {
          setResponses({});
          return;
        }

        const parsed =
          typeof data.response === "string"
            ? JSON.parse(data.response)
            : data.response;

        setResponses(
          parsed?.responses &&
            typeof parsed.responses === "object"
            ? parsed.responses
            : {}
        );
      } catch (error) {
        console.error(
          "❌ SOVEREIGN SCALE RESPONSE PARSE ERROR:",
          error
        );

        setResponses({});
      }
    };

    void loadScaleStep();
  }, [intentionId]);

  const saveScale = async (
    nextResponses: Record<
      string,
      {
        selectedOptions: string[];
        text: string;
      }
    >
  ) => {
    if (!intentionId) {
      return;
    }

    try {
      const response = {
        responses: nextResponses,
      };

      const { data: existing, error: findError } =
        await supabase
          .from("sovereign_intention_steps")
          .select("id")
          .eq("intention_id", intentionId)
          .eq("step", "scale")
          .maybeSingle();

      if (findError) {
        console.error(
          "❌ SOVEREIGN SCALE FIND ERROR:",
          findError
        );
        return;
      }

      if (existing) {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .update({
            response,
          })
          .eq("id", existing.id);

        if (error) {
          console.error(
            "❌ SOVEREIGN SCALE UPDATE ERROR:",
            error
          );
        }
      } else {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .insert({
            intention_id: intentionId,
            step: "scale",
            response,
          });

        if (error) {
          console.error(
            "❌ SOVEREIGN SCALE SAVE ERROR:",
            error
          );
        }
      }
    } catch (error) {
      console.error(
        "❌ SOVEREIGN SCALE SAVE ERROR:",
        error
      );
    }
  };

  const selectOption = async (
    questionId: string,
    option: string,
    multiple: boolean
  ) => {
    const current = responses[questionId] || {
      selectedOptions: [],
      text: "",
    };

    let selectedOptions: string[];

    if (multiple) {
      selectedOptions = current.selectedOptions.includes(
        option
      )
        ? current.selectedOptions.filter(
            (item) => item !== option
          )
        : [
            ...current.selectedOptions,
            option,
          ];
    } else {
      selectedOptions =
        current.selectedOptions[0] === option
          ? []
          : [option];
    }

    const nextResponses = {
      ...responses,
      [questionId]: {
        ...current,
        selectedOptions,
      },
    };

    setResponses(nextResponses);

    await saveScale(nextResponses);
  };

  const updateText = (
    questionId: string,
    text: string
  ) => {
    const current = responses[questionId] || {
      selectedOptions: [],
      text: "",
    };

    setResponses({
      ...responses,
      [questionId]: {
        ...current,
        text,
      },
    });
  };

  const saveText = async () => {
    await saveScale(responses);
  };

  return (
    <View>

      {/* MAIN REFLECTION */}
<View
  style={{
    width: "100%",
    flexDirection: "row",
    gap: 18,
    marginTop: 28,
    marginBottom: 30,
  }}
>
  {SCALE_QUESTIONS.map((item) => {
    const response = responses[item.id] || {
      selectedOptions: [],
      text: "",
    };

    return (
      <View
        key={item.id}
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
<Text
  style={{
    minHeight: 42,
    marginBottom: 14,
    color: "rgba(255,255,255,0.72)",
    fontFamily: Fonts.light,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.2,
  }}
>
  {item.question}
</Text>

        <View
          style={{
            width: "100%",
            gap: 8,
          }}
        >
          {item.options.map((option) => {
            const selected =
              response.selectedOptions.includes(option);

            return (
              <Pressable
                key={option}
                onPress={() =>
                  void selectOption(
                    item.id,
                    option,
                    item.multiple
                  )
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 5,
                }}
              >
                {/* TOGGLE */}
                <View
                  style={{
                    width: 28,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: selected
                      ? "#EEECE6"
                      : "rgba(255,255,255,0.10)",
                    borderWidth: 1,
                    borderColor: selected
                      ? "#EEECE6"
                      : "rgba(255,255,255,0.16)",
                    justifyContent: "center",
                    paddingHorizontal: 2,
                    marginRight: 8,
                  }}
                >
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: selected
                        ? "#2A2927"
                        : "rgba(255,255,255,0.45)",
                      alignSelf: selected
                        ? "flex-end"
                        : "flex-start",
                    }}
                  />
                </View>

                <Text
                  style={{
                    flex: 1,
                    color: selected
                      ? "#EEECE6"
                      : "rgba(255,255,255,0.55)",
                    fontFamily: Fonts.light,
                    fontSize: 10,
                    lineHeight: 14,
                  }}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  })}
</View>

        <View style={{ marginTop: 20 }}>
        <View
          style={{
            minHeight: 90,
            padding: 14,
            borderRadius: 11,
            backgroundColor: "#EEECE6",
          }}
        >
          <TextInput
            value={responses.alignment?.text || ""}
            onChangeText={(text) =>
              updateText("alignment", text)
            }
            onBlur={() => void saveText()}
            multiline
            placeholder="Anything else you want to notice..."
            placeholderTextColor="#77746F"
            style={{
              minHeight: 60,
              color: "#2A2927",
              fontFamily: Fonts.light,
              fontSize: 11,
              lineHeight: 18,
              padding: 0,
              outlineStyle: "none" as const,
              textAlignVertical: "top" as const,
            }}
          />
        </View>
      </View>
    </View>
  );
}

function StageRenew({
  intentionId,
}: {
  intentionId: string | null;
}) {
  const RENEW_QUESTIONS = [
    {
      id: "release",
      question: "What is ready to be released?",
      options: [
        "An old expectation",
        "A pattern",
        "A relationship or dynamic",
        "A way of doing things",
        "Something I have been holding onto",
        "Nothing yet",
        "Something else",
      ],
      multiple: true,
    },
    {
      id: "moment",
      question: "What is this moment asking for?",
      options: [
        "Action",
        "Waiting",
        "Listening",
        "Letting go",
        "Changing direction",
        "Staying with what is",
      ],
      multiple: true,
    },
    {
      id: "repeat",
      question:
        "Am I repeating something and expecting a different result?",
      options: [
        "Yes",
        "Maybe",
        "No",
        "I'm not sure",
      ],
      multiple: false,
    },
    {
      id: "receive",
      question: "What might be trying to find me?",
      options: [
        "A new idea",
        "An opportunity",
        "A person",
        "A possibility",
        "A new direction",
        "A different way of doing things",
        "Nothing yet",
      ],
      multiple: true,
    },
  ];

  const [responses, setResponses] = useState<
    Record<
      string,
      {
        selectedOptions: string[];
        text: string;
      }
    >
  >({});

  useEffect(() => {
    const loadRenewStep = async () => {
      if (!intentionId) {
        setResponses({});
        return;
      }

      try {
        const { data, error } = await supabase
          .from("sovereign_intention_steps")
          .select("response")
          .eq("intention_id", intentionId)
          .eq("step", "renew")
          .maybeSingle();

        if (error) {
          console.error(
            "❌ SOVEREIGN RENEW LOAD ERROR:",
            error
          );
          return;
        }

        if (!data?.response) {
          setResponses({});
          return;
        }

        const parsed =
          typeof data.response === "string"
            ? JSON.parse(data.response)
            : data.response;

        setResponses(
          parsed?.responses &&
            typeof parsed.responses === "object"
            ? parsed.responses
            : {}
        );
      } catch (error) {
        console.error(
          "❌ SOVEREIGN RENEW RESPONSE PARSE ERROR:",
          error
        );

        setResponses({});
      }
    };

    void loadRenewStep();
  }, [intentionId]);

  const saveRenew = async (
    nextResponses: Record<
      string,
      {
        selectedOptions: string[];
        text: string;
      }
    >
  ) => {
    if (!intentionId) {
      return;
    }

    try {
      const response = {
        responses: nextResponses,
      };

      const { data: existing, error: findError } =
        await supabase
          .from("sovereign_intention_steps")
          .select("id")
          .eq("intention_id", intentionId)
          .eq("step", "renew")
          .maybeSingle();

      if (findError) {
        console.error(
          "❌ SOVEREIGN RENEW FIND ERROR:",
          findError
        );
        return;
      }

      if (existing) {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .update({
            response,
          })
          .eq("id", existing.id);

        if (error) {
          console.error(
            "❌ SOVEREIGN RENEW UPDATE ERROR:",
            error
          );
        }
      } else {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .insert({
            intention_id: intentionId,
            step: "renew",
            response,
          });

        if (error) {
          console.error(
            "❌ SOVEREIGN RENEW SAVE ERROR:",
            error
          );
        }
      }
    } catch (error) {
      console.error(
        "❌ SOVEREIGN RENEW SAVE ERROR:",
        error
      );
    }
  };

  const selectOption = async (
    questionId: string,
    option: string,
    multiple: boolean
  ) => {
    const current = responses[questionId] || {
      selectedOptions: [],
      text: "",
    };

    let selectedOptions: string[];

    if (multiple) {
      selectedOptions =
        current.selectedOptions.includes(option)
          ? current.selectedOptions.filter(
              (item) => item !== option
            )
          : [
              ...current.selectedOptions,
              option,
            ];
    } else {
      selectedOptions =
        current.selectedOptions[0] === option
          ? []
          : [option];
    }

    const nextResponses = {
      ...responses,
      [questionId]: {
        ...current,
        selectedOptions,
      },
    };

    setResponses(nextResponses);

    await saveRenew(nextResponses);
  };

  const updateText = (
    questionId: string,
    text: string
  ) => {
    const current = responses[questionId] || {
      selectedOptions: [],
      text: "",
    };

    setResponses({
      ...responses,
      [questionId]: {
        ...current,
        text,
      },
    });
  };

  const saveText = async () => {
    await saveRenew(responses);
  };

  return (
    <View>

      {/* RENEW QUESTIONS */}
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          gap: 18,
          marginTop: 28,
          marginBottom: 30,
        }}
      >
        {RENEW_QUESTIONS.map((item) => {
          const response = responses[item.id] || {
            selectedOptions: [],
            text: "",
          };

          return (
            <View
              key={item.id}
              style={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <Text
                style={{
                  minHeight: 42,
                  marginBottom: 14,
                  color: "rgba(255,255,255,0.72)",
                  fontFamily: Fonts.light,
                  fontSize: 11,
                  lineHeight: 16,
                  letterSpacing: 0.2,
                }}
              >
                {item.question}
              </Text>

              <View
                style={{
                  width: "100%",
                  gap: 8,
                }}
              >
                {item.options.map((option) => {
                  const selected =
                    response.selectedOptions.includes(option);

                  return (
                    <Pressable
                      key={option}
                      onPress={() =>
                        void selectOption(
                          item.id,
                          option,
                          item.multiple
                        )
                      }
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 5,
                      }}
                    >
                      {/* TOGGLE */}
                      <View
                        style={{
                          width: 28,
                          height: 16,
                          borderRadius: 8,
                          backgroundColor: selected
                            ? "#EEECE6"
                            : "rgba(255,255,255,0.10)",
                          borderWidth: 1,
                          borderColor: selected
                            ? "#EEECE6"
                            : "rgba(255,255,255,0.16)",
                          justifyContent: "center",
                          paddingHorizontal: 2,
                          marginRight: 8,
                        }}
                      >
                        <View
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: selected
                              ? "#2A2927"
                              : "rgba(255,255,255,0.45)",
                            alignSelf: selected
                              ? "flex-end"
                              : "flex-start",
                          }}
                        />
                      </View>

                      <Text
                        style={{
                          flex: 1,
                          color: selected
                            ? "#EEECE6"
                            : "rgba(255,255,255,0.55)",
                          fontFamily: Fonts.light,
                          fontSize: 10,
                          lineHeight: 14,
                        }}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>

      {/* BEGIN AGAIN */}
      <View style={{ marginBottom: 10 }}>
        <Text
          style={{
            color: "rgba(255,255,255,0.72)",
            fontFamily: Fonts.light,
            fontSize: 11,
            lineHeight: 16,
            letterSpacing: 0.2,
            marginBottom: 12,
          }}
        >
          What wants to begin again?
        </Text>

        <View
          style={{
            minHeight: 110,
            padding: 14,
            borderRadius: 11,
            backgroundColor: "#EEECE6",
          }}
        >
          <TextInput
            value={responses.beginAgain?.text || ""}
            onChangeText={(text) =>
              updateText("beginAgain", text)
            }
            onBlur={() => void saveText()}
            multiline
            placeholder="A creation, a direction, a possibility — or nothing yet."
            placeholderTextColor="#77746F"
            style={{
              minHeight: 75,
              color: "#2A2927",
              fontFamily: Fonts.light,
              fontSize: 12,
              lineHeight: 18,
              padding: 0,
              outlineStyle: "none" as const,
              textAlignVertical: "top" as const,
            }}
          />
        </View>
      </View>

    </View>
  );

}

/* ===============================================================
   STYLES
=============================================================== */

const styles = {
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  page: {
    padding: 24,
    paddingBottom: 24,
    flexGrow: 1,
  },

  pageMobile: {
    width: "300vw" as const,
  },

columns: {
  width: "100%" as const,
  maxWidth: 1500,
  flex: 1,
  minHeight: 0,
  alignSelf: "center" as const,
  flexDirection: "row" as const,
  alignItems: "stretch" as const,
  columnGap: 30,
},

  columnsMobile: {
    flexDirection: "row" as const,
    width: "300vw" as const,
  },

  column: {
    minWidth: 0,
  },

  leftColumn: {
    width: "25%",
    flexGrow: 0,
    flexShrink: 0,
    borderRightWidth: 1,
    borderRightColor: Colors.divider,
  },

  middleColumn: {
    width: "50%",
    flexGrow: 0,
    flexShrink: 0,
    borderRightWidth: 1,
    borderRightColor: Colors.divider,
    flexDirection: "column" as const,
  },

  rightColumn: {
    width: "25%",
    flexGrow: 0,
    flexShrink: 0,
  },

  mobileColumn: {
    width: "100vw" as const,
    flex: 0,
    flexGrow: 0,
    flexShrink: 0,
    paddingHorizontal: 0,
    paddingLeft: 0,
    paddingRight: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    marginBottom: 0,
  },

columnHeader: {
  flexDirection: "row" as const,
  alignItems: "flex-start" as const,
  justifyContent: "space-between" as const,
    paddingRight: 30,
    paddingLeft: 30,
},

  eyebrow: {
    color: Colors.mutedText,
    fontFamily: Fonts.light,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
  },

  plus: {
    color: Colors.white,
    fontFamily: Fonts.light,
    fontSize: 22,
    lineHeight: 22,
  },

  columnHeaderActions: {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  gap: 14,
},

headerVoice: {
  color: Colors.mutedText,
  fontFamily: Fonts.light,
  fontSize: 15,
},

  lifeEntries: {
    marginTop: 18,
    gap: 10,
  },

lifeEntry: {
  minHeight: 125,
  padding: 14,
  borderRadius: 11,
  backgroundColor: "#EEECE6",
  borderWidth: 0,
},

lifeEntryText: {
  minHeight: 90,
  color: "#2A2927",
  fontFamily: Fonts.light,
  fontSize: 12,
  lineHeight: 22,
  padding: 0,
  outlineStyle: "none" as const,
  textAlignVertical: "top" as const,
},

  addLifeEntry: {
    paddingVertical: 12,
  },

  addLifeEntryText: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 8,
    letterSpacing: 1.1,
  },

  quietText: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 11,
    lineHeight: 18,
    marginTop: 7,
    marginBottom: 7,
  },

  compactIcons: {
    flexDirection: "row" as const,
    gap: 18,
    marginTop: 16,
  },

  compactIcon: {
    opacity: 0.82,
  },

  compactIconText: {
    color: Colors.mutedText,
    fontFamily: Fonts.light,
    fontSize: 16,
  },

  rowHeading: {
    minHeight: 36,
    marginTop: 14,
    paddingBottom: 8,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 11,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.09)",
  },

  rowNumber: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 8,
    letterSpacing: 1,
  },

  rowTitle: {
    color: Colors.mutedText,
    fontFamily: Fonts.light,
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: "uppercase" as const,
  },

  rowLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  creationTiles: {
    paddingVertical: 12,
  },

  tileRail: {
    gap: 10,
    paddingRight: 10,
  },

  intentionTile: {
    width: 205,
    minHeight: 88,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },

  intentionTileSelected: {
    backgroundColor: "rgba(255,255,255,0.075)",
    borderColor: "rgba(255,255,255,0.18)",
  },

  stateDot: {
    width: 7,
    height: 7,
    borderRadius: 7,
    marginBottom: 12,
  },

  tileText: {
    color: Colors.white,
    fontFamily: Fonts.light,
    fontSize: 13,
    lineHeight: 20,
  },

  tileInput: {
    color: Colors.white,
    fontFamily: Fonts.light,
    fontSize: 13,
    lineHeight: 20,
    padding: 0,
    outlineStyle: "none" as const,
    textAlignVertical: "top" as const,
  },

journeyArea: {
  flex: 1,
  minHeight: 0,
  height: 0,
  paddingTop: 18,
  paddingBottom: 10,
  paddingLeft: 10,
},

journeyContentScroll: {
  height: 280,
},

  journeyRail: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    width: "100%" as const,
  },

  journeyItem: {
    flex: 1,
    alignItems: "center" as const,
    position: "relative" as const,
  },

journeyNode: {
  width: 48,
  height: 48,
  borderRadius: 48,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.30)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: Colors.background,
  },

journeyNodeActive: {
  borderColor: "rgba(255,255,255,0.75)",
  backgroundColor: "rgba(255,255,255,0.10)",
},

  journeyConcept: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 7,
    letterSpacing: 0.8,
  },

  journeyConceptActive: {
    color: Colors.white,
  },

  journeyNumber: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 7,
    letterSpacing: 0.8,
    marginTop: 7,
  },

  journeyPrompt: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 8,
    lineHeight: 13,
    marginTop: 5,
    textAlign: "center" as const,
    maxWidth: 105,
  },

  journeyPromptActive: {
    color: Colors.white,
  },

  journeyConnector: {
    position: "absolute" as const,
    top: 21,
    left: "58%" as const,
    width: "84%" as const,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
  },

  stageWorkspace: {
    padding: 30,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.025)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

    // --------------------------------------------------
  // BUILD — MIRROR
  // --------------------------------------------------

  buildWorkspace: {
    gap: 16,
  },

buildConversation: {
  height: 160,
},

buildConversationContent: {
  gap: 12,
  paddingVertical: 4,
},

  mirrorWelcome: {
    paddingVertical: 18,
    paddingHorizontal: 4,
  },

  mirrorName: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 8,
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  mirrorWelcomeText: {
    color: Colors.mutedText,
    fontFamily: Fonts.light,
    fontSize: 12,
    lineHeight: 19,
  },

  chatRow: {
    width: "100%" as const,
    flexDirection: "row" as const,
  },

chatRowUser: {
  justifyContent: "flex-end" as const,
  paddingRight: 14,
},

  chatRowMirror: {
    justifyContent: "flex-start" as const,
  },

  chatBubble: {
    maxWidth: "82%" as const,
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 13,
  },

  chatBubbleMirror: {
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  chatBubbleUser: {
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  chatSender: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 7,
    letterSpacing: 1.3,
    marginBottom: 5,
  },

  chatTextMirror: {
    color: Colors.mutedText,
    fontFamily: Fonts.light,
    fontSize: 11,
    lineHeight: 17,
  },

  chatTextUser: {
    color: Colors.white,
    fontFamily: Fonts.light,
    fontSize: 11,
    lineHeight: 17,
  },

  buildInputRow: {
    flexDirection: "row" as const,
    alignItems: "flex-end" as const,
    gap: 8,
  },

  buildMessageInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius: 13,
    backgroundColor: "#EEECE6",
    color: "#2A2927",
    fontFamily: Fonts.light,
    fontSize: 11,
    lineHeight: 17,
    outlineStyle: "none" as const,
    textAlignVertical: "top" as const,
  },

  buildSendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  buildSendButtonDisabled: {
    opacity: 0.35,
  },

  buildSendButtonText: {
    color: Colors.white,
    fontFamily: Fonts.light,
    fontSize: 16,
  },

  // --------------------------------------------------
  // BUILD — NEXT MOVES
  // --------------------------------------------------

  nextMovesSection: {
    paddingTop: 4,
  },

  nextMovesLabel: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 7,
    letterSpacing: 1.4,
    marginBottom: 9,
  },

  nextMovesList: {
    gap: 7,
  },

  nextMoveButton: {
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  nextMoveButtonSelected: {
    backgroundColor: "rgba(95,158,114,0.15)",
    borderColor: "rgba(95,158,114,0.42)",
  },

  nextMoveTitle: {
    color: Colors.white,
    fontFamily: Fonts.light,
    fontSize: 10,
    lineHeight: 15,
  },

  nextMoveDescription: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 8,
    lineHeight: 13,
    marginTop: 5,
  },

  pauseMoveButton: {
    marginTop: 8,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor: "transparent",
  },

  pauseMoveTitle: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 7,
    letterSpacing: 1.1,
  },
  
  stagePlaceholder: {
  color: Colors.subtleText,
  fontFamily: Fonts.light,
  fontSize: 14,
  lineHeight: 22,
},

  stageEyebrow: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 8,
    letterSpacing: 1.7,
    marginBottom: 8,
  },

  stagePrompt: {
    color: Colors.mutedText,
    fontFamily: Fonts.light,
    fontSize: 12,
    lineHeight: 20,
    marginBottom: 17,
  },

largeInput: {
  minHeight:150,
  backgroundColor: "#EEECE6",
  color: "#2A2927",
  fontFamily: Fonts.light,
  fontSize: 12,
  lineHeight: 18,
  padding: 18,
  borderRadius: 13,
  outlineStyle: "none" as const,
  textAlignVertical: "top" as const,
},

feelingCard: {
  padding: 0,
  backgroundColor: "transparent",
},

  feelingLabels: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },

  smallLabel: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 8,
    letterSpacing: 1.1,
  },

  feelingValue: {
    color: Colors.white,
    fontFamily: Fonts.light,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
  },

  sliderTrack: {
    height: 2,
    marginTop: 25,
    backgroundColor: "rgba(255,255,255,0.15)",
    position: "relative" as const,
  },

  sliderFill: {
    position: "absolute" as const,
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.65)",
  },

  sliderThumb: {
    position: "absolute" as const,
    top: -6,
    marginLeft: -6,
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: Colors.white,
  },

  feelingHint: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 21,
  },

conversationInput: {
  minHeight:150,
  backgroundColor: "#EEECE6",
  color: "#2A2927",
  fontFamily: Fonts.light,
  fontSize: 12,
  lineHeight: 18,
  padding: 18,
  borderRadius: 13,
  outlineStyle: "none" as const,
  textAlignVertical: "top" as const,
},

  directorNote: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 8,
    letterSpacing: 1.2,
    marginTop: 13,
  },

  doStatement: {
    color: Colors.white,
    fontFamily: Fonts.light,
    fontSize: 17,
    lineHeight: 27,
    marginTop: 8,
    marginBottom: 12,
  },

doHint: {
  minHeight: 150,
  backgroundColor: "#EEECE6",
  color: "#2A2927",
  fontFamily: Fonts.light,
  fontSize: 12,
  lineHeight: 18,
  padding: 18,
  borderRadius: 13,
  outlineStyle: "none" as const,
},

doConversation: {
  gap: 14,
  marginBottom: 16,
},

doConversationRole: {
  color: Colors.subtleText,
  fontFamily: Fonts.light,
  fontSize: 8,
  letterSpacing: 1.2,
  marginBottom: 5,
},

doConversationText: {
  color: Colors.white,
  fontFamily: Fonts.light,
  fontSize: 14,
  lineHeight: 22,
},

doInput: {
  minHeight: 150,
  backgroundColor: "#EEECE6",
  color: "#2A2927",
  fontFamily: Fonts.light,
  fontSize: 12,
  lineHeight: 18,
  padding: 18,
  borderRadius: 13,
  outlineStyle: "none" as const,
  textAlignVertical: "top" as const,
},

doSend: {
  alignSelf: "flex-end" as const,
  marginTop: 10,
  paddingVertical: 9,
  paddingHorizontal: 18,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.18)",
  borderRadius: 20,
},

doSendText: {
  color: Colors.mutedText,
  fontFamily: Fonts.light,
  fontSize: 8,
  letterSpacing: 1.2,
},

  patternsSection: {
    marginTop: 10,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.07)",
  },

patternsHeader: {
  flexDirection: "row" as const,
  alignItems: "baseline" as const,
  justifyContent: "center" as const,
  gap: 9,
  marginBottom: 9,
},

  patternsTitle: {
    color: Colors.mutedText,
    fontFamily: Fonts.light,
    fontSize: 8,
    letterSpacing: 1.4,
  },

  patternsHint: {
    color: Colors.mutedText,
    fontFamily: Fonts.light,
    fontSize: 8,
  },

patternGrid: {
  gap: 4,
},

patternCard: {
  width: "65%",
  alignSelf: "center",
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 9,
  backgroundColor: "rgba(255,255,255,0.04)",
},

patternAxis: {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  gap: 8,
},

patternLabel: {
  color: Colors.white,
  fontFamily: Fonts.light,
  fontSize: 9,
  flexShrink: 0,
},

patternTrack: {
  flex: 1,
  height: 1,
  backgroundColor: "rgba(255,255,255,0.28)",
  position: "relative" as const,
},

  patternDot: {
    position: "absolute" as const,
    top: -4,
    marginLeft: -4,
    width: 9,
    height: 9,
    borderRadius: 9,
    backgroundColor: Colors.white,
  },

  patternObservation: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 9,
  },

  oneStepRail: {
    flexDirection: "row" as const,
    gap: 8,
    paddingTop: 12,
    paddingBottom: 0,
  },

  stepTile: {
    flex: 1,
    minHeight: 92,
    padding: 11,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },

  stepTileSelected: {
    backgroundColor: "rgba(95,158,114,0.15)",
    borderColor: "rgba(95,158,114,0.42)",
  },

  stepTileTitle: {
    color: Colors.white,
    fontFamily: Fonts.light,
    fontSize: 10,
    lineHeight: 15,
  },

  stepTileDescription: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 8,
    lineHeight: 13,
    marginTop: 7,
  },

  rightColumnSpacer: {
    height: 18,
  },

  outputArea: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  outputAreaHeader: {
    flexDirection: "row" as const,
    alignItems: "baseline" as const,
    gap: 9,
    marginBottom: 7,
  },

  outputAreaLabel: {
    color: Colors.white,
    fontFamily: Fonts.light,
    fontSize: 12,
    letterSpacing: 0.4,
  },

  outputAreaTitle: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 8,
    letterSpacing: 0.8,
    textTransform: "uppercase" as const,
  },

  outputAreaBody: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 9,
    lineHeight: 15,
  },

  outputAreaWork: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },

  outputAreaWorkLabel: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 7,
    letterSpacing: 1.2,
  },

  outputAreaWorkHint: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 8,
    lineHeight: 13,
    marginTop: 5,
  },

  discoverHeader: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 10,
},

discoverLabel: {
  color: Colors.mutedText,
  fontFamily: Fonts.light,
  fontSize: 9,
  letterSpacing: 1.4,
},

refreshButton: {
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.10)",
  backgroundColor: "rgba(255,255,255,0.035)",
},

refreshButtonText: {
  color: Colors.mutedText,
  fontFamily: Fonts.light,
  fontSize: 9,
  letterSpacing: 0.6,
},

patternReflectionCard: {
  marginTop: 16,
  paddingTop: 14,
  paddingBottom: 8,
  borderTopWidth: 1,
  borderTopColor: "#242424",
},

patternReflectionLabel: {
  color: Colors.mutedText,
  fontFamily: Fonts.light,
  fontSize: 8,
  letterSpacing: 1.4,
  marginBottom: 8,
},

patternReflectionText: {
  color: "#A8A49D",
  fontFamily: Fonts.light,
  fontSize: 11,
  lineHeight: 17,
},
};

export { SovereignIConsole };
