// app/(tabs)/you.tsx

import Slider from "@react-native-community/slider";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";

import {
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { processReflection } from "../../db/flow";
import { getUserId } from "../../lib/user";
import { supabase } from "../../services/supabase";

const guideColors = {
  guide_heart: "#ff6b9a",
  guide_structure: "#4da6ff",
  guide_cosmic: "#ffffff",
};

const WORDS = [
  {
    key: "felt_seen",
    label: "I felt seen",
  },

  {
    key: "felt_safe",
    label: "I felt safe",
  },

  {
    key: "felt_alone",
    label: "I felt alone",
  },

  {
    key: "father_emotionally_present",
    label:
      "My father was emotionally present",
  },

  {
    key: "felt_insecure",
    label: "I felt insecure",
  },

  {
    key: "felt_loved",
    label: "I felt loved",
  },

  {
    key: "mother_emotionally_present",
    label:
      "My mother was emotionally present",
  },

  {
    key: "felt_judged",
    label: "I felt judged",
  },

  {
    key: "dreams_were_heard",
    label: "My dreams were heard",
  },

  {
    key: "boundaries_respected",
    label:
      "My boundaries were respected",
  },
];

const INITIAL_CHILDHOOD_SIGNALS = {
  felt_seen: 0,
  felt_safe: 0,
  felt_insecure: 0,
  felt_loved: 0,
  felt_judged: 0,
  felt_alone: 0,

  father_emotionally_present: 0,
  mother_emotionally_present: 0,
  dreams_were_heard: 0,
  boundaries_respected: 0,
};

export default function You() {

  //
  // 🌿 STATE
  //

  const [name, setName] =
    useState("");

  const [avatar, setAvatar] =
    useState<string | null>(null);

  const [location, setLocation] =
    useState("India");

  const [language, setLanguage] =
    useState("EN");

  const [repeats, setRepeats] =
    useState("");

  const [line, setLine] =
    useState("");

  const [showPicker, setShowPicker] =
    useState(false);

  const [
  originalProfile,
  setOriginalProfile,
] = useState<any>(null);

  const [
    childhoodSignals,
    setChildhoodSignals,
  ] = useState<
    Record<string, number>
  >(
    INITIAL_CHILDHOOD_SIGNALS
  );

  const [guideNames, setGuideNames] =
    useState({
      guide_heart: "nani",
      guide_structure: "lala",
      guide_cosmic: "ammaarah",
    });

  const [sliders, setSliders] =
    useState({
      givingreceiving: 0,
      flowstructure: 0,
      abundancelack: 0,
    });

  //
  // 🔥 LOAD PROFILE
  //

  useEffect(() => {

    async function loadProfile() {

      const userId =
        await getUserId();

      if (!userId) {

        return;
      }

      const {
        data,
      } = await supabase

        .from("profiles")

        .select("*")

        .eq(
          "user_id",
          userId
        )

        .single();

      if (!data) {

        return;
      }

      setAvatar(
        data.avatar_url ||
        null
      );

      setName(
        data.name || ""
      );

      setLocation(
        data.location ||
        "India"
      );

      setLanguage(
        data.language ||
        "EN"
      );

      setRepeats(
        data.what_repeats ||
        ""
      );

      setLine(
        data.line_that_feels_like_you ||
        ""
      );

      setChildhoodSignals({
        ...INITIAL_CHILDHOOD_SIGNALS,

        ...(data.childhood_signals ||
          {}),
      });

      setSliders({
        givingreceiving:
          data.givingreceiving ??
          0,

        flowstructure:
          data.flowstructure ??
          0,

        abundancelack:
          data.lackabundance ??
          0,
      });

      setGuideNames({
        guide_heart:
          data.guide_1_name ||
          "nani",

        guide_structure:
          data.guide_2_name ||
          "lala",

        guide_cosmic:
          data.guide_3_name ||
          "ammaarah",
      });
    }

    loadProfile();

  }, []);

  //
  // 🖼 PICK IMAGE
  //

  const pickImage =
    async () => {

      try {

        const result =
          await ImagePicker.launchImageLibraryAsync({

            mediaTypes:
              ImagePicker
                .MediaTypeOptions
                .Images,

            quality: 0.7,

            allowsEditing: true,

            aspect: [1, 1],
          });

        if (
          result.canceled
        ) {

          return;
        }

        const image =
          result.assets[0];

        setAvatar(
          image.uri
        );

      } catch (error) {

        console.log(
          "❌ PICK IMAGE ERROR",
          error
        );
      }
    };

  //
  // 🔘 TOGGLE
  //

  const toggleWord = (
    key: string
  ) => {

    setChildhoodSignals(
      (prev) => ({
        ...prev,

        [key]:
          prev[key] === 1
            ? 0
            : 1,
      })
    );
  };

    //
  // 🎨 HAS CHANGES
  //

  const hasChanges =

  name !== (originalProfile?.name || "") ||

  location !== (originalProfile?.location || "India") ||

  language !== (originalProfile?.language || "EN") ||

  repeats !==
    (originalProfile?.what_repeats || "") ||

  line !==
    (originalProfile?.line_that_feels_like_you || "") ||

  avatar !==
    (originalProfile?.avatar_url || null) ||

  JSON.stringify(childhoodSignals) !==
    JSON.stringify(
      originalProfile?.childhood_signals ||
      INITIAL_CHILDHOOD_SIGNALS
    ) ||

  sliders.givingreceiving !==
    (originalProfile?.givingreceiving ?? 0) ||

  sliders.flowstructure !==
    (originalProfile?.flowstructure ?? 0) ||

  sliders.abundancelack !==
    (originalProfile?.lackabundance ?? 0) ||

  guideNames.guide_heart !==
    (originalProfile?.guide_1_name || "nani") ||

  guideNames.guide_structure !==
    (originalProfile?.guide_2_name || "lala") ||

  guideNames.guide_cosmic !==
    (originalProfile?.guide_3_name || "ammaarah");

  //
  // 🎨 SAVE
  //
const handleSave = async () => {

  try {

    const userId =
      await getUserId();

    if (!userId) {

      console.log(
        "❌ No userId"
      );

      return;
    }

    //
    // ✨ SAFE AVATAR
    //

    let safeAvatar =
      avatar;

    //
    // ☁️ UPLOAD AVATAR
    //

    if (
      avatar?.startsWith(
        "file://"
      )
    ) {

      console.log(
        "☁️ Uploading avatar..."
      );

      const response =
        await fetch(
          avatar
        );

      const arrayBuffer =
        await response.arrayBuffer();

      const filePath =
        `${userId}/avatar-${Date.now()}.jpg`;

      const {
        error:
          uploadError,
      } = await supabase

        .storage

        .from(
          "avatars"
        )

        .upload(
          filePath,
          arrayBuffer,
          {
            contentType:
              "image/jpeg",

            upsert: true,
          }
        );

      if (
        uploadError
      ) {

        console.log(
          "❌ AVATAR UPLOAD ERROR",
          uploadError
        );

        return;
      }

      const {
        data:
          publicUrlData,
      } = supabase

        .storage

        .from(
          "avatars"
        )

        .getPublicUrl(
          filePath
        );

      safeAvatar =
        publicUrlData.publicUrl;

      console.log(
        "🌍 FINAL AVATAR:",
        safeAvatar
      );
    }

    //
    // 💾 SAVE PROFILE
    //

    const {
      data,
      error,
    } = await supabase

      .from("profiles")

      .upsert(
        {
          user_id:
            userId,

          name,

          location,

          language,

          avatar_url:
            safeAvatar,

          guide_1_name:
            guideNames.guide_heart,

          guide_2_name:
            guideNames.guide_structure,

          guide_3_name:
            guideNames.guide_cosmic,

          givingreceiving:
            sliders.givingreceiving,

          flowstructure:
            sliders.flowstructure,

          lackabundance:
            sliders.abundancelack,

          childhood_signals:
            childhoodSignals,

          what_repeats:
            repeats,

          line_that_feels_like_you:
            line,
        },

        {
          onConflict:
            "user_id",
        }
      )

      .select();

    if (error) {

      console.log(
        "❌ SUPABASE ERROR:",
        error
      );

      return;
    }

    console.log(
      "✅ PROFILE SAVED:",
      data
    );

     //
    // ✨ PROCESS REFLECTIONS 
    //
    if (
  repeats !==
  (originalProfile?.what_repeats || "")
) {

  await processReflection({
    userId,

    source: "baseline",

    signalDepth: 3,

    text: repeats,
  });

  console.log(
    "✨ Pattern reflection created"
  );
}

if (
  line !==
  (
    originalProfile?.line_that_feels_like_you ||
    ""
  )
) {

  await processReflection({
    userId,

    source: "baseline",

    signalDepth: 4,

    text:
      `Core belief: ${line}`,
  });

  console.log(
    "✨ Line reflection created"
  );
}

if (

  sliders.givingreceiving !==
    (
      originalProfile?.givingreceiving ??
      0
    ) ||

  sliders.flowstructure !==
    (
      originalProfile?.flowstructure ??
      0
    ) ||

  sliders.abundancelack !==
    (
      originalProfile?.lackabundance ??
      0
    )

) {

  await processReflection({
    userId,

    source: "baseline",

    signalDepth: 4,

    energyAxes: {

      givingReceiving:
        (
          sliders.givingreceiving + 1
        ) / 2,

      structureFlow:
        (
          sliders.flowstructure + 1
        ) / 2,

      lackAbundance:
        (
          sliders.abundancelack + 1
        ) / 2,
    },

    pattern:
      repeats || undefined,
  });

  console.log(
    "✨ Energy reflection created"
  );
}

if (

  JSON.stringify(
    childhoodSignals
  ) !==
  JSON.stringify(
    originalProfile?.childhood_signals ||
    INITIAL_CHILDHOOD_SIGNALS
  ) &&

  Object.values(
    childhoodSignals
  ).some((v) => v === 1)

) {

  const selectedSignals =
    WORDS

      .filter(
        (w) =>
          childhoodSignals[
            w.key as keyof typeof childhoodSignals
          ] === 1
      )

      .map(
        (w) => w.label
      )

      .join(", ");

  await processReflection({
    userId,

    source: "baseline",

    signalDepth: 5,

    text:
      selectedSignals,

    childhoodSignals,

    pattern:
      repeats || undefined,
  });

  console.log(
    "✨ Childhood reflection created"
  );
}
    //
    // ✨ UPDATE STATE
    //

    setAvatar(
      safeAvatar ||
      null
    );

    setOriginalProfile({
  name,
  location,
  language,

  avatar_url:
    safeAvatar,

  what_repeats:
    repeats,

  line_that_feels_like_you:
    line,

  childhood_signals:
    childhoodSignals,

  givingreceiving:
    sliders.givingreceiving,

  flowstructure:
    sliders.flowstructure,

  lackabundance:
    sliders.abundancelack,

  guide_1_name:
    guideNames.guide_heart,

  guide_2_name:
    guideNames.guide_structure,

  guide_3_name:
    guideNames.guide_cosmic,
});

  } catch (error) {

    console.log(
      "❌ SAVE ERROR:",
      error
    );
  }
};

  //
  // 🎨 UI
  //

  return (

    <View
      style={{
        flex: 1,
        backgroundColor:
          "black",
      }}
    >

{/* ✦ SAVE */}
<TouchableOpacity
  onPress={handleSave}
  disabled={!hasChanges}
  style={{
    position: "absolute",
    top: 60,
    right: 24,
    zIndex: 10,
  }}
>

  <Text
    style={{
color:
  hasChanges
    ? "white"
    : "#444",
      fontSize: 18,
    }}
  >
    ✦
  </Text>

</TouchableOpacity>

      <TouchableOpacity
        activeOpacity={1}
        onPress={
          Keyboard.dismiss
        }
        style={{
          flex: 1,
        }}
      >

        {/* HEADER */}
        <View
          style={{
            alignItems:
              "center",

            marginTop: 70,

            marginBottom: 30,
          }}
        >

          <TouchableOpacity
            onPress={
              pickImage
            }
          >

            {avatar ? (

              <Image
                source={{
                  uri:
                    avatar,
                }}

                resizeMode="cover"

                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  backgroundColor:
                    "#222",
                }}
              />

            ) : (

              <View
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,

                  backgroundColor:
                    "#222",

                  justifyContent:
                    "center",

                  alignItems:
                    "center",
                }}
              >

                <Text
                  style={{
                    color:
                      "#666",
                  }}
                >
                  +
                </Text>

              </View>

            )}

          </TouchableOpacity>

          <TextInput
            value={name}

            onChangeText={
              setName
            }

            placeholder="your name"

            placeholderTextColor="#555"

            style={{
              color:
                "white",

              fontSize: 16,

              marginTop: 10,

              textAlign:
                "center",
            }}
          />

          <TouchableOpacity
            onPress={() =>
              setShowPicker(
                true
              )
            }
          >

            <Text
              style={{
                color:
                  "#555",

                fontSize: 12,

                marginTop: 4,
              }}
            >
              {location}
              {" • "}
              {language}
            </Text>

          </TouchableOpacity>

        </View>

        {/* TEXT */}
        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: 20,
          }}
        >

          <TextInput
            value={repeats}
            onChangeText={setRepeats}
            placeholder="what repeats"
            placeholderTextColor="rgba(255,255,255,0.25)"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={{
              color: "white",
              minHeight: 70,
              textAlign: "center",
              lineHeight: 22,
              marginBottom: 10,
            }}
          />

          <TextInput
            value={line}
            onChangeText={setLine}
            placeholder="a line that feels like you"
            placeholderTextColor="rgba(255,255,255,0.25)"
            multiline
            numberOfLines={2}
            textAlignVertical="top"
            style={{
              color: "white",
              textAlign: "center",
              lineHeight: 22,
            }}
          />

        </View>

        {/* GUIDES */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 20,
            marginTop: 15,
            marginBottom: 30,
          }}
        >
          {(Object.keys(guideNames) as (keyof typeof guideNames)[]).map((key) => (
            <TextInput
              key={key}
              value={guideNames[key]}
              onChangeText={(text) =>
                setGuideNames((prev) => ({
                  ...prev,
                  [key]: text,
                }))
              }
              style={{
                color: guideColors[key],
                fontSize: 14,
                textAlign: "center",
                minWidth: 70,
              }}
            />
          ))}
        </View>

        {/* SLIDERS */}
        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: 20,
          }}
        >

          <Text
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 11,
              textAlign: "center",
              marginBottom: 2,
              letterSpacing: 0.5,
            }}
          >
            Where are you today?
          </Text>

          {(Object.keys(sliders) as (keyof typeof sliders)[]).map((key) => {

            const config = {
              givingreceiving: {
                left: "receiving",
                right: "giving",
              },

              flowstructure: {
                left: "flow",
                right: "structure",
              },

              abundancelack: {
                left: "abundance",
                right: "lack",
              },
            }[key];

            return (

              <View
                key={key}
                style={{
                  marginBottom: 2,
                }}
              >

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >

                  <Text
                    style={{
                      color: "#666",
                      fontSize: 10,
                    }}
                  >
                    {config.left}
                  </Text>

                  <View
                    style={{
                      flex: 1,
                      transform: [
                        {
                          scaleY: 0.3,
                        },
                      ],
                    }}
                  >

                    <Slider
                      value={sliders[key]}
                      onValueChange={(v) =>
                        setSliders((prev) => ({
                          ...prev,
                          [key]: v,
                        }))
                      }
                      minimumValue={-1}
                      maximumValue={1}
                      step={0.01}
                      minimumTrackTintColor="#555"
                      maximumTrackTintColor="#555"
                      thumbTintColor="#fff"
                    />

                  </View>

                  <Text
                    style={{
                      color: "#666",
                      fontSize: 10,
                    }}
                  >
                    {config.right}
                  </Text>

                </View>

              </View>

            );
          })}

        </View>

        {/* CHILDHOOD */}
        <View
          style={{
            marginBottom: 20,
          }}
        >

          <Text
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 11,
              textAlign: "center",
              marginBottom: 2,
              letterSpacing: 0.5,
            }}
          >
            Childhood Memories
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              marginLeft: 5,
              marginRight: 5,
            }}
          >

            {WORDS.map((word) => {

              const active =
                childhoodSignals[
                  word.key as keyof typeof childhoodSignals
                ] === 1;

              return (

                <Text
                  key={word.key}
                  onPress={() =>
                    toggleWord(word.key)
                  }
                  style={{
                    color:
                      active
                        ? "white"
                        : "#555",

                    margin: 6,
                  }}
                >
                  {word.label}
                </Text>

              );
            })}

          </View>

        </View>

      </TouchableOpacity>

    </View>
  );
}