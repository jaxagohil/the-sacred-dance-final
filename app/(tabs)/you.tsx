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

import {
  Colors,
} from "../../constants/theme";

import { t } from "../../lib/i18n/t";

const guideColors = {
  guide_heart:
    Colors.pink,

  guide_structure:
    Colors.blue,

  guide_cosmic:
    Colors.white,
};

const WORDS = [
  {
    key: "felt_seen",
    labelKey: "felt_seen",
  },

  {
    key: "felt_safe",
    labelKey: "felt_safe",
  },

  {
    key: "felt_alone",
    labelKey: "felt_alone",
  },

  {
    key: "father_emotionally_present",
    labelKey:
      "father_emotionally_present",
  },

  {
    key: "felt_insecure",
    labelKey: "felt_insecure",
  },

  {
    key: "felt_loved",
    labelKey: "felt_loved",
  },

  {
    key: "mother_emotionally_present",
    labelKey:
      "mother_emotionally_present",
  },

  {
    key: "felt_judged",
    labelKey: "felt_judged",
  },

  {
    key: "dreams_were_heard",
    labelKey: "dreams_were_heard",
  },

  {
    key: "boundaries_respected",
    labelKey:
      "boundaries_respected",
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

  //
  // 👤
  //

  name,

  location,

  language,

  avatar_url:
    safeAvatar || null,

  //
  // ✨ GUIDES
  //

  guide_1_name:
    guideNames.guide_heart,

  guide_2_name:
    guideNames.guide_structure,

  guide_3_name:
    guideNames.guide_cosmic,

  //
  // 🌊 SLIDERS
  //

  givingreceiving:
    sliders.givingreceiving,

  flowstructure:
    sliders.flowstructure,

  lackabundance:
    sliders.abundancelack,

  //
  // 🌿 CHILDHOOD
  //

  childhood_signals:
    {
      ...childhoodSignals,
    },

  //
  // ✨ TEXT
  //

  what_repeats:
    repeats,

  line_that_feels_like_you:
    line,
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
  Colors.background,
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
    ? Colors.white
    : Colors.subtleText,
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
  "rgba(255,255,255,0.015)",
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
  Colors.subtleText,
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

placeholderTextColor={
  Colors.mutedText
}

            style={{
color:
  Colors.white,

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
  Colors.mutedText,

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
            marginBottom: 10,
          }}
        >

          <TextInput
            value={repeats}
            onChangeText={setRepeats}
            placeholder={t("you.whats_repeats_placeholder")}
placeholderTextColor={
  Colors.subtleText
}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={{
color:
  Colors.white,
              minHeight: 70,
              textAlign: "center",
              lineHeight: 22,
              marginBottom: 5,
              backgroundColor:
  "rgba(255,255,255,0.008)",

borderRadius: 16,

paddingHorizontal: 12,

paddingVertical: 10,
            }}
          />

          <TextInput
            value={line}
            onChangeText={setLine}
            placeholder={t("you.line_that_feels_like_you_placeholder")}
placeholderTextColor={
  Colors.subtleText
}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
            style={{
color:
  Colors.white,
              textAlign: "center",
              lineHeight: 22,
              backgroundColor:
  "rgba(255,255,255,0.008)",

borderRadius: 16,

paddingHorizontal: 12,

paddingVertical: 10,
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
            marginBottom: 20,
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
  color:
    guideColors[key],

  fontSize: 14,

  textAlign:
    "center",

  minWidth: 70,

  paddingVertical: 6,

  borderRadius: 12,

  backgroundColor:
    "rgba(255,255,255,0.008)",
}}
            />
          ))}
        </View>

        {/* SLIDERS */}
        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: 10,
          }}
        >

          <Text
            style={{
color:
  Colors.mutedText,
              fontSize: 11,
              textAlign: "center",
              marginBottom: 2,
              letterSpacing: 0.5,
            }}
          >
            {t("you.today_header")}
          </Text>

          {(Object.keys(sliders) as (keyof typeof sliders)[]).map((key) => {

const config = {
  givingreceiving: {
    left: t("you.receiving"),
    right: t("you.giving"),
  },

  flowstructure: {
    left: t("you.flow"),
    right: t("you.structure"),
  },

  abundancelack: {
    left: t("you.abundance"),
    right: t("you.lack"),
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
color:
  Colors.subtleText,
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
                      minimumTrackTintColor="rgba(255,255,255,0.25)"
                      maximumTrackTintColor="rgba(255,255,255,0.12)"
                      thumbTintColor="white"
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
color:
  Colors.mutedText,
              fontSize: 11,
              textAlign: "center",
              marginBottom: 2,
              letterSpacing: 0.5,
            }}
          >
            {t("you.childhood_header")}
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
      ? Colors.gold
      : Colors.mutedText,

  opacity:
    active ? 1 : 0.55,

  fontWeight:
    active ? "500" : "300",

  margin: 6,
}}
                >
                  {t(`you.${word.labelKey}`)}
                </Text>

              );
            })}

          </View>

        </View>

        {/* 🌍 LOCATION / LANGUAGE PICKER */}

{showPicker && (

  <View
    style={{

      position: "absolute",

      left: 0,
      right: 0,
      bottom: 0,

      paddingTop: 28,
      paddingBottom: 42,

      paddingHorizontal: 24,

      backgroundColor:
        "rgba(0,0,0,0.96)",

      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,

      borderTopWidth: 1,

      borderColor:
        "rgba(255,255,255,0.04)",

      zIndex: 50,
    }}
  >

    {/* ✨ TITLE */}

    <Text
      style={{
        color:
          Colors.softText,

        textAlign:
          "center",

        marginBottom: 24,

        fontSize: 13,

        letterSpacing: 1,
      }}
    >
      Location & Language
    </Text>

    {/* 🌍 LOCATION */}

    <TextInput
      value={location}

      onChangeText={
        setLocation
      }

      placeholder="location"

      placeholderTextColor={
        Colors.subtleText
      }

      style={{

        color:
          Colors.white,

        backgroundColor:
          "rgba(255,255,255,0.008)",

        borderRadius: 16,

        paddingHorizontal: 16,
        paddingVertical: 14,

        marginBottom: 12,

        textAlign: "center",
      }}
    />

    {/* 🌐 LANGUAGE */}

    <TextInput
      value={language}

      onChangeText={
        setLanguage
      }

      placeholder="language"

      placeholderTextColor={
        Colors.subtleText
      }

      autoCapitalize="characters"

      style={{

        color:
          Colors.white,

        backgroundColor:
          "rgba(255,255,255,0.008)",

        borderRadius: 16,

        paddingHorizontal: 16,
        paddingVertical: 14,

        marginBottom: 20,

        textAlign: "center",
      }}
    />

    {/* ✨ CLOSE */}

    <TouchableOpacity
      onPress={() =>
        setShowPicker(false)
      }
    >

      <Text
        style={{
          color:
            Colors.mutedText,

          textAlign:
            "center",

          fontSize: 13,
        }}
      >
        close
      </Text>

    </TouchableOpacity>

  </View>

)}

      </TouchableOpacity>

    </View>
  );
}