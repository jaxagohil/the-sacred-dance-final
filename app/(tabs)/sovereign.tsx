/**
 * Sovereign I — FINAL UI
 *
 * Frozen architecture:
 * 25% What Matters | 50% Creations | 25% What This Creation Is Changing
 *
 * Creation Journey:
 * 01 THINK — What do you see?
 * 02 FEEL — How do you feel?
 * 03 SAY — Your conscious desire
 * 04 DO — Exploring possibilities
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

import React, { useEffect, useRef, useState } from "react";

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

type JourneyStage = "think" | "feel" | "say" | "do";

type StepOption = {
  id: string;
  label: string;
  description: string;
};

const JOURNEY: {
  id: JourneyStage;
  label: string;
  number: string;
  prompt: string;
}[] = [
  { id: "think", label: "THINK", number: "01", prompt: "What do you see?" },
  { id: "feel", label: "FEEL", number: "02", prompt: "How do you feel?" },
  { id: "say", label: "SAY", number: "03", prompt: "Your conscious desire" },
  { id: "do", label: "DO", number: "04", prompt: "Exploring possibilities" },
];

// UI placeholder only. Existing 18-pattern structure will replace this in Step 2.
const MOCK_PATTERNS = [
  { id: "connection", left: "Connection", right: "Isolation", position: 0.68 },
  { id: "visibility", left: "Visibility", right: "Invisibility", position: 0.54 },
  { id: "flow", left: "Flow", right: "Control", position: 0.72 },
  { id: "reciprocity", left: "Receiving", right: "Giving", position: 0.61 },
  { id: "trust", left: "Trust", right: "Protection", position: 0.47 },
];

const STEP_OPTIONS: StepOption[] = [
  {
    id: "conversation",
    label: "Open one real conversation",
    description:
      "Find one person with whom this creation wants to be spoken about.",
  },
  {
    id: "explore",
    label: "Explore where this belongs",
    description:
      "Discover conversations, communities and places where it could naturally meet people.",
  },
  {
    id: "make",
    label: "Make one small piece real",
    description:
      "Create one tangible piece now — a page, post, chapter, invitation or prototype.",
  },
  {
    id: "connect",
    label: "Make one connection",
    description:
      "Reach toward one person, community or possibility already in the field.",
  },
  {
    id: "nothing",
    label: "Do nothing for now",
    description:
      "Pause. Receive. Notice what comes back before choosing another step.",
  },
];

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
      setThinking("");
      setFeeling(0.72);
      setSaying("");
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

    const thinkRow = rows.find((row) => row.step === "think");
    const feelRow = rows.find((row) => row.step === "feel");
    const sayRow = rows.find((row) => row.step === "say");

    setThinking(
      typeof thinkRow?.response === "string"
        ? thinkRow.response
        : ""
    );

    setFeeling(
      feelRow?.response
        ? Number(feelRow.response)
        : 0.72
    );

    setSaying(
      typeof sayRow?.response === "string"
        ? sayRow.response
        : ""
    );
  };

  loadJourneySteps();
}, [selectedIntentionId]);

  const [activeStage, setActiveStage] =
    useState<JourneyStage>("think");

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

const [thinking, setThinking] = useState("");

const [feeling, setFeeling] = useState(0.72);
const [saying, setSaying] = useState("");
const [selectedStep, setSelectedStep] = useState<string | null>(null);

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

  const feelingLabel =
    feeling < 0.34
      ? "Contracted"
      : feeling < 0.67
        ? "Neutral"
        : "Expanded";

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
        status: "intention",
        spiral_stage: "awareness",
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

            <CompactInputIcons />
          </View>

          {/* =====================================================
              COLUMN 2 — CREATIONS
          ===================================================== */}
          <View style={[styles.column, styles.middleColumn, mobile && styles.mobileColumn]}>
            <View style={styles.columnHeader}>
              <ColumnHeading label="What I'm Creating" />

              <Pressable onPress={createIntention} hitSlop={12}>
                <Text style={styles.plus}>+</Text>
              </Pressable>
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

          <Text
            style={[
              styles.journeyPrompt,
              active && styles.journeyPromptActive,
            ]}
          >
            {stage.prompt}
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
{activeStage === "think" && (
  <StageThink
    value={thinking}
    onChange={setThinking}
    intentionId={selectedIntentionId}
  />
)}

{activeStage === "feel" && (
  <StageFeel
    value={feeling}
    label={feelingLabel}
    onChange={setFeeling}
    intentionId={selectedIntentionId}
  />
)}

{activeStage === "say" && (
  <StageSay
    value={saying}
    onChange={setSaying}
    intentionId={selectedIntentionId}
  />
)}

    {activeStage === "do" && (
  <StageDo intentionId={selectedIntentionId} />
)}
  </View>

  {activeStage === "feel" && (
    <View style={styles.patternsSection}>
      {/* Patterns are part of the experience, not a new taxonomy. */}
      <View style={styles.patternsHeader}>
        <Text style={styles.patternsHint}>
          What is participating in this creation?
        </Text>
      </View>

      <View style={styles.patternGrid}>
        {MOCK_PATTERNS.map((pattern) => (
          <View key={pattern.id} style={styles.patternCard}>
            <View style={styles.patternLabels}>
              <Text style={styles.patternLabel}>{pattern.left}</Text>
              <Text style={styles.patternLabel}>{pattern.right}</Text>
            </View>

            <View style={styles.patternTrack}>
              <View
                style={[
                  styles.patternDot,
                  { left: `${pattern.position * 100}%` },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  )}
</ScrollView>
</View>

            <RowHeading number="03" title="What We Create Together" />

            <View style={styles.oneStepRail}>
              {STEP_OPTIONS.map((option) => {
                const selected = selectedStep === option.id;

                return (
                  <Pressable
                    key={option.id}
                    onPress={() => chooseStep(option.id)}
                    style={[
                      styles.stepTile,
                      selected && styles.stepTileSelected,
                    ]}
                  >
                    <Text style={styles.stepTileTitle} numberOfLines={2}>
                      {option.label}
                    </Text>

                    <Text
                      style={styles.stepTileDescription}
                      numberOfLines={3}
                    >
                      {option.description}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <CompactInputIcons />
          </View>

          {/* =====================================================
              COLUMN 3 — WHAT THIS CREATION IS CHANGING
          ===================================================== */}
          <View style={[styles.column, styles.rightColumn, mobile && styles.mobileColumn]}>
            <ColumnHeading label="What This Creation Is Changing" />

  <OutputArea label="I" title="Embodiment" />

  <OutputArea label="People" title="Relationships" />

  <OutputArea label="Planet" title="Contribution" />

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


function OutputArea({
  label,
  title,
}: {
  label: string;
  title: string;
}) {
  return (
    <View style={styles.outputArea}>
      <View style={styles.outputAreaHeader}>
        <Text style={styles.outputAreaLabel}>{label}</Text>
        <Text style={styles.outputAreaTitle}>{title}</Text>
      </View>

      <View style={styles.outputAreaWork} />
    </View>
  );
}

function StageThink({
  value,
  onChange,
  intentionId,
}: {
  value: string;
  onChange: (value: string) => void;
  intentionId: string | null;
}) {
  return (
    <View>

<TextInput
  value={value}
  onChangeText={onChange}
  onBlur={async () => {
    if (!intentionId || !value.trim()) {
      return;
    }

    try {
      const { data: existing, error: findError } = await supabase
        .from("sovereign_intention_steps")
        .select("id")
        .eq("intention_id", intentionId)
        .eq("step", "think")
        .maybeSingle();

      if (findError) {
        console.error(
          "❌ SOVEREIGN THINK LOAD ERROR:",
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
            "❌ SOVEREIGN THINK UPDATE ERROR:",
            error
          );
        }
      } else {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .insert({
            intention_id: intentionId,
            step: "think",
            response: value.trim(),
          });

        if (error) {
          console.error(
            "❌ SOVEREIGN THINK SAVE ERROR:",
            error
          );
        }
      }
    } catch (error) {
      console.error(
        "❌ SOVEREIGN THINK SAVE ERROR:",
        error
      );
    }
  }}
  multiline
  placeholder="Let the picture emerge before interpreting it."
  placeholderTextColor={Colors.subtleText}
  style={styles.largeInput}
/>
    </View>
  );
}

function StageFeel({
  value,
  label,
  onChange,
  intentionId,
}: {
  value: number;
  label: string;
  onChange: (value: number) => void;
  intentionId: string | null;
}) {
  const [trackWidth, setTrackWidth] = useState(0);
  const latestValue = useRef(value);

  const updateFeelingFromX = (x: number) => {
    if (!trackWidth) {
      return;
    }

    const nextValue = Math.max(
      0,
      Math.min(1, x / trackWidth)
    );

    latestValue.current = nextValue;
    onChange(nextValue);
  };

  const saveFeeling = async (nextValue: number) => {
    if (!intentionId) {
      return;
    }

    try {
      const { data: existing, error: findError } = await supabase
        .from("sovereign_intention_steps")
        .select("id")
        .eq("intention_id", intentionId)
        .eq("step", "feel")
        .maybeSingle();

      if (findError) {
        console.error(
          "❌ SOVEREIGN FEEL LOAD ERROR:",
          findError
        );
        return;
      }

      if (existing) {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .update({
            response: String(nextValue),
          })
          .eq("id", existing.id);

        if (error) {
          console.error(
            "❌ SOVEREIGN FEEL UPDATE ERROR:",
            error
          );
        }
      } else {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .insert({
            intention_id: intentionId,
            step: "feel",
            response: String(nextValue),
          });

        if (error) {
          console.error(
            "❌ SOVEREIGN FEEL SAVE ERROR:",
            error
          );
        }
      }
    } catch (error) {
      console.error(
        "❌ SOVEREIGN FEEL SAVE ERROR:",
        error
      );
    }
  };

  return (
    <View>
      <View style={styles.feelingCard}>
        <View style={styles.feelingLabels}>
          <Text style={styles.smallLabel}>CONTRACTED</Text>
          <Text style={styles.smallLabel}>EXPANDED</Text>
        </View>

        <View
          style={styles.sliderTrack}
          onLayout={(event) => {
            setTrackWidth(event.nativeEvent.layout.width);
          }}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={(event) => {
            updateFeelingFromX(
              event.nativeEvent.locationX
            );
          }}
          onResponderMove={(event) => {
            updateFeelingFromX(
              event.nativeEvent.locationX
            );
          }}
          onResponderRelease={() => {
            void saveFeeling(latestValue.current);
          }}
        >
          <View
            style={[
              styles.sliderFill,
              { width: `${value * 100}%` },
            ]}
          />

          <View
            style={[
              styles.sliderThumb,
              { left: `${value * 100}%` },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

function StageSay({
  value,
  onChange,
  intentionId,
}: {
  value: string;
  onChange: (value: string) => void;
  intentionId: string | null;
}) {
  return (
    <View>

<TextInput
  value={value}
  onChangeText={onChange}
  onBlur={async () => {
    if (!intentionId || !value.trim()) {
      return;
    }

    try {
      const { data: existing, error: findError } = await supabase
        .from("sovereign_intention_steps")
        .select("id")
        .eq("intention_id", intentionId)
        .eq("step", "say")
        .maybeSingle();

      if (findError) {
        console.error(
          "❌ SOVEREIGN SAY LOAD ERROR:",
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
            "❌ SOVEREIGN SAY UPDATE ERROR:",
            error
          );
        }
      } else {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .insert({
            intention_id: intentionId,
            step: "say",
            response: value.trim(),
          });

        if (error) {
          console.error(
            "❌ SOVEREIGN SAY SAVE ERROR:",
            error
          );
        }
      }
    } catch (error) {
      console.error(
        "❌ SOVEREIGN SAY SAVE ERROR:",
        error
      );
    }
  }}
  multiline
  placeholder="Let yourself say it as it is."
  placeholderTextColor={Colors.subtleText}
  style={styles.conversationInput}
/>

    </View>
  );
}

function StageDo({
  intentionId,
}: {
  intentionId: string | null;
}) {
  const [conversation, setConversation] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadDoStep = async () => {

          setMessage("");
          
      if (!intentionId) {
        setConversation([]);
        return;
      }

      const { data, error } = await supabase
        .from("sovereign_intention_steps")
        .select("response")
        .eq("intention_id", intentionId)
        .eq("step", "do")
        .maybeSingle();

      if (error) {
        console.error(
          "❌ SOVEREIGN DO LOAD ERROR:",
          error
        );
        return;
      }

      if (!data?.response) {
        setConversation([]);
        return;
      }

      try {
        const parsed =
          typeof data.response === "string"
            ? JSON.parse(data.response)
            : data.response;

        setConversation(
          Array.isArray(parsed?.conversation)
            ? parsed.conversation
            : []
        );
      } catch (error) {
        console.error(
          "❌ SOVEREIGN DO RESPONSE PARSE ERROR:",
          error
        );
        setConversation([]);
      }
    };

    loadDoStep();
  }, [intentionId]);

  const sendMessage = async () => {
    const trimmed = message.trim();

    if (!intentionId || !trimmed) {
      return;
    }

    const nextConversation = [
      ...conversation,
      {
        role: "user",
        content: trimmed,
      },
    ];

    setConversation(nextConversation);
    setMessage("");

    try {
      const { data: existing, error: findError } = await supabase
        .from("sovereign_intention_steps")
        .select("id")
        .eq("intention_id", intentionId)
        .eq("step", "do")
        .maybeSingle();

      if (findError) {
        console.error(
          "❌ SOVEREIGN DO LOAD ERROR:",
          findError
        );
        return;
      }

      const response = JSON.stringify({
        conversation: nextConversation,
        options: [],
        selected_next_step: null,
      });

      if (existing) {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .update({
            response,
          })
          .eq("id", existing.id);

        if (error) {
          console.error(
            "❌ SOVEREIGN DO UPDATE ERROR:",
            error
          );
        }
      } else {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .insert({
            intention_id: intentionId,
            step: "do",
            response,
          });

        if (error) {
          console.error(
            "❌ SOVEREIGN DO SAVE ERROR:",
            error
          );
        }
      }
    } catch (error) {
      console.error(
        "❌ SOVEREIGN DO SAVE ERROR:",
        error
      );
    }
  };

  return (
    <View>
      <View style={styles.doConversation}>
        {conversation.map((item, index) => (
          <View key={`${item.role}-${index}`}>
            <Text style={styles.doConversationRole}>
              {item.role === "user" ? "YOU" : "MIRROR"}
            </Text>

            <Text style={styles.doConversationText}>
              {item.content}
            </Text>
          </View>
        ))}
      </View>

      <TextInput
        value={message}
        onChangeText={setMessage}
        multiline
        placeholder="Talk to me about this creation."
        placeholderTextColor={Colors.subtleText}
        style={styles.doInput}
      />

      <Pressable
        onPress={sendMessage}
        style={styles.doSend}
      >
        <Text style={styles.doSendText}>
          SEND
        </Text>
      </Pressable>
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
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
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
  fontSize: 15,
  lineHeight: 24,
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
},

journeyContentScroll: {
  height: 200,
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
    width: 42,
    height: 42,
    borderRadius: 42,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: Colors.background,
  },

  journeyNodeActive: {
    borderColor: "rgba(255,255,255,0.60)",
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
  fontSize: 17,
  lineHeight: 28,
  padding: 18,
  borderRadius: 13,
  outlineStyle: "none" as const,
  textAlignVertical: "top" as const,
},

  feelingCard: {
    padding: 8,
    borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.04)",
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
  fontSize: 17,
  lineHeight: 28,
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
  fontSize: 14,
  lineHeight: 24,
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
  minHeight: 120,
  backgroundColor: "#EEECE6",
  color: "#2A2927",
  fontFamily: Fonts.light,
  fontSize: 16,
  lineHeight: 25,
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
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 8,
  },

  patternGrid: {
    gap: 7,
  },

  patternCard: {
      width: "40%",
      alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.04)",
  },

  patternLabels: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
  },

  patternLabel: {
    color: Colors.mutedText,
    fontFamily: Fonts.light,
    fontSize: 9,
  },

  patternTrack: {
    height: 1,
    marginTop: 11,
    backgroundColor: "rgba(255,255,255,0.18)",
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
};

export { SovereignIConsole };
