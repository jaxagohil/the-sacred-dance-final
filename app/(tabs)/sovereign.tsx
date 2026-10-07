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

import React, {
  useEffect,
  useRef,
  useState
} from "react";

import {
  Image,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import {
  buildAlignmentOSContext,
} from "../../lib/alignment/buildAlignmentOSContext";


import { processSovereignLifePicture } from "../../db/processSovereignLifePicture";
import { saveSovereignLifePicture } from "../../db/saveSovereignLifePicture";
import { uploadSovereignImage } from "../../lib/sovereignI/uploads/uploadSovereignImage";

import { chooseNextMove } from "../../lib/consciousCreating/agents/mirror/chooseNextMove";
import type { NextMove } from "../../lib/consciousCreating/agents/mirror/generateNextMoves";
import { mirrorBuild } from "../../lib/consciousCreating/agents/mirror/mirrorBuild";

import {
  generateRenewReflection,
} from "../../lib/consciousCreating/agents/renew/generateRenewReflection";

import {
  discoverConsciousDesire,
  getCreationContext,
} from "../../lib/consciousCreating";

import {
  generateScalePossibilities,
} from "../../lib/consciousCreating/agents/scale/generateScalePossibilities";

import { pickSovereignImage } from "../../lib/sovereignI/uploads/pickSovereignImage";
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
  itemType:
    | "text"
    | "image"
    | "voice"
    | "quote"
    | "link"
    | "attachment";
  mimeType?: string;
  uri?: string;
  title?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
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
    prompt: "Where does this creation want to expand.",
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

  const alignmentContext = buildAlignmentOSContext();

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
    itemType: "text",
    x: 10,
    y: 10,
    width: 180,
    height: 120,
    rotation: -1,
  },
]);

  const [lifePictureIds, setLifePictureIds] =
  useState<Record<string, string>>({});

const [lifePictureLoaded, setLifePictureLoaded] =
  useState(false);

const [showLifeEntryMenu, setShowLifeEntryMenu] =
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
  useState<NextMove[]>([]);

  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
const [artifactsLoaded, setArtifactsLoaded] = useState(false);

const [artifactsRefreshKey, setArtifactsRefreshKey] =
  useState(0);

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
}, [selectedIntentionId, artifactsRefreshKey]);

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
.select(
  "id, picture, status, version, updated_at, item_type, uri, title, x, y, width, height, rotation"
)
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
  rows.map((row, index) => {
    const storedX = Number(row.x);
    const storedY = Number(row.y);

    const hasStoredPosition =
      Number.isFinite(storedX) &&
      Number.isFinite(storedY) &&
      !(storedX === 0 && storedY === 0);

    return {
      id: row.id,

      text:
        typeof row.picture?.text === "string"
          ? row.picture.text
          : "",

      itemType:
        row.item_type || "text",

      uri: row.uri || undefined,

      title: row.title || undefined,

      x: hasStoredPosition
        ? storedX
        : (index % 2) * 135 + 10,

      y: hasStoredPosition
        ? storedY
        : Math.floor(index / 2) * 150 + 10,

      width: Number(row.width) || 180,

      height: Number(row.height) || 120,

      rotation:
        Number.isFinite(Number(row.rotation))
          ? Number(row.rotation)
          : index % 2 === 0
            ? -1
            : 1,
    };
  })
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
// ☁️ LIFE PICTURE — UPLOAD IMAGE
// --------------------------------------------------


// --------------------------------------------------
// 💾 LIFE PICTURE — SAVE ONE ENTRY
// --------------------------------------------------

const saveLifeEntry = async (entry: LifeEntry) => {
  if (!lifePictureLoaded) {
    return;
  }

const rawText = entry.text.trim();

if (!rawText && entry.itemType === "text") {
  return;
}

  try {
    const userId = await getUserId();

    if (!userId) {
      return;
    }

let storedUri: string | null = entry.uri ?? null;

if (
  entry.itemType === "image" &&
  entry.uri
) {
  storedUri = await uploadSovereignImage({
    uri: entry.uri,
    userId,
    mimeType: entry.mimeType,
  });

  if (!storedUri) {
    return;
  }
}

    const saved = await saveSovereignLifePicture({
      userId,
      lifePictureId: lifePictureIds[entry.id],
      text: rawText,
    });

    if (saved?.id) {
  const { error: layoutError } = await supabase
    .from("sovereign_life_pictures")
    .update({
      item_type: entry.itemType,
uri: storedUri || null,
      title: entry.title || null,
      x: entry.x,
      y: entry.y,
      width: entry.width,
      height: entry.height,
      rotation: entry.rotation,
    })
    .eq("id", saved.id);

  if (layoutError) {
    console.error(
      "❌ LIFE ENTRY LAYOUT SAVE ERROR:",
      layoutError
    );
  }
}

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

const addLifeEntry = () => {
  const index = lifeEntries.length;

const newEntry: LifeEntry = {
  id: `life-${Date.now()}`,
  text: "",
  itemType: "image",
  uri: image.originalUri,
  mimeType: image.mimeType,
  x: (index % 2) * 135 + 10,
    y: Math.floor(index / 2) * 150 + 10,
    width: 180,
    height: 120,
    rotation: index % 2 === 0 ? -1 : 1,
  };

setLifeEntries((current) => [
  ...current,
  newEntry,
]);

setShowLifeEntryMenu(false);

void saveLifeEntry(newEntry);

};

const addLifeImage = async () => {
  try {
    const image = await pickSovereignImage();

    if (!image) {
      return;
    }

    const index = lifeEntries.length;

    const newEntry: LifeEntry = {
      id: `life-${Date.now()}`,
      text: "",
      itemType: "image",
      uri: image.originalUri,
      x: (index % 2) * 135 + 10,
      y: Math.floor(index / 2) * 150 + 10,
      width: 180,
      height: 140,
      rotation: index % 2 === 0 ? -1.2 : 1.2,
    };

    setLifeEntries((current) => [
      ...current,
      newEntry,
    ]);

    setShowLifeEntryMenu(false);

    void saveLifeEntry(newEntry);
  } catch (error) {
    console.error(
      "❌ LIFE ENTRY IMAGE ERROR:",
      error
    );
  }
};

const addLifeQuote = () => {
  const index = lifeEntries.length;

  const newEntry: LifeEntry = {
    id: `life-${Date.now()}`,
    text: "",
    itemType: "quote",
    x: (index % 2) * 135 + 10,
    y: Math.floor(index / 2) * 150 + 10,
width: 320,
height: 240,
    rotation: index % 2 === 0 ? -1.2 : 1.2,
  };

  setLifeEntries((current) => [
    ...current,
    newEntry,
  ]);

  setShowLifeEntryMenu(false);

  void saveLifeEntry(newEntry);
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

<View style={styles.lifeBoard}>

{lifeEntries.map((entry) => {
const panResponder = PanResponder.create({
  onStartShouldSetPanResponder: () => true,

  onStartShouldSetPanResponderCapture: () => true,

  onMoveShouldSetPanResponder: () => true,

  onMoveShouldSetPanResponderCapture: () => true,

  onPanResponderMove: (_, gestureState) => {
    setLifeEntries((current) =>
      current.map((item) =>
        item.id === entry.id
          ? {
              ...item,
              x: entry.x + gestureState.dx,
              y: entry.y + gestureState.dy,
            }
          : item
      )
    );
  },

  onPanResponderRelease: (_, gestureState) => {
    const finalEntry = {
      ...entry,
      x: entry.x + gestureState.dx,
      y: entry.y + gestureState.dy,
    };

    void saveLifeEntry(finalEntry);
  },
});

  return (
    <View
      key={entry.id}
      {...panResponder.panHandlers}
style={[
  entry.itemType === "quote"
    ? styles.lifeQuoteEntry
    : styles.lifeEntry,
  {
    left: entry.x,
    top: entry.y,
    width: entry.width,
    height: entry.height,
          transform: [
            {
              rotate: `${entry.rotation}deg`,
            },
          ],
        },
      ]}
    >
      {entry.itemType === "image" && entry.uri ? (
        <Image
          source={{ uri: entry.uri }}
          style={styles.lifeEntryImage}
          resizeMode="cover"
            pointerEvents="none"

        />
      ) : entry.itemType === "quote" ? (
        <View style={styles.lifeQuoteCard}>
          <Text style={styles.lifeQuoteMark}>“</Text>

          <TextInput
            value={entry.text}
onChangeText={(value) => {
  const charactersPerLine = 34;
  const lineHeight = 24;
  const minimumHeight = 120;

  const estimatedLines = Math.max(
    1,
    Math.ceil(value.length / charactersPerLine)
  );

  const nextHeight = Math.max(
    minimumHeight,
    estimatedLines * lineHeight + 60
  );

  setLifeEntries((current) =>
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
              const currentEntry = lifeEntries.find(
                (item) => item.id === entry.id
              );

              if (currentEntry) {
                void saveLifeEntry(currentEntry);
              }
            }}
            multiline
            placeholder="Your quote..."
            placeholderTextColor="#77746F"
            style={styles.lifeQuoteText}
          />

          <Text style={styles.lifeQuoteMark}>”</Text>
        </View>
      ) : (
        <TextInput
          value={entry.text}
          onChangeText={(value) =>
            setLifeEntries((current) =>
              current.map((item) =>
                item.id === entry.id
                  ? {
                      ...item,
                      text: value,
                    }
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
          placeholderTextColor="#77746F"
          style={styles.lifeEntryText}
        />
      )}
    </View>
  );
})}

{showLifeEntryMenu && (
  <View style={styles.lifeEntryMenu}>

    <Pressable
      onPress={addLifeEntry}
      style={styles.lifeEntryMenuItem}
    >
      <Text style={styles.lifeEntryMenuText}>
        TEXT
      </Text>
    </Pressable>

    <Pressable
      onPress={() => {
        void addLifeImage();
      }}
      style={styles.lifeEntryMenuItem}
    >
      <Text style={styles.lifeEntryMenuText}>
        IMAGE
      </Text>
    </Pressable>

    <Pressable
      disabled
      style={[
        styles.lifeEntryMenuItem,
        styles.lifeEntryMenuItemDisabled,
      ]}
    >
      <Text style={styles.lifeEntryMenuText}>
        VOICE
      </Text>
    </Pressable>

<Pressable
  onPress={addLifeQuote}
  style={styles.lifeEntryMenuItem}
>
  <Text style={styles.lifeEntryMenuText}>
    QUOTE
  </Text>
</Pressable>

    <Pressable
      disabled
      style={[
        styles.lifeEntryMenuItem,
        styles.lifeEntryMenuItemDisabled,
      ]}
    >
      <Text style={styles.lifeEntryMenuText}>
        LINK
      </Text>
    </Pressable>

    <Pressable
      disabled
      style={[
        styles.lifeEntryMenuItem,
        styles.lifeEntryMenuItemDisabled,
      ]}
    >
      <Text style={styles.lifeEntryMenuText}>
        ATTACHMENT
      </Text>
    </Pressable>

  </View>
)}

<Pressable
  onPress={() =>
    setShowLifeEntryMenu((current) => !current)
  }
  style={styles.addLifeEntry}
>
  <Text style={styles.addLifeEntryText}>
    {showLifeEntryMenu ? "×" : "+"}
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

const stateColor = "#C9A84E";

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
  scrollEnabled={activeStage !== "build"}
>

  <View style={styles.stageWorkspace}>
{activeStage === "dream" && (
<StageDream
  intentionId={selectedIntentionId}
/>
)}

{activeStage === "discover" && (
  <StageDiscover
    intentionId={selectedIntentionId}
    alignmentContext={alignmentContext}
  />
)}

{activeStage === "build" && (
<StageBuild
  intentionId={selectedIntentionId}
  onOptionsChange={setNextStepOptions}
  onCreationCreated={() =>
    setArtifactsRefreshKey((value) => value + 1)
  }
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
  const [selectedArtifact, setSelectedArtifact] =
    useState<Artifact | null>(null);

  const areaArtifacts = artifacts.filter(
    (artifact) => artifact.area === area
  );

  const affirmation = areaArtifacts.find((artifact) =>
    artifact.artifact_type
      .toLowerCase()
      .includes("affirmation")
  );

  const otherArtifacts = areaArtifacts.filter(
    (artifact) => artifact.id !== affirmation?.id
  );

  const getSymbol = (
    artifactType: string,
    titleText: string
  ) => {
    const type = artifactType.toLowerCase();
    const title = titleText.toLowerCase();

    // -----------------------------
    // I — INNER / EMBODIMENT
    // -----------------------------
    if (
      type.includes("affirmation") ||
      type.includes("embodiment")
    ) {
      return "✦";
    }

    if (
      type.includes("pattern") ||
      type.includes("reflection")
    ) {
      return "◇";
    }

    if (
      type.includes("inner_shift") ||
      type.includes("shift") ||
      type.includes("insight")
    ) {
      return "◌";
    }

    if (
      type.includes("behaviour") ||
      type.includes("behavior")
    ) {
      return "↗";
    }

    if (
      type.includes("symbol") ||
      type.includes("sign")
    ) {
      return "✧";
    }

    // -----------------------------
    // PEOPLE — RELATIONSHIPS
    // -----------------------------
    if (type.includes("conversation")) return "◌";
    if (type.includes("connection")) return "∞";
    if (type.includes("community")) return "✦";
    if (type.includes("collaboration")) return "◇";
    if (type.includes("reciprocity")) return "↔";
    if (type.includes("mentoring")) return "○";
    if (type.includes("celebration")) return "✧";

    // -----------------------------
    // PLANET — CONTRIBUTION
    // -----------------------------
    if (type.includes("instagram")) return "✦";
    if (type.includes("linkedin")) return "◇";
    if (type.includes("article")) return "◇";
    if (type.includes("project")) return "□";
    if (type.includes("website")) return "◌";
    if (type.includes("app")) return "◌";
    if (type.includes("event")) return "△";
    if (type.includes("book")) return "✦";
    if (type.includes("art")) return "✧";
    if (type.includes("video")) return "▷";
    if (type.includes("podcast")) return "◉";
    if (type.includes("launch")) return "↗";

    // -----------------------------
    // GENERIC CREATION ARTIFACTS
    // -----------------------------
    if (
      type.includes("creation_seed") ||
      type.includes("seed")
    ) {
      return "✦";
    }

    if (type.includes("practice")) return "◇";
    if (type.includes("plan")) return "□";
    if (type.includes("possibility")) return "✧";

    // Use the title as a gentle fallback.
    if (
      title.includes("practice") ||
      title.includes("exercise") ||
      title.includes("meditation")
    ) {
      return "◇";
    }

    if (
      title.includes("plan") ||
      title.includes("routine")
    ) {
      return "□";
    }

    if (
      title.includes("connection") ||
      title.includes("relationship")
    ) {
      return "∞";
    }

    // Unknown artifact = meaningful OTHER
    return "⋯";
  };

  const getArtifactContent = (artifact: Artifact) => {
    if (!artifact.content) {
      return "";
    }

    if (typeof artifact.content === "string") {
      return artifact.content;
    }

    const content =
      artifact.content as Record<string, unknown>;

    const preferredKeys = [
      "content",
      "text",
      "body",
      "description",
      "reflection",
      "message",
    ];

    for (const key of preferredKeys) {
      if (typeof content[key] === "string") {
        return content[key] as string;
      }
    }

    return JSON.stringify(content, null, 2);
  };

  const deleteArtifact = async () => {
    if (!selectedArtifact) {
      return;
    }

    const { error } = await supabase
      .from("sovereign_intention_artifacts")
      .delete()
      .eq("id", selectedArtifact.id);

    if (error) {
      console.error(
        "❌ ARTIFACT DELETE ERROR:",
        error
      );
      return;
    }

    setSelectedArtifact(null);
  };

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
      ) : (
        <View style={styles.outputField}>

          {/* I — AFFIRMATION ONLY */}
{area === "I" && (
  <View style={styles.affirmationArea}>
    <Text style={styles.affirmationText}>
      {affirmation
        ? getArtifactContent(affirmation)
        : "Your affirmation will appear here."}
    </Text>
  </View>
)}

          {/* SYMBOLIC FIELD */}
          <View style={styles.symbolField}>
            {otherArtifacts.map((artifact) => (
              <Pressable
                key={artifact.id}
                onPress={() =>
                  setSelectedArtifact(artifact)
                }
                style={styles.symbolArtifact}
              >
                <Text style={styles.artifactSymbol}>
                  {getSymbol(
                    artifact.artifact_type,
                    artifact.title
                  )}
                </Text>
              </Pressable>
            ))}

            {/* OTHER — always available */}
            <Pressable
              onPress={() => {
                // Reserved for future "Other" creation flow.
              }}
              style={styles.symbolArtifact}
            >
              <Text
                style={[
                  styles.artifactSymbol,
                  styles.otherSymbol,
                ]}
              >
                ⋯
              </Text>
            </Pressable>
          </View>

          {/* ARTIFACT READER */}
          {selectedArtifact && (
            <View style={styles.artifactReader}>

              <Pressable
                onPress={() =>
                  setSelectedArtifact(null)
                }
                style={styles.artifactReaderClose}
                hitSlop={12}
              >
                <Text
                  style={styles.artifactReaderCloseText}
                >
                  ×
                </Text>
              </Pressable>

              <Text style={styles.artifactReaderType}>
                {selectedArtifact.artifact_type.replace(
                  /_/g,
                  " "
                )}
              </Text>

              <Text style={styles.artifactReaderTitle}>
                {selectedArtifact.title}
              </Text>

              <Text style={styles.artifactReaderContent}>
                {getArtifactContent(selectedArtifact)}
              </Text>

              <Pressable
                onPress={() => {
                  void deleteArtifact();
                }}
                style={styles.artifactDelete}
              >
                <Text style={styles.artifactDeleteText}>
                  DELETE
                </Text>
              </Pressable>
            </View>
          )}

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

                      <Text style={styles.stagePrompt}>
        Whar is the Dream?
      </Text>
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
  alignmentContext,
}: {
  intentionId: string | null;
  alignmentContext: ReturnType<typeof buildAlignmentOSContext>;
}) {
const [consciousDesire, setConsciousDesire] = useState("");

const [patternReflection, setPatternReflection] = useState("");

const [isRefreshing, setIsRefreshing] = useState(false);

const [creationPatterns, setCreationPatterns] =
  useState<CreationPattern[]>([]);

useEffect(() => {
  const loadDiscoverStep = async () => {
    if (!intentionId) {
      setConsciousDesire("");
      setPatternReflection("");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("sovereign_intention_steps")
        .select("id, response, ai_response")
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

      const response =
        typeof data?.response === "object" &&
        data.response !== null
          ? data.response as {
              consciousDesire?: string;
            }
          : {};

      const aiResponse =
        typeof data?.ai_response === "object" &&
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

      // Existing stored reflection
      if (aiResponse.patternReflection?.trim()) {
        setPatternReflection(
          aiResponse.patternReflection.trim()
        );
        return;
      }

      // No reflection exists yet for this creation.
      // Generate it now so every creation gets its own reflection.
      const userId = await getUserId();

      if (!userId) {
        setPatternReflection("");
        return;
      }

      const context = await getCreationContext({
        userId,
        intentionId,
      });

      const proposal = await discoverConsciousDesire({
        context,
      });

      if (!proposal) {
        setPatternReflection("");
        return;
      }

      setPatternReflection(
        proposal.patternReflection || ""
      );

      // Preserve the human-confirmed response.
      // Store the AI proposal alongside it.
      if (data?.id) {
        const { error: updateError } = await supabase
          .from("sovereign_intention_steps")
          .update({
            ai_response: proposal,
          })
          .eq("id", data.id);

        if (updateError) {
          console.error(
            "❌ SOVEREIGN DISCOVER AI RESPONSE SAVE ERROR:",
            updateError
          );
        }
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

const { data: existing, error: findError } =
  await supabase
    .from("sovereign_intention_steps")
    .select("id")
    .eq("intention_id", intentionId)
    .eq("step", "discover")
    .maybeSingle();

if (findError) {
  console.error(
    "❌ SOVEREIGN DISCOVER REFRESH FIND ERROR:",
    findError
  );
} else if (existing) {
  const { error: updateError } = await supabase
    .from("sovereign_intention_steps")
    .update({
      ai_response: proposal,
    })
    .eq("id", existing.id);

  if (updateError) {
    console.error(
      "❌ SOVEREIGN DISCOVER REFRESH SAVE ERROR:",
      updateError
    );
  }
}

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
          <Text style={styles.stagePrompt}>
        Your Concious Desire
      </Text>

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
  onCreationCreated,
}: {
  intentionId: string | null;
  onOptionsChange: (options: NextMove[]) => void;
  onCreationCreated: () => void;
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

  const conversationScrollRef =
  useRef<ScrollView>(null);  

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

console.log(
  "🔎 CHOOSE NEXT MOVE INPUT:",
  {
    intentionId,
    move,
  }
);

const result = await chooseNextMove({
  intentionId,
  move,
});

      console.log(
        "✨ CREATION CREATED:",
        result
      );

      onCreationCreated();

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

      <Text style={styles.mirrorWelcomeText}>
        I'm here with you in this creation.
        Tell me what's alive.
      </Text>

      {/* -------------------------------------------- */}
      {/* MIRROR CONVERSATION                         */}
      {/* -------------------------------------------- */}

      <ScrollView
        ref={conversationScrollRef}
        style={styles.buildConversation}
        onContentSizeChange={() => {
          requestAnimationFrame(() => {
            conversationScrollRef.current?.scrollToEnd({
              animated: true,
            });
          });
        }}
      >
        {conversation.map((item, index) => {
          const isUser = item.role === "user";

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
        })}

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
          disabled={!message.trim() || isSending}
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

                </Pressable>
              );
            })}

            {/* DO NOTHING IS ALWAYS A HUMAN CHOICE */}

            <Pressable
              onPress={handlePause}
              style={[
                styles.pauseMoveButton,
                selectedNextMove === "DO NOTHING FOR NOW" &&
                  styles.nextMoveButtonSelected,
              ]}
            >
              <Text style={styles.pauseMoveTitle}>
                DO NOTHING FOR NOW
              </Text>
            </Pressable>

          </View>
        </View>
      )}

    </View>
  );
}

function StageGrow({
  intentionId,
}: {
  intentionId: string | null;
}) {
  const GROW_VALUES = [
    {
      id: "oneness",
      label: "Oneness",
      invitation: "Be with nature",
      chakra: "earth_star",
    },
    {
      id: "abundance",
      label: "Abundance",
      invitation: "Trust and receive",
      chakra: "root",
    },
    {
      id: "aliveness",
      label: "Aliveness",
      invitation: "Everyday moments",
      chakra: "sacral",
    },
    {
      id: "presence",
      label: "Presence",
      invitation: "Just be",
      chakra: "solar_plexus",
    },
    {
      id: "wellbeing",
      label: "Wellbeing",
      invitation: "Love yourself",
      chakra: "heart",
    },
    {
      id: "freedom",
      label: "Freedom",
      invitation: "Express yourself",
      chakra: "throat",
    },
    {
      id: "possibility",
      label: "Possibility",
      invitation: "See the magic",
      chakra: "third_eye",
    },
    {
      id: "clarity",
      label: "Clarity",
      invitation: "Keep it simple",
      chakra: "crown",
    },
    {
      id: "connection",
      label: "Connection",
      invitation: "The bigger picture",
      chakra: "soul_star",
    },
  ];

  const CHAKRA_COLORS: Record<string, string> = {
    earth_star: "#6B4F3A",
    root: "#D94A4A",
    sacral: "#E88935",
    solar_plexus: "#E5C94A",
    heart: "#62A86B",
    throat: "#4F8FBF",
    third_eye: "#6657A6",
    crown: "#9A72B5",
    soul_star: "#D8C7A2",
  };

  const [sliders, setSliders] = useState<
    Record<string, number>
  >({});

  const [additionalText, setAdditionalText] =
    useState("");

  const [sliderWidth, setSliderWidth] =
    useState(0);

  /*
   * --------------------------------------------------
   * LOAD GROW
   * --------------------------------------------------
   *
   * Existing saved creation values win.
   *
   * If this creation has never had GROW values,
   * seed the sliders from the current Living Field
   * chakra polarity.
   * --------------------------------------------------
   */

  useEffect(() => {
    const loadGrowStep = async () => {
      if (!intentionId) {
        setSliders({});
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

        /*
         * ------------------------------------------------
         * EXISTING GROW
         * ------------------------------------------------
         */

        if (data?.response) {
          const parsed =
            typeof data.response === "string"
              ? JSON.parse(data.response)
              : data.response;

          if (
            parsed?.sliders &&
            typeof parsed.sliders === "object"
          ) {
            setSliders(parsed.sliders);
          } else {
            setSliders({});
          }

          setAdditionalText(
            typeof parsed?.additionalText === "string"
              ? parsed.additionalText
              : ""
          );

          return;
        }

        /*
         * ------------------------------------------------
         * NEW GROW
         *
         * Seed from current chakra state.
         * Chakra polarity is -1 → +1.
         * Slider position is 0 → 1.
         * ------------------------------------------------
         */

        const userId = await getUserId();

        if (!userId) {
          setSliders({});
          return;
        }

        const context = await getCreationContext({
          userId,
          intentionId,
          activeStage: "grow",
        });

const chakraScores =
  context?.livingField?.chakraState?.scores ||
  {};

        const seededSliders: Record<
          string,
          number
        > = {};

        GROW_VALUES.forEach((value) => {
          const chakraScore = Number(
            chakraScores?.[value.chakra]
          );

          /*
           * Existing chakra polarity:
           * -1 = contracted
           *  0 = neutral
           * +1 = expansive
           *
           * GROW slider:
           *  0 = low
           *  0.5 = neutral
           *  1 = high
           */

          if (Number.isFinite(chakraScore)) {
            seededSliders[value.id] = Math.max(
              0,
              Math.min(
                1,
                (chakraScore + 1) / 2
              )
            );
          } else {
            seededSliders[value.id] = 0.5;
          }
        });

        setSliders(seededSliders);
        setAdditionalText("");
      } catch (error) {
        console.error(
          "❌ SOVEREIGN GROW LOAD ERROR:",
          error
        );

        setSliders({});
        setAdditionalText("");
      }
    };

    void loadGrowStep();
  }, [intentionId]);

  /*
   * --------------------------------------------------
   * SAVE GROW
   * --------------------------------------------------
   */

  const saveGrow = async (
    nextSliders: Record<string, number>,
    nextAdditionalText: string
  ) => {
    if (!intentionId) {
      return;
    }

    try {
      const response = {
        sliders: nextSliders,
        additionalText: nextAdditionalText,
      };

      const {
        data: existing,
        error: findError,
      } = await supabase
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

  /*
   * --------------------------------------------------
   * SLIDER UPDATE
   * --------------------------------------------------
   */

  const updateSlider = (
    id: string,
    value: number
  ) => {
    const nextValue = Math.max(
      0,
      Math.min(1, value)
    );

    const nextSliders = {
      ...sliders,
      [id]: nextValue,
    };

    setSliders(nextSliders);

    void saveGrow(
      nextSliders,
      additionalText
    );
  };

  /*
   * --------------------------------------------------
   * ADDITIONAL TEXT
   * --------------------------------------------------
   */

  const updateAdditionalText = (
    value: string
  ) => {
    setAdditionalText(value);
  };

  const saveAdditionalText = async () => {
    await saveGrow(
      sliders,
      additionalText
    );
  };

  /*
   * --------------------------------------------------
   * SLIDER
   * --------------------------------------------------
   */

  const renderSlider = (
    item: (typeof GROW_VALUES)[number]
  ) => {
    const value =
      sliders[item.id] ?? 0.5;

    const lineHeight = 105;
    const thumbSize = 9;

    const updateFromY = (
      y: number
    ) => {
      const position =
        Math.max(
          0,
          Math.min(
            lineHeight,
            y
          )
        );

      /*
       * Vertical slider:
       * top = 1
       * bottom = 0
       */

      const nextValue =
        1 -
        position / lineHeight;

      updateSlider(
        item.id,
        nextValue
      );
    };

    const panResponder =
      PanResponder.create({
        onStartShouldSetPanResponder:
          () => true,

        onMoveShouldSetPanResponder:
          () => true,

        onPanResponderGrant: (
          event
        ) => {
          updateFromY(
            event.nativeEvent.locationY
          );
        },

        onPanResponderMove: (
          event
        ) => {
          updateFromY(
            event.nativeEvent.locationY
          );
        },
      });

    const thumbTop =
      (1 - value) *
        lineHeight -
      thumbSize / 2;

    return (
      <View
        key={item.id}
        style={{
          flex: 1,
          alignItems: "center",
          minWidth: 45,
        }}
      >
        <View
          {...panResponder.panHandlers}
          onLayout={(event) => {
            if (!sliderWidth) {
              setSliderWidth(
                event.nativeEvent.layout.width
              );
            }
          }}
          style={{
            height: lineHeight,
            width: 20,
            alignItems: "center",
            justifyContent:
              "flex-start",
          }}
        >
          {/* TRACK */}

          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 2,
              borderRadius: 2,
              backgroundColor:
                CHAKRA_COLORS[
                  item.chakra
                ],
              opacity: 0.65,
            }}
          />

          {/* THUMB */}

          <View
            style={{
              position: "absolute",
              top: thumbTop,
              width: thumbSize,
              height: thumbSize,
              borderRadius:
                thumbSize / 2,
              backgroundColor:
                CHAKRA_COLORS[
                  item.chakra
                ],
              borderWidth: 2,
              borderColor:
                "#EEECE6",
            }}
          />
        </View>

        {/* LABEL */}

 <Text
  style={{
    marginTop: 12,
    color: "#B8B4AC",
    fontFamily: Fonts.light,
    fontSize: 11,
    lineHeight: 15,
    textAlign: "center",
  }}
>
  {item.label}
</Text>

        {/* INVITATION */}

 <Text
  style={{
    marginTop: 4,
    color: "rgba(255,255,255,0.58)",
    fontFamily: Fonts.light,
    fontSize: 9,
    lineHeight: 12,
    textAlign: "center",
    maxWidth: 62,
  }}
>
  {item.invitation}
</Text>

      </View>
    );
  };

  return (
    <View>
      {/* QUESTION */}

      <Text
        style={{
          color: Colors.mutedText,
          fontFamily: Fonts.light,
          fontSize: 12,
          lineHeight: 18,
          marginTop: 6,
        }}
      >
        What wants to rise in this creation?
      </Text>

      {/* NINE SLIDERS */}

      <View
        style={{
          flexDirection: "row",
          width: "100%",
marginTop: 50,
paddingHorizontal: 2,
minHeight: 145,
        }}
      >
        {GROW_VALUES.map(
          renderSlider
        )}
      </View>

      {/* OPTIONAL ADDITION */}

      <View
        style={{
          marginTop: 60,
        }}
      >
        <View
          style={{
            width: "100%",
            minHeight: 70,
            padding: 14,
            borderRadius: 11,
            backgroundColor:
              "#EEECE6",
          }}
        >
          <TextInput
            value={additionalText}
            onChangeText={
              updateAdditionalText
            }
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
              outlineStyle:
                "none" as const,
              textAlignVertical:
                "top" as const,
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
const SCALE_PORTALS = [
  {
    id: "people",
    label: "PEOPLE",
    question: "Who wants to be part of this creation?",
  },
  {
    id: "places",
    label: "PLACES",
    question: "Where does this creation want to live?",
  },
  {
    id: "things",
    label: "THINGS",
    question: "What does this creation want to bring into the world?",
  },
] as const;

  type PortalId = (typeof SCALE_PORTALS)[number]["id"];

  type PortalResponse = {
    selectedOptions: string[];
    text: string;
  };

  type ScaleState = {
    activePortal: PortalId;
    portals: Record<PortalId, PortalResponse>;
  };

  const createEmptyState = (): ScaleState => ({
    activePortal: "people",
    portals: {
      people: {
        selectedOptions: [],
        text: "",
      },
      places: {
        selectedOptions: [],
        text: "",
      },
      things: {
        selectedOptions: [],
        text: "",
      },
    },
  });

  const [scaleState, setScaleState] =
    useState<ScaleState>(createEmptyState);

    const [possibilities, setPossibilities] =
  useState<{
    people: string[];
    places: string[];
    things: string[];
  }>({
    people: [],
    places: [],
    things: [],
  });

const [isGenerating, setIsGenerating] =
  useState(false);

  /*
   * --------------------------------------------------
   * LOAD SCALE
   *
   * Everything belongs to the selected creation.
   * Each creation has its own People / Places / Things.
   * --------------------------------------------------
   */

  useEffect(() => {
    const loadScale = async () => {
      if (!intentionId) {
        setScaleState(createEmptyState());
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
          setScaleState(createEmptyState());
          return;
        }

        const parsed =
          typeof data.response === "string"
            ? JSON.parse(data.response)
            : data.response;

        const loadedPortals =
          parsed?.portals &&
          typeof parsed.portals === "object"
            ? parsed.portals
            : {};

        const activePortal =
          parsed?.activePortal === "people" ||
          parsed?.activePortal === "places" ||
          parsed?.activePortal === "things"
            ? parsed.activePortal
            : "people";

        setScaleState({
          activePortal,
          portals: {
            people: {
              selectedOptions:
                Array.isArray(
                  loadedPortals.people?.selectedOptions
                )
                  ? loadedPortals.people.selectedOptions
                  : [],
              text:
                typeof loadedPortals.people?.text === "string"
                  ? loadedPortals.people.text
                  : "",
            },
            places: {
              selectedOptions:
                Array.isArray(
                  loadedPortals.places?.selectedOptions
                )
                  ? loadedPortals.places.selectedOptions
                  : [],
              text:
                typeof loadedPortals.places?.text === "string"
                  ? loadedPortals.places.text
                  : "",
            },
            things: {
              selectedOptions:
                Array.isArray(
                  loadedPortals.things?.selectedOptions
                )
                  ? loadedPortals.things.selectedOptions
                  : [],
              text:
                typeof loadedPortals.things?.text === "string"
                  ? loadedPortals.things.text
                  : "",
            },
          },
        });
      } catch (error) {
        console.error(
          "❌ SOVEREIGN SCALE PARSE ERROR:",
          error
        );

        setScaleState(createEmptyState());
      }
    };

    void loadScale();
  }, [intentionId]);

  useEffect(() => {
  const loadPossibilities = async () => {
    if (!intentionId) {
      setPossibilities({
        people: [],
        places: [],
        things: [],
      });
      return;
    }

    try {
      setIsGenerating(true);

      const userId = await getUserId();

      if (!userId) {
        return;
      }

console.log(
  "🟣 SCALE POSSIBILITIES — START",
  {
    userId,
    intentionId,
  }
);

const result = await generateScalePossibilities({
  userId,
  intentionId,
});

console.log(
  "🟢 SCALE POSSIBILITIES — RETURNED",
  result
);

      setPossibilities({
        people: result.people.map(
          (item) => item.text
        ),
        places: result.places.map(
          (item) => item.text
        ),
        things: result.things.map(
          (item) => item.text
        ),
      });
    } catch (error) {
      console.error(
        "❌ SOVEREIGN SCALE POSSIBILITIES ERROR:",
        error
      );
    } finally {
      setIsGenerating(false);
    }
  };

  void loadPossibilities();
}, [intentionId]);

  /*
   * --------------------------------------------------
   * SAVE SCALE
   * --------------------------------------------------
   */

  const saveScale = async (
    nextState: ScaleState
  ) => {
    if (!intentionId) {
      return;
    }

    try {
      const response = {
        activePortal: nextState.activePortal,
        portals: nextState.portals,
      };

      const {
        data: existing,
        error: findError,
      } = await supabase
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

  /*
   * --------------------------------------------------
   * SELECT PORTAL
   * --------------------------------------------------
   */

  const selectPortal = async (
    portalId: PortalId
  ) => {
    const nextState = {
      ...scaleState,
      activePortal: portalId,
    };

    setScaleState(nextState);

    await saveScale(nextState);
  };

  /*
   * --------------------------------------------------
   * SELECT POSSIBILITY
   * --------------------------------------------------
   */

  const toggleOption = async (
    option: string
  ) => {
    const current =
      scaleState.portals[
        scaleState.activePortal
      ];

    const selected =
      current.selectedOptions.includes(option);

    const selectedOptions = selected
      ? current.selectedOptions.filter(
          (item) => item !== option
        )
      : [
          ...current.selectedOptions,
          option,
        ];

    const nextState: ScaleState = {
      ...scaleState,
      portals: {
        ...scaleState.portals,
        [scaleState.activePortal]: {
          ...current,
          selectedOptions,
        },
      },
    };

    setScaleState(nextState);

    await saveScale(nextState);
  };

  /*
   * --------------------------------------------------
   * HUMAN RESPONSE
   * --------------------------------------------------
   */

  const updateText = (text: string) => {
    const current =
      scaleState.portals[
        scaleState.activePortal
      ];

    setScaleState({
      ...scaleState,
      portals: {
        ...scaleState.portals,
        [scaleState.activePortal]: {
          ...current,
          text,
        },
      },
    });
  };

  const saveText = async () => {
    await saveScale(scaleState);
  };

  const activePortal =
    SCALE_PORTALS.find(
      (portal) =>
        portal.id === scaleState.activePortal
    ) || SCALE_PORTALS[0];

  const activeResponse =
    scaleState.portals[
      scaleState.activePortal
    ];

  return (
    <View>
      {/* -------------------------------------------- */}
      {/* SCALE                                       */}
      {/* -------------------------------------------- */}

      <Text
        style={[
          styles.stagePrompt,
          {
            maxWidth: 430,
          },
        ]}
      >
        Where does this creation want to expand?
      </Text>

      {/* -------------------------------------------- */}
      {/* THREE PORTALS                               */}
      {/* -------------------------------------------- */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 12,
          marginTop: 30,
          marginBottom: 34,
        }}
      >
        {SCALE_PORTALS.map((portal) => {
          const selected =
            scaleState.activePortal === portal.id;

          const hasResponse =
            scaleState.portals[
              portal.id
            ].selectedOptions.length > 0 ||
            scaleState.portals[
              portal.id
            ].text.trim().length > 0;

          return (
            <Pressable
              key={portal.id}
              onPress={() =>
                void selectPortal(portal.id)
              }
              style={{
                flex: 1,
                alignItems: "center",
              }}
            >
              {/* PORTAL */}
              <View
                style={{
width: selected ? 62 : 54,
height: selected ? 62 : 54,
borderRadius: 31,
                  borderWidth: 1,
                  borderColor: selected
                    ? "#EEECE6"
                    : "rgba(255,255,255,0.16)",
                  backgroundColor: selected
                    ? "rgba(238,236,230,0.08)"
                    : "rgba(255,255,255,0.025)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
width: selected ? 36 : 32,
height: selected ? 36 : 32,
borderRadius: 18,
                    borderWidth: 1,
                    borderColor: selected
                      ? "rgba(238,236,230,0.55)"
                      : "rgba(255,255,255,0.12)",
                  }}
                />
              </View>

              <Text
                style={{
                  marginTop: 12,
                  color: selected
                    ? "#EEECE6"
                    : "rgba(255,255,255,0.52)",
                  fontFamily: Fonts.light,
                  fontSize: 10,
                  letterSpacing: 1.2,
                }}
              >
                {portal.label}
              </Text>

              {hasResponse && (
                <View
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: 3,
                    backgroundColor:
                      "#EEECE6",
                    marginTop: 7,
                  }}
                />
              )}
            </Pressable>
          );
        })}
      </View>

      {/* -------------------------------------------- */}
      {/* EXPANDED PORTAL                             */}
      {/* -------------------------------------------- */}

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor:
            "rgba(255,255,255,0.08)",
          paddingTop: 18,
        }}
      >
        <Text
          style={{
            color: "#EEECE6",
            fontFamily: Fonts.light,
            fontSize: 12,
            lineHeight: 22,
          }}
        >
          {activePortal.question}
        </Text>

        {/* ---------------------------------------- */}
        {/* POSSIBILITY SPARKS                       */}
        {/* ---------------------------------------- */}

<View
  style={{
    flexDirection: "row",
    gap: 7,
    marginTop: 12,
    width: "100%",
  }}
>

{possibilities[activePortal.id].map(
  (option) => {
              const selected =
                activeResponse.selectedOptions.includes(
                  option
                );

              return (
                <Pressable
                  key={option}
                  onPress={() =>
                    void toggleOption(option)
                  }
 style={{
  flex: 1,
  minWidth: 0,
  minHeight: 48,
  paddingVertical: 8,
  paddingHorizontal: 6,
  borderRadius: 8,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: selected
    ? "#EEECE6"
    : "rgba(255,255,255,0.035)",
  borderWidth: 1,
  borderColor: selected
    ? "#EEECE6"
    : "rgba(255,255,255,0.07)",
}}
                >
                  <Text
                    style={{
                      color: selected
                        ? "#2A2927"
                        : "rgba(255,255,255,0.62)",
                      fontFamily:
                        Fonts.light,
fontSize: 9,
lineHeight: 12,
textAlign: "center",
                    }}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            }
          )}
        </View>

        {/* ---------------------------------------- */}
        {/* HUMAN RESPONSE                           */}
        {/* ---------------------------------------- */}

        <View
          style={{
            marginTop: 14,
          }}
        >

          <View
            style={{
              marginTop: 9,
minHeight: 72,
padding: 12,
              borderRadius: 11,
              backgroundColor:
                "#EEECE6",
            }}
          >
            <TextInput
              value={activeResponse.text}
              onChangeText={updateText}
              onBlur={() =>
                void saveText()
              }
              multiline
              placeholder="Add, change, reject, or describe what you see..."
              placeholderTextColor="#77746F"
              style={{
minHeight: 58,
                color: "#2A2927",
                fontFamily: Fonts.light,
                fontSize: 11,
                lineHeight: 18,
                padding: 0,
                outlineStyle:
                  "none" as const,
                textAlignVertical:
                  "top" as const,
              }}
            />
          </View>
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
type RenewState = {
  feel: string;
  think: string;
  say: string;
  do: string;
  reflection: string;
};

const createEmptyState = (): RenewState => ({
  feel: "",
  think: "",
  say: "",
  do: "",
  reflection: "",
});

  const [renewState, setRenewState] =
    useState<RenewState>(createEmptyState);

  const [loaded, setLoaded] = useState(false);

  const [isReflecting, setIsReflecting] =
  useState(false);

  // --------------------------------------------------
  // LOAD RENEW
  // --------------------------------------------------

  useEffect(() => {
    const loadRenew = async () => {
      if (!intentionId) {
        setRenewState(createEmptyState());
        setLoaded(false);
        return;
      }

      setLoaded(false);

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
          setRenewState(createEmptyState());
          return;
        }

        const response =
          typeof data.response === "string"
            ? JSON.parse(data.response)
            : data.response;

        setRenewState({
          feel:
            typeof response?.feel === "string"
              ? response.feel
              : "",

          think:
            typeof response?.think === "string"
              ? response.think
              : "",

          say:
            typeof response?.say === "string"
              ? response.say
              : "",

          do:
            typeof response?.do === "string"
              ? response.do
              : "",
          reflection:
  typeof response?.reflection === "string"
    ? response.reflection
    : "",    
        });
      } catch (error) {
        console.error(
          "❌ SOVEREIGN RENEW LOAD ERROR:",
          error
        );

        setRenewState(createEmptyState());
      } finally {
        setLoaded(true);
      }
    };

    void loadRenew();
  }, [intentionId]);

  // --------------------------------------------------
  // SAVE RENEW
  // --------------------------------------------------

  const saveRenew = async (
    nextState: RenewState
  ) => {
    if (!intentionId) {
      return;
    }

    try {
const response = {
  feel: nextState.feel.trim(),
  think: nextState.think.trim(),
  say: nextState.say.trim(),
  do: nextState.do.trim(),
  reflection: nextState.reflection.trim(),
};

      const {
        data: existing,
        error: findError,
      } = await supabase
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

  // --------------------------------------------------
  // UPDATE ONE FIELD
  // --------------------------------------------------

const updateField = (
  field: keyof RenewState,
  value: string
) => {
  setRenewState((current) => ({
    ...current,
    [field]: value,
    reflection: "",
  }));
};

  // --------------------------------------------------
  // SAVE ONE FIELD
  // --------------------------------------------------

  const saveField = (
    field: keyof RenewState
  ) => {
    const nextState = {
      ...renewState,
    };

    void saveRenew(nextState);
  };

const generateReflection = async () => {
  if (!intentionId) {
    return;
  }

  const hasInput =
    renewState.feel.trim() ||
    renewState.think.trim() ||
    renewState.say.trim() ||
    renewState.do.trim();

  if (!hasInput) {
    return;
  }

  try {
    setIsReflecting(true);

    const userId = await getUserId();

    if (!userId) {
      return;
    }

    console.log(
      "🟣 RENEW REFLECTION — START",
      {
        userId,
        intentionId,
      }
    );

    const result =
      await generateRenewReflection({
        userId,
        intentionId,
        inputs: {
          feel: renewState.feel,
          think: renewState.think,
          say: renewState.say,
          do: renewState.do,
        },
      });

    console.log(
      "🟢 RENEW REFLECTION — RETURNED",
      result
    );

    const nextState = {
      ...renewState,
      reflection: result.reflection,
    };

    setRenewState(nextState);

    await saveRenew(nextState);
  } catch (error) {
    console.error(
      "❌ SOVEREIGN RENEW REFLECTION ERROR:",
      error
    );
  } finally {
    setIsReflecting(false);
  }
};

// --------------------------------------------------
// 🌱 AUTO REFLECTION
// --------------------------------------------------
// When all four fields are present and the human
// becomes quiet for 3 seconds, let the RENEW agent
// reflect.
// --------------------------------------------------

useEffect(() => {
  if (
    !loaded ||
    isReflecting ||
    renewState.reflection.trim()
  ) {
    return;
  }

  const hasAllInputs =
    renewState.feel.trim() &&
    renewState.think.trim() &&
    renewState.say.trim() &&
    renewState.do.trim();

  if (!hasAllInputs) {
    return;
  }

  const timer = setTimeout(() => {
    void generateReflection();
  }, 3000);

  return () => {
    clearTimeout(timer);
  };
}, [
  loaded,
  renewState.feel,
  renewState.think,
  renewState.say,
  renewState.do,
  renewState.reflection,
  isReflecting,
]);

  if (!loaded) {
    return (
      <View>

        <Text style={styles.stagePlaceholder}>
          ...
        </Text>
      </View>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <View>

      <Text style={styles.stagePrompt}>
        Pause. Notice what is here now.
      </Text>

      {/* -------------------------------------------- */}
      {/* FOUR REFLECTION BLOCKS                       */}
      {/* -------------------------------------------- */}

      <View style={styles.renewGrid}>

        {/* FEEL */}
        <View style={styles.renewBlock}>
          <Text style={styles.renewLabel}>
            FEEL
          </Text>

          <TextInput
            value={renewState.feel}
            onChangeText={(value) =>
              updateField("feel", value)
            }
            onBlur={() =>
              saveField("feel")
            }
            multiline
            placeholder="What am I feeling?"
            placeholderTextColor="#77746F"
            style={styles.renewInput}
          />
        </View>

        {/* THINK */}
        <View style={styles.renewBlock}>
          <Text style={styles.renewLabel}>
            THINK
          </Text>

          <TextInput
            value={renewState.think}
            onChangeText={(value) =>
              updateField("think", value)
            }
            onBlur={() =>
              saveField("think")
            }
            multiline
            placeholder="What am I thinking?"
            placeholderTextColor="#77746F"
            style={styles.renewInput}
          />
        </View>

        {/* SAY */}
        <View style={styles.renewBlock}>
          <Text style={styles.renewLabel}>
            SAY
          </Text>

          <TextInput
            value={renewState.say}
            onChangeText={(value) =>
              updateField("say", value)
            }
            onBlur={() =>
              saveField("say")
            }
            multiline
            placeholder="What am I saying?"
            placeholderTextColor="#77746F"
            style={styles.renewInput}
          />
        </View>

        {/* DO */}
        <View style={styles.renewBlock}>
          <Text style={styles.renewLabel}>
            DO
          </Text>

          <TextInput
            value={renewState.do}
            onChangeText={(value) =>
              updateField("do", value)
            }
            onBlur={() =>
              saveField("do")
            }
            multiline
            placeholder="What am I doing?"
            placeholderTextColor="#77746F"
            style={styles.renewInput}
          />
        </View>

      </View>

{renewState.reflection ? (
  <View style={styles.renewReflection}>

    <Text style={styles.renewReflectionText}>
      {renewState.reflection}
    </Text>
  </View>
) : null}

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
  flex: 1,
  minWidth: 0,
  borderRightWidth: 1,
  borderRightColor: Colors.divider,
},

middleColumn: {
  flex: 2,
  minWidth: 0,
  borderRightWidth: 1,
  borderRightColor: Colors.divider,
  flexDirection: "column" as const,
},

rightColumn: {
  flex: 1,
  minWidth: 0,
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

lifeBoard: {
  position: "relative" as const,
  minHeight: 620,
  marginTop: 18,
  overflow: "hidden" as const,
  backgroundColor: "rgba(255,255,255,0.018)",
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.05)",
},

lifeEntry: {
  position: "absolute" as const,
  padding: 14,
  borderRadius: 8,
  backgroundColor: "rgba(255,255,255,0.045)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.07)",
},

lifeEntryImage: {
  width: "100%",
  height: "100%",
  borderRadius: 6,
},

lifeEntryQuote: {
  flex: 1,
  color: Colors.white,
  fontFamily: Fonts.light,
  fontSize: 13,
  lineHeight: 20,
  padding: 0,
  outlineStyle: "none" as const,
  textAlignVertical: "center" as const,
  fontStyle: "italic" as const,
},

lifeEntryText: {
  flex: 1,
  color: Colors.white,
  fontFamily: Fonts.light,
  fontSize: 11,
  lineHeight: 18,
  padding: 0,
  outlineStyle: "none" as const,
  textAlignVertical: "top" as const,
},

lifeQuoteCard: {
  flex: 1,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  paddingHorizontal: 8,
},

lifeQuoteMark: {
  color: Colors.mutedText,
  fontFamily: Fonts.light,
  fontSize: 28,
  lineHeight: 28,
},

lifeQuoteEntry: {
  position: "absolute" as const,
  padding: 0,
  backgroundColor: "transparent",
  borderWidth: 0,
  borderColor: "transparent",
},

lifeQuoteText: {
  width: "100%",
  color: Colors.white,
  fontFamily: Fonts.light,
  fontSize: 16,
  lineHeight: 24,
  fontStyle: "italic" as const,
  textAlign: "center" as const,
  padding: 0,
  outlineStyle: "none" as const,
  textAlignVertical: "center" as const,
},

addLifeEntry: {
  position: "absolute" as const,
  right: 12,
  bottom: 12,
  width: 28,
  height: 28,
  alignItems: "center" as const,
  justifyContent: "center" as const,
},

addLifeEntryText: {
  color: Colors.mutedText,
  fontFamily: Fonts.light,
  fontSize: 22,
  lineHeight: 22,
},

lifeEntryMenu: {
  position: "absolute" as const,
  right: 12,
  bottom: 48,
  paddingVertical: 6,
  paddingHorizontal: 5,
  minWidth: 110,
  backgroundColor: "#11110F",
  borderRadius: 9,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.10)",
  zIndex: 20,
},

lifeEntryMenuItem: {
  paddingVertical: 8,
  paddingHorizontal: 10,
},

lifeEntryMenuItemDisabled: {
  opacity: 0.28,
},

lifeEntryMenuText: {
  color: Colors.mutedText,
  fontFamily: Fonts.light,
  fontSize: 8,
  letterSpacing: 1.2,
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
    borderColor: "rgba(201,168,78,0.16)",
  },

intentionTileSelected: {
  backgroundColor: "rgba(201,168,78,0.045)",
  borderColor: "rgba(201,168,78,0.65)",
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

  // --------------------------------------------------
// RENEW — REFLECTION
// --------------------------------------------------

renewReflection: {
  marginTop: 30,
  paddingTop: 24,
  paddingBottom: 28,
  borderTopWidth: 1,
  borderTopColor: "rgba(255,255,255,0.08)",
},

renewReflectionLabel: {
  color: Colors.white,
  fontFamily: Fonts.light,
  fontSize: 8,
  letterSpacing: 1.5,
  marginBottom: 14,
},

renewReflectionText: {
  color: Colors.white,
  fontFamily: Fonts.light,
  fontSize: 13,
  lineHeight: 22,
  maxWidth: 760,
},

journeyArea: {
  flex: 1,
  minHeight: 0,
  paddingTop: 18,
  paddingBottom: 10,
  paddingLeft: 10,
},

journeyContentScroll: {
  flex: 1,
  minHeight: 0,
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
borderColor: "rgba(201,168,78,0.38)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: Colors.background,
  },

journeyNodeActive: {
  borderColor: "rgba(201,168,78,0.90)",
  backgroundColor: "rgba(201,168,78,0.08)",
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
  backgroundColor: "rgba(201,168,78,0.18)",
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
  gap: 12,
},

buildConversation: {
  height: 205,
},

buildConversationContent: {
  gap: 14,
  paddingVertical: 6,
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
  paddingVertical: 7,
  paddingHorizontal: 11,
  borderRadius: 11,
},

chatBubbleMirror: {
  backgroundColor: "transparent",
  borderWidth: 0,
},

chatBubbleUser: {
  backgroundColor: "rgba(255,255,255,0.08)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
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
  minHeight: 38,
  maxHeight: 90,
  paddingVertical: 8,
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
    paddingTop: 20,
  },

  nextMovesLabel: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 7,
    letterSpacing: 1.4,
    marginBottom: 9,
  },

nextMovesList: {
  flexDirection: "row" as const,
  gap: 7,
  width: "100%",
},

nextMoveButton: {
  flex: 1,
  minWidth: 0,
  minHeight: 58,
  paddingVertical: 10,
  paddingHorizontal: 8,
  borderRadius: 10,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  backgroundColor: "rgba(255,255,255,0.035)",
  borderWidth: 1,
  borderColor: "rgba(201,168,78,0.14)",
},

  nextMoveButtonSelected: {
    backgroundColor: "rgba(95,158,114,0.15)",
    borderColor: "rgba(95,158,114,0.42)",
  },

nextMoveTitle: {
  color: Colors.white,
  fontFamily: Fonts.light,
  fontSize: 9,
  lineHeight: 13,
  textAlign: "center" as const,
},

  nextMoveDescription: {
    color: Colors.subtleText,
    fontFamily: Fonts.light,
    fontSize: 8,
    lineHeight: 13,
    marginTop: 5,
  },

pauseMoveButton: {
  flex: 1,
  minWidth: 0,
  minHeight: 58,
  marginTop: 0,
  paddingVertical: 10,
  paddingHorizontal: 8,
  borderRadius: 10,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.06)",
  backgroundColor: "transparent",
},

pauseMoveTitle: {
  color: Colors.subtleText,
  fontFamily: Fonts.light,
  fontSize: 8,
  letterSpacing: 1,
  textAlign: "center" as const,
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
  width: "92%",
  alignSelf: "center" as const,
  minHeight: 350,
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

  // --------------------------------------------------
  // RENEW
  // --------------------------------------------------

renewGrid: {
  flexDirection: "row" as const,
  gap: 10,
  width: "100%",
  marginTop: 34,
},

  renewBlock: {
    flex: 1,
    minWidth: 0,
  },

renewLabel: {
  color: Colors.white,
  fontFamily: Fonts.light,
  fontSize: 8,
  letterSpacing: 1.5,
  marginBottom: 8,
},

  renewInput: {
    minHeight: 145,
    backgroundColor: "#EEECE6",
    color: "#2A2927",
    fontFamily: Fonts.light,
    fontSize: 11,
    lineHeight: 17,
    padding: 14,
    borderRadius: 11,
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
  width: "92%",
  alignSelf: "center" as const,
  minHeight: 155,
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
  marginTop: 1,
  paddingTop: 1,
  borderTopWidth: 1,
  borderTopColor: "rgba(255,255,255,0.07)",
},

patternsHeader: {
  flexDirection: "row" as const,
  alignItems: "baseline" as const,
  justifyContent: "center" as const,
  gap: 9,
  marginBottom: 5,
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
  gap: 1,
  width: "92%",
  alignSelf: "center" as const,
},

patternCard: {
  width: "65%",
  alignSelf: "center",
  paddingVertical: 3,
  paddingHorizontal: 12,
  borderRadius: 7,
  backgroundColor: "transparent",
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
  backgroundColor: "rgba(255,255,255,0.18)",
  position: "relative" as const,
},

patternDot: {
  position: "absolute" as const,
  top: -2,
  marginLeft: -2,
  width: 5,
  height: 5,
  borderRadius: 5,
  backgroundColor: "rgba(255,255,255,0.75)",
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
  borderColor: "rgba(201,168,78,0.14)",
},

stepTileSelected: {
  backgroundColor: "rgba(201,168,78,0.10)",
  borderColor: "rgba(201,168,78,0.55)",
},

stepTileTitle: {
  color: Colors.white,
  fontFamily: Fonts.light,
  fontSize: 11,
  lineHeight: 16,
},

stepTileDescription: {
  color: Colors.mutedText,
  fontFamily: Fonts.light,
  fontSize: 9,
  lineHeight: 14,
  marginTop: 6,
},

  rightColumnSpacer: {
    height: 18,
  },

  outputArea: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

outputField: {
  position: "relative" as const,
  minHeight: 105,
  marginTop: 14,
},

affirmationArea: {
  paddingVertical: 8,
  paddingRight: 18,
},

affirmationText: {
  color: Colors.white,
  fontFamily: Fonts.light,
  fontSize: 16,
  lineHeight: 25,
  fontStyle: "italic" as const,
},

symbolField: {
  flexDirection: "row" as const,
  flexWrap: "wrap" as const,
  alignItems: "center" as const,
  gap: 16,
  marginTop: 20,
},

symbolArtifact: {
  width: 34,
  height: 34,
  alignItems: "center" as const,
  justifyContent: "center" as const,
},

artifactSymbol: {
  color: Colors.white,
  fontFamily: Fonts.light,
  fontSize: 23,
  lineHeight: 28,
  opacity: 0.72,
},

otherSymbol: {
  opacity: 0.32,
},


symbolArtifactTitle: {
  marginTop: 7,
  color: Colors.subtleText,
  fontFamily: Fonts.light,
  fontSize: 7,
  letterSpacing: 0.8,
  textTransform: "uppercase" as const,
  textAlign: "center" as const,
},

artifactReader: {
  position: "absolute" as const,
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  padding: 24,
  paddingTop: 34,
  backgroundColor: Colors.background,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
  zIndex: 50,
},

artifactReaderClose: {
  position: "absolute" as const,
  right: 8,
  top: 4,
  width: 36,
  height: 36,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  zIndex: 60,
},

artifactReaderCloseText: {
  color: Colors.white,
  fontSize: 28,
  lineHeight: 32,
  fontFamily: Fonts.light,
},

artifactReaderType: {
  color: Colors.subtleText,
  fontFamily: Fonts.light,
  fontSize: 7,
  letterSpacing: 1.4,
  textTransform: "uppercase" as const,
},

artifactReaderTitle: {
  marginTop: 10,
  color: Colors.white,
  fontFamily: Fonts.light,
  fontSize: 15,
  lineHeight: 21,
},

artifactReaderContent: {
  marginTop: 18,
  color: Colors.mutedText,
  fontFamily: Fonts.light,
  fontSize: 10,
  lineHeight: 17,
},

artifactDelete: {
  position: "absolute" as const,
  left: 20,
  bottom: 16,
},

artifactDeleteText: {
  color: Colors.subtleText,
  fontFamily: Fonts.light,
  fontSize: 7,
  letterSpacing: 1.2,
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
  marginLeft: 26,
  paddingVertical: 5,
  paddingHorizontal: 9,
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
  marginTop: 15,
  paddingTop: 15,
  paddingBottom: 4,
  borderTopWidth: 1,
  borderTopColor: "rgba(255,255,255,0.05)",
},

patternReflectionLabel: {
  color: Colors.mutedText,
  fontFamily: Fonts.light,
  fontSize: 7,
  letterSpacing: 1.2,
  marginBottom: 4,
},

patternReflectionText: {
  color: "#A8A49D",
  fontFamily: Fonts.light,
  fontSize: 9,
  lineHeight: 13,
},
};

export { SovereignIConsole };
